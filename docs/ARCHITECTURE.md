# MONEYQUEST: ARCHITECTURE & SYSTEM DESIGN (v1.0.0)

---

## 1. Technical Stack
* **Frontend Core:** React 18, TypeScript 5, Vite 5.
* **Styling & Theme:** Tailwind CSS 3 with custom retro/adventure gaming color tokens and responsive grid layouts.
* **World Exploration Engine:** HTML5 Canvas / 2D Grid Engine with smooth keyboard (`WASD` / Arrow keys), touch virtual D-pad, collision layer, and entity interaction zones.
* **Component Icons:** `lucide-react`.
* **State Management:** Strongly-typed React Context & LocalStorage sync with immutable state transitions.
* **Backend Services:** Node.js + Express proxy (`server/index.ts`) for Gemini AI API and centralized decision log aggregation.

---

## 2. Team Role & Module Ownership Matrix

| Module | Team Member / Branch | Primary File Ownership | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **Module 1: Home & Narrative UI** | Person 1 (`feature/home-ui`) | `src/components/landing/*`<br>`src/components/ui/Navbar.tsx`<br>`src/components/ui/DialogBox.tsx`<br>`src/translations/*` | Hero section, animated introduction, story prologues, multilingual selector (EN, HI, TE), audio/visual theme toggles. |
| **Module 2: World & Exploration** | Person 2 (`feature/world-map`) | `src/components/world/*`<br>`src/data/maps/*`<br>`src/engine/worldEngine.ts` | 2D canvas rendering, tilemaps, collision boxes, avatar sprites, NPC wanderers, quest markers, and city entry portals. |
| **Module 3: Financial Gameplay & Puzzles** | Person 3 (`feature/gameplay`) | `src/components/gameplay/*`<br>`src/data/puzzles/*`<br>`src/engine/gameEngine.ts` | 4-pillar financial puzzles, 4-tier decision evaluator (Very Bad, Good, Better, Best), recovery modal, score/budget calculators. |
| **Module 4: AI Feedback & Pedagogy** | Person 4 (`feature/ai-feedback`) | `src/components/ai/*`<br>`src/services/aiService.ts`<br>`server/routes/ai.ts` | Gemini API server proxy, contextual explanation prompts, adaptive hints, and resilient offline fallbacks. |
| **Module 5: Integration, Analytics & Lead** | Person 5 (`feature/integration`) | `src/types/*`<br>`src/engine/eventLogger.ts`<br>`src/services/analyticsService.ts`<br>`src/components/analytics/*`<br>`PROJECT_SPEC.md`<br>`docs/*` | Shared interfaces, decision logging, NGO dashboard, progress persistence, CI build verification, end-to-end integration slice. |

---

## 3. Directory Layout
```
/
├── deliverables/
│   ├── M1.pdf
│   └── M2.pdf
├── docs/
│   ├── ARCHITECTURE.md
│   └── INTEGRATION_RULES.md
├── server/
│   └── index.ts                 # Express proxy for Gemini API & event logging
├── src/
│   ├── assets/                  # Sprites, audio, icons, maps
│   ├── components/
│   │   ├── ai/                  # AI feedback cards & hint bubbles (Person 4)
│   │   ├── analytics/           # NGO dashboard & student history (Person 5)
│   │   ├── gameplay/            # Puzzle modals, budgeting tools (Person 3)
│   │   ├── landing/             # Cinematic landing page & prologue (Person 1)
│   │   ├── ui/                  # Reusable badges, buttons, modals, HUD
│   │   └── world/               # Canvas world map, avatars, portals (Person 2)
│   ├── data/
│   │   ├── dialogues.ts         # NPC script lines & quest dialogues
│   │   ├── puzzles.ts           # 15 city scenarios across 4 pillars
│   │   └── regions.ts           # 3 regions & 15 city metadata
│   ├── engine/
│   │   ├── eventLogger.ts       # Student decision event tracker
│   │   ├── gameEngine.ts        # Pure deterministic financial state calculations
│   │   └── storage.ts           # Persistent local/session storage adapter
│   ├── services/
│   │   ├── aiService.ts         # Gemini client with fallback dictionary
│   │   └── analyticsService.ts  # NGO report metrics aggregator
│   ├── types/
│   │   ├── ai.ts
│   │   ├── analytics.ts
│   │   ├── game.ts
│   │   ├── index.ts
│   │   ├── puzzles.ts
│   │   └── world.ts
│   ├── App.tsx                  # Root navigation & state provider
│   ├── index.css                # Tailwind directives & game fonts
│   └── main.tsx                 # Entrypoint
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 4. Shared Data Flow & State Lifecycle
1. **Student Session Initialization:** On launching "Start Adventure", `storage.ts` retrieves or generates a pseudonymous `studentId` (e.g. `STU-1042`) and active session ID.
2. **Exploration Loop:** Player moves on Canvas. When within radius $R$ of an NPC or Building portal, `worldEngine` triggers the interaction hook.
3. **Challenge Engagement:** `activePuzzleId` is set in global game state. `PuzzleModal` renders the scenario and 4 choices.
4. **Deterministic Evaluation:** Upon choice selection, `gameEngine.evaluateChoice()` calculates exact balance, stress, financial score deltas, and pass/recovery status.
5. **Decision Event Logged:** `eventLogger.recordDecision()` records the complete event payload.
6. **Educational Feedback:** `aiService.getExplanation()` requests a Gemini contextual explanation (or uses the deterministic fallback).
7. **Resolution:** If choice is *Best*, *Better*, or *Good*, stage completes and unlocks the next city. If *Very Bad*, the student enters *Recovery Mode* to learn and retry.
8. **NGO Dashboard:** Aggregates all logged events into cohort performance metrics, failure hotspots, and recovery conversion rates.
