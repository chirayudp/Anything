import { StudentProfile, GameLanguage } from '../types';

const STORAGE_KEY_PROFILE = 'moneyquest_student_profile';
const STORAGE_KEY_SESSION = 'moneyquest_session_id';

export class GameStorage {
  static getOrCreateProfile(defaultLang: GameLanguage = 'en'): StudentProfile {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY_PROFILE);
        if (stored) {
          return JSON.parse(stored);
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

  static resetProgress(): StudentProfile {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(STORAGE_KEY_PROFILE);
        window.localStorage.removeItem(STORAGE_KEY_SESSION);
      }
    } catch (e) {
      console.warn('Failed to clear storage', e);
    }
    return this.getOrCreateProfile();
  }
}
