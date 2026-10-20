import React, { useState, useEffect } from 'react';
import {
  StudentProfile,
  GameLanguage,
  NPC,
  PuzzleScenario,
} from './types';
import { GameStorage } from './engine/storage';
import { GameEngine } from './engine/gameEngine';
import { PUZZLES } from './data/puzzles';
import { Navbar } from './components/ui/Navbar';
import { TitleScreen } from './components/landing/TitleScreen';
import { TitleSettingsModal } from './components/landing/TitleSettingsModal';
import { PrologueModal } from './components/landing/PrologueModal';
import { WorldMapCanvas } from './components/world/WorldMapCanvas';
import { NpcDialogueModal } from './components/world/NpcDialogueModal';
import { PuzzleModal } from './components/gameplay/PuzzleModal';
import { BankruptcyModal } from './components/gameplay/BankruptcyModal';
import { RouterProvider, useRouter, matchPath } from './router';
import { AuthService } from './services/authService';
import { StudentLoginPage } from './components/auth/StudentLoginPage';
import { NgoLoginPage } from './components/ngo/NgoLoginPage';
import { NgoDashboardPage } from './components/ngo/NgoDashboardPage';
import { NgoStudentDetailPage } from './components/ngo/NgoStudentDetailPage';
import { GameCompletionModal } from './components/gameplay/GameCompletionModal';
import { NgoDashboardModal } from './components/analytics/NgoDashboardModal';
import { CharacterSelectScreen } from './components/character/CharacterSelectScreen';

const MainAppContent: React.FC = () => {
  const { path, navigate, replace } = useRouter();

  // Always evaluate auth status synchronously to prevent stale state bounces
  const isStudentAuth = AuthService.isStudentAuthenticated();
  const isNgoAuth = AuthService.isNgoAuthenticated();

  // Force re-render on auth changes
  const [, setAuthTick] = useState(0);

  // Student Profile state
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const authProf = AuthService.getProfile();
    if (authProf) return authProf;
    return GameStorage.getOrCreateProfile();
  });

  const [language, setLanguage] = useState<GameLanguage>(() => profile.preferredLanguage || 'en');
  const [isPrologueActive, setIsPrologueActive] = useState(false);

  // Modals state
  const [activeNpc, setActiveNpc] = useState<NPC | null>(null);
  const [activeScenario, setActiveScenario] = useState<PuzzleScenario | null>(null);
  const [isTitleSettingsOpen, setIsTitleSettingsOpen] = useState(false);
  const [isBankruptcyModalDismissed, setIsBankruptcyModalDismissed] = useState(false);
  const [isNgoDashboardOpen, setIsNgoDashboardOpen] = useState(false);
  const [isGameCompletionOpen, setIsGameCompletionOpen] = useState(false);

  // Sync auth updates
  useEffect(() => {
    const unsubscribe = AuthService.subscribe((state) => {
      setAuthTick((t) => t + 1);
      if (state.profile) {
        setProfile(state.profile);
      }
    });
    return unsubscribe;
  }, []);

  // Safe declarative redirect effects (NEVER call replace() during render body)
  useEffect(() => {
    if (path === '/') {
      if (isStudentAuth) {
        replace('/game');
      } else if (isNgoAuth) {
        replace('/ngo/dashboard');
      } else {
        replace('/login');
      }
    } else if (path === '/login' && isStudentAuth) {
      replace('/game');
    } else if (path === '/ngo/login' && isNgoAuth) {
      replace('/ngo/dashboard');
    } else if (path.startsWith('/game') && !isStudentAuth) {
      replace('/login');
    } else if (path.startsWith('/ngo') && path !== '/ngo/login' && !isNgoAuth) {
      replace('/ngo/login');
    }
  }, [path, isStudentAuth, isNgoAuth]);

  // Update profile handler
  const handleUpdateProfile = (updated: StudentProfile) => {
    setProfile(updated);
    GameStorage.saveProfile(updated);
    AuthService.updateStudentProfile(updated);
  };

  const handleLanguageChange = (newLang: GameLanguage) => {
    setLanguage(newLang);
    handleUpdateProfile({ ...profile, preferredLanguage: newLang });
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset all progress and start fresh?')) {
      const resetProf = GameStorage.resetProgress();
      setProfile(resetProf);
      handleUpdateProfile(resetProf);
      setActiveNpc(null);
      setActiveScenario(null);
      navigate('/game');
    }
  };

  const handleResetWallet = () => {
    const fresh = GameStorage.resetBankruptcy(profile);
    handleUpdateProfile(fresh);
    setIsBankruptcyModalDismissed(false);
  };

  // Reset bankruptcy dismissal flag when wallet has positive balance
  useEffect(() => {
    if (profile.walletBalance > 0) {
      setIsBankruptcyModalDismissed(false);
    }
  }, [profile.walletBalance]);

  const handleStartAdventure = () => {
    if (!GameStorage.isProgressSaved()) {
      const fresh = GameStorage.resetWallet(profile);
      handleUpdateProfile(fresh);
    }
    navigate(GameStorage.isNewUser(profile) ? '/game/character-select' : '/game/prologue');
  };

  const handleContinueJourney = () => {
    navigate('/game/world');
  };

  const handlePrologueComplete = () => {
    setIsPrologueActive(false);
    navigate('/game/world');
  };

  // =========================================================================
  // VIEW RENDER DISPATCHING
  // =========================================================================

  // 1. Root route
  if (path === '/') {
    return null;
  }

  // 2. NGO Portal Routes
  if (path === '/ngo/login') {
    return <NgoLoginPage />;
  }

  if (path === '/ngo/dashboard') {
    if (!isNgoAuth) {
      return <NgoLoginPage />;
    }
    return <NgoDashboardPage />;
  }

  const ngoStudentMatch = matchPath('/ngo/students/:studentId', path);
  if (ngoStudentMatch.matches) {
    if (!isNgoAuth) {
      return <NgoLoginPage />;
    }
    return <NgoStudentDetailPage studentId={ngoStudentMatch.params.studentId} />;
  }

  // 3. Student Auth Route
  if (path === '/login') {
    if (isStudentAuth) {
      return null;
    }
    return <StudentLoginPage />;
  }

  // 4. Protected Student Game Routes (/game, /game/world, /game/settings)
  if (path.startsWith('/game')) {
    if (!isStudentAuth) {
      return <StudentLoginPage />;
    }

    const hasSavedGame =
      GameStorage.isProgressSaved() ||
      Boolean(profile.completedScenarioIds && profile.completedScenarioIds.length > 0);

      if (path === '/game/character-select') {
        return (
          <CharacterSelectScreen
            language={language}
            initialGender={profile.characterGender || 'boy'}
            onSelectCharacter={(gender) => {
              handleUpdateProfile({ ...profile, characterGender: gender, isNewUser: false });
              setIsPrologueActive(true);
              navigate('/game');
            }}
            onBack={() => navigate('/game')}
          />
        );
      }

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
        {/* Global Navigation Bar - shown in world exploration */}
        {path === '/game/world' && (
          <Navbar
            profile={profile}
            language={language}
            onLanguageChange={handleLanguageChange}
            onResetProgress={handleResetProgress}
            onReturnToHome={() => navigate('/game')}
            onSaveProgress={() => {}}
            onResetWallet={handleResetWallet}
            isProgressSaved={true}
            onLogout={handleLogout}
              onOpenGameCompletion={() => setIsGameCompletionOpen(true)}
          />
        )}

        {/* Main View Port */}
        <main className="flex-1 flex flex-col">
          {path === '/game' && (
            <TitleScreen
              language={language}
              hasSavedGame={hasSavedGame}
              studentId={profile.studentId}
              onStartAdventure={handleStartAdventure}
              onContinueJourney={handleContinueJourney}
              onOpenSettings={() => navigate('/game/settings')}
              onLogout={handleLogout}
            />
          )}

          {path === '/game/world' && (
            <WorldMapCanvas
              profile={profile}
              language={language}
              onInteractWithNpc={(npc) => setActiveNpc(npc)}
              onEnterCity={(cityId) => console.log('Entered city:', cityId)}
              onResetWallet={handleResetWallet}
            />
          )}

          {path === '/game/settings' && (
            <div className="flex-1 flex items-center justify-center p-4">
              <TitleSettingsModal
                language={language}
                profile={profile}
                isProgressSaved={true}
                onClose={() => navigate('/game')}
                onLanguageChange={handleLanguageChange}
                onToggleSaveProgress={() => {}}
                onResetProgress={handleResetProgress}
                onResetWallet={handleResetWallet}
                onLogout={handleLogout}
              />
            </div>
          )}
        </main>

        {/* Narrative Prologue Modal */}
        {isPrologueActive && (
          <PrologueModal language={language} onProceed={handlePrologueComplete} />
        )}

        {/* Student Bankruptcy Rescue Modal */}
        {profile.walletBalance <= 0 && !activeScenario && !isBankruptcyModalDismissed && (
          <BankruptcyModal
            profile={profile}
            language={language}
            onResetBankruptcy={handleResetWallet}
            onFullReset={handleResetProgress}
            onClose={() => setIsBankruptcyModalDismissed(true)}
          />
        )}

        {/* NPC Dialogue Modal */}
        {activeNpc && (
          <NpcDialogueModal
            npc={activeNpc}
            language={language}
            isSolved={
              activeNpc.scenarioId
                ? GameEngine.isScenarioSolved(activeNpc.scenarioId, profile)
                : false
            }
            onClose={() => setActiveNpc(null)}
            onStartChallenge={(scenarioId) => {
              const sc = PUZZLES[scenarioId];
              if (sc) setActiveScenario(sc);
            }}
          />
        )}

        {/* Financial Puzzle & Decision Modal */}
        {activeScenario && (
          <PuzzleModal
            scenario={activeScenario}
            profile={profile}
            language={language}
            onClose={() => setActiveScenario(null)}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {/* In-game Settings Modal */}
        {isTitleSettingsOpen && (
          <TitleSettingsModal
            language={language}
            profile={profile}
            isProgressSaved={true}
            onClose={() => setIsTitleSettingsOpen(false)}
            onLanguageChange={handleLanguageChange}
            onToggleSaveProgress={() => {}}
            onResetProgress={handleResetProgress}
            onResetWallet={handleResetWallet}
            onLogout={handleLogout}
          />
        )}

        {isGameCompletionOpen && (
          <GameCompletionModal
            profile={profile}
            language={language}
            isOpen={isGameCompletionOpen}
            onClose={() => setIsGameCompletionOpen(false)}
            onOpenNgoDashboard={() => {
              setIsGameCompletionOpen(false);
              setIsNgoDashboardOpen(true);
            }}
            onRestartJourney={handleResetProgress}
          />
        )}

        {isNgoDashboardOpen && (
          <NgoDashboardModal
            profile={profile}
            onClose={() => setIsNgoDashboardOpen(false)}
          />
        )}
      </div>
    );
  }

  // Fallback
  return isStudentAuth ? null : <StudentLoginPage />;
};

export const App: React.FC = () => {
  return (
    <RouterProvider>
      <MainAppContent />
    </RouterProvider>
  );
};

export default App;
