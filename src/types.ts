export type ScreenId =
  | 'landing'
  | 'auth'
  | 'launch'
  | 'sign-in'
  | 'register'
  | 'verify-otp'
  | 'forgot-password'
  | 'dashboard'
  | 'farmer-dashboard'
  | 'farm-management'
  | 'farms'
  | 'livestock'
  | 'animal-detail'
  | 'record-treatment'
  | 'mrl'
  | 'lab-result'
  | 'amu'
  | 'stewardship'
  | 'early-detection'
  | 'alerts'
  | 'veterinary-review'
  | 'veterinary-case'
  | 'analytics'
  | 'reports'
  | 'ai-assistant'
  | 'settings'
  | 'admin-dashboard';

export type UserRole =
  | 'farmer'
  | 'veterinarian';

export type AppRole =
  | 'livestock_owner'
  | 'veterinarian'
  | 'laboratory'
  | 'government_official'
  | 'collector'
  | 'pharmaceutical_retailer'
  | 'admin';

export type DemoViewRole =
  | 'livestock_owner'
  | 'veterinarian'
  | 'laboratory'
  | 'government_official'
  | 'collector'
  | 'pharmaceutical_retailer';

export type KycStatus =
  | 'not_started'
  | 'pending'
  | 'verified'
  | 'rejected';

export interface AuthUser {
  id: string;
  fullName: string;
  mobileNumber: string;
  role: AppRole;
  address?: string;
  pincode?: string;
  kycStatus: KycStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  badge: string;
  farmOrDistrict: string;
  avatarUrl: string;
}

export type HealthStatus =
  | 'Healthy'
  | 'Monitoring'
  | 'Under Treatment'
  | 'High Risk'
  | 'Pending Review';

export type WithdrawalStatus =
  | 'None'
  | 'Active'
  | 'Clear';

export interface Animal {
  id: string;
  tag: string;
  name?: string;

  species:
    | 'Cattle'
    | 'Buffalo'
    | 'Goat'
    | 'Sheep'
    | 'Pig'
    | 'Chicken'
    | 'Duck'
    | 'Camel';

  breed: string;
  gender: 'Female' | 'Male';
  age: string;
  weight: number;
  farmName: string;
  farmId: string;
  healthStatus: HealthStatus;
  withdrawalStatus: WithdrawalStatus;
  withdrawalDaysLeft?: number;
  clearanceDate?: string;
  lastTreatmentDate?: string;
  lastTreatmentDrug?: string;
  lastTreatmentType?: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  imageUrl: string;
}

export interface TreatmentRecord {
  id: string;
  animalId: string;
  animalTag: string;
  species: string;
  condition: string;
  drug: string;
  activeIngredient: string;

  category:
    | 'Antibiotic'
    | 'Vaccine'
    | 'Anti-inflammatory'
    | 'Parasiticide';

  dosage: string;
  doseValue: number;

  doseUnit:
    | 'ml'
    | 'mg'
    | 'bolus';

  route: string;
  frequency: string;
  startDate: string;
  endDate: string;
  lastDoseDate: string;
  withdrawalDays: number;
  clearanceDate: string;
  veterinarian: string;
  vetRegNumber: string;

  status:
    | 'Active'
    | 'Cleared'
    | 'Pending Review';

  notes?: string;
  symptoms?: string;
}

export interface AlertItem {
  id: string;

  type:
    | 'critical'
    | 'warning'
    | 'action_required'
    | 'review_required';

  title: string;
  description: string;
  animalId: string;
  animalTag?: string;
  farm: string;
  timestamp: string;
  recommendedAction: string;
  actionButtonLabel: string;
  reviewed?: boolean;
}

export interface VetCaseTimelineEntry {
  id: string;
  timestamp: string;
  title: string;
  description: string;

  type:
    | 'diagnosis'
    | 'treatment'
    | 'alert'
    | 'escalation';
}

export interface AntimicrobialHistoryEntry {
  id: string;
  drug: string;
  activeIngredient: string;
  doseRoute: string;
  date: string;
  vet: string;
  isHpCia: boolean;
}

export interface VeterinaryCase {
  id: string;
  animalId: string;
  tag: string;
  species: string;
  breed: string;
  age: string;
  weight: number;
  farmName: string;

  riskLevel:
    | 'Low'
    | 'Medium'
    | 'High';

  primaryConcern: string;
  lastTreatment: string;
  lastTreatmentDate: string;
  withdrawalStatus: string;
  withdrawalDaysLeft: number;
  stewardshipImpact: string;
  imageUrl: string;
  timeline: VetCaseTimelineEntry[];
  antimicrobialHistory: AntimicrobialHistoryEntry[];
}