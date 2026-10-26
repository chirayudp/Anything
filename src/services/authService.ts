import { StudentProfile, GameLanguage } from '../types';

export type UserRole = 'student' | 'ngo_staff' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  studentId?: string;
  organizationId: string;
  organizationName?: string;
  avatar?: string;
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  profile: StudentProfile | null;
}

// ---------------------------------------------------------------------------
// Static-hosting offline demo credentials
// These mirror server/data/database.json so the game works on GitHub Pages
// without the Express backend. Plain-text password comparison is acceptable
// for a non-production educational demo.
// ---------------------------------------------------------------------------
const STATIC_DEMO_USERS: {
  email: string;
  password: string;
  user: AuthUser;
  profile: StudentProfile | null;
}[] = [
  {
    email: 'arjun@student.in',
    password: 'Scholar@123',
    user: {
      id: 'usr_student_arjun',
      email: 'arjun@student.in',
      name: 'Arjun (The Scholar)',
      role: 'student',
      studentId: 'STU-1042',
      organizationId: 'org_vanguard',
      organizationName: 'Vanguard Youth Empowerment Hyderabad',
      avatar: 'avatar_arjun',
    },
    profile: {
      studentId: 'STU-1042',
      sessionId: 'SESS-arjun',
      preferredLanguage: 'en',
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
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      isNewUser: true,
    },
  },
  {
    email: 'priya@student.in',
    password: 'Scholar@123',
    user: {
      id: 'usr_student_priya',
      email: 'priya@student.in',
      name: 'Priya (The Tech Whiz)',
      role: 'student',
      studentId: 'STU-2088',
      organizationId: 'org_vanguard',
      organizationName: 'Vanguard Youth Empowerment Hyderabad',
      avatar: 'avatar_priya',
    },
    profile: {
      studentId: 'STU-2088',
      sessionId: 'SESS-priya',
      preferredLanguage: 'en',
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
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      isNewUser: true,
    },
  },
  {
    email: 'rahul@student.in',
    password: 'Scholar@123',
    user: {
      id: 'usr_student_rahul',
      email: 'rahul@student.in',
      name: 'Rahul (The Saver)',
      role: 'student',
      studentId: 'STU-3015',
      organizationId: 'org_pratham',
      organizationName: 'Pratham Telangana Literacy Foundation',
      avatar: 'avatar_rahul',
    },
    profile: {
      studentId: 'STU-3015',
      sessionId: 'SESS-rahul',
      preferredLanguage: 'en',
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
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      isNewUser: true,
    },
  },
  {
    email: 'staff@vanguard.org',
    password: 'NgoStaff@2026',
    user: {
      id: 'usr_staff_vanguard',
      email: 'staff@vanguard.org',
      name: 'Vanguard Educational Officer',
      role: 'ngo_staff',
      organizationId: 'org_vanguard',
      organizationName: 'Vanguard Youth Empowerment Hyderabad',
    },
    profile: null,
  },
  {
    email: 'mentor@pratham.org',
    password: 'NgoMentor@2026',
    user: {
      id: 'usr_staff_pratham',
      email: 'mentor@pratham.org',
      name: 'Pratham District Coordinator',
      role: 'ngo_staff',
      organizationId: 'org_pratham',
      organizationName: 'Pratham Telangana Literacy Foundation',
    },
    profile: null,
  },
];

const STORAGE_KEY_TOKEN = 'moneyquest_auth_token';
const STORAGE_KEY_USER = 'moneyquest_auth_user';
const STORAGE_KEY_STUDENT_PROFILE = 'moneyquest_student_profile';

export class AuthService {
  private static token: string | null = null;
  private static user: AuthUser | null = null;
  private static profile: StudentProfile | null = null;
  private static listeners: Array<(state: AuthState) => void> = [];

  public static initialize(): void {
    if (typeof window === 'undefined') return;

    try {
      this.token = window.localStorage.getItem(STORAGE_KEY_TOKEN);
      const userStr = window.localStorage.getItem(STORAGE_KEY_USER);
      if (userStr) {
        this.user = JSON.parse(userStr);
      }
      const profStr = window.localStorage.getItem(STORAGE_KEY_STUDENT_PROFILE);
      if (profStr) {
        this.profile = JSON.parse(profStr);
      }
    } catch (e) {
      console.warn('Failed to restore auth from localStorage', e);
    }
  }

  public static getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = window.localStorage.getItem(STORAGE_KEY_TOKEN);
    }
    return this.token;
  }

  public static getUser(): AuthUser | null {
    if (!this.user && typeof window !== 'undefined') {
      const userStr = window.localStorage.getItem(STORAGE_KEY_USER);
      if (userStr) {
        try {
          this.user = JSON.parse(userStr);
        } catch {}
      }
    }
    return this.user;
  }

  public static getProfile(): StudentProfile | null {
    if (!this.profile && typeof window !== 'undefined') {
      const profStr = window.localStorage.getItem(STORAGE_KEY_STUDENT_PROFILE);
      if (profStr) {
        try {
          this.profile = JSON.parse(profStr);
        } catch {}
      }
    }
    return this.profile;
  }

  public static isStudentAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!token && !!user && user.role === 'student';
  }

  public static isNgoAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!token && !!user && (user.role === 'ngo_staff' || user.role === 'admin');
  }

  private static async safeParseJson(res: Response): Promise<any> {
    try {
      const text = await res.text();
      if (!text || text.trim().length === 0) {
        return {};
      }
      return JSON.parse(text);
    } catch {
      return {};
    }
  }

  /**
   * Static-host offline registration — creates a new local-only student.
   * Persists to localStorage so the user can re-login within the same browser.
   */
  private static staticRegister(params: {
    email: string;
    password: string;
    name: string;
    avatar?: string;
  }): { user: AuthUser; profile: StudentProfile; token: string } {
    const emailLC = params.email.trim().toLowerCase();
    const now = Date.now();
    const userId = `usr_${now}_${Math.floor(Math.random() * 1000)}`;
    const studentId = `STU-${Math.floor(1000 + Math.random() * 9000)}`;
    const token = `local_${now}_${Math.random().toString(36).slice(2)}`;

    const user: AuthUser = {
      id: userId,
      email: emailLC,
      name: params.name.trim() || emailLC.split('@')[0],
      role: 'student',
      studentId,
      organizationId: 'org_vanguard',
      organizationName: 'Vanguard Youth Empowerment Hyderabad',
      avatar: params.avatar || 'avatar_arjun',
    };

    const profile: StudentProfile = {
      studentId,
      sessionId: `SESS-${now}`,
      preferredLanguage: 'en',
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
      createdAt: now,
      lastActiveAt: now,
      isNewUser: true,
    };

    // Persist so the user can log in again later this session
    try {
      const stored = JSON.parse(localStorage.getItem('mq_custom_users') || '[]');
      stored.push({ email: emailLC, password: params.password, user, profile });
      localStorage.setItem('mq_custom_users', JSON.stringify(stored));
    } catch {}

    return { user, profile, token };
  }

  /**
   * Returns true when the HTTP response is from a static file server
   * (GitHub Pages, Netlify, etc.) rather than our real Express API.
   * Static servers return text/html for all unknown routes.
   */
  private static isStaticServerResponse(res: Response): boolean {
    const ct = res.headers.get('content-type') ?? '';
    // 405 = static server doesn't support POST
    // text/html body = GitHub Pages error page, not our JSON API
    return res.status === 405 || ct.includes('text/html');
  }

  public static async registerStudent(params: {
    email: string;
    password: string;
    name: string;
    avatar?: string;
    organizationId?: string;
    preferredLanguage?: GameLanguage;
  }): Promise<{ user: AuthUser; profile: StudentProfile; token: string }> {
    // Try backend first (local dev / full-stack deploy)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          email: params.email.trim().toLowerCase(),
        }),
      });

      // If response is from static host (405, HTML body) → fall through to offline
      if (this.isStaticServerResponse(res)) {
        throw new Error('__STATIC_HOST__');
      }

      const data = await this.safeParseJson(res);
      if (res.ok) {
        this.setSession(data.token, data.user, data.profile);
        return data;
      }
      // Real API error (e.g. email already taken) — propagate
      throw new Error(data.error || `Registration failed with status ${res.status}`);
    } catch (err: any) {
      const msg: string = err?.message ?? '';
      // Only fall through to offline if it's a network/static-host issue
      if (msg !== '__STATIC_HOST__' && msg && !msg.toLowerCase().includes('fetch') && !msg.toLowerCase().includes('network') && !msg.toLowerCase().includes('failed to fetch')) {
        throw err;
      }
      // Network / server unreachable / static host → fall through to offline mode
    }

    // Offline / GitHub Pages fallback
    const data = this.staticRegister(params);
    this.setSession(data.token, data.user, data.profile);
    return data;
  }

  public static async login(
    email: string,
    password: string,
    expectedRole?: UserRole
  ): Promise<{ user: AuthUser; profile?: StudentProfile; token: string }> {
    // Try backend first (local dev / full-stack deploy)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          expectedRole,
        }),
      });

      // If response is from static host (405, HTML body) → fall through to offline
      if (this.isStaticServerResponse(res)) {
        throw new Error('__STATIC_HOST__');
      }

      const data = await this.safeParseJson(res);
      if (res.ok) {
        this.setSession(data.token, data.user, data.profile);
        return data;
      }
      // Real API 4xx error = wrong credentials — propagate without offline fallback
      throw new Error(data.error || `Login failed with status ${res.status}`);
    } catch (err: any) {
      const msg: string = err?.message ?? '';
      if (msg !== '__STATIC_HOST__' && msg && !msg.toLowerCase().includes('fetch') && !msg.toLowerCase().includes('network') && !msg.toLowerCase().includes('failed to fetch') && !msg.toLowerCase().includes('networkerror')) {
        throw err;
      }
      // Network / server unreachable / static host → offline fallback
    }

    // ---------------------------------------------------------------------------
    // Offline login for GitHub Pages / static hosting
    // ---------------------------------------------------------------------------
    const emailLC = email.trim().toLowerCase();

    // 1. Check locally registered custom users (from registerStudent offline)
    try {
      const customUsers: Array<{ email: string; password: string; user: AuthUser; profile: StudentProfile }> =
        JSON.parse(localStorage.getItem('mq_custom_users') || '[]');
      const match = customUsers.find((u) => u.email === emailLC && u.password === password);
      if (match) {
        if (expectedRole && match.user.role !== expectedRole) {
          throw new Error('Access denied: wrong account type.');
        }
        const token = `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        this.setSession(token, match.user, match.profile);
        return { token, user: match.user, profile: match.profile };
      }
    } catch (e: any) {
      if (e?.message === 'Access denied: wrong account type.') throw e;
    }

    // 2. Check built-in demo accounts
    const demo = STATIC_DEMO_USERS.find(
      (u) => u.email === emailLC && u.password === password
    );
    if (!demo) {
      throw new Error(
        'Invalid email or password. On this demo site, use: arjun@student.in / Scholar@123, priya@student.in / Scholar@123, rahul@student.in / Scholar@123, staff@vanguard.org / NgoStaff@2026, or mentor@pratham.org / NgoMentor@2026.'
      );
    }
    if (expectedRole && demo.user.role !== expectedRole) {
      throw new Error(`Access denied: this account is not a ${expectedRole}.`);
    }

    const token = `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    this.setSession(token, demo.user, demo.profile ?? undefined);
    return { token, user: demo.user, profile: demo.profile ?? undefined };
  }

  public static async fetchCurrentUser(): Promise<AuthUser | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        // On static hosting /api/auth/me doesn't exist — keep the local session
        if (res.status === 404 || res.headers.get('content-type')?.includes('text/html')) {
          return this.getUser();
        }
        this.logout();
        return null;
      }

      const data = await this.safeParseJson(res);
      if (data && data.user) {
        this.setSession(token, data.user, data.profile);
        return data.user;
      }
      return null;
    } catch {
      return this.getUser();
    }
  }

  public static setSession(token: string, user: AuthUser, profile?: StudentProfile | null): void {
    this.token = token;
    this.user = user;
    if (profile) {
      this.profile = profile;
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY_TOKEN, token);
      window.localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      if (profile) {
        window.localStorage.setItem(STORAGE_KEY_STUDENT_PROFILE, JSON.stringify(profile));
      }
    }

    this.notify();
  }

  public static updateStudentProfile(profile: StudentProfile): void {
    this.profile = profile;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY_STUDENT_PROFILE, JSON.stringify(profile));
    }
    this.notify();

    // Async sync to server (silently ignored on static hosting)
    const token = this.getToken();
    if (token && this.user?.role === 'student') {
      fetch('/api/student/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      }).catch(() => {/* silent on static hosting */});
    }
  }

  public static logout(): void {
    this.token = null;
    this.user = null;
    this.profile = null;

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY_TOKEN);
      window.localStorage.removeItem(STORAGE_KEY_USER);
      window.localStorage.removeItem(STORAGE_KEY_STUDENT_PROFILE);
      window.localStorage.removeItem('moneyquest_last_screen');
      window.localStorage.removeItem('moneyquest_world_state');
    }

    this.notify();
  }

  public static subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    listener({
      token: this.token,
      user: this.user,
      profile: this.profile,
    });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private static notify(): void {
    const state: AuthState = {
      token: this.token,
      user: this.user,
      profile: this.profile,
    };
    this.listeners.forEach((l) => l(state));
  }
}

AuthService.initialize();
