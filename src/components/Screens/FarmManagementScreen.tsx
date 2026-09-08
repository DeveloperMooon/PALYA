import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Plus,
  Stethoscope,
  Edit,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  ChevronRight,
  PawPrint,
  AlertCircle
} from 'lucide-react';
import { Animal, ScreenId } from '../../types';

interface FarmManagementScreenProps {
  animals: Animal[];
  onSelectAnimal: (animal: Animal) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const FarmManagementScreen: React.FC<FarmManagementScreenProps> = ({
  animals,
  onSelectAnimal,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'livestock' | 'treatments' | 'mrl' | 'amu' | 'alerts'>('livestock');

  return (
    <div className="space-y-6 pb-12">
      {/* Farm Profile Header */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-secondary-fixed/30 text-secondary flex items-center justify-center shrink-0 border border-secondary/20">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-primary">Shiv Dairy Farm</h1>
                <span className="text-xs font-mono font-bold bg-surface-container-high text-primary px-2.5 py-0.5 rounded-md">
                  FARM-UP-001
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Verified Producer
                </span>
              </div>

              <p className="text-xs text-on-surface-variant mt-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-outline" />
                <span>Meerut, Uttar Pradesh â€¢ Pin: 250404 â€¢ Managed by Rajesh Kumar</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('livestock')}
              className="px-4 py-2 border border-outline-variant hover:bg-surface-container rounded-xl text-xs font-bold text-on-surface transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-primary" />
              <span>Add Animal</span>
            </button>

            <button
              onClick={() => onNavigate('record-treatment')}
              className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-secondary-container" />
              <span>Record Treatment</span>
            </button>
          </div>
        </div>

        {/* 6 Key Farm Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-outline-variant/40">
          <div className="p-3 rounded-xl bg-surface-container-low">
            <span className="text-[11px] font-bold text-outline uppercase block">Total Animals</span>
            <span className="text-2xl font-black text-primary mt-1 block">24</span>
            <span className="text-[10px] text-on-surface-variant">Dairy & Buffalo</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low">
            <span className="text-[11px] font-bold text-outline uppercase block">Healthy</span>
            <span className="text-2xl font-black text-emerald-700 mt-1 block">19</span>
            <span className="text-[10px] text-emerald-800 font-semibold">79% of herd</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low">
            <span className="text-[11px] font-bold text-outline uppercase block">Under Treatment</span>
            <span className="text-2xl font-black text-secondary mt-1 block">3</span>
            <span className="text-[10px] text-on-surface-variant">Active care</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-container0/10 border border-outline-variant">
            <span className="text-[11px] font-bold text-on-surface uppercase block">Withdrawal Active</span>
            <span className="text-2xl font-black text-secondary mt-1 block">2</span>
            <span className="text-[10px] text-on-surface-variant font-semibold">Withheld</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low">
            <span className="text-[11px] font-bold text-outline uppercase block">Compliance Rate</span>
            <span className="text-2xl font-black text-primary mt-1 block">94%</span>
            <span className="text-[10px] text-secondary font-semibold">Above avg.</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low">
            <span className="text-[11px] font-bold text-outline uppercase block">Stewardship</span>
            <span className="text-2xl font-black text-secondary mt-1 block">82</span>
            <span className="text-[10px] text-secondary font-semibold">Good</span>
          </div>
        </div>
      </div>

      {/* Visualizers: Health Overview & AMU Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Health Overview Donut (5 Cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col justify-between">
          <h2 className="text-base font-bold text-primary pb-3 border-b border-outline-variant/40">
            Herd Health Overview
          </h2>

          <div className="py-4 flex items-center justify-around">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* 19 Healthy (79%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#006c49"
                  strokeWidth="16"
                  strokeDasharray={`${79 * 2.38} 238.7`}
                  fill="transparent"
                />
                {/* 2 Monitoring (8%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#45bbff"
                  strokeWidth="16"
                  strokeDasharray={`${8 * 2.38} 238.7`}
                  strokeDashoffset={`${-79 * 2.38}`}
                  fill="transparent"
                />
                {/* 1 Under Treatment (5%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#006c49"
                  strokeWidth="16"
                  strokeDasharray={`${5 * 2.38} 238.7`}
                  strokeDashoffset={`${-(79 + 8) * 2.38}`}
                  fill="transparent"
                />
                {/* 2 High Risk (8%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#ba1a1a"
                  strokeWidth="16"
                  strokeDasharray={`${8 * 2.38} 238.7`}
                  strokeDashoffset={`${-(79 + 8 + 5) * 2.38}`}
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-primary">24</span>
                <span className="text-[10px] text-outline font-semibold">Total Herd</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006c49]" />
                <span className="text-on-surface">Healthy: <strong>19</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#45bbff]" />
                <span className="text-on-surface">Monitoring: <strong>2</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006c49]" />
                <span className="text-on-surface">Under Treatment: <strong>1</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]" />
                <span className="text-on-surface">High Risk: <strong>2</strong></span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-outline text-center pt-2 border-t border-outline-variant/30">
            Last herd census verified 18 Aug 2026
          </div>
        </div>

        {/* 6-Month AMU Trend Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
            <div>
              <h2 className="text-base font-bold text-primary">AMU Monthly Volume (mg/PCU)</h2>
              <p className="text-xs text-on-surface-variant">Historic trend towards national reduction target</p>
            </div>
            <span className="text-xs font-bold text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded">
              -8% Overall
            </span>
          </div>

          <div className="py-6 flex items-end justify-between gap-3 h-48 px-2">
            {[
              { month: 'May', val: 48, col: 'bg-surface-container-highest' },
              { month: 'Jun', val: 45, col: 'bg-surface-container-highest' },
              { month: 'Jul', val: 42, col: 'bg-surface-container-highest' },
              { month: 'Aug', val: 39, col: 'bg-surface-container-highest' },
              { month: 'Sep', val: 36, col: 'bg-surface-container-highest' },
              { month: 'Oct', val: 34, col: 'bg-secondary', active: true }
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className={`text-[11px] font-bold ${d.active ? 'text-secondary' : 'text-outline'}`}>
                  {d.val}
                </span>
                <div
                  className={`w-full max-w-[40px] rounded-t-lg transition-all ${d.col}`}
                  style={{ height: `${d.val * 2.5}px` }}
                />
                <span className={`text-xs font-semibold ${d.active ? 'text-primary font-bold' : 'text-outline'}`}>
                  {d.month}
                </span>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-on-surface-variant text-center pt-2 border-t border-outline-variant/30">
            Target benchmark: 30.0 mg/PCU (Approaching in 2 months)
          </div>
        </div>
      </div>

      {/* Active Alerts Banner */}
      <div className="p-4 rounded-2xl bg-surface-container0/10 border border-outline-variant flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-secondary shrink-0" />
          <div>
            <p className="text-xs font-bold text-on-surface">
              Active Alerts for Shiv Dairy Farm: 2 Animals with Special Attention
            </p>
            <p className="text-xs text-on-surface mt-0.5">
              COW-024 (Withdrawal Active - 5 days left) â€¢ COW-018 (Repeated Treatment Alert)
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('alerts')}
          className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
        >
          View Alerts
        </button>
      </div>

      {/* Farm Tabs & Table */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
        <div className="flex border-b border-outline-variant/60 mb-4 gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('livestock')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'livestock' ? 'border-primary text-primary' : 'border-transparent text-outline'
            }`}
          >
            Live Herd Directory ({animals.length})
          </button>
          <button
            onClick={() => onNavigate('mrl')}
            className="pb-3 border-b-2 border-transparent text-outline hover:text-primary transition-all cursor-pointer"
          >
            MRL Compliance Check
          </button>
          <button
            onClick={() => onNavigate('amu')}
            className="pb-3 border-b-2 border-transparent text-outline hover:text-primary transition-all cursor-pointer"
          >
            AMU Breakdown
          </button>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant/60 text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                <th className="py-3 px-3">Animal ID</th>
                <th className="py-3 px-3">Tag / RFID</th>
                <th className="py-3 px-3">Breed</th>
                <th className="py-3 px-3">Health Status</th>
                <th className="py-3 px-3">Withdrawal</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {animals.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => onSelectAnimal(a)}
                  className="hover:bg-surface-container-low/70 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3 font-bold text-primary">{a.id}</td>
                  <td className="py-3 px-3 font-mono text-outline">{a.tag}</td>
                  <td className="py-3 px-3 text-on-surface">{a.species} ({a.breed})</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        a.healthStatus === 'Healthy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : a.healthStatus === 'High Risk'
                          ? 'bg-error-container text-error'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {a.healthStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {a.withdrawalStatus === 'Active' ? (
                      <span className="text-on-surface-variant font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-secondary" />
                        Active ({a.withdrawalDaysLeft}d)
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Clear
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button className="px-2.5 py-1 rounded bg-surface-container text-xs font-bold text-primary">
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

