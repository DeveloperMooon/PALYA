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
  | 'settings';

export type UserRole = 'farmer' | 'veterinarian';

export type AppRole =
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
  species: 'Cattle' | 'Buffalo' | 'Goat' | 'Sheep';
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
  doseUnit: 'ml' | 'mg' | 'bolus';

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

// ---------------------------------------------------------
// ALERT ITEM
// Smart Alerts screen aur App.tsx (handleAddTreatment) mein
// jo alert object banta hai, uska shape yahi hai.
// ---------------------------------------------------------
export interface AlertItem {
  id: string;

  // Alert kitna serious hai — SmartAlertsScreen isi se
  // icon/color/filter decide karta hai
  type: 'critical' | 'warning' | 'action_required' | 'review_required';

  title: string;
  description: string;

  animalId: string;

  // App.tsx ke andar new alert banate waqt animalTag bhi use hota hai,
  // lekin mockData ke purane alerts mein ye field nahi hai —
  // isliye optional (?) rakha hai
  animalTag?: string;

  farm: string;
  timestamp: string;

  recommendedAction: string;
  actionButtonLabel: string;

  // User ne alert ko "Acknowledge/Reviewed" kiya ya nahi
  // (optional — jab tak review na ho, ye undefined/false rahega)
  reviewed?: boolean;
}


// ---------------------------------------------------------
// VETERINARY CASE — TIMELINE ENTRY
// Ek case ke andar timeline ka ek single step (chhota part)
// ---------------------------------------------------------
export interface VetCaseTimelineEntry {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'diagnosis' | 'treatment' | 'alert' | 'escalation';
}


// ---------------------------------------------------------
// VETERINARY CASE — ANTIMICROBIAL HISTORY ENTRY
// Case ke andar purani antimicrobial doses ki history
// ---------------------------------------------------------
export interface AntimicrobialHistoryEntry {
  id: string;
  drug: string;
  activeIngredient: string;
  doseRoute: string;
  date: string;
  vet: string;

  // HP-CIA = Highest Priority Critically Important Antimicrobial
  // (special high-risk category ka flag)
  isHpCia: boolean;
}


// ---------------------------------------------------------
// VETERINARY CASE (main case object)
// VeterinaryCaseScreen aur VeterinaryReviewScreen isko use karte hain
// ---------------------------------------------------------
export interface VeterinaryCase {
  id: string;
  animalId: string;
  tag: string;
  species: string;
  breed: string;
  age: string;
  weight: number;
  farmName: string;

  riskLevel: 'Low' | 'Medium' | 'High';

  primaryConcern: string;
  lastTreatment: string;
  lastTreatmentDate: string;

  withdrawalStatus: string;
  withdrawalDaysLeft: number;

  // Iske exact values fixed nahi hain (Negative, Moderate, etc.)
  // isliye abhi plain string rakha hai — future mein tight kar sakte hain
  stewardshipImpact: string;

  imageUrl: string;

  timeline: VetCaseTimelineEntry[];
  antimicrobialHistory: AntimicrobialHistoryEntry[];
}