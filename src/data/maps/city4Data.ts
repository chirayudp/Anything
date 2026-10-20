import { NPC } from '../../types';
import { CollisionBox, CityObject, CityMapConfig, CollisionGrid } from './city1Data';

export const CITY4_CONFIG: CityMapConfig = {
  id: 'city_harbor_town',
  name: 'Harbor Town (City 4)',
  regionId: 'region_harbor_district',
  pillar: 'Stay Financially Safe (Security & Anti-Fraud)',
  width: 1024,
  height: 560,
  spawnPoint: {
    x: 480,
    y: 490,
    direction: 'down',
  },
};

export const CITY4_COLLISION_BOXES: CollisionBox[] = [
  // 1. Map Perimeter Boundaries
  { name: 'boundary_north', x: 0, y: 0, w: 1024, h: 20 },
  { name: 'boundary_south', x: 0, y: 550, w: 1024, h: 10 },
  { name: 'boundary_west', x: 0, y: 0, w: 15, h: 560 },
  { name: 'boundary_east', x: 1010, y: 0, w: 14, h: 560 },

  // 2. Sea Water & Cliffs (Top-left & South-west)
  { name: 'lighthouse_cliff', x: 20, y: 20, w: 150, h: 200 },
  { name: 'ocean_southwest_water', x: 15, y: 220, w: 170, h: 330 },
  { name: 'dock_boat_basin_water', x: 235, y: 520, w: 200, h: 30 },
  { name: 'harbor_bay_water', x: 370, y: 540, w: 200, h: 20 },

  // 3. Fisherman's Guildhall
  { name: 'fishermans_guildhall', x: 190, y: 60, w: 205, h: 200 },

  // 4. North Cliff Village Residential Row
  { name: 'cliff_houses_row', x: 420, y: 20, w: 390, h: 140 },
  { name: 'cliff_northeast_rock', x: 810, y: 0, w: 200, h: 140 },

  // 5. Coastal Cafe (Upper Terrace)
  { name: 'coastal_cafe_upper', x: 480, y: 240, w: 110, h: 70 },

  // 6. Market Square Stalls
  { name: 'market_square_stalls', x: 625, y: 310, w: 140, h: 80 },

  // 7. Shipwreck Museum
  { name: 'shipwreck_museum', x: 815, y: 285, w: 120, h: 90 },

  // 8. Coastal Cafe (Lower Building near pier)
  { name: 'coastal_cafe_lower', x: 590, y: 515, w: 130, h: 45 },

  // 9. Palm Park Benches / Fountain (South-east)
  { name: 'palm_park_fences', x: 750, y: 535, w: 170, h: 25 },
  { name: 'southeast_cliffs', x: 920, y: 440, w: 90, h: 110 },
];

export const CITY4_COLLISION_GRID_TILE_SIZE = 8;
export const CITY4_COLLISION_GRID_COLS = Math.ceil(CITY4_CONFIG.width / CITY4_COLLISION_GRID_TILE_SIZE); // 128
export const CITY4_COLLISION_GRID_ROWS = Math.ceil(CITY4_CONFIG.height / CITY4_COLLISION_GRID_TILE_SIZE); // 70

export function createCity4CollisionGrid(boxes: CollisionBox[]): CollisionGrid {
  const cells = new Uint8Array(CITY4_COLLISION_GRID_COLS * CITY4_COLLISION_GRID_ROWS);

  boxes.forEach((box) => {
    const colStart = Math.max(0, Math.floor(box.x / CITY4_COLLISION_GRID_TILE_SIZE));
    const colEnd = Math.min(CITY4_COLLISION_GRID_COLS - 1, Math.floor((box.x + box.w - 1) / CITY4_COLLISION_GRID_TILE_SIZE));
    const rowStart = Math.max(0, Math.floor(box.y / CITY4_COLLISION_GRID_TILE_SIZE));
    const rowEnd = Math.min(CITY4_COLLISION_GRID_ROWS - 1, Math.floor((box.y + box.h - 1) / CITY4_COLLISION_GRID_TILE_SIZE));

    for (let r = rowStart; r <= rowEnd; r++) {
      for (let c = colStart; c <= colEnd; c++) {
        cells[r * CITY4_COLLISION_GRID_COLS + c] = 1;
      }
    }
  });

  return {
    tileSize: CITY4_COLLISION_GRID_TILE_SIZE,
    cols: CITY4_COLLISION_GRID_COLS,
    rows: CITY4_COLLISION_GRID_ROWS,
    cells,
  };
}

export const CITY4_COLLISION_GRID = createCity4CollisionGrid(CITY4_COLLISION_BOXES);

export const CITY4_NPCS: NPC[] = [
  {
    id: 'npc_dock_master_tariq',
    name: 'Dock Master Tariq',
    role: 'Harbor Gatekeeper',
    avatar: '⚓',
    x: 325,
    y: 335,
    cityId: 'city_harbor_town',
    direction: 'down',
    scenarioId: 'scenario_fs_001_fake_scholarship',
    dialogueIntro: {
      en: "Ahoy there, scholar! Watch your phone closely in Harbor Town. Phishing alerts and fake scholarship SMS messages arrive daily. Remember: a UPI PIN or OTP is ONLY entered to SEND money, NEVER to receive!",
      hi: 'अरे विद्यार्थी! हार्बर टाउन में अपने फोन पर नजर रखें। फर्जी छात्रवृत्ति एसएमएस के धोखेबाज हर जगह हैं। याद रखें: यूपीआई पिन या ओटीपी केवल पैसे भेजने के लिए होता है, पाने के लिए कभी नहीं!',
      te: 'నమస్తే విద్యార్థీ! హార్బర్ టౌన్‌లో మీ ఫోన్‌ను జాగ్రత్తగా చూసుకోండి. నకిలీ స్కాలర్‌షిప్ ఎస్ఎంఎస్ మోసగాళ్లు ఉన్నారు. గుర్తుంచుకోండి: యూపీఐ పిన్ లేదా ఓటీపీ కేవలం డబ్బు పంపడానికి మాత్రమే, తీసుకోవడానికి కాదు!',
    },
    dialogueSolved: {
      en: "Outstanding vigilance! You spotted the scam link, safeguarded your scholarship, and protected your fellow students. You are a true digital defender of the harbor!",
      hi: 'शानदार सतर्कता! आपने फर्जी लिंक को पहचाना और अपनी छात्रवृत्ति को सुरक्षित रखा। आप बंदरगाह के सच्चे डिजिटल रक्षक हैं!',
      te: 'అద్భుతమైన అప్రమత్తత! మీరు నకిలీ లింక్‌ను గుర్తించి స్కాలర్‌షిప్‌ను కాపాడారు. మీరు నిజమైన డిజిటల్ రక్షకులు!',
    },
  },
  {
    id: 'npc_atm_officer_vikram',
    name: 'Officer Vikram',
    role: 'Harbor Security Inspector',
    avatar: '👮‍♂️',
    x: 435,
    y: 310,
    cityId: 'city_harbor_town',
    direction: 'down',
    scenarioId: 'scenario_fs_002_atm_helper',
    dialogueIntro: {
      en: "Attention, student! When using our harbor ATM booth, beware of pushy strangers offering 'help' or shady card readers. Always shield your PIN and inspect the card slot!",
      hi: 'सावधान विद्यार्थी! हार्बर एटीएम का उपयोग करते समय मदद का नाटक करने वाले अजनबियों से सावधान रहें। हमेशा अपना पिन छुपाएं और कार्ड स्लॉट की जांच करें!',
      te: 'జాగ్రత్త విద్యార్థీ! హార్బర్ ఏటీఎం వాడుతున్నప్పుడు సహాయం చేస్తామనే అపరిచితులను నమ్మకండి. ఎల్లప్పుడూ మీ పిన్‌ను దాచి కొట్టండి!',
    },
    dialogueSolved: {
      en: "Safety protocol followed flawlessly! Shielding your keypad, spotting skimmers, and guarding your cash keeps your funds impenetrable.",
      hi: 'सुरक्षा नियमों का बेहतरीन पालन! कीपैड छुपाना और सतर्क रहना आपकी मेहनत की कमाई को सुरक्षित रखता है।',
      te: 'భద్రతా నిబంధనలు చక్కగా పాటించారు! కీప్యాడ్‌ను కవర్ చేయడం మరియు అప్రమత్తంగా ఉండటం మీ డబ్బును సురక్షితంగా ఉంచుతుంది.',
    },
  },
  {
    id: 'npc_fishmonger_lakshmi',
    name: 'Fishmonger Lakshmi',
    role: 'Market Square Merchant',
    avatar: '🐟',
    x: 690,
    y: 430,
    cityId: 'city_harbor_town',
    direction: 'down',
    scenarioId: 'scenario_fs_003_double_money',
    dialogueIntro: {
      en: "Namaste! Beware of slick talkers at the Market Square whispering 'double your pocket money in a week!' If there is no real product and only recruitment, it is a pyramid trap!",
      hi: 'नमस्ते! मार्केट स्क्वायर में एक हफ्ते में पैसे दोगुना करने का दावा करने वालों से सावधान रहें। अगर कोई उत्पाद नहीं और सिर्फ नए लोगों को जोड़ना है, तो यह पोंजी स्कीम है!',
      te: 'నమస్తే! మార్కెట్ స్క్వేర్‌లో వారం రోజుల్లో డబ్బులు డబుల్ చేస్తామనే మోసగాళ్లను నమ్మకండి. ఉత్పత్తి లేకుండా కేవలం వ్యక్తులను చేర్చుకోవడమే అయితే అది పిరమిడ్ మోసం!',
    },
    dialogueSolved: {
      en: "Wisdom prevails! You saw right through the pyramid chain trap, kept your money safe, and rescued your roommates from financial ruins.",
      hi: 'बुद्धिमत्ता की जीत! आपने पोंजी स्कीम के जाल को पहचाना और अपने दोस्तों को भी बर्बादी से बचाया।',
      te: 'తెలివైన నిర్ణయం! మీరు పిరమిడ్ మోసాన్ని గుర్తించి మీ డబ్బును, మీ స్నేహితులను కాపాడారు.',
    },
  },
  {
    id: 'npc_curator_anand',
    name: 'Curator Anand',
    role: 'Shipwreck Museum Historian',
    avatar: '🔍',
    x: 870,
    y: 410,
    cityId: 'city_harbor_town',
    direction: 'down',
    scenarioId: 'scenario_fs_004_part_time_job',
    dialogueIntro: {
      en: "Greetings from the Museum! In maritime history, pirates used shiny bait to lure ships into rocks. Online scammers do the same with 'part-time job registration fee' emails. Never pay upfront to get a job!",
      hi: 'म्यूजियम में स्वागत है! जिस तरह समुद्री लुटेरे चमकते चारे से जहाजों को फंसाते थे, वैसे ही ऑनलाइन ठग रजिस्ट्रेशन फीस मांगते हैं। नौकरी पाने के लिए कभी अग्रिम शुल्क न दें!',
      te: 'మ్యూజియంకు స్వాగతం! ఉద్యోగం ఇస్తామని రిజిస్ట్రేషన్ ఫీజు అడిగే ఆన్‌లైన్ మోసగాళ్లను నమ్మకండి. అసలైన కంపెనీలు ఎప్పుడూ ముందుగా డబ్బులు అడగవు!',
    },
    dialogueSolved: {
      en: "Sharp eye for legitimate opportunities! Real jobs pay you, they don't demand upfront money. Your identity and bank reserves remain safely locked away.",
      hi: 'शानदार परख! असली कंपनियां आपको वेतन देती हैं, आपसे पैसे नहीं मांगतीं। आपकी पहचान और बचत पूरी तरह सुरक्षित है।',
      te: 'సరైన అవగాహన! అసలైన ఉద్యోగాలు మీకు జీతం ఇస్తాయి, ఫీజులు అడగవు. మీ వివరాలు, పొదుపు సురక్షితంగా ఉన్నాయి.',
    },
  },
  {
    id: 'npc_groundskeeper_deva',
    name: 'Groundskeeper Deva',
    role: 'Harbor Maintenance Specialist',
    avatar: '🧹',
    x: 775,
    y: 280,
    cityId: 'city_harbor_town',
    direction: 'down',
    scenarioId: 'scenario_fs_005_sim_block',
    dialogueIntro: {
      en: "Hello! Watch out for fake telecom calls threatening to 'block your SIM in 15 minutes unless you give the OTP'. Real telecom providers never ask for OTPs or threaten instant cuts!",
      hi: 'नमस्ते! 15 मिनट में सिम ब्लॉक करने की धमकी देकर ओटीपी मांगने वाले फर्जी कॉल्स से सावधान रहें। असली टेलीकॉम कंपनी कभी ओटीपी नहीं मांगती!',
      te: 'హలో! 15 నిమిషాల్లో సిమ్ కార్డు బ్లాక్ చేస్తామని బెదిరించి ఓటీపీ అడిగే నకిలీ కాల్స్‌ను నమ్మకండి. అసలైన సంస్థలు ఎప్పుడూ ఓటీపీ అడగవు!',
    },
    dialogueSolved: {
      en: "Impenetrable defense! You hung up on the imposter, fortified two-factor authentication, and proved that calm logic always beats urgency traps!",
      hi: 'अभेद्य सुरक्षा! आपने जालसाज का फोन काटा, मजबूत सुरक्षा सेटिंग्स लगाईं और साबित किया कि शांति से लिया निर्णय हमेशा जीतता है!',
      te: 'అద్భుతమైన రక్షణ! మీరు నకిలీ కాల్‌ను కట్ చేసి సెక్యూరిటీని బలోపేతం చేశారు. ఆందోళన పడకుండా ఉండటమే అత్యుత్తమ రక్షణ!',
    },
  },
];

export function getCity4NpcCollisionBoxes(npcs: NPC[] = CITY4_NPCS): CollisionBox[] {
  return npcs.map((npc) => ({
    name: `npc_foot_${npc.id}`,
    x: npc.x - 8,
    y: npc.y - 4,
    w: 16,
    h: 8,
  }));
}

export const CITY4_INTERACTIVES: CityObject[] = [
  {
    id: 'portal_city3_return',
    type: 'portal',
    name: 'Pier Boat: Return to City 3 (Investment Valley)',
    x: 480,
    y: 490,
    radius: 65,
    icon: 'Compass',
    prompt: {
      en: 'Press [E] / Space to board ferry back to City 3 (Investment Valley)',
      hi: 'सिटी 3 (इन्वेस्टमेंट वैली) लौटने के लिए [E] दबाएं',
      te: 'సిటీ 3 (ఇన్వెస్ట్‌మెంట్ వ్యాలీ) తిరిగి వెళ్ళడానికి [E] నొక్కండి',
    },
    title: {
      en: 'Ferry Dock: Return to Investment Valley',
      hi: 'फेरी डॉक: इन्वेस्टमेंट वैली वापसी',
      te: 'ఫెర్రీ డాక్: ఇన్వెస్ట్‌మెంట్ వ్యాలీ తిరుగు ప్రయాణం',
    },
    content: {
      en: 'Ferry back to City 3 (Investment Valley).\n\nReturn to review investing simulations, compounding mango tree lessons, and cargo boat diversification.',
      hi: 'सिटी 3 (इन्वेस्टमेंट वैली) वापसी की नौका। निवेश सिमुलेशन और विविवधीकरण की समीक्षा के लिए वापस जाएं।',
      te: 'సిటీ 3 (ఇన్వెస్ట్‌మెంట్ వ్యాలీ) ఫెర్రీ. పెట్టుబడి సిమ్యులేషన్లు, కాంపౌండింగ్ మరియు వైవిధ్యం సాధన చేయడానికి తిరిగి వెళ్ళండి.',
    },
    details: {
      category: 'World Navigation',
      financialLesson: 'You can sail between harbor towns and school valleys to revisit your financial milestones.',
      recommendedAction: 'Travel to City 3',
    },
  },
  {
    id: 'landmark_security_golden_rules',
    type: 'landmark',
    name: 'Golden Rules of Security Board',
    x: 490,
    y: 350,
    radius: 45,
    icon: 'Receipt',
    prompt: {
      en: 'Press [E] / Space to read The Golden Rules of Security',
      hi: 'सुरक्षा के स्वर्णिम नियम पढ़ने के लिए [E] दबाएं',
      te: 'భద్రతా సువర్ణ నియమాలు చదవడానికి [E] నొక్కండి',
    },
    title: {
      en: 'The Golden Rules of Security (Pillar 4)',
      hi: 'सुरक्षा के स्वर्णिम नियम (स्तंभ 4)',
      te: 'భద్రతా సువర్ణ నియమాలు (పిల్లర్ 4)',
    },
    content: {
      en: '1. An OTP or UPI PIN is ONLY entered to SEND money, NEVER to receive money.\n2. Banks, police, and teachers will NEVER ask you for your password or card PIN.\n3. Any message shouting "URGENT! ACT IN 5 MINUTES!" is almost always a trap.',
      hi: '1. ओटीपी या यूपीआई पिन केवल पैसे भेजने के लिए डाला जाता है, पाने के लिए कभी नहीं।\n2. बैंक, पुलिस या शिक्षक कभी आपका पासवर्ड या कार्ड पिन नहीं मांगते।\n3. "तुरंत करें! 5 मिनट में बंद हो जाएगा!" चिल्लाने वाला कोई भी संदेश हमेशा एक जाल होता है।',
      te: '1. ఓటీపీ లేదా యూపీఐ పిన్ కేవలం డబ్బు పంపడానికి మాత్రమే, తీసుకోవడానికి ఎప్పుడూ కాదు.\n2. బ్యాంకులు, పోలీసులు మీ పాస్‌వర్డ్ లేదా పిన్ ఎప్పుడూ అడగరు.\n3. "అర్జెంట్! 5 నిమిషాల్లో చేయండి!" అనే సందేశాలన్నీ దాదాపు మోసాలే.',
    },
    details: {
      category: 'Security Idea Card',
      financialLesson: 'True financial freedom means defending your wealth as fiercely as you earn and invest it.',
    },
  },
];
