# MoneyQuest — City 1: World Design Specification
## Location: Hostel Commons & Campus Hub (The Awakening)

---

### 1. Purpose & Financial-Literacy Theme
* **Pillar:** **Pillar 1: Plan & Budget (50-30-20 Rule)**
* **City Identifier:** `city_hostel_commons`
* **Region Identifier:** `region_scholars_district`
* **Core Scenario Identifier:** `scenario_hostel_stipend`
* **Pedagogical Objective:** Teach students how to allocate their first monthly merit stipend (₹5,000) using the 50-30-20 rule, prioritizing non-negotiable living obligations (hostel mess dues ₹2,500) and starting an emergency buffer (₹1,000) before spending on discretionary desires (₹1,500).

---

### 2. Map Overview & Annotated Visual Geography
The supplied pixel-art map is a high-resolution 1024 × 572 top-down campus slice set in Hyderabad.

```
+---------------------------------------------------------------------------------------------------+ (0,0)
| [SCHOOL & LIBRARY]          [BOOKSHOP]       [STUDY ROOM]     [ROAD TO CITY 2 ↑]      [HOSTEL]    |
| (x:25-330, y:15-160)     (x:330-430,y:115-215)(x:475-625,y:65-195) (x:660-715,y:0-70) (x:740-975) |
| Courtyard & Tricolor Gate                                      Exit to City 2        Warden Rao Sir|
|                                                                                      Courtyard     |
| [RIVER]       [PAVED ROADWAY / THOROUGHFARE]                                                      |
| ~~~~~~~~~~    ========================================================================            |
| ~~~~~~~~~~                     [CAMPUS CANTEEN & PATIO]          [ELECTRONICS REPAIR]             |
| ~~~~~~~~~~                     (x:260-520, y:260-425)            (x:610-730, y:240-350)           |
| [START BRIDGE]                 Umbrellas, Irani Chai Counter     Suresh Anna Repair Desk          |
| (x:30-110, y:415-485)          Discretionary Spending Trap                                        |
| SPAWN POINT (x:115, y:450)                                       [SAVINGS BANK & ATM KIOSK]       |
|                                                                  (x:815-950, y:370-495)           |
|                                                                  Stipend Passbook / ATM           |
+---------------------------------------------------------------------------------------------------+ (1024,572)
```

---

### 3. Key Landmarks & Gameplay Roles

| Landmark | Map Coordinates (x, y, w, h) | Financial Role & Narrative Context |
| :--- | :--- | :--- |
| **Start Bridge ("START")** | `(30, 415, 80, 70)` | The arrival threshold over the campus canal. Player spawns at `(115, 450)` upon entering the world. |
| **Hostel & Courtyard** | `(740, 20, 235, 205)` | The student's residential complex. Front courtyard houses Warden Rao Sir, the primary quest giver who demands prompt mess fee settlement. |
| **Campus Canteen & Patio** | `(260, 260, 260, 165)` | Discretionary spending trap featuring outdoor tables and umbrellas. Represents the temptation of daily Irani chai and snack splurges. |
| **Electronics Repair Shop** | `(610, 240, 120, 110)` | Suresh Anna's repair shop. Provides educational foreshadowing for unexpected emergency expenses (cracked screens). |
| **Savings Bank & ATM** | `(815, 370, 135, 125)` | Regulated student banking kiosk and 24/7 ATM. Where stipend deposits arrive and balance inquiries occur. |
| **Bookshop & Library** | `(330, 115, 100, 100)` | Academic resource station highlighting the difference between costly new books and budget-friendly second-hand volumes. |
| **Study Room Hall** | `(475, 65, 150, 130)` | Quiet study environment for exam preparation and financial literacy readings. |
| **Northern Road ("TO CITY 2")**| `(660, 0, 55, 75)` | Transition portal connecting to City 2 (Academic Bazaar) once the stipend budgeting challenge is mastered. |

---

### 4. Technical Engine Architecture

```
src/
├── assets/maps/city1_map.jpg          # Primary visual pixel art asset (1024x572)
├── components/world/
│   ├── WorldMapCanvas.tsx             # Responsive viewport, camera-follow, HUD & loop
│   └── NpcDialogueModal.tsx           # Interaction dialogs and challenge triggers
├── data/maps/
│   └── city1Data.ts                   # Collision boxes, entity definitions, spawn coordinates
└── engine/
    └── worldEngine.ts                 # 2.5D foot-aligned collision, vector math, camera bounds
```

#### Collision & Navigation Modeling (2.5D Foot-Alignment)
* **Separation of Concerns:** Collision geometry is maintained in structured bounding boxes (`Rect`), completely decoupled from the background image.
* **Foot-Aligned Hitbox:** The player's logical hitbox is strictly $20 \times 12$ pixels positioned at the player's feet. The visual sprite representation is offset upwards by $26$ pixels (`spriteOffsetY = -26`). This allows the player's head and shoulders to naturally overlap lower fences and walls for depth layering.
* **Corridor Clearance:** All roads and sidewalks maintain a minimum clearance of 35–50 pixels, ensuring smooth passage around the Canteen, between the Bookshop and Study Room, and into the Hostel courtyard.
* **Diagonal Normalization:** Diagonal velocity vectors are normalized by $1 / \sqrt{2} \approx 0.7071$ to eliminate diagonal speed multiplication.

---

### 5. Spawn Coordinates & Movement Specifications
* **Spawn Position:** `x = 115, y = 450`, `direction = 'right'`. Player steps off the Start Bridge onto the paved avenue.
* **Movement Controls:** `WASD` / Arrow Keys with continuous multi-key state tracking; touch D-pad for mobile viewports; mouse-click pathing with line-of-sight collision checks.
* **Movement Speed:** 3.5 logical pixels per frame (approx. 210 px/sec at 60 FPS).
* **Camera Bounds:** Dynamically centers on the player while clamping within `[0, mapWidth - viewportWidth]` and `[0, mapHeight - viewportHeight]`. Responsive scaling preserves pixel sharpness across viewports.

---

### 6. Solid Obstacles & Collision Mask

1. **River / Canal:** `x: [0, 95], y: [300, 572]` (excluding the bridge at `y: [420, 475]`).
2. **School & Library Complex:** `x: [15, 330], y: [10, 175]`, with courtyard opening at `x: [180, 240]`.
3. **Bookshop:** `x: [330, 430], y: [110, 210]`.
4. **Study Room Building:** `x: [470, 630], y: [60, 190]`.
5. **Hostel Building & Side Walls:** `x: [735, 985], y: [15, 220]`, with south courtyard entrance at `x: [810, 890]`.
6. **Campus Canteen Building & Patio Fence:** `x: [255, 525], y: [250, 420]`, with south patio gateway at `x: [360, 430]`.
7. **Electronics Repair Shop:** `x: [605, 735], y: [230, 350]`.
8. **Savings Bank Building:** `x: [810, 955], y: [360, 490]`.
9. **Outer Map Boundaries:** Rigid world perimeter clamped at `[0, 1024]` horizontal and `[0, 572]` vertical.

---

### 7. NPC & Interactive Entity Registry

```typescript
export interface CityEntity {
  id: string;
  type: 'npc' | 'object' | 'portal';
  name: string;
  x: number;
  y: number;
  radius: number;
  prompt: string;
  scenarioId?: string;
}
```

1. **Warden Rao Sir (NPC - Primary Challenge Gate)**
   * **Position:** `x: 840, y: 240` (Hostel Courtyard Entrance)
   * **Interaction Radius:** 40px
   * **Associated Challenge:** `scenario_hostel_stipend` (`city_hostel_commons`)
   * **Prompt:** `"Press E / Space to talk to Warden Rao Sir"`

2. **Suresh Anna (NPC - Foreshadowing & Emergency Guidance)**
   * **Position:** `x: 655, y: 355` (Electronics Repair Shop Front)
   * **Interaction Radius:** 38px
   * **Prompt:** `"Press E / Space to talk to Suresh Anna"`

3. **Campus ATM & Passbook Kiosk (Interactive Object)**
   * **Position:** `x: 925, y: 460` (Savings Bank Forecourt)
   * **Interaction Radius:** 35px
   * **Prompt:** `"Press E / Space to inspect Bank Passbook & Balance"`

4. **Campus Notice Board & Stipend Letter (Interactive Object / Collectible)**
   * **Position:** `x: 185, y: 395` (Beside Start Bridge Path)
   * **Interaction Radius:** 32px
   * **Prompt:** `"Press E / Space to read Scholarship Announcement"`

5. **Road to City 2 (Location Transition Portal)**
   * **Position:** `x: 685, y: 35` (Northern Road Exit)
   * **Trigger Radius:** 35px
   * **Target City:** `city_academic_bazaar`
   * **Behavior:** If City 1 is incomplete, displays clear advisory to clear hostel dues first; if complete, triggers city transition handler.

---

### 8. External Dependencies & Asset Status
* **Supplied City 1 Map Art:** Fully integrated as `src/assets/maps/city1_map.jpg`.
* **Player Character Sprites:** Developed separately by external team. A crisp, identifiable retro scholar avatar placeholder with directional facing indicators is utilized.
* **NPC Sprites:** Developed separately by external team. Distinctive themed placeholders with interaction indicators are utilized.
* **Deterministic Financial Engine:** Fully integrated with `PUZZLES['scenario_hostel_stipend']` via standard `App.tsx` callbacks.
