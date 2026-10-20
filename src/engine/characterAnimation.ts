/**
 * Character & NPC Pixel Art Sprite Animation Engine
 * Supports 4-way direction cycles, accumulative frame timing,
 * ground baseline alignment, and extensible NPC sprite registration.
 */

export type CharacterDirection = 'up' | 'down' | 'left' | 'right';

export interface SpriteSheetConfig {
  frameWidth: number;
  frameHeight: number;
  baselineY: number; // Y offset from top of frame where feet touch the ground
  scale: number;
  rows: {
    idle_down: number;
    walk_down: number;
    walk_up: number;
    walk_left: number;
    walk_right: number;
  };
  frameCount: {
    idle: number;
    walk: number;
  };
  frameDurationMs: {
    idle: number;
    walk: number;
  };
}

/**
 * Main Player Character Sprite Configuration (Normalized 48x72 Grid)
 * Row 0: Idle South / Down (8 frames)
 * Row 1: Walk South / Down (8 frames)
 * Row 2: Walk North / Up (8 frames)
 * Row 3: Walk West / Left (8 frames)
 * Row 4: Walk East / Right (8 frames)
 */
export const PLAYER_SPRITE_CONFIG: SpriteSheetConfig = {
  frameWidth: 48,
  frameHeight: 72,
  baselineY: 68,
  scale: 0.58, // Scaled to ~28x42 px, matching 14px foot width and top-down map scale
  rows: {
    idle_down: 0,
    walk_down: 1,
    walk_up: 2,
    walk_left: 3,
    walk_right: 4,
  },
  frameCount: {
    idle: 8,
    walk: 8,
  },
  frameDurationMs: {
    idle: 220, // Gentle idle stance cycle
    walk: 105, // Responsive 8-frame walk cycle cadence
  },
};

/**
 * Extensible NPC Sprite Registry.
 * Allows new NPC spritesheets to be registered and rendered seamlessly
 * as their artwork assets become available during development.
 */
export interface NpcSpriteEntry {
  imageSrc: string;
  config: SpriteSheetConfig;
}

/**
 * Standard NPC Sprite Sheet Configuration (96x180 Grid, 2 cols x 5 rows)
 * Row 0: Idle South / Down (2 frames)
 * Row 1: Walk South / Down (2 frames)
 * Row 2: Walk North / Up (2 frames)
 * Row 3: Walk West / Left (2 frames)
 * Row 4: Walk East / Right (2 frames)
 */
export const NPC_DEFAULT_SPRITE_CONFIG: SpriteSheetConfig = {
  frameWidth: 96,
  frameHeight: 180,
  baselineY: 172,
  scale: 0.25, // Scaled to ~24x45 px, matching player character scale (~28x42 px)
  rows: {
    idle_down: 0,
    walk_down: 1,
    walk_up: 2,
    walk_left: 3,
    walk_right: 4,
  },
  frameCount: {
    idle: 2,
    walk: 2,
  },
  frameDurationMs: {
    idle: 480,
    walk: 220,
  },
};

export const NPC_SPRITE_REGISTRY: Record<string, NpcSpriteEntry> = {
  npc_hostel_warden: {
    imageSrc: '/assets/characters/npcs/hostel_warden_spritesheet.png',
    config: NPC_DEFAULT_SPRITE_CONFIG,
  },
  npc_repair_tech: {
    imageSrc: '/assets/characters/npcs/repair_tech_spritesheet.png',
    config: NPC_DEFAULT_SPRITE_CONFIG,
  },
  npc_canteen_manager: {
    imageSrc: '/assets/characters/npcs/tea_vendor_spritesheet.png',
    config: NPC_DEFAULT_SPRITE_CONFIG,
  },
  npc_senior_librarian: {
    imageSrc: '/assets/characters/npcs/teacher_spritesheet.png',
    config: NPC_DEFAULT_SPRITE_CONFIG,
  },
  npc_security_guard: {
    imageSrc: '/assets/characters/npcs/watchman_spritesheet.png',
    config: NPC_DEFAULT_SPRITE_CONFIG,
  },
  npc_anand_senior: {
    imageSrc: '/assets/characters/npcs/anand_spritesheet.png',
    config: NPC_DEFAULT_SPRITE_CONFIG,
  },
  npc_bookshop_owner: {
    imageSrc: '/assets/characters/npcs/bookshop_keeper_spritesheet.png',
    config: NPC_DEFAULT_SPRITE_CONFIG,
  },
  npc_student_friend: {
    imageSrc: '/assets/characters/npcs/student_friend_spritesheet.png',
    config: NPC_DEFAULT_SPRITE_CONFIG,
  },
  // City 2 NPCs
  npc_cycle_mechanic: {
    imageSrc: '/assets/characters/npcs/cycle_mechanic_spritesheet.png',
    config: NPC_DEFAULT_SPRITE_CONFIG,
  },
  npc_bazaar_merchant: {
    imageSrc: '/assets/characters/npcs/bookshop_keeper_spritesheet.png',
    config: NPC_DEFAULT_SPRITE_CONFIG,
  },
  npc_post_office_teller: {
    imageSrc: '/assets/characters/npcs/post_teller_spritesheet.png',
    config: NPC_DEFAULT_SPRITE_CONFIG,
  },
  npc_professor_sharma: {
    imageSrc: '/assets/characters/npcs/teacher_spritesheet.png',
    config: NPC_DEFAULT_SPRITE_CONFIG,
  },
  npc_student_kabir_city2: {
    imageSrc: '/assets/characters/npcs/student_friend_spritesheet.png',
    config: NPC_DEFAULT_SPRITE_CONFIG,
  },
  // City 4 NPCs
  npc_dock_master_tariq: {
    imageSrc: '/assets/characters/npcs/dock_master_sprite.png',
    config: {
      frameWidth: 125,
      frameHeight: 140,
      baselineY: 135,
      scale: 0.28,
      rows: { idle_down: 0, walk_down: 0, walk_up: 0, walk_left: 0, walk_right: 0 },
      frameCount: { idle: 1, walk: 1 },
      frameDurationMs: { idle: 1000, walk: 1000 },
    },
  },
  npc_atm_officer_vikram: {
    imageSrc: '/assets/characters/npcs/watchman_spritesheet.png',
    config: NPC_DEFAULT_SPRITE_CONFIG,
  },
  npc_fishmonger_lakshmi: {
    imageSrc: '/assets/characters/npcs/fishmonger_sprite.png',
    config: {
      frameWidth: 100,
      frameHeight: 115,
      baselineY: 110,
      scale: 0.30,
      rows: { idle_down: 0, walk_down: 0, walk_up: 0, walk_left: 0, walk_right: 0 },
      frameCount: { idle: 1, walk: 1 },
      frameDurationMs: { idle: 1000, walk: 1000 },
    },
  },
  npc_curator_anand: {
    imageSrc: '/assets/characters/npcs/museum_curator_sprite.png',
    config: {
      frameWidth: 110,
      frameHeight: 120,
      baselineY: 115,
      scale: 0.30,
      rows: { idle_down: 0, walk_down: 0, walk_up: 0, walk_left: 0, walk_right: 0 },
      frameCount: { idle: 1, walk: 1 },
      frameDurationMs: { idle: 1000, walk: 1000 },
    },
  },
  npc_groundskeeper_deva: {
    imageSrc: '/assets/characters/npcs/groundskeeper_sprite.png',
    config: {
      frameWidth: 110,
      frameHeight: 130,
      baselineY: 125,
      scale: 0.28,
      rows: { idle_down: 0, walk_down: 0, walk_up: 0, walk_left: 0, walk_right: 0 },
      frameCount: { idle: 1, walk: 1 },
      frameDurationMs: { idle: 1000, walk: 1000 },
    },
  },
};

export const DOCK_MASTER_SPRITE_CONFIG: SpriteSheetConfig = {
  frameWidth: 125,
  frameHeight: 140,
  baselineY: 135,
  scale: 0.28,
  rows: { idle_down: 0, walk_down: 0, walk_up: 0, walk_left: 0, walk_right: 0 },
  frameCount: { idle: 1, walk: 1 },
  frameDurationMs: { idle: 1000, walk: 1000 },
};

export const FISHMONGER_SPRITE_CONFIG: SpriteSheetConfig = {
  frameWidth: 100,
  frameHeight: 115,
  baselineY: 110,
  scale: 0.30,
  rows: { idle_down: 0, walk_down: 0, walk_up: 0, walk_left: 0, walk_right: 0 },
  frameCount: { idle: 1, walk: 1 },
  frameDurationMs: { idle: 1000, walk: 1000 },
};

export const CURATOR_SPRITE_CONFIG: SpriteSheetConfig = {
  frameWidth: 110,
  frameHeight: 120,
  baselineY: 115,
  scale: 0.30,
  rows: { idle_down: 0, walk_down: 0, walk_up: 0, walk_left: 0, walk_right: 0 },
  frameCount: { idle: 1, walk: 1 },
  frameDurationMs: { idle: 1000, walk: 1000 },
};

export const GROUNDSKEEPER_SPRITE_CONFIG: SpriteSheetConfig = {
  frameWidth: 110,
  frameHeight: 130,
  baselineY: 125,
  scale: 0.28,
  rows: { idle_down: 0, walk_down: 0, walk_up: 0, walk_left: 0, walk_right: 0 },
  frameCount: { idle: 1, walk: 1 },
  frameDurationMs: { idle: 1000, walk: 1000 },
};

/**
 * Register or update an NPC's sprite sheet when new assets arrive.
 */
export function registerNpcSprite(npcId: string, entry: NpcSpriteEntry): void {
  NPC_SPRITE_REGISTRY[npcId] = entry;
}

/**
 * Resolves the spritesheet row and frame column for a given movement state and direction.
 */
export function getSpriteFrameCoordinates(
  direction: CharacterDirection,
  isMoving: boolean,
  animatedFrameIndex: number,
  config: SpriteSheetConfig
): { row: number; col: number } {
  if (isMoving) {
    const col = animatedFrameIndex % config.frameCount.walk;
    switch (direction) {
      case 'down':
        return { row: config.rows.walk_down, col };
      case 'up':
        return { row: config.rows.walk_up, col };
      case 'left':
        return { row: config.rows.walk_left, col };
      case 'right':
        return { row: config.rows.walk_right, col };
    }
  }

  // Idle Stance: Down plays subtle breathing/blinking cycle; others show stationary profile frame
  switch (direction) {
    case 'down':
      return {
        row: config.rows.idle_down,
        col: animatedFrameIndex % config.frameCount.idle,
      };
    case 'up':
      return { row: config.rows.walk_up, col: 0 };
    case 'left':
      return { row: config.rows.walk_left, col: 0 };
    case 'right':
      return { row: config.rows.walk_right, col: 0 };
  }
}

/**
 * Renders a character sprite onto a 2D canvas context with 2.5D foot alignment and ground shadow.
 */
export function renderCharacterSprite(
  ctx: CanvasRenderingContext2D,
  spriteImage: HTMLImageElement,
  worldX: number,
  worldY: number,
  direction: CharacterDirection,
  isMoving: boolean,
  animatedFrameIndex: number,
  config: SpriteSheetConfig,
  renderShadow = true
): void {
  // 1. Draw logical foot shadow
  if (renderShadow) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(worldX, worldY + 1, 11 * (config.scale / 0.58), 4.5 * (config.scale / 0.58), 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Resolve source frame slice
  const { row, col } = getSpriteFrameCoordinates(
    direction,
    isMoving,
    animatedFrameIndex,
    config
  );

  const srcX = col * config.frameWidth;
  const srcY = row * config.frameHeight;
  const srcW = config.frameWidth;
  const srcH = config.frameHeight;

  // 3. Compute destination dimensions aligned to foot baseline
  const destW = Math.round(config.frameWidth * config.scale);
  const destH = Math.round(config.frameHeight * config.scale);
  const baselineScaled = Math.round(config.baselineY * config.scale);

  const destX = Math.round(worldX - destW / 2);
  const destY = Math.round(worldY - baselineScaled);

  // 4. Render pixel-crisp sprite
  const prevSmoothing = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;

  ctx.drawImage(
    spriteImage,
    srcX,
    srcY,
    srcW,
    srcH,
    destX,
    destY,
    destW,
    destH
  );

  ctx.imageSmoothingEnabled = prevSmoothing;
}
