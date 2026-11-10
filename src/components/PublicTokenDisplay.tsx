import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Maximize2, Minimize2, Volume2, VolumeX, ArrowLeft, Utensils, Sparkles } from 'lucide-react';

export const PublicTokenDisplay: React.FC = () => {
  const { orders, soundEnabled, setSoundEnabled, setCurrentView } = useApp();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const preparingOrders = orders.filter((o) => o.orderStatus === 'PREPARING');
  const readyOrders = orders.filter((o) => o.orderStatus === 'READY');

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('home')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Return to Canteen Portal"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-3xl font-black tracking-tight text-white">
                BMSIT Campus Canteen
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Counter 2 Pickups
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Live Token Pickup Board · Please collect your order when your token is called
            </p>
          </div>
        </div>

        {/* Clock & Screen Controls */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-emerald-400 tabular-nums">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-widest font-medium">
              {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors"
              title={soundEnabled ? 'Mute announcement chimes' : 'Enable announcement chimes'}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors"
              title="Toggle Fullscreen for Dining Hall TV"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-amber-400" />
              ) : (
                <Maximize2 className="w-5 h-5 text-slate-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Grid: Now Preparing (Left) vs Ready for Pickup (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 flex-1">
        {/* Left: NOW PREPARING */}
        <div className="flex flex-col bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-amber-400 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-amber-400">
                Now Preparing
              </h2>
            </div>
            <span className="text-sm font-mono font-bold text-slate-400 tabular-nums">
              {preparingOrders.length} in kitchen
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {preparingOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-600">
                <Utensils className="w-12 h-12 mb-3 stroke-1 text-slate-700" />
                <p className="text-sm font-semibold">Kitchen queue is currently clear</p>
                <p className="text-xs text-slate-500 mt-1">New incoming tokens will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {preparingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 sm:p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center shadow-inner hover:border-amber-500/50 transition-colors"
                  >
                    <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-white tabular-nums block">
                      {order.tokenNumber}
                    </span>
                    <span className="text-[11px] text-amber-400/90 font-medium mt-2 block truncate">
                      {order.pickupSlotLabel.split('–')[0]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: READY FOR PICKUP */}
        <div className="flex flex-col bg-emerald-950/20 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-500/30 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-emerald-400 flex items-center gap-2">
                <span>Ready for Pickup</span>
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </h2>
            </div>
            <span className="text-sm font-mono font-bold text-emerald-300 tabular-nums">
              {readyOrders.length} at counter
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {readyOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-600">
                <p className="text-sm font-semibold">No tokens waiting at counter</p>
                <p className="text-xs text-slate-500 mt-1">Orders marked ready will flash here</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {readyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 sm:p-7 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl border-2 border-emerald-300 text-center shadow-lg shadow-emerald-900/40 transform hover:scale-105 transition-all animate-in fade-in"
                  >
                    <span className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white tabular-nums block drop-shadow-md">
                      {order.tokenNumber}
                    </span>
                    <span className="text-xs font-bold text-emerald-100 uppercase tracking-widest mt-2 block">
                      Counter 2
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="py-3 px-6 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Real-time Socket & SSE synchronized with BMSIT central kitchen</span>
        </div>
        <div>Show your mobile token screen at Counter 2 when collecting meals</div>
      </div>
    </div>
  );
};
