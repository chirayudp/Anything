import React, { useState } from 'react';
import { GameLanguage, StudentProfile } from '../../types';
import { GameStorage } from '../../engine/storage';
import { TitleScreen } from './TitleScreen';
import { TitleSettingsModal } from './TitleSettingsModal';

export interface LandingPageProps {
  language: GameLanguage;
  onStartAdventure: () => void;
  onOpenDashboard: () => void;
  onContinueJourney?: () => void;
  onOpenSettings?: () => void;
  hasSavedGame?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  onStartAdventure,
  onOpenDashboard,
  onContinueJourney,
  onOpenSettings,
  hasSavedGame,
}) => {
  const [profile, setProfile] = useState<StudentProfile>(() => GameStorage.getOrCreateProfile());
  const [isInternalSettingsOpen, setIsInternalSettingsOpen] = useState(false);
  const [isProgressSaved, setIsProgressSaved] = useState(() => GameStorage.isProgressSaved());

  const computedHasSaved = hasSavedGame ?? (isProgressSaved || Boolean(profile.completedScenarioIds && profile.completedScenarioIds.length > 0));

  const handleContinue = () => {
    if (onContinueJourney) {
      onContinueJourney();
    } else {
      onStartAdventure();
    }
  };

  const handleSettings = () => {
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      setIsInternalSettingsOpen(true);
    }
  };

  const handleToggleSave = () => {
    const next = !isProgressSaved;
    setIsProgressSaved(next);
    GameStorage.setProgressSaved(next);
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset all saved player progress?')) {
      const resetProf = GameStorage.resetProgress();
      setProfile(resetProf);
      setIsInternalSettingsOpen(false);
    }
  };

  const handleResetWallet = () => {
    const fresh = GameStorage.resetBankruptcy(profile);
    setProfile(fresh);
    GameStorage.saveProfile(fresh);
  };

  return (
    <>
      <TitleScreen
        language={language}
        hasSavedGame={computedHasSaved}
        onStartAdventure={onStartAdventure}
        onContinueJourney={handleContinue}
        onOpenDashboard={onOpenDashboard}
        onOpenSettings={handleSettings}
      />

      {isInternalSettingsOpen && (
        <TitleSettingsModal
          language={language}
          profile={profile}
          isProgressSaved={isProgressSaved}
          onClose={() => setIsInternalSettingsOpen(false)}
          onLanguageChange={() => {}}
          onToggleSaveProgress={handleToggleSave}
          onResetProgress={handleResetProgress}
          onResetWallet={handleResetWallet}
        />
      )}
    </>
  );
};
