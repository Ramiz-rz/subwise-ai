import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewSavings: () => void;
}

export const AuditModal: React.FC<AuditModalProps> = ({
  isOpen,
  onClose,
  onViewSavings
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Connecting to card statement streams & Stripe webhooks...',
    'Querying LLM seat activity & daily API token velocity...',
    'Evaluating Claude vs OpenAI vs Cursor code overlap...',
    'Auditing 45-day storage activity for Dropbox & Cloud tiers...',
    'Autonomous audit finalized: 3 high-leverage recommendations generated.'
  ];

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 25;
        if (next >= 25 && next < 50) setCurrentStep(1);
        else if (next >= 50 && next < 75) setCurrentStep(2);
        else if (next >= 75 && next < 100) setCurrentStep(3);
        else if (next >= 100) setCurrentStep(4);
        return next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[#0b0f1a] border border-indigo-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#111728]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
              Autonomous Watchdog Live Audit
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 font-['Inter']">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-['JetBrains_Mono']">
                {progress < 100 ? 'Analyzing Software Footprint...' : 'Audit Complete'}
              </span>
              <span className="text-emerald-400 font-bold font-['JetBrains_Mono']">{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#182033] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Diagnostic Log Steps */}
          <div className="p-3.5 rounded-xl bg-[#0e1424] border border-white/[0.06] space-y-2.5">
            {steps.map((text, i) => {
              const isDone = i < currentStep || (i === currentStep && progress === 100);
              const isCurrent = i === currentStep && progress < 100;
              if (i > currentStep) return null;

              return (
                <div key={i} className="flex items-start gap-2.5 text-xs">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : isCurrent ? (
                    <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin flex-shrink-0 mt-0.5" />
                  ) : null}
                  <span className={isDone ? 'text-slate-300' : 'text-indigo-300 font-medium'}>
                    {text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Findings Summary when complete */}
          {progress === 100 && (
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs animate-fade-in">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-emerald-300 uppercase tracking-wide font-['JetBrains_Mono']">
                  Audit Findings Summary
                </span>
                <span className="text-sm font-bold text-emerald-400 font-['JetBrains_Mono']">
                  $44.98/mo Reclaimable
                </span>
              </div>
              <ul className="text-slate-300 space-y-1 list-disc list-inside mt-2">
                <li>1 High-priority LLM overlap (Claude Pro vs ChatGPT Pro)</li>
                <li>1 Dormant storage license with 0 sync activity (Dropbox Plus)</li>
                <li>1 Redundant code completion plugin (GitHub Copilot)</li>
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                onClose();
                onViewSavings();
              }}
              disabled={progress < 100}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-[0_0_16px_rgba(16,185,129,0.3)] transition-all font-['Plus_Jakarta_Sans'] flex items-center gap-1.5"
            >
              <span>Inspect & Apply Savings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
