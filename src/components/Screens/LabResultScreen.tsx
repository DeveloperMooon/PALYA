import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { ScreenId } from '../../types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface LabResultScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

// ---------------------------------------------------------
// Ek treatment record ka shape (jo /api/treatments se aata hai)
// DB ke columns snake_case mein hain, isliye jaisa aata hai
// waisa hi use kar rahe hain (RecordTreatmentScreen ki tarah
// alag se camelCase mein convert nahi kar rahe, kyunki yahan
// sirf display + ek field bhejni hai, bada mapping nahi chahiye)
// ---------------------------------------------------------
interface TreatmentRow {
  id: number;
  animal_id: string;
  drug: string;
  active_ingredient: string;
  last_dose_date: string;
  detected_residue: number | null;
}

// ---------------------------------------------------------
// Backend se PATCH call ka response shape
// ---------------------------------------------------------
interface MrlResult {
  mrl_status: 'within_limit' | 'warning' | 'violation';
  mrl_limit: number;
  mrl_unit: string;
  detected_residue: number;
}

export const LabResultScreen: React.FC<LabResultScreenProps> = ({
  onNavigate
}) => {
  const [treatments, setTreatments] = useState<TreatmentRow[]>([]);
  const [treatmentsLoading, setTreatmentsLoading] = useState(true);
  const [treatmentsError, setTreatmentsError] = useState('');

  const [selectedTreatmentId, setSelectedTreatmentId] = useState<number | null>(null);
  const [residueValue, setResidueValue] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [result, setResult] = useState<MrlResult | null>(null);

  // Page load hote hi saare treatments mangwao (dropdown ke liye)
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/treatments`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load treatments');
        }

        setTreatments(data.data || []);

        if (data.data && data.data.length > 0) {
          setSelectedTreatmentId(data.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load treatments:', err);
        setTreatmentsError(
          err instanceof Error ? err.message : 'Failed to load treatments'
        );
      } finally {
        setTreatmentsLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  const selectedTreatment = treatments.find((t) => t.id === selectedTreatmentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTreatmentId) {
      setSaveError('Pehle ek treatment select karo');
      return;
    }

    const residueNumber = Number(residueValue);

    if (isNaN(residueNumber) || residueNumber < 0) {
      setSaveError('Residue value ek valid non-negative number hona chahiye');
      return;
    }

    setIsSaving(true);
    setSaveError('');
    setResult(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/treatments/${selectedTreatmentId}/residue`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ detected_residue: residueNumber }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save residue result');
      }

      setResult(data.data);

      // Treatments list mein bhi update kar do, taaki UI turant reflect kare
      setTreatments((prev) =>
        prev.map((t) =>
          t.id === selectedTreatmentId
            ? { ...t, detected_residue: residueNumber }
            : t
        )
      );
    } catch (err) {
      console.error('Save residue error:', err);
      setSaveError(
        err instanceof Error ? err.message : 'Failed to save residue result'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // 3-tier result ke hisaab se colors/icon/label
  const getMrlDisplay = (status: MrlResult['mrl_status']) => {
    if (status === 'within_limit') {
      return {
        label: 'Within Limit',
        icon: CheckCircle2,
        classes: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    }
    if (status === 'warning') {
      return {
        label: 'Warning â€” Close to Limit',
        icon: AlertTriangle,
        classes: 'bg-surface-container text-on-surface-variant border-outline-variant',
      };
    }
    return {
      label: 'MRL Violation',
      icon: XCircle,
      classes: 'bg-red-100 text-red-800 border-red-300',
    };
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
          Add Lab Test Result
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Kisi treatment ka residue lab-test value enter karo â€” system automatically MRL ke against compare karega.
        </p>
      </div>

      <div className="max-w-2xl bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs space-y-5">

        {treatmentsError && (
          <div className="p-3 rounded-xl bg-surface-container border border-outline-variant text-on-surface text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {treatmentsError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Treatment select */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Select Treatment
            </label>
            <select
              value={selectedTreatmentId ?? ''}
              onChange={(e) => {
                setSelectedTreatmentId(Number(e.target.value));
                setResult(null);
              }}
              disabled={treatmentsLoading}
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface disabled:opacity-60"
            >
              {treatmentsLoading && <option>Loading treatments...</option>}
              {!treatmentsLoading && treatments.length === 0 && (
                <option>No treatments found</option>
              )}
              {treatments.map((t) => (
                <option key={t.id} value={t.id}>
                  #{t.id} â€” {t.animal_id} â€” {t.drug} (Last dose: {t.last_dose_date})
                  {t.detected_residue !== null ? ' [Test already recorded]' : ''}
                </option>
              ))}
            </select>
          </div>

          {selectedTreatment && (
            <div className="p-3 rounded-xl bg-surface-container-low text-xs text-on-surface-variant space-y-1">
              <p><strong>Drug:</strong> {selectedTreatment.drug} ({selectedTreatment.active_ingredient})</p>
              <p><strong>Animal:</strong> {selectedTreatment.animal_id}</p>
              {selectedTreatment.detected_residue !== null && (
                <p className="text-secondary">
                  <strong>Note:</strong> Is treatment ka pehle se ek result save hai ({selectedTreatment.detected_residue}). Naya save karne se woh overwrite ho jayega.
                </p>
              )}
            </div>
          )}

          {/* Residue value */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Detected Residue Value (mg/kg)
            </label>
            <input
              type="number"
              step="0.001"
              min="0"
              value={residueValue}
              onChange={(e) => setResidueValue(e.target.value)}
              placeholder="e.g. 0.035"
              required
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm bg-surface-container-low text-on-surface"
            />
          </div>

          {saveError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
              {saveError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving || !selectedTreatmentId}
            className="w-full py-3 px-4 bg-primary hover:bg-primary-container disabled:opacity-60 active:scale-[0.99] text-on-primary rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FlaskConical className="w-4 h-4 text-secondary-container" />
            <span>{isSaving ? 'Saving...' : 'Save Result & Check MRL'}</span>
          </button>

        </form>

        {/* Result display */}
        {result && (
          (() => {
            const display = getMrlDisplay(result.mrl_status);
            const Icon = display.icon;
            return (
              <div className={`p-4 rounded-xl border ${display.classes} flex items-start gap-3`}>
                <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-black">{display.label}</p>
                  <p className="text-xs mt-1">
                    Detected: <strong>{result.detected_residue} {result.mrl_unit}</strong> vs Allowed Limit: <strong>{result.mrl_limit} {result.mrl_unit}</strong>
                  </p>
                </div>
              </div>
            );
          })()
        )}

        <button
          onClick={() => onNavigate('mrl')}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          <span>Back to MRL Compliance Screen</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
