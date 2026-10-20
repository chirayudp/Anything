import { StudentProfile, GameLanguage, GameScreen } from '../types';

const STORAGE_KEY_PROFILE = 'moneyquest_student_profile';
const STORAGE_KEY_SESSION = 'moneyquest_session_id';
const STORAGE_KEY_SCREEN = 'moneyquest_last_screen';
const STORAGE_KEY_WORLD_STATE = 'moneyquest_world_state';
const STORAGE_KEY_PROGRESS_SAVED = 'moneyquest_progress_saved';

export interface SavedWorldState {
  cityId: 'city_hostel_commons' | 'city_academic_bazaar' | 'city_investment_valley' | 'city_harbor_town';
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

export class GameStorage {
  static isProgressSaved(): boolean {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (window.localStorage.getItem('moneyquest_auth_token')) {
          return true;
        }
        return window.localStorage.getItem(STORAGE_KEY_PROGRESS_SAVED) === 'true';
      }
    } catch (e) {
      console.warn('Failed to read progress saved flag', e);
    }
    return false;
  }

  static setProgressSaved(saved: boolean): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (saved) {
          window.localStorage.setItem(STORAGE_KEY_PROGRESS_SAVED, 'true');
        } else {
          window.localStorage.removeItem(STORAGE_KEY_PROGRESS_SAVED);
        }
      }
    } catch (e) {
      console.warn('Failed to update progress saved flag', e);
    }
  }

  static resetBankruptcy(profile: StudentProfile): StudentProfile {
    const updated: StudentProfile = {
      ...profile,
      walletBalance: profile.scholarshipStipend || 5000,
      emergencyFund: 0,
      lastActiveAt: Date.now(),
    };
    this.saveProfile(updated);
    return updated;
  }

  static resetWallet(profile: StudentProfile): StudentProfile {
    const updated: StudentProfile = {
      ...profile,
      walletBalance: profile.scholarshipStipend || 5000,
      emergencyFund: 0,
      totalScore: 0,
      completedScenarioIds: [],
      completedCityIds: [],
      failedCityIds: [],
      lastActiveAt: Date.now(),
    };
    this.saveProfile(updated);
    return updated;
  }

  static getOrCreateProfile(defaultLang: GameLanguage = 'en'): StudentProfile {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY_PROFILE);
        if (stored) {
          const profile: StudentProfile = JSON.parse(stored);
          // If progress is NOT explicitly saved (testing phase: nothing is saved):
          // Always reset wallet and reserves to initial scholarship stipend
          if (!this.isProgressSaved()) {
            profile.walletBalance = profile.scholarshipStipend || 5000;
            profile.emergencyFund = 0;
            profile.totalScore = 0;
            profile.completedScenarioIds = [];
            profile.completedCityIds = [];
            profile.failedCityIds = [];
            this.saveProfile(profile);
          }
          return profile;
        }
      }
    } catch (e) {
      console.warn('Unable to access localStorage, initializing memory session.', e);
    }

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const newProfile: StudentProfile = {
      studentId: `STU-${randomId}`,
      sessionId: `SESS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      preferredLanguage: defaultLang,
      scholarshipStipend: 5000,
      walletBalance: 5000,
      emergencyFund: 0,
      totalScore: 0,
      currentRegionId: 'region_scholars_district',
      currentCityId: 'city_hostel_commons',
      completedCityIds: [],
      failedCityIds: [],
      badges: ['Scholarship Recipient'],
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
    };

    this.saveProfile(newProfile);
    return newProfile;
  }

  static saveProfile(profile: StudentProfile): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
      }
    } catch (e) {
      console.warn('Failed to save profile to localStorage', e);
    }
  }

  static getSavedScreen(): GameScreen | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY_SCREEN);
        if (stored === 'world' || stored === 'landing' || stored === 'prologue') {
          return stored as GameScreen;
        }
      }
    } catch (e) {
      console.warn('Failed to get saved screen from localStorage', e);
    }
    return null;
  }

  static saveScreen(screen: GameScreen): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY_SCREEN, screen);
      }
    } catch (e) {
      console.warn('Failed to save screen to localStorage', e);
    }
  }

  static getSavedWorldState(): SavedWorldState | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY_WORLD_STATE);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed.x === 'number' && typeof parsed.y === 'number') {
            return parsed as SavedWorldState;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to get saved world state from localStorage', e);
    }
    return null;
  }

  static saveWorldState(state: SavedWorldState): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY_WORLD_STATE, JSON.stringify(state));
      }
    } catch (e) {
      console.warn('Failed to save world state to localStorage', e);
    }
  }

  static resetProgress(): StudentProfile {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(STORAGE_KEY_PROFILE);
        window.localStorage.removeItem(STORAGE_KEY_SESSION);
        window.localStorage.removeItem(STORAGE_KEY_SCREEN);
        window.localStorage.removeItem(STORAGE_KEY_WORLD_STATE);
        window.localStorage.removeItem(STORAGE_KEY_PROGRESS_SAVED);
      }
    } catch (e) {
      console.warn('Failed to clear storage', e);
    }
    return this.getOrCreateProfile();
  }

  static isNewUser(profile?: StudentProfile | null): boolean {
    if (!profile) return true;
    if (typeof profile.isNewUser === 'boolean') {
      return profile.isNewUser;
    }
    return !profile.characterGender;
  }
}
