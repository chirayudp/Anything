# MONEYQUEST: FINANCIAL-LITERACY ADVENTURE GAME
## Master Project Specification (v1.0.0)

---

### 1. Executive Summary & Narrative
**MoneyQuest** is a browser-based, story-driven 2D financial-literacy adventure game designed for Grade 11–12 students, specifically relatable to students navigating higher secondary education and hostel life in Hyderabad. 

The protagonist receives a prestigious merit scholarship stipend (₹5,000/month). What initially seems like abundant wealth quickly becomes a balancing act between hostel food fees, textbooks, peer pressure, surprise medical/family emergencies, deceptive digital schemes, and long-term financial planning. 

The player navigates an open, vibrant 2D world inspired by **Google Champion Island**, exploring 3 thematic regions with 15 interconnected cities/locations, solving contextual financial puzzles, conversing with colorful NPCs, and building lifelong financial habits.

---

### 2. The Four Educational Pillars & Objectives
Every scenario, dialogue, and puzzle strictly maps to at least one of the four core pillars:

1. **Pillar 1: Plan & Budget**
   * *Core Concepts:* Needs vs. Wants, 50-30-20 rule adapted for students, fixed vs. discretionary expenses, opportunity cost.
   * *Scenarios:* Hostel mess fees vs. cafe splurges; buying second-hand textbooks vs. new gadget accessories.
2. **Pillar 2: Save & Manage**
   * *Core Concepts:* Emergency reserves (rainy-day fund), saving goals, trade-off between instant gratification and delayed reward, safe custodial accounts.
   * *Scenarios:* Setting aside 20% of monthly stipend; handling sudden broken phone screen without predatory loans.
3. **Pillar 3: Understand Investing**
   * *Core Concepts:* Compounding interest ($A = P(1+r/n)^{nt}$), time horizons, inflation erosion, risk vs. return spectrum, diversification.
   * *Strict Guardrail:* Educational simulations only. No individual stock tips or financial product recommendations.
4. **Pillar 4: Stay Financially Safe**
   * *Core Concepts:* Phishing detection, UPI QR code scams (money-receive QR scam), lottery/fake scholarship SMS, OTP confidentiality, deceptive 'get-rich-quick' crypto/pyramid schemes.
   * *Scenarios:* Spotting phishing links in SMS claiming "Scholarship suspended - click here to verify KYC".

---

### 3. World Architecture & Geography (3 Regions, 15 Cities)

The world follows a 3-region progression from personal survival to financial independence and community stewardship:

#### Region 1: The Scholar's District (Everyday Student Finances)
* **City 1: Hostel Commons (The Awakening)** – Managing the initial stipend drop; splitting hostel dues vs. pocket money.
* **City 2: Academic Bazaar (Needs vs. Wants)** – Purchasing educational supplies; navigating discounts, quality, and peer pressure.
* **City 3: Canteen Corner (Discretionary Traps)** – Daily micro-spending; tracking leakages and small recurring expenses.
* **City 4: Rainy-Day Refuge (Emergency Buffer)** – Building the first emergency fund; facing an unexpected hostel fee hike.
* **City 5: The Post Office & Digital Hub (Banking Basics)** – Zero-fee student savings accounts, debit card PIN safety, and digital passbooks.

#### Region 2: The Prosperity Outskirts (Growth & Long-Term Planning)
* **City 6: The Compounding Grove (Time Horizon)** – The power of starting early; visual compounding trees.
* **City 7: The Diversified Market (Risk & Return)** – Balancing fixed returns (FD/RD) against market-linked risks; avoiding all-in gambles.
* **City 8: The Inflation Alley (Purchasing Power)** – Real vs. nominal returns; why idle cash loses purchasing power over time.
* **City 9: The Opportunity Guild (Goal-Based Saving)** – Saving for a competitive exam registration fee 6 months ahead.
* **City 10: Skill Forge (Human Capital)** – Investing in certifications, books, and tools that yield high personal career dividends.

#### Region 3: The Guardian Citadel (Financial Defense & Safety)
* **City 11: Phishers' Cove (Digital Forensics)** – Analyzing fake SMS, fraudulent scholarship portals, and suspicious domain names.
* **City 12: The UPI Maze (Transaction Security)** – Debunking the classic scam: "Enter your PIN to receive money into your bank account".
* **City 13: Pyramid Peak (Ponzi & MLM Traps)** – Recognizing referral pyramid schemes disguised as "social student marketing jobs".
* **City 14: Credential Vault (Cyber Hygiene)** – Strong passwords, 2-factor authentication, device security, and emergency helpline (1930).
* **City 15: Grand Stewardship Conclave (Capstone)** – Integrated multi-scenario crisis where all 4 pillars are tested together to win the game.

---

### 4. Core Gameplay Loop & Puzzle Mechanics
```
[World Exploration / Top-Down Walk]
             │
             ▼
     [NPC / Landmark Interaction]
             │
             ▼
[Financial Challenge / Puzzle Screen]
             │
             ▼
    [Player Evaluates Choices]
   (Very Bad | Good | Better | Best)
             │
             ▼
 [Deterministic Outcome by Engine]
   ├── Balance / Savings Adjusted
   ├── Health / Stress / Knowledge Adjusted
   └── Decision Event Logged
             │
             ▼
 [Gemini AI / Fallback Explanation]
   ├── Why the decision produced this outcome
   ├── Practical financial lesson & video reference
   └── Contextual hint for next step
             │
      ┌──────┴──────┐
   [Pass]        [Fail / Recovery Mode]
      │                 │
      │           Replay Scenario with
      │           educational support
      ▼                 │
[Save Progress] ◄───────┘
      │
      ▼
[Unlock Next City / Achievement]
```

#### Decision Grading Model
Every scenario provides 4 deterministic choices:
* **Best (+100 pts):** Optimal financial choice demonstrating foresight, budgeting, and security.
* **Better (+75 pts):** Sensible choice with minor trade-offs or missed optimization.
* **Good (+50 pts):** Acceptable short-term solution but lacks efficiency or long-term vision.
* **Very Bad (+0 pts / Failed State):** Financial trap, scam vulnerability, or budget collapse. Triggers **Recovery Mode**.

#### Recovery Mode
When a student makes a *Very Bad* decision:
1. The game immediately shifts to empathetic learning feedback (never humiliating).
2. The engine displays the exact financial consequence (e.g. overdraft, lost savings, compromised account).
3. Contextual guidance and learning aids are provided.
4. The student replays the stage to demonstrate concept mastery. The retry attempt is tracked distinctly in the analytics log.

---

### 5. Multilingual & Accessibility Support
The platform is built to support:
* **English** (Default)
* **Hindi** (हिंदी)
* **Telugu** (తెలుగు)

All scenario texts, choices, hints, and feedback reference stable IDs (`SCENARIO_HOSTEL_BUDGET_01`, `CHOICE_A`, etc.) to ensure translations remain decoupled from the deterministic game logic.

---

### 6. Student Decision History & NGO Analytics
To empower partner NGOs (such as Vanguard community initiatives in Hyderabad) to measure real learning impact:
* **Pseudonymous Student ID:** `STU-XXXX` format (zero PII collected by default).
* **Structured Event Logging:** Every single decision, retry, score, balance delta, and timestamp is logged.
* **Learning Gap Detection:** Automated pattern detection flags recurring struggles in specific pillars (e.g., repeatedly exceeding budget or falling for PIN verification tricks).
* **NGO Dashboard:** Dedicated web portal providing:
  * Overall cohort participation and completion rate.
  * Pillar-wise mastery percentage.
  * City-level failure hotspots.
  * Retry recovery conversion rates (did the student learn after feedback?).

---

### 7. AI & Gemini Integration Architecture
* **Role:** Pedagogical assistant, contextual explainer, and adaptive hint generator.
* **Guardrails:**
  * Engine determines scores, state transitions, and pass/fail logic deterministically.
  * LLM does NOT evaluate game state or invent rules.
  * Server-side API key proxy (`/api/ai/explain`, `/api/ai/hint`) ensures keys are never exposed in frontend code.
  * **100% Offline / Deterministic Fallback:** If the Gemini API is unreachable or rate-limited, built-in curriculum explanations display seamlessly.
