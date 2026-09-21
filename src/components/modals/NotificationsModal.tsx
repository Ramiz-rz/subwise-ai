import React from 'react';
import { X, Bell, AlertTriangle, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Subscription } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  urgentSubscriptions: Subscription[];
  onSelectSubscription: (sub: Subscription) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  urgentSubscriptions,
  onSelectSubscription
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[#0d1322] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#111728]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
              Auto-Charge Alerts & Watchdog Warnings
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 font-['Inter'] max-h-[75vh] overflow-y-auto">
          {/* Urgent charge alerts */}
          <div className="text-[11px] font-semibold text-slate-400 uppercase font-['JetBrains_Mono']">
            Impending Auto-Charges (Next 7 Days)
          </div>

          {urgentSubscriptions.map((sub) => (
            <div
              key={sub.id}
              onClick={() => {
                onSelectSubscription(sub);
                onClose();
              }}
              className="p-3 rounded-xl bg-[#141b2e] hover:bg-[#1b253d] border border-white/[0.06] cursor-pointer transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: sub.color || '#6366F1' }}
                >
                  {sub.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{sub.name}</span>
                    <span className="text-[10px] text-rose-400 font-bold font-['JetBrains_Mono']">
                      Renews in {sub.daysUntilRenewal}d
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Auto-debit of ${sub.amount.toFixed(2)} on {sub.renewalDate}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </div>
          ))}

          {/* Watchdog intelligence notice */}
          <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-indigo-300 font-['JetBrains_Mono'] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Watchdog Policy Active
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              SubWise checks your SaaS accounts daily at 00:00 UTC. 3-day and 24-hour notifications will sound before any credit card charge executes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#111728] border-t border-white/[0.06] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#182136] hover:bg-[#202c48] text-xs font-semibold text-white"
          >
            Acknowledge All
          </button>
        </div>
      </div>
    </div>
  );
};
