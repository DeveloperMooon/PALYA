import React, { useState, useEffect } from 'react';

import {
  ScreenId,
  Animal,
  TreatmentRecord,
  UserRole
} from './types';

import {
  INITIAL_ANIMALS,
  INITIAL_TREATMENTS,
  INITIAL_ALERTS,
  INITIAL_VET_CASES
} from './data/mockData';

type AlertItem = typeof INITIAL_ALERTS[number];
type VeterinaryCase = typeof INITIAL_VET_CASES[number];

// API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { authService } from './services/authService';

// Components
import { SideNavBar } from './components/Navigation/SideNavBar';
import { TopAppBar } from './components/Navigation/TopAppBar';
import { BottomNavBar } from './components/Navigation/BottomNavBar';
import { ScanTagModal } from './components/Modals/ScanTagModal';
import {
  LaunchScreenTransition,
  LaunchStage
} from './components/Launch/LaunchScreenTransition';

// Screens
import { LandingScreen } from './components/Screens/LandingScreen';
import { AuthScreen } from './components/Screens/AuthScreen';
import { FarmerDashboard } from './components/Screens/FarmerDashboard';
import { AMUDashboardScreen } from './components/Screens/AMUDashboardScreen';
import { StewardshipScoreScreen } from './components/Screens/StewardshipScoreScreen';
import { ExplainableRiskScreen } from './components/Screens/ExplainableRiskScreen';
import { SmartAlertsScreen } from './components/Screens/SmartAlertsScreen';
import { VeterinaryReviewScreen } from './components/Screens/VeterinaryReviewScreen';
import { VeterinaryCaseScreen } from './components/Screens/VeterinaryCaseScreen';
import { MRLWithdrawalScreen } from './components/Screens/MRLWithdrawalScreen';
import { LivestockScreen } from './components/Screens/LivestockScreen';
import { EarlyDetectionScreen } from './components/Screens/EarlyDetectionScreen';
import { AnimalDetailScreen } from './components/Screens/AnimalDetailScreen';
import { FarmManagementScreen } from './components/Screens/FarmManagementScreen';
import { RecordTreatmentScreen } from './components/Screens/RecordTreatmentScreen';
import { LabResultScreen } from './components/Screens/LabResultScreen';
import { AIAssistantScreen } from './components/Screens/AIAssistantScreen';


const AUTH_SCREENS: ScreenId[] = [
  'sign-in',
  'register',
  'verify-otp',
  'forgot-password',
  'auth'
];

function AppContent() {
  const { user, authStatus, logout } = useAuth();

  const [launchStage, setLaunchStage] =
    useState<LaunchStage>('splash');

  const [isScanModalOpen, setIsScanModalOpen] =
    useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  // Determine initial screen before splash finishes
  // so no flashing occurs
  //
  // FIX: pehle yahan ek tootha hua "=> { ... }" block latka hua tha
  // jo useState() ke turant baad, bina kisi function se juda hue, likha
  // tha — ye invalid JavaScript syntax thi aur isi wajah se poori app
  // compile hi nahi ho pa rahi thi (LandingScreen bilkul sahi tha).
  // Neeche do useEffect (URL hash sync + auth guard) already yehi kaam
  // sambhal lete hain, isliye ye simple useState hi kaafi hai.
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('landing');

  const [userRole, setUserRole] =
    useState<UserRole>(() => {
      const existing =
        authService.getAuthenticatedUser();

      return existing?.role === 'veterinarian'
        ? 'veterinarian'
        : 'farmer';
    });

  // Core Reactive States
  const [animals, setAnimals] =
    useState<Animal[]>(INITIAL_ANIMALS);

    useEffect(() => {
const loadAnimals = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/animals`);

    if (!response.ok) {
      throw new Error('Failed to fetch animals');
    }

    const data = await response.json();

    const mappedAnimals: Animal[] = data.map((animal: any) => ({
      id: animal.animal_id,
      tag: animal.tag || animal.animal_id,
      name: animal.name,
      species: animal.species,
      breed: animal.breed,
      gender: animal.gender,
      age: animal.age,
      weight: Number(animal.weight) || 0,
      farmName: animal.farm_name,
      farmId: animal.farm_id,
      healthStatus: animal.health_status,
      withdrawalStatus: animal.withdrawal_status,
      withdrawalDaysLeft: animal.withdrawal_days,
      clearanceDate: animal.clearance_date,
      lastTreatmentDate: animal.last_treatment_date,
      lastTreatmentDrug: animal.last_treatment_drug,
      lastTreatmentType: animal.last_treatment_type,
      riskLevel: animal.risk_level,
      imageUrl: animal.image_url || INITIAL_ANIMALS.find(
  (a) => a.id === animal.animal_id
)?.imageUrl,
    }));

    setAnimals(mappedAnimals);
    console.log('Animals loaded from Supabase:', mappedAnimals);
  } catch (error) {
    console.error('Failed to load animals:', error);
  }
};

  loadAnimals();
}, []);

  const [treatments, setTreatments] =
    useState<TreatmentRecord[]>(INITIAL_TREATMENTS);

  const [alerts, setAlerts] =
    useState<AlertItem[]>(INITIAL_ALERTS);

  const [vetCases, setVetCases] =
    useState<VeterinaryCase[]>(INITIAL_VET_CASES);

  const [selectedAnimal, setSelectedAnimal] =
    useState<Animal | null>(INITIAL_ANIMALS[0]);

  const [selectedVetCase, setSelectedVetCase] =
    useState<VeterinaryCase>(INITIAL_VET_CASES[0]);

  // Sync role perspective if user object updates
  useEffect(() => {
    if (user?.role === 'veterinarian') {
      setUserRole('veterinarian');
    }
  }, [user]);

  // Sync URL hash with currentScreen
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.hash = `#/${currentScreen}`;
    }
  }, [currentScreen]);

  // Guard protected routes against unauthenticated access
  useEffect(() => {
    if (authStatus === 'loading') return;

    const isAuthRoute =
      AUTH_SCREENS.includes(currentScreen);

    const isPublicRoute =
      currentScreen === 'landing' ||
      currentScreen === 'launch';

    if (
      authStatus === 'unauthenticated' &&
      !isAuthRoute &&
      !isPublicRoute
    ) {
      setCurrentScreen('sign-in');
    } else if (
      authStatus === 'authenticated' &&
      isAuthRoute
    ) {
      setCurrentScreen('dashboard');
    }
  }, [authStatus, currentScreen]);

  // =========================================================
  // BACKEND WITHDRAWAL SYNC
  // =========================================================
  useEffect(() => {
    const syncCOW024Withdrawal = async () => {
      try {
       const response = await fetch(
  `${API_BASE_URL}/api/withdrawal/COW-024`
);

        if (!response.ok) {
          console.error(
            'Withdrawal API failed:',
            response.status
          );
          return;
        }

        const data = await response.json();

        console.log(
          'COW-024 withdrawal synced:',
          data
        );

        // Update animal data
        setAnimals((prev) =>
          prev.map((animal) =>
            animal.id === 'COW-024'
              ? {
                  ...animal,

                  withdrawalStatus:
                    data.status === 'Cleared'
                      ? 'Clear'
                      : 'Active',

                  withdrawalDaysLeft:
                    data.daysLeft,

                  clearanceDate:
                    data.clearanceDate
                }
              : animal
          )
        );

        // Update treatment data
        setTreatments((prev) =>
          prev.map((treatment) =>
            treatment.animalId === 'COW-024'
              ? {
                  ...treatment,

                  withdrawalDays:
                    data.withdrawalDays,

                  clearanceDate:
                    data.clearanceDate,

                  lastDoseDate:
                    data.lastDoseDate,

                  status:
                    data.status === 'Cleared'
                      ? 'Cleared'
                      : 'Active'
                }
              : treatment
          )
        );

        // Update currently selected animal
        setSelectedAnimal((prev) =>
          prev?.id === 'COW-024'
            ? {
                ...prev,

                withdrawalStatus:
                  data.status === 'Cleared'
                    ? 'Clear'
                    : 'Active',

                withdrawalDaysLeft:
                  data.daysLeft,

                clearanceDate:
                  data.clearanceDate
              }
            : prev
        );
      } catch (error) {
        console.error(
          'Failed to sync withdrawal status:',
          error
        );
      }
    };

    syncCOW024Withdrawal();
  }, []);

  // =========================================================
  // HANDLERS
  // =========================================================

  const handleNavigate = (screen: ScreenId) => {
    if (screen === 'launch') {
      setLaunchStage('splash');
      return;
    }

    setCurrentScreen(screen);
    setIsMobileMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleToggleRole = () => {
    const nextRole =
      userRole === 'farmer'
        ? 'veterinarian'
        : 'farmer';

    setUserRole(nextRole);

    if (nextRole === 'veterinarian') {
      setCurrentScreen('veterinary-review');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentScreen('sign-in');
    setIsMobileMenuOpen(false);
  };

  const handleSelectAnimal = (animal: Animal) => {
    setSelectedAnimal(animal);
    setCurrentScreen('animal-detail');
  };

  const handleSelectVetCase = (
    vetCase: VeterinaryCase
  ) => {
    setSelectedVetCase(vetCase);
    setCurrentScreen('veterinary-case');
  };
const handleCreateVetCaseFromDetection = (
  animal: Animal,
  condition: string,
  risk: 'Low' | 'Medium' | 'High',
  symptoms: string[]
) => {
  const template = INITIAL_VET_CASES[0];

  const newCase = {
    ...template,

    id: `VET-${Date.now()}`,

    animalId: animal.id,
    animalTag: animal.tag || animal.id,
    farm: animal.farmName,

    riskLevel: risk,

    title: condition,
    condition: condition,
    suspectedCondition: condition,

    symptoms: symptoms,

    description:
      `Early detection screening flagged ${condition}. ` +
      `Observed symptoms: ${symptoms.join(', ')}.`,

    status: 'Pending Review',

    timeline: [
      {
        id: `tl-${Date.now()}`,
        timestamp: 'Just now',
        title: 'Early Detection Alert Generated',
        description:
          `${condition} suspected based on symptoms: ${symptoms.join(', ')}.`,
        type: 'escalation'
      },
      ...(template.timeline || [])
    ]
  } as VeterinaryCase;

  setVetCases((prev) => [
    newCase,
    ...prev
  ]);

  setSelectedVetCase(newCase);

  setCurrentScreen('veterinary-review');
};
  const handleApproveCase = (
    caseId: string
  ) => {
    setVetCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              riskLevel: 'Medium',
              stewardshipImpact: 'Moderate',
              timeline: [
                ...c.timeline,
                {
                  id: `tl-${Date.now()}`,
                  timestamp: 'Just now',
                  title:
                    'Veterinary Action Signed & Dispatched',
                  description:
                    'AST diagnostic requested. Direct order dispatched to farm manager.',
                  type: 'escalation'
                }
              ]
            }
          : c
      )
    );
  };

  const handleRecordTreatmentForAnimal = (
    animal: Animal
  ) => {
    setSelectedAnimal(animal);
    setCurrentScreen('record-treatment');
  };

  const handleAddTreatment = (
    newTrt: TreatmentRecord
  ) => {
    setTreatments((prev) => [
      newTrt,
      ...prev
    ]);

    setAnimals((prev) =>
      prev.map((a) =>
        a.id === newTrt.animalId
          ? {
              ...a,
              withdrawalStatus: 'Active',
              withdrawalDaysLeft:
                newTrt.withdrawalDays,
              healthStatus: 'Under Treatment',
              lastTreatmentDrug:
                newTrt.drug,
              lastTreatmentDate:
                newTrt.startDate
            }
          : a
      )
    );

    if (newTrt.withdrawalDays > 0) {
      const newAlert: AlertItem = {
        id: `alert-${Date.now()}`,
        type: 'critical',
        title:
          'Active Withdrawal Clock Started',
        animalId: newTrt.animalId,
        animalTag: newTrt.animalTag,
        farm: 'Shiv Dairy Farm',
        description:
          `Medication ${newTrt.drug} administered. Milk and meat withholding mandatory until ${newTrt.clearanceDate}.`,
        recommendedAction:
          'Tag animal with red collar and isolate from bulk milk tank.',
        timestamp: 'Just now',
        reviewed: false,
        actionButtonLabel:
          'View MRL Status'
      };

      setAlerts((prev) => [
        newAlert,
        ...prev
      ]);
    }
  };

const handleRegisterAnimal = async (newAnimal: Animal) => {
  console.log('REGISTER HANDLER CALLED');
  try {
    const response = await fetch(`${API_BASE_URL}/api/animals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        animal_id: newAnimal.id,
        species: newAnimal.species,
        breed: newAnimal.breed,
        farm_id: newAnimal.farmId,
        name: newAnimal.name,
        gender: newAnimal.gender,
        age: newAnimal.age,
        weight: newAnimal.weight,
        farm_name: newAnimal.farmName,
        health_status: newAnimal.healthStatus,
        withdrawal_status: newAnimal.withdrawalStatus,
        withdrawal_days: newAnimal.withdrawalDaysLeft,
        clearance_date: newAnimal.clearanceDate,
        last_treatment_date: newAnimal.lastTreatmentDate,
        last_treatment_drug: newAnimal.lastTreatmentDrug,
        last_treatment_type: newAnimal.lastTreatmentType,
        risk_level: newAnimal.riskLevel,
        image_url: newAnimal.imageUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to register animal');
    }

    const savedAnimal = await response.json();

    setAnimals((prev) => [newAnimal, ...prev]);
    setSelectedAnimal(newAnimal);
    setCurrentScreen('animal-detail');

    console.log('Animal saved to Supabase:', savedAnimal);
  } catch (error) {
    console.error('Animal registration failed:', error);
    alert('Failed to register animal. Please try again.');
  }
};

const handleMarkAlertReviewed = (alertId: string) => {
  setAlerts((prev) =>
    prev.map((a) =>
      a.id === alertId
        ? {
            ...a,
            reviewed: !a.reviewed,
          }
        : a
    )
  );
};

const handleTagScanned = (tag: string) => {
  const found = animals.find(
    (a) =>
      a.tag === tag ||
      a.id === tag
  );

  if (found) {
    setSelectedAnimal(found);
    setCurrentScreen('animal-detail');
  } else {
    setCurrentScreen('livestock');
  }
};

  const handleAdvanceToReady = () => {
    setLaunchStage('ready');

    const existing =
      authService.getAuthenticatedUser();

    if (existing) {
      if (
        AUTH_SCREENS.includes(
          currentScreen
        )
      ) {
        setCurrentScreen('dashboard');
      }
    } else {
      if (
        currentScreen !== 'landing'
      ) {
        setCurrentScreen('sign-in');
      }
    }
  };

  const isAuthScreen =
    AUTH_SCREENS.includes(
      currentScreen
    );

  const unreadAlertsCount =
    alerts.filter(
      (a) => !a.reviewed
    ).length;

  return (
    <div className="min-h-screen bg-surface flex antialiased text-on-surface">

      {/* Launch Screen Transition */}
      <LaunchScreenTransition
        stage={launchStage}
        onAdvanceToReady={
          handleAdvanceToReady
        }
        onSkip={
          handleAdvanceToReady
        }
      />

      {/* 1. Public Marketing Landing Screen */}
      {currentScreen === 'landing' && (
        <div className="w-full">
          <LandingScreen
            onNavigate={
              handleNavigate
            }
          />
        </div>
      )}

      {/* 2. Authentication Flow Screens */}
      {isAuthScreen && (
        <div className="w-full">
          <AuthScreen
            currentScreen={
              currentScreen
            }
            onNavigate={
              handleNavigate
            }
            onSuccess={() =>
              handleNavigate(
                'dashboard'
              )
            }
            onBackToLanding={() =>
              handleNavigate(
                'landing'
              )
            }
          />
        </div>
      )}

      {/* 3. Main Dashboard Platform Shell */}
      {!isAuthScreen &&
        currentScreen !== 'landing' && (
          <>
            {/* Desktop Fixed Side Navigation */}
            <SideNavBar
              currentScreen={
                currentScreen
              }
              onNavigate={
                handleNavigate
              }
              onScanTagClick={() =>
                setIsScanModalOpen(
                  true
                )
              }
              userRole={userRole}
              onToggleRole={
                handleToggleRole
              }
              alertCount={
                unreadAlertsCount
              }
              authUser={user}
              onLogout={
                handleLogout
              }
            />

            {/* Mobile Drawer Overlay */}
            {isMobileMenuOpen && (
              <SideNavBar
                isMobileDrawer={true}
                onClose={() =>
                  setIsMobileMenuOpen(
                    false
                  )
                }
                currentScreen={
                  currentScreen
                }
                onNavigate={
                  handleNavigate
                }
                onScanTagClick={() =>
                  setIsScanModalOpen(
                    true
                  )
                }
                userRole={userRole}
                onToggleRole={
                  handleToggleRole
                }
                alertCount={
                  unreadAlertsCount
                }
                authUser={user}
                onLogout={
                  handleLogout
                }
              />
            )}
            
{/*
{currentScreen === 'ai-assistant' && (
  <AIAssistantScreen />
)}
*/}


            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:pl-64 min-w-0 pb-16 lg:pb-0">

              {/* Top App Bar */}
              <TopAppBar
                currentScreen={
                  currentScreen
                }
                onNavigate={
                  handleNavigate
                }
                onScanTagClick={() =>
                  setIsScanModalOpen(
                    true
                  )
                }
                userRole={userRole}
                onToggleRole={
                  handleToggleRole
                }
                alertCount={
                  unreadAlertsCount
                }
                onOpenMobileMenu={() =>
                  setIsMobileMenuOpen(
                    true
                  )
                }
                onReplayLaunch={() =>
                  setLaunchStage(
                    'splash'
                  )
                }
                authUser={user}
                onLogout={
                  handleLogout
                }
              />

              {/* Dynamic Screen Viewport */}
              <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">

                {/* Dashboard */}
                {(currentScreen ===
                  'dashboard' ||
                  currentScreen ===
                    'farmer-dashboard') && (
                  <FarmerDashboard
                    onNavigate={
                      handleNavigate
                    }
                    onOpenScanModal={() =>
                      setIsScanModalOpen(
                        true
                      )
                    }
                    onSelectAnimal={
                      handleSelectAnimal
                    }
                    animals={animals}
                    treatments={
                      treatments
                    }
                    alerts={alerts}

                    userRole={userRole}
                  />
                )}

                {/* AMU */}
                {currentScreen ===
                  'amu' && (
                  <AMUDashboardScreen />
                )}

                {/* Stewardship */}
                {currentScreen ===
                  'stewardship' && (
                  <StewardshipScoreScreen
                    onNavigate={
                      handleNavigate
                    }
                  />
                )}

                {/* Analytics */}
                {currentScreen ===
                  'analytics' && (
                  <ExplainableRiskScreen
                    onNavigate={
                      handleNavigate
                    }
                    onSelectAnimal={
                      handleSelectAnimal
                    }
                    animals={animals}
                  />
                )}

                                {/* Alerts */}
                {currentScreen ===
                  'alerts' && (
                  <SmartAlertsScreen
                    onNavigate={
                      handleNavigate
                    }
                    onSelectAnimal={
                      handleSelectAnimal
                    }
                    animals={animals}
                  />
                )}

  {/* Veterinary Review */}
{currentScreen === 'veterinary-review' && (
  <VeterinaryReviewScreen
    cases={vetCases}
    onSelectCase={handleSelectVetCase}
    onNavigate={handleNavigate}
  />
)}

                {/* Veterinary Case */}
                {currentScreen ===
                  'veterinary-case' && (
                  <VeterinaryCaseScreen
                    vetCase={
                      selectedVetCase
                    }
                    onNavigate={
                      handleNavigate
                    }
                    onApproveCase={
                      handleApproveCase
                    }
                  />
                )}

                                {/* MRL */}
                {currentScreen ===
                  'mrl' && (
                  <MRLWithdrawalScreen
                    animals={animals}
                    onNavigate={handleNavigate}
                  />
                )}

                {/* Livestock */}
                {currentScreen ===
                  'livestock' && (
                  <LivestockScreen
                    animals={animals}
                    onSelectAnimal={
                      handleSelectAnimal
                    }
                    onNavigate={
                      handleNavigate
                    }
                    onRegisterAnimal={
                      handleRegisterAnimal
                    }
                  />
                )}


                {/* Early Detection */}
                {currentScreen ===
                  'early-detection' && (
                  <EarlyDetectionScreen
                    animals={animals}
                    onSelectAnimal={
                      handleSelectAnimal
                    }
                    onNavigate={
                      handleNavigate
                    }
                  />
                )}

                {/* Animal Detail */}
                {currentScreen ===
                  'animal-detail' &&
                  selectedAnimal && (
                    <AnimalDetailScreen
                      animal={
                        selectedAnimal
                      }
                      treatments={
                        treatments
                      }
                      onNavigate={
                        handleNavigate
                      }
                      onRecordTreatmentForAnimal={
                        handleRecordTreatmentForAnimal
                      }
                    />
                  )}

                {/* Farm Management */}
                {(currentScreen ===
                  'farm-management' ||
                  currentScreen ===
                    'farms') && (
                  <FarmManagementScreen
                    animals={animals}
                    onSelectAnimal={
                      handleSelectAnimal
                    }
                    onNavigate={
                      handleNavigate
                    }
                  />
                )}

                {/* Record Treatment */}
                {currentScreen ===
                  'record-treatment' && (
                  <RecordTreatmentScreen
                    animals={animals}
                    onAddTreatment={
                      handleAddTreatment
                    }
                    onNavigate={
                      handleNavigate
                    }
                    selectedAnimal={
                      selectedAnimal
                    }
                  />
                )}

                                {/* Lab Result */}
                {currentScreen ===
                  'lab-result' && (
                  <LabResultScreen
                    onNavigate={
                      handleNavigate
                    }
                  />
                )}

                {/* AI Assistant */}
{currentScreen ===
  'ai-assistant' && (
  <AIAssistantScreen />
)}

              </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <BottomNavBar
              currentScreen={
                currentScreen
              }
              onNavigate={
                handleNavigate
              }
              onScanTagClick={() =>
                setIsScanModalOpen(
                  true
                )
              }
              onOpenMobileMenu={() =>
                setIsMobileMenuOpen(
                  true
                )
              }
              alertCount={
                unreadAlertsCount
              }
            />

            {/* Global RFID / Ear Tag Scanner */}
            <ScanTagModal
              isOpen={
                isScanModalOpen
              }
              onClose={() =>
                setIsScanModalOpen(
                  false
                )
              }
              animals={animals}
              onTagScanned={
                handleTagScanned
              }
              onSelectAnimalForMrl={(
                animal
              ) => {
                setSelectedAnimal(
                  animal
                );
                setCurrentScreen(
                  'mrl'
                );
              }}
              onSelectAnimalForTreatment={(
                animal
              ) => {
                setSelectedAnimal(
                  animal
                );
                setCurrentScreen(
                  'record-treatment'
                );
              }}
            />
          </>
        )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}