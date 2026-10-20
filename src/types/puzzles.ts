export type LearningPillar = 'budget' | 'save' | 'invest' | 'safety';

export type ChoiceTier = 'best' | 'better' | 'good' | 'bad' | 'very_bad';

export interface FinancialImpact {
  walletDelta: number;
  emergencyDelta: number;
  scoreDelta: number;
  stressDelta: number;
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

export interface PuzzleStep {
  id: string;
  title: Record<'en' | 'hi' | 'te', string>;
  situationContext?: Record<'en' | 'hi' | 'te', string>;
  choices: PuzzleChoice[];
}

export interface IdeaCard {
  title: Record<'en' | 'hi' | 'te', string>;
  points: Record<'en' | 'hi' | 'te', string>[];
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
  ideaCard?: IdeaCard;
  choices?: PuzzleChoice[];
  steps: PuzzleStep[];
}

export interface StepEvaluation {
  stepId: string;
  choiceId: string;
  tier: ChoiceTier;
  points: number;
  financialImpact: FinancialImpact;
}

export interface EvaluationResult {
  scenarioId: string;
  choiceId?: string;
  tier?: ChoiceTier;
  stepResults?: StepEvaluation[];
  totalPoints?: number;
  overallTier?: ChoiceTier;
  isPassed: boolean;
  isRecoveryNeeded: boolean;
  financialImpact: FinancialImpact;
  feedback: string;
  aiExplanation?: string;
}
