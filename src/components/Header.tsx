import React from 'react';
import { Sparkles, Bell, Receipt, DatabaseZap, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenInvoices: () => void;
  unreadCount?: number;
  isSimulatedTelemetry: boolean;
  onToggleTelemetry: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenInvoices,
  unreadCount = 2,
  isSimulatedTelemetry,
  onToggleTelemetry
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3.5 bg-[#090D16]/90 backdrop-blur-md border-b border-white/[0.06]">
      {/* Brand & Beta Pill */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.25)]">
          <Sparkles className="w-4 h-4 text-indigo-300" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[17px] font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
            SubWise AI
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-[#1e2238] border border-[#373a5a] text-[#c0c1ff] font-['JetBrains_Mono']">
            BETA
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Telemetry baseline toggle pill */}
        <button
          onClick={onToggleTelemetry}
          title={isSimulatedTelemetry ? "Switch to Zero-Baseline View ($0.00)" : "Switch to Active Stack Telemetry ($176.98/mo)"}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-[#131927] border border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all"
        >
          <DatabaseZap className={`w-3.5 h-3.5 ${isSimulatedTelemetry ? 'text-indigo-400' : 'text-slate-500'}`} />
          <span className="text-[11px] font-['JetBrains_Mono']">
            {isSimulatedTelemetry ? 'Sync Mode: Active' : 'Sync Mode: Baseline'}
          </span>
        </button>

        {/* Invoice / Export modal trigger */}
        <button
          onClick={onOpenInvoices}
          aria-label="Billing Records"
          className="p-2 rounded-lg bg-[#121622] hover:bg-[#1a2133] border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
        >
          <Receipt className="w-4 h-4" />
        </button>

        {/* Notification Bell with indicator */}
        <button
          onClick={onOpenNotifications}
          aria-label="Urgent Alerts"
          className="relative p-2 rounded-lg bg-[#121622] hover:bg-[#1a2133] border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
};
