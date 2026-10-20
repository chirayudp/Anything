import React, { useState } from 'react';
import { StudentProfile, GameLanguage } from '../../types';
import { TRANSLATIONS } from '../../translations';
import { audioManager } from './audioManager';
import {
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  BookOpen,
  Compass,
  Printer,
  X,
  FileCheck,
} from 'lucide-react';

interface AchievementsModalProps {
  profile: StudentProfile;
  language: GameLanguage;
  isOpen: boolean;
  onClose: () => void;
}

interface BadgeDef {
  id: string;
  name: string;
  pillar: 'budget' | 'save' | 'invest' | 'safety' | 'general';
  desc: string;
  icon: string;
  isUnlocked: (p: StudentProfile) => boolean;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  profile,
  language,
  isOpen,
  onClose,
}) => {
  const t = TRANSLATIONS[language].achievements;
  const [showCertificate, setShowCertificate] = useState(false);

  if (!isOpen) return null;

  const BADGES: BadgeDef[] = [
    {
      id: 'badge_scholar',
      name: 'Merit Scholar',
      pillar: 'general',
      desc: 'Enrolled in Class 11 scholarship program with initial ₹5,000 stipend.',
      icon: '🎓',
      isUnlocked: () => true,
    },
    {
      id: 'badge_budgeter',
      name: 'Budget Architect',
      pillar: 'budget',
      desc: 'Mastered the 50-30-20 allocation in Hostel Commons.',
      icon: '📐',
      isUnlocked: (p) => p.completedCityIds.includes('city_hostel_commons'),
    },
    {
      id: 'badge_emergency',
      name: 'Shield of Reserves',
      pillar: 'save',
      desc: 'Built an emergency cushion of ₹1,000+ for unexpected crises.',
      icon: '🛡️',
      isUnlocked: (p) => p.emergencyFund >= 1000 || p.completedCityIds.includes('city_academic_bazaar') || p.completedCityIds.includes('city_rainy_day_refuge'),
    },
    {
      id: 'badge_compound',
      name: 'Compound Alchemist',
      pillar: 'invest',
      desc: 'Understood exponential returns and time horizons in Investment Valley.',
      icon: '🌱',
      isUnlocked: (p) => p.completedCityIds.includes('city_investment_valley') || p.completedCityIds.includes('city_compounding_grove'),
    },
    {
      id: 'badge_diversified',
      name: 'Diversification Sage',
      pillar: 'invest',
      desc: 'Balanced risk and return across diversified student assets.',
      icon: '⚖️',
      isUnlocked: (p) => p.completedCityIds.includes('city_investment_valley') || p.completedCityIds.includes('city_diversified_market'),
    },
    {
      id: 'badge_phish_buster',
      name: 'Phish Buster',
      pillar: 'safety',
      desc: 'Intercepted deceptive scholarship SMS and fraudulent KYC links in Harbor Town.',
      icon: '🎣',
      isUnlocked: (p) => p.completedCityIds.includes('city_harbor_town') || p.completedCityIds.includes('city_phishers_cove'),
    },
    {
      id: 'badge_upi_sentinel',
      name: 'UPI Sentinel',
      pillar: 'safety',
      desc: 'Refused to enter PIN for money-receive QR scams and ATM skimmers.',
      icon: '📱',
      isUnlocked: (p) => p.completedCityIds.includes('city_harbor_town') || p.completedCityIds.includes('city_upi_maze'),
    },
    {
      id: 'badge_grand_steward',
      name: 'Grand Financial Steward',
      pillar: 'general',
      desc: 'Mastered all four financial pillars across the student journey.',
      icon: '👑',
      isUnlocked: (p) => p.completedCityIds.includes('city_harbor_town') || p.completedCityIds.includes('city_grand_conclave'),
    },
  ];

  const unlockedCount = BADGES.filter((b) => b.isUnlocked(profile)).length;

  // Compute pillar mastery percentages
  const budgetDone = profile.completedCityIds.filter((c) =>
    ['city_hostel_commons', 'city_academic_bazaar', 'city_canteen_corner'].includes(c)
  ).length;
  const saveDone = profile.emergencyFund >= 1000 || profile.completedCityIds.filter((c) =>
    ['city_academic_bazaar', 'city_rainy_day_refuge', 'city_digital_hub', 'city_opportunity_guild'].includes(c)
  ).length ? 1 : 0;
  const investDone = profile.completedCityIds.filter((c) =>
    ['city_investment_valley', 'city_compounding_grove', 'city_diversified_market', 'city_inflation_alley', 'city_skill_forge'].includes(c)
  ).length;
  const safetyDone = profile.completedCityIds.filter((c) =>
    ['city_harbor_town', 'city_phishers_cove', 'city_upi_maze', 'city_pyramid_peak', 'city_credential_vault', 'city_grand_conclave'].includes(c)
  ).length;

  const budgetPct = Math.min(100, Math.round((budgetDone / 2) * 100));
  const savePct = Math.min(100, Math.round((saveDone / 1) * 100));
  const investPct = Math.min(100, Math.round((investDone / 1) * 100));
  const safetyPct = Math.min(100, Math.round((safetyDone / 1) * 100));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="max-w-3xl w-full bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            audioManager.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* CERTIFICATE VIEW OVERLAY */}
        {showCertificate ? (
          <div className="space-y-6 animate-fadeIn py-2 flex flex-col items-center text-center">
            <div className="w-full max-w-xl p-8 rounded-3xl bg-amber-950/20 border-4 border-amber-500/60 shadow-2xl relative text-slate-100">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-3xl mb-4">
                📜
              </div>

              <div className="text-xs uppercase tracking-widest text-amber-400 font-extrabold mb-1">
                State Financial Empowerment Initiative
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
                {t.certificateTitle}
              </h2>

              <p className="text-xs text-slate-300 italic mb-6">
                Awarded under the Hyderabad Class 11 Student Stewardship Program
              </p>

              <div className="my-6 p-4 bg-slate-950/70 border border-amber-500/30 rounded-2xl">
                <div className="text-xs text-slate-400">{t.certifiedScholar}</div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 tracking-wider font-mono my-1">
                  {profile.studentId}
                </div>
                <div className="text-xs text-emerald-400 font-semibold">
                  Literacy Score: {profile.totalScore} Pts • {unlockedCount}/8 Badges Unlocked
                </div>
              </div>

              <div className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
                {t.certificateFooter}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-4">
                <span>Issued: {new Date().toLocaleDateString()}</span>
                <span className="text-amber-400 font-mono font-bold">MONEYQUEST-VERIFIED</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                {t.closeCertificate}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">{t.modalTitle}</h3>
                  <p className="text-xs text-slate-400">{t.modalSub}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  audioManager.playFanfare();
                  setShowCertificate(true);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition"
              >
                <FileCheck className="w-4 h-4" />
                <span>{t.viewCertificate}</span>
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Scholar ID</div>
                <div className="text-base font-black text-white font-mono">{profile.studentId}</div>
              </div>
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total Score</div>
                <div className="text-base font-black text-amber-400">{profile.totalScore} Pts</div>
              </div>
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Reserve Fund</div>
                <div className="text-base font-black text-emerald-400">₹{profile.emergencyFund}</div>
              </div>
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Badges Earned</div>
                <div className="text-base font-black text-sky-400">{unlockedCount} / 8</div>
              </div>
            </div>

            {/* Pillar Mastery Progress Bars */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 mb-6">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                {t.pillarMastery}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Budget */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-semibold">
                    <span className="text-amber-400 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> Plan & Budget
                    </span>
                    <span className="text-slate-300">{budgetPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${budgetPct}%` }}
                    />
                  </div>
                </div>

                {/* Save */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-semibold">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Save & Manage
                    </span>
                    <span className="text-slate-300">{savePct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${savePct}%` }}
                    />
                  </div>
                </div>

                {/* Invest */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-semibold">
                    <span className="text-sky-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> Understand Investing
                    </span>
                    <span className="text-slate-300">{investPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full transition-all"
                      style={{ width: `${investPct}%` }}
                    />
                  </div>
                </div>

                {/* Safety */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-semibold">
                    <span className="text-purple-400 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" /> Stay Financially Safe
                    </span>
                    <span className="text-slate-300">{safetyPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{ width: `${safetyPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Milestone Trophies ({unlockedCount}/8)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BADGES.map((badge) => {
                  const unlocked = badge.isUnlocked(profile);
                  return (
                    <div
                      key={badge.id}
                      className={`p-3 rounded-2xl border flex items-center gap-3 transition ${
                        unlocked
                          ? 'border-amber-500/40 bg-slate-950/80 shadow-md'
                          : 'border-slate-800/80 bg-slate-950/30 opacity-50'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                          unlocked ? 'bg-amber-500/20 border border-amber-500/50' : 'bg-slate-800 border border-slate-700'
                        }`}
                      >
                        {badge.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="font-bold text-xs text-white truncate">{badge.name}</h5>
                          {unlocked ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Lock className="w-3 h-3 text-slate-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{badge.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
