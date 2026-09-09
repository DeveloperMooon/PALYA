import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  Activity,
  AlertTriangle,
  Beef,
  CheckCircle2,
  Droplets,
  Leaf,
  Pill,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Wheat,
  Zap
} from 'lucide-react';

import {
  Animal
} from '../../types';

import {
  calculateDryMatter,
  getNutritionProfile,
  getNutritionStages
} from '../../data/nutritionData';


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';


/*
=========================================================
PROPS
=========================================================
*/

interface AMUDashboardScreenProps {
  animals: Animal[];
}


/*
=========================================================
AMU TYPES
=========================================================
*/

interface DrugBreakdownItem {
  drug: string;
  count: number;
  percentage: number;
}


interface MonthlyTrendItem {
  month: string;
  count: number;
}


interface AMUSummaryData {
  totalAllTreatments: number;
  totalAntibioticTreatments: number;

  drugBreakdown:
    DrugBreakdownItem[];

  mostUsedDrug:
    DrugBreakdownItem | null;

  monthlyTrend:
    MonthlyTrendItem[];
}


/*
=========================================================
COMPONENT
=========================================================
*/

export const AMUDashboardScreen:
React.FC<AMUDashboardScreenProps> = ({
  animals
}) => {


  /*
  =======================================================
  AMU STATE
  =======================================================
  */

  const [
    amuData,
    setAmuData
  ] =
    useState<AMUSummaryData | null>(
      null
    );


  const [
    amuLoading,
    setAmuLoading
  ] =
    useState(true);


  const [
    amuError,
    setAmuError
  ] =
    useState('');


  /*
  =======================================================
  NUTRITION STATE
  =======================================================
  */

  const [
    selectedAnimalId,
    setSelectedAnimalId
  ] =
    useState<string>(
      animals[0]?.id || ''
    );


  const [
    selectedStage,
    setSelectedStage
  ] =
    useState('');


  /*
  =======================================================
  LOAD AMU DATA
  =======================================================
  */

  useEffect(() => {

    const loadAMU =
      async () => {

        try {

          setAmuLoading(
            true
          );

          setAmuError(
            ''
          );


          const response =
            await fetch(
              `${API_BASE_URL}/api/amu-summary`
            );


          if (!response.ok) {

            throw new Error(
              `AMU API failed (${response.status})`
            );
          }


          const result =
            await response.json();


          setAmuData(
            result?.data || null
          );

        } catch (error) {

          console.error(
            'AMU summary error:',
            error
          );


          setAmuError(
            error instanceof Error
              ? error.message
              : 'Failed to load AMU data'
          );

        } finally {

          setAmuLoading(
            false
          );
        }
      };


    loadAMU();

  }, []);


  /*
  =======================================================
  KEEP ANIMAL SELECTION VALID
  =======================================================
  */

  useEffect(() => {

    if (
      !selectedAnimalId &&
      animals.length > 0
    ) {

      setSelectedAnimalId(
        animals[0].id
      );

      return;
    }


    const stillExists =
      animals.some(
        (animal) =>
          animal.id ===
          selectedAnimalId
      );


    if (
      animals.length > 0 &&
      !stillExists
    ) {

      setSelectedAnimalId(
        animals[0].id
      );
    }

  }, [
    animals,
    selectedAnimalId
  ]);


  /*
  =======================================================
  SELECTED ANIMAL
  =======================================================
  */

  const selectedAnimal =
    useMemo(
      () => {

        return (
          animals.find(
            (animal) =>
              animal.id ===
              selectedAnimalId
          ) || null
        );

      },
      [
        animals,
        selectedAnimalId
      ]
    );


  /*
  =======================================================
  AVAILABLE NUTRITION STAGES
  =======================================================
  */

  const stageOptions =
    useMemo(
      () => {

        if (
          !selectedAnimal
        ) {

          return [];
        }


        return getNutritionStages(
          selectedAnimal.species
        );

      },
      [
        selectedAnimal
      ]
    );


  /*
  =======================================================
  AUTOMATIC DEFAULT STAGE
  =======================================================
  */

  useEffect(() => {

    if (
      stageOptions.length === 0
    ) {

      setSelectedStage(
        ''
      );

      return;
    }


    const currentStageValid =
      stageOptions.some(
        (stage) =>
          stage.key ===
          selectedStage
      );


    if (
      !currentStageValid
    ) {

      setSelectedStage(
        stageOptions[0].key
      );
    }

  }, [
    stageOptions,
    selectedStage
  ]);


  /*
  =======================================================
  NUTRITION PROFILE
  =======================================================
  */

  const nutritionProfile =
    useMemo(
      () => {

        if (
          !selectedAnimal ||
          !selectedStage
        ) {

          return null;
        }


        return getNutritionProfile(
          selectedAnimal.species,
          selectedStage
        );

      },
      [
        selectedAnimal,
        selectedStage
      ]
    );


  /*
  =======================================================
  DRY MATTER CALCULATION
  =======================================================
  */

  const dryMatter =
    useMemo(
      () => {

        if (
          !selectedAnimal ||
          !nutritionProfile
        ) {

          return null;
        }


        const weight =
          Number(
            selectedAnimal.weight
          );


        if (
          !Number.isFinite(weight) ||
          weight <= 0
        ) {

          return null;
        }


        return calculateDryMatter(
          weight,
          nutritionProfile
        );

      },
      [
        selectedAnimal,
        nutritionProfile
      ]
    );


  /*
  =======================================================
  AMU CALCULATIONS
  =======================================================
  */

  const antibioticShare =
    useMemo(
      () => {

        if (
          !amuData ||
          amuData.totalAllTreatments === 0
        ) {

          return 0;
        }


        return Math.round(
          (
            amuData
              .totalAntibioticTreatments
            /
            amuData
              .totalAllTreatments
          ) *
          100
        );

      },
      [
        amuData
      ]
    );


  /*
  =======================================================
  FORMAT RANGE
  =======================================================
  */

  const formatPercent =
    (
      range?: {
        min: number;
        max: number;
      }
    ) => {

      if (!range) {
        return '—';
      }


      if (
        range.min ===
        range.max
      ) {

        return `${range.min}%`;
      }


      return (
        `${range.min}–${range.max}%`
      );
    };


  /*
  =======================================================
  RENDER
  =======================================================
  */

  return (

    <div className="space-y-8 pb-12">


      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">


        <div>


          <div className="flex items-center gap-2 mb-2">


            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">


              <ShieldCheck className="w-5 h-5 text-on-primary-container" />


            </div>


            <span className="text-xs font-black uppercase tracking-[0.18em] text-primary">

              PALYA Intelligence

            </span>


          </div>


          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">

            AMU & Nutrition Intelligence

          </h1>


          <p className="text-sm text-on-surface-variant mt-2 max-w-3xl">

            Monitor antimicrobial usage while supporting
            preventive herd management through
            species, body-weight and production-stage
            based nutrition guidance.

          </p>


        </div>


        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50">


          <CheckCircle2 className="w-4 h-4 text-emerald-700" />


          <span className="text-xs font-black text-emerald-800">

            Stewardship Monitoring Active

          </span>


        </div>


      </div>


      {/* =====================================================
          AMU SECTION
      ===================================================== */}

      <section className="space-y-4">


        <div>


          <h2 className="text-lg font-black text-primary">

            Antimicrobial Usage Overview

          </h2>


          <p className="text-xs text-on-surface-variant mt-1">

            Treatment-level antibiotic usage derived from
            recorded livestock treatment data.

          </p>


        </div>


        {amuLoading && (

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant">

            <p className="text-sm text-on-surface-variant">

              Loading antimicrobial usage data...

            </p>

          </div>

        )}


        {amuError && (

          <div className="p-4 rounded-2xl border border-error/30 bg-error-container flex gap-3">


            <AlertTriangle className="w-5 h-5 text-error shrink-0" />


            <div>


              <p className="text-xs font-black text-on-error-container">

                Unable to load AMU data

              </p>


              <p className="text-xs text-on-error-container mt-1">

                {amuError}

              </p>


            </div>


          </div>

        )}


        {!amuLoading &&
          !amuError &&
          amuData && (

          <>


            {/* KPI CARDS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">


              {/* ALL TREATMENTS */}

              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs">


                <div className="flex items-center justify-between">


                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center">


                    <Activity className="w-5 h-5 text-primary" />


                  </div>


                </div>


                <p className="text-3xl font-black text-primary mt-4">

                  {
                    amuData
                      .totalAllTreatments
                  }

                </p>


                <p className="text-xs font-bold text-on-surface mt-1">

                  Total Treatments

                </p>


                <p className="text-[11px] text-on-surface-variant mt-1">

                  All recorded treatment events

                </p>


              </div>


              {/* ANTIBIOTICS */}

              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs">


                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">


                  <Pill className="w-5 h-5 text-amber-700" />


                </div>


                <p className="text-3xl font-black text-primary mt-4">

                  {
                    amuData
                      .totalAntibioticTreatments
                  }

                </p>


                <p className="text-xs font-bold text-on-surface mt-1">

                  Antibiotic Treatments

                </p>


                <p className="text-[11px] text-on-surface-variant mt-1">

                  Antimicrobial-class records

                </p>


              </div>


              {/* ANTIBIOTIC SHARE */}

              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs">


                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">


                  <TrendingDown className="w-5 h-5 text-blue-700" />


                </div>


                <p className="text-3xl font-black text-primary mt-4">

                  {antibioticShare}%

                </p>


                <p className="text-xs font-bold text-on-surface mt-1">

                  Antibiotic Share

                </p>


                <p className="text-[11px] text-on-surface-variant mt-1">

                  Of total treatment events

                </p>


              </div>


              {/* MOST USED */}

              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs">


                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">


                  <ShieldCheck className="w-5 h-5 text-violet-700" />


                </div>


                <p className="text-lg font-black text-primary mt-4 truncate">


                  {
                    amuData
                      .mostUsedDrug
                      ?.drug ||
                    'No antibiotic use'
                  }


                </p>


                <p className="text-xs font-bold text-on-surface mt-1">

                  Most Used Antibiotic

                </p>


                <p className="text-[11px] text-on-surface-variant mt-1">

                  {
                    amuData
                      .mostUsedDrug
                      ? `${amuData.mostUsedDrug.count} treatment records`
                      : 'No antibiotic treatment recorded'
                  }

                </p>


              </div>


            </div>


            {/* DRUG BREAKDOWN */}

            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs">


              <h3 className="text-sm font-black text-primary">

                Antibiotic Usage Distribution

              </h3>


              <p className="text-xs text-on-surface-variant mt-1 mb-5">

                Relative contribution of each antibiotic
                among antimicrobial treatment records.

              </p>


              {amuData
                .drugBreakdown
                .length === 0 ? (


                <div className="py-8 text-center">


                  <ShieldCheck className="w-9 h-9 text-emerald-600 mx-auto" />


                  <p className="text-sm font-bold text-primary mt-3">

                    No antibiotic usage recorded

                  </p>


                </div>


              ) : (


                <div className="space-y-4">


                  {amuData
                    .drugBreakdown
                    .map(
                      (
                        item
                      ) => (

                      <div
                        key={
                          item.drug
                        }
                      >


                        <div className="flex items-center justify-between gap-3 mb-1.5">


                          <span className="text-xs font-bold text-on-surface truncate">


                            {
                              item.drug
                            }


                          </span>


                          <span className="text-xs font-black text-primary">


                            {
                              item.percentage
                            }%


                          </span>


                        </div>


                        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">


                          <div

                            className="h-full rounded-full bg-primary transition-all"

                            style={{
                              width:
                                `${Math.min(
                                  item.percentage,
                                  100
                                )}%`
                            }}

                          />


                        </div>


                        <p className="text-[10px] text-on-surface-variant mt-1">


                          {
                            item.count
                          } treatment{
                            item.count !== 1
                              ? 's'
                              : ''
                          }


                        </p>


                      </div>

                    ))}


                </div>


              )}


            </div>


          </>

        )}


      </section>


      {/* =====================================================
          SMART NUTRITION ADVISOR
      ===================================================== */}

      <section className="space-y-4">


        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">


          <div>


            <div className="flex items-center gap-2">


              <Sparkles className="w-5 h-5 text-primary" />


              <h2 className="text-lg font-black text-primary">

                Smart Nutrition Advisor

              </h2>


            </div>


            <p className="text-xs text-on-surface-variant mt-1 max-w-3xl">

              Nutrient targets are selected using the
              animal's species, body weight and
              physiological or production stage.

            </p>


          </div>


          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-primary-container text-on-primary-container w-fit">

            Preventive Nutrition

          </span>


        </div>


        {animals.length === 0 ? (


          <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant">


            <Beef className="w-10 h-10 mx-auto text-outline" />


            <p className="text-sm font-black text-primary mt-3">

              No livestock registered

            </p>


            <p className="text-xs text-on-surface-variant mt-1">

              Register an animal before generating
              a nutrition profile.

            </p>


          </div>


        ) : (


          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">


            {/* =================================================
                LEFT — ANIMAL & STAGE SELECTOR
            ================================================= */}

            <div className="xl:col-span-4 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs">


              <div className="flex items-center gap-2 mb-5">


                <Beef className="w-5 h-5 text-primary" />


                <h3 className="text-sm font-black text-primary">

                  Animal Profile

                </h3>


              </div>


              {/* ANIMAL SELECT */}

              <label className="block text-[11px] font-black uppercase tracking-wide text-on-surface-variant mb-1.5">

                Select Animal

              </label>


              <select

                value={
                  selectedAnimalId
                }

                onChange={
                  (e) =>
                    setSelectedAnimalId(
                      e.target.value
                    )
                }

                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-sm text-on-surface focus:outline-none focus:border-primary"

              >


                {animals.map(
                  (
                    animal
                  ) => (

                  <option
                    key={
                      animal.id
                    }
                    value={
                      animal.id
                    }
                  >

                    {
                      animal.name ||
                      animal.id
                    }
                    {' — '}
                    {
                      animal.breed
                    }

                  </option>

                ))}


              </select>


              {selectedAnimal && (

                <div className="mt-5 space-y-3">


                  {/* BREED */}

                  <div className="flex justify-between gap-4 py-2.5 border-b border-outline-variant/40">


                    <span className="text-xs text-on-surface-variant">

                      Breed

                    </span>


                    <span className="text-xs font-black text-primary text-right">

                      {
                        selectedAnimal
                          .breed
                      }

                    </span>


                  </div>


                  {/* SPECIES */}

                  <div className="flex justify-between gap-4 py-2.5 border-b border-outline-variant/40">


                    <span className="text-xs text-on-surface-variant">

                      Species

                    </span>


                    <span className="text-xs font-black text-primary">

                      {
                        selectedAnimal
                          .species
                      }

                    </span>


                  </div>


                  {/* WEIGHT */}

                  <div className="flex justify-between gap-4 py-2.5 border-b border-outline-variant/40">


                    <span className="text-xs text-on-surface-variant">

                      Weight

                    </span>


                    <span className="text-xs font-black text-primary">

                      {
                        selectedAnimal
                          .weight
                      } kg

                    </span>


                  </div>


                  {/* AGE */}

                  <div className="flex justify-between gap-4 py-2.5 border-b border-outline-variant/40">


                    <span className="text-xs text-on-surface-variant">

                      Age

                    </span>


                    <span className="text-xs font-black text-primary">

                      {
                        selectedAnimal
                          .age ||
                        'Not recorded'
                      }

                    </span>


                  </div>


                  {/* PRODUCTION STAGE */}

                  <div className="pt-2">


                    <label className="block text-[11px] font-black uppercase tracking-wide text-on-surface-variant mb-1.5">

                      Production / Life Stage

                    </label>


                    {stageOptions.length >
                    0 ? (


                      <select

                        value={
                          selectedStage
                        }

                        onChange={
                          (e) =>
                            setSelectedStage(
                              e.target.value
                            )
                        }

                        className="w-full px-3 py-2.5 rounded-xl border border-primary/30 bg-primary-container/20 text-sm font-bold text-primary focus:outline-none focus:border-primary"

                      >


                        {stageOptions.map(
                          (
                            stage
                          ) => (

                          <option
                            key={
                              stage.key
                            }
                            value={
                              stage.key
                            }
                          >

                            {
                              stage.label
                            }

                          </option>

                        ))}


                      </select>


                    ) : (


                      <div className="p-3 rounded-xl bg-error-container text-xs text-on-error-container">

                        Nutrition reference data is
                        not available for this species.

                      </div>


                    )}


                  </div>


                </div>

              )}


            </div>


            {/* =================================================
                RIGHT — RECOMMENDATION
            ================================================= */}

            <div className="xl:col-span-8 space-y-5">


              {nutritionProfile &&
              selectedAnimal ? (


                <>


                  {/* HEADER */}

                  <div className="bg-primary text-on-primary rounded-2xl p-5 shadow-sm">


                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">


                      <div>


                        <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-70">

                          Recommended Nutrition Profile

                        </p>


                        <h3 className="text-xl font-black mt-1">


                          {
                            selectedAnimal
                              .breed
                          }

                          {' • '}

                          {
                            nutritionProfile
                              .label
                          }


                        </h3>


                        <p className="text-xs opacity-80 mt-1">


                          {
                            selectedAnimal
                              .species
                          }

                          {' • '}

                          {
                            selectedAnimal
                              .weight
                          } kg

                          {' • '}

                          {
                            nutritionProfile
                              .purpose
                          }


                        </p>


                      </div>


                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">


                        <Leaf className="w-6 h-6" />


                      </div>


                    </div>


                  </div>


                  {/* NUTRIENT CARDS */}

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">


                    {/* DRY MATTER */}

                    <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl">


                      <Wheat className="w-5 h-5 text-primary mb-3" />


                      <p className="text-[10px] font-black uppercase tracking-wide text-on-surface-variant">

                        Dry Matter

                      </p>


                      <p className="text-sm font-black text-primary mt-1">


                        {
                          dryMatter

                            ?

                            `${dryMatter.min}–${dryMatter.max} kg/day`

                            :

                            'Stage based'
                        }


                      </p>


                    </div>


                    {/* ENERGY */}

                    <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl">


                      <Zap className="w-5 h-5 text-amber-600 mb-3" />


                      <p className="text-[10px] font-black uppercase tracking-wide text-on-surface-variant">

                        Energy

                      </p>


                      <p className="text-sm font-black text-primary mt-1">


                        {
                          nutritionProfile
                            .energy
                        }


                      </p>


                    </div>


                    {/* PROTEIN */}

                    <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl">


                      <Activity className="w-5 h-5 text-violet-600 mb-3" />


                      <p className="text-[10px] font-black uppercase tracking-wide text-on-surface-variant">

                        Crude Protein

                      </p>


                      <p className="text-sm font-black text-primary mt-1">


                        {
                          formatPercent(
                            nutritionProfile
                              .proteinPercent
                          )
                        }


                      </p>


                    </div>


                    {/* CALCIUM */}

                    <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl">


                      <ShieldCheck className="w-5 h-5 text-blue-600 mb-3" />


                      <p className="text-[10px] font-black uppercase tracking-wide text-on-surface-variant">

                        Calcium

                      </p>


                      <p className="text-sm font-black text-primary mt-1">


                        {
                          formatPercent(
                            nutritionProfile
                              .calciumPercent
                          )
                        }


                      </p>


                    </div>


                    {/* PHOSPHORUS */}

                    <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl">


                      <Sparkles className="w-5 h-5 text-indigo-600 mb-3" />


                      <p className="text-[10px] font-black uppercase tracking-wide text-on-surface-variant">

                        Phosphorus

                      </p>


                      <p className="text-sm font-black text-primary mt-1">


                        {
                          formatPercent(
                            nutritionProfile
                              .phosphorusPercent
                          )
                        }


                      </p>


                    </div>


                    {/* WATER */}

                    <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl">


                      <Droplets className="w-5 h-5 text-cyan-600 mb-3" />


                      <p className="text-[10px] font-black uppercase tracking-wide text-on-surface-variant">

                        Water

                      </p>


                      <p className="text-sm font-black text-primary mt-1">


                        {
                          nutritionProfile
                            .water
                        }


                      </p>


                    </div>


                  </div>


                  {/* EXTRA NUTRIENTS */}

                  {(nutritionProfile.fibrePercent ||
                    nutritionProfile.lysinePercent ||
                    nutritionProfile.methioninePercent ||
                    nutritionProfile.saltPercent) && (


                    <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5">


                      <h4 className="text-sm font-black text-primary mb-4">

                        Additional Nutrient Targets

                      </h4>


                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">


                        {nutritionProfile
                          .fibrePercent && (

                          <div>

                            <p className="text-[10px] text-on-surface-variant uppercase font-bold">

                              Fibre

                            </p>

                            <p className="text-sm font-black text-primary mt-1">

                              {
                                formatPercent(
                                  nutritionProfile
                                    .fibrePercent
                                )
                              }

                            </p>

                          </div>

                        )}


                        {nutritionProfile
                          .lysinePercent && (

                          <div>

                            <p className="text-[10px] text-on-surface-variant uppercase font-bold">

                              Lysine

                            </p>

                            <p className="text-sm font-black text-primary mt-1">

                              {
                                formatPercent(
                                  nutritionProfile
                                    .lysinePercent
                                )
                              }

                            </p>

                          </div>

                        )}


                        {nutritionProfile
                          .methioninePercent && (

                          <div>

                            <p className="text-[10px] text-on-surface-variant uppercase font-bold">

                              Methionine

                            </p>

                            <p className="text-sm font-black text-primary mt-1">

                              {
                                formatPercent(
                                  nutritionProfile
                                    .methioninePercent
                                )
                              }

                            </p>

                          </div>

                        )}


                        {nutritionProfile
                          .saltPercent && (

                          <div>

                            <p className="text-[10px] text-on-surface-variant uppercase font-bold">

                              Salt

                            </p>

                            <p className="text-sm font-black text-primary mt-1">

                              {
                                formatPercent(
                                  nutritionProfile
                                    .saltPercent
                                )
                              }

                            </p>

                          </div>

                        )}


                      </div>


                    </div>

                  )}


                  {/* FEEDING STRATEGY */}

                  <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5">


                    <div className="flex items-center gap-2 mb-4">


                      <Leaf className="w-5 h-5 text-emerald-600" />


                      <h4 className="text-sm font-black text-primary">

                        Suggested Feeding Strategy

                      </h4>


                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">


                      {nutritionProfile
                        .feedingStrategy
                        .map(
                          (
                            recommendation,
                            index
                          ) => (

                          <div

                            key={
                              `${recommendation}-${index}`
                            }

                            className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low"

                          >


                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />


                            <span className="text-xs font-medium text-on-surface">

                              {
                                recommendation
                              }

                            </span>


                          </div>

                        ))}


                    </div>


                  </div>


                  {/* NOTE */}

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">


                    <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />


                    <div>


                      <p className="text-xs font-black text-amber-900">

                        Nutrition Guidance Note

                      </p>


                      <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">

                        {
                          nutritionProfile
                            .note
                        }

                      </p>


                      <p className="text-[10px] text-amber-800 mt-2">

                        These are nutritional target
                        ranges, not a veterinary
                        prescription or an exact
                        ingredient-level ration.

                      </p>


                    </div>


                  </div>


                </>


              ) : (


                <div className="h-full min-h-[300px] bg-surface-container-lowest border border-outline-variant rounded-2xl flex items-center justify-center p-8 text-center">


                  <div>


                    <Leaf className="w-10 h-10 text-outline mx-auto" />


                    <p className="text-sm font-black text-primary mt-3">

                      Nutrition profile unavailable

                    </p>


                    <p className="text-xs text-on-surface-variant mt-1">

                      Select an animal and a supported
                      production stage.

                    </p>


                  </div>


                </div>


              )}


            </div>


          </div>

        )}


      </section>


      {/* =====================================================
          SYSTEM EXPLANATION
      ===================================================== */}

      <section className="p-5 rounded-2xl bg-surface-container border border-outline-variant/60">


        <div className="flex items-start gap-3">


          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />


          <div>


            <h3 className="text-sm font-black text-primary">

              How PALYA Nutrition Intelligence Works

            </h3>


            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">

              PALYA identifies the selected animal's
              species, breed and recorded body weight.
              The user then selects the appropriate
              physiological or production stage.
              Nutrient reference targets are matched
              from the PALYA nutrition dataset, while
              dry-matter intake is calculated from the
              animal's actual body weight wherever
              percentage-of-body-weight data is
              available.

            </p>


          </div>


        </div>


      </section>


    </div>

  );
};