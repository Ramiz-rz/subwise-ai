import React from 'react';
import { BillingCycle } from '../types';

interface BillingPerspectiveBarProps {
  perspective: BillingCycle;
  onChangePerspective: (cycle: BillingCycle) => void;
}

export const BillingPerspectiveBar: React.FC<BillingPerspectiveBarProps> = ({
  perspective,
  onChangePerspective
}) => {
  return (
    <div className="px-4 pt-3 pb-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300 font-['Inter']">
          Billing Perspective:
        </span>

        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#111624] border border-white/[0.08]">
          <button
            onClick={() => onChangePerspective('monthly')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-all font-['Plus_Jakarta_Sans'] ${
              perspective === 'monthly'
                ? 'bg-[#252b3e] text-white shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => onChangePerspective('annual')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-all font-['Plus_Jakarta_Sans'] ${
              perspective === 'annual'
                ? 'bg-[#252b3e] text-white shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Annual
          </button>

          {/* Green savings tag */}
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-tight bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-['JetBrains_Mono']">
            Save ~15-20%
          </span>
        </div>
      </div>

      {/* Sub status text with pulsing indicator */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-['Inter']">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>
          {perspective === 'monthly'
            ? 'Viewing normalized 30-day monthly run rate'
            : 'Viewing normalized 365-day annual projected spend'}
        </span>
      </div>
    </div>
  );
};
