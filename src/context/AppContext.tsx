import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  MenuItem,
  PickupSlot,
  Order,
  CartItem,
  RealtimeEventPayload,
  OrderStatus
} from '../types';
import { ApiService } from '../services/api';
import { audioService } from '../utils/audio';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  personas: User[];
  selectPersona: (persona: User) => void;

  // View Navigation
  currentView: 'home' | 'menu' | 'track' | 'kds' | 'public' | 'admin' | 'history';
  setCurrentView: (view: 'home' | 'menu' | 'track' | 'kds' | 'public' | 'admin' | 'history') => void;

  // Menu & Slots
  menuItems: MenuItem[];
  isLoadingMenu: boolean;
  refreshMenu: () => Promise<void>;
  pickupSlots: PickupSlot[];
  selectedSlot: PickupSlot | null;
  setSelectedSlot: (slot: PickupSlot | null) => void;
  refreshSlots: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Orders & Real-time
  orders: Order[];
  myOrders: Order[];
  activeTrackedOrder: Order | null;
  setActiveTrackedOrder: (order: Order | null) => void;
  refreshOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;

  // Settings
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  id: 'usr-student-01',
  fullName: 'Aarav Sharma',
  email: '1by23is017@bmsit.in',
  role: 'STUDENT',
  department: 'Computer Science & Engineering',
  phoneNumber: '+91 98450 12345',
  createdAt: new Date().toISOString(),
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USER);
  const [activeRole, setActiveRole] = useState<UserRole>('STUDENT');
  const [personas, setPersonas] = useState<User[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'menu' | 'track' | 'kds' | 'public' | 'admin' | 'history'>('home');

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState<boolean>(true);
  const [pickupSlots, setPickupSlots] = useState<PickupSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<PickupSlot | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bmsit_canteen_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTrackedOrder, setActiveTrackedOrder] = useState<Order | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bmsit_canteen_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Cart persistence error:', e);
    }
  }, [cart]);

  // Load initial data
  const refreshMenu = async () => {
    try {
      setIsLoadingMenu(true);
      const items = await ApiService.getMenu();
      setMenuItems(items);
    } catch (err) {
      console.error('Failed to load menu:', err);
    } finally {
      setIsLoadingMenu(false);
    }
  };

  const refreshSlots = async () => {
    try {
      const slots = await ApiService.getSlots();
      setPickupSlots(slots);
      // Auto select first available slot if none selected
      if (!selectedSlot && slots.length > 0) {
        const available = slots.find(s => s.reservedCount < s.capacity) || slots[0];
        setSelectedSlot(available);
      }
    } catch (err) {
      console.error('Failed to load slots:', err);
    }
  };

  const refreshOrders = async () => {
    try {
      const allOrders = await ApiService.getOrders();
      setOrders(allOrders);
      // If we have an active tracked order, keep it synced
      if (activeTrackedOrder) {
        const updated = allOrders.find(o => o.id === activeTrackedOrder.id);
        if (updated) setActiveTrackedOrder(updated);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  useEffect(() => {
    refreshMenu();
    refreshSlots();
    refreshOrders();

    ApiService.getPersonas()
      .then(p => {
        setPersonas(p);
        if (p.length > 0) {
          setCurrentUser(p[0]);
          setActiveRole(p[0].role);
        }
      })
      .catch(console.error);
  }, []);

  // Real-time Event Stream Listener
  useEffect(() => {
    const unsubscribe = ApiService.subscribeToEvents((event: RealtimeEventPayload) => {
      if (event.type === 'order:created') {
        const newOrder: Order = event.data;
        setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
        if (soundEnabled) {
          audioService.playNewOrderDing();
        }
        showToast(`New Order ${newOrder.tokenNumber} placed for ${newOrder.pickupSlotLabel}!`);
      } else if (event.type === 'order:status_updated') {
        const { orderId, orderStatus, tokenNumber } = event.data;
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, orderStatus, updatedAt: event.timestamp } : o))
        );

        setActiveTrackedOrder(prev => {
          if (prev && prev.id === orderId) {
            return { ...prev, orderStatus, updatedAt: event.timestamp };
          }
          return prev;
        });

        if (orderStatus === 'READY') {
          if (soundEnabled) {
            audioService.playOrderReadyChime();
          }
          showToast(`🔔 Token ${tokenNumber} is READY for pickup at the counter!`);
        } else if (orderStatus === 'PREPARING') {
          showToast(`👨‍🍳 Token ${tokenNumber} is now being prepared in the kitchen.`);
        }
      } else if (event.type === 'slot:updated') {
        const updatedSlot: PickupSlot = event.data;
        setPickupSlots(prev => prev.map(s => (s.id === updatedSlot.id ? updatedSlot : s)));
      } else if (event.type === 'menu:updated') {
        refreshMenu();
      }
    });

    return () => unsubscribe();
  }, [soundEnabled, activeTrackedOrder]);

  // Persona switching
  const selectPersona = (persona: User) => {
    setCurrentUser(persona);
    setActiveRole(persona.role);
    if (persona.role === 'KITCHEN') {
      setCurrentView('kds');
    } else if (persona.role === 'ADMIN') {
      setCurrentView('admin');
    } else {
      setCurrentView('home');
    }
    showToast(`Switched to ${persona.fullName} (${persona.role})`);
  };

  // Cart operations
  const addToCart = (item: MenuItem) => {
    if (!item.isAvailable || item.stockQuantity <= 0) {
      showToast(`${item.name} is currently out of stock`);
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.menuItem.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
    showToast(`Added ${item.name} to cart`);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(i => {
          if (i.menuItem.id === itemId) {
            const newQ = i.quantity + delta;
            return newQ > 0 ? { ...i, quantity: newQ } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const cartTax = Number((cartSubtotal * 0.05).toFixed(2)); // 5% GST
  const cartTotal = Number((cartSubtotal + cartTax).toFixed(2));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const myOrders = orders.filter(o => o.userId === currentUser.id);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updated = await ApiService.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
    } catch (err: any) {
      showToast(err.message || 'Failed to update order');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeRole,
        setActiveRole,
        personas,
        selectPersona,
        currentView,
        setCurrentView,
        menuItems,
        isLoadingMenu,
        refreshMenu,
        pickupSlots,
        selectedSlot,
        setSelectedSlot,
        refreshSlots,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartTax,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        orders,
        myOrders,
        activeTrackedOrder,
        setActiveTrackedOrder,
        refreshOrders,
        updateOrderStatus,
        soundEnabled,
        setSoundEnabled,
        isDarkMode,
        toggleDarkMode,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
