import { NPC } from '../../types';
import { CollisionBox, CityObject, CityMapConfig, CollisionGrid } from './city1Data';

export const CITY2_CONFIG: CityMapConfig = {
  id: 'city_academic_bazaar',
  name: 'Academic Bazaar (City 2)',
  regionId: 'region_scholars_district',
  pillar: 'Smart Sourcing & Market Budgeting',
  width: 1024,
  height: 559,
  spawnPoint: {
    x: 60,
    y: 455,
    direction: 'right',
  },
};

// 2.5D Foot-Aligned Physical Collision Geometry for City 2 (Academic Bazaar)
export const CITY2_COLLISION_BOXES: CollisionBox[] = [
  // 1. Perimeter Boundaries (Leaves START road open at x: 0..75, y: 430..475 and EXIT open at x: 1014, y: 460..515)
  { name: 'boundary_top', x: 0, y: 0, w: 1024, h: 16 },
  { name: 'boundary_west_top', x: 0, y: 0, w: 10, h: 430 },
  { name: 'boundary_west_bottom', x: 0, y: 475, w: 10, h: 84 },
  { name: 'boundary_east_top', x: 1014, y: 0, w: 10, h: 455 },
  { name: 'boundary_east_bottom', x: 1014, y: 520, w: 10, h: 39 },
  { name: 'boundary_bottom', x: 0, y: 550, w: 1024, h: 10 },

  // 2. NW Park & Forest (Solid dense tree thickets)
  { name: 'nw_park_woods', x: 0, y: 16, w: 310, h: 105 },

  // 3. Mid-Left Fish/Goods Stall & Shops Foundation
  { name: 'stall_goods_fish', x: 0, y: 135, w: 115, h: 75 },
  { name: 'shop_left_foundation', x: 120, y: 130, w: 75, h: 75 },
  { name: 'shop_mid_foundation', x: 200, y: 130, w: 80, h: 75 },
  { name: 'shop_corner_lamp', x: 288, y: 200, w: 12, h: 16 },

  // 4. Central Festival Plaza & Bazaar (Perimeter walls and interior obstacles)
  // Perimeter fences (leaves south entrance at x: 490..525 open, north path at x: 490..520 open)
  { name: 'plaza_fence_west', x: 375, y: 35, w: 8, h: 185 },
  { name: 'plaza_fence_east', x: 622, y: 35, w: 8, h: 185 },
  { name: 'plaza_fence_south_left', x: 380, y: 215, w: 110, h: 12 },
  { name: 'plaza_fence_south_right', x: 525, y: 215, w: 100, h: 12 },
  { name: 'plaza_fence_north_left', x: 380, y: 35, w: 110, h: 10 },
  { name: 'plaza_fence_north_right', x: 520, y: 35, w: 105, h: 10 },
  // Stalls, fountain, banner, and trees inside the plaza
  { name: 'plaza_fountain_base', x: 472, y: 115, w: 50, h: 35 },
  { name: 'plaza_stall_left_fruit', x: 422, y: 65, w: 45, h: 40 },
  { name: 'plaza_stall_right_snack', x: 512, y: 65, w: 45, h: 40 },
  { name: 'plaza_stall_bottom_tent', x: 545, y: 165, w: 45, h: 35 },
  { name: 'plaza_flagpole_banner', x: 390, y: 148, w: 40, h: 22 },
  { name: 'plaza_tree_south_west', x: 382, y: 188, w: 42, h: 30 },
  { name: 'plaza_tree_south_east', x: 578, y: 188, w: 42, h: 30 },

  // 5. University Hall & Courtyard (NE)
  // Building foundation (roof is non-solid for 2.5D visual overlap)
  { name: 'university_main_building', x: 635, y: 30, w: 360, h: 155 },
  { name: 'university_wall_west', x: 625, y: 30, w: 10, h: 275 },
  // Courtyard south brick walls (leaves iron gate corridor at x: 792..840 open)
  { name: 'university_wall_south_left', x: 625, y: 300, w: 167, h: 16 },
  { name: 'university_wall_south_right', x: 840, y: 300, w: 175, h: 16 },
  // Courtyard inner objects
  { name: 'university_statue_base', x: 700, y: 225, w: 25, h: 20 },
  { name: 'university_bench_north', x: 668, y: 195, w: 82, h: 15 },
  { name: 'university_bench_west', x: 650, y: 225, w: 15, h: 40 },
  { name: 'university_bench_east', x: 755, y: 225, w: 15, h: 40 },
  { name: 'university_bench_south_left', x: 668, y: 265, w: 38, h: 15 },
  { name: 'university_bench_south_right', x: 715, y: 265, w: 38, h: 15 },
  { name: 'university_flagpole', x: 808, y: 248, w: 14, h: 16 },
  { name: 'university_chalkboard', x: 672, y: 185, w: 58, h: 15 },
  { name: 'university_bulletin_board', x: 892, y: 185, w: 58, h: 15 },

  // 6. Logistics / Post Office Building (Center)
  { name: 'planter_north_post_office', x: 538, y: 228, w: 68, h: 42 },
  { name: 'post_office_building', x: 512, y: 275, w: 96, h: 102 },
  { name: 'post_office_boxes_west', x: 495, y: 350, w: 17, h: 45 },
  { name: 'post_office_trolley_front', x: 560, y: 378, w: 35, h: 20 },
  { name: 'post_office_bench_left', x: 520, y: 408, w: 40, h: 16 },
  { name: 'post_office_bench_right', x: 575, y: 408, w: 40, h: 16 },

  // 7. South-West Complex (Residential, Bike Racks & Storefront)
  { name: 'bike_parking_rack', x: 95, y: 310, w: 65, h: 105 },
  { name: 'shop_striped_awning', x: 165, y: 300, w: 80, h: 85 },
  { name: 'parked_scooter', x: 200, y: 395, w: 45, h: 22 },
  { name: 'residence_tile_roof', x: 260, y: 320, w: 115, h: 105 },
  { name: 'clothesline_laundry', x: 265, y: 285, w: 70, h: 28 },
  { name: 'tree_complex_west', x: 110, y: 265, w: 45, h: 45 },
  { name: 'tree_complex_mid', x: 238, y: 265, w: 38, h: 45 },
  { name: 'tree_complex_east', x: 335, y: 265, w: 45, h: 45 },
  { name: 'bulletin_board_complex', x: 375, y: 415, w: 35, h: 25 },

  // 8. Lawns & Parks
  { name: 'sw_garden_lawn', x: 88, y: 485, w: 342, h: 70 },
  { name: 'se_park_lawn_west', x: 630, y: 320, w: 160, h: 140 },
  { name: 'se_park_lawn_east', x: 845, y: 320, w: 170, h: 140 },

  // 9. South Roadside Barrier & Planter along EXIT road
  { name: 'south_road_barrier', x: 480, y: 518, w: 544, h: 36 },

  // 10. Signposts
  { name: 'sign_start', x: 0, y: 435, w: 35, h: 25 },
  { name: 'sign_exit', x: 955, y: 510, w: 35, h: 20 },
];

export const CITY2_COLLISION_GRID_TILE_SIZE = 8;
export const CITY2_COLLISION_GRID_COLS = Math.ceil(CITY2_CONFIG.width / CITY2_COLLISION_GRID_TILE_SIZE); // 128
export const CITY2_COLLISION_GRID_ROWS = Math.ceil(CITY2_CONFIG.height / CITY2_COLLISION_GRID_TILE_SIZE); // 70

export function createCity2CollisionGrid(boxes: CollisionBox[]): CollisionGrid {
  const cells = new Uint8Array(CITY2_COLLISION_GRID_COLS * CITY2_COLLISION_GRID_ROWS);

  boxes.forEach((box) => {
    const colStart = Math.max(0, Math.floor(box.x / CITY2_COLLISION_GRID_TILE_SIZE));
    const colEnd = Math.min(CITY2_COLLISION_GRID_COLS - 1, Math.floor((box.x + box.w - 1) / CITY2_COLLISION_GRID_TILE_SIZE));
    const rowStart = Math.max(0, Math.floor(box.y / CITY2_COLLISION_GRID_TILE_SIZE));
    const rowEnd = Math.min(CITY2_COLLISION_GRID_ROWS - 1, Math.floor((box.y + box.h - 1) / CITY2_COLLISION_GRID_TILE_SIZE));

    for (let r = rowStart; r <= rowEnd; r++) {
      for (let c = colStart; c <= colEnd; c++) {
        cells[r * CITY2_COLLISION_GRID_COLS + c] = 1;
      }
    }
  });

  return {
    tileSize: CITY2_COLLISION_GRID_TILE_SIZE,
    cols: CITY2_COLLISION_GRID_COLS,
    rows: CITY2_COLLISION_GRID_ROWS,
    cells,
  };
}

export const CITY2_COLLISION_GRID = createCity2CollisionGrid(CITY2_COLLISION_BOXES);

// NPCs in City 2 (Academic Bazaar)
export const CITY2_NPCS: NPC[] = [
  {
    id: 'npc_cycle_mechanic',
    name: 'Cycle Mechanic Murthy',
    role: 'Campus Express Repair Specialist',
    avatar: '🔧',
    x: 180,
    y: 405,
    cityId: 'city_academic_bazaar',
    direction: 'down',
    scenarioId: 'scenario_cycle_repair',
    dialogueIntro: {
      en: "Namaste student! Did your bicycle chain snap or tyre get punctured on the way to morning exams? Don't worry, I can do an express repair for ₹150. Whatever you do, don't fall for that shady street lending poster promising quick cash at 50% weekly interest!",
      hi: 'नमस्ते विद्यार्थी! क्या परीक्षा के रास्ते में आपकी साइकिल की चेन टूट गई या टायर पंचर हो गया? चिंता न करें, मैं ₹150 में तुरंत ठीक कर दूंगा। बस उस 50% साप्ताहिक ब्याज वाले अवैध लोन के चक्कर में मत पड़ना!',
      te: 'నమస్తే విద్యార్థీ! పరీక్షకు వెళ్తుండగా సైకిల్ చైన్ ఊడిందా లేక పంచర్ అయిందా? కంగారు పడకండి, ₹150తో వెంటనే బాగు చేస్తాను. రోడ్డు పక్కన 50% వడ్డీకి అప్పు ఇస్తామనే మోసగాళ్ల వలలో పడకండి!',
    },
    dialogueSolved: {
      en: 'Your cycle is fully tuned and rolling smooth! Great job paying from your transport savings rather than getting tangled in loan shark traps.',
      hi: 'आपकी साइकिल एकदम तैयार है! आपातकालीन बजट से भुगतान करके आपने बहुत समझदारी दिखाई।',
      te: 'మీ సైకిల్ చక్కగా నడుస్తోంది! వడ్డీ వ్యాపారుల వద్దకు వెళ్లకుండా మీ సొంత పొదుపుతో పరిష్కరించుకోవడం చాలా మంచి పద్ధతి.',
    },
  },
  {
    id: 'npc_bazaar_merchant',
    name: 'Bazaar Merchant Chander',
    role: 'Academic Wholesale Vendor',
    avatar: '📦',
    x: 445,
    y: 115,
    cityId: 'city_academic_bazaar',
    direction: 'down',
    scenarioId: 'scenario_bazaar_bargain',
    dialogueIntro: {
      en: 'Welcome to Koti Book Market! Need semester guides and lab manuals? Brand new retail sets cost ₹1,500, but I have clean second-hand study bundles for ₹500. Or team up with a classmate to get them for ₹450 each!',
      hi: 'कोटी बुक मार्केट में स्वागत है! नई किताबें ₹1,500 की हैं, लेकिन मेरे पास ₹500 में साफ-सुथरे पुराने बंडल हैं। सहपाठी के साथ मिलकर ₹450 में भी ले सकते हैं!',
      te: 'కోటి బుక్ మార్కెట్‌కు స్వాగతం! కొత్త పుస్తకాలు ₹1,500 అయితే నా వద్ద ₹500కే మంచి సెకండ్ హ్యాండ్ సెట్లు ఉన్నాయి. స్నేహితుడితో కలిసి కొంటే ఒక్కొక్కరికి ₹450 మాత్రమే!',
    },
    dialogueSolved: {
      en: 'You drive a hard bargain! Smart students invest in knowledge, not glossy book jackets.',
      hi: 'शानदार सौदा! समझदार छात्र दिखावे के बजाय ज्ञान में निवेश करते हैं।',
      te: 'అద్భుతమైన బేరం! తెలివైన విద్యార్థులు కొత్త కవర్ల కోసం కాకుండా పుస్తకాల్లోని జ్ఞానం కోసం చూస్తారు.',
    },
  },
  {
    id: 'npc_post_office_teller',
    name: 'Dak Sevika Priya',
    role: 'India Post Branch Teller',
    avatar: '📮',
    x: 550,
    y: 395,
    cityId: 'city_academic_bazaar',
    direction: 'down',
    scenarioId: 'scenario_postal_savings',
    dialogueIntro: {
      en: 'Welcome to the Academic Bazaar Post Office! Congratulations on winning your semester academic merit award. Did you know the Government of India offers sovereign-backed student savings accounts and time deposits with guaranteed interest? Beware of unregulated agents promising impossible double returns!',
      hi: 'डाकघर में स्वागत है! मेरिट पुरस्कार जीतने पर बधाई। भारत सरकार छात्रों को 100% संप्रभु सुरक्षा और गारंटीकृत ब्याज देती है। 30 दिन में पैसा दोगुना करने का दावा करने वाले धोखेबाजों से सावधान रहें!',
      te: 'పోస్ట్ ఆఫీస్‌కు స్వాగతం! ప్రతిభా పురస్కారం పొందినందుకు అభినందనలు. భారత ప్రభుత్వం 100% రక్షణ ఉన్న పొదుపు పథకాలను అందిస్తుంది. నెలలో డబ్బు డబుల్ చేస్తామనే మోసగాళ్లను నమ్మకండి!',
    },
    dialogueSolved: {
      en: 'Your sovereign post office investment is securely booked! Zero risk and guaranteed interest protect your tuition capital.',
      hi: 'आपकी सरकारी डाकघर बचत सुरक्षित रूप से दर्ज हो गई है! शून्य जोखिम और निश्चित ब्याज आपकी पूंजी की रक्षा करते हैं।',
      te: 'మీ ప్రభుత్వ పోస్టల్ పొదుపు సురక్షితంగా నమోదైంది! పూర్తి భద్రతతో మీ భవిష్యత్ ఫీజుల డబ్బు సిద్ధంగా ఉంటుంది.',
    },
  },
  {
    id: 'npc_professor_sharma',
    name: 'Professor Sharma',
    role: 'Dean of Student Affairs',
    avatar: '👨‍🏫',
    x: 740,
    y: 250,
    cityId: 'city_academic_bazaar',
    direction: 'down',
    dialogueIntro: {
      en: 'Greetings, scholar! Welcome to the University Academic Courtyard. Our institutional library provides digital access to all coursework journals. Use your free institutional card to minimize your study costs to zero!',
      hi: 'नमस्ते विद्यार्थी! विश्वविद्यालय के प्रांगण में स्वागत है। हमारी लाइब्रेरी सभी पत्रिकाओं तक मुफ्त पहुंच देती है। अपने खर्च को शून्य रखने के लिए लाइब्रेरी कार्ड का उपयोग करें!',
      te: 'నమస్కారం విద్యార్థీ! యూనివర్సిటీ ప్రాంగణానికి స్వాగతం. మా లైబ్రరీ ద్వారా ఉచిత డిజిటల్ పుస్తకాలు పొందవచ్చు. ఖర్చులను తగ్గించుకోవడానికి మీ లైబ్రరీ కార్డును వాడండి!',
    },
    dialogueSolved: {
      en: 'Excellent academic discipline! Leveraging university resources leaves more of your scholarship intact for your career.',
      hi: 'उत्कृष्ट सोच! विश्वविद्यालय के संसाधनों का उपयोग करके आपने अपनी छात्रवृत्ति सुरक्षित रखी।',
      te: 'చాలా మంచి నిర్ణయం! విశ్వవిద్యాలయ వనరులను వాడటం ద్వారా మీ స్కాలర్‌షిప్ డబ్బు భద్రంగా ఉంటుంది.',
    },
  },
  {
    id: 'npc_student_kabir_city2',
    name: 'Kabir',
    role: 'Classmate & Study Partner',
    avatar: '🎒',
    x: 470,
    y: 245,
    cityId: 'city_academic_bazaar',
    direction: 'down',
    dialogueIntro: {
      en: "Hey there! I just biked over from the hostel to the Academic Bazaar. The market stalls have huge discounts on reference books today! Let's check out the stores and then head to the University gate.",
      hi: 'अरे दोस्त! मैं अभी हॉस्टल से साइकिल चलाकर बाजार आया हूं। आज किताबों पर भारी छूट है! चलो दुकानें देखते हैं।',
      te: 'హేయ్ దోస్త్! నేను కూడా హాస్టల్ నుండి ఇక్కడికి వచ్చాను. ఈ రోజు పుస్తకాలపై మంచి డిస్కౌంట్లు ఉన్నాయి! అన్నీ చూసుకుని యూనివర్సిటీ గేట్ వైపు వెళ్దాం.',
    },
    dialogueSolved: {
      en: 'Awesome study trip! We saved hundreds of rupees and avoided all debt traps!',
      hi: 'शानदार यात्रा! हमने सैकड़ों रुपये बचाए और किसी कर्ज के जाल में नहीं फंसे!',
      te: 'మంచి ట్రిప్! చాలా డబ్బులు ఆదా అయ్యాయి, అప్పులు లేకుండా అన్నీ పూర్తయ్యాయి!',
    },
  },
];

export function getCity2NpcCollisionBoxes(npcs: NPC[] = CITY2_NPCS): CollisionBox[] {
  return npcs.map((npc) => ({
    name: `npc_foot_${npc.id}`,
    x: npc.x - 8,
    y: npc.y - 4,
    w: 16,
    h: 8,
  }));
}

// Interactive Objects & Portals in City 2
export const CITY2_INTERACTIVES: CityObject[] = [
  {
    id: 'portal_city1_return',
    type: 'portal',
    name: 'West Gate: Road back to City 1 (Hostel Commons)',
    x: 50,
    y: 455,
    radius: 60,
    icon: 'Compass',
    prompt: {
      en: 'Press [E] / Space to return to City 1 (Hostel Commons)',
      hi: 'सिटी 1 (हॉस्टल कॉमन्स) वापस जाने के लिए [E] दबाएं',
      te: 'సిటీ 1 (హాస్టల్ కామన్స్)కి తిరిగి వెళ్ళడానికి [E] నొక్కండి',
    },
    title: {
      en: 'West Highway: Return to Hostel Commons',
      hi: 'पश्चिमी राजमार्ग: हॉस्टल कॉमन्स वापसी',
      te: 'పశ్చిమ రహదారి: హాస్టల్ కామన్స్‌కు తిరుగు ప్రయాణం',
    },
    content: {
      en: 'Path back to City 1 (Hostel Commons).\n\nReturn to your student dorm to check in with Warden Rao Sir, Anand, or visit the savings bank ATM.',
      hi: 'सिटी 1 (हॉस्टल कॉमन्स) की वापसी का रास्ता। हॉस्टल वार्डन या बैंक एटीएम पर जाने के लिए वापस लौटें।',
      te: 'సిటీ 1 (హాస్టల్ కామన్స్) మార్గం. మీ హాస్టల్ రూమ్, వార్డెన్ లేదా సేవింగ్స్ బ్యాంక్ ఏటీఎం వద్దకు తిరిగి వెళ్ళండి.',
    },
    details: {
      category: 'World Navigation',
      financialLesson: 'You can navigate freely between explored cities to review past lessons and practice financial mastery.',
      recommendedAction: 'Travel to City 1',
    },
  },
  {
    id: 'portal_city3_exit',
    type: 'portal',
    name: 'East Highway: Road to City 3 (Investment Valley)',
    x: 950,
    y: 490,
    radius: 60,
    icon: 'Compass',
    prompt: {
      en: 'Press [E] / Space to travel to City 3 (Investment Valley)',
      hi: 'सिटी 3 (इन्वेस्टमेंट वैली) जाने के लिए [E] दबाएं',
      te: 'సిటీ 3 (ఇన్వెస్ట్‌మెంట్ వ్యాలీ) వెళ్ళడానికి [E] నొక్కండి',
    },
    title: {
      en: 'East Highway: Gateway to City 3 (Investment Valley)',
      hi: 'पूर्वी राजमार्ग: सिटी 3 (इन्वेस्टमेंट वैली) का प्रवेश द्वार',
      te: 'తూర్పు రహదారి: సిటీ 3 (ఇన్వెస్ట్‌మెంట్ వ్యాలీ) ప్రవేశ ద్వారం',
    },
    content: {
      en: 'Gateway to City 3 (Investment Valley).\n\nHere you will learn about safe vs variable growth, portfolio diversification, avoiding market panic, and investing in yourself.',
      hi: 'सिटी 3 (इन्वेस्टमेंट वैली) की राह: यहां आप सुरक्षित और विकास निवेश, विविधीकरण और खुद में निवेश सीखेंगे।',
      te: 'సిటీ 3 (ఇన్వెస్ట్‌మెంట్ వ్యాలీ) మార్గం: సురక్షిత మరియు వృద్ధి పెట్టుబడులు, వైవిధ్యం, మార్కెట్ పానిక్ నివారణ ఇక్కడ నేర్చుకుంటారు.',
    },
    details: {
      category: 'World Transition',
      financialLesson: 'Master market bargaining and smart saving before exploring investing simulations and diversification.',
    },
  },
  {
    id: 'landmark_academic_statue',
    type: 'landmark',
    name: 'University Founder Memorial Statue',
    x: 712,
    y: 245,
    radius: 60,
    icon: 'Landmark',
    prompt: {
      en: 'Press [E] / Space to inspect Academic Memorial Statue',
      hi: 'अकादमिक स्मारक प्रतिमा देखने के लिए [E] दबाएं',
      te: 'విశ్వవిద్యాలయ స్మారక విగ్రహం చూడటానికి [E] నొక్కండి',
    },
    title: {
      en: 'The Pillar of Academic Diligence',
      hi: 'अकादमिक निष्ठा का स्तंभ',
      te: 'విద్యా విలువల స్మారక స్తంభం',
    },
    content: {
      en: 'Dedicated to scholars who invested in lifelong knowledge over short-lived material show.\n\n"A full mind endures hardships that an empty purse cannot fear."',
      hi: '"दिखावे पर नहीं, ज्ञान पर निवेश करें। सच्ची समझ आपको हर वित्तीय संकट से बचाती है।"',
      te: '"క్షణికమైన ఆడంబరాల కంటే శాశ్వత జ్ఞానంపై పెట్టుబడి పెట్టండి. జ్ఞానమే అత్యుత్తమ సంపద."',
    },
    details: {
      category: 'Scholastic Wisdom',
      financialLesson: 'Investing in education and foundational skills yields the highest compounding returns over your lifetime career.',
    },
  },
  {
    id: 'kiosk_post_office',
    type: 'kiosk',
    name: 'City Post Office & Government Savings Kiosk',
    x: 550,
    y: 395,
    radius: 60,
    icon: 'Mail',
    prompt: {
      en: 'Press [E] / Space to inspect Post Office Savings Counter',
      hi: 'डाकघर बचत काउंटर देखने के लिए [E] दबाएं',
      te: 'పోస్ట్ ఆఫీస్ సేవింగ్స్ కౌంటర్ చూడటానికి [E] నొక్కండి',
    },
    title: {
      en: 'Department of Posts — Small Savings Counter',
      hi: 'डाक विभाग — लघु बचत योजना काउंटर',
      te: 'తపాలా శాఖ — చిన్న మొత్తాల పొదుపు కౌంటర్',
    },
    content: {
      en: 'India Post Student Services:\n• Post Office Savings Account (POSA): 4.0% p.a.\n• National Savings Certificates & PPF\n• Sovereign government guarantee on all balances\n\nFinancial Rule: Post office schemes are immune to market volatility and provide absolute capital safety.',
      hi: 'डाकघर बचत सेवाएं: सरकारी गारंटी के साथ 4% ब्याज दर और शून्य जोखिम।',
      te: 'పోస్ట్ ఆఫీస్ పొదుపు పథకాలు: ప్రభుత్వ పూచీకత్తుతో 4% వార్షిక వడ్డీ మరియు పూర్తి భద్రత.',
    },
    details: {
      category: 'Sovereign Savings',
      financialLesson: 'For emergency reserves and tuition funds, prioritize capital safety and government-backed liquidity over speculative returns.',
    },
  },
  {
    id: 'kiosk_festival_fountain',
    type: 'landmark',
    name: 'Central Bazaar Water Fountain',
    x: 500,
    y: 160,
    radius: 60,
    icon: 'Droplets',
    prompt: {
      en: 'Press [E] / Space to inspect Bazaar Plaza Fountain',
      hi: 'बाजार चौक फव्वारा देखने के लिए [E] दबाएं',
      te: 'బజార్ కూడలి ఫౌంటెన్ చూడటానికి [E] నొక్కండి',
    },
    title: {
      en: 'The Flowing Spring of Free Resources',
      hi: 'मुफ्त संसाधनों का झरना',
      te: 'ఉచిత వనరుల ప్రవాహం',
    },
    content: {
      en: 'Bazaar Tip:\nFree filtered water stations save campus students up to ₹900 a month compared to purchasing single-use bottled mineral water daily.\n\nAlways carry a reusable water flask in your study bag!',
      hi: 'मुफ्त स्वच्छ पेयजल का उपयोग करने से रोजाना बोतल बंद पानी खरीदने का ₹900/माह खर्च बचता है। हमेशा अपनी पानी की बोतल साथ रखें!',
      te: 'ఉచిత తాగునీటిని ఉపయోగించడం ద్వారా నెలకు ₹900 వరకు ఆదా అవుతుంది. ఎల్లప్పుడూ సొంత వాటర్ బాటిల్ తీసుకెళ్లండి!',
    },
    details: {
      category: 'Everyday Savings',
      financialLesson: 'Eliminating routine recurring minor expenses like packaged bottled water compounds into substantial monthly surplus.',
    },
  },
];
