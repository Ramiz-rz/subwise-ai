import React from 'react';
import { X, Receipt, Download, CreditCard, ShieldCheck, Check } from 'lucide-react';
import { Subscription } from '../../types';

interface InvoicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptions: Subscription[];
}

export const InvoicesModal: React.FC<InvoicesModalProps> = ({
  isOpen,
  onClose,
  subscriptions
}) => {
  if (!isOpen) return null;

  const exportCSV = () => {
    const headers = ['Name', 'Provider', 'Category', 'MonthlyAmount', 'Status', 'RenewalDate', 'IsAiTool'];
    const rows = subscriptions.map(s => [
      `"${s.name}"`,
      `"${s.provider}"`,
      `"${s.category}"`,
      s.amount.toFixed(2),
      s.status,
      s.renewalDate,
      s.isAiTool ? 'Yes' : 'No'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `subwise_subscriptions_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[#0d1322] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#111728]">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
              Billing Ledger & Accounting Export
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 font-['Inter'] text-xs">
          {/* Card Telemetry Status */}
          <div className="p-3 rounded-xl bg-[#141b2e] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-semibold text-white block">Corporate Visa (•••• 4291)</span>
                <span className="text-[11px] text-slate-400">Connected via Stripe Financial Connections</span>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              Synced
            </span>
          </div>

          {/* Recent Audited Charges */}
          <div className="text-[11px] font-semibold text-slate-400 uppercase font-['JetBrains_Mono'] pt-1">
            Recent Statement Activity
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {subscriptions.slice(0, 5).map((sub) => (
              <div key={sub.id} className="p-2.5 rounded-lg bg-[#111728] border border-white/[0.04] flex items-center justify-between">
                <div>
                  <span className="text-white font-semibold block">{sub.name}</span>
                  <span className="text-[10px] text-slate-400">Scheduled auto-charge · {sub.renewalDate}</span>
                </div>
                <span className="font-mono text-white font-bold font-['JetBrains_Mono']">
                  ${sub.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Export Button */}
          <div className="pt-2">
            <button
              onClick={exportCSV}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-[0_0_12px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2 font-['Plus_Jakarta_Sans']"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV for Accounting (QuickBooks / Xero)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
