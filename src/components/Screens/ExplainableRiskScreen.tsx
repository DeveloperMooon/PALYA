import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Info,
  Scale,
  ArrowLeft
} from 'lucide-react';
import { Animal, ScreenId } from '../../types';

interface ExplainableRiskScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectAnimal: (animal: Animal) => void;
  animals: Animal[];
}

export const ExplainableRiskScreen: React.FC<ExplainableRiskScreenProps> = ({
  onNavigate,
  onSelectAnimal,
  animals
}) => {
  const cow024 = (animals && animals.length > 0) ? (animals.find((a) => a.id === 'COW-024') || animals[0]) : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-outline mb-2">
          <button onClick={() => onNavigate('stewardship')} className="hover:text-primary">
            Stewardship Score
          </button>
          <span>/</span>
          <span className="text-primary font-bold">Explainable Risk Analysis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
          Explainable Risk Analysis
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Transparent breakdown of risk factors contributing to your farm's stewardship score.
        </p>
      </div>

      {/* Top Card: Overall Stewardship Score Meter Bar */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
          <div>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Overall Stewardship Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-primary">82</span>
              <span className="text-sm font-bold text-outline">/ 100</span>
              <span className="text-xs font-bold text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded-full ml-2">
                Low Risk Profile
              </span>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant max-w-sm">
            Your score reflects disciplined compliance with minor actionable risk factors flagged for veterinary inspection.
          </p>
        </div>

        {/* Gradient Risk Meter with Marker */}
        <div className="mt-6 relative pt-6">
          <div className="absolute top-0 left-[82%] -translate-x-1/2 flex flex-col items-center">
            <span className="bg-primary text-on-primary text-[11px] font-black px-2 py-0.5 rounded-full shadow-xs">
              Current: 82
            </span>
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-primary" />
          </div>

          <div className="w-full h-3 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-600 shadow-inner" />

          <div className="flex justify-between text-[11px] font-bold text-outline mt-2">
            <span className="text-error">0 - High Risk</span>
            <span className="text-amber-600">50 - Moderate Risk</span>
            <span className="text-emerald-700">100 - Optimal Stewardship</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 Cols): Positive & Active Risk Factors */}
        <div className="lg:col-span-8 space-y-6">
          {/* Positive Factors */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-outline-variant/40">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-primary">Positive Risk Factors (+22 pts)</h2>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-800">Complete Treatment Records</span>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      +8 pts
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    All therapeutic doses logged with validated quantity, route, and clinical rationale.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-800">Veterinary Oversight</span>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      +6 pts
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    100% of recorded antimicrobial treatments authorized and countersigned by registered veterinary officer.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-800">Zero Withdrawal Violations</span>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      +5 pts
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Zero instances of milk or meat entering commerce before the completion of regulatory clearance windows.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-800">Controlled Herd AMU Trend</span>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      +3 pts
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Antimicrobial index has steadily declined 8% over the past 6 months towards the national benchmark.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Risk Factors */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-outline-variant/40">
              <AlertTriangle className="w-5 h-5 text-error" />
              <h2 className="text-base font-bold text-primary">Active Risk Deductions (-18 pts)</h2>
            </div>

            <div className="mt-4 space-y-3">
              {/* Risk 1: Repeated Treatment */}
              <div className="p-4 rounded-xl bg-error-container/30 border border-error/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-error">Repeated Treatment Pattern</span>
                    <span className="text-[10px] font-black bg-error text-on-error px-1.5 py-0.5 rounded">
                      -12 pts
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-error">COW-024 (North Pasture)</span>
                </div>
                <p className="text-xs text-on-surface leading-relaxed">
                  COW-024 received 3 distinct antimicrobial treatments in the last 30 days. Repeated courses of 4th-generation cephalosporins (HP-CIA) suggest chronic treatment failure or emerging resistance.
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      onSelectAnimal(cow024);
                      onNavigate('veterinary-case');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Inspect Case & Animal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Risk 2: Pen 4 AMU Concentration */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-900">Elevated AMU Concentration</span>
                    <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                      -6 pts
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-800">Pen 4 (Lactating Shed)</span>
                </div>
                <p className="text-xs text-on-surface leading-relaxed">
                  Pen 4 antimicrobial administration density is 28% higher than the overall farm benchmark, indicating possible environmental contamination or localized pathogen transmission.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols): Weighting Logic */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
            <h3 className="text-base font-bold text-primary flex items-center gap-2 pb-3 border-b border-outline-variant/40">
              <Scale className="w-4 h-4 text-secondary" />
              <span>Calculation Weighting</span>
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-outline-variant/30">
                <span className="text-on-surface-variant font-medium">Standard Baseline</span>
                <span className="font-bold text-on-surface">100 pts</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-outline-variant/30 text-emerald-700">
                <span>Positive Adherence Factors</span>
                <span className="font-bold">+22 pts</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-outline-variant/30 text-error">
                <span>Active Risk Deductions</span>
                <span className="font-bold">-40 pts</span>
              </div>
              <div className="flex justify-between py-2 pt-3 font-black text-primary text-sm">
                <span>Final Calibrated Score</span>
                <span className="text-secondary text-base">82 / 100</span>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-xl bg-surface-container text-[11px] text-on-surface-variant leading-relaxed">
              <strong>Stewardship Scoring Algorithm:</strong> PALYA follows WHO AWaRe classification guidelines. HP-CIA repeat courses incur exponential risk penalties to prevent farm-level antimicrobial resistance development.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
