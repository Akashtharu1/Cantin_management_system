import {
  User,
  MenuItem,
  PickupSlot,
  Order,
  InventoryLog,
  AnalyticsSummary,
  RealtimeEventPayload,
  OrderStatus
} from '../types/index.js';

// Pre-generated high-fidelity local image assets
export const LOCAL_IMAGES = {
  heroBanner: '/src/assets/images/canteen_hero_banner_1794326147312.jpg',
  masalaDosa: '/src/assets/images/masala_dosa_crisp_1794326148769.jpg',
  paneerBiryani: '/src/assets/images/paneer_biryani_pot_1794326149224.jpg',
  samosaChaat: '/src/assets/images/samosa_chaat_bowl_1794326149146.jpg',
};

class CanteenStore {
  public users: User[] = [];
  public menuItems: MenuItem[] = [];
  public pickupSlots: PickupSlot[] = [];
  public orders: Order[] = [];
  public inventoryLogs: InventoryLog[] = [];
  private tokenCounter: number = 101;
  private sseClients: Set<(event: RealtimeEventPayload) => void> = new Set();

  constructor() {
    this.seedUsers();
    this.seedMenu();
    this.seedPickupSlots();
    this.seedInitialOrders();
  }

  // Pre-seed demo personas for instant zero-friction switching
  private seedUsers() {
    this.users = [
      {
        id: 'usr-student-01',
        fullName: 'Aarav Sharma',
        email: '1by23is017@bmsit.in',
        phoneNumber: '+91 98450 12345',
        role: 'STUDENT',
        department: 'Computer Science & Engineering (ISE)',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr-faculty-01',
        fullName: 'Dr. Priya Rao',
        email: 'priyarao@bmsit.in',
        phoneNumber: '+91 94480 67890',
        role: 'FACULTY',
        department: 'Electronics & Communication',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr-kitchen-01',
        fullName: 'Chef Rajesh Kumar',
        email: 'chef.rajesh@bmsit.in',
        phoneNumber: '+91 97310 55443',
        role: 'KITCHEN',
        department: 'BMSIT Canteen Operations',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr-admin-01',
        fullName: 'Suresh Hegde',
        email: 'canteen.manager@bmsit.in',
        phoneNumber: '+91 99000 88776',
        role: 'ADMIN',
        department: 'Campus Facilities & Services',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  private seedMenu() {
    this.menuItems = [
      {
        id: 'menu-1',
        name: 'Crispy Masala Dosa',
        description: 'Golden, paper-crisp fermented rice crepe stuffed with spiced mashed potato bhaji, served with fresh coconut chutney, tomato dip, and hot drumstick sambar.',
        price: 55,
        imageUrl: LOCAL_IMAGES.masalaDosa,
        category: 'Breakfast',
        foodType: 'VEG',
        preparationTime: 7,
        stockQuantity: 80,
        isAvailable: true,
        isFeatured: true,
        rating: 4.9,
      },
      {
        id: 'menu-2',
        name: 'Dum Paneer Biryani Pot',
        description: 'Slow-cooked royal long-grain basmati rice layered with malai paneer cubes, whole fragrant spices, saffron strands, and crispy fried onions, paired with mint boondi raita.',
        price: 110,
        imageUrl: LOCAL_IMAGES.paneerBiryani,
        category: 'Lunch',
        foodType: 'VEG',
        preparationTime: 12,
        stockQuantity: 45,
        isAvailable: true,
        isFeatured: true,
        rating: 4.8,
      },
      {
        id: 'menu-3',
        name: 'Delhi Style Samosa Chaat',
        description: 'Two golden flaky samosas crushed and smothered in spicy Amritsari chole, chilled beaten sweet curd, zesty mint chutney, tangy tamarind drizzle, and crisp sev.',
        price: 45,
        imageUrl: LOCAL_IMAGES.samosaChaat,
        category: 'Snacks',
        foodType: 'VEG',
        preparationTime: 5,
        stockQuantity: 60,
        isAvailable: true,
        isFeatured: true,
        rating: 4.7,
      },
      {
        id: 'menu-4',
        name: 'South Indian Filter Coffee',
        description: 'Authentic chicory-infused decoction frothed with hot creamy milk in traditional brass dabara set. The BMSIT morning booster.',
        price: 20,
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
        category: 'Beverages',
        foodType: 'VEG',
        preparationTime: 3,
        stockQuantity: 150,
        isAvailable: true,
        isFeatured: true,
        rating: 4.9,
      },
      {
        id: 'menu-5',
        name: 'Steamed Idli & Crispy Vada Combo',
        description: 'Two cloud-soft steamed rice idlis and one golden crunchy medu vada served with piping hot homestyle vegetable sambar and freshly ground green chili coconut chutney.',
        price: 50,
        imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        category: 'Breakfast',
        foodType: 'VEG',
        preparationTime: 4,
        stockQuantity: 70,
        isAvailable: true,
        isFeatured: false,
        rating: 4.6,
      },
      {
        id: 'menu-6',
        name: 'BMSIT Executive North Thali',
        description: 'Complete wholesome meal featuring 2 butter phulkas, Paneer Tikka Masala, Dal Tadka, Jeera Pulao, papad, fresh cucumber salad, pickle, and Gulab Jamun.',
        price: 130,
        imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
        category: 'Lunch',
        foodType: 'VEG',
        preparationTime: 10,
        stockQuantity: 50,
        isAvailable: true,
        isFeatured: true,
        rating: 4.8,
      },
      {
        id: 'menu-7',
        name: 'Schezwan Veg Hakka Noodles',
        description: 'Wok-tossed noodles with shredded cabbage, bell peppers, carrots, spring onions, and a fiery homemade Schezwan chili garlic sauce.',
        price: 85,
        imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
        category: 'Lunch',
        foodType: 'VEG',
        preparationTime: 8,
        stockQuantity: 40,
        isAvailable: true,
        isFeatured: false,
        rating: 4.5,
      },
      {
        id: 'menu-8',
        name: 'Crispy Veg Spring Rolls (4 pcs)',
        description: 'Crunchy golden pastry rolls packed with wok-tossed seasoned vegetables and glass noodles, served with sweet chili dip.',
        price: 60,
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        category: 'Snacks',
        foodType: 'VEG',
        preparationTime: 6,
        stockQuantity: 55,
        isAvailable: true,
        isFeatured: false,
        rating: 4.6,
      },
      {
        id: 'menu-9',
        name: 'Spiced Chicken Biryani Box',
        description: 'Tender marinated bone-in chicken thighs cooked in aromatic spices and seasoned basmati rice, accompanied by spicy salan gravy and onion raita.',
        price: 140,
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
        category: 'Lunch',
        foodType: 'NON_VEG',
        preparationTime: 12,
        stockQuantity: 35,
        isAvailable: true,
        isFeatured: true,
        rating: 4.9,
      },
      {
        id: 'menu-10',
        name: 'Crispy Chicken Kathi Roll',
        description: 'Flaky layered Malabar parotta rolled with succulent spiced chicken chunks, crisp sliced red onions, green mint chutney, and chaat masala.',
        price: 90,
        imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
        category: 'Snacks',
        foodType: 'NON_VEG',
        preparationTime: 8,
        stockQuantity: 30,
        isAvailable: true,
        isFeatured: false,
        rating: 4.7,
      },
      {
        id: 'menu-11',
        name: 'Chilled Alphonso Mango Lassi',
        description: 'Rich, thick blended curd with real Ratnagiri Alphonso mango pulp, crushed cardamom, and slivered pistachios.',
        price: 45,
        imageUrl: 'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?w=600&auto=format&fit=crop&q=80',
        category: 'Beverages',
        foodType: 'VEG',
        preparationTime: 3,
        stockQuantity: 65,
        isAvailable: true,
        isFeatured: false,
        rating: 4.8,
      },
      {
        id: 'menu-12',
        name: 'Cold Coffee with Ice Cream',
        description: 'Double shot espresso blended with chilled milk and chocolate syrup, crowned with a scoop of creamy vanilla ice cream.',
        price: 50,
        imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
        category: 'Beverages',
        foodType: 'VEG',
        preparationTime: 4,
        stockQuantity: 80,
        isAvailable: true,
        isFeatured: false,
        rating: 4.7,
      },
    ];
  }

  private seedPickupSlots() {
    this.pickupSlots = [
      {
        id: 'slot-1',
        startTime: '11:45 AM',
        endTime: '12:00 PM',
        displayLabel: '11:45 AM – 12:00 PM',
        capacity: 25,
        reservedCount: 14,
        isActive: true,
      },
      {
        id: 'slot-2',
        startTime: '12:00 PM',
        endTime: '12:15 PM',
        displayLabel: '12:00 PM – 12:15 PM',
        capacity: 30,
        reservedCount: 28,
        isActive: true,
      },
      {
        id: 'slot-3',
        startTime: '12:15 PM',
        endTime: '12:30 PM',
        displayLabel: '12:15 PM – 12:30 PM',
        capacity: 35,
        reservedCount: 19,
        isActive: true,
      },
      {
        id: 'slot-4',
        startTime: '12:30 PM',
        endTime: '12:45 PM',
        displayLabel: '12:30 PM – 12:45 PM',
        capacity: 35,
        reservedCount: 22,
        isActive: true,
      },
      {
        id: 'slot-5',
        startTime: '12:45 PM',
        endTime: '01:00 PM',
        displayLabel: '12:45 PM – 01:00 PM',
        capacity: 30,
        reservedCount: 16,
        isActive: true,
      },
      {
        id: 'slot-6',
        startTime: '01:00 PM',
        endTime: '01:15 PM',
        displayLabel: '01:00 PM – 01:15 PM',
        capacity: 25,
        reservedCount: 9,
        isActive: true,
      },
      {
        id: 'slot-7',
        startTime: '01:15 PM',
        endTime: '01:30 PM',
        displayLabel: '01:15 PM – 01:30 PM',
        capacity: 25,
        reservedCount: 6,
        isActive: true,
      },
    ];
  }

  private seedInitialOrders() {
    const now = new Date();
    
    // Seed initial orders in different realistic states
    this.orders = [
      {
        id: 'ord-101',
        userId: 'usr-student-01',
        customerName: 'Aarav Sharma',
        customerEmail: '1by23is017@bmsit.in',
        customerPhone: '+91 98450 12345',
        tokenNumber: 'C098',
        pickupSlotId: 'slot-2',
        pickupSlotLabel: '12:00 PM – 12:15 PM',
        subtotal: 165,
        tax: 8.25,
        totalAmount: 173.25,
        paymentStatus: 'COMPLETED',
        orderStatus: 'DELIVERED',
        paymentMethod: 'UPI_QR',
        transactionId: 'UPI-BMSIT-987123',
        customerNotes: 'Extra coconut chutney please',
        items: [
          {
            id: 'item-1',
            menuItemId: 'menu-1',
            name: 'Crispy Masala Dosa',
            quantity: 2,
            unitPrice: 55,
            subtotal: 110,
            foodType: 'VEG',
          },
          {
            id: 'item-2',
            menuItemId: 'menu-11',
            name: 'Chilled Alphonso Mango Lassi',
            quantity: 1,
            unitPrice: 45,
            subtotal: 45,
            foodType: 'VEG',
          },
        ],
        createdAt: new Date(now.getTime() - 40 * 60000).toISOString(),
        updatedAt: new Date(now.getTime() - 10 * 60000).toISOString(),
      },
      {
        id: 'ord-102',
        userId: 'usr-faculty-01',
        customerName: 'Dr. Priya Rao',
        customerEmail: 'priyarao@bmsit.in',
        customerPhone: '+91 94480 67890',
        tokenNumber: 'C099',
        pickupSlotId: 'slot-3',
        pickupSlotLabel: '12:15 PM – 12:30 PM',
        subtotal: 150,
        tax: 7.5,
        totalAmount: 157.5,
        paymentStatus: 'COMPLETED',
        orderStatus: 'READY',
        paymentMethod: 'UPI_QR',
        transactionId: 'UPI-BMSIT-987124',
        customerNotes: 'Faculty lounge pickup',
        items: [
          {
            id: 'item-3',
            menuItemId: 'menu-6',
            name: 'BMSIT Executive North Thali',
            quantity: 1,
            unitPrice: 130,
            subtotal: 130,
            foodType: 'VEG',
          },
          {
            id: 'item-4',
            menuItemId: 'menu-4',
            name: 'South Indian Filter Coffee',
            quantity: 1,
            unitPrice: 20,
            subtotal: 20,
            foodType: 'VEG',
          },
        ],
        createdAt: new Date(now.getTime() - 25 * 60000).toISOString(),
        updatedAt: new Date(now.getTime() - 5 * 60000).toISOString(),
      },
      {
        id: 'ord-103',
        userId: 'usr-student-02',
        customerName: 'Rohan Deshmukh',
        customerEmail: '1by23ec045@bmsit.in',
        customerPhone: '+91 98860 44221',
        tokenNumber: 'C100',
        pickupSlotId: 'slot-3',
        pickupSlotLabel: '12:15 PM – 12:30 PM',
        subtotal: 110,
        tax: 5.5,
        totalAmount: 115.5,
        paymentStatus: 'COMPLETED',
        orderStatus: 'PREPARING',
        paymentMethod: 'UPI_QR',
        transactionId: 'UPI-BMSIT-987125',
        customerNotes: 'Less spicy biryani',
        items: [
          {
            id: 'item-5',
            menuItemId: 'menu-2',
            name: 'Dum Paneer Biryani Pot',
            quantity: 1,
            unitPrice: 110,
            subtotal: 110,
            foodType: 'VEG',
          },
        ],
        createdAt: new Date(now.getTime() - 15 * 60000).toISOString(),
        updatedAt: new Date(now.getTime() - 10 * 60000).toISOString(),
      },
      {
        id: 'ord-104',
        userId: 'usr-student-03',
        customerName: 'Ananya Iyer',
        customerEmail: '1by23me012@bmsit.in',
        customerPhone: '+91 99160 33445',
        tokenNumber: 'C101',
        pickupSlotId: 'slot-4',
        pickupSlotLabel: '12:30 PM – 12:45 PM',
        subtotal: 95,
        tax: 4.75,
        totalAmount: 99.75,
        paymentStatus: 'COMPLETED',
        orderStatus: 'RECEIVED',
        paymentMethod: 'UPI_QR',
        transactionId: 'UPI-BMSIT-987126',
        items: [
          {
            id: 'item-6',
            menuItemId: 'menu-3',
            name: 'Delhi Style Samosa Chaat',
            quantity: 1,
            unitPrice: 45,
            subtotal: 45,
            foodType: 'VEG',
          },
          {
            id: 'item-7',
            menuItemId: 'menu-12',
            name: 'Cold Coffee with Ice Cream',
            quantity: 1,
            unitPrice: 50,
            subtotal: 50,
            foodType: 'VEG',
          },
        ],
        createdAt: new Date(now.getTime() - 5 * 60000).toISOString(),
        updatedAt: new Date(now.getTime() - 5 * 60000).toISOString(),
      },
    ];

    this.tokenCounter = 102;
  }

  // Token Generation Engine (Sequential Daily Tokens C101 -> C102 -> C103)
  public generateNextToken(): string {
    const token = `C${this.tokenCounter}`;
    this.tokenCounter += 1;
    return token;
  }

  // Real-time Event Subscription (SSE)
  public subscribeEvents(clientCallback: (event: RealtimeEventPayload) => void): () => void {
    this.sseClients.add(clientCallback);
    return () => {
      this.sseClients.delete(clientCallback);
    };
  }

  public broadcast(type: RealtimeEventPayload['type'], data: any) {
    const payload: RealtimeEventPayload = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };
    for (const client of this.sseClients) {
      try {
        client(payload);
      } catch (err) {
        console.error('Error dispatching event to SSE client:', err);
      }
    }
  }

  // Order Operations
  public createOrder(orderData: Partial<Order>): Order {
    const slot = this.pickupSlots.find(s => s.id === orderData.pickupSlotId);
    if (slot && slot.reservedCount >= slot.capacity) {
      throw new Error(`Pickup slot ${slot.displayLabel} is currently fully booked. Please select another time window.`);
    }

    const tokenNumber = this.generateNextToken();
    const id = `ord-${Date.now()}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id,
      userId: orderData.userId || 'guest-user',
      customerName: orderData.customerName || 'BMSIT Patron',
      customerEmail: orderData.customerEmail || 'student@bmsit.in',
      customerPhone: orderData.customerPhone || '',
      tokenNumber,
      pickupSlotId: orderData.pickupSlotId || 'slot-3',
      pickupSlotLabel: slot ? slot.displayLabel : '12:15 PM – 12:30 PM',
      subtotal: orderData.subtotal || 0,
      tax: orderData.tax || Number(((orderData.subtotal || 0) * 0.05).toFixed(2)),
      totalAmount: orderData.totalAmount || 0,
      paymentStatus: 'COMPLETED',
      orderStatus: 'RECEIVED',
      items: orderData.items || [],
      customerNotes: orderData.customerNotes || '',
      paymentMethod: orderData.paymentMethod || 'UPI_QR',
      transactionId: orderData.transactionId || `UPI-BMSIT-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: now,
      updatedAt: now,
    };

    // Increment slot reservation
    if (slot) {
      slot.reservedCount += 1;
      this.broadcast('slot:updated', slot);
    }

    // Deduct stock and log inventory
    for (const item of newOrder.items) {
      const menuItem = this.menuItems.find(m => m.id === item.menuItemId);
      if (menuItem) {
        menuItem.stockQuantity = Math.max(0, menuItem.stockQuantity - item.quantity);
        this.inventoryLogs.unshift({
          id: `inv-${Date.now()}-${Math.random()}`,
          menuItemId: menuItem.id,
          menuItemName: menuItem.name,
          changeType: 'DEDUCTION',
          quantityChanged: -item.quantity,
          reason: `Order ${tokenNumber} fulfilled`,
          createdAt: now,
        });
      }
    }

    this.orders.unshift(newOrder);
    this.broadcast('order:created', newOrder);
    this.broadcast('token:generated', { tokenNumber, orderId: id, pickupSlot: newOrder.pickupSlotLabel });

    return newOrder;
  }

  public updateOrderStatus(orderId: string, newStatus: OrderStatus): Order {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found.`);
    }

    order.orderStatus = newStatus;
    order.updatedAt = new Date().toISOString();

    this.broadcast('order:status_updated', {
      orderId: order.id,
      tokenNumber: order.tokenNumber,
      orderStatus: newStatus,
      updatedAt: order.updatedAt,
      customerName: order.customerName,
    });

    return order;
  }

  // Menu Operations
  public toggleMenuAvailability(id: string): MenuItem {
    const item = this.menuItems.find(m => m.id === id);
    if (!item) throw new Error('Item not found');
    item.isAvailable = !item.isAvailable;
    item.updatedAt = new Date().toISOString();
    this.broadcast('menu:updated', item);
    return item;
  }

  public updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem {
    const item = this.menuItems.find(m => m.id === id);
    if (!item) throw new Error('Item not found');
    Object.assign(item, updates);
    item.updatedAt = new Date().toISOString();
    this.broadcast('menu:updated', item);
    return item;
  }

  public addMenuItem(itemData: Omit<MenuItem, 'id'>): MenuItem {
    const newItem: MenuItem = {
      ...itemData,
      id: `menu-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.menuItems.push(newItem);
    this.broadcast('menu:updated', newItem);
    return newItem;
  }

  public deleteMenuItem(id: string): boolean {
    const idx = this.menuItems.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.menuItems.splice(idx, 1);
      this.broadcast('menu:updated', { id, deleted: true });
      return true;
    }
    return false;
  }

  // Analytics Computation
  public getAnalytics(): AnalyticsSummary {
    const totalOrders = this.orders.length;
    let todayRevenue = 0;
    let pendingOrders = 0;
    let completedOrders = 0;

    const dishCounts: Record<string, { orders: number; revenue: number; category: string }> = {};
    const categoryTotals: Record<string, { value: number; count: number }> = {
      Breakfast: { value: 0, count: 0 },
      Lunch: { value: 0, count: 0 },
      Snacks: { value: 0, count: 0 },
      Beverages: { value: 0, count: 0 },
      Specials: { value: 0, count: 0 },
    };

    for (const order of this.orders) {
      todayRevenue += order.totalAmount;
      if (order.orderStatus === 'DELIVERED') {
        completedOrders += 1;
      } else if (order.orderStatus !== 'CANCELLED') {
        pendingOrders += 1;
      }

      for (const item of order.items) {
        if (!dishCounts[item.name]) {
          const menuItem = this.menuItems.find(m => m.name === item.name);
          dishCounts[item.name] = {
            orders: 0,
            revenue: 0,
            category: menuItem ? menuItem.category : 'General',
          };
        }
        dishCounts[item.name].orders += item.quantity;
        dishCounts[item.name].revenue += item.subtotal;

        const cat = dishCounts[item.name].category;
        if (categoryTotals[cat]) {
          categoryTotals[cat].value += item.subtotal;
          categoryTotals[cat].count += item.quantity;
        }
      }
    }

    const topDishes = Object.entries(dishCounts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    const categoryBreakdown = Object.entries(categoryTotals).map(([category, data]) => ({
      category,
      value: Math.round(data.value),
      count: data.count,
    }));

    // Realistic hourly trends for college canteen peak hours (9 AM - 4 PM)
    const hourlyTrends = [
      { hour: '09:00 AM', count: 12, revenue: 660 },
      { hour: '10:00 AM', count: 24, revenue: 1420 },
      { hour: '11:00 AM', count: 18, revenue: 980 },
      { hour: '12:00 PM', count: 52, revenue: 4160 },
      { hour: '01:00 PM', count: 68, revenue: 5820 },
      { hour: '02:00 PM', count: 35, revenue: 2310 },
      { hour: '03:00 PM', count: 28, revenue: 1680 },
      { hour: '04:00 PM', count: 15, revenue: 750 },
    ];

    const dailyRevenue = [
      { date: 'Nov 04', revenue: 12450, orders: 142 },
      { date: 'Nov 05', revenue: 13890, orders: 158 },
      { date: 'Nov 06', revenue: 15120, orders: 174 },
      { date: 'Nov 07', revenue: 14800, orders: 165 },
      { date: 'Nov 08', revenue: 16450, orders: 189 },
      { date: 'Nov 09', revenue: 11200, orders: 130 },
      { date: 'Today', revenue: Math.round(todayRevenue) + 14200, orders: totalOrders + 160 },
    ];

    return {
      totalOrders: totalOrders + 160,
      todayRevenue: Math.round(todayRevenue) + 14200,
      monthlyRevenue: 384500,
      pendingOrders,
      completedOrders: completedOrders + 155,
      hourlyTrends,
      categoryBreakdown,
      topDishes: topDishes.length > 0 ? topDishes : [
        { name: 'Crispy Masala Dosa', orders: 94, revenue: 5170, category: 'Breakfast' },
        { name: 'Dum Paneer Biryani Pot', orders: 78, revenue: 8580, category: 'Lunch' },
        { name: 'Delhi Style Samosa Chaat', orders: 65, revenue: 2925, category: 'Snacks' },
        { name: 'South Indian Filter Coffee', orders: 142, revenue: 2840, category: 'Beverages' },
      ],
      dailyRevenue,
    };
  }
}

export const canteenStore = new CanteenStore();
