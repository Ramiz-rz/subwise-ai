import React from 'react';
import { LayoutGrid, FileText, Network, PiggyBank, TrendingUp } from 'lucide-react';
import { ViewTab } from '../types';

interface BottomNavProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  savingsBadge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  savingsBadge
}) => {
  const tabs = [
    { id: 'dashboard' as ViewTab, label: 'Dashboard', icon: LayoutGrid },
    { id: 'subs' as ViewTab, label: 'Subs', icon: FileText },
    { id: 'ai_stack' as ViewTab, label: 'AI Stack', icon: Network },
    { id: 'savings' as ViewTab, label: 'Savings', icon: PiggyBank, badge: savingsBadge },
    { id: 'analytics' as ViewTab, label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 px-3 flex justify-center pointer-events-none">
      <nav className="pointer-events-auto w-full max-w-md bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-2 py-2 shadow-[0_12px_36px_rgba(0,0,0,0.6)] flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 group ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? 'text-indigo-400 scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]'
                      : 'group-hover:scale-105'
                  }`}
                />
                {tab.badge && tab.badge > 0 && !isActive && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                )}
              </div>

              <span
                className={`text-[10px] mt-1 font-semibold tracking-tight transition-colors font-['Plus_Jakarta_Sans'] ${
                  isActive ? 'text-white font-bold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>

              {/* Centered glowing dot below active tab */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,1)] mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
