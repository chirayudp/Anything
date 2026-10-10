import React, { useState, useEffect } from 'react';
import {
  StudentProfile,
  GameLanguage,
  GameScreen,
  NPC,
  PuzzleScenario,
} from './types';
import { GameStorage } from './engine/storage';
import { PUZZLES } from './data/puzzles';
import { Navbar } from './components/ui/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { PrologueModal } from './components/landing/PrologueModal';
import { WorldMapCanvas } from './components/world/WorldMapCanvas';
import { NpcDialogueModal } from './components/world/NpcDialogueModal';
import { PuzzleModal } from './components/gameplay/PuzzleModal';
import { NgoDashboardModal } from './components/analytics/NgoDashboardModal';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile>(() => GameStorage.getOrCreateProfile());
  const [language, setLanguage] = useState<GameLanguage>('en');
  const [screen, setScreen] = useState<GameScreen>('landing');

  // Modal states
  const [activeNpc, setActiveNpc] = useState<NPC | null>(null);
  const [activeScenario, setActiveScenario] = useState<PuzzleScenario | null>(null);
  const [isNgoDashboardOpen, setIsNgoDashboardOpen] = useState<boolean>(false);

  // Sync profile changes to local storage
  const handleUpdateProfile = (updated: StudentProfile) => {
    setProfile(updated);
    GameStorage.saveProfile(updated);
  };

  const handleLanguageChange = (newLang: GameLanguage) => {
    setLanguage(newLang);
    handleUpdateProfile({ ...profile, preferredLanguage: newLang });
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset all progress and start fresh with a new student ID?')) {
      const resetProf = GameStorage.resetProgress();
      setProfile(resetProf);
      setScreen('landing');
      setActiveNpc(null);
      setActiveScenario(null);
    }
  };

  const handleStartAdventure = () => {
    setScreen('prologue');
  };

  const handleEnterWorld = () => {
    setScreen('world');
  };

  const handleInteractWithNpc = (npc: NPC) => {
    setActiveNpc(npc);
  };

  const handleStartChallenge = (scenarioId: string) => {
    const scenario = PUZZLES[scenarioId];
    if (scenario) {
      setActiveScenario(scenario);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Global Navigation Bar */}
      <Navbar
        profile={profile}
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenDashboard={() => setIsNgoDashboardOpen(true)}
        onResetProgress={handleResetProgress}
        onReturnToHome={() => setScreen('landing')}
      />

      {/* Main View Port */}
      <main className="flex-1 flex flex-col">
        {screen === 'landing' && (
          <LandingPage
            language={language}
            onStartAdventure={handleStartAdventure}
            onOpenDashboard={() => setIsNgoDashboardOpen(true)}
          />
        )}

        {screen === 'world' && (
          <WorldMapCanvas
            profile={profile}
            language={language}
            onInteractWithNpc={handleInteractWithNpc}
            onEnterCity={(cityId) => {
              console.log('Entered city:', cityId);
            }}
          />
        )}
      </main>

      {/* Narrative Prologue Modal */}
      {screen === 'prologue' && (
        <PrologueModal language={language} onProceed={handleEnterWorld} />
      )}

      {/* NPC Dialogue Modal */}
      {activeNpc && (
        <NpcDialogueModal
          npc={activeNpc}
          language={language}
          isSolved={profile.completedCityIds.includes(activeNpc.cityId)}
          onClose={() => setActiveNpc(null)}
          onStartChallenge={handleStartChallenge}
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

      {/* Authorized NGO Reporting Dashboard */}
      {isNgoDashboardOpen && (
        <NgoDashboardModal profile={profile} onClose={() => setIsNgoDashboardOpen(false)} />
      )}
    </div>
  );
};

export default App;
