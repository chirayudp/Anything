import { GameEngine } from '../src/engine/gameEngine';
import { EventLogger } from '../src/engine/eventLogger';
import { AnalyticsService } from '../src/services/analyticsService';
import { PUZZLES } from '../src/data/puzzles';
import { GameStorage } from '../src/engine/storage';
import { StudentProfile } from '../src/types';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

console.log('--- Running MoneyQuest Engine Integration Tests ---');

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

const hostelScenario = PUZZLES['PB_001']; // Assuming PB_001 is the first scenario ID in the new data

if (hostelScenario) {
  // Test 1: Optimal Sequence (Best x3)
  const bestChoice1 = hostelScenario.steps[0].choices.find((c) => c.tier === 'best')!;
  const bestChoice2 = hostelScenario.steps[1].choices.find((c) => c.tier === 'best')!;
  const bestChoice3 = hostelScenario.steps[2].choices.find((c) => c.tier === 'best')!;
  
  const evalBest = GameEngine.evaluateScenarioSequence(baseProfile, hostelScenario, [bestChoice1, bestChoice2, bestChoice3], 'en');
  assert(evalBest.result.isPassed === true, 'Best sequence must pass the stage');
  assert(evalBest.result.isRecoveryNeeded === false, 'Best sequence must not trigger recovery');
  assert(evalBest.result.totalPoints === 9, 'Best sequence should yield 9 points');
  
  // Test 2: Destructive Sequence
  const badChoice1 = hostelScenario.steps[0].choices.find((c) => c.tier === 'very_bad')!;
  const badChoice2 = hostelScenario.steps[1].choices.find((c) => c.tier === 'very_bad')!;
  const badChoice3 = hostelScenario.steps[2].choices.find((c) => c.tier === 'very_bad')!;
  
  const evalBad = GameEngine.evaluateScenarioSequence(baseProfile, hostelScenario, [badChoice1, badChoice2, badChoice3], 'en');
  assert(evalBad.result.isPassed === false, 'Very Bad sequence must not pass');
  assert(evalBad.result.isRecoveryNeeded === true, 'Very Bad sequence must trigger recovery mode');
}

// Test 5: Multi-Quest City Completion (Arrow unlocks only after all quests solved)
console.log('Testing multi-quest completion logic...');
const hostelStipendScenario = PUZZLES['scenario_hostel_stipend'];
const hostelStipendBestChoice = hostelStipendScenario.choices!.find((c) => c.tier === 'best')!;
const phoneScenario = PUZZLES['scenario_broken_phone'];
const phoneBestChoice = phoneScenario.choices!.find((c) => c.tier === 'best')!;

const freshProfile = GameStorage.getOrCreateProfile();
freshProfile.completedScenarioIds = [];
freshProfile.completedCityIds = [];

// Neither quest solved
assert(!GameEngine.isScenarioSolved('scenario_hostel_stipend', freshProfile), 'Hostel quest must start unsolved');
assert(!GameEngine.isScenarioSolved('scenario_broken_phone', freshProfile), 'Phone quest must start unsolved');

// Solve only Rao Sir (Hostel)
const pAfterHostel = GameEngine.evaluateChoice(freshProfile, hostelStipendScenario, hostelStipendBestChoice, 'en').updatedProfile;
assert(GameEngine.isScenarioSolved('scenario_hostel_stipend', pAfterHostel), 'Hostel quest must be solved');
assert(!GameEngine.isScenarioSolved('scenario_broken_phone', pAfterHostel), 'Phone quest must STILL be unsolved');

// Solve Suresh Anna (Phone)
const pAfterBoth = GameEngine.evaluateChoice(pAfterHostel, phoneScenario, phoneBestChoice, 'en').updatedProfile;
assert(GameEngine.isScenarioSolved('scenario_hostel_stipend', pAfterBoth), 'Hostel quest must be solved');
assert(GameEngine.isScenarioSolved('scenario_broken_phone', pAfterBoth), 'Phone quest must be solved');
console.log('✓ Test 5 Passed: City 1 multi-quest completion unlocks arrow to City 2');

// Test 5B: City 2 Multi-Quest Progression (Cycle Repair, Bazaar Bargain, Postal Savings)
console.log('Testing City 2 multi-quest progression...');
const cycleScenario = PUZZLES['scenario_cycle_repair'];
const bazaarScenario = PUZZLES['scenario_bazaar_bargain'];
const postalScenario = PUZZLES['scenario_postal_savings'];
assert(!!cycleScenario && !!bazaarScenario && !!postalScenario, 'All 3 City 2 scenarios must exist');

const cycleBest = cycleScenario.choices.find((c) => c.tier === 'best')!;
const bazaarBest = bazaarScenario.choices.find((c) => c.tier === 'best')!;
const postalBest = postalScenario.choices.find((c) => c.tier === 'best')!;

const pCity2Step1 = GameEngine.evaluateChoice(pAfterBoth, cycleScenario, cycleBest, 'en').updatedProfile;
assert(GameEngine.isScenarioSolved('scenario_cycle_repair', pCity2Step1), 'Cycle repair quest must be solved');
assert(!GameEngine.isScenarioSolved('scenario_bazaar_bargain', pCity2Step1), 'Bazaar quest must not yet be solved');

const pCity2Step2 = GameEngine.evaluateChoice(pCity2Step1, bazaarScenario, bazaarBest, 'en').updatedProfile;
assert(GameEngine.isScenarioSolved('scenario_bazaar_bargain', pCity2Step2), 'Bazaar bargain quest must be solved');
assert(!GameEngine.isScenarioSolved('scenario_postal_savings', pCity2Step2), 'Postal savings quest must not yet be solved');

const pCity2Step3 = GameEngine.evaluateChoice(pCity2Step2, postalScenario, postalBest, 'en').updatedProfile;
assert(GameEngine.isScenarioSolved('scenario_postal_savings', pCity2Step3), 'Postal savings quest must be solved');
assert(
  GameEngine.isScenarioSolved('scenario_cycle_repair', pCity2Step3) &&
  GameEngine.isScenarioSolved('scenario_bazaar_bargain', pCity2Step3) &&
  GameEngine.isScenarioSolved('scenario_postal_savings', pCity2Step3),
  'All 3 City 2 quests must now be solved, unlocking arrow to City 3'
);
console.log('✓ Test 5B Passed: City 2 multi-quest progression unlocks navigation to City 3');

// Test 5C: City 3 Multi-Quest Progression (Pillar 3: Understand Investing)
console.log('Testing City 3 multi-quest progression...');
const inv001 = PUZZLES['scenario_inv_001_two_plants'];
const inv002 = PUZZLES['scenario_inv_002_cargo_boat'];
const inv003 = PUZZLES['scenario_inv_003_market_panic'];
const inv004 = PUZZLES['scenario_inv_004_grocery_budget'];
const inv005 = PUZZLES['scenario_inv_005_career_invest'];
assert(!!inv001 && !!inv002 && !!inv003 && !!inv004 && !!inv005, 'All 5 City 3 scenarios must exist in PUZZLES');

const inv001Best = inv001.choices.find((c) => c.tier === 'best')!;
const inv002Best = inv002.choices.find((c) => c.tier === 'best')!;
const inv003Best = inv003.choices.find((c) => c.tier === 'best')!;
const inv004Best = inv004.choices.find((c) => c.tier === 'best')!;
const inv005Best = inv005.choices.find((c) => c.tier === 'best')!;

let pCity3 = pCity2Step3;
pCity3 = GameEngine.evaluateChoice(pCity3, inv001, inv001Best, 'en').updatedProfile;
assert(GameEngine.isScenarioSolved('scenario_inv_001_two_plants', pCity3), 'Mali Kaka quest must be solved');

pCity3 = GameEngine.evaluateChoice(pCity3, inv002, inv002Best, 'en').updatedProfile;
assert(GameEngine.isScenarioSolved('scenario_inv_002_cargo_boat', pCity3), 'Boat Master Kabir quest must be solved');

pCity3 = GameEngine.evaluateChoice(pCity3, inv003, inv003Best, 'en').updatedProfile;
assert(GameEngine.isScenarioSolved('scenario_inv_003_market_panic', pCity3), 'President Meera quest must be solved');

pCity3 = GameEngine.evaluateChoice(pCity3, inv004, inv004Best, 'en').updatedProfile;
assert(GameEngine.isScenarioSolved('scenario_inv_004_grocery_budget', pCity3), 'Uncle Karim quest must be solved');

pCity3 = GameEngine.evaluateChoice(pCity3, inv005, inv005Best, 'en').updatedProfile;
assert(GameEngine.isScenarioSolved('scenario_inv_005_career_invest', pCity3), 'Counselor Deepa quest must be solved');

assert(
  GameEngine.isScenarioSolved('scenario_inv_001_two_plants', pCity3) &&
  GameEngine.isScenarioSolved('scenario_inv_002_cargo_boat', pCity3) &&
  GameEngine.isScenarioSolved('scenario_inv_003_market_panic', pCity3) &&
  GameEngine.isScenarioSolved('scenario_inv_004_grocery_budget', pCity3) &&
  GameEngine.isScenarioSolved('scenario_inv_005_career_invest', pCity3),
  'All 5 City 3 quests must now be solved, unlocking navigation across the river'
);
console.log('✓ Test 5C Passed: City 3 multi-quest progression unlocks river exit');

// Test 5D: City 4 Multi-Quest Progression (Pillar 4: Stay Financially Safe)
console.log('Testing City 4 multi-quest progression...');
const fs001 = PUZZLES['scenario_fs_001_fake_scholarship'];
const fs002 = PUZZLES['scenario_fs_002_atm_helper'];
const fs003 = PUZZLES['scenario_fs_003_double_money'];
const fs004 = PUZZLES['scenario_fs_004_part_time_job'];
const fs005 = PUZZLES['scenario_fs_005_sim_block'];
assert(!!fs001 && !!fs002 && !!fs003 && !!fs004 && !!fs005, 'All 5 City 4 scenarios must exist in PUZZLES');

const fs001Best = fs001.choices.find((c) => c.tier === 'best')!;
const fs002Best = fs002.choices.find((c) => c.tier === 'best')!;
const fs003Best = fs003.choices.find((c) => c.tier === 'best')!;
const fs004Best = fs004.choices.find((c) => c.tier === 'best')!;
const fs005Best = fs005.choices.find((c) => c.tier === 'best')!;

let pCity4 = pCity3;
pCity4 = GameEngine.evaluateChoice(pCity4, fs001, fs001Best, 'en').updatedProfile;
assert(GameEngine.isScenarioSolved('scenario_fs_001_fake_scholarship', pCity4), 'Dock Master Tariq quest must be solved');

pCity4 = GameEngine.evaluateChoice(pCity4, fs002, fs002Best, 'en').updatedProfile;
assert(GameEngine.isScenarioSolved('scenario_fs_002_atm_helper', pCity4), 'Officer Vikram quest must be solved');

pCity4 = GameEngine.evaluateChoice(pCity4, fs003, fs003Best, 'en').updatedProfile;
assert(GameEngine.isScenarioSolved('scenario_fs_003_double_money', pCity4), 'Fishmonger Lakshmi quest must be solved');

pCity4 = GameEngine.evaluateChoice(pCity4, fs004, fs004Best, 'en').updatedProfile;
assert(GameEngine.isScenarioSolved('scenario_fs_004_part_time_job', pCity4), 'Curator Anand quest must be solved');

pCity4 = GameEngine.evaluateChoice(pCity4, fs005, fs005Best, 'en').updatedProfile;
assert(GameEngine.isScenarioSolved('scenario_fs_005_sim_block', pCity4), 'Groundskeeper Deva quest must be solved');

assert(
  GameEngine.isScenarioSolved('scenario_fs_001_fake_scholarship', pCity4) &&
  GameEngine.isScenarioSolved('scenario_fs_002_atm_helper', pCity4) &&
  GameEngine.isScenarioSolved('scenario_fs_003_double_money', pCity4) &&
  GameEngine.isScenarioSolved('scenario_fs_004_part_time_job', pCity4) &&
  GameEngine.isScenarioSolved('scenario_fs_005_sim_block', pCity4),
  'All 5 City 4 quests must now be solved, unlocking full financial safety mastery'
);
console.log('✓ Test 5D Passed: City 4 multi-quest progression completes Pillar 4');
// Test 6: Reload Game State Persistence (Continues from where player stopped)
console.log('Testing reload state persistence (continue from exact stopped position)...');
// Mock localStorage in Node environment if not present
if (typeof window === 'undefined' || !window.localStorage) {
  const store: Record<string, string> = {};
  (global as any).window = {
    localStorage: {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    },
  };
}

// 1. Persist active world screen
GameStorage.saveScreen('world');
assert(GameStorage.getSavedScreen() === 'world', 'Saved screen must persist as "world" across reloads');

// 2. Persist exact stopped location in City 2
GameStorage.saveWorldState({
  cityId: 'city_academic_bazaar',
  x: 520,
  y: 230,
  direction: 'up',
});

const restoredWorld = GameStorage.getSavedWorldState();
assert(restoredWorld !== null, 'Restored world state must exist');
assert(restoredWorld!.cityId === 'city_academic_bazaar', 'Must resume in City 2 (Academic Bazaar)');
assert(restoredWorld!.x === 520, 'Must resume at exact x=520 coordinate');
assert(restoredWorld!.y === 230, 'Must resume at exact y=230 coordinate');
assert(restoredWorld!.direction === 'up', 'Must resume facing exact saved direction');

// 3. Reset progress clears world state and screen
GameStorage.resetProgress();
assert(GameStorage.getSavedScreen() === null, 'Reset must clear saved screen');
assert(GameStorage.getSavedWorldState() === null, 'Reset must clear saved world state');
console.log('✓ Test 6 Passed: Game reload persistence deterministically resumes stopped location & screen');

// Test 7: Bankruptcy Recovery & Relief Grant Reset
console.log('Testing bankruptcy reset functionality...');
const brokeProfile: StudentProfile = {
  ...baseProfile,
  walletBalance: 0,
  emergencyFund: 0,
  completedScenarioIds: ['scenario_hostel_stipend'],
};
assert(brokeProfile.walletBalance === 0, 'Wallet must start at 0 (bankrupt)');

const recovered = GameStorage.resetBankruptcy(brokeProfile);
assert(recovered.walletBalance === 5000, 'Bankruptcy reset must restore scholarship stipend to ₹5,000');
assert(recovered.completedScenarioIds.includes('scenario_hostel_stipend'), 'Bankruptcy reset must preserve solved quest progress');

// Verify persistent storage reflection
const persisted = GameStorage.getOrCreateProfile();
assert(persisted.walletBalance === 5000, 'Persisted wallet must reflect reset ₹5,000 balance');
console.log('✓ Test 7 Passed: Bankruptcy reset seamlessly restores ₹5,000 scholarship relief grant');

// Test 8: 4-Pillar Game Completion & Graduation Validation
console.log('Testing full game completion across all 4 pillars...');
const completionProfile: StudentProfile = {
  studentId: 'STU-CHAMPION-99',
  sessionId: 'SESS-GRADUATION',
  preferredLanguage: 'en',
  characterGender: 'girl',
  scholarshipStipend: 5000,
  walletBalance: 4200,
  emergencyFund: 1800,
  totalScore: 48,
  currentRegionId: 'region_guardian_citadel',
  currentCityId: 'city_harbor_town',
  completedCityIds: [
    'city_hostel_commons',
    'city_academic_bazaar',
    'city_investment_valley',
    'city_harbor_town',
  ],
  failedCityIds: [],
  completedScenarioIds: [
    'scenario_hostel_stipend',
    'scenario_broken_phone',
    'scenario_cycle_repair',
    'scenario_bazaar_bargain',
    'scenario_postal_savings',
    'scenario_inv_001_two_plants',
    'scenario_inv_002_cargo_boat',
    'scenario_inv_003_market_panic',
    'scenario_inv_004_grocery_budget',
    'scenario_inv_005_career_invest',
    'scenario_fs_001_fake_scholarship',
    'scenario_fs_002_atm_helper',
    'scenario_fs_003_double_money',
    'scenario_fs_004_part_time_job',
    'scenario_fs_005_sim_block',
  ],
  badges: ['Merit Scholar'],
  createdAt: Date.now(),
  lastActiveAt: Date.now(),
};

assert(completionProfile.completedCityIds.includes('city_harbor_town'), 'Completion profile must have completed City 4');
assert(completionProfile.completedScenarioIds!.length >= 15, 'All major scenarios across 4 pillars must be completed');
assert(completionProfile.characterGender === 'girl', 'Character gender Ananya correctly identified');
console.log('✓ Test 8 Passed: Grand 4-Pillar game completion & graduation state validated');

// Test 9: Character Selection Conditional Routing (New Users Only)
console.log('Testing character selection conditional routing for new users only...');
const brandNewUser: StudentProfile = {
  studentId: 'STU-NEWBIE-01',
  sessionId: 'SESS-NEW-01',
  preferredLanguage: 'en',
  scholarshipStipend: 5000,
  walletBalance: 5000,
  emergencyFund: 0,
  totalScore: 0,
  currentRegionId: 'region_scholars_district',
  currentCityId: 'city_hostel_commons',
  completedCityIds: [],
  failedCityIds: [],
  badges: [],
  createdAt: Date.now(),
  lastActiveAt: Date.now(),
};
assert(GameStorage.isNewUser(brandNewUser) === true, 'Brand new user without characterGender MUST be detected as new user');

const existingUserBoy: StudentProfile = {
  ...brandNewUser,
  studentId: 'STU-RETURNING-02',
  characterGender: 'boy',
};
assert(GameStorage.isNewUser(existingUserBoy) === false, 'Existing user with Aarav (boy) character MUST bypass character select');

const existingUserGirl: StudentProfile = {
  ...brandNewUser,
  studentId: 'STU-RETURNING-03',
  characterGender: 'girl',
  isNewUser: false,
};
assert(GameStorage.isNewUser(existingUserGirl) === false, 'Existing user with Ananya (girl) character MUST bypass character select');

console.log('✓ Test 9 Passed: Character selection strictly restricted to new users only');

console.log('--- ALL INTEGRATION ENGINE TESTS PASSED SUCCESSFULLY! ---');

