/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MenuSection } from './components/MenuSection';
import { CartDrawer } from './components/CartDrawer';
import { OrderTracker } from './components/OrderTracker';
import { KitchenDisplay } from './components/KitchenDisplay';
import { PublicTokenDisplay } from './components/PublicTokenDisplay';
import { AdminDashboard } from './components/AdminDashboard';
import { OrderHistoryView } from './components/OrderHistoryView';
import { AccessDeniedGuard } from './components/AccessDeniedGuard';
import { Utensils, MapPin, Phone, Clock, ShieldCheck, Heart } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView, toastMessage, activeRole } = useApp();

  if (currentView === 'public') {
    return <PublicTokenDisplay />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors">
      <div>
        {/* Top Quick Role Switcher Bar */}
        <RoleSwitcherBar />

        {/* Top 3-Zone Navigation Bar */}
        <Navbar />

        {/* Toast Notification Container */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
            <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-2xl text-xs font-semibold border border-slate-700/60 dark:border-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Active Route / View */}
        <main>
          {currentView === 'home' && (
            <>
              <HeroBanner />
              <MenuSection />
            </>
          )}

          {currentView === 'menu' && <MenuSection />}

          {currentView === 'track' && <OrderTracker />}

          {currentView === 'kds' && (
            activeRole === 'KITCHEN' || activeRole === 'ADMIN' ? (
              <KitchenDisplay />
            ) : (
              <AccessDeniedGuard requiredRoleName="Kitchen Staff (Chef)" />
            )
          )}

          {currentView === 'admin' && (
            activeRole === 'KITCHEN' || activeRole === 'ADMIN' ? (
              <AdminDashboard />
            ) : (
              <AccessDeniedGuard requiredRoleName="Canteen Administration & Staff" />
            )
          )}

          {currentView === 'history' && <OrderHistoryView />}
        </main>
      </div>

      {/* Cart & Checkout Slide-Over */}
      <CartDrawer />

      {/* Canteen Footer */}
      <footer className="mt-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs text-slate-500 dark:text-slate-400">
            {/* Col 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
                <Utensils className="w-4 h-4 text-emerald-600" />
                <span>BMSIT Campus Canteen</span>
              </div>
              <p className="leading-relaxed">
                B.M.S. Institute of Technology & Management, Doddaballapur Main Road, Avalahalli, Yelahanka, Bengaluru, Karnataka 560064.
              </p>
            </div>

            {/* Col 2: Operating Timings */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                Canteen Operating Hours
              </span>
              <p>Breakfast: 07:45 AM – 10:30 AM</p>
              <p>Lunch Break: 12:00 PM – 02:00 PM</p>
              <p>Evening Snacks: 03:30 PM – 06:00 PM</p>
            </div>

            {/* Col 3: Counter Pickups */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                Pickup Counters
              </span>
              <p>Counter 1: On-Spot Dining & Juices</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Counter 2: Digital Pre-Order Pickup
              </p>
              <p>Counter 3: Beverages & Filter Coffee</p>
            </div>

            {/* Col 4: Trust & Help */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                Food Safety & Support
              </span>
              <p>FSSAI Food Hygiene Certified</p>
              <p>100% Cashless UPI Integration</p>
              <p>Support: canteen.manager@bmsit.in</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div>
              © 2026 BMSIT & M Campus Dining Operations. All rights reserved.
            </div>
            <div className="flex items-center gap-1">
              <span>Made with care for BMSIT Students & Faculty</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
