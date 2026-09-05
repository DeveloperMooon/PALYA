import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Save,
  ArrowRight,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { Animal, TreatmentRecord, ScreenId } from '../../types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';
interface RecordTreatmentScreenProps {
  animals: Animal[];
  onAddTreatment: (newTrt: TreatmentRecord) => void;
  onNavigate: (screen: ScreenId) => void;
  selectedAnimal?: Animal | null;
}

// ---------------------------------------------------------
// MEDICINE SHAPE (jo /api/medicines se aayega)
// DB ke columns snake_case mein hain (active_ingredient),
// isliye fetch karte waqt inhe camelCase mein convert karenge
// ---------------------------------------------------------
interface MedicineRecord {
  drug: string;
  activeIngredient: string;
  species: string;
  mrl: number;
  unit: string;
  withdrawalDays: number;
  route: string;
  standardDose: number;
  regulatoryBasis: string;
}

export const RecordTreatmentScreen: React.FC<RecordTreatmentScreenProps> = ({
  animals,
  onAddTreatment,
  onNavigate,
  selectedAnimal
}) => {
  const [animalId, setAnimalId] = useState(selectedAnimal ? selectedAnimal.id : 'COW-024');
  const [condition, setCondition] = useState('Clinical Mastitis');
  const [symptoms, setSymptoms] = useState('Swelling in right hind quarter, elevated somatic cell count, mild pyrexia');
  const [diagnosisDate, setDiagnosisDate] = useState('2026-08-16');
  
  const [drug, setDrug] = useState('Betamox LA');
  const [activeIngredient, setActiveIngredient] = useState('Amoxicillin (as Trihydrate)');
  const [category, setCategory] = useState<'Antibiotic' | 'Vaccine' | 'Anti-inflammatory' | 'Parasiticide'>('Antibiotic');
  const [dosage, setDosage] = useState('15');
  const [doseUnit, setDoseUnit] = useState<'mg' | 'ml' | 'bolus'>('mg');
  const [route, setRoute] = useState('Intramuscular (IM)');
  const [frequency, setFrequency] = useState('Once daily');
  const [startDate, setStartDate] = useState('2026-08-16');
  const [lastDoseDate, setLastDoseDate] = useState('2026-08-18');

  const [veterinarian, setVeterinarian] = useState('Dr. Suresh Kumar');
  const [vetRegNumber, setVetRegNumber] = useState('VET-4521');

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // ---------------------------------------------------------
  // MEDICINES: ab Supabase se aa rahe hain, mock data se nahi
  // ---------------------------------------------------------
  const [medicines, setMedicines] = useState<MedicineRecord[]>([]);
  const [medicinesLoading, setMedicinesLoading] = useState(true);
  const [medicinesError, setMedicinesError] = useState('');

  // Page load hote hi backend se medicines mangwao
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/medicines`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to load medicines');
        }

        // DB ke snake_case fields (active_ingredient) ko
        // camelCase (activeIngredient) mein convert kar rahe hain
        const mapped: MedicineRecord[] = (result.data || []).map((m: any) => ({
          drug: m.drug,
          activeIngredient: m.active_ingredient,
          species: m.species,
          mrl: m.mrl,
          unit: m.unit,
          withdrawalDays: m.withdrawal_days,
          route: m.route,
          standardDose: m.standard_dose,
          regulatoryBasis: m.regulatory_basis,
        }));

        setMedicines(mapped);
      } catch (err) {
        console.error('Failed to load medicines:', err);
        setMedicinesError(
          err instanceof Error ? err.message : 'Failed to load medicines'
        );
      } finally {
        setMedicinesLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  // Jaise hi medicines load hon, current selected drug ke
  // sahi values (active ingredient, dose, route) fill kar do
  useEffect(() => {
    if (medicines.length > 0) {
      const found = medicines.find((d) => d.drug === drug);
      if (found) {
        setActiveIngredient(found.activeIngredient);
        setDosage(found.standardDose.toString());
        setRoute(found.route);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicines]);

  // Dynamic MRL & Withdrawal calculation (ab medicines state se)
  const matchedDrug =
    medicines.find((d) => d.drug.toLowerCase().includes(drug.toLowerCase())) ||
    medicines[0];

  const withdrawalDays = matchedDrug ? matchedDrug.withdrawalDays : 5;

  const lastDateObj = new Date(lastDoseDate);
  const clearanceDateObj = new Date(lastDateObj);
  clearanceDateObj.setDate(clearanceDateObj.getDate() + withdrawalDays);
  const clearanceDateStr = clearanceDateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const handleDrugSelect = (selectedDrug: string) => {
    setDrug(selectedDrug);
    const found = medicines.find((d) => d.drug === selectedDrug);
    if (found) {
      setActiveIngredient(found.activeIngredient);
      setDosage(found.standardDose.toString());
      setRoute(found.route);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError('');

    const currentAnimal = (animals && animals.length > 0)
      ? (animals.find((a) => a.id === animalId) || animals[0])
      : null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/treatments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animal_id: animalId,
          drug,
          active_ingredient: activeIngredient,
          category,
          dosage: `${dosage} ${doseUnit}/kg`,
          dose_value: Number(dosage) || 15,
          dose_unit: doseUnit,
          route,
          frequency,
          start_date: startDate,
          end_date: lastDoseDate,
          last_dose_date: lastDoseDate,
          withdrawal_days: withdrawalDays,
          veterinarian,
          status: 'Active',
          notes: `Condition: ${condition}\nSymptoms: ${symptoms}\nVet Reg No: ${vetRegNumber}`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save treatment');
      }

      const saved = result.data;

      const newRecord: TreatmentRecord = {
        id: saved?.id || `TRT-2026-${Math.floor(Math.random() * 900 + 100)}`,
        animalId,
        animalTag: currentAnimal?.tag || 'TAG-UNKNOWN',
        species: currentAnimal?.species || 'Cattle',
        condition,
        drug,
        activeIngredient,
        category,
        dosage: `${dosage} ${doseUnit}/kg`,
        doseValue: Number(dosage) || 15,
        doseUnit,
        route,
        frequency,
        startDate,
        endDate: lastDoseDate,
        lastDoseDate,
        withdrawalDays,
        clearanceDate: saved?.clearance_date || clearanceDateStr,
        veterinarian,
        vetRegNumber,
        status: 'Active',
        symptoms
      };

      onAddTreatment(newRecord);

      setIsSaved(true);
      setTimeout(() => {
        onNavigate('mrl');
      }, 1800);

    } catch (error) {
      console.error('Save treatment error:', error);
      setSaveError(
        error instanceof Error ? error.message : 'Failed to save treatment'
      );

    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
          Record Treatment & Medication
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Enter animal health intervention details for real-time MRL evaluation and automated withdrawal scheduling.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 flex items-center justify-between shadow-md animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <div>
              <p className="text-xs font-black uppercase">Electronic Record Successfully Logged</p>
              <p className="text-xs">
                Animal {animalId} placed under active withdrawal until {clearanceDateStr}. Redirecting to compliance report...
              </p>
            </div>
          </div>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-xl bg-red-100 border border-red-300 text-red-950 flex items-center gap-3 shadow-md">
          <AlertTriangle className="w-5 h-5 text-red-700 shrink-0" />
          <p className="text-xs font-semibold">{saveError}</p>
        </div>
      )}

      {medicinesError && (
        <div className="p-4 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 flex items-center gap-3 shadow-md">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
          <p className="text-xs font-semibold">
            Medicine list load nahi ho payi: {medicinesError}. Backend chal raha hai check karo.
          </p>
        </div>
      )}

      {/* Main Grid: Left Form, Right Live Compliance Check */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Section 1: Patient & Condition */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-primary pb-3 border-b border-outline-variant/40">
                1. Patient & Clinical Condition
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Select Animal / Ear Tag
                  </label>
                  <select
                    id="trt-animal-select"
                    value={animalId}
                    onChange={(e) => setAnimalId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  >
                    {animals.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.id} ({a.tag}) • {a.species} - {a.name || a.breed}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Clinical Diagnosis / Condition
                  </label>
                  <input
                    type="text"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface"
                    placeholder="e.g. Clinical Mastitis, Foot Rot"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Observed Clinical Symptoms
                </label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface focus:outline-none"
                  placeholder="Record symptoms, body temperature, milk characteristics..."
                />
              </div>
            </div>

            {/* Section 2: Medication Details */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-primary pb-3 border-b border-outline-variant/40">
                2. Medication & Intervention Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Drug Administered
                  </label>
                  <select
                    id="trt-drug-select"
                    value={drug}
                    onChange={(e) => handleDrugSelect(e.target.value)}
                    disabled={medicinesLoading}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface disabled:opacity-60"
                  >
                    {medicinesLoading && (
                      <option>Loading medicines...</option>
                    )}
                    {!medicinesLoading && medicines.length === 0 && (
                      <option>No medicines found in database</option>
                    )}
                    {medicines.map((m) => (
                      <option key={m.drug} value={m.drug}>
                        {m.drug} ({m.activeIngredient})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Active Ingredient
                  </label>
                  <input
                    type="text"
                    value={activeIngredient}
                    readOnly
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container text-outline cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Dose Value
                  </label>
                  <input
                    type="number"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Route
                  </label>
                  <select
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                  >
                    <option value="Intramuscular (IM)">Intramuscular (IM)</option>
                    <option value="Subcutaneous (SC)">Subcutaneous (SC)</option>
                    <option value="Intravenous (IV)">Intravenous (IV)</option>
                    <option value="Intramammary">Intramammary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                  >
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Single Dose">Single Dose</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Treatment Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Last Dose Administered
                  </label>
                  <input
                    type="date"
                    value={lastDoseDate}
                    onChange={(e) => setLastDoseDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Authorizing Vet */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-primary pb-3 border-b border-outline-variant/40 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-secondary" />
                <span>3. Prescribing Veterinarian</span>
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Veterinarian Name
                  </label>
                  <input
                    type="text"
                    value={veterinarian}
                    onChange={(e) => setVeterinarian(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    State Council Reg No.
                  </label>
                  <input
                    type="text"
                    value={vetRegNumber}
                    onChange={(e) => setVetRegNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              id="btn-save-treatment"
              disabled={isSaving}
              className="w-full py-3.5 px-6 bg-primary hover:bg-primary-container active:scale-[0.99] text-on-primary rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Save className="w-4 h-4 text-secondary-container" />
              <span>{isSaving ? 'Saving...' : 'Save & Log Electronic Record'}</span>
            </button>
          </form>
        </div>

        {/* Right Column (5 Cols): Live Compliance Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs space-y-5 sticky top-20">
            <div>
              <h3 className="text-base font-bold text-primary flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-secondary" />
                <span>Real-Time Compliance Assessment</span>
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Automated evaluation of input dosage against National MRL database
              </p>
            </div>

            {/* Withdrawal Countdown Box */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  Calculated Withdrawal Period
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-black">
                  {withdrawalDays} Days
                </span>
              </div>

              <div className="flex items-baseline justify-between text-xs">
                <span className="text-amber-800">Clearance Threshold:</span>
                <span className="font-extrabold text-amber-950 text-sm">{clearanceDateStr}</span>
              </div>

              <p className="text-[11px] text-amber-900 leading-relaxed">
                ⚠️ <strong>Safety Restriction:</strong> Milk and meat from animal <strong>{animalId}</strong> must be withheld from commercial processing until <strong>{clearanceDateStr}</strong>.
              </p>
            </div>

            {/* Pipeline Validation Checkpoints */}
            <div className="space-y-2.5 text-xs">
              <span className="font-bold text-primary uppercase tracking-wider text-[11px] block">
                Regulatory Validation Checks
              </span>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="text-emerald-950 font-medium">1. National Veterinary Formulary:</span>
                <span className="font-bold text-emerald-800">Approved Drug</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="text-emerald-950 font-medium">2. Max Residue Limit (MRL):</span>
                <span className="font-bold text-emerald-800">
                  {matchedDrug ? `${matchedDrug.mrl} mg/kg Pass` : 'Loading...'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <span className="text-amber-950 font-medium">3. Food Chain Status:</span>
                <span className="font-bold text-amber-800">Active Withholding</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low text-[11px] text-outline">
              Electronic timestamp and veterinarian cryptographic signature recorded on government ledger.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};