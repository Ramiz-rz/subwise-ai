import React from 'react';
import { X, Bell, AlertTriangle, Clock, CheckCircle2, ArrowRight, Target, Sliders, ShieldAlert } from 'lucide-react';
import { Subscription, SpendingCapConfig } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  urgentSubscriptions: Subscription[];
  onSelectSubscription: (sub: Subscription) => void;
  budgetConfig?: SpendingCapConfig;
  currentMonthlySpend?: number;
  onOpenBudgetCapModal?: () => void;
  onNavigateToSavings?: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  urgentSubscriptions,
  onSelectSubscription,
  budgetConfig,
  currentMonthlySpend = 0,
  onOpenBudgetCapModal,
  onNavigateToSavings
}) => {
  if (!isOpen) return null;

  // Evaluate budget thresholds
  const isBudgetActive = budgetConfig?.isEnabled && (budgetConfig.monthlyCap || 0) > 0;
  const monthlyCap = budgetConfig?.monthlyCap || 0;
  const budgetRatio = monthlyCap > 0 ? (currentMonthlySpend / monthlyCap) * 100 : 0;
  const isCapBreached = isBudgetActive && budgetConfig?.alertAt100 && budgetRatio >= 100;
  const is80Exceeded = isBudgetActive && budgetConfig?.alertAt80 && budgetRatio >= 80 && !isCapBreached;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-[#0d1322] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#111728]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
              Auto-Charge Alerts & Watchdog Warnings
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 font-['Inter'] max-h-[75vh] overflow-y-auto">
          {/* 100% Critical Cap Exceeded Alert */}
          {isCapBreached && (
            <div 
              id="budget-cap-exceeded-alert"
              className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)] space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-rose-900/60 text-rose-400">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-rose-200 block font-['Plus_Jakarta_Sans']">
                      Critical: Monthly Spending Cap Exceeded!
                    </span>
                    <span className="text-[10px] text-rose-300/80 font-['JetBrains_Mono']">
                      Cap: ${monthlyCap.toFixed(2)} · Current: ${currentMonthlySpend.toFixed(2)} ({budgetRatio.toFixed(0)}%)
                    </span>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-900 text-rose-200 border border-rose-500/40 font-['JetBrains_Mono'] shrink-0">
                  100% Overrun
                </span>
              </div>

              <p className="text-[11px] text-rose-200/90 leading-relaxed">
                Active subscriptions exceed your monthly spending cap by <strong className="text-white">${(currentMonthlySpend - monthlyCap).toFixed(2)}</strong>. Review redundant licenses to reduce commitment.
              </p>

              <div className="flex items-center gap-2 pt-1">
                {onOpenBudgetCapModal && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBudgetCapModal();
                    }}
                    className="flex-1 py-1 px-2.5 rounded-lg bg-rose-900/60 hover:bg-rose-800/80 text-white text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Adjust Cap</span>
                  </button>
                )}
                {onNavigateToSavings && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToSavings();
                    }}
                    className="flex-1 py-1 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Simulate Savings</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 80% Warning Alert */}
          {is80Exceeded && (
            <div 
              id="budget-cap-warning-alert"
              className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)] space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-amber-900/60 text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-200 block font-['Plus_Jakarta_Sans']">
                      Warning: 80% Monthly Cap Threshold Reached
                    </span>
                    <span className="text-[10px] text-amber-300/80 font-['JetBrains_Mono']">
                      Cap: ${monthlyCap.toFixed(2)} · Current: ${currentMonthlySpend.toFixed(2)} ({budgetRatio.toFixed(0)}%)
                    </span>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-900 text-amber-200 border border-amber-500/40 font-['JetBrains_Mono'] shrink-0">
                  80% Alert
                </span>
              </div>

              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                You have consumed {budgetRatio.toFixed(1)}% of your monthly cap. Only <strong className="text-white">${Math.max(0, monthlyCap - currentMonthlySpend).toFixed(2)}</strong> cushion remains before budget overrun.
              </p>

              {onOpenBudgetCapModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenBudgetCapModal();
                  }}
                  className="w-full py-1 px-2.5 rounded-lg bg-amber-900/60 hover:bg-amber-800/80 text-amber-100 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Target className="w-3 h-3" />
                  <span>Manage Monthly Spending Cap</span>
                </button>
              )}
            </div>
          )}

          {/* Urgent charge alerts */}
          <div className="text-[11px] font-semibold text-slate-400 uppercase font-['JetBrains_Mono'] pt-1">
            Impending Auto-Charges (Next 7 Days)
          </div>

          {urgentSubscriptions.map((sub) => (
            <div
              key={sub.id}
              onClick={() => {
                onSelectSubscription(sub);
                onClose();
              }}
              className="p-3 rounded-xl bg-[#141b2e] hover:bg-[#1b253d] border border-white/[0.06] cursor-pointer transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: sub.color || '#6366F1' }}
                >
                  {sub.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{sub.name}</span>
                    <span className="text-[10px] text-rose-400 font-bold font-['JetBrains_Mono']">
                      Renews in {sub.daysUntilRenewal}d
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Auto-debit of ${sub.amount.toFixed(2)} on {sub.renewalDate}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </div>
          ))}

          {/* Watchdog intelligence notice */}
          <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-indigo-300 font-['JetBrains_Mono'] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Watchdog Policy Active
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              SubWise checks your SaaS accounts daily at 00:00 UTC. 3-day and 24-hour notifications will sound before any credit card charge executes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#111728] border-t border-white/[0.06] flex items-center justify-between">
          {onOpenBudgetCapModal && (
            <button
              onClick={() => {
                onClose();
                onOpenBudgetCapModal();
              }}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-['JetBrains_Mono']"
            >
              <Target className="w-3 h-3" />
              <span>Cap: ${monthlyCap.toFixed(0)}/mo</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#182136] hover:bg-[#202c48] text-xs font-semibold text-white"
          >
            Acknowledge All
          </button>
        </div>
      </div>
    </div>
  );
};

