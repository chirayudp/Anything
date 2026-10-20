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

  public static async registerStudent(params: {
    email: string;
    password: string;
    name: string;
    avatar?: string;
    organizationId?: string;
    preferredLanguage?: GameLanguage;
  }): Promise<{ user: AuthUser; profile: StudentProfile; token: string }> {
    let res: Response;
    try {
      res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          email: params.email.trim().toLowerCase(),
        }),
      });
    } catch (networkErr: any) {
      throw new Error(`Unable to reach server. Please ensure the backend is running. (${networkErr.message})`);
    }

    const data = await this.safeParseJson(res);
    if (!res.ok) {
      throw new Error(data.error || `Registration failed with status ${res.status}`);
    }

    this.setSession(data.token, data.user, data.profile);
    return data;
  }

  public static async login(
    email: string,
    password: string,
    expectedRole?: UserRole
  ): Promise<{ user: AuthUser; profile?: StudentProfile; token: string }> {
    let res: Response;
    try {
      res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          expectedRole,
        }),
      });
    } catch (networkErr: any) {
      throw new Error(`Unable to reach server. Please ensure the backend is running. (${networkErr.message})`);
    }

    const data = await this.safeParseJson(res);
    if (!res.ok) {
      throw new Error(data.error || `Login failed with status ${res.status}`);
    }

    this.setSession(data.token, data.user, data.profile);
    return data;
  }

  public static async fetchCurrentUser(): Promise<AuthUser | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
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

    // Async sync to server
    const token = this.getToken();
    if (token && this.user?.role === 'student') {
      fetch('/api/student/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      }).catch((e) => console.warn('Failed to sync profile update to server', e));
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
