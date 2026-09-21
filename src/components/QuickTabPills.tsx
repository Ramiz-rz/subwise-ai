import React from 'react';
import { LayoutGrid, ListFilter, SlidersHorizontal } from 'lucide-react';
import { ViewTab } from '../types';

interface QuickTabPillsProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  subscriptionCount: number;
  onOpenQuickFilter?: () => void;
}

export const QuickTabPills: React.FC<QuickTabPillsProps> = ({
  currentTab,
  onSelectTab,
  subscriptionCount,
  onOpenQuickFilter
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-2">
        {/* Dashboard Pill */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all font-['Plus_Jakarta_Sans'] ${
            currentTab === 'dashboard'
              ? 'bg-[#1e2538] text-white border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
              : 'bg-[#101420] text-slate-400 border border-white/[0.06] hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
          <span>Dashboard</span>
        </button>

        {/* Subscriptions Pill with Count */}
        <button
          onClick={() => onSelectTab('subs')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all font-['Plus_Jakarta_Sans'] ${
            currentTab === 'subs'
              ? 'bg-[#1e2538] text-white border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
              : 'bg-[#101420] text-slate-400 border border-white/[0.06] hover:text-slate-200'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5 text-indigo-300" />
          <span>Subscriptions</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#29304a] text-indigo-200 font-['JetBrains_Mono']">
            {subscriptionCount}
          </span>
        </button>
      </div>

      {/* Settings / quick filter toggle */}
      <button
        onClick={onOpenQuickFilter}
        aria-label="Filter Options"
        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
};
