import { GameEngine } from '../src/engine/gameEngine';
import { EventLogger } from '../src/engine/eventLogger';
import { AnalyticsService } from '../src/services/analyticsService';
import { PUZZLES } from '../src/data/puzzles';
import { StudentProfile } from '../src/types';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

console.log('--- Running MoneyQuest Engine Integration Tests ---');

// Test 1: Initial Profile & Budget Allocation
const baseProfile: StudentProfile = {
  studentId: 'STU-TEST-01',
  sessionId: 'SESS-TEST',
  preferredLanguage: 'en',
  scholarshipStipend: 5000,
  walletBalance: 5000,
  emergencyFund: 0,
  totalScore: 0,
  currentRegionId: 'region_scholars_district',
  currentCityId: 'city_hostel_commons',
  completedCityIds: [],
  failedCityIds: [],
  badges: ['Scholarship Recipient'],
  createdAt: Date.now(),
  lastActiveAt: Date.now(),
};

const hostelScenario = PUZZLES['scenario_hostel_stipend'];
assert(!!hostelScenario, 'Hostel scenario must exist');

const bestChoice = hostelScenario.choices.find((c) => c.tier === 'best')!;
assert(!!bestChoice, 'Best choice must exist');

const evalBest = GameEngine.evaluateChoice(baseProfile, hostelScenario, bestChoice, 'en');
assert(evalBest.result.isPassed === true, 'Best choice must pass the stage');
assert(evalBest.result.isRecoveryNeeded === false, 'Best choice must not trigger recovery mode');
assert(evalBest.updatedProfile.emergencyFund === 1000, 'Emergency reserve must increase to ₹1000');
assert(evalBest.updatedProfile.totalScore === 100, 'Score must increase by 100');
assert(
  evalBest.updatedProfile.completedCityIds.includes('city_hostel_commons'),
  'Hostel Commons must be marked completed'
);
console.log('✓ Test 1 Passed: Optimal 50-30-20 budget decision correctly evaluates');

// Test 2: Very Bad Choice & Recovery Mode
const veryBadChoice = hostelScenario.choices.find((c) => c.tier === 'very_bad')!;
assert(!!veryBadChoice, 'Very bad choice must exist');

const evalBad = GameEngine.evaluateChoice(baseProfile, hostelScenario, veryBadChoice, 'en');
assert(evalBad.result.isPassed === false, 'Very Bad choice must not pass');
assert(evalBad.result.isRecoveryNeeded === true, 'Very Bad choice must trigger recovery mode');
assert(
  evalBad.updatedProfile.failedCityIds.includes('city_hostel_commons'),
  'City must be marked in failedCityIds'
);
console.log('✓ Test 2 Passed: Destructive choice triggers recovery mode and records failure state');

// Test 3: Decision Event Logger & NGO Gap Detection
const evt = EventLogger.recordDecision({
  studentId: baseProfile.studentId,
  sessionId: baseProfile.sessionId,
  regionId: baseProfile.currentRegionId,
  cityId: hostelScenario.cityId,
  scenarioId: hostelScenario.id,
  choiceId: veryBadChoice.id,
  tier: veryBadChoice.tier,
  pillar: hostelScenario.pillar,
  walletBefore: baseProfile.walletBalance,
  walletAfter: evalBad.updatedProfile.walletBalance,
  emergencyBefore: baseProfile.emergencyFund,
  emergencyAfter: evalBad.updatedProfile.emergencyFund,
  financialImpact: veryBadChoice.financialImpact,
  feedbackShown: evalBad.result.feedback,
  language: 'en',
});

assert(evt.isFailedState === true, 'Logged event must record failed state');
assert(evt.pillar === 'budget', 'Logged event must track budget pillar');

const gaps = EventLogger.detectLearningGaps(baseProfile.studentId);
assert(gaps.length > 0, 'Learning gap detection must identify budget vulnerability');
assert(gaps[0].pillar === 'budget', 'Learning gap must report budget pillar');
console.log('✓ Test 3 Passed: Chronological decision logging and gap analysis work deterministically');

// Test 4: Analytics Overview Calculation
const overview = AnalyticsService.getOverview();
assert(overview.totalUniqueStudents >= 1, 'Overview must track student count');
assert(overview.totalFailedStates >= 1, 'Overview must track failed trap count');
console.log('✓ Test 4 Passed: NGO aggregated metrics calculation verified');

console.log('--- ALL INTEGRATION ENGINE TESTS PASSED SUCCESSFULLY! ---');
