import React from 'react';
import { AiExplanationResponse } from '../../types';
import { Sparkles, Lightbulb, MapPin, CheckCircle2, AlertOctagon } from 'lucide-react';

interface AiFeedbackCardProps {
  explanation: AiExplanationResponse;
  isPassed: boolean;
}

export const AiFeedbackCard: React.FC<AiFeedbackCardProps> = ({ explanation, isPassed }) => {
  return (
    <div
      className={`rounded-2xl p-5 border shadow-xl backdrop-blur-sm transition-all ${
        isPassed
          ? 'bg-slate-900/95 border-emerald-500/40'
          : 'bg-slate-900/95 border-rose-500/40'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {isPassed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertOctagon className="w-5 h-5 text-rose-400" />
          )}
          <span className="font-bold text-sm text-white">
            {isPassed ? 'Learning Feedback' : 'Recovery & Reflection'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{explanation.isAiGenerated ? 'Gemini AI Feedback' : 'Curriculum Guide'}</span>
        </div>
      </div>

      {/* Main Explanation */}
      <p className="text-sm text-slate-200 leading-relaxed mb-4">{explanation.explanation}</p>

      {/* Hyderabad Context */}
      {explanation.relatableHyderabadStudentContext && (
        <div className="flex items-start gap-2 bg-slate-950/70 border border-slate-800 rounded-xl p-3 mb-3 text-xs text-amber-300">
          <MapPin className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
          <div>
            <span className="font-bold text-amber-200">Hyderabad Student Context: </span>
            {explanation.relatableHyderabadStudentContext}
          </div>
        </div>
      )}

      {/* Encouraging Tip */}
      {explanation.encouragingTip && (
        <div className="flex items-start gap-2 bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
          <Lightbulb className="w-4 h-4 flex-shrink-0 text-yellow-400 mt-0.5" />
          <div>
            <span className="font-bold text-slate-100">Key Takeaway: </span>
            {explanation.encouragingTip}
          </div>
        </div>
      )}
    </div>
  );
};
