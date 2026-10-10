import { LearningPillar, ChoiceTier, FinancialImpact } from './puzzles';

export interface DecisionEvent {
  eventId: string;
  studentId: string;
  sessionId: string;
  timestamp: number;
  regionId: string;
  cityId: string;
  scenarioId: string;
  choiceId: string;
  tier: ChoiceTier;
  pillar: LearningPillar;
  walletBefore: number;
  walletAfter: number;
  emergencyBefore: number;
  emergencyAfter: number;
  financialImpact: FinancialImpact;
  isFailedState: boolean;
  isRetry: boolean;
  retryAttemptNumber: number;
  feedbackShown: string;
  language: string;
}

export interface PillarMastery {
  pillar: LearningPillar;
  totalAttempts: number;
  bestAttempts: number;
  failedAttempts: number;
  masteryPercentage: number;
}

export interface StudentLearningGap {
  pillar: LearningPillar;
  errorFrequency: number;
  recurringPattern: string;
  recommendedTopic: string;
  resourceTitle: string;
}

export interface NgoAnalyticsOverview {
  totalUniqueStudents: number;
  totalSessions: number;
  totalCompletedScenarios: number;
  totalFailedStates: number;
  overallRecoveryRate: number; // percentage of failed attempts successfully retried
  pillarBreakdown: Record<LearningPillar, PillarMastery>;
  cityHotspots: { cityId: string; cityName: string; failCount: number }[];
  recentEvents: DecisionEvent[];
}
