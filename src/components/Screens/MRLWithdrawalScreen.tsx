import React, { useState, useEffect } from 'react';
import {
  Timer,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  FileCheck,
  Clock,
  ArrowRight,
  Info,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Animal } from '../../types';

interface MRLWithdrawalScreenProps {
  animals: Animal[];
  preselectedAnimal?: Animal | null;
  onSelectAnimal?: (animal: Animal) => void;
  onNavigate?: (screen: import('../../types').ScreenId) => void;
}

interface WithdrawalApiResponse {
  animalId: string;
  lastDoseDate: string;
  withdrawalDays: number;
  clearanceDate: string;
  status: 'Active' | 'Cleared';
  daysLeft: number;
}

// ---------------------------------------------------------
// MEDICINE SHAPE (jo /api/medicines se aata hai)
// DB ke columns snake_case mein hain, isliye fetch karte
// waqt inhe camelCase mein convert karenge
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

export const MRLWithdrawalScreen: React.FC<MRLWithdrawalScreenProps> = ({
  animals,
  preselectedAnimal,
  onSelectAnimal,
  onNavigate
}) => {
  // ---------------------------------------------------------
  // ANIMAL SELECTION
  // ---------------------------------------------------------

  const [selectedAnimalId, setSelectedAnimalId] = useState(
    preselectedAnimal ? preselectedAnimal.id : 'COW-024'
  );

  // ---------------------------------------------------------
  // TREATMENT / MRL DATA
  // ---------------------------------------------------------

  const [species, setSpecies] = useState('Cattle');
  const [drug, setDrug] = useState('Betamox LA');
  const [activeIngredient, setActiveIngredient] = useState(
    'Amoxicillin (as Trihydrate)'
  );
  const [dose, setDose] = useState('15');
  const [doseUnit, setDoseUnit] = useState('mg/kg');
  const [route, setRoute] = useState('Intramuscular (IM)');

  // These are now primarily populated from the backend
  const [startDate, setStartDate] = useState('2026-08-16');
  const [lastDoseDate, setLastDoseDate] = useState('2026-08-18');

  const [isCalculated, setIsCalculated] = useState(true);

  // ---------------------------------------------------------
  // MEDICINES: ab Supabase se aa rahe hain, mock data se nahi
  // ---------------------------------------------------------
  const [medicines, setMedicines] = useState<MedicineRecord[]>([]);
  const [medicinesLoading, setMedicinesLoading] = useState(true);
  const [medicinesError, setMedicinesError] = useState('');

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/medicines');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to load medicines');
        }

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

  // Jaise hi medicines load hon, current drug ke sahi values fill karo
  useEffect(() => {
    if (medicines.length > 0) {
      const found = medicines.find((d) => d.drug === drug);
      if (found) {
        setActiveIngredient(found.activeIngredient);
        setDose(found.standardDose.toString());
        setRoute(found.route);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicines]);

  // ---------------------------------------------------------
  // REAL BACKEND WITHDRAWAL STATE
  // ---------------------------------------------------------

   const [withdrawalStatus, setWithdrawalStatus] = useState<'Active' | 'Cleared' | null>(null);

  const [daysLeft, setDaysLeft] = useState<number | null>(null);

    const [clearanceDateFromApi, setClearanceDateFromApi] = useState<string | null>(null);

    const [withdrawalDaysFromApi, setWithdrawalDaysFromApi] = useState<number | null>(null);

  const [isLoadingWithdrawal, setIsLoadingWithdrawal] = useState(false);

  const [withdrawalError, setWithdrawalError] = useState<string | null>(null);

  // ---------------------------------------------------------
  // MATCH DRUG DATA FROM MEDICINES (ab Supabase se)
  // ---------------------------------------------------------

  const drugInfo =
    medicines.find((d) => d.drug === drug) || medicines[0];

  // ---------------------------------------------------------
  // NOTE ON MRL COMPLIANCE:
  // Pehle yahan ek fake "detectedResidue" number use hoke
  // hardcoded "Within MRL" / "Above MRL" dikhaya jaata tha —
  // lekin ye galat tha, kyunki koi asli lab test value abhi
  // database mein hai hi nahi. Jab tak treatments table mein
  // real detected_residue value na aaye (actual lab test se),
  // hum sirf regulatory LIMIT dikhayenge, koi pass/fail
  // compliance claim nahi karenge. Ye real MRL-checking wala
  // kaam agla step hai.
  // ---------------------------------------------------------

  // ---------------------------------------------------------
  // FETCH REAL WITHDRAWAL STATUS FROM BACKEND
  // ---------------------------------------------------------

  const fetchWithdrawalStatus = async (animalId: string) => {
    try {
      setIsLoadingWithdrawal(true);
      setWithdrawalError(null);

      const response = await fetch(
        `http://localhost:5000/api/withdrawal/${encodeURIComponent(animalId)}`
      );

      if (!response.ok) {
        throw new Error(
          `Withdrawal API returned status ${response.status}`
        );
      }

      const data: WithdrawalApiResponse = await response.json();

      // Update UI with actual backend values
      setWithdrawalStatus(data.status);
      setDaysLeft(data.daysLeft);
      setClearanceDateFromApi(data.clearanceDate);
      setWithdrawalDaysFromApi(data.withdrawalDays);
      setLastDoseDate(data.lastDoseDate);

      setIsCalculated(true);

      // Keep selected animal information in sync when available
      const matchedAnimal = animals.find((animal) => animal.id === animalId);

      if (matchedAnimal && onSelectAnimal) {
        onSelectAnimal(matchedAnimal);
      }
    } catch (error) {
      console.error('Withdrawal API error:', error);

      setWithdrawalStatus(null);
      setDaysLeft(null);
      setClearanceDateFromApi(null);
      setWithdrawalDaysFromApi(null);

      setWithdrawalError(
        'Unable to fetch withdrawal status from PALYA backend.'
      );
    } finally {
      setIsLoadingWithdrawal(false);
    }
  };

  // ---------------------------------------------------------
  // FETCH WHEN ANIMAL CHANGES
  // ---------------------------------------------------------

  useEffect(() => {
    if (selectedAnimalId) {
      fetchWithdrawalStatus(selectedAnimalId);
    }
  }, [selectedAnimalId]);

  // ---------------------------------------------------------
  // KEEP PRESELECTED ANIMAL IN SYNC
  // ---------------------------------------------------------

  useEffect(() => {
    if (preselectedAnimal?.id) {
      setSelectedAnimalId(preselectedAnimal.id);
    }
  }, [preselectedAnimal]);

  // ---------------------------------------------------------
  // DISPLAY VALUES
  // ---------------------------------------------------------

  const withdrawalDays =
    withdrawalDaysFromApi !== null
      ? withdrawalDaysFromApi
      : drugInfo
        ? drugInfo.withdrawalDays
        : 5;

  const clearanceDateStr = clearanceDateFromApi
    ? new Date(clearanceDateFromApi).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : '—';

  const isWithdrawalActive = withdrawalStatus === 'Active';

  const isCleared = withdrawalStatus === 'Cleared';

  const statusLabel = isLoadingWithdrawal
    ? 'CHECKING...'
    : isCleared
      ? 'CLEARED'
      : isWithdrawalActive
        ? 'WITHDRAWAL ACTIVE'
        : 'STATUS UNKNOWN';

  // ---------------------------------------------------------
  // DRUG CHANGE
  // ---------------------------------------------------------

  const handleDrugChange = (newDrug: string) => {
    setDrug(newDrug);

    const matched = medicines.find((d) => d.drug === newDrug);

    if (matched) {
      setActiveIngredient(matched.activeIngredient);
      setDose(matched.standardDose.toString());
      setRoute(matched.route);
    }
  };

  // ---------------------------------------------------------
  // ANIMAL CHANGE
  // ---------------------------------------------------------

  const handleAnimalChange = (animalId: string) => {
    setSelectedAnimalId(animalId);

    const matchedAnimal = animals.find(
      (animal) => animal.id === animalId
    );

    if (matchedAnimal) {
      setSpecies(matchedAnimal.species);

      if (onSelectAnimal) {
        onSelectAnimal(matchedAnimal);
      }
    }
  };

  // ---------------------------------------------------------
  // FORMAT API DATE
  // ---------------------------------------------------------

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';

    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <div className="space-y-6 pb-12">

      {/* ---------------------------------------------------
          HEADER
      --------------------------------------------------- */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
              MRL & Withdrawal Compliance
            </h1>

            <span className="text-[11px] font-bold bg-secondary-fixed/60 text-secondary border border-secondary/30 px-2.5 py-0.5 rounded-full">
              Live Backend
            </span>
          </div>

          <p className="text-sm text-on-surface-variant mt-1">
            Explore food safety compliance assessment based on treatment records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigate && (
            <button
              onClick={() => onNavigate('lab-result')}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors"
            >
              + Add Lab Result
            </button>
          )}

          <span className="text-xs font-semibold text-secondary flex items-center gap-1.5 bg-surface-container-high px-3 py-1.5 rounded-lg border border-outline-variant/60">
            <CheckCircle2 className="w-4 h-4 text-secondary" />
            <span>Harmonized with Codex & FSSAI Standards</span>
          </span>
        </div>
      </div>

      {medicinesError && (
        <div className="p-4 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 flex items-center gap-3 shadow-md">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
          <p className="text-xs font-semibold">
            Medicine list load nahi ho payi: {medicinesError}. Backend chal raha hai check karo.
          </p>
        </div>
      )}

      {/* ---------------------------------------------------
          MAIN GRID
      --------------------------------------------------- */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* -------------------------------------------------
            LEFT COLUMN
        ------------------------------------------------- */}

        <div className="lg:col-span-5 space-y-4">

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">

            <div className="pb-4 border-b border-outline-variant/40 mb-5">

              <h2 className="text-base font-bold text-primary">
                Check Compliance
              </h2>

              <p className="text-xs text-on-surface-variant mt-0.5">
                Select an animal and enter treatment details to check MRL
                compliance and withdrawal period.
              </p>

            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchWithdrawalStatus(selectedAnimalId);
                setIsCalculated(true);
              }}
              className="space-y-4"
            >

              {/* Animal */}

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Animal / Tag ID
                </label>

                <select
                  id="mrl-select-animal"
                  value={selectedAnimalId}
                  onChange={(e) => handleAnimalChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                >
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.id} ({a.tag}) - {a.species} - {a.name || a.breed}
                    </option>
                  ))}
                </select>
              </div>

              {/* Species */}

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Species
                </label>

                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface focus:outline-none"
                >
                  <option value="Cattle">Cattle</option>
                  <option value="Buffalo">Buffalo</option>
                  <option value="Sheep">Sheep</option>
                  <option value="Goat">Goat</option>
                </select>
              </div>

              {/* Drug */}

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Drug Administered
                </label>

                <select
                  id="mrl-select-drug"
                  value={drug}
                  onChange={(e) => handleDrugChange(e.target.value)}
                  disabled={medicinesLoading}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface focus:outline-none disabled:opacity-60"
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

              {/* Active Ingredient */}

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Active Ingredient
                </label>

                <input
                  type="text"
                  value={activeIngredient}
                  readOnly
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container text-on-surface-variant cursor-not-allowed"
                />
              </div>

              {/* Dose + Route */}

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Dose (mg/kg)
                  </label>

                  <input
                    type="number"
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Route
                  </label>

                  <select
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface"
                  >
                    <option value="Intramuscular (IM)">
                      Intramuscular (IM)
                    </option>

                    <option value="Subcutaneous (SC)">
                      Subcutaneous (SC)
                    </option>

                    <option value="Intravenous (IV)">
                      Intravenous (IV)
                    </option>

                    <option value="Intramammary">
                      Intramammary
                    </option>
                  </select>
                </div>

              </div>

              {/* Dates */}

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Treatment Start
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
                    Last Dose Date
                  </label>

                  <input
                    type="date"
                    value={lastDoseDate}
                    onChange={(e) => setLastDoseDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                  />
                </div>

              </div>

              {/* Error */}

              {withdrawalError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  <strong>Backend Error:</strong>{' '}
                  {withdrawalError}
                </div>
              )}

              {/* Check Button */}

              <button
                type="submit"
                id="btn-recalculate-compliance"
                disabled={isLoadingWithdrawal}
                className="w-full py-3 px-4 bg-primary hover:bg-primary-container disabled:opacity-60 active:scale-[0.99] text-on-primary rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>
                  {isLoadingWithdrawal
                    ? 'Checking...'
                    : 'Check Compliance'}
                </span>

                <ArrowRight className="w-4 h-4 text-secondary-container" />
              </button>

            </form>

          </div>

        </div>

        {/* -------------------------------------------------
            RIGHT COLUMN
        ------------------------------------------------- */}

        <div className="lg:col-span-7 space-y-4">

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">

            {/* Header */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-outline-variant/40 gap-3">

              <div>
                <h2 className="text-base font-bold text-primary">
                  Food Safety Compliance Assessment
                </h2>

                <p className="text-xs text-on-surface-variant mt-0.5">
                  Based on recorded treatment and regulatory limits
                </p>
              </div>

              {/* Dynamic Status Badge */}

              <div className="flex items-center gap-2">

                {isCleared ? (
                  <span className="px-3 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{statusLabel}</span>
                  </span>
                ) : isWithdrawalActive ? (
                  <span className="px-3 py-1.5 rounded-full text-xs font-black bg-error-container text-error flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                    <span>{statusLabel}</span>
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-full text-xs font-black bg-surface-container-high text-on-surface-variant flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{statusLabel}</span>
                  </span>
                )}

              </div>

            </div>

            {/* Dual Cards */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">

              {/* MRL Card — ab sirf regulatory LIMIT dikhata hai,
                  koi Pass/Fail claim nahi karta jab tak real lab
                  test value (detected_residue) available na ho */}

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-3">

                <div className="flex items-center justify-between">

                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Maximum Residue Limit (MRL)
                  </span>

                  <span className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 bg-surface-container-high text-on-surface-variant">
                    <Info className="w-3 h-3" />
                    Limit Only
                  </span>

                </div>

                <div className="flex items-baseline justify-between">

                  <div>
                    <span className="text-2xl font-black text-primary">
                      {drugInfo ? drugInfo.mrl : '—'}
                    </span>

                    <span className="text-xs text-outline ml-1">
                      {drugInfo ? drugInfo.unit : ''}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-outline block">
                      Lab Test Result
                    </span>

                    <span className="text-sm font-bold text-on-surface-variant">
                      Not yet tested
                    </span>
                  </div>

                </div>

                <p className="text-[11px] text-outline">
                  Basis: {drugInfo ? drugInfo.regulatoryBasis : 'Loading...'} (Harmonized).
                  Actual residue testing not yet integrated — this is the allowed limit only.
                </p>

              </div>

              {/* Withdrawal Card */}

              <div
                className={`p-4 rounded-xl space-y-3 ${
                  isCleared
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : 'bg-amber-500/10 border border-amber-500/30'
                }`}
              >

                <div className="flex items-center justify-between">

                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isCleared
                        ? 'text-emerald-900'
                        : 'text-amber-900'
                    }`}
                  >
                    Withdrawal Period
                  </span>

                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isCleared
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-amber-200 text-amber-900'
                    }`}
                  >
                    {isCleared ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}

                    {isCleared ? 'Cleared' : 'Active'}
                  </span>

                </div>

                <div className="flex items-baseline justify-between">

                  <div>
                    <span
                      className={`text-2xl font-black ${
                        isCleared
                          ? 'text-emerald-900'
                          : 'text-amber-900'
                      }`}
                    >
                      {withdrawalDays}
                    </span>

                    <span
                      className={`text-xs ml-1 ${
                        isCleared
                          ? 'text-emerald-800'
                          : 'text-amber-800'
                      }`}
                    >
                      Days Mandatory
                    </span>
                  </div>

                  <div className="text-right">

                    <span
                      className={`text-xs block ${
                        isCleared
                          ? 'text-emerald-800'
                          : 'text-amber-800'
                      }`}
                    >
                      Clearance
                    </span>

                    <span
                      className={`text-sm font-bold ${
                        isCleared
                          ? 'text-emerald-950'
                          : 'text-amber-950'
                      }`}
                    >
                      {clearanceDateStr}
                    </span>

                  </div>

                </div>

                {/* Timeline */}

                <div className="relative pt-2">

                  <div
                    className={`w-full rounded-full h-2 overflow-hidden ${
                      isCleared
                        ? 'bg-emerald-200'
                        : 'bg-amber-200'
                    }`}
                  >

                    <div
                      className={`h-2 rounded-full ${
                        isCleared
                          ? 'bg-emerald-600 w-full'
                          : 'bg-amber-600 w-3/5'
                      }`}
                    />

                  </div>

                  <div
                    className={`flex justify-between text-[10px] font-semibold mt-1 ${
                      isCleared
                        ? 'text-emerald-800'
                        : 'text-amber-800'
                    }`}
                  >

                    <span>
                      {formatDate(lastDoseDate)} (Last Dose)
                    </span>

                    <span>
                      {isCleared
                        ? 'Cleared'
                        : `Today • ${daysLeft ?? '—'} days left`}
                    </span>

                    <span>
                      {clearanceDateStr}
                    </span>

                  </div>

                </div>

                <p
                  className={`text-[11px] ${
                    isCleared
                      ? 'text-emerald-800'
                      : 'text-amber-800'
                  }`}
                >
                  Last Dose: {formatDate(lastDoseDate)} • Route: {route}
                </p>

              </div>

            </div>

            {/* Food Safety Decision */}

            {isCleared ? (
              <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-start gap-3.5">

                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />

                <div>

                  <p className="text-xs font-black text-emerald-800 uppercase tracking-wide">
                    CLEARED FOR FOOD CHAIN
                  </p>

                  <p className="text-xs text-on-surface mt-1 leading-relaxed">
                    The withdrawal period has ended. Milk and meat from this
                    animal can proceed through the food chain, subject to
                    applicable food-safety requirements.
                  </p>

                </div>

              </div>
            ) : isWithdrawalActive ? (
              <div className="mt-5 p-4 rounded-xl bg-error-container/40 border border-error/30 flex items-start gap-3.5">

                <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />

                <div>

                  <p className="text-xs font-black text-error uppercase tracking-wide">
                    NOT YET CLEARED FOR FOOD CHAIN
                  </p>

                  <p className="text-xs text-on-surface mt-1 leading-relaxed">
                    Withdrawal period is currently active. Milk and meat from
                    this animal must not enter the commercial food supply until{' '}
                    <strong>{clearanceDateStr}</strong>.
                  </p>

                </div>

              </div>
            ) : (
              <div className="mt-5 p-4 rounded-xl bg-surface-container-low border border-outline-variant flex items-start gap-3.5">

                <Info className="w-5 h-5 text-secondary shrink-0 mt-0.5" />

                <div>

                  <p className="text-xs font-black text-primary uppercase tracking-wide">
                    WITHDRAWAL STATUS UNAVAILABLE
                  </p>

                  <p className="text-xs text-on-surface mt-1 leading-relaxed">
                    The backend did not return a valid withdrawal status.
                    Check the PALYA backend connection.
                  </p>

                </div>

              </div>
            )}

            {/* Summary Status Pills */}

            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-outline-variant/40 text-center">

              <div className="p-2 rounded-lg bg-surface-container border border-outline-variant/60">

                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                  MRL Status
                </span>

                <span className="text-xs font-extrabold text-on-surface-variant">
                  Limit Only (No Test Yet)
                </span>

              </div>

              <div
                className={`p-2 rounded-lg border ${
                  isCleared
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >

                <span
                  className={`text-[10px] uppercase font-bold block ${
                    isCleared
                      ? 'text-emerald-800'
                      : 'text-amber-800'
                  }`}
                >
                  Withdrawal
                </span>

                <span
                  className={`text-xs font-extrabold ${
                    isCleared
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}
                >
                  {isCleared
                    ? 'Cleared'
                    : isWithdrawalActive
                      ? `Active (${daysLeft ?? '—'} days left)`
                      : 'Unknown'}
                </span>

              </div>

              <div
                className={`p-2 rounded-lg border ${
                  isCleared
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >

                <span
                  className={`text-[10px] uppercase font-bold block ${
                    isCleared
                      ? 'text-emerald-800'
                      : 'text-red-800'
                  }`}
                >
                  Food Chain Status
                </span>

                <span
                  className={`text-xs font-extrabold ${
                    isCleared
                      ? 'text-emerald-700'
                      : 'text-red-700'
                  }`}
                >
                  {isCleared
                    ? 'Cleared'
                    : isWithdrawalActive
                      ? 'Restricted'
                      : 'Unknown'}
                </span>

              </div>

            </div>

            {/* Regulatory Audit Trail */}

            <div className="mt-6 pt-4 border-t border-outline-variant/40">

              <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                Why? Regulatory Audit Trail
              </h3>

              <div className="space-y-2 text-xs text-on-surface-variant">

                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />

                  <span>
                    1. Treatment recorded on{' '}
                    <strong>{startDate}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />

                  <span>
                    2. Last dose recorded on{' '}
                    <strong>{formatDate(lastDoseDate)}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />

                  <span>
                    3. Regulatory withdrawal period identified:{' '}
                    <strong>{withdrawalDays} days</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />

                  <span>
                    4. Withdrawal period ends on{' '}
                    <strong>{clearanceDateStr}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">

                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isCleared
                        ? 'bg-emerald-500'
                        : 'bg-error'
                    }`}
                  />

                  <span>
                    5. Current withdrawal status →{' '}
                    <strong>
                      {isCleared
                        ? 'Clearance completed'
                        : isWithdrawalActive
                          ? 'Entry restricted'
                          : 'Status unavailable'}
                    </strong>
                  </span>

                </div>

              </div>

            </div>

            {/* Automated Compliance Pipeline */}

            <div className="mt-6 pt-4 border-t border-outline-variant/40">

              <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                Automated Compliance Check Pipeline
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px]">

                <div className="p-2 rounded-lg bg-surface-container border border-outline-variant">

                  <span className="font-bold text-primary block">
                    1. Treatment
                  </span>

                  <span className="text-outline">
                    Drug & Dose
                  </span>

                </div>

                <div className="p-2 rounded-lg bg-surface-container border border-outline-variant">

                  <span className="font-bold text-primary block">
                    2. Context
                  </span>

                  <span className="text-outline">
                    Species & Weight
                  </span>

                </div>

                <div className="p-2 rounded-lg bg-surface-container border border-outline-variant">

                  <span className="font-bold text-primary block">
                    3. MRL Eval
                  </span>

                  <span className="text-outline">
                    Residue Decay
                  </span>

                </div>

                <div className="p-2 rounded-lg bg-surface-container border border-outline-variant">

                  <span className="font-bold text-primary block">
                    4. Calc
                  </span>

                  <span className="text-outline">
                    Clearance Date
                  </span>

                </div>

                <div className="p-2 rounded-lg bg-primary-container text-on-primary-container font-bold col-span-2 sm:col-span-1 flex items-center justify-center">

                  <span>5. Decision</span>

                </div>

              </div>

            </div>

          </div>

          {/* Regulatory Reference */}

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <FileCheck className="w-5 h-5 text-secondary" />

              <div className="text-xs">

                <span className="font-bold text-primary">
                  PALYA Regulatory Dataset
                </span>

                <p className="text-[11px] text-outline">
                  Source: National Regulatory Database • Cattle •
                  Directive 2026/VET-MRL
                </p>

              </div>

            </div>

            <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">

              <span>View Directive</span>

              <ExternalLink className="w-3.5 h-3.5" />

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};