# Role-Based Access Control & Navigation Protection

Strictly enforce Role-Based Access Control (RBAC) across the BMSIT Canteen navigation bar, route views, and API endpoints so that **Kitchen KDS** and **Admin & Analytics** are hidden from and inaccessible to Students and Faculty members, and only visible to Canteen Admins and Kitchen Staff (Chef).

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following role visibility rules will be implemented according to your confirmed selections:

- **Student & Faculty (Dr.) View**:
  - Top navigation displays strictly student-centric links: `Menu & Order`, `Track Order`, and `My Orders`.
  - The `Kitchen KDS` and `Admin & Analytics` buttons are completely hidden from the navigation bar.
- **Kitchen Staff (Chef Rajesh) & Admin (Suresh Hegde) View**:
  - Top navigation displays operational links: `Kitchen KDS`, `Admin & Analytics`, and `Menu & Order`.
- **Access Guard & Protection**:
  - If a student or faculty account attempts to navigate directly to the KDS or Admin view, an **Access Denied (403 Unauthorized)** screen will be displayed detailing that Kitchen Staff or Admin credentials are required, with a 1-click button to return to the Menu or switch to an authorized staff persona.

---

## 1. Overview & Core Concept

### What It Does
Ensures clear segregation between consumer and operational interfaces in the campus canteen. Students and faculty only see and interact with food ordering, pickup slot selection, payment, live order tracking, and personal order receipts. Internal operations—including kitchen order status advancement, daily revenue analytics, menu pricing adjustments, and inventory deduction logs—are locked down strictly to authorized staff roles.

### Role Permissions Matrix

| Feature / Page | Student (`STUDENT`) | Faculty (`FACULTY`) | Kitchen Staff (`KITCHEN`) | Canteen Manager (`ADMIN`) |
|---|:---:|:---:|:---:|:---:|
| **Menu & Food Ordering** | ✅ Visible | ✅ Visible | ✅ Visible | ✅ Visible |
| **Pickup Slot Scheduling** | ✅ Visible | ✅ Visible | — | — |
| **My Orders & Receipts** | ✅ Visible | ✅ Visible | — | — |
| **Track Active Token** | ✅ Visible | ✅ Visible | — | — |
| **Kitchen Display System (KDS)** | ❌ Hidden & Guarded | ❌ Hidden & Guarded | ✅ Visible & Actionable | ✅ Visible & Actionable |
| **Admin & Sales Analytics** | ❌ Hidden & Guarded | ❌ Hidden & Guarded | ✅ Visible | ✅ Visible & Full CRUD |
| **Dining Hall TV Screen** | Public Counter Display | Public Counter Display | Public Counter Display | Public Counter Display |

---

## 2. User Experience & Visual Design

### Navigation Adaptation

```
[When Logged In As Student (Aarav) or Faculty (Dr. Priya Rao)]
┌──────────────────────────────────────────────────────────────────────────────────┐
│  BMSIT Canteen      Menu & Order     Track Order (1)     My Orders      [Cart ₹115]│
└──────────────────────────────────────────────────────────────────────────────────┘

[When Logged In As Kitchen Staff (Chef Rajesh) or Admin (Suresh Hegde)]
┌──────────────────────────────────────────────────────────────────────────────────┐
│  BMSIT Canteen      Kitchen KDS (3)     Admin & Analytics     Menu & Order         │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Access Denied Guard Screen
If a user with a `STUDENT` or `FACULTY` role attempts to open `/kds` or `/admin`:
- Renders an alert container with a shield warning icon.
- Explains: *"Restricted Campus Area: This screen is reserved for BMSIT Kitchen Crew and Canteen Administration."*
- Provides an action button: *"Return to Student Menu"* and *"Switch to Chef / Admin Persona"* for instant verification.

---

## 3. Key Implementation Steps

### Step 1: Update Navbar Dynamic Filtering (`src/components/Navbar.tsx`)
- Inspect `activeRole` from `useApp()`.
- Filter visible navigation tabs based on whether the role is student/faculty vs. kitchen/admin.
- Show `Kitchen KDS` and `Admin & Analytics` only when `activeRole === 'KITCHEN' || activeRole === 'ADMIN'`.

### Step 2: Implement Route Guard Component (`src/components/AccessDeniedGuard.tsx`)
- Create an unauthorized access fallback screen with clear messaging and recovery actions.
- Wrap `<KitchenDisplay />` and `<AdminDashboard />` inside `src/App.tsx` with role validation checks.

### Step 3: Align Persona Switching (`src/context/AppContext.tsx`)
- Ensure that switching from Admin/Chef back to Student automatically resets the view to `'home'` or `'menu'`, preventing students from inadvertently retaining an admin screen state.

### Step 4: Verification & Build Check
- Verify that `compile_applet` and `lint_applet` pass with zero issues.
- Test persona switching between Student Aarav, Dr. Priya, Chef Rajesh, and Manager Suresh to confirm navbar links and view permissions adapt dynamically.
