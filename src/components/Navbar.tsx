import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Bell, Utensils } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    cartTotal,
    setIsCartOpen,
    activeRole,
    myOrders,
  } = useApp();

  const pendingCount = myOrders.filter(
    (o) => o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED'
  ).length;

  const isStaff = activeRole === 'KITCHEN' || activeRole === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap block leading-tight">
              BMSIT Canteen
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-tight block -mt-0.5">
              Campus Pre-Order
            </span>
          </div>
        </button>

        {/* Zone 2: Single-line Clean Nav Links strictly filtered by role */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {/* Customer links: Visible to Student and Faculty */}
          {!isStaff && (
            <>
              <button
                onClick={() => setCurrentView('menu')}
                className={`whitespace-nowrap transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer ${
                  currentView === 'menu' || currentView === 'home'
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : ''
                }`}
              >
                Menu & Order
              </button>

              <button
                onClick={() => setCurrentView('track')}
                className={`whitespace-nowrap transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer relative ${
                  currentView === 'track' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
                }`}
              >
                Track Order
                {pendingCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white tabular-nums">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentView('history')}
                className={`whitespace-nowrap transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer ${
                  currentView === 'history' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
                }`}
              >
                My Orders
              </button>
            </>
          )}

          {/* Operational links: Visible ONLY to Kitchen Staff (Chef) and Canteen Admin */}
          {isStaff && (
            <>
              <button
                onClick={() => setCurrentView('kds')}
                className={`whitespace-nowrap transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer relative ${
                  currentView === 'kds' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
                }`}
              >
                Kitchen KDS
              </button>

              <button
                onClick={() => setCurrentView('admin')}
                className={`whitespace-nowrap transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer ${
                  currentView === 'admin' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
                }`}
              >
                Admin & Analytics
              </button>

              <button
                onClick={() => setCurrentView('menu')}
                className={`whitespace-nowrap transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer ${
                  currentView === 'menu' || currentView === 'home'
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : ''
                }`}
              >
                Menu & Dishes
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Primary Action (Cart Drawer Trigger) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm shadow-emerald-600/20 transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-rose-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-slate-900 tabular-nums">
                  {cartCount}
                </span>
              )}
            </div>
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="border-l border-emerald-500 pl-2 font-mono tabular-nums">
                ₹{cartTotal}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
