import { LearningPillar, ChoiceTier, FinancialImpact } from './puzzles';

export interface AiExplanationRequest {
  scenarioTitle: string;
  scenarioContext: string;
  pillar: LearningPillar;
  chosenOptionText: string;
  tier: ChoiceTier;
  financialImpact: FinancialImpact;
  language: 'en' | 'hi' | 'te';
}

export interface AiExplanationResponse {
  explanation: string;
  pedagogicalTakeaway: string;
  relatableHyderabadStudentContext: string;
  encouragingTip: string;
  isAiGenerated: boolean; // false if fallback dictionary used
}

export interface AiHintRequest {
  scenarioTitle: string;
  pillar: LearningPillar;
  language: 'en' | 'hi' | 'te';
}

export interface AiHintResponse {
  hint: string;
  isAiGenerated: boolean;
}
