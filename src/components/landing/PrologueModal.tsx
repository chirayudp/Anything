import React from 'react';
import { GameLanguage } from '../../types';
import { OnboardingModal } from './OnboardingModal';

interface PrologueModalProps {
  language: GameLanguage;
  onProceed: () => void;
}

export const PrologueModal: React.FC<PrologueModalProps> = ({ language, onProceed }) => {
  return (
    <OnboardingModal
      language={language}
      isOpen={true}
      onProceed={onProceed}
    />
  );
};
