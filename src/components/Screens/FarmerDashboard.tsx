import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  ArrowRight,
  AlertTriangle,
  Clock,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Activity,
  AlertCircle,
  QrCode
} from 'lucide-react';
import { Animal, ScreenId, TreatmentRecord, AlertItem } from '../../types';

interface FarmerDashboardProps {
  animals: Animal[];
  onNavigate: (screen: ScreenId) => void;
  onOpenScanModal: () => void;
  onSelectAnimal: (animal: Animal) => void;
  treatments?: TreatmentRecord[];
  alerts?: AlertItem[];
  userRole?: 'farmer' | 'veterinarian';
}

export function FarmerDashboard({
  animals,
  onNavigate,
  onOpenScanModal,
  onSelectAnimal,
  treatments,
  alerts,
  userRole = 'farmer'
}: FarmerDashboardProps) {
  
  const [searchFilter, setSearchFilter] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      animal.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      animal.tag.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (animal.name && animal.name.toLowerCase().includes(searchFilter.toLowerCase())) ||
      animal.breed.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesSpecies = speciesFilter === 'All' || animal.species === speciesFilter;
    const matchesStatus = statusFilter === 'All' || animal.healthStatus === statusFilter;

    return matchesSearch && matchesSpecies && matchesStatus;
  });

  const totalLivestock = animals.length;
  const activeCount = animals.filter(a => a.healthStatus !== 'Under Treatment').length;
  const underWithdrawalCount = animals.filter(a => a.withdrawalStatus === 'Active').length;
  const healthyCount = animals.filter(a => a.healthStatus === 'Healthy').length;
  const complianceScore = 86; // %

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
  Good afternoon, {userRole === 'farmer' ? 'Rajesh' : 'Dr. Suresh'}!
</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Here's an overview of your livestock health and compliance status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenScanModal && (
            <button
              id="btn-quick-scan-tag"
              onClick={onOpenScanModal}
              className="px-3.5 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-primary border border-outline-variant/80 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-secondary" />
              <span>Scan Tag</span>
            </button>
          )}
          <button
            id="btn-quick-record-treatment"
            onClick={() => onNavigate('record-treatment')}
            className="px-4 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-secondary-container" />
            <span>Record Treatment</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Livestock */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 shadow-xs">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Total Livestock
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-primary">{totalLivestock}</span>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1">Across 3 pens</p>
        </div>

        {/* Active */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 shadow-xs">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Active
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-secondary">{activeCount}</span>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1">In good condition</p>
        </div>

        {/* Under Withdrawal */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-amber-500/30 bg-amber-50/20 shadow-xs">
          <p className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center justify-between">
            <span>Under Withdrawal</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{underWithdrawalCount}</span>
          </div>
          <p className="text-[11px] text-amber-800 mt-1 font-medium">Milk/meat withheld</p>
        </div>

        {/* Healthy */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 shadow-xs">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Healthy
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700">{healthyCount}</span>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1">
            {Math.round((healthyCount / totalLivestock) * 100)}% of total herd
          </p>
        </div>

        {/* Compliance Score */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 shadow-xs col-span-2 sm:col-span-1">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Compliance Score
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-primary">{complianceScore}%</span>
            <span className="text-[10px] font-bold text-secondary bg-secondary-fixed/50 px-1.5 py-0.5 rounded">
              +4%
            </span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-secondary h-1.5 rounded-full"
              style={{ width: `${complianceScore}%` }}
            />
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1">Above regional avg.</p>
        </div>
      </div>

      {/* Main Grid: Left Livestock Overview Table, Right Stewardship & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Span 2): Livestock Overview Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/40">
              <div>
                <h2 className="text-lg font-bold text-primary">Livestock Overview</h2>
                <p className="text-xs text-on-surface-variant">
                  Monitored electronic records and clearance status
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    type="text"
                    placeholder="Search by tag, ID, or name..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg border border-outline-variant text-xs bg-surface-container-low text-on-surface focus:outline-none focus:border-primary w-48 sm:w-56"
                  />
                </div>

                <select
                  value={speciesFilter}
                  onChange={(e) => setSpeciesFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-outline-variant text-xs bg-surface-container-low text-on-surface focus:outline-none"
                >
                  <option value="All">All Species</option>
                  <option value="Cattle">Cattle</option>
                  <option value="Buffalo">Buffalo</option>
                  <option value="Goat">Goat</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/60 text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                    <th className="py-3 px-3">Animal ID / Tag</th>
                    <th className="py-3 px-3">Species & Breed</th>
                    <th className="py-3 px-3">Last Treatment</th>
                    <th className="py-3 px-3">Health Status</th>
                    <th className="py-3 px-3">Withdrawal</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {filteredAnimals.map((animal) => (
                    <tr
                      key={animal.id}
                      onClick={() => onSelectAnimal(animal)}
                      className="hover:bg-surface-container-low/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={animal.imageUrl}
                            alt={animal.id}
                            className="w-9 h-9 rounded-lg object-cover border border-outline-variant shrink-0"
                          />
                          <div>
                            <div className="font-bold text-primary flex items-center gap-1.5">
                              <span>{animal.id}</span>
                              {animal.name && (
                                <span className="text-on-surface-variant text-[11px] font-normal">
                                  ({animal.name})
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-outline font-mono block">
                              {animal.tag}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-on-surface">{animal.species}</span>
                        <span className="block text-[11px] text-on-surface-variant">
                          {animal.breed}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-medium text-on-surface block truncate max-w-[140px]">
                          {animal.lastTreatmentDrug || 'None'}
                        </span>
                        <span className="text-[10px] text-outline">
                          {animal.lastTreatmentDate || 'N/A'}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            animal.healthStatus === 'Healthy'
                              ? 'bg-emerald-100 text-emerald-800'
                              : animal.healthStatus === 'High Risk'
                              ? 'bg-error-container text-error'
                              : animal.healthStatus === 'Monitoring'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {animal.healthStatus}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        {animal.withdrawalStatus === 'Active' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                            <Clock className="w-3 h-3 text-amber-700" />
                            Active ({animal.withdrawalDaysLeft}d)
                          </span>
                        ) : animal.withdrawalStatus === 'Clear' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Clear
                          </span>
                        ) : (
                          <span className="text-outline text-[11px]">None</span>
                        )}
                      </td>

                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAnimal(animal);
                          }}
                          className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs group-hover:bg-primary group-hover:text-on-primary transition-all"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs text-on-surface-variant">
              <span>Showing {filteredAnimals.length} of {animals.length} animals</span>
              <button
                onClick={() => onNavigate('livestock')}
                className="font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Full Directory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Stewardship Gauge & Recent Alerts */}
        <div className="space-y-6">
          {/* Stewardship Score Gauge Card */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
              <h3 className="text-base font-bold text-primary flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-secondary" />
                <span>Stewardship Score</span>
              </h3>
              <span className="text-[11px] font-bold text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded-full">
                +6 this month
              </span>
            </div>

            <div className="my-5 flex flex-col items-center justify-center text-center">
              {/* Circular Gauge */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
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
                  <span className="text-3xl font-black text-primary">82</span>
                  <span className="text-[11px] font-bold text-on-surface-variant">/ 100</span>
                </div>
              </div>

              <span className="mt-2 text-xs font-bold text-secondary uppercase tracking-wider">
                Good Stewardship
              </span>
              <p className="mt-2 text-xs text-on-surface-variant max-w-xs leading-relaxed">
                Based on 30-day AMU patterns, withdrawal adherence, and veterinary sign-offs.
              </p>
            </div>

            <div className="pt-3 border-t border-outline-variant/40">
              <button
                onClick={() => onNavigate('stewardship')}
                className="w-full py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-primary transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Detailed Breakdown</span>
                <ArrowRight className="w-3.5 h-3.5 text-secondary" />
              </button>
            </div>
          </div>

          {/* Recent Alerts Card */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
              <h3 className="text-base font-bold text-primary flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-error" />
                <span>Recent Alerts</span>
              </h3>
              <span className="text-[11px] font-bold text-error bg-error-container px-2 py-0.5 rounded-full">
                3 New
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {/* Critical Alert */}
              <div 
                onClick={() => onNavigate('alerts')}
                className="p-3 rounded-xl bg-error-container/30 border border-error/20 hover:bg-error-container/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-bold text-error mb-1">
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Withdrawal Active: COW-024
                  </span>
                  <span className="text-[10px] text-error/80">North Pasture</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Prevent food-chain use. 5 days remaining in mandatory withdrawal.
                </p>
              </div>

              {/* Warning Alert */}
              <div 
                onClick={() => onNavigate('alerts')}
                className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    Repeated AMU - Pen B
                  </span>
                  <span className="text-[10px] text-amber-800">Yesterday</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  3 treatments in 30 days detected. Review with veterinarian.
                </p>
              </div>

              {/* Info Alert */}
              <div 
                onClick={() => onNavigate('alerts')}
                className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-bold text-blue-900 mb-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                    Routine Checkup Due
                  </span>
                  <span className="text-[10px] text-blue-800">This week</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  5 animals scheduled for booster vaccination this week.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/40">
              <button
                onClick={() => onNavigate('alerts')}
                className="w-full text-center text-xs font-bold text-primary hover:underline flex items-center justify-center gap-1"
              >
                <span>View All Alerts (4)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
