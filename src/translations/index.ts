import { GameLanguage } from '../types';

export interface Translations {
  nav: {
    title: string;
    classTag: string;
    wallet: string;
    reserve: string;
    score: string;
    quests: string;
    achievements: string;
    settings: string;
    ngoDashboard: string;
    reset: string;
    profile: string;
    pause: string;
  };
  landing: {
    badge: string;
    heroTitle: string;
    heroTitleHighlight: string;
    heroSubtitle: string;
    startAdventure: string;
    resumeJourney: string;
    exploreMap: string;
    viewAchievements: string;
    ngoReports: string;
    stipendBannerTitle: string;
    stipendBannerSub: string;
    stipendAmount: string;
    pillarSectionTitle: string;
    pillarSectionSub: string;
    worldSectionTitle: string;
    worldSectionSub: string;
    interactiveDemoTitle: string;
    interactiveDemoSub: string;
    vanguardMission: string;
    soundToggleOn: string;
    soundToggleOff: string;
    environmentDay: string;
    environmentSunset: string;
    environmentNight: string;
  };
  auth: {
    modalTitle: string;
    tabRegister: string;
    tabLogin: string;
    studentIdLabel: string;
    studentIdPlaceholder: string;
    avatarSelect: string;
    campusSelect: string;
    stipendConfirmation: string;
    createAccountBtn: string;
    loginBtn: string;
    privacyNotice: string;
    sessionResumed: string;
    invalidId: string;
    quickGuest: string;
  };
  onboarding: {
    step1Title: string;
    step1Badge: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    step5Title: string;
    step5Desc: string;
    needsLabel: string;
    wantsLabel: string;
    savingsLabel: string;
    nextStep: string;
    prevStep: string;
    finishOnboarding: string;
    controlsKeyboard: string;
    controlsSpace: string;
    controlsTouch: string;
  };
  regions: {
    panelTitle: string;
    panelSub: string;
    tabRegion1: string;
    tabRegion2: string;
    tabRegion3: string;
    statusCompleted: string;
    statusCurrent: string;
    statusLocked: string;
    pillarBadge: string;
    rewardPoints: string;
    exploreCityBtn: string;
  };
  pause: {
    menuTitle: string;
    resumeGame: string;
    settingsTab: string;
    controlsTab: string;
    masterVolume: string;
    bgmSound: string;
    sfxSound: string;
    highContrast: string;
    reducedMotion: string;
    retroFont: string;
    languageSelect: string;
    keyboardControls: string;
    movementKeys: string;
    interactionKey: string;
    pauseKey: string;
    touchControls: string;
    returnLanding: string;
    saveQuit: string;
  };
  achievements: {
    modalTitle: string;
    modalSub: string;
    scholarLevel: string;
    totalScore: string;
    badgesUnlocked: string;
    financialHealth: string;
    pillarMastery: string;
    viewCertificate: string;
    certificateTitle: string;
    certifiedScholar: string;
    certificateDate: string;
    certificateFooter: string;
    closeCertificate: string;
  };
  feedback: {
    loadingTitle: string;
    loadingTip: string;
    errorTitle: string;
    errorSub: string;
    retryBtn: string;
    offlineModeActive: string;
    emptyTitle: string;
    emptySub: string;
  };
}

export const TRANSLATIONS: Record<GameLanguage, Translations> = {
  en: {
    nav: {
      title: 'MoneyQuest',
      classTag: 'Class 11 Scholar • Hyderabad',
      wallet: 'Wallet',
      reserve: 'Reserve',
      score: 'Score',
      quests: 'Quests',
      achievements: 'Trophies',
      settings: 'Settings',
      ngoDashboard: 'NGO Dashboard',
      reset: 'Reset Progress',
      profile: 'Scholar Profile',
      pause: 'Pause Menu',
    },
    landing: {
      badge: 'Interactive Financial-Literacy RPG',
      heroTitle: 'Master Your Scholarship.',
      heroTitleHighlight: 'Rule Your Future.',
      heroSubtitle:
        'Step into the shoes of a Class 11 merit scholar in Hyderabad. Manage your ₹5,000 monthly stipend, balance hostel life, outsmart predatory schemes, and unlock lifelong financial freedom.',
      startAdventure: 'Start Adventure',
      resumeJourney: 'Resume Journey',
      exploreMap: 'Explore Regions',
      viewAchievements: 'Achievements',
      ngoReports: 'NGO Partner Reports',
      stipendBannerTitle: 'Scholarship Stipend Active',
      stipendBannerSub: 'Telangana Merit Cohort • Hyderabad Campus',
      stipendAmount: '₹5,000 / month',
      pillarSectionTitle: 'The Four Pillars of Financial Independence',
      pillarSectionSub: 'Rooted in evidence-based pedagogical research to empower first-generation scholars.',
      worldSectionTitle: 'Explore 3 Living Regions & 15 Cities',
      worldSectionSub: 'Travel from everyday hostel budgeting to asset compounding and cyber fraud defense.',
      interactiveDemoTitle: 'Test Your Financial Reflexes',
      interactiveDemoSub: 'Try the interactive ₹5,000 Stipend Allocator before stepping into the world.',
      vanguardMission: 'Designed in collaboration with community financial-literacy initiatives in Hyderabad.',
      soundToggleOn: 'Mute Sound',
      soundToggleOff: 'Play Ambiance',
      environmentDay: 'Daylight',
      environmentSunset: 'Golden Hour',
      environmentNight: 'Night Sky',
    },
    auth: {
      modalTitle: 'Scholar Identity Portal',
      tabRegister: 'Enroll New Scholar',
      tabLogin: 'Resume Journey',
      studentIdLabel: 'Pseudonymous Student ID',
      studentIdPlaceholder: 'e.g. STU-1042',
      avatarSelect: 'Choose Your Avatar',
      campusSelect: 'Select Hostel / Wing',
      stipendConfirmation: 'Initial Merit Scholarship Grant: ₹5,000',
      createAccountBtn: 'Initialize Scholar & Begin',
      loginBtn: 'Resume Game Session',
      privacyNotice: 'Zero PII collected. Only pseudonymous learning analytics are retained for educational impact research.',
      sessionResumed: 'Welcome back! Restoring your session and financial ledger.',
      invalidId: 'Student ID must follow format STU-XXXX (e.g. STU-2045).',
      quickGuest: 'Generate New Pseudonymous ID',
    },
    onboarding: {
      step1Title: 'The Scholarship Letter',
      step1Badge: 'Step 1 of 5',
      step1Desc:
        'Congratulations! You have been awarded the prestigious State Merit Scholarship. Starting today, ₹5,000 will be credited directly to your student bank account every month.',
      step2Title: 'The Reality of Hostel Life',
      step2Desc:
        'At first, ₹5,000 feels like an endless fortune. But college life in Hyderabad moves quickly: mess dues, library textbook costs, canteen chai breaks, and peer pressure will test every rupee.',
      step3Title: 'The 50-30-20 Golden Rule',
      step3Desc:
        'Financial independence starts with allocation. Divide your ₹5,000 into three clear envelopes before you spend a single rupee:',
      step4Title: 'Navigating The Living World',
      step4Desc:
        'Explore 3 regions across 15 cities inspired by Champion Island. Walk up to fellow students, shopkeepers, and campus counselors. Choose wisely: every decision updates your balance, reserve, and score.',
      step5Title: 'Ready For Your First Month?',
      step5Desc:
        'Your dorm room in Hostel Commons awaits. Remember: if you make a misstep, you enter Recovery Mode to learn safely without shame. Good luck, Scholar!',
      needsLabel: 'Needs (Mess, Rent, Books) - 50% [₹2,500]',
      wantsLabel: 'Wants (Cafe, Outings, Treats) - 30% [₹1,500]',
      savingsLabel: 'Emergency Reserve - 20% [₹1,000]',
      nextStep: 'Continue',
      prevStep: 'Back',
      finishOnboarding: 'Enter Hostel Commons',
      controlsKeyboard: 'Use WASD or Arrow Keys to move',
      controlsSpace: 'Press SPACE or Enter to talk to characters',
      controlsTouch: 'On mobile? Use the virtual touch D-pad',
    },
    regions: {
      panelTitle: 'World Map & Quest Log',
      panelSub: '15 interconnected educational cities across 3 progressive regions',
      tabRegion1: "1. Scholar's District",
      tabRegion2: '2. Prosperity Outskirts',
      tabRegion3: '3. Guardian Citadel',
      statusCompleted: 'Completed',
      statusCurrent: 'Active Quest',
      statusLocked: 'Locked',
      pillarBadge: 'Pillar',
      rewardPoints: 'Reward: +100 Literacy Pts',
      exploreCityBtn: 'View City Quest',
    },
    pause: {
      menuTitle: 'Game Menu & Settings',
      resumeGame: 'Resume Game',
      settingsTab: 'Settings',
      controlsTab: 'Controls',
      masterVolume: 'Master Volume',
      bgmSound: 'Background Music (Chiptune)',
      sfxSound: 'Sound Effects (Audio Blips)',
      highContrast: 'High Contrast Mode',
      reducedMotion: 'Reduced Animation Motion',
      retroFont: 'Pixel-Art Retro Typography',
      languageSelect: 'Interface Language',
      keyboardControls: 'Keyboard Shortcuts',
      movementKeys: 'Movement: W, A, S, D or Arrow Keys',
      interactionKey: 'Interact: Spacebar / Enter / Click',
      pauseKey: 'Menu / Pause: Escape Key',
      touchControls: 'Touch Screen: Virtual D-Pad & Action Buttons',
      returnLanding: 'Return to Landing Page',
      saveQuit: 'Save Progress & Exit',
    },
    achievements: {
      modalTitle: 'Student Milestones & Badges',
      modalSub: 'Demonstrate financial capability across all four learning pillars',
      scholarLevel: 'Scholar Rank',
      totalScore: 'Total Score',
      badgesUnlocked: 'Badges Earned',
      financialHealth: 'Financial Health Index',
      pillarMastery: 'Pillar Mastery',
      viewCertificate: 'View Official Certificate',
      certificateTitle: 'CERTIFICATE OF FINANCIAL LITERACY',
      certifiedScholar: 'This certifies that Scholar',
      certificateDate: 'Date of Achievement',
      certificateFooter: 'Verified under Telangana Higher Secondary Financial Empowerment Framework.',
      closeCertificate: 'Close Certificate',
    },
    feedback: {
      loadingTitle: 'Loading World Assets...',
      loadingTip: 'Tip: Always set aside 20% of your stipend before paying discretionary expenses.',
      errorTitle: 'Something Went Off Track',
      errorSub: 'The simulation encountered an unexpected issue. Your ledger has been preserved safely.',
      retryBtn: 'Retry Connection',
      offlineModeActive: 'Offline Mode: Built-in deterministic curriculum is active.',
      emptyTitle: 'No Quests Found',
      emptySub: 'Talk to NPCs in your current city to discover new financial challenges.',
    },
  },
  hi: {
    nav: {
      title: 'MoneyQuest',
      classTag: '11वीं कक्षा के छात्र • हैदराबाद',
      wallet: 'बटुआ',
      reserve: 'रिजर्व फंड',
      score: 'अंक',
      quests: 'अभियान',
      achievements: 'उपलब्धियां',
      settings: 'सेटिंग्स',
      ngoDashboard: 'एनजीओ डैशबोर्ड',
      reset: 'प्रगति रीसेट करें',
      profile: 'छात्र प्रोफाइल',
      pause: 'पॉज मेन्यू',
    },
    landing: {
      badge: 'इंटरैक्टिव वित्तीय-साक्षरता एडवेंचर गेम',
      heroTitle: 'अपनी छात्रवृत्ति संभालें।',
      heroTitleHighlight: 'अपना भविष्य संवारें।',
      heroSubtitle:
        'हैदराबाद में 11वीं कक्षा के छात्रवृत्ति विजेता बनें। ₹5,000 मासिक वजीफे का प्रबंधन करें, छात्रावास जीवन संतुलित करें और वित्तीय आजादी हासिल करें।',
      startAdventure: 'साहसिक यात्रा शुरू करें',
      resumeJourney: 'यात्रा जारी रखें',
      exploreMap: 'क्षेत्र देखें',
      viewAchievements: 'उपलब्धियां',
      ngoReports: 'एनजीओ पार्टनर रिपोर्ट',
      stipendBannerTitle: 'सक्रिय छात्रवृत्ति वजीफा',
      stipendBannerSub: 'तेलंगाना मेरिट बैच • हैदराबाद कैंपस',
      stipendAmount: '₹5,000 / माह',
      pillarSectionTitle: 'वित्तीय स्वतंत्रता के चार स्तंभ',
      pillarSectionSub: 'प्रथम-पीढ़ी के छात्रों को स्थायी वित्तीय कौशल प्रदान करने के लिए शोध आधारित रूपरेखा।',
      worldSectionTitle: '3 रोमांचक क्षेत्र और 15 शहर',
      worldSectionSub: 'छात्रावास के बजट से लेकर चक्रवृद्धि निवेश और साइबर धोखाधड़ी से सुरक्षा तक।',
      interactiveDemoTitle: 'अपनी वित्तीय सजगता परखें',
      interactiveDemoSub: 'खेल में प्रवेश करने से पहले ₹5,000 वजीफा आवंटन का प्रयास करें।',
      vanguardMission: 'हैदराबाद में सामुदायिक वित्तीय साक्षरता पहलों के सहयोग से निर्मित।',
      soundToggleOn: 'आवाज बंद करें',
      soundToggleOff: 'आवाज चालू करें',
      environmentDay: 'दिन का समय',
      environmentSunset: 'संध्या काल',
      environmentNight: 'रात्रि काल',
    },
    auth: {
      modalTitle: 'छात्र पहचान पोर्टल',
      tabRegister: 'नया नामांकन',
      tabLogin: 'प्रवेश करें',
      studentIdLabel: 'अनाम छात्र आईडी',
      studentIdPlaceholder: 'उदा. STU-1042',
      avatarSelect: 'अपना अवतार चुनें',
      campusSelect: 'छात्रावास / विंग चुनें',
      stipendConfirmation: 'प्रारंभिक मेरिट छात्रवृत्ति: ₹5,000',
      createAccountBtn: 'शुरू करें',
      loginBtn: 'सत्र फिर से शुरू करें',
      privacyNotice: 'शून्य व्यक्तिगत डेटा संग्रहीत। केवल शैक्षिक अनुसंधान के लिए अनाम डेटा रखा जाता है।',
      sessionResumed: 'वापसी पर स्वागत है! आपका वित्तीय बहीखाता लोड किया जा रहा है।',
      invalidId: 'छात्र आईडी STU-XXXX प्रारूप में होनी चाहिए (उदा. STU-2045)।',
      quickGuest: 'नया अनाम आईडी बनाएं',
    },
    onboarding: {
      step1Title: 'छात्रवृत्ति पत्र',
      step1Badge: 'चरण 1 / 5',
      step1Desc:
        'बधाई हो! आपको राज्य मेरिट छात्रवृत्ति मिली है। आज से हर महीने आपके बैंक खाते में ₹5,000 सीधे जमा होंगे।',
      step2Title: 'छात्रावास की वास्तविकता',
      step2Desc:
        'शुरुआत में ₹5,000 बहुत बड़ी रकम लगती है। लेकिन मेस फीस, किताबें, कैंटीन और दोस्तों का दबाव हर रुपये की परीक्षा लेगा।',
      step3Title: '50-30-20 का सुनहरा नियम',
      step3Desc:
        'वित्तीय आजादी सही योजना से शुरू होती है। एक भी रुपया खर्च करने से पहले ₹5,000 को 3 लिफाफों में बांटें:',
      step4Title: 'सजीव दुनिया में अन्वेषण',
      step4Desc:
        '15 शहरों में घूमें। छात्रों, दुकानदारों और शिक्षकों से बात करें। आपके हर फैसले से बटुआ, रिजर्व और अंक बदलेंगे।',
      step5Title: 'क्या आप तैयार हैं?',
      step5Desc:
        'हॉस्टल कॉमन्स में आपका कमरा तैयार है। गलती होने पर रिकवरी मोड आपको बिना शर्मिंदगी के सीखने में मदद करेगा!',
      needsLabel: 'जरूरतें (मेस, किराया, किताबें) - 50% [₹2,500]',
      wantsLabel: 'इच्छाएं (कैफे, सैर-सपाटा) - 30% [₹1,500]',
      savingsLabel: 'आपातकालीन फंड - 20% [₹1,000]',
      nextStep: 'आगे बढ़ें',
      prevStep: 'पीछे जाएं',
      finishOnboarding: 'छात्रावास में प्रवेश करें',
      controlsKeyboard: 'घूमने के लिए WASD या तीर कुंजियों का उपयोग करें',
      controlsSpace: 'बातचीत के लिए स्पेस या एंटर दबाएं',
      controlsTouch: 'मोबाइल पर वर्चुअल डी-पैड का प्रयोग करें',
    },
    regions: {
      panelTitle: 'विश्व मानचित्र और अभियान सूची',
      panelSub: '3 क्षेत्रों में 15 परस्पर जुड़े शैक्षिक शहर',
      tabRegion1: '1. विद्वान जिला',
      tabRegion2: '2. समृद्धि क्षेत्र',
      tabRegion3: '3. संरक्षक गढ़',
      statusCompleted: 'पूर्ण',
      statusCurrent: 'सक्रिय अभियान',
      statusLocked: 'बंद',
      pillarBadge: 'स्तंभ',
      rewardPoints: 'इनाम: +100 साक्षरता अंक',
      exploreCityBtn: 'शहर अभियान देखें',
    },
    pause: {
      menuTitle: 'गेम मेन्यू व सेटिंग्स',
      resumeGame: 'गेम जारी रखें',
      settingsTab: 'सेटिंग्स',
      controlsTab: 'कंट्रोल्स',
      masterVolume: 'मुख्य वॉल्यूम',
      bgmSound: 'पृष्ठभूमि संगीत',
      sfxSound: 'ध्वनि प्रभाव',
      highContrast: 'हाई कंट्रास्ट मोड',
      reducedMotion: 'धीमी एनिमेशन गति',
      retroFont: 'पिक्सल-आर्ट फॉन्ट',
      languageSelect: 'इंटरफेस भाषा',
      keyboardControls: 'कीबोर्ड शॉर्टकट',
      movementKeys: 'गतिविधि: W, A, S, D या तीर कुंजियां',
      interactionKey: 'बातचीत: स्पेसबार / एंटर',
      pauseKey: 'मेन्यू / पॉज: Escape कुंजी',
      touchControls: 'टच स्क्रीन: वर्चुअल डी-पैड',
      returnLanding: 'मुख्य पृष्ठ पर लौटें',
      saveQuit: 'सहेजें और बाहर निकलें',
    },
    achievements: {
      modalTitle: 'छात्र उपलब्धियां और बैज',
      modalSub: 'सभी चार वित्तीय स्तंभों में दक्षता सिद्ध करें',
      scholarLevel: 'छात्र स्तर',
      totalScore: 'कुल अंक',
      badgesUnlocked: 'अर्जित बैज',
      financialHealth: 'वित्तीय स्वास्थ्य सूचकांक',
      pillarMastery: 'स्तंभ महारत',
      viewCertificate: 'प्रमाणपत्र देखें',
      certificateTitle: 'वित्तीय साक्षरता प्रमाणपत्र',
      certifiedScholar: 'प्रमाणित किया जाता है कि छात्र',
      certificateDate: 'उपलब्धि की तिथि',
      certificateFooter: 'तेलंगाना उच्चतर माध्यमिक वित्तीय सशक्तिकरण द्वारा सत्यापित।',
      closeCertificate: 'बंद करें',
    },
    feedback: {
      loadingTitle: 'विश्व लोड हो रहा है...',
      loadingTip: 'सलाह: गैर-जरूरी खर्चों से पहले 20% वजीफा हमेशा सुरक्षित रखें।',
      errorTitle: 'कुछ समस्या आई',
      errorSub: 'चिंता न करें, आपका बहीखाता सुरक्षित है।',
      retryBtn: 'पुनः प्रयास करें',
      offlineModeActive: 'ऑफलाइन मोड: इनबिल्ट पाठ्यक्रम सक्रिय है।',
      emptyTitle: 'कोई अभियान नहीं मिला',
      emptySub: 'नए वित्तीय अभियानों को खोजने के लिए अपने शहर में लोगों से बात करें।',
    },
  },
  te: {
    nav: {
      title: 'MoneyQuest',
      classTag: '11వ తరగతి స్కాలర్ • హైదరాబాద్',
      wallet: 'వాలెట్',
      reserve: 'రిజర్వ్ ఫండ్',
      score: 'స్కోర్',
      quests: 'క్వెస్ట్‌లు',
      achievements: 'విజయాలు',
      settings: 'సెట్టింగ్‌లు',
      ngoDashboard: 'ఎన్జీవో డాష్‌బోర్డ్',
      reset: 'రీసెట్ చేయండి',
      profile: 'విద్యార్థి ప్రొఫైల్',
      pause: 'పాజ్ మెనూ',
    },
    landing: {
      badge: 'ఇంటరాక్టివ్ ఫైనాన్షియల్ లిటరసీ అడ్వెంచర్ గేమ్',
      heroTitle: 'మీ స్కాలర్‌షిప్‌ను సమర్థవంతంగా నిర్వహించండి.',
      heroTitleHighlight: 'ఉజ్వల భవిష్యత్తును నిర్మించుకోండి.',
      heroSubtitle:
        'హైదరాబాద్‌లో 11వ తరగతి స్కాలర్‌షిప్ విద్యార్థిగా మారండి. నెలకు ₹5,000 స్టైపెండ్‌ను తెలివిగా కేటాయించండి, హాస్టల్ ఖర్చులు మరియు మోసాలను అడ్డుకోండి.',
      startAdventure: 'సాహసం ప్రారంభించండి',
      resumeJourney: 'కొనసాగించండి',
      exploreMap: 'ప్రాంతాలు చూడండి',
      viewAchievements: 'విజయాలు',
      ngoReports: 'ఎన్జీవో నివేదికలు',
      stipendBannerTitle: 'స్టైపెండ్ యాక్టివ్',
      stipendBannerSub: 'తెలంగాణ మెరిట్ బ్యాచ్ • హైదరాబాద్ క్యాంపస్',
      stipendAmount: '₹5,000 / నెలకు',
      pillarSectionTitle: 'ఆర్థిక స్వతంత్రతకు నాలుగు స్తంభాలు',
      pillarSectionSub: 'విద్యార్థులకు శాశ్వత ఆర్థిక క్రమశిక్షణను అందించే ప్రత్యేక వేదిక.',
      worldSectionTitle: '3 ప్రాంతాలు & 15 నగరాలు',
      worldSectionSub: 'హాస్టల్ బడ్జెట్ నుండి కాంపౌండింగ్ మరియు సైబర్ రక్షణ వరకు.',
      interactiveDemoTitle: 'మీ ఆర్థిక నైపుణ్యాన్ని పరీక్షించండి',
      interactiveDemoSub: 'గేమ్‌లోకి ప్రవేశించే ముందు ₹5,000 బడ్జెట్ కేటాయింపును ప్రయత్నించండి.',
      vanguardMission: 'హైదరాబాద్ సామాజిక ఆర్థిక అవగాహన ప్రాజెక్టుల సహకారంతో రూపొందించబడింది.',
      soundToggleOn: 'సౌండ్ ఆఫ్',
      soundToggleOff: 'సౌండ్ ఆన్',
      environmentDay: 'పగలు',
      environmentSunset: 'సాయంత్రం',
      environmentNight: 'రాత్రి',
    },
    auth: {
      modalTitle: 'విద్యార్థి పోర్టల్',
      tabRegister: 'నూతన నమోదు',
      tabLogin: 'లాగిన్',
      studentIdLabel: 'విద్యార్థి ఐడీ',
      studentIdPlaceholder: 'ఉదా. STU-1042',
      avatarSelect: 'అవతార్ ఎంచుకోండి',
      campusSelect: 'హాస్టల్ / వింగ్',
      stipendConfirmation: 'ప్రారంభ స్కాలర్‌షిప్: ₹5,000',
      createAccountBtn: 'ప్రారంభించండి',
      loginBtn: 'సెషన్ పునరుద్ధరించండి',
      privacyNotice: 'వ్యక్తిగత సమాచారం సేకరించబడదు. విద్యా ప్రయోజనాల కొరకు మాత్రమే.',
      sessionResumed: 'స్వాగతం! మీ ఆర్థిక లెడ్జర్ పునరుద్ధరించబడుతోంది.',
      invalidId: 'ఐడీ STU-XXXX రూపంలో ఉండాలి (ఉదా. STU-2045).',
      quickGuest: 'కొత్త ఐడీని సృష్టించండి',
    },
    onboarding: {
      step1Title: 'స్కాలర్‌షిప్ పత్రం',
      step1Badge: 'దశ 1 / 5',
      step1Desc:
        'అభినందనలు! మీరు ప్రతిష్టాత్మక మెరిట్ స్కాలర్‌షిప్ సాధించారు. నెలకు ₹5,000 మీ ఖాతాలో జమ అవుతుంది.',
      step2Title: 'హాస్టల్ జీవితం',
      step2Desc:
        'మొదట్లో ₹5,000 చాలా పెద్దదిగా అనిపించవచ్చు. కానీ మెస్ ఖర్చులు, పుస్తకాలు మరియు స్నేహితుల కోరికలు మీ క్రమశిక్షణను పరీక్షిస్తాయి.',
      step3Title: '50-30-20 సూత్రం',
      step3Desc:
        'ఒక్క రూపాయి ఖర్చు చేయడానికి ముందే మీ ₹5,000 ను 3 భాగాలుగా విభజించండి:',
      step4Title: 'గేమ్ ప్రపంచం',
      step4Desc:
        '15 నగరాల్లో పర్యటించండి. పాత్రలతో మాట్లాడండి. ప్రతి నిర్ణయం మీ వాలెట్, రిజర్వ్ మరియు స్కోర్‌ను మారుస్తుంది.',
      step5Title: 'మీరు సిద్ధమా?',
      step5Desc:
        'హాస్టల్ కామన్స్‌లో మీ గది సిద్ధంగా ఉంది. పొరపాటు జరిగినా రికవరీ మోడ్ ద్వారా నేర్చుకోవచ్చు. ఆల్ ది బెస్ట్!',
      needsLabel: 'అవసరాలు (మెస్, అద్దె, పుస్తకాలు) - 50% [₹2,500]',
      wantsLabel: 'కోరికలు (టీ, స్నాక్స్, సరదాలు) - 30% [₹1,500]',
      savingsLabel: 'ఎమర్జెన్సీ ఫండ్ - 20% [₹1,000]',
      nextStep: 'తర్వాత',
      prevStep: 'వెనుకకు',
      finishOnboarding: 'హాస్టల్‌లోకి వెళ్లండి',
      controlsKeyboard: 'కదలడానికి WASD లేదా బాణం గుర్తులు',
      controlsSpace: 'మాట్లాడటానికి స్పేస్ లేదా ఎంటర్',
      controlsTouch: 'మొబైల్ కొరకు వర్చువల్ డీ-ప్యాడ్',
    },
    regions: {
      panelTitle: 'వరల్డ్ మ్యాప్ & క్వెస్ట్ లాగ్',
      panelSub: '3 ప్రాంతాలలో 15 విద్యా నగరాలు',
      tabRegion1: '1. స్కాలర్స్ డిస్ట్రిక్ట్',
      tabRegion2: '2. ప్రోస్పెరిటీ ఔట్‌స్కర్ట్స్',
      tabRegion3: '3. గార్డియన్ సిటాడెల్',
      statusCompleted: 'పూర్తయింది',
      statusCurrent: 'యాక్టివ్ క్వెస్ట్',
      statusLocked: 'లాక్ చేయబడింది',
      pillarBadge: 'స్తంభం',
      rewardPoints: 'రివార్డ్: +100 పాయింట్లు',
      exploreCityBtn: 'క్వెస్ట్ వివరాలు',
    },
    pause: {
      menuTitle: 'గేమ్ మెనూ & సెట్టింగ్‌లు',
      resumeGame: 'గేమ్ కొనసాగించండి',
      settingsTab: 'సెట్టింగ్‌లు',
      controlsTab: 'కంట్రోల్స్',
      masterVolume: 'వాల్యూమ్',
      bgmSound: 'సంగీతం',
      sfxSound: 'సౌండ్ ఎఫెక్ట్స్',
      highContrast: 'హై కాంట్రాస్ట్ మోడ్',
      reducedMotion: 'తక్కువ యానిమేషన్',
      retroFont: 'పిక్సెల్ ఫాంట్',
      languageSelect: 'భాష ఎంపిక',
      keyboardControls: 'కీబోర్డ్ షార్ట్‌కట్‌లు',
      movementKeys: 'కదలిక: W, A, S, D లేదా బాణాలు',
      interactionKey: 'సంభాషణ: స్పేస్‌బార్ / ఎంటర్',
      pauseKey: 'మెనూ / పాజ్: Escape కీ',
      touchControls: 'టచ్ స్క్రీన్: వర్చువల్ డీ-ప్యాడ్',
      returnLanding: 'ప్రధాన పేజీకి వెళ్లండి',
      saveQuit: 'సేవ్ చేసి నిష్క్రమించండి',
    },
    achievements: {
      modalTitle: 'విద్యార్థి మైలురాళ్ళు & బ్యాడ్జ్‌లు',
      modalSub: 'నాలుగు ఆర్థిక స్తంభాలలో మీ నైపుణ్యాన్ని నిరూపించుకోండి',
      scholarLevel: 'స్కాలర్ ర్యాంక్',
      totalScore: 'మొత్తం స్కోరు',
      badgesUnlocked: 'సాధించిన బ్యాడ్జ్‌లు',
      financialHealth: 'ఆర్థిక ఆరోగ్య సూచిక',
      pillarMastery: 'స్తంభాల పట్టు',
      viewCertificate: 'సర్టిఫికేట్ చూడండి',
      certificateTitle: 'ఆర్థిక అక్షరాస్యత ధృవీకరణ పత్రం',
      certifiedScholar: 'ధృవీకరించబడిన విద్యార్థి',
      certificateDate: 'పూర్తయిన తేదీ',
      certificateFooter: 'తెలంగాణ ఉన్నత పాఠశాల ఆర్థిక చైతన్య వేదిక ద్వారా ధృవీకరించబడింది.',
      closeCertificate: 'మూసివేయండి',
    },
    feedback: {
      loadingTitle: 'వరల్డ్ లోడ్ అవుతోంది...',
      loadingTip: 'చిట్కా: ఇతర ఖర్చులకు ముందు 20% స్టైపెండ్‌ను ఎమర్జెన్సీ ఫండ్‌గా దాచుకోండి.',
      errorTitle: 'ఏదో పొరపాటు జరిగింది',
      errorSub: 'ఆందోళన చెందవద్దు, మీ ఆర్థిక ఖాతా భద్రంగా ఉంది.',
      retryBtn: 'మళ్లీ ప్రయత్నించండి',
      offlineModeActive: 'ఆఫ్‌లైన్ మోడ్: స్థానిక పాఠ్యాంశాలు అందుబాటులో ఉన్నాయి.',
      emptyTitle: 'ఎలాంటి క్వెస్ట్‌లు లేవు',
      emptySub: 'కొత్త సవాళ్లను కనుగొనడానికి నగరంలోని వ్యక్తులతో మాట్లాడండి.',
    },
  },
};
