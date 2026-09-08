import React, { useState, useEffect } from 'react';
import {
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface DrugBreakdownItem {
  drug: string;
  count: number;
  percentage: number;
}

interface AmuSummary {
  totalAllTreatments: number;
  totalAntibioticTreatments: number;
  drugBreakdown: DrugBreakdownItem[];
  mostUsedDrug: DrugBreakdownItem | null;
  monthlyTrend: { month: string; count: number }[];
}

interface TreatmentRow {
  id: number;
  animal_id: string;
  drug: string;
  active_ingredient: string;
  category: string;
  dosage: string;
  route: string;
  start_date: string;
  withdrawal_days: number;
  status: string;
}

export const AMUDashboardScreen: React.FC = () => {
  const [showExportToast, setShowExportToast] = useState(false);

  const [summary, setSummary] = useState<AmuSummary | null>(null);
  const [treatments, setTreatments] = useState<TreatmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Page load hote hi real data mangwao â€” summary + full treatments list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, treatmentsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/amu-summary`),
          fetch(`${API_BASE_URL}/api/treatments`),
        ]);

        const summaryData = await summaryRes.json();
        const treatmentsData = await treatmentsRes.json();

        if (!summaryRes.ok) throw new Error(summaryData.message || 'Failed to load AMU summary');
        if (!treatmentsRes.ok) throw new Error(treatmentsData.message || 'Failed to load treatments');

        setSummary(summaryData.data);
        setTreatments(treatmentsData.data || []);
      } catch (err) {
        console.error('AMU dashboard load error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load AMU data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExport = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            Antimicrobial Usage (AMU) Dashboard
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Real usage patterns calculated directly from recorded treatments.
          </p>
        </div>

        <button
          id="btn-export-amu-report"
          onClick={handleExport}
          className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-secondary-container" />
          <span>Export Report</span>
        </button>
      </div>

      {showExportToast && (
        <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Export not wired to a real file yet â€” this is a placeholder action.</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-surface-container border border-outline-variant text-on-surface flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-xs font-semibold">{error}. Backend chal raha hai check karo.</p>
        </div>
      )}

      {/* KPI Cards â€” sirf wahi jo real data se calculate ho sakte hain */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Total Treatments
          </span>
          <div className="mt-2 text-3xl font-black text-primary">
            {loading ? 'â€”' : summary?.totalAllTreatments ?? 0}
          </div>
          <p className="text-xs text-on-surface-variant mt-1">All recorded treatments</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Antibiotic Treatments
          </span>
          <div className="mt-2 text-3xl font-black text-secondary">
            {loading ? 'â€”' : summary?.totalAntibioticTreatments ?? 0}
          </div>
          <p className="text-xs text-on-surface-variant mt-1">Category = Antibiotic</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Most Used Drug
          </span>
          <div className="mt-2 text-xl font-black text-primary truncate">
            {loading ? 'â€”' : summary?.mostUsedDrug?.drug ?? 'No data yet'}
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            {summary?.mostUsedDrug ? `${summary.mostUsedDrug.count} times (${summary.mostUsedDrug.percentage}%)` : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Trend â€” real counts, simple bar list (no fake curve) */}
        <div className="lg:col-span-6 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
          <h2 className="text-base font-bold text-primary pb-3 border-b border-outline-variant/40">
            Monthly Antibiotic Usage
          </h2>

          <div className="mt-4 space-y-3">
            {(!summary || summary.monthlyTrend.length === 0) && (
              <p className="text-xs text-on-surface-variant">No treatment data yet.</p>
            )}
            {summary?.monthlyTrend.map((m) => {
              const maxCount = Math.max(...summary.monthlyTrend.map((x) => x.count), 1);
              const widthPct = Math.round((m.count / maxCount) * 100);
              return (
                <div key={m.month} className="flex items-center gap-3 text-xs">
                  <span className="w-16 font-semibold text-on-surface-variant shrink-0">{m.month}</span>
                  <div className="flex-1 bg-surface-container-high rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-secondary h-3 rounded-full"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <span className="w-6 font-bold text-primary text-right">{m.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drug Breakdown â€” real percentages, simple list (no fake donut) */}
        <div className="lg:col-span-6 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
          <h2 className="text-base font-bold text-primary pb-3 border-b border-outline-variant/40">
            Drug-wise Breakdown
          </h2>

          <div className="mt-4 space-y-2.5">
            {(!summary || summary.drugBreakdown.length === 0) && (
              <p className="text-xs text-on-surface-variant">No antibiotic treatments recorded yet.</p>
            )}
            {summary?.drugBreakdown.map((d) => (
              <div key={d.drug} className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 flex items-center justify-between text-xs">
                <span className="font-bold text-on-surface">{d.drug}</span>
                <span className="text-on-surface-variant">{d.count}x</span>
                <span className="font-black text-primary">{d.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Antimicrobial Treatments Table â€” ab Supabase se */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
        <h2 className="text-base font-bold text-primary pb-4 border-b border-outline-variant/40">
          Recent Antimicrobial Treatments
        </h2>

        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant/60 text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                <th className="py-3 px-3">Animal ID</th>
                <th className="py-3 px-3">Drug</th>
                <th className="py-3 px-3">Dosage & Route</th>
                <th className="py-3 px-3">Started</th>
                <th className="py-3 px-3">Withdrawal</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {loading && (
                <tr><td colSpan={6} className="py-4 text-center text-on-surface-variant">Loading...</td></tr>
              )}
              {!loading && treatments.length === 0 && (
                <tr><td colSpan={6} className="py-4 text-center text-on-surface-variant">No treatments recorded yet.</td></tr>
              )}
              {treatments
                .filter((t) => t.category === 'Antibiotic')
                .map((trt) => (
                <tr key={trt.id} className="hover:bg-surface-container-low/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-primary">{trt.animal_id}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-primary">{trt.drug}</span>
                    <span className="block text-[10px] text-outline">{trt.active_ingredient}</span>
                  </td>
                  <td className="py-3 px-3 text-on-surface font-mono">
                    {trt.dosage} ({trt.route ? trt.route.split(' ')[0] : ''})
                  </td>
                  <td className="py-3 px-3 text-outline">{trt.start_date}</td>
                  <td className="py-3 px-3 font-semibold text-on-surface">{trt.withdrawal_days} Days</td>
                  <td className="py-3 px-3 text-right">
                    {trt.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-surface-container text-on-surface">
                        <Clock className="w-3 h-3 text-secondary" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        Cleared
                      </span>
                    )}
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
