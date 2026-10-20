/**
 * MONEYQUEST DESIGN SYSTEM TOKENS
 * Unified color palettes, pixel-art shadows, pillar tokens, and styling helpers.
 */

export const DESIGN_TOKENS = {
  colors: {
    // Brand & Theme
    bgDark: '#090d16',
    bgCard: '#0f172a',
    bgCardSubtle: 'rgba(15, 23, 42, 0.75)',
    borderPrimary: '#334155',
    borderGlowGold: 'rgba(245, 158, 11, 0.4)',

    // Accents
    gold: {
      light: '#fde68a',
      DEFAULT: '#f59e0b',
      dark: '#b45309',
      glow: '0 0 20px rgba(245, 158, 11, 0.5)',
    },
    emerald: {
      light: '#a7f3d0',
      DEFAULT: '#10b981',
      dark: '#047857',
      glow: '0 0 20px rgba(16, 185, 129, 0.5)',
    },
    sky: {
      light: '#bae6fd',
      DEFAULT: '#0284c7',
      dark: '#0369a1',
      glow: '0 0 20px rgba(2, 132, 199, 0.5)',
    },
    violet: {
      light: '#ddd6fe',
      DEFAULT: '#8b5cf6',
      dark: '#5b21b6',
      glow: '0 0 20px rgba(139, 92, 246, 0.5)',
    },
    crimson: {
      light: '#fecaca',
      DEFAULT: '#ef4444',
      dark: '#991b1b',
    },

    // Four Learning Pillars
    pillars: {
      budget: {
        id: 'budget',
        name: 'Plan & Budget',
        color: '#f59e0b',
        badgeBg: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
        gradient: 'from-amber-500 to-amber-700',
        cardBorder: 'border-amber-500/30 hover:border-amber-500/70',
        icon: 'BookOpen',
      },
      save: {
        id: 'save',
        name: 'Save & Manage',
        color: '#10b981',
        badgeBg: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
        gradient: 'from-emerald-500 to-teal-700',
        cardBorder: 'border-emerald-500/30 hover:border-emerald-500/70',
        icon: 'Shield',
      },
      invest: {
        id: 'invest',
        name: 'Understand Investing',
        color: '#0284c7',
        badgeBg: 'bg-sky-950/60 border-sky-500/40 text-sky-300',
        gradient: 'from-sky-500 to-blue-700',
        cardBorder: 'border-sky-500/30 hover:border-sky-500/70',
        icon: 'TrendingUp',
      },
      safety: {
        id: 'safety',
        name: 'Stay Financially Safe',
        color: '#8b5cf6',
        badgeBg: 'bg-purple-950/60 border-purple-500/40 text-purple-300',
        gradient: 'from-violet-500 to-purple-700',
        cardBorder: 'border-violet-500/30 hover:border-violet-500/70',
        icon: 'Compass',
      },
    },
  },

  typography: {
    gameFont: '"Press Start 2P", monospace',
    sansFont: 'Inter, system-ui, sans-serif',
  },

  retroBoxShadow: {
    sm: '2px 2px 0px #0f172a, 3px 3px 0px rgba(245, 158, 11, 0.4)',
    md: '4px 4px 0px #090d16, 5px 5px 0px rgba(245, 158, 11, 0.5)',
    modal: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(245, 158, 11, 0.15)',
  },

  pixelBorders: {
    card: 'border-2 border-slate-700/80 hover:border-amber-500/60 transition-colors',
    goldButton:
      'border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 transition-all',
    slateButton:
      'border-b-4 border-slate-800 active:border-b-0 active:translate-y-1 transition-all',
  },
};
