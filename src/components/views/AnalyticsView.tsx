import React from 'react';
import { TrendingUp, PieChart, Calendar, DollarSign, Shield, Zap } from 'lucide-react';
import { Subscription } from '../../types';
import { CATEGORY_COLORS } from '../../data/mockSubscriptions';

interface AnalyticsViewProps {
  subscriptions: Subscription[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ subscriptions }) => {
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const totalMonthly = activeSubs.reduce((acc, curr) => acc + curr.amount, 0);
  const totalAnnual = totalMonthly * 12;
  const aiSpend = activeSubs.filter(s => s.isAiTool).reduce((acc, curr) => acc + curr.amount, 0);
  const aiRatio = totalMonthly > 0 ? Math.round((aiSpend / totalMonthly) * 100) : 0;

  // Monthly historical trend (last 6 months)
  const monthlyTrend = [
    { month: 'Apr', spend: Math.round(totalMonthly * 0.82) },
    { month: 'May', spend: Math.round(totalMonthly * 0.88) },
    { month: 'Jun', spend: Math.round(totalMonthly * 0.94) },
    { month: 'Jul', spend: Math.round(totalMonthly * 0.97) },
    { month: 'Aug', spend: Math.round(totalMonthly * 0.99) },
    { month: 'Sep', spend: Math.round(totalMonthly) }
  ];

  const maxSpend = Math.max(...monthlyTrend.map(m => m.spend), 100);

  return (
    <div className="px-4 py-3 space-y-4 pb-28">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
            Fiscal Telemetry & Analytics
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-['Inter'] mt-0.5">
          Historical SaaS trajectory, run-rate velocity, and capital allocation
        </p>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#0f1524] border border-white/[0.08]">
          <span className="text-[10px] text-slate-400 uppercase font-['JetBrains_Mono']">
            Normalized Burn
          </span>
          <div className="text-xl font-bold text-white font-['JetBrains_Mono'] mt-1">
            ${totalMonthly.toFixed(2)}
          </div>
          <span className="text-[10px] text-emerald-400">/month</span>
        </div>

        <div className="p-3 rounded-xl bg-[#0f1524] border border-white/[0.08]">
          <span className="text-[10px] text-slate-400 uppercase font-['JetBrains_Mono']">
            Annual Run Rate
          </span>
          <div className="text-xl font-bold text-white font-['JetBrains_Mono'] mt-1">
            ${totalAnnual.toFixed(0)}
          </div>
          <span className="text-[10px] text-slate-500">12m forward</span>
        </div>

        <div className="p-3 rounded-xl bg-[#0f1524] border border-white/[0.08]">
          <span className="text-[10px] text-slate-400 uppercase font-['JetBrains_Mono']">
            AI Compute Share
          </span>
          <div className="text-xl font-bold text-indigo-400 font-['JetBrains_Mono'] mt-1">
            {aiRatio}%
          </div>
          <span className="text-[10px] text-indigo-300/70">${aiSpend.toFixed(0)}/mo</span>
        </div>

        <div className="p-3 rounded-xl bg-[#0f1524] border border-emerald-500/20">
          <span className="text-[10px] text-emerald-400 uppercase font-['JetBrains_Mono']">
            Audit Health Score
          </span>
          <div className="text-xl font-bold text-emerald-400 font-['JetBrains_Mono'] mt-1">
            86 / 100
          </div>
          <span className="text-[10px] text-emerald-400/80">Grade: A-</span>
        </div>
      </div>

      {/* 6-Month Spend Trend Bar Chart */}
      <div className="p-4 rounded-xl bg-[#0f1524] border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
              Historical Run-Rate Trend
            </h3>
            <p className="text-xs text-slate-400 font-['Inter']">Trailing 6-month monthly spend velocity</p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 font-['JetBrains_Mono']">
            +18% 6M expansion
          </span>
        </div>

        <div className="h-36 flex items-end gap-3 pt-4 pb-1 px-2">
          {monthlyTrend.map((item, index) => {
            const heightPct = Math.round((item.spend / maxSpend) * 100);
            const isLatest = index === monthlyTrend.length - 1;

            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] text-slate-400 font-['JetBrains_Mono'] opacity-0 group-hover:opacity-100 transition-opacity">
                  ${item.spend}
                </span>
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    isLatest
                      ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                      : 'bg-[#1e273d] group-hover:bg-[#283552]'
                  }`}
                />
                <span className={`text-[11px] font-semibold ${isLatest ? 'text-white' : 'text-slate-500'}`}>
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spend Distribution by Frequency */}
      <div className="p-4 rounded-xl bg-[#0f1524] border border-white/[0.08]">
        <h3 className="text-sm font-bold text-white mb-2 font-['Plus_Jakarta_Sans']">
          Billing Frequency Breakdown
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Monthly Recurrent ({activeSubs.filter(s => s.billingCycle === 'monthly').length} tools)</span>
              <span className="font-bold text-white font-['JetBrains_Mono']">
                ${activeSubs.filter(s => s.billingCycle === 'monthly').reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}/mo
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#182033] overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Annualized Contracts ({activeSubs.filter(s => s.billingCycle === 'annual').length} tools)</span>
              <span className="font-bold text-white font-['JetBrains_Mono']">
                ${activeSubs.filter(s => s.billingCycle === 'annual').reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}/mo
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#182033] overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '15%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
