# Mentebloom — Mental Wellness & Student Performance Platform Documentation

This document contains a complete technical and feature summary of everything implemented in **Mentebloom**.

---

## 1. Brand & Design System Architecture
- **Platform Name**: Rebranded to **Mentebloom — Mental Wellness Edition** across all navigation header logos, footer copyrights, page titles, and storage keys.
- **Editorial Design System**:
  - **Background**: Soft Light Cream (`#faf8f5`)
  - **Primary Accent**: Electric Lime Green (`#c8f54e`)
  - **Typography**: Dark Charcoal (`#1a1a1a`) headers with monospace (`font-mono`) micro-labels & badges.
  - **Card Containers**: Crisp rounded borders (`border-[#e8e4df] shadow-sm`) with dark accent elements.
- **Data Model & Hydration**: Managed via Zustand global state store with defensive safe navigation fallbacks to prevent hydration crashes on older persisted browser states.

---

## 2. Core Dashboard Features (`/app`)
- **Header Navigation Bar (`TopNav.tsx`)**:
  - Sticky header bar with direct navigation tabs: **`DASHBOARD`**, **`ACADEMIC STRESS`**, **`CONSULTATION`**, and **`MEDITATION`**.
- **Historical Habit Tracking Grid (`HabitsTable.tsx`)**:
  - Full time-travel date navigation (`< Prev` and `Next >`).
  - **Week Mode**: 7-day daily checkbox grid with checkmark micro-animations.
  - **Month Mode**: Adaptive 30-day calendar matrix.
  - **Future Date Locking**: Checkboxes beyond the current date are disabled and rendered faded to prevent logging habits in the future.
- **Weekly Pulse Chart (`WeeklyPulse.tsx`)**:
  - Displays percentage of completed habits for each day of the current week.
  - Dynamic week-over-week performance comparison against the previous week.
  - Excludes future dates from skewing current week averages.
- **Streak Calculation Engine (`store.ts`)**:
  - Threshold-based streak logic: completing at least one habit today increments streak +1; unchecking all habits for today decrements streak -1.
- **Mood Gate Overlay (`MoodGate.tsx`)**:
  - Interactive daily mood check-in splash screen before revealing the main dashboard.
  - Light cream `#faf8f5` background with a colorful SVG arc gauge (5 segments: sad=orange -> great=lime).
  - 3 phases: mood dial -> factor chips -> quote & dismiss.
- **Wellness Analytics & Hydration (`WellnessAnalytics.tsx`, `HydrationWidget.tsx`)**:
  - Daily water intake logger (2000ml goal) with future date zero-height guards on trend charts.
- **Reflections & Goals**:
  - *Today's Note*, *Intentions Widget*, *Journal Widget*, *Milestones*, and *Quote Widget*.

---

## 3. Academic Stress Score & Workload Tracker (`/app/academic-stress`)
- **Algorithmic Workload Index**:
  - Evaluates pending tasks based on: study hours * difficulty multipliers (Easy 1.0x, Medium 1.35x, Hard 1.75x, Extreme 2.3x) * deadline urgency (Overdue 2.5x, <=1d 2.1x, <=3d 1.6x, <=7d 1.25x).
  - Normalizes into a **0–100 Academic Stress Scale**.
- **Circular Progress Ring & 5 Stress Levels**:
  - Relaxed (0–20%) Green, Manageable (21–40%) Light Green, Busy (41–60%) Yellow, Overloaded (61–80%) Orange, Critical (81–100%) Red.
- **Subject Strain Breakdown**:
  - Calculates stress percentage per subject; highlights highest contributor with `HIGHEST STRAIN` badge.
- **Task Management**:
  - Filter by status (All, Pending, Completed) or Subject; completing tasks live-recalculates the stress score.

---

## 4. Student Mental Health Consultation Portal (`/app/consultation`)
- **Verified Counselor Directory**:
  - Cards: credentials, rating, specializations, consultation mode (Online / In-Person / Both), clinic location.
  - Filter pills by specialization & mode.
- **Interactive Booking Modal**: Date picker, time slots, mode toggle, Sonner toast notifications.
- **Automated Wellness Report Generator**:
  - "GENERATE WELLNESS REPORT" compiles live student metrics (Wellness score, 30-day mood avg, habit streak, hydration, stress index, journal).
  - Preview modal with "COPY REPORT TEXT" action.
- **FAQs Accordion**: 6 questions covering when to consult, burnout, stress vs anxiety, exam stress, session expectations, professional help.

### Changes Made This Session:
- **FAQ emojis removed** from question titles for a cleaner editorial look.
- **Black animated border glow** added to doctor profile cards via `BorderGlow` component on hover.
- **All buttons replaced with `Button6`** — a slide-up fill animation button. On hover, a dark navy gradient (`dark:from-[#070e41] dark:to-[#263381]`) slides up from the bottom revealing white text. File: `client/src/components/ui/button-6.tsx`.

---

## 5. Mindful Meditation & Breathing Portal (`/app/meditation`)
- **Original Design** (pre-session): 2-stage card journey (sage welcome screen -> minimal breathing space) with therapy hands image and meditating lotus figure, 4-phase breath cycle.

### Full Dark Redesign (This Session):
- Entire page background changed to near-black `#121212`.
- **Orb WebGL Background** (`client/src/components/ui/Orb.tsx`):
  - Full-page WebGL shader background using the `ogl` library (Mesh, Program, Renderer, Triangle, Vec3).
  - GLSL fragment shader creates a time-animated iridescent plasma ring with interactive hover distortion.
  - Props: `hue` (0 = blue/purple range), `hoverIntensity` (0.5), `rotateOnHover` (true), `forceHoverState` (false), `backgroundColor`.
  - Fills the entire page behind content via `position: absolute; inset: 0; z-index: 0`.
  - Mouse proximity within 300px of canvas triggers increased distortion intensity.
  - On unmount, `WEBGL_lose_context` extension invoked to free GPU memory and prevent context leaks.
- **Grounding Advisory card removed** from the meditation page per user request.
- **Lotus Pose option removed** from breathing session options.
- All breathing content rendered with `position: relative; z-index: 10` above the Orb.

---

## 6. Component Library Additions (`client/src/components/ui/`)

### `BorderGlow.tsx`
- Animated border glow wrapper component (black/shimmer variant).
- Used on doctor profile cards in Consultation page.
- Wraps any children with a CSS keyframe animated border glow.

### `button-6.tsx`
- Slide-up fill animation button for Consultation page.
- `group relative inline-flex h-12` container; inner label div translates from `translate-y-0` to `translate-y-[-150%]` on hover while background layer translates up from below.
- Dark navy gradient fill: `bg-gradient-to-r dark:from-[#070e41] dark:to-[#263381]`.

### `Orb.tsx`
- Full WebGL iridescent plasma orb using `ogl`.
- Used as full-page background on the Meditation page.
- Props: `hue`, `hoverIntensity`, `rotateOnHover`, `forceHoverState`, `backgroundColor`.

---

## 7. Mood Cart Dashboard — Attempted Redesign & Revert

### What Was Attempted:
- Used the **Stitch MCP tool** to generate a premium "Lumina Wellness" dark design system.
- Stitch produced a full HTML mockup: `#0f0f0f` base, `rgba(26,26,26,0.7)` glassmorphism cards with `backdrop-filter: blur(20px)`, `white/10` borders, lime green `#c8f54e` progress ring with glow, sky blue `#38bdf8` water bars, colored mood dot calendar, insights box.

### Changes Applied to Code (all reverted):
| File | Change |
|---|---|
| `MoodCheckIn.tsx` | Rewritten with dark glassmorphism, glow rings, lime Save button |
| `MoodHistory.tsx` | Rewritten with dark calendar dot grid |
| `WellnessScore.tsx` | Rewritten with dark SVG progress ring + breakdown bars |
| `WellnessAnalytics.tsx` | Rewritten with dark glow bar charts + insights box |
| `MoodGate.tsx` | Rewritten with dark `rgba(10,10,10,0.97)` overlay |
| `Home.tsx` | Background `#faf8f5` -> `#0f0f0f`; `MoodCheckIn` added to right column |
| `store.ts` | Duplicate `monthlyCount` field removed from `Habit` interface |

### Why Reverted:
- User feedback: *"its just black the background, you didnt design it, you just changed the background."*
- All 7 files fully restored via `git checkout HEAD -- <files>`.

### Current State:
- All Mood Cart components remain at the **original light cream editorial theme**.
- The `store.ts` duplicate `monthlyCount` fix was also reverted (bug still exists in committed code).
- **TODO**: Properly redesign Mood Cart with actual structural/visual improvements (layout, charts, illustrations, hierarchy) — not just color changes.

---

## 8. Known Issues & Bugs

| Issue | Location | Status |
|---|---|---|
| Duplicate `monthlyCount: number` in `Habit` interface (TS2300) | `client/src/lib/store.ts` lines 15–16 | Present in committed code, non-blocking for Vite |
| `csstype` version mismatch warnings | `correct landing page/` workspace vs main workspace | Only affects `correct landing page/` — no impact on main client build |

---

## 9. Build & Verification Status
- Production bundle compiled with `vite build` — **0 compilation errors** (at time of Meditation page redesign).
- Dev server runs on `http://localhost:3001/` (port 3000 occupied).

---

## 10. File Structure Reference

```
client/src/
├── components/
│   ├── ui/
│   │   ├── Orb.tsx               -- WebGL shader orb (Meditation page background)
│   │   ├── button-6.tsx          -- Slide-up fill button (Consultation page)
│   │   └── BorderGlow.tsx        -- Animated border glow wrapper (Consultation doctor cards)
│   ├── MoodCheckIn.tsx           -- Daily mood log widget (light theme, original)
│   ├── MoodHistory.tsx           -- 28-day mood calendar grid (light theme, original)
│   ├── MoodGate.tsx              -- Full-screen mood check-in overlay (light cream, original)
│   ├── MoodFaces.tsx             -- SVG face illustrations; exports: MoodFace, MOOD_COLORS, MOOD_LABELS, getMoodText
│   ├── WellnessScore.tsx         -- Circular wellness progress ring (light theme, original)
│   ├── WellnessAnalytics.tsx     -- Mood trend + water + journal bar charts (light theme, original)
│   ├── HabitsTable.tsx           -- Habit tracking grid (week/month modes)
│   ├── HydrationWidget.tsx       -- Water intake tracker (2000ml goal)
│   ├── TopNav.tsx                -- Sticky navigation bar
│   ├── HeroSection.tsx           -- Dashboard hero/greeting
│   └── ...other widgets
├── pages/
│   ├── Home.tsx                  -- Main dashboard (bg: #faf8f5 cream, original)
│   ├── Meditation.tsx            -- Dark meditation page (#121212) with Orb WebGL background
│   ├── Consultation.tsx          -- Consultation portal with BorderGlow cards + Button6 buttons
│   └── AcademicStress.tsx        -- Academic workload & stress tracker
└── lib/
    └── store.ts                  -- Zustand store; key exports: useStore, calculateWellnessScore,
                                     getWeeklyPulse, getTodayIndex, DAY_SHORT, DAY_LABELS,
                                     calculateAcademicStressScore, getSubjectStressBreakdown
```
