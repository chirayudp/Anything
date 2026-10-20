import { strict as assert } from 'assert';
import {
  CITY3_CONFIG,
  CITY3_COLLISION_BOXES,
  CITY3_COLLISION_GRID,
  CITY3_NPCS,
  CITY3_INTERACTIVES,
  getCity3NpcCollisionBoxes,
} from '../src/data/maps/city3Data';
import {
  DEFAULT_PLAYER_FOOTPRINT,
  checkFootCollision,
  checkGridCollision,
  findNearbyNpc,
} from '../src/engine/worldEngine';
import { NPC_SPRITE_REGISTRY } from '../src/engine/characterAnimation';
import { PUZZLES } from '../src/data/puzzles';

console.log('--- Running City 3 World Engine & Collision Tests ---');

// Test 1: Configuration & Spawn Point Collision
console.log('Checking City 3 configuration and spawn point...');
assert(CITY3_CONFIG.id === 'city_investment_valley', 'City 3 id must be city_investment_valley');
assert(CITY3_CONFIG.width === 1024, 'Map width must be 1024');
assert(CITY3_CONFIG.height === 572, 'Map height must be 572');
assert(CITY3_CONFIG.spawnPoint.x === 75, 'Spawn point x must be 75 on START road');
assert(CITY3_CONFIG.spawnPoint.y === 265, 'Spawn point y must be 265 on START road');

const spawnBlocked = checkFootCollision(
  CITY3_CONFIG.spawnPoint.x,
  CITY3_CONFIG.spawnPoint.y,
  DEFAULT_PLAYER_FOOTPRINT.width,
  DEFAULT_PLAYER_FOOTPRINT.height,
  CITY3_COLLISION_BOXES,
  CITY3_CONFIG.width,
  CITY3_CONFIG.height,
  CITY3_COLLISION_GRID
);
assert(!spawnBlocked, 'Player spawn point in City 3 must NOT collide with any solid obstacle or boundary');
console.log('✓ Test 1 Passed: Map configuration & spawn point verified collision-free');

// Test 2: Solid Obstacle Boundaries
console.log('Checking collision boundaries on solid obstacles...');
const obstaclesToTest = [
  { name: 'Garden Crop Bed 1 (65, 70)', x: 65, y: 70 },
  { name: 'School Building Main (350, 70)', x: 350, y: 70 },
  { name: 'Economics Club Building (580, 80)', x: 580, y: 80 },
  { name: 'Career Office Building (880, 70)', x: 880, y: 70 },
  { name: 'SW House Main (120, 380)', x: 120, y: 380 },
  { name: 'Grocery Market Building (500, 380)', x: 500, y: 380 },
  { name: 'Dock Warehouse Goods (780, 500)', x: 780, y: 500 },
  { name: 'River Water (960, 340)', x: 960, y: 340 },
];

obstaclesToTest.forEach((obs) => {
  const isBlocked = checkFootCollision(
    obs.x,
    obs.y,
    DEFAULT_PLAYER_FOOTPRINT.width,
    DEFAULT_PLAYER_FOOTPRINT.height,
    CITY3_COLLISION_BOXES,
    CITY3_CONFIG.width,
    CITY3_CONFIG.height,
    CITY3_COLLISION_GRID
  );
  assert(isBlocked, `Obstacle "${obs.name}" must be strictly solid`);
});
console.log('✓ Test 2 Passed: Solid obstacles and perimeter boundaries strictly enforced');

// Test 3: Spatial Tile-Based Collision Grid Integration (8x8 px)
console.log('Testing 8x8 spatial collision grid compilation...');
assert(CITY3_COLLISION_GRID.tileSize === 8, 'Collision grid tile size must be 8px');
assert(CITY3_COLLISION_GRID.cols === 128, 'Collision grid cols must be 128 (1024/8)');
assert(CITY3_COLLISION_GRID.rows === 72, 'Collision grid rows must be 72 (ceil 572/8)');

const spawnGridBlocked = checkGridCollision(
  CITY3_CONFIG.spawnPoint.x,
  CITY3_CONFIG.spawnPoint.y,
  DEFAULT_PLAYER_FOOTPRINT.width,
  DEFAULT_PLAYER_FOOTPRINT.height,
  CITY3_COLLISION_GRID
);
assert(!spawnGridBlocked, 'Spawn point must be free on the collision grid');

const buildingGridBlocked = checkGridCollision(
  500,
  380,
  DEFAULT_PLAYER_FOOTPRINT.width,
  DEFAULT_PLAYER_FOOTPRINT.height,
  CITY3_COLLISION_GRID
);
assert(buildingGridBlocked, 'Grocery market must be blocked on the collision grid');
console.log('✓ Test 3 Passed: 8x8 spatial collision grid properly configured');

// Test 4: End-to-End BFS Reachability
console.log('Testing complete City 3 map reachability via BFS pathfinding...');
const grid = CITY3_COLLISION_GRID;
const startCol = Math.floor(CITY3_CONFIG.spawnPoint.x / grid.tileSize);
const startRow = Math.floor(CITY3_CONFIG.spawnPoint.y / grid.tileSize);

const visited = new Uint8Array(grid.cols * grid.rows);
const queue: [number, number][] = [[startCol, startRow]];
visited[startRow * grid.cols + startCol] = 1;

const dirs = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

while (queue.length > 0) {
  const [c, r] = queue.shift()!;
  for (const [dc, dr] of dirs) {
    const nc = c + dc;
    const nr = r + dr;
    if (nc >= 0 && nc < grid.cols && nr >= 0 && nr < grid.rows) {
      const idx = nr * grid.cols + nc;
      if (!visited[idx]) {
        const px = nc * grid.tileSize + grid.tileSize / 2;
        const py = nr * grid.tileSize + grid.tileSize / 2;
        const blocked = checkFootCollision(
          px,
          py,
          DEFAULT_PLAYER_FOOTPRINT.width,
          DEFAULT_PLAYER_FOOTPRINT.height,
          CITY3_COLLISION_BOXES,
          CITY3_CONFIG.width,
          CITY3_CONFIG.height,
          grid
        );
        if (!blocked) {
          visited[idx] = 1;
          queue.push([nc, nr]);
        }
      }
    }
  }
}

const keyTargets = [
  { name: 'START Road', x: 75, y: 265 },
  { name: 'School Garden Path', x: 175, y: 220 },
  { name: 'School Science Courtyard', x: 340, y: 170 },
  { name: 'Economics Club Courtyard', x: 580, y: 200 },
  { name: 'Main Road East Corridor', x: 710, y: 265 },
  { name: 'Career Guidance Path', x: 820, y: 200 },
  { name: 'Market Front Plaza', x: 350, y: 400 },
  { name: 'River Boat Dock Pier', x: 820, y: 400 },
  { name: 'River Exit Portal Marker', x: 860, y: 500 },
];

keyTargets.forEach((target) => {
  const tCol = Math.floor(target.x / grid.tileSize);
  const tRow = Math.floor(target.y / grid.tileSize);
  const isReachable = visited[tRow * grid.cols + tCol] === 1;
  assert(isReachable, `Target location "${target.name}" at (${target.x}, ${target.y}) must be reachable from Spawn`);
});
console.log('✓ Test 4 Passed: All key destinations in City 3 are 100% reachable from spawn');

// Test 5: NPCs, Dialogues, Scenarios & Foot Hitbox Integrity
console.log('Testing City 3 NPC positioning, dialogues, scenarios and foot collisions...');
assert(CITY3_NPCS.length === 5, 'City 3 must contain 5 NPCs (Mali Kaka, Boat Master Kabir, Meera, Uncle Karim, Counselor Deepa)');
const npcBoxes = getCity3NpcCollisionBoxes(CITY3_NPCS);

CITY3_NPCS.forEach((npc) => {
  // Physical collision check
  const isBlocked = checkFootCollision(
    npc.x,
    npc.y,
    DEFAULT_PLAYER_FOOTPRINT.width,
    DEFAULT_PLAYER_FOOTPRINT.height,
    npcBoxes,
    CITY3_CONFIG.width,
    CITY3_CONFIG.height
  );
  assert(isBlocked, `Player must not be able to walk through NPC "${npc.name}"`);

  // Adjacent interaction check (player standing within 45px)
  const nearbyNpc = findNearbyNpc(npc.x, npc.y + 25, [npc], 45);
  assert(nearbyNpc?.id === npc.id, `Adjacent player must be able to interact with NPC "${npc.name}"`);

  // Trilingual dialogue verification
  assert(!!npc.dialogueIntro?.en, `NPC "${npc.id}" must have English dialogue intro`);
  assert(!!npc.dialogueIntro?.hi, `NPC "${npc.id}" must have Hindi dialogue intro`);
  assert(!!npc.dialogueIntro?.te, `NPC "${npc.id}" must have Telugu dialogue intro`);
  assert(!!npc.dialogueSolved?.en, `NPC "${npc.id}" must have English dialogue solved`);
  assert(!!npc.dialogueSolved?.hi, `NPC "${npc.id}" must have Hindi dialogue solved`);
  assert(!!npc.dialogueSolved?.te, `NPC "${npc.id}" must have Telugu dialogue solved`);

  // Scenario check
  if (npc.scenarioId) {
    const scenario = PUZZLES[npc.scenarioId];
    assert(!!scenario, `Scenario "${npc.scenarioId}" for NPC "${npc.id}" must exist in PUZZLES`);
    assert(scenario.steps && scenario.steps.length === 3, `Scenario "${npc.scenarioId}" must have 3 decision steps`);
    scenario.steps.forEach((step, idx) => {
      assert(step.choices.length === 4, `Step ${idx + 1} of "${npc.scenarioId}" must have 4 choices`);
      assert(step.choices.some((c) => c.tier === 'best'), `Step ${idx + 1} must have a 'best' choice`);
      assert(step.choices.some((c) => c.tier === 'very_bad'), `Step ${idx + 1} must have a 'very_bad' choice`);
    });
  }
});
console.log('✓ Test 5 Passed: All 5 City 3 NPCs, dialogues, scenarios, and physical collisions verified');

// Test 6: Interactive Entities and Portals
console.log('Testing City 3 interactive portals and objects...');
const returnPortal = CITY3_INTERACTIVES.find((o) => o.id === 'portal_city2_return');
assert(!!returnPortal, 'Return portal to City 2 must exist');
assert(returnPortal!.x === 75 && returnPortal!.y === 265, 'Return portal must be stationed at START road');

const exitPortal = CITY3_INTERACTIVES.find((o) => o.id === 'portal_city4_exit');
assert(!!exitPortal, 'Exit portal to City 4 must exist');
assert(exitPortal!.x === 860 && exitPortal!.y === 500, 'Exit portal must be stationed near river');

const ideaCard = CITY3_INTERACTIVES.find((o) => o.id === 'landmark_mango_tree_story');
assert(!!ideaCard, 'Idea card landmark for The Mango Tree Story must exist');

console.log('✓ Test 6 Passed: Interactive portals and Idea Card for City 3 verified');
console.log('--- ALL CITY 3 WORLD ENGINE & COLLISION TESTS PASSED SUCCESSFULLY! ---');
