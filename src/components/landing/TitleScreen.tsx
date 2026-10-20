import React, { useState, useEffect } from 'react';
import { GameLanguage } from '../../types';
import { audioManager } from '../ui/audioManager';
import {
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Sparkles,
  Info,
  User,
  LogOut,
} from 'lucide-react';
import titleScreenImg from '../../assets/ui/title_screen.jpg';

interface TitleScreenProps {
  language: GameLanguage;
  hasSavedGame: boolean;
  studentId?: string;
  onStartAdventure: () => void;
  onContinueJourney: () => void;
  onOpenDashboard?: () => void;
  onOpenSettings: () => void;
  onLogout?: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  language,
  hasSavedGame,
  studentId,
  onStartAdventure,
  onContinueJourney,
  onOpenDashboard,
  onOpenSettings,
  onLogout,
}) => {
  const [isMuted, setIsMuted] = useState(() => audioManager.getSettings().isMuted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleToggleSound = () => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      audioManager.playClick();
    }
  };

  const handleToggleFullscreen = () => {
    audioManager.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const signpostItems = [
    {
      id: 'plan',
      label: 'Plan',
      style: { left: '2.8%', top: '57.2%', width: '11.5%', height: '5.0%' },
      tip: '📊 Plan & Budget: Master the 50-30-20 rule and needs vs wants.',
    },
    {
      id: 'save',
      label: 'Save',
      style: { left: '2.8%', top: '63.2%', width: '11.0%', height: '5.0%' },
      tip: '🛡️ Save & Manage: Emergency cushions, safe bank deposits and liquid reserves.',
    },
    {
      id: 'invest1',
      label: 'Invest',
      style: { left: '2.8%', top: '69.2%', width: '11.0%', height: '5.0%' },
      tip: '📈 Understand Compounding: Harness time and interest to beat inflation.',
    },
    {
      id: 'invest2',
      label: 'Grow',
      style: { left: '2.8%', top: '75.2%', width: '11.0%', height: '5.0%' },
      tip: '🎯 Financial Goals: Purpose-driven saving and debt avoidance.',
    },
    {
      id: 'staysafe',
      label: 'Stay Safe',
      style: { left: '2.8%', top: '81.2%', width: '12.0%', height: '5.0%' },
      tip: '🔒 Stay Financially Safe: Defeat UPI scams, OTP fraud, and dial helpline 1930.',
    },
  ];

  return (
    <div className="fixed inset-0 w-screen h-screen z-30 bg-slate-950 flex items-center justify-center relative overflow-hidden select-none m-0 p-0">
      {/* Background ambient lighting vignette */}
      <div className="absolute inset-0 bg-radial from-amber-500/5 via-slate-950/80 to-slate-950 pointer-events-none" />

      {/* Main Pixel Canvas Container edge-to-edge */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Rendered Artwork spanning 100% full screen */}
        <img
          src={titleScreenImg}
          alt="Money Quest Adventure"
          className="w-full h-full object-fill pointer-events-none"
        />

        {/* Top-Left Audio & Fullscreen Quick Controls */}
        <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 flex items-center gap-2">
          <button
            onClick={handleToggleSound}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/40 shadow-lg backdrop-blur-md transition-all duration-150 hover:scale-105 active:scale-95"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/40 shadow-lg backdrop-blur-md transition-all duration-150 hover:scale-105 active:scale-95"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>

        {/* Top-Right Authenticated Student Badge & Logout */}
        <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 flex items-center gap-2">
          {studentId && (
            <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-900/85 text-amber-300 rounded-xl sm:rounded-2xl border border-amber-500/40 shadow-xl backdrop-blur-md text-xs font-mono font-bold">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span>{studentId}</span>
            </div>
          )}
          {onLogout && (
            <button
              onClick={() => {
                audioManager.playClick();
                onLogout();
              }}
              className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-900/85 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700/80 hover:border-rose-500/40 shadow-xl backdrop-blur-md transition-all duration-150 active:scale-95"
              title="Log Out of Quest"
              aria-label="Log Out"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE CLICKABLE OVERLAYS (EXACT PERCENTAGE BOUNDS OVER ARTWORK)     */}
        {/* ========================================================================= */}

        {/* 1. START ADVENTURE BUTTON (Golden Banner) */}
        <button
          onClick={() => {
            audioManager.playClick();
            onStartAdventure();
          }}
          onMouseEnter={() => audioManager.playClick()}
          style={{
            position: 'absolute',
            left: '12.01%',
            top: '34.60%',
            width: '27.44%',
            height: '7.92%',
          }}
          className="group rounded-2xl cursor-pointer transition-all duration-200 hover:ring-4 hover:ring-amber-300/90 hover:shadow-[0_0_30px_rgba(251,191,36,0.7)] active:scale-95 focus:outline-none focus:ring-4 focus:ring-amber-400"
          aria-label="Start Adventure"
          title="Start Adventure (Begin narrative prologue & journey)"
        >
          <span className="sr-only">Start Adventure</span>
          {/* Subtle animated shine effect on hover */}
          <div className="w-full h-full rounded-2xl bg-amber-400/0 group-hover:bg-amber-400/15 transition-colors flex items-center justify-end pr-3">
            <Sparkles className="w-4 h-4 text-amber-200 opacity-0 group-hover:opacity-100 transition-opacity animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </button>

        {/* 2. CONTINUE JOURNEY BUTTON (Slate/Blue Banner) */}
        <button
          onClick={() => {
            audioManager.playClick();
            onContinueJourney();
          }}
          onMouseEnter={() => audioManager.playClick()}
          style={{
            position: 'absolute',
            left: '14.94%',
            top: '43.11%',
            width: '21.78%',
            height: '6.01%',
          }}
          className="group rounded-xl cursor-pointer transition-all duration-200 hover:ring-4 hover:ring-sky-400/90 hover:shadow-[0_0_25px_rgba(56,189,248,0.6)] active:scale-95 focus:outline-none focus:ring-4 focus:ring-sky-400"
          aria-label="Continue Journey"
          title={hasSavedGame ? 'Continue Saved Journey' : 'Continue Journey (Resumes active progress)'}
        >
          <span className="sr-only">Continue Journey</span>
          <div className="w-full h-full rounded-xl bg-sky-400/0 group-hover:bg-sky-400/15 transition-colors" />
        </button>

        {/* 3. SETTINGS BUTTON (Slate/Blue Banner) */}
        <button
          onClick={() => {
            audioManager.playClick();
            onOpenSettings();
          }}
          onMouseEnter={() => audioManager.playClick()}
          style={{
            position: 'absolute',
            left: '14.94%',
            top: '49.85%',
            width: '21.78%',
            height: '6.01%',
          }}
          className="group rounded-xl cursor-pointer transition-all duration-200 hover:ring-4 hover:ring-indigo-400/90 hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-400"
          aria-label="Game Settings"
          title="Settings (Audio, language, and progress controls)"
        >
          <span className="sr-only">Settings</span>
          <div className="w-full h-full rounded-xl bg-indigo-400/0 group-hover:bg-indigo-400/15 transition-colors" />
        </button>

        {/* ========================================================================= */}
        {/* INTERACTIVE SIGNPOST TOOLTIPS (PLAN, SAVE, INVEST, GROW, STAY SAFE)       */}
        {/* ========================================================================= */}
        {signpostItems.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => {
              audioManager.playClick();
              setActiveTooltip(item.tip);
            }}
            onMouseLeave={() => setActiveTooltip(null)}
            style={{
              position: 'absolute',
              ...item.style,
            }}
            className="rounded-lg cursor-help transition-all duration-150 hover:bg-amber-400/20 hover:ring-2 hover:ring-amber-300/60"
            title={item.tip}
          />
        ))}

        {/* Floating Tooltip Pill for Signpost */}
        {activeTooltip && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-slate-900/95 border-2 border-amber-500/70 text-amber-200 rounded-2xl shadow-2xl text-xs font-bold tracking-wide backdrop-blur-md animate-fadeIn pointer-events-none flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{activeTooltip}</span>
          </div>
        )}
      </div>
    </div>
  );
};
