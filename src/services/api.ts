import {
  MenuItem,
  PickupSlot,
  Order,
  User,
  AnalyticsSummary,
  RealtimeEventPayload,
  OrderStatus
} from '../types';

export class ApiService {
  private static baseUrl = '/api';

  // Real-time SSE event subscription
  public static subscribeToEvents(onEvent: (payload: RealtimeEventPayload) => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const eventSource = new EventSource(`${this.baseUrl}/events/stream`);

    eventSource.onmessage = (event) => {
      try {
        const payload: RealtimeEventPayload = JSON.parse(event.data);
        if (payload.type) {
          onEvent(payload);
        }
      } catch (err) {
        // Ping or parse failure
      }
    };

    eventSource.onerror = (err) => {
      console.warn('SSE connection interrupted, browser will auto-reconnect', err);
    };

    return () => {
      eventSource.close();
    };
  }

  // --- AUTH ---
  public static async getPersonas(): Promise<User[]> {
    const res = await fetch(`${this.baseUrl}/auth/personas`);
    const data = await res.json();
    return data.data;
  }

  public static async login(email: string, fullName?: string, role?: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, fullName, role }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Login failed');
    return { user: data.data, token: data.token };
  }

  public static async register(userData: Partial<User>): Promise<{ user: User; token: string }> {
    const res = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Registration failed');
    return { user: data.data, token: data.token };
  }

  // --- MENU ---
  public static async getMenu(): Promise<MenuItem[]> {
    const res = await fetch(`${this.baseUrl}/menu`);
    const data = await res.json();
    return data.data;
  }

  public static async toggleAvailability(id: string): Promise<MenuItem> {
    const res = await fetch(`${this.baseUrl}/menu/${id}/availability`, { method: 'PATCH' });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  public static async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch(`${this.baseUrl}/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  public static async addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const res = await fetch(`${this.baseUrl}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  public static async deleteMenuItem(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/menu/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  }

  // --- SLOTS ---
  public static async getSlots(): Promise<PickupSlot[]> {
    const res = await fetch(`${this.baseUrl}/slots`);
    const data = await res.json();
    return data.data;
  }

  // --- ORDERS ---
  public static async getOrders(params?: { status?: string; userId?: string }): Promise<Order[]> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${this.baseUrl}/orders?${query}`);
    const data = await res.json();
    return data.data;
  }

  public static async getMyOrders(userId: string): Promise<Order[]> {
    const res = await fetch(`${this.baseUrl}/orders/my-orders?userId=${encodeURIComponent(userId)}`);
    const data = await res.json();
    return data.data;
  }

  public static async createOrder(orderPayload: Partial<Order>): Promise<Order> {
    const res = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to place order');
    return data.data;
  }

  public static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const res = await fetch(`${this.baseUrl}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to update order status');
    return data.data;
  }

  // --- PAYMENTS ---
  public static async createUpiPayment(amount: number, orderRef: string) {
    const res = await fetch(`${this.baseUrl}/payments/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, orderRef }),
    });
    const data = await res.json();
    return data.data;
  }

  public static async verifyPayment(transactionId: string) {
    const res = await fetch(`${this.baseUrl}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId }),
    });
    const data = await res.json();
    return data;
  }

  // --- ADMIN & INVENTORY ---
  public static async getAdminDashboard(): Promise<AnalyticsSummary> {
    const res = await fetch(`${this.baseUrl}/admin/dashboard`);
    const data = await res.json();
    return data.data;
  }

  public static async getInventoryData() {
    const res = await fetch(`${this.baseUrl}/admin/inventory`);
    const data = await res.json();
    return data.data;
  }
}
