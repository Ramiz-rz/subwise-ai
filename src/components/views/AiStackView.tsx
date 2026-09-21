import React, { useState } from 'react';
import { Sparkles, Check, X, AlertTriangle, ShieldCheck, Cpu, ArrowRight, Zap, Layers } from 'lucide-react';
import { Subscription } from '../../types';

interface AiStackViewProps {
  subscriptions: Subscription[];
  onConsolidate: () => void;
  onNavigateToSavings: () => void;
}

export const AiStackView: React.FC<AiStackViewProps> = ({
  subscriptions,
  onConsolidate,
  onNavigateToSavings
}) => {
  const [selectedModel, setSelectedModel] = useState<string>('claude');

  const aiSubs = subscriptions.filter(s => s.isAiTool);
  const totalAiSpend = aiSubs.reduce((acc, curr) => acc + (curr.status === 'active' ? curr.amount : 0), 0);

  // Capability matrix data
  const matrixItems = [
    {
      id: 'claude',
      name: 'Claude Pro',
      provider: 'Anthropic',
      monthly: 20.00,
      codeRating: '9.8/10',
      reasoningRating: '9.6/10',
      agentWorkflows: 'Artifacts + MCP',
      contextWindow: '200K tokens',
      searchGrounding: 'Moderate',
      redundancyFlag: 'Overlaps with ChatGPT Pro',
      color: '#D97706',
      status: 'active'
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT Pro',
      provider: 'OpenAI',
      monthly: 20.00,
      codeRating: '9.2/10',
      reasoningRating: '9.8/10',
      agentWorkflows: 'Deep Research + Voice',
      contextWindow: '128K tokens',
      searchGrounding: 'Native Web Browsing',
      redundancyFlag: 'Overlaps with Claude Pro',
      color: '#10A37F',
      status: 'active'
    },
    {
      id: 'cursor',
      name: 'Cursor Pro',
      provider: 'Anysphere',
      monthly: 20.00,
      codeRating: '10/10',
      reasoningRating: '9.4/10',
      agentWorkflows: 'Multi-file composer agent',
      contextWindow: 'Direct IDE Buffer',
      searchGrounding: 'Repo codebase index',
      redundancyFlag: 'Renders Copilot duplicate',
      color: '#6366F1',
      status: 'active'
    },
    {
      id: 'copilot',
      name: 'GitHub Copilot',
      provider: 'Microsoft',
      monthly: 10.00,
      codeRating: '8.0/10',
      reasoningRating: '7.8/10',
      agentWorkflows: 'Inline autocomplete',
      contextWindow: 'Single file snippet',
      searchGrounding: 'GitHub code search',
      redundancyFlag: '100% duplicate of Cursor',
      color: '#8B5CF6',
      status: 'active'
    }
  ];

  return (
    <div className="px-4 py-3 space-y-4 pb-28">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
              AI Stack Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-['Inter'] mt-0.5">
            Model intelligence overlap analysis & token license optimization
          </p>
        </div>

        <div className="text-right">
          <div className="text-sm font-bold text-indigo-300 font-mono-num font-['JetBrains_Mono']">
            ${totalAiSpend.toFixed(2)}/mo
          </div>
          <div className="text-[10px] text-slate-400">Total AI Compute</div>
        </div>
      </div>

      {/* Redundancy Alert Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-[#161d2d] to-[#121826] border border-amber-500/30">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex-shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider font-['JetBrains_Mono']">
                Redundancy Detected: 2 Primary LLM Subscriptions
              </h4>
              <span className="text-xs font-bold text-emerald-400 font-['JetBrains_Mono']">
                Save $30.00/mo
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed font-['Inter']">
              You are paying for both <strong className="text-white">Claude Pro ($20)</strong> and <strong className="text-white">ChatGPT Pro ($20)</strong> alongside <strong className="text-white">Cursor Pro ($20)</strong> and <strong className="text-white">GitHub Copilot ($10)</strong>. Consolidating eliminates $30/mo ($360/yr) with 0% workflow penalty.
            </p>

            <div className="mt-3 flex items-center gap-2.5">
              <button
                onClick={onConsolidate}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] font-['Plus_Jakarta_Sans'] flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Auto-Consolidate Stack</span>
              </button>

              <button
                onClick={onNavigateToSavings}
                className="px-3 py-1.5 rounded-lg bg-[#1a2336] hover:bg-[#222e47] text-slate-300 hover:text-white text-xs transition-colors font-['Plus_Jakarta_Sans']"
              >
                Simulate Impact
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="rounded-xl bg-[#0f1524] border border-white/[0.08] overflow-hidden">
        <div className="p-3 bg-[#131b2e] border-b border-white/[0.06] flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider font-['JetBrains_Mono']">
            Tier-1 Model Capabilities
          </span>
          <span className="text-[11px] text-slate-400">Side-by-side benchmark</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-['Inter']">
            <thead className="bg-[#0b101c] text-slate-400 text-[11px] font-semibold border-b border-white/[0.05]">
              <tr>
                <th className="p-3">Platform</th>
                <th className="p-3">Cost</th>
                <th className="p-3">Coding</th>
                <th className="p-3">Reasoning</th>
                <th className="p-3">Unique Superpower</th>
                <th className="p-3">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {matrixItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 font-medium text-white">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-slate-300 font-['JetBrains_Mono']">
                    ${item.monthly.toFixed(2)}/mo
                  </td>
                  <td className="p-3 text-slate-200">{item.codeRating}</td>
                  <td className="p-3 text-slate-200">{item.reasoningRating}</td>
                  <td className="p-3 text-slate-300 text-[11px]">{item.agentWorkflows}</td>
                  <td className="p-3">
                    {item.name === 'Cursor Pro' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                        Keep (Anchor)
                      </span>
                    ) : item.name === 'GitHub Copilot' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950 text-rose-300 border border-rose-500/30">
                        Cancel (Duplicate)
                      </span>
                    ) : item.name === 'ChatGPT Pro' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-500/30">
                        Consolidate
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        Primary LLM
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Streamlined Setup */}
      <div className="p-4 rounded-xl bg-[#0f1524] border border-white/[0.08]">
        <h3 className="text-sm font-bold text-white mb-2 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Recommended Streamlined Architecture
        </h3>
        <div className="space-y-2 text-xs text-slate-300 font-['Inter']">
          <div className="p-2.5 rounded-lg bg-[#141c2e] border border-white/[0.04] flex items-center justify-between">
            <div>
              <span className="font-semibold text-white">1. Developer Core: Cursor Pro ($20/mo)</span>
              <p className="text-[11px] text-slate-400">Provides Claude 3.7 Sonnet + GPT-4o autocomplete, composer, and terminal agent.</p>
            </div>
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          </div>

          <div className="p-2.5 rounded-lg bg-[#141c2e] border border-white/[0.04] flex items-center justify-between">
            <div>
              <span className="font-semibold text-white">2. Long-Form Writing & Architecture: Claude Pro ($20/mo)</span>
              <p className="text-[11px] text-slate-400">Keeps Artifacts, Projects, and 200k context for architectural docs.</p>
            </div>
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          </div>

          <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 flex items-center justify-between text-rose-300">
            <div>
              <span className="font-semibold">3. Retire: GitHub Copilot & ChatGPT Pro (-$30/mo)</span>
              <p className="text-[11px] text-rose-400/80">Covered completely by the above two tools. No capability lost.</p>
            </div>
            <X className="w-4 h-4 text-rose-400 flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};
