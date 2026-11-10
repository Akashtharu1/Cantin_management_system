import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, ArrowLeft, UtensilsCrossed, ShieldCheck } from 'lucide-react';

interface AccessDeniedGuardProps {
  requiredRoleName: string;
}

export const AccessDeniedGuard: React.FC<AccessDeniedGuardProps> = ({ requiredRoleName }) => {
  const { setCurrentView, personas, selectPersona, currentUser } = useApp();

  const kitchenPersona = personas.find((p) => p.role === 'KITCHEN');
  const adminPersona = personas.find((p) => p.role === 'ADMIN');

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="p-8 sm:p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Authorization Required · 403 Forbidden
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Access Restricted to {requiredRoleName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            You are currently signed in as <strong className="text-slate-700 dark:text-slate-200">{currentUser.fullName} ({currentUser.role})</strong>.
            This operations portal is strictly reserved for authorized BMSIT canteen staff and administrators.
          </p>
        </div>

        <div className="pt-4 space-y-2.5">
          <button
            onClick={() => setCurrentView('menu')}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Food Menu & Orders</span>
          </button>

          {/* Quick Demo Switchers for testing */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[11px] text-slate-400 font-medium block">
              Demo Evaluation: Switch to an authorized staff account
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {kitchenPersona && (
                <button
                  onClick={() => selectPersona(kitchenPersona)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5 text-amber-500" />
                  <span>Switch to Chef Rajesh</span>
                </button>
              )}

              {adminPersona && (
                <button
                  onClick={() => selectPersona(adminPersona)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Switch to Admin Suresh</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
