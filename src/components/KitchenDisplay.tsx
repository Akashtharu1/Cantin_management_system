import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import {
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  PackageCheck,
  RotateCw,
  Bell
} from 'lucide-react';

export const KitchenDisplay: React.FC = () => {
  const { orders, updateOrderStatus, refreshOrders, showToast } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const getElapsedMins = (createdAt: string) => {
    const elapsed = Math.floor((currentTime.getTime() - new Date(createdAt).getTime()) / 60000);
    return Math.max(0, elapsed);
  };

  const receivedOrders = orders.filter((o) => o.orderStatus === 'RECEIVED');
  const preparingOrders = orders.filter((o) => o.orderStatus === 'PREPARING');
  const readyOrders = orders.filter((o) => o.orderStatus === 'READY');
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').slice(0, 10);

  const handleAdvanceStatus = async (orderId: string, nextStatus: OrderStatus) => {
    await updateOrderStatus(orderId, nextStatus);
    showToast(`Order status updated to ${nextStatus}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Kitchen Display System (KDS)</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold font-mono">
                LIVE
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              BMSIT Kitchen Crew Dashboard · Real-time Ticket Routing & Dispatch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshOrders()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-50 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Sync Tickets</span>
          </button>
          <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold tabular-nums">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* 4-Column Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
        {/* Column 1: Received / New Tickets */}
        <div className="flex flex-col rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 p-3.5 border border-slate-200/80 dark:border-slate-800 min-h-[500px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                New Tickets
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 tabular-nums">
              {receivedOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {receivedOrders.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                No pending new orders
              </div>
            ) : (
              receivedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-amber-200 dark:border-amber-900/40 shadow-xs hover:shadow-md transition-shadow"
                >
                  {/* Top Bar of ticket */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-xl font-black font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                      {order.tokenNumber}
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {getElapsedMins(order.createdAt)}m ago
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">
                        {order.pickupSlotLabel}
                      </span>
                    </div>
                  </div>

                  <div className="py-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {order.customerName}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 py-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {item.quantity}× {item.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                          ₹{item.subtotal}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.customerNotes && (
                    <div className="my-2 p-1.5 bg-amber-50 dark:bg-amber-950/40 rounded text-[11px] text-amber-800 dark:text-amber-200">
                      <strong>Note:</strong> {order.customerNotes}
                    </div>
                  )}

                  <button
                    onClick={() => handleAdvanceStatus(order.id, 'PREPARING')}
                    className="w-full mt-2 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>Start Cooking</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: In Preparation */}
        <div className="flex flex-col rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 p-3.5 border border-slate-200/80 dark:border-slate-800 min-h-[500px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                In Kitchen
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 tabular-nums">
              {preparingOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {preparingOrders.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                No orders currently cooking
              </div>
            ) : (
              preparingOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-indigo-200 dark:border-indigo-900/40 shadow-xs hover:shadow-md transition-shadow ring-1 ring-indigo-500/20"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {order.tokenNumber}
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] text-indigo-500 font-mono font-semibold">
                        Cooking ~ {getElapsedMins(order.createdAt)}m
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">
                        Slot: {order.pickupSlotLabel}
                      </span>
                    </div>
                  </div>

                  <div className="py-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {order.customerName}
                    </span>
                  </div>

                  <div className="space-y-1.5 py-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {item.quantity}× {item.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.customerNotes && (
                    <div className="my-2 p-1.5 bg-indigo-50 dark:bg-indigo-950/40 rounded text-[11px] text-indigo-800 dark:text-indigo-200">
                      <strong>Note:</strong> {order.customerNotes}
                    </div>
                  )}

                  <button
                    onClick={() => handleAdvanceStatus(order.id, 'READY')}
                    className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Mark Ready for Pickup</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Ready for Pickup */}
        <div className="flex flex-col rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 p-3.5 border border-slate-200/80 dark:border-slate-800 min-h-[500px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Ready at Counter
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 tabular-nums">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {readyOrders.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                No orders waiting at counter
              </div>
            ) : (
              readyOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-emerald-300 dark:border-emerald-800 shadow-sm ring-1 ring-emerald-500/30"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {order.tokenNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      ON DISPLAY TV
                    </span>
                  </div>

                  <div className="py-2 text-xs">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                      {order.customerName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Slot: {order.pickupSlotLabel}
                    </span>
                  </div>

                  <div className="space-y-1 py-1.5 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-slate-700 dark:text-slate-300">
                        {item.quantity}× {item.name}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAdvanceStatus(order.id, 'DELIVERED')}
                    className="w-full mt-2.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>Hand Over to Student</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 4: Delivered / Completed */}
        <div className="flex flex-col rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 p-3.5 border border-slate-200/80 dark:border-slate-800 min-h-[500px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Completed
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 tabular-nums">
              {deliveredOrders.length}
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {deliveredOrders.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                No orders completed yet
              </div>
            ) : (
              deliveredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white/80 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200/60 dark:border-slate-700/40 text-xs opacity-75"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {order.tokenNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 truncate">
                    {order.customerName} · {order.items.length} items (₹{order.totalAmount})
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
