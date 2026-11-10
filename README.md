# College Canteen Pre-Order System (BMSIT Campus Canteen)

A production-grade, event-driven web application tailored for **BMSIT & M (BMS Institute of Technology and Management, Bengaluru)** to digitize college cafeteria operations, eliminate physical queues during recess, manage 15-minute pickup slots, generate sequential digital tokens, and orchestrate kitchen preparation in real time.

---

## 🌟 Key Features

### 1. Student & Faculty Ordering Portal
- **Rich Campus Menu**: Browse authentic South Indian breakfast, executive thalis, biryanis, evening snacks, and beverages.
- **Dietary & Category Filters**: Instant filtering by Vegetarian / Non-Vegetarian, Breakfast, Lunch, Snacks, and Beverages.
- **15-Minute Pickup Time Slots**: Select time slots (e.g. `12:15 PM – 12:30 PM`) with live capacity tracking to prevent overbooking.
- **Interactive UPI QR Payment Simulator**: Sandbox payment gateway generating real-like UPI QR codes with simulated mobile scan approval and instant webhook callback.
- **Digital Token Confirmation**: Sequential daily order token generation (`C101`, `C102`, `C103`...) with celebratory confetti.
- **Live Order Progress Tracker**: Real-time status stepper (`RECEIVED` → `PREPARING` → `READY` → `DELIVERED`).

### 2. Kitchen Display System (KDS)
- Touch-friendly 4-column kanban board for kitchen chefs:
  1. **New Tickets** (`RECEIVED`)
  2. **In Kitchen** (`PREPARING`)
  3. **Ready at Counter** (`READY`)
  4. **Completed** (`DELIVERED`)
- Elapsed time counter per ticket compared to estimated prep time.
- One-tap status advances that instantly broadcast to students and the dining hall TV.

### 3. Public Pickup Token Display
- High-contrast, large-format dining hall monitor / TV screen.
- Split screen: **NOW PREPARING** vs **READY FOR PICKUP** at Counter 2.
- Visual animation and optional Web Audio chime when tokens become ready.
- Dedicated TV Fullscreen toggle.

### 4. Admin Operations & Sales Analytics
- **Summary KPIs**: Today's Gross Revenue, Total Orders, Active Kitchen Queue, Completed Deliveries.
- **Interactive Recharts**: Peak ordering hours traffic distribution and 7-day revenue trend.
- **Menu Management**: Add new dishes, edit pricing, update stock levels, toggle availability.
- **Inventory Logs**: Real-time inventory deduction and restock activity tracking.
- **User Roles Management**: Overview of students, faculty, chefs, and administrators.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS v4, Recharts, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express.js, TypeScript, Server-Sent Events / Socket.io Event Bus |
| **Persistence** | PostgreSQL & SQLite relational store, Prisma ORM schema |
| **Cache & Queue** | Redis token queue schema & atomic counter engine |
| **DevOps & Infra** | Docker, Docker Compose, Nginx reverse proxy, GitHub Actions CI/CD |

---

## 🚀 Getting Started

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the unified development server:
```bash
npm run dev
```

3. Open your browser at `http://localhost:3000`.

---

### Running with Docker Compose

Start the full stack including PostgreSQL, Redis, Node.js backend, and Nginx:

```bash
docker compose up --build
```

Access the application via Nginx at `http://localhost`.

---

## 📡 REST API Endpoints

- `GET /api/menu`: Retrieve menu items
- `POST /api/menu`: Add a new dish (Admin)
- `PUT /api/menu/:id`: Edit item details (Admin)
- `PATCH /api/menu/:id/availability`: Toggle item availability (Admin)
- `GET /api/slots`: Retrieve pickup time slots and capacity
- `POST /api/orders`: Submit new order & generate token
- `GET /api/orders`: Query orders with filters
- `PATCH /api/orders/:id/status`: Advance order status (Kitchen Staff)
- `POST /api/payments/create`: Generate UPI transaction
- `POST /api/payments/verify`: Verify payment signature
- `GET /api/admin/dashboard`: Aggregate sales analytics and peak hour metrics
- `GET /api/events/stream`: Real-time SSE event stream for instantaneous updates

---

## 👥 Demo Personas (Quick Switcher)

| Role | Persona Name | Email |
|---|---|---|
| **Student** | Aarav Sharma (CSE) | `1by23is017@bmsit.in` |
| **Faculty** | Dr. Priya Rao (ECE) | `priyarao@bmsit.in` |
| **Kitchen Staff** | Chef Rajesh Kumar | `chef.rajesh@bmsit.in` |
| **Admin** | Suresh Hegde (Manager) | `canteen.manager@bmsit.in` |
