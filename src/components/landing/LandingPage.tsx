import React from 'react';
import { GameLanguage } from '../../types';
import { Play, Sparkles, Shield, Compass, BookOpen, TrendingUp, Users } from 'lucide-react';

interface LandingPageProps {
  language: GameLanguage;
  onStartAdventure: () => void;
  onOpenDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  onStartAdventure,
  onOpenDashboard,
}) => {
  const content = {
    en: {
      badge: 'Interactive Financial-Literacy RPG',
      heroTitle: 'Master Your Scholarship.',
      heroTitleHighlight: 'Rule Your Future.',
      heroSubtitle:
        'Step into the shoes of a Class 11 merit scholar in Hyderabad. Manage your ₹5,000 monthly stipend, balance hostel life, outsmart predatory schemes, and unlock true financial freedom.',
      cta: 'Start Adventure',
      ctaSecondary: 'NGO Partner Reports',
      pillarTitle: 'The Four Pillars of Financial Independence',
      pillars: [
        {
          title: 'Plan & Budget',
          desc: 'Needs vs. Wants, 50-30-20 rules, hostel mess dues, and avoiding cash leakages.',
          icon: BookOpen,
          color: 'from-amber-500 to-amber-700',
        },
        {
          title: 'Save & Manage',
          desc: 'Building emergency cushions, unexpected repair reserves, and avoiding predatory loans.',
          icon: Shield,
          color: 'from-emerald-500 to-teal-700',
        },
        {
          title: 'Understand Investing',
          desc: 'The geometric power of compounding, time horizons, and beating inflation safely.',
          icon: TrendingUp,
          color: 'from-sky-500 to-blue-700',
        },
        {
          title: 'Stay Financially Safe',
          desc: 'Spotting UPI QR code traps, fake scholarship SMS, OTP fraud, and cyber helpline 1930.',
          icon: Compass,
          color: 'from-violet-500 to-purple-700',
        },
      ],
      worldTitle: 'Explore 3 Story-Driven Regions',
      regions: [
        {
          name: "The Scholar's District",
          cities: '5 Locations',
          desc: 'Hostel Commons, Koti Book Bazaar, Irani Chai Canteen & Banking Hub.',
          accent: 'border-amber-500/40 bg-amber-950/20',
        },
        {
          name: 'The Prosperity Outskirts',
          cities: '5 Locations',
          desc: 'Compounding Grove, Diversified Markets, Inflation Alley & Skill Forge.',
          accent: 'border-emerald-500/40 bg-emerald-950/20',
        },
        {
          name: 'The Guardian Citadel',
          cities: '5 Locations',
          desc: "Phishers' Cove, The UPI Maze, Pyramid Peak & Grand Conclave.",
          accent: 'border-sky-500/40 bg-sky-950/20',
        },
      ],
    },
    hi: {
      badge: 'इंटरैक्टिव वित्तीय-साक्षरता एडवेंचर गेम',
      heroTitle: 'अपनी छात्रवृत्ति संभालें।',
      heroTitleHighlight: 'अपना भविष्य संवारें।',
      heroSubtitle:
        'हैदराबाद में 11वीं कक्षा के छात्रवृत्ति विजेता बनें। ₹5,000 मासिक वजीफे का प्रबंधन करें, छात्रावास जीवन संतुलित करें और वित्तीय आजादी हासिल करें।',
      cta: 'साहसिक यात्रा शुरू करें',
      ctaSecondary: 'एनजीओ रिपोर्ट',
      pillarTitle: 'वित्तीय स्वतंत्रता के चार स्तंभ',
      pillars: [
        {
          title: 'योजना और बजट',
          desc: 'जरूरतें बनाम इच्छाएं, 50-30-20 नियम और फिजूलखर्ची पर रोक।',
          icon: BookOpen,
          color: 'from-amber-500 to-amber-700',
        },
        {
          title: 'बचत और प्रबंधन',
          desc: 'आपातकालीन फंड बनाना और भारी ब्याज वाले लोन से बचना।',
          icon: Shield,
          color: 'from-emerald-500 to-teal-700',
        },
        {
          title: 'निवेश को समझें',
          desc: 'चक्रवृद्धि ब्याज की ताकत और सुरक्षित भविष्य की नींव।',
          icon: TrendingUp,
          color: 'from-sky-500 to-blue-700',
        },
        {
          title: 'सुरक्षित रहें',
          desc: 'फर्जी QR कोड, धोखाधड़ी वाले SMS और साइबर अपराध से सुरक्षा।',
          icon: Compass,
          color: 'from-violet-500 to-purple-700',
        },
      ],
      worldTitle: '3 रोमांचक क्षेत्रों की खोज करें',
      regions: [
        {
          name: 'विद्वान जिला',
          cities: '5 स्थान',
          desc: 'छात्रावास, किताब बाजार, कैंटीन और बैंक केंद्र।',
          accent: 'border-amber-500/40 bg-amber-950/20',
        },
        {
          name: 'समृद्धि क्षेत्र',
          cities: '5 स्थान',
          desc: 'चक्रवृद्धि उपवन, बाजार, और कौशल कार्यशाला।',
          accent: 'border-emerald-500/40 bg-emerald-950/20',
        },
        {
          name: 'संरक्षक गढ़',
          cities: '5 स्थान',
          desc: 'साइबर भूलभुलैया, UPI रक्षा और महापरिषद।',
          accent: 'border-sky-500/40 bg-sky-950/20',
        },
      ],
    },
    te: {
      badge: 'ఇంటరాక్టివ్ ఫైనాన్షియల్ లిటరసీ అడ్వెంచర్ గేమ్',
      heroTitle: 'మీ స్కాలర్‌షిప్‌ను సమర్థవంతంగా నిర్వహించండి.',
      heroTitleHighlight: 'ఉజ్వల భవిష్యత్తును నిర్మించుకోండి.',
      heroSubtitle:
        'హైదరాబాద్‌లో 11వ తరగతి స్కాలర్‌షిప్ విద్యార్థిగా మారండి. నెలకు ₹5,000 స్టైపెండ్‌ను తెలివిగా కేటాయించండి, హాస్టల్ ఖర్చులు మరియు మోసాలను అడ్డుకోండి.',
      cta: 'సాహసం ప్రారంభించండి',
      ctaSecondary: 'ఎన్జీవో నివేదికలు',
      pillarTitle: 'ఆర్థిక స్వతంత్రతకు నాలుగు స్తంభాలు',
      pillars: [
        {
          title: 'ప్రణాళిక & బడ్జెట్',
          desc: 'అవసరాలు వర్సెస్ కోరికలు, 50-30-20 నియమం మరియు ఖర్చుల నియంత్రణ.',
          icon: BookOpen,
          color: 'from-amber-500 to-amber-700',
        },
        {
          title: 'పొదుపు & నిర్వహణ',
          desc: 'ఎమర్జెన్సీ ఫండ్ ఏర్పాటు మరియు అనవసర అప్పులను నివారించడం.',
          icon: Shield,
          color: 'from-emerald-500 to-teal-700',
        },
        {
          title: 'పెట్టుబడుల అవగాహన',
          desc: 'చక్రవడ్డీ అద్భుత శక్తి మరియు దీర్ఘకాలిక సంపద సృష్టి.',
          icon: TrendingUp,
          color: 'from-sky-500 to-blue-700',
        },
        {
          title: 'ఆర్థిక భద్రత',
          desc: 'యూపీఐ క్యూఆర్ కోడ్ మోసాలు, సైబర్ నేరాలు మరియు హెల్ప్‌లైన్ 1930.',
          icon: Compass,
          color: 'from-violet-500 to-purple-700',
        },
      ],
      worldTitle: '3 ప్రత్యేక ప్రాంతాలు',
      regions: [
        {
          name: 'స్కాలర్స్ డిస్ట్రిక్ట్',
          cities: '5 నగరాలు',
          desc: 'హాస్టల్, పుస్తకాల బజార్, క్యాంటీన్ & బ్యాంకింగ్ కేంద్రం.',
          accent: 'border-amber-500/40 bg-amber-950/20',
        },
        {
          name: 'ప్రోస్పెరిటీ ఔట్‌స్కర్ట్స్',
          cities: '5 నగరాలు',
          desc: 'కాంపౌండింగ్ గ్రోవ్, మార్కెట్లు & స్కిల్ ఫోర్జ్.',
          accent: 'border-emerald-500/40 bg-emerald-950/20',
        },
        {
          name: 'గార్డియన్ సిటాడెల్',
          cities: '5 నగరాలు',
          desc: 'ఫిషింగ్ జోన్, యూపీఐ మేజ్ & గ్రాండ్ కాన్‌క్లేవ్.',
          accent: 'border-sky-500/40 bg-sky-950/20',
        },
      ],
    },
  }[language];

  return (
    <div className="relative overflow-hidden pb-16">
      {/* Visual Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 -z-10" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide uppercase mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          {content.badge}
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          {content.heroTitle}{' '}
          <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
            {content.heroTitleHighlight}
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed">
          {content.heroSubtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onStartAdventure}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-base shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transform transition hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            {content.cta}
          </button>

          <button
            onClick={onOpenDashboard}
            className="w-full sm:w-auto px-6 py-4 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold rounded-xl text-base border border-slate-700/80 flex items-center justify-center gap-2 transition"
          >
            <Users className="w-5 h-5 text-indigo-400" />
            {content.ctaSecondary}
          </button>
        </div>

        {/* Pixel-Art Adventure Preview Banner */}
        <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎓</span>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-100">Scholarship Onboarding</div>
                <div className="text-xs text-slate-400">Class 11 Merit Batch • Hyderabad Hub</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Stipend Active: ₹5,000 / month
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {content.regions.map((reg, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${reg.accent}`}>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Region 0{idx + 1}
                </div>
                <div className="font-bold text-slate-100 mb-1">{reg.name}</div>
                <div className="text-xs text-amber-400 font-medium mb-2">{reg.cities}</div>
                <p className="text-xs text-slate-300 leading-normal">{reg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Pillars Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">{content.pillarTitle}</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Grounded in Vanguard’s mission to empower underserved students with lasting financial capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition relative overflow-hidden group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${pillar.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-100 mb-2">{pillar.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
