import React from 'react';
import { createPortal } from 'react-dom';
import { StudentProfile, GameLanguage } from '../../types';
import { AlertOctagon, RotateCcw, Sparkles, ShieldAlert, Award } from 'lucide-react';

interface BankruptcyModalProps {
  profile: StudentProfile;
  language: GameLanguage;
  onResetBankruptcy: () => void;
  onFullReset: () => void;
  onClose?: () => void;
}

export const BankruptcyModal: React.FC<BankruptcyModalProps> = ({
  profile,
  language,
  onResetBankruptcy,
  onFullReset,
  onClose,
}) => {
  const content = {
    en: {
      badge: 'FINANCIAL CRISIS',
      title: 'Student Bankruptcy Reached',
      subtitle: 'Your wallet balance is ₹0! You have run out of scholarship funds.',
      explanation:
        'In student life, unexpected emergencies, debt traps, or overspending on fun can drain your entire stipend before the month ends. Without an emergency reserve, you face food insecurity and mounting stress.',
      reliefNote:
        'The University Welfare Board has authorized an Emergency Relief Grant of ₹5,000 so you can reset your finances and make wiser budget allocations.',
      actionReset: 'Bankruptcy Reset: Claim ₹5,000 Relief',
      actionFullReset: 'Full Restart from Day 1',
      dismiss: 'Explore City (₹0 Balance)',
    },
    hi: {
      badge: 'वित्तीय संकट',
      title: 'छात्र दिवालियापन स्थिति',
      subtitle: 'आपका बटुआ ₹0 हो गया है! आपकी छात्रवृत्ति समाप्त हो गई है।',
      explanation:
        'छात्र जीवन में, अप्रत्याशित खर्चे या गलत वित्तीय निर्णय महीने के अंत से पहले ही वजीफा खाली कर देते हैं। बिना आपातकालीन फंड के संकट खड़ा हो जाता है।',
      reliefNote:
        'विश्वविद्यालय छात्र कल्याण बोर्ड ने ₹5,000 का आपातकालीन अनुदान स्वीकृत किया है ताकि आप अपने बजट को फिर से शुरू कर सकें।',
      actionReset: 'दिवालियापन रीसेट: ₹5,000 राहत प्राप्त करें',
      actionFullReset: 'शुरुआत से पुनः प्रारंभ करें',
      dismiss: 'घूमें (₹0 शेष)',
    },
    te: {
      badge: 'ఆర్థిక సంక్షోభం',
      title: 'విద్యార్థి దివాలా స్థితి',
      subtitle: 'మీ వాలెట్ బ్యాలెన్స్ ₹0! మీ స్కాలర్‌షిప్ నిధులు అయిపోయాయి.',
      explanation:
        'విద్యార్థి జీవితంలో, అనుకోని ఖర్చులు లేదా అజాగ్రత్త ఖర్చుల వల్ల నెలాఖరుకు ముందే స్కాలర్‌షిప్ మొత్తం ఖాళీ అవుతుంది. అత్యవసర నిధి లేకపోతే తీవ్ర ఇబ్బందులు ఎదురవుతాయి.',
      reliefNote:
        'యూనివర్సిటీ సంక్షేమ బోర్డు ₹5,000 అత్యవసర ఉపశమన గ్రాంట్‌ను మంజూరు చేసింది, తద్వారా మీరు తెలివైన బడ్జెట్‌తో మళ్ళీ ప్రారంభించవచ్చు.',
      actionReset: 'దివాలా రీసెట్: ₹5,000 సహాయం పొందండి',
      actionFullReset: 'మొదటి నుండి ప్రారంభించండి',
      dismiss: 'తిలకించండి (₹0 నిల్వ)',
    },
  }[language];

  const modalContent = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="max-w-lg w-full bg-slate-900 border-2 border-rose-500/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-slate-100 my-8">
        {/* Pulsing Crisis Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-950 border-2 border-rose-500 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-950/50 animate-bounce flex-shrink-0">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
              {content.badge}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1 leading-tight">
              {content.title}
            </h2>
          </div>
        </div>

        {/* Status Callout */}
        <div className="bg-rose-950/50 border border-rose-500/40 rounded-2xl p-4 mb-4 text-rose-200 text-sm">
          <div className="font-bold flex items-center gap-2 mb-1">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>{content.subtitle}</span>
          </div>
          <p className="text-xs text-rose-300/90 leading-relaxed mt-1">
            {content.explanation}
          </p>
        </div>

        {/* Pedagogical Relief Note */}
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 mb-6 text-xs text-amber-200/90 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-300 mb-0.5">Financial Second Chance</div>
            <div>{content.reliefNote}</div>
          </div>
        </div>

        {/* Current State Summary */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-center text-xs">
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[10px] uppercase">Wallet</div>
            <div className="text-rose-400 font-extrabold text-sm">₹{profile.walletBalance}</div>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[10px] uppercase">Reserve</div>
            <div className="text-sky-400 font-bold text-sm">₹{profile.emergencyFund}</div>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[10px] uppercase">Score</div>
            <div className="text-amber-400 font-bold text-sm">{profile.totalScore}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={onResetBankruptcy}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-900/40 transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{content.actionReset}</span>
          </button>

          <button
            onClick={onFullReset}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{content.actionFullReset}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="w-full py-2 text-center text-[11px] text-slate-400 hover:text-slate-300 transition"
            >
              {content.dismiss}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const mountNode = document.fullscreenElement || document.body;
  return createPortal(modalContent, mountNode);
};
