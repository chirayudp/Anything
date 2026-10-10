export type RegionId = 'region_scholars_district' | 'region_prosperity_outskirts' | 'region_guardian_citadel';

export interface WorldPosition {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

export interface CityMetadata {
  id: string;
  name: string;
  regionId: RegionId;
  description: string;
  pillar: 'budget' | 'save' | 'invest' | 'safety';
  requiredPredecessorId?: string;
  x: number;
  y: number;
  color: string;
  icon: string;
}

export interface RegionMetadata {
  id: RegionId;
  name: string;
  theme: string;
  description: string;
  bannerColor: string;
  cityIds: string[];
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  avatar: string;
  x: number;
  y: number;
  cityId: string;
  dialogueIntro: Record<'en' | 'hi' | 'te', string>;
  dialogueSolved?: Record<'en' | 'hi' | 'te', string>;
  scenarioId?: string;
}

export interface InteractiveEntity {
  id: string;
  type: 'npc' | 'portal' | 'landmark' | 'kiosk';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  interactionPrompt: string;
  targetCityId?: string;
  scenarioId?: string;
}
