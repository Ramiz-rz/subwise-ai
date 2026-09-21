import React, { useState } from 'react';
import { X, Sparkles, PauseCircle, PlayCircle, Trash2, Calendar, DollarSign, Activity, FileText, Check } from 'lucide-react';
import { Subscription } from '../../types';

interface SubscriptionDetailModalProps {
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: Subscription) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SubscriptionDetailModal: React.FC<SubscriptionDetailModalProps> = ({
  subscription,
  isOpen,
  onClose,
  onUpdate,
  onToggleStatus,
  onDelete
}) => {
  if (!isOpen || !subscription) return null;

  const [notes, setNotes] = useState(subscription.notes || '');
  const [usageScore, setUsageScore] = useState(subscription.usageScore);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    onUpdate({
      ...subscription,
      notes,
      usageScore
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[#0d1322] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] bg-[#111728] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm"
              style={{ backgroundColor: subscription.color || '#6366F1' }}
            >
              {subscription.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                  {subscription.name}
                </h3>
                {subscription.isAiTool && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-500/30 flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    AI
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400">{subscription.provider}</span>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Details Body */}
        <div className="p-4 space-y-3.5 font-['Inter'] text-xs">
          {/* Spend & Frequency */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-[#141b2e] border border-white/[0.06]">
              <span className="text-slate-400 block text-[11px]">Normalized Spend</span>
              <span className="text-lg font-bold text-white font-['JetBrains_Mono']">
                ${subscription.amount.toFixed(2)}/mo
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#141b2e] border border-white/[0.06]">
              <span className="text-slate-400 block text-[11px]">Next Renewal</span>
              <span className="text-xs font-bold text-white font-['JetBrains_Mono'] block mt-1">
                {subscription.renewalDate}
              </span>
              <span className="text-[10px] text-slate-500">In {subscription.daysUntilRenewal} days</span>
            </div>
          </div>

          {/* Usage Score Slider */}
          <div className="p-3 rounded-xl bg-[#141b2e] border border-white/[0.06]">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-semibold text-slate-300">Activity Rating: {usageScore}/5</span>
              <span className="text-[10px] text-slate-400">
                {usageScore <= 1 ? 'Dormant / Underused' : usageScore >= 4 ? 'Daily Essential' : 'Moderate'}
              </span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setUsageScore(s)}
                  className={`flex-1 py-1 rounded text-xs font-bold font-['JetBrains_Mono'] ${
                    usageScore === s ? 'bg-indigo-600 text-white' : 'bg-[#1e2740] text-slate-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1 block">
              Autonomous Watchdog Notes & Justification
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal procurement notes..."
              className="w-full p-2.5 rounded-xl bg-[#141b2e] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status & Deletion */}
          <div className="pt-2 flex items-center justify-between border-t border-white/[0.06]">
            <button
              onClick={() => onToggleStatus(subscription.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141b2e] hover:bg-[#1e2740] text-slate-300 hover:text-white text-xs"
            >
              {subscription.status === 'active' ? (
                <>
                  <PauseCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pause Tool</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Resume Tool</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onDelete(subscription.id);
                  onClose();
                }}
                className="p-2 rounded-lg hover:bg-rose-950/40 text-slate-500 hover:text-rose-400"
                title="Remove subscription record"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
              >
                {savedToast ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{savedToast ? 'Saved' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
