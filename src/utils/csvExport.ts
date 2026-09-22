import { Subscription, SpendingCapConfig } from '../types';

export interface MonthlyTrendItem {
  month: string;
  spend: number;
}

/**
 * Escapes a CSV field according to RFC 4180 rules.
 */
function escapeCSV(field: string | number | boolean | null | undefined): string {
  if (field === null || field === undefined) {
    return '""';
  }
  const stringValue = String(field);
  // If field contains comma, quote, or newline, escape double quotes and wrap in quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return `"${stringValue}"`;
}

/**
 * Generates an end-to-end Comprehensive CSV Report containing:
 * 1. Executive Telemetry & Financial Health
 * 2. 6-Month Historical Spending Trends
 * 3. Category Capital Allocation
 * 4. Itemized Subscription Inventory
 */
export function generateComprehensiveCSV(
  subscriptions: Subscription[],
  monthlyTrend: MonthlyTrendItem[],
  budgetConfig?: SpendingCapConfig
): string {
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const pausedSubs = subscriptions.filter(s => s.status !== 'active');
  const totalMonthly = activeSubs.reduce((acc, curr) => acc + curr.amount, 0);
  const totalAnnual = totalMonthly * 12;
  const aiSpend = activeSubs.filter(s => s.isAiTool).reduce((acc, curr) => acc + curr.amount, 0);
  const aiRatio = totalMonthly > 0 ? ((aiSpend / totalMonthly) * 100).toFixed(1) : '0';
  const currentDate = new Date().toISOString().slice(0, 10);

  // Group by category
  const categories = Array.from(new Set(subscriptions.map(s => s.category)));
  const categoryBreakdown = categories.map(cat => {
    const subsInCat = activeSubs.filter(s => s.category === cat);
    const catSpend = subsInCat.reduce((acc, curr) => acc + curr.amount, 0);
    const catShare = totalMonthly > 0 ? ((catSpend / totalMonthly) * 100).toFixed(1) : '0';
    return {
      category: cat,
      activeCount: subsInCat.length,
      spend: catSpend,
      annual: catSpend * 12,
      share: catShare
    };
  });

  const lines: string[] = [];

  // Report Header
  lines.push('# =========================================================================');
  lines.push('# SUBWISE AI - COMPREHENSIVE FISCAL TELEMETRY & SPENDING TRENDS AUDIT');
  lines.push(`# Generated Date: ${currentDate}`);
  lines.push('# Currency: USD ($)');
  lines.push('# Export Target: External Financial Record-Keeping (QuickBooks / Xero / Excel)');
  lines.push('# =========================================================================');
  lines.push('');

  // 1. Executive Telemetry
  lines.push('# --- SECTION 1: EXECUTIVE FINANCIAL TELEMETRY ---');
  lines.push(['Metric', 'Value', 'Unit', 'Context'].map(escapeCSV).join(','));
  lines.push(['Normalized Monthly SaaS Burn', totalMonthly.toFixed(2), 'USD/mo', 'Active subscription licenses'].map(escapeCSV).join(','));
  lines.push(['Annualized SaaS Run-Rate', totalAnnual.toFixed(2), 'USD/yr', '12-month forward extrapolation'].map(escapeCSV).join(','));
  lines.push(['AI Compute Dedicated Spend', aiSpend.toFixed(2), 'USD/mo', 'LLM and AI developer tooling'].map(escapeCSV).join(','));
  lines.push(['AI Compute Budget Share', `${aiRatio}%`, 'Percentage', 'Proportion of total monthly software'].map(escapeCSV).join(','));

  if (budgetConfig && budgetConfig.isEnabled && budgetConfig.monthlyCap > 0) {
    const cap = budgetConfig.monthlyCap;
    const ratio = (totalMonthly / cap) * 100;
    const status = ratio >= 100 ? '100% Breached' : ratio >= 80 ? '80% Warning Alert' : 'Under Cap (Healthy)';
    lines.push(['Configured Monthly Spending Cap', cap.toFixed(2), 'USD/mo', 'User defined monthly budget limit'].map(escapeCSV).join(','));
    lines.push(['Budget Cap Utilization Rate', `${ratio.toFixed(1)}%`, 'Percentage', status].map(escapeCSV).join(','));
    lines.push(['80% Warning Threshold', (cap * 0.8).toFixed(2), 'USD/mo', budgetConfig.alertAt80 ? 'Alert Active' : 'Alert Disabled'].map(escapeCSV).join(','));
    lines.push(['100% Breach Threshold', cap.toFixed(2), 'USD/mo', budgetConfig.alertAt100 ? 'Alert Active' : 'Alert Disabled'].map(escapeCSV).join(','));
  }

  lines.push(['Audit Health Score', '86 / 100', 'Score', 'Grade A- (Optimization recommended)'].map(escapeCSV).join(','));
  lines.push(['Active Software Subscriptions', activeSubs.length, 'Licenses', 'Currently active recurring charges'].map(escapeCSV).join(','));
  lines.push(['Paused / Dormant Subscriptions', pausedSubs.length, 'Licenses', 'Deactivated or suspended licenses'].map(escapeCSV).join(','));
  lines.push(['Total Monitored Portfolio', subscriptions.length, 'Licenses', 'Total tracked services'].map(escapeCSV).join(','));
  lines.push('');


  // 2. Spending Trends
  lines.push('# --- SECTION 2: 6-MONTH SPENDING TRENDS & VELOCITY ---');
  lines.push(['Month Period', 'Monthly Spend ($)', 'Annualized Equivalent ($)', 'MoM Growth ($)', 'MoM Delta (%)', 'Trend Trajectory'].map(escapeCSV).join(','));
  
  monthlyTrend.forEach((item, index) => {
    const prevSpend = index > 0 ? monthlyTrend[index - 1].spend : item.spend;
    const diff = item.spend - prevSpend;
    const pctChange = index === 0 ? 'Baseline' : `${diff >= 0 ? '+' : ''}${((diff / prevSpend) * 100).toFixed(1)}%`;
    const trajectory = index === 0 ? 'Baseline' : diff > 0 ? 'Expanding' : diff < 0 ? 'Contracting' : 'Stable';
    lines.push([
      item.month,
      item.spend.toFixed(2),
      (item.spend * 12).toFixed(2),
      diff === 0 ? '0.00' : `${diff > 0 ? '+' : ''}${diff.toFixed(2)}`,
      pctChange,
      trajectory
    ].map(escapeCSV).join(','));
  });
  lines.push('');

  // 3. Category Breakdown
  lines.push('# --- SECTION 3: SPENDING BY CATEGORY & ALLOCATION ---');
  lines.push(['Category', 'Active Tools', 'Monthly Spend ($)', 'Annualized Spend ($)', 'Budget Share (%)'].map(escapeCSV).join(','));
  categoryBreakdown.forEach(cat => {
    lines.push([
      cat.category,
      cat.activeCount,
      cat.spend.toFixed(2),
      cat.annual.toFixed(2),
      `${cat.share}%`
    ].map(escapeCSV).join(','));
  });
  lines.push('');

  // 4. Detailed Subscriptions
  lines.push('# --- SECTION 4: CURRENT SUBSCRIPTIONS INVENTORY ---');
  lines.push([
    'Tool Name',
    'Provider',
    'Category',
    'Status',
    'Billing Cycle',
    'Monthly Cost ($)',
    'Billed Amount ($)',
    'Annualized Cost ($)',
    'Next Renewal Date',
    'Days Until Renewal',
    'Usage Rating (1-5)',
    'AI Powered Tool',
    'Redundancy Conflicts',
    'Internal Procurement Notes'
  ].map(escapeCSV).join(','));

  subscriptions.forEach(sub => {
    lines.push([
      sub.name,
      sub.provider,
      sub.category,
      sub.status.toUpperCase(),
      sub.billingCycle,
      sub.amount.toFixed(2),
      sub.billedAmount.toFixed(2),
      (sub.amount * 12).toFixed(2),
      sub.renewalDate,
      sub.daysUntilRenewal,
      `${sub.usageScore} / 5`,
      sub.isAiTool ? 'YES' : 'NO',
      sub.redundancyWith && sub.redundancyWith.length > 0 ? sub.redundancyWith.join('; ') : 'None',
      sub.notes || ''
    ].map(escapeCSV).join(','));
  });

  return lines.join('\r\n');
}

/**
 * Generates a focused Spending Trends CSV Report.
 */
export function generateTrendsCSV(
  subscriptions: Subscription[],
  monthlyTrend: MonthlyTrendItem[]
): string {
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const totalMonthly = activeSubs.reduce((acc, curr) => acc + curr.amount, 0);
  const currentDate = new Date().toISOString().slice(0, 10);

  const lines: string[] = [];
  lines.push('# SUBWISE AI - SPENDING TRENDS & HISTORICAL RUN-RATE REPORT');
  lines.push(`# Exported: ${currentDate}`);
  lines.push('');
  lines.push(['Period', 'Monthly Velocity ($)', 'Annualized Run-Rate ($)', 'MoM Delta ($)', 'MoM Percentage', 'Status'].map(escapeCSV).join(','));

  monthlyTrend.forEach((item, index) => {
    const prevSpend = index > 0 ? monthlyTrend[index - 1].spend : item.spend;
    const diff = item.spend - prevSpend;
    const pctChange = index === 0 ? '0.0%' : `${diff >= 0 ? '+' : ''}${((diff / prevSpend) * 100).toFixed(1)}%`;
    lines.push([
      item.month,
      item.spend.toFixed(2),
      (item.spend * 12).toFixed(2),
      diff.toFixed(2),
      pctChange,
      index === monthlyTrend.length - 1 ? 'Current' : 'Historical'
    ].map(escapeCSV).join(','));
  });

  lines.push('');
  lines.push('# SPENDING BY BILLING FREQUENCY');
  lines.push(['Frequency', 'Subscriptions Count', 'Monthly Equivalent ($)', 'Annualized Run-Rate ($)'].map(escapeCSV).join(','));
  
  const monthlySubs = activeSubs.filter(s => s.billingCycle === 'monthly');
  const annualSubs = activeSubs.filter(s => s.billingCycle === 'annual');
  const quarterlySubs = activeSubs.filter(s => s.billingCycle === 'quarterly');

  const monthlySum = monthlySubs.reduce((acc, curr) => acc + curr.amount, 0);
  const annualSum = annualSubs.reduce((acc, curr) => acc + curr.amount, 0);
  const quarterlySum = quarterlySubs.reduce((acc, curr) => acc + curr.amount, 0);

  lines.push(['Monthly Recurrent', monthlySubs.length, monthlySum.toFixed(2), (monthlySum * 12).toFixed(2)].map(escapeCSV).join(','));
  lines.push(['Annualized Contracts', annualSubs.length, annualSum.toFixed(2), (annualSum * 12).toFixed(2)].map(escapeCSV).join(','));
  if (quarterlySubs.length > 0) {
    lines.push(['Quarterly Contracts', quarterlySubs.length, quarterlySum.toFixed(2), (quarterlySum * 12).toFixed(2)].map(escapeCSV).join(','));
  }
  lines.push(['TOTAL', activeSubs.length, totalMonthly.toFixed(2), (totalMonthly * 12).toFixed(2)].map(escapeCSV).join(','));

  return lines.join('\r\n');
}

/**
 * Generates an itemized Subscription Registry CSV.
 */
export function generateSubscriptionsCSV(subscriptions: Subscription[]): string {
  const currentDate = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];
  lines.push('# SUBWISE AI - SUBSCRIPTION INVENTORY REGISTRY');
  lines.push(`# Exported: ${currentDate}`);
  lines.push('');
  lines.push([
    'Tool Name',
    'Provider',
    'Category',
    'Status',
    'Billing Cycle',
    'Monthly Cost ($)',
    'Billed Amount ($)',
    'Annualized Cost ($)',
    'Next Renewal Date',
    'Days Until Renewal',
    'Usage Rating (1-5)',
    'AI Powered Tool',
    'Redundancy Conflicts',
    'Internal Procurement Notes'
  ].map(escapeCSV).join(','));

  subscriptions.forEach(sub => {
    lines.push([
      sub.name,
      sub.provider,
      sub.category,
      sub.status.toUpperCase(),
      sub.billingCycle,
      sub.amount.toFixed(2),
      sub.billedAmount.toFixed(2),
      (sub.amount * 12).toFixed(2),
      sub.renewalDate,
      sub.daysUntilRenewal,
      `${sub.usageScore} / 5`,
      sub.isAiTool ? 'YES' : 'NO',
      sub.redundancyWith && sub.redundancyWith.length > 0 ? sub.redundancyWith.join('; ') : 'None',
      sub.notes || ''
    ].map(escapeCSV).join(','));
  });

  return lines.join('\r\n');
}

/**
 * Triggers a browser download of CSV string with UTF-8 Byte Order Mark for Excel compatibility.
 */
export function triggerCSVDownload(csvContent: string, filename: string): void {
  // \uFEFF is UTF-8 Byte Order Mark (BOM), ensuring Excel automatically recognizes UTF-8 encoding
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 150);
}
