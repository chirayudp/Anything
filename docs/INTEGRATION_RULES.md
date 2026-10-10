# MONEYQUEST: INTEGRATION & COLLABORATION RULES

---

### 1. The Core Rules of Collaboration
Every developer works within a shared codebase. Violating these rules causes broken builds, merge conflicts, and disqualified submissions.

1. **Synchronize First:** Never start writing code on an unapproved branch. Pull `origin/main` to ensure you have the latest approved `PROJECT_SPEC.md` and `src/types/*`.
2. **Work Only on Assigned Branch:**
   * Person 1: `feature/home-ui`
   * Person 2: `feature/world-map`
   * Person 3: `feature/gameplay`
   * Person 4: `feature/ai-feedback`
   * Person 5: `feature/integration`
3. **Respect File Ownership:** Edit only files assigned to your module (see ownership matrix in [ARCHITECTURE.md](ARCHITECTURE.md)). Never delete or overwrite another contributor's code.
4. **Frozen Shared Interfaces:** Never modify files under `src/types/` without submitting an RFC to the Integration Lead (Person 5). If you need an additional field, propose it first.
5. **No Broken Builds:** Before submitting your branch or creating a pull request, you MUST run:
   ```bash
   npm run build
   ```
   If there is a single TypeScript or Vite compilation error, do NOT push.

---

### 2. Technical Guardrails

#### Security & API Keys
* **Zero Secrets in Frontend:** The Gemini API key must NEVER appear in client-side code, `vite.config.ts`, or any git commit.
* The API key must reside in a `.env` file read exclusively by the Express proxy (`server/index.ts`).
* The frontend interacts with AI exclusively via `/api/ai/explain` and `/api/ai/hint`.
* If the API fails or is offline, all client components MUST use the predefined educational fallbacks in `src/services/aiService.ts`.

#### Deterministic Authority
* The game engine (`src/engine/gameEngine.ts`) is the SOLE authority on money balances, scores, unlocked cities, and pass/recovery states.
* LLMs and AI services must NEVER be asked to compute balances, validate game state, or invent rules.

#### Student Privacy
* Only pseudonymous identifiers (`STU-XXXX`) may be stored in local storage or analytics databases.
* Never collect real names, phone numbers, email addresses, or personal financial data.

---

### 3. Step-by-Step Feature Integration Workflow

```
       [Pull main with approved specs & types]
                          │
                          ▼
             [Checkout assigned feature branch]
                          │
                          ▼
       [Implement module in assigned directory]
                          │
                          ▼
          [Test locally with shared mocks]
                          │
                          ▼
       [Run npm run build to verify 0 errors]
                          │
                          ▼
         [Push feature branch to origin]
                          │
                          ▼
    [Person 5 verifies & merges into main]
```

---

### 4. Verification Checklist Before Handoff
Before handing off your module:
- [ ] Checked that all new files are in your designated folder.
- [ ] Confirmed no edits to another member's files or to `src/types/*`.
- [ ] Tested responsive UI on desktop and mobile viewports.
- [ ] Verified offline/fallback mode (app works without internet or API key).
- [ ] Executed `npm run build` with zero TypeScript or packaging errors.
- [ ] Inspected `git diff` to ensure no stray files, logs, or secrets are committed.
