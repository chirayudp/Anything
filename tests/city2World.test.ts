import { strict as assert } from 'assert';
import {
  CITY2_CONFIG,
  CITY2_COLLISION_BOXES,
  CITY2_COLLISION_GRID,
  CITY2_NPCS,
  CITY2_INTERACTIVES,
  getCity2NpcCollisionBoxes,
} from '../src/data/maps/city2Data';
import {
  DEFAULT_PLAYER_FOOTPRINT,
  checkFootCollision,
  checkGridCollision,
  slideMove,
  findNearbyNpc,
} from '../src/engine/worldEngine';
import { NPC_SPRITE_REGISTRY } from '../src/engine/characterAnimation';
import { PUZZLES } from '../src/data/puzzles';

console.log('--- Running City 2 World Engine & Collision Tests ---');

// Test 1: Configuration & Spawn Point Collision
console.log('Checking City 2 configuration and spawn point...');
assert(CITY2_CONFIG.id === 'city_academic_bazaar', 'City 2 id must be city_academic_bazaar');
assert(CITY2_CONFIG.width === 1024, 'Map width must be 1024');
assert(CITY2_CONFIG.height === 559, 'Map height must be 559');
assert(CITY2_CONFIG.spawnPoint.x === 60, 'Spawn point x must be 60 on START road');
assert(CITY2_CONFIG.spawnPoint.y === 455, 'Spawn point y must be 455 on START road');

const spawnBlocked = checkFootCollision(
  CITY2_CONFIG.spawnPoint.x,
  CITY2_CONFIG.spawnPoint.y,
  DEFAULT_PLAYER_FOOTPRINT.width,
  DEFAULT_PLAYER_FOOTPRINT.height,
  CITY2_COLLISION_BOXES,
  CITY2_CONFIG.width,
  CITY2_CONFIG.height,
  CITY2_COLLISION_GRID
);
assert(!spawnBlocked, 'Player spawn point in City 2 must NOT collide with any solid obstacle or boundary');
console.log('✓ Test 1 Passed: Map configuration & spawn point verified collision-free');

// Test 2: Solid Obstacle Boundaries
console.log('Checking collision boundaries on solid obstacles...');
const obstaclesToTest = [
  { name: 'NW Woods (150, 50)', x: 150, y: 50 },
  { name: 'Fish Goods Stall (50, 160)', x: 50, y: 160 },
  { name: 'Mid-Left Shop Foundation (150, 160)', x: 150, y: 160 },
  { name: 'Festival Plaza Fountain Base (495, 130)', x: 495, y: 130 },
  { name: 'University Main Building Foundation (800, 100)', x: 800, y: 100 },
  { name: 'University South Wall Left (700, 305)', x: 700, y: 305 },
  { name: 'University South Wall Right (900, 305)', x: 900, y: 305 },
  { name: 'Post Office Building (550, 320)', x: 550, y: 320 },
  { name: 'Bicycle Parking Rack (120, 350)', x: 120, y: 350 },
  { name: 'South Garden Lawn (200, 520)', x: 200, y: 520 },
  { name: 'South-East Park Lawn West (700, 380)', x: 700, y: 380 },
  { name: 'South-East Park Lawn East (900, 380)', x: 900, y: 380 },
  { name: 'South Roadside Barrier (700, 530)', x: 700, y: 530 },
];

obstaclesToTest.forEach((obs) => {
  const isBlocked = checkFootCollision(
    obs.x,
    obs.y,
    DEFAULT_PLAYER_FOOTPRINT.width,
    DEFAULT_PLAYER_FOOTPRINT.height,
    CITY2_COLLISION_BOXES,
    CITY2_CONFIG.width,
    CITY2_CONFIG.height,
    CITY2_COLLISION_GRID
  );
  assert(isBlocked, `Obstacle "${obs.name}" must be strictly solid`);
});
console.log('✓ Test 2 Passed: Solid obstacles and perimeter boundaries strictly enforced');

// Test 3: Spatial Tile-Based Collision Grid Integration (8x8 px)
console.log('Testing 8x8 spatial collision grid compilation...');
assert(CITY2_COLLISION_GRID.tileSize === 8, 'Collision grid tile size must be 8px');
assert(CITY2_COLLISION_GRID.cols === 128, 'Collision grid cols must be 128 (1024/8)');
assert(CITY2_COLLISION_GRID.rows === 70, 'Collision grid rows must be 70 (ceil 559/8)');

const spawnGridBlocked = checkGridCollision(
  CITY2_CONFIG.spawnPoint.x,
  CITY2_CONFIG.spawnPoint.y,
  DEFAULT_PLAYER_FOOTPRINT.width,
  DEFAULT_PLAYER_FOOTPRINT.height,
  CITY2_COLLISION_GRID
);
assert(!spawnGridBlocked, 'Spawn point must be free on the collision grid');

const woodsGridBlocked = checkGridCollision(
  150,
  50,
  DEFAULT_PLAYER_FOOTPRINT.width,
  DEFAULT_PLAYER_FOOTPRINT.height,
  CITY2_COLLISION_GRID
);
assert(woodsGridBlocked, 'NW Woods must be blocked on the collision grid');
console.log('✓ Test 3 Passed: 8x8 spatial collision grid properly configured');

// Test 4: End-to-End BFS Reachability
console.log('Testing complete City 2 map reachability via BFS pathfinding...');
const grid = CITY2_COLLISION_GRID;
const startCol = Math.floor(CITY2_CONFIG.spawnPoint.x / grid.tileSize);
const startRow = Math.floor(CITY2_CONFIG.spawnPoint.y / grid.tileSize);

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
          CITY2_COLLISION_BOXES,
          CITY2_CONFIG.width,
          CITY2_CONFIG.height,
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
  { name: 'START Road', x: 60, y: 455 },
  { name: 'South Road West Promenade', x: 250, y: 465 },
  { name: 'Main Central Crossroads', x: 340, y: 240 },
  { name: 'Shop Front Sidewalk', x: 220, y: 220 },
  { name: 'Bazaar Plaza South Entrance', x: 505, y: 230 },
  { name: 'Bazaar Plaza Central Fountain', x: 500, y: 160 },
  { name: 'University Gate Entrance', x: 815, y: 315 },
  { name: 'University Courtyard Center', x: 740, y: 245 },
  { name: 'Post Office Counter', x: 550, y: 395 },
  { name: 'EXIT Road East Corridor', x: 920, y: 485 },
  { name: 'EXIT Portal Marker', x: 950, y: 490 },
];

keyTargets.forEach((target) => {
  const tCol = Math.floor(target.x / grid.tileSize);
  const tRow = Math.floor(target.y / grid.tileSize);
  const isReachable = visited[tRow * grid.cols + tCol] === 1;
  assert(isReachable, `Target location "${target.name}" at (${target.x}, ${target.y}) must be reachable from Spawn`);
});
console.log('✓ Test 4 Passed: All 11 key destinations in City 2 are 100% reachable from spawn');

// Test 5: NPCs, Dialogues, Scenarios & Foot Hitbox Integrity
console.log('Testing City 2 NPC positioning, dialogues, scenarios and foot collisions...');
assert(CITY2_NPCS.length === 5, 'City 2 must contain 5 NPCs (Cycle Mechanic, Bazaar Merchant, Post Office Teller, Professor Sharma, Kabir)');
const npcBoxes = getCity2NpcCollisionBoxes(CITY2_NPCS);

CITY2_NPCS.forEach((npc) => {
  // Physical collision check
  const isBlocked = checkFootCollision(
    npc.x,
    npc.y,
    DEFAULT_PLAYER_FOOTPRINT.width,
    DEFAULT_PLAYER_FOOTPRINT.height,
    npcBoxes,
    CITY2_CONFIG.width,
    CITY2_CONFIG.height
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

  // Spritesheet registration check
  assert(!!NPC_SPRITE_REGISTRY[npc.id], `NPC "${npc.id}" must have an entry in NPC_SPRITE_REGISTRY`);

  // Scenario check if quest-giver
  if (npc.scenarioId) {
    const scenario = PUZZLES[npc.scenarioId];
    assert(!!scenario, `Scenario "${npc.scenarioId}" for NPC "${npc.id}" must exist in PUZZLES`);
    assert(scenario.choices.length >= 3, `Scenario "${npc.scenarioId}" must offer at least 3 choices`);
    assert(scenario.choices.some((c) => c.tier === 'best'), `Scenario "${npc.scenarioId}" must have a 'best' choice`);
    assert(scenario.choices.some((c) => c.tier === 'very_bad' || c.tier === 'bad'), `Scenario "${npc.scenarioId}" must have a trap choice`);
  }
});
console.log('✓ Test 5 Passed: All 5 City 2 NPCs, dialogues, scenarios, and physical collisions verified');

// Test 6: Interactive Entities and Portals
console.log('Testing City 2 interactive portals and objects...');
const returnPortal = CITY2_INTERACTIVES.find((o) => o.id === 'portal_city1_return');
assert(!!returnPortal, 'Return portal to City 1 must exist');
assert(returnPortal!.x === 50 && returnPortal!.y === 455, 'Return portal must be stationed at START road');

const exitPortal = CITY2_INTERACTIVES.find((o) => o.id === 'portal_city3_exit');
assert(!!exitPortal, 'Exit portal to City 3 must exist');
assert(exitPortal!.x === 950 && exitPortal!.y === 490, 'Exit portal must be stationed at east road exit');

console.log('✓ Test 6 Passed: Interactive portals connecting City 1, City 2, and City 3 verified');
console.log('--- ALL CITY 2 WORLD ENGINE & COLLISION TESTS PASSED SUCCESSFULLY! ---');
