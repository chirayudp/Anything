import React, { useRef, useEffect, useState } from 'react';
import { GameLanguage } from '../../types';
import { audioManager } from '../ui/audioManager';
import { MapPin, Sparkles, BookOpen, TrendingUp, ShieldCheck, Sun, Sunset, Moon } from 'lucide-react';

interface IslandCanvasProps {
  language: GameLanguage;
  onSelectCity?: (cityId: string) => void;
}

interface Landmark {
  id: string;
  name: string;
  region: string;
  pillar: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  icon: string;
  color: string;
  desc: string;
}

export const IslandCanvas: React.FC<IslandCanvasProps> = ({
  language,
  onSelectCity,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeLandmark, setActiveLandmark] = useState<Landmark | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');

  const landmarks: Landmark[] = [
    {
      id: 'city_hostel_commons',
      name: 'Hostel Commons',
      region: "The Scholar's District",
      pillar: 'Plan & Budget',
      xPercent: 24,
      yPercent: 55,
      icon: '🏫',
      color: '#f59e0b',
      desc: 'Dormitory grounds where your ₹5,000 scholarship stipend drops. Split mess fees vs pocket money.',
    },
    {
      id: 'city_academic_bazaar',
      name: 'Koti Book Bazaar',
      region: "The Scholar's District",
      pillar: 'Plan & Budget',
      xPercent: 33,
      yPercent: 42,
      icon: '📚',
      color: '#f59e0b',
      desc: 'Textbook stalls & stationery suppliers. Weigh new vs used books and resist impulse splurges.',
    },
    {
      id: 'city_compounding_grove',
      name: 'Compounding Grove',
      region: 'The Prosperity Outskirts',
      pillar: 'Understand Investing',
      xPercent: 50,
      yPercent: 62,
      icon: '🌱',
      color: '#10b981',
      desc: 'Terraced orchards where disciplined ₹500 monthly savings grow geometrically into wealth.',
    },
    {
      id: 'city_diversified_market',
      name: 'Diversified Bazaar',
      region: 'The Prosperity Outskirts',
      pillar: 'Understand Investing',
      xPercent: 64,
      yPercent: 48,
      icon: '⚖️',
      color: '#0284c7',
      desc: 'Harbor of assets. Learn why putting all eggs in one basket risks student ruin.',
    },
    {
      id: 'city_phishers_cove',
      name: "Phishers' Cove",
      region: 'The Guardian Citadel',
      pillar: 'Stay Financially Safe',
      xPercent: 78,
      yPercent: 32,
      icon: '🛡️',
      color: '#8b5cf6',
      desc: 'Digital defense fortress. Intercept fake scholarship SMS and deceptive KYC links.',
    },
    {
      id: 'city_grand_conclave',
      name: 'Grand Conclave',
      region: 'The Guardian Citadel',
      pillar: 'Stewardship Capstone',
      xPercent: 86,
      yPercent: 58,
      icon: '👑',
      color: '#ec4899',
      desc: 'The Capstone Summit where budgeting, emergency cushions, investing, and fraud defense unite.',
    },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let waveOffset = 0;

    // Responsive sizing
    const updateSize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || 900;
      canvas.height = 420;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Dynamic Clouds
    const clouds = [
      { x: 50, y: 40, speed: 0.35, size: 45 },
      { x: 300, y: 70, speed: 0.25, size: 60 },
      { x: 650, y: 30, speed: 0.4, size: 50 },
    ];

    // Ambient floating particles
    const particles = Array.from({ length: 22 }, () => ({
      x: Math.random() * 900,
      y: Math.random() * 420,
      radius: Math.random() * 2 + 1,
      speedY: Math.random() * 0.4 + 0.1,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      waveOffset += 0.03;

      // 1. Sky & Ocean background according to time of day
      let skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (timeOfDay === 'day') {
        skyGrad.addColorStop(0, '#0c4a6e'); // deep ocean sky
        skyGrad.addColorStop(0.4, '#0284c7');
        skyGrad.addColorStop(0.7, '#0369a1');
        skyGrad.addColorStop(1, '#075985');
      } else if (timeOfDay === 'sunset') {
        skyGrad.addColorStop(0, '#4c0519'); // ruby sunset
        skyGrad.addColorStop(0.35, '#9f1239');
        skyGrad.addColorStop(0.65, '#d97706');
        skyGrad.addColorStop(1, '#0f172a');
      } else {
        skyGrad.addColorStop(0, '#020617'); // midnight starry sky
        skyGrad.addColorStop(0.5, '#090d16');
        skyGrad.addColorStop(1, '#0f172a');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Distant Horizon Waves
      ctx.fillStyle = timeOfDay === 'night' ? '#0f172a' : 'rgba(14, 165, 233, 0.25)';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.45);
      for (let x = 0; x <= w; x += 20) {
        ctx.lineTo(x, h * 0.45 + Math.sin(x * 0.02 + waveOffset) * 6);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // 3. The 3 Connected Archipelago Islands
      // Island 1: The Scholar's District (Left)
      drawIsland(
        ctx,
        w * 0.26,
        h * 0.58,
        w * 0.22,
        h * 0.28,
        timeOfDay === 'night' ? '#14532d' : '#15803d',
        timeOfDay === 'night' ? '#166534' : '#22c55e',
        '#f59e0b'
      );

      // Island 2: The Prosperity Outskirts (Center)
      drawIsland(
        ctx,
        w * 0.56,
        h * 0.62,
        w * 0.24,
        h * 0.32,
        timeOfDay === 'night' ? '#064e3b' : '#047857',
        timeOfDay === 'night' ? '#047857' : '#10b981',
        '#10b981'
      );

      // Island 3: The Guardian Citadel (Right)
      drawIsland(
        ctx,
        w * 0.82,
        h * 0.52,
        w * 0.22,
        h * 0.35,
        timeOfDay === 'night' ? '#1e1b4b' : '#312e81',
        timeOfDay === 'night' ? '#3730a3' : '#4f46e5',
        '#8b5cf6'
      );

      // 4. Connecting Bridges between Islands
      drawStoneBridge(ctx, w * 0.36, h * 0.58, w * 0.46, h * 0.62);
      drawStoneBridge(ctx, w * 0.67, h * 0.62, w * 0.74, h * 0.53);

      // 5. Environmental Details: Coastal Wave Foams
      drawWaveFoam(ctx, w, h, waveOffset);

      // 6. Floating Pixel Clouds
      clouds.forEach((cloud) => {
        cloud.x += cloud.speed;
        if (cloud.x > w + 80) cloud.x = -80;
        drawPixelCloud(ctx, cloud.x, cloud.y, cloud.size, timeOfDay);
      });

      // 7. Ambient Sparkle Dust / Gold Flakes
      particles.forEach((p) => {
        p.y -= p.speedY;
        if (p.y < 0) p.y = h;
        ctx.fillStyle =
          timeOfDay === 'night'
            ? `rgba(253, 224, 71, ${p.alpha * 0.8})`
            : `rgba(255, 255, 255, ${p.alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
    };
  }, [timeOfDay]);

  // Helper: Draw island masses with layered contours
  const drawIsland = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    baseColor: string,
    topColor: string,
    glowColor: string
  ) => {
    // Soft underglow
    const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, rx * 1.3);
    glow.addColorStop(0, glowColor + '33');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx * 1.3, ry * 1.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sandy Shoreline / Beach
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 8, rx * 1.05, ry * 1.05, 0, 0, Math.PI * 2);
    ctx.fill();

    // Lower Terraced Grass
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 3, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Top Plateau Grass
    ctx.fillStyle = topColor;
    ctx.beginPath();
    ctx.ellipse(cx - 4, cy - 8, rx * 0.85, ry * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Detail Trees & Campus markers
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(cx - rx * 0.4, cy - 12, 6, 12);
    ctx.fillRect(cx + rx * 0.3, cy - 18, 6, 14);
    ctx.fillRect(cx - 8, cy - 25, 8, 16);
  };

  // Helper: Draw connecting bridges
  const drawStoneBridge = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo((x1 + x2) / 2, (y1 + y2) / 2 - 12, x2, y2);
    ctx.stroke();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  // Helper: Animated Coastal Wave Foams
  const drawWaveFoam = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    offset: number
  ) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 20; x < w - 20; x += 45) {
      const y = h * 0.78 + Math.sin(x * 0.05 + offset) * 5;
      ctx.moveTo(x, y);
      ctx.lineTo(x + 25, y + Math.cos(x * 0.04 + offset) * 3);
    }
    ctx.stroke();
  };

  // Helper: Stylized pixel clouds
  const drawPixelCloud = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    tod: string
  ) => {
    ctx.fillStyle =
      tod === 'night'
        ? 'rgba(30, 41, 59, 0.65)'
        : tod === 'sunset'
        ? 'rgba(254, 205, 211, 0.75)'
        : 'rgba(255, 255, 255, 0.75)';

    ctx.beginPath();
    ctx.roundRect(x, y, size * 1.6, size * 0.6, 10);
    ctx.roundRect(x + size * 0.3, y - size * 0.3, size, size * 0.7, 12);
    ctx.fill();
  };

  const handleLandmarkClick = (lm: Landmark) => {
    audioManager.playClick();
    setActiveLandmark(lm);
    if (onSelectCity) onSelectCity(lm.id);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-2xl group">
      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full h-[420px] block cursor-crosshair" />

      {/* Ambiance Time Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-700 text-xs shadow-lg">
        <button
          onClick={() => {
            audioManager.playClick();
            setTimeOfDay('day');
          }}
          className={`p-1.5 rounded-lg transition ${
            timeOfDay === 'day'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Daylight"
        >
          <Sun className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            audioManager.playClick();
            setTimeOfDay('sunset');
          }}
          className={`p-1.5 rounded-lg transition ${
            timeOfDay === 'sunset'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Sunset"
        >
          <Sunset className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            audioManager.playClick();
            setTimeOfDay('night');
          }}
          className={`p-1.5 rounded-lg transition ${
            timeOfDay === 'night'
              ? 'bg-indigo-600 text-white font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Night"
        >
          <Moon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Interactive Landmark Pins */}
      {landmarks.map((lm) => (
        <button
          key={lm.id}
          onClick={() => handleLandmarkClick(lm)}
          style={{ left: `${lm.xPercent}%`, top: `${lm.yPercent}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group/pin transition-transform hover:scale-125 focus:outline-none"
          title={lm.name}
        >
          <div className="relative flex items-center justify-center">
            {/* Pulsing ring */}
            <span
              className="absolute w-8 h-8 rounded-full animate-ping opacity-75"
              style={{ backgroundColor: lm.color }}
            />
            {/* Icon badge */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-xl border-2 border-white/80 transition-all group-hover/pin:rotate-6"
              style={{ backgroundColor: lm.color }}
            >
              {lm.icon}
            </div>
            {/* Pin label pill */}
            <span className="hidden sm:block absolute top-10 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-950/90 text-[11px] font-bold text-slate-100 border border-slate-700 shadow-md">
              {lm.name}
            </span>
          </div>
        </button>
      ))}

      {/* Active Landmark Preview Card Drawer (Bottom overlay) */}
      {activeLandmark && (
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/95 backdrop-blur-md border border-amber-500/50 rounded-xl p-4 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-md"
              style={{ backgroundColor: activeLandmark.color + '33', border: `1px solid ${activeLandmark.color}` }}
            >
              {activeLandmark.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-base">{activeLandmark.name}</h4>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                  {activeLandmark.pillar}
                </span>
              </div>
              <div className="text-xs text-slate-400">{activeLandmark.region}</div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">{activeLandmark.desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setActiveLandmark(null)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Map Legend Banner (Top Left) */}
      <div className="absolute top-4 left-4 z-10 hidden sm:flex items-center gap-2 bg-slate-950/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Click landmarks to inspect cities across 3 regions</span>
      </div>
    </div>
  );
};
