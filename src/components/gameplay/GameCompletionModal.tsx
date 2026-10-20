import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { StudentProfile, GameLanguage } from '../../types';
import { audioManager } from '../ui/audioManager';
import boyAvatarSrc from '../../assets/characters/boy_avatar.png';
import girlAvatarSrc from '../../assets/characters/girl_avatar.png';
import {
  Trophy,
  Award,
  ShieldCheck,
  Wallet,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  BarChart3,
  Compass,
  Printer,
  X,
  ExternalLink,
} from 'lucide-react';

interface GameCompletionModalProps {
  profile: StudentProfile;
  language: GameLanguage;
  isOpen: boolean;
  onClose: () => void;
  onOpenNgoDashboard?: () => void;
  onRestartJourney?: () => void;
}

export const GameCompletionModal: React.FC<GameCompletionModalProps> = ({
  profile,
  language,
  isOpen,
  onClose,
  onOpenNgoDashboard,
  onRestartJourney,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    // Trigger grand fanfare
    audioManager.playGrandVictoryFanfare();

    // Multiphase celebratory confetti blast
    const count = 200;
    const defaults = {
      origin: { y: 0.6 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#a855f7', '#ec4899', '#6366f1'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });

    const secondTimer = setTimeout(() => {
      fire(0.3, {
        spread: 100,
        startVelocity: 40,
        colors: ['#fbbf24', '#f43f5e', '#3b82f6'],
      });
    }, 600);

    return () => clearTimeout(secondTimer);
  }, [isOpen]);

  if (!isOpen) return null;

  const isGirl = profile.characterGender === 'girl';
  const avatarImg = isGirl ? girlAvatarSrc : boyAvatarSrc;
  const scholarName = isGirl ? 'Ananya' : 'Aarav';

  const t = {
    badge: {
      en: 'ODYSSEY CONQUERED • 100% COMPLETE',
      hi: 'यात्रा संपन्न • 100% पूर्ण',
      te: 'యాత్ర పూర్తి • 100% పూర్తయింది',
    },
    title: {
      en: 'Grand Congratulations, Scholar!',
      hi: 'हार्दिक बधाई, होनहार छात्र!',
      te: 'హృదయపూర్వక అభినందనలు, విద్యార్థి!',
    },
    subtitle: {
      en: 'You have mastered Map 4: Harbor Town and conquered all 4 Pillars of Financial Literacy!',
      hi: 'आपने मैप 4: हार्बर टाउन पूरा कर लिया है और वित्तीय साक्षरता के चारों स्तंभों में महारत हासिल की है!',
      te: 'మీరు మ్యాప్ 4: హార్బర్ టౌన్ పూర్తి చేసి ఆర్థిక అక్షరాస్యత యొక్క 4 స్తంభాలలో ప్రావీణ్యం సంపాదించారు!',
    },
    certificateTitle: {
      en: 'Certificate of Financial Mastery',
      hi: 'वित्तीय निपुणता प्रमाण पत्र',
      te: 'ఆర్థిక నైపుణ్య ధృవీకరణ పత్రం',
    },
    awardedTo: {
      en: 'Awarded to Class 11 Scholar',
      hi: '11वीं कक्षा के छात्र को प्रदान किया गया',
      te: '11వ తరగతి విద్యార్థికి అందించబడింది',
    },
    honorText: {
      en: 'For outstanding financial discipline, risk diversification, long-term foresight, and digital cyber security hygiene.',
      hi: 'उत्कृष्ट वित्तीय अनुशासन, जोखिम विविधीकरण, दीर्घकालिक दूरदर्शिता और डिजिटल सुरक्षा सतर्कता के लिए।',
      te: 'అత్యుత్తమ ఆర్థిక క్రమశిక్షణ, రిస్క్ వైవిధ్యీకరణ, దీర్ఘకాలిక ఆలోచన మరియు సైబర్ భద్రత కోసం.',
    },
    pillarsCompleted: {
      en: 'All 4 Financial Pillars Mastered',
      hi: 'सभी 4 वित्तीय स्तंभों में महारत',
      te: '4 ఆర్థిక స్తంభాలలో పూర్తి ప్రావీణ్యం',
    },
    pillar1Title: {
      en: 'Pillar 1: Plan & Budget (Hostel Commons)',
      hi: 'स्तंभ 1: योजना और बजट (हॉस्टल)',
      te: 'స్తంభం 1: ప్రణాళిక & బడ్జెట్ (హాస్టల్)',
    },
    pillar1Desc: {
      en: '50-30-20 rule, hostel expenses, and disciplined needs vs. wants.',
      hi: '50-30-20 नियम, हॉस्टल खर्च और जरूरत बनाम चाहत का विवेक।',
      te: '50-30-20 నియమం, హాస్టల్ ఖర్చులు మరియు అవసరాలు vs కోరికలు.',
    },
    pillar2Title: {
      en: 'Pillar 2: Smart Sourcing (Academic Bazaar)',
      hi: 'स्तंभ 2: स्मार्ट सोर्सिंग (अकादमिक बाजार)',
      te: 'స్తంభం 2: స్మార్ట్ సోర్సింగ్ (అకడమిక్ బజార్)',
    },
    pillar2Desc: {
      en: 'Second-hand textbook sourcing, repair estimation, and market haggling.',
      hi: 'किताबों की खरीदारी, मरम्मत का सही अनुमान और बाजार में समझदारी।',
      te: 'పుస్తకాల కొనుగోలు, మరమ్మతు అంచనా మరియు మార్కెట్ బడ్జెటింగ్.',
    },
    pillar3Title: {
      en: 'Pillar 3: Understand Investing (Investment Valley)',
      hi: 'स्तंभ 3: निवेश को समझें (इन्वेस्टमेंट वैली)',
      te: 'స్తంభం 3: పెట్టుబడులను అర్థం చేసుకోండి (ఇన్వెస్ట్‌మెంట్ వ్యాలీ)',
    },
    pillar3Desc: {
      en: 'Mango Tree patient compounding, token allocation, and boat diversification.',
      hi: 'आम के पेड़ की तरह धैर्य, टोकन आवंटन और नावों का विविधीकरण।',
      te: 'మామిడి చెట్టు వంటి ఓర్పుతో కూడిన వృద్ధి మరియు పెట్టుబడుల వైవిధ్యం.',
    },
    pillar4Title: {
      en: 'Pillar 4: Stay Safe (Harbor Town)',
      hi: 'स्तंभ 4: वित्तीय सुरक्षा (हार्बर टाउन)',
      te: 'స్తంభం 4: ఆర్థిక భద్రత (హార్బర్ టౌన్)',
    },
    pillar4Desc: {
      en: 'Shielding UPI PINs, spotting scholarship phishing, and ATM skimmer defense.',
      hi: 'यूपीआई पिन सुरक्षा, फर्जी स्कॉलरशिप एसएमएस और एटीएम धोखाधड़ी से बचाव।',
      te: 'యూపీఐ పిన్ భద్రత, నకిలీ స్కాలర్‌షిప్ ఎస్ఎంఎస్ మరియు ఏటీఎం రక్షణ.',
    },
    walletLabel: {
      en: 'Final Wallet Balance',
      hi: 'अंतिम बटुआ शेष',
      te: 'చివరి వాలెట్ బ్యాలెన్స్',
    },
    reserveLabel: {
      en: 'Emergency Reserve',
      hi: 'आपातकालीन रिजर्व',
      te: 'అత్యవసర రిజర్వ్',
    },
    scoreLabel: {
      en: 'Total Literacy Score',
      hi: 'कुल साक्षरता अंक',
      te: 'మొత్తం స్కోరు',
    },
    exploreBtn: {
      en: 'Keep Exploring World',
      hi: 'दुनिया में घूमना जारी रखें',
      te: 'ప్రపంచాన్ని అన్వేషించండి',
    },
    ngoBtn: {
      en: 'View NGO Educator Analytics',
      hi: 'एनजीओ शिक्षक रिपोर्ट देखें',
      te: 'ఎన్జీవో రిపోర్ట్ చూడండి',
    },
    restartBtn: {
      en: 'Play Again / New Journey',
      hi: 'पुनः खेलें / नई यात्रा',
      te: 'మళ్లీ ఆడండి / కొత్త ప్రయాణం',
    },
    printBtn: {
      en: 'Print Certificate',
      hi: 'प्रमाणपत्र प्रिंट करें',
      te: 'సర్టిఫికేట్ ప్రింట్ చేయండి',
    },
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="max-w-3xl w-full bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[94vh]">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/20 via-emerald-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-sky-500/20 to-transparent blur-3xl pointer-events-none" />

        {/* Close Modal Button */}
        <button
          onClick={() => {
            audioManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition z-10"
          title="Close Congratulations Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ribbon */}
        <div className="text-center relative z-10 mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-inner mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>{t.badge[language]}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 tracking-tight">
            {t.title[language]}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-1">
            {t.subtitle[language]}
          </p>
        </div>

        {/* Scrollable Main Certificate Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 sm:space-y-6 relative z-10">
          {/* Certificate Card */}
          <div className="bg-gradient-to-b from-amber-950/20 via-slate-950/90 to-slate-950/95 border-2 border-amber-500/50 rounded-2xl p-4 sm:p-6 text-center relative shadow-xl">
            {/* Top Seal */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/10 border-2 border-amber-400/60 p-1 flex items-center justify-center shadow-lg">
                <img
                  src={avatarImg}
                  alt={scholarName}
                  className="w-full h-full object-contain [image-rendering:pixelated]"
                />
              </div>
            </div>

            <div className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-bold">
              {t.awardedTo[language]}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-mono tracking-wider mt-0.5 mb-1">
              {profile.studentId} ({scholarName})
            </h3>
            <p className="text-xs text-slate-300 max-w-lg mx-auto italic mb-4">
              "{t.honorText[language]}"
            </p>

            {/* Financial Metrics Strip */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 bg-slate-900/90 rounded-xl border border-amber-500/30 text-left mb-4">
              <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-xs">
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.walletLabel[language]}</span>
                </div>
                <div className="text-sm sm:text-lg font-black text-emerald-400 mt-1 font-mono">
                  ₹{profile.walletBalance.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>{t.reserveLabel[language]}</span>
                </div>
                <div className="text-sm sm:text-lg font-black text-sky-400 mt-1 font-mono">
                  ₹{profile.emergencyFund.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-xs">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.scoreLabel[language]}</span>
                </div>
                <div className="text-sm sm:text-lg font-black text-amber-400 mt-1 font-mono">
                  {profile.totalScore} Pts
                </div>
              </div>
            </div>

            {/* Pillar Mastery Breakdown */}
            <div className="text-left space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>{t.pillarsCompleted[language]}</span>
                <span className="text-emerald-400 font-mono text-[11px] font-bold">4 / 4 Complete</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Pillar 1 */}
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-amber-500/20 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-300 text-xs">{t.pillar1Title[language]}</div>
                    <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                      {t.pillar1Desc[language]}
                    </div>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-amber-500/20 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-300 text-xs">{t.pillar2Title[language]}</div>
                    <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                      {t.pillar2Desc[language]}
                    </div>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/20 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-emerald-300 text-xs">{t.pillar3Title[language]}</div>
                    <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                      {t.pillar3Desc[language]}
                    </div>
                  </div>
                </div>

                {/* Pillar 4 */}
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-sky-500/20 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sky-300 text-xs">{t.pillar4Title[language]}</div>
                    <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                      {t.pillar4Desc[language]}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Verification Footer */}
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 border-t border-slate-800/80 pt-3 mt-4">
              <span>Date: {new Date().toLocaleDateString()}</span>
              <span className="font-mono text-amber-400 font-bold">MONEYQUEST-CAPSTONE-CERTIFIED</span>
            </div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="pt-4 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
              title="Print Certificate"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">{t.printBtn[language]}</span>
            </button>

            {onOpenNgoDashboard && (
              <button
                onClick={() => {
                  audioManager.playClick();
                  onOpenNgoDashboard();
                }}
                className="px-3.5 py-2 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-600/40 text-sky-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
                <span>{t.ngoBtn[language]}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onRestartJourney && (
              <button
                onClick={() => {
                  audioManager.playClick();
                  onRestartJourney();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.restartBtn[language]}</span>
              </button>
            )}

            <button
              onClick={() => {
                audioManager.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t.exploreBtn[language]}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
