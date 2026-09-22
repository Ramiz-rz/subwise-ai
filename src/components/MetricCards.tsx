import React from 'react';
import { CreditCard, Calendar, Cpu, PiggyBank, Activity, Target, AlertTriangle } from 'lucide-react';
import { BillingCycle, SpendingCapConfig } from '../types';

interface MetricCardsProps {
  monthlySpend: number;
  annualRunRate: number;
  aiToolPercentage: number;
  aiToolSpend: number;
  activeCount: number;
  identifiedSavings: number;
  perspective: BillingCycle;
  onSimulateCancellation: () => void;
  budgetConfig?: SpendingCapConfig;
  onOpenBudgetCapModal?: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  monthlySpend,
  annualRunRate,
  aiToolPercentage,
  aiToolSpend,
  activeCount,
  identifiedSavings,
  perspective,
  onSimulateCancellation,
  budgetConfig,
  onOpenBudgetCapModal
}) => {
  const displaySpend = perspective === 'annual' ? annualRunRate : monthlySpend;
  const spendLabel = perspective === 'annual' ? 'ANNUAL SPEND' : 'MONTHLY SPEND';

  const isBudgetActive = budgetConfig?.isEnabled && (budgetConfig.monthlyCap || 0) > 0;
  const monthlyCap = budgetConfig?.monthlyCap || 0;
  const capRatio = isBudgetActive && monthlyCap > 0 ? (monthlySpend / monthlyCap) * 100 : 0;
  const isCapBreached = isBudgetActive && capRatio >= 100;
  const is80Warning = isBudgetActive && capRatio >= 80 && !isCapBreached;

  return (
    <div className="grid grid-cols-2 gap-3 px-4 py-2">
      {/* 1. Monthly Spend Card */}
      <div className="relative p-4 rounded-xl bg-[#0f1523]/80 border border-white/[0.07] backdrop-blur-md hover:border-indigo-500/30 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-['JetBrains_Mono']">
            {spendLabel}
          </span>
          <CreditCard className="w-4 h-4 text-slate-400" />
        </div>
        <div className="my-2">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono-num font-['JetBrains_Mono']">
            ${displaySpend.toFixed(2)}
          </div>
        </div>

        {/* Active subscriptions and Spending Cap Indicator */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-['Inter']">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">
                {activeCount} active
              </span>
            </div>

            {onOpenBudgetCapModal && (
              <button
                id="metric-budget-cap-trigger"
                onClick={onOpenBudgetCapModal}
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors flex items-center gap-1 ${
                  !isBudgetActive
                    ? 'text-slate-400 hover:text-white bg-white/[0.04]'
                    : isCapBreached
                      ? 'text-rose-300 bg-rose-950 border border-rose-500/30 font-bold'
                      : is80Warning
                        ? 'text-amber-300 bg-amber-950 border border-amber-500/30 font-bold'
                        : 'text-indigo-300 bg-indigo-950/60 border border-indigo-500/20'
                }`}
                title="Click to adjust Monthly Spending Cap"
              >
                {isCapBreached || is80Warning ? (
                  <AlertTriangle className="w-2.5 h-2.5" />
                ) : (
                  <Target className="w-2.5 h-2.5" />
                )}
                <span>
                  {isBudgetActive ? `${capRatio.toFixed(0)}% Cap` : 'Set Cap'}
                </span>
              </button>
            )}
          </div>

          {/* Micro Progress Bar towards Cap */}
          {isBudgetActive && perspective === 'monthly' && (
            <div 
              onClick={onOpenBudgetCapModal}
              className="w-full h-1 bg-[#1a233a] rounded-full overflow-hidden cursor-pointer"
              title={`Monthly Spending Cap: $${monthlySpend.toFixed(2)} of $${monthlyCap.toFixed(2)}`}
            >
              <div 
                className={`h-full transition-all ${
                  isCapBreached 
                    ? 'bg-rose-500' 
                    : is80Warning 
                      ? 'bg-amber-400' 
                      : 'bg-indigo-500'
                }`}
                style={{ width: `${Math.min(100, capRatio)}%` }}
              />
            </div>
          )}
        </div>
      </div>


      {/* 2. Annual Run-rate Card */}
      <div className="relative p-4 rounded-xl bg-[#0f1523]/80 border border-white/[0.07] backdrop-blur-md hover:border-indigo-500/30 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-['JetBrains_Mono']">
            ANNUAL RUN-RATE
          </span>
          <Calendar className="w-4 h-4 text-slate-400" />
        </div>
        <div className="my-2.5">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono-num font-['JetBrains_Mono']">
            ${annualRunRate.toFixed(2)}
          </div>
        </div>
        <div className="text-xs text-slate-400 font-['Inter']">
          12-month projected cost
        </div>
      </div>

      {/* 3. AI Tool Share Card */}
      <div className="relative p-4 rounded-xl bg-[#0f1523]/80 border border-white/[0.07] backdrop-blur-md hover:border-indigo-500/30 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-['JetBrains_Mono']">
            AI TOOL SHARE
          </span>
          <Cpu className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="my-2.5">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono-num font-['JetBrains_Mono']">
            {aiToolPercentage}%
          </div>
        </div>
        <div className="text-xs text-slate-400 font-['Inter'] truncate">
          ${aiToolSpend.toFixed(0)}/mo LLM & AI tools
        </div>
      </div>

      {/* 4. Identified Savings Card */}
      <div className="relative p-4 rounded-xl bg-[#0f1523]/80 border border-emerald-500/20 backdrop-blur-md hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-[0_0_15px_rgba(16,185,129,0.05)]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase font-['JetBrains_Mono']">
            IDENTIFIED SAVINGS
          </span>
          <PiggyBank className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="my-2.5">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-400 font-mono-num font-['JetBrains_Mono']">
            ${identifiedSavings.toFixed(2)}
          </div>
        </div>
        <button
          onClick={onSimulateCancellation}
          className="text-left text-xs font-medium text-emerald-400/90 hover:text-emerald-300 transition-colors flex items-center gap-1 group font-['Inter']"
        >
          <span>Simulate cancellation</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
};
