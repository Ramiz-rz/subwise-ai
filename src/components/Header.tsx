import React from 'react';
import { Sparkles, Bell, Receipt, DatabaseZap, Target, AlertTriangle } from 'lucide-react';
import { SpendingCapConfig } from '../types';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenInvoices: () => void;
  onOpenBudgetCap: () => void;
  unreadCount?: number;
  isSimulatedTelemetry: boolean;
  onToggleTelemetry: () => void;
  budgetConfig: SpendingCapConfig;
  currentMonthlySpend: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenInvoices,
  onOpenBudgetCap,
  unreadCount = 2,
  isSimulatedTelemetry,
  onToggleTelemetry,
  budgetConfig,
  currentMonthlySpend
}) => {
  const isBudgetEnabled = budgetConfig.isEnabled && budgetConfig.monthlyCap > 0;
  const ratio = isBudgetEnabled ? (currentMonthlySpend / budgetConfig.monthlyCap) * 100 : 0;
  const is100Breached = isBudgetEnabled && ratio >= 100;
  const is80Breached = isBudgetEnabled && ratio >= 80 && !is100Breached;

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
        {/* Monthly Spending Cap button / status badge */}
        <button
          id="header-budget-cap-btn"
          onClick={onOpenBudgetCap}
          title="Configure Monthly Spending Cap & Threshold Alerts"
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
            !isBudgetEnabled
              ? 'bg-[#131927] border border-white/10 hover:border-indigo-500/40 text-slate-400 hover:text-slate-200'
              : is100Breached
                ? 'bg-rose-950/70 border border-rose-500/60 text-rose-200 hover:bg-rose-900/80 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                : is80Breached
                  ? 'bg-amber-950/70 border border-amber-500/60 text-amber-200 hover:bg-amber-900/80 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-[#131927] border border-indigo-500/30 text-indigo-300 hover:text-white hover:border-indigo-500/60'
          }`}
        >
          {is100Breached || is80Breached ? (
            <AlertTriangle className={`w-3.5 h-3.5 ${is100Breached ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
          ) : (
            <Target className="w-3.5 h-3.5 text-indigo-400" />
          )}
          <span className="text-[11px] font-['JetBrains_Mono'] font-semibold">
            {!isBudgetEnabled 
              ? 'Set Cap' 
              : is100Breached
                ? `${ratio.toFixed(0)}% Cap`
                : is80Breached
                  ? `${ratio.toFixed(0)}% Cap`
                  : `Cap: $${budgetConfig.monthlyCap.toFixed(0)}`}
          </span>
        </button>

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
            <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${
              is100Breached 
                ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-ping'
                : is80Breached
                  ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)] animate-pulse'
                  : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse'
            }`} />
          )}
        </button>
      </div>
    </header>
  );
};

