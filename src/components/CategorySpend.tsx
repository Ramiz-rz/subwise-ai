import React from 'react';
import { CATEGORY_COLORS } from '../data/mockSubscriptions';
import { Subscription, SubscriptionCategory } from '../types';

interface CategorySpendProps {
  subscriptions: Subscription[];
  totalSpend: number;
}

export const CategorySpend: React.FC<CategorySpendProps> = ({
  subscriptions,
  totalSpend
}) => {
  // Aggregate spend by category for active subscriptions
  const categoryTotals = subscriptions
    .filter(s => s.status === 'active')
    .reduce((acc, sub) => {
      acc[sub.category] = (acc[sub.category] || 0) + sub.amount;
      return acc;
    }, {} as Record<SubscriptionCategory, number>);

  const categories = Object.keys(CATEGORY_COLORS) as SubscriptionCategory[];

  return (
    <div className="px-4 py-2">
      <div className="p-4 rounded-xl bg-[#0f1422]/90 border border-white/[0.07] backdrop-blur-md">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
              Category Spend Distribution
            </h3>
            <p className="text-xs text-slate-400 font-['Inter'] mt-0.5">
              Real-time SaaS budget breakdown by domain.
            </p>
          </div>

          <div className="text-right">
            <span className="text-sm font-bold text-white font-mono-num font-['JetBrains_Mono']">
              ${totalSpend.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-['Inter']"> / mo</span>
          </div>
        </div>

        {/* Multi-segmented Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#181f33] overflow-hidden flex mb-3.5">
          {totalSpend > 0 ? (
            categories.map(cat => {
              const amount = categoryTotals[cat] || 0;
              if (amount === 0) return null;
              const pct = (amount / totalSpend) * 100;
              return (
                <div
                  key={cat}
                  style={{
                    width: `${pct}%`,
                    backgroundColor: CATEGORY_COLORS[cat] || '#6366F1'
                  }}
                  className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                  title={`${cat}: $${amount.toFixed(2)} (${pct.toFixed(0)}%)`}
                />
              );
            })
          ) : (
            <div className="w-full h-full bg-[#1c2438] rounded-full" />
          )}
        </div>

        {/* Category Legend Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map(cat => {
            const amount = categoryTotals[cat] || 0;
            const pct = totalSpend > 0 ? Math.round((amount / totalSpend) * 100) : 0;
            return (
              <div
                key={cat}
                className="flex items-center justify-between p-2 rounded-lg bg-[#141b2c]/60 border border-white/[0.04]"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                  />
                  <span className="text-[11px] font-medium text-slate-300 truncate font-['Inter']">
                    {cat.split(' ')[0]}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-white font-['JetBrains_Mono']">
                  ${amount.toFixed(0)}
                  <span className="text-slate-500 font-normal ml-1">({pct}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
