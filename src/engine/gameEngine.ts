import { StudentProfile, PuzzleScenario, PuzzleChoice, EvaluationResult } from '../types';

export class GameEngine {
  /**
   * Pure deterministic evaluation of a player's choice against a scenario.
   */
  static evaluateChoice(
    profile: StudentProfile,
    scenario: PuzzleScenario,
    choice: PuzzleChoice,
    language: 'en' | 'hi' | 'te' = 'en'
  ): { updatedProfile: StudentProfile; result: EvaluationResult } {
    const isVeryBad = choice.tier === 'very_bad';
    const isPassed = !isVeryBad;

    const newWallet = Math.max(0, profile.walletBalance + choice.financialImpact.walletDelta);
    const newEmergency = Math.max(0, profile.emergencyFund + choice.financialImpact.emergencyDelta);
    const newScore = Math.max(0, profile.totalScore + choice.financialImpact.scoreDelta);

    const completed = new Set(profile.completedCityIds);
    const failed = new Set(profile.failedCityIds);

    if (isPassed) {
      completed.add(scenario.cityId);
      failed.delete(scenario.cityId);
    } else {
      failed.add(scenario.cityId);
    }

    const updatedProfile: StudentProfile = {
      ...profile,
      walletBalance: newWallet,
      emergencyFund: newEmergency,
      totalScore: newScore,
      completedCityIds: Array.from(completed),
      failedCityIds: Array.from(failed),
      lastActiveAt: Date.now(),
    };

    const result: EvaluationResult = {
      scenarioId: scenario.id,
      choiceId: choice.id,
      tier: choice.tier,
      isPassed,
      isRecoveryNeeded: isVeryBad,
      financialImpact: choice.financialImpact,
      feedback: choice.pedagogicalFeedback[language] || choice.pedagogicalFeedback.en,
    };

    return { updatedProfile, result };
  }

  /**
   * Check if a city is unlocked based on predecessor requirements.
   */
  static isCityUnlocked(cityId: string, requiredPredecessorId?: string, completedCityIds: string[] = []): boolean {
    if (!requiredPredecessorId) return true;
    return completedCityIds.includes(requiredPredecessorId);
  }

  /**
   * Calculate student financial health score (0 to 100).
   */
  static calculateHealthIndex(profile: StudentProfile): number {
    const savingsRatio = Math.min(1, profile.emergencyFund / 2000); // target ₹2,000 emergency
    const scoreRatio = Math.min(1, profile.totalScore / 1000);
    return Math.round((savingsRatio * 0.5 + scoreRatio * 0.5) * 100);
  }
}
