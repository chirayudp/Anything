import { NPC } from '../../types';
import { CollisionBox, CityObject, CityMapConfig, CollisionGrid } from './city1Data';

export const CITY3_CONFIG: CityMapConfig = {
  id: 'city_investment_valley',
  name: 'Investment Valley (City 3)',
  regionId: 'region_investment_district',
  pillar: 'Understand Investing (Simulations)',
  width: 1024,
  height: 572,
  spawnPoint: {
    x: 75,
    y: 265,
    direction: 'right',
  },
};

// 2.5D Foot-Aligned Physical Collision Geometry for City 3 (Investment Valley)
export const CITY3_COLLISION_BOXES: CollisionBox[] = [
  // 1. Perimeter Boundaries (START road open at x:0..100, y:245..290 | EXIT open near river x:960+)
  { name: 'boundary_top', x: 0, y: 0, w: 1024, h: 16 },
  { name: 'boundary_west_top', x: 0, y: 0, w: 10, h: 245 },
  { name: 'boundary_west_bottom', x: 0, y: 290, w: 10, h: 282 },
  { name: 'boundary_east', x: 1014, y: 0, w: 10, h: 572 },
  { name: 'boundary_bottom', x: 0, y: 562, w: 1024, h: 10 },

  // 2. School Science Garden (top-left, crop beds)
  { name: 'garden_fence_north', x: 10, y: 16, w: 310, h: 8 },
  { name: 'garden_fence_west', x: 10, y: 16, w: 8, h: 200 },
  { name: 'garden_crop_bed_1', x: 30, y: 45, w: 75, h: 50 },
  { name: 'garden_crop_bed_2', x: 115, y: 45, w: 75, h: 50 },
  { name: 'garden_crop_bed_3', x: 200, y: 45, w: 75, h: 50 },
  { name: 'garden_crop_bed_4', x: 30, y: 115, w: 75, h: 50 },
  { name: 'garden_crop_bed_5', x: 115, y: 115, w: 75, h: 50 },
  { name: 'garden_crop_bed_6', x: 200, y: 115, w: 75, h: 50 },
  { name: 'garden_tree_se', x: 270, y: 165, w: 50, h: 50 },

  // 3. School Science Building (top-left-center)
  { name: 'school_building_main', x: 280, y: 20, w: 170, h: 120 },
  { name: 'school_tree_west', x: 240, y: 105, w: 40, h: 45 },
  { name: 'school_tree_east', x: 450, y: 30, w: 40, h: 55 },
  { name: 'school_bench', x: 370, y: 155, w: 65, h: 18 },

  // 4. Economics Club Room (top-center)
  { name: 'econ_club_building', x: 490, y: 16, w: 215, h: 145 },
  { name: 'econ_club_bulletin', x: 570, y: 155, w: 55, h: 20 },
  { name: 'econ_tree_east', x: 700, y: 20, w: 42, h: 55 },

  // 5. Career Guidance Office (top-right)
  { name: 'career_office_building', x: 800, y: 16, w: 200, h: 115 },
  { name: 'career_signboard', x: 830, y: 120, w: 60, h: 22 },
  { name: 'career_tree_north', x: 750, y: 20, w: 40, h: 50 },
  { name: 'career_tree_south', x: 760, y: 175, w: 40, h: 45 },

  // 6. Central North-South Road divider trees
  { name: 'road_tree_nw', x: 340, y: 215, w: 42, h: 50 },

  // 7. Residential SW Building
  { name: 'sw_house_main', x: 50, y: 330, w: 190, h: 130 },
  { name: 'sw_house_tree_east', x: 190, y: 310, w: 40, h: 40 },
  { name: 'sw_fence', x: 50, y: 460, w: 190, h: 14 },
  { name: 'sw_garden_lawn', x: 50, y: 474, w: 190, h: 88 },

  // 8. Indian Town Grocery Market (center)
  { name: 'market_building', x: 375, y: 310, w: 310, h: 130 },
  { name: 'market_bottom_building', x: 375, y: 520, w: 310, h: 52 },

  // 9. River Boat Dock area (right side)
  { name: 'dock_shed', x: 700, y: 320, w: 70, h: 105 },
  { name: 'dock_warehouse_goods', x: 765, y: 485, w: 60, h: 55 },
  { name: 'dock_river_water', x: 920, y: 280, w: 104, h: 292 },

  // 10. Riverside forest / tree line
  { name: 'river_forest_north', x: 865, y: 16, w: 159, h: 250 },

  // 11. START sign
  { name: 'sign_start', x: 0, y: 248, w: 40, h: 22 },

  // 12. EXIT sign near dock
  { name: 'sign_exit', x: 890, y: 475, w: 25, h: 20 },
];

export const CITY3_COLLISION_GRID_TILE_SIZE = 8;
export const CITY3_COLLISION_GRID_COLS = Math.ceil(CITY3_CONFIG.width / CITY3_COLLISION_GRID_TILE_SIZE); // 128
export const CITY3_COLLISION_GRID_ROWS = Math.ceil(CITY3_CONFIG.height / CITY3_COLLISION_GRID_TILE_SIZE); // 72

export function createCity3CollisionGrid(boxes: CollisionBox[]): CollisionGrid {
  const cells = new Uint8Array(CITY3_COLLISION_GRID_COLS * CITY3_COLLISION_GRID_ROWS);

  boxes.forEach((box) => {
    const colStart = Math.max(0, Math.floor(box.x / CITY3_COLLISION_GRID_TILE_SIZE));
    const colEnd = Math.min(CITY3_COLLISION_GRID_COLS - 1, Math.floor((box.x + box.w - 1) / CITY3_COLLISION_GRID_TILE_SIZE));
    const rowStart = Math.max(0, Math.floor(box.y / CITY3_COLLISION_GRID_TILE_SIZE));
    const rowEnd = Math.min(CITY3_COLLISION_GRID_ROWS - 1, Math.floor((box.y + box.h - 1) / CITY3_COLLISION_GRID_TILE_SIZE));

    for (let r = rowStart; r <= rowEnd; r++) {
      for (let c = colStart; c <= colEnd; c++) {
        cells[r * CITY3_COLLISION_GRID_COLS + c] = 1;
      }
    }
  });

  return {
    tileSize: CITY3_COLLISION_GRID_TILE_SIZE,
    cols: CITY3_COLLISION_GRID_COLS,
    rows: CITY3_COLLISION_GRID_ROWS,
    cells,
  };
}

export const CITY3_COLLISION_GRID = createCity3CollisionGrid(CITY3_COLLISION_BOXES);

// NPCs in City 3 (Investment Valley)
export const CITY3_NPCS: NPC[] = [
  {
    id: 'npc_mali_kaka',
    name: 'Mali Kaka',
    role: 'Campus Gardener',
    avatar: '🌱',
    x: 175,
    y: 205,
    cityId: 'city_investment_valley',
    direction: 'down',
    scenarioId: 'scenario_inv_001_two_plants',
    dialogueIntro: {
      en: "Namaste, young one! I am Mali Kaka, the campus gardener. Come, I have 10 magical tokens for you. Will you plant them in the Steady Plant (safe) or the Wild Flower (growth)? Remember, the Golden Rule: only invest money you won't need for at least 3 years!",
      hi: 'नमस्ते! मैं माली काका हूं। देखो, मेरे पास तुम्हारे लिए 10 जादुई टोकन हैं। क्या तुम स्थिर पौधे (सुरक्षित) में लगाओगे या जंगली फूल (विकास) में? याद रखो: केवल वही पैसे निवेश करो जो 3 साल तक नहीं चाहिए!',
      te: 'నమస్తే! నేను మాలి కాకా, క్యాంపస్ తోటమాలి. చూడు, నీ కోసం 10 మాయా టోకెన్లు ఉన్నాయి. స్టెడీ ప్లాంట్‌లో (సురక్షితం) వేస్తావా, వైల్డ్ ఫ్లవర్‌లో (వృద్ధి) వేస్తావా? సువర్ణ నియమం: కనీసం 3 సంవత్సరాలు అవసరం లేని డబ్బు మాత్రమే పెట్టుబడి పెట్టు!',
    },
    dialogueSolved: {
      en: "Waah! You have the wisdom of a true farmer-investor! Your careful planting has grown a beautiful harvest. Remember the Mango Tree Story: patience and balance between safe and growing investments is the golden path!",
      hi: 'वाह! तुममें सच्चे किसान-निवेशक की समझ है! धैर्य और संतुलन ही सफल निवेश की कुंजी है। आम के पेड़ की कहानी याद रखना!',
      te: 'వాహ్! నీలో నిజమైన రైతు-పెట్టుబడిదారు తెలివి ఉంది! సురక్షితం మరియు వృద్ధి మధ్య సమతుల్యత మరియు ఓర్పే విజయం. మామిడి చెట్టు కథ గుర్తుంచుకో!',
    },
  },
  {
    id: 'npc_boat_master_kabir',
    name: 'Boat Master Kabir',
    role: 'River Boat Dock Manager',
    avatar: '⛵',
    x: 820,
    y: 430,
    cityId: 'city_investment_valley',
    direction: 'down',
    scenarioId: 'scenario_inv_002_cargo_boat',
    dialogueIntro: {
      en: "Aho! I am Boat Master Kabir. You have 6 bags of study grain to send across the river. Three boats await: a Wooden Canoe, a Motor Launch, and a Ferry. How will you load them? Remember — don't put all your eggs in one basket!",
      hi: 'अरे! मैं नाविक कबीर हूं। तुम्हारे पास 6 बोरे अनाज हैं जो नदी पार भेजने हैं। तीन नावें हैं: लकड़ी की डोंगी, मोटर बोट और फेरी। कैसे लादोगे? याद रखो — सारे अंडे एक टोकरी में मत रखो!',
      te: 'అహో! నేను పడవ మాస్టర్ కబీర్. నీకు నది దాటించాల్సిన 6 సంచులు ఉన్నాయి. మూడు పడవలు సిద్ధంగా ఉన్నాయి: చెక్క పడవ, మోటారు లాంచ్, ఫెర్రీ. ఎలా లోడ్ చేస్తావు? గుర్తుంచుకో — అన్ని గుడ్లు ఒకే బుట్టలో వేయకు!',
    },
    dialogueSolved: {
      en: "Masterful diversification! By spreading cargo across boats, you protected your harvest even when one canoe hit the rapids. A true trading wisdom — never concentrate all your wealth in a single investment!",
      hi: 'शानदार विविधीकरण! नावों में बराबर बंटवारा करके तुमने अपना अनाज बचाया। सच्ची व्यापारिक बुद्धिमत्ता — कभी भी सब कुछ एक जगह मत लगाओ!',
      te: 'అద్భుతమైన వైవిధ్యం! పడవలలో సమానంగా పంచడం ద్వారా నీ సరుకును కాపాడావు. నిజమైన వ్యాపార జ్ఞానం — ఎప్పుడూ అన్నీ ఒకచోట పెట్టకు!',
    },
  },
  {
    id: 'npc_meera_club_president',
    name: 'Club President Meera',
    role: 'Economics Club President',
    avatar: '📊',
    x: 600,
    y: 185,
    cityId: 'city_investment_valley',
    direction: 'down',
    scenarioId: 'scenario_inv_003_market_panic',
    dialogueIntro: {
      en: "Welcome to the Economics Club! I am President Meera. Today's simulation: your investment shows a -12% loss on the screen. Your classmates are selling in panic. What will you do? Remember our golden rule: never make decisions based on market panic!",
      hi: 'इकोनॉमिक्स क्लब में आपका स्वागत है! मैं प्रेसिडेंट मीरा हूं। आज की सिमुलेशन: आपके निवेश में -12% का नुकसान दिख रहा है। सहपाठी डर से बेच रहे हैं। क्या करेंगे? याद रखें: घबराहट में कभी निर्णय मत लो!',
      te: 'ఎకనామిక్స్ క్లబ్‌కు స్వాగతం! నేను ప్రెసిడెంట్ మీరా. ఈ రోజు సిమ్యులేషన్: నీ పెట్టుబడి -12% నష్టం చూపిస్తోంది. సహాధ్యాయులు భయంతో అమ్ముతున్నారు. ఏం చేస్తావు? గుర్తుంచుకో: పానిక్‌లో నిర్ణయాలు తీసుకోకు!',
    },
    dialogueSolved: {
      en: "Excellent emotional discipline! You stayed calm while others panicked and sold low. Short-term market dips are normal. Patient investors who hold quality assets through temporary storms always come out ahead in the long run!",
      hi: 'उत्कृष्ट धैर्य! जब दूसरे घबराकर बेच रहे थे, तुम शांत रहे। बाजार में अस्थायी गिरावट सामान्य है। धैर्यवान निवेशक हमेशा आगे निकलते हैं!',
      te: 'అద్భుతమైన మానసిక నిగ్రహం! ఇతరులు భయంతో అమ్మేటప్పుడు నువ్వు నిశ్చలంగా ఉన్నావు. మార్కెట్ తాత్కాలిక పతనాలు సాధారణం. ఓర్పుగల పెట్టుబడిదారులే ఎప్పుడూ ముందుంటారు!',
    },
  },
  {
    id: 'npc_uncle_karim',
    name: 'Uncle Karim',
    role: 'Indian Town Grocery Shop Owner',
    avatar: '🛒',
    x: 530,
    y: 460,
    cityId: 'city_investment_valley',
    direction: 'down',
    scenarioId: 'scenario_inv_004_grocery_budget',
    dialogueIntro: {
      en: "Welcome to my grocery shop! I am Uncle Karim. My business needs to decide between buying goods wholesale now (investing upfront) or buying retail daily (spending as needed). Each choice has a cost and a risk. What would you advise me to do to maximize my profits wisely?",
      hi: 'मेरी किराना दुकान में आपका स्वागत है! मैं करीम चाचा हूं। मुझे फैसला करना है: थोक में सामान खरीदूं (अग्रिम निवेश) या रोज खुदरा में (जरूरत पर खर्च)। हर विकल्प की लागत और जोखिम है। मुझे क्या सलाह देंगे?',
      te: 'నా కిరాణా దుకాణానికి స్వాగతం! నేను అంకుల్ కరీమ్. నాకు ఒక నిర్ణయం తీసుకోవాలి: థోకు ధరకు ముందే కొనాలా (పెట్టుబడి) లేదా రోజూ రిటైల్‌లో కొనాలా (అవసరానికి ఖర్చు). ప్రతి ఎంపికకు ఖర్చు, రిస్క్ ఉంది. ఏం సలహా ఇస్తావు?',
    },
    dialogueSolved: {
      en: "Bahut shukriya! Your practical advice helped my shop maximize profits while managing risk wisely. Smart investing means timing, diversification, and always keeping enough cash for daily needs. My business will thrive with your wisdom!",
      hi: 'बहुत शुक्रिया! तुम्हारी व्यावहारिक सलाह से मेरी दुकान को लाभ मिलेगा। स्मार्ट निवेश का मतलब है सही समय, विविधीकरण और दैनिक जरूरतों के लिए पैसे बचाना!',
      te: 'చాలా ధన్యవాదాలు! నీ ఆచరణాత్మక సలహా నా దుకాణాన్ని లాభంలో ఉంచింది. స్మార్ట్ పెట్టుబడి అంటే సరైన సమయం, వైవిధ్యం మరియు రోజువారీ అవసరాలకు పొదుపు!',
    },
  },
  {
    id: 'npc_counselor_deepa',
    name: 'Counselor Deepa',
    role: 'Career Guidance Counselor',
    avatar: '🎯',
    x: 880,
    y: 165,
    cityId: 'city_investment_valley',
    direction: 'down',
    scenarioId: 'scenario_inv_005_career_invest',
    dialogueIntro: {
      en: "Hello! I am Counselor Deepa from the Career Guidance Office. Today we discuss investing in yourself! You have ₹10,000 in scholarship funds. Will you invest in a professional certification, put it all in savings, or use it for a flashy new gadget? Your future earnings depend on this choice!",
      hi: 'नमस्ते! मैं दीपा काउंसलर हूं, करियर गाइडेंस ऑफिस से। आज हम खुद में निवेश की बात करते हैं! तुम्हारे पास ₹10,000 की छात्रवृत्ति है। क्या पेशेवर प्रमाणपत्र लेंगे, बचत करेंगे, या नई गैजेट खरीदेंगे? भविष्य की कमाई इस निर्णय पर निर्भर है!',
      te: 'హలో! నేను కౌన్సెలర్ దీపా, కెరీర్ గైడెన్స్ ఆఫీస్ నుండి. ఈ రోజు మనం మనలోనే పెట్టుబడి గురించి మాట్లాడుదాం! నీ దగ్గర ₹10,000 స్కాలర్‌షిప్ ఉంది. ప్రొఫెషనల్ సర్టిఫికేషన్ తీసుకుంటావా, పొదుపు చేస్తావా, లేదా నూతన గాడ్జెట్ కొంటావా? నీ భవిష్యత్ సంపాదన ఈ నిర్ణయంపై ఆధారపడి ఉంది!',
    },
    dialogueSolved: {
      en: "Wonderful decision! Investing in your skills and knowledge yields the highest lifetime returns. Education is the one investment that can never be taken away from you. Your certified skills will compound your career growth year after year!",
      hi: 'शानदार निर्णय! अपने कौशल और ज्ञान में निवेश सबसे अधिक जीवनकाल रिटर्न देता है। शिक्षा एकमात्र ऐसा निवेश है जो कभी नहीं छीना जा सकता। प्रमाणित कौशल आपके करियर में चक्रवृद्धि वृद्धि लाएंगे!',
      te: 'అద్భుతమైన నిర్ణయం! నీ నైపుణ్యాలు మరియు జ్ఞానంలో పెట్టుబడి పెట్టడం అత్యధిక జీవితకాల రాబడిని ఇస్తుంది. విద్య ఎప్పటికీ తీసుకోలేని పెట్టుబడి. సర్టిఫైడ్ స్కిల్స్ నీ కెరీర్‌ను సంవత్సరాల తరబడి వృద్ధి చేస్తాయి!',
    },
  },
];

export function getCity3NpcCollisionBoxes(npcs: NPC[] = CITY3_NPCS): CollisionBox[] {
  return npcs.map((npc) => ({
    name: `npc_foot_${npc.id}`,
    x: npc.x - 8,
    y: npc.y - 4,
    w: 16,
    h: 8,
  }));
}

// Interactive Objects & Portals in City 3
export const CITY3_INTERACTIVES: CityObject[] = [
  {
    id: 'portal_city2_return',
    type: 'portal',
    name: 'West Gate: Road back to City 2 (Academic Bazaar)',
    x: 75,
    y: 265,
    radius: 65,
    icon: 'Compass',
    prompt: {
      en: 'Press [E] / Space to return to City 2 (Academic Bazaar)',
      hi: 'सिटी 2 (एकेडमिक बाजार) वापस जाने के लिए [E] दबाएं',
      te: 'సిటీ 2 (అకాడమిక్ బజార్)కి తిరిగి వెళ్ళడానికి [E] నొక్కండి',
    },
    title: {
      en: 'West Road: Return to Academic Bazaar',
      hi: 'पश्चिम सड़क: एकेडमिक बाजार वापसी',
      te: 'పశ్చిమ రహదారి: అకాడమిక్ బజార్‌కు తిరుగు ప్రయాణం',
    },
    content: {
      en: 'Path back to City 2 (Academic Bazaar).\n\nReturn to practice market bargaining, postal savings, and campus repair budgeting.',
      hi: 'सिटी 2 (एकेडमिक बाजार) वापसी का रास्ता। बाजार में सौदेबाजी और डाकघर बचत का अभ्यास करने के लिए वापस जाएं।',
      te: 'సిటీ 2 (అకాడమిక్ బజార్) మార్గం. మార్కెట్ బేరాలు, పోస్టల్ పొదుపు సాధన చేయడానికి తిరిగి వెళ్ళండి.',
    },
    details: {
      category: 'World Navigation',
      financialLesson: 'You can navigate freely between explored cities to review past lessons and practice financial mastery.',
      recommendedAction: 'Travel to City 2',
    },
  },
  {
    id: 'portal_city4_exit',
    type: 'portal',
    name: 'River Exit: Road to City 4',
    x: 860,
    y: 500,
    radius: 60,
    icon: 'Compass',
    prompt: {
      en: 'Press [E] / Space to travel to City 4',
      hi: 'सिटी 4 की ओर जाने के लिए [E] दबाएं',
      te: 'సిటీ 4 వెళ్ళడానికి [E] నొక్కండి',
    },
    title: {
      en: 'River Road: Gateway to City 4',
      hi: 'नदी मार्ग: सिटी 4 का प्रवेश द्वार',
      te: 'నది మార్గం: సిటీ 4 ప్రవేశ ద్వారం',
    },
    content: {
      en: 'Gateway to City 4.\n\nMaster all 5 investment simulations before crossing the river to your next financial challenge.',
      hi: 'सिटी 4 का प्रवेश द्वार। नदी पार करने से पहले 5 निवेश सिमुलेशन पूरे करें।',
      te: 'సిటీ 4 ప్రవేశ ద్వారం. నదిని దాటే ముందు 5 పెట్టుబడి సిమ్యులేషన్‌లు పూర్తి చేయండి.',
    },
    details: {
      category: 'World Transition',
      financialLesson: 'Complete all investment valley challenges before advancing to the next financial district.',
    },
  },
  {
    id: 'landmark_mango_tree_story',
    type: 'landmark',
    name: 'The Mango Tree — Idea Card',
    x: 200,
    y: 230,
    radius: 60,
    icon: 'Landmark',
    prompt: {
      en: 'Press [E] / Space to read The Mango Tree Story',
      hi: 'आम के पेड़ की कहानी पढ़ने के लिए [E] दबाएं',
      te: 'మామిడి చెట్టు కథ చదవడానికి [E] నొక్కండి',
    },
    title: {
      en: 'The Mango Tree Story — Idea Card',
      hi: 'आम के पेड़ की कहानी — आइडिया कार्ड',
      te: 'మామిడి చెట్టు కథ — ఆదర్శ పత్రం',
    },
    content: {
      en: '🍋 Safe Savings (Fixed Growth):\nLike a sturdy lemon tree. It gives a few lemons every week without fail.\n\n🥭 Growing Investment (Variable Growth):\nLike a mango tree. In good years it gives lots of sweet fruit, but in bad weather it may give very few.\n\n⭐ Golden Rule:\nOnly invest money that you will NOT need for daily life for at least 3 years. Keep your emergency cash completely safe!',
      hi: '🍋 सुरक्षित बचत: नींबू के पेड़ जैसी — हर हफ्ते कुछ न कुछ जरूर मिलता है।\n\n🥭 बढ़ता निवेश: आम के पेड़ जैसा — अच्छे साल ढेर सारे फल, लेकिन मुसीबत में कम।\n\n⭐ सुनहरा नियम: केवल वही पैसे लगाएं जो कम से कम 3 साल नहीं चाहिए!',
      te: '🍋 సురక్షిత పొదుపు: నిమ్మ చెట్టు లాంటిది — ప్రతి వారం కొంత ఫలం.\n\n🥭 వృద్ధి పెట్టుబడి: మామిడి చెట్టు లాంటిది — మంచి సంవత్సరాల్లో చాలా ఫలాలు, చెడు వాతావరణంలో తక్కువ.\n\n⭐ సువర్ణ నియమం: కనీసం 3 సంవత్సరాలు అవసరం లేని డబ్బు మాత్రమే పెట్టుబడి పెట్టు!',
    },
    details: {
      category: 'Investment Wisdom',
      financialLesson: 'Diversifying between safe and growth assets protects capital while enabling long-term wealth building.',
    },
  },
  {
    id: 'kiosk_river_trade_market',
    type: 'kiosk',
    name: 'River Trade Market Notice Board',
    x: 810,
    y: 460,
    radius: 60,
    icon: 'MapPin',
    prompt: {
      en: 'Press [E] / Space to read Trade Market Notice Board',
      hi: 'व्यापार बाजार की सूचना पढ़ने के लिए [E] दबाएं',
      te: 'వ్యాపార మార్కెట్ నోటీసు చదవడానికి [E] నొక్కండి',
    },
    title: {
      en: 'River Trade Market — Investment Rules Board',
      hi: 'नदी व्यापार बाजार — निवेश नियम पट्टिका',
      te: 'నది వ్యాపార మార్కెట్ — పెట్టుబడి నిబంధనలు',
    },
    content: {
      en: 'River Trade Market Rules:\n• Diversify your cargo across multiple boats\n• Never carry more than you can afford to lose\n• Inspect goods before investing your grain\n• Emergency reserve: Always keep 20% of cargo safe\n• Time your trades: wait for calm weather',
      hi: 'नदी व्यापार नियम: अपना माल अलग-अलग नावों में बांटो। कभी उससे अधिक मत लगाओ जितना खो सकते हो। 20% माल हमेशा सुरक्षित रखो।',
      te: 'నది వ్యాపార నిబంధనలు: నీ సరుకును వేర్వేరు పడవలలో పంచు. పోగొట్టుకోలేనిది ఎప్పుడూ పెట్టకు. 20% సరుకు ఎప్పుడూ సురక్షితంగా ఉంచు.',
    },
    details: {
      category: 'Diversification',
      financialLesson: "Spreading investments across multiple assets limits the damage from any single investment's failure.",
    },
  },
];
