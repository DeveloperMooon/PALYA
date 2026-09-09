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

import {
  Animal,
  ScreenId
} from '../../types';

/* =========================================================
   PROPS
========================================================= */

interface EarlyDetectionScreenProps {
  animals: Animal[];

  onSelectAnimal: (
    animal: Animal
  ) => void;

  onNavigate: (
    screen: ScreenId
  ) => void;

  onSendToVet?: (
    animal: Animal,
    condition: string,
    risk: 'Low' | 'Medium' | 'High',
    symptoms: string[]
  ) => void;
}

/* =========================================================
   TYPES
========================================================= */

type RiskLevel =
  | 'Low'
  | 'Medium'
  | 'High';

type SupportedSpecies =
  | 'Cattle'
  | 'Buffalo'
  | 'Goat'
  | 'Sheep'
  | 'Pig'
  | 'Chicken'
  | 'Duck'
  | 'Camel';

interface ConditionRule {
  species: SupportedSpecies;
  name: string;
  symptoms: string[];
  highRiskSymptoms?: string[];
  description: string;
  sourceName?: string;
  sourceUrl?: string;
}

interface EstimatedCost {
  min: number;
  max: number;
  note: string;
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
  estimatedCost?: EstimatedCost;

  totalRuleSymptoms?: number;
  highRiskTriggers?: string[];
  riskReason?: string;
  escalation?: string;
}

/* =========================================================
   ALL SYMPTOMS
========================================================= */

const SYMPTOMS = [
  'Fever',
  'Reduced appetite',
  'Reduced milk production',
  'Udder swelling',
  'Udder pain',
  'Abnormal milk',
  'Cough',
  'Sneezing',
  'Nasal discharge',
  'Difficulty breathing',
  'Diarrhea',
  'Weakness',
  'Dehydration',
  'Excess salivation',
  'Mouth lesions',
  'Lameness',
  'Skin nodules',
  'Skin lesions',
  'Reduced egg production',
  'Ruffled feathers',
  'Weight loss',
  'Itching',
  'Hair loss',
  'Crusty skin'
];

/* =========================================================
   DISEASE RULES
========================================================= */

const CONDITION_RULES: ConditionRule[] = [

  /* ================= CATTLE ================= */

  {
    species: 'Cattle',
    name: 'Mastitis',

    symptoms: [
      'Fever',
      'Reduced milk production',
      'Udder swelling',
      'Udder pain',
      'Abnormal milk'
    ],

    highRiskSymptoms: [
      'Udder swelling',
      'Abnormal milk'
    ],

    description:
      'The reported symptoms show a pattern commonly associated with inflammation or infection of the udder.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/reproductive-system/mastitis-in-large-animals/mastitis-in-cattle'
  },

  {
    species: 'Cattle',
    name: 'Foot and Mouth Disease Risk',

    symptoms: [
      'Fever',
      'Excess salivation',
      'Mouth lesions',
      'Lameness',
      'Reduced appetite'
    ],

    highRiskSymptoms: [
      'Mouth lesions',
      'Excess salivation'
    ],

    description:
      'The selected symptoms may be associated with a contagious vesicular disease requiring prompt veterinary evaluation.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/infectious-diseases/foot-and-mouth-disease/foot-and-mouth-disease-in-animals'
  },

  {
    species: 'Cattle',
    name: 'Respiratory Disease Risk',

    symptoms: [
      'Fever',
      'Cough',
      'Nasal discharge',
      'Difficulty breathing',
      'Reduced appetite'
    ],

    highRiskSymptoms: [
      'Difficulty breathing'
    ],

    description:
      'The selected symptom pattern may indicate disease affecting the respiratory system.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/respiratory-system/bovine-respiratory-disease-complex/overview-of-bovine-respiratory-disease-complex'
  },

  {
    species: 'Cattle',
    name: 'Gastrointestinal Disease Risk',

    symptoms: [
      'Diarrhea',
      'Reduced appetite',
      'Weakness',
      'Dehydration',
      'Fever'
    ],

    highRiskSymptoms: [
      'Dehydration'
    ],

    description:
      'The selected signs may indicate gastrointestinal illness, infection, or another digestive disorder.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/digestive-system/intestinal-diseases-in-ruminants/intestinal-diseases-in-cattle'
  },

  {
    species: 'Cattle',
    name: 'Lumpy Skin Disease Risk',

    symptoms: [
      'Skin nodules',
      'Skin lesions',
      'Fever',
      'Reduced appetite',
      'Reduced milk production'
    ],

    highRiskSymptoms: [
      'Skin nodules'
    ],

    description:
      'Skin nodules combined with systemic symptoms require veterinary examination for possible infectious skin disease.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/integumentary-system/pox-diseases/lumpy-skin-disease-in-cattle'
  },

  /* ================= BUFFALO ================= */

  {
    species: 'Buffalo',
    name: 'Mastitis Risk',

    symptoms: [
      'Fever',
      'Reduced milk production',
      'Udder swelling',
      'Udder pain',
      'Abnormal milk'
    ],

    highRiskSymptoms: [
      'Udder swelling',
      'Abnormal milk'
    ],

    description:
      'The selected signs may indicate inflammation or infection of the udder and require veterinary assessment.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/reproductive-system/mastitis-in-large-animals/mastitis-in-cattle'
  },

  {
    species: 'Buffalo',
    name: 'Foot and Mouth Disease Risk',

    symptoms: [
      'Fever',
      'Excess salivation',
      'Mouth lesions',
      'Lameness',
      'Reduced appetite'
    ],

    highRiskSymptoms: [
      'Mouth lesions',
      'Excess salivation'
    ],

    description:
      'These signs may be associated with a contagious vesicular disease and require prompt veterinary evaluation.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/infectious-diseases/foot-and-mouth-disease/foot-and-mouth-disease-in-animals'
  },

  {
    species: 'Buffalo',
    name: 'Gastrointestinal Disease Risk',

    symptoms: [
      'Diarrhea',
      'Reduced appetite',
      'Weakness',
      'Dehydration',
      'Fever'
    ],

    highRiskSymptoms: [
      'Dehydration'
    ],

    description:
      'The selected signs may indicate gastrointestinal disease requiring veterinary evaluation.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/digestive-system/intestinal-diseases-in-ruminants/intestinal-diseases-in-cattle'
  },

  /* ================= GOAT ================= */

  {
    species: 'Goat',
    name: 'Respiratory Disease Risk',

    symptoms: [
      'Fever',
      'Cough',
      'Nasal discharge',
      'Difficulty breathing',
      'Reduced appetite'
    ],

    highRiskSymptoms: [
      'Difficulty breathing'
    ],

    description:
      'Cough, nasal discharge and breathing difficulty may indicate respiratory disease in goats.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/respiratory-system/respiratory-diseases-of-sheep-and-goats/overview-of-respiratory-diseases-of-sheep-and-goats'
  },

  {
    species: 'Goat',
    name: 'Foot and Mouth Disease Risk',

    symptoms: [
      'Fever',
      'Excess salivation',
      'Mouth lesions',
      'Lameness',
      'Reduced appetite'
    ],

    highRiskSymptoms: [
      'Mouth lesions'
    ],

    description:
      'Oral lesions, excessive salivation and lameness require prompt veterinary investigation.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/infectious-diseases/foot-and-mouth-disease/foot-and-mouth-disease-in-animals'
  },

  {
    species: 'Goat',
    name: 'Gastrointestinal Disease Risk',

    symptoms: [
      'Diarrhea',
      'Reduced appetite',
      'Weakness',
      'Dehydration',
      'Weight loss'
    ],

    highRiskSymptoms: [
      'Dehydration'
    ],

    description:
      'Diarrhea with weakness, dehydration or weight loss may indicate significant gastrointestinal disease.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/digestive-system/intestinal-diseases-in-ruminants/intestinal-diseases-in-sheep-and-goats'
  },

  /* ================= SHEEP ================= */

  {
    species: 'Sheep',
    name: 'Respiratory Disease Risk',

    symptoms: [
      'Fever',
      'Cough',
      'Nasal discharge',
      'Difficulty breathing',
      'Reduced appetite'
    ],

    highRiskSymptoms: [
      'Difficulty breathing'
    ],

    description:
      'These signs may indicate respiratory disease requiring veterinary examination.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/respiratory-system/respiratory-diseases-of-sheep-and-goats/bacterial-bronchopneumonia-in-sheep-and-goats'
  },

  {
    species: 'Sheep',
    name: 'Foot and Mouth Disease Risk',

    symptoms: [
      'Fever',
      'Excess salivation',
      'Mouth lesions',
      'Lameness',
      'Reduced appetite'
    ],

    highRiskSymptoms: [
      'Mouth lesions',
      'Lameness'
    ],

    description:
      'The selected pattern warrants investigation for contagious vesicular disease.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/infectious-diseases/foot-and-mouth-disease/foot-and-mouth-disease-in-animals'
  },

  {
    species: 'Sheep',
    name: 'Gastrointestinal Disease Risk',

    symptoms: [
      'Diarrhea',
      'Reduced appetite',
      'Weakness',
      'Dehydration',
      'Weight loss'
    ],

    highRiskSymptoms: [
      'Dehydration'
    ],

    description:
      'The selected signs may indicate gastrointestinal disease or another digestive disorder.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/digestive-system/intestinal-diseases-in-ruminants/intestinal-diseases-in-sheep-and-goats'
  },

  /* ================= PIG ================= */

  {
    species: 'Pig',
    name: 'Porcine Respiratory Disease Risk',

    symptoms: [
      'Fever',
      'Cough',
      'Nasal discharge',
      'Difficulty breathing',
      'Reduced appetite'
    ],

    highRiskSymptoms: [
      'Difficulty breathing'
    ],

    description:
      'The selected signs may indicate porcine respiratory disease or another respiratory infection.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/respiratory-system/respiratory-diseases-of-pigs/overview-of-respiratory-diseases-of-pigs'
  },

  {
    species: 'Pig',
    name: 'Enteric Disease Risk',

    symptoms: [
      'Diarrhea',
      'Reduced appetite',
      'Weakness',
      'Dehydration',
      'Weight loss'
    ],

    highRiskSymptoms: [
      'Dehydration'
    ],

    description:
      'Diarrhea, weakness and dehydration may indicate an enteric disease in pigs.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/digestive-system/intestinal-diseases-in-pigs/overview-of-intestinal-diseases-in-pigs'
  },

  {
    species: 'Pig',
    name: 'Swine Erysipelas Risk',

    symptoms: [
      'Fever',
      'Reduced appetite',
      'Weakness',
      'Skin lesions',
      'Lameness'
    ],

    highRiskSymptoms: [
      'Skin lesions',
      'Lameness'
    ],

    description:
      'Fever combined with skin abnormalities or lameness can be associated with swine erysipelas.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/infectious-diseases/erysipelothrix-rhusiopathiae-infection/swine-erysipelas'
  },

  /* ================= CHICKEN ================= */

  {
    species: 'Chicken',
    name: 'Infectious Bronchitis Risk',

    symptoms: [
      'Cough',
      'Sneezing',
      'Nasal discharge',
      'Difficulty breathing',
      'Reduced egg production'
    ],

    highRiskSymptoms: [
      'Difficulty breathing'
    ],

    description:
      'Respiratory signs combined with reduced egg production may be associated with infectious bronchitis.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/poultry/infectious-bronchitis/infectious-bronchitis-in-chickens'
  },

  {
    species: 'Chicken',
    name: 'Coccidiosis Risk',

    symptoms: [
      'Diarrhea',
      'Weakness',
      'Reduced appetite',
      'Weight loss',
      'Dehydration',
      'Ruffled feathers'
    ],

    highRiskSymptoms: [
      'Dehydration'
    ],

    description:
      'Diarrhea, weakness, poor condition and weight loss may be associated with poultry coccidiosis.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/poultry/coccidiosis-in-poultry/coccidiosis-in-poultry'
  },

  /* ================= DUCK ================= */

  {
    species: 'Duck',
    name: 'Duck Viral Enteritis Risk',

    symptoms: [
      'Reduced appetite',
      'Weakness',
      'Nasal discharge',
      'Diarrhea',
      'Dehydration'
    ],

    highRiskSymptoms: [
      'Dehydration'
    ],

    description:
      'Weakness, diarrhea and other systemic signs may warrant investigation for infectious disease such as duck viral enteritis.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/poultry/duck-viral-enteritis/duck-viral-enteritis'
  },

  {
    species: 'Duck',
    name: 'Coccidiosis Risk',

    symptoms: [
      'Diarrhea',
      'Weakness',
      'Reduced appetite',
      'Weight loss',
      'Dehydration'
    ],

    highRiskSymptoms: [
      'Dehydration'
    ],

    description:
      'Digestive signs and loss of condition may indicate coccidial or another intestinal disease.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/poultry/coccidiosis-in-poultry/coccidiosis-in-poultry'
  },

  /* ================= CAMEL ================= */

  {
    species: 'Camel',
    name: 'Respiratory Disease Risk',

    symptoms: [
      'Fever',
      'Cough',
      'Nasal discharge',
      'Difficulty breathing',
      'Reduced appetite'
    ],

    highRiskSymptoms: [
      'Difficulty breathing'
    ],

    description:
      'The selected respiratory signs require veterinary examination to determine the underlying disease.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/respiratory-system/respiratory-system-introduction/clinical-signs-of-respiratory-disease-in-animals'
  },

  {
    species: 'Camel',
    name: 'Mange / Skin Disease Risk',

    symptoms: [
      'Skin lesions',
      'Itching',
      'Hair loss',
      'Crusty skin',
      'Weakness'
    ],

    highRiskSymptoms: [
      'Skin lesions',
      'Crusty skin'
    ],

    description:
      'Itching, hair loss and crusting may indicate mange or another dermatological disorder.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/integumentary-system/mange/overview-of-mange-in-animals'
  },

  {
    species: 'Camel',
    name: 'Gastrointestinal Disease Risk',

    symptoms: [
      'Diarrhea',
      'Reduced appetite',
      'Weakness',
      'Dehydration',
      'Weight loss'
    ],

    highRiskSymptoms: [
      'Dehydration'
    ],

    description:
      'Digestive signs combined with dehydration or weight loss require veterinary evaluation.',

    sourceName:
      'MSD Veterinary Manual',

    sourceUrl:
      'https://www.msdvetmanual.com/digestive-system/digestive-system-introduction/noninfectious-diseases-of-the-gastrointestinal-tract-in-animals'
  }
];

/* =========================================================
   TREATMENT COST ESTIMATES
========================================================= */

const ESTIMATED_TREATMENT_COSTS:
  Record<string, EstimatedCost> = {

  'Cattle::Mastitis': {
    min: 1200,
    max: 3500,
    note:
      'Approximate care estimate covering veterinary consultation, possible diagnostics and supportive management.'
  },

  'Cattle::Foot and Mouth Disease Risk': {
    min: 1500,
    max: 5000,
    note:
      'Estimated management cost may vary with veterinary assessment, isolation, supportive care and monitoring requirements.'
  },

  'Cattle::Respiratory Disease Risk': {
    min: 1000,
    max: 4000,
    note:
      'Approximate estimate may include veterinary examination, diagnostics and supportive clinical management.'
  },

  'Cattle::Gastrointestinal Disease Risk': {
    min: 800,
    max: 3000,
    note:
      'Approximate estimate may include examination, diagnostic evaluation and supportive care.'
  },

  'Cattle::Lumpy Skin Disease Risk': {
    min: 1500,
    max: 4500,
    note:
      'Estimated management cost varies according to severity and supportive care.'
  },

  'Buffalo::Mastitis Risk': {
    min: 1200,
    max: 3500,
    note:
      'Approximate estimate may include veterinary examination, diagnostics and supportive management.'
  },

  'Buffalo::Foot and Mouth Disease Risk': {
    min: 1500,
    max: 5000,
    note:
      'Estimated management cost may vary according to isolation, supportive care and veterinary supervision.'
  },

  'Buffalo::Gastrointestinal Disease Risk': {
    min: 900,
    max: 3200,
    note:
      'Approximate estimate may include veterinary assessment, diagnostics and supportive care.'
  },

  'Goat::Respiratory Disease Risk': {
    min: 600,
    max: 2200,
    note:
      'Approximate estimate may include examination, diagnostics and veterinarian-directed supportive care.'
  },

  'Goat::Foot and Mouth Disease Risk': {
    min: 700,
    max: 2500,
    note:
      'Estimated management cost varies with disease severity, isolation and veterinary monitoring.'
  },

  'Goat::Gastrointestinal Disease Risk': {
    min: 500,
    max: 1800,
    note:
      'Approximate estimate may include veterinary evaluation and supportive management.'
  },

  'Sheep::Respiratory Disease Risk': {
    min: 600,
    max: 2200,
    note:
      'Approximate estimate may include examination, diagnostics and supportive care.'
  },

  'Sheep::Foot and Mouth Disease Risk': {
    min: 700,
    max: 2500,
    note:
      'Estimated management cost varies with severity, isolation and veterinary supervision.'
  },

  'Sheep::Gastrointestinal Disease Risk': {
    min: 500,
    max: 1800,
    note:
      'Approximate estimate may include veterinary assessment and supportive management.'
  },

  'Pig::Porcine Respiratory Disease Risk': {
    min: 900,
    max: 3000,
    note:
      'Approximate estimate may include veterinary examination, diagnostics and supportive management.'
  },

  'Pig::Enteric Disease Risk': {
    min: 700,
    max: 2500,
    note:
      'Approximate estimate may include diagnostic evaluation and supportive management.'
  },

  'Pig::Swine Erysipelas Risk': {
    min: 1000,
    max: 3000,
    note:
      'Estimated management cost varies with severity and veterinary care.'
  },

  'Chicken::Infectious Bronchitis Risk': {
    min: 500,
    max: 2000,
    note:
      'Approximate flock-level estimate varies with flock size and supportive management.'
  },

  'Chicken::Coccidiosis Risk': {
    min: 500,
    max: 1800,
    note:
      'Approximate flock-level estimate depends on flock size and severity.'
  },

  'Duck::Duck Viral Enteritis Risk': {
    min: 700,
    max: 2500,
    note:
      'Approximate flock-level estimate varies according to flock size and veterinary supervision.'
  },

  'Duck::Coccidiosis Risk': {
    min: 500,
    max: 1800,
    note:
      'Approximate flock-level estimate varies with bird count and severity.'
  },

  'Camel::Respiratory Disease Risk': {
    min: 1800,
    max: 6000,
    note:
      'Approximate estimate may include veterinary examination, diagnostics and supportive clinical management.'
  },

  'Camel::Mange / Skin Disease Risk': {
    min: 1200,
    max: 4000,
    note:
      'Approximate estimate may include dermatological examination and veterinarian-directed care.'
  },

  'Camel::Gastrointestinal Disease Risk': {
    min: 1500,
    max: 5000,
    note:
      'Approximate estimate may include examination, diagnostics and supportive care.'
  }
};

/* =========================================================
   COST LOOKUP
========================================================= */

const getEstimatedCost = (
  species: SupportedSpecies,
  condition: string
): EstimatedCost | undefined => {

  return ESTIMATED_TREATMENT_COSTS[
    `${species}::${condition}`
  ];
};

/* =========================================================
   RISK STYLES
========================================================= */

const getRiskStyles = (
  risk: RiskLevel
) => {

  if (risk === 'High') {
    return {
      badge:
        'bg-error-container text-error',

      card:
        'border-error/30 bg-error-container/20',

      icon:
        'text-error'
    };
  }

  if (risk === 'Medium') {
    return {
      badge:
        'bg-surface-container text-on-surface-variant',

      card:
        'border-outline-variant bg-surface-container/60',

      icon:
        'text-secondary'
    };
  }

  return {
    badge:
      'bg-emerald-100 text-emerald-800',

    card:
      'border-emerald-300 bg-emerald-50/60',

    icon:
      'text-emerald-700'
  };
};

/* =========================================================
   COMPONENT
========================================================= */

export const EarlyDetectionScreen:
  React.FC<EarlyDetectionScreenProps> = ({
    animals,
    onSelectAnimal,
    onNavigate,
    onSendToVet
  }) => {

  const [
    selectedAnimalId,
    setSelectedAnimalId
  ] = useState<string>(
    animals[0]?.id || ''
  );

  const [
    selectedSymptoms,
    setSelectedSymptoms
  ] = useState<string[]>([]);

  const [
    searchTerm,
    setSearchTerm
  ] = useState('');

  const [
    result,
    setResult
  ] = useState<DetectionResult | null>(
    null
  );

  /* =========================================================
     SELECTED ANIMAL
  ========================================================= */

  const selectedAnimal =
    useMemo(
      () =>
        animals.find(
          (animal) =>
            animal.id === selectedAnimalId
        ) || null,

      [
        animals,
        selectedAnimalId
      ]
    );

  /* =========================================================
     SPECIES SYMPTOMS
  ========================================================= */

  const speciesSymptoms =
    useMemo(
      () => {

        if (!selectedAnimal) {
          return SYMPTOMS;
        }

        const rules =
          CONDITION_RULES.filter(
            (condition) =>
              condition.species ===
              selectedAnimal.species
          );

        return Array.from(
          new Set(
            rules.flatMap(
              (condition) =>
                condition.symptoms
            )
          )
        );
      },

      [selectedAnimal]
    );

  const filteredSymptoms =
    useMemo(
      () =>
        speciesSymptoms.filter(
          (symptom) =>
            symptom
              .toLowerCase()
              .includes(
                searchTerm.toLowerCase()
              )
        ),

      [
        speciesSymptoms,
        searchTerm
      ]
    );

  /* =========================================================
     ACTIONS
  ========================================================= */

  const toggleSymptom = (
    symptom: string
  ) => {

    setResult(null);

    setSelectedSymptoms(
      (current) =>
        current.includes(symptom)
          ? current.filter(
              (item) =>
                item !== symptom
            )
          : [
              ...current,
              symptom
            ]
    );
  };

  const resetAssessment =
    () => {

      setSelectedSymptoms([]);
      setResult(null);
      setSearchTerm('');
    };

  /* =========================================================
     ANALYSIS
  ========================================================= */

  const analyzeRisk =
    () => {

      if (
        !selectedAnimal ||
        selectedSymptoms.length === 0
      ) {
        return;
      }

      const scoredConditions =
        CONDITION_RULES

          .filter(
            (condition) =>
              condition.species ===
              selectedAnimal.species
          )

          .map(
            (condition) => {

              const matchedSymptoms =
                condition.symptoms.filter(
                  (symptom) =>
                    selectedSymptoms.includes(
                      symptom
                    )
                );

              const score =
                matchedSymptoms.length /
                condition.symptoms.length;

              const hasHighRiskSymptom =
                condition
                  .highRiskSymptoms
                  ?.some(
                    (symptom) =>
                      selectedSymptoms.includes(
                        symptom
                      )
                  ) || false;

              return {
                ...condition,
                matchedSymptoms,
                score,
                hasHighRiskSymptom
              };
            }
          )

          .sort(
            (a, b) =>
              b.score - a.score
          );

      const bestMatch =
        scoredConditions[0];

      /* ================= NO MATCH ================= */

      if (
        !bestMatch ||
        bestMatch
          .matchedSymptoms
          .length === 0
      ) {

        setResult({
          condition:
            'No Strong Pattern Identified',

          riskLevel:
            'Low',

          matchedSymptoms:
            selectedSymptoms,

          confidence:
            20,

          explanation:
            `The selected symptoms do not currently match a strong ${selectedAnimal.species} disease pattern in the screening rules.`,

          recommendedAction:
            'Continue monitoring the animal and consult a veterinarian if symptoms persist, worsen, or new signs appear.',

          totalRuleSymptoms:
            selectedSymptoms.length,

          highRiskTriggers:
            [],

          riskReason:
            'No strong species-specific disease rule was matched.',

          escalation:
            'Routine Monitoring'
        });

        return;
      }

      /* ================= RISK ================= */

      let riskLevel:
        RiskLevel = 'Low';

      if (
        bestMatch.score >= 0.6 ||
        (
          bestMatch.hasHighRiskSymptom &&
          bestMatch
            .matchedSymptoms
            .length >= 2
        )
      ) {

        riskLevel = 'High';

      } else if (
        bestMatch.score >= 0.35 ||
        bestMatch
          .matchedSymptoms
          .length >= 2
      ) {

        riskLevel = 'Medium';
      }

      /* ================= CONFIDENCE ================= */

      const confidence =
        Math.min(
          95,
          Math.max(
            35,
            Math.round(
              bestMatch.score * 100
            )
          )
        );

      /* ================= COST ================= */

      const estimatedCost =
        getEstimatedCost(
          selectedAnimal.species as SupportedSpecies,
          bestMatch.name
        );

      /* =====================================================
         EXPLAINABLE RISK
      ===================================================== */

      const highRiskTriggers =
        bestMatch
          .highRiskSymptoms
          ?.filter(
            (symptom) =>
              selectedSymptoms.includes(
                symptom
              )
          ) || [];

      const riskReason =
        riskLevel === 'High'

          ? highRiskTriggers.length > 0

            ? `High risk because ${bestMatch.matchedSymptoms.length} of ${bestMatch.symptoms.length} disease-rule symptoms matched and a high-risk trigger was detected: ${highRiskTriggers.join(', ')}.`

            : `High risk because ${bestMatch.matchedSymptoms.length} of ${bestMatch.symptoms.length} disease-rule symptoms matched the high-risk screening threshold.`

          : riskLevel === 'Medium'

            ? `Medium risk because ${bestMatch.matchedSymptoms.length} of ${bestMatch.symptoms.length} disease-rule symptoms matched the species-specific screening rule.`

            : `Low risk because ${bestMatch.matchedSymptoms.length} of ${bestMatch.symptoms.length} disease-rule symptoms matched.`;

      const escalation =
        riskLevel === 'High'

          ? 'Veterinary Review Recommended'

          : riskLevel === 'Medium'

            ? 'Monitor Closely / Vet Review if Persistent'

            : 'Routine Monitoring';

      /* ================= RESULT ================= */

      setResult({

        condition:
          bestMatch.name,

        riskLevel,

        matchedSymptoms:
          bestMatch.matchedSymptoms,

        confidence,

        explanation:
          bestMatch.description,

        sourceName:
          bestMatch.sourceName,

        sourceUrl:
          bestMatch.sourceUrl,

        estimatedCost,

        totalRuleSymptoms:
          bestMatch.symptoms.length,

        highRiskTriggers,

        riskReason,

        escalation,

        recommendedAction:
          riskLevel === 'High'

            ? 'Veterinary review is recommended as soon as possible. Isolate the animal if an infectious condition is suspected and avoid starting antibiotics without veterinary guidance.'

            : riskLevel === 'Medium'

              ? 'Monitor the animal closely and arrange veterinary review if symptoms persist or worsen.'

              : 'Continue observation and maintain routine health records.'
      });
    };

  /* =========================================================
     SEND TO VET
  ========================================================= */

  const handleSendToVet =
    () => {

      if (
        !selectedAnimal ||
        !result
      ) {
        return;
      }

      if (onSendToVet) {

        onSendToVet(
          selectedAnimal,
          result.condition,
          result.riskLevel,
          selectedSymptoms
        );

        return;
      }

      onSelectAnimal(
        selectedAnimal
      );

      onNavigate(
        'veterinary-review'
      );
    };

  const riskStyles =
    result
      ? getRiskStyles(
          result.riskLevel
        )
      : null;

  return (
    <div className="space-y-6 pb-12">

      {/* HEADER */}

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

            Screen species-specific livestock symptoms,
            identify possible disease patterns and
            escalate suspicious cases for veterinary
            review.

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

      {/* WORKFLOW */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

        {[
          {
            number: '01',
            title: 'Select Animal',
            text:
              'Choose the livestock record to assess.'
          },

          {
            number: '02',
            title: 'Record Symptoms',
            text:
              'Symptoms automatically adapt to the selected species.'
          },

          {
            number: '03',
            title: 'Screen Risk',
            text:
              'Generate a species-specific suspected condition and risk level.'
          }
        ].map(
          (step) => (

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
          )
        )}

      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* LEFT */}

        <div className="xl:col-span-7 space-y-6">

          {/* SELECT ANIMAL */}

          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs p-5 sm:p-6">

            <div className="flex items-center gap-2 pb-4 border-b border-outline-variant/40">

              <Activity className="w-5 h-5 text-secondary" />

              <div>

                <h2 className="font-black text-primary">
                  Select Animal
                </h2>

                <p className="text-xs text-on-surface-variant">
                  Assessment will be attached to this livestock record.
                </p>

              </div>

            </div>

            <select
              value={selectedAnimalId}

              onChange={(event) => {

                setSelectedAnimalId(
                  event.target.value
                );

                setSelectedSymptoms([]);

                setSearchTerm('');

                setResult(null);
              }}

              className="mt-4 w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low text-sm text-on-surface focus:outline-none focus:border-primary"
            >

              {animals.map(
                (animal) => (

                  <option
                    key={animal.id}
                    value={animal.id}
                  >

                    {animal.id}

                    {animal.name
                      ? ` — ${animal.name}`
                      : ''}

                    {' — '}

                    {animal.species}

                    {' — '}

                    {animal.farmName}

                  </option>
                )
              )}

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

          {/* SYMPTOMS */}

          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs p-5 sm:p-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/40">

              <div>

                <h2 className="font-black text-primary">
                  Observed Symptoms
                </h2>

                <p className="text-xs text-on-surface-variant mt-1">

                  Showing symptoms relevant to{' '}

                  <strong>
                    {selectedAnimal?.species ||
                      'the selected animal'}
                  </strong>.

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

              {filteredSymptoms.map(
                (symptom) => {

                  const active =
                    selectedSymptoms.includes(
                      symptom
                    );

                  return (

                    <button
                      key={symptom}
                      type="button"

                      onClick={() =>
                        toggleSymptom(
                          symptom
                        )
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
                }
              )}

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
                  Species-aware rule-based early risk assessment.
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
                  then run the early disease screening.

                </p>

              </div>

            ) : (

              <div className="mt-5 space-y-4">

                {/* ==========================================
                    1. CONDITION
                ========================================== */}

                <div
                  className={`p-4 rounded-2xl border ${
                    riskStyles?.card
                  }`}
                >

                  <div className="flex justify-between gap-4 items-start">

                    <div>

                      <span className="text-[10px] uppercase tracking-wider font-black text-outline">

                        Suspected Condition

                      </span>

                      <h3 className="text-xl font-black text-primary mt-1">

                        {result.condition}

                      </h3>

                      {selectedAnimal && (

                        <p className="text-xs text-on-surface-variant mt-1">

                          Species:{' '}

                          <strong>
                            {selectedAnimal.species}
                          </strong>

                        </p>

                      )}

                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black ${riskStyles?.badge}`}
                    >

                      {result.riskLevel} Risk

                    </span>

                  </div>

                </div>

                {/* ==========================================
                    2. EXPLAINABLE RISK DECISION
                ========================================== */}

                <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low">

                  <div>

                    <h4 className="text-xs font-black uppercase tracking-wide text-primary">

                      Explainable Risk Decision

                    </h4>

                    <p className="text-xs text-on-surface-variant mt-1">

                      Transparent reasoning behind the screening result.

                    </p>

                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">

                    <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/50">

                      <p className="text-[10px] uppercase tracking-wide font-black text-outline">

                        Symptoms Matched

                      </p>

                      <p className="text-lg font-black text-primary mt-1">

                        {result.matchedSymptoms.length}
                        {' / '}
                        {result.totalRuleSymptoms ??
                          result.matchedSymptoms.length}

                      </p>

                    </div>

                    <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/50">

                      <p className="text-[10px] uppercase tracking-wide font-black text-outline">

                        Pattern Match

                      </p>

                      <p className="text-lg font-black text-primary mt-1">

                        {result.confidence}%

                      </p>

                    </div>

                  </div>

                  <div className="mt-4 space-y-3">

                    <div className="flex items-start gap-3">

                      <div className="min-w-[110px]">

                        <p className="text-[10px] font-black uppercase tracking-wide text-outline">

                          High-Risk Trigger

                        </p>

                      </div>

                      <p className="text-xs font-bold text-on-surface">

                        {result.highRiskTriggers &&
                        result.highRiskTriggers.length > 0

                          ? result.highRiskTriggers.join(
                              ', '
                            )

                          : 'None detected'}

                      </p>

                    </div>

                    <div className="flex items-start gap-3">

                      <div className="min-w-[110px]">

                        <p className="text-[10px] font-black uppercase tracking-wide text-outline">

                          Escalation

                        </p>

                      </div>

                      <p className="text-xs font-bold text-primary">

                        {result.escalation ||
                          'Routine Monitoring'}

                      </p>

                    </div>

                  </div>

                  {result.riskReason && (

                    <div className="mt-4 pt-3 border-t border-outline-variant/50">

                      <p className="text-xs text-on-surface-variant leading-relaxed">

                        {result.riskReason}

                      </p>

                    </div>

                  )}

                </div>

                {/* WHY FLAGGED */}

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

                {/* RECOMMENDED ACTION */}

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

                {/* CLINICAL REFERENCE */}

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

                      {result.sourceName ||
                        'MSD Veterinary Manual'}

                    </a>

                  </div>

                )}

                {/* ESTIMATED TREATMENT COST */}

                {result.estimatedCost && (

                  <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low">

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                      <div className="min-w-0">

                        <p className="text-xs font-black text-primary">

                          Estimated Treatment Cost

                        </p>

                        <p className="text-xs text-on-surface-variant mt-1">

                          Approximate care estimate for the
                          suspected condition.

                        </p>

                      </div>

                      <div className="sm:text-right shrink-0">

                        <p className="text-xl font-black text-primary">

                          ₹
                          {result
                            .estimatedCost
                            .min
                            .toLocaleString(
                              'en-IN'
                            )}

                          {' – '}

                          ₹
                          {result
                            .estimatedCost
                            .max
                            .toLocaleString(
                              'en-IN'
                            )}

                        </p>

                        <span className="text-[10px] font-bold text-on-surface-variant">

                          Estimated range

                        </span>

                      </div>

                    </div>

                    <div className="mt-3 pt-3 border-t border-outline-variant/50">

                      <p className="text-xs text-on-surface-variant leading-relaxed">

                        {result.estimatedCost.note}

                      </p>

                      <p className="text-[10px] text-outline mt-2 leading-relaxed">

                        Demo estimate only. Final cost can vary
                        by severity, animal condition,
                        diagnostics, location, veterinary fees
                        and the veterinarian&apos;s final care
                        plan.

                      </p>

                    </div>

                  </div>

                )}

                {/* SEND TO VET */}

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
                  veterinarian&apos;s diagnosis.

                </p>

              </div>

            )}

          </section>

        </div>

      </div>

    </div>
  );
};