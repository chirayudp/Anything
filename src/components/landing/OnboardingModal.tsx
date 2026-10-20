import React, { useState } from 'react';
import { GameLanguage } from '../../types';
import { TRANSLATIONS } from '../../translations';
import { audioManager } from '../ui/audioManager';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Award,
  Wallet,
  Shield,
  Compass,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface OnboardingModalProps {
  language: GameLanguage;
  isOpen: boolean;
  onProceed: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  language,
  isOpen,
  onProceed,
}) => {
  const t = TRANSLATIONS[language].onboarding;
  const [currentStep, setCurrentStep] = useState(1);

  // Interactive 50-30-20 Envelope Budget Simulator for Step 3
  const [needsPercent, setNeedsPercent] = useState(50);
  const [wantsPercent, setWantsPercent] = useState(30);
  const [savingsPercent, setSavingsPercent] = useState(20);

  if (!isOpen) return null;

  const totalPercent = needsPercent + wantsPercent + savingsPercent;
  const isBudgetValid = totalPercent === 100 && savingsPercent >= 15;

  const handleNext = () => {
    audioManager.playClick();
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    } else {
      audioManager.playFanfare();
      onProceed();
    }
  };

  const handleBack = () => {
    audioManager.playClick();
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="max-w-2xl w-full bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Step {currentStep} of 5</span>
          </div>

          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((step) => (
              <span
                key={step}
                className={`h-2 rounded-full transition-all ${
                  step === currentStep
                    ? 'w-7 bg-amber-500'
                    : step < currentStep
                    ? 'w-3 bg-amber-500/50'
                    : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: THE SCHOLARSHIP AWARD */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-xl mb-3">
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.step1Title}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {t.step1Desc}
            </p>

            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-300 uppercase tracking-wider font-bold">
                  Merit Stipend Granted
                </div>
                <div className="text-xs text-slate-400">Class 11 Scholar • Hyderabad</div>
              </div>
              <div className="text-2xl font-black text-amber-400">₹5,000 / mo</div>
            </div>
          </div>
        )}

        {/* STEP 2: THE REALITY OF HOSTEL LIFE */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-600 flex items-center justify-center text-white shadow-xl mb-3">
              <Wallet className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.step2Title}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {t.step2Desc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <span className="text-rose-400 font-bold block mb-1">Fixed Needs</span>
                <span className="text-slate-400">Mess dues, hostel room rent & stationery books.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <span className="text-amber-400 font-bold block mb-1">Wants & Traps</span>
                <span className="text-slate-400">Irani chai outings, snacks, peer pressure spends.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <span className="text-emerald-400 font-bold block mb-1">Surprise Emergencies</span>
                <span className="text-slate-400">Broken phone screens, urgent transit, doctor visits.</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: INTERACTIVE 50-30-20 ENVELOPE BUDGET */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-xl mb-2">
              <Sliders className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-extrabold text-white">{t.step3Title}</h2>
            <p className="text-xs sm:text-sm text-slate-300">{t.step3Desc}</p>

            <div className="space-y-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              {/* Needs Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-400">Needs (Mess & Books): {needsPercent}%</span>
                  <span className="text-slate-300">₹{(5000 * needsPercent) / 100}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="70"
                  value={needsPercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setNeedsPercent(val);
                    setSavingsPercent(Math.max(10, 100 - val - wantsPercent));
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Wants Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-sky-400">Wants (Cafe & Treats): {wantsPercent}%</span>
                  <span className="text-slate-300">₹{(5000 * wantsPercent) / 100}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={wantsPercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setWantsPercent(val);
                    setSavingsPercent(Math.max(10, 100 - needsPercent - val));
                  }}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              {/* Emergency Reserve Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-400">Emergency Reserve: {savingsPercent}%</span>
                  <span className="text-slate-300">₹{(5000 * savingsPercent) / 100}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={savingsPercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSavingsPercent(val);
                    setWantsPercent(Math.max(10, 100 - needsPercent - val));
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Allocated: {needsPercent + wantsPercent + savingsPercent}%</span>
                {savingsPercent >= 20 ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Healthy 20% Reserve
                  </span>
                ) : (
                  <span className="text-amber-400">Aim for at least 20% in reserve</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CONTROLS & WORLD EXPLORATION */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-700 flex items-center justify-center text-white shadow-xl mb-3">
              <Compass className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.step4Title}
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">{t.step4Desc}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">🎮 Movement</span>
                <span className="text-slate-300">{t.controlsKeyboard}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-sky-400 font-bold block mb-1">💬 Interaction</span>
                <span className="text-slate-300">{t.controlsSpace}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">📱 Touch Screen</span>
                <span className="text-slate-300">{t.controlsTouch}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: READY TO EMBARK */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 shadow-xl mb-3">
              <Shield className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.step5Title}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {t.step5Desc}
            </p>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
              <span className="text-2xl">🌱</span>
              <span>
                First Quest Objective: Head inside Hostel Commons in Region 1 and make your first month budget decision.
              </span>
            </div>
          </div>
        )}

        {/* Navigation Buttons Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-6">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.prevStep}</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95"
          >
            <span>{currentStep === 5 ? t.finishOnboarding : t.nextStep}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
