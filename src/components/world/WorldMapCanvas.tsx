import React, { useRef, useEffect, useState, useCallback } from 'react';
import { StudentProfile, GameLanguage, NPC } from '../../types';
import {
  CITY1_CONFIG,
  CITY1_COLLISION_BOXES,
  CITY1_COLLISION_GRID,
  CITY1_NPCS,
  CITY1_INTERACTIVES,
  CityObject,
  getCity1NpcCollisionBoxes,
} from '../../data/maps/city1Data';
import {
  CITY2_CONFIG,
  CITY2_COLLISION_BOXES,
  CITY2_COLLISION_GRID,
  CITY2_NPCS,
  CITY2_INTERACTIVES,
  getCity2NpcCollisionBoxes,
} from '../../data/maps/city2Data';
import {
  CITY3_CONFIG,
  CITY3_COLLISION_BOXES,
  CITY3_COLLISION_GRID,
  CITY3_NPCS,
  CITY3_INTERACTIVES,
  getCity3NpcCollisionBoxes,
} from '../../data/maps/city3Data';
import {
  CITY4_CONFIG,
  CITY4_COLLISION_BOXES,
  CITY4_COLLISION_GRID,
  CITY4_NPCS,
  CITY4_INTERACTIVES,
  getCity4NpcCollisionBoxes,
} from '../../data/maps/city4Data';
import {
  DEFAULT_PLAYER_FOOTPRINT,
  slideMove,
  calculateCamera,
  WorldAudio,
} from '../../engine/worldEngine';
import { GameEngine } from '../../engine/gameEngine';
import { GameStorage } from '../../engine/storage';
import { ObjectInspectionModal } from './ObjectInspectionModal';
import city1MapImageSrc from '../../assets/maps/city1_map.jpg';
import city2MapImageSrc from '../../assets/maps/city2_map.jpg';
import city3MapImageSrc from '../../assets/maps/city3_map.jpg';
import city4MapImageSrc from '../../assets/maps/city4_map.jpg';
import playerSpriteSheetSrc from '../../assets/characters/player_spritesheet.png';
import girlSpriteSheetSrc from '../../assets/characters/girl_spritesheet.png';
import teacherSpriteSheetSrc from '../../assets/characters/npcs/teacher_spritesheet.png';
import watchmanSpriteSheetSrc from '../../assets/characters/npcs/watchman_spritesheet.png';
import hostelWardenSpriteSheetSrc from '../../assets/characters/npcs/hostel_warden_spritesheet.png';
import repairTechSpriteSheetSrc from '../../assets/characters/npcs/repair_tech_spritesheet.png';
import teaVendorSpriteSheetSrc from '../../assets/characters/npcs/tea_vendor_spritesheet.png';
import anandSpriteSheetSrc from '../../assets/characters/npcs/anand_spritesheet.png';
import bookshopKeeperSpriteSheetSrc from '../../assets/characters/npcs/bookshop_keeper_spritesheet.png';
import studentFriendSpriteSheetSrc from '../../assets/characters/npcs/student_friend_spritesheet.png';
import cycleMechanicSpriteSheetSrc from '../../assets/characters/npcs/cycle_mechanic_spritesheet.png';
import postTellerSpriteSheetSrc from '../../assets/characters/npcs/post_teller_spritesheet.png';
import boatDriverSpriteSheetSrc from '../../assets/characters/npcs/boat_driver_spritesheet.png';
import dockMasterSpriteSrc from '../../assets/characters/npcs/dock_master_sprite.png';
import fishmongerSpriteSrc from '../../assets/characters/npcs/fishmonger_sprite.png';
import museumCuratorSpriteSrc from '../../assets/characters/npcs/museum_curator_sprite.png';
import groundskeeperSpriteSrc from '../../assets/characters/npcs/groundskeeper_sprite.png';
import postalDeskSrc from '../../assets/props/postal_desk.png';
import {
  CharacterDirection,
  PLAYER_SPRITE_CONFIG,
  NPC_DEFAULT_SPRITE_CONFIG,
  DOCK_MASTER_SPRITE_CONFIG,
  FISHMONGER_SPRITE_CONFIG,
  CURATOR_SPRITE_CONFIG,
  GROUNDSKEEPER_SPRITE_CONFIG,
  NPC_SPRITE_REGISTRY,
  registerNpcSprite,
  renderCharacterSprite,
} from '../../engine/characterAnimation';
import {
  MapPin,
  Compass,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Trophy,
} from 'lucide-react';

interface WorldMapCanvasProps {
  profile: StudentProfile;
  language: GameLanguage;
  onInteractWithNpc: (npc: NPC) => void;
  onEnterCity: (cityId: string) => void;
  onResetWallet?: () => void;
  onOpenGameCompletion?: () => void;
}

export const WorldMapCanvas: React.FC<WorldMapCanvasProps> = ({
  profile,
  language,
  onInteractWithNpc,
  onEnterCity,
  onResetWallet,
  onOpenGameCompletion,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Restore saved city and player position if available
  const savedWorldRef = useRef(GameStorage.getSavedWorldState());
  const initialWorld = savedWorldRef.current;

  // Active City Navigation State
  const [currentCityId, setCurrentCityId] = useState<
    'city_hostel_commons' | 'city_academic_bazaar' | 'city_investment_valley' | 'city_harbor_town'
  >(() => {
    if (
      initialWorld?.cityId === 'city_harbor_town' ||
      initialWorld?.cityId === 'city_investment_valley' ||
      initialWorld?.cityId === 'city_academic_bazaar' ||
      initialWorld?.cityId === 'city_hostel_commons'
    ) {
      return initialWorld.cityId;
    }
    if ((profile.currentCityId as any) === 'city_harbor_town') return 'city_harbor_town';
    if ((profile.currentCityId as any) === 'city_investment_valley') return 'city_investment_valley';
    if ((profile.currentCityId as any) === 'city_academic_bazaar') return 'city_academic_bazaar';
    return 'city_hostel_commons';
  });

  const isCity1 = currentCityId === 'city_hostel_commons';
  const isCity2 = currentCityId === 'city_academic_bazaar';
  const isCity3 = currentCityId === 'city_investment_valley';
  const isCity4 = currentCityId === 'city_harbor_town';

  const activeConfig = isCity1
    ? CITY1_CONFIG
    : isCity2
    ? CITY2_CONFIG
    : isCity3
    ? CITY3_CONFIG
    : CITY4_CONFIG;
  const activeCollisionBoxes = isCity1
    ? CITY1_COLLISION_BOXES
    : isCity2
    ? CITY2_COLLISION_BOXES
    : isCity3
    ? CITY3_COLLISION_BOXES
    : CITY4_COLLISION_BOXES;
  const activeCollisionGrid = isCity1
    ? CITY1_COLLISION_GRID
    : isCity2
    ? CITY2_COLLISION_GRID
    : isCity3
    ? CITY3_COLLISION_GRID
    : CITY4_COLLISION_GRID;
  const activeNpcs = isCity1 ? CITY1_NPCS : isCity2 ? CITY2_NPCS : isCity3 ? CITY3_NPCS : CITY4_NPCS;
  const activeInteractives = isCity1
    ? CITY1_INTERACTIVES
    : isCity2
    ? CITY2_INTERACTIVES
    : isCity3
    ? CITY3_INTERACTIVES
    : CITY4_INTERACTIVES;
  const activeNpcBoxes = isCity1
    ? getCity1NpcCollisionBoxes(CITY1_NPCS)
    : isCity2
    ? getCity2NpcCollisionBoxes(CITY2_NPCS)
    : isCity3
    ? getCity3NpcCollisionBoxes(CITY3_NPCS)
    : getCity4NpcCollisionBoxes(CITY4_NPCS);

  // Player state restored from saved position
  const [player, setPlayer] = useState(() => {
    if (initialWorld && typeof initialWorld.x === 'number' && typeof initialWorld.y === 'number') {
      const targetConfig =
        initialWorld.cityId === 'city_harbor_town'
          ? CITY4_CONFIG
          : initialWorld.cityId === 'city_investment_valley'
          ? CITY3_CONFIG
          : initialWorld.cityId === 'city_academic_bazaar'
          ? CITY2_CONFIG
          : CITY1_CONFIG;
      if (
        initialWorld.x > 10 &&
        initialWorld.x < targetConfig.width - 10 &&
        initialWorld.y > 10 &&
        initialWorld.y < targetConfig.height - 10
      ) {
        return {
          x: Math.round(initialWorld.x),
          y: Math.round(initialWorld.y),
          direction: initialWorld.direction || targetConfig.spawnPoint.direction,
          speed: 3.2,
          isMoving: false,
          frame: 0,
        };
      }
    }
    return {
      x: CITY1_CONFIG.spawnPoint.x,
      y: CITY1_CONFIG.spawnPoint.y,
      direction: CITY1_CONFIG.spawnPoint.direction as 'up' | 'down' | 'left' | 'right',
      speed: 3.2,
      isMoving: false,
      frame: 0,
    };
  });

  // Persist world position when stationary and ensure world screen is recorded
  useEffect(() => {
    if (!player.isMoving) {
      GameStorage.saveWorldState({
        cityId: currentCityId,
        x: Math.round(player.x),
        y: Math.round(player.y),
        direction: player.direction,
      });
      GameStorage.saveScreen('world');
    }
  }, [player.isMoving, player.x, player.y, player.direction, currentCityId]);

  // Persist current location on browser reload or navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      GameStorage.saveWorldState({
        cityId: currentCityId,
        x: Math.round(player.x),
        y: Math.round(player.y),
        direction: player.direction,
      });
      GameStorage.saveScreen('world');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentCityId, player.x, player.y, player.direction]);

  // Map image state & preloaded references for City 1, City 2, City 3 & City 4
  const [mapImageLoaded, setMapImageLoaded] = useState<boolean>(false);
  const [mapImageError, setMapImageError] = useState<boolean>(false);
  const city1MapRef = useRef<HTMLImageElement | null>(null);
  const city2MapRef = useRef<HTMLImageElement | null>(null);
  const city3MapRef = useRef<HTMLImageElement | null>(null);
  const city4MapRef = useRef<HTMLImageElement | null>(null);

  // Player & NPC Pixel Art Sprite Sheet State
  const [playerSpriteLoaded, setPlayerSpriteLoaded] = useState<boolean>(false);
  const playerSpriteRef = useRef<HTMLImageElement | null>(null);
  const animFrameCounter = useRef<number>(0);
  const animTimerAccumulator = useRef<number>(0);
  const lastLoopTimestamp = useRef<number>(0);
  const npcSpriteImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const postalDeskRef = useRef<HTMLImageElement | null>(null);

  // Proximity states
  const [nearbyNpc, setNearbyNpc] = useState<NPC | null>(null);
  const [nearbyObject, setNearbyObject] = useState<CityObject | null>(null);
  const [activeInspectObject, setActiveInspectObject] = useState<CityObject | null>(null);

  // Controls & Camera Settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showHitboxes, setShowHitboxes] = useState<boolean>(false);
  const [cameraZoom, setCameraZoom] = useState<'follow' | 'overview'>('overview');
  const [zoomLevel, setZoomLevel] = useState<number>(2.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [transitionNotification, setTransitionNotification] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Input management
  const activeDirStackRef = useRef<Array<'up' | 'down' | 'left' | 'right'>>([]);
  const lastStepSoundTime = useRef<number>(0);
  const clickTarget = useRef<{ x: number; y: number } | null>(null);

  // Per-NPC quest completion check
  const isNpcSolved = useCallback(
    (npc: NPC): boolean => {
      if (!npc.scenarioId) return true;
      return GameEngine.isScenarioSolved(npc.scenarioId, profile);
    },
    [profile]
  );

  // All quest-giving NPCs in the current city (City 1, City 2, City 3, or City 4)
  const currentCityQuestNpcs = activeNpcs.filter((n) => Boolean(n.scenarioId));
  const completedQuestCount = currentCityQuestNpcs.filter((n) => isNpcSolved(n)).length;
  const totalQuestCount = currentCityQuestNpcs.length;

  // Navigational arrow & portal unlock ONLY when ALL quests in the active city are completed
  const areAllQuestsCompleted = totalQuestCount > 0 && completedQuestCount === totalQuestCount;

  // Auto-trigger Grand Game Completion graduation celebration modal when City 4 completes
  const [hasCelebratedCompletion, setHasCelebratedCompletion] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('moneyquest_celebration_shown') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isCity4 && areAllQuestsCompleted && !hasCelebratedCompletion) {
      setHasCelebratedCompletion(true);
      try {
        sessionStorage.setItem('moneyquest_celebration_shown', 'true');
      } catch {}
      if (onOpenGameCompletion) {
        const timer = setTimeout(() => {
          onOpenGameCompletion();
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [isCity4, areAllQuestsCompleted, hasCelebratedCompletion, onOpenGameCompletion]);

  // Load Map Assets with Cache Invalidation & Fallback Protection for City 1, City 2, City 3 and City 4
  useEffect(() => {
    const img1 = new Image();
    img1.src = `${city1MapImageSrc}?v=${Date.now()}`;
    img1.onload = () => {
      city1MapRef.current = img1;
      setMapImageLoaded(true);
      setMapImageError(false);
    };
    img1.onerror = () => {
      console.warn('City 1 map asset could not be loaded directly.');
      setMapImageError(true);
      setMapImageLoaded(true);
    };

    const img2 = new Image();
    img2.src = `${city2MapImageSrc}?v=${Date.now()}`;
    img2.onload = () => {
      city2MapRef.current = img2;
    };
    img2.onerror = () => {
      console.warn('City 2 map asset could not be loaded directly.');
    };

    const img3 = new Image();
    img3.src = `${city3MapImageSrc}?v=${Date.now()}`;
    img3.onload = () => {
      city3MapRef.current = img3;
    };
    img3.onerror = () => {
      console.warn('City 3 map asset could not be loaded directly.');
    };

    const img4 = new Image();
    img4.src = `${city4MapImageSrc}?v=${Date.now()}`;
    img4.onload = () => {
      city4MapRef.current = img4;
    };
    img4.onerror = () => {
      console.warn('City 4 map asset could not be loaded directly.');
    };

    return () => {
      img1.onload = null;
      img1.onerror = null;
      img2.onload = null;
      img2.onerror = null;
      img3.onload = null;
      img3.onerror = null;
      img4.onload = null;
      img4.onerror = null;
    };
  }, []);

  // Register NPC pixel art spritesheets into the animation registry (City 1, City 2, City 3 & City 4)
  useEffect(() => {
    registerNpcSprite('npc_hostel_warden', { imageSrc: hostelWardenSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    registerNpcSprite('npc_repair_tech', { imageSrc: repairTechSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    registerNpcSprite('npc_canteen_manager', { imageSrc: teaVendorSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    registerNpcSprite('npc_senior_librarian', { imageSrc: teacherSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    registerNpcSprite('npc_security_guard', { imageSrc: watchmanSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    registerNpcSprite('npc_anand_senior', { imageSrc: anandSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    registerNpcSprite('npc_bookshop_owner', { imageSrc: bookshopKeeperSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    registerNpcSprite('npc_student_friend', { imageSrc: studentFriendSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    // City 2 NPCs (Cycle Mechanic, Bazaar Merchant, Post Office Teller, Professor Sharma, Kabir)
    registerNpcSprite('npc_cycle_mechanic', { imageSrc: cycleMechanicSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    registerNpcSprite('npc_bazaar_merchant', { imageSrc: bookshopKeeperSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    registerNpcSprite('npc_post_office_teller', { imageSrc: postTellerSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    registerNpcSprite('npc_professor_sharma', { imageSrc: teacherSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    registerNpcSprite('npc_student_kabir_city2', { imageSrc: studentFriendSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    // City 3 NPCs (Mali Kaka, Boat Master Kabir, Meera, Uncle Karim, Counselor Deepa)
    registerNpcSprite('npc_mali_kaka', { imageSrc: watchmanSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    registerNpcSprite('npc_boat_master_kabir', { imageSrc: boatDriverSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    registerNpcSprite('npc_meera_club_president', { imageSrc: teacherSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    registerNpcSprite('npc_uncle_karim', { imageSrc: anandSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    registerNpcSprite('npc_counselor_deepa', { imageSrc: postTellerSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    // City 4 NPCs (Dock Master Tariq, Officer Vikram, Fishmonger Lakshmi, Curator Anand, Groundskeeper Deva)
    registerNpcSprite('npc_dock_master_tariq', { imageSrc: dockMasterSpriteSrc, config: DOCK_MASTER_SPRITE_CONFIG });
    registerNpcSprite('npc_atm_officer_vikram', { imageSrc: watchmanSpriteSheetSrc, config: NPC_DEFAULT_SPRITE_CONFIG });
    registerNpcSprite('npc_fishmonger_lakshmi', { imageSrc: fishmongerSpriteSrc, config: FISHMONGER_SPRITE_CONFIG });
    registerNpcSprite('npc_curator_anand', { imageSrc: museumCuratorSpriteSrc, config: CURATOR_SPRITE_CONFIG });
    registerNpcSprite('npc_groundskeeper_deva', { imageSrc: groundskeeperSpriteSrc, config: GROUNDSKEEPER_SPRITE_CONFIG });
  }, []);

  // Load Player & NPC Pixel Art Spritesheets with Dynamic Cache Invalidation
  useEffect(() => {
    const isGirl = profile.characterGender === 'girl';
    const activePlayerSrc = isGirl ? girlSpriteSheetSrc : playerSpriteSheetSrc;

    const spriteImg = new Image();
    spriteImg.src = `${activePlayerSrc}?v=${Date.now()}`;

    spriteImg.onload = () => {
      playerSpriteRef.current = spriteImg;
      setPlayerSpriteLoaded(true);
    };

    spriteImg.onerror = () => {
      console.warn('Player spritesheet could not be loaded. Falling back to stylized avatar.');
      setPlayerSpriteLoaded(false);
    };

    // Preload Postal Desk Prop
    const deskImg = new Image();
    deskImg.src = `${postalDeskSrc}?v=${Date.now()}`;
    deskImg.onload = () => {
      postalDeskRef.current = deskImg;
    };

    // Preload NPC spritesheets
    const npcSources: Record<string, string> = {
      npc_hostel_warden: hostelWardenSpriteSheetSrc,
      npc_repair_tech: repairTechSpriteSheetSrc,
      npc_canteen_manager: teaVendorSpriteSheetSrc,
      npc_senior_librarian: teacherSpriteSheetSrc,
      npc_security_guard: watchmanSpriteSheetSrc,
      npc_anand_senior: anandSpriteSheetSrc,
      npc_bookshop_owner: bookshopKeeperSpriteSheetSrc,
      npc_student_friend: studentFriendSpriteSheetSrc,
      npc_cycle_mechanic: cycleMechanicSpriteSheetSrc,
      npc_bazaar_merchant: bookshopKeeperSpriteSheetSrc,
      npc_post_office_teller: postTellerSpriteSheetSrc,
      npc_professor_sharma: teacherSpriteSheetSrc,
      npc_student_kabir_city2: studentFriendSpriteSheetSrc,
      npc_mali_kaka: watchmanSpriteSheetSrc,
      npc_boat_master_kabir: boatDriverSpriteSheetSrc,
      npc_meera_club_president: teacherSpriteSheetSrc,
      npc_uncle_karim: anandSpriteSheetSrc,
      npc_counselor_deepa: postTellerSpriteSheetSrc,
      npc_dock_master_tariq: dockMasterSpriteSrc,
      npc_atm_officer_vikram: watchmanSpriteSheetSrc,
      npc_fishmonger_lakshmi: fishmongerSpriteSrc,
      npc_curator_anand: museumCuratorSpriteSrc,
      npc_groundskeeper_deva: groundskeeperSpriteSrc,
    };

    Object.entries(npcSources).forEach(([id, src]) => {
      const img = new Image();
      img.src = `${src}?v=${Date.now()}`;
      img.onload = () => {
        npcSpriteImagesRef.current.set(id, img);
      };
      npcSpriteImagesRef.current.set(id, img);
    });

    return () => {
      spriteImg.onload = null;
      spriteImg.onerror = null;
    };
  }, [profile.characterGender]);

  // Keyboard Event Listeners (Strict 4-Way Movement)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      let dir: 'up' | 'down' | 'left' | 'right' | null = null;
      if (key === 'arrowup' || key === 'w') dir = 'up';
      else if (key === 'arrowdown' || key === 's') dir = 'down';
      else if (key === 'arrowleft' || key === 'a') dir = 'left';
      else if (key === 'arrowright' || key === 'd') dir = 'right';

      if (dir) {
        clickTarget.current = null;
        activeDirStackRef.current = activeDirStackRef.current.filter((d) => d !== dir);
        activeDirStackRef.current.push(dir);
      }

      // Interaction trigger via [E] or [Space]
      if (key === 'e' || key === ' ') {
        if (nearbyNpc) {
          e.preventDefault();
          WorldAudio.playInteract();
          onInteractWithNpc(nearbyNpc);
        } else if (nearbyObject) {
          e.preventDefault();
          WorldAudio.playDiscovery();
          setActiveInspectObject(nearbyObject);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      let dir: 'up' | 'down' | 'left' | 'right' | null = null;
      if (key === 'arrowup' || key === 'w') dir = 'up';
      else if (key === 'arrowdown' || key === 's') dir = 'down';
      else if (key === 'arrowleft' || key === 'a') dir = 'left';
      else if (key === 'arrowright' || key === 'd') dir = 'right';

      if (dir) {
        activeDirStackRef.current = activeDirStackRef.current.filter((d) => d !== dir);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyNpc, nearbyObject, onInteractWithNpc]);

  // Audio mute toggle
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    WorldAudio.enabled = next;
  };

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {
          containerRef.current?.requestFullscreen().catch(() => {});
        });
      } else if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Main 60 FPS Game Loop
  useEffect(() => {
    let animationFrameId: number;
    let animTimer = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = (timestamp: number) => {
      animTimer += 0.05;

      // Update Character Sprite Animation Accumulative Frame Timer
      const deltaMs = lastLoopTimestamp.current > 0 ? Math.min(timestamp - lastLoopTimestamp.current, 100) : 16;
      lastLoopTimestamp.current = timestamp;

      animTimerAccumulator.current += deltaMs;
      const frameDuration = player.isMoving
        ? PLAYER_SPRITE_CONFIG.frameDurationMs.walk
        : PLAYER_SPRITE_CONFIG.frameDurationMs.idle;
      const maxFrames = player.isMoving
        ? PLAYER_SPRITE_CONFIG.frameCount.walk
        : PLAYER_SPRITE_CONFIG.frameCount.idle;
      while (animTimerAccumulator.current >= frameDuration) {
        animTimerAccumulator.current -= frameDuration;
        animFrameCounter.current = (animFrameCounter.current + 1) % maxFrames;
      }

      // 1. Compute Strict 4-Way Movement from Keyboard or Mouse Click Target
      let rawDx = 0;
      let rawDy = 0;

      if (activeDirStackRef.current.length > 0) {
        const activeDir = activeDirStackRef.current[activeDirStackRef.current.length - 1];
        if (activeDir === 'up') rawDy = -player.speed;
        else if (activeDir === 'down') rawDy = player.speed;
        else if (activeDir === 'left') rawDx = -player.speed;
        else if (activeDir === 'right') rawDx = player.speed;
      } else if (clickTarget.current) {
        const diffX = clickTarget.current.x - player.x;
        const diffY = clickTarget.current.y - player.y;
        if (Math.abs(diffX) > 4) {
          rawDx = Math.sign(diffX) * player.speed;
        } else if (Math.abs(diffY) > 4) {
          rawDy = Math.sign(diffY) * player.speed;
        } else {
          clickTarget.current = null;
        }
      }

      const isMoving = rawDx !== 0 || rawDy !== 0;

      // 2. Perform 2.5D Foot-Aligned Collision & Wall Sliding (incorporating NPC physical hitboxes)
      if (isMoving) {
        const dynamicCollisionBoxes = [
          ...activeCollisionBoxes,
          ...activeNpcBoxes,
        ];

        const moveResult = slideMove(
          player.x,
          player.y,
          rawDx,
          rawDy,
          DEFAULT_PLAYER_FOOTPRINT,
          dynamicCollisionBoxes,
          activeConfig.width,
          activeConfig.height,
          activeCollisionGrid
        );

        if (moveResult.moved) {
          // Play periodic step sound
          if (timestamp - lastStepSoundTime.current > 280) {
            WorldAudio.playStep();
            lastStepSoundTime.current = timestamp;
          }

          let newDir = player.direction;
          if (Math.abs(rawDx) > Math.abs(rawDy)) {
            newDir = rawDx < 0 ? 'left' : 'right';
          } else if (rawDy !== 0) {
            newDir = rawDy < 0 ? 'up' : 'down';
          }

          setPlayer((prev) => ({
            ...prev,
            x: moveResult.x,
            y: moveResult.y,
            direction: newDir,
            isMoving: true,
            frame: (prev.frame + 1) % 60,
          }));
        } else {
          setPlayer((prev) => ({ ...prev, isMoving: false }));
        }
      } else {
        if (player.isMoving) {
          setPlayer((prev) => ({ ...prev, isMoving: false }));
        }
      }

      // 3. Proximity Checks (NPCs & Objects)
      let foundNpc: NPC | null = null;
      for (const npc of activeNpcs) {
        if (Math.hypot(player.x - npc.x, player.y - npc.y) <= 45) {
          foundNpc = npc;
          break;
        }
      }
      setNearbyNpc(foundNpc);

      let foundObj: CityObject | null = null;
      if (!foundNpc) {
        for (const obj of activeInteractives) {
          if (Math.hypot(player.x - obj.x, player.y - obj.y) <= obj.radius) {
            foundObj = obj;
            break;
          }
        }
      }
      setNearbyObject(foundObj);

      // 4. Viewport & Camera Setup
      const mapW = activeConfig.width;
      const mapH = activeConfig.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      if (cameraZoom === 'follow') {
        const zoomFactor = zoomLevel;
        const viewW = canvas.width / zoomFactor;
        const viewH = canvas.height / zoomFactor;
        const { camX, camY } = calculateCamera(player.x, player.y, viewW, viewH, mapW, mapH);

        ctx.scale(zoomFactor, zoomFactor);
        ctx.translate(-camX, -camY);
      } else {
        // Overview mode: scale map to fit canvas cleanly
        const scaleX = canvas.width / mapW;
        const scaleY = canvas.height / mapH;
        ctx.scale(scaleX, scaleY);
      }

      // 5. Render Map Background Artwork (or High-Fidelity Procedural Fallback)
      const currentMapImg = isCity1
        ? city1MapRef.current
        : isCity2
        ? city2MapRef.current
        : isCity3
        ? city3MapRef.current
        : city4MapRef.current;
      if (currentMapImg && currentMapImg.complete && currentMapImg.naturalWidth > 0) {
        ctx.drawImage(currentMapImg, 0, 0, mapW, mapH);
      } else {
        // High-Fidelity Fallback Renderer
        renderProceduralMapFallback(ctx, mapW, mapH);
      }

      // 6. Environmental Atmospheric Animation (Water Ripples on Canal / Fountains / River / Harbor)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      if (isCity1) {
        for (let i = 0; i < 4; i++) {
          const rippleY = 330 + ((animTimer * 12 + i * 50) % 200);
          ctx.fillRect(25 + Math.sin(animTimer + i) * 8, rippleY, 35, 1.5);
        }
      } else if (isCity2) {
        // City 2 Central Fountain water bubbles
        for (let i = 0; i < 3; i++) {
          const bubbleY = 125 + Math.sin(animTimer * 4 + i) * 6;
          ctx.fillRect(495 + Math.cos(animTimer * 3 + i) * 10, bubbleY, 3, 3);
        }
      } else if (isCity3) {
        // City 3 River water shimmer near dock
        for (let i = 0; i < 4; i++) {
          const rippleY = 320 + ((animTimer * 10 + i * 60) % 220);
          ctx.fillRect(940 + Math.sin(animTimer + i) * 12, rippleY, 40, 2);
        }
      } else {
        // City 4 Harbor water shimmer near pier / docks
        for (let i = 0; i < 4; i++) {
          const rippleY = 480 + ((animTimer * 8 + i * 40) % 70);
          ctx.fillRect(440 + Math.sin(animTimer + i) * 10, rippleY, 30, 2);
        }
      }

      // 7. Render Development Collision Debug Overlay (Visualizes blocked & walkable spatial grid)
      if (showHitboxes) {
        // A. Visualise 8x8 Spatial Collision Grid (blocked tiles in translucent red)
        const ts = activeCollisionGrid.tileSize;
        const cols = activeCollisionGrid.cols;
        const rows = activeCollisionGrid.rows;
        const cells = activeCollisionGrid.cells;

        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (cells[r * cols + c] === 1) {
              ctx.fillRect(c * ts, r * ts, ts, ts);
            }
          }
        }

        // B. Obstacle Physical Boundary Outlines
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1;
        activeCollisionBoxes.forEach((b) => {
          ctx.strokeRect(b.x, b.y, b.w, b.h);
        });

        // C. NPC Foot Hitboxes (Translucent amber)
        ctx.fillStyle = 'rgba(245, 158, 11, 0.45)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        activeNpcBoxes.forEach((b) => {
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.strokeRect(b.x, b.y, b.w, b.h);
        });

        // C. Player Footprint Hitbox (Walk contact area)
        ctx.fillStyle = 'rgba(34, 197, 94, 0.7)';
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 1.5;
        const halfFootW = DEFAULT_PLAYER_FOOTPRINT.width / 2;
        const halfFootH = DEFAULT_PLAYER_FOOTPRINT.height / 2;
        ctx.fillRect(player.x - halfFootW, player.y - halfFootH, DEFAULT_PLAYER_FOOTPRINT.width, DEFAULT_PLAYER_FOOTPRINT.height);
        ctx.strokeRect(player.x - halfFootW, player.y - halfFootH, DEFAULT_PLAYER_FOOTPRINT.width, DEFAULT_PLAYER_FOOTPRINT.height);

        // D. Development HUD Badge
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(player.x - 46, player.y - 38, 92, 16);
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(player.x - 46, player.y - 38, 92, 16);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`COLLISION GRID 8x8`, player.x, player.y - 27);
      }

      // 8. Render Interactive Objects & Collectibles
      activeInteractives.forEach((obj) => {
        const isNearby = nearbyObject?.id === obj.id;
        const pulse = Math.sin(animTimer * 3) * 3;

        // Ground Beacon Ring
        ctx.strokeStyle = isNearby ? '#f59e0b' : '#38bdf8';
        ctx.lineWidth = isNearby ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y + 4, 14 + pulse, 0, Math.PI * 2);
        ctx.stroke();

        // Kiosk Icon Card
        ctx.fillStyle = isNearby ? 'rgba(245, 158, 11, 0.95)' : 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = isNearby ? '#ffffff' : '#64748b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(obj.x - 14, obj.y - 18, 28, 24, 6);
        ctx.fill();
        ctx.stroke();

        // Icon representation
        ctx.fillStyle = isNearby ? '#0f172a' : '#f8fafc';
        ctx.font = '12px serif';
        ctx.textAlign = 'center';
        let iconSymbol = '📍';
        if (obj.type === 'kiosk') iconSymbol = '🏧';
        if (obj.type === 'collectible') iconSymbol = '📜';
        if (obj.type === 'landmark') iconSymbol = '📊';
        if (obj.type === 'portal') iconSymbol = '🧭';
        ctx.fillText(iconSymbol, obj.x, obj.y - 2);

        // Interaction Prompt Indicator
        if (isNearby) {
          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 9px Inter, sans-serif';
          ctx.fillText('[E] Inspect', obj.x, obj.y - 24);
        }
      });

      // 9. 2.5D Depth Sorted Rendering for Player and NPCs
      const renderEntities: Array<{
        y: number;
        render: () => void;
      }> = [];

      // Add NPCs to sorting list
      activeNpcs.forEach((npc) => {
        renderEntities.push({
          y: npc.y,
          render: () => renderNpc(ctx, npc, nearbyNpc?.id === npc.id, isNpcSolved(npc), animTimer, animFrameCounter.current),
        });
      });

      // City 2: Postal Service Desk Prop
      if (!isCity1 && postalDeskRef.current && postalDeskRef.current.complete) {
        renderEntities.push({
          y: 396,
          render: () => {
            const deskImg = postalDeskRef.current;
            if (!deskImg || !deskImg.complete) return;
            const dw = 18;
            const dh = 34;
            ctx.drawImage(deskImg, 572, 395 - dh + 4, dw, dh);
          },
        });
      }

      // Add Player to sorting list
      renderEntities.push({
        y: player.y,
        render: () => renderPlayer(ctx, player, animFrameCounter.current, animTimer),
      });

      // Sort by Y-coordinate so entities lower down render on top
      renderEntities.sort((a, b) => a.y - b.y);
      renderEntities.forEach((e) => e.render());

      // 10. Navigational Guidance Arrow ONLY when ALL quests in current city are completed
      if (areAllQuestsCompleted) {
        renderDestinationGuidance(ctx, player, animTimer, currentCityId);
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [player, nearbyNpc, nearbyObject, mapImageLoaded, mapImageError, showHitboxes, cameraZoom, zoomLevel, areAllQuestsCompleted, isNpcSolved, playerSpriteLoaded, isCity1, isCity2, isCity3, isCity4, activeConfig, activeCollisionBoxes, activeCollisionGrid, activeNpcs, activeInteractives, activeNpcBoxes, currentCityId]);

  // Procedural Fallback Map Generator (Ensures Zero Blank Screen if asset fails)
  const renderProceduralMapFallback = (ctx: CanvasRenderingContext2D, mapW: number, mapH: number) => {
    // Ground
    ctx.fillStyle = '#47693d';
    ctx.fillRect(0, 0, mapW, mapH);

    // River
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(0, 310, 95, 262);

    // Wooden Bridge
    ctx.fillStyle = '#854d0e';
    ctx.fillRect(30, 420, 80, 55);

    // Paved Roads
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(110, 430, 550, 40);
    ctx.fillRect(660, 0, 55, 470);
    ctx.fillRect(195, 215, 470, 35);
    ctx.fillRect(715, 430, 240, 40);

    // Buildings
    const fallbackBuildings = [
      { name: 'SCHOOL & LIBRARY', x: 25, y: 20, w: 305, h: 135, color: '#b45309' },
      { name: 'BOOKSHOP', x: 330, y: 115, w: 100, h: 95, color: '#0284c7' },
      { name: 'STUDY ROOM', x: 475, y: 65, w: 155, h: 125, color: '#059669' },
      { name: 'HOSTEL', x: 740, y: 20, w: 240, h: 180, color: '#d97706' },
      { name: 'CANTEEN', x: 335, y: 260, w: 180, h: 95, color: '#e11d48' },
      { name: 'ELECTRONICS REPAIR', x: 605, y: 240, w: 130, h: 115, color: '#4f46e5' },
      { name: 'SAVINGS BANK', x: 810, y: 365, w: 145, h: 125, color: '#16a34a' },
    ];

    fallbackBuildings.forEach((b) => {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(b.name, b.x + b.w / 2, b.y + b.h / 2);
    });
  };

  // 2.5D Depth-Aligned NPC Renderer (Extensible Sprite & Placeholder Architecture)
  const renderNpc = (
    ctx: CanvasRenderingContext2D,
    npc: NPC,
    isNearby: boolean,
    isSolved: boolean,
    animTimer: number,
    frameIndex: number
  ) => {
    // Check if an external spritesheet is registered for this NPC
    const registeredNpc = NPC_SPRITE_REGISTRY[npc.id];
    let renderedSprite = false;

    if (registeredNpc) {
      let npcImg = npcSpriteImagesRef.current.get(npc.id);
      if (!npcImg) {
        npcImg = new Image();
        npcImg.src = `${registeredNpc.imageSrc}?v=${Date.now()}`;
        npcSpriteImagesRef.current.set(npc.id, npcImg);
      }
      if (npcImg.complete && npcImg.naturalWidth > 0) {
        // Fixed NPC facing direction: keep in single fixed stance (straight 'down' by default, no flipping to side)
        const facingDir: CharacterDirection = npc.direction || 'down';

        renderCharacterSprite(
          ctx,
          npcImg,
          npc.x,
          npc.y,
          facingDir,
          false,
          0,
          registeredNpc.config,
          false // Sprites already have authentic pixel art shadow at base
        );
        renderedSprite = true;
      }
    }

    // If no sprite registered yet or image still loading, render development placeholder avatar card
    if (!renderedSprite) {
      // Foot shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(npc.x, npc.y + 4, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // NPC Avatar Base & Frame
      const bob = isNearby ? Math.sin(animTimer * 6) * 2 : 0;

      ctx.fillStyle = isNearby ? '#f59e0b' : '#0f172a';
      ctx.strokeStyle = isNearby ? '#ffffff' : '#64748b';
      ctx.lineWidth = isNearby ? 2 : 1;
      ctx.beginPath();
      ctx.roundRect(npc.x - 13, npc.y - 25 + bob, 26, 26, 7);
      ctx.fill();
      ctx.stroke();

      // Emoji/Avatar Glyph
      ctx.font = '16px serif';
      ctx.textAlign = 'center';
      ctx.fillText(npc.avatar, npc.x, npc.y - 7 + bob);
    }

    // Name Plate (positioned below baseline)
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(npc.name, npc.x, npc.y + (renderedSprite ? 14 : 16));

    // Role Subtitle
    ctx.fillStyle = '#94a3b8';
    ctx.font = '7.5px Inter, sans-serif';
    ctx.fillText(npc.role, npc.x, npc.y + (renderedSprite ? 23 : 25));

    // Quest Indicator Beacon for Quest NPCs (Primary Challenges)
    // Only display beacon '!' when unsolved; no checkmark after completion
    if (npc.scenarioId && !isSolved) {
      const beaconBob = Math.sin(animTimer * 5) * 3;
      const beaconY = renderedSprite ? npc.y - 48 : npc.y - 36;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(npc.x, beaconY + beaconBob, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText('!', npc.x, beaconY + 3 + beaconBob);
    }

    // Interactive Speech Bubble / Action Prompt when player is nearby
    if (isNearby) {
      const bubbleBob = Math.sin(animTimer * 5) * 2;
      const bubbleY = renderedSprite ? npc.y - 48 + bubbleBob : npc.y - 38 + bubbleBob;

      // Speech prompt balloon
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(npc.x - 26, bubbleY - 11, 52, 16, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 8.5px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💬 [E] Talk', npc.x, bubbleY + 1.5);
    }
  };

  // 2.5D Depth-Aligned Player Character Renderer
  const renderPlayer = (
    ctx: CanvasRenderingContext2D,
    p: typeof player,
    frameIndex: number,
    animTimer: number
  ) => {
    // If pixel art spritesheet is loaded, render animated character sprite
    if (playerSpriteRef.current && playerSpriteLoaded) {
      renderCharacterSprite(
        ctx,
        playerSpriteRef.current,
        p.x,
        p.y,
        p.direction,
        p.isMoving,
        frameIndex,
        PLAYER_SPRITE_CONFIG,
        true
      );
      return;
    }

    // High-Fidelity Fallback Avatar Card (Zero glitch while loading)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 2, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    const walkBob = p.isMoving ? Math.sin(animTimer * 12) * 2 : 0;
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(p.x - 12, p.y - 26 + walkBob, 24, 26, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🧑‍🎓', p.x, p.y - 8 + walkBob);

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    let pipX = p.x;
    let pipY = p.y - 13 + walkBob;
    if (p.direction === 'up') pipY -= 15;
    if (p.direction === 'down') pipY += 15;
    if (p.direction === 'left') pipX -= 15;
    if (p.direction === 'right') pipX += 15;
    ctx.arc(pipX, pipY, 3, 0, Math.PI * 2);
    ctx.fill();
  };

  // Navigational Guidance to Next City (Active once ALL quests in active city are solved)
  const renderDestinationGuidance = (
    ctx: CanvasRenderingContext2D,
    p: { x: number; y: number },
    animTimer: number,
    cityId: string
  ) => {
    // City 1 target: North Highway to City 2 at (685, 30)
    // City 2 target: East Highway exit to City 3 at (950, 490)
    // City 3 target: River exit to City 4 at (860, 500)
    let targetX = 685;
    let targetY = 30;
    let destPillLabel = 'City 2 ➔';
    let destSignLabel = '★ TO CITY 2 ★';

    if (cityId === 'city_academic_bazaar') {
      targetX = 950;
      targetY = 490;
      destPillLabel = 'City 3 ➔';
      destSignLabel = '★ TO CITY 3 ★';
    } else if (cityId === 'city_investment_valley') {
      targetX = 860;
      targetY = 500;
      destPillLabel = 'City 4 ➔';
      destSignLabel = '★ TO CITY 4 ★';
    } else if (cityId === 'city_harbor_town') {
      targetX = 480;
      targetY = 490;
      destPillLabel = 'City 3 ➔';
      destSignLabel = '★ TO CITY 3 (FERRY) ★';
    }

    const dx = targetX - p.x;
    const dy = targetY - p.y;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    // 1. Floating directional guidance arrow hovering near player
    if (dist > 45) {
      const orbitDist = 38 + Math.sin(animTimer * 5) * 3;
      const arrowX = p.x + Math.cos(angle) * orbitDist;
      const arrowY = p.y + Math.sin(angle) * orbitDist;

      ctx.save();
      ctx.translate(arrowX, arrowY);
      ctx.rotate(angle);

      // Glowing navigation arrowhead
      ctx.shadowColor = 'rgba(16, 185, 129, 0.9)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#10b981';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(13, 0);       // Tip
      ctx.lineTo(-7, -7);     // Left wing
      ctx.lineTo(-3, 0);      // Inner notch
      ctx.lineTo(-7, 7);      // Right wing
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      // Floating label pill next to player
      ctx.save();
      const pillDist = orbitDist + 18;
      const pillX = p.x + Math.cos(angle) * pillDist;
      const pillY = p.y + Math.sin(angle) * pillDist;
      const pillW = 48;
      const pillH = 15;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(pillX - pillW / 2, pillY - pillH / 2, pillW, pillH, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 8px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(destPillLabel, pillX, pillY);
      ctx.restore();
    }

    // 2. Highway Portal Destination Beacon & Directional Chevrons
    ctx.save();
    const portalPulse = Math.sin(animTimer * 4) * 4;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 22 + portalPulse, 0, Math.PI * 2);
    ctx.stroke();

    // Animated chevrons pointing towards exit
    const chevronShift = (animTimer * 28) % 16;
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (cityId === 'city_hostel_commons') {
      ctx.fillText('▲', targetX, targetY + 6 - chevronShift);
    } else {
      ctx.fillText('▶', targetX - 6 + chevronShift, targetY);
    }

    // Highway Signboard
    const signW = 96;
    const signH = 16;
    ctx.fillStyle = 'rgba(6, 78, 59, 0.95)';
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(targetX - signW / 2, targetY - 26, signW, signH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ecfdf5';
    ctx.font = 'bold 8.5px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(destSignLabel, targetX, targetY - 18);
    ctx.restore();
  };

  // Direct Canvas Click Handling
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mapW = activeConfig.width;
    const mapH = activeConfig.height;
    const canvasAspect = mapW / mapH;
    const rectAspect = rect.width / rect.height;

    let displayW = rect.width;
    let displayH = rect.height;
    let letterboxX = 0;
    let letterboxY = 0;

    if (rectAspect > canvasAspect) {
      displayW = rect.height * canvasAspect;
      letterboxX = (rect.width - displayW) / 2;
    } else {
      displayH = rect.width / canvasAspect;
      letterboxY = (rect.height - displayH) / 2;
    }

    const localX = e.clientX - rect.left - letterboxX;
    const localY = e.clientY - rect.top - letterboxY;

    if (localX < 0 || localX > displayW || localY < 0 || localY > displayH) {
      return; // Click outside visible map area
    }

    let clickX = (localX / displayW) * mapW;
    let clickY = (localY / displayH) * mapH;

    if (cameraZoom === 'follow') {
      const zoomFactor = zoomLevel;
      const viewW = mapW / zoomFactor;
      const viewH = mapH / zoomFactor;
      const { camX, camY } = calculateCamera(player.x, player.y, viewW, viewH, mapW, mapH);
      clickX = clickX / zoomFactor + camX;
      clickY = clickY / zoomFactor + camY;
    }

    // Set click walk destination (mouse click interaction is disabled; interactions require [E] / [Space])
    clickTarget.current = { x: clickX, y: clickY };
  };

  // Mobile Touch D-Pad Handler
  const handleTouchDpad = (dir: 'up' | 'down' | 'left' | 'right') => {
    let dx = 0;
    let dy = 0;
    const delta = 18;
    if (dir === 'up') dy -= delta;
    if (dir === 'down') dy += delta;
    if (dir === 'left') dx -= delta;
    if (dir === 'right') dx += delta;

    const res = slideMove(
      player.x,
      player.y,
      dx,
      dy,
      DEFAULT_PLAYER_FOOTPRINT,
      [...activeCollisionBoxes, ...activeNpcBoxes],
      activeConfig.width,
      activeConfig.height,
      activeCollisionGrid
    );

    if (res.moved) {
      WorldAudio.playStep();
      setPlayer((prev) => ({
        ...prev,
        x: res.x,
        y: res.y,
        direction: dir,
        isMoving: true,
      }));
    }
  };

  // Transition handler for City 1 <-> City 2 <-> City 3 <-> City 4 Portals
  const handleCityTransition = (targetCityId: string) => {
    if (targetCityId === 'city_academic_bazaar') {
      if (isCity1 && !areAllQuestsCompleted) {
        setTransitionNotification(
          `Complete all City 1 quests (${completedQuestCount}/${totalQuestCount} solved) before advancing to City 2!`
        );
        setTimeout(() => setTransitionNotification(null), 4000);
        return;
      }
      WorldAudio.playDiscovery();
      setCurrentCityId('city_academic_bazaar');
      const targetSpawn: { x: number; y: number; dir: 'up' | 'down' | 'left' | 'right' } = isCity3
        ? { x: 920, y: 490, dir: 'left' }
        : { x: CITY2_CONFIG.spawnPoint.x, y: CITY2_CONFIG.spawnPoint.y, dir: 'right' };
      setPlayer({
        x: targetSpawn.x,
        y: targetSpawn.y,
        direction: targetSpawn.dir,
        speed: 3.2,
        isMoving: false,
        frame: 0,
      });
      GameStorage.saveWorldState({
        cityId: 'city_academic_bazaar',
        x: targetSpawn.x,
        y: targetSpawn.y,
        direction: targetSpawn.dir,
      });
      GameStorage.saveScreen('world');
      setTransitionNotification(`Arrived at City 2: Academic Bazaar! Explore Koti Market & University.`);
      onEnterCity('city_academic_bazaar');
      setTimeout(() => setTransitionNotification(null), 4500);
    } else if (targetCityId === 'city_investment_valley') {
      if (isCity2 && !areAllQuestsCompleted) {
        setTransitionNotification(
          `Complete all City 2 quests (${completedQuestCount}/${totalQuestCount} solved) before advancing to City 3!`
        );
        setTimeout(() => setTransitionNotification(null), 4000);
        return;
      }
      WorldAudio.playDiscovery();
      setCurrentCityId('city_investment_valley');
      const targetSpawn: { x: number; y: number; dir: 'up' | 'down' | 'left' | 'right' } = isCity4
        ? { x: 860, y: 500, dir: 'left' }
        : { x: CITY3_CONFIG.spawnPoint.x, y: CITY3_CONFIG.spawnPoint.y, dir: 'right' };
      setPlayer({
        x: targetSpawn.x,
        y: targetSpawn.y,
        direction: targetSpawn.dir,
        speed: 3.2,
        isMoving: false,
        frame: 0,
      });
      GameStorage.saveWorldState({
        cityId: 'city_investment_valley',
        x: targetSpawn.x,
        y: targetSpawn.y,
        direction: targetSpawn.dir,
      });
      GameStorage.saveScreen('world');
      setTransitionNotification(
        isCity4
          ? `Returned to City 3: Investment Valley.`
          : `Arrived at City 3: Investment Valley! Explore the Science Garden & River Dock.`
      );
      onEnterCity('city_investment_valley');
      setTimeout(() => setTransitionNotification(null), 4500);
    } else if (targetCityId === 'city_harbor_town' || targetCityId === 'city_4') {
      if (isCity3 && !areAllQuestsCompleted) {
        setTransitionNotification(
          `Complete all City 3 quests (${completedQuestCount}/${totalQuestCount} solved) before crossing to City 4!`
        );
        setTimeout(() => setTransitionNotification(null), 4000);
        return;
      }
      WorldAudio.playDiscovery();
      setCurrentCityId('city_harbor_town');
      setPlayer({
        x: CITY4_CONFIG.spawnPoint.x,
        y: CITY4_CONFIG.spawnPoint.y,
        direction: CITY4_CONFIG.spawnPoint.direction as 'down',
        speed: 3.2,
        isMoving: false,
        frame: 0,
      });
      GameStorage.saveWorldState({
        cityId: 'city_harbor_town',
        x: CITY4_CONFIG.spawnPoint.x,
        y: CITY4_CONFIG.spawnPoint.y,
        direction: 'down',
      });
      GameStorage.saveScreen('world');
      setTransitionNotification(`Arrived at City 4: Harbor Town! Explore the Docks, Market Square & Museum.`);
      onEnterCity('city_harbor_town');
      setTimeout(() => setTransitionNotification(null), 4500);
    } else if (targetCityId === 'city_hostel_commons') {
      WorldAudio.playDiscovery();
      setCurrentCityId('city_hostel_commons');
      setPlayer({
        x: 685,
        y: 80,
        direction: 'down',
        speed: 3.2,
        isMoving: false,
        frame: 0,
      });
      GameStorage.saveWorldState({
        cityId: 'city_hostel_commons',
        x: 685,
        y: 80,
        direction: 'down',
      });
      GameStorage.saveScreen('world');
      setTransitionNotification(`Returned to City 1: Hostel Commons.`);
      onEnterCity('city_hostel_commons');
      setTimeout(() => setTransitionNotification(null), 4000);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full flex flex-col transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-30 bg-slate-950 p-2 sm:p-3 w-screen h-screen'
          : 'w-full flex-1 flex flex-col px-2 sm:px-4 py-1.5 h-[calc(100vh-70px)] max-h-[calc(100vh-70px)]'
      }`}
    >
      {/* City Navigation & Status Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl px-3 py-2 mb-2 shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                {isCity1
                  ? 'City 1: Hostel Commons'
                  : isCity2
                  ? 'City 2: Academic Bazaar'
                  : isCity3
                  ? 'City 3: Investment Valley'
                  : 'City 4: Harbor Town'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {isCity1
                  ? 'Pillar 1: Plan & Budget'
                  : isCity2
                  ? 'Pillar 1: Smart Sourcing & Market Budgeting'
                  : isCity3
                  ? 'Pillar 3: Understand Investing (Simulations)'
                  : 'Pillar 4: Stay Financially Safe (Security & Anti-Fraud)'}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {isCity1
                ? "The Scholar's District — Full City Map"
                : isCity2
                ? 'Koti Book Market & University District'
                : isCity3
                ? 'School Garden, Economics Club & River Dock'
                : 'Harbor Docks, Market Square & Shipwreck Museum'}
            </div>
          </div>
        </div>

        {/* Objective & Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick City Transition Button */}
          {isCity1 ? (
            areAllQuestsCompleted && (
              <button
                onClick={() => handleCityTransition('city_academic_bazaar')}
                className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm transition"
              >
                <span>Travel to City 2</span>
                <Navigation className="w-3 h-3" />
              </button>
            )
          ) : isCity2 ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleCityTransition('city_hostel_commons')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm transition"
              >
                <span>Return to City 1</span>
                <Navigation className="w-3 h-3" />
              </button>
              {areAllQuestsCompleted && (
                <button
                  onClick={() => handleCityTransition('city_investment_valley')}
                  className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm transition"
                >
                  <span>Travel to City 3</span>
                  <Navigation className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : isCity3 ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleCityTransition('city_academic_bazaar')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm transition"
              >
                <span>Return to City 2</span>
                <Navigation className="w-3 h-3" />
              </button>
              {areAllQuestsCompleted && (
                <button
                  onClick={() => handleCityTransition('city_harbor_town')}
                  className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm transition"
                >
                  <span>Travel to City 4</span>
                  <Navigation className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleCityTransition('city_investment_valley')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm transition"
              >
                <span>Return to City 3</span>
                <Navigation className="w-3 h-3" />
              </button>
              {areAllQuestsCompleted && onOpenGameCompletion && (
                <button
                  onClick={onOpenGameCompletion}
                  className="px-2.5 py-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black rounded-lg flex items-center gap-1 shadow-md animate-pulse transition"
                  title="View Grand Graduation Certificate & Honors"
                >
                  <Trophy className="w-3.5 h-3.5 text-slate-950" />
                  <span>Graduation Ceremony 🏆</span>
                </button>
              )}
            </div>
          )}

          {/* Quest Status Pill */}
          <div
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-2 border ${
              areAllQuestsCompleted
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
          >
            {areAllQuestsCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {isCity1
                    ? 'All Quests Complete! Follow Arrow to City 2 ➔'
                    : isCity2
                    ? 'All Bazaar Quests Complete! Follow Arrow to City 3 ➔'
                    : isCity3
                    ? 'All Valley Quests Complete! Follow Arrow to City 4 ➔'
                    : 'All Security Quests Complete! You are a Financial Master! 🏆'}
                </span>
              </>
            ) : (
              <>
                <MapPin className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>
                  {isCity1 ? 'Hostel Quests: ' : isCity2 ? 'Bazaar Quests: ' : isCity3 ? 'Valley Quests: ' : 'Harbor Quests: '}
                  {completedQuestCount}/{totalQuestCount} Complete
                  {completedQuestCount === 0
                    ? ' — Find Quest NPCs (!)'
                    : ` — ${totalQuestCount - completedQuestCount} remaining (!)`}
                </span>
              </>
            )}
          </div>

          {/* Bankruptcy Alert & Reset Button */}
          {profile.walletBalance <= 0 && onResetWallet && (
            <div className="flex items-center gap-2 bg-rose-950/90 border border-rose-500 rounded-lg px-2.5 py-1 text-xs text-rose-200 animate-pulse shadow-md">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 animate-bounce" />
              <span className="font-bold text-rose-300">Bankrupt (₹0)!</span>
              <button
                onClick={onResetWallet}
                className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold shadow-sm transition active:scale-95"
              >
                Reset to ₹5,000
              </button>
            </div>
          )}

          {/* Full Map / Follow Player Toggle */}
          <button
            onClick={() => setCameraZoom((prev) => (prev === 'overview' ? 'follow' : 'overview'))}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
              cameraZoom === 'overview'
                ? 'bg-amber-500/25 border-amber-500/50 text-amber-300 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="Toggle between Full Map View and Close-Up Camera"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>{cameraZoom === 'overview' ? 'Full Map View' : 'Follow Player'}</span>
          </button>

          {/* Zoom controls only in follow mode */}
          {cameraZoom === 'follow' && (
            <>
              <button
                onClick={() => setZoomLevel((z) => Math.min(3.2, Number((z + 0.3).toFixed(1))))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(1.2, Number((z - 0.3).toFixed(1))))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className={`p-1.5 rounded-lg border transition ${
              isFullscreen
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (Edge-to-Edge)'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Hitbox Debug Toggle */}
          <button
            onClick={() => setShowHitboxes((h) => !h)}
            className={`p-1.5 rounded-lg border transition ${
              showHitboxes
                ? 'bg-red-500/20 border-red-500/40 text-red-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle Collision Geometry (Debug)"
          >
            {showHitboxes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-lg border transition ${
              soundEnabled
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-400'
            }`}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Exploration Canvas Viewport (Fills Full Available Screen) */}
      <div
        className="relative overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950 flex justify-center items-center w-full flex-1 rounded-2xl min-h-0"
      >
        <canvas
          ref={canvasRef}
          width={1024}
          height={572}
          onClick={handleCanvasClick}
          className="w-full h-full object-contain cursor-pointer block select-none bg-slate-950"
        />

        {/* Legend / Instructions Overlay */}
        <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-1.5 text-[11px] text-slate-300 hidden sm:flex items-center gap-2 shadow-lg">
          <Navigation className="w-3.5 h-3.5 text-amber-400" />
          <span>
            Move with <strong className="text-amber-400">WASD / Arrow Keys</strong> or click map. Press{' '}
            <strong className="text-amber-400">[E] / Space</strong> to interact.
          </span>
        </div>

        {/* Coordinates HUD */}
        <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl px-2.5 py-1 text-[10px] text-slate-400 hidden sm:block font-mono">
          X: {Math.round(player.x)} | Y: {Math.round(player.y)}
        </div>

        {/* Proximity Interaction Prompt Banner */}
        {nearbyNpc && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/95 border-2 border-amber-400 text-slate-100 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce z-20 pointer-events-none">
            <span className="text-2xl">{nearbyNpc.avatar}</span>
            <div className="text-xs">
              <div>
                <span className="font-bold text-amber-300">{nearbyNpc.name}</span>{' '}
                <span className="text-slate-400">({nearbyNpc.role})</span>
              </div>
              <div className="text-slate-400 text-[11px]">Press [E] or [Space] to Converse</div>
            </div>
            <div className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold rounded-xl ml-2 shadow-md flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-amber-500 text-slate-950 rounded text-[10px] font-black">E</kbd>
              <span>Talk</span>
            </div>
          </div>
        )}

        {nearbyObject && !nearbyNpc && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/95 border-2 border-sky-400 text-slate-100 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce z-20 pointer-events-none">
            <span className="text-xl">📍</span>
            <div className="text-xs">
              <div className="font-bold text-sky-300">{nearbyObject.name}</div>
              <div className="text-slate-400 text-[11px]">Press [E] or [Space] to Inspect</div>
            </div>
            <div className="px-3 py-1.5 bg-sky-500/20 border border-sky-500/50 text-sky-300 text-xs font-bold rounded-xl ml-2 shadow-md flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-sky-400 text-slate-950 rounded text-[10px] font-black">E</kbd>
              <span>Inspect</span>
            </div>
          </div>
        )}

        {/* Transition / Fallback Toast Notification */}
        {transitionNotification && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-amber-500 text-amber-200 px-5 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2.5 z-30 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{transitionNotification}</span>
          </div>
        )}
      </div>

      {/* Mobile Touch Virtual D-Pad */}
      <div className="sm:hidden flex items-center justify-between mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="text-xs text-slate-400">
          <div className="font-bold text-white">Touch Navigator</div>
          <div className="font-medium text-amber-400">Tap arrows to walk</div>
        </div>

        <div className="grid grid-cols-3 gap-2 w-36">
          <div />
          <button
            onClick={() => handleTouchDpad('up')}
            className="p-3 bg-slate-800 active:bg-amber-500 active:text-slate-950 rounded-xl text-center font-bold text-slate-200 transition"
          >
            ▲
          </button>
          <div />

          <button
            onClick={() => handleTouchDpad('left')}
            className="p-3 bg-slate-800 active:bg-amber-500 active:text-slate-950 rounded-xl text-center font-bold text-slate-200 transition"
          >
            ◀
          </button>
          <button
            onClick={() => handleTouchDpad('down')}
            className="p-3 bg-slate-800 active:bg-amber-500 active:text-slate-950 rounded-xl text-center font-bold text-slate-200 transition"
          >
            ▼
          </button>
          <button
            onClick={() => handleTouchDpad('right')}
            className="p-3 bg-slate-800 active:bg-amber-500 active:text-slate-950 rounded-xl text-center font-bold text-slate-200 transition"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Inspectable Object Dialog Modal */}
      {activeInspectObject && (
        <ObjectInspectionModal
          object={activeInspectObject}
          language={language}
          isCitySolved={areAllQuestsCompleted}
          onClose={() => setActiveInspectObject(null)}
          onTransition={handleCityTransition}
        />
      )}
    </div>
  );
};
