import React, { useState } from 'react';
import { Subscription, SubscriptionCategory, SubscriptionStatus } from '../../types';
import { CATEGORY_COLORS } from '../../data/mockSubscriptions';
import { 
  Search, 
  Plus, 
  Filter, 
  Sparkles, 
  PauseCircle, 
  PlayCircle, 
  Trash2, 
  ExternalLink,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

interface SubsViewProps {
  subscriptions: Subscription[];
  onAddSubscription: () => void;
  onToggleStatus: (subId: string) => void;
  onDeleteSubscription: (subId: string) => void;
  onSelectSubscription: (sub: Subscription) => void;
}

export const SubsView: React.FC<SubsViewProps> = ({
  subscriptions,
  onAddSubscription,
  onToggleStatus,
  onDeleteSubscription,
  onSelectSubscription
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [sortBy, setSortBy] = useState<'amount' | 'renewal' | 'usage' | 'name'>('amount');

  // Categories list
  const categories = ['All', 'Developer & AI', 'Design & Creative', 'Cloud & Infra', 'Productivity & Storage'];

  const filteredSubs = subscriptions
    .filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            sub.provider.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'amount') return b.amount - a.amount;
      if (sortBy === 'renewal') return a.daysUntilRenewal - b.daysUntilRenewal;
      if (sortBy === 'usage') return a.usageScore - b.usageScore;
      return a.name.localeCompare(b.name);
    });

  const totalMonthly = subscriptions
    .filter(s => s.status === 'active')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="px-4 py-3 space-y-4 pb-28">
      {/* Title & Add Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
            Subscription Registry
          </h2>
          <p className="text-xs text-slate-400 font-['Inter'] mt-0.5">
            {subscriptions.length} recurring accounts · ${totalMonthly.toFixed(2)} active monthly burn
          </p>
        </div>

        <button
          onClick={onAddSubscription}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-[0_0_12px_rgba(99,102,241,0.3)] font-['Plus_Jakarta_Sans']"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Tool</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search subscriptions, AI tools, providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0f1524] border border-white/[0.08] text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-['Inter']"
          />
        </div>

        {/* Category Scroll Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'bg-[#101522] text-slate-400 border border-white/[0.05] hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quick Sort & Status */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1 bg-[#101625] p-1 rounded-lg border border-white/[0.06]">
            {(['all', 'active', 'paused'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold capitalize font-['JetBrains_Mono'] ${
                  statusFilter === st ? 'bg-[#20293d] text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#101625] border border-white/[0.08] rounded-md px-2 py-1 text-[11px] text-white focus:outline-none font-['Inter']"
            >
              <option value="amount">Highest Cost</option>
              <option value="renewal">Next Renewal</option>
              <option value="usage">Lowest Usage</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscription cards list */}
      <div className="space-y-2.5">
        {filteredSubs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#0f1422]/60 border border-white/[0.06]">
            <p className="text-sm text-slate-400 font-medium">No subscriptions matched your filters.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setStatusFilter('all'); }}
              className="mt-3 text-xs text-indigo-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredSubs.map((sub) => (
            <div
              key={sub.id}
              className="p-3.5 rounded-xl bg-[#0f1524]/90 border border-white/[0.07] hover:border-indigo-500/30 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  onClick={() => onSelectSubscription(sub)}
                  className="flex items-start gap-3 cursor-pointer flex-1"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-['JetBrains_Mono'] text-white flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: sub.color || '#6366F1' }}
                  >
                    {sub.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
                        {sub.name}
                      </h4>
                      {sub.isAiTool && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                          AI Tool
                        </span>
                      )}
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase font-['JetBrains_Mono'] ${
                        sub.status === 'active'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                      }`}>
                        {sub.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 mt-0.5">
                      {sub.provider} · <span className="text-slate-300">{sub.category}</span>
                    </div>

                    {sub.notes && (
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">
                        "{sub.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Spend & cycle */}
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-white font-mono-num font-['JetBrains_Mono']">
                    ${sub.amount.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-400 capitalize">
                    per {sub.billingCycle === 'monthly' ? 'month' : 'year'}
                  </div>
                </div>
              </div>

              {/* Bottom bar with usage & quick controls */}
              <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Usage:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <span
                        key={dot}
                        className={`w-2 h-2 rounded-full ${
                          dot <= sub.usageScore
                            ? dot <= 1
                              ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                              : 'bg-indigo-400'
                            : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500 font-['JetBrains_Mono'] ml-1">
                    Renews in {sub.daysUntilRenewal}d
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleStatus(sub.id)}
                    className="px-2 py-1 rounded bg-[#161c2c] hover:bg-[#20283e] text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-['Plus_Jakarta_Sans']"
                  >
                    {sub.status === 'active' ? (
                      <>
                        <PauseCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Resume</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onDeleteSubscription(sub.id)}
                    title="Remove subscription"
                    className="p-1 rounded hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
