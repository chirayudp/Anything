export type GameLanguage = 'en' | 'hi' | 'te';

export type GameScreen = 'landing' | 'prologue' | 'world' | 'puzzle' | 'ngo_dashboard';

export interface StudentProfile {
  studentId: string; // e.g. "STU-1042"
  sessionId: string;
  preferredLanguage: GameLanguage;
  scholarshipStipend: number; // monthly ₹5,000
  walletBalance: number;
  emergencyFund: number;
  totalScore: number;
  currentRegionId: string;
  currentCityId: string;
  completedCityIds: string[];
  failedCityIds: string[];
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
