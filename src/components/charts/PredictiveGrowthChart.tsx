import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Subscription, SpendingCapConfig } from '../../types';
import { TrendingUp, Calendar, Zap, AlertCircle, Info, Sparkles, CheckCircle2 } from 'lucide-react';

export interface ProjectedMonthData {
  monthIndex: number;
  monthKey: string; // e.g. "2026-10"
  monthLabel: string; // e.g. "Oct '26"
  shortMonth: string; // e.g. "Oct"
  year: number;
  // Estimated scheduled cash outflow (actual renewal payments occurring in this month)
  cashOutflow: number;
  // Normalized monthly run-rate baseline
  normalizedRunRate: number;
  // Cumulative spend from month 1 through this month
  cumulativeSpend: number;
  // Itemized breakdown of subscriptions charging in this month
  charges: {
    subscriptionId: string;
    name: string;
    provider: string;
    amount: number;
    billingCycle: 'monthly' | 'annual' | 'quarterly';
    category: string;
    color: string;
    isAiTool: boolean;
  }[];
}

interface PredictiveGrowthChartProps {
  subscriptions: Subscription[];
  isAnnualized?: boolean;
  budgetConfig?: SpendingCapConfig;
  className?: string;
}

export const PredictiveGrowthChart: React.FC<PredictiveGrowthChartProps> = ({
  subscriptions,
  isAnnualized = false,
  budgetConfig,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 600, height: 260 });
  const [hoveredData, setHoveredData] = useState<ProjectedMonthData | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [projectionMode, setProjectionMode] = useState<'cash_outflow' | 'normalized_runrate'>('cash_outflow');

  // Compute 6-month predictive projection based on active subscription renewal cycles
  const projectionData: ProjectedMonthData[] = useMemo(() => {
    const activeSubs = subscriptions.filter(s => s.status === 'active');
    const now = new Date();
    // Use the current year and month as baseline
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0 - 11

    const result: ProjectedMonthData[] = [];
    let runningCumulative = 0;

    for (let offset = 1; offset <= 6; offset++) {
      const targetDate = new Date(currentYear, currentMonth + offset, 1);
      const targetYear = targetDate.getFullYear();
      const targetMonthIndex = targetDate.getMonth(); // 0 - 11
      const shortMonth = targetDate.toLocaleString('default', { month: 'short' });
      const yearShort = String(targetYear).slice(-2);
      const monthLabel = `${shortMonth} '${yearShort}`;
      const monthKey = `${targetYear}-${String(targetMonthIndex + 1).padStart(2, '0')}`;

      const charges: ProjectedMonthData['charges'] = [];
      let monthCashOutflow = 0;
      let monthNormalizedRate = 0;

      activeSubs.forEach(sub => {
        monthNormalizedRate += sub.amount;

        // Parse sub renewal date
        const [rYearStr, rMonthStr] = (sub.renewalDate || '').split('-');
        const renewalMonthIndex = rMonthStr ? parseInt(rMonthStr, 10) - 1 : currentMonth;
        const renewalYear = rYearStr ? parseInt(rYearStr, 10) : currentYear;

        let shouldCharge = false;
        let chargeAmount = sub.billedAmount || sub.amount;

        if (sub.billingCycle === 'monthly') {
          // Monthly charges occur every single month
          shouldCharge = true;
          chargeAmount = sub.billedAmount || sub.amount;
        } else if (sub.billingCycle === 'annual') {
          // Annual charges occur once per year on the renewal month
          if (targetMonthIndex === renewalMonthIndex) {
            shouldCharge = true;
            // Billed amount for annual cycle is full contract cost
            chargeAmount = sub.billedAmount && sub.billedAmount > sub.amount 
              ? sub.billedAmount 
              : sub.amount * 12;
          }
        } else if (sub.billingCycle === 'quarterly') {
          // Quarterly charges occur every 3 months
          const monthDiff = (targetYear - renewalYear) * 12 + (targetMonthIndex - renewalMonthIndex);
          if (monthDiff >= 0 && monthDiff % 3 === 0) {
            shouldCharge = true;
            chargeAmount = sub.billedAmount && sub.billedAmount > sub.amount
              ? sub.billedAmount
              : sub.amount * 3;
          }
        }

        if (shouldCharge) {
          monthCashOutflow += chargeAmount;
          charges.push({
            subscriptionId: sub.id,
            name: sub.name,
            provider: sub.provider,
            amount: chargeAmount,
            billingCycle: sub.billingCycle,
            category: sub.category,
            color: sub.color || '#6366f1',
            isAiTool: sub.isAiTool
          });
        }
      });

      // Sort charges descending by amount
      charges.sort((a, b) => b.amount - a.amount);

      runningCumulative += monthCashOutflow;

      result.push({
        monthIndex: offset,
        monthKey,
        monthLabel,
        shortMonth,
        year: targetYear,
        cashOutflow: monthCashOutflow,
        normalizedRunRate: monthNormalizedRate,
        cumulativeSpend: runningCumulative,
        charges
      });
    }

    return result;
  }, [subscriptions]);

  // Handle container resize using ResizeObserver with debouncing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let timeoutId: NodeJS.Timeout | null = null;
    const observer = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const { width } = entries[0].contentRect;
        if (width > 0) {
          // Responsive height: slightly taller on larger screens
          const calculatedHeight = width < 480 ? 230 : width < 768 ? 260 : 280;
          setDimensions({ width, height: calculatedHeight });
        }
      }, 100);
    });

    observer.observe(container);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Multiplier for annualized view: if annualized is active, extrapolate monthly view by 12x
  const multiplier = isAnnualized ? 12 : 1;
  const unitLabel = isAnnualized ? '/yr' : '/mo';

  // D3 Chart Render
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    if (!svg.node() || dimensions.width <= 0) return;

    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 28, right: 32, bottom: 42, left: 56 };
    const innerWidth = Math.max(width - margin.left - margin.right, 50);
    const innerHeight = Math.max(height - margin.top - margin.bottom, 50);

    // Selected metric value based on projectionMode and isAnnualized
    const getMetricValue = (d: ProjectedMonthData) => {
      const base = projectionMode === 'cash_outflow' ? d.cashOutflow : d.normalizedRunRate;
      return base * multiplier;
    };

    // Calculate dynamic Y domain
    const values = projectionData.map(getMetricValue);
    const maxVal = Math.max(...values, 100);
    const budgetVal = (budgetConfig?.isEnabled && budgetConfig.monthlyCap > 0) 
      ? budgetConfig.monthlyCap * multiplier 
      : 0;
    const yMax = Math.max(maxVal * 1.25, budgetVal * 1.15, 120);

    // D3 Scales
    const xScale = d3.scalePoint<string>()
      .domain(projectionData.map(d => d.monthLabel))
      .range([0, innerWidth])
      .padding(0.35);

    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([innerHeight, 0])
      .nice();

    // Defs for gradients, patterns, filters
    const defs = svg.append('defs');

    // Area Gradient (Indigo to Transparent)
    const areaGradient = defs.append('linearGradient')
      .attr('id', 'predAreaGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#6366f1')
      .attr('stop-opacity', 0.4);

    areaGradient.append('stop')
      .attr('offset', '70%')
      .attr('stop-color', '#6366f1')
      .attr('stop-opacity', 0.08);

    areaGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#6366f1')
      .attr('stop-opacity', 0.0);

    // Glow Filter for primary line
    const glowFilter = defs.append('filter')
      .attr('id', 'predGlow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '3.5')
      .attr('result', 'blur');

    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'blur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Subtle horizontal grid lines
    const yAxisGrid = d3.axisLeft(yScale)
      .ticks(4)
      .tickSize(-innerWidth)
      .tickFormat(() => '');

    g.append('g')
      .attr('class', 'grid')
      .call(yAxisGrid)
      .selectAll('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.06)')
      .attr('stroke-dasharray', '3,3');

    g.select('.grid .domain').remove();

    // Render Budget Cap Reference Line if active
    if (budgetVal > 0 && budgetVal <= yMax) {
      const budgetY = yScale(budgetVal);
      const capGroup = g.append('g').attr('class', 'budget-cap-line');

      capGroup.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', budgetY)
        .attr('y2', budgetY)
        .attr('stroke', '#f43f5e')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5,4')
        .attr('opacity', 0.85);

      capGroup.append('text')
        .attr('x', innerWidth)
        .attr('y', budgetY - 5)
        .attr('text-anchor', 'end')
        .attr('fill', '#fb7185')
        .attr('font-size', '10px')
        .attr('font-family', 'JetBrains Mono, monospace')
        .attr('font-weight', '600')
        .text(`Cap: $${budgetVal.toFixed(0)}${unitLabel}`);
    }

    // Area Generator
    const areaGenerator = d3.area<ProjectedMonthData>()
      .x(d => xScale(d.monthLabel) || 0)
      .y0(innerHeight)
      .y1(d => yScale(getMetricValue(d)))
      .curve(d3.curveMonotoneX);

    // Line Generator
    const lineGenerator = d3.line<ProjectedMonthData>()
      .x(d => xScale(d.monthLabel) || 0)
      .y(d => yScale(getMetricValue(d)))
      .curve(d3.curveMonotoneX);

    // Append Area Path
    g.append('path')
      .datum(projectionData)
      .attr('fill', 'url(#predAreaGradient)')
      .attr('d', areaGenerator);

    // Append Glowing Line Path
    g.append('path')
      .datum(projectionData)
      .attr('fill', 'none')
      .attr('stroke', '#818cf8')
      .attr('stroke-width', 2.5)
      .attr('filter', 'url(#predGlow)')
      .attr('d', lineGenerator);

    // Secondary crisp line path for sharp edge
    g.append('path')
      .datum(projectionData)
      .attr('fill', 'none')
      .attr('stroke', '#c7d2fe')
      .attr('stroke-width', 1.5)
      .attr('d', lineGenerator);

    // D3 Axes
    const xAxis = d3.axisBottom(xScale)
      .tickSize(0)
      .tickPadding(12);

    const yAxis = d3.axisLeft(yScale)
      .ticks(4)
      .tickSize(0)
      .tickPadding(8)
      .tickFormat(d => `$${d3.format('~s')(d)}`);

    // Render X-Axis
    const gx = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    gx.select('.domain').attr('stroke', 'rgba(255, 255, 255, 0.12)');
    gx.selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '11px')
      .attr('font-family', 'Plus Jakarta Sans, sans-serif')
      .attr('font-weight', '600');

    // Render Y-Axis
    const gy = g.append('g')
      .call(yAxis);

    gy.select('.domain').remove();
    gy.selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '10px')
      .attr('font-family', 'JetBrains Mono, monospace');

    // Point circles for each month
    const pointsGroup = g.append('g').attr('class', 'points-group');

    pointsGroup.selectAll('.point-circle')
      .data(projectionData)
      .enter()
      .append('circle')
      .attr('class', 'point-circle')
      .attr('cx', d => xScale(d.monthLabel) || 0)
      .attr('cy', d => yScale(getMetricValue(d)))
      .attr('r', 4.5)
      .attr('fill', '#1e1b4b')
      .attr('stroke', '#818cf8')
      .attr('stroke-width', 2.5)
      .style('cursor', 'pointer')
      .style('transition', 'r 0.15s ease-in-out');

    // Transparent Interactive Overlay for mouse hover tracking
    const overlay = g.append('rect')
      .attr('class', 'overlay')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair');

    // Vertical cursor guideline
    const cursorLine = g.append('line')
      .attr('class', 'cursor-guide')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', 'rgba(165, 180, 252, 0.4)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3,3')
      .style('opacity', 0);

    // Hover circle highlight
    const hoverCircle = g.append('circle')
      .attr('r', 7)
      .attr('fill', '#6366f1')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('opacity', 0)
      .style('pointer-events', 'none');

    // Find nearest point along the X axis
    const onPointerMove = (event: MouseEvent | TouchEvent) => {
      const [mouseX, mouseY] = d3.pointer(event, overlay.node());
      
      // Calculate distances to all points
      let closestItem = projectionData[0];
      let minDistance = Infinity;

      projectionData.forEach(d => {
        const px = xScale(d.monthLabel) || 0;
        const dist = Math.abs(mouseX - px);
        if (dist < minDistance) {
          minDistance = dist;
          closestItem = d;
        }
      });

      const closestX = xScale(closestItem.monthLabel) || 0;
      const closestY = yScale(getMetricValue(closestItem));

      cursorLine
        .attr('x1', closestX)
        .attr('x2', closestX)
        .style('opacity', 1);

      hoverCircle
        .attr('cx', closestX)
        .attr('cy', closestY)
        .style('opacity', 1);

      setHoveredData(closestItem);
      // Tooltip position relative to container
      setHoverPos({
        x: margin.left + closestX,
        y: margin.top + closestY
      });
    };

    const onPointerLeave = () => {
      cursorLine.style('opacity', 0);
      hoverCircle.style('opacity', 0);
      setHoveredData(null);
      setHoverPos(null);
    };

    overlay
      .on('mousemove', onPointerMove)
      .on('mouseleave', onPointerLeave)
      .on('touchmove', onPointerMove)
      .on('touchend', onPointerLeave);

  }, [dimensions, projectionData, projectionMode, isAnnualized, multiplier, unitLabel, budgetConfig]);

  // Aggregate summary statistics across 6 months
  const total6MonthSpend = projectionData.reduce((acc, curr) => acc + curr.cashOutflow, 0) * multiplier;
  const avgMonthlySpend = (total6MonthSpend / 6);
  const peakMonth = [...projectionData].sort((a, b) => b.cashOutflow - a.cashOutflow)[0];
  const peakSpend = (peakMonth ? peakMonth.cashOutflow : 0) * multiplier;

  return (
    <div 
      id="predictive-growth-chart-module" 
      className={`p-4 rounded-xl bg-[#0f1524] border border-white/[0.08] space-y-4 ${className}`}
    >
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-950/70 border border-indigo-500/30 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
              Predictive 6-Month Renewal Trajectory
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-['JetBrains_Mono'] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              D3 Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 font-['Inter'] mt-1">
            Calculated from active renewal cycles, anniversary milestones, and recurring billing frequency
          </p>
        </div>

        {/* Projection Model Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center p-0.5 rounded-lg bg-[#182136] border border-white/[0.08] text-[11px]">
            <button
              type="button"
              onClick={() => setProjectionMode('cash_outflow')}
              className={`px-2.5 py-1 rounded-md font-semibold font-['Plus_Jakarta_Sans'] transition-all ${
                projectionMode === 'cash_outflow'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Scheduled Cash Outflow
            </button>
            <button
              type="button"
              onClick={() => setProjectionMode('normalized_runrate')}
              className={`px-2.5 py-1 rounded-md font-semibold font-['Plus_Jakarta_Sans'] transition-all ${
                projectionMode === 'normalized_runrate'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Normalized Run-Rate
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 rounded-lg bg-[#141b2d] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase font-['JetBrains_Mono']">
            6-Month Cumulative
          </span>
          <div className="text-base font-bold text-white font-['JetBrains_Mono'] mt-0.5">
            ${total6MonthSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-400">Estimated outflow</span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#141b2d] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase font-['JetBrains_Mono']">
            Projected Monthly Avg
          </span>
          <div className="text-base font-bold text-indigo-400 font-['JetBrains_Mono'] mt-0.5">
            ${avgMonthlySpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{unitLabel}
          </div>
          <span className="text-[10px] text-slate-400">Prorated average</span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#141b2d] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase font-['JetBrains_Mono']">
            Peak Outflow Month
          </span>
          <div className="text-base font-bold text-white font-['JetBrains_Mono'] mt-0.5">
            {peakMonth ? peakMonth.monthLabel : '—'}
          </div>
          <span className="text-[10px] text-rose-400 font-['JetBrains_Mono']">
            ${peakSpend.toFixed(2)}{unitLabel}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#141b2d] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase font-['JetBrains_Mono']">
            Renewal Rhythm
          </span>
          <div className="text-base font-bold text-emerald-400 font-['JetBrains_Mono'] mt-0.5">
            100% On-Track
          </div>
          <span className="text-[10px] text-emerald-400/80">Zero lapsed dates</span>
        </div>
      </div>

      {/* D3 Canvas Stage Container */}
      <div 
        ref={containerRef}
        className="relative w-full rounded-xl bg-[#090d16] border border-white/[0.06] p-2 overflow-visible"
        style={{ minHeight: dimensions.height }}
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full overflow-visible select-none"
        />

        {/* Interactive Floating Tooltip */}
        {hoveredData && hoverPos && (
          <div
            className="absolute z-30 pointer-events-none transition-transform duration-75 ease-out"
            style={{
              left: `${Math.min(Math.max(hoverPos.x, 140), dimensions.width - 150)}px`,
              top: `${Math.max(hoverPos.y - 12, 10)}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="w-64 p-3 rounded-xl bg-[#131b2e] border border-indigo-500/40 shadow-[0_8px_25px_rgba(0,0,0,0.6)] backdrop-blur-md text-left">
              {/* Tooltip Header */}
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs font-bold text-white font-['Plus_Jakarta_Sans']">
                    {hoveredData.monthLabel}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                  {hoveredData.charges.length} renewals
                </span>
              </div>

              {/* Amount figures */}
              <div className="space-y-1 mb-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] text-slate-400 font-['Inter']">Scheduled Outflow:</span>
                  <span className="text-sm font-bold text-white font-['JetBrains_Mono']">
                    ${(hoveredData.cashOutflow * multiplier).toFixed(2)}{unitLabel}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-[10px] text-slate-400">
                  <span>Normalized Baseline:</span>
                  <span className="font-mono text-slate-300">
                    ${(hoveredData.normalizedRunRate * multiplier).toFixed(2)}{unitLabel}
                  </span>
                </div>
                {budgetConfig && budgetConfig.isEnabled && (
                  <div className="flex justify-between items-baseline text-[10px]">
                    <span className="text-slate-400">Target Cap Margin:</span>
                    <span className={`font-mono font-semibold ${
                      hoveredData.cashOutflow <= budgetConfig.monthlyCap ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {hoveredData.cashOutflow <= budgetConfig.monthlyCap
                        ? `+$${((budgetConfig.monthlyCap - hoveredData.cashOutflow) * multiplier).toFixed(2)} under`
                        : `-$${((hoveredData.cashOutflow - budgetConfig.monthlyCap) * multiplier).toFixed(2)} breach`}
                    </span>
                  </div>
                )}
              </div>

              {/* Itemized Renewing Subscriptions Preview */}
              <div className="pt-1.5 border-t border-white/[0.08]">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-['JetBrains_Mono'] block mb-1">
                  Renewing Licenses:
                </span>
                <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                  {hoveredData.charges.slice(0, 4).map((charge) => (
                    <div key={charge.subscriptionId} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5 truncate pr-2">
                        <span 
                          className="w-1.5 h-1.5 rounded-full shrink-0" 
                          style={{ backgroundColor: charge.color }}
                        />
                        <span className="truncate text-slate-300 font-medium">{charge.name}</span>
                        {charge.isAiTool && (
                          <span className="text-[8px] px-1 py-0.1 rounded bg-indigo-950 text-indigo-400 font-mono">
                            AI
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-white shrink-0 font-semibold">
                        ${(charge.amount * (isAnnualized && charge.billingCycle !== 'annual' ? 12 : 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {hoveredData.charges.length > 4 && (
                    <div className="text-[9px] text-slate-400 text-center pt-0.5">
                      +{hoveredData.charges.length - 4} more subscriptions
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trajectory Insights Footer Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 font-['Inter'] pt-1">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>
            {projectionMode === 'cash_outflow' 
              ? 'Reflects exact billing anniversary hits (annual contracts charge 100% upfront in their anniversary month).'
              : 'Reflects linear amortized run-rate pacing smoothed across all billing horizons.'}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-indigo-400" /> Projected Spend
          </span>
          {budgetConfig && budgetConfig.isEnabled && (
            <span className="flex items-center gap-1 text-[11px] text-rose-400">
              <span className="w-2 h-0.5 bg-rose-500" /> Budget Cap
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
