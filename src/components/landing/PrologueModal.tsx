import React from 'react';
import { GameLanguage } from '../../types';
import { Sparkles, ArrowRight, ShieldCheck, Compass } from 'lucide-react';

interface PrologueModalProps {
  language: GameLanguage;
  onProceed: () => void;
}

export const PrologueModal: React.FC<PrologueModalProps> = ({ language, onProceed }) => {
  const content = {
    en: {
      chapter: 'Prologue: The Scholar’s Arrival',
      title: 'A New Journey Begins in Hyderabad',
      paragraphs: [
        'You have earned a prestigious higher secondary merit scholarship! Every month, ₹5,000 will be deposited directly into your student account.',
        'At first, it feels like all the money in the world. But hostel life moves fast: mess dues, textbook costs, unexpected emergencies, and tempting distractions will test your discipline.',
        'Walk through the world using Arrow Keys or WASD (or the on-screen D-pad). Approach characters and press SPACE or tap to converse. Every choice has consequences!',
      ],
      tip: 'Your first destination: The Hostel Commons in Region 1.',
      btn: 'Enter The World',
    },
    hi: {
      chapter: 'प्रस्तावना: छात्र का आगमन',
      title: 'हैदराबाद में एक नई यात्रा की शुरुआत',
      paragraphs: [
        'आपने एक प्रतिष्ठित उच्चतर माध्यमिक छात्रवृत्ति जीती है! हर महीने ₹5,000 सीधे आपके छात्र खाते में जमा होंगे।',
        'शुरुआत में यह बहुत बड़ी रकम लगती है। लेकिन छात्रावास के खर्च, किताबें, अचानक जरूरतें और लालच आपके अनुशासन की परीक्षा लेंगे।',
        'तीर कुंजियों या WASD से चलें। पात्रों के पास जाएं और बात करने के लिए स्पेस दबाएं। हर फैसले के परिणाम होंगे!',
      ],
      tip: 'आपका पहला गंतव्य: क्षेत्र 1 में छात्रावास कक्ष।',
      btn: 'दुनिया में प्रवेश करें',
    },
    te: {
      chapter: 'పరిచయం: స్కాలర్ రాక',
      title: 'హైదరాబాద్‌లో నూతన ప్రయాణం ప్రారంభం',
      paragraphs: [
        'మీరు ప్రతిష్టాత్మక మెరిట్ స్కాలర్‌షిప్ సాధించారు! ప్రతి నెలా ₹5,000 నేరుగా మీ విద్యార్థి ఖాతాలో జమ చేయబడుతుంది.',
        'మొదట్లో ఇది చాలా పెద్ద మొత్తంగా అనిపిస్తుంది. కానీ హాస్టల్ మెస్ ఫీజులు, పుస్తకాలు మరియు అత్యవసర ఖర్చులు మీ తెలివితేటలను పరీక్షిస్తాయి.',
        'బాణం గుర్తులు లేదా WASD తో కదలండి. వ్యక్తుల వద్దకు వెళ్లి మాట్లాడటానికి స్పేస్ నొక్కండి. ప్రతి నిర్ణయానికి పరిణామాలు ఉంటాయి!',
      ],
      tip: 'మీ మొదటి గమ్యం: రీజియన్ 1 లోని హాస్టల్ కామన్స్.',
      btn: 'గేమ్‌లోకి ప్రవేశించండి',
    },
  }[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="max-w-lg w-full bg-slate-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          {content.chapter}
        </div>

        <h2 className="text-2xl font-extrabold text-white mb-4">{content.title}</h2>

        <div className="space-y-3 text-sm text-slate-300 leading-relaxed mb-6">
          {content.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Tip box */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3 mb-6 text-xs text-amber-300">
          <Compass className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <div>{content.tip}</div>
        </div>

        {/* Action */}
        <button
          onClick={onProceed}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition transform active:scale-95"
        >
          <span>{content.btn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
