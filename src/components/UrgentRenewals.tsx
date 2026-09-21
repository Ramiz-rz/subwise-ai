import React from 'react';
import { Clock, AlertCircle, CheckCircle2, ChevronRight, ShieldAlert } from 'lucide-react';
import { Subscription } from '../types';

interface UrgentRenewalsProps {
  subscriptions: Subscription[];
  onSelectSubscription: (sub: Subscription) => void;
  onSnoozeRenewal: (subId: string) => void;
}

export const UrgentRenewals: React.FC<UrgentRenewalsProps> = ({
  subscriptions,
  onSelectSubscription,
  onSnoozeRenewal
}) => {
  // Urgent renewals in next 7 days
  const urgent = subscriptions.filter(s => s.status === 'active' && s.daysUntilRenewal <= 7);

  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
            Urgent Renewals (Next 7 Days)
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-['Inter']">
          Auto-charge alerts
        </span>
      </div>

      {urgent.length === 0 ? (
        <div className="p-3.5 rounded-xl bg-[#0f1422]/60 border border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No recurring renewals due in the next 7 days.</span>
          </div>
          <span className="text-[11px] text-slate-500 font-['JetBrains_Mono']">All Clear</span>
        </div>
      ) : (
        <div className="space-y-2">
          {urgent.map((sub) => (
            <div
              key={sub.id}
              className="p-3 rounded-xl bg-[#0f1422]/90 border border-white/[0.07] hover:border-indigo-500/30 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-['JetBrains_Mono'] text-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: sub.color || '#6366F1' }}
                >
                  {sub.name.slice(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white truncate font-['Plus_Jakarta_Sans']">
                      {sub.name}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold font-['JetBrains_Mono'] ${
                      sub.daysUntilRenewal <= 3 
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                    }`}>
                      In {sub.daysUntilRenewal}d
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate font-['Inter']">
                    {sub.provider} · Renews {sub.renewalDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right">
                  <div className="text-xs font-bold text-white font-mono-num font-['JetBrains_Mono']">
                    ${sub.amount.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400">/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}</div>
                </div>

                <button
                  onClick={() => onSelectSubscription(sub)}
                  className="p-1 rounded-md hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
                  title="Inspect renewal"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
