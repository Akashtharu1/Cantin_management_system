import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, CheckCircle2, Utensils, AlertCircle, MapPin, Receipt, ArrowRight } from 'lucide-react';
import { OrderStatus } from '../types';

export const OrderTracker: React.FC = () => {
  const {
    myOrders,
    activeTrackedOrder,
    setActiveTrackedOrder,
    setCurrentView,
  } = useApp();

  const currentOrder = activeTrackedOrder || (myOrders.length > 0 ? myOrders[0] : null);

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'RECEIVED':
        return 1;
      case 'PREPARING':
        return 2;
      case 'READY':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = currentOrder ? getStatusStep(currentOrder.orderStatus) : 1;

  if (!currentOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-4">
          <Receipt className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          No Active Orders to Track
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6 max-w-sm mx-auto">
          You haven't placed an order yet. Select dishes from the canteen menu to pre-order for your lunch break.
        </p>
        <button
          onClick={() => setCurrentView('menu')}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl cursor-pointer"
        >
          Browse Canteen Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Selector if multiple orders exist */}
      {myOrders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          <span className="text-xs text-slate-400 font-medium shrink-0">Switch Order:</span>
          {myOrders.map((ord) => (
            <button
              key={ord.id}
              onClick={() => setActiveTrackedOrder(ord)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                currentOrder.id === ord.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              Token {ord.tokenNumber} ({ord.orderStatus})
            </button>
          ))}
        </div>
      )}

      {/* Main Grid: Left Token Card + Right Status Progress */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Digital Token Card */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="w-full bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-emerald-500/40 relative overflow-hidden text-center">
            {/* Subtle watermark circle */}
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />

            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-200 block mb-1">
              BMSIT Canteen Digital Token
            </span>

            <div className="text-6xl sm:text-7xl font-black font-mono tracking-tight my-4 tabular-nums drop-shadow-sm">
              {currentOrder.tokenNumber}
            </div>

            {/* Current Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-white/20 backdrop-blur-sm border border-white/30 text-white mb-6">
              {currentOrder.orderStatus === 'RECEIVED' && <span>Order Received</span>}
              {currentOrder.orderStatus === 'PREPARING' && <span>Chef Cooking</span>}
              {currentOrder.orderStatus === 'READY' && <span>Ready for Pickup</span>}
              {currentOrder.orderStatus === 'DELIVERED' && <span>Order Delivered</span>}
            </div>

            {/* Pickup details */}
            <div className="space-y-2 text-xs border-t border-emerald-500/40 pt-4 text-emerald-100">
              <div className="flex items-center justify-between">
                <span className="text-emerald-200">Pickup Window:</span>
                <span className="font-bold text-white">{currentOrder.pickupSlotLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-200">Counter:</span>
                <span className="font-bold text-white">Counter 2 (Pre-Order Desk)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-200">Payment:</span>
                <span className="font-mono text-emerald-200">
                  {currentOrder.paymentMethod} (₹{currentOrder.totalAmount})
                </span>
              </div>
            </div>
          </div>

          {/* Quick Counter Pickup Instructions */}
          <div className="w-full mt-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Pickup Instructions
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed mt-0.5">
                  Arrive at BMSIT Canteen Counter 2 during your time slot ({currentOrder.pickupSlotLabel}). Present this token screen to claim your hot meal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status Timeline & Order Receipt */}
        <div className="md:col-span-7 space-y-6">
          {/* Status Tracker Bar */}
          <div className="p-5 sm:p-6 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-6">
              Preparation Progress
            </h3>

            {/* Steps */}
            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
              {/* Step 1: Received */}
              <div className="relative flex items-start gap-4">
                <div
                  className={`absolute -left-6 top-0 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                    currentStep >= 1
                      ? 'border-emerald-600 bg-emerald-600'
                      : 'border-slate-300 bg-white dark:bg-slate-800'
                  }`}
                >
                  {currentStep >= 1 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <h4
                    className={`text-xs font-bold ${
                      currentStep >= 1
                        ? 'text-slate-900 dark:text-slate-100'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    1. Order Received & Payment Verified
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Order confirmed with transaction ID {currentOrder.transactionId}
                  </p>
                </div>
              </div>

              {/* Step 2: Preparing */}
              <div className="relative flex items-start gap-4">
                <div
                  className={`absolute -left-6 top-0 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                    currentStep >= 2
                      ? 'border-indigo-600 bg-indigo-600'
                      : 'border-slate-300 bg-white dark:bg-slate-800'
                  }`}
                >
                  {currentStep >= 2 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <h4
                    className={`text-xs font-bold ${
                      currentStep >= 2
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    2. Kitchen Preparing Meal
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Chef Rajesh Kumar has started preparation on the griddle & stove
                  </p>
                </div>
              </div>

              {/* Step 3: Ready */}
              <div className="relative flex items-start gap-4">
                <div
                  className={`absolute -left-6 top-0 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                    currentStep >= 3
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-slate-300 bg-white dark:bg-slate-800'
                  }`}
                >
                  {currentStep >= 3 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <h4
                    className={`text-xs font-bold ${
                      currentStep >= 3
                        ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    3. Ready at Counter 2
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Hot meal boxed and waiting at the counter. Flashing on dining hall TV.
                  </p>
                </div>
              </div>

              {/* Step 4: Delivered */}
              <div className="relative flex items-start gap-4">
                <div
                  className={`absolute -left-6 top-0 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                    currentStep >= 4
                      ? 'border-slate-800 bg-slate-800'
                      : 'border-slate-300 bg-white dark:bg-slate-800'
                  }`}
                >
                  {currentStep >= 4 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <h4
                    className={`text-xs font-bold ${
                      currentStep >= 4
                        ? 'text-slate-900 dark:text-slate-100'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    4. Completed & Picked Up
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Order delivered to customer. Enjoy your meal!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Items Summary */}
          <div className="p-5 sm:p-6 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>Order Details</span>
              <span className="text-xs font-normal text-slate-500">
                {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                      {item.quantity}×
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-mono text-slate-900 dark:text-slate-100 font-semibold tabular-nums">
                    ₹{item.subtotal}
                  </span>
                </div>
              ))}
            </div>

            {currentOrder.customerNotes && (
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Notes: </span>
                {currentOrder.customerNotes}
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">₹{currentOrder.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>5% GST</span>
                <span className="font-mono tabular-nums">₹{currentOrder.tax}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100 pt-1 text-sm">
                <span>Total Paid</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                  ₹{currentOrder.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
