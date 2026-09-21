import React, { useState } from 'react';
import { Subscription, SubscriptionStatus } from '../types';
import { ChevronRight, Sparkles, AlertTriangle, PauseCircle, PlayCircle } from 'lucide-react';

interface ActiveSubsListProps {
  subscriptions: Subscription[];
  onManageAll: () => void;
  onSelectSubscription: (sub: Subscription) => void;
  onToggleStatus: (subId: string) => void;
}

export const ActiveSubsList: React.FC<ActiveSubsListProps> = ({
  subscriptions,
  onManageAll,
  onSelectSubscription,
  onToggleStatus
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all');

  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const pausedCount = subscriptions.filter(s => s.status === 'paused').length;

  const filteredSubs = subscriptions.filter(s => {
    if (filter === 'active') return s.status === 'active';
    if (filter === 'paused') return s.status === 'paused';
    return true;
  });

  return (
    <div className="px-4 py-2">
      {/* Header and Filter chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
          Active Subscriptions Overview
        </h3>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-['JetBrains_Mono'] transition-all ${
              filter === 'all'
                ? 'bg-[#252b3e] text-white border border-white/10 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All {subscriptions.length}
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold font-['JetBrains_Mono'] transition-all ${
              filter === 'active'
                ? 'bg-[#182e29] text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Active {activeCount}</span>
          </button>
          <button
            onClick={() => setFilter('paused')}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold font-['JetBrains_Mono'] transition-all ${
              filter === 'paused'
                ? 'bg-[#33241b] text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Paused {pausedCount}</span>
          </button>
        </div>
      </div>

      {/* Sublink to manage all */}
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={onManageAll}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors font-['Plus_Jakarta_Sans'] flex items-center gap-1 group"
        >
          <span>Manage All</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </button>
        <span className="text-[11px] text-slate-500 font-['JetBrains_Mono']">
          Showing {filteredSubs.length} of {subscriptions.length}
        </span>
      </div>

      {/* List items */}
      <div className="space-y-2">
        {filteredSubs.map((sub) => {
          const isUnderused = sub.usageScore <= 1 && sub.status === 'active';
          return (
            <div
              key={sub.id}
              className={`p-3 rounded-xl bg-[#0f1422]/90 border transition-all flex items-center justify-between gap-3 ${
                sub.status === 'paused'
                  ? 'border-white/[0.04] opacity-75'
                  : isUnderused
                  ? 'border-amber-500/20 hover:border-amber-500/40'
                  : 'border-white/[0.07] hover:border-indigo-500/30'
              }`}
            >
              {/* Left Identity */}
              <div
                onClick={() => onSelectSubscription(sub)}
                className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold font-['JetBrains_Mono'] text-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: sub.color || '#6366F1' }}
                >
                  {sub.name.slice(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate font-['Plus_Jakarta_Sans']">
                      {sub.name}
                    </span>
                    {sub.isAiTool && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                        AI
                      </span>
                    )}
                    {isUnderused && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
                        Low Usage
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-['Inter'] mt-0.5">
                    <span className="truncate">{sub.category}</span>
                    <span>·</span>
                    <span className="font-['JetBrains_Mono']">Usage: {sub.usageScore}/5</span>
                  </div>
                </div>
              </div>

              {/* Right: Amount & Pause/Resume toggle */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <div className="text-xs font-bold text-white font-mono-num font-['JetBrains_Mono']">
                    ${sub.amount.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">
                    {sub.billingCycle}
                  </div>
                </div>

                {/* Status Toggle Button */}
                <button
                  onClick={() => onToggleStatus(sub.id)}
                  title={sub.status === 'active' ? "Pause subscription" : "Resume subscription"}
                  className="p-1.5 rounded-lg bg-[#141b2c] hover:bg-[#1f2840] text-slate-400 hover:text-white transition-colors"
                >
                  {sub.status === 'active' ? (
                    <PauseCircle className="w-4 h-4 text-slate-400 hover:text-amber-400" />
                  ) : (
                    <PlayCircle className="w-4 h-4 text-emerald-400" />
                  )}
                </button>

                <button
                  onClick={() => onSelectSubscription(sub)}
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
