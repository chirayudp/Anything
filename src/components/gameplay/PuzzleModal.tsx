import React, { useState } from 'react';
import {
  PuzzleScenario,
  PuzzleChoice,
  StudentProfile,
  GameLanguage,
  EvaluationResult,
  AiExplanationResponse,
} from '../../types';
import { GameEngine } from '../../engine/gameEngine';
import { EventLogger } from '../../engine/eventLogger';
import { AiService } from '../../services/aiService';
import { AiFeedbackCard } from '../ai/AiFeedbackCard';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldAlert,
  Wallet,
  X,
  CheckCircle,
} from 'lucide-react';

interface PuzzleModalProps {
  scenario: PuzzleScenario;
  profile: StudentProfile;
  language: GameLanguage;
  onClose: () => void;
  onUpdateProfile: (updated: StudentProfile) => void;
}

export const PuzzleModal: React.FC<PuzzleModalProps> = ({
  scenario,
  profile,
  language,
  onClose,
  onUpdateProfile,
}) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [aiExplanation, setAiExplanation] = useState<AiExplanationResponse | null>(null);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const title = scenario.title[language] || scenario.title.en;
  const subtitle = scenario.subtitle[language] || scenario.subtitle.en;
  const situation = scenario.situationContext[language] || scenario.situationContext.en;

  // Request Hint
  const handleRequestHint = async () => {
    setIsLoadingHint(true);
    try {
      const hintRes = await AiService.getHint({
        scenarioTitle: title,
        pillar: scenario.pillar,
        language,
      });
      setActiveHint(hintRes.hint);
    } catch {
      setActiveHint(scenario.educationalHint[language] || scenario.educationalHint.en);
    } finally {
      setIsLoadingHint(false);
    }
  };

  // Submit Decision
  const handleConfirmDecision = async () => {
    if (!selectedChoiceId || isSubmitting) return;

    const chosenChoice = scenario.choices.find((c) => c.id === selectedChoiceId);
    if (!chosenChoice) return;

    setIsSubmitting(true);

    // 1. Pure Deterministic Evaluation by GameEngine
    const { updatedProfile, result } = GameEngine.evaluateChoice(
      profile,
      scenario,
      chosenChoice,
      language
    );

    // 2. Chronological Decision Logging
    EventLogger.recordDecision({
      studentId: profile.studentId,
      sessionId: profile.sessionId,
      regionId: profile.currentRegionId,
      cityId: scenario.cityId,
      scenarioId: scenario.id,
      choiceId: chosenChoice.id,
      tier: chosenChoice.tier,
      pillar: scenario.pillar,
      walletBefore: profile.walletBalance,
      walletAfter: updatedProfile.walletBalance,
      emergencyBefore: profile.emergencyFund,
      emergencyAfter: updatedProfile.emergencyFund,
      financialImpact: chosenChoice.financialImpact,
      feedbackShown: result.feedback,
      language,
    });

    // 3. Update global player profile
    onUpdateProfile(updatedProfile);
    setEvaluation(result);

    // 4. Trigger celebration confetti on Best choice
    if (chosenChoice.tier === 'best') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe if canvas-confetti is not rendered
      }
    }

    // 5. Fetch AI Pedagogical Explanation
    try {
      const explanation = await AiService.getExplanation({
        scenarioTitle: title,
        scenarioContext: situation,
        pillar: scenario.pillar,
        chosenOptionText: chosenChoice.text[language] || chosenChoice.text.en,
        tier: chosenChoice.tier,
        financialImpact: chosenChoice.financialImpact,
        language,
      });
      setAiExplanation(explanation);
    } catch {
      // Handled internally by AiService fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  // Retry (Recovery Mode)
  const handleRetry = () => {
    setSelectedChoiceId(null);
    setEvaluation(null);
    setAiExplanation(null);
    setActiveHint(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300">
            Pillar: {scenario.pillar.toUpperCase()}
          </span>
          <span className="text-xs text-slate-400 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
            {scenario.stipendContext}
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-white mb-1">{title}</h2>
        <div className="text-sm font-medium text-amber-400 mb-4">{subtitle}</div>

        {/* Situation Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-slate-200 text-sm leading-relaxed mb-6">
          <p>{situation}</p>
        </div>

        {/* Hint Section */}
        {activeHint ? (
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3.5 mb-6 text-xs text-amber-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Mentor Hint: </span>
              {activeHint}
            </div>
          </div>
        ) : (
          !evaluation && (
            <div className="mb-6 flex justify-end">
              <button
                onClick={handleRequestHint}
                disabled={isLoadingHint}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{isLoadingHint ? 'Generating Hint...' : 'Need a Hint?'}</span>
              </button>
            </div>
          )
        )}

        {/* Decision Choices or Evaluation Resolution */}
        {!evaluation ? (
          <div className="space-y-3 mb-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select Your Financial Decision:
            </div>
            {scenario.choices.map((choice) => {
              const choiceText = choice.text[language] || choice.text.en;
              const isSelected = selectedChoiceId === choice.id;

              return (
                <div
                  key={choice.id}
                  onClick={() => setSelectedChoiceId(choice.id)}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all text-sm ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400 text-slate-950'
                          : 'border-slate-600 bg-transparent'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                    </div>
                    <div className="leading-snug">{choiceText}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Consequence & Educational Feedback Screen */
          <div className="space-y-5 mb-6">
            {/* Outcome Impact Banner */}
            <div
              className={`rounded-2xl p-4 border flex items-center justify-between gap-4 ${
                evaluation.isPassed
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {evaluation.isPassed ? (
                  <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-rose-400 flex-shrink-0" />
                )}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">
                    {evaluation.isPassed ? 'Decision Passed' : 'Recovery State Triggered'}
                  </div>
                  <div className="font-extrabold text-base text-white">
                    {evaluation.tier === 'best'
                      ? 'Best Decision (+100 Score)'
                      : evaluation.tier === 'better'
                      ? 'Better Decision (+75 Score)'
                      : evaluation.tier === 'good'
                      ? 'Good Decision (+50 Score)'
                      : 'Very Bad Decision (Critical Trap)'}
                  </div>
                </div>
              </div>

              {/* Net Wallet Delta */}
              <div className="text-right text-xs">
                <div>Wallet: ₹{evaluation.financialImpact.walletDelta}</div>
                <div>Reserve: ₹{evaluation.financialImpact.emergencyDelta}</div>
              </div>
            </div>

            {/* AI or Fallback Explanation Card */}
            {aiExplanation && (
              <AiFeedbackCard explanation={aiExplanation} isPassed={evaluation.isPassed} />
            )}
          </div>
        )}

        {/* Modal Action Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>

          {!evaluation ? (
            <button
              onClick={handleConfirmDecision}
              disabled={!selectedChoiceId || isSubmitting}
              className={`px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                selectedChoiceId && !isSubmitting
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>{isSubmitting ? 'Simulating Consequence...' : 'Commit Decision'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : evaluation.isRecoveryNeeded ? (
            /* Recovery Retry Button */
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry with Better Financial Judgement</span>
            </button>
          ) : (
            /* Continue Adventure Button */
            <button
              onClick={onClose}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition transform active:scale-95"
            >
              <span>Continue Adventure</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
