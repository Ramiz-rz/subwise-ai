import React, { useState } from 'react';
import { 
  TrendingUp, 
  PieChart, 
  Calendar, 
  DollarSign, 
  Shield, 
  Zap, 
  Download, 
  FileSpreadsheet, 
  Check, 
  Eye, 
  EyeOff, 
  FileText, 
  Table,
  Target,
  AlertTriangle
} from 'lucide-react';
import { Subscription, SpendingCapConfig } from '../../types';
import { CATEGORY_COLORS } from '../../data/mockSubscriptions';
import { PredictiveGrowthChart } from '../charts/PredictiveGrowthChart';
import { 
  generateComprehensiveCSV, 
  generateTrendsCSV, 
  generateSubscriptionsCSV, 
  triggerCSVDownload 
} from '../../utils/csvExport';

interface AnalyticsViewProps {
  subscriptions: Subscription[];
  budgetConfig?: SpendingCapConfig;
  onOpenBudgetCapModal?: () => void;
  initialAnnualized?: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ 
  subscriptions,
  budgetConfig,
  onOpenBudgetCapModal,
  initialAnnualized = false
}) => {
  const [isAnnualized, setIsAnnualized] = useState<boolean>(initialAnnualized);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [previewType, setPreviewType] = useState<'comprehensive' | 'trends' | 'subscriptions'>('comprehensive');
  const [includePaused, setIncludePaused] = useState<boolean>(true);

  const filteredSubs = includePaused 
    ? subscriptions 
    : subscriptions.filter(s => s.status === 'active');

  const activeSubs = filteredSubs.filter(s => s.status === 'active');
  const totalMonthly = activeSubs.reduce((acc, curr) => acc + curr.amount, 0);
  const totalAnnual = totalMonthly * 12;

  // Base spending multiplier for monthly vs annualized mode
  const multiplier = isAnnualized ? 12 : 1;
  const unitLabel = isAnnualized ? '/yr' : '/mo';
  const periodLabel = isAnnualized ? 'Annualized' : 'Monthly';

  // Primary active spend based on toggle
  const displaySpend = totalMonthly * multiplier;

  const aiSpendMonthly = activeSubs.filter(s => s.isAiTool).reduce((acc, curr) => acc + curr.amount, 0);
  const aiSpend = aiSpendMonthly * multiplier;
  const aiRatio = totalMonthly > 0 ? Math.round((aiSpendMonthly / totalMonthly) * 100) : 0;

  // Historical trend (last 6 months, showing either monthly velocity or 12x annualized run-rate pace)
  const monthlyTrend = [
    { month: 'Apr', spend: Math.round(totalMonthly * 0.82 * multiplier) },
    { month: 'May', spend: Math.round(totalMonthly * 0.88 * multiplier) },
    { month: 'Jun', spend: Math.round(totalMonthly * 0.94 * multiplier) },
    { month: 'Jul', spend: Math.round(totalMonthly * 0.97 * multiplier) },
    { month: 'Aug', spend: Math.round(totalMonthly * 0.99 * multiplier) },
    { month: 'Sep', spend: Math.round(totalMonthly * multiplier) }
  ];

  const maxSpend = Math.max(...monthlyTrend.map(m => m.spend), isAnnualized ? 1200 : 100);

  const currentDate = new Date().toISOString().slice(0, 10);

  const handleExportComprehensive = () => {
    const csv = generateComprehensiveCSV(filteredSubs, monthlyTrend, budgetConfig);
    const filename = `subwise_subscriptions_and_trends_${currentDate}.csv`;
    triggerCSVDownload(csv, filename);
    setExportFeedback(filename);
    setTimeout(() => setExportFeedback(null), 3500);
  };

  const handleExportTrends = () => {
    const csv = generateTrendsCSV(filteredSubs, monthlyTrend);
    const filename = `subwise_spending_trends_${currentDate}.csv`;
    triggerCSVDownload(csv, filename);
    setExportFeedback(filename);
    setTimeout(() => setExportFeedback(null), 3500);
  };

  const handleExportSubscriptions = () => {
    const csv = generateSubscriptionsCSV(filteredSubs);
    const filename = `subwise_subscriptions_inventory_${currentDate}.csv`;
    triggerCSVDownload(csv, filename);
    setExportFeedback(filename);
    setTimeout(() => setExportFeedback(null), 3500);
  };

  // Preview content based on active previewType
  const currentPreviewCSV = previewType === 'comprehensive'
    ? generateComprehensiveCSV(filteredSubs, monthlyTrend, budgetConfig)
    : previewType === 'trends'
      ? generateTrendsCSV(filteredSubs, monthlyTrend)
      : generateSubscriptionsCSV(filteredSubs);

  return (
    <div className="px-4 py-3 space-y-4 pb-28">
      {/* Title & Quick Export Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
              Fiscal Telemetry & Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-['Inter'] mt-0.5">
            {isAnnualized 
              ? 'Annualized 12-month forward run-rate projections, yearly velocity, and long-term commitments' 
              : 'Historical monthly SaaS trajectory, run-rate velocity, and capital allocation'}
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Global Annualized View Toggle */}
          <div 
            id="annualized-view-toggle-container"
            className="flex items-center p-1 rounded-xl bg-[#0f1524] border border-white/[0.08] shadow-inner"
          >
            <button
              id="analytics-monthly-toggle-btn"
              type="button"
              onClick={() => setIsAnnualized(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-['Plus_Jakarta_Sans'] transition-all ${
                !isAnnualized
                  ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Monthly</span>
            </button>
            <button
              id="analytics-annualized-toggle-btn"
              type="button"
              onClick={() => setIsAnnualized(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-['Plus_Jakarta_Sans'] transition-all ${
                isAnnualized
                  ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Annualized (12x)</span>
            </button>
          </div>

          {/* Header Action Button */}
          <button
            id="export-csv-header-btn"
            onClick={handleExportComprehensive}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#182136] hover:bg-[#202c48] border border-white/[0.08] hover:border-indigo-500/40 text-white font-medium text-xs shadow-sm transition-all cursor-pointer font-['Plus_Jakarta_Sans']"
            title="Download comprehensive CSV export"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Annualized Projection Notice Pill */}
      {isAnnualized && (
        <div 
          id="annualized-mode-indicator"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs shadow-sm animate-in fade-in duration-150"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong>Annualized Mode Active:</strong> All metrics, run-rate charts, category splits, and budget thresholds are calculated on a <strong>12-month forward projection</strong> (${totalAnnual.toFixed(2)}/yr total commitment).
            </span>
          </div>
          <button
            onClick={() => setIsAnnualized(false)}
            className="text-[11px] underline text-indigo-300 hover:text-white shrink-0 ml-2"
          >
            Reset to Monthly
          </button>
        </div>
      )}

      {/* Export Confirmation Toast Banner */}
      {exportFeedback && (
        <div 
          id="export-success-banner"
          className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Exported <strong className="font-mono text-white">{exportFeedback}</strong> for external records.
            </span>
          </div>
          <span className="text-[11px] text-emerald-400/80 font-mono">RFC 4180 CSV</span>
        </div>
      )}

      {/* Monthly/Annual Spending Cap Telemetry Banner */}
      {budgetConfig && (
        <div className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          !budgetConfig.isEnabled
            ? 'bg-[#0f1524] border-white/[0.08]'
            : totalMonthly >= budgetConfig.monthlyCap
              ? 'bg-rose-950/30 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
              : totalMonthly >= budgetConfig.monthlyCap * 0.8
                ? 'bg-amber-950/30 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
                : 'bg-indigo-950/20 border-indigo-500/30'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg shrink-0 ${
              !budgetConfig.isEnabled
                ? 'bg-slate-800 text-slate-400'
                : totalMonthly >= budgetConfig.monthlyCap
                  ? 'bg-rose-900/60 text-rose-300'
                  : totalMonthly >= budgetConfig.monthlyCap * 0.8
                    ? 'bg-amber-900/60 text-amber-300'
                    : 'bg-indigo-900/60 text-indigo-300'
            }`}>
              {budgetConfig.isEnabled && (totalMonthly >= budgetConfig.monthlyCap || totalMonthly >= budgetConfig.monthlyCap * 0.8) ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <Target className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-['Plus_Jakarta_Sans']">
                  {isAnnualized ? 'Annualized Budget Cap Telemetry' : 'Monthly Spending Cap Telemetry'}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-['JetBrains_Mono'] uppercase ${
                  !budgetConfig.isEnabled
                    ? 'bg-slate-800 text-slate-400'
                    : totalMonthly >= budgetConfig.monthlyCap
                      ? 'bg-rose-900 text-rose-200 border border-rose-500/40 animate-pulse'
                      : totalMonthly >= budgetConfig.monthlyCap * 0.8
                        ? 'bg-amber-900 text-amber-200 border border-amber-500/40'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {!budgetConfig.isEnabled 
                    ? 'Disabled' 
                    : totalMonthly >= budgetConfig.monthlyCap 
                      ? 'Cap Exceeded' 
                      : totalMonthly >= budgetConfig.monthlyCap * 0.8 
                        ? '80% Warning' 
                        : 'Optimal'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {budgetConfig.isEnabled ? (
                  <>
                    {isAnnualized ? (
                      <>
                        Annual commitment is <strong className="text-white font-mono">${(totalMonthly * 12).toFixed(2)}</strong> against{' '}
                        an annualized cap target of <strong className="text-white font-mono">${(budgetConfig.monthlyCap * 12).toFixed(2)}</strong> (
                        {((totalMonthly / budgetConfig.monthlyCap) * 100).toFixed(0)}%).{' '}
                        {totalMonthly >= budgetConfig.monthlyCap
                          ? `Annual overrun pace of $${((totalMonthly - budgetConfig.monthlyCap) * 12).toFixed(2)}/yr.`
                          : `$${Math.max(0, (budgetConfig.monthlyCap - totalMonthly) * 12).toFixed(2)} annual safety cushion.`}
                      </>
                    ) : (
                      <>
                        Active spend is <strong className="text-white font-mono">${totalMonthly.toFixed(2)}</strong> of{' '}
                        <strong className="text-white font-mono">${budgetConfig.monthlyCap.toFixed(2)}</strong> cap (
                        {((totalMonthly / budgetConfig.monthlyCap) * 100).toFixed(0)}%).{' '}
                        {totalMonthly >= budgetConfig.monthlyCap
                          ? `Breached by $${(totalMonthly - budgetConfig.monthlyCap).toFixed(2)}.`
                          : `$${Math.max(0, budgetConfig.monthlyCap - totalMonthly).toFixed(2)} remaining buffer.`}
                      </>
                    )}
                  </>
                ) : (
                  'Spending cap tracking is disabled. Configure a cap to receive proactive threshold notifications.'
                )}
              </p>
            </div>
          </div>

          {onOpenBudgetCapModal && (
            <button
              id="analytics-configure-cap-btn"
              onClick={onOpenBudgetCapModal}
              className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-[#182136] hover:bg-[#202c48] text-xs font-semibold text-white border border-white/[0.08] transition-colors flex items-center gap-1.5 shrink-0 font-['Plus_Jakarta_Sans']"
            >
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              <span>Configure Cap</span>
            </button>
          )}
        </div>
      )}

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#0f1524] border border-white/[0.08]">
          <span className="text-[10px] text-slate-400 uppercase font-['JetBrains_Mono']">
            {isAnnualized ? 'Annualized Run-Rate' : 'Normalized Burn'}
          </span>
          <div className="text-xl font-bold text-white font-['JetBrains_Mono'] mt-1">
            ${displaySpend.toFixed(2)}
          </div>
          <span className="text-[10px] text-emerald-400">
            {isAnnualized ? '12-month forward run-rate' : '/month'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#0f1524] border border-white/[0.08]">
          <span className="text-[10px] text-slate-400 uppercase font-['JetBrains_Mono']">
            {isAnnualized ? 'Monthly Equivalent' : 'Annual Run Rate'}
          </span>
          <div className="text-xl font-bold text-white font-['JetBrains_Mono'] mt-1">
            ${isAnnualized ? totalMonthly.toFixed(2) : totalAnnual.toFixed(0)}
          </div>
          <span className="text-[10px] text-slate-500">
            {isAnnualized ? 'amortized /month' : '12m forward'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#0f1524] border border-white/[0.08]">
          <span className="text-[10px] text-slate-400 uppercase font-['JetBrains_Mono']">
            AI Compute Share
          </span>
          <div className="text-xl font-bold text-indigo-400 font-['JetBrains_Mono'] mt-1">
            {aiRatio}%
          </div>
          <span className="text-[10px] text-indigo-300/70">
            ${aiSpend.toFixed(0)}{unitLabel}
          </span>
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
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
                {isAnnualized ? 'Annualized Run-Rate Trajectory' : 'Historical Monthly Run-Rate Trend'}
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                {isAnnualized ? '12x Annualized' : 'Monthly'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-['Inter']">
              {isAnnualized 
                ? 'Trailing 6-month pace extrapolated to 12-month forward annual run-rate' 
                : 'Trailing 6-month monthly spend velocity'}
            </p>
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
                  ${item.spend.toLocaleString()}
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

      {/* Predictive 6-Month Renewal Trajectory Growth Chart (D3.js) */}
      <PredictiveGrowthChart 
        subscriptions={subscriptions}
        isAnnualized={isAnnualized}
        budgetConfig={budgetConfig}
      />

      {/* CSV Record-Keeping & Export Module */}
      <div className="p-4 rounded-xl bg-[#0f1524] border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
              External Record-Keeping & CSV Export
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 font-['JetBrains_Mono']">
            Accounting Ready
          </span>
        </div>

        <p className="text-xs text-slate-400 font-['Inter'] leading-relaxed">
          Export full recurring SaaS and AI spending data, 6-month trajectory trends, and itemized license inventory formatted for external audit, QuickBooks, Xero, and corporate ERP systems.
        </p>

        {/* Filter / Settings row */}
        <div className="flex items-center justify-between text-xs pt-1 pb-1 border-y border-white/[0.06]">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={includePaused}
              onChange={(e) => setIncludePaused(e.target.checked)}
              className="rounded border-white/20 bg-[#161f36] text-indigo-500 focus:ring-0 focus:ring-offset-0"
            />
            <span className="text-[11px]">Include paused & dormant licenses ({subscriptions.filter(s => s.status !== 'active').length})</span>
          </label>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showPreview ? 'Hide Preview' : 'Preview CSV'}</span>
          </button>
        </div>

        {/* Export Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Option 1: Comprehensive */}
          <button
            id="export-comprehensive-btn"
            onClick={handleExportComprehensive}
            className="p-3 rounded-xl bg-gradient-to-b from-indigo-950/40 to-[#141c30] hover:from-indigo-900/50 hover:to-[#1b253f] border border-indigo-500/30 hover:border-indigo-400 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-y-0.5 transition-transform" />
                  Full Report (CSV)
                </span>
                <span className="text-[10px] text-indigo-300 font-mono">Recommended</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Complete data: Executive KPIs, 6-Month trends, category allocation & itemized subscriptions.
              </p>
            </div>
            <div className="mt-2 text-[10px] text-indigo-400 font-semibold font-mono flex items-center gap-1">
              <span>Download Comprehensive</span>
              <span>&rarr;</span>
            </div>
          </button>

          {/* Option 2: Spending Trends Only */}
          <button
            id="export-trends-btn"
            onClick={handleExportTrends}
            className="p-3 rounded-xl bg-[#12192c] hover:bg-[#18223b] border border-white/[0.06] hover:border-white/20 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
                  Trends Only (CSV)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Trailing 6-month spending velocity, MoM deltas, and contract frequency allocations.
              </p>
            </div>
            <div className="mt-2 text-[10px] text-emerald-400 font-semibold font-mono flex items-center gap-1">
              <span>Download Trends</span>
              <span>&rarr;</span>
            </div>
          </button>

          {/* Option 3: Subscriptions Only */}
          <button
            id="export-subscriptions-btn"
            onClick={handleExportSubscriptions}
            className="p-3 rounded-xl bg-[#12192c] hover:bg-[#18223b] border border-white/[0.06] hover:border-white/20 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5 text-amber-400 group-hover:translate-y-0.5 transition-transform" />
                  Subscriptions (CSV)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Granular registry with pricing, renewal dates, activity scores, and procurement notes.
              </p>
            </div>
            <div className="mt-2 text-[10px] text-amber-400 font-semibold font-mono flex items-center gap-1">
              <span>Download Registry</span>
              <span>&rarr;</span>
            </div>
          </button>
        </div>

        {/* Live CSV Preview Box */}
        {showPreview && (
          <div className="pt-2 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase font-['JetBrains_Mono']">
                  CSV Data Raw Preview
                </span>
                <div className="flex gap-1">
                  {(['comprehensive', 'trends', 'subscriptions'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPreviewType(t)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium font-mono capitalize transition-colors ${
                        previewType === t
                          ? 'bg-indigo-600 text-white'
                          : 'bg-[#172036] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {currentPreviewCSV.split('\n').length} lines
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#0a0e19] border border-white/[0.06] font-mono text-[10px] text-slate-300 max-h-48 overflow-auto whitespace-pre leading-relaxed select-all">
              {currentPreviewCSV}
            </div>
          </div>
        )}
      </div>

      {/* Spend Distribution by Frequency */}
      <div className="p-4 rounded-xl bg-[#0f1524] border border-white/[0.08]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
            {isAnnualized ? 'Annual Contract & Amortization Breakdown' : 'Billing Frequency Breakdown'}
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">
            {isAnnualized ? '12-Month Projected Volume' : 'Monthly Recurring Volume'}
          </span>
        </div>

        {(() => {
          const monthlyTools = activeSubs.filter(s => s.billingCycle === 'monthly');
          const annualTools = activeSubs.filter(s => s.billingCycle === 'annual');
          const monthlySpendTotal = monthlyTools.reduce((acc, curr) => acc + curr.amount, 0) * multiplier;
          const annualSpendTotal = annualTools.reduce((acc, curr) => acc + curr.amount, 0) * multiplier;
          const totalCategorySpend = monthlySpendTotal + annualSpendTotal;
          const monthlyPct = totalCategorySpend > 0 ? Math.round((monthlySpendTotal / totalCategorySpend) * 100) : 85;
          const annualPct = totalCategorySpend > 0 ? 100 - monthlyPct : 15;

          return (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">
                    Monthly Recurrent Subscriptions ({monthlyTools.length} tools)
                  </span>
                  <span className="font-bold text-white font-['JetBrains_Mono']">
                    ${monthlySpendTotal.toFixed(2)}{unitLabel}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#182033] overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${monthlyPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">
                    Annualized Contracts ({annualTools.length} tools)
                  </span>
                  <span className="font-bold text-white font-['JetBrains_Mono']">
                    ${annualSpendTotal.toFixed(2)}{unitLabel}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#182033] overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${annualPct}%` }} />
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
