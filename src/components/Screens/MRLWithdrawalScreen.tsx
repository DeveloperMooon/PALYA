import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileCheck,
  Info,
  ShieldCheck
} from 'lucide-react';

import { Animal, ScreenId } from '../../types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* =========================================================
   PROPS
========================================================= */

interface MRLWithdrawalScreenProps {
  animals: Animal[];
  preselectedAnimal?: Animal | null;
  onSelectAnimal?: (animal: Animal) => void;
  onNavigate?: (screen: ScreenId) => void;
}

/* =========================================================
   BACKEND WITHDRAWAL RESPONSE
========================================================= */

interface WithdrawalApiResponse {
  animalId: string;
  lastDoseDate: string;
  withdrawalDays: number;
  clearanceDate: string;
  status: 'Active' | 'Cleared';
  daysLeft: number;
}

/* =========================================================
   MEDICINE RECORD
========================================================= */

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

/* =========================================================
   SPECIES MATCHING
========================================================= */

const medicineMatchesSpecies = (
  medicineSpecies: string,
  animalSpecies: string
) => {
  const target = animalSpecies.trim().toLowerCase();

  const supported = medicineSpecies
    .split(',')
    .map((item) => item.trim().toLowerCase());

  return (
    supported.includes(target) ||
    supported.includes('all') ||
    supported.includes('all species')
  );
};

/* =========================================================
   COMPONENT
========================================================= */

export const MRLWithdrawalScreen:
React.FC<MRLWithdrawalScreenProps> = ({
  animals,
  preselectedAnimal,
  onSelectAnimal,
  onNavigate
}) => {
  /* =======================================================
     SELECTED ANIMAL
  ======================================================= */

  const [selectedAnimalId, setSelectedAnimalId] =
    useState<string>(
      preselectedAnimal?.id ||
      animals[0]?.id ||
      ''
    );

  const selectedAnimal = useMemo(
    () =>
      animals.find(
        (animal) =>
          animal.id === selectedAnimalId
      ) || null,
    [animals, selectedAnimalId]
  );

  const species =
    selectedAnimal?.species || '';

  /* =======================================================
     MEDICINE STATE
  ======================================================= */

  const [medicines, setMedicines] =
    useState<MedicineRecord[]>([]);

  const [medicinesLoading, setMedicinesLoading] =
    useState(true);

  const [medicinesError, setMedicinesError] =
    useState('');

  const [drug, setDrug] = useState('');

  const [
    activeIngredient,
    setActiveIngredient
  ] = useState('');

  const [dose, setDose] = useState('');

  const [doseUnit] = useState('mg/kg');

  const [route, setRoute] = useState('');

  /* =======================================================
     TREATMENT DATES
  ======================================================= */

  const today =
    new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] =
    useState(today);

  const [lastDoseDate, setLastDoseDate] =
    useState(today);

  /* =======================================================
     WITHDRAWAL STATE
  ======================================================= */

  const [
    withdrawalStatus,
    setWithdrawalStatus
  ] = useState<
    'Active' | 'Cleared' | null
  >(null);

  const [
    daysLeft,
    setDaysLeft
  ] = useState<number | null>(
    null
  );

  const [
    clearanceDateFromApi,
    setClearanceDateFromApi
  ] = useState<string | null>(
    null
  );

  const [
    withdrawalDaysFromApi,
    setWithdrawalDaysFromApi
  ] = useState<number | null>(
    null
  );

  const [
    isLoadingWithdrawal,
    setIsLoadingWithdrawal
  ] = useState(false);

  const [
    withdrawalError,
    setWithdrawalError
  ] = useState<string | null>(
    null
  );

  const [
    isCalculated,
    setIsCalculated
  ] = useState(false);

  /* =======================================================
     FETCH MEDICINES
  ======================================================= */

  useEffect(() => {
    const fetchMedicines =
      async () => {
        try {
          setMedicinesLoading(true);
          setMedicinesError('');

          const response =
            await fetch(
              `${API_BASE_URL}/api/medicines`
            );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result.message ||
              'Failed to load medicines'
            );
          }

          const mapped:
            MedicineRecord[] =
            (
              result.data || []
            ).map(
              (m: any) => ({
                drug:
                  m.drug || '',

                activeIngredient:
                  m.active_ingredient ||
                  '',

                species:
                  m.species || '',

                mrl:
                  Number(m.mrl) || 0,

                unit:
                  m.unit || 'mg/kg',

                withdrawalDays:
                  Number(
                    m.withdrawal_days
                  ) || 0,

                route:
                  m.route || '',

                standardDose:
                  Number(
                    m.standard_dose
                  ) || 0,

                regulatoryBasis:
                  m.regulatory_basis ||
                  ''
              })
            );

          setMedicines(mapped);
        } catch (error) {
          console.error(
            'Failed to load medicines:',
            error
          );

          setMedicinesError(
            error instanceof Error
              ? error.message
              : 'Failed to load medicines'
          );
        } finally {
          setMedicinesLoading(false);
        }
      };

    fetchMedicines();
  }, []);

  /* =======================================================
     SPECIES MEDICINES
  ======================================================= */

  const speciesMedicines =
    useMemo(() => {
      if (!selectedAnimal) {
        return [];
      }

      return medicines.filter(
        (medicine) =>
          medicineMatchesSpecies(
            medicine.species,
            selectedAnimal.species
          )
      );
    }, [
      medicines,
      selectedAnimal
    ]);

  /* =======================================================
     AUTO SELECT FIRST VALID MEDICINE
  ======================================================= */

  useEffect(() => {
    /*
      Animal changed.

      Clear previous species medicine so:
      Camel never keeps Cattle medicine,
      Pig never keeps Buffalo medicine, etc.
    */

    setDrug('');
    setActiveIngredient('');
    setDose('');
    setRoute('');

    setWithdrawalStatus(null);
    setDaysLeft(null);
    setClearanceDateFromApi(null);
    setWithdrawalDaysFromApi(null);
    setWithdrawalError(null);
    setIsCalculated(false);

    if (
      medicinesLoading ||
      !selectedAnimal
    ) {
      return;
    }

    const allowed =
      medicines.filter(
        (medicine) =>
          medicineMatchesSpecies(
            medicine.species,
            selectedAnimal.species
          )
      );

    if (
      allowed.length === 0
    ) {
      return;
    }

    const first =
      allowed[0];

    setDrug(first.drug);

    setActiveIngredient(
      first.activeIngredient
    );

    setDose(
      first.standardDose > 0
        ? first.standardDose.toString()
        : ''
    );

    setRoute(first.route);

  }, [
    selectedAnimalId,
    medicines,
    medicinesLoading
  ]);

  /* =======================================================
     PRESELECTED ANIMAL
  ======================================================= */

  useEffect(() => {
    if (
      preselectedAnimal?.id
    ) {
      setSelectedAnimalId(
        preselectedAnimal.id
      );
    }
  }, [
    preselectedAnimal
  ]);

  /* =======================================================
     SELECTED MEDICINE INFO
  ======================================================= */

  const drugInfo =
    useMemo(
      () =>
        speciesMedicines.find(
          (medicine) =>
            medicine.drug === drug
        ) || null,
      [
        speciesMedicines,
        drug
      ]
    );

  /* =======================================================
     DRUG CHANGE
  ======================================================= */

  const handleDrugChange = (
    newDrug: string
  ) => {
    setDrug(newDrug);

    const matched =
      speciesMedicines.find(
        (medicine) =>
          medicine.drug === newDrug
      );

    if (!matched) {
      setActiveIngredient('');
      setDose('');
      setRoute('');
      return;
    }

    setActiveIngredient(
      matched.activeIngredient
    );

    setDose(
      matched.standardDose > 0
        ? matched.standardDose.toString()
        : ''
    );

    setRoute(
      matched.route
    );

    /*
      New drug means previous
      compliance result is stale.
    */

    setWithdrawalStatus(null);
    setDaysLeft(null);
    setClearanceDateFromApi(null);
    setWithdrawalDaysFromApi(null);
    setWithdrawalError(null);
    setIsCalculated(false);
  };

  /* =======================================================
     ANIMAL CHANGE
  ======================================================= */

  const handleAnimalChange = (
    newAnimalId: string
  ) => {
    setSelectedAnimalId(
      newAnimalId
    );

    const matchedAnimal =
      animals.find(
        (animal) =>
          animal.id === newAnimalId
      );

    if (
      matchedAnimal &&
      onSelectAnimal
    ) {
      onSelectAnimal(
        matchedAnimal
      );
    }
  };

  /* =======================================================
     FETCH WITHDRAWAL STATUS
  ======================================================= */

  const fetchWithdrawalStatus =
    async (
      animalId: string
    ) => {
      if (!animalId) {
        return;
      }

      try {
        setIsLoadingWithdrawal(
          true
        );

        setWithdrawalError(
          null
        );

        const response =
          await fetch(
            `${API_BASE_URL}/api/withdrawal/${encodeURIComponent(
              animalId
            )}`
          );

        if (!response.ok) {
          throw new Error(
            `Withdrawal API returned ${response.status}`
          );
        }

        const data:
          WithdrawalApiResponse =
          await response.json();

        setWithdrawalStatus(
          data.status
        );

        setDaysLeft(
          data.daysLeft
        );

        setClearanceDateFromApi(
          data.clearanceDate
        );

        setWithdrawalDaysFromApi(
          data.withdrawalDays
        );

        if (
          data.lastDoseDate
        ) {
          setLastDoseDate(
            data.lastDoseDate
          );
        }

        setIsCalculated(true);

      } catch (error) {
        console.error(
          'Withdrawal API error:',
          error
        );

        setWithdrawalStatus(
          null
        );

        setDaysLeft(
          null
        );

        setClearanceDateFromApi(
          null
        );

        setWithdrawalDaysFromApi(
          null
        );

        setWithdrawalError(
          'No recorded withdrawal status was returned for this animal.'
        );

        setIsCalculated(true);

      } finally {
        setIsLoadingWithdrawal(
          false
        );
      }
    };

  /* =======================================================
     DISPLAY WITHDRAWAL DAYS
  ======================================================= */

  const withdrawalDays =
    withdrawalDaysFromApi !== null
      ? withdrawalDaysFromApi
      : drugInfo
        ? drugInfo.withdrawalDays
        : 0;

  /* =======================================================
     LOCAL CLEARANCE PREVIEW

     This is only shown when API has not
     returned a clearance date.
  ======================================================= */

  const localClearanceDate =
    useMemo(() => {
      if (
        !lastDoseDate ||
        withdrawalDays <= 0
      ) {
        return null;
      }

      const date =
        new Date(
          `${lastDoseDate}T00:00:00`
        );

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return null;
      }

      date.setDate(
        date.getDate() +
        withdrawalDays
      );

      return date;
    }, [
      lastDoseDate,
      withdrawalDays
    ]);

  const clearanceDateStr =
    clearanceDateFromApi
      ? new Date(
          clearanceDateFromApi
        ).toLocaleDateString(
          'en-GB',
          {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }
        )
      : localClearanceDate
        ? localClearanceDate
            .toLocaleDateString(
              'en-GB',
              {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              }
            )
        : 'â€”';

  /* =======================================================
     STATUS
  ======================================================= */

  const isWithdrawalActive =
    withdrawalStatus ===
    'Active';

  const isCleared =
    withdrawalStatus ===
    'Cleared';

  const statusLabel =
    isLoadingWithdrawal
      ? 'CHECKING...'
      : isCleared
        ? 'CLEARED'
        : isWithdrawalActive
          ? 'WITHDRAWAL ACTIVE'
          : 'STATUS UNKNOWN';

  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate = (
    dateString: string
  ) => {
    if (!dateString) {
      return 'â€”';
    }

    const date =
      new Date(
        `${dateString}T00:00:00`
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateString;
    }

    return date.toLocaleDateString(
      'en-GB',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }
    );
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6 pb-12">

      {/* ===================================================
          HEADER
      =================================================== */}

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
            Species-aware food safety and
            withdrawal assessment based on
            recorded treatment data.
          </p>
        </div>

        <div className="flex items-center gap-2">

          {onNavigate && (
            <button
              type="button"
              onClick={() =>
                onNavigate(
                  'lab-result'
                )
              }
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors"
            >
              + Add Lab Result
            </button>
          )}

          <span className="text-xs font-semibold text-secondary flex items-center gap-1.5 bg-surface-container-high px-3 py-1.5 rounded-lg border border-outline-variant/60">

            <CheckCircle2 className="w-4 h-4 text-secondary" />

            <span>
              Regulatory Dataset
            </span>
          </span>
        </div>
      </div>

      {/* ===================================================
          MEDICINE ERROR
      =================================================== */}

      {medicinesError && (
        <div className="p-4 rounded-xl bg-surface-container border border-outline-variant text-on-surface flex items-center gap-3 shadow-md">

          <AlertTriangle className="w-5 h-5 text-secondary shrink-0" />

          <p className="text-xs font-semibold">
            Medicine list load nahi
            ho payi: {medicinesError}.
            Backend check karo.
          </p>
        </div>
      )}

      {/* ===================================================
          MAIN GRID
      =================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="lg:col-span-5 space-y-4">

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">

            <div className="pb-4 border-b border-outline-variant/40 mb-5">

              <h2 className="text-base font-bold text-primary">
                Check Compliance
              </h2>

              <p className="text-xs text-on-surface-variant mt-0.5">
                Select an animal. Species and
                medicine options automatically
                synchronize with that animal.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();

                fetchWithdrawalStatus(
                  selectedAnimalId
                );
              }}
              className="space-y-4"
            >

              {/* ===========================================
                  ANIMAL
              =========================================== */}

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Animal / Tag ID
                </label>

                <select
                  id="mrl-select-animal"
                  value={
                    selectedAnimalId
                  }
                  onChange={(e) =>
                    handleAnimalChange(
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                >
                  {animals.map(
                    (animal) => (
                      <option
                        key={
                          animal.id
                        }
                        value={
                          animal.id
                        }
                      >
                        {animal.id}
                        {' ('}
                        {animal.tag}
                        {') â€” '}
                        {
                          animal.species
                        }
                        {' â€” '}
                        {animal.name ||
                          animal.breed}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* ===========================================
                  SPECIES - READ ONLY
              =========================================== */}

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Species
                </label>

                <input
                  type="text"
                  value={species}
                  readOnly
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container text-on-surface cursor-not-allowed"
                />
              </div>

              {/* ===========================================
                  MEDICINES
              =========================================== */}

              <div>
                <div className="flex items-center justify-between gap-3 mb-1.5">

                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Drug Administered
                  </label>

                  {selectedAnimal && (
                    <span className="text-[10px] font-black text-secondary">
                      {
                        speciesMedicines.length
                      }{' '}
                      for{' '}
                      {
                        selectedAnimal.species
                      }
                    </span>
                  )}
                </div>

                <select
                  id="mrl-select-drug"
                  value={drug}
                  onChange={(e) =>
                    handleDrugChange(
                      e.target.value
                    )
                  }
                  disabled={
                    medicinesLoading ||
                    speciesMedicines.length === 0
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface focus:outline-none disabled:opacity-60"
                >

                  {medicinesLoading && (
                    <option value="">
                      Loading medicines...
                    </option>
                  )}

                  {!medicinesLoading &&
                    speciesMedicines.length ===
                      0 && (
                      <option value="">
                        No medicines available
                        for {species}
                      </option>
                    )}

                  {speciesMedicines.map(
                    (medicine) => (
                      <option
                        key={`${medicine.species}-${medicine.drug}`}
                        value={
                          medicine.drug
                        }
                      >
                        {
                          medicine.drug
                        }
                        {' ('}
                        {
                          medicine.activeIngredient
                        }
                        {')'}
                      </option>
                    )
                  )}
                </select>

                {!medicinesLoading &&
                  selectedAnimal &&
                  speciesMedicines.length ===
                    0 && (
                    <div className="mt-2 p-3 rounded-xl bg-surface-container border border-outline-variant text-[11px] text-on-surface">

                      <strong>
                        No medicine records:
                      </strong>{' '}

                      Database me{' '}
                      {
                        selectedAnimal.species
                      }{' '}
                      ke medicines add karo.
                    </div>
                  )}
              </div>

              {/* ===========================================
                  ACTIVE INGREDIENT
              =========================================== */}

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Active Ingredient
                </label>

                <input
                  type="text"
                  value={
                    activeIngredient
                  }
                  readOnly
                  placeholder="Select medicine"
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container text-on-surface-variant cursor-not-allowed"
                />
              </div>

              {/* ===========================================
                  DOSE + ROUTE
              =========================================== */}

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Recorded Dose
                  </label>

                  <input
                    type="number"
                    value={dose}
                    onChange={(e) =>
                      setDose(
                        e.target.value
                      )
                    }
                    placeholder="Recorded value"
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface"
                  />

                  <p className="text-[10px] text-outline mt-1">
                    Unit: {doseUnit}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Route
                  </label>

                  <input
                    type="text"
                    value={route}
                    onChange={(e) =>
                      setRoute(
                        e.target.value
                      )
                    }
                    placeholder="Recorded route"
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface"
                  />
                </div>
              </div>

              {/* ===========================================
                  DATES
              =========================================== */}

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Treatment Start
                  </label>

                  <input
                    type="date"
                    value={
                      startDate
                    }
                    onChange={(e) => {
                      setStartDate(
                        e.target.value
                      );

                      setIsCalculated(
                        false
                      );
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Last Dose Date
                  </label>

                  <input
                    type="date"
                    value={
                      lastDoseDate
                    }
                    onChange={(e) => {
                      setLastDoseDate(
                        e.target.value
                      );

                      setIsCalculated(
                        false
                      );
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                  />
                </div>
              </div>

              {/* ===========================================
                  WITHDRAWAL API ERROR
              =========================================== */}

              {withdrawalError && (
                <div className="p-3 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface">

                  <strong>
                    Treatment record:
                  </strong>{' '}

                  {withdrawalError}
                </div>
              )}

              {/* ===========================================
                  CHECK
              =========================================== */}

              <button
                type="submit"
                id="btn-recalculate-compliance"
                disabled={
                  isLoadingWithdrawal ||
                  !selectedAnimal ||
                  !drugInfo
                }
                className="w-full py-3 px-4 bg-primary hover:bg-primary-container disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] text-on-primary rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >

                <span>
                  {isLoadingWithdrawal
                    ? 'Checking...'
                    : 'Check Compliance'}
                </span>

                <ArrowRight className="w-4 h-4 text-secondary-container" />
              </button>

              <p className="text-[10px] text-outline leading-relaxed">
                PALYA records the
                medicine and regulatory
                withdrawal information.
                Medication selection and
                administration remain under
                veterinary authority.
              </p>
            </form>
          </div>
        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="lg:col-span-7 space-y-4">

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">

            {/* =============================================
                HEADER
            ============================================= */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-outline-variant/40 gap-3">

              <div>
                <h2 className="text-base font-bold text-primary">
                  Food Safety Compliance Assessment
                </h2>

                <p className="text-xs text-on-surface-variant mt-0.5">
                  Based on selected animal,
                  species-specific medicine
                  records and treatment data.
                </p>
              </div>

              <div>
                {isCleared ? (
                  <span className="px-3 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 flex items-center gap-1.5">

                    <CheckCircle2 className="w-4 h-4" />

                    {statusLabel}
                  </span>

                ) : isWithdrawalActive ? (

                  <span className="px-3 py-1.5 rounded-full text-xs font-black bg-error-container text-error">
                    {statusLabel}
                  </span>

                ) : (

                  <span className="px-3 py-1.5 rounded-full text-xs font-black bg-surface-container-high text-on-surface-variant flex items-center gap-1.5">

                    <Clock className="w-4 h-4" />

                    {statusLabel}
                  </span>
                )}
              </div>
            </div>

            {/* =============================================
                SELECTED PATIENT
            ============================================= */}

            {selectedAnimal && (
              <div className="mt-5 p-4 rounded-xl bg-primary-container/30 border border-primary/20">

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-black text-primary">
                      Selected Patient
                    </p>

                    <p className="font-black text-primary mt-1">
                      {
                        selectedAnimal.id
                      }
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-black">
                    {
                      selectedAnimal.species
                    }
                  </span>
                </div>
              </div>
            )}

            {/* =============================================
                CARDS
            ============================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">

              {/* MRL */}

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-3">

                <div className="flex items-center justify-between">

                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Maximum Residue Limit
                    (MRL)
                  </span>

                  <span className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 bg-surface-container-high text-on-surface-variant">

                    <Info className="w-3 h-3" />

                    Limit Only
                  </span>
                </div>

                <div>
                  <span className="text-2xl font-black text-primary">
                    {drugInfo
                      ? drugInfo.mrl
                      : 'â€”'}
                  </span>

                  <span className="text-xs text-outline ml-1">
                    {drugInfo
                      ? drugInfo.unit
                      : ''}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-outline block">
                    Lab Test Result
                  </span>

                  <span className="text-sm font-bold text-on-surface-variant">
                    Not yet tested
                  </span>
                </div>

                <p className="text-[11px] text-outline">
                  {drugInfo
                    ? `Basis: ${
                        drugInfo.regulatoryBasis ||
                        'Medicine database record'
                      }`
                    : 'Select a medicine to view its regulatory record.'}
                </p>
              </div>

              {/* WITHDRAWAL */}

              <div
                className={`p-4 rounded-xl space-y-3 ${
                  isCleared
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : 'bg-surface-container0/10 border border-outline-variant'
                }`}
              >

                <div className="flex items-center justify-between">

                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isCleared
                        ? 'text-emerald-900'
                        : 'text-on-surface'
                    }`}
                  >
                    Withdrawal Period
                  </span>

                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isCleared
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-surface-container-high text-on-surface'
                    }`}
                  >
                    {withdrawalStatus
                      ? isCleared
                        ? 'Cleared'
                        : 'Active'
                      : 'Not Checked'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">

                  <div>
                    <span
                      className={`text-2xl font-black ${
                        isCleared
                          ? 'text-emerald-900'
                          : 'text-on-surface'
                      }`}
                    >
                      {drugInfo
                        ? withdrawalDays
                        : 'â€”'}
                    </span>

                    <span
                      className={`text-xs ml-1 ${
                        isCleared
                          ? 'text-emerald-800'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      Days
                    </span>
                  </div>

                  <div className="text-right">

                    <span className="text-xs text-outline block">
                      Clearance
                    </span>

                    <span className="text-sm font-bold text-on-surface">
                      {
                        clearanceDateStr
                      }
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-on-surface-variant">
                  Last Dose:{' '}
                  {
                    formatDate(
                      lastDoseDate
                    )
                  }
                  {' â€¢ '}
                  Route:{' '}
                  {route || 'â€”'}
                </p>
              </div>
            </div>

            {/* =============================================
                STATUS MESSAGE
            ============================================= */}

            {isCleared ? (
              <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-start gap-3">

                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />

                <div>
                  <p className="text-xs font-black text-emerald-800 uppercase">
                    Withdrawal Completed
                  </p>

                  <p className="text-xs text-on-surface mt-1">
                    The recorded withdrawal
                    period has ended. Final
                    food-chain eligibility remains
                    subject to applicable
                    food-safety requirements.
                  </p>
                </div>
              </div>

            ) : isWithdrawalActive ? (

              <div className="mt-5 p-4 rounded-xl bg-error-container/40 border border-error/30 flex items-start gap-3">

                <AlertTriangle className="w-5 h-5 text-error shrink-0" />

                <div>
                  <p className="text-xs font-black text-error uppercase">
                    Withdrawal Active
                  </p>

                  <p className="text-xs text-on-surface mt-1">
                    Recorded food products
                    remain under withdrawal until{' '}
                    <strong>
                      {clearanceDateStr}
                    </strong>.
                  </p>
                </div>
              </div>

            ) : (

              <div className="mt-5 p-4 rounded-xl bg-surface-container-low border border-outline-variant flex items-start gap-3">

                <Info className="w-5 h-5 text-secondary shrink-0" />

                <div>
                  <p className="text-xs font-black text-primary uppercase">
                    Withdrawal Status Not Yet Confirmed
                  </p>

                  <p className="text-xs text-on-surface mt-1">
                    Select the correct animal
                    and medicine, then press
                    Check Compliance.
                  </p>
                </div>
              </div>
            )}

            {/* =============================================
                SUMMARY
            ============================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-outline-variant/40 text-center">

              <div className="p-2 rounded-lg bg-surface-container border border-outline-variant/60">

                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                  Species
                </span>

                <span className="text-xs font-extrabold text-primary">
                  {species || 'â€”'}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-surface-container border border-outline-variant/60">

                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                  MRL Status
                </span>

                <span className="text-xs font-extrabold text-on-surface-variant">
                  Limit Only
                </span>
              </div>

              <div className="p-2 rounded-lg bg-surface-container border border-outline-variant/60">

                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                  Withdrawal
                </span>

                <span className="text-xs font-extrabold text-on-surface-variant">
                  {isCleared
                    ? 'Cleared'
                    : isWithdrawalActive
                      ? `Active (${
                          daysLeft ??
                          'â€”'
                        } days)`
                      : 'Not Confirmed'}
                </span>
              </div>
            </div>

            {/* =============================================
                AUDIT TRAIL
            ============================================= */}

            <div className="mt-6 pt-4 border-t border-outline-variant/40">

              <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                Regulatory Audit Trail
              </h3>

              <div className="space-y-2 text-xs text-on-surface-variant">

                <div>
                  1. Animal:{' '}
                  <strong>
                    {
                      selectedAnimal?.id ||
                      'â€”'
                    }
                  </strong>
                </div>

                <div>
                  2. Species:{' '}
                  <strong>
                    {species || 'â€”'}
                  </strong>
                </div>

                <div>
                  3. Medicine:{' '}
                  <strong>
                    {drug || 'â€”'}
                  </strong>
                </div>

                <div>
                  4. Last dose:{' '}
                  <strong>
                    {
                      formatDate(
                        lastDoseDate
                      )
                    }
                  </strong>
                </div>

                <div>
                  5. Recorded withdrawal:{' '}
                  <strong>
                    {
                      withdrawalDays
                    }{' '}
                    days
                  </strong>
                </div>

                <div>
                  6. Current status:{' '}
                  <strong>
                    {isCleared
                      ? 'Cleared'
                      : isWithdrawalActive
                        ? 'Restricted'
                        : 'Pending backend record'}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* ===============================================
              DATASET REFERENCE
          =============================================== */}

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center gap-3">

            <FileCheck className="w-5 h-5 text-secondary" />

            <div className="text-xs">

              <span className="font-bold text-primary">
                PALYA Regulatory Dataset
              </span>

              <p className="text-[11px] text-outline">
                Species:{' '}
                {species || 'â€”'}
                {' â€¢ '}
                Medicine:{' '}
                {drug || 'Not selected'}
              </p>
            </div>
          </div>

          {/* Optional state indicator */}
          {isCalculated && withdrawalError && (
            <div className="p-3 rounded-xl bg-surface-container border border-outline-variant text-[11px] text-on-surface">
              Medicine and species data are
              synchronized correctly. No
              confirmed withdrawal record was
              returned by the backend for this
              animal.
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
