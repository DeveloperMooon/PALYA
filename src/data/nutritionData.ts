export type NutritionStage = {
  label: string;

  referenceWeightKg: number | null;

  dryMatterPercent?: {
    min: number;
    max: number;
  };

  energy: string;

  proteinPercent: {
    min: number;
    max: number;
  };

  fibrePercent?: {
    min: number;
    max: number;
  };

  calciumPercent: {
    min: number;
    max: number;
  };

  phosphorusPercent: {
    min: number;
    max: number;
  };

  lysinePercent?: {
    min: number;
    max: number;
  };

  methioninePercent?: {
    min: number;
    max: number;
  };

  saltPercent?: {
    min: number;
    max: number;
  };

  water: string;

  purpose: string;

  feedingStrategy: string[];

  note: string;
};


export type SpeciesNutritionData =
  Record<string, NutritionStage>;


export const NUTRITION_DATA:
Record<string, SpeciesNutritionData> = {


  /*
  =========================================================
  CATTLE
  =========================================================
  */

  Cattle: {

    maintenance: {

      label:
        'Adult Maintenance',

      referenceWeightKg:
        450,

      dryMatterPercent: {
        min: 1.8,
        max: 2.2
      },

      energy:
        '10–12 Mcal/day',

      proteinPercent: {
        min: 10,
        max: 12
      },

      fibrePercent: {
        min: 28,
        max: 34
      },

      calciumPercent: {
        min: 0.45,
        max: 0.60
      },

      phosphorusPercent: {
        min: 0.30,
        max: 0.40
      },

      saltPercent: {
        min: 0.5,
        max: 1.0
      },

      water:
        '30–50 L/day',

      purpose:
        'Milk + Meat',

      feedingStrategy: [
        'Good-quality green fodder',
        'Dry roughage',
        'Balanced concentrate if required',
        'Mineral mixture',
        'Continuous clean drinking water'
      ],

      note:
        'Adjust according to actual body weight, activity level and climate.'
    },


    lactating: {

      label:
        'Lactating',

      referenceWeightKg:
        450,

      dryMatterPercent: {
        min: 2.5,
        max: 3.5
      },

      energy:
        '13–18 Mcal/day',

      proteinPercent: {
        min: 12,
        max: 16
      },

      fibrePercent: {
        min: 28,
        max: 32
      },

      calciumPercent: {
        min: 0.60,
        max: 0.90
      },

      phosphorusPercent: {
        min: 0.35,
        max: 0.45
      },

      saltPercent: {
        min: 0.5,
        max: 1.0
      },

      water:
        '40–80+ L/day',

      purpose:
        'Milk + Meat',

      feedingStrategy: [
        'High-quality green fodder',
        'Dry roughage',
        'Energy-dense concentrate',
        'Protein-rich concentrate',
        'Calcium-phosphorus mineral mixture',
        'Adequate salt',
        'Free access to clean water'
      ],

      note:
        'Balance ration according to actual milk yield and body condition.'
    },


    pregnancy: {

      label:
        'Late Gestation / Transition',

      referenceWeightKg:
        450,

      dryMatterPercent: {
        min: 1.8,
        max: 2.5
      },

      energy:
        '10–14 Mcal/day',

      proteinPercent: {
        min: 12,
        max: 14
      },

      fibrePercent: {
        min: 30,
        max: 35
      },

      calciumPercent: {
        min: 0.45,
        max: 0.70
      },

      phosphorusPercent: {
        min: 0.30,
        max: 0.40
      },

      saltPercent: {
        min: 0.5,
        max: 1.0
      },

      water:
        '30–55 L/day',

      purpose:
        'Milk + Meat',

      feedingStrategy: [
        'Good-quality roughage',
        'Moderate concentrate supplementation',
        'Mineral mixture',
        'Avoid sudden diet changes',
        'Maintain clean drinking water'
      ],

      note:
        'Transition animals need gradual ration adjustment before calving.'
    }

  },


  /*
  =========================================================
  BUFFALO
  =========================================================
  */

  Buffalo: {

    maintenance: {

      label:
        'Adult Maintenance',

      referenceWeightKg:
        500,

      dryMatterPercent: {
        min: 1.8,
        max: 2.2
      },

      energy:
        '11–14 Mcal/day',

      proteinPercent: {
        min: 10,
        max: 12
      },

      fibrePercent: {
        min: 28,
        max: 34
      },

      calciumPercent: {
        min: 0.45,
        max: 0.60
      },

      phosphorusPercent: {
        min: 0.30,
        max: 0.40
      },

      saltPercent: {
        min: 0.5,
        max: 1.0
      },

      water:
        '30–60 L/day',

      purpose:
        'Milk + Meat',

      feedingStrategy: [
        'Green fodder',
        'Dry roughage',
        'Balanced mineral mixture',
        'Salt supplementation',
        'Adequate clean water'
      ],

      note:
        'Use actual body weight for better ration estimation.'
    },


    lactating: {

      label:
        'Lactating',

      referenceWeightKg:
        500,

      dryMatterPercent: {
        min: 2.5,
        max: 3.5
      },

      energy:
        '14–19 Mcal/day',

      proteinPercent: {
        min: 12,
        max: 16
      },

      fibrePercent: {
        min: 28,
        max: 32
      },

      calciumPercent: {
        min: 0.60,
        max: 0.90
      },

      phosphorusPercent: {
        min: 0.35,
        max: 0.45
      },

      saltPercent: {
        min: 0.5,
        max: 1.0
      },

      water:
        '40–90+ L/day',

      purpose:
        'Milk + Meat',

      feedingStrategy: [
        'High-quality green fodder',
        'Dry roughage',
        'Balanced concentrate',
        'Protein supplementation',
        'Mineral mixture',
        'Free access to clean water'
      ],

      note:
        'Increase nutrient intake according to milk production.'
    },


    pregnancy: {

      label:
        'Last 3 Months Pregnancy',

      referenceWeightKg:
        500,

      dryMatterPercent: {
        min: 1.8,
        max: 2.5
      },

      energy:
        '11–15 Mcal/day',

      proteinPercent: {
        min: 11,
        max: 14
      },

      fibrePercent: {
        min: 30,
        max: 35
      },

      calciumPercent: {
        min: 0.50,
        max: 0.75
      },

      phosphorusPercent: {
        min: 0.30,
        max: 0.40
      },

      saltPercent: {
        min: 0.5,
        max: 1.0
      },

      water:
        '35–60 L/day',

      purpose:
        'Milk + Meat',

      feedingStrategy: [
        'Good-quality fodder',
        'Moderate concentrate',
        'Mineral supplementation',
        'Avoid sudden ration changes',
        'Maintain adequate hydration'
      ],

      note:
        'Pregnancy-stage feeding should be adjusted according to body condition.'
    }

  },


  /*
  =========================================================
  GOAT
  =========================================================
  */

  Goat: {

    maintenance: {

      label:
        'Adult Maintenance',

      referenceWeightKg:
        35,

      dryMatterPercent: {
        min: 2.0,
        max: 3.0
      },

      energy:
        '1.5–2.5 Mcal/day',

      proteinPercent: {
        min: 9,
        max: 12
      },

      fibrePercent: {
        min: 25,
        max: 35
      },

      calciumPercent: {
        min: 0.40,
        max: 0.70
      },

      phosphorusPercent: {
        min: 0.25,
        max: 0.40
      },

      saltPercent: {
        min: 0.5,
        max: 1.0
      },

      water:
        '3–7 L/day',

      purpose:
        'Meat + Milk',

      feedingStrategy: [
        'Browse and green fodder',
        'Dry fodder',
        'Small quantity of concentrate if required',
        'Mineral mixture',
        'Clean drinking water'
      ],

      note:
        'Adjust for breed, browsing availability and body weight.'
    },


    growing: {

      label:
        'Growing Goat',

      referenceWeightKg:
        20,

      dryMatterPercent: {
        min: 2.5,
        max: 4.0
      },

      energy:
        '1.8–3.0 Mcal/day',

      proteinPercent: {
        min: 12,
        max: 16
      },

      fibrePercent: {
        min: 20,
        max: 30
      },

      calciumPercent: {
        min: 0.50,
        max: 0.80
      },

      phosphorusPercent: {
        min: 0.30,
        max: 0.45
      },

      saltPercent: {
        min: 0.5,
        max: 1.0
      },

      water:
        '2–5 L/day',

      purpose:
        'Meat + Milk',

      feedingStrategy: [
        'High-quality green fodder',
        'Protein-rich concentrate',
        'Adequate energy supply',
        'Mineral supplementation',
        'Clean water'
      ],

      note:
        'Growth diets should be adjusted according to target weight gain.'
    },


    lactating: {

      label:
        'Lactating',

      referenceWeightKg:
        35,

      dryMatterPercent: {
        min: 2.5,
        max: 4.0
      },

      energy:
        '2.5–3.5 Mcal/day',

      proteinPercent: {
        min: 12,
        max: 16
      },

      fibrePercent: {
        min: 22,
        max: 30
      },

      calciumPercent: {
        min: 0.60,
        max: 0.90
      },

      phosphorusPercent: {
        min: 0.35,
        max: 0.45
      },

      saltPercent: {
        min: 0.5,
        max: 1.0
      },

      water:
        '4–8 L/day',

      purpose:
        'Meat + Milk',

      feedingStrategy: [
        'Good-quality browse',
        'Green fodder',
        'Balanced concentrate',
        'Calcium-rich mineral mixture',
        'Adequate clean water'
      ],

      note:
        'Monitor body condition during lactation.'
    }

  },


  /*
  =========================================================
  SHEEP
  =========================================================
  */

  Sheep: {

    maintenance: {

      label:
        'Adult Maintenance',

      referenceWeightKg:
        40,

      dryMatterPercent: {
        min: 1.8,
        max: 2.5
      },

      energy:
        '1.5–2.3 Mcal/day',

      proteinPercent: {
        min: 8,
        max: 11
      },

      fibrePercent: {
        min: 28,
        max: 35
      },

      calciumPercent: {
        min: 0.30,
        max: 0.50
      },

      phosphorusPercent: {
        min: 0.20,
        max: 0.35
      },

      saltPercent: {
        min: 0.5,
        max: 1.0
      },

      water:
        '2–5 L/day',

      purpose:
        'Meat',

      feedingStrategy: [
        'Good-quality pasture',
        'Dry roughage',
        'Mineral mixture',
        'Clean water'
      ],

      note:
        'Pasture quality strongly affects nutrient intake.'
    },


    growing: {

      label:
        'Growing Lamb',

      referenceWeightKg:
        20,

      dryMatterPercent: {
        min: 2.5,
        max: 4.0
      },

      energy:
        '1.3–2.2 Mcal/day',

      proteinPercent: {
        min: 12,
        max: 16
      },

      fibrePercent: {
        min: 20,
        max: 30
      },

      calciumPercent: {
        min: 0.45,
        max: 0.70
      },

      phosphorusPercent: {
        min: 0.25,
        max: 0.40
      },

      saltPercent: {
        min: 0.5,
        max: 1.0
      },

      water:
        '1–2 L/day',

      purpose:
        'Meat',

      feedingStrategy: [
        'Quality pasture',
        'Protein concentrate',
        'Mineral supplementation',
        'Clean drinking water'
      ],

      note:
        'Use body weight and target daily gain for more precise feeding.'
    },


    pregnancy: {

      label:
        'Late Pregnancy',

      referenceWeightKg:
        45,

      dryMatterPercent: {
        min: 2.0,
        max: 3.0
      },

      energy:
        '2.0–3.0 Mcal/day',

      proteinPercent: {
        min: 11,
        max: 15
      },

      fibrePercent: {
        min: 25,
        max: 32
      },

      calciumPercent: {
        min: 0.50,
        max: 0.75
      },

      phosphorusPercent: {
        min: 0.30,
        max: 0.40
      },

      saltPercent: {
        min: 0.5,
        max: 1.0
      },

      water:
        '2–6 L/day',

      purpose:
        'Meat',

      feedingStrategy: [
        'High-quality forage',
        'Moderate energy supplementation',
        'Mineral mixture',
        'Adequate water'
      ],

      note:
        'Energy and mineral adequacy are especially important during late pregnancy.'
    }

  },


  /*
  =========================================================
  PIG
  =========================================================
  */

  Pig: {

    growerFinisher: {

      label:
        'Grower-Finisher',

      referenceWeightKg:
        60,

      energy:
        '3,100–3,400 kcal/kg diet',

      proteinPercent: {
        min: 16,
        max: 18
      },

      fibrePercent: {
        min: 5,
        max: 8
      },

      calciumPercent: {
        min: 0.60,
        max: 0.85
      },

      phosphorusPercent: {
        min: 0.45,
        max: 0.65
      },

      lysinePercent: {
        min: 0.85,
        max: 1.05
      },

      methioninePercent: {
        min: 0.50,
        max: 0.60
      },

      saltPercent: {
        min: 0.3,
        max: 0.5
      },

      water:
        'Free access to clean water',

      purpose:
        'Meat',

      feedingStrategy: [
        'Balanced grower-finisher ration',
        'Adequate energy source',
        'Protein and amino acid balance',
        'Mineral supplementation',
        'Continuous clean water'
      ],

      note:
        'Use phase-specific feeding for best growth performance.'
    },


    gestating: {

      label:
        'Gestating Sow',

      referenceWeightKg:
        180,

      energy:
        '2,900–3,200 kcal/kg diet',

      proteinPercent: {
        min: 12,
        max: 14
      },

      fibrePercent: {
        min: 7,
        max: 10
      },

      calciumPercent: {
        min: 0.75,
        max: 0.95
      },

      phosphorusPercent: {
        min: 0.50,
        max: 0.70
      },

      lysinePercent: {
        min: 0.55,
        max: 0.75
      },

      methioninePercent: {
        min: 0.25,
        max: 0.35
      },

      saltPercent: {
        min: 0.3,
        max: 0.5
      },

      water:
        'Free access to clean water',

      purpose:
        'Meat',

      feedingStrategy: [
        'Controlled energy ration',
        'Adequate fibre',
        'Balanced minerals',
        'Moderate protein',
        'Unlimited clean water'
      ],

      note:
        'Avoid excessive energy intake during gestation.'
    },


    lactating: {

      label:
        'Lactating Sow',

      referenceWeightKg:
        190,

      energy:
        '3,200–3,500 kcal/kg diet',

      proteinPercent: {
        min: 16,
        max: 18
      },

      fibrePercent: {
        min: 5,
        max: 8
      },

      calciumPercent: {
        min: 0.85,
        max: 1.00
      },

      phosphorusPercent: {
        min: 0.55,
        max: 0.75
      },

      lysinePercent: {
        min: 0.95,
        max: 1.15
      },

      methioninePercent: {
        min: 0.55,
        max: 0.65
      },

      saltPercent: {
        min: 0.3,
        max: 0.5
      },

      water:
        'Free access to clean water',

      purpose:
        'Meat',

      feedingStrategy: [
        'High-energy lactation ration',
        'High-quality protein',
        'Adequate amino acids',
        'Mineral supplementation',
        'Unlimited clean water'
      ],

      note:
        'Increase nutrient density with litter size and milk production.'
    }

  },


  /*
  =========================================================
  CHICKEN
  =========================================================
  */

  Chicken: {

    starter: {

      label:
        'Broiler Starter (0–3 weeks)',

      referenceWeightKg:
        0.15,

      energy:
        '2,900–3,100 kcal/kg diet',

      proteinPercent: {
        min: 21,
        max: 23
      },

      fibrePercent: {
        min: 3,
        max: 5
      },

      calciumPercent: {
        min: 0.9,
        max: 1.0
      },

      phosphorusPercent: {
        min: 0.40,
        max: 0.50
      },

      lysinePercent: {
        min: 1.1,
        max: 1.3
      },

      methioninePercent: {
        min: 0.45,
        max: 0.55
      },

      saltPercent: {
        min: 0.3,
        max: 0.5
      },

      water:
        'Ad libitum clean cool water',

      purpose:
        'Meat',

      feedingStrategy: [
        'Broiler starter feed',
        'High-protein ration',
        'Balanced amino acids',
        'Fine feed particle size',
        'Constant clean water access'
      ],

      note:
        'Commercial strain recommendations may override these general ranges.'
    },


    finisher: {

      label:
        'Broiler Finisher',

      referenceWeightKg:
        1.8,

      energy:
        '3,100–3,250 kcal/kg diet',

      proteinPercent: {
        min: 18,
        max: 20
      },

      fibrePercent: {
        min: 3,
        max: 5
      },

      calciumPercent: {
        min: 0.85,
        max: 0.95
      },

      phosphorusPercent: {
        min: 0.35,
        max: 0.45
      },

      lysinePercent: {
        min: 0.95,
        max: 1.10
      },

      methioninePercent: {
        min: 0.40,
        max: 0.50
      },

      saltPercent: {
        min: 0.3,
        max: 0.5
      },

      water:
        'Ad libitum clean cool water',

      purpose:
        'Meat',

      feedingStrategy: [
        'Broiler finisher feed',
        'High-energy ration',
        'Moderate protein',
        'Balanced minerals',
        'Continuous clean water'
      ],

      note:
        'Use commercial strain-specific feeding recommendations for precision.'
    },


    layer: {

      label:
        'Layer',

      referenceWeightKg:
        1.8,

      energy:
        '2,600–2,800 kcal/kg diet',

      proteinPercent: {
        min: 16,
        max: 18
      },

      fibrePercent: {
        min: 3,
        max: 6
      },

      calciumPercent: {
        min: 3.5,
        max: 4.2
      },

      phosphorusPercent: {
        min: 0.35,
        max: 0.45
      },

      lysinePercent: {
        min: 0.70,
        max: 0.85
      },

      methioninePercent: {
        min: 0.30,
        max: 0.40
      },

      saltPercent: {
        min: 0.3,
        max: 0.5
      },

      water:
        'Ad libitum clean water',

      purpose:
        'Eggs + Meat',

      feedingStrategy: [
        'Layer feed',
        'High-calcium mineral source',
        'Balanced protein',
        'Adequate phosphorus',
        'Continuous clean water'
      ],

      note:
        'Calcium availability is important for eggshell formation.'
    }

  },


  /*
  =========================================================
  DUCK
  =========================================================
  */

  Duck: {

    starter: {

      label:
        'Starter',

      referenceWeightKg:
        0.15,

      energy:
        'Minimum ~2,600 kcal/kg diet',

      proteinPercent: {
        min: 20,
        max: 20
      },

      fibrePercent: {
        min: 0,
        max: 7
      },

      calciumPercent: {
        min: 1.0,
        max: 1.0
      },

      phosphorusPercent: {
        min: 0.50,
        max: 0.50
      },

      lysinePercent: {
        min: 0.90,
        max: 0.90
      },

      methioninePercent: {
        min: 0.30,
        max: 0.30
      },

      saltPercent: {
        min: 0,
        max: 0.60
      },

      water:
        'Ad libitum clean drinking water',

      purpose:
        'Eggs + Meat',

      feedingStrategy: [
        'Duck starter ration',
        'Adequate protein',
        'Balanced minerals',
        'Continuous drinking water'
      ],

      note:
        'Adjust according to breed and production system.'
    },


    grower: {

      label:
        'Grower',

      referenceWeightKg:
        0.8,

      energy:
        'Minimum ~2,500 kcal/kg diet',

      proteinPercent: {
        min: 16,
        max: 16
      },

      fibrePercent: {
        min: 0,
        max: 8
      },

      calciumPercent: {
        min: 1.0,
        max: 1.0
      },

      phosphorusPercent: {
        min: 0.50,
        max: 0.50
      },

      lysinePercent: {
        min: 0.60,
        max: 0.60
      },

      methioninePercent: {
        min: 0.25,
        max: 0.25
      },

      saltPercent: {
        min: 0,
        max: 0.60
      },

      water:
        'Ad libitum clean drinking water',

      purpose:
        'Eggs + Meat',

      feedingStrategy: [
        'Duck grower ration',
        'Moderate protein',
        'Balanced energy',
        'Mineral supplementation',
        'Continuous clean water'
      ],

      note:
        'Breed and management system should be considered.'
    },


    layer: {

      label:
        'Layer',

      referenceWeightKg:
        1.5,

      energy:
        'Minimum ~2,600 kcal/kg diet',

      proteinPercent: {
        min: 18,
        max: 18
      },

      fibrePercent: {
        min: 0,
        max: 8
      },

      calciumPercent: {
        min: 3.0,
        max: 3.0
      },

      phosphorusPercent: {
        min: 0.50,
        max: 0.50
      },

      lysinePercent: {
        min: 0.65,
        max: 0.65
      },

      methioninePercent: {
        min: 0.30,
        max: 0.30
      },

      saltPercent: {
        min: 0,
        max: 0.60
      },

      water:
        'Ad libitum clean drinking water',

      purpose:
        'Eggs + Meat',

      feedingStrategy: [
        'Layer ration',
        'Higher calcium supply',
        'Balanced protein',
        'Continuous clean water'
      ],

      note:
        'Higher calcium supports eggshell formation.'
    },


    broilerStarter: {

      label:
        'Broiler Starter',

      referenceWeightKg:
        0.15,

      energy:
        'Minimum ~2,800 kcal/kg diet',

      proteinPercent: {
        min: 23,
        max: 23
      },

      fibrePercent: {
        min: 0,
        max: 6
      },

      calciumPercent: {
        min: 1.2,
        max: 1.2
      },

      phosphorusPercent: {
        min: 0.50,
        max: 0.50
      },

      lysinePercent: {
        min: 1.2,
        max: 1.2
      },

      methioninePercent: {
        min: 0.50,
        max: 0.50
      },

      saltPercent: {
        min: 0,
        max: 0.60
      },

      water:
        'Ad libitum clean drinking water',

      purpose:
        'Meat',

      feedingStrategy: [
        'High-protein broiler starter ration',
        'Balanced amino acids',
        'Adequate minerals',
        'Continuous clean water'
      ],

      note:
        'Use strain-specific formulation when available.'
    },


    broilerFinisher: {

      label:
        'Broiler Finisher',

      referenceWeightKg:
        2,

      energy:
        'Minimum ~2,900 kcal/kg diet',

      proteinPercent: {
        min: 20,
        max: 20
      },

      fibrePercent: {
        min: 0,
        max: 6
      },

      calciumPercent: {
        min: 1.2,
        max: 1.2
      },

      phosphorusPercent: {
        min: 0.50,
        max: 0.50
      },

      lysinePercent: {
        min: 1.0,
        max: 1.0
      },

      methioninePercent: {
        min: 0.35,
        max: 0.35
      },

      saltPercent: {
        min: 0,
        max: 0.60
      },

      water:
        'Ad libitum clean drinking water',

      purpose:
        'Meat',

      feedingStrategy: [
        'Broiler finisher ration',
        'Adequate energy',
        'Moderate-high protein',
        'Balanced minerals',
        'Clean water'
      ],

      note:
        'Strain-specific formulation is preferable for precision.'
    }

  },


  /*
  =========================================================
  CAMEL
  =========================================================
  */

  Camel: {

    maintenance: {

      label:
        'Adult Maintenance',

      referenceWeightKg:
        450,

      dryMatterPercent: {
        min: 1.5,
        max: 2.5
      },

      energy:
        'Use body weight and activity model',

      proteinPercent: {
        min: 8,
        max: 12
      },

      fibrePercent: {
        min: 30,
        max: 40
      },

      calciumPercent: {
        min: 0.40,
        max: 0.60
      },

      phosphorusPercent: {
        min: 0.25,
        max: 0.40
      },

      saltPercent: {
        min: 0.5,
        max: 1.0
      },

      water:
        'Water requirement varies greatly with climate and arid conditions',

      purpose:
        'Milk + Meat',

      feedingStrategy: [
        'Good-quality forage',
        'Browse',
        'Dry roughage',
        'Mineral supplementation',
        'Reliable water access'
      ],

      note:
        'Environment and forage quality strongly influence requirements.'
    },


    lactating: {

      label:
        'Lactating',

      referenceWeightKg:
        500,

      dryMatterPercent: {
        min: 2.0,
        max: 3.0
      },

      energy:
        'Increase above maintenance according to milk yield',

      proteinPercent: {
        min: 10,
        max: 14
      },

      fibrePercent: {
        min: 28,
        max: 38
      },

      calciumPercent: {
        min: 0.50,
        max: 0.80
      },

      phosphorusPercent: {
        min: 0.30,
        max: 0.45
      },

      saltPercent: {
        min: 0.5,
        max: 1.0
      },

      water:
        'Regular water access; requirement varies with climate',

      purpose:
        'Milk + Meat',

      feedingStrategy: [
        'High-quality forage',
        'Energy supplementation',
        'Protein supplementation',
        'Mineral mixture',
        'Regular water access'
      ],

      note:
        'Adjust according to milk yield, body condition, forage and climate.'
    },


    pregnancy: {

      label:
        'Late Pregnancy',

      referenceWeightKg:
        450,

      dryMatterPercent: {
        min: 1.5,
        max: 2.5
      },

      energy:
        'Maintenance + pregnancy allowance',

      proteinPercent: {
        min: 10,
        max: 13
      },

      fibrePercent: {
        min: 30,
        max: 40
      },

      calciumPercent: {
        min: 0.50,
        max: 0.75
      },

      phosphorusPercent: {
        min: 0.30,
        max: 0.45
      },

      saltPercent: {
        min: 0.5,
        max: 1.0
      },

      water:
        'Adequate water and forage access',

      purpose:
        'Milk + Meat',

      feedingStrategy: [
        'Adequate forage',
        'Moderate concentrate supplementation',
        'Mineral mixture',
        'Regular water',
        'Avoid abrupt feed changes'
      ],

      note:
        'Pregnancy stage should be considered when adjusting the ration.'
    }

  }

};


/*
=========================================================
HELPER: GET AVAILABLE STAGES FOR SPECIES
=========================================================
*/

export const getNutritionStages =
  (
    species: string
  ) => {

    const speciesData =
      NUTRITION_DATA[
        species
      ];

    if (!speciesData) {
      return [];
    }

    return Object.entries(
      speciesData
    ).map(
      ([key, value]) => ({
        key,
        label:
          value.label
      })
    );
  };


/*
=========================================================
HELPER: GET NUTRITION PROFILE
=========================================================
*/

export const getNutritionProfile =
  (
    species: string,
    stage: string
  ) => {

    return (
      NUTRITION_DATA[
        species
      ]?.[
        stage
      ] || null
    );
  };


/*
=========================================================
HELPER: CALCULATE DRY MATTER KG / DAY
=========================================================
*/

export const calculateDryMatter =
  (
    weightKg: number,
    nutrition:
      NutritionStage
  ) => {

    if (
      !nutrition
        .dryMatterPercent
    ) {

      return null;
    }


    const min =
      weightKg *
      (
        nutrition
          .dryMatterPercent
          .min /
        100
      );


    const max =
      weightKg *
      (
        nutrition
          .dryMatterPercent
          .max /
        100
      );


    return {
      min:
        Number(
          min.toFixed(2)
        ),

      max:
        Number(
          max.toFixed(2)
        )
    };
  };