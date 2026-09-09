import React, { useState, useEffect } from 'react';

import {
  Plus,
  Search,
  ArrowRight,
  AlertTriangle,
  Clock,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Activity,
  AlertCircle,
  QrCode,
  IndianRupee,
  HeartPulse
} from 'lucide-react';

import {
  Animal,
  ScreenId,
  TreatmentRecord,
  AlertItem,
  AuthUser
} from '../../types';

interface FarmerDashboardProps {
  animals: Animal[];

  onNavigate: (
    screen: ScreenId
  ) => void;

  onOpenScanModal: () => void;

  onSelectAnimal: (
    animal: Animal
  ) => void;

  treatments?: TreatmentRecord[];

  alerts?: AlertItem[];

  userRole?:
    | 'farmer'
    | 'veterinarian';
    authUser?: AuthUser | null;
}

export function FarmerDashboard({
  animals,
  onNavigate,
  onOpenScanModal,
  onSelectAnimal,
  treatments,
  alerts,
  userRole = 'farmer',
  authUser
}: FarmerDashboardProps) {

  const [
    searchFilter,
    setSearchFilter
  ] = useState('');

  const [
    speciesFilter,
    setSpeciesFilter
  ] = useState('All');

  const [
  statusFilter,
  setStatusFilter
] = useState('All');

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  }

  if (hour >= 12 && hour < 17) {
    return 'Good afternoon';
  }

  return 'Good evening';
};

const getDisplayName = () => {
  if (authUser?.role === 'admin') {
    return 'Administrator';
  }

  const fullName = authUser?.fullName?.trim();

  if (!fullName) {
    return 'User';
  }

  const firstName = fullName
    .replace(/^Dr\.?\s+/i, '')
    .split(' ')[0];

  return firstName || 'User';
};

const greeting = getGreeting();
const displayName = getDisplayName();

  /* =========================================================
     FILTERED ANIMALS
  ========================================================= */

  const filteredAnimals =
    animals.filter(
      (
        animal
      ) => {

        const matchesSearch =
          animal.id
            .toLowerCase()
            .includes(
              searchFilter.toLowerCase()
            ) ||

          animal.tag
            .toLowerCase()
            .includes(
              searchFilter.toLowerCase()
            ) ||

          (
            animal.name &&
            animal.name
              .toLowerCase()
              .includes(
                searchFilter.toLowerCase()
              )
          ) ||

          animal.breed
            .toLowerCase()
            .includes(
              searchFilter.toLowerCase()
            );

        const matchesSpecies =
          speciesFilter === 'All' ||
          animal.species ===
            speciesFilter;

        const matchesStatus =
          statusFilter === 'All' ||
          animal.healthStatus ===
            statusFilter;

        return (
          matchesSearch &&
          matchesSpecies &&
          matchesStatus
        );
      }
    );

  /* =========================================================
     KPI VALUES
  ========================================================= */

  const totalLivestock =
    animals.length;

  const activeCount =
    animals.filter(
      (
        animal
      ) =>
        animal.healthStatus !==
        'Under Treatment'
    ).length;

  const underWithdrawalCount =
    animals.filter(
      (
        animal
      ) =>
        animal.withdrawalStatus ===
        'Active'
    ).length;

  const healthyCount =
    animals.filter(
      (
        animal
      ) =>
        animal.healthStatus ===
        'Healthy'
    ).length;

  const complianceScore =
    86;

  /* =========================================================
     ECONOMIC + FOOD SAFETY SUMMARY

     Demo dashboard snapshot.
     Detailed condition-specific cost remains inside
     Early Disease Detection.
  ========================================================= */

  const productivityImpact =
    underWithdrawalCount > 0
      ? 'Moderate'
      : 'Low';

  const foodSafetyStatus =
    underWithdrawalCount > 0
      ? 'Withdrawal Monitoring Active'
      : 'No Active Withdrawal';

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="space-y-6 pb-12">

      {/* =====================================================
          TOP BANNER
      ===================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">

            {greeting}, {displayName}!

          </h1>

          <p className="text-sm text-on-surface-variant mt-1">

            Here's an overview of your livestock
            health and compliance status.

          </p>

        </div>

        <div className="flex items-center gap-2.5">

          {onOpenScanModal && (

            <button
              id="btn-quick-scan-tag"
              onClick={
                onOpenScanModal
              }
              className="px-3.5 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-primary border border-outline-variant/80 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >

              <QrCode className="w-4 h-4 text-secondary" />

              <span>
                Scan Tag
              </span>

            </button>
          )}

          <button
            id="btn-quick-record-treatment"
            onClick={() =>
              onNavigate(
                'record-treatment'
              )
            }
            className="px-4 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >

            <Plus className="w-4 h-4 text-secondary-container" />

            <span>
              Record Treatment
            </span>

          </button>

        </div>

      </div>

      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">

        {/* TOTAL LIVESTOCK */}

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 shadow-xs">

          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Total Livestock
          </p>

          <div className="mt-2 flex items-baseline gap-2">

            <span className="text-3xl font-black text-primary">
              {totalLivestock}
            </span>

          </div>

          <p className="text-[11px] text-on-surface-variant mt-1">
            Across 3 pens
          </p>

        </div>

        {/* ACTIVE */}

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 shadow-xs">

          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Active
          </p>

          <div className="mt-2 flex items-baseline gap-2">

            <span className="text-3xl font-black text-secondary">
              {activeCount}
            </span>

          </div>

          <p className="text-[11px] text-on-surface-variant mt-1">
            In good condition
          </p>

        </div>

        {/* UNDER WITHDRAWAL */}

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-xs">

          <p className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center justify-between">

            <span>
              Under Withdrawal
            </span>

            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />

          </p>

          <div className="mt-2 flex items-baseline gap-2">

            <span className="text-3xl font-black text-secondary">
              {underWithdrawalCount}
            </span>

          </div>

          <p className="text-[11px] text-on-surface-variant mt-1 font-medium">
            Milk/meat withheld
          </p>

        </div>

        {/* HEALTHY */}

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 shadow-xs">

          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Healthy
          </p>

          <div className="mt-2 flex items-baseline gap-2">

            <span className="text-3xl font-black text-emerald-700">
              {healthyCount}
            </span>

          </div>

          <p className="text-[11px] text-on-surface-variant mt-1">

            {totalLivestock > 0
              ? Math.round(
                  (
                    healthyCount /
                    totalLivestock
                  ) *
                    100
                )
              : 0}
            % of total herd

          </p>

        </div>

        {/* COMPLIANCE SCORE */}

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 shadow-xs col-span-2 sm:col-span-1">

          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Compliance Score
          </p>

          <div className="mt-2 flex items-baseline justify-between">

            <span className="text-3xl font-black text-primary">
              {complianceScore}%
            </span>

            <span className="text-[10px] font-bold text-secondary bg-secondary-fixed/50 px-1.5 py-0.5 rounded">
              +4%
            </span>

          </div>

          <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-2 overflow-hidden">

            <div
              className="bg-secondary h-1.5 rounded-full"
              style={{
                width:
                  `${complianceScore}%`
              }}
            />

          </div>

          <p className="text-[11px] text-on-surface-variant mt-1">
            Above regional avg.
          </p>

        </div>

      </div>

      {/* =====================================================
          NEW:
          ECONOMIC & FOOD SAFETY IMPACT
      ===================================================== */}

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs overflow-hidden">

        {/* HEADER */}

        <div className="px-5 sm:px-6 py-4 border-b border-outline-variant/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">

              <TrendingUp className="w-5 h-5 text-primary" />

            </div>

            <div>

              <h2 className="text-base sm:text-lg font-black text-primary">

                Economic & Food Safety Impact

              </h2>

              <p className="text-xs text-on-surface-variant">

                Screening-based financial and
                food-chain risk snapshot.

              </p>

            </div>

          </div>

          <button
            onClick={() =>
              onNavigate(
                'early-detection'
              )
            }
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all cursor-pointer"
          >

            View Assessment

            <ArrowRight className="w-3.5 h-3.5" />

          </button>

        </div>

        {/* BODY */}

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant/40">

          {/* TREATMENT COST */}

          <div className="p-5">

            <div className="flex items-center gap-2 text-on-surface-variant">

              <IndianRupee className="w-4 h-4 text-secondary" />

              <span className="text-[11px] font-black uppercase tracking-wider">
                Estimated Treatment Cost
              </span>

            </div>

            <p className="text-2xl font-black text-primary mt-3">

              ₹1,200 – ₹3,500

            </p>

            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">

              Latest screening demo estimate.
              Detailed range depends on the
              suspected condition.

            </p>

          </div>

          {/* PRODUCTIVITY IMPACT */}

          <div className="p-5">

            <div className="flex items-center gap-2 text-on-surface-variant">

              <Activity className="w-4 h-4 text-secondary" />

              <span className="text-[11px] font-black uppercase tracking-wider">
                Productivity Impact
              </span>

            </div>

            <p className="text-2xl font-black text-primary mt-3">

              {productivityImpact}

            </p>

            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">

              Indicative impact based on active
              health and withdrawal monitoring
              status.

            </p>

          </div>

          {/* FOOD SAFETY */}

          <div className="p-5">

            <div className="flex items-center gap-2 text-on-surface-variant">

              <ShieldCheck className="w-4 h-4 text-secondary" />

              <span className="text-[11px] font-black uppercase tracking-wider">
                Food Safety Status
              </span>

            </div>

            <div className="mt-3">

              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black ${
                  underWithdrawalCount > 0
                    ? 'bg-error-container text-error'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >

                {underWithdrawalCount > 0 ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}

                {foodSafetyStatus}

              </span>

            </div>

            <p className="text-xs text-on-surface-variant mt-3 leading-relaxed">

              {underWithdrawalCount > 0
                ? `${underWithdrawalCount} animal${
                    underWithdrawalCount > 1
                      ? 's are'
                      : ' is'
                  } currently under food-chain withdrawal monitoring.`
                : 'No currently monitored animal has an active withdrawal status.'}

            </p>

          </div>

        </div>

        {/* FOOTNOTE */}

        <div className="px-5 sm:px-6 py-3 bg-surface-container-low border-t border-outline-variant/40">

          <p className="text-[10px] text-outline leading-relaxed">

            Cost values are indicative demo
            estimates for decision-support
            presentation purposes. Final treatment
            cost depends on diagnosis, severity,
            diagnostics, location and veterinarian
            assessment.

          </p>

        </div>

      </div>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ===================================================
            LEFT COLUMN
        =================================================== */}

        <div className="lg:col-span-2 space-y-4">

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/40">

              <div>

                <h2 className="text-lg font-bold text-primary">
                  Livestock Overview
                </h2>

                <p className="text-xs text-on-surface-variant">
                  Monitored electronic records
                  and clearance status
                </p>

              </div>

              {/* FILTERS */}

              <div className="flex items-center gap-2">

                <div className="relative">

                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-outline" />

                  <input
                    type="text"
                    placeholder="Search by tag, ID, or name..."
                    value={
                      searchFilter
                    }
                    onChange={(
                      event
                    ) =>
                      setSearchFilter(
                        event.target.value
                      )
                    }
                    className="pl-8 pr-3 py-1.5 rounded-lg border border-outline-variant text-xs bg-surface-container-low text-on-surface focus:outline-none focus:border-primary w-48 sm:w-56"
                  />

                </div>

                <select
                  value={
                    speciesFilter
                  }
                  onChange={(
                    event
                  ) =>
                    setSpeciesFilter(
                      event.target.value
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg border border-outline-variant text-xs bg-surface-container-low text-on-surface focus:outline-none"
                >

                  <option value="All">
                    All Species
                  </option>

                  <option value="Cattle">
                    Cattle
                  </option>

                  <option value="Buffalo">
                    Buffalo
                  </option>

                  <option value="Goat">
                    Goat
                  </option>

                  <option value="Sheep">
                    Sheep
                  </option>

                  <option value="Pig">
                    Pig
                  </option>

                  <option value="Chicken">
                    Chicken
                  </option>

                  <option value="Duck">
                    Duck
                  </option>

                  <option value="Camel">
                    Camel
                  </option>

                </select>

              </div>

            </div>

            {/* =================================================
                TABLE
            ================================================= */}

            <div className="overflow-x-auto mt-2">

              <table className="w-full text-left text-xs">

                <thead>

                  <tr className="border-b border-outline-variant/60 text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">

                    <th className="py-3 px-3">
                      Animal ID / Tag
                    </th>

                    <th className="py-3 px-3">
                      Species & Breed
                    </th>

                    <th className="py-3 px-3">
                      Last Treatment
                    </th>

                    <th className="py-3 px-3">
                      Health Status
                    </th>

                    <th className="py-3 px-3">
                      Withdrawal
                    </th>

                    <th className="py-3 px-2 text-right">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-outline-variant/40">

                  {filteredAnimals.map(
                    (
                      animal
                    ) => (

                      <tr
                        key={
                          animal.id
                        }
                        onClick={() =>
                          onSelectAnimal(
                            animal
                          )
                        }
                        className="hover:bg-surface-container-low/70 transition-colors cursor-pointer group"
                      >

                        {/* ANIMAL */}

                        <td className="py-3 px-3">

                          <div className="flex items-center gap-2.5">

                            <img
                              src={
                                animal.imageUrl
                              }
                              alt={
                                animal.id
                              }
                              className="w-9 h-9 rounded-lg object-cover border border-outline-variant shrink-0"
                            />

                            <div>

                              <div className="font-bold text-primary flex items-center gap-1.5">

                                <span>
                                  {animal.id}
                                </span>

                                {animal.name && (

                                  <span className="text-on-surface-variant text-[11px] font-normal">

                                    (
                                    {animal.name}
                                    )

                                  </span>
                                )}

                              </div>

                              <span className="text-[10px] text-outline font-mono block">

                                {animal.tag}

                              </span>

                            </div>

                          </div>

                        </td>

                        {/* SPECIES */}

                        <td className="py-3 px-3">

                          <span className="font-semibold text-on-surface">
                            {animal.species}
                          </span>

                          <span className="block text-[11px] text-on-surface-variant">
                            {animal.breed}
                          </span>

                        </td>

                        {/* TREATMENT */}

                        <td className="py-3 px-3">

                          <span className="font-medium text-on-surface block truncate max-w-[140px]">

                            {animal.lastTreatmentDrug ||
                              'None'}

                          </span>

                          <span className="text-[10px] text-outline">

                            {animal.lastTreatmentDate ||
                              'N/A'}

                          </span>

                        </td>

                        {/* HEALTH */}

                        <td className="py-3 px-3">

                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              animal.healthStatus ===
                              'Healthy'
                                ? 'bg-emerald-100 text-emerald-800'
                                : animal.healthStatus ===
                                    'High Risk'
                                  ? 'bg-error-container text-error'
                                  : animal.healthStatus ===
                                      'Monitoring'
                                    ? 'bg-surface-container text-on-surface-variant'
                                    : 'bg-blue-100 text-blue-800'
                            }`}
                          >

                            {animal.healthStatus}

                          </span>

                        </td>

                        {/* WITHDRAWAL */}

                        <td className="py-3 px-3">

                          {animal.withdrawalStatus ===
                          'Active' ? (

                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-surface-container text-on-surface">

                              <Clock className="w-3 h-3 text-secondary" />

                              Active (
                              {
                                animal.withdrawalDaysLeft
                              }
                              d)

                            </span>

                          ) : animal.withdrawalStatus ===
                            'Clear' ? (

                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">

                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />

                              Clear

                            </span>

                          ) : (

                            <span className="text-outline text-[11px]">
                              None
                            </span>

                          )}

                        </td>

                        {/* ACTION */}

                        <td className="py-3 px-2 text-right">

                          <button
                            onClick={(
                              event
                            ) => {

                              event.stopPropagation();

                              onSelectAnimal(
                                animal
                              );
                            }}
                            className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs group-hover:bg-primary group-hover:text-on-primary transition-all"
                          >

                            View

                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs text-on-surface-variant">

              <span>

                Showing{' '}
                {filteredAnimals.length}{' '}
                of{' '}
                {animals.length}{' '}
                animals

              </span>

              <button
                onClick={() =>
                  onNavigate(
                    'livestock'
                  )
                }
                className="font-bold text-primary hover:underline flex items-center gap-1"
              >

                <span>
                  Full Directory
                </span>

                <ChevronRight className="w-3.5 h-3.5" />

              </button>

            </div>

          </div>

        </div>

        {/* ===================================================
            RIGHT COLUMN
        =================================================== */}

        <div className="space-y-6">

          {/* =================================================
              STEWARDSHIP
          ================================================= */}

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs">

            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">

              <h3 className="text-base font-bold text-primary flex items-center gap-2">

                <ShieldCheck className="w-5 h-5 text-secondary" />

                <span>
                  Stewardship Score
                </span>

              </h3>

              <span className="text-[11px] font-bold text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded-full">
                +6 this month
              </span>

            </div>

            <div className="my-5 flex flex-col items-center justify-center text-center">

              {/* GAUGE */}

              <div className="relative w-36 h-36 flex items-center justify-center">

                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >

                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e5eeff"
                    strokeWidth="10"
                    fill="transparent"
                  />

                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#006c49"
                    strokeWidth="10"
                    strokeDasharray={`${82 * 2.51} 251.2`}
                    strokeLinecap="round"
                    fill="transparent"
                  />

                </svg>

                <div className="absolute flex flex-col items-center justify-center">

                  <span className="text-3xl font-black text-primary">
                    82
                  </span>

                  <span className="text-[11px] font-bold text-on-surface-variant">
                    / 100
                  </span>

                </div>

              </div>

              <span className="mt-2 text-xs font-bold text-secondary uppercase tracking-wider">
                Good Stewardship
              </span>

              <p className="mt-2 text-xs text-on-surface-variant max-w-xs leading-relaxed">

                Based on 30-day AMU patterns,
                withdrawal adherence, and
                veterinary sign-offs.

              </p>

            </div>

            <div className="pt-3 border-t border-outline-variant/40">

              <button
                onClick={() =>
                  onNavigate(
                    'stewardship'
                  )
                }
                className="w-full py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-primary transition-colors flex items-center justify-center gap-1.5"
              >

                <span>
                  View Detailed Breakdown
                </span>

                <ArrowRight className="w-3.5 h-3.5 text-secondary" />

              </button>

            </div>

          </div>

          {/* =================================================
              RECENT ALERTS
          ================================================= */}

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs">

            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">

              <h3 className="text-base font-bold text-primary flex items-center gap-2">

                <AlertTriangle className="w-5 h-5 text-error" />

                <span>
                  Recent Alerts
                </span>

              </h3>

              <span className="text-[11px] font-bold text-error bg-error-container px-2 py-0.5 rounded-full">
                3 New
              </span>

            </div>

            <div className="mt-3 space-y-3">

              {/* CRITICAL */}

              <div
                onClick={() =>
                  onNavigate(
                    'alerts'
                  )
                }
                className="p-3 rounded-xl bg-error-container/30 border border-error/20 hover:bg-error-container/40 transition-colors cursor-pointer"
              >

                <div className="flex items-center justify-between text-xs font-bold text-error mb-1">

                  <span className="flex items-center gap-1">

                    <AlertCircle className="w-3.5 h-3.5" />

                    Withdrawal Active:
                    COW-024

                  </span>

                  <span className="text-[10px] text-error/80">
                    North Pasture
                  </span>

                </div>

                <p className="text-xs text-on-surface-variant">

                  Prevent food-chain use.
                  5 days remaining in
                  mandatory withdrawal.

                </p>

              </div>

              {/* WARNING */}

              <div
                onClick={() =>
                  onNavigate(
                    'alerts'
                  )
                }
                className="p-3 rounded-xl bg-surface-container/40 border border-outline-variant hover:bg-surface-container transition-colors cursor-pointer"
              >

                <div className="flex items-center justify-between text-xs font-bold text-on-surface mb-1">

                  <span className="flex items-center gap-1">

                    <Clock className="w-3.5 h-3.5 text-secondary" />

                    Repeated AMU - Pen B

                  </span>

                  <span className="text-[10px] text-on-surface-variant">
                    Yesterday
                  </span>

                </div>

                <p className="text-xs text-on-surface-variant">

                  3 treatments in 30 days
                  detected. Review with
                  veterinarian.

                </p>

              </div>

              {/* INFO */}

              <div
                onClick={() =>
                  onNavigate(
                    'alerts'
                  )
                }
                className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-pointer"
              >

                <div className="flex items-center justify-between text-xs font-bold text-blue-900 mb-1">

                  <span className="flex items-center gap-1">

                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />

                    Routine Checkup Due

                  </span>

                  <span className="text-[10px] text-blue-800">
                    This week
                  </span>

                </div>

                <p className="text-xs text-on-surface-variant">

                  5 animals scheduled for
                  booster vaccination this week.

                </p>

              </div>

            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/40">

              <button
                onClick={() =>
                  onNavigate(
                    'alerts'
                  )
                }
                className="w-full text-center text-xs font-bold text-primary hover:underline flex items-center justify-center gap-1"
              >

                <span>
                  View All Alerts (4)
                </span>

                <ArrowRight className="w-3.5 h-3.5" />

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}