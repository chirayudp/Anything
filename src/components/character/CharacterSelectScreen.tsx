import React, { useState } from 'react';
import { GameLanguage, CharacterGender } from '../../types';
import { audioManager } from '../ui/audioManager';
import { Check, ArrowRight, ArrowLeft, User, Sparkles } from 'lucide-react';
import boyAvatarSrc from '../../assets/characters/boy_avatar.png';
import girlAvatarSrc from '../../assets/characters/girl_avatar.png';

interface CharacterSelectScreenProps {
  language: GameLanguage;
  initialGender?: CharacterGender;
  onSelectCharacter: (gender: CharacterGender) => void;
  onBack?: () => void;
}

export const CharacterSelectScreen: React.FC<CharacterSelectScreenProps> = ({
  language,
  initialGender = 'boy',
  onSelectCharacter,
  onBack,
}) => {
  const [selectedGender, setSelectedGender] = useState<CharacterGender>(initialGender);

  const t = {
    title: {
      en: 'Choose Your Scholar',
      hi: 'अपना छात्र अवतार चुनें',
      te: 'మీ పాత్రను ఎంచుకోండి',
    },
    subtitle: {
      en: 'Select who will journey through the financial districts of MoneyQuest.',
      hi: 'मनीक्वेस्ट के वित्तीय जिलों में यात्रा करने वाले अपने अवतार का चयन करें।',
      te: 'మనీక్వెస్ట్ నగరాల్లో ప్రయాణించే మీ విద్యార్థి పాత్రను ఎంచుకోండి.',
    },
    boyName: {
      en: 'Aarav (Boy)',
      hi: 'आरव (छात्र)',
      te: 'ఆరవ్ (అబ్బాయి)',
    },
    boyRole: {
      en: 'Strategic Budgeter',
      hi: 'रणनीतिक बजटकर्ता',
      te: 'వ్యూహాత్మక ప్రణాళికాకారుడు',
    },
    boyDesc: {
      en: 'Focused on disciplined hostel budgeting, emergency cushions, and systematic savings.',
      hi: 'अनुशासित हॉस्टल बजटिंग, आपातकालीन निधि और बचत पर ध्यान केंद्रित।',
      te: 'క్రమశిక్షణతో కూడిన హాస్టల్ బడ్జెట్, అత్యవసర పొదుపుపై దృష్టి.',
    },
    girlName: {
      en: 'Ananya (Girl)',
      hi: 'अनन्या (छात्रा)',
      te: 'అనన్య (అమ్మాయి)',
    },
    girlRole: {
      en: 'Vigilant Security Defender',
      hi: 'सतर्क सुरक्षा रक्षक',
      te: 'అప్రమత్తమైన భద్రతా రక్షకురాలు',
    },
    girlDesc: {
      en: 'Sharp eye for digital fraud, phishing links, and deceptive high-yield investment traps.',
      hi: 'डिजिटल धोखाधड़ी, फ़िशिंग लिंक और पोंजी योजनाओं की त्वरित पहचान।',
      te: 'డిజిటల్ మోసాలు, నకిలీ లింకులు మరియు మోసపూరిత స్కీములను సులువుగా గుర్తించగలదు.',
    },
    confirmBtn: {
      en: 'Confirm & Continue',
      hi: 'पुष्टि करें और आगे बढ़ें',
      te: 'ఎంచుకుని ముందుకు సాగండి',
    },
    backBtn: {
      en: 'Back',
      hi: 'पीछे',
      te: 'వెనుకకు',
    },
    selectedBadge: {
      en: 'Selected Avatar',
      hi: 'चयनित अवतार',
      te: 'ఎంచుకున్న పాత్ర',
    },
  };

  const handleSelect = (gender: CharacterGender) => {
    audioManager.playClick();
    setSelectedGender(gender);
  };

  const handleConfirm = () => {
    audioManager.playClick();
    onSelectCharacter(selectedGender);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100 relative select-none">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="max-w-2xl w-full z-10 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Character Selection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            {t.title[language]}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto">
            {t.subtitle[language]}
          </p>
        </div>

        {/* Character Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full mb-8">
          {/* Boy Character Card */}
          <div
            onClick={() => handleSelect('boy')}
            className={`group cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 flex flex-col items-center text-center relative ${
              selectedGender === 'boy'
                ? 'bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/10 scale-[1.02]'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            {selectedGender === 'boy' && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            )}

            {/* Avatar Sprite Frame */}
            <div className="w-28 h-32 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center mb-4 p-2 relative overflow-hidden group-hover:border-amber-500/30 transition">
              <img
                src={boyAvatarSrc}
                alt="Boy Scholar"
                className="w-16 h-24 object-contain image-rendering-pixelated drop-shadow-md"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            <h3 className="text-lg font-bold text-white mb-0.5">
              {t.boyName[language]}
            </h3>
            <span className="text-xs font-semibold text-amber-400 mb-2">
              {t.boyRole[language]}
            </span>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              {t.boyDesc[language]}
            </p>

            <span
              className={`text-[11px] font-bold px-3 py-1 rounded-full transition ${
                selectedGender === 'boy'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700'
              }`}
            >
              {selectedGender === 'boy' ? `✓ ${t.selectedBadge[language]}` : 'Click to Select'}
            </span>
          </div>

          {/* Girl Character Card */}
          <div
            onClick={() => handleSelect('girl')}
            className={`group cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 flex flex-col items-center text-center relative ${
              selectedGender === 'girl'
                ? 'bg-slate-900 border-pink-500 shadow-xl shadow-pink-500/10 scale-[1.02]'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            {selectedGender === 'girl' && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            )}

            {/* Avatar Sprite Frame */}
            <div className="w-28 h-32 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center mb-4 p-2 relative overflow-hidden group-hover:border-pink-500/30 transition">
              <img
                src={girlAvatarSrc}
                alt="Girl Scholar"
                className="w-20 h-28 object-contain image-rendering-pixelated drop-shadow-md"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            <h3 className="text-lg font-bold text-white mb-0.5">
              {t.girlName[language]}
            </h3>
            <span className="text-xs font-semibold text-pink-400 mb-2">
              {t.girlRole[language]}
            </span>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              {t.girlDesc[language]}
            </p>

            <span
              className={`text-[11px] font-bold px-3 py-1 rounded-full transition ${
                selectedGender === 'girl'
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700'
              }`}
            >
              {selectedGender === 'girl' ? `✓ ${t.selectedBadge[language]}` : 'Click to Select'}
            </span>
          </div>
        </div>

        {/* Plain Action Controls */}
        <div className="flex items-center gap-3 w-full max-w-sm">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-3 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.backBtn[language]}</span>
            </button>
          )}

          <button
            onClick={handleConfirm}
            className={`flex-1 py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${
              selectedGender === 'girl'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-pink-500/20'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
            }`}
          >
            <span>{t.confirmBtn[language]}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
