import React, { useState } from 'react';
import { StudentProfile, GameLanguage } from '../../types';
import { GameStorage } from '../../engine/storage';
import { TRANSLATIONS } from '../../translations';
import { audioManager } from '../ui/audioManager';
import { ShieldCheck, User, Sparkles, Check, ArrowRight, X, Lock } from 'lucide-react';

interface AuthModalProps {
  currentProfile: StudentProfile;
  language: GameLanguage;
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (profile: StudentProfile, isNewUser?: boolean) => void;
}

const AVATARS = [
  { id: 'avatar_arjun', name: 'Arjun (The Scholar)', icon: '👨‍🎓', desc: 'Diligent note-taker, careful with mess bills' },
  { id: 'avatar_priya', name: 'Priya (The Tech Whiz)', icon: '👩‍💻', desc: 'Code lover, passionate about cyber scam defense' },
  { id: 'avatar_rahul', name: 'Rahul (The Saver)', icon: '🧑‍💼', desc: 'Invests early, masters compound interest' },
  { id: 'avatar_aisha', name: 'Aisha (The Guardian)', icon: '👩‍🔬', desc: 'Protects peers from deceptive UPI schemes' },
];

const CAMPUSES = [
  'Telangana Model Residential Hostel, Hyderabad',
  'Hyderabad Central Scholars Campus',
  'Osmania Intermediate University Wing',
  'Secunderabad District Student Hostel',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  currentProfile,
  language,
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const t = TRANSLATIONS[language].auth;
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);
  const [selectedCampus, setSelectedCampus] = useState(CAMPUSES[0]);
  const [loginStudentId, setLoginStudentId] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateNewScholar = () => {
    audioManager.playCoin();
    const newIdNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `STU-${newIdNum}`;

    const newProfile: StudentProfile = {
      studentId: newId,
      sessionId: `SESS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      preferredLanguage: language,
      scholarshipStipend: 5000,
      walletBalance: 5000,
      emergencyFund: 0,
      totalScore: 0,
      currentRegionId: 'region_scholars_district',
      currentCityId: 'city_hostel_commons',
      completedCityIds: [],
      failedCityIds: [],
      badges: ['Scholarship Recipient', 'Verified Scholar'],
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      isNewUser: true,
    };

    GameStorage.saveProfile(newProfile);
    onProfileUpdated(newProfile, true);
    setSuccessMsg(`Scholar ${newId} initialized with ₹5,000 stipend!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleResumeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const trimmed = loginStudentId.trim().toUpperCase();

    // Validate format STU-XXXX
    if (!/^STU-\d{4}$/.test(trimmed)) {
      audioManager.playError();
      setErrorMsg(t.invalidId);
      return;
    }

    audioManager.playFanfare();
    // Restore or generate matching session
    const existing = GameStorage.getOrCreateProfile();
    const restoredProfile: StudentProfile = {
      ...existing,
      studentId: trimmed,
      lastActiveAt: Date.now(),
      isNewUser: false,
    };

    GameStorage.saveProfile(restoredProfile);
    onProfileUpdated(restoredProfile, false);
    setSuccessMsg(`${t.sessionResumed} (${trimmed})`);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="max-w-lg w-full bg-slate-900 border-2 border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            audioManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{t.modalTitle}</h3>
            <p className="text-xs text-slate-400">Class 11 Merit Stipend Authentication</p>
          </div>
        </div>

        {/* Tabs: Register vs Resume */}
        <div className="flex rounded-xl bg-slate-950 p-1 mb-6 border border-slate-800">
          <button
            onClick={() => {
              audioManager.playClick();
              setActiveTab('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'register'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.tabRegister}
          </button>
          <button
            onClick={() => {
              audioManager.playClick();
              setActiveTab('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'login'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.tabLogin}
          </button>
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-300">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: REGISTER NEW SCHOLAR */}
        {activeTab === 'register' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {t.avatarSelect}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      audioManager.playClick();
                      setSelectedAvatar(av.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition ${
                      selectedAvatar === av.id
                        ? 'border-amber-500 bg-amber-500/10 text-white'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{av.icon}</span>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-200">{av.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{av.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.campusSelect}
              </label>
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {CAMPUSES.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Stipend Confirmation Banner */}
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-medium">{t.stipendConfirmation}</span>
              <span className="font-extrabold text-emerald-400">₹5,000 / mo</span>
            </div>

            <button
              onClick={handleGenerateNewScholar}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.createAccountBtn}</span>
            </button>
          </div>
        )}

        {/* TAB 2: RESUME EXISTING JOURNEY */}
        {activeTab === 'login' && (
          <form onSubmit={handleResumeLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.studentIdLabel}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={loginStudentId}
                  onChange={(e) => setLoginStudentId(e.target.value)}
                  placeholder={t.studentIdPlaceholder}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 tracking-wider font-mono uppercase"
                  maxLength={8}
                />
                <button
                  type="button"
                  onClick={() => setLoginStudentId(currentProfile.studentId)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold px-2 py-1 rounded"
                >
                  Fill Current ({currentProfile.studentId})
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95"
            >
              <span>{t.loginBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Privacy Notice */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>{t.privacyNotice}</span>
        </div>
      </div>
    </div>
  );
};
