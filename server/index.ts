import path from 'path';
import { fileURLToPath } from 'url';
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Database } from './db/database';
import {
  AuthService,
  requireAuth,
  requireRole,
  requireStudentSelf,
  requireNgoOrgScope,
  AuthenticatedRequest,
} from './auth';
import { DbUser, DbStudentProfile, DbGameEvent } from './db/types';
import { LearningPillar } from '../src/types/puzzles';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Initialize database
Database.initialize();

app.use(cors());
app.use(express.json());

// In-memory store for legacy fallback
const decisionEventsStore: any[] = [];

/**
 * Health check
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'MoneyQuest Backend Engine & Auth Portal',
    geminiConfigured: !!GEMINI_API_KEY,
    totalEventsLogged: decisionEventsStore.length,
    timestamp: new Date().toISOString(),
  });
});

// =========================================================================
// 1. AUTHENTICATION & ACCESS CONTROL ENDPOINTS
// =========================================================================

/**
 * Public: List partner NGOs/Organizations for registration dropdown
 */
app.get('/api/auth/organizations', (_req: Request, res: Response) => {
  const orgs = Database.getOrganizations().map((o) => ({
    id: o.id,
    name: o.name,
    code: o.code,
  }));
  return res.json({ organizations: orgs });
});

/**
 * Public: Register a new student account
 * Public registration is STRICTLY limited to the 'student' role.
 * NGO staff accounts cannot be created through this route.
 */
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password, name, avatar, organizationId, preferredLanguage } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and student name are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const existing = Database.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  // Validate or default organization
  const org = organizationId ? Database.getOrganizationById(organizationId) : Database.getOrganizations()[0];
  const assignedOrgId = org ? org.id : 'org_vanguard';

  // Generate unique student ID (STU-XXXX)
  let studentIdNum = Math.floor(1000 + Math.random() * 9000);
  let studentId = `STU-${studentIdNum}`;
  while (Database.getStudentProfile(studentId)) {
    studentIdNum = Math.floor(1000 + Math.random() * 9000);
    studentId = `STU-${studentIdNum}`;
  }

  const userId = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const passwordHash = AuthService.hashPassword(password);

  const newUser: DbUser = {
    id: userId,
    email: email.trim().toLowerCase(),
    passwordHash,
    role: 'student', // Strictly enforced!
    organizationId: assignedOrgId,
    name: name.trim(),
    studentId,
    avatar: avatar || 'avatar_arjun',
    createdAt: Date.now(),
    lastLoginAt: Date.now(),
  };

  Database.createUser(newUser);

  const newProfile: DbStudentProfile = {
    studentId,
    userId,
    organizationId: assignedOrgId,
    preferredLanguage: preferredLanguage || 'en',
    scholarshipStipend: 5000,
    walletBalance: 5000,
    emergencyFund: 0,
    totalScore: 0,
    currentRegionId: 'region_scholars_district',
    currentCityId: 'city_hostel_commons',
    completedCityIds: [],
    failedCityIds: [],
    completedScenarioIds: [],
    badges: ['Scholarship Recipient'],
    savedWorldState: null,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
  };

  Database.createStudentProfile(newProfile);

  const token = AuthService.generateToken(newUser);

  return res.status(201).json({
    message: 'Student account registered successfully.',
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      studentId: newUser.studentId,
      organizationId: newUser.organizationId,
      avatar: newUser.avatar,
    },
    profile: newProfile,
  });
});

/**
 * Public: User Login (supports students and NGO staff)
 */
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, expectedRole } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = Database.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isPasswordValid = AuthService.comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // If client specifies an expectedRole (e.g. logging in via /ngo/login), verify role
  if (expectedRole && user.role !== expectedRole) {
    if (expectedRole === 'ngo_staff' && user.role === 'student') {
      return res.status(403).json({
        error: 'Access denied: This account is a student account. Please use the Student Login page.',
      });
    }
    if (expectedRole === 'student' && user.role === 'ngo_staff') {
      return res.status(403).json({
        error: 'Access denied: This is an NGO staff account. Please use the NGO Portal.',
      });
    }
  }

  // Update last login
  Database.updateUser(user.id, { lastLoginAt: Date.now() });

  const token = AuthService.generateToken(user);
  let profile: DbStudentProfile | undefined = undefined;
  if (user.role === 'student' && user.studentId) {
    profile = Database.getStudentProfile(user.studentId);
  }

  return res.json({
    message: 'Login successful.',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      studentId: user.studentId,
      organizationId: user.organizationId,
      avatar: user.avatar,
    },
    profile,
  });
});

/**
 * Protected: Get current authenticated user session
 */
app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = Database.findUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  let profile: DbStudentProfile | undefined = undefined;
  if (user.role === 'student' && user.studentId) {
    profile = Database.getStudentProfile(user.studentId);
  }

  const org = Database.getOrganizationById(user.organizationId);

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      studentId: user.studentId,
      organizationId: user.organizationId,
      organizationName: org ? org.name : undefined,
      avatar: user.avatar,
    },
    profile,
  });
});

// =========================================================================
// 2. STUDENT PORTAL DATA ENDPOINTS (Scoped strictly to authenticated student)
// =========================================================================

/**
 * Protected: Get authenticated student's personal profile
 */
app.get('/api/student/profile', requireAuth, requireRole(['student']), (req: AuthenticatedRequest, res: Response) => {
  const studentId = req.user!.studentId!;
  const profile = Database.getStudentProfile(studentId);
  if (!profile) {
    return res.status(404).json({ error: 'Student profile not found.' });
  }
  return res.json({ profile });
});

/**
 * Protected: Update student's personal game progress & world state
 */
app.put('/api/student/profile', requireAuth, requireRole(['student']), (req: AuthenticatedRequest, res: Response) => {
  const studentId = req.user!.studentId!;
  const updates = req.body;

  // Prevent modifying immutable tenancy keys
  delete updates.studentId;
  delete updates.userId;
  delete updates.organizationId;

  const updatedProfile = Database.updateStudentProfile(studentId, updates);
  if (!updatedProfile) {
    return res.status(404).json({ error: 'Student profile not found.' });
  }

  return res.json({ profile: updatedProfile });
});

/**
 * Protected: Record a game decision / event against the student's ID
 */
app.post('/api/student/events', requireAuth, requireRole(['student']), (req: AuthenticatedRequest, res: Response) => {
  const studentId = req.user!.studentId!;
  const organizationId = req.user!.organizationId;
  const eventData = req.body;

  if (!eventData || !eventData.eventType) {
    return res.status(400).json({ error: 'Invalid event payload: eventType is required.' });
  }

  const event: DbGameEvent = {
    ...eventData,
    eventId: eventData.eventId || `EVT-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    studentId, // STRICTLY bind to authenticated student
    organizationId, // STRICTLY bind to student's org
    timestamp: eventData.timestamp || Date.now(),
  };

  Database.addGameEvent(event);

  // If this was a decision that unlocked progress, sync profile if provided
  if (eventData.updatedProfile) {
    Database.updateStudentProfile(studentId, eventData.updatedProfile);
  }

  return res.status(201).json({ status: 'recorded', eventId: event.eventId });
});

/**
 * Protected: Fetch student's own chronological event audit trail
 */
app.get('/api/student/events', requireAuth, requireRole(['student']), (req: AuthenticatedRequest, res: Response) => {
  const studentId = req.user!.studentId!;
  const events = Database.getGameEventsForStudent(studentId);
  return res.json({ events });
});

// =========================================================================
// 3. NGO MONITORING PORTAL ENDPOINTS (Scoped strictly to staff's organization)
// =========================================================================

/**
 * Helper: detect learning gaps from events
 */
function detectLearningGapsForStudent(studentEvents: DbGameEvent[]) {
  const gaps: Array<{
    pillar: LearningPillar;
    errorFrequency: number;
    recurringPattern: string;
    recommendedTopic: string;
    resourceTitle: string;
  }> = [];

  const pillars: LearningPillar[] = ['budget', 'save', 'invest', 'safety'];

  for (const pillar of pillars) {
    const pillarEvents = studentEvents.filter((e) => e.pillar === pillar);
    const failedEvents = pillarEvents.filter((e) => e.isFailedState);

    if (failedEvents.length >= 1) {
      let pattern = '';
      let recommendation = '';
      let resource = '';

      switch (pillar) {
        case 'budget':
          pattern = 'Balancing fixed essentials (mess, rent) against peer discretionary spending.';
          recommendation = 'Practice the 50-30-20 rule; clear mandatory bills before cafe treats.';
          resource = 'Mastering Student Needs vs. Wants';
          break;
        case 'save':
          pattern = 'Delaying or omitting emergency reserve contributions before lifestyle spending.';
          recommendation = 'Set aside at least 10-20% of monthly stipend into a protected reserve.';
          resource = 'Building Your First Student Rainy-Day Fund';
          break;
        case 'invest':
          pattern = 'Vulnerability to get-rich-quick claims or leaving capital uninvested against inflation.';
          recommendation = 'Study how compounding rewards long-term discipline in regulated instruments.';
          resource = 'Compounding and the 8th Wonder of the World';
          break;
        case 'safety':
          pattern = 'Susceptibility to UPI QR codes, phishing links, or entering PIN to receive funds.';
          recommendation = 'Never enter a UPI PIN to receive money; dial Telangana helpline 1930.';
          resource = 'Digital Armor: Spotting Online Financial Scams';
          break;
      }

      gaps.push({
        pillar,
        errorFrequency: failedEvents.length,
        recurringPattern: pattern,
        recommendedTopic: recommendation,
        resourceTitle: resource,
      });
    }
  }

  return gaps;
}

/**
 * Protected: NGO Dashboard Cohort Overview
 * Scoped strictly to the authenticated NGO staff member's organization.
 */
app.get('/api/ngo/overview', requireAuth, requireRole(['ngo_staff', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const org = Database.getOrganizationById(orgId);
  const students = Database.getStudentProfilesByOrganization(orgId);
  const events = Database.getGameEventsByOrganization(orgId);

  const totalAssignedStudents = students.length;
  const activeCutoff = Date.now() - 7 * 86400000;
  const activeStudents = students.filter((s) => s.lastActiveAt >= activeCutoff);

  // Overall game completion calculation (total completed scenarios across cohort / (students * 15))
  const totalCompletedScenarios = students.reduce((sum, s) => sum + (s.completedScenarioIds?.length || 0), 0);
  const totalPossibleScenarios = Math.max(totalAssignedStudents * 15, 1);
  const overallCompletionRate = Math.min(Math.round((totalCompletedScenarios / totalPossibleScenarios) * 100), 100);

  // 4 Pillars Mastery
  const pillars: LearningPillar[] = ['budget', 'save', 'invest', 'safety'];
  const pillarBreakdown: Record<string, any> = {};

  for (const pillar of pillars) {
    const pEvents = events.filter((e) => e.pillar === pillar);
    const bestCount = pEvents.filter((e) => e.tier === 'best').length;
    const failedCount = pEvents.filter((e) => e.isFailedState).length;
    const total = pEvents.length;

    pillarBreakdown[pillar] = {
      pillar,
      totalAttempts: total,
      bestAttempts: bestCount,
      failedAttempts: failedCount,
      masteryPercentage: total > 0 ? Math.round((bestCount / total) * 100) : 0,
    };
  }

  // Students who may need additional support
  const studentsNeedingSupport = students
    .map((s) => {
      const sEvents = events.filter((e) => e.studentId === s.studentId);
      const fails = sEvents.filter((e) => e.isFailedState).length;
      const gaps = detectLearningGapsForStudent(sEvents);
      const isBankrupt = s.walletBalance <= 0;
      const isStruggling = fails >= 2 || isBankrupt || gaps.length >= 2;

      let primaryIndicator = '';
      if (isBankrupt) primaryIndicator = 'Stipend depleted (Bankruptcy)';
      else if (fails >= 2) primaryIndicator = `${fails} trap decisions encountered`;
      else if (gaps.length >= 2) primaryIndicator = 'Multiple pillar gaps flagged';

      return {
        studentId: s.studentId,
        walletBalance: s.walletBalance,
        emergencyFund: s.emergencyFund,
        completedScenariosCount: s.completedScenarioIds?.length || 0,
        failedAttemptsCount: fails,
        learningGapsCount: gaps.length,
        isNeedingSupport: isStruggling,
        primaryIndicator,
        lastActiveAt: s.lastActiveAt,
      };
    })
    .filter((s) => s.isNeedingSupport);

  return res.json({
    organization: {
      id: orgId,
      name: org ? org.name : 'Authorized NGO',
      code: org ? org.code : 'NGO',
    },
    overview: {
      totalAssignedStudents,
      activeStudentsCount: activeStudents.length,
      overallCompletionRate,
      totalEventsLogged: events.length,
      pillarBreakdown,
      studentsNeedingSupportCount: studentsNeedingSupport.length,
      studentsNeedingSupport,
      recentEvents: events.slice(0, 15),
    },
  });
});

/**
 * Protected: List assigned students with search, filters, and support indicators
 * Scoped strictly to the staff member's assigned organization.
 */
app.get('/api/ngo/students', requireAuth, requireRole(['ngo_staff', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const query = (req.query.q as string || '').toLowerCase().trim();
  const filterSupport = req.query.needsSupport === 'true';

  const students = Database.getStudentProfilesByOrganization(orgId);
  const events = Database.getGameEventsByOrganization(orgId);

  let results = students.map((s) => {
    const user = Database.findUserByStudentId(s.studentId);
    const sEvents = events.filter((e) => e.studentId === s.studentId);
    const fails = sEvents.filter((e) => e.isFailedState).length;
    const passes = sEvents.filter((e) => !e.isFailedState && e.eventType === 'decision').length;
    const gaps = detectLearningGapsForStudent(sEvents);
    const isNeedingSupport = s.walletBalance <= 0 || fails >= 2 || gaps.length >= 2;

    return {
      studentId: s.studentId,
      name: user ? user.name : `Scholar ${s.studentId}`,
      email: user ? user.email : '',
      currentRegionId: s.currentRegionId,
      currentCityId: s.currentCityId,
      walletBalance: s.walletBalance,
      emergencyFund: s.emergencyFund,
      totalScore: s.totalScore,
      completedScenariosCount: s.completedScenarioIds?.length || 0,
      totalAttempts: sEvents.length,
      passedAttempts: passes,
      failedAttempts: fails,
      learningGapsCount: gaps.length,
      isNeedingSupport,
      lastActiveAt: s.lastActiveAt,
      createdAt: s.createdAt,
    };
  });

  if (query) {
    results = results.filter(
      (s) =>
        s.studentId.toLowerCase().includes(query) ||
        s.name.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.currentCityId.toLowerCase().includes(query)
    );
  }

  if (filterSupport) {
    results = results.filter((s) => s.isNeedingSupport);
  }

  return res.json({ students: results });
});

/**
 * Protected: Get detailed profile and activity audit for a specific student
 * Scoped strictly via requireNgoOrgScope: Staff can NEVER see a student outside their org.
 */
app.get('/api/ngo/students/:studentId', requireAuth, requireNgoOrgScope, (req: AuthenticatedRequest, res: Response) => {
  const { studentId } = req.params;
  const profile = Database.getStudentProfile(studentId);

  if (!profile) {
    return res.status(404).json({ error: 'Student profile not found.' });
  }

  const user = Database.findUserByStudentId(studentId);
  const events = Database.getGameEventsForStudent(studentId);

  // Performance by pillar
  const pillars: LearningPillar[] = ['budget', 'save', 'invest', 'safety'];
  const pillarPerformance: Record<string, any> = {};

  for (const pillar of pillars) {
    const pEvents = events.filter((e) => e.pillar === pillar);
    const best = pEvents.filter((e) => e.tier === 'best').length;
    const good = pEvents.filter((e) => e.tier === 'good' || e.tier === 'better').length;
    const failed = pEvents.filter((e) => e.isFailedState).length;
    const hints = pEvents.reduce((acc, cur) => acc + (cur.hintsUsed || 0), 0);

    pillarPerformance[pillar] = {
      pillar,
      totalAttempts: pEvents.length,
      bestChoices: best,
      moderateChoices: good,
      failedChoices: failed,
      hintsUsed: hints,
      masteryRate: pEvents.length > 0 ? Math.round((best / pEvents.length) * 100) : 0,
    };
  }

  const learningGaps = detectLearningGapsForStudent(events);

  return res.json({
    student: {
      studentId: profile.studentId,
      name: user ? user.name : `Scholar ${profile.studentId}`,
      email: user ? user.email : '',
      organizationId: profile.organizationId,
      preferredLanguage: profile.preferredLanguage,
      currentRegionId: profile.currentRegionId,
      currentCityId: profile.currentCityId,
      walletBalance: profile.walletBalance,
      emergencyFund: profile.emergencyFund,
      totalScore: profile.totalScore,
      completedCityIds: profile.completedCityIds,
      completedScenarioIds: profile.completedScenarioIds,
      badges: profile.badges,
      createdAt: profile.createdAt,
      lastActiveAt: profile.lastActiveAt,
    },
    performanceByPillar: pillarPerformance,
    learningGaps,
    events,
    auditSummary: {
      totalDecisions: events.filter((e) => e.eventType === 'decision').length,
      totalRetries: events.filter((e) => e.isRetry).length,
      totalTrapsEncountered: events.filter((e) => e.isFailedState).length,
      totalHintsRequested: events.reduce((acc, cur) => acc + (cur.hintsUsed || 0), 0),
    },
  });
});

// =========================================================================
// 4. GEMINI AI PROXY ENDPOINTS (Deterministic Educational Fallback)
// =========================================================================

/**
 * AI Explanation Proxy endpoint (Gemini API with secure server-side key)
 */
app.post('/api/ai/explain', async (req: Request, res: Response) => {
  const { scenarioTitle, scenarioContext, pillar, chosenOptionText, tier, financialImpact, language } = req.body;

  if (!GEMINI_API_KEY) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY not configured on server. Use fallback.',
      isAiGenerated: false,
    });
  }

  try {
    const prompt = `You are an empathetic, encouraging financial educator for Class 11-12 students in Hyderabad, India.
Scenario: "${scenarioTitle}"
Situation: ${scenarioContext}
Learning Pillar: ${pillar}
Student's Choice: "${chosenOptionText}" (Evaluated tier: ${tier})
Outcome Impact: ₹${financialImpact.walletDelta} wallet, ₹${financialImpact.emergencyDelta} savings.
Language: ${language || 'English'}

Provide a brief, supportive explanation (under 3 sentences) explaining why this financial decision led to this outcome. Give one practical relatable tip for a student living in Hyderabad. Do NOT give real-world investment advice.

Format as JSON:
{
  "explanation": "...",
  "pedagogicalTakeaway": "...",
  "relatableHyderabadStudentContext": "...",
  "encouragingTip": "..."
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(rawText);

    return res.json({
      ...parsed,
      isAiGenerated: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to generate AI explanation',
      isAiGenerated: false,
    });
  }
});

/**
 * AI Hint Proxy endpoint
 */
app.post('/api/ai/hint', async (req: Request, res: Response) => {
  const { scenarioTitle, pillar, language } = req.body;

  if (!GEMINI_API_KEY) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY not configured. Use fallback.',
      isAiGenerated: false,
    });
  }

  try {
    const prompt = `Provide a single, clever, encouraging hint (maximum 20 words) for a Class 11 student in Hyderabad facing the scenario: "${scenarioTitle}" on the topic of ${pillar}. Do NOT give away the exact answer. Language: ${language || 'English'}.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const hint = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    return res.json({ hint, isAiGenerated: true });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to generate hint', isAiGenerated: false });
  }
});

// =========================================================================
// 5. BACKWARD-COMPATIBLE LEGACY EVENT SYNC
// =========================================================================

app.post('/api/analytics/events', (req: Request, res: Response) => {
  const event = req.body;
  if (!event || !event.eventId) {
    return res.status(400).json({ error: 'Invalid event payload' });
  }

  decisionEventsStore.push(event);

  // If studentId exists, store in persistent DB with default org
  if (event.studentId) {
    const profile = Database.getStudentProfile(event.studentId);
    Database.addGameEvent({
      ...event,
      organizationId: profile ? profile.organizationId : 'org_vanguard',
      eventType: event.eventType || 'decision',
    });
  }

  return res.status(201).json({ status: 'recorded', count: decisionEventsStore.length });
});

app.get('/api/analytics/overview', (_req: Request, res: Response) => {
  return res.json({
    totalEvents: decisionEventsStore.length,
    events: decisionEventsStore,
  });
});

const currentFile = fileURLToPath(import.meta.url);
const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === currentFile;

if (isDirectExecution) {
  app.listen(PORT, () => {
    console.log(`MoneyQuest backend engine running on http://localhost:${PORT}`);
  });
}

export default app;
