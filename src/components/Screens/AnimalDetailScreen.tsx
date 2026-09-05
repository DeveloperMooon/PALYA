import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  FileText,
  Activity,
  QrCode,
  Printer,
  Calendar,
  ShieldAlert,
  Thermometer,
  Milk,
  Plus
} from 'lucide-react';
import { Animal, ScreenId, TreatmentRecord } from '../../types';

interface AnimalDetailScreenProps {
  animal: Animal;
  treatments: TreatmentRecord[];
  onNavigate: (screen: ScreenId) => void;
  onRecordTreatmentForAnimal: (animal: Animal) => void;
}

export const AnimalDetailScreen: React.FC<AnimalDetailScreenProps> = ({
  animal,
  treatments,
  onNavigate,
  onRecordTreatmentForAnimal
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'treatments' | 'mrl' | 'vitals'>('overview');
  const [showQrModal, setShowQrModal] = useState(false);

  const animalTreatments = treatments.filter((t) => t.animalId === animal.id);

  return (
    <div className="space-y-6 pb-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => onNavigate('livestock')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Livestock Directory</span>
        </button>
      </div>

      {/* Animal Header Card */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={animal.imageUrl}
              alt={animal.id}
              className="w-24 h-24 rounded-2xl object-cover border border-outline-variant shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-primary">
                  {animal.name || animal.id}
                </h1>
                <span className="text-xs font-mono font-bold bg-surface-container-high px-2 py-0.5 rounded text-outline">
                  {animal.tag}
                </span>

                <span
                  className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    animal.healthStatus === 'Healthy'
                      ? 'bg-emerald-100 text-emerald-800'
                      : animal.healthStatus === 'High Risk'
                      ? 'bg-error-container text-error'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {animal.healthStatus}
                </span>

                {animal.withdrawalStatus === 'Active' && (
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                    <Clock className="w-3.5 h-3.5" />
                    Withdrawal Active ({animal.withdrawalDaysLeft}d)
                  </span>
                )}
              </div>

              <p className="text-xs text-on-surface-variant mt-1.5">
                {animal.species} • {animal.breed} • {animal.gender} • {animal.age} • {animal.weight} kg
              </p>

              <p className="text-xs text-primary font-bold mt-1">
                Farm: {animal.farmName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowQrModal(true)}
              className="px-4 py-2 border border-outline-variant hover:bg-surface-container rounded-xl text-xs font-bold text-on-surface transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-primary" />
              <span>Digital Health Passport</span>
            </button>

            <button
              onClick={() => onRecordTreatmentForAnimal(animal)}
              className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-secondary-container" />
              <span>Record Treatment</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-outline-variant/60 mt-6 gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-outline'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('treatments')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'treatments' ? 'border-primary text-primary' : 'border-transparent text-outline'
            }`}
          >
            Treatments ({animalTreatments.length})
          </button>
          <button
            onClick={() => setActiveTab('mrl')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'mrl' ? 'border-primary text-primary' : 'border-transparent text-outline'
            }`}
          >
            MRL & Food Safety
          </button>
          <button
            onClick={() => setActiveTab('vitals')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'vitals' ? 'border-primary text-primary' : 'border-transparent text-outline'
            }`}
          >
            Vitals & Diagnostics
          </button>
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 Cols): Withdrawal & Treatment History */}
          <div className="lg:col-span-7 space-y-6">
            {/* Withdrawal status card */}
            {animal.withdrawalStatus === 'Active' ? (
              <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-700" />
                    Active Withdrawal Period
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 font-black text-xs">
                    {animal.withdrawalDaysLeft} Days Remaining
                  </span>
                </div>
                <p className="text-xs text-amber-950 leading-relaxed">
                  Food safety withholding active following recent antimicrobial therapy. Milk must not enter the bulk milk tank or commercial cold chain.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-950">Food Chain Safe: No active withdrawal</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase">Clear</span>
              </div>
            )}

            {/* Treatment History */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
                <h2 className="text-base font-bold text-primary">Treatment History</h2>
                <button
                  onClick={() => onRecordTreatmentForAnimal(animal)}
                  className="text-xs font-bold text-primary hover:text-secondary"
                >
                  + Add Treatment
                </button>
              </div>

              {animalTreatments.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {animalTreatments.map((trt) => (
                    <div
                      key={trt.id}
                      className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary text-sm">{trt.drug}</span>
                          <span className="text-[10px] text-outline font-mono">({trt.activeIngredient})</span>
                        </div>
                        <p className="text-on-surface-variant mt-1">
                          {trt.condition} • {trt.dosage} ({trt.route})
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-outline block">{trt.startDate}</span>
                        <span
                          className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-black ${
                            trt.status === 'Active'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {trt.status === 'Active' ? 'Withdrawal Active' : 'Completed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-outline">
                  No recorded antimicrobial treatments on file for this animal.
                </div>
              )}
            </div>
          </div>

          {/* Right Column (5 Cols): Clinical Vitals & Risk Metrics */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-primary pb-2 border-b border-outline-variant/40">
                Vital Signs & Clinical Indicators
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-secondary" />
                    <span className="text-on-surface-variant">Body Temperature</span>
                  </div>
                  <span className="font-black text-primary text-sm">38.6 °C (Normal)</span>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Milk className="w-4 h-4 text-secondary" />
                    <span className="text-on-surface-variant">Daily Milk Yield</span>
                  </div>
                  <span className="font-black text-primary text-sm">22.4 L / day</span>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-secondary" />
                    <span className="text-on-surface-variant">Somatic Cell Count (SCC)</span>
                  </div>
                  <span className="font-black text-amber-700 text-sm">380k / ml (Elevated)</span>
                </div>
              </div>
            </div>

            {/* Electronic Ear Tag Info */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-primary pb-2 border-b border-outline-variant/40">
                RFID & Traceability Specs
              </h3>
              <div className="text-xs space-y-2 text-on-surface-variant">
                <div className="flex justify-between">
                  <span>ISO 11784/85 Tag:</span>
                  <span className="font-mono font-bold text-primary">{animal.tag}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frequency:</span>
                  <span className="font-medium text-on-surface">134.2 kHz FDX-B</span>
                </div>
                <div className="flex justify-between">
                  <span>National Livestock Ledger:</span>
                  <span className="font-bold text-emerald-700">Verified Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Treatments Tab */}
      {activeTab === 'treatments' && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
          <h2 className="text-base font-bold text-primary mb-4">Complete Treatment Log</h2>
          <div className="space-y-3">
            {animalTreatments.map((trt) => (
              <div key={trt.id} className="p-4 rounded-xl border border-outline-variant/60 bg-surface-container-low">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-primary">{trt.drug}</h3>
                    <p className="text-xs text-on-surface-variant">{trt.activeIngredient} • {trt.dosage} ({trt.route})</p>
                    <p className="text-xs text-outline mt-1">Condition: {trt.condition}</p>
                    {trt.symptoms && <p className="text-xs text-outline">Notes: {trt.symptoms}</p>}
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-mono text-outline">{trt.startDate}</span>
                    <span className="block mt-1 font-bold text-primary">Dr: {trt.veterinarian}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MRL Tab */}
      {activeTab === 'mrl' && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-primary">Maximum Residue Limits (MRL) Audit</h2>
          <p className="text-xs text-on-surface-variant">
            Assessment of biological elimination curve against statutory residue thresholds.
          </p>
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
            <span className="text-xs font-bold text-primary block">Active Regimen: Amoxicillin Trihydrate</span>
            <p className="text-xs text-on-surface-variant mt-1">
              Statutory Milk MRL: 0.004 mg/kg. Estimated clearance half-life: 24h. Safe milk entry permitted only after {animal.withdrawalDaysLeft || 0} days.
            </p>
          </div>
        </div>
      )}

      {/* Vitals Tab */}
      {activeTab === 'vitals' && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-primary">Longitudinal Diagnostic Vitals</h2>
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant text-xs text-on-surface-variant">
            Routine milk conductivity, temperature telemetry, and veterinary somatic cell count assays recorded by in-line milking sensors.
          </div>
        </div>
      )}

      {/* Digital QR Passport Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-center">
            <h3 className="text-lg font-black text-primary">Digital Animal Passport</h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Scan for verified veterinary records and food chain clearance status.
            </p>

            <div className="my-6 p-6 bg-white rounded-2xl border-2 border-primary/20 shadow-inner inline-block">
              {/* QR Code Graphic */}
              <div className="w-40 h-40 bg-white flex flex-col justify-between p-2 border border-slate-200 rounded-lg">
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-primary rounded-xs" />
                  <div className="w-8 h-8 bg-primary rounded-xs" />
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-[10px] font-mono font-bold text-primary">{animal.tag}</span>
                </div>
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-primary rounded-xs" />
                  <div className="w-8 h-8 bg-secondary rounded-xs" />
                </div>
              </div>
            </div>

            <div className="text-xs font-mono font-bold text-primary mb-4">
              {animal.id} • {animal.tag}
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-xs hover:bg-primary-container"
            >
              Close Passport
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
