import React from 'react';
import { Bot, PlusCircle, RefreshCw, Sparkles } from 'lucide-react';

interface WatchdogHeroProps {
  onAddSubscription: () => void;
  onAuditStack: () => void;
  isAuditing?: boolean;
}

export const WatchdogHero: React.FC<WatchdogHeroProps> = ({
  onAddSubscription,
  onAuditStack,
  isAuditing = false
}) => {
  return (
    <div className="px-4 py-2">
      <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-[#121929]/95 via-[#0e1422]/90 to-[#0c101c]/95 border border-indigo-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        {/* Glow corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row with Icon */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#172036] border border-indigo-500/30 flex items-center justify-center text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Bot className="w-5 h-5 text-indigo-300" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                SubWise Autonomous Watchdog
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-['Inter']">
              Continuous audit across recurring software licenses & AI compute tiers.
            </p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2.5">
          {/* Add Subscription Button */}
          <button
            onClick={onAddSubscription}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs transition-all shadow-[0_0_16px_rgba(99,102,241,0.35)] active:scale-[0.98] font-['Plus_Jakarta_Sans']"
          >
            <PlusCircle className="w-4 h-4 text-indigo-200" />
            <span>Add Subscription</span>
          </button>

          {/* Audit Stack Button */}
          <button
            onClick={onAuditStack}
            disabled={isAuditing}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#141b2c] hover:bg-[#1b243b] border border-emerald-500/30 text-emerald-400 font-semibold text-xs transition-all active:scale-[0.98] font-['Plus_Jakarta_Sans']"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Auditing...' : 'Audit Stack'}</span>
          </button>

          {/* Refresh/Trigger Icon Button */}
          <button
            onClick={onAuditStack}
            title="Scan stack for price changes and duplicates"
            className="p-2.5 rounded-xl bg-[#141b2c] hover:bg-[#1b243b] border border-white/[0.08] text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
