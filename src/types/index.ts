export type UserRole = 'STUDENT' | 'FACULTY' | 'KITCHEN' | 'ADMIN';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  department?: string;
  createdAt: string;
}

export type FoodType = 'VEG' | 'NON_VEG';

export type FoodCategory = 'Breakfast' | 'Lunch' | 'Snacks' | 'Beverages' | 'Specials';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: FoodCategory;
  foodType: FoodType;
  preparationTime: number; // in minutes
  stockQuantity: number;
  isAvailable: boolean;
  isFeatured?: boolean;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PickupSlot {
  id: string;
  startTime: string;
  endTime: string;
  displayLabel: string;
  capacity: number;
  reservedCount: number;
  isActive: boolean;
}

export type OrderStatus = 'RECEIVED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface OrderItem {
  id: string;
  orderId?: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  foodType: FoodType;
  imageUrl?: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  tokenNumber: string;
  pickupSlotId: string;
  pickupSlotLabel: string;
  subtotal: number;
  tax: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: OrderItem[];
  customerNotes?: string;
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  paymentGateway: 'UPI_QR' | 'RAZORPAY_SANDBOX';
  transactionId: string;
  amount: number;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  createdAt: string;
}

export interface InventoryLog {
  id: string;
  menuItemId: string;
  menuItemName: string;
  changeType: 'RESTOCK' | 'DEDUCTION' | 'ADJUSTMENT';
  quantityChanged: number;
  reason: string;
  createdAt: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface AnalyticsSummary {
  totalOrders: number;
  todayRevenue: number;
  monthlyRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  hourlyTrends: { hour: string; count: number; revenue: number }[];
  categoryBreakdown: { category: string; value: number; count: number }[];
  topDishes: { name: string; orders: number; revenue: number; category: string }[];
  dailyRevenue: { date: string; revenue: number; orders: number }[];
}

export interface RealtimeEventPayload {
  type: 'order:created' | 'order:status_updated' | 'slot:updated' | 'menu:updated' | 'token:generated';
  data: any;
  timestamp: string;
}
