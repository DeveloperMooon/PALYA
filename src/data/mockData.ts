import { Animal, TreatmentRecord, AlertItem, VeterinaryCase, UserProfile } from '../types';

export const INITIAL_ANIMALS: Animal[] = [
  {
    id: 'COW-024',
    tag: 'UK-72819-331',
    name: 'Gauri',
    species: 'Cattle',
    breed: 'Holstein Friesian',
    gender: 'Female',
    age: '4 years',
    weight: 420,
    farmName: 'Shiv Dairy Farm / North Pasture',
    farmId: 'FARM-UP-001',
    healthStatus: 'Healthy',
    withdrawalStatus: 'Active',
    withdrawalDaysLeft: 5,
    clearanceDate: '23 Aug 2026',
    lastTreatmentDate: '18 Aug 2026',
    lastTreatmentDrug: 'Betamox LA (Amoxicillin)',
    lastTreatmentType: 'Antibiotic Trt.',
    riskLevel: 'High',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRRJj8UZB51z5h--D5VVitBu3aO1RulRQEwJTH7ZgBicUJQfsRT8lmc6uDzTt6Ud9IIe_T2tGQMePOUoWB_BeAHVEXp0iJ6gk6633gPHTEXvQO47ksiOwNye9EJZQzjsynK4A29iNAloGocmJVbnDK6PuNIU1o8OCjzn76fUnVjEDMR0mSchAbZPjwO_5CKJo94kbtBf7cdYiVmEquM97AsJwKHRZe88kbIFUXglq7NrstOExJnG8NzA'
  },
  {
    id: 'COW-018',
    tag: 'UK-72819-332',
    name: 'Nandini',
    species: 'Cattle',
    breed: 'Gir',
    gender: 'Female',
    age: '5 years',
    weight: 390,
    farmName: 'Shiv Dairy Farm',
    farmId: 'FARM-UP-001',
    healthStatus: 'Monitoring',
    withdrawalStatus: 'Active',
    withdrawalDaysLeft: 2,
    clearanceDate: '20 Aug 2026',
    lastTreatmentDate: '16 Aug 2026',
    lastTreatmentDrug: 'Penicillin G',
    lastTreatmentType: 'Recurring Mastitis',
    riskLevel: 'Medium',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYTT8ocHZYqXuYh4LgRY2vCPEJ7-iFO_CG4T1T0w97OhGh3QHlvQxgdDdNR6E5UAi0tZIvlxIMzOTHkgj71SRj0YBMNgzQMjU1bq9qQxh7vQuG5n32M48ERZmWMx93mmyYXFhaDfMV1Z90BBj2NhOwmBWBRswCwawr6qV0xAmYueLG3JY0hf3lKhwt02G6JrgZOuWsYVOoMtiZn8cmTg20txZWKeHzBIIhJbfRBP-BSCaAj-a5O3hgkw'
  },
  {
    id: 'BUF-011',
    tag: 'TAG-B456',
    name: 'Kalu',
    species: 'Buffalo',
    breed: 'Murrah Buffalo',
    gender: 'Male',
    age: '6 years',
    weight: 520,
    farmName: 'Valley Farm',
    farmId: 'FARM-UP-002',
    healthStatus: 'Healthy',
    withdrawalStatus: 'None',
    withdrawalDaysLeft: 0,
    lastTreatmentDate: '10 Jul 2026',
    lastTreatmentDrug: 'Dewormer (Albendazole)',
    lastTreatmentType: 'Parasite Ctl.',
    riskLevel: 'Low',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuuRK4rFyXwff0uv7zDLFipzawi5Pc__cx8hbuFPlOEc76VaZccmuKTpVsJc9OqEyMC32VaLZijxEvfWRoO0VBR9MikF6C7IQxDOyJwgpyJPq0t1Ie5hKPKh-7ALRUISVhoxiDzQnRnS005ok0dACgFqb2SnAc6Bmi3PIz5f1pvTPIckv2ZTocZwlgCk-A5XdevWdvq7dawzuhbF9Coo-o_LYHtzxwxp-an_GqVP_Jy_t9WqjCjo1Ahw'
  },
  {
    id: 'COW-021',
    tag: 'TAG-C021',
    name: 'Ganga',
    species: 'Cattle',
    breed: 'Holstein',
    gender: 'Female',
    age: '3 years',
    weight: 410,
    farmName: 'Shiv Dairy Farm',
    farmId: 'FARM-UP-001',
    healthStatus: 'Healthy',
    withdrawalStatus: 'None',
    withdrawalDaysLeft: 0,
    lastTreatmentDate: '12 Oct 2023',
    lastTreatmentDrug: 'FMD Vaccine',
    lastTreatmentType: 'Routine Vax',
    riskLevel: 'Low',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAScl4jPd8yHNdv6KVbNKt9MwsgxcEpQvq2Oj1Jwct3dBCFPNFT9n_pn1jkAWVK9_okxHobhi5JfBPuwzoWvSP96p25d04sO5Yd5p4KtdsA4OsYRaJ74-r2IlNB9ap8Mnm94UeOq8Y8bJHlp5h2t1Uil90N2mVLmeFOjMYATnqILLVJPosXFU2eDoV6tJt8fm5l3m_hSafAV6_u8c-sO0-XAt0MG6_g6MwL2mDNKMwe6mRYji0B_LcLUA'
  },
  {
    id: 'COW-032',
    tag: 'TAG-C032',
    name: 'Sona',
    species: 'Cattle',
    breed: 'Holstein',
    gender: 'Female',
    age: '4.5 years',
    weight: 430,
    farmName: 'Shiv Dairy Farm',
    farmId: 'FARM-UP-001',
    healthStatus: 'Pending Review',
    withdrawalStatus: 'Clear',
    withdrawalDaysLeft: 0,
    lastTreatmentDate: '01 Nov 2023',
    lastTreatmentDrug: 'Electrolytes + Ca',
    lastTreatmentType: 'Observation',
    riskLevel: 'Low',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOmPJHmLdZdIPiS_tsEE79-2j4erdnRQETztpwbedhWJWsJKD03S5wONaXrk4HhQW84UR4hJF89sEXqkQ1UirlOxNxW-eCTfMzZS-7qUWAxQ4u6SHFmF9mNmzIHgn5BgOdARkI-fFx7SX6qDKomARcsM0WDVbctv8TMk59KFgpaBfZQ1_zuCX06ZpzeRPhBITQ_vdtcG1XsbLBku8lz-6pbxX4ksGbmp7DXH8-7b8zJlEwFFcpHileXQ'
  },
  {
    id: 'COW-055',
    tag: 'TAG-C055',
    name: 'Radha',
    species: 'Cattle',
    breed: 'Holstein',
    gender: 'Female',
    age: '5 years',
    weight: 445,
    farmName: 'Shiv Dairy Farm',
    farmId: 'FARM-UP-001',
    healthStatus: 'Healthy',
    withdrawalStatus: 'Clear',
    withdrawalDaysLeft: 0,
    lastTreatmentDate: '15 Aug 2023',
    lastTreatmentDrug: 'Multivitamin',
    lastTreatmentType: 'Supportive',
    riskLevel: 'Low',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAScl4jPd8yHNdv6KVbNKt9MwsgxcEpQvq2Oj1Jwct3dBCFPNFT9n_pn1jkAWVK9_okxHobhi5JfBPuwzoWvSP96p25d04sO5Yd5p4KtdsA4OsYRaJ74-r2IlNB9ap8Mnm94UeOq8Y8bJHlp5h2t1Uil90N2mVLmeFOjMYATnqILLVJPosXFU2eDoV6tJt8fm5l3m_hSafAV6_u8c-sO0-XAt0MG6_g6MwL2mDNKMwe6mRYji0B_LcLUA'
  },
  {
    id: 'GOAT-018',
    tag: 'TAG-G018',
    name: 'Champa',
    species: 'Goat',
    breed: 'Beetal',
    gender: 'Female',
    age: '2.5 years',
    weight: 48,
    farmName: 'Meadow Brook / East Range',
    farmId: 'FARM-UP-003',
    healthStatus: 'Under Treatment',
    withdrawalStatus: 'Clear',
    withdrawalDaysLeft: 0,
    lastTreatmentDate: '10 days ago',
    lastTreatmentDrug: 'Penicillin',
    lastTreatmentType: 'Antibiotic',
    riskLevel: 'Medium',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgaElCwzbrFz4GbnVhlMAUhXWBVyJV8Ok1RK37aYqHMTLdW7704htq0Lb6Knlh5KCFdtGYb_jZsFck96i9VYFXJeAK9CiULkmAlod1pY6JHPvlVjpF_y7aFElMpaDxSIqyaMvEVg3jD7nfatG6H05Q8ql4eMQ9_QhmsPyTQyS26LUcGYImMdsUvw-fLkXRXTpTpZ5FAqMkDZ0ax11JqH4vrR2H9Ok5vh85MnmdjgAwF43cgHlgl6KO0Q'
  },
  {
    id: 'BULL-005',
    tag: 'TAG-BL005',
    name: 'Sultan',
    species: 'Cattle',
    breed: 'Angus',
    gender: 'Male',
    age: '5 years',
    weight: 680,
    farmName: 'Shiv Dairy Farm',
    farmId: 'FARM-UP-001',
    healthStatus: 'Healthy',
    withdrawalStatus: 'Clear',
    withdrawalDaysLeft: 0,
    lastTreatmentDate: 'Sep 28, 2023',
    lastTreatmentDrug: 'Ivermectin',
    lastTreatmentType: 'Parasite Ctl.',
    riskLevel: 'Low',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuuRK4rFyXwff0uv7zDLFipzawi5Pc__cx8hbuFPlOEc76VaZccmuKTpVsJc9OqEyMC32VaLZijxEvfWRoO0VBR9MikF6C7IQxDOyJwgpyJPq0t1Ie5hKPKh-7ALRUISVhoxiDzQnRnS005ok0dACgFqb2SnAc6Bmi3PIz5f1pvTPIckv2ZTocZwlgCk-A5XdevWdvq7dawzuhbF9Coo-o_LYHtzxwxp-an_GqVP_Jy_t9WqjCjo1Ahw'
  }
];

export const INITIAL_TREATMENTS: TreatmentRecord[] = [
  {
    id: 'TRT-2026-001',
    animalId: 'COW-024',
    animalTag: 'UK-72819-331',
    species: 'Cattle',
    condition: 'Clinical Mastitis',
    drug: 'Betamox LA',
    activeIngredient: 'Amoxicillin (as Trihydrate)',
    category: 'Antibiotic',
    dosage: '15 mg/kg',
    doseValue: 15,
    doseUnit: 'mg',
    route: 'Intramuscular (IM)',
    frequency: 'Once daily',
    startDate: '2026-08-16',
    endDate: '2026-08-18',
    lastDoseDate: '2026-08-18',
    withdrawalDays: 5,
    clearanceDate: '2026-08-23',
    veterinarian: 'Dr. Suresh Kumar',
    vetRegNumber: 'VET-4521',
    status: 'Active',
    notes: 'Severe swelling in right hind quarter. Initiated intramuscular therapy.',
    symptoms: 'Swelling, fever, altered milk secretion'
  },
  {
    id: 'TRT-2026-002',
    animalId: 'COW-018',
    animalTag: 'UK-72819-332',
    species: 'Cattle',
    condition: 'Subclinical Mastitis',
    drug: 'Penicillin G Procaine',
    activeIngredient: 'Benzylpenicillin',
    category: 'Antibiotic',
    dosage: '10 mg/kg',
    doseValue: 10,
    doseUnit: 'mg',
    route: 'Intramuscular (IM)',
    frequency: 'Once daily',
    startDate: '2026-08-14',
    endDate: '2026-08-16',
    lastDoseDate: '2026-08-16',
    withdrawalDays: 4,
    clearanceDate: '2026-08-20',
    veterinarian: 'Dr. Suresh Kumar',
    vetRegNumber: 'VET-4521',
    status: 'Active',
    notes: 'Recurrent mild mastitis. Somatic cell count > 400k.'
  },
  {
    id: 'TRT-2023-088',
    animalId: 'COW-012',
    animalTag: 'COW-012',
    species: 'Cattle',
    condition: 'Respiratory Infection',
    drug: 'Amoxicillin',
    activeIngredient: 'Amoxicillin Trihydrate',
    category: 'Antibiotic',
    dosage: '15 mg/kg',
    doseValue: 15,
    doseUnit: 'mg',
    route: 'Intramuscular (IM)',
    frequency: 'Once daily',
    startDate: '2023-10-17',
    endDate: '2023-10-20',
    lastDoseDate: '2023-10-20',
    withdrawalDays: 7,
    clearanceDate: '2023-10-27',
    veterinarian: 'Dr. Smith',
    vetRegNumber: 'VET-12345',
    status: 'Active'
  },
  {
    id: 'TRT-2023-089',
    animalId: 'SHP-045',
    animalTag: 'SHP-045',
    species: 'Sheep',
    condition: 'Foot Rot',
    drug: 'Oxytetracycline',
    activeIngredient: 'Oxytetracycline HCl',
    category: 'Antibiotic',
    dosage: '20 mg/kg',
    doseValue: 20,
    doseUnit: 'mg',
    route: 'Intramuscular (IM)',
    frequency: 'Single Dose',
    startDate: '2023-10-18',
    endDate: '2023-10-18',
    lastDoseDate: '2023-10-18',
    withdrawalDays: 14,
    clearanceDate: '2023-11-01',
    veterinarian: 'Dr. Smith',
    vetRegNumber: 'VET-12345',
    status: 'Cleared'
  },
  {
    id: 'TRT-2023-090',
    animalId: 'COW-088',
    animalTag: 'COW-088',
    species: 'Cattle',
    condition: 'Bacterial Enteritis',
    drug: 'Penicillin G',
    activeIngredient: 'Penicillin G Sodium',
    category: 'Antibiotic',
    dosage: '10 mg/kg',
    doseValue: 10,
    doseUnit: 'mg',
    route: 'Intravenous (IV)',
    frequency: 'Twice daily',
    startDate: '2023-10-12',
    endDate: '2023-10-15',
    lastDoseDate: '2023-10-15',
    withdrawalDays: 5,
    clearanceDate: '2023-10-20',
    veterinarian: 'Dr. Suresh Kumar',
    vetRegNumber: 'VET-4521',
    status: 'Cleared'
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'ALT-001',
    type: 'critical',
    title: 'Withdrawal Active',
    description: 'Prevent food-chain use. Animal is currently under an active withdrawal period following treatment.',
    animalId: 'COW-024',
    farm: 'North Pasture',
    timestamp: 'Today, 09:41 AM',
    recommendedAction: 'Quarantine immediately and verify electronic tags.',
    actionButtonLabel: 'View Details'
  },
  {
    id: 'ALT-002',
    type: 'warning',
    title: 'Repeated Antimicrobial Use',
    description: '3 treatments recorded in the last 30 days. Consider alternative interventions.',
    animalId: 'COW-024',
    farm: 'North Pasture',
    timestamp: 'Yesterday',
    recommendedAction: 'Review treatment history with primary veterinarian.',
    actionButtonLabel: 'View Details'
  },
  {
    id: 'ALT-003',
    type: 'action_required',
    title: 'Missing Treatment Information',
    description: 'Incomplete record for recent antibiotic administration. Dosage missing.',
    animalId: 'BUF-011',
    farm: 'Valley Farm',
    timestamp: 'Oct 24, 2023',
    recommendedAction: 'Update record to comply with regulatory standards.',
    actionButtonLabel: 'Update Record'
  },
  {
    id: 'ALT-004',
    type: 'review_required',
    title: 'Veterinary Review Needed',
    description: 'High-risk treatment pattern detected based on recent herd health data inputs.',
    animalId: 'GOAT-018',
    farm: 'East Range',
    timestamp: 'Oct 22, 2023',
    recommendedAction: 'Schedule mandatory checkup and sign-off by official vet.',
    actionButtonLabel: 'View Details'
  }
];

export const PRIORITY_VET_CASES: VeterinaryCase[] = [
  {
    id: 'CASE-COW-024',
    animalId: 'COW-024',
    tag: 'UK-72819-331',
    species: 'Cow',
    breed: 'Holstein Friesian',
    age: '4y',
    weight: 420,
    farmName: 'Oakridge Farms',
    riskLevel: 'High',
    primaryConcern: '3 antimicrobial treatments in 30 days',
    lastTreatment: 'Oxytetracycline',
    lastTreatmentDate: '2 days ago',
    withdrawalStatus: 'Active',
    withdrawalDaysLeft: 14,
    stewardshipImpact: 'Negative',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOKglXtUl4UbD8BB2x-AAt4ZW2dQAFn-I8nSZCP6_WZiuvesMXqtSkQhUk0gfW0iNqW7MvOLePH3rVNvQS1QCatcB-SWVVpcOjQAiFXMzKVOmOobZHboYvzvDYG5LdR_JVN_1CFe81wvr-McGsIcqQZPsEW7ytT00_Us0aaPf9GO7fuG5Ytj2aTDuuaQKqO8fohNkUn7c98wVD6PzNPHK3kfdW6Lac7EY3zwvDkjewaTPbKznf3v7aHg',
    timeline: [
      {
        id: 'T1',
        timestamp: '12 Aug 2026, 09:00',
        title: 'Diagnosis: Suspected Mastitis',
        description: 'Elevated somatic cell count detected during routine milking.',
        type: 'diagnosis'
      },
      {
        id: 'T2',
        timestamp: '12 Aug 2026, 11:30',
        title: 'Initial Treatment Administered',
        description: 'Cefquinome (Cephalosporin) administered intramammary. 3 tubes prescribed.',
        type: 'treatment'
      },
      {
        id: 'T3',
        timestamp: '15 Aug 2026, 08:15',
        title: 'Repeated Treatment / Alert Triggered',
        description: 'Symptoms persisted. Additional course requested. System triggered HP-CIA (Highest Priority Critically Important Antimicrobial) overuse alert.',
        type: 'alert'
      },
      {
        id: 'T4',
        timestamp: '15 Aug 2026, 08:20',
        title: 'Escalated to Veterinary Review',
        description: 'Case pending your review for treatment protocol authorization.',
        type: 'escalation'
      }
    ],
    antimicrobialHistory: [
      {
        id: 'H1',
        drug: 'Cobactan',
        activeIngredient: 'Cefquinome (4th Gen Ceph)',
        doseRoute: '1 tube (IM)',
        date: '12 Aug 2026',
        vet: 'Dr. Smith',
        isHpCia: true
      },
      {
        id: 'H2',
        drug: 'PenStrep',
        activeIngredient: 'Penicillin/Streptomycin',
        doseRoute: '15ml (IM)',
        date: '04 Jan 2026',
        vet: 'Dr. Jones',
        isHpCia: false
      },
      {
        id: 'H3',
        drug: 'Engemycin',
        activeIngredient: 'Oxytetracycline',
        doseRoute: '20ml (IM)',
        date: '18 Nov 2025',
        vet: 'Dr. Smith',
        isHpCia: false
      }
    ]
  },
  {
    id: 'CASE-GOAT-018',
    animalId: 'GOAT-018',
    tag: 'TAG-G018',
    species: 'Goat',
    breed: 'Beetal',
    age: '2.5y',
    weight: 48,
    farmName: 'Meadow Brook',
    riskLevel: 'Medium',
    primaryConcern: 'Increasing antimicrobial usage',
    lastTreatment: 'Penicillin',
    lastTreatmentDate: '10 days ago',
    withdrawalStatus: 'Cleared',
    withdrawalDaysLeft: 0,
    stewardshipImpact: 'Moderate',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgaElCwzbrFz4GbnVhlMAUhXWBVyJV8Ok1RK37aYqHMTLdW7704htq0Lb6Knlh5KCFdtGYb_jZsFck96i9VYFXJeAK9CiULkmAlod1pY6JHPvlVjpF_y7aFElMpaDxSIqyaMvEVg3jD7nfatG6H05Q8ql4eMQ9_QhmsPyTQyS26LUcGYImMdsUvw-fLkXRXTpTpZ5FAqMkDZ0ax11JqH4vrR2H9Ok5vh85MnmdjgAwF43cgHlgl6KO0Q',
    timeline: [
      {
        id: 'T1',
        timestamp: '03 Aug 2026, 14:00',
        title: 'Lameness & Joint Swelling Observation',
        description: 'Caprine arthritis encephalitis symptoms suspected.',
        type: 'diagnosis'
      },
      {
        id: 'T2',
        timestamp: '04 Aug 2026, 10:00',
        title: 'Penicillin G Administration',
        description: '5 ml intramuscular course for 3 days.',
        type: 'treatment'
      },
      {
        id: 'T3',
        timestamp: '14 Aug 2026, 09:00',
        title: 'Withdrawal Clearance Reached',
        description: 'Completed 10 days post last injection. Ready for review.',
        type: 'escalation'
      }
    ],
    antimicrobialHistory: [
      {
        id: 'H1',
        drug: 'Procaine Penicillin',
        activeIngredient: 'Penicillin G',
        doseRoute: '5ml (IM)',
        date: '04 Aug 2026',
        vet: 'Dr. Suresh Kumar',
        isHpCia: false
      },
      {
        id: 'H2',
        drug: 'Alamycin LA',
        activeIngredient: 'Oxytetracycline',
        doseRoute: '4ml (SC)',
        date: '12 May 2026',
        vet: 'Dr. Suresh Kumar',
        isHpCia: false
      }
    ]
  }
];

export const MRL_DATABASE = [
  {
    drug: 'Betamox LA',
    activeIngredient: 'Amoxicillin (as Trihydrate)',
    species: 'Cattle',
    mrl: 0.050,
    unit: 'mg/kg',
    detectedResidue: 0.020,
    withdrawalDays: 5,
    route: 'Intramuscular (IM)',
    standardDose: 15,
    regulatoryBasis: 'EU MRLs / National Directive',
    lastUpdated: '12 Aug 2026'
  },
  {
    drug: 'Cobactan 2.5%',
    activeIngredient: 'Cefquinome',
    species: 'Cattle',
    mrl: 0.020,
    unit: 'mg/kg',
    detectedResidue: 0.035,
    withdrawalDays: 7,
    route: 'Intramuscular (IM)',
    standardDose: 2.5,
    regulatoryBasis: 'HP-CIA Category B Restrict',
    lastUpdated: '12 Aug 2026'
  },
  {
    drug: 'Alamycin LA',
    activeIngredient: 'Oxytetracycline',
    species: 'Cattle',
    mrl: 0.100,
    unit: 'mg/kg',
    detectedResidue: 0.045,
    withdrawalDays: 14,
    route: 'Intramuscular (IM)',
    standardDose: 20,
    regulatoryBasis: 'National Regulatory Database',
    lastUpdated: '12 Aug 2026'
  }
];

export const INITIAL_VET_CASES = PRIORITY_VET_CASES;

export const MOCK_USER_FARMER: UserProfile = {
  id: 'usr-farmer-01',
  name: 'Rajesh Kumar',
  role: 'farmer',
  title: 'Dairy Producer',
  badge: 'Certified Herd Manager',
  farmOrDistrict: 'Shiv Dairy Farm (Meerut)',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRRJj8UZB51z5h--D5VVitBu3aO1RulRQEwJTH7ZgBicUJQfsRT8lmc6uDzTt6Ud9IIe_T2tGQMePOUoWB_BeAHVEXp0iJ6gk6633gPHTEXvQO47ksiOwNye9EJZQzjsynK4A29iNAloGocmJVbnDK6PuNIU1o8OCjzn76fUnVjEDMR0mSchAbZPjwO_5CKJo94kbtBf7cdYiVmEquM97AsJwKHRZe88kbIFUXglq7NrstOExJnG8NzA'
};

export const MOCK_USER_VET: UserProfile = {
  id: 'usr-vet-01',
  name: 'Dr. Suresh Kumar',
  role: 'veterinarian',
  title: 'District Veterinary Officer',
  badge: 'State Animal Health Inspector',
  farmOrDistrict: 'Meerut & Baghpat Zone',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOKglXtUl4UbD8BB2x-AAt4ZW2dQAFn-I8nSZCP6_WZiuvesMXqtSkQhUk0gfW0iNqW7MvOLePH3rVNvQS1QCatcB-SWVVpcOjQAiFXMzKVOmOobZHboYvzvDYG5LdR_JVN_1CFe81wvr-McGsIcqQZPsEW7ytT00_Us0aaPf9GO7fuG5Ytj2aTDuuaQKqO8fohNkUn7c98wVD6PzNPHK3kfdW6Lac7EY3zwvDkjewaTPbKznf3v7aHg'
};
