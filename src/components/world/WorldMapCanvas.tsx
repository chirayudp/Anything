import React, { useRef, useEffect, useState, useCallback } from 'react';
import { StudentProfile, GameLanguage, NPC } from '../../types';
import { REGIONS, CITIES } from '../../data/regions';
import { NPCS } from '../../data/dialogues';
import { MapPin, Navigation, Compass, Sparkles } from 'lucide-react';

interface WorldMapCanvasProps {
  profile: StudentProfile;
  language: GameLanguage;
  onInteractWithNpc: (npc: NPC) => void;
  onEnterCity: (cityId: string) => void;
}

export const WorldMapCanvas: React.FC<WorldMapCanvasProps> = ({
  profile,
  language,
  onInteractWithNpc,
  onEnterCity,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player state
  const [player, setPlayer] = useState({
    x: 150,
    y: 240,
    speed: 5,
    direction: 'down',
  });

  const [nearbyNpc, setNearbyNpc] = useState<NPC | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string>(profile.currentRegionId);

  // Keyboard state
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      if (e.key === ' ' && nearbyNpc) {
        e.preventDefault();
        onInteractWithNpc(nearbyNpc);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyNpc, onInteractWithNpc]);

  // Main game loop (60 FPS)
  useEffect(() => {
    let animationFrameId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateAndDraw = () => {
      // 1. Update Player Movement
      let dx = 0;
      let dy = 0;

      if (keysPressed.current['arrowup'] || keysPressed.current['w']) {
        dy -= player.speed;
      }
      if (keysPressed.current['arrowdown'] || keysPressed.current['s']) {
        dy += player.speed;
      }
      if (keysPressed.current['arrowleft'] || keysPressed.current['a']) {
        dx -= player.speed;
      }
      if (keysPressed.current['arrowright'] || keysPressed.current['d']) {
        dx += player.speed;
      }

      if (dx !== 0 || dy !== 0) {
        setPlayer((prev) => {
          const nextX = Math.max(30, Math.min(canvas.width - 30, prev.x + dx));
          const nextY = Math.max(30, Math.min(canvas.height - 30, prev.y + dy));
          return {
            ...prev,
            x: nextX,
            y: nextY,
            direction: dy < 0 ? 'up' : dy > 0 ? 'down' : dx < 0 ? 'left' : 'right',
          };
        });
      }

      // 2. Render Environment (Google Champion Island style)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lush grassy ground
      ctx.fillStyle = '#1e3a2b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid tile accents
      ctx.strokeStyle = '#274b37';
      ctx.lineWidth = 1;
      const tileSize = 40;
      for (let x = 0; x < canvas.width; x += tileSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += tileSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Stone Pathways connecting city hubs
      ctx.fillStyle = '#b49f7b';
      // Main central avenue
      ctx.fillRect(100, 180, 680, 40);
      ctx.fillRect(420, 100, 40, 480);
      ctx.fillRect(120, 360, 660, 35);
      ctx.fillRect(140, 520, 640, 35);

      // Campus Pond
      ctx.fillStyle = '#1e40af';
      ctx.beginPath();
      ctx.ellipse(650, 420, 70, 45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();

      // Trees and Scenery
      const trees = [
        { x: 60, y: 80 },
        { x: 220, y: 70 },
        { x: 550, y: 80 },
        { x: 740, y: 90 },
        { x: 70, y: 300 },
        { x: 340, y: 280 },
        { x: 550, y: 280 },
        { x: 760, y: 440 },
        { x: 80, y: 460 },
        { x: 240, y: 460 },
      ];

      trees.forEach((t) => {
        // Trunk
        ctx.fillStyle = '#78350f';
        ctx.fillRect(t.x + 8, t.y + 16, 8, 16);
        // Foliage
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(t.x + 12, t.y + 12, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(t.x + 10, t.y + 8, 10, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Render Cities / Buildings on the Active Region
      const region = REGIONS.find((r) => r.id === selectedRegionId) || REGIONS[0];
      region.cityIds.forEach((cId) => {
        const city = CITIES[cId];
        if (!city) return;

        const isCompleted = profile.completedCityIds.includes(cId);
        const isCurrent = profile.currentCityId === cId;

        // Building base
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = isCurrent ? '#f59e0b' : isCompleted ? '#10b981' : '#475569';
        ctx.lineWidth = isCurrent ? 3 : 2;

        ctx.beginPath();
        ctx.roundRect(city.x - 30, city.y - 30, 60, 50, 8);
        ctx.fill();
        ctx.stroke();

        // Roof
        ctx.fillStyle = city.color;
        ctx.beginPath();
        ctx.moveTo(city.x - 35, city.y - 30);
        ctx.lineTo(city.x, city.y - 50);
        ctx.lineTo(city.x + 35, city.y - 30);
        ctx.closePath();
        ctx.fill();

        // City Label
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(city.name, city.x, city.y + 35);

        // Quest marker badge
        if (!isCompleted) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(city.x, city.y - 55, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.fillText('!', city.x, city.y - 52);
        } else {
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(city.x, city.y - 55, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px Inter, sans-serif';
          ctx.fillText('✓', city.x, city.y - 52);
        }
      });

      // 4. Render NPCs
      Object.values(NPCS).forEach((npc) => {
        // NPC shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(npc.x, npc.y + 12, 14, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // NPC avatar
        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        ctx.fillText(npc.avatar, npc.x, npc.y + 8);

        // Name tag
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '9px Inter, sans-serif';
        ctx.fillText(npc.name, npc.x, npc.y + 24);
      });

      // 5. Render Player Character
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(player.x, player.y + 14, 16, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Student avatar
      ctx.font = '26px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🧑‍🎓', player.x, player.y + 10);

      // Student aura
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(player.x, player.y - 2, 18, 0, Math.PI * 2);
      ctx.stroke();

      // 6. Check Proximity to NPCs
      let foundNpc: NPC | null = null;
      for (const npc of Object.values(NPCS)) {
        const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
        if (dist < 45) {
          foundNpc = npc;
          break;
        }
      }
      setNearbyNpc(foundNpc);

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    animationFrameId = requestAnimationFrame(updateAndDraw);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [player, selectedRegionId, profile]);

  // Touch Virtual Controls
  const handleMoveButton = (direction: 'up' | 'down' | 'left' | 'right') => {
    const delta = 20;
    setPlayer((prev) => {
      const nextX =
        direction === 'left' ? Math.max(30, prev.x - delta) : direction === 'right' ? Math.min(800 - 30, prev.x + delta) : prev.x;
      const nextY =
        direction === 'up' ? Math.max(30, prev.y - delta) : direction === 'down' ? Math.min(600 - 30, prev.y + delta) : prev.y;
      return { ...prev, x: nextX, y: nextY, direction };
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Region Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3 mb-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-bold text-white">Active Region:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {REGIONS.map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegionId(reg.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedRegionId === reg.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {reg.name}
            </button>
          ))}
        </div>
      </div>

      {/* Exploration Canvas Container */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-950 flex justify-center">
        <canvas
          ref={canvasRef}
          width={840}
          height={600}
          className="w-full max-w-full h-auto cursor-pointer block"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const scaleX = 840 / rect.width;
            const scaleY = 600 / rect.height;
            const clickX = (e.clientX - rect.left) * scaleX;
            const clickY = (e.clientY - rect.top) * scaleY;

            // Check if user clicked an NPC
            for (const npc of Object.values(NPCS)) {
              if (Math.hypot(clickX - npc.x, clickY - npc.y) < 35) {
                onInteractWithNpc(npc);
                return;
              }
            }

            // Move player to clicked position smoothly
            setPlayer((p) => ({
              ...p,
              x: Math.round(clickX),
              y: Math.round(clickY),
            }));
          }}
        />

        {/* Proximity Interaction Prompt */}
        {nearbyNpc && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/95 border-2 border-amber-400 text-slate-100 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
            <span className="text-xl">{nearbyNpc.avatar}</span>
            <div className="text-xs">
              <span className="font-bold text-amber-300">{nearbyNpc.name}</span> ({nearbyNpc.role})
              <div className="text-slate-400">Press [SPACE] or Click to Converse</div>
            </div>
            <button
              onClick={() => onInteractWithNpc(nearbyNpc)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg ml-2"
            >
              Talk
            </button>
          </div>
        )}

        {/* Legend / Controls Overlay */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] text-slate-300 hidden sm:block">
          Use <span className="font-bold text-amber-400">WASD / Arrow Keys</span> or click on map to move
        </div>
      </div>

      {/* Mobile Touch Virtual D-Pad */}
      <div className="sm:hidden flex items-center justify-between mt-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="text-xs text-slate-400">
          <div>Touch Controls</div>
          <div className="font-medium text-amber-400">Tap arrows to walk</div>
        </div>

        <div className="grid grid-cols-3 gap-2 w-36">
          <div />
          <button
            onClick={() => handleMoveButton('up')}
            className="p-3 bg-slate-800 active:bg-amber-500 active:text-slate-950 rounded-lg text-center font-bold"
          >
            ▲
          </button>
          <div />

          <button
            onClick={() => handleMoveButton('left')}
            className="p-3 bg-slate-800 active:bg-amber-500 active:text-slate-950 rounded-lg text-center font-bold"
          >
            ◀
          </button>
          <button
            onClick={() => handleMoveButton('down')}
            className="p-3 bg-slate-800 active:bg-amber-500 active:text-slate-950 rounded-lg text-center font-bold"
          >
            ▼
          </button>
          <button
            onClick={() => handleMoveButton('right')}
            className="p-3 bg-slate-800 active:bg-amber-500 active:text-slate-950 rounded-lg text-center font-bold"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};
