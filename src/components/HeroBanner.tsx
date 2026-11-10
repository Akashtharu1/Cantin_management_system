import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, QrCode, Ticket, ArrowRight } from 'lucide-react';
import { LOCAL_IMAGES } from '../server/store';

export const HeroBanner: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white rounded-2xl mx-4 sm:mx-6 my-6 shadow-xl">
      {/* Background Image with Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={LOCAL_IMAGES.heroBanner}
          alt="BMSIT Campus Canteen food counter"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35 filter brightness-75 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 max-w-4xl px-6 py-12 sm:px-12 sm:py-16">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-3">
          <span>BMSIT & M Bengaluru</span>
          <span aria-hidden="true">·</span>
          <span>Official Campus Dining</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl leading-[1.15] text-balance mb-4">
          Skip the Recess Queue. Pre-Order & Pick Up on Time.
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed mb-8">
          Order your favorite breakfast dosas, lunchtime thalis, and quick bites ahead of class. Select a 15-minute pickup window, pay via UPI QR, and get a real-time digital token.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentView('menu')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer hover:translate-y-[-1px] active:translate-y-0"
          >
            <span>Explore Menu & Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentView('track')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm text-slate-200 font-medium text-sm border border-slate-700 transition-all cursor-pointer"
          >
            <span>Track Active Token</span>
          </button>
        </div>

        {/* Trust Markers Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 mt-8 border-t border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <span>15-Minute Slot Reservation</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <QrCode className="w-4 h-4" />
            </div>
            <span>Instant UPI & QR Payments</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Ticket className="w-4 h-4" />
            </div>
            <span>Live Kitchen Status Tokens</span>
          </div>
        </div>
      </div>
    </div>
  );
};
