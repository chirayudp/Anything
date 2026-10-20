import {
  CITY1_CONFIG,
  CITY1_COLLISION_BOXES,
  CITY1_COLLISION_GRID,
  COLLISION_GRID_TILE_SIZE,
  CITY1_NPCS,
  CITY1_INTERACTIVES,
  getCity1NpcCollisionBoxes,
} from '../src/data/maps/city1Data';
import {
  DEFAULT_PLAYER_FOOTPRINT,
  checkFootCollision,
  checkGridCollision,
  slideMove,
  calculateCamera,
  findNearbyNpc,
} from '../src/engine/worldEngine';
import { PUZZLES } from '../src/data/puzzles';
import {
  PLAYER_SPRITE_CONFIG,
  NPC_SPRITE_REGISTRY,
  registerNpcSprite,
  getSpriteFrameCoordinates,
} from '../src/engine/characterAnimation';
import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('--- Running City 1 World Engine & Map Integration Tests ---');

// Test 1: Configuration & Spawn Validation
console.log('Checking City 1 configuration and spawn point...');
assert(CITY1_CONFIG.id === 'city_hostel_commons', 'City ID must be city_hostel_commons');
assert(CITY1_CONFIG.width === 1024 && CITY1_CONFIG.height === 572, 'Map dimensions must match supplied asset (1024x572)');

const spawn = CITY1_CONFIG.spawnPoint;
assert(spawn.x === 75 && spawn.y === 450, 'Spawn point must be (75, 450) on START bridge');
const spawnCollides = checkFootCollision(
  spawn.x,
  spawn.y,
  DEFAULT_PLAYER_FOOTPRINT.width,
  DEFAULT_PLAYER_FOOTPRINT.height,
  CITY1_COLLISION_BOXES,
  CITY1_CONFIG.width,
  CITY1_CONFIG.height
);
assert(!spawnCollides, 'Spawn point must be completely collision-free');
console.log('✓ Test 1 Passed: Map configuration & spawn point verified collision-free');

// Test 2: Solid Obstacle Collisions
console.log('Checking collision boundaries on solid obstacles...');
// River (x: 50, y: 350)
const riverCollides = checkFootCollision(
  50,
  350,
  DEFAULT_PLAYER_FOOTPRINT.width,
  DEFAULT_PLAYER_FOOTPRINT.height,
  CITY1_COLLISION_BOXES,
  CITY1_CONFIG.width,
  CITY1_CONFIG.height
);
assert(riverCollides, 'River must be impassable');

// School Building (x: 100, y: 80)
const schoolCollides = checkFootCollision(
  100,
  80,
  DEFAULT_PLAYER_FOOTPRINT.width,
  DEFAULT_PLAYER_FOOTPRINT.height,
  CITY1_COLLISION_BOXES,
  CITY1_CONFIG.width,
  CITY1_CONFIG.height
);
assert(schoolCollides, 'School building must be impassable');

// Hostel Building (x: 850, y: 100)
const hostelCollides = checkFootCollision(
  850,
  100,
  DEFAULT_PLAYER_FOOTPRINT.width,
  DEFAULT_PLAYER_FOOTPRINT.height,
  CITY1_COLLISION_BOXES,
  CITY1_CONFIG.width,
  CITY1_CONFIG.height
);
assert(hostelCollides, 'Hostel building must be impassable');

// Out of bounds (x: -10, y: 200)
const oobCollides = checkFootCollision(
  -10,
  200,
  DEFAULT_PLAYER_FOOTPRINT.width,
  DEFAULT_PLAYER_FOOTPRINT.height,
  CITY1_COLLISION_BOXES,
  CITY1_CONFIG.width,
  CITY1_CONFIG.height
);
assert(oobCollides, 'Movement outside map bounds must be blocked');
console.log('✓ Test 2 Passed: Solid obstacles and perimeter boundaries strictly enforced');

// Test 3: Strict 4-Way Movement & Diagonal Prohibition
console.log('Testing strict 4-way movement and diagonal prohibition...');
// Normal walk in open area
const openMove = slideMove(
  200,
  440,
  4,
  0,
  DEFAULT_PLAYER_FOOTPRINT,
  CITY1_COLLISION_BOXES,
  CITY1_CONFIG.width,
  CITY1_CONFIG.height
);
assert(openMove.moved && openMove.x === 204 && openMove.y === 440, 'Open horizontal movement must advance correctly');

// Diagonal movement input (+4, -4) must be strictly converted into single-axis move (no diagonal)
const diagMove = slideMove(
  200,
  440,
  4,
  -4,
  DEFAULT_PLAYER_FOOTPRINT,
  CITY1_COLLISION_BOXES,
  CITY1_CONFIG.width,
  CITY1_CONFIG.height
);
assert(diagMove.moved, 'Movement should succeed on primary axis');
assert(diagMove.x === 204 && diagMove.y === 440, 'Diagonal input must be strictly flattened to single-axis cardinal move');
console.log('✓ Test 3 Passed: 4-Way cardinal movement strictly enforced without diagonal drift');

// Test 4: Camera Clamping
console.log('Checking camera bounds clamping...');
// Top-left corner
const camTopLeft = calculateCamera(50, 50, 800, 500, 1024, 572);
assert(camTopLeft.camX === 0 && camTopLeft.camY === 0, 'Camera should clamp to (0,0) at top-left');

// Bottom-right corner
const camBottomRight = calculateCamera(1000, 550, 800, 500, 1024, 572);
assert(camBottomRight.camX === 1024 - 800, 'Camera should clamp to right edge');
assert(camBottomRight.camY === 572 - 500, 'Camera should clamp to bottom edge');
console.log('✓ Test 4 Passed: Camera clamping maintains viewport inside map bounds');

// Test 5: NPC Proximity and Challenge Interface
console.log('Testing NPC positioning and challenge launching contract...');
const warden = CITY1_NPCS.find((n) => n.id === 'npc_hostel_warden');
assert(!!warden, 'Warden Rao Sir must exist in City 1');
assert(
  warden!.scenarioId === 'scenario_hostel_stipend' || warden!.scenarioId === 'PB_001',
  'Warden must link to scenario_hostel_stipend or PB_001'
);
assert(warden!.cityId === 'city_hostel_commons', 'Warden cityId must match City 1');

// Verify scenario exists in PUZZLES
const puzzle = PUZZLES[warden!.scenarioId!];
assert(!!puzzle, 'Warden scenario must exist in master PUZZLES registry');
assert(puzzle.pillar === 'budget', 'Puzzle pillar must be budget');

// Proximity check
const farNpc = findNearbyNpc(75, 450, CITY1_NPCS, 45);
assert(farNpc === null, 'Player at spawn should not be within interaction range of any NPC');

const nearWarden = findNearbyNpc(840, 180, CITY1_NPCS, 60);
assert(nearWarden?.id === 'npc_hostel_warden', 'Player next to Warden must be detected');
console.log('✓ Test 5 Passed: NPC interaction zone and challenge contract verified');

// Test 6: Interactive Objects and Environmental Discoveries
console.log('Testing interactive objects and environmental entities...');
assert(CITY1_INTERACTIVES.length >= 3, 'City 1 must contain at least 3 interactive objects/entities');

const atm = CITY1_INTERACTIVES.find((o) => o.id === 'kiosk_atm_passbook');
assert(!!atm, 'ATM Passbook kiosk must exist');
assert(atm!.x === 925 && atm!.y === 505, 'ATM must be at Savings Bank');

const notice = CITY1_INTERACTIVES.find((o) => o.id === 'notice_scholarship_letter');
assert(!!notice, 'Scholarship Notice Board must exist');

const portal = CITY1_INTERACTIVES.find((o) => o.id === 'portal_city2_exit');
assert(!!portal, 'Road to City 2 portal must exist');
assert(portal!.x === 685 && portal!.y === 30, 'Portal must be located at northern road exit');
console.log('✓ Test 6 Passed: Interactive objects, notices, and portal configured correctly');

// Test 7: Spatial Tile-Based Collision Grid Integration
console.log('Testing 8x8 spatial collision grid compilation...');

assert(CITY1_COLLISION_GRID.tileSize === 8, 'Collision grid tile size must be 8px');
assert(CITY1_COLLISION_GRID.cols === 128, 'Collision grid cols must be 128 (1024/8)');
assert(CITY1_COLLISION_GRID.rows === 72, 'Collision grid rows must be 72 (ceil 572/8)');

// Spawn should be clear on the grid
const spawnGridBlocked = checkGridCollision(
  CITY1_CONFIG.spawnPoint.x,
  CITY1_CONFIG.spawnPoint.y,
  DEFAULT_PLAYER_FOOTPRINT.width,
  DEFAULT_PLAYER_FOOTPRINT.height,
  CITY1_COLLISION_GRID
);
assert(!spawnGridBlocked, 'Spawn point must be free on the collision grid');

// River at (50, 350) should be blocked on the grid
const riverGridBlocked = checkGridCollision(
  50,
  350,
  DEFAULT_PLAYER_FOOTPRINT.width,
  DEFAULT_PLAYER_FOOTPRINT.height,
  CITY1_COLLISION_GRID
);
assert(riverGridBlocked, 'River must be blocked on the collision grid');
console.log('✓ Test 7 Passed: 8x8 spatial collision grid properly configured');

// Test 8: End-to-End Reachability (BFS Pathfinding from Spawn to All Landmarks)
console.log('Testing complete map reachability via BFS pathfinding...');
const grid = CITY1_COLLISION_GRID;
const startCol = Math.floor(CITY1_CONFIG.spawnPoint.x / grid.tileSize);
const startRow = Math.floor(CITY1_CONFIG.spawnPoint.y / grid.tileSize);

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
        // Player footprint check at this tile center
        const px = nc * grid.tileSize + grid.tileSize / 2;
        const py = nr * grid.tileSize + grid.tileSize / 2;
        const blocked = checkFootCollision(
          px,
          py,
          DEFAULT_PLAYER_FOOTPRINT.width,
          DEFAULT_PLAYER_FOOTPRINT.height,
          CITY1_COLLISION_BOXES,
          CITY1_CONFIG.width,
          CITY1_CONFIG.height,
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

const keyTargets: { name: string; x: number; y: number }[] = [
  { name: 'Spawn Bridge', x: 75, y: 450 },
  { name: 'South Road Promenade', x: 400, y: 450 },
  { name: 'Western Avenue', x: 180, y: 360 },
  { name: 'School/Library Courtyard', x: 200, y: 230 },
  { name: 'Bookshop Entrance & Front', x: 375, y: 235 },
  { name: 'Study Room Pathway', x: 520, y: 200 },
  { name: 'Canteen Dining Patio', x: 380, y: 370 },
  { name: 'Electronics Repair Counter', x: 630, y: 350 },
  { name: 'Hostel Courtyard / Warden', x: 850, y: 180 },
  { name: 'Savings Bank / ATM', x: 900, y: 505 },
  { name: 'City 2 Northern Exit Portal', x: 685, y: 35 },
  { name: 'Scholarship Notice Board', x: 180, y: 430 },
];

keyTargets.forEach((target) => {
  const tCol = Math.floor(target.x / grid.tileSize);
  const tRow = Math.floor(target.y / grid.tileSize);
  const isReachable = visited[tRow * grid.cols + tCol] === 1;
  assert(isReachable, `Target location "${target.name}" at (${target.x}, ${target.y}) must be reachable from Spawn`);
});
console.log('✓ Test 8 Passed: All 12 key destinations and City 2 exit 100% reachable from spawn');

// Test 9: Continuous Sub-Pixel Movement Flush Against Solid Walls
console.log('Testing continuous sub-pixel flush movement against solid obstacle walls...');
// Bank south wall is at y: 495. Player walking upwards from forecourt (y: 520) towards bank.
// Foot halfH is 4. When flush against south wall (y: 495), foot center y should stop at 499.
const bankApproach = slideMove(
  880,
  520,
  0,
  -25,
  DEFAULT_PLAYER_FOOTPRINT,
  CITY1_COLLISION_BOXES,
  CITY1_CONFIG.width,
  CITY1_CONFIG.height,
  CITY1_COLLISION_GRID
);
assert(bankApproach.moved, 'Player should be able to move forward until flush against wall');
assert(bankApproach.y >= 499, `Player must not penetrate bank wall at y: 495 (stopped at ${bankApproach.y})`);
assert(Math.abs(bankApproach.y - 499) <= 1.5, `Player should stop flush against wall (expected ~499, got ${bankApproach.y})`);
console.log('✓ Test 9 Passed: Continuous sub-pixel movement brings player flush against wall with 0 penetration');

// Test 10: Corner Assist through School Gate
console.log('Testing corner assist nudging around gate corners...');
// School wall left ends at x: 180, gate is open x: 180..245.
// If player is at x: 185, y: 306 moving up (dy: -4), direct movement clips the left gate post at x: 180.
// Corner assist nudges the player right into the open gate.
const gateNudge = slideMove(
  185,
  306,
  0,
  -4,
  DEFAULT_PLAYER_FOOTPRINT,
  CITY1_COLLISION_BOXES,
  CITY1_CONFIG.width,
  CITY1_CONFIG.height,
  CITY1_COLLISION_GRID
);
assert(gateNudge.moved, 'Corner assist should nudge player into open school gate');
assert(gateNudge.x > 185, 'Corner assist should nudge player rightward into open opening');
console.log('✓ Test 10 Passed: Corner assist nudges player around gate posts into courtyards');

// Test 11: Main Character Pixel Art Sprite Asset Integrity
console.log('Testing main character pixel art sprite asset integrity...');
const spritePath = path.resolve('src/assets/characters/player_spritesheet.png');
assert(fs.existsSync(spritePath), 'Player spritesheet file must exist at src/assets/characters/player_spritesheet.png');
const stats = fs.statSync(spritePath);
assert(stats.size > 1000, `Player spritesheet must be a valid image file (got ${stats.size} bytes)`);
assert(PLAYER_SPRITE_CONFIG.frameWidth === 48, 'Frame width must be 48px');
assert(PLAYER_SPRITE_CONFIG.frameHeight === 72, 'Frame height must be 72px');
assert(PLAYER_SPRITE_CONFIG.baselineY === 68, 'Baseline Y must be 68px for proper foot grounding');
console.log('✓ Test 11 Passed: Main character pixel art spritesheet asset verified on disk');

// Test 12: Directional Animation Row Mapping & Frame Cycling
console.log('Testing 4-way direction animation rows and frames...');
// Walking cycles (8 frames each)
const walkDown = getSpriteFrameCoordinates('down', true, 3, PLAYER_SPRITE_CONFIG);
assert(walkDown.row === PLAYER_SPRITE_CONFIG.rows.walk_down && walkDown.col === 3, 'Walk down must map to Row 1, Col 3');

const walkUp = getSpriteFrameCoordinates('up', true, 5, PLAYER_SPRITE_CONFIG);
assert(walkUp.row === PLAYER_SPRITE_CONFIG.rows.walk_up && walkUp.col === 5, 'Walk up must map to Row 2, Col 5');

const walkLeft = getSpriteFrameCoordinates('left', true, 2, PLAYER_SPRITE_CONFIG);
assert(walkLeft.row === PLAYER_SPRITE_CONFIG.rows.walk_left && walkLeft.col === 2, 'Walk left must map to Row 3, Col 2');

const walkRight = getSpriteFrameCoordinates('right', true, 7, PLAYER_SPRITE_CONFIG);
assert(walkRight.row === PLAYER_SPRITE_CONFIG.rows.walk_right && walkRight.col === 7, 'Walk right must map to Row 4, Col 7');

// Idle Stances
const idleDown = getSpriteFrameCoordinates('down', false, 4, PLAYER_SPRITE_CONFIG);
assert(idleDown.row === PLAYER_SPRITE_CONFIG.rows.idle_down && idleDown.col === 4, 'Idle down must map to Row 0 idle cycle');

const idleUp = getSpriteFrameCoordinates('up', false, 4, PLAYER_SPRITE_CONFIG);
assert(idleUp.row === PLAYER_SPRITE_CONFIG.rows.walk_up && idleUp.col === 0, 'Idle up must map to Row 2 static Col 0');

const idleLeft = getSpriteFrameCoordinates('left', false, 4, PLAYER_SPRITE_CONFIG);
assert(idleLeft.row === PLAYER_SPRITE_CONFIG.rows.walk_left && idleLeft.col === 0, 'Idle left must map to Row 3 static Col 0');

const idleRight = getSpriteFrameCoordinates('right', false, 4, PLAYER_SPRITE_CONFIG);
assert(idleRight.row === PLAYER_SPRITE_CONFIG.rows.walk_right && idleRight.col === 0, 'Idle right must map to Row 4 static Col 0');
console.log('✓ Test 12 Passed: 4-Way walk cycles and idle stances correctly mapped to spritesheet grid');

// Test 13: Extensible NPC Sprite Registry Architecture & Physical Collision Integration
console.log('Testing NPC sprite registration architecture and collision integration...');
const expectedNpcIds = [
  'npc_hostel_warden',
  'npc_repair_tech',
  'npc_canteen_manager',
  'npc_senior_librarian',
  'npc_security_guard',
  'npc_anand_senior',
  'npc_bookshop_owner',
  'npc_student_friend',
];

expectedNpcIds.forEach((id) => {
  const reg = NPC_SPRITE_REGISTRY[id];
  assert(!!reg, `NPC "${id}" must be registered in NPC_SPRITE_REGISTRY`);
  assert(reg.config.frameWidth === 96, `NPC "${id}" frameWidth must be 96px`);
  assert(reg.config.frameHeight === 180, `NPC "${id}" frameHeight must be 180px`);
  assert(reg.config.baselineY === 172, `NPC "${id}" baselineY must be 172px`);
  assert(reg.config.scale === 0.25, `NPC "${id}" scale must be 0.25 for 24x45px render`);
});

// Verify NPC physical foot collision boxes
const npcBoxes = getCity1NpcCollisionBoxes(CITY1_NPCS);
assert(npcBoxes.length === CITY1_NPCS.length, 'Every NPC must have a physical foot collision box');

CITY1_NPCS.forEach((npc) => {
  // Test that attempting to walk directly inside the NPC's foot hitbox is blocked
  const isBlocked = checkFootCollision(
    npc.x,
    npc.y,
    DEFAULT_PLAYER_FOOTPRINT.width,
    DEFAULT_PLAYER_FOOTPRINT.height,
    npcBoxes,
    CITY1_CONFIG.width,
    CITY1_CONFIG.height
  );
  assert(isBlocked, `Player must not be able to walk through NPC "${npc.name}"`);

  // Test that an adjacent player 30px away is within talking distance (<= 45px)
  const nearbyNpc = findNearbyNpc(npc.x, npc.y + 30, [npc], 45);
  assert(nearbyNpc?.id === npc.id, `Adjacent player must be able to interact with NPC "${npc.name}"`);
});

console.log('✓ Test 13 Passed: All 5 NPC pixel art sprites & physical foot collisions verified');

// Test 14: Hardcoded User Roadside & Boundary Coordinates Verification
console.log('Testing hardcoded roadside & boundary coordinates...');
const userProvidedCoords = [
  { x: 130, y: 495, name: 'South Road Curb West (130, 495)' },
  { x: 194, y: 495, name: 'South Road Curb Mid (194, 495)' },
  { x: 252, y: 495, name: 'South Road Curb East (252, 495)' },
  { x: 219, y: 196, name: 'School North Courtyard Wall (219, 196)' },
  { x: 654, y: 430, name: 'South Banyan Planter / Curb (654, 430)' },
  { x: 689, y: 281, name: 'West Highway Roadside Barrier (689, 281)' },
  { x: 707, y: 276, name: 'East Highway Roadside Barrier (707, 276)' },
  { x: 737, y: 282, name: 'Hostel Approach Roadside Barrier (737, 282)' },
  { x: 980, y: 425, name: 'East Bank Alley Dead-End Wall (980, 425)' },
  { x: 151, y: 380, name: 'Western Park / Roadside Obstacle Tile (151, 380)' },
];

userProvidedCoords.forEach((pt) => {
  const isBlocked = checkFootCollision(
    pt.x,
    pt.y,
    DEFAULT_PLAYER_FOOTPRINT.width,
    DEFAULT_PLAYER_FOOTPRINT.height,
    CITY1_COLLISION_BOXES,
    CITY1_CONFIG.width,
    CITY1_CONFIG.height,
    CITY1_COLLISION_GRID
  );
  assert(isBlocked, `Point ${pt.name} must be blocked by collision geometry`);
});
console.log('✓ Test 14 Passed: All 8 hardcoded roadside/boundary coordinates are strictly blocked');

console.log('--- ALL CITY 1 WORLD ENGINE & CHARACTER TESTS PASSED SUCCESSFULLY! ---');
