import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  HeartPulse,
  Search,
  ShieldAlert,
  Stethoscope
} from 'lucide-react';

import { Animal, ScreenId } from '../../types';

interface EarlyDetectionScreenProps {
  animals: Animal[];
  onSelectAnimal: (animal: Animal) => void;
  onNavigate: (screen: ScreenId) => void;

  onSendToVet?: (
    animal: Animal,
    condition: string,
    risk: 'Low' | 'Medium' | 'High',
    symptoms: string[]
  ) => void;
}




type RiskLevel = 'Low' | 'Medium' | 'High';

interface ConditionRule {
  name: string;
  symptoms: string[];
  highRiskSymptoms?: string[];
  description: string;

  sourceName?: string;
  sourceUrl?: string;
}

interface DetectionResult {
  condition: string;
  riskLevel: RiskLevel;
  matchedSymptoms: string[];
  confidence: number;
  explanation: string;
  recommendedAction: string;

  sourceName?: string;
  sourceUrl?: string;
}

const SYMPTOMS = [
  'Fever',
  'Reduced appetite',
  'Reduced milk production',
  'Udder swelling',
  'Udder pain',
  'Abnormal milk',
  'Cough',
  'Nasal discharge',
  'Difficulty breathing',
  'Diarrhea',
  'Weakness',
  'Dehydration',
  'Excess salivation',
  'Mouth lesions',
  'Lameness',
  'Skin nodules',
  'Skin lesions'
];

const CONDITION_RULES: ConditionRule[] = [
  {
    name: 'Mastitis',
    symptoms: [
      'Fever',
      'Reduced milk production',
      'Udder swelling',
      'Udder pain',
      'Abnormal milk'
    ],
    highRiskSymptoms: ['Udder swelling', 'Abnormal milk'],
    description:
      'The reported symptoms show a pattern commonly associated with inflammation or infection of the udder.',

    sourceName: 'MSD Veterinary Manual',
    sourceUrl:
      'https://www.msdvetmanual.com/reproductive-system/mastitis-in-large-animals/mastitis-in-cattle'
  },

  {
    name: 'Foot and Mouth Disease Risk',
    symptoms: [
      'Fever',
      'Excess salivation',
      'Mouth lesions',
      'Lameness',
      'Reduced appetite'
    ],
    highRiskSymptoms: ['Mouth lesions', 'Excess salivation'],
    description:
      'The selected symptoms require prompt veterinary evaluation because they may be associated with a contagious vesicular disease.',

    sourceName: 'MSD Veterinary Manual',
    sourceUrl:
      'https://www.msdvetmanual.com/infectious-diseases/foot-and-mouth-disease/foot-and-mouth-disease-in-animals'
  },

  {
    name: 'Respiratory Infection',
    symptoms: [
      'Fever',
      'Cough',
      'Nasal discharge',
      'Difficulty breathing',
      'Reduced appetite'
    ],
    highRiskSymptoms: ['Difficulty breathing'],
    description:
      'The symptom combination may indicate a respiratory infection or another condition affecting the respiratory system.',

sourceName: 'MSD Veterinary Manual',
sourceUrl:
  'https://www.msdvetmanual.com/respiratory-system/bovine-respiratory-disease-complex/overview-of-bovine-respiratory-disease-complex'
  },

  {
    name: 'Gastrointestinal Infection',
    symptoms: [
      'Diarrhea',
      'Reduced appetite',
      'Weakness',
      'Dehydration',
      'Fever'
    ],
    highRiskSymptoms: ['Dehydration'],
    description:
      'The selected signs may indicate gastrointestinal illness, infection, or another digestive-system disorder.',

    sourceName: 'MSD Veterinary Manual',
sourceUrl:
  'https://www.msdvetmanual.com/digestive-system/intestinal-diseases-in-ruminants/intestinal-diseases-in-cattle'
  },

  {
    name: 'Lumpy Skin Disease Risk',
    symptoms: [
      'Skin nodules',
      'Skin lesions',
      'Fever',
      'Reduced appetite',
      'Reduced milk production'
    ],
    highRiskSymptoms: ['Skin nodules'],
    description:
      'Skin nodules combined with systemic symptoms require veterinary examination for possible infectious skin disease.',

    sourceName: 'MSD Veterinary Manual',
sourceUrl:
  'https://www.msdvetmanual.com/integumentary-system/pox-diseases/lumpy-skin-disease-in-cattle'
  }
];

const getRiskStyles = (risk: RiskLevel) => {
  if (risk === 'High') {
    return {
      badge: 'bg-error-container text-error',
      card: 'border-error/30 bg-error-container/20',
      icon: 'text-error'
    };
  }

  if (risk === 'Medium') {
    return {
      badge: 'bg-amber-100 text-amber-800',
      card: 'border-amber-300 bg-amber-50/60',
      icon: 'text-amber-700'
    };
  }

  return {
    badge: 'bg-emerald-100 text-emerald-800',
    card: 'border-emerald-300 bg-emerald-50/60',
    icon: 'text-emerald-700'
  };
};

export const EarlyDetectionScreen: React.FC<
  EarlyDetectionScreenProps
> = ({
  animals,
  onSelectAnimal,
  onNavigate,
  onSendToVet,
}) => {
  const [selectedAnimalId, setSelectedAnimalId] =
    useState<string>(animals[0]?.id || '');

  const [selectedSymptoms, setSelectedSymptoms] =
    useState<string[]>([]);

  const [searchTerm, setSearchTerm] =
    useState('');

  const [result, setResult] =
    useState<DetectionResult | null>(null);

  const selectedAnimal = useMemo(
    () =>
      animals.find(
        (animal) => animal.id === selectedAnimalId
      ) || null,
    [animals, selectedAnimalId]
  );

  const filteredSymptoms = useMemo(
    () =>
      SYMPTOMS.filter((symptom) =>
        symptom
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  const toggleSymptom = (symptom: string) => {
    setResult(null);

    setSelectedSymptoms((current) =>
      current.includes(symptom)
        ? current.filter((item) => item !== symptom)
        : [...current, symptom]
    );
  };

  const resetAssessment = () => {
    setSelectedSymptoms([]);
    setResult(null);
    setSearchTerm('');
  };

  const analyzeRisk = () => {
    if (!selectedAnimal || selectedSymptoms.length === 0) {
      return;
    }

    const scoredConditions = CONDITION_RULES.map(
      (condition) => {
        const matchedSymptoms =
          condition.symptoms.filter((symptom) =>
            selectedSymptoms.includes(symptom)
          );

        const score =
          matchedSymptoms.length /
          condition.symptoms.length;

        const hasHighRiskSymptom =
          condition.highRiskSymptoms?.some(
            (symptom) =>
              selectedSymptoms.includes(symptom)
          ) || false;

        return {
          ...condition,
          matchedSymptoms,
          score,
          hasHighRiskSymptom
        };
      }
    ).sort((a, b) => b.score - a.score);

    const bestMatch = scoredConditions[0];

    if (
      !bestMatch ||
      bestMatch.matchedSymptoms.length === 0
    ) {
      setResult({
        condition: 'No Strong Pattern Identified',
        riskLevel: 'Low',
        matchedSymptoms: selectedSymptoms,
        confidence: 20,
        explanation:
          'The selected symptoms do not currently match a strong condition pattern in the screening rules.',
        recommendedAction:
          'Continue monitoring the animal and consult a veterinarian if symptoms persist, worsen, or new signs appear.'
      });

      return;
    }

    let riskLevel: RiskLevel = 'Low';

    if (
      bestMatch.score >= 0.6 ||
      (
        bestMatch.hasHighRiskSymptom &&
        bestMatch.matchedSymptoms.length >= 2
      )
    ) {
      riskLevel = 'High';
    } else if (
      bestMatch.score >= 0.35 ||
      bestMatch.matchedSymptoms.length >= 2
    ) {
      riskLevel = 'Medium';
    }

    const confidence = Math.min(
      95,
      Math.max(
        35,
        Math.round(bestMatch.score * 100)
      )
    );

    setResult({
      condition: bestMatch.name,
      riskLevel,
      matchedSymptoms:
        bestMatch.matchedSymptoms,
      confidence,
      explanation:
        bestMatch.description,

        

        sourceName: bestMatch.sourceName,
sourceUrl: bestMatch.sourceUrl,

      recommendedAction:
      
        riskLevel === 'High'
          ? 'Veterinary review is recommended as soon as possible. Isolate the animal if an infectious condition is suspected and avoid starting antibiotics without veterinary guidance.'
          : riskLevel === 'Medium'
            ? 'Monitor the animal closely and arrange veterinary review if symptoms persist or worsen.'
            : 'Continue observation and maintain routine health records.'
    });
  };

const handleSendToVet = () => {
  if (!selectedAnimal || !result) return;

  if (onSendToVet) {
    onSendToVet(
      selectedAnimal,
      result.condition,
      result.riskLevel,
      selectedSymptoms
    );
  } else {
    onSelectAnimal(selectedAnimal);
    onNavigate('veterinary-review');
  }
};

  const riskStyles = result
    ? getRiskStyles(result.riskLevel)
    : null;

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-primary" />
            </div>

            <span className="text-xs font-black uppercase tracking-[0.18em] text-secondary">
              Preventive Animal Health
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            Early Disease Detection
          </h1>

          <p className="text-sm text-on-surface-variant mt-1 max-w-3xl">
            Screen livestock symptoms early, identify
            possible disease patterns and escalate
            suspicious cases for veterinary review.
          </p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-secondary" />

            <p className="text-xs text-on-surface-variant">
              <strong className="text-primary">
                Screening tool:
              </strong>{' '}
              Results indicate suspected risk, not a
              confirmed diagnosis.
            </p>
          </div>
        </div>
      </div>

      {/* Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          {
            number: '01',
            title: 'Select Animal',
            text: 'Choose the livestock record to assess.'
          },
          {
            number: '02',
            title: 'Record Symptoms',
            text: 'Select currently observed clinical signs.'
          },
          {
            number: '03',
            title: 'Screen Risk',
            text: 'Generate suspected condition and risk level.'
          }
        ].map((step) => (
          <div
            key={step.number}
            className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <span className="text-xs font-black text-secondary">
                {step.number}
              </span>

              <div>
                <h3 className="text-sm font-black text-primary">
                  {step.title}
                </h3>

                <p className="text-xs text-on-surface-variant mt-1">
                  {step.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* LEFT */}
        <div className="xl:col-span-7 space-y-6">

          {/* Animal */}
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs p-5 sm:p-6">
            <div className="flex items-center gap-2 pb-4 border-b border-outline-variant/40">
              <Activity className="w-5 h-5 text-secondary" />

              <div>
                <h2 className="font-black text-primary">
                  Select Animal
                </h2>

                <p className="text-xs text-on-surface-variant">
                  Assessment will be attached to this
                  livestock record.
                </p>
              </div>
            </div>

            <select
              value={selectedAnimalId}
              onChange={(event) => {
                setSelectedAnimalId(
                  event.target.value
                );
                setResult(null);
              }}
              className="mt-4 w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low text-sm text-on-surface focus:outline-none focus:border-primary"
            >
              {animals.map((animal) => (
                <option
                  key={animal.id}
                  value={animal.id}
                >
                  {animal.id}
                  {animal.name
                    ? ` — ${animal.name}`
                    : ''}{' '}
                  — {animal.species} —{' '}
                  {animal.farmName}
                </option>
              ))}
            </select>

            {selectedAnimal && (
              <div className="mt-4 p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row gap-4 sm:items-center">
                <img
                  src={selectedAnimal.imageUrl}
                  alt={selectedAnimal.id}
                  className="w-full sm:w-24 h-24 object-cover rounded-xl"
                />

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-primary">
                      {selectedAnimal.name ||
                        selectedAnimal.id}
                    </h3>

                    <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container text-[10px] font-black">
                      {selectedAnimal.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
                    <div>
                      <span className="text-outline">
                        Species
                      </span>
                      <p className="font-bold text-on-surface mt-0.5">
                        {selectedAnimal.species}
                      </p>
                    </div>

                    <div>
                      <span className="text-outline">
                        Breed
                      </span>
                      <p className="font-bold text-on-surface mt-0.5">
                        {selectedAnimal.breed}
                      </p>
                    </div>

                    <div>
                      <span className="text-outline">
                        Health
                      </span>
                      <p className="font-bold text-on-surface mt-0.5">
                        {selectedAnimal.healthStatus}
                      </p>
                    </div>

                    <div>
                      <span className="text-outline">
                        Risk
                      </span>
                      <p className="font-bold text-on-surface mt-0.5">
                        {selectedAnimal.riskLevel}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Symptoms */}
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/40">
              <div>
                <h2 className="font-black text-primary">
                  Observed Symptoms
                </h2>

                <p className="text-xs text-on-surface-variant mt-1">
                  Select every symptom currently visible
                  in the animal.
                </p>
              </div>

              <span className="text-xs font-black text-secondary">
                {selectedSymptoms.length} selected
              </span>
            </div>

            <div className="relative mt-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />

              <input
                type="text"
                placeholder="Search symptoms..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {filteredSymptoms.map((symptom) => {
                const active =
                  selectedSymptoms.includes(symptom);

                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() =>
                      toggleSymptom(symptom)
                    }
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      active
                        ? 'border-primary bg-primary-container text-on-primary-container'
                        : 'border-outline-variant bg-surface-container-low hover:border-primary/50 text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {active ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-outline shrink-0" />
                      )}

                      <span className="text-xs font-bold">
                        {symptom}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="button"
                onClick={analyzeRisk}
                disabled={
                  !selectedAnimal ||
                  selectedSymptoms.length === 0
                }
                className="flex-1 px-5 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-black text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                <Stethoscope className="w-4 h-4" />
                Analyze Disease Risk
              </button>

              <button
                type="button"
                onClick={resetAssessment}
                className="px-5 py-3 rounded-xl border border-outline-variant bg-surface-container-low hover:bg-surface-container text-on-surface text-sm font-bold transition-all cursor-pointer"
              >
                Reset
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT RESULT */}
        <div className="xl:col-span-5">
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs p-5 sm:p-6 xl:sticky xl:top-24">

            <div className="flex items-center gap-2 pb-4 border-b border-outline-variant/40">
              <Stethoscope className="w-5 h-5 text-secondary" />

              <div>
                <h2 className="font-black text-primary">
                  Screening Result
                </h2>

                <p className="text-xs text-on-surface-variant">
                  Rule-based early risk assessment.
                </p>
              </div>
            </div>

            {!result ? (
              <div className="min-h-[420px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center">
                  <HeartPulse className="w-8 h-8 text-outline" />
                </div>

                <h3 className="font-black text-primary mt-4">
                  No assessment generated
                </h3>

                <p className="text-xs text-on-surface-variant mt-2 max-w-xs leading-relaxed">
                  Select an animal and observed symptoms,
                  then run the early detection screening.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">

                <div
                  className={`p-4 rounded-2xl border ${riskStyles?.card}`}
                >
                  <div className="flex justify-between gap-4 items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-black text-outline">
                        Suspected Condition
                      </span>

                      <h3 className="text-xl font-black text-primary mt-1">
                        {result.condition}
                      </h3>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black ${riskStyles?.badge}`}
                    >
                      {result.riskLevel} Risk
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-bold text-on-surface-variant">
                        Pattern match
                      </span>

                      <span className="font-black text-primary">
                        {result.confidence}%
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${result.confidence}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60">
                  <h4 className="text-xs font-black uppercase tracking-wide text-primary">
                    Why it was flagged
                  </h4>

                  <p className="text-xs text-on-surface-variant leading-relaxed mt-2">
                    {result.explanation}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {result.matchedSymptoms.map(
                      (symptom) => (
                        <span
                          key={symptom}
                          className="px-2 py-1 rounded-lg bg-primary-container text-on-primary-container text-[10px] font-bold"
                        >
                          {symptom}
                        </span>
                      )
                    )}
                  </div>
                </div>

               {/* Recommended Action */}
<div className="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest">
  <div className="flex items-start gap-3">
    <AlertTriangle
      className={`w-5 h-5 shrink-0 ${riskStyles?.icon}`}
    />

    <div>
      <h4 className="text-xs font-black text-primary">
        Recommended Next Action
      </h4>

      <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
        {result.recommendedAction}
      </p>
    </div>
  </div>
</div>

{/* Clinical Reference */}
{result.sourceUrl && (
  <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low">
    <p className="text-xs font-black text-primary">
      Clinical Reference
    </p>

    <p className="text-xs text-on-surface-variant mt-1">
      Symptom pattern validated using:
    </p>

    <a
      href={result.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block mt-2 text-sm font-bold text-primary underline"
    >
      {result.sourceName || 'MSD Veterinary Manual'}
    </a>
  </div>
)}

                <button
                  type="button"
                  onClick={handleSendToVet}
                  className="w-full px-5 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Send to Veterinary Review
                  <ChevronRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-outline leading-relaxed">
                  This screening does not replace clinical
                  examination, laboratory testing, or a
                  veterinarian's diagnosis.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};