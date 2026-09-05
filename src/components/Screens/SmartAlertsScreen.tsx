import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileQuestion,
  UserCheck,
  Check,
  ArrowRight
} from 'lucide-react';
import { Animal, ScreenId } from '../../types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';
// Backend se aane wala real alert shape
interface RealAlert {
  id: string;
  type: 'critical' | 'warning' | 'action_required' | 'review_required';
  title: string;
  animalId: string;
  description: string;
  timestamp: string;
}

interface SmartAlertsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectAnimal: (animal: Animal) => void;
  animals: Animal[];
}

export const SmartAlertsScreen: React.FC<SmartAlertsScreenProps> = ({
  onNavigate,
  onSelectAnimal,
  animals
}) => {
  const [alerts, setAlerts] = useState<RealAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // "Acknowledge" abhi sirf is session ke liye local hai
  // (backend mein alerts save nahi hote, khud-ba-khud calculate hote hain
  // treatments data se — isliye "reviewed" state permanently store karne ka
  // koi table nahi hai. Future improvement: alerts_reviewed table banake yahan wire karna)
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'warning' | 'action_required' | 'review_required'>('all');

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/alerts`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load alerts');
        setAlerts(data.data || []);
      } catch (err) {
        console.error('Alerts load error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load alerts');
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const toggleReviewed = (id: string) => {
    setReviewedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (activeFilter === 'all') return true;
    return alert.type === activeFilter;
  });

  const getBadgeStyle = (type: RealAlert['type']) => {
    switch (type) {
      case 'critical':
        return 'bg-error-container text-error border-error/30';
      case 'warning':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'action_required':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'review_required':
        return 'bg-purple-100 text-purple-900 border-purple-300';
    }
  };

  const getIcon = (type: RealAlert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-error" />;
      case 'warning':
        return <Clock className="w-5 h-5 text-amber-700" />;
      case 'action_required':
        return <FileQuestion className="w-5 h-5 text-blue-700" />;
      case 'review_required':
        return <UserCheck className="w-5 h-5 text-purple-700" />;
    }
  };

  const handleActionClick = (alert: RealAlert) => {
    const targetAnimal = animals.find((a) => a.id === alert.animalId);
    if (targetAnimal) onSelectAnimal(targetAnimal);

    if (alert.type === 'critical') onNavigate('mrl');
    else if (alert.type === 'action_required') onNavigate('record-treatment');
    else onNavigate('veterinary-case');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            Smart Alerts
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Real-time alerts calculated from actual treatment, MRL, and withdrawal data.
          </p>
        </div>

        <span className="text-xs font-bold text-outline bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/60">
          {alerts.length} Active Triggers
        </span>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 text-xs font-semibold">
          {error}. Backend chal raha hai check karo.
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'all' ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
          }`}
        >
          All Alerts ({alerts.length})
        </button>

        <button
          onClick={() => setActiveFilter('critical')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'critical' ? 'bg-error text-on-error shadow-xs' : 'bg-surface-container hover:bg-surface-container-high text-error'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-error" />
          Critical ({alerts.filter((a) => a.type === 'critical').length})
        </button>

        <button
          onClick={() => setActiveFilter('warning')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'warning' ? 'bg-amber-600 text-white shadow-xs' : 'bg-surface-container hover:bg-surface-container-high text-amber-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Warnings ({alerts.filter((a) => a.type === 'warning').length})
        </button>

        <button
          onClick={() => setActiveFilter('action_required')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'action_required' ? 'bg-blue-600 text-white shadow-xs' : 'bg-surface-container hover:bg-surface-container-high text-blue-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Action Required ({alerts.filter((a) => a.type === 'action_required').length})
        </button>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-on-surface-variant text-sm">Loading alerts...</div>
        ) : filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const isReviewed = reviewedIds.has(alert.id);
            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isReviewed
                    ? 'bg-surface-container-lowest/60 border-outline-variant/40 opacity-75'
                    : alert.type === 'critical'
                    ? 'bg-error-container/20 border-error/30 hover:border-error/50 shadow-xs'
                    : 'bg-surface-container-lowest border-outline-variant/60 hover:shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-surface-container-high shrink-0 mt-0.5">
                      {getIcon(alert.type)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getBadgeStyle(alert.type)}`}>
                          {alert.type.replace('_', ' ')}
                        </span>
                        <h2 className="text-base font-bold text-primary">{alert.title}</h2>
                        <span className="text-xs text-outline font-medium">• {alert.animalId}</span>
                      </div>

                      <p className="text-xs text-on-surface mt-2 leading-relaxed max-w-2xl">
                        {alert.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-outline-variant/40">
                    <span className="text-[11px] text-outline font-mono">{alert.timestamp}</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleReviewed(alert.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${
                          isReviewed
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant border-outline-variant'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isReviewed ? 'Reviewed' : 'Acknowledge'}</span>
                      </button>

                      <button
                        onClick={() => handleActionClick(alert)}
                        className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5 text-secondary-container" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/60">
            <CheckCircle2 className="w-8 h-8 text-secondary mx-auto mb-2" />
            <p className="text-sm font-bold text-primary">No alerts in this category</p>
            <p className="text-xs text-on-surface-variant mt-1">All conditions meet safety standards.</p>
          </div>
        )}
      </div>
    </div>
  );
};