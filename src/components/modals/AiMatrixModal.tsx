import React from 'react';
import { X, Sparkles, AlertTriangle, Check, ArrowRight, Zap } from 'lucide-react';

interface AiMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsolidate: () => void;
}

export const AiMatrixModal: React.FC<AiMatrixModalProps> = ({
  isOpen,
  onClose,
  onConsolidate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl bg-[#0b0f1a] border border-indigo-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#111728]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['JetBrains_Mono']">
              AI Optimizer Matrix: Claude Pro vs ChatGPT Pro
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto font-['Inter']">
          {/* Overlap Summary */}
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-amber-300 flex items-center gap-1.5 font-['JetBrains_Mono']">
                <AlertTriangle className="w-3.5 h-3.5" />
                82% Functional Overlap
              </span>
              <span className="font-bold text-emerald-400 font-['JetBrains_Mono']">
                Save $20.00/mo ($240/yr)
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Both platforms provide frontier intelligence (Claude 3.7 Sonnet vs GPT-4o / o3-mini). You also maintain Cursor Pro, which already provides unlimited agent access to both Anthropic and OpenAI models within your codebase.
            </p>
          </div>

          {/* Comparison Matrix Table */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0f1424] overflow-hidden text-xs">
            <div className="grid grid-cols-3 p-2.5 bg-[#141b2c] font-semibold text-slate-300 border-b border-white/[0.06]">
              <span>Capability</span>
              <span className="text-amber-400">Claude Pro ($20)</span>
              <span className="text-emerald-400">ChatGPT Pro ($20)</span>
            </div>

            <div className="divide-y divide-white/[0.04]">
              <div className="grid grid-cols-3 p-2.5 hover:bg-white/[0.02]">
                <span className="text-slate-400 font-medium">Code Generation</span>
                <span className="text-white font-semibold">9.8/10 (Superior)</span>
                <span className="text-slate-300">9.2/10</span>
              </div>
              <div className="grid grid-cols-3 p-2.5 hover:bg-white/[0.02]">
                <span className="text-slate-400 font-medium">Reasoning & Math</span>
                <span className="text-slate-300">9.6/10 (Extended Thinking)</span>
                <span className="text-white font-semibold">9.8/10 (o3-mini)</span>
              </div>
              <div className="grid grid-cols-3 p-2.5 hover:bg-white/[0.02]">
                <span className="text-slate-400 font-medium">Context Window</span>
                <span className="text-white font-semibold">200K tokens</span>
                <span className="text-slate-300">128K tokens</span>
              </div>
              <div className="grid grid-cols-3 p-2.5 hover:bg-white/[0.02]">
                <span className="text-slate-400 font-medium">Deep Research / Search</span>
                <span className="text-slate-400">Limited Search</span>
                <span className="text-white font-semibold">Deep Research Agent</span>
              </div>
              <div className="grid grid-cols-3 p-2.5 hover:bg-white/[0.02]">
                <span className="text-slate-400 font-medium">Interactive Artifacts</span>
                <span className="text-white font-semibold">Native Live Render</span>
                <span className="text-slate-400">Canvas Beta</span>
              </div>
            </div>
          </div>

          {/* Autonomous Watchdog Recommendation */}
          <div className="p-3.5 rounded-xl bg-[#111828] border border-indigo-500/20 text-xs">
            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block mb-1 font-['JetBrains_Mono']">
              Autonomous Recommendation
            </span>
            <p className="text-slate-300 leading-relaxed">
              Consolidate onto <strong className="text-white">Claude Pro</strong> for architecture & UI documents, keep <strong className="text-white">Cursor Pro</strong> for daily engineering, and cancel <strong className="text-white">ChatGPT Pro</strong> to reclaim $240/year in capital.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
            <button
              onClick={() => {
                onConsolidate();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-[0_0_16px_rgba(16,185,129,0.3)] transition-all font-['Plus_Jakarta_Sans'] flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Apply Recommended Consolidation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
