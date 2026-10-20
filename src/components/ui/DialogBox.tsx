import React, { useState, useEffect } from 'react';
import { audioManager } from './audioManager';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface DialogBoxProps {
  speakerName: string;
  speakerRole?: string;
  speakerAvatar?: string;
  message: string;
  isOpen: boolean;
  onNext?: () => void;
  onClose?: () => void;
  actionText?: string;
}

export const DialogBox: React.FC<DialogBoxProps> = ({
  speakerName,
  speakerRole,
  speakerAvatar = '💬',
  message,
  isOpen,
  onNext,
  onClose,
  actionText,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setDisplayedText('');
      return;
    }

    let currentIndex = 0;
    setDisplayedText('');
    setIsTyping(true);

    const timer = setInterval(() => {
      if (currentIndex < message.length) {
        setDisplayedText(message.slice(0, currentIndex + 1));
        currentIndex++;
        if (currentIndex % 3 === 0) {
          audioManager.playClick();
        }
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [message, isOpen]);

  // Keyboard shortcut listener: Space or Enter advances
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleAdvance();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isTyping, message]);

  if (!isOpen) return null;

  const handleAdvance = () => {
    if (isTyping) {
      // Instant skip typing
      setDisplayedText(message);
      setIsTyping(false);
    } else if (onNext) {
      audioManager.playClick();
      onNext();
    } else if (onClose) {
      audioManager.playClick();
      onClose();
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-fadeIn">
      <div className="bg-slate-900/95 border-2 border-amber-500/60 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-2xl pointer-events-none" />

        {/* Speaker Nameplate */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-lg">
              {speakerAvatar}
            </div>
            <div>
              <span className="font-extrabold text-sm text-amber-400 tracking-wide block">
                {speakerName}
              </span>
              {speakerRole && (
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  {speakerRole}
                </span>
              )}
            </div>
          </div>

          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
            Press [SPACE] or tap to advance
          </span>
        </div>

        {/* Message Content */}
        <div
          onClick={handleAdvance}
          className="min-h-[50px] text-xs sm:text-sm text-slate-200 leading-relaxed cursor-pointer font-sans"
        >
          {displayedText}
          {isTyping && <span className="inline-block w-1.5 h-3.5 bg-amber-400 ml-1 animate-pulse" />}
        </div>

        {/* Action Button */}
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleAdvance}
            className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition active:scale-95"
          >
            <span>{actionText || (isTyping ? 'Skip' : 'Continue')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
