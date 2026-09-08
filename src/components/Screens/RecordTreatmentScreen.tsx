import React, { useEffect, useState } from 'react';
import {
  Stethoscope,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Save,
  UserCheck
} from 'lucide-react';

import {
  Animal,
  TreatmentRecord,
  ScreenId
} from '../../types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';

/* =========================================================
   PROPS
========================================================= */

interface RecordTreatmentScreenProps {
  animals: Animal[];

  onAddTreatment: (
    newTrt: TreatmentRecord
  ) => void;

  onNavigate: (
    screen: ScreenId
  ) => void;

  selectedAnimal?: Animal | null;
}

/* =========================================================
   MEDICINE RECORD FROM BACKEND
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
   HELPER
========================================================= */

const medicineMatchesSpecies = (
  medicineSpecies: string,
  animalSpecies: string
) => {
  const animal =
    animalSpecies.trim().toLowerCase();

  const supportedSpecies =
    medicineSpecies
      .split(',')
      .map((item) =>
        item.trim().toLowerCase()
      );

  return (
    supportedSpecies.includes(animal) ||
    supportedSpecies.includes('all') ||
    supportedSpecies.includes(
      'all species'
    )
  );
};

/* =========================================================
   COMPONENT
========================================================= */

export const RecordTreatmentScreen:
React.FC<RecordTreatmentScreenProps> = ({
  animals,
  onAddTreatment,
  onNavigate,
  selectedAnimal
}) => {

  /* =======================================================
     PATIENT
  ======================================================= */

  const [animalId, setAnimalId] =
    useState(
      selectedAnimal?.id ||
      animals[0]?.id ||
      ''
    );

  const [condition, setCondition] =
    useState('');

  const [symptoms, setSymptoms] =
    useState('');

  const [diagnosisDate, setDiagnosisDate] =
    useState(
      new Date()
        .toISOString()
        .split('T')[0]
    );

  /* =======================================================
     MEDICATION
  ======================================================= */

  const [drug, setDrug] =
    useState('');

  const [
    activeIngredient,
    setActiveIngredient
  ] = useState('');

  const [
    category,
    setCategory
  ] = useState<
    | 'Antibiotic'
    | 'Vaccine'
    | 'Anti-inflammatory'
    | 'Parasiticide'
  >('Antibiotic');

  const [dosage, setDosage] =
    useState('');

  const [
    doseUnit,
    setDoseUnit
  ] = useState<
    'mg' | 'ml' | 'bolus'
  >('mg');

  const [route, setRoute] =
    useState('');

  const [
    frequency,
    setFrequency
  ] = useState('Once daily');

  const [startDate, setStartDate] =
    useState(
      new Date()
        .toISOString()
        .split('T')[0]
    );

  const [
    lastDoseDate,
    setLastDoseDate
  ] = useState(
    new Date()
      .toISOString()
      .split('T')[0]
  );

  /* =======================================================
     VETERINARIAN
  ======================================================= */

  const [
    veterinarian,
    setVeterinarian
  ] = useState(
    'Dr. Suresh Kumar'
  );

  const [
    vetRegNumber,
    setVetRegNumber
  ] = useState(
    'VET-4521'
  );

  /* =======================================================
     SAVE STATE
  ======================================================= */

  const [isSaved, setIsSaved] =
    useState(false);

  const [
    isSaving,
    setIsSaving
  ] = useState(false);

  const [
    saveError,
    setSaveError
  ] = useState('');

  /* =======================================================
     MEDICINE DATABASE STATE
  ======================================================= */

  const [
    medicines,
    setMedicines
  ] = useState<
    MedicineRecord[]
  >([]);

  const [
    medicinesLoading,
    setMedicinesLoading
  ] = useState(true);

  const [
    medicinesError,
    setMedicinesError
  ] = useState('');

  /* =======================================================
     CURRENT SELECTED ANIMAL
  ======================================================= */

  const currentAnimal =
    animals.find(
      (animal) =>
        animal.id === animalId
    ) || null;

  /* =======================================================
     SPECIES-WISE MEDICINES

     Cattle selected  -> Cattle medicines
     Buffalo selected -> Buffalo medicines
     Goat selected    -> Goat medicines
     Sheep selected   -> Sheep medicines
     Pig selected     -> Pig medicines
     Chicken selected -> Chicken medicines
     Duck selected    -> Duck medicines
     Camel selected   -> Camel medicines
  ======================================================= */

  const speciesMedicines =
    currentAnimal
      ? medicines.filter(
          (medicine) =>
            medicineMatchesSpecies(
              medicine.species,
              currentAnimal.species
            )
        )
      : [];

  /* =======================================================
     FETCH MEDICINES FROM BACKEND
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
                  m.drug,

                activeIngredient:
                  m.active_ingredient,

                species:
                  m.species,

                mrl:
                  Number(
                    m.mrl
                  ) || 0,

                unit:
                  m.unit || '',

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

          setMedicines(
            mapped
          );
        } catch (err) {
          console.error(
            'Failed to load medicines:',
            err
          );

          setMedicinesError(
            err instanceof Error
              ? err.message
              : 'Failed to load medicines'
          );
        } finally {
          setMedicinesLoading(
            false
          );
        }
      };

    fetchMedicines();
  }, []);

  /* =======================================================
     AUTO SELECT VALID MEDICINE WHEN:
     - medicines load
     - animal changes
     - species changes
  ======================================================= */

  useEffect(() => {
    if (
      medicinesLoading ||
      !currentAnimal
    ) {
      return;
    }

    const allowedMedicines =
      medicines.filter(
        (medicine) =>
          medicineMatchesSpecies(
            medicine.species,
            currentAnimal.species
          )
      );

    /*
      No medicine exists for selected species
    */

    if (
      allowedMedicines.length === 0
    ) {
      setDrug('');
      setActiveIngredient('');
      setDosage('');
      setRoute('');
      return;
    }

    /*
      Check whether currently selected
      medicine is valid for species.
    */

    const existingDrug =
      allowedMedicines.find(
        (medicine) =>
          medicine.drug === drug
      );

    /*
      If valid, keep it.
    */

    if (existingDrug) {
      setActiveIngredient(
        existingDrug.activeIngredient
      );

      setDosage(
        existingDrug.standardDose
          ? existingDrug.standardDose.toString()
          : ''
      );

      setRoute(
        existingDrug.route
      );

      return;
    }

    /*
      Otherwise automatically select
      first valid medicine.
    */

    const firstMedicine =
      allowedMedicines[0];

    setDrug(
      firstMedicine.drug
    );

    setActiveIngredient(
      firstMedicine.activeIngredient
    );

    setDosage(
      firstMedicine.standardDose
        ? firstMedicine.standardDose.toString()
        : ''
    );

    setRoute(
      firstMedicine.route
    );
  }, [
    medicines,
    medicinesLoading,
    animalId
  ]);

  /* =======================================================
     MATCHED MEDICINE
  ======================================================= */

  const matchedDrug =
    speciesMedicines.find(
      (medicine) =>
        medicine.drug === drug
    ) || null;

  /* =======================================================
     WITHDRAWAL PERIOD
  ======================================================= */

  const withdrawalDays =
    matchedDrug
      ? matchedDrug.withdrawalDays
      : 0;

  const lastDateObj =
    new Date(
      lastDoseDate
    );

  const clearanceDateObj =
    new Date(
      lastDateObj
    );

  clearanceDateObj.setDate(
    clearanceDateObj.getDate() +
      withdrawalDays
  );

  const clearanceDateStr =
    clearanceDateObj.toLocaleDateString(
      'en-GB',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }
    );

  /* =======================================================
     DRUG SELECTION
  ======================================================= */

  const handleDrugSelect = (
    selectedDrug: string
  ) => {
    setDrug(
      selectedDrug
    );

    const found =
      speciesMedicines.find(
        (medicine) =>
          medicine.drug ===
          selectedDrug
      );

    if (!found) {
      setActiveIngredient('');
      setDosage('');
      setRoute('');
      return;
    }

    setActiveIngredient(
      found.activeIngredient
    );

    setDosage(
      found.standardDose
        ? found.standardDose.toString()
        : ''
    );

    setRoute(
      found.route
    );
  };

  /* =======================================================
     ANIMAL CHANGE
  ======================================================= */

  const handleAnimalChange = (
    selectedAnimalId: string
  ) => {
    setAnimalId(
      selectedAnimalId
    );

    /*
      Prevent medicine from previous
      animal/species remaining visible.
    */

    setDrug('');
    setActiveIngredient('');
    setDosage('');
    setRoute('');

    setIsSaved(false);
    setSaveError('');
  };

  /* =======================================================
     SAVE TREATMENT
  ======================================================= */

  const handleSave = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!currentAnimal) {
      setSaveError(
        'Please select an animal.'
      );
      return;
    }

    if (!matchedDrug) {
      setSaveError(
        `No valid medicine has been selected for ${currentAnimal.species}.`
      );
      return;
    }

    setIsSaving(true);
    setSaveError('');

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/api/treatments`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              animal_id:
                animalId,

              drug,

              active_ingredient:
                activeIngredient,

              category,

              dosage:
                dosage
                  ? `${dosage} ${doseUnit}/kg`
                  : '',

              dose_value:
                Number(
                  dosage
                ) || 0,

              dose_unit:
                doseUnit,

              route,

              frequency,

              start_date:
                startDate,

              end_date:
                lastDoseDate,

              last_dose_date:
                lastDoseDate,

              withdrawal_days:
                withdrawalDays,

              veterinarian,

              status:
                'Active',

              notes:
                `Condition: ${condition}\n` +
                `Symptoms: ${symptoms}\n` +
                `Diagnosis Date: ${diagnosisDate}\n` +
                `Vet Reg No: ${vetRegNumber}\n` +
                `Species: ${currentAnimal.species}`
            })
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          'Failed to save treatment'
        );
      }

      const saved =
        result.data;

      const newRecord:
        TreatmentRecord = {
        id:
          saved?.id ||
          `TRT-2026-${Math.floor(
            Math.random() *
              900 +
              100
          )}`,

        animalId,

        animalTag:
          currentAnimal.tag ||
          'TAG-UNKNOWN',

        species:
          currentAnimal.species,

        condition,

        drug,

        activeIngredient,

        category,

        dosage:
          dosage
            ? `${dosage} ${doseUnit}/kg`
            : '',

        doseValue:
          Number(
            dosage
          ) || 0,

        doseUnit,

        route,

        frequency,

        startDate,

        endDate:
          lastDoseDate,

        lastDoseDate,

        withdrawalDays,

        clearanceDate:
          saved?.clearance_date ||
          clearanceDateStr,

        veterinarian,

        vetRegNumber,

        status:
          'Active',

        symptoms
      };

      onAddTreatment(
        newRecord
      );

      setIsSaved(true);

      setTimeout(() => {
        onNavigate(
          'mrl'
        );
      }, 1800);

    } catch (error) {
      console.error(
        'Save treatment error:',
        error
      );

      setSaveError(
        error instanceof Error
          ? error.message
          : 'Failed to save treatment'
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6 pb-12">

      {/* HEADER */}

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
          Record Treatment & Medication
        </h1>

        <p className="text-sm text-on-surface-variant mt-1">
          Record species-specific medication and
          treatment details for withdrawal and
          food-safety monitoring.
        </p>
      </div>

      {/* SUCCESS */}

      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 flex items-center justify-between shadow-md animate-in fade-in">
          <div className="flex items-center gap-3">

            <CheckCircle2 className="w-5 h-5 text-emerald-700" />

            <div>
              <p className="text-xs font-black uppercase">
                Electronic Record Successfully Logged
              </p>

              <p className="text-xs">
                Animal{' '}
                <strong>
                  {animalId}
                </strong>{' '}
                placed under active withdrawal
                until{' '}
                <strong>
                  {clearanceDateStr}
                </strong>.
                Redirecting to compliance
                report...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SAVE ERROR */}

      {saveError && (
        <div className="p-4 rounded-xl bg-red-100 border border-red-300 text-red-950 flex items-center gap-3 shadow-md">

          <AlertTriangle className="w-5 h-5 text-red-700 shrink-0" />

          <p className="text-xs font-semibold">
            {saveError}
          </p>
        </div>
      )}

      {/* MEDICINE LOAD ERROR */}

      {medicinesError && (
        <div className="p-4 rounded-xl bg-surface-container border border-outline-variant text-on-surface flex items-center gap-3 shadow-md">

          <AlertTriangle className="w-5 h-5 text-secondary shrink-0" />

          <p className="text-xs font-semibold">
            Medicine list load nahi ho
            payi: {medicinesError}.
            Backend check karo.
          </p>
        </div>
      )}

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT */}

        <div className="lg:col-span-7 space-y-6">

          <form
            onSubmit={handleSave}
            className="space-y-6"
          >

            {/* ============================================
                SECTION 1
            ============================================ */}

            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs space-y-4">

              <h2 className="text-base font-bold text-primary pb-3 border-b border-outline-variant/40">
                1. Patient & Clinical Condition
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* ANIMAL */}

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Select Animal / Ear Tag
                  </label>

                  <select
                    id="trt-animal-select"
                    value={animalId}
                    onChange={(e) =>
                      handleAnimalChange(
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                    required
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
                          {animal.id}{' '}
                          ({animal.tag})
                          {' â€¢ '}
                          {animal.species}
                          {' - '}
                          {animal.name ||
                            animal.breed}
                        </option>
                      )
                    )}
                  </select>

                  {currentAnimal && (
                    <p className="mt-1.5 text-[11px] text-secondary font-bold">
                      Medicine list filtered for:{' '}
                      {currentAnimal.species}
                    </p>
                  )}
                </div>

                {/* CONDITION */}

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Clinical Diagnosis / Condition
                  </label>

                  <input
                    type="text"
                    value={
                      condition
                    }
                    onChange={(e) =>
                      setCondition(
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface"
                    placeholder="Enter veterinarian-assessed condition"
                    required
                  />
                </div>
              </div>

              {/* SYMPTOMS */}

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Observed Clinical Symptoms
                </label>

                <textarea
                  rows={2}
                  value={
                    symptoms
                  }
                  onChange={(e) =>
                    setSymptoms(
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface focus:outline-none"
                  placeholder="Record observed symptoms..."
                />
              </div>

              {/* DIAGNOSIS DATE */}

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Diagnosis Date
                </label>

                <input
                  type="date"
                  value={
                    diagnosisDate
                  }
                  onChange={(e) =>
                    setDiagnosisDate(
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                />
              </div>
            </div>

            {/* ============================================
                SECTION 2
            ============================================ */}

            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs space-y-4">

              <div className="flex items-center justify-between gap-4 pb-3 border-b border-outline-variant/40">

                <h2 className="text-base font-bold text-primary">
                  2. Medication & Intervention Details
                </h2>

                {currentAnimal && (
                  <span className="px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container text-[10px] font-black">
                    {currentAnimal.species}
                  </span>
                )}
              </div>

              {/* NO MEDICINES */}

              {!medicinesLoading &&
                currentAnimal &&
                speciesMedicines.length === 0 && (
                  <div className="p-3 rounded-xl bg-surface-container border border-outline-variant">

                    <div className="flex gap-2 items-start">

                      <AlertTriangle className="w-4 h-4 text-secondary mt-0.5 shrink-0" />

                      <div>
                        <p className="text-xs font-black text-on-surface">
                          No medicines configured for{' '}
                          {currentAnimal.species}
                        </p>

                        <p className="text-[11px] text-on-surface-variant mt-1">
                          Add medicines for this
                          species to the medicine
                          database before recording
                          treatment.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* DRUG */}

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Drug Administered
                  </label>

                  <select
                    id="trt-drug-select"
                    value={drug}
                    onChange={(e) =>
                      handleDrugSelect(
                        e.target.value
                      )
                    }
                    disabled={
                      medicinesLoading ||
                      speciesMedicines.length === 0
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface disabled:opacity-60"
                    required
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
                          No medicines available for{' '}
                          {currentAnimal?.species ||
                            'species'}
                        </option>
                      )}

                    {!medicinesLoading &&
                      speciesMedicines.length >
                        0 && (
                        <option
                          value=""
                          disabled
                        >
                          Select medicine
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
                          {medicine.drug}
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
                    currentAnimal && (
                      <p className="text-[10px] text-outline mt-1">
                        {
                          speciesMedicines.length
                        }{' '}
                        medicine
                        {speciesMedicines.length ===
                        1
                          ? ''
                          : 's'}{' '}
                        available for{' '}
                        {
                          currentAnimal.species
                        }
                      </p>
                    )}
                </div>

                {/* ACTIVE INGREDIENT */}

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
                    placeholder="Select a medicine"
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container text-outline cursor-not-allowed"
                  />
                </div>
              </div>

              {/* CATEGORY */}

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Medication Category
                </label>

                <select
                  value={
                    category
                  }
                  onChange={(e) =>
                    setCategory(
                      e.target.value as
                        | 'Antibiotic'
                        | 'Vaccine'
                        | 'Anti-inflammatory'
                        | 'Parasiticide'
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                >
                  <option value="Antibiotic">
                    Antibiotic
                  </option>

                  <option value="Vaccine">
                    Vaccine
                  </option>

                  <option value="Anti-inflammatory">
                    Anti-inflammatory
                  </option>

                  <option value="Parasiticide">
                    Parasiticide
                  </option>
                </select>
              </div>

              {/* DOSE / ROUTE / FREQUENCY */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Recorded Dose Value
                  </label>

                  <input
                    type="number"
                    value={
                      dosage
                    }
                    onChange={(e) =>
                      setDosage(
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface"
                    placeholder="Enter prescribed value"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Dose Unit
                  </label>

                  <select
                    value={
                      doseUnit
                    }
                    onChange={(e) =>
                      setDoseUnit(
                        e.target.value as
                          | 'mg'
                          | 'ml'
                          | 'bolus'
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                  >
                    <option value="mg">
                      mg
                    </option>

                    <option value="ml">
                      ml
                    </option>

                    <option value="bolus">
                      bolus
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Route
                  </label>

                  <input
                    type="text"
                    value={
                      route
                    }
                    onChange={(e) =>
                      setRoute(
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                    placeholder="Veterinarian-recorded route"
                  />
                </div>
              </div>

              {/* FREQUENCY */}

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Frequency
                </label>

                <select
                  value={
                    frequency
                  }
                  onChange={(e) =>
                    setFrequency(
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                >
                  <option value="Once daily">
                    Once daily
                  </option>

                  <option value="Twice daily">
                    Twice daily
                  </option>

                  <option value="Single Dose">
                    Single Dose
                  </option>

                  <option value="As prescribed">
                    As prescribed
                  </option>
                </select>
              </div>

              {/* DATES */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Treatment Start Date
                  </label>

                  <input
                    type="date"
                    value={
                      startDate
                    }
                    onChange={(e) =>
                      setStartDate(
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Last Dose Administered
                  </label>

                  <input
                    type="date"
                    value={
                      lastDoseDate
                    }
                    onChange={(e) =>
                      setLastDoseDate(
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Medication, dose, route and
                  frequency must follow the
                  prescribing veterinarian and
                  applicable product/regulatory
                  information. PALYA records and
                  monitors the treatment; it does
                  not independently prescribe
                  medication.
                </p>
              </div>
            </div>

            {/* ============================================
                SECTION 3
            ============================================ */}

            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs space-y-4">

              <h2 className="text-base font-bold text-primary pb-3 border-b border-outline-variant/40 flex items-center gap-2">

                <UserCheck className="w-4 h-4 text-secondary" />

                <span>
                  3. Prescribing Veterinarian
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Veterinarian Name
                  </label>

                  <input
                    type="text"
                    value={
                      veterinarian
                    }
                    onChange={(e) =>
                      setVeterinarian(
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    State Council Reg No.
                  </label>

                  <input
                    type="text"
                    value={
                      vetRegNumber
                    }
                    onChange={(e) =>
                      setVetRegNumber(
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                    required
                  />
                </div>
              </div>
            </div>

            {/* SAVE */}

            <button
              type="submit"
              id="btn-save-treatment"
              disabled={
                isSaving ||
                medicinesLoading ||
                !matchedDrug
              }
              className="w-full py-3.5 px-6 bg-primary hover:bg-primary-container active:scale-[0.99] text-on-primary rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >

              <Save className="w-4 h-4 text-secondary-container" />

              <span>
                {isSaving
                  ? 'Saving...'
                  : 'Save & Log Electronic Record'}
              </span>
            </button>
          </form>
        </div>

        {/* =================================================
            RIGHT: COMPLIANCE
        ================================================= */}

        <div className="lg:col-span-5 space-y-6">

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs space-y-5 sticky top-20">

            <div>
              <h3 className="text-base font-bold text-primary flex items-center gap-2">

                <ShieldCheck className="w-5 h-5 text-secondary" />

                <span>
                  Real-Time Compliance Assessment
                </span>
              </h3>

              <p className="text-xs text-on-surface-variant mt-0.5">
                Species-aware treatment and
                withdrawal monitoring using the
                medicine database.
              </p>
            </div>

            {/* ANIMAL */}

            {currentAnimal && (
              <div className="p-3 rounded-xl bg-primary-container/40 border border-primary/20">

                <p className="text-[10px] uppercase font-black tracking-wider text-primary">
                  Selected Patient
                </p>

                <div className="flex items-center justify-between gap-3 mt-1">

                  <span className="text-sm font-black text-primary">
                    {currentAnimal.id}
                  </span>

                  <span className="px-2 py-1 rounded-full bg-primary-container text-on-primary-container text-[10px] font-black">
                    {
                      currentAnimal.species
                    }
                  </span>
                </div>
              </div>
            )}

            {/* WITHDRAWAL */}

<div className="p-4 rounded-xl bg-surface-container border border-outline-variant space-y-3">

  <div className="flex items-center justify-between text-xs font-bold text-on-surface">

    <span className="flex items-center gap-1.5">
      <Clock className="w-4 h-4 text-secondary" />

      Calculated Withdrawal Period
    </span>

    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-black">
      {matchedDrug
        ? `${withdrawalDays} Days`
        : 'N/A'}
    </span>
  </div>

  {matchedDrug ? (
    <>
      <div className="flex items-baseline justify-between text-xs">

        <span className="text-on-surface-variant">
          Clearance Threshold:
        </span>

        <span className="font-extrabold text-on-surface text-sm">
          {clearanceDateStr}
        </span>
      </div>

      <p className="text-[11px] text-on-surface-variant leading-relaxed">
        âš ï¸{' '}
        <strong className="text-on-surface">
          Food Safety Restriction:
        </strong>{' '}
        Product withdrawal status for animal{' '}

        <strong className="text-on-surface">
          {animalId}
        </strong>{' '}

        remains active until the calculated clearance date,
        subject to the recorded medicine data and veterinarian
        instructions.
      </p>
    </>
  ) : (
    <p className="text-[11px] text-on-surface-variant">
      Select a valid medicine to calculate the withdrawal period.
    </p>
  )}

</div>

            {/* VALIDATION */}

            <div className="space-y-2.5 text-xs">

              <span className="font-bold text-primary uppercase tracking-wider text-[11px] block">
                Regulatory Validation Checks
              </span>

              {/* SPECIES */}

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">

                <span className="text-emerald-950 font-medium">
                  1. Species Compatibility:
                </span>

                <span className="font-bold text-emerald-800">
                  {matchedDrug
                    ? `${currentAnimal?.species} Match`
                    : 'Pending'}
                </span>
              </div>

              {/* DATABASE */}

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">

                <span className="text-emerald-950 font-medium">
                  2. Medicine Database:
                </span>

                <span className="font-bold text-emerald-800">
                  {matchedDrug
                    ? 'Record Found'
                    : 'Pending'}
                </span>
              </div>

              {/* MRL */}

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">

                <span className="text-emerald-950 font-medium">
                  3. Recorded MRL:
                </span>

                <span className="font-bold text-emerald-800">
                  {matchedDrug
                    ? `${matchedDrug.mrl} ${matchedDrug.unit || 'mg/kg'}`
                    : 'Pending'}
                </span>
              </div>

              {/* WITHDRAWAL */}

              <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-between gap-3">

                <span className="text-on-surface font-medium">
                  4. Food Chain Status:
                </span>

                <span className="font-bold text-on-surface-variant">
                  {matchedDrug
                    ? 'Active Withholding'
                    : 'Not Calculated'}
                </span>
              </div>
            </div>

            {/* REGULATORY BASIS */}

            {matchedDrug?.regulatoryBasis && (
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">

                <p className="text-[10px] uppercase tracking-wider font-black text-primary">
                  Regulatory Basis
                </p>

                <p className="text-[11px] text-on-surface-variant mt-1">
                  {
                    matchedDrug.regulatoryBasis
                  }
                </p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-surface-container-low text-[11px] text-outline">
              Treatment record is linked to
              animal identity, medicine,
              veterinarian details and
              withdrawal monitoring.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
