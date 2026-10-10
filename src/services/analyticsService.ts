import { NgoAnalyticsOverview, DecisionEvent, LearningPillar, PillarMastery } from '../types';
import { EventLogger } from '../engine/eventLogger';
import { CITIES } from '../data/regions';

export class AnalyticsService {
  /**
   * Generates aggregated metrics across all recorded student sessions for NGO partner evaluation.
   */
  static getOverview(): NgoAnalyticsOverview {
    const events: DecisionEvent[] = EventLogger.loadEvents();

    const uniqueStudents = new Set(events.map((e) => e.studentId));
    const uniqueSessions = new Set(events.map((e) => e.sessionId));
    const failedEvents = events.filter((e) => e.isFailedState);
    const passedEvents = events.filter((e) => !e.isFailedState);

    // Calculate recovery rate: what fraction of failed scenarios were later passed on a retry?
    let recoveredCount = 0;
    const failedScenariosByStudent = new Map<string, Set<string>>();

    for (const fail of failedEvents) {
      if (!failedScenariosByStudent.has(fail.studentId)) {
        failedScenariosByStudent.set(fail.studentId, new Set());
      }
      failedScenariosByStudent.get(fail.studentId)!.add(fail.scenarioId);
    }

    failedScenariosByStudent.forEach((scenarios, studentId) => {
      scenarios.forEach((scenarioId) => {
        const subsequentPass = events.some(
          (e) => e.studentId === studentId && e.scenarioId === scenarioId && !e.isFailedState && e.isRetry
        );
        if (subsequentPass) recoveredCount++;
      });
    });

    const totalFailedScenarios = Array.from(failedScenariosByStudent.values()).reduce(
      (sum, set) => sum + set.size,
      0
    );

    const overallRecoveryRate =
      totalFailedScenarios > 0 ? Math.round((recoveredCount / totalFailedScenarios) * 100) : 100;

    // Pillar breakdown
    const pillars: LearningPillar[] = ['budget', 'save', 'invest', 'safety'];
    const pillarBreakdown = {} as Record<LearningPillar, PillarMastery>;

    for (const pillar of pillars) {
      const pEvents = events.filter((e) => e.pillar === pillar);
      const pBest = pEvents.filter((e) => e.tier === 'best').length;
      const pFailed = pEvents.filter((e) => e.isFailedState).length;
      const total = pEvents.length;

      pillarBreakdown[pillar] = {
        pillar,
        totalAttempts: total,
        bestAttempts: pBest,
        failedAttempts: pFailed,
        masteryPercentage: total > 0 ? Math.round((pBest / total) * 100) : 0,
      };
    }

    // City failure hotspots
    const cityFailMap: Record<string, number> = {};
    for (const fail of failedEvents) {
      cityFailMap[fail.cityId] = (cityFailMap[fail.cityId] || 0) + 1;
    }

    const cityHotspots = Object.entries(cityFailMap)
      .map(([cityId, failCount]) => ({
        cityId,
        cityName: CITIES[cityId]?.name || cityId,
        failCount,
      }))
      .sort((a, b) => b.failCount - a.failCount);

    return {
      totalUniqueStudents: uniqueStudents.size,
      totalSessions: uniqueSessions.size,
      totalCompletedScenarios: passedEvents.length,
      totalFailedStates: failedEvents.length,
      overallRecoveryRate,
      pillarBreakdown,
      cityHotspots,
      recentEvents: events.slice(-10).reverse(),
    };
  }
}
