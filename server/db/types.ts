import { FinancialImpact, LearningPillar, ChoiceTier } from '../../src/types/puzzles';

export type UserRole = 'student' | 'ngo_staff' | 'admin';

export interface DbOrganization {
  id: string;
  name: string;
  code: string;
  createdAt: number;
}

export interface DbUser {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  organizationId: string;
  name: string;
  studentId?: string; // set if role === 'student'
  avatar?: string;
  createdAt: number;
  lastLoginAt: number;
}

export interface DbStudentProfile {
  studentId: string;
  userId: string;
  organizationId: string;
  preferredLanguage: 'en' | 'hi' | 'te';
  scholarshipStipend: number;
  walletBalance: number;
  emergencyFund: number;
  totalScore: number;
  currentRegionId: string;
  currentCityId: string;
  completedCityIds: string[];
  failedCityIds: string[];
  completedScenarioIds: string[];
  badges: string[];
  savedWorldState: {
    cityId: string;
    x: number;
    y: number;
    direction: 'up' | 'down' | 'left' | 'right';
  } | null;
  createdAt: number;
  lastActiveAt: number;
}

export interface DbSession {
  id: string;
  userId: string;
  studentId?: string;
  role: UserRole;
  startedAt: number;
  endedAt: number | null;
}

export type GameEventType =
  | 'session_start'
  | 'session_end'
  | 'city_enter'
  | 'challenge_start'
  | 'challenge_complete'
  | 'decision'
  | 'hint_requested'
  | 'bankruptcy_reset'
  | 'milestone_unlocked';

export interface DbGameEvent {
  eventId: string;
  studentId: string;
  organizationId: string;
  sessionId: string;
  eventType: GameEventType;
  scenarioId?: string;
  choiceId?: string;
  tier?: ChoiceTier;
  pillar?: LearningPillar;
  walletBefore?: number;
  walletAfter?: number;
  emergencyBefore?: number;
  emergencyAfter?: number;
  financialImpact?: FinancialImpact;
  isFailedState?: boolean;
  isRetry?: boolean;
  retryAttemptNumber?: number;
  hintsUsed?: number;
  feedbackShown?: string;
  language?: string;
  timeSpentMs?: number;
  metadata?: Record<string, any>;
  timestamp: number;
}

export interface DatabaseSchema {
  organizations: DbOrganization[];
  users: DbUser[];
  studentProfiles: DbStudentProfile[];
  sessions: DbSession[];
  gameEvents: DbGameEvent[];
}
