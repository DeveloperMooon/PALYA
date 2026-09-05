import React from 'react';
import {
  ClipboardCheck,
  AlertCircle,
  AlertTriangle,
  Building,
  Timer,
  Activity,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { VeterinaryCase, ScreenId } from '../../types';

interface VeterinaryReviewScreenProps {
  cases: VeterinaryCase[];
  onSelectCase: (vetCase: VeterinaryCase) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const VeterinaryReviewScreen: React.FC<VeterinaryReviewScreenProps> = ({
  cases,
  onSelectCase,
  onNavigate
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
              Veterinary Review Center
            </h1>
            <span className="text-xs font-bold bg-primary-container text-on-primary-container px-2.5 py-0.5 rounded-full">
              Official Veterinary Portal
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">
            Review flagged cases, approve treatment protocols, and monitor antimicrobial stewardship.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-on-surface-variant font-medium bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/60">
            Assigned District: Meerut & Baghpat Zone
          </span>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* High Risk Animals */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-error/30 bg-error-container/10 shadow-xs">
          <p className="text-xs font-bold text-error uppercase tracking-wider flex items-center justify-between">
            <span>High-Risk Animals</span>
            <span className="w-2 h-2 rounded-full bg-error animate-ping" />
          </p>
          <div className="mt-2 text-3xl font-black text-error">4</div>
          <p className="text-[11px] text-error/90 mt-1 font-medium">Requires immediate attention</p>
        </div>

        {/* Farms Require Review */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 shadow-xs">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Farms Require Review
          </p>
          <div className="mt-2 text-3xl font-black text-primary">2</div>
          <p className="text-[11px] text-on-surface-variant mt-1">Oakridge, Meadow Brook</p>
        </div>

        {/* Active Withdrawals */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-amber-500/30 shadow-xs">
          <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            Active Withdrawals
          </p>
          <div className="mt-2 text-3xl font-black text-amber-700">2</div>
          <p className="text-[11px] text-amber-800 mt-1">Under supervision</p>
        </div>

        {/* Repeated AMU Cases */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 shadow-xs">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Repeated AMU Cases
          </p>
          <div className="mt-2 text-3xl font-black text-primary">3</div>
          <p className="text-[11px] text-on-surface-variant mt-1">Within last 30 days</p>
        </div>

        {/* Pending Reviews */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-secondary/30 bg-secondary-fixed/10 shadow-xs col-span-2 sm:col-span-1">
          <p className="text-xs font-bold text-secondary uppercase tracking-wider">
            Pending Reviews
          </p>
          <div className="mt-2 text-3xl font-black text-secondary">5</div>
          <p className="text-[11px] text-secondary mt-1 font-medium">Awaiting your sign-off</p>
        </div>
      </div>

      {/* Priority Cases for Review Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/40">
          <div>
            <h2 className="text-lg font-bold text-primary">Priority Cases for Review</h2>
            <p className="text-xs text-on-surface-variant">
              Cases automatically escalated due to HP-CIA administration, treatment repeats, or withdrawal active status
            </p>
          </div>
          <span className="text-xs font-bold text-outline">{cases.length} Clinical Dossiers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((vetCase) => (
            <div
              key={vetCase.id}
              className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Profile */}
                <div className="flex items-start gap-4">
                  <img
                    src={vetCase.imageUrl}
                    alt={vetCase.tag}
                    className="w-20 h-20 rounded-xl object-cover border border-outline-variant shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg font-black text-primary">{vetCase.animalId}</h3>
                      <span className="text-xs text-outline font-mono">({vetCase.tag})</span>
                    </div>

                    <p className="text-xs text-on-surface-variant">
                      {vetCase.species} • {vetCase.breed} • {vetCase.age} • {vetCase.weight} kg
                    </p>

                    <p className="text-xs font-semibold text-primary mt-1 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-outline" />
                      <span>{vetCase.farmName}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          vetCase.riskLevel === 'High'
                            ? 'bg-error-container text-error'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {vetCase.riskLevel} Risk
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
                        Veterinary Review Required
                      </span>
                    </div>
                  </div>
                </div>

                {/* Case Parameters */}
                <div className="mt-5 space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between">
                    <span className="text-outline font-medium">Primary Concern:</span>
                    <span className="font-bold text-error">{vetCase.primaryConcern}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between">
                    <span className="text-outline font-medium">Last Treatment:</span>
                    <span className="font-bold text-primary">
                      {vetCase.lastTreatment} ({vetCase.lastTreatmentDate})
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between">
                    <span className="text-outline font-medium">Withdrawal Status:</span>
                    {vetCase.withdrawalStatus === 'Active' ? (
                      <span className="font-bold text-amber-800 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Active ({vetCase.withdrawalDaysLeft} days remaining)
                      </span>
                    ) : (
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Cleared
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between">
                    <span className="text-outline font-medium">Stewardship Impact:</span>
                    <span
                      className={`font-bold ${
                        vetCase.stewardshipImpact === 'Negative' ? 'text-error' : 'text-amber-800'
                      }`}
                    >
                      {vetCase.stewardshipImpact}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-outline-variant/40 flex justify-end">
                <button
                  id={`btn-review-case-${vetCase.animalId}`}
                  onClick={() => onSelectCase(vetCase)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Review Case Dossier</span>
                  <ArrowRight className="w-4 h-4 text-secondary-container" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
