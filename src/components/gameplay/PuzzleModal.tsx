import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
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
import { GameStorage } from '../../engine/storage';
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
  Lightbulb
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
  const [showIdeaCard, setShowIdeaCard] = useState<boolean>(!!scenario.ideaCard);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [chosenChoices, setChosenChoices] = useState<PuzzleChoice[]>([]);
  // Pre-decision snapshot to undo financial damage on retry / recovery
  const [profileBeforeDecision, setProfileBeforeDecision] = useState<StudentProfile>(() => ({ ...profile }));
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  
  const [intermediateProfile, setIntermediateProfile] = useState<StudentProfile>(profile);
  
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [aiExplanation, setAiExplanation] = useState<AiExplanationResponse | null>(null);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const title = scenario.title[language] || scenario.title.en;
  const subtitle = scenario.subtitle[language] || scenario.subtitle.en;

  const totalSteps = scenario.steps?.length || (scenario.choices ? 1 : 0);
  const currentStep = scenario.steps?.[currentStepIndex] || (scenario.choices ? {
    id: `${scenario.id}_step_1`,
    title: scenario.title,
    situationContext: scenario.situationContext,
    choices: scenario.choices,
  } : undefined);

  // Randomize MCQ choice order so options don't appear in predictable decreasing order
  const shuffledChoices = useMemo(() => {
    if (!currentStep?.choices) return [];
    const array = [...currentStep.choices];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }, [currentStep?.id, currentStepIndex]);

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

  const handleNextStep = async () => {
    if (!selectedChoiceId || !currentStep) return;

    const chosenChoice = currentStep.choices.find((c) => c.id === selectedChoiceId);
    if (!chosenChoice) return;
    
    const newChoices = [...chosenChoices, chosenChoice];
    setChosenChoices(newChoices);
    
    const nextProfile = GameEngine.evaluateSingleStep(intermediateProfile, chosenChoice);
    setIntermediateProfile(nextProfile);
    
    setSelectedChoiceId(null);
    setActiveHint(null);

    if (currentStepIndex + 1 < totalSteps) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      await finishScenario(newChoices);
    }
  };

  const finishScenario = async (finalChoices: PuzzleChoice[]) => {
    setIsSubmitting(true);
    
    const { updatedProfile, result } = GameEngine.evaluateScenarioSequence(
      profile,
      scenario,
      finalChoices,
      language
    );

    finalChoices.forEach((choice, idx) => {
      EventLogger.recordDecision({
        studentId: profile.studentId,
        sessionId: profile.sessionId,
        regionId: profile.currentRegionId,
        cityId: scenario.cityId,
        scenarioId: scenario.id,
        choiceId: choice.id,
        tier: choice.tier,
        pillar: scenario.pillar,
        walletBefore: profile.walletBalance,
        walletAfter: updatedProfile.walletBalance,
        emergencyBefore: profile.emergencyFund,
        emergencyAfter: updatedProfile.emergencyFund,
        financialImpact: choice.financialImpact,
        feedbackShown: result.feedback,
        language,
      });
    });

    onUpdateProfile(updatedProfile);
    setEvaluation(result);

    if (result.overallTier === 'best') {
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {}
    }

    try {
      const lastChoice = finalChoices[finalChoices.length - 1];
      const explanation = await AiService.getExplanation({
        scenarioTitle: title,
        scenarioContext: scenario.situationContext[language] || scenario.situationContext.en,
        pillar: scenario.pillar,
        chosenOptionText: lastChoice.text[language] || lastChoice.text.en,
        tier: result.overallTier || result.tier || 'good',
        financialImpact: result.financialImpact,
        language,
      });
      setAiExplanation(explanation);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  // Retry (Recovery Mode / Revert Financial Penalty)
  const handleRetry = () => {
    // Revert profile to the state before the failed decision was committed
    onUpdateProfile(profileBeforeDecision);
    setShowIdeaCard(false);
    setCurrentStepIndex(0);
    setChosenChoices([]);
    setSelectedChoiceId(null);
    setIntermediateProfile(profileBeforeDecision);
    setEvaluation(null);
    setAiExplanation(null);
    setActiveHint(null);
  };

  // Immediate Bankruptcy Reset inside Puzzle
  const handleResetBankruptcyInPuzzle = () => {
    const refreshed = GameStorage.resetBankruptcy(profile);
    setProfileBeforeDecision({ ...refreshed });
    onUpdateProfile(refreshed);
  };

  const mountNode = typeof document !== 'undefined' ? (document.fullscreenElement || document.body) : null;

  if (showIdeaCard && scenario.ideaCard) {
    const cardTitle = scenario.ideaCard.title[language] || scenario.ideaCard.title.en;
    const cardPoints = scenario.ideaCard.points.map(p => p[language] || p.en);
    const ideaContent = (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
        <div className="max-w-xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-8 h-8 text-amber-400" />
            <h2 className="text-2xl font-extrabold text-white">Idea Card: {cardTitle}</h2>
          </div>
          <div className="space-y-4 mb-8">
            {cardPoints.map((pt, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-xl">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">{idx + 1}</span>
                <span className="text-slate-200 text-sm leading-relaxed">{pt}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setShowIdeaCard(false)} className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl shadow-lg transition active:scale-95">
            Got it! Start Scenario
          </button>
        </div>
      </div>
    );
    return mountNode ? createPortal(ideaContent, mountNode) : ideaContent;
  }

  const content = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl transition">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-wrap items-center justify-between mb-4">
          <div className="flex gap-2">
            <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300">
              Pillar: {scenario.pillar.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
              {scenario.stipendContext}
            </span>
          </div>
          
          <div className="flex gap-4 text-xs font-mono">
            <div className="text-emerald-400">Wallet: ₹{intermediateProfile.walletBalance}</div>
            <div className="text-sky-400">Reserve: ₹{intermediateProfile.emergencyFund}</div>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-white mb-1">{title}</h2>
        <div className="text-sm font-medium text-amber-400 mb-4">{subtitle}</div>

        {/* In-Puzzle Bankruptcy Warning & Relief Action */}
        {profile.walletBalance <= 0 && (
          <div className="bg-rose-950/70 border border-rose-500/60 rounded-2xl p-4 mb-5 text-rose-200 text-xs flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 animate-bounce" />
              <div>
                <span className="font-extrabold text-rose-300 uppercase tracking-wider">Bankruptcy Reached: </span>
                <span>Your wallet balance is ₹0. Claim emergency relief to continue.</span>
              </div>
            </div>
            <button
              onClick={handleResetBankruptcyInPuzzle}
              className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl shadow-md transition whitespace-nowrap active:scale-95"
            >
              Reset to ₹5,000
            </button>
          </div>
        )}

        {!evaluation && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-slate-200 text-sm leading-relaxed mb-6">
            <p>{scenario.situationContext[language] || scenario.situationContext.en}</p>
          </div>
        )}

        {!evaluation && scenario.steps && scenario.steps.length > 1 && (
          <div className="flex items-center gap-2 mb-6">
            {scenario.steps.map((s, idx) => (
              <div key={s.id} className={`h-1.5 flex-1 rounded-full ${idx <= currentStepIndex ? 'bg-amber-400' : 'bg-slate-700'}`} />
            ))}
          </div>
        )}

        {!evaluation && currentStep && (
          <>
            {currentStep.situationContext && (
               <div className="mb-4 text-sm text-slate-300 bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
                 {currentStep.situationContext[language] || currentStep.situationContext.en}
               </div>
            )}
            
            {activeHint ? (
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3.5 mb-6 text-xs text-amber-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div><span className="font-bold">Mentor Hint: </span>{activeHint}</div>
              </div>
            ) : (
              <div className="mb-6 flex justify-end">
                <button onClick={handleRequestHint} disabled={isLoadingHint} className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition">
                  <HelpCircle className="w-4 h-4" />
                  <span>{isLoadingHint ? 'Generating Hint...' : 'Need a Hint?'}</span>
                </button>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Step {currentStepIndex + 1}: {currentStep.title[language] || currentStep.title.en}
              </div>
              {shuffledChoices.map((choice) => {
                const choiceText = choice.text[language] || choice.text.en;
                const isSelected = selectedChoiceId === choice.id;
                return (
                  <div
                    key={choice.id}
                    onClick={() => setSelectedChoiceId(choice.id)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all text-sm ${isSelected ? 'bg-amber-500/10 border-amber-500 text-white' : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-950'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition ${isSelected ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-600'}`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                      </div>
                      <div className="leading-snug">{choiceText}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {evaluation && (
          <div className="space-y-5 mb-6">
            <div className={`rounded-2xl p-4 border flex items-center justify-between gap-4 ${evaluation.isPassed ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200' : 'bg-rose-950/50 border-rose-500/50 text-rose-200'}`}>
              <div className="flex items-center gap-3">
                {evaluation.isPassed ? <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" /> : <ShieldAlert className="w-6 h-6 text-rose-400 flex-shrink-0" />}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">
                    {evaluation.isPassed ? 'Scenario Cleared' : 'Recovery State Triggered'}
                  </div>
                  <div className="font-extrabold text-base text-white">
                    {evaluation.overallTier === 'best' ? `Best Outcome (${evaluation.totalPoints}/9)` : evaluation.overallTier === 'good' ? `Good Outcome (${evaluation.totalPoints}/9)` : evaluation.overallTier === 'bad' ? `Suboptimal Outcome (${evaluation.totalPoints}/9)` : `Critical Trap (${evaluation.totalPoints}/9)`}
                  </div>
                </div>
              </div>
              <div className="text-right text-xs">
                <div>Total Wallet: ₹{evaluation.financialImpact.walletDelta}</div>
                <div>Total Reserve: ₹{evaluation.financialImpact.emergencyDelta}</div>
              </div>
            </div>
            
            {aiExplanation ? (
              <AiFeedbackCard explanation={aiExplanation} isPassed={evaluation.isPassed} />
            ) : (
              <div className="bg-slate-800 p-4 rounded-xl text-sm text-slate-300">{evaluation.feedback}</div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition">
            Cancel
          </button>

          {!evaluation ? (
            <button
              onClick={handleNextStep}
              disabled={!selectedChoiceId || isSubmitting}
              className={`px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition ${selectedChoiceId && !isSubmitting ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950' : 'bg-slate-800 text-slate-500'}`}
            >
              <span>{isSubmitting ? 'Simulating...' : currentStepIndex + 1 === totalSteps ? 'Finalize Decisions' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : evaluation.isRecoveryNeeded ? (
            <button onClick={handleRetry} className="px-6 py-3 bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>Retry Challenge</span>
            </button>
          ) : (
            <button onClick={onClose} className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2">
              <span>Continue Adventure</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return mountNode ? createPortal(content, mountNode) : content;
};
