import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { canteenStore } from './src/server/store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json());

  // SSE Real-Time Event Stream
  app.get('/api/events/stream', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    // Initial ping
    res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`);

    const unsubscribe = canteenStore.subscribeEvents((event) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    });

    const keepAlive = setInterval(() => {
      res.write(': keep-alive\n\n');
    }, 20000);

    req.on('close', () => {
      clearInterval(keepAlive);
      unsubscribe();
    });
  });

  // --- AUTHENTICATION & DEMO PERSONAS ---
  app.get('/api/auth/personas', (_req: Request, res: Response) => {
    res.json({ success: true, data: canteenStore.users });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email } = req.body;
    const user = canteenStore.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user) {
      // Auto-register student if new BMSIT email provided
      const newUser = {
        id: `usr-${Date.now()}`,
        fullName: req.body.fullName || email.split('@')[0],
        email,
        role: (req.body.role || 'STUDENT') as any,
        department: req.body.department || 'BMSIT Department',
        phoneNumber: req.body.phoneNumber || '+91 98000 00000',
        createdAt: new Date().toISOString(),
      };
      canteenStore.users.push(newUser);
      return res.json({ success: true, data: newUser, token: `jwt-bmsit-${newUser.id}` });
    }
    return res.json({ success: true, data: user, token: `jwt-bmsit-${user.id}` });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { fullName, email, role, department, phoneNumber } = req.body;
    if (!fullName || !email) {
      return res.status(400).json({ success: false, error: 'Full name and email are required.' });
    }
    const existing = canteenStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.json({ success: true, data: existing, token: `jwt-bmsit-${existing.id}` });
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      fullName,
      email,
      role: (role || 'STUDENT') as any,
      department: department || 'BMSIT Campus',
      phoneNumber: phoneNumber || '+91 98000 00000',
      createdAt: new Date().toISOString(),
    };
    canteenStore.users.push(newUser);
    return res.status(201).json({ success: true, data: newUser, token: `jwt-bmsit-${newUser.id}` });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json({ success: true, data: canteenStore.users[0] });
    }
    const userId = authHeader.replace('Bearer jwt-bmsit-', '');
    const user = canteenStore.users.find(u => u.id === userId) || canteenStore.users[0];
    res.json({ success: true, data: user });
  });

  // --- MENU ITEMS ---
  app.get('/api/menu', (_req: Request, res: Response) => {
    res.json({ success: true, data: canteenStore.menuItems });
  });

  app.get('/api/menu/:id', (req: Request, res: Response) => {
    const item = canteenStore.menuItems.find(m => m.id === req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Item not found' });
    res.json({ success: true, data: item });
  });

  app.post('/api/menu', (req: Request, res: Response) => {
    try {
      const item = canteenStore.addMenuItem(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  });

  app.put('/api/menu/:id', (req: Request, res: Response) => {
    try {
      const item = canteenStore.updateMenuItem(req.params.id, req.body);
      res.json({ success: true, data: item });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  });

  app.delete('/api/menu/:id', (req: Request, res: Response) => {
    const deleted = canteenStore.deleteMenuItem(req.params.id);
    if (deleted) res.json({ success: true, message: 'Item deleted' });
    else res.status(404).json({ success: false, error: 'Item not found' });
  });

  app.patch('/api/menu/:id/availability', (req: Request, res: Response) => {
    try {
      const item = canteenStore.toggleMenuAvailability(req.params.id);
      res.json({ success: true, data: item });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  });

  // --- PICKUP SLOTS ---
  app.get('/api/slots', (_req: Request, res: Response) => {
    res.json({ success: true, data: canteenStore.pickupSlots });
  });

  app.get('/api/slots/availability', (_req: Request, res: Response) => {
    const availability = canteenStore.pickupSlots.map(s => ({
      id: s.id,
      displayLabel: s.displayLabel,
      capacity: s.capacity,
      reservedCount: s.reservedCount,
      availableSlots: Math.max(0, s.capacity - s.reservedCount),
      isAvailable: s.reservedCount < s.capacity,
    }));
    res.json({ success: true, data: availability });
  });

  // --- ORDERS & TOKENS ---
  app.get('/api/orders', (req: Request, res: Response) => {
    const { status, role, userId } = req.query;
    let orders = [...canteenStore.orders];

    if (userId && typeof userId === 'string') {
      orders = orders.filter(o => o.userId === userId);
    }
    if (status && typeof status === 'string') {
      orders = orders.filter(o => o.orderStatus === status);
    }

    res.json({ success: true, data: orders });
  });

  app.get('/api/orders/my-orders', (req: Request, res: Response) => {
    const userId = (req.query.userId as string) || 'usr-student-01';
    const myOrders = canteenStore.orders.filter(o => o.userId === userId);
    res.json({ success: true, data: myOrders });
  });

  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const order = canteenStore.orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({ success: true, data: order });
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    try {
      const order = canteenStore.createOrder(req.body);
      res.status(201).json({ success: true, data: order });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  });

  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, error: 'Status is required' });
    try {
      const order = canteenStore.updateOrderStatus(req.params.id, status);
      res.json({ success: true, data: order });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  });

  // --- PAYMENTS & UPI SIMULATOR ---
  app.post('/api/payments/create', (req: Request, res: Response) => {
    const { amount, orderRef } = req.body;
    const transactionId = `BMSIT-UPI-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const upiUri = `upi://pay?pa=bmsitcanteen@upi&pn=BMSIT%20Campus%20Canteen&am=${amount}&cu=INR&tn=${orderRef || 'CanteenFood'}`;

    res.json({
      success: true,
      data: {
        transactionId,
        upiUri,
        amount,
        merchantName: 'BMSIT Campus Canteen',
        expiresInSeconds: 300,
      },
    });
  });

  app.post('/api/payments/verify', (req: Request, res: Response) => {
    const { transactionId } = req.body;
    // Verify mock UPI signature
    res.json({
      success: true,
      verified: true,
      transactionId,
      status: 'SUCCESS',
      verifiedAt: new Date().toISOString(),
    });
  });

  // --- ADMIN ANALYTICS & DASHBOARD ---
  app.get('/api/admin/dashboard', (_req: Request, res: Response) => {
    const analytics = canteenStore.getAnalytics();
    res.json({ success: true, data: analytics });
  });

  app.get('/api/admin/inventory', (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        items: canteenStore.menuItems.map(m => ({
          id: m.id,
          name: m.name,
          category: m.category,
          stockQuantity: m.stockQuantity,
          isAvailable: m.isAvailable,
          price: m.price,
        })),
        logs: canteenStore.inventoryLogs.slice(0, 30),
      },
    });
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'BMSIT Canteen Engine', uptime: process.uptime() });
  });

  // Mount Vite development middlewares or production static build
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BMSIT Canteen Pre-Order System server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
