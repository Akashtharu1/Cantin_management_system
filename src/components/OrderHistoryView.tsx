import React from 'react';
import { useApp } from '../context/AppContext';
import { Receipt, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const OrderHistoryView: React.FC = () => {
  const { myOrders, setActiveTrackedOrder, setCurrentView } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            My Canteen Orders & Digital Receipts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            View your active and fulfilled pre-orders for BMSIT Campus Canteen
          </p>
        </div>
      </div>

      {myOrders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <Receipt className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No past orders found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
            When you order dosas, lunch thalis, or snacks, your digital tokens and receipts will appear here.
          </p>
          <button
            onClick={() => setCurrentView('menu')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            Order Ahead Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-black text-lg rounded-lg border border-emerald-200 dark:border-emerald-800 tabular-nums">
                    {order.tokenNumber}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                      Pickup Window: {order.pickupSlotLabel}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(order.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.orderStatus === 'READY'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/50'
                        : order.orderStatus === 'PREPARING'
                        ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                        : order.orderStatus === 'DELIVERED'
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {order.orderStatus}
                  </span>

                  <button
                    onClick={() => {
                      setActiveTrackedOrder(order);
                      setCurrentView('track');
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    <span>Track Live</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Items summary */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-slate-600 dark:text-slate-300 space-x-2">
                  {order.items.map((i, idx) => (
                    <span key={idx}>
                      {i.quantity}× {i.name}
                      {idx < order.items.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </div>

                <div className="text-right">
                  <span className="text-slate-400 text-[11px] mr-1">Total Paid:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm tabular-nums">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
