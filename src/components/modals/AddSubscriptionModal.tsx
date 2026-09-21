import React, { useState } from 'react';
import { X, Plus, Sparkles, Check } from 'lucide-react';
import { Subscription, SubscriptionCategory, BillingCycle } from '../../types';

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (sub: Omit<Subscription, 'id'>) => void;
}

const PRESETS = [
  { name: 'Cursor Pro', provider: 'Anysphere', amount: 20.00, category: 'Developer & AI' as SubscriptionCategory, isAi: true, color: '#6366F1' },
  { name: 'Claude Pro', provider: 'Anthropic', amount: 20.00, category: 'Developer & AI' as SubscriptionCategory, isAi: true, color: '#D97706' },
  { name: 'ChatGPT Plus', provider: 'OpenAI', amount: 20.00, category: 'Developer & AI' as SubscriptionCategory, isAi: true, color: '#10A37F' },
  { name: 'Midjourney Standard', provider: 'Midjourney', amount: 30.00, category: 'Design & Creative' as SubscriptionCategory, isAi: true, color: '#0284C7' },
  { name: 'Linear Business', provider: 'Linear', amount: 12.00, category: 'Productivity & Storage' as SubscriptionCategory, isAi: false, color: '#5E6AD2' },
  { name: 'GitHub Copilot', provider: 'GitHub', amount: 10.00, category: 'Developer & AI' as SubscriptionCategory, isAi: true, color: '#8B5CF6' },
  { name: 'AWS Cloud Tier', provider: 'Amazon Web Services', amount: 45.00, category: 'Cloud & Infra' as SubscriptionCategory, isAi: false, color: '#FF9900' },
  { name: 'Perplexity Pro', provider: 'Perplexity AI', amount: 20.00, category: 'Developer & AI' as SubscriptionCategory, isAi: true, color: '#20B2AA' },
];

export const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [amount, setAmount] = useState('20.00');
  const [category, setCategory] = useState<SubscriptionCategory>('Developer & AI');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [isAiTool, setIsAiTool] = useState(true);
  const [renewalDate, setRenewalDate] = useState('2026-10-15');
  const [usageScore, setUsageScore] = useState<number>(4);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleApplyPreset = (p: typeof PRESETS[0]) => {
    setName(p.name);
    setProvider(p.provider);
    setAmount(p.amount.toFixed(2));
    setCategory(p.category);
    setIsAiTool(p.isAi);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedAmount = parseFloat(amount) || 0;
    const renewal = new Date(renewalDate);
    const now = new Date('2026-09-21');
    const diffTime = renewal.getTime() - now.getTime();
    const daysUntilRenewal = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    onAdd({
      name: name.trim(),
      provider: provider.trim() || name.trim(),
      iconName: isAiTool ? 'Sparkles' : 'Box',
      category,
      amount: parsedAmount,
      billedAmount: billingCycle === 'annual' ? parsedAmount * 12 : parsedAmount,
      billingCycle,
      status: 'active',
      renewalDate,
      daysUntilRenewal,
      usageScore,
      isAiTool,
      notes,
      color: isAiTool ? '#6366F1' : '#10B981',
      lastUsedDaysAgo: 1
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-[#0d1322] border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#111728]">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
              Register Recurring Subscription
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Quick Presets Carousel */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase font-['JetBrains_Mono']">
              Instant Presets
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1.5 pb-1 no-scrollbar">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 rounded-lg bg-[#141b2e] hover:bg-[#1e2740] border border-white/[0.06] text-xs text-slate-300 hover:text-white whitespace-nowrap transition-colors flex items-center gap-1 font-['Inter']"
                >
                  <span>{p.name}</span>
                  <span className="text-[10px] text-slate-500 font-['JetBrains_Mono']">${p.amount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">
                Subscription / Software Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cursor Pro"
                className="w-full px-3 py-2 rounded-xl bg-[#141b2e] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-indigo-500 font-['Inter']"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">
                Provider / Vendor
              </label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g. Anysphere Inc."
                className="w-full px-3 py-2 rounded-xl bg-[#141b2e] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-indigo-500 font-['Inter']"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">
                Monthly Amount (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#141b2e] border border-white/[0.08] text-white text-xs font-['JetBrains_Mono'] focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">
                Billing Cycle
              </label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#141b2e] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">
                Domain Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#141b2e] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Developer & AI">Developer & AI</option>
                <option value="Design & Creative">Design & Creative</option>
                <option value="Cloud & Infra">Cloud & Infra</option>
                <option value="Productivity & Storage">Productivity & Storage</option>
                <option value="Security & Utilities">Security & Utilities</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">
                Next Renewal Date
              </label>
              <input
                type="date"
                value={renewalDate}
                onChange={(e) => setRenewalDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#141b2e] border border-white/[0.08] text-white text-xs font-['JetBrains_Mono'] focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* AI Tool Flag */}
          <div className="p-3 rounded-xl bg-[#141b2e] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="text-xs font-semibold text-white block">
                  AI Compute / LLM Tool
                </span>
                <span className="text-[11px] text-slate-400">
                  Track in AI Optimizer & Redundancy Inspector
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAiTool(!isAiTool)}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                isAiTool ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${
                  isAiTool ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Usage Rating */}
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1 block">
              Estimated Usage Activity (1 = Dormant, 5 = Daily Core)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setUsageScore(score)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-['JetBrains_Mono'] transition-all ${
                    usageScore === score
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-[#141b2e] text-slate-400 hover:text-white'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.05]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-[0_0_16px_rgba(99,102,241,0.3)] transition-all font-['Plus_Jakarta_Sans']"
            >
              Add Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
