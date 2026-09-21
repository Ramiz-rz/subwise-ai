import React from 'react';
import { CreditCard, Calendar, Cpu, PiggyBank, Activity } from 'lucide-react';
import { BillingCycle } from '../types';

interface MetricCardsProps {
  monthlySpend: number;
  annualRunRate: number;
  aiToolPercentage: number;
  aiToolSpend: number;
  activeCount: number;
  identifiedSavings: number;
  perspective: BillingCycle;
  onSimulateCancellation: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  monthlySpend,
  annualRunRate,
  aiToolPercentage,
  aiToolSpend,
  activeCount,
  identifiedSavings,
  perspective,
  onSimulateCancellation
}) => {
  const displaySpend = perspective === 'annual' ? annualRunRate : monthlySpend;
  const spendLabel = perspective === 'annual' ? 'ANNUAL SPEND' : 'MONTHLY SPEND';

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
        <div className="my-2.5">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono-num font-['JetBrains_Mono']">
            ${displaySpend.toFixed(2)}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-['Inter']">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300">
            {activeCount} active subscriptions
          </span>
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
