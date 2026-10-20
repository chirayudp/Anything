import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { DatabaseSchema, DbOrganization, DbUser, DbStudentProfile, DbSession, DbGameEvent } from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export class Database {
  private static data: DatabaseSchema;
  private static isInitialized = false;

  public static initialize(): void {
    if (this.isInitialized) return;

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        this.isInitialized = true;
        return;
      } catch (e) {
        console.warn('Failed to parse database.json, re-seeding database.', e);
      }
    }

    // Seed initial data
    this.data = this.createInitialSeed();
    this.save();
    this.isInitialized = true;
  }

  private static createInitialSeed(): DatabaseSchema {
    const orgVanguard: DbOrganization = {
      id: 'org_vanguard',
      name: 'Vanguard Youth Empowerment Hyderabad',
      code: 'VGY-HYD',
      createdAt: Date.now() - 30 * 86400000,
    };

    const orgPratham: DbOrganization = {
      id: 'org_pratham',
      name: 'Pratham Telangana Literacy Foundation',
      code: 'PRT-TEL',
      createdAt: Date.now() - 30 * 86400000,
    };

    const studentPasswordHash = bcrypt.hashSync('Scholar@123', 10);
    const staffPasswordHash = bcrypt.hashSync('NgoStaff@2026', 10);
    const prathamStaffPasswordHash = bcrypt.hashSync('NgoMentor@2026', 10);

    const users: DbUser[] = [
      {
        id: 'usr_student_arjun',
        email: 'arjun@student.in',
        passwordHash: studentPasswordHash,
        role: 'student',
        organizationId: 'org_vanguard',
        name: 'Arjun (The Scholar)',
        studentId: 'STU-1042',
        avatar: 'avatar_arjun',
        createdAt: Date.now() - 7 * 86400000,
        lastLoginAt: Date.now() - 1000 * 60 * 30,
      },
      {
        id: 'usr_student_priya',
        email: 'priya@student.in',
        passwordHash: studentPasswordHash,
        role: 'student',
        organizationId: 'org_vanguard',
        name: 'Priya (The Tech Whiz)',
        studentId: 'STU-2088',
        avatar: 'avatar_priya',
        createdAt: Date.now() - 5 * 86400000,
        lastLoginAt: Date.now() - 1000 * 60 * 120,
      },
      {
        id: 'usr_student_rahul',
        email: 'rahul@student.in',
        passwordHash: studentPasswordHash,
        role: 'student',
        organizationId: 'org_pratham',
        name: 'Rahul (The Saver)',
        studentId: 'STU-3015',
        avatar: 'avatar_rahul',
        createdAt: Date.now() - 4 * 86400000,
        lastLoginAt: Date.now() - 1000 * 60 * 60,
      },
      {
        id: 'usr_staff_vanguard',
        email: 'staff@vanguard.org',
        passwordHash: staffPasswordHash,
        role: 'ngo_staff',
        organizationId: 'org_vanguard',
        name: 'Vanguard Educational Officer',
        createdAt: Date.now() - 20 * 86400000,
        lastLoginAt: Date.now() - 1000 * 60 * 10,
      },
      {
        id: 'usr_staff_pratham',
        email: 'mentor@pratham.org',
        passwordHash: prathamStaffPasswordHash,
        role: 'ngo_staff',
        organizationId: 'org_pratham',
        name: 'Pratham District Coordinator',
        createdAt: Date.now() - 20 * 86400000,
        lastLoginAt: Date.now() - 1000 * 60 * 50,
      },
    ];

    const studentProfiles: DbStudentProfile[] = [
      {
        studentId: 'STU-1042',
        userId: 'usr_student_arjun',
        organizationId: 'org_vanguard',
        preferredLanguage: 'en',
        scholarshipStipend: 5000,
        walletBalance: 4200,
        emergencyFund: 1000,
        totalScore: 280,
        currentRegionId: 'region_scholars_district',
        currentCityId: 'city_academic_bazaar',
        completedCityIds: ['city_hostel_commons'],
        failedCityIds: [],
        completedScenarioIds: ['scenario_hostel_stipend', 'scenario_broken_phone'],
        badges: ['Scholarship Recipient', 'Needs vs Wants Master'],
        savedWorldState: {
          cityId: 'city_academic_bazaar',
          x: 480,
          y: 280,
          direction: 'down',
        },
        createdAt: Date.now() - 7 * 86400000,
        lastActiveAt: Date.now() - 1000 * 60 * 30,
      },
      {
        studentId: 'STU-2088',
        userId: 'usr_student_priya',
        organizationId: 'org_vanguard',
        preferredLanguage: 'en',
        scholarshipStipend: 5000,
        walletBalance: 3100,
        emergencyFund: 500,
        totalScore: 190,
        currentRegionId: 'region_scholars_district',
        currentCityId: 'city_hostel_commons',
        completedCityIds: [],
        failedCityIds: ['city_hostel_commons'],
        completedScenarioIds: ['scenario_hostel_stipend'],
        badges: ['Scholarship Recipient'],
        savedWorldState: {
          cityId: 'city_hostel_commons',
          x: 200,
          y: 300,
          direction: 'right',
        },
        createdAt: Date.now() - 5 * 86400000,
        lastActiveAt: Date.now() - 1000 * 60 * 120,
      },
      {
        studentId: 'STU-3015',
        userId: 'usr_student_rahul',
        organizationId: 'org_pratham',
        preferredLanguage: 'te',
        scholarshipStipend: 5000,
        walletBalance: 4800,
        emergencyFund: 1200,
        totalScore: 350,
        currentRegionId: 'region_scholars_district',
        currentCityId: 'city_academic_bazaar',
        completedCityIds: ['city_hostel_commons'],
        failedCityIds: [],
        completedScenarioIds: ['scenario_hostel_stipend', 'scenario_broken_phone', 'scenario_cycle_repair'],
        badges: ['Scholarship Recipient', 'Frugal Rider'],
        savedWorldState: null,
        createdAt: Date.now() - 4 * 86400000,
        lastActiveAt: Date.now() - 1000 * 60 * 60,
      },
    ];

    const gameEvents: DbGameEvent[] = [
      {
        eventId: 'EVT-INIT-001',
        studentId: 'STU-1042',
        organizationId: 'org_vanguard',
        sessionId: 'SESS-INIT-1',
        eventType: 'decision',
        scenarioId: 'scenario_hostel_stipend',
        choiceId: 'choice_budget_first',
        tier: 'best',
        pillar: 'budget',
        walletBefore: 5000,
        walletAfter: 4500,
        emergencyBefore: 0,
        emergencyAfter: 500,
        financialImpact: { walletDelta: -500, emergencyDelta: 500, stressDelta: -10, financialScoreDelta: 100 },
        isFailedState: false,
        isRetry: false,
        retryAttemptNumber: 1,
        hintsUsed: 0,
        feedbackShown: 'Hostel mess fee paid and 10% emergency saved.',
        language: 'en',
        timestamp: Date.now() - 3 * 86400000,
      },
      {
        eventId: 'EVT-INIT-002',
        studentId: 'STU-1042',
        organizationId: 'org_vanguard',
        sessionId: 'SESS-INIT-1',
        eventType: 'decision',
        scenarioId: 'scenario_broken_phone',
        choiceId: 'choice_repair_screen',
        tier: 'best',
        pillar: 'save',
        walletBefore: 4500,
        walletAfter: 4200,
        emergencyBefore: 500,
        emergencyAfter: 1000,
        financialImpact: { walletDelta: -300, emergencyDelta: 500, stressDelta: 0, financialScoreDelta: 100 },
        isFailedState: false,
        isRetry: false,
        retryAttemptNumber: 1,
        hintsUsed: 0,
        feedbackShown: 'Repaired screen at Abids rather than buying a new phone on loan.',
        language: 'en',
        timestamp: Date.now() - 2 * 86400000,
      },
      {
        eventId: 'EVT-INIT-003',
        studentId: 'STU-2088',
        organizationId: 'org_vanguard',
        sessionId: 'SESS-INIT-2',
        eventType: 'decision',
        scenarioId: 'scenario_hostel_stipend',
        choiceId: 'choice_cafe_splurge',
        tier: 'very_bad',
        pillar: 'budget',
        walletBefore: 5000,
        walletAfter: 3100,
        emergencyBefore: 0,
        emergencyAfter: 0,
        financialImpact: { walletDelta: -1900, emergencyDelta: 0, stressDelta: 25, financialScoreDelta: 0 },
        isFailedState: true,
        isRetry: false,
        retryAttemptNumber: 1,
        hintsUsed: 1,
        feedbackShown: 'Splurged entire scholarship at premium cafe before paying mess fees.',
        language: 'en',
        timestamp: Date.now() - 1 * 86400000,
      },
    ];

    return {
      organizations: [orgVanguard, orgPratham],
      users,
      studentProfiles,
      sessions: [],
      gameEvents,
    };
  }

  public static save(): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  // --- Query methods ---

  public static getOrganizations(): DbOrganization[] {
    this.initialize();
    return this.data.organizations;
  }

  public static getOrganizationById(id: string): DbOrganization | undefined {
    this.initialize();
    return this.data.organizations.find((o) => o.id === id);
  }

  public static findUserByEmail(email: string): DbUser | undefined {
    this.initialize();
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public static findUserById(id: string): DbUser | undefined {
    this.initialize();
    return this.data.users.find((u) => u.id === id);
  }

  public static findUserByStudentId(studentId: string): DbUser | undefined {
    this.initialize();
    return this.data.users.find((u) => u.studentId === studentId);
  }

  public static createUser(user: DbUser): DbUser {
    this.initialize();
    this.data.users.push(user);
    this.save();
    return user;
  }

  public static updateUser(id: string, updates: Partial<DbUser>): DbUser | undefined {
    this.initialize();
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  public static getStudentProfile(studentId: string): DbStudentProfile | undefined {
    this.initialize();
    return this.data.studentProfiles.find((p) => p.studentId === studentId);
  }

  public static getStudentProfileByUserId(userId: string): DbStudentProfile | undefined {
    this.initialize();
    return this.data.studentProfiles.find((p) => p.userId === userId);
  }

  public static getStudentProfilesByOrganization(orgId: string): DbStudentProfile[] {
    this.initialize();
    return this.data.studentProfiles.filter((p) => p.organizationId === orgId);
  }

  public static createStudentProfile(profile: DbStudentProfile): DbStudentProfile {
    this.initialize();
    this.data.studentProfiles.push(profile);
    this.save();
    return profile;
  }

  public static updateStudentProfile(
    studentId: string,
    updates: Partial<DbStudentProfile>
  ): DbStudentProfile | undefined {
    this.initialize();
    const idx = this.data.studentProfiles.findIndex((p) => p.studentId === studentId);
    if (idx === -1) return undefined;
    this.data.studentProfiles[idx] = {
      ...this.data.studentProfiles[idx],
      ...updates,
      lastActiveAt: Date.now(),
    };
    this.save();
    return this.data.studentProfiles[idx];
  }

  public static addGameEvent(event: DbGameEvent): DbGameEvent {
    this.initialize();
    // Idempotency: check if eventId already exists
    const exists = this.data.gameEvents.some((e) => e.eventId === event.eventId);
    if (!exists) {
      this.data.gameEvents.push(event);
      this.save();
    }
    return event;
  }

  public static getGameEventsForStudent(studentId: string): DbGameEvent[] {
    this.initialize();
    return this.data.gameEvents
      .filter((e) => e.studentId === studentId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  public static getGameEventsByOrganization(orgId: string): DbGameEvent[] {
    this.initialize();
    return this.data.gameEvents
      .filter((e) => e.organizationId === orgId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  public static addSession(session: DbSession): DbSession {
    this.initialize();
    this.data.sessions.push(session);
    this.save();
    return session;
  }

  public static endSession(sessionId: string): void {
    this.initialize();
    const session = this.data.sessions.find((s) => s.id === sessionId);
    if (session) {
      session.endedAt = Date.now();
      this.save();
    }
  }

  public static resetForTesting(): void {
    this.data = this.createInitialSeed();
    this.save();
    this.isInitialized = true;
  }
}
