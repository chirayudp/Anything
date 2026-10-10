import { NPC } from '../types';

export const NPCS: Record<string, NPC> = {
  npc_hostel_warden: {
    id: 'npc_hostel_warden',
    name: 'Warden Rao Sir',
    role: 'Hostel Supervisor',
    avatar: '👨‍💼',
    x: 150,
    y: 190,
    cityId: 'city_hostel_commons',
    scenarioId: 'scenario_hostel_stipend',
    dialogueIntro: {
      en: "Congratulations on the scholarship! But remember: hostel mess dues must be cleared on the 1st of every month. Plan your budget before you spend a single rupee!",
      hi: "छात्रवृत्ति के लिए बधाई! लेकिन याद रखें: हर महीने की पहली तारीख को मेस का बकाया चुकाना होगा। एक भी रुपया खर्च करने से पहले बजट बनाएं!",
      te: "స్కాలర్‌షిప్ వచ్చినందుకు అభినందనలు! కానీ ప్రతి నెలా 1వ తేదీన మెస్ ఫీజు కట్టాలని గుర్తుంచుకోండి. రూపాయి ఖర్చు చేసే ముందే ప్లాన్ చేసుకోండి!",
    },
    dialogueSolved: {
      en: "Well done! Your mess dues are registered. That is the discipline of a true scholar.",
      hi: "शाबाश! आपके मेस का भुगतान दर्ज हो गया है। यही एक समझदार छात्र की पहचान है।",
      te: "చాలా బాగుంది! మెస్ ఫీజు నమోదైంది. క్రమశిక్షణతో కూడిన ఆర్థిక ప్రణాళిక మీది.",
    },
  },
  npc_repair_tech: {
    id: 'npc_repair_tech',
    name: 'Suresh Anna',
    role: 'Electronics Repair Tech',
    avatar: '🔧',
    x: 620,
    y: 170,
    cityId: 'city_rainy_day_refuge',
    scenarioId: 'scenario_broken_phone',
    dialogueIntro: {
      en: "Ouch, that phone glass is completely smashed. I can fix it for ₹1,200. Do you have emergency savings, or did you fall for one of those sketchy instant-loan apps?",
      hi: "अरे, स्क्रीन तो पूरी तरह टूट गई है। इसे ₹1,200 में ठीक कर दूंगा। क्या आपके पास इमरजेंसी पैसे हैं, या किसी फर्जी लोन ऐप के चक्कर में पड़ गए?",
      te: "అయ్యో, స్క్రీన్ మొత్తం పగిలిపోయింది. బాగు చేయడానికి ₹1,200 అవుతుంది. ఎమర్జెన్సీ ఫండ్ ఉందా, లేక ఏదైనా లోన్ యాప్ చూస్తున్నారా?",
    },
    dialogueSolved: {
      en: "Phone fixed like brand new! Smart move paying from your emergency reserves rather than borrowing at crazy interest.",
      hi: "फोन एकदम नया जैसा हो गया! भारी ब्याज पर कर्ज लेने के बजाय बचत से भुगतान करना समझदारी थी।",
      te: "ఫోన్ బాగుపడింది! వడ్డీకి అప్పు చేయకుండా సొంత పొదుపుతో పరిష్కరించుకోవడం చాలా మంచి నిర్ణయం.",
    },
  },
  npc_bank_officer: {
    id: 'npc_bank_officer',
    name: 'Officer Priya',
    role: 'Student Banking Specialist',
    avatar: '👩‍💼',
    x: 160,
    y: 370,
    cityId: 'city_compounding_grove',
    scenarioId: 'scenario_compounding_tree',
    dialogueIntro: {
      en: "Namaste! Did you know starting just ₹500 a month in Class 11 grows exponentially faster than starting with ₹2,000 after college? Let me show you how compounding works.",
      hi: "नमस्ते! क्या आप जानते हैं कि 11वीं कक्षा में केवल ₹500 प्रति माह शुरू करना कॉलेज के बाद ₹2,000 शुरू करने से कहीं तेजी से बढ़ता है?",
      te: "నమస్తే! 11వ తరగతిలోనే నెలకు ₹500 ఆదా చేయడం మొదలుపెడితే చక్రవడ్డీతో ఎంత పెద్ద మొత్తం అవుతుందో తెలుసా?",
    },
    dialogueSolved: {
      en: "Your recurring deposit is active! Watch the compound interest seed sprout into a giant banyan tree of financial freedom.",
      hi: "आपका रेकरिंग डिपॉजिट शुरू हो गया! देखें कि चक्रवृद्धि ब्याज का बीज कैसे विशाल वृक्ष बनता है।",
      te: "మీ రికరింగ్ డిపాజిట్ ప్రారంభమైంది! చిన్న పొదుపే భవిష్యత్తులో పెద్ద ఆస్తిగా మారుతుంది.",
    },
  },
  npc_cyber_inspector: {
    id: 'npc_cyber_inspector',
    name: 'Inspector Vikram',
    role: 'Cyber Crime Unit (1930)',
    avatar: '👮‍♂️',
    x: 340,
    y: 560,
    cityId: 'city_upi_maze',
    scenarioId: 'scenario_upi_pin_trap',
    dialogueIntro: {
      en: "Alert, student! Thousands in Hyderabad lose their stipends to fake QR codes every day. Someone wants to send you money? Remember the rule: NEVER enter your PIN to receive money!",
      hi: "सावधान छात्र! हैदराबाद में हर दिन हजारों लोग फर्जी QR कोड से पैसे गंवाते हैं। याद रखें: पैसे प्राप्त करने के लिए कभी PIN न डालें!",
      te: "జాగ్రత్త విద్యార్థీ! హైదరాబాద్‌లో నకిలీ క్యూఆర్ కోడ్‌ల వల్ల చాలామంది డబ్బు పోగొట్టుకుంటున్నారు. గుర్తుంచుకోండి: డబ్బులు రావడానికి ఎప్పుడూ పిన్ కొట్టకండి!",
    },
    dialogueSolved: {
      en: "Case closed! You outsmarted the scammer. Report any suspicious numbers directly to 1930.",
      hi: "केस सुलझ गया! आपने जालसाज को मात दी। किसी भी संदिग्ध नंबर की सूचना 1930 पर दें।",
      te: "సమస్య పరిష్కారమైంది! మోసగాడిని గుర్తించారు. అనుమానాస్పద కాల్స్ వస్తే 1930కి కాల్ చేసి ఫిర్యాదు చేయండి.",
    },
  },
};
