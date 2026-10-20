export type GameLanguage = 'en' | 'hi' | 'te';

export type CharacterGender = 'boy' | 'girl';

export type GameScreen = 'landing' | 'auth' | 'character_select' | 'prologue' | 'world' | 'puzzle' | 'ngo_dashboard';

export interface StudentProfile {
  studentId: string; // e.g. "STU-1042"
  sessionId: string;
  preferredLanguage: GameLanguage;
  characterGender?: CharacterGender;
  isNewUser?: boolean;
  scholarshipStipend: number; // monthly ₹5,000
  walletBalance: number;
  emergencyFund: number;
  totalScore: number;
  currentRegionId: string;
  currentCityId: string;
  completedCityIds: string[];
  failedCityIds: string[];
  completedScenarioIds?: string[];
  badges: string[];
  createdAt: number;
  lastActiveAt: number;
}

export interface GameNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  title: string;
  message: string;
  timestamp: number;
}
