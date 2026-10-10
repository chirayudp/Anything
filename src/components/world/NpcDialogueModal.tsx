import React from 'react';
import { NPC, GameLanguage } from '../../types';
import { MessageSquare, ArrowRight, X } from 'lucide-react';

interface NpcDialogueModalProps {
  npc: NPC;
  language: GameLanguage;
  isSolved: boolean;
  onClose: () => void;
  onStartChallenge: (scenarioId: string) => void;
}

export const NpcDialogueModal: React.FC<NpcDialogueModalProps> = ({
  npc,
  language,
  isSolved,
  onClose,
  onStartChallenge,
}) => {
  const dialogue = isSolved && npc.dialogueSolved
    ? npc.dialogueSolved[language] || npc.dialogueSolved.en
    : npc.dialogueIntro[language] || npc.dialogueIntro.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="max-w-lg w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* NPC Profile Header */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shadow-inner">
            {npc.avatar}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">{npc.name}</h3>
            <div className="text-xs text-amber-400 font-semibold">{npc.role}</div>
          </div>
        </div>

        {/* Dialogue Balloon */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-slate-200 text-sm leading-relaxed mb-6">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="italic">"{dialogue}"</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
          >
            Close
          </button>

          {npc.scenarioId && (
            <button
              onClick={() => {
                onClose();
                onStartChallenge(npc.scenarioId!);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition transform active:scale-95"
            >
              <span>{isSolved ? 'Replay Challenge' : 'Accept Challenge'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
