import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldAlert,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Send,
  Building,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { VeterinaryCase, ScreenId } from '../../types';

interface VeterinaryCaseScreenProps {
  vetCase: VeterinaryCase;
  onNavigate: (screen: ScreenId) => void;
  onApproveCase: (caseId: string) => void;
}

export const VeterinaryCaseScreen: React.FC<VeterinaryCaseScreenProps> = ({
  vetCase,
  onNavigate,
  onApproveCase
}) => {
  const [vetNotes, setVetNotes] = useState(
    'Recommend immediate bacteriological milk culture and antimicrobial susceptibility testing (AST) before authorizing further 4th-gen cephalosporin courses. Maintain animal in isolation pen with dedicated milking cluster.'
  );
  const [selectedAction, setSelectedAction] = useState<'approve' | 'diagnostics' | 'quarantine'>('diagnostics');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    onApproveCase(vetCase.id);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Back Navigation */}
      <div>
        <button
          onClick={() => onNavigate('veterinary-review')}
          className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Review Center</span>
        </button>
      </div>

      {/* Submission Success Toast */}
      {isSubmitted && (
        <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider">
                Veterinary Action Signed & Sealed
              </p>
              <p className="text-xs">
                Clinical order and quarantine instructions electronically dispatched to {vetCase.farmName} farm portal.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Patient Dossier Header */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={vetCase.imageUrl}
              alt={vetCase.tag}
              className="w-20 h-20 rounded-xl object-cover border border-outline-variant shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-primary">{vetCase.animalId}</h1>
                <span className="text-sm font-mono text-outline font-semibold">({vetCase.tag})</span>
                <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-error-container text-error">
                  {vetCase.riskLevel} Risk
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">
                  Veterinary Review Required
                </span>
              </div>

              <p className="text-xs text-on-surface-variant mt-1">
                {vetCase.species} • {vetCase.breed} • {vetCase.age} • {vetCase.weight} kg
              </p>

              <p className="text-xs font-bold text-primary mt-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-outline" />
                <span>{vetCase.farmName}</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-outline block">Escalation Date</span>
            <span className="text-xs font-mono font-bold text-primary">15 Aug 2026, 08:20 AM</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Timeline & History, Right Risk & Action Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Clinical Timeline & 12M History */}
        <div className="lg:col-span-7 space-y-6">
          {/* Clinical Timeline */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
            <h2 className="text-base font-bold text-primary pb-3 border-b border-outline-variant/40 mb-4">
              Clinical Timeline
            </h2>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant">
              {vetCase.timeline.map((event) => (
                <div key={event.id} className="relative">
                  {/* Dot icon */}
                  <span
                    className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                      event.type === 'alert'
                        ? 'bg-error'
                        : event.type === 'escalation'
                        ? 'bg-purple-600'
                        : event.type === 'treatment'
                        ? 'bg-secondary'
                        : 'bg-primary'
                    }`}
                  />
                  <div className="text-[11px] font-mono text-outline">{event.timestamp}</div>
                  <div className="text-xs font-bold text-primary mt-0.5">{event.title}</div>
                  <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Antimicrobial History (Past 12 Months) */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
            <div className="pb-3 border-b border-outline-variant/40 mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-primary">Antimicrobial History (Past 12 Months)</h2>
                <p className="text-xs text-on-surface-variant">Complete longitudinal AMU audit trail</p>
              </div>
              <span className="text-[11px] font-bold text-error bg-error-container px-2 py-0.5 rounded">
                HP-CIA Detected
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/60 text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                    <th className="py-2.5 px-3">Drug / Active Ingredient</th>
                    <th className="py-2.5 px-3">Dose & Route</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Veterinarian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {vetCase.antimicrobialHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-primary">{item.drug}</span>
                          {item.isHpCia && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-error text-white">
                              HP-CIA
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-outline block">{item.activeIngredient}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-on-surface">{item.doseRoute}</td>
                      <td className="py-2.5 px-3 text-outline">{item.date}</td>
                      <td className="py-2.5 px-3 font-medium text-on-surface">{item.vet}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Risk Analysis & Action Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Withdrawal Active Status Card */}
          <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-2">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-700" />
                Active Withdrawal Period
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-black">
                {vetCase.withdrawalDaysLeft} Days Remaining
              </span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              Clearance scheduled for <strong>23 Aug 2026</strong>. Milk and meat withholding is legally binding under national food safety statutes.
            </p>
          </div>

          {/* Risk Analysis Card */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-primary pb-2 border-b border-outline-variant/40 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-error" />
              <span>Veterinary Risk Analysis</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-error-container/30 border border-error/20">
                <span className="font-bold text-error block">HP-CIA Usage: 4th Gen Cephalosporin</span>
                <span className="text-[11px] text-on-surface">
                  Cefquinome is classified as Category B (Restrict) by the European Medicines Agency (EMA) and WHO.
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant">
                <span className="font-bold text-primary block">Repeated Therapy Within 30 Days</span>
                <span className="text-[11px] text-on-surface-variant">
                  3 distinct courses indicate therapeutic failure and high selective pressure for resistant bacterial strains.
                </span>
              </div>
            </div>
          </div>

          {/* Veterinary Action Order Form */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
            <h3 className="text-base font-bold text-primary pb-2 border-b border-outline-variant/40 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-secondary" />
              <span>Veterinary Order & Actions</span>
            </h3>

            <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Select Action Directive
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSelectedAction('diagnostics')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedAction === 'diagnostics'
                        ? 'bg-purple-100 text-purple-900 border-purple-400 ring-2 ring-purple-200'
                        : 'border-outline-variant hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    Request AST Test
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAction('quarantine')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedAction === 'quarantine'
                        ? 'bg-amber-100 text-amber-900 border-amber-400 ring-2 ring-amber-200'
                        : 'border-outline-variant hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    Isolation Flag
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAction('approve')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedAction === 'approve'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400 ring-2 ring-emerald-200'
                        : 'border-outline-variant hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    Approve Protocol
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Clinical Instructions for Farm Manager
                </label>
                <textarea
                  rows={4}
                  value={vetNotes}
                  onChange={(e) => setVetNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <button
                type="submit"
                id="btn-sign-vet-review"
                className="w-full py-3 bg-primary hover:bg-primary-container active:scale-[0.99] text-on-primary rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-secondary-container" />
                <span>Authorize & Dispatch Order</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
