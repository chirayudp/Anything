import { strict as assert } from 'assert';
import {
  CITY4_CONFIG,
  CITY4_COLLISION_BOXES,
  CITY4_COLLISION_GRID,
  CITY4_NPCS,
  CITY4_INTERACTIVES,
  getCity4NpcCollisionBoxes,
} from '../src/data/maps/city4Data';
import {
  DEFAULT_PLAYER_FOOTPRINT,
  checkFootCollision,
  findNearbyNpc,
} from '../src/engine/worldEngine';
import { NPC_SPRITE_REGISTRY } from '../src/engine/characterAnimation';
import { PUZZLES } from '../src/data/puzzles';

console.log('--- Running City 4 World Engine & Collision Tests ---');

// Test 1: Configuration & Spawn Point Collision
console.log('Checking City 4 configuration and spawn point...');
assert(CITY4_CONFIG.id === 'city_harbor_town', 'City 4 id must be city_harbor_town');
assert(CITY4_CONFIG.width === 1024, 'Map width must be 1024');
assert(CITY4_CONFIG.height === 560, 'Map height must be 560');
assert(CITY4_CONFIG.spawnPoint.x === 480, 'Spawn point x must be 480 on pier dock');
assert(CITY4_CONFIG.spawnPoint.y === 490, 'Spawn point y must be 490 on pier dock');

const spawnBlocked = checkFootCollision(
  CITY4_CONFIG.spawnPoint.x,
  CITY4_CONFIG.spawnPoint.y,
  DEFAULT_PLAYER_FOOTPRINT.width,
  DEFAULT_PLAYER_FOOTPRINT.height,
  CITY4_COLLISION_BOXES,
  CITY4_CONFIG.width,
  CITY4_CONFIG.height,
  CITY4_COLLISION_GRID
);
assert(!spawnBlocked, 'Player spawn point in City 4 must NOT collide with any solid obstacle or boundary');
console.log('✓ Test 1 Passed: Map configuration & spawn point verified collision-free');

// Test 2: Solid Obstacle Boundaries
console.log('Checking collision boundaries on solid obstacles...');
const obstaclesToTest = [
  { name: 'Lighthouse Cliff (100, 100)', x: 100, y: 100 },
  { name: 'Fishermans Guildhall (250, 150)', x: 250, y: 150 },
  { name: 'North Cliff Houses Row (500, 80)', x: 500, y: 80 },
  { name: 'Northeast Cliff Rock (850, 80)', x: 850, y: 80 },
  { name: 'Southwest Ocean Water (50, 480)', x: 50, y: 480 },
  { name: 'Southeast Cliffs (950, 480)', x: 950, y: 480 },
];

obstaclesToTest.forEach((obs) => {
  const isBlocked = checkFootCollision(
    obs.x,
    obs.y,
    DEFAULT_PLAYER_FOOTPRINT.width,
    DEFAULT_PLAYER_FOOTPRINT.height,
    CITY4_COLLISION_BOXES,
    CITY4_CONFIG.width,
    CITY4_CONFIG.height,
    CITY4_COLLISION_GRID
  );
  assert(isBlocked, `Expected solid obstacle '${obs.name}' to be blocked, but was walkable`);
});
console.log('✓ Test 2 Passed: Solid building and water obstacles reliably block movement');

// Test 3: NPC Positions and Interaction Radii
console.log('Checking NPC placement and interaction detection...');
assert(CITY4_NPCS.length === 5, 'City 4 must have 5 NPCs');

CITY4_NPCS.forEach((npc) => {
  assert(npc.cityId === 'city_harbor_town', `NPC ${npc.id} must belong to city_harbor_town`);
  assert(npc.scenarioId, `NPC ${npc.id} must be attached to a scenario`);

  // Check NPC scenario exists in PUZZLES
  const scenario = PUZZLES[npc.scenarioId];
  assert(scenario, `Scenario ${npc.scenarioId} for NPC ${npc.name} must exist in PUZZLES database`);
  assert(scenario.pillar === 'safety', `Scenario ${npc.scenarioId} must be in safety pillar`);

  // NPC must not be trapped in a solid collision box
  const npcBlocked = checkFootCollision(
    npc.x,
    npc.y,
    DEFAULT_PLAYER_FOOTPRINT.width,
    DEFAULT_PLAYER_FOOTPRINT.height,
    CITY4_COLLISION_BOXES,
    CITY4_CONFIG.width,
    CITY4_CONFIG.height,
    CITY4_COLLISION_GRID
  );
  assert(!npcBlocked, `NPC ${npc.name} (${npc.x}, ${npc.y}) must be standing on a walkable tile`);

  // Player within 30px should detect the NPC
  const nearby = findNearbyNpc(npc.x + 10, npc.y + 10, CITY4_NPCS, 35);
  assert(nearby?.id === npc.id, `Player nearby NPC ${npc.name} must detect interaction prompt`);

  // NPC sprite must be registered in sprite registry
  assert(NPC_SPRITE_REGISTRY[npc.id], `NPC ${npc.id} must be registered in NPC_SPRITE_REGISTRY`);
});
console.log('✓ Test 3 Passed: All 5 NPCs correctly positioned, interactive, and sprites registered');

// Test 4: BFS Walkable Path Reachability from Spawn Point to All NPCs & Portals
console.log('Testing BFS path reachability across City 4 harbor...');
function isTileWalkable(tx: number, ty: number): boolean {
  const px = tx * 8 + 4;
  const py = ty * 8 + 4;
  return !checkFootCollision(
    px,
    py,
    DEFAULT_PLAYER_FOOTPRINT.width,
    DEFAULT_PLAYER_FOOTPRINT.height,
    CITY4_COLLISION_BOXES,
    CITY4_CONFIG.width,
    CITY4_CONFIG.height,
    CITY4_COLLISION_GRID
  );
}

const startTx = Math.floor(CITY4_CONFIG.spawnPoint.x / 8);
const startTy = Math.floor(CITY4_CONFIG.spawnPoint.y / 8);
const maxCols = Math.floor(CITY4_CONFIG.width / 8);
const maxRows = Math.floor(CITY4_CONFIG.height / 8);

const visited = new Set<string>();
const queue: [number, number][] = [[startTx, startTy]];
visited.add(`${startTx},${startTy}`);

while (queue.length > 0) {
  const [cx, cy] = queue.shift()!;
  const neighbors = [
    [cx + 1, cy],
    [cx - 1, cy],
    [cx, cy + 1],
    [cx, cy - 1],
  ];

  for (const [nx, ny] of neighbors) {
    if (nx >= 0 && nx < maxCols && ny >= 0 && ny < maxRows) {
      const key = `${nx},${ny}`;
      if (!visited.has(key) && isTileWalkable(nx, ny)) {
        visited.add(key);
        queue.push([nx, ny]);
      }
    }
  }
}

// Verify each NPC is reachable by BFS flood-fill
CITY4_NPCS.forEach((npc) => {
  const ntx = Math.floor(npc.x / 8);
  const nty = Math.floor(npc.y / 8);
  let reachable = false;

  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      if (visited.has(`${ntx + dx},${nty + dy}`)) {
        reachable = true;
        break;
      }
    }
    if (reachable) break;
  }
  assert(reachable, `NPC ${npc.name} (${npc.x}, ${npc.y}) must be reachable from spawn point`);
});

// Verify Return Portal is reachable
const returnPortal = CITY4_INTERACTIVES.find((o) => o.id === 'portal_city3_return');
assert(returnPortal, 'Return portal to City 3 must exist');
const ptx = Math.floor(returnPortal.x / 8);
const pty = Math.floor(returnPortal.y / 8);
let portalReachable = false;
for (let dx = -2; dx <= 2; dx++) {
  for (let dy = -2; dy <= 2; dy++) {
    if (visited.has(`${ptx + dx},${pty + dy}`)) {
      portalReachable = true;
      break;
    }
  }
  if (portalReachable) break;
}
assert(portalReachable, 'Return portal to City 3 must be reachable from spawn');

console.log('✓ Test 4 Passed: BFS reachability confirmed for all NPCs and portals in City 4');
console.log('--- ALL CITY 4 WORLD TESTS PASSED SUCCESSFULLY ---');
