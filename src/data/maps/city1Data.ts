import { NPC, InteractiveEntity } from '../../types';

export interface CollisionBox {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CityObject {
  id: string;
  type: 'kiosk' | 'landmark' | 'collectible' | 'portal';
  name: string;
  x: number;
  y: number;
  radius: number;
  icon: string;
  prompt: Record<'en' | 'hi' | 'te', string>;
  title: Record<'en' | 'hi' | 'te', string>;
  content: Record<'en' | 'hi' | 'te', string>;
  details?: {
    category: string;
    financialLesson: string;
    recommendedAction?: string;
  };
}

export interface CityMapConfig {
  id: string;
  name: string;
  regionId: string;
  pillar: string;
  width: number;
  height: number;
  spawnPoint: {
    x: number;
    y: number;
    direction: 'up' | 'down' | 'left' | 'right';
  };
}

export const CITY1_CONFIG: CityMapConfig = {
  id: 'city_hostel_commons',
  name: 'Hostel Commons (City 1)',
  regionId: 'region_scholars_district',
  pillar: 'Plan & Budget (50-30-20 Rule)',
  width: 1024,
  height: 572,
  spawnPoint: {
    x: 75,
    y: 450,
    direction: 'right',
  },
};

// 2.5D Foot-Aligned Physical Collision Geometry
export const CITY1_COLLISION_BOXES: CollisionBox[] = [
  // 1. Perimeter Boundaries (Leaving North Highway open at x: 670-715 for City 2 exit)
  { name: 'boundary_top_left', x: 0, y: 0, w: 670, h: 16 },
  { name: 'boundary_top_right', x: 715, y: 0, w: 309, h: 16 },
  { name: 'boundary_west', x: 0, y: 0, w: 10, h: 572 },
  { name: 'boundary_east', x: 1014, y: 0, w: 10, h: 572 },
  { name: 'boundary_bottom', x: 0, y: 560, w: 1024, h: 12 },

  // 2. West River & Canal (Leaves START bridge at y: 425-475 completely open)
  { name: 'river_north', x: 0, y: 290, w: 85, h: 135 },
  { name: 'river_south', x: 0, y: 475, w: 85, h: 95 },

  // 3. School & Library Complex (NW)
  // Building physical foundation (roof is non-solid; north courtyard wall blocks y: 196)
  { name: 'school_main_building', x: 55, y: 30, w: 305, h: 168 },
  // Front stone walls (leaves central gate at x: 180-245 open)
  { name: 'school_wall_left', x: 110, y: 285, w: 70, h: 15 },
  { name: 'school_wall_right', x: 245, y: 285, w: 85, h: 15 },
  { name: 'school_wall_west', x: 110, y: 155, w: 8, h: 130 },
  { name: 'school_flagpole', x: 168, y: 216, w: 6, h: 6 },

  // 4. Bookshop (North-Center-West)
  // Physical shop foundation (leaves front sidewalk & road at y: 230-300 open)
  { name: 'bookshop_building', x: 330, y: 150, w: 85, h: 75 },

  // 5. Study Room (North-Center)
  { name: 'study_room_building', x: 475, y: 65, w: 155, h: 115 },

  // 6. Hostel (NE)
  // Building physical foundation
  { name: 'hostel_main_building', x: 745, y: 25, w: 225, h: 135 },
  // Courtyard south stone walls (leaves gate at x: 830-890 open)
  { name: 'hostel_wall_left', x: 740, y: 220, w: 90, h: 15 },
  { name: 'hostel_wall_right', x: 890, y: 220, w: 85, h: 15 },
  { name: 'hostel_wall_west', x: 738, y: 135, w: 8, h: 85 },
  // Parked scooters (physical footprints)
  { name: 'hostel_scooter_nw', x: 755, y: 55, w: 30, h: 22 },
  { name: 'hostel_scooter_west', x: 755, y: 110, w: 30, h: 20 },
  { name: 'hostel_scooter_mid', x: 800, y: 135, w: 28, h: 18 },

  // 7. Campus Canteen & Patio Enclosure (Center)
  // Kitchen building foundation
  { name: 'canteen_building', x: 340, y: 305, w: 160, h: 45 },
  // Patio perimeter wooden fences (leaves south entrance at x: 345-435 open)
  { name: 'canteen_fence_west', x: 265, y: 310, w: 8, h: 105 },
  { name: 'canteen_fence_east', x: 505, y: 310, w: 8, h: 105 },
  { name: 'canteen_fence_south_left', x: 265, y: 415, w: 80, h: 10 },
  { name: 'canteen_fence_south_right', x: 435, y: 415, w: 78, h: 10 },
  // Patio outdoor tables (physical bases only)
  { name: 'canteen_table_top_left', x: 285, y: 315, w: 35, h: 25 },
  { name: 'canteen_table_bot_left', x: 315, y: 380, w: 35, h: 25 },
  { name: 'canteen_table_bot_right', x: 470, y: 380, w: 35, h: 25 },

  // 8. Electronics Repair Shop (Center-East)
  { name: 'electronics_shop', x: 590, y: 235, w: 80, h: 88 },

  // 9. Savings Bank (SE)
  { name: 'savings_bank_building', x: 815, y: 400, w: 135, h: 95 },
  // East bank alley dead-end wall (Hardcoded obstacle blocking 980, 425)
  { name: 'east_bank_alley_wall', x: 950, y: 400, w: 64, h: 95 },

  // 10. South Road Curbs & Borders (Hardcoded roadside obstacles blocking 130,495; 194,495; 252,495)
  { name: 'south_road_curb_west', x: 85, y: 490, w: 185, h: 75 },

  // East highway roadside barrier post (Hardcoded obstacle blocking 707, 276)
  { name: 'east_highway_barrier_post', x: 700, y: 268, w: 16, h: 16 },
  // Highway corridor curbs & barriers (Hardcoded obstacles blocking 689, 281 and 737, 282)
  { name: 'roadside_barrier_689_281', x: 684, y: 275, w: 12, h: 14 },
  { name: 'roadside_barrier_737_282', x: 728, y: 275, w: 18, h: 16 },

  // 11. Tree Trunks & Park Obstacles (Solid physical areas only)
  // South banyan tree & road planter (Hardcoded obstacle blocking 654, 430)
  { name: 'south_banyan_planter', x: 585, y: 430, w: 85, h: 90 },
  { name: 'west_banyan_trunk', x: 25, y: 265, w: 65, h: 40 },
  { name: 'tree_study_room', x: 435, y: 160, w: 25, h: 25 },
  { name: 'tree_school_north', x: 365, y: 75, w: 25, h: 25 },
  { name: 'tree_hostel_east', x: 945, y: 250, w: 25, h: 25 },
  { name: 'south_park_bench_1', x: 300, y: 480, w: 35, h: 12 },
  { name: 'south_park_bench_2', x: 480, y: 480, w: 35, h: 12 },
  // Park planter / obstacle tile (Hardcoded obstacle blocking 151, 380)
  { name: 'obstacle_tile_151_380', x: 144, y: 372, w: 16, h: 16 },
];

// Spatial Tile-Based Collision Grid (8x8 px grid cells)
export const COLLISION_GRID_TILE_SIZE = 8;
export const COLLISION_GRID_COLS = Math.ceil(CITY1_CONFIG.width / COLLISION_GRID_TILE_SIZE); // 128
export const COLLISION_GRID_ROWS = Math.ceil(CITY1_CONFIG.height / COLLISION_GRID_TILE_SIZE); // 72

export interface CollisionGrid {
  tileSize: number;
  cols: number;
  rows: number;
  cells: Uint8Array;
}

// Generate compiled binary collision grid from physical boxes
export function createCity1CollisionGrid(boxes: CollisionBox[]): CollisionGrid {
  const cells = new Uint8Array(COLLISION_GRID_COLS * COLLISION_GRID_ROWS);

  boxes.forEach((box) => {
    const colStart = Math.max(0, Math.floor(box.x / COLLISION_GRID_TILE_SIZE));
    const colEnd = Math.min(COLLISION_GRID_COLS - 1, Math.floor((box.x + box.w - 1) / COLLISION_GRID_TILE_SIZE));
    const rowStart = Math.max(0, Math.floor(box.y / COLLISION_GRID_TILE_SIZE));
    const rowEnd = Math.min(COLLISION_GRID_ROWS - 1, Math.floor((box.y + box.h - 1) / COLLISION_GRID_TILE_SIZE));

    for (let r = rowStart; r <= rowEnd; r++) {
      for (let c = colStart; c <= colEnd; c++) {
        cells[r * COLLISION_GRID_COLS + c] = 1; // 1 = solid obstacle
      }
    }
  });

  return {
    tileSize: COLLISION_GRID_TILE_SIZE,
    cols: COLLISION_GRID_COLS,
    rows: COLLISION_GRID_ROWS,
    cells,
  };
}

export const CITY1_COLLISION_GRID = createCity1CollisionGrid(CITY1_COLLISION_BOXES);

// NPCs positioned on City 1 Map
export const CITY1_NPCS: NPC[] = [
  {
    id: 'npc_hostel_warden',
    name: 'Warden Rao Sir',
    role: 'Hostel Supervisor',
    avatar: '👨‍💼',
    x: 845,
    y: 180,
    cityId: 'city_hostel_commons',
    scenarioId: 'PB_001',
    dialogueIntro: {
      en: 'Congratulations on the scholarship! But remember: hostel mess dues must be cleared on the 1st of every month. Plan your budget before you spend a single rupee!',
      hi: 'छात्रवृत्ति के लिए बधाई! लेकिन याद रखें: हर महीने की पहली तारीख को मेस का बकाया चुकाना होगा। एक भी रुपया खर्च करने से पहले बजट बनाएं!',
      te: 'స్కాలర్‌షిప్ వచ్చినందుకు అభినందనలు! కానీ ప్రతి నెలా 1వ తేదీన మెస్ ఫీజు కట్టాలని గుర్తుంచుకోండి. రూపాయి ఖర్చు చేసే ముందే ప్లాన్ చేసుకోండి!',
    },
    dialogueSolved: {
      en: 'Well done! Your mess dues are registered. That is the discipline of a true scholar.',
      hi: 'शाबाश! आपके मेस का भुगतान दर्ज हो गया है। यही एक समझदार छात्र की पहचान है।',
      te: 'చాలా బాగుంది! మెస్ ఫీజు నమోదైంది. క్రమశిక్షణతో కూడిన ఆర్థిక ప్రణాళిక మీది.',
    },
  },
  {
    id: 'npc_repair_tech',
    name: 'Suresh Anna',
    role: 'Electronics Repair Tech',
    avatar: '🔧',
    x: 650,
    y: 352,
    cityId: 'city_rainy_day_refuge',
    scenarioId: 'PB_004',
    dialogueIntro: {
      en: 'Welcome to the repair shop! Keep an eye on your tech. A sudden broken screen can cost ₹1,200. Always keep an emergency reserve ready so you never have to turn to predatory loan apps!',
      hi: 'मरम्मत की दुकान में स्वागत है! अपने गैजेट्स का ध्यान रखें। टूटी स्क्रीन ₹1,200 ले जाएगी। हमेशा इमरजेंसी बचत रखें!',
      te: 'రిపేర్ షాప్‌కి స్వాగతం! మీ ఫోన్‌ని జాగ్రత్తగా చూసుకోండి. స్క్రీన్ పగిలితే ₹1,200 ఖర్చవుతుంది. ఎల్లప్పుడూ ఎమర్జెన్సీ ఫండ్ సిద్ధంగా ఉంచుకోండి!',
    },
    dialogueSolved: {
      en: 'Smart scholars plan ahead for sudden repairs. Never borrow at 30% monthly compounding interest!',
      hi: 'समझदार छात्र अचानक मरम्मत की योजना पहले से बनाते हैं। कभी भी 30% मासिक ब्याज पर कर्ज न लें!',
      te: 'తెలివైన విద్యార్థులు అత్యవసర ఖర్చులకు ముందే సిద్ధపడతారు. అధిక వడ్డీ యాప్‌లకు దూరంగా ఉండండి!',
    },
  },
  {
    id: 'npc_canteen_manager',
    name: 'Chary Garu',
    role: 'Canteen Cashier & Tea Stall Vendor',
    avatar: '☕',
    x: 395,
    y: 360,
    cityId: 'city_hostel_commons',
    dialogueIntro: {
      en: 'Namaste thammudu! Our Irani chai is ₹15 and samosa is ₹20. Seems small, right? But having two every day is ₹1,050 a month! Discretionary micro-spending silently drains your wallet.',
      hi: 'नमस्ते भाई! ईरानी चाय ₹15 और समोसा ₹20 का है। छोटा लगता है ना? लेकिन रोज का ₹35 महीने में ₹1,050 बनता है! छोटे खर्चे जेब खाली कर देते हैं।',
      te: 'నమస్తే తమ్ముడూ! మా ఇరానీ చాయ్ ₹15, సమోసా ₹20. చిన్న మొత్తమే అనిపిస్తుంది కదా? కానీ రోజూ తాగితే నెలకు ₹1,050 అవుతుంది! చిన్న ఖర్చులు బడ్జెట్‌ను దెబ్బతీస్తాయి.',
    },
    dialogueSolved: {
      en: 'Enjoy your chai with friends, but keep it within the 30% "Wants" budget bucket!',
      hi: 'दोस्तों के साथ चाय का आनंद लें, लेकिन इसे अपने 30% शौक के बजट में ही रखें!',
      te: 'స్నేహితులతో చాయ్ తాగండి, కానీ దాన్ని మీ 30% విలాసాల బడ్జెట్ పరిధిలోనే ఉంచండి!',
    },
  },
  {
    id: 'npc_senior_librarian',
    name: 'Madam Lakshmi',
    role: 'Senior Academic Librarian',
    avatar: '📚',
    x: 210,
    y: 210,
    cityId: 'city_hostel_commons',
    scenarioId: 'PB_005',
    dialogueIntro: {
      en: 'Welcome to the Central Library! Before rushing to buy brand-new textbooks for ₹3,000, check our reference copies or visit the Academic Bazaar for used books at 70% off!',
      hi: 'केंद्रीय पुस्तकालय में स्वागत है! ₹3,000 की नई किताबें खरीदने से पहले हमारी लाइब्रेरी प्रतियां देखें या 70% छूट पर पुरानी किताबें लें!',
      te: 'సెంట్రల్ లైబ్రరీకి స్వాగతం! ₹3,000 పెట్టి కొత్త పుస్తకాలు కొనేముందు లైబ్రరీ పుస్తకాలు లేదా సెకండ్ హ్యాండ్ పుస్తకాలు చూడండి!',
    },
  },
  {
    id: 'npc_security_guard',
    name: 'Security Guard Ramu',
    role: 'Savings Bank & Campus Security',
    avatar: '👮',
    x: 845,
    y: 505,
    cityId: 'city_hostel_commons',
    dialogueIntro: {
      en: 'Namaste student! I am on security duty at the State Bank and ATM. Always remember: guard your 4-digit ATM PIN, never share OTPs with strangers, and make sure your monthly scholarship stipend is safely deposited in your zero-balance student account!',
      hi: 'नमस्ते विद्यार्थी! मैं स्टेट बैंक और एटीएम की सुरक्षा ड्यूटी पर हूं। याद रखें: अपना 4-अंकीय एटीएम पिन किसी को न बताएं, अजनबियों से ओटीपी साझा न करें और छात्रवृत्ति सुरक्षित रखें!',
      te: 'నమస్తే విద్యార్థి! నేను స్టేట్ బ్యాంక్ మరియు ఏటీఎం వద్ద సెక్యూరిటీ డ్యూటీలో ఉన్నాను. మీ 4 అంకెల ఏటీఎం పిన్ ఎవరికీ చెప్పకండి, ఓటీపీ ఎవరితోనూ పంచుకోవద్దు మరియు స్కాలర్‌షిప్ సురక్షితంగా డిపాజిట్ చేయండి!',
    },
    dialogueSolved: {
      en: 'Stay safe and protect your bank account with 2-Factor Authentication!',
      hi: 'सुरक्षित रहें और 2FA के साथ अपने बैंक खाते को सुरक्षित रखें!',
      te: 'సురక్షితంగా ఉండండి మరియు 2-ఫాక్టర్ అథెంటికేషన్‌తో మీ బ్యాంక్ ఖాతాను రక్షించుకోండి!',
    },
  },
  {
    id: 'npc_anand_senior',
    name: 'Anand',
    role: 'Senior Roommate',
    avatar: '🧑‍🎓',
    x: 535,
    y: 200,
    cityId: 'city_hostel_commons',
    scenarioId: 'PB_001',
    dialogueIntro: {
      en: 'Hey there, roommate! Congratulations on your ₹6,000 scholarship pocket money. Remember, we have 30 days ahead of us. Before spending on branded shoes or parties, make sure you divide your stipend smartly between Important Needs, Fun Wants, and Emergency Money!',
      hi: 'अरे रूममेट! ₹6,000 की छात्रवृत्ति मिलने पर बधाई। याद रखें, 30 दिन का महीना है। फिजूलखर्ची से पहले अपने पैसे को जरूरी आवश्यकताओं, शौक और आपातकालीन बचत में समझदारी से बांटें!',
      te: 'హలో రూమ్‌మేట్! ₹6,000 స్కాలర్‌షిప్ వచ్చినందుకు అభినందనలు. ముందు 30 రోజుల నెలకు సరిపడేలా మీ స్టైపెండ్‌ను అవసరాలు, సరదాలు మరియు ఎమర్జెన్సీ ఫండ్‌గా తెలివిగా కేటాయించుకోండి!',
    },
    dialogueSolved: {
      en: "Smart budget split! You've protected your food and travel needs while building a solid safety cushion. That's how scholars thrive!",
      hi: 'शानदार बजट आवंटन! आपने अपने भोजन और यात्रा खर्च को सुरक्षित रखा और एक मजबूत बचत भी बनाई।',
      te: 'చక్కని బడ్జెట్ విభజన! భోజనం, చదువు ఖర్చులను కాపాడుకుంటూ భవిష్యత్తు కోసం పొదుపు చేశారు.',
    },
  },
  {
    id: 'npc_bookshop_owner',
    name: 'Masterji Gupta',
    role: 'Bookshop Keeper',
    avatar: '👴',
    x: 365,
    y: 235,
    cityId: 'city_hostel_commons',
    scenarioId: 'PB_002',
    dialogueIntro: {
      en: "Namaste beta! Looking for your semester science textbooks and exam geometry box? Don't drain your wallet on brand-new hardcover books when you can get quality second-hand copies or share library copies!",
      hi: 'नमस्ते बेटा! सेमेस्टर की साइंस किताबें और ज्यामिति बॉक्स चाहिए? नई महंगी किताबों पर पूरा पैसा खर्च करने के बजाय पुरानी अच्छी किताबें या लाइब्रेरी की मदद लें!',
      te: 'నమస్తే బాబూ! సైన్స్ పాఠ్యపుస్తకాలు, జామెట్రీ బాక్స్ కావాలా? కొత్త పుస్తకాలపై మొత్తం ఖర్చు చేయకుండా సెకండ్ హ్యాండ్ పుస్తకాలు ఎంచుకుని తెలివిగా ఆదా చేసుకోండి!',
    },
    dialogueSolved: {
      en: 'A wise student invests in knowledge, not flashy book covers! You saved a big chunk of pocket money for daily commute and exams.',
      hi: 'एक समझदार छात्र दिखावे के बजाय ज्ञान में निवेश करता है! आपने रोजमर्रा के खर्चों के लिए पैसे बचा लिए।',
      te: 'తెలివైన విద్యార్థి జ్ఞానంపై దృష్టి పెడతాడు. సెకండ్ హ్యాండ్ పుస్తకాలతో డబ్బు ఆదా చేసి భవిష్యత్ అవసరాలకు సిద్ధంగా ఉన్నారు.',
    },
  },
  {
    id: 'npc_student_friend',
    name: 'Kabir',
    role: 'Classmate & Friend',
    avatar: '🎒',
    x: 440,
    y: 365,
    cityId: 'city_hostel_commons',
    scenarioId: 'PB_003',
    dialogueIntro: {
      en: 'Hey buddy! A bunch of us are heading to that trendy cafe across town for ₹1,200 burgers and shakes. Are you coming along, or should we just chill here at the campus tea stall for ₹15 chai?',
      hi: 'अरे दोस्त! हम सब ₹1,200 वाले महंगे कैफे में बर्गर और शेक पार्टी के लिए जा रहे हैं। क्या तुम चल रहे हो, या यहीं चाय स्टाल पर ₹15 की चाय पिएं?',
      te: 'హేయ్ దోస్త్! మేమంతా ₹1,200 ఖరీదైన కేఫ్‌కి వెళ్తున్నాం. నువ్వు వస్తున్నావా, లేక మన క్యాంపస్ టీ స్టాల్‌లోనే కూర్చుని మాట్లాడుకుందామా?',
    },
    dialogueSolved: {
      en: 'You made the right call! Hanging out with friends is about conversations, not burning through next week\'s bus pass on overpriced food.',
      hi: 'बिल्कुल सही फैसला! दोस्तों के साथ समय बिताना जरूरी है, न कि अगले हफ्ते का किराया महंगे खाने पर लुटाना।',
      te: 'మంచి నిర్ణయం! స్నేహితులతో సరదాగా గడపడం ముఖ్యం, అనవసరమైన ఖర్చులతో బడ్జెట్ పాడుచేసుకోకూడదు.',
    },
  },
];

/**
 * Returns physical foot-aligned collision boxes for active NPCs.
 * Prevents player from phasing through NPCs while preserving 2.5D depth sorting and dialogue accessibility.
 */
export function getCity1NpcCollisionBoxes(npcs: NPC[] = CITY1_NPCS): CollisionBox[] {
  return npcs.map((npc) => ({
    name: `npc_foot_${npc.id}`,
    x: npc.x - 8,
    y: npc.y - 4,
    w: 16,
    h: 8,
  }));
}

// Interactive Objects & Environmental Discoveries
export const CITY1_INTERACTIVES: CityObject[] = [
  {
    id: 'kiosk_atm_passbook',
    type: 'kiosk',
    name: 'Savings Bank ATM & Passbook Kiosk',
    x: 925,
    y: 505,
    radius: 60,
    icon: 'Landmark',
    prompt: {
      en: 'Press [E] / Space to inspect Bank Account & ATM',
      hi: 'बैंक खाता और ATM जांचने के लिए [E] दबाएं',
      te: 'బ్యాంక్ ఖాతా మరియు ATM చూడటానికి [E] నొక్కండి',
    },
    title: {
      en: 'Collegiate Student Savings Kiosk',
      hi: 'कॉलेजिएट छात्र बचत कियोस्क',
      te: 'విద్యార్థి సేవింగ్స్ బ్యాంక్ కియోస్క్',
    },
    content: {
      en: 'State Bank of India — Zero-Balance Student Passbook\n• Monthly Stipend Credit: ₹5,000 (Credited on 1st)\n• Debit Card Protection: 2FA Active\n• Daily Withdrawal Limit: ₹2,000\n\nFinancial Tip: Never write your 4-digit ATM PIN on the back of your card or share it via SMS.',
      hi: 'भारतीय स्टेट बैंक — शून्य-शेष छात्र पासबुक\n• मासिक वजीफा क्रेडिट: ₹5,000\n• डेबिट कार्ड सुरक्षा: 2FA सक्रिय\n• वित्तीय सुझाव: अपने कार्ड पर कभी भी PIN न लिखें।',
      te: 'స్టేట్ బ్యాంక్ ఆఫ్ ఇండియా — జీరో-బాలెన్స్ విద్యార్థి పాస్‌బుక్\n• నెలవారీ స్టైపెండ్: ₹5,000\n• డెబిట్ కార్డ్ రక్షణ: 2FA యాక్టివ్\n• ముఖ్య గమనిక: ఏటీఎం పిన్ ఎవరితోనూ పంచుకోకండి.',
    },
    details: {
      category: 'Banking Basics',
      financialLesson: 'Zero-fee custodial accounts ensure you never pay monthly maintenance penalties while safeguarding your scholarship funds.',
      recommendedAction: 'Always request an SMS alert for debit transactions to instantly detect unauthorized charges.',
    },
  },
  {
    id: 'notice_scholarship_letter',
    type: 'collectible',
    name: 'Official Scholarship Notice Board',
    x: 185,
    y: 395,
    radius: 60,
    icon: 'FileText',
    prompt: {
      en: 'Press [E] / Space to read Scholarship Award Notice',
      hi: 'छात्रवृत्ति नोटिस पढ़ने के लिए [E] दबाएं',
      te: 'స్కాలర్‌షిప్ నోటీసు చదవడానికి [E] నొక్కండి',
    },
    title: {
      en: 'Hyderabad Directorate of Higher Education — Merit Stipend',
      hi: 'हैदराबाद उच्च शिक्षा निदेशालय — मेधावी वजीफा',
      te: 'హైదరాబాద్ ఉన్నత విద్యా మండలి — మెరిట్ స్టైపెండ్',
    },
    content: {
      en: 'OFFICIAL NOTIFICATION:\n"Awarded to Scholar for Academic Excellence.\nMonthly Grant: ₹5,000.\n\nMandatory Requirement:\nStudents residing in hostel commons must prioritize mess dues (₹2,500) to maintain accommodation eligibility.\n\nRecommended Rule of Thumb:\n• 50% Needs (₹2,500)\n• 20% Emergency Savings (₹1,000)\n• 30% Discretionary / Books (₹1,500)"',
      hi: 'आधिकारिक सूचना:\n"मेधावी छात्रवृत्ति: ₹5,000 प्रति माह।\nमेस शुल्क (₹2,500) अनिवार्य है।\n50-30-20 बजट नियम का पालन करें।"',
      te: 'అధికారిక ప్రకటన:\n"నెలకు ₹5,000 మెరిట్ స్కాలర్‌షిప్ మంజూరు చేయబడింది.\nహాస్టల్ మెస్ ఫీజు (₹2,500) ఖచ్చితంగా ముందుగా చెల్లించాలి.\n50-30-20 బడ్జెట్ నియమాన్ని పాటించండి."',
    },
    details: {
      category: 'Budgeting Pillar',
      financialLesson: 'The 50/30/20 budget framework divides take-home income into Needs, Wants, and Savings, preventing lifestyle inflation.',
    },
  },
  {
    id: 'board_canteen_budget',
    type: 'landmark',
    name: 'Canteen Expense Leakage Calculator',
    x: 310,
    y: 380,
    radius: 60,
    icon: 'Receipt',
    prompt: {
      en: 'Press [E] / Space to inspect Canteen Expense Board',
      hi: 'कैंटीन खर्च बोर्ड देखने के लिए [E] दबाएं',
      te: 'క్యాంటీన్ ఖర్చుల బోర్డు చూడటానికి [E] నొక్కండి',
    },
    title: {
      en: 'The "Small Leakages" Spending Board',
      hi: '"छोटे खर्च" बजट विश्लेषण बोर्ड',
      te: 'చిన్న ఖర్చుల బడ్జెట్ విశ్లేషణ బోర్డు',
    },
    content: {
      en: 'CAMPUS SPENDING TRACKER:\n• 1 Special Chai: ₹15/day = ₹450/month\n• 1 Plate Mirchi Bajji: ₹25/day = ₹750/month\n• Packaged Soda Bottle: ₹40/day = ₹1,200/month\n\nTOTAL UNTRACKED EXPENSES = ₹2,400 / month!\nThat is nearly 50% of your entire monthly stipend vanishing without awareness!',
      hi: 'कैंपस खर्च ट्रैकर:\n• रोजाना एक चाय और समोसा = ₹1,200/माह!\nयह आपके पूरे वजीफे का लगभग आधा हिस्सा बिना हिसाब-किताब के गायब कर देता है!',
      te: 'క్యాంపస్ ఖర్చుల విశ్లేషణ:\n• రోజూ చాయ్ మరియు స్నాక్స్ = నెలకు దాదాపు ₹1,200!\nఇది మీ మొత్తం స్టైపెండ్‌లో దాదాపు సగం. చిన్న ఖర్చులను ఎప్పటికప్పుడు గమనించండి!',
    },
    details: {
      category: 'Discretionary Leakages',
      financialLesson: 'Micro-transactions add up exponentially over 30 days. Tracking them turns budget leaks into compounding savings.',
    },
  },
  {
    id: 'portal_city2_exit',
    type: 'portal',
    name: 'North Highway: Road to City 2',
    x: 685,
    y: 30,
    radius: 60,
    icon: 'Compass',
    prompt: {
      en: 'Press [E] / Space to travel to City 2 (Academic Bazaar)',
      hi: 'सिटी 2 (एकेडमिक बाजार) जाने के लिए [E] दबाएं',
      te: 'సిటీ 2 (అకాడమిక్ బజార్) వెళ్ళడానికి [E] నొక్కండి',
    },
    title: {
      en: 'Road to City 2: The Academic Bazaar',
      hi: 'सिटी 2 की राह: एकेडमिक बाजार',
      te: 'సిటీ 2 మార్గం: అకాడమిక్ బజార్',
    },
    content: {
      en: 'Gateway to City 2 (The Academic Bazaar — Koti Book Market).\n\nHere you will learn how to navigate textbook discounts, secondhand materials, and peer pressure while outfitting your scholastic journey.',
      hi: 'सिटी 2 का प्रवेश द्वार: यहां आप पुरानी किताबों और स्टेशनरी की स्मार्ट खरीदारी सीखेंगे।',
      te: 'సిటీ 2 ప్రవేశ ద్వారం: ఇక్కడ మీరు పాఠ్యపుస్తకాలు మరియు విద్య సామగ్రి కొనుగోలులో తెలివైన బడ్జెట్ నేర్చుకుంటారు.',
    },
    details: {
      category: 'World Transition',
      financialLesson: 'Each city in the Scholar\'s District unlocks a critical survival skill. Master your hostel dues before venturing into market shopping.',
    },
  },
];
