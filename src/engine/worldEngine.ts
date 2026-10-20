import { CollisionBox, CollisionGrid } from '../data/maps/city1Data';
import { NPC } from '../types';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PlayerFootprint {
  width: number;
  height: number;
  offsetY: number; // visual sprite offset relative to foot center
}

export const DEFAULT_PLAYER_FOOTPRINT: PlayerFootprint = {
  width: 14,
  height: 8,
  offsetY: -16,
};

/**
 * Checks if two axis-aligned bounding boxes intersect.
 */
export function rectsIntersect(a: Rect, b: Rect): boolean {
  return !(
    a.x + a.w <= b.x ||
    a.x >= b.x + b.w ||
    a.y + a.h <= b.y ||
    a.y >= b.y + b.h
  );
}

/**
 * Evaluates whether a foot bounding box collides with the spatial collision grid.
 */
export function checkGridCollision(
  footX: number,
  footY: number,
  footW: number,
  footH: number,
  grid: CollisionGrid
): boolean {
  const halfW = footW / 2;
  const halfH = footH / 2;
  const minX = footX - halfW;
  const maxX = footX + halfW;
  const minY = footY - halfH;
  const maxY = footY + halfH;

  const minCol = Math.max(0, Math.floor(minX / grid.tileSize));
  const maxCol = Math.min(grid.cols - 1, Math.floor((maxX - 0.001) / grid.tileSize));
  const minRow = Math.max(0, Math.floor(minY / grid.tileSize));
  const maxRow = Math.min(grid.rows - 1, Math.floor((maxY - 0.001) / grid.tileSize));

  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      if (grid.cells[r * grid.cols + c] === 1) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Evaluates whether a foot bounding box collides with map bounds or collision geometry.
 * Supports both continuous AABB boxes and compiled spatial tile collision grid.
 */
export function checkFootCollision(
  footX: number,
  footY: number,
  footW: number,
  footH: number,
  boxes: CollisionBox[],
  mapW: number,
  mapH: number,
  grid?: CollisionGrid
): boolean {
  const halfW = footW / 2;
  const halfH = footH / 2;

  // Perimeter boundary check
  if (
    footX - halfW < 0 ||
    footX + halfW > mapW ||
    footY - halfH < 0 ||
    footY + halfH > mapH
  ) {
    return true;
  }

  // Check spatial grid if provided
  if (grid && checkGridCollision(footX, footY, footW, footH, grid)) {
    return true;
  }

  const footRect: Rect = {
    x: footX - halfW,
    y: footY - halfH,
    w: footW,
    h: footH,
  };

  for (const box of boxes) {
    if (
      rectsIntersect(footRect, {
        x: box.x,
        y: box.y,
        w: box.w,
        h: box.h,
      })
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Advanced 4-directional continuous collision & corner-assist movement engine.
 * Features:
 * - Sub-pixel continuous collision resolution (walks flush against obstacles with zero bounce or buffer gap)
 * - Intelligent corner assist (nudges character around door frames and wall corners instead of dead-stopping)
 * - Smooth wall sliding
 * - Strict cardinal direction enforcement
 * - Dual-layer collision verification (AABB bounding geometries + 8x8 spatial tile grid)
 */
export function slideMove(
  curX: number,
  curY: number,
  rawDx: number,
  rawDy: number,
  footprint: PlayerFootprint,
  boxes: CollisionBox[],
  mapW: number,
  mapH: number,
  grid?: CollisionGrid
): { x: number; y: number; moved: boolean } {
  if (rawDx === 0 && rawDy === 0) {
    return { x: curX, y: curY, moved: false };
  }

  // 1. Strictly enforce 4-way movement (no diagonal)
  let dx = rawDx;
  let dy = rawDy;
  if (dx !== 0 && dy !== 0) {
    if (Math.abs(dx) >= Math.abs(dy)) {
      dy = 0;
    } else {
      dx = 0;
    }
  }

  const targetX = curX + dx;
  const targetY = curY + dy;

  // 2. Direct unobstructed move
  if (!checkFootCollision(targetX, targetY, footprint.width, footprint.height, boxes, mapW, mapH, grid)) {
    return { x: targetX, y: targetY, moved: true };
  }

  // 3. Corner Assist: check if small perpendicular nudge frees the path around corners/doorways
  const cornerAssistMax = 6;
  if (dy !== 0 && dx === 0) {
    for (let offset = 1; offset <= cornerAssistMax; offset++) {
      for (const sign of [1, -1]) {
        const nudgeX = curX + sign * offset;
        if (
          !checkFootCollision(nudgeX, curY, footprint.width, footprint.height, boxes, mapW, mapH, grid) &&
          !checkFootCollision(nudgeX, targetY, footprint.width, footprint.height, boxes, mapW, mapH, grid)
        ) {
          const actualNudge = Math.sign(sign) * Math.min(offset, 1.8);
          const nextX = curX + actualNudge;
          return { x: nextX, y: targetY, moved: true };
        }
      }
    }
  } else if (dx !== 0 && dy === 0) {
    for (let offset = 1; offset <= cornerAssistMax; offset++) {
      for (const sign of [1, -1]) {
        const nudgeY = curY + sign * offset;
        if (
          !checkFootCollision(curX, nudgeY, footprint.width, footprint.height, boxes, mapW, mapH, grid) &&
          !checkFootCollision(targetX, nudgeY, footprint.width, footprint.height, boxes, mapW, mapH, grid)
        ) {
          const actualNudge = Math.sign(sign) * Math.min(offset, 1.8);
          const nextY = curY + actualNudge;
          return { x: targetX, y: nextY, moved: true };
        }
      }
    }
  }

  // 4. Sub-pixel continuous approach: move as close to the wall as mathematically possible
  let bestDist = 0;
  const isHoriz = dx !== 0;
  const totalDist = Math.abs(isHoriz ? dx : dy);
  const dir = Math.sign(isHoriz ? dx : dir_sign(isHoriz, dx, dy));

  let low = 0;
  let high = totalDist;
  for (let i = 0; i < 6; i++) {
    const mid = (low + high) / 2;
    const testX = isHoriz ? curX + dir * mid : curX;
    const testY = !isHoriz ? curY + dir * mid : curY;
    if (!checkFootCollision(testX, testY, footprint.width, footprint.height, boxes, mapW, mapH, grid)) {
      bestDist = mid;
      low = mid;
    } else {
      high = mid;
    }
  }

  if (bestDist > 0.08) {
    const finalX = isHoriz ? curX + dir * bestDist : curX;
    const finalY = !isHoriz ? curY + dir * bestDist : curY;
    return { x: finalX, y: finalY, moved: true };
  }

  return { x: curX, y: curY, moved: false };
}

function dir_sign(isHoriz: boolean, dx: number, dy: number): number {
  return isHoriz ? Math.sign(dx) : Math.sign(dy);
}

/**
 * Clamped camera follow mathematics.
 * Centers on player when inside the map, clamps to edges.
 */
export function calculateCamera(
  playerX: number,
  playerY: number,
  viewportW: number,
  viewportH: number,
  mapW: number,
  mapH: number
): { camX: number; camY: number } {
  // If viewport is larger than map, center the entire map
  let camX = 0;
  let camY = 0;

  if (viewportW >= mapW) {
    camX = (mapW - viewportW) / 2;
  } else {
    const rawX = playerX - viewportW / 2;
    camX = Math.max(0, Math.min(mapW - viewportW, rawX));
  }

  if (viewportH >= mapH) {
    camY = (mapH - viewportH) / 2;
  } else {
    const rawY = playerY - viewportH / 2;
    camY = Math.max(0, Math.min(mapH - viewportH, rawY));
  }

  return { camX, camY };
}

/**
 * Proximity entity locator for NPCs.
 */
export function findNearbyNpc(
  px: number,
  py: number,
  npcs: NPC[],
  maxDist = 75
): NPC | null {
  let closest: NPC | null = null;
  let minDist = maxDist;

  for (const npc of npcs) {
    const dist = Math.hypot(px - npc.x, py - npc.y);
    if (dist <= minDist) {
      minDist = dist;
      closest = npc;
    }
  }

  return closest;
}

/**
 * Procedural Retro Audio Synthesizer (Zero External Dependencies)
 * Provides crisp audio cues for footsteps, interactions, discoveries, and alerts.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playStep(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public playInteract(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.23);
    } catch {
      // Fallback
    }
  }

  public playDiscovery(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [440, 554.37, 659.25, 880]; // A major fanfare
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + idx * 0.06;
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.16);
      });
    } catch {
      // Fallback
    }
  }

  public playBlocked(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Fallback
    }
  }
}

export const WorldAudio = new SoundEngine();
