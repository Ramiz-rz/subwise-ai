import React from 'react';
import { Sparkles, AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react';
import { AiOptimizerInsight } from '../types';

interface AiOptimizerCardProps {
  insights: AiOptimizerInsight[];
  onInspectAiMatrix: () => void;
  onSimulateCancellation: () => void;
}

export const AiOptimizerCard: React.FC<AiOptimizerCardProps> = ({
  insights,
  onInspectAiMatrix,
  onSimulateCancellation
}) => {
  return (
    <div className="px-4 py-2 pb-24">
      <div className="p-4 rounded-2xl bg-[#0b0f1a] border border-indigo-500/30 shadow-[0_0_24px_rgba(99,102,241,0.12)]">
        {/* Monospace Header with Sparkles */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold tracking-widest uppercase text-indigo-200 font-['JetBrains_Mono']">
            AI OPTIMIZER INSIGHT
          </h3>
        </div>

        {/* Insight Item 1: High Redundancy (Claude Pro vs ChatGPT Pro) */}
        <div className="p-3.5 rounded-xl bg-[#111726] border border-white/[0.06] mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/30 font-['JetBrains_Mono']">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              High Redundancy
            </span>
            <span className="text-xs font-bold text-emerald-400 font-['JetBrains_Mono']">
              -$20.00/mo
            </span>
          </div>

          <h4 className="text-sm font-bold text-white mb-1.5 font-['Plus_Jakarta_Sans']">
            Claude Pro vs ChatGPT Pro overlap
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed font-['Inter'] mb-3">
            Both subscriptions offer tier-1 LLM writing and code generation. Consolidating onto Cursor Pro for dev + Perplexity for search frees $20/mo with minimal friction.
          </p>

          <button
            onClick={onInspectAiMatrix}
            className="w-full py-2 px-3 rounded-lg bg-[#182136] hover:bg-[#202c49] border border-indigo-500/30 text-indigo-300 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 font-['Plus_Jakarta_Sans'] shadow-sm active:scale-[0.99]"
          >
            <span>Inspect AI Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Insight Item 2: Underused Tool (Dropbox Plus) */}
        <div className="p-3.5 rounded-xl bg-[#111726] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-['JetBrains_Mono']">
              <RefreshCw className="w-3 h-3 text-cyan-400" />
              Underused Tool
            </span>
            <span className="text-xs font-bold text-emerald-400 font-['JetBrains_Mono']">
              -$11.99/mo
            </span>
          </div>

          <h4 className="text-sm font-bold text-white mb-1.5 font-['Plus_Jakarta_Sans']">
            Dropbox Plus (Usage: 1/5)
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed font-['Inter'] mb-3">
            Zero sync activity recorded over 45 days. Consider downgrading or migrating to cloud drive quotas.
          </p>

          <button
            onClick={onSimulateCancellation}
            className="w-full py-2 px-3 rounded-lg bg-[#162130] hover:bg-[#1d2c42] border border-emerald-500/30 text-emerald-300 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 font-['Plus_Jakarta_Sans']"
          >
            <span>Simulate Downgrade</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
