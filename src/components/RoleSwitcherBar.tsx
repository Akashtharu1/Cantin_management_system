import React from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, Briefcase, UtensilsCrossed, ShieldAlert, Monitor, Volume2, VolumeX, Moon, Sun } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const {
    currentUser,
    activeRole,
    personas,
    selectPersona,
    currentView,
    setCurrentView,
    soundEnabled,
    setSoundEnabled,
    isDarkMode,
    toggleDarkMode,
  } = useApp();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'FACULTY':
        return <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case 'KITCHEN':
        return <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'ADMIN':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 text-xs border-b border-slate-800 px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Demo Role Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          <span className="text-slate-400 font-medium whitespace-nowrap text-[11px] uppercase tracking-wider">
            Quick Persona:
          </span>
          {personas.map((persona) => {
            const isCurrent = currentUser.id === persona.id && currentView !== 'public';
            return (
              <button
                key={persona.id}
                onClick={() => selectPersona(persona)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={`Switch to ${persona.fullName} (${persona.role})`}
              >
                {getRoleIcon(persona.role)}
                <span>{persona.fullName.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75 hidden sm:inline">({persona.role})</span>
              </button>
            );
          })}

          {/* TV Public Screen Button */}
          <button
            onClick={() => setCurrentView('public')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              currentView === 'public'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-indigo-400" />
            <span>Dining Hall TV</span>
          </button>
        </div>

        {/* Right: Audio & Theme Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            title={soundEnabled ? 'Chime sound enabled' : 'Chime sound muted'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Chime On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">Chime Muted</span>
              </>
            )}
          </button>

          <span className="text-slate-700">|</span>

          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Dark Mode</span>
              </>
            )}
          </button>

          <span className="text-slate-700">|</span>

          <span className="text-slate-400 text-[11px] font-mono tabular-nums">
            Active: <span className="text-emerald-400 font-semibold">{currentUser.fullName}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
