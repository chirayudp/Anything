export type LearningPillar = 'budget' | 'save' | 'invest' | 'safety';

export type ChoiceTier = 'best' | 'better' | 'good' | 'very_bad';

export interface FinancialImpact {
  walletDelta: number; // e.g. -1500
  emergencyDelta: number; // e.g. +500
  scoreDelta: number; // e.g. +100
  stressDelta: number; // -10 to +30
}

export interface PuzzleChoice {
  id: string;
  text: Record<'en' | 'hi' | 'te', string>;
  tier: ChoiceTier;
  outcomeDescription: Record<'en' | 'hi' | 'te', string>;
  financialImpact: FinancialImpact;
  pedagogicalFeedback: Record<'en' | 'hi' | 'te', string>;
  educationalVideoTitle?: string;
  educationalVideoUrl?: string;
}

export interface PuzzleScenario {
  id: string;
  cityId: string;
  pillar: LearningPillar;
  title: Record<'en' | 'hi' | 'te', string>;
  subtitle: Record<'en' | 'hi' | 'te', string>;
  situationContext: Record<'en' | 'hi' | 'te', string>;
  stipendContext: string;
  educationalHint: Record<'en' | 'hi' | 'te', string>;
  choices: PuzzleChoice[];
}

export interface EvaluationResult {
  scenarioId: string;
  choiceId: string;
  tier: ChoiceTier;
  isPassed: boolean;
  isRecoveryNeeded: boolean;
  financialImpact: FinancialImpact;
  feedback: string;
  aiExplanation?: string;
}
