import React, { useState } from 'react';
import { 
  X, 
  Target, 
  AlertTriangle, 
  Bell, 
  Check, 
  DollarSign, 
  ShieldAlert, 
  Sliders, 
  TrendingUp,
  Percent
} from 'lucide-react';
import { SpendingCapConfig } from '../../types';

interface BudgetCapModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SpendingCapConfig;
  onSaveConfig: (updated: SpendingCapConfig) => void;
  currentMonthlySpend: number;
}

const PRESET_CAPS = [100, 150, 200, 250, 300, 500];

export const BudgetCapModal: React.FC<BudgetCapModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  currentMonthlySpend
}) => {
  if (!isOpen) return null;

  const [capAmount, setCapAmount] = useState<number>(config.monthlyCap);
  const [alertAt80, setAlertAt80] = useState<boolean>(config.alertAt80);
  const [alertAt100, setAlertAt100] = useState<boolean>(config.alertAt100);
  const [isEnabled, setIsEnabled] = useState<boolean>(config.isEnabled);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const percentage = capAmount > 0 ? (currentMonthlySpend / capAmount) * 100 : 0;
  const isExceeded100 = percentage >= 100;
  const isExceeded80 = percentage >= 80 && !isExceeded100;
  const remainingBuffer = Math.max(0, capAmount - currentMonthlySpend);
  const overage = Math.max(0, currentMonthlySpend - capAmount);

  const handleSave = () => {
    onSaveConfig({
      monthlyCap: Math.max(1, capAmount),
      alertAt80,
      alertAt100,
      isEnabled
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="budget-cap-modal"
        className="w-full max-w-lg rounded-2xl bg-[#0d1322] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#111728]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
                Monthly Spending Cap Configuration
              </h3>
              <p className="text-[11px] text-slate-400 font-['Inter']">
                Set threshold limits & watchdog budget overrun alerts
              </p>
            </div>
          </div>
          <button 
            id="close-budget-cap-modal-btn"
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 font-['Inter'] max-h-[78vh] overflow-y-auto">
          {/* Master Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#141b2e] border border-white/[0.06]">
            <div>
              <span className="text-xs font-semibold text-white block font-['Plus_Jakarta_Sans']">
                Enforce Monthly Budget Cap
              </span>
              <span className="text-[11px] text-slate-400">
                Track active SaaS & compute spend against spending limit
              </span>
            </div>
            <button
              id="toggle-cap-enabled-btn"
              type="button"
              onClick={() => setIsEnabled(!isEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isEnabled ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Current Utilization Progress Card */}
          <div className={`p-4 rounded-xl border transition-all ${
            !isEnabled 
              ? 'bg-[#121829]/60 border-white/[0.04] opacity-70' 
              : isExceeded100 
                ? 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.1)]' 
                : isExceeded80 
                  ? 'bg-amber-950/20 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                  : 'bg-[#141b2e] border-white/[0.08]'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase font-['JetBrains_Mono'] block">
                  Budget Utilization
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-bold text-white font-['JetBrains_Mono']">
                    ${currentMonthlySpend.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 font-['JetBrains_Mono']">
                    of ${capAmount.toFixed(2)} cap
                  </span>
                </div>
              </div>

              <div className={`px-2 py-1 rounded text-xs font-bold font-['JetBrains_Mono'] flex items-center gap-1 ${
                !isEnabled 
                  ? 'bg-slate-800 text-slate-400' 
                  : isExceeded100 
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/30 animate-pulse' 
                    : isExceeded80 
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/30' 
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
              }`}>
                {isExceeded100 ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>{percentage.toFixed(0)}% EXCEEDED</span>
                  </>
                ) : isExceeded80 ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{percentage.toFixed(0)}% WARNING</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{percentage.toFixed(0)}% HEALTHY</span>
                  </>
                )}
              </div>
            </div>

            {/* Custom Multi-Threshold Progress Bar */}
            <div className="relative w-full h-3 rounded-full bg-[#1b243b] overflow-hidden my-2.5">
              {/* 80% threshold tick line */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-amber-400/80 z-10" 
                style={{ left: '80%' }}
                title="80% Alert Threshold"
              />
              {/* Filled progress bar */}
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  !isEnabled
                    ? 'bg-slate-600'
                    : isExceeded100
                      ? 'bg-gradient-to-r from-rose-600 to-red-500'
                      : isExceeded80
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                        : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
                }`}
                style={{ width: `${Math.min(100, percentage)}%` }}
              />
            </div>

            {/* Scale guide */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-['JetBrains_Mono']">
              <span>$0</span>
              <span className="text-amber-400/90 font-medium">80% Alert (${(capAmount * 0.8).toFixed(0)})</span>
              <span className="text-slate-300 font-medium">100% Cap (${capAmount.toFixed(0)})</span>
            </div>

            {/* Status note */}
            <div className="mt-2.5 pt-2 border-t border-white/[0.06] text-xs">
              {!isEnabled ? (
                <span className="text-slate-500">Spending cap tracking is currently disabled.</span>
              ) : isExceeded100 ? (
                <span className="text-rose-400 font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  Monthly cap breached by ${overage.toFixed(2)}. Watchdog recommends pausing unused tools.
                </span>
              ) : isExceeded80 ? (
                <span className="text-amber-300 font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  Spend is within critical warning zone. Only ${remainingBuffer.toFixed(2)} buffer remains.
                </span>
              ) : (
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  Spend is within target boundaries with ${remainingBuffer.toFixed(2)} remaining cushion.
                </span>
              )}
            </div>
          </div>

          {/* Budget Input & Presets */}
          <div className="space-y-2">
            <label 
              htmlFor="monthly-cap-input"
              className="text-xs font-semibold text-slate-300 block font-['Plus_Jakarta_Sans']"
            >
              Monthly Cap Target ($ USD)
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                id="monthly-cap-input"
                type="number"
                min="10"
                max="5000"
                step="5"
                value={capAmount}
                onChange={(e) => setCapAmount(Math.max(1, Number(e.target.value) || 0))}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#141b2e] border border-white/[0.1] text-white text-base font-bold font-['JetBrains_Mono'] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 font-['JetBrains_Mono']">
                / month
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_CAPS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCapAmount(preset)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold font-['JetBrains_Mono'] transition-all ${
                    capAmount === preset
                      ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                      : 'bg-[#141b2e] text-slate-400 hover:text-white hover:bg-[#1c2640] border border-white/[0.05]'
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>

            {/* Range Slider for tactile adjustment */}
            <div className="pt-2">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Range slider adjustment</span>
                <span className="font-mono text-indigo-400">${capAmount}</span>
              </div>
              <input
                type="range"
                min="50"
                max="600"
                step="10"
                value={capAmount}
                onChange={(e) => setCapAmount(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-[#1b243b] rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Alert Notification Thresholds */}
          <div className="p-4 rounded-xl bg-[#141b2e] border border-white/[0.06] space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-white font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
                Watchdog Alert Triggers
              </h4>
            </div>

            {/* 80% Threshold Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
              <input
                id="alert-80-checkbox"
                type="checkbox"
                checked={alertAt80}
                onChange={(e) => setAlertAt80(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-[#1b243b] text-amber-500 focus:ring-0 focus:ring-offset-0"
              />
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                    80% Spend Warning Alert
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-500/20">
                    Threshold: ${(capAmount * 0.8).toFixed(2)}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                  Trigger notification when subscription commitments consume 80% of your allocated monthly cap.
                </p>
              </div>
            </label>

            {/* 100% Threshold Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
              <input
                id="alert-100-checkbox"
                type="checkbox"
                checked={alertAt100}
                onChange={(e) => setAlertAt100(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-[#1b243b] text-rose-500 focus:ring-0 focus:ring-offset-0"
              />
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white group-hover:text-rose-300 transition-colors">
                    100% Critical Cap Breach Alert
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-500/20">
                    Threshold: ${capAmount.toFixed(2)}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                  Send high-priority notification with immediate license cancellation & redundancy recommendations.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#111728] border-t border-white/[0.06] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Cancel
          </button>

          <button
            id="save-budget-cap-btn"
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] font-['Plus_Jakarta_Sans']"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Cap Saved!</span>
              </>
            ) : (
              <>
                <Target className="w-3.5 h-3.5" />
                <span>Save Spending Cap</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
