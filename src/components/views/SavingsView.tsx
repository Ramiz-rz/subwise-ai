import React, { useState } from 'react';
import { PiggyBank, Check, ArrowRight, ShieldAlert, Sparkles, Copy, CheckCircle2, TrendingUp } from 'lucide-react';
import { Subscription } from '../../types';

interface SavingsViewProps {
  subscriptions: Subscription[];
  onApplySavings: (cancelledIds: string[]) => void;
}

export const SavingsView: React.FC<SavingsViewProps> = ({
  subscriptions,
  onApplySavings
}) => {
  // Pre-select high-redundancy / low-usage candidate subscriptions
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'sub-2', // ChatGPT Pro ($20.00)
    'sub-4', // Dropbox Plus ($11.99)
    'sub-5', // GitHub Copilot ($10.00)
    'sub-6'  // Notion AI ($2.99 savings)
  ]);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectedSubs = subscriptions.filter(s => selectedIds.includes(s.id));
  const simulatedMonthlySavings = selectedSubs.reduce((acc, curr) => acc + curr.amount, 0);
  const simulatedAnnualSavings = simulatedMonthlySavings * 12;
  const fiveYearInvested = Math.round(simulatedAnnualSavings * 5 * 1.25); // conservative compounding

  const currentTotal = subscriptions
    .filter(s => s.status === 'active')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const newBurn = Math.max(0, currentTotal - simulatedMonthlySavings);

  const copyCancellationTemplate = (subName: string, provider: string) => {
    const text = `Subject: Cancellation Request - Subscription for ${subName}\n\nDear ${provider} Support,\n\nPlease cancel my recurring subscription for ${subName} effective at the end of the current billing period. Please confirm that my card will not be charged again.\n\nThank you,\nAccount Owner`;
    navigator.clipboard.writeText(text);
    setCopiedTemplate(subName);
    setTimeout(() => setCopiedTemplate(null), 2500);
  };

  return (
    <div className="px-4 py-3 space-y-4 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
              Cancellation Simulator
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-['Inter'] mt-0.5">
            Model budget arbitrage by deactivating underutilized licenses
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-['JetBrains_Mono']">
          ${simulatedMonthlySavings.toFixed(2)}/mo Reclaimable
        </span>
      </div>

      {/* Projection Metric Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0f1524] border border-emerald-500/30">
          <div className="text-[11px] font-semibold text-emerald-400 font-['JetBrains_Mono'] uppercase">
            Monthly Saved
          </div>
          <div className="text-2xl font-bold text-white font-['JetBrains_Mono'] mt-1">
            +${simulatedMonthlySavings.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            New burn: ${newBurn.toFixed(2)}/mo
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0f1524] border border-white/[0.08]">
          <div className="text-[11px] font-semibold text-slate-400 font-['JetBrains_Mono'] uppercase">
            1-Year Cash Flow
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-['JetBrains_Mono'] mt-1">
            +${simulatedAnnualSavings.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Reinvested capital
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-[#0f1524] border border-white/[0.08]">
          <div className="text-[11px] font-semibold text-indigo-400 font-['JetBrains_Mono'] uppercase flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            5-Year Index Yield
          </div>
          <div className="text-2xl font-bold text-indigo-300 font-['JetBrains_Mono'] mt-1">
            ~${fiveYearInvested.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Compounded @ 8% CAGR
          </div>
        </div>
      </div>

      {/* Interactive Candidate Subscriptions */}
      <div className="rounded-xl bg-[#0f1524] border border-white/[0.08] p-4">
        <h3 className="text-sm font-bold text-white mb-2 font-['Plus_Jakarta_Sans']">
          Select Subscriptions to Simulate Downgrading
        </h3>
        <p className="text-xs text-slate-400 mb-3 font-['Inter']">
          Toggle subscriptions below to preview immediate fiscal outcomes:
        </p>

        <div className="space-y-2">
          {subscriptions.map((sub) => {
            const isSelected = selectedIds.includes(sub.id);
            const isFlagged = sub.usageScore <= 1 || (sub.redundancyWith && sub.redundancyWith.length > 0);

            return (
              <div
                key={sub.id}
                onClick={() => toggleSelect(sub.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                    : 'bg-[#121828]/60 border-white/[0.05] hover:border-white/10 opacity-70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-emerald-500 border-emerald-400 text-black'
                        : 'border-slate-600 bg-transparent'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-['Plus_Jakarta_Sans']">
                        {sub.name}
                      </span>
                      {isFlagged && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-500/30">
                          {sub.usageScore <= 1 ? 'Underused' : 'Redundant'}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-['Inter']">
                      {sub.category} · Renews in {sub.daysUntilRenewal}d
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-bold text-white font-['JetBrains_Mono']">
                      ${sub.amount.toFixed(2)}/mo
                    </span>
                    <div className="text-[10px] text-slate-500">
                      ${(sub.amount * 12).toFixed(0)}/yr
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyCancellationTemplate(sub.name, sub.provider);
                    }}
                    title="Copy 1-click cancellation notice"
                    className="p-1.5 rounded-lg bg-[#162035] hover:bg-[#202d4a] text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedTemplate === sub.name ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {selectedSubs.length} of {subscriptions.length} selected for pruning
          </span>

          <button
            onClick={() => onApplySavings(selectedIds)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] font-['Plus_Jakarta_Sans']"
          >
            Apply Savings Plan
          </button>
        </div>
      </div>
    </div>
  );
};
