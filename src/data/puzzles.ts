import { PuzzleScenario } from '../types';

export const PUZZLES: Record<string, PuzzleScenario> = {
  // Scenario 1: Hostel Commons (Budgeting / Needs vs Wants)
  scenario_hostel_stipend: {
    id: 'scenario_hostel_stipend',
    cityId: 'city_hostel_commons',
    pillar: 'budget',
    title: {
      en: 'The Scholarship Stipend Arrives',
      hi: 'छात्रवृत्ति वजीफा आ गया',
      te: 'స్కాలర్‌షిప్ స్టైపెండ్ వచ్చింది',
    },
    subtitle: {
      en: 'Allocate your first ₹5,000 monthly scholarship',
      hi: 'अपने पहले ₹5,000 मासिक वजीफे का आवंटन करें',
      te: 'మీ మొదటి ₹5,000 నెలవారీ స్కాలర్‌షిప్‌ను కేటాయించండి',
    },
    situationContext: {
      en: 'You just received your first ₹5,000 scholarship stipend in your bank account! Your mandatory hostel mess fee is ₹2,500. A roommate invites you to spend ₹2,000 immediately on branded sneakers on sale.',
      hi: 'आपको अपने बैंक खाते में पहला ₹5,000 वजीफा मिला है! छात्रावास मेस शुल्क ₹2,500 अनिवार्य है। एक रूममेट आपको तुरंत ₹2,000 के ब्रांडेड स्नीकर्स खरीदने का सुझाव देता है।',
      te: 'మీ బ్యాంక్ ఖాతాలో మొదటి ₹5,000 స్కాలర్‌షిప్ వచ్చింది! హాస్టల్ మెస్ ఫీజు ₹2,500 చెల్లించాలి. ఒక రూమ్‌మేట్ ₹2,000 బ్రాండెడ్ షూస్ వెంటనే కొనమని ఆహ్వానిస్తున్నాడు.',
    },
    stipendContext: 'Monthly Stipend: ₹5,000 | Mandatory Fixed Due: ₹2,500 (Mess Fee)',
    educationalHint: {
      en: 'Remember the 50-30-20 rule: Cover mandatory Needs first (₹2,500), allocate 20% to emergency savings (₹1,000), and limit Wants to the remainder (₹1,500).',
      hi: '50-30-20 नियम याद रखें: पहले अनिवार्य जरूरतें पूरी करें, 20% आपातकालीन बचत में डालें, और बाकी शौक पर खर्च करें।',
      te: '50-30-20 నియమం గుర్తుంచుకోండి: ముందుగా అవసరాలు తీర్చుకోండి, 20% పొదుపు చేయండి, మిగిలినది మాత్రమే సరదాలకు వాడండి.',
    },
    choices: [
      {
        id: 'choice_hostel_best',
        tier: 'best',
        text: {
          en: 'Pay ₹2,500 mess fee, put ₹1,000 in emergency savings, keep ₹1,500 for study materials & transport.',
          hi: '₹2,500 मेस शुल्क दें, ₹1,000 बचत में रखें, और ₹1,500 पढ़ाई और आने-जाने के लिए रखें।',
          te: '₹2,500 మెస్ ఫీజు చెల్లించి, ₹1,000 పొదుపు చేసి, ₹1,500 చదువు ఖర్చులకు ఉంచండి.',
        },
        outcomeDescription: {
          en: 'Exemplary budgeting! Your hostel dues are cleared, you started your rainy-day fund, and you have comfortable living cash.',
          hi: 'शानदार बजटिंग! आपके छात्रावास के बकाए साफ हो गए और बचत भी शुरू हो गई।',
          te: 'అద్భుతమైన బడ్జెట్! మీ మెస్ ఫీజు పూర్తయింది మరియు భవిష్యత్ అవసరాలకు పొదుపు మొదలైంది.',
        },
        financialImpact: { walletDelta: -4000, emergencyDelta: 1000, scoreDelta: 100, stressDelta: -15 },
        pedagogicalFeedback: {
          en: 'By prioritizing fixed commitments and saving 20% upfront, you protect yourself against mid-month cash crunches.',
          hi: 'अनिवार्य खर्चों को प्राथमिकता देकर और 20% बचत करके, आप महीने के बीच में पैसों की तंगी से बचते हैं।',
          te: 'ముఖ్యమైన ఖర్చులను ముందుగా చెల్లించి 20% ఆదా చేయడం ద్వారా మీరు ఆర్థిక ఇబ్బందుల నుండి రక్షించబడతారు.',
        },
        educationalVideoTitle: 'The 50/30/20 Rule for Students',
      },
      {
        id: 'choice_hostel_better',
        tier: 'better',
        text: {
          en: 'Pay ₹2,500 mess fee, put ₹500 in savings, spend ₹2,000 on books and casual expenses.',
          hi: '₹2,500 मेस शुल्क दें, ₹500 बचत में रखें, और ₹2,000 किताबों और सामान्य खर्चों पर लगाएं।',
          te: '₹2,500 మెస్ ఫీజు చెల్లించి, ₹500 ఆదా చేసి, ₹2,000 ఇతర ఖర్చులకు వాడండి.',
        },
        outcomeDescription: {
          en: 'Solid decision. Dues are covered and you saved a small cushion, though 10% savings is slightly lean.',
          hi: 'अच्छा फैसला। बकाए का भुगतान हो गया और थोड़ी बचत भी हुई।',
          te: 'మంచి నిర్ణయం. ఖర్చులు సరిపోయాయి కానీ పొదుపు ఇంకాస్త పెంచవచ్చు.',
        },
        financialImpact: { walletDelta: -4500, emergencyDelta: 500, scoreDelta: 75, stressDelta: -5 },
        pedagogicalFeedback: {
          en: 'Good start. Try striving for 20% savings when possible to handle bigger emergencies.',
          hi: 'अच्छी शुरुआत। भविष्य के लिए 20% बचत का लक्ष्य रखें।',
          te: 'మంచి ప్రయత్నం. వీలైనప్పుడు 20% పొదుపు చేసేందుకు ప్రయత్నించండి.',
        },
      },
      {
        id: 'choice_hostel_good',
        tier: 'good',
        text: {
          en: 'Pay ₹2,500 mess fee, keep all remaining ₹2,500 in your wallet with ₹0 saved.',
          hi: '₹2,500 मेस शुल्क दें, बाकी सारे ₹2,500 जेब में रखें और कोई बचत न करें।',
          te: '₹2,500 మెస్ ఫీజు చెల్లించి, మిగిలిన ₹2,500 జేబులోనే ఉంచుకోండి (పొదుపు లేదు).',
        },
        outcomeDescription: {
          en: 'Mess dues are paid, but keeping everything in cash tempts impulse spending, and you have zero safety cushion.',
          hi: 'मेस का भुगतान तो हुआ, पर शून्य बचत के कारण अचानक किसी जरूरत में परेशानी हो सकती है।',
          te: 'ఫీజు చెల్లించారు కానీ ఎటువంటి అత్యవసర పొదుపు నిధి లేదు.',
        },
        financialImpact: { walletDelta: -2500, emergencyDelta: 0, scoreDelta: 50, stressDelta: 5 },
        pedagogicalFeedback: {
          en: 'Whenever you leave all remaining money unassigned, it tends to disappear on small snacks and impulse buys.',
          hi: 'जब पैसे बिना योजना के रखे जाते हैं, तो वे छोटे-मोटे फालतू खर्चों में गायब हो जाते हैं।',
          te: 'ఖర్చుల ప్రణాళిక లేకపోతే డబ్బు అనవసర విషయాలకు ఖర్చైపోతుంది.',
        },
      },
      {
        id: 'choice_hostel_very_bad',
        tier: 'very_bad',
        text: {
          en: 'Buy the ₹2,000 branded sneakers, delay mess fee, and spend ₹1,500 treating friends at a cafe.',
          hi: '₹2,000 के स्नीकर्स खरीदें, मेस शुल्क टालें, और ₹1,500 दोस्तों पर खर्च करें।',
          te: '₹2,000 షూస్ కొని, మెస్ ఫీజు వాయిదా వేసి, ₹1,500 స్నేహితులతో ఖర్చు చేయండి.',
        },
        outcomeDescription: {
          en: 'CRISIS! You only have ₹1,500 left. The warden issues a late fine on your mess dues, and you cannot afford food next week!',
          hi: 'संकट! आपके पास सिर्फ ₹1,500 बचे हैं। मेस शुल्क न देने पर जुर्माना लगा और खाने के लाले पड़ गए!',
          te: 'తీవ్ర ఇబ్బంది! మెస్ ఫీజు చెల్లించకపోవడంతో జరిమానా పడింది, నిధుల కొరత ఏర్పడింది!',
        },
        financialImpact: { walletDelta: -3500, emergencyDelta: 0, scoreDelta: -50, stressDelta: 40 },
        pedagogicalFeedback: {
          en: 'Needs must ALWAYS come before Wants! Prioritizing luxury footwear over essential food and shelter leads directly to debt and stress.',
          hi: 'जरूरतें हमेशा इच्छाओं से पहले आनी चाहिए! आवश्यक भोजन पर फैशनेबल जूतों को प्राथमिकता देना कर्ज की ओर ले जाता है।',
          te: 'అవసరాలు ఎల్లప్పుడూ కోరికల కంటే ముఖ్యం! మెస్ ఫీజును వాయిదా వేసి వస్తువులు కొనడం అప్పులకు దారితీస్తుంది.',
        },
        educationalVideoTitle: 'Delayed Gratification vs Debt Traps',
      },
    ],
  },

  // Scenario 2: Rainy-Day Refuge (Emergency Reserves)
  scenario_broken_phone: {
    id: 'scenario_broken_phone',
    cityId: 'city_rainy_day_refuge',
    pillar: 'save',
    title: {
      en: 'The Cracked Screen Emergency',
      hi: 'टूटी हुई स्क्रीन का संकट',
      te: 'పగిలిన ఫోన్ స్క్రీన్ అత్యవసర పరిస్థితి',
    },
    subtitle: {
      en: 'Handle an unexpected ₹1,200 repair cost before midterms',
      hi: 'परीक्षा से पहले अचानक ₹1,200 की मरम्मत का खर्च संभालें',
      te: 'పరీక్షలకు ముందు ₹1,200 ఫోన్ రిపేర్ ఖర్చును ఎదుర్కొండి',
    },
    situationContext: {
      en: 'Your smartphone slips and the screen shatters. You need it for college notices and online study materials. Repair costs ₹1,200. An unverified instant-loan app offers "Instant ₹2,000 cash at 30% monthly interest".',
      hi: 'आपका स्मार्टफोन गिर गया और स्क्रीन टूट गई। पढ़ाई के लिए फोन जरूरी है। मरम्मत का खर्च ₹1,200 है। एक संदिग्ध लोन ऐप 30% मासिक ब्याज पर पैसे ऑफर कर रहा है।',
      te: 'మీ ఫోన్ పడిపోయి స్క్రీన్ పగిలింది. చదువుకు ఫోన్ అవసరం, రిపేర్ ఫీజు ₹1,200. ఒక లోన్ యాప్ నెలకు 30% వడ్డీతో రుణం ఇస్తానంటోంది.',
    },
    stipendContext: 'Emergency Cost: ₹1,200 | Loan App Trap: 30% monthly interest',
    educationalHint: {
      en: 'Never use high-interest instant loan apps for emergencies. Use your dedicated emergency savings or ask family/college assistance.',
      hi: 'आपात स्थिति में कभी भी भारी ब्याज वाले लोन ऐप का उपयोग न करें। अपनी बचत का इस्तेमाल करें।',
      te: 'అత్యవసర పరిస్థితులకు అధిక వడ్డీ రుణాల యాప్‌లను ఎప్పుడూ నమ్మకండి.',
    },
    choices: [
      {
        id: 'choice_phone_best',
        tier: 'best',
        text: {
          en: 'Use ₹1,200 from your emergency savings fund and replenish it over the next two months.',
          hi: 'अपने आपातकालीन बचत फंड से ₹1,200 का उपयोग करें और अगले दो महीनों में इसकी भरपाई करें।',
          te: 'మీ ఎమర్జెన్సీ ఫండ్ నుండి ₹1,200 ఉపయోగించి, రాబోయే రెండు నెలల్లో దాన్ని భర్తీ చేయండి.',
        },
        outcomeDescription: {
          en: 'Peace of mind! This is exactly why you built an emergency reserve. No debt, no interest, no hassle.',
          hi: 'मानसिक शांति! इसी कारण आपने बचत बनाई थी। कोई कर्ज नहीं, कोई तनाव नहीं।',
          te: 'ప్రశాంతత! అత్యవసర నిధి ప్రయోజనం ఇదే. అప్పులు లేకుండా ఫోన్ రిపేర్ అయింది.',
        },
        financialImpact: { walletDelta: 0, emergencyDelta: -1200, scoreDelta: 100, stressDelta: -20 },
        pedagogicalFeedback: {
          en: 'An emergency fund turns a potential financial catastrophe into a minor temporary inconvenience.',
          hi: 'आपातकालीन फंड बड़ी मुसीबत को केवल एक छोटे से खर्च में बदल देता है।',
          te: 'ఎమర్జెన్సీ ఫండ్ అనేది పెద్ద సమస్యను సులభంగా పరిష్కరించే రక్షణ కవచం.',
        },
      },
      {
        id: 'choice_phone_better',
        tier: 'better',
        text: {
          en: 'Use ₹800 from emergency savings and negotiate a student installment plan with the shop.',
          hi: 'बचत से ₹800 दें और दुकानदार से छात्र किश्त योजना की बात करें।',
          te: 'ఎమర్జెన్సీ ఫండ్ నుండి ₹800 చెల్లించి, మిగిలినది వాయిదాల్లో ఇచ్చేలా మాట్లాడండి.',
        },
        outcomeDescription: {
          en: 'Resourceful negotiation. You preserved some reserve cash while fixing your study tool.',
          hi: 'अच्छा मोलभाव! आपने अपनी बचत को पूरी तरह खाली किए बिना फोन ठीक करा लिया।',
          te: 'మంచి ఆలోచన. మీ వద్ద కొద్దిగా అత్యవసర నిధి అలాగే మిగిలింది.',
        },
        financialImpact: { walletDelta: -400, emergencyDelta: -800, scoreDelta: 75, stressDelta: 0 },
        pedagogicalFeedback: {
          en: 'Negotiating zero-interest terms is smart, but remember to pay the agreed installments promptly.',
          hi: 'बिना ब्याज की किश्तें अच्छी हैं, लेकिन समय पर भुगतान करना न भूलें।',
          te: 'వడ్డీ లేని వాయిదాలు మంచివే, కానీ సమయానికి చెల్లించడం ముఖ్యం.',
        },
      },
      {
        id: 'choice_phone_good',
        tier: 'good',
        text: {
          en: 'Cut your food and transport budget completely this month to pay the ₹1,200 repair.',
          hi: 'मरम्मत के लिए इस महीने अपने खाने और आने-जाने के बजट में भारी कटौती करें।',
          te: 'ఈ నెల తిండి మరియు ప్రయాణ ఖర్చులు బాగా తగ్గించుకుని రిపేర్ చేయించండి.',
        },
        outcomeDescription: {
          en: 'You avoided predatory debt, but severe deprivation makes student hostel life stressful.',
          hi: 'कर्ज तो नहीं लिया, लेकिन भूखे रहने और पैदल चलने से पढ़ाई पर बुरा असर पड़ा।',
          te: 'అప్పు చేయలేదు కానీ ఆహారాన్ని త్యాగం చేయడం వల్ల ఆరోగ్యం దెబ్బతింటుంది.',
        },
        financialImpact: { walletDelta: -1200, emergencyDelta: 0, scoreDelta: 50, stressDelta: 25 },
        pedagogicalFeedback: {
          en: 'Sacrificing basic nutrition for emergencies proves why an emergency fund is indispensable.',
          hi: 'भोजन का त्याग करना यह साबित करता है कि आपातकालीन फंड कितना जरूरी है।',
          te: 'ప్రాథమిక అవసరాలను త్యాగం చేయకుండా ఉండటానికే పొదుపు నిధి అవసరం.',
        },
      },
      {
        id: 'choice_phone_very_bad',
        tier: 'very_bad',
        text: {
          en: 'Download the instant-loan app and borrow ₹2,000 at 30% monthly compounding interest.',
          hi: 'लोन ऐप डाउनलोड करें और 30% मासिक चक्रवृद्धि ब्याज पर ₹2,000 उधार लें।',
          te: 'లోన్ యాప్ డౌన్‌లోడ్ చేసి 30% అధిక వడ్డీకి ₹2,000 రుణం తీసుకోండి.',
        },
        outcomeDescription: {
          en: 'DEBT SPIRAL! In 3 months, that ₹2,000 snowballs into ₹4,394 due to compounding interest and hidden penalties!',
          hi: 'कर्ज का जाल! 3 महीने में ₹2,000 का कर्ज बढ़कर ₹4,394 हो गया!',
          te: 'తీవ్ర అప్పుల ఊబి! చక్రవడ్డీ కారణంగా ₹2,000 కాస్తా కొన్ని నెలల్లో రెట్టింపు అయింది!',
        },
        financialImpact: { walletDelta: 800, emergencyDelta: 0, scoreDelta: -75, stressDelta: 50 },
        pedagogicalFeedback: {
          en: 'Predatory lending apps trap unsuspecting youth in endless debt cycles with harassment and exorbitant interest rates.',
          hi: 'संदिग्ध लोन ऐप्स युवाओं को भारी ब्याज और मानसिक प्रताड़ना के जाल में फंसाते हैं।',
          te: 'అధిక వడ్డీ రుణ యాప్‌లు విద్యార్థులను అప్పుల ఊబిలోకి నెడతాయి. వాటికి దూరంగా ఉండాలి.',
        },
        educationalVideoTitle: 'The Truth About Predatory Instant Loan Apps',
      },
    ],
  },

  // Scenario 3: The Compounding Grove (Investment & Time Horizon)
  scenario_compounding_tree: {
    id: 'scenario_compounding_tree',
    cityId: 'city_compounding_grove',
    pillar: 'invest',
    title: {
      en: 'The Power of the Compounding Seed',
      hi: 'चक्रवृद्धि ब्याज का चमत्कार',
      te: 'చక్రవడ్డీ అద్భుత శక్తి',
    },
    subtitle: {
      en: 'Discover how starting ₹500/month in Class 11 beats starting late',
      hi: 'जानें कि 11वीं कक्षा में ₹500/माह शुरू करना देर से शुरू करने से बेहतर क्यों है',
      te: '11వ తరగతిలోనే ₹500 పొదుపు మొదలుపెట్టడం భవిష్యత్తుకు ఎలా మేలు చేస్తుందో తెలుసుకోండి',
    },
    situationContext: {
      en: 'You have a steady ₹500 surplus each month. Your mentor shows you two paths: Keep it as cash in an envelope, or start a recurring deposit (RD) yielding compound interest over your student journey.',
      hi: 'आपके पास हर महीने ₹500 की बचत है। दो रास्ते हैं: नकदी को लिफाफे में रखें, या चक्रवृद्धि ब्याज वाले रेकरिंग डिपॉजिट (RD) में डालें।',
      te: 'మీ వద్ద నెలకు ₹500 మిగులు ఉంది. దాన్ని నగదుగా దాచుకోవాలా లేక రికరింగ్ డిపాజిట్ (RD) లో పెట్టుబడి పెట్టాలా?',
    },
    stipendContext: 'Monthly Surplus: ₹500 | Time Horizon: 5 Years',
    educationalHint: {
      en: 'Compounding means earning interest on your interest. The earlier you begin, the more dramatic the exponential curve becomes.',
      hi: 'चक्रवृद्धि का अर्थ है ब्याज पर ब्याज कमाना। आप जितना जल्दी शुरू करेंगे, लाभ उतना ही बड़ा होगा।',
      te: 'చక్రవడ్డీ అంటే వడ్డీపై కూడా వడ్డీ రావడం. ఎంత త్వరగా మొదలుపెడితే అంత ఎక్కువ లాభం.',
    },
    choices: [
      {
        id: 'choice_comp_best',
        tier: 'best',
        text: {
          en: 'Start a disciplined ₹500 monthly recurring deposit (RD) in a regulated student account.',
          hi: 'नियमित छात्र बैंक खाते में ₹500 प्रति माह का रेकरिंग डिपॉजिट (RD) शुरू करें।',
          te: 'బ్యాంకులో క్రమం తప్పకుండా నెలకు ₹500 రికరింగ్ డిపాజిట్ (RD) ప్రారంభించండి.',
        },
        outcomeDescription: {
          en: 'Magnificent growth! You understand that time in the market and consistency creates enduring financial freedom.',
          hi: 'शानदार वृद्धि! समय और निरंतरता वित्तीय स्वतंत्रता की कुंजी हैं।',
          te: 'అద్భుతమైన ఆలోచన! చిన్న మొత్తమైనా క్రమం తప్పకుండా పొదుపు చేయడం వల్ల పెద్ద నిధి సమకూరుతుంది.',
        },
        financialImpact: { walletDelta: -500, emergencyDelta: 500, scoreDelta: 100, stressDelta: -10 },
        pedagogicalFeedback: {
          en: 'Albert Einstein famously called compound interest the 8th wonder of the world: He who understands it, earns it; he who does not, pays it.',
          hi: 'चक्रवृद्धि ब्याज दुनिया का आठवां अजूबा है: जो इसे समझता है वह कमाता है, जो नहीं समझता वह चुकाता है।',
          te: 'చక్రవడ్డీ గొప్పతనాన్ని అర్థం చేసుకున్నవారు లాభపడతారు.',
        },
      },
      {
        id: 'choice_comp_better',
        tier: 'better',
        text: {
          en: 'Save ₹500 monthly into a digital student savings account with nominal interest.',
          hi: 'सामान्य ब्याज वाले डिजिटल छात्र बचत खाते में हर महीने ₹500 बचाएं।',
          te: 'డిజిటల్ సేవింగ్స్ ఖాతాలో నెలకు ₹500 దాచుకోండి.',
        },
        outcomeDescription: {
          en: 'Good habit! Your capital is safe, though ordinary savings rates barely keep pace with inflation.',
          hi: 'अच्छी आदत! आपका पैसा सुरक्षित है, हालांकि बचत खाता महंगाई को मात नहीं दे पाता।',
          te: 'మంచి అలవాటు! డబ్బు సురక్షితంగా ఉంటుంది.',
        },
        financialImpact: { walletDelta: -500, emergencyDelta: 500, scoreDelta: 75, stressDelta: -5 },
        pedagogicalFeedback: {
          en: 'Saving is the crucial first foundation, but exploring safe compound options magnifies future purchasing power.',
          hi: 'बचत पहली सीढ़ी है, लेकिन चक्रवृद्धि विकल्प आपके पैसों को तेजी से बढ़ाते हैं।',
          te: 'పొదుపు మొదటి అడుగు, కానీ చక్రవడ్డీ మరింత ప్రయోజనకరం.',
        },
      },
      {
        id: 'choice_comp_good',
        tier: 'good',
        text: {
          en: 'Keep ₹500 in cash inside your hostel cupboard lockbox.',
          hi: 'छात्रावास की अलमारी में ₹500 नकद बंद करके रखें।',
          te: 'హాస్టల్ గదిలో పెట్టెలో నగదు రూపంలో ₹500 దాచుకోండి.',
        },
        outcomeDescription: {
          en: 'You saved money, but idle cash generates 0% interest and loses real purchasing power every year.',
          hi: 'पैसे तो बच गए, लेकिन नकद पर 0% ब्याज मिलता है और महंगाई से इसका मूल्य घटता है।',
          te: 'డబ్బు ఆదా అయింది కానీ నగదుపై ఎలాంటి వడ్డీ రాదు, ద్రవ్యోల్బణం వల్ల విలువ తగ్గుతుంది.',
        },
        financialImpact: { walletDelta: -500, emergencyDelta: 500, scoreDelta: 50, stressDelta: 0 },
        pedagogicalFeedback: {
          en: 'Inflation silently erodes idle cash. ₹500 today will buy fewer textbooks 5 years from now if not growing.',
          hi: 'महंगाई शांत चोर की तरह नकदी का मूल्य चुरा लेती है।',
          te: 'కాలక్రమేణా నగదు కొనుగోలు శక్తిని కోల్పోతుంది.',
        },
      },
      {
        id: 'choice_comp_very_bad',
        tier: 'very_bad',
        text: {
          en: 'Give ₹500 to an unverified Telegram "crypto doubler" bot promising 200% return in 24 hours.',
          hi: '24 घंटे में 200% रिटर्न का दावा करने वाले फर्जी टेलीग्राम बॉट को ₹500 दें।',
          te: 'ఒక్క రోజులో డబ్బులు రెట్టింపు చేస్తామనే టెలిగ్రామ్ ఫేక్ బాట్‌కు ₹500 ఇవ్వండి.',
        },
        outcomeDescription: {
          en: 'SCAMMED! The bot blocks you immediately after payment. Your ₹500 is completely lost!',
          hi: 'धोखा! पैसे लेते ही बॉट ने आपको ब्लॉक कर दिया। आपके ₹500 डूब गए!',
          te: 'మోసపోయారు! డబ్బులు పంపగానే బాట్ మిమ్మల్ని బ్లాక్ చేసింది. ₹500 పోయాయి!',
        },
        financialImpact: { walletDelta: -500, emergencyDelta: 0, scoreDelta: -80, stressDelta: 45 },
        pedagogicalFeedback: {
          en: 'Rule of Thumb: If an investment sounds too good to be true, it is 100% a fraud. High returns never exist without high risk or outright theft.',
          hi: 'नियम: यदि कोई योजना बहुत ही आकर्षक और आसान लगे, तो वह निश्चित रूप से धोखाधड़ी है।',
          te: 'అసాధారణ లాభాలు ఇస్తామనే పథకాలు ఖచ్చితంగా మోసాలే అని గుర్తించాలి.',
        },
        educationalVideoTitle: 'Spotting Unrealistic "Get Rich Quick" Scams',
      },
    ],
  },

  // Scenario 4: The UPI Maze (Financial Safety & Scam Busting)
  scenario_upi_pin_trap: {
    id: 'scenario_upi_pin_trap',
    cityId: 'city_upi_maze',
    pillar: 'safety',
    title: {
      en: 'The "Receive Money" QR Code Trap',
      hi: 'पैसे प्राप्त करने का फर्जी QR कोड जाल',
      te: 'డబ్బులు అందుకోవడానికి క్యూఆర్ కోడ్ మోసం',
    },
    subtitle: {
      en: 'A stranger on OLX claims they want to send you ₹1,500 for your old study chair',
      hi: 'एक खरीदार आपके पुराने फर्नीचर के लिए ₹1,500 भेजने का दावा करता है',
      te: 'మీ పాత స్టడీ కుర్చీ కోసం ₹1,500 పంపుతానని ఒక అపరిచితుడు చెబుతున్నాడు',
    },
    situationContext: {
      en: 'You listed an old study desk online. A "buyer" sends you a QR code on WhatsApp saying: "Scan this QR code and enter your 6-digit UPI PIN to credit ₹1,500 into your account immediately!"',
      hi: 'आपने पुरानी मेज बेचने का विज्ञापन डाला। खरीदार ने व्हाट्सएप पर एक QR कोड भेजकर कहा: "पैसे पाने के लिए इसे स्कैन करें और अपना UPI PIN दर्ज करें!"',
      te: 'మీరు పాత టేబుల్ అమ్మకానికి పెట్టారు. కొనుగోలుదారుడు: "ఈ క్యూఆర్ కోడ్ స్కాన్ చేసి పిన్ నంబర్ ఎంటర్ చేస్తే మీ ఖాతాలో ₹1,500 పడతాయి" అని చెప్పాడు.',
    },
    stipendContext: 'Claimed Incoming Credit: ₹1,500 | Requested Action: Enter UPI PIN',
    educationalHint: {
      en: 'GOLDEN RULE: You NEVER enter your UPI PIN to receive money! Entering your PIN always DEDUCTS money from your account.',
      hi: 'सुनहरा नियम: पैसे प्राप्त करने के लिए कभी भी UPI PIN दर्ज नहीं किया जाता! PIN डालने से हमेशा पैसे कटते हैं।',
      te: 'బంగారు నియమం: డబ్బులు రావడానికి ఎప్పుడూ యూపీఐ పిన్ ఎంటర్ చేయకూడదు! పిన్ కొడితే డబ్బులు కట్ అవుతాయి.',
    },
    choices: [
      {
        id: 'choice_upi_best',
        tier: 'best',
        text: {
          en: 'Refuse to scan, explain that PIN is only for sending money, and block the scammer.',
          hi: 'स्कैन करने से इनकार करें, कहें कि PIN केवल पैसे भेजने के लिए होता है, और फ्रॉड को ब्लॉक करें।',
          te: 'స్కాన్ చేయవద్దని తిరస్కరించి, పిన్ కేవలం పంపడానికే అని చెప్పి అతన్ని బ్లాక్ చేయండి.',
        },
        outcomeDescription: {
          en: 'Shielded! You spotted India’s most common digital scam and protected your scholarship money.',
          hi: 'सुरक्षित! आपने देश के सबसे आम डिजिटल घोटाले को पहचान कर अपने पैसे बचाए।',
          te: 'సురక్షితం! మీరు మోసాన్ని గుర్తించి మీ స్కాలర్‌షిప్ డబ్బును కాపాడుకున్నారు.',
        },
        financialImpact: { walletDelta: 0, emergencyDelta: 0, scoreDelta: 100, stressDelta: -10 },
        pedagogicalFeedback: {
          en: 'Never forget: "PIN is for paying, NOT for receiving". Legitimate senders only need your UPI ID or phone number.',
          hi: 'हमेशा याद रखें: "PIN पैसे देने के लिए है, लेने के लिए नहीं।" पैसे लेने के लिए सिर्फ मोबाइल नंबर या UPI ID चाहिए।',
          te: 'గుర్తుంచుకోండి: పిన్ డబ్బులు పంపడానికే తప్ప తీసుకోవడానికి కాదు.',
        },
      },
      {
        id: 'choice_upi_better',
        tier: 'better',
        text: {
          en: 'Demand they pay via direct cash on delivery or through direct bank account transfer (NEFT/IMPS).',
          hi: 'सख्त लहजे में नकद या सीधे बैंक खाते (IMPS) में पैसे ट्रांसफर करने की मांग करें।',
          te: 'వస్తువు తీసుకునేటప్పుడు నగదు ఇవ్వాలని లేదా నేరుగా బ్యాంక్ బదిలీ చేయాలని కోరండి.',
        },
        outcomeDescription: {
          en: 'The scammer abruptly disappears. You stayed safe by refusing to enter credentials.',
          hi: 'धोखेबाज तुरंत गायब हो गया। आप कोई गुप्त जानकारी न देकर सुरक्षित रहे।',
          te: 'మోసగాడు వెంటనే ఫోన్ కట్ చేశాడు. మీరు జాగ్రత్తగా వ్యవహరించి నష్టపోకుండా తప్పించుకున్నారు.',
        },
        financialImpact: { walletDelta: 0, emergencyDelta: 0, scoreDelta: 75, stressDelta: 0 },
        pedagogicalFeedback: {
          en: 'Insisting on standard, verified payment methods quickly flushes out fraudulent actors.',
          hi: 'प्रामाणिक भुगतान तरीकों पर जोर देने से धोखेबाज तुरंत भाग जाते हैं।',
          te: 'సరైన మార్గాల్లో మాత్రమే లావాదేవీలు చేయడం మోసగాళ్లను అడ్డుకుంటుంది.',
        },
      },
      {
        id: 'choice_upi_good',
        tier: 'good',
        text: {
          en: 'Hesitate, take a screenshot, and ask your hostel senior or cyber cell 1930 for advice first.',
          hi: 'संदेह होने पर रुकें, स्क्रीनशॉट लें और पहले किसी जानकार या 1930 से सलाह लें।',
          te: 'సందేహం వచ్చి ఆగండి, స్క్రీన్‌షాట్ తీసి స్నేహితులను లేదా సైబర్ హెల్ప్‌లైన్ 1930ని సంప్రదించండి.',
        },
        outcomeDescription: {
          en: 'Cautious move! Your senior immediately confirms it is a scam before any money was lost.',
          hi: 'सतर्कता भरा कदम! आपके सीनियर ने समय रहते बता दिया कि यह एक जालसाजी थी।',
          te: 'మంచి జాగ్రత్త! సీనియర్ వెంటనే ఇది మోసమని హెచ్చరించడంతో నష్టం జరగలేదు.',
        },
        financialImpact: { walletDelta: 0, emergencyDelta: 0, scoreDelta: 60, stressDelta: 5 },
        pedagogicalFeedback: {
          en: 'When in doubt, pausing and consulting trusted sources saves you from irreversible mistakes.',
          hi: 'संदेह की स्थिति में रुकना और सही सलाह लेना बड़े नुकसान से बचाता है।',
          te: 'అనుమానం వచ్చినప్పుడు ఆగి పెద్దల సలహా తీసుకోవడం ఉత్తమం.',
        },
      },
      {
        id: 'choice_upi_very_bad',
        tier: 'very_bad',
        text: {
          en: 'Scan the QR code, see a payment screen, and enter your 6-digit UPI PIN thinking it approves credit.',
          hi: 'QR कोड स्कैन करें और पैसे मिलने की उम्मीद में अपना 6-अंकों का UPI PIN डाल दें।',
          te: 'క్యూఆర్ కోడ్ స్కాన్ చేసి, డబ్బులు వస్తాయనుకుని మీ 6 అంకెల యూపీఐ పిన్ ఎంటర్ చేయండి.',
        },
        outcomeDescription: {
          en: 'DISASTER! ₹1,500 was instantly DEBITED from your account. The scammer blocked your number!',
          hi: 'विनाशकारी! आपके खाते से तुरंत ₹1,500 कट गए और जालसाज ने ब्लॉक कर दिया!',
          te: 'తీవ్ర నష్టం! మీ ఖాతా నుండి ₹1,500 కట్ అయిపోయాయి, మోసగాడు బ్లాక్ చేశాడు!',
        },
        financialImpact: { walletDelta: -1500, emergencyDelta: 0, scoreDelta: -90, stressDelta: 60 },
        pedagogicalFeedback: {
          en: 'Entering your UPI PIN authorizes your bank to RELEASE funds. You NEVER need to enter a PIN to receive incoming money!',
          hi: 'UPI PIN केवल पैसे खाते से बाहर भेजने की अनुमति देता है। प्राप्त करने के लिए PIN की आवश्यकता कभी नहीं होती!',
          te: 'యూపీఐ పిన్ అంటే బ్యాంక్ నుండి డబ్బులు బయటకు పంపే అనుమతి. ఎట్టి పరిస్థితుల్లోనూ డబ్బులు రావడానికి పిన్ అవసరం లేదు!',
        },
        educationalVideoTitle: 'Understanding the UPI Receive Money Scam',
      },
    ],
  },
};
