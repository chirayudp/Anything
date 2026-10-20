import React, { useState } from 'react';
import { GameLanguage, StudentProfile, CharacterGender } from '../../types';
import { audioManager } from '../ui/audioManager';
import boyAvatarSrc from '../../assets/characters/boy_avatar.png';
import girlAvatarSrc from '../../assets/characters/girl_avatar.png';
import {
  Volume2,
  VolumeX,
  Music,
  Globe,
  Sliders,
  RotateCcw,
  Save,
  Wallet,
  X,
  Sparkles,
  User,
} from 'lucide-react';

interface TitleSettingsModalProps {
  language: GameLanguage;
  profile: StudentProfile;
  isProgressSaved: boolean;
  onClose: () => void;
  onLanguageChange: (lang: GameLanguage) => void;
  onToggleSaveProgress: () => void;
  onResetProgress: () => void;
  onResetWallet: () => void;
  onLogout?: () => void;
  onUpdateCharacter?: (gender: CharacterGender) => void;
}

export const TitleSettingsModal: React.FC<TitleSettingsModalProps> = ({
  language,
  profile,
  isProgressSaved,
  onClose,
  onLanguageChange,
  onToggleSaveProgress,
  onResetProgress,
  onResetWallet,
  onLogout,
  onUpdateCharacter,
}) => {
  const [audioSettings, setAudioSettings] = useState(() => audioManager.getSettings());
  const [volume, setVolume] = useState(() => Math.round(audioManager.getSettings().volume * 100));

  const handleToggleMute = () => {
    const nextMuted = audioManager.toggleMute();
    setAudioSettings(audioManager.getSettings());
  };

  const handleToggleBgm = () => {
    audioManager.toggleBgm();
    setAudioSettings(audioManager.getSettings());
  };

  const handleToggleSfx = () => {
    audioManager.toggleSfx();
    setAudioSettings(audioManager.getSettings());
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    audioManager.setVolume(val / 100);
  };

  const handleTestSound = () => {
    audioManager.playCoin();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="max-w-md w-full bg-slate-900 border-2 border-amber-600/60 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative text-slate-100 font-sans">
        {/* Close Button */}
        <button
          onClick={() => {
            audioManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 p-2 rounded-xl border border-slate-700 transition"
          aria-label="Close Settings"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-amber-300 tracking-wide">
              Game Settings
            </h2>
            <p className="text-xs text-slate-400">Audio, Language & Session Controls</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Audio Controls */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-400/90">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" /> Sound & Music
              </span>
              <button
                onClick={handleTestSound}
                className="text-[11px] text-amber-300 hover:text-amber-200 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/30 transition flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Test Sound
              </button>
            </div>

            {/* Volume slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Master Volume</span>
                <span className="font-mono text-amber-400">{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={handleToggleMute}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition ${
                  audioSettings.isMuted
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}
              >
                {audioSettings.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{audioSettings.isMuted ? 'Muted' : 'Unmuted'}</span>
              </button>

              <button
                onClick={handleToggleBgm}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition ${
                  audioSettings.isBgmActive
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <Music className="w-4 h-4" />
                <span>BGM: {audioSettings.isBgmActive ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={handleToggleSfx}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition ${
                  audioSettings.isSfxActive
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>SFX: {audioSettings.isSfxActive ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400/90">
              <Globe className="w-4 h-4" /> Language / भाषा / భాష
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'en', label: 'English' },
                  { id: 'hi', label: 'हिंदी (Hindi)' },
                  { id: 'te', label: 'తెలుగు (Telugu)' },
                ] as const
              ).map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    audioManager.playClick();
                    onLanguageChange(lang.id);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
                    language === lang.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scholar Character Avatar Selection */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400/90">
              <User className="w-4 h-4" /> Scholar Avatar / अवतार
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  audioManager.playClick();
                  onUpdateCharacter?.('boy');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition ${
                  (profile.characterGender || 'boy') === 'boy'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <img src={boyAvatarSrc} alt="Boy" className="w-5 h-7 object-contain" />
                <span>Aarav (Boy)</span>
              </button>
              <button
                onClick={() => {
                  audioManager.playClick();
                  onUpdateCharacter?.('girl');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition ${
                  profile.characterGender === 'girl'
                    ? 'bg-pink-500 text-white border-pink-400 shadow-md font-black'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <img src={girlAvatarSrc} alt="Girl" className="w-5 h-7 object-contain" />
                <span>Ananya (Girl)</span>
              </button>
            </div>
          </div>

          {/* Storage & Test Mode */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Save className="w-4 h-4 text-emerald-400" /> Save Progress Mode
              </span>
              <button
                onClick={() => {
                  audioManager.playClick();
                  onToggleSaveProgress();
                }}
                className={`text-xs px-3 py-1 rounded-lg font-black border transition ${
                  isProgressSaved
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                }`}
              >
                {isProgressSaved ? 'Persistence ON' : 'Testing (No Save)'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  audioManager.playClick();
                  onResetWallet();
                }}
                className="py-2 px-3 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/50 text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Wallet className="w-3.5 h-3.5" /> Restore ₹5,000
              </button>

              <button
                onClick={() => {
                  audioManager.playClick();
                  onResetProgress();
                }}
                className="py-2 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-700/50 text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Game Data
              </button>
            </div>

            {onLogout && (
              <button
                onClick={() => {
                  audioManager.playClick();
                  onClose();
                  onLogout();
                }}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                Log Out of Quest
              </button>
            )}
          </div>
        </div>

        {/* Return Button */}
        <button
          onClick={() => {
            audioManager.playClick();
            onClose();
          }}
          className="mt-6 w-full py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm tracking-wide shadow-lg transition active:scale-98"
        >
          Done & Return to Title
        </button>
      </div>
    </div>
  );
};
