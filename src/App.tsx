import React, { useState, useEffect } from 'react';

import {
  ScreenId,
  Animal,
  TreatmentRecord,
  UserRole,
  AppRole,
  DemoViewRole
} from './types';

import {
  INITIAL_ANIMALS,
  INITIAL_TREATMENTS,
  INITIAL_ALERTS,
  INITIAL_VET_CASES
} from './data/mockData';

type AlertItem = typeof INITIAL_ALERTS[number];
type VeterinaryCase = typeof INITIAL_VET_CASES[number];

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

import {
  AuthProvider,
  useAuth
} from './context/AuthContext';

import {
  authService
} from './services/authService';

import {
  SideNavBar
} from './components/Navigation/SideNavBar';

import {
  TopAppBar
} from './components/Navigation/TopAppBar';

import {
  BottomNavBar
} from './components/Navigation/BottomNavBar';

import {
  ScanTagModal
} from './components/Modals/ScanTagModal';

import {
  LaunchScreenTransition,
  LaunchStage
} from './components/Launch/LaunchScreenTransition';

import {
  LandingScreen
} from './components/Screens/LandingScreen';

import {
  AuthScreen
} from './components/Screens/AuthScreen';

import {
  FarmerDashboard
} from './components/Screens/FarmerDashboard';

import {
  AMUDashboardScreen
} from './components/Screens/AMUDashboardScreen';

import {
  StewardshipScoreScreen
} from './components/Screens/StewardshipScoreScreen';

import {
  ExplainableRiskScreen
} from './components/Screens/ExplainableRiskScreen';

import {
  SmartAlertsScreen
} from './components/Screens/SmartAlertsScreen';

import {
  VeterinaryReviewScreen
} from './components/Screens/VeterinaryReviewScreen';

import {
  VeterinaryCaseScreen
} from './components/Screens/VeterinaryCaseScreen';

import {
  MRLWithdrawalScreen
} from './components/Screens/MRLWithdrawalScreen';

import {
  LivestockScreen
} from './components/Screens/LivestockScreen';

import {
  EarlyDetectionScreen
} from './components/Screens/EarlyDetectionScreen';

import {
  AnimalDetailScreen
} from './components/Screens/AnimalDetailScreen';

import {
  FarmManagementScreen
} from './components/Screens/FarmManagementScreen';

import {
  RecordTreatmentScreen
} from './components/Screens/RecordTreatmentScreen';

import {
  LabResultScreen
} from './components/Screens/LabResultScreen';

import {
  AIAssistantScreen
} from './components/Screens/AIAssistantScreen';

import {
  ReportsScreen
} from './components/Screens/ReportsScreen';


const AUTH_SCREENS: ScreenId[] = [
  'sign-in',
  'register',
  'verify-otp',
  'forgot-password',
  'auth'
];


const getDefaultScreenForRole = (
  role?: string
): ScreenId => {

  switch (role) {

    case 'livestock_owner':
      return 'dashboard';

    case 'veterinarian':
      return 'veterinary-review';

    case 'laboratory':
      return 'lab-result';

    case 'government_official':
      return 'reports';

    case 'collector':
      return 'livestock';

    case 'pharmaceutical_retailer':
      return 'amu';

    case 'admin':
      return 'dashboard';

    default:
      return 'dashboard';
  }
};


function AppContent() {

  const {
    user,
    authStatus,
    logout
  } = useAuth();


  const [
    launchStage,
    setLaunchStage
  ] = useState<LaunchStage>(
    'splash'
  );


  const [
    isScanModalOpen,
    setIsScanModalOpen
  ] = useState(false);


  const [
    isMobileMenuOpen,
    setIsMobileMenuOpen
  ] = useState(false);


  const [
    currentScreen,
    setCurrentScreen
  ] = useState<ScreenId>(
    'landing'
  );


  /*
  =====================================================
  ADMIN VIEW ROLE

  Actual authenticated role remains ADMIN.
  Only the interface being viewed changes.
  =====================================================
  */

  const [
    adminViewRole,
    setAdminViewRole
  ] = useState<DemoViewRole>(
    'livestock_owner'
  );


  const isAdmin =
    user?.role === 'admin';


  const effectiveRole:
    AppRole | undefined =
      isAdmin
        ? adminViewRole
        : user?.role;


  /*
  Used by SideNavBar so admin can see the
  navigation menu of the role currently selected.
  */

  const effectiveAuthUser =
    user
      ? {
          ...user,
          role:
            effectiveRole ||
            user.role
        }
      : null;


  /*
  =====================================================
  OLD UI ROLE

  Some existing screens still understand only:
  farmer | veterinarian
  =====================================================
  */

  const [
    userRole,
    setUserRole
  ] = useState<UserRole>(() => {

    const existing =
      authService
        .getAuthenticatedUser();


    return (
      existing?.role ===
      'veterinarian'
        ? 'veterinarian'
        : 'farmer'
    );
  });


  /*
  =====================================================
  DATA
  =====================================================
  */

  const [
    animals,
    setAnimals
  ] = useState<Animal[]>(
    INITIAL_ANIMALS
  );


  const [
    treatments,
    setTreatments
  ] = useState<
    TreatmentRecord[]
  >(
    INITIAL_TREATMENTS
  );


  const [
    alerts,
    setAlerts
  ] = useState<
    AlertItem[]
  >(
    INITIAL_ALERTS
  );


  const [
    vetCases,
    setVetCases
  ] = useState<
    VeterinaryCase[]
  >(
    INITIAL_VET_CASES
  );


  const [
    selectedAnimal,
    setSelectedAnimal
  ] = useState<
    Animal | null
  >(
    INITIAL_ANIMALS[0]
  );


  const [
    selectedVetCase,
    setSelectedVetCase
  ] = useState<
    VeterinaryCase
  >(
    INITIAL_VET_CASES[0]
  );


  /*
  =====================================================
  LOAD ANIMALS
  =====================================================
  */

  useEffect(() => {

    const loadAnimals =
      async () => {

        try {

          const response =
            await fetch(
              `${API_BASE_URL}/api/animals`
            );


          if (!response.ok) {

            throw new Error(
              'Failed to fetch animals'
            );
          }


          const data =
            await response.json();


          const mappedAnimals:
            Animal[] =
              data.map(
                (animal: any) => ({

                  id:
                    animal.animal_id,

                  tag:
                    animal.tag ||
                    animal.animal_id,

                  name:
                    animal.name,

                  species:
                    animal.species,

                  breed:
                    animal.breed,

                  gender:
                    animal.gender,

                  age:
                    animal.age,

                  weight:
                    Number(
                      animal.weight
                    ) || 0,

                  farmName:
                    animal.farm_name,

                  farmId:
                    animal.farm_id,

                  healthStatus:
                    animal.health_status,

                  withdrawalStatus:
                    animal.withdrawal_status,

                  withdrawalDaysLeft:
                    animal.withdrawal_days,

                  clearanceDate:
                    animal.clearance_date,

                  lastTreatmentDate:
                    animal.last_treatment_date,

                  lastTreatmentDrug:
                    animal.last_treatment_drug,

                  lastTreatmentType:
                    animal.last_treatment_type,

                  riskLevel:
                    animal.risk_level,

                  imageUrl:
                    animal.image_url ||
                    INITIAL_ANIMALS
                      .find(
                        (a) =>
                          a.id ===
                          animal.animal_id
                      )
                      ?.imageUrl
                })
              );


          setAnimals(
            mappedAnimals
          );


          console.log(
            'Animals loaded from Supabase:',
            mappedAnimals
          );

        } catch (error) {

          console.error(
            'Failed to load animals:',
            error
          );
        }
      };


    loadAnimals();

  }, []);


  /*
  =====================================================
  SYNC UI ROLE
  =====================================================
  */

  useEffect(() => {

    const roleForUi =
      isAdmin
        ? adminViewRole
        : user?.role;


    setUserRole(
      roleForUi ===
        'veterinarian'
        ? 'veterinarian'
        : 'farmer'
    );

  }, [
    user,
    isAdmin,
    adminViewRole
  ]);


  /*
  =====================================================
  URL HASH
  =====================================================
  */

  useEffect(() => {

    if (
      typeof window !==
      'undefined'
    ) {

      window.location.hash =
        `#/${currentScreen}`;
    }

  }, [
    currentScreen
  ]);


  /*
  =====================================================
  AUTH GUARD
  =====================================================
  */

  useEffect(() => {

    if (
      authStatus ===
      'loading'
    ) {
      return;
    }


    const isAuthRoute =
      AUTH_SCREENS.includes(
        currentScreen
      );


    const isPublicRoute =
      currentScreen ===
        'landing' ||
      currentScreen ===
        'launch';


    if (
      authStatus ===
        'unauthenticated' &&
      !isAuthRoute &&
      !isPublicRoute
    ) {

      setCurrentScreen(
        'sign-in'
      );

      return;
    }


    if (
      authStatus ===
        'authenticated' &&
      isAuthRoute
    ) {

      setCurrentScreen(
        getDefaultScreenForRole(
          isAdmin
            ? adminViewRole
            : user?.role
        )
      );
    }

  }, [
    authStatus,
    currentScreen,
    user?.role,
    isAdmin,
    adminViewRole
  ]);


  /*
  =====================================================
  WITHDRAWAL SYNC
  =====================================================
  */

  useEffect(() => {

    const syncCOW024Withdrawal =
      async () => {

        try {

          const response =
            await fetch(
              `${API_BASE_URL}/api/withdrawal/COW-024`
            );


          if (!response.ok) {

            console.error(
              'Withdrawal API failed:',
              response.status
            );

            return;
          }


          const data =
            await response.json();


          console.log(
            'COW-024 withdrawal synced:',
            data
          );


          setAnimals(
            (prev) =>
              prev.map(
                (animal) =>
                  animal.id ===
                  'COW-024'
                    ? {
                        ...animal,

                        withdrawalStatus:
                          data.status ===
                          'Cleared'
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


          setTreatments(
            (prev) =>
              prev.map(
                (treatment) =>
                  treatment.animalId ===
                  'COW-024'
                    ? {
                        ...treatment,

                        withdrawalDays:
                          data.withdrawalDays,

                        clearanceDate:
                          data.clearanceDate,

                        lastDoseDate:
                          data.lastDoseDate,

                        status:
                          data.status ===
                          'Cleared'
                            ? 'Cleared'
                            : 'Active'
                      }
                    : treatment
              )
          );


          setSelectedAnimal(
            (prev) =>
              prev?.id ===
              'COW-024'
                ? {
                    ...prev,

                    withdrawalStatus:
                      data.status ===
                      'Cleared'
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


  /*
  =====================================================
  NAVIGATION
  =====================================================
  */

  const handleNavigate =
    (
      screen: ScreenId
    ) => {

      if (
        screen ===
        'launch'
      ) {

        setLaunchStage(
          'splash'
        );

        return;
      }


      setCurrentScreen(
        screen
      );


      setIsMobileMenuOpen(
        false
      );


      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };


  /*
  =====================================================
  LEGACY UI ROLE HANDLER

  Kept only because old components still expect
  onToggleRole prop.

  NORMAL USERS ARE NOT GIVEN ADMIN VIEW ACCESS HERE.
  =====================================================
  */

  const handleToggleRole =
    () => {

      if (!isAdmin) {
        return;
      }


      const nextRole:
        DemoViewRole =
          adminViewRole ===
          'veterinarian'
            ? 'livestock_owner'
            : 'veterinarian';


      setAdminViewRole(
        nextRole
      );


      setUserRole(
        nextRole ===
          'veterinarian'
          ? 'veterinarian'
          : 'farmer'
      );


      setCurrentScreen(
        getDefaultScreenForRole(
          nextRole
        )
      );
    };


  /*
  =====================================================
  ADMIN ROLE SWITCHER
  =====================================================
  */

  const handleSelectAdminRole =
    (
      role: AppRole
    ) => {

      if (
        user?.role !==
          'admin' ||
        role ===
          'admin'
      ) {

        return;
      }


      const nextViewRole =
        role as DemoViewRole;


      setAdminViewRole(
        nextViewRole
      );


      setUserRole(
        nextViewRole ===
          'veterinarian'
          ? 'veterinarian'
          : 'farmer'
      );


      setCurrentScreen(
        getDefaultScreenForRole(
          nextViewRole
        )
      );


      setIsMobileMenuOpen(
        false
      );


      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };


  /*
  =====================================================
  LOGOUT
  =====================================================
  */

  const handleLogout =
    () => {

      logout();


      setAdminViewRole(
        'livestock_owner'
      );


      setUserRole(
        'farmer'
      );


      setCurrentScreen(
        'sign-in'
      );


      setIsMobileMenuOpen(
        false
      );
    };


  /*
  =====================================================
  SELECT ANIMAL
  =====================================================
  */

  const handleSelectAnimal =
    (
      animal: Animal
    ) => {

      setSelectedAnimal(
        animal
      );


      setCurrentScreen(
        'animal-detail'
      );
    };


  /*
  =====================================================
  SELECT VET CASE
  =====================================================
  */

  const handleSelectVetCase =
    (
      vetCase:
        VeterinaryCase
    ) => {

      setSelectedVetCase(
        vetCase
      );


      setCurrentScreen(
        'veterinary-case'
      );
    };


  /*
  =====================================================
  CREATE VET CASE
  =====================================================
  */

  const handleCreateVetCaseFromDetection =
    (
      animal: Animal,
      condition: string,
      risk:
        | 'Low'
        | 'Medium'
        | 'High',
      symptoms:
        string[]
    ) => {

      const template =
        INITIAL_VET_CASES[0];


      const newCase = {

        ...template,

        id:
          `VET-${Date.now()}`,

        animalId:
          animal.id,

        animalTag:
          animal.tag ||
          animal.id,

        farm:
          animal.farmName,

        riskLevel:
          risk,

        title:
          condition,

        condition:
          condition,

        suspectedCondition:
          condition,

        symptoms:
          symptoms,

        description:
          `Early detection screening flagged ${condition}. ` +
          `Observed symptoms: ${symptoms.join(', ')}.`,

        status:
          'Pending Review',

        timeline: [

          {
            id:
              `tl-${Date.now()}`,

            timestamp:
              'Just now',

            title:
              'Early Detection Alert Generated',

            description:
              `${condition} suspected based on symptoms: ${symptoms.join(', ')}.`,

            type:
              'escalation'
          },

          ...(
            template.timeline ||
            []
          )
        ]

      } as VeterinaryCase;


      setVetCases(
        (prev) => [
          newCase,
          ...prev
        ]
      );


      setSelectedVetCase(
        newCase
      );


      setCurrentScreen(
        'veterinary-review'
      );
    };


  /*
  =====================================================
  APPROVE CASE
  =====================================================
  */

  const handleApproveCase =
    (
      caseId: string
    ) => {

      setVetCases(
        (prev) =>
          prev.map(
            (c) =>
              c.id ===
              caseId
                ? {
                    ...c,

                    riskLevel:
                      'Medium',

                    stewardshipImpact:
                      'Moderate',

                    timeline: [

                      ...c.timeline,

                      {
                        id:
                          `tl-${Date.now()}`,

                        timestamp:
                          'Just now',

                        title:
                          'Veterinary Action Signed & Dispatched',

                        description:
                          'AST diagnostic requested. Direct order dispatched to farm manager.',

                        type:
                          'escalation'
                      }
                    ]
                  }
                : c
          )
      );
    };


  /*
  =====================================================
  RECORD TREATMENT FOR ANIMAL
  =====================================================
  */

  const handleRecordTreatmentForAnimal =
    (
      animal: Animal
    ) => {

      setSelectedAnimal(
        animal
      );


      setCurrentScreen(
        'record-treatment'
      );
    };


  /*
  =====================================================
  ADD TREATMENT
  =====================================================
  */

  const handleAddTreatment =
    (
      newTrt:
        TreatmentRecord
    ) => {

      setTreatments(
        (prev) => [
          newTrt,
          ...prev
        ]
      );


      setAnimals(
        (prev) =>
          prev.map(
            (a) =>
              a.id ===
              newTrt.animalId
                ? {
                    ...a,

                    withdrawalStatus:
                      'Active',

                    withdrawalDaysLeft:
                      newTrt.withdrawalDays,

                    healthStatus:
                      'Under Treatment',

                    lastTreatmentDrug:
                      newTrt.drug,

                    lastTreatmentDate:
                      newTrt.startDate
                  }
                : a
          )
      );


      if (
        newTrt.withdrawalDays >
        0
      ) {

        const newAlert:
          AlertItem = {

            id:
              `alert-${Date.now()}`,

            type:
              'critical',

            title:
              'Active Withdrawal Clock Started',

            animalId:
              newTrt.animalId,

            animalTag:
              newTrt.animalTag,

            farm:
              'Shiv Dairy Farm',

            description:
              `Medication ${newTrt.drug} administered. ` +
              `Milk and meat withholding mandatory until ${newTrt.clearanceDate}.`,

            recommendedAction:
              'Tag animal with red collar and isolate from bulk milk tank.',

            timestamp:
              'Just now',

            reviewed:
              false,

            actionButtonLabel:
              'View MRL Status'
          };


        setAlerts(
          (prev) => [
            newAlert,
            ...prev
          ]
        );
      }
    };


  /*
  =====================================================
  REGISTER ANIMAL
  =====================================================
  */

  const handleRegisterAnimal =
    async (
      newAnimal: Animal
    ) => {

      console.log(
        'REGISTER HANDLER CALLED'
      );


      try {

        const response =
          await fetch(
            `${API_BASE_URL}/api/animals`,
            {
              method:
                'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body:
                JSON.stringify({

                  animal_id:
                    newAnimal.id,

                  species:
                    newAnimal.species,

                  breed:
                    newAnimal.breed,

                  farm_id:
                    newAnimal.farmId,

                  name:
                    newAnimal.name,

                  gender:
                    newAnimal.gender,

                  age:
                    newAnimal.age,

                  weight:
                    newAnimal.weight,

                  farm_name:
                    newAnimal.farmName,

                  health_status:
                    newAnimal.healthStatus,

                  withdrawal_status:
                    newAnimal.withdrawalStatus,

                  withdrawal_days:
                    newAnimal.withdrawalDaysLeft,

                  clearance_date:
                    newAnimal.clearanceDate,

                  last_treatment_date:
                    newAnimal.lastTreatmentDate,

                  last_treatment_drug:
                    newAnimal.lastTreatmentDrug,

                  last_treatment_type:
                    newAnimal.lastTreatmentType,

                  risk_level:
                    newAnimal.riskLevel,

                  image_url:
                    newAnimal.imageUrl
                })
            }
          );


        if (!response.ok) {

          throw new Error(
            'Failed to register animal'
          );
        }


        const savedAnimal =
          await response.json();


        setAnimals(
          (prev) => [
            newAnimal,
            ...prev
          ]
        );


        setSelectedAnimal(
          newAnimal
        );


        setCurrentScreen(
          'animal-detail'
        );


        console.log(
          'Animal saved to Supabase:',
          savedAnimal
        );

      } catch (error) {

        console.error(
          'Animal registration failed:',
          error
        );


        alert(
          'Failed to register animal. Please try again.'
        );
      }
    };


  /*
  =====================================================
  DELETE ANIMAL FROM UI STATE
  =====================================================
  */

  const handleDeleteAnimal = (
    animalId: string
  ) => {

    setAnimals(
      (prev) =>
        prev.filter(
          (animal) =>
            animal.id !== animalId
        )
    );

    setSelectedAnimal(
      (prev) =>
        prev?.id === animalId
          ? null
          : prev
    );
  };


  /*
  =====================================================
  ALERT REVIEW
  =====================================================
  */

  const handleMarkAlertReviewed =
    (
      alertId: string
    ) => {

      setAlerts(
        (prev) =>
          prev.map(
            (a) =>
              a.id ===
              alertId
                ? {
                    ...a,
                    reviewed:
                      !a.reviewed
                  }
                : a
          )
      );
    };


  /*
  =====================================================
  RFID
  =====================================================
  */

  const handleTagScanned =
    (
      tag: string
    ) => {

      const found =
        animals.find(
          (a) =>
            a.tag ===
              tag ||
            a.id ===
              tag
        );


      if (found) {

        setSelectedAnimal(
          found
        );


        setCurrentScreen(
          'animal-detail'
        );

      } else {

        setCurrentScreen(
          'livestock'
        );
      }
    };


  /*
  =====================================================
  SPLASH COMPLETE
  =====================================================
  */

  const handleAdvanceToReady =
    () => {

      setLaunchStage(
        'ready'
      );


      const existing =
        authService
          .getAuthenticatedUser();


      if (existing) {

        if (
          AUTH_SCREENS.includes(
            currentScreen
          )
        ) {

          const destinationRole =
            existing.role ===
              'admin'
              ? adminViewRole
              : existing.role;


          setCurrentScreen(
            getDefaultScreenForRole(
              destinationRole
            )
          );
        }

      } else {

        if (
          currentScreen !==
          'landing'
        ) {

          setCurrentScreen(
            'sign-in'
          );
        }
      }
    };


  const isAuthScreen =
    AUTH_SCREENS.includes(
      currentScreen
    );


  const unreadAlertsCount =
    alerts.filter(
      (a) =>
        !a.reviewed
    ).length;


  /*
  =====================================================
  RENDER
  =====================================================
  */

  return (

    <div className="min-h-screen bg-surface flex antialiased text-on-surface">


      <LaunchScreenTransition
        stage={
          launchStage
        }

        onAdvanceToReady={
          handleAdvanceToReady
        }

        onSkip={
          handleAdvanceToReady
        }
      />


      {/* LANDING */}

      {currentScreen ===
        'landing' && (

        <div className="w-full">

          <LandingScreen
            onNavigate={
              handleNavigate
            }
          />

        </div>
      )}


      {/* AUTH */}

      {isAuthScreen && (

        <div className="w-full">

          <AuthScreen

            currentScreen={
              currentScreen
            }

            onNavigate={
              handleNavigate
            }

            onSuccess={() => {

              const authenticatedUser =
                authService
                  .getAuthenticatedUser();


              /*
              ===========================================
              ADMIN LOGIN
              ===========================================
              */

              if (
                authenticatedUser
                  ?.role ===
                'admin'
              ) {

                setAdminViewRole(
                  'livestock_owner'
                );


                setUserRole(
                  'farmer'
                );


                handleNavigate(
                  'dashboard'
                );


                return;
              }


              /*
              ===========================================
              NORMAL LOGIN
              ===========================================
              */

              setUserRole(
                authenticatedUser
                  ?.role ===
                'veterinarian'
                  ? 'veterinarian'
                  : 'farmer'
              );


              handleNavigate(
                getDefaultScreenForRole(
                  authenticatedUser
                    ?.role
                )
              );
            }}

            onBackToLanding={() =>
              handleNavigate(
                'landing'
              )
            }
          />

        </div>
      )}


      {/* MAIN APPLICATION */}

      {!isAuthScreen &&
        currentScreen !==
          'landing' && (

        <>


          {/* DESKTOP SIDEBAR */}

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

            userRole={
              userRole
            }

            onToggleRole={
              handleToggleRole
            }

            alertCount={
              unreadAlertsCount
            }

            authUser={
            effectiveAuthUser
          }
          
          isAdminMode={
            isAdmin
          }
          
          onLogout={
            handleLogout
          }
          />


          {/* MOBILE SIDEBAR */}

          {isMobileMenuOpen && (

            <SideNavBar

              isMobileDrawer={
                true
              }

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

              userRole={
                userRole
              }

              onToggleRole={
                handleToggleRole
              }

              alertCount={
                unreadAlertsCount
              }

              authUser={
                effectiveAuthUser
              }
              
              isAdminMode={
                isAdmin
              }
              
              onLogout={
                handleLogout
              }
            />
          )}


          {/* CONTENT */}

          <div className="flex-1 flex flex-col lg:pl-64 min-w-0 pb-16 lg:pb-0">


            {/* TOP BAR */}

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

              userRole={
                userRole
              }

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

              authUser={
                user
              }

              onLogout={
                handleLogout
              }

              onSelectRole={
                isAdmin
                  ? handleSelectAdminRole
                  : undefined
              }
            />


            {/* SCREENS */}

            <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">


              {/* LIVESTOCK OWNER */}

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

                  animals={
                    animals
                  }

                  treatments={
                    treatments
                  }

                  alerts={
                    alerts
                  }

                  userRole={
                    userRole
                  }

                  authUser={
                    user
                  }
                />
              )}


              {/* AMU */}

              {currentScreen ===
                'amu' && (

                <AMUDashboardScreen
  animals={animals}
/>
              )}


              {/* STEWARDSHIP */}

              {currentScreen ===
                'stewardship' && (

                <StewardshipScoreScreen
                  onNavigate={
                    handleNavigate
                  }
                />
              )}


              {/* ANALYTICS */}

              {currentScreen ===
                'analytics' && (

                <ExplainableRiskScreen

                  onNavigate={
                    handleNavigate
                  }

                  onSelectAnimal={
                    handleSelectAnimal
                  }

                  animals={
                    animals
                  }
                />
              )}


              {/* ALERTS */}

              {currentScreen ===
                'alerts' && (

                <SmartAlertsScreen

                  onNavigate={
                    handleNavigate
                  }

                  onSelectAnimal={
                    handleSelectAnimal
                  }

                  animals={
                    animals
                  }
                />
              )}


              {/* VETERINARY REVIEW */}

              {currentScreen ===
                'veterinary-review' && (

                <VeterinaryReviewScreen

                  cases={
                    vetCases
                  }

                  onSelectCase={
                    handleSelectVetCase
                  }

                  onNavigate={
                    handleNavigate
                  }
                />
              )}


              {/* VETERINARY CASE */}

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

                  animals={
                    animals
                  }

                  onNavigate={
                    handleNavigate
                  }
                />
              )}


              {/* LIVESTOCK */}

              {currentScreen ===
                'livestock' && (

                <LivestockScreen

                  animals={
                    animals
                  }

                  onSelectAnimal={
                    handleSelectAnimal
                  }

                  onNavigate={
                    handleNavigate
                  }

                  onRegisterAnimal={
                    handleRegisterAnimal
                  }

                  onDeleteAnimal={
                    handleDeleteAnimal
                  }
                />
              )}


              {/* EARLY DETECTION */}

              {currentScreen ===
                'early-detection' && (

                <EarlyDetectionScreen

                  animals={
                    animals
                  }

                  onSelectAnimal={
                    handleSelectAnimal
                  }

                  onNavigate={
                    handleNavigate
                  }
                />
              )}


              {/* ANIMAL DETAIL */}

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


              {/* FARM MANAGEMENT */}

              {(currentScreen ===
                  'farm-management' ||
                currentScreen ===
                  'farms') && (

                <FarmManagementScreen

                  animals={
                    animals
                  }

                  onSelectAnimal={
                    handleSelectAnimal
                  }

                  onNavigate={
                    handleNavigate
                  }
                />
              )}


              {/* RECORD TREATMENT */}

              {currentScreen ===
                'record-treatment' && (

                <RecordTreatmentScreen

                  animals={
                    animals
                  }

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


              {/* LAB */}

              {currentScreen ===
                'lab-result' && (

                <LabResultScreen
                  onNavigate={
                    handleNavigate
                  }
                />
              )}


              {/* GOVERNMENT */}

              {currentScreen ===
                'reports' && (

                <ReportsScreen />
              )}


              {/* AI ASSISTANT */}

              {currentScreen ===
                'ai-assistant' && (

                <AIAssistantScreen />
              )}

            </main>

          </div>


          {/* MOBILE BOTTOM NAV */}

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


          {/* SCAN MODAL */}

          <ScanTagModal

            isOpen={
              isScanModalOpen
            }

            onClose={() =>
              setIsScanModalOpen(
                false
              )
            }

            animals={
              animals
            }

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