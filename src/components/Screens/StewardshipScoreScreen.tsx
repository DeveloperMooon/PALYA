import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Award
} from 'lucide-react';
import { ScreenId } from '../../types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'; 

interface StewardshipScoreScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

interface ScoreData {
  score: number;
  rating: string;
  factors: {
    mrlViolations: number;
    mrlWarnings: number;
    repeatedTreatments: number;
    activeWithdrawals: number;
  };
  totalTreatments: number;
}

export const StewardshipScoreScreen: React.FC<StewardshipScoreScreenProps> = ({ onNavigate }) => {
  const [data, setData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/stewardship-score`);
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to load score');
        setData(result.data);
      } catch (err) {
        console.error('Stewardship score error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load score');
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, []);

  const score = data?.score ?? 0;
  const circumference = 264; // 2 * PI * r(42), rounded
  const filled = (score / 100) * circumference;

  const ratingColor =
    data?.rating === 'Excellent' ? 'bg-emerald-100 text-emerald-800' :
    data?.rating === 'Good' ? 'bg-secondary-container text-on-secondary-container' :
    data?.rating === 'Needs Attention' ? 'bg-amber-100 text-amber-900' :
    'bg-red-100 text-red-800';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            Antimicrobial Stewardship Score
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Real score calculated from treatment records, MRL results, and withdrawal data.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 text-xs font-semibold">
          {error}. Backend chal raha hai check karo.
        </div>
      )}

      {/* Score Gauge + Factors */}
      <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-2xl border border-outline-variant/60 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Gauge */}
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center pb-6 md:pb-0 md:border-r border-outline-variant/40">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="#eff4ff" strokeWidth="10" fill="transparent" />
                <circle
                  cx="50" cy="50" r="42"
                  stroke="#006c49"
                  strokeWidth="10"
                  strokeDasharray={`${filled} ${circumference}`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-primary">{loading ? '—' : score}</span>
                <span className="text-xs font-bold text-on-surface-variant">/ 100</span>
              </div>
            </div>

            {data && (
              <div className="mt-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${ratingColor}`}>
                  <Award className="w-3.5 h-3.5" />
                  {data.rating} Stewardship
                </span>
                <p className="mt-2 text-xs text-on-surface-variant">
                  Based on {data.totalTreatments} recorded treatments
                </p>
              </div>
            )}
          </div>

          {/* Factors */}
          <div className="md:col-span-7 space-y-4">
            {data && data.factors.mrlViolations === 0 && data.factors.mrlWarnings === 0 &&
             data.factors.repeatedTreatments === 0 && data.factors.activeWithdrawals === 0 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <h3 className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  No Issues Found
                </h3>
                <p className="text-xs text-emerald-950">All treatments are within safe, compliant patterns.</p>
              </div>
            )}

            {data && (data.factors.mrlViolations > 0 || data.factors.mrlWarnings > 0 || data.factors.repeatedTreatments > 0 || data.factors.activeWithdrawals > 0) && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  Factors Reducing Score
                </h3>
                <ul className="space-y-1.5 text-xs text-amber-950 font-medium">
                  {data.factors.mrlViolations > 0 && (
                    <li className="flex items-center justify-between">
                      <span>MRL Violations</span>
                      <span className="font-bold">{data.factors.mrlViolations} × -15</span>
                    </li>
                  )}
                  {data.factors.mrlWarnings > 0 && (
                    <li className="flex items-center justify-between">
                      <span>MRL Warnings</span>
                      <span className="font-bold">{data.factors.mrlWarnings} × -5</span>
                    </li>
                  )}
                  {data.factors.repeatedTreatments > 0 && (
                    <li className="flex items-center justify-between">
                      <span>Repeated Treatments (30 days)</span>
                      <span className="font-bold">{data.factors.repeatedTreatments} × -10</span>
                    </li>
                  )}
                  {data.factors.activeWithdrawals > 0 && (
                    <li className="flex items-center justify-between">
                      <span>Active Withdrawals</span>
                      <span className="font-bold">{data.factors.activeWithdrawals} × -2</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            <button
              onClick={() => onNavigate('alerts')}
              className="px-4 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>View Related Alerts</span>
              <ArrowRight className="w-4 h-4 text-secondary-container" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};