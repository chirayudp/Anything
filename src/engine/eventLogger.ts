import { DecisionEvent, LearningPillar, StudentLearningGap, ChoiceTier, FinancialImpact } from '../types';

const STORAGE_KEY_EVENTS = 'moneyquest_decision_events';

export class EventLogger {
  private static events: DecisionEvent[] = [];

  static loadEvents(): DecisionEvent[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY_EVENTS);
        if (stored) {
          this.events = JSON.parse(stored);
          return this.events;
        }
      }
    } catch (e) {
      console.warn('Failed to read events from localStorage', e);
    }
    return this.events;
  }

  static recordDecision(params: {
    studentId: string;
    sessionId: string;
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
    feedbackShown: string;
    language: string;
  }): DecisionEvent {
    this.loadEvents();

    const previousAttemptsForScenario = this.events.filter(
      (e) => e.studentId === params.studentId && e.scenarioId === params.scenarioId
    );
    const isRetry = previousAttemptsForScenario.length > 0;
    const retryAttemptNumber = isRetry ? previousAttemptsForScenario.length + 1 : 1;
    const isFailedState = params.tier === 'very_bad';

    const event: DecisionEvent = {
      eventId: `EVT-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      studentId: params.studentId,
      sessionId: params.sessionId,
      timestamp: Date.now(),
      regionId: params.regionId,
      cityId: params.cityId,
      scenarioId: params.scenarioId,
      choiceId: params.choiceId,
      tier: params.tier,
      pillar: params.pillar,
      walletBefore: params.walletBefore,
      walletAfter: params.walletAfter,
      emergencyBefore: params.emergencyBefore,
      emergencyAfter: params.emergencyAfter,
      financialImpact: params.financialImpact,
      isFailedState,
      isRetry,
      retryAttemptNumber,
      feedbackShown: params.feedbackShown,
      language: params.language,
    };

    this.events.push(event);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(this.events));
      }
    } catch (e) {
      console.warn('Failed to persist events to storage', e);
    }

    // Attempt non-blocking background sync to server
    this.syncToServer(event).catch(() => {
      // Gracefully silent; local copy is preserved
    });

    return event;
  }

  private static async syncToServer(event: DecisionEvent): Promise<void> {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch {
      // Offline fallback: events remain in local storage
    }
  }

  /**
   * Identify recurring student learning gaps based on decision patterns.
   */
  static detectLearningGaps(studentId: string): StudentLearningGap[] {
    const studentEvents = this.loadEvents().filter((e) => e.studentId === studentId);
    const gaps: StudentLearningGap[] = [];

    const pillars: LearningPillar[] = ['budget', 'save', 'invest', 'safety'];

    for (const pillar of pillars) {
      const pillarEvents = studentEvents.filter((e) => e.pillar === pillar);
      const failedEvents = pillarEvents.filter((e) => e.isFailedState);

      if (failedEvents.length >= 1) {
        let pattern = '';
        let recommendation = '';
        let resource = '';

        switch (pillar) {
          case 'budget':
            pattern = 'Difficulty balancing fixed essentials against discretionary peer spending.';
            recommendation = 'Practice the 50-30-20 rule and prioritize hostel dues before luxury purchases.';
            resource = 'Mastering Student Needs vs. Wants';
            break;
          case 'save':
            pattern = 'Reluctance or delay in maintaining an emergency cushion for unexpected costs.';
            recommendation = 'Set aside at least 20% of your scholarship into an untouchable emergency reserve.';
            resource = 'Building Your First Student Rainy-Day Fund';
            break;
          case 'invest':
            pattern = 'Vulnerable to unrealistic high-return promises or keeping all assets idle in cash.';
            recommendation = 'Study how compounding rewards long-term discipline and why safe FDs/RDs beat get-rich-quick claims.';
            resource = 'Compounding and the 8th Wonder of the World';
            break;
          case 'safety':
            pattern = 'Susceptible to UPI QR code traps, deceptive links, or urgent requests for credentials.';
            recommendation = 'Never enter your UPI PIN to receive money, and verify SMS alerts with official helplines (1930).';
            resource = 'Digital Armor: Spotting Online Scams';
            break;
        }

        gaps.push({
          pillar,
          errorFrequency: failedEvents.length,
          recurringPattern: pattern,
          recommendedTopic: recommendation,
          resourceTitle: resource,
        });
      }
    }

    return gaps;
  }
}
