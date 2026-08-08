# Mentebloom — Mental Wellness & Student Performance Platform Documentation

This document contains a complete technical and feature summary of everything implemented in **Mentebloom**.

---

## 1. Brand & Design System Architecture
- **Platform Name**: Rebranded to **Mentebloom — Mental Wellness Edition** across all navigation header logos, footer copyrights, page titles, and storage keys.
- **Editorial Design System**:
  - **Background**: Soft Light Cream (`#faf8f5`) with dark/black modal overlay experiences for immersive shader-driven interactions.
  - **Primary Accent**: Electric Lime Green (`#c8f54e`)
  - **Typography**: Dark Charcoal (`#1a1a1a`) headers (and white `#ffffff` on dark backgrounds) with monospace (`font-mono`) micro-labels & badges.
  - **Card Containers**: Crisp rounded borders (`border-[#e8e4df] shadow-sm` or dark `bg-[#111111]` containers) with dark accent elements.
- **Data Model & Hydration**: Managed via Zustand global state store with defensive safe navigation fallbacks to prevent hydration crashes on older persisted browser states.

---

## 2. Core Dashboard & Navigation
- **Header Navigation Bar (`TopNav.tsx`)**:
  - Sticky header bar with direct navigation tabs: **`DASHBOARD`**, **`JOURNAL`**, **`ANALYTICS`**, **`WELLNESS`**, **`ACADEMIC`**, **`CONSULTATION`**, and **`MEDITATION`**.
  - **Focus Feature Removed**: Removed the `/app/productivity` Pomodoro/Focus route and link from `TopNav.tsx` and `App.tsx`.
- **Historical Habit Tracking Grid (`HabitsTable.tsx`)**:
  - Full time-travel date navigation (`< Prev` and `Next >`).
  - **Week Mode**: 7-day daily checkbox grid with checkmark micro-animations.
  - **Month Mode**: Adaptive 30-day calendar matrix.
  - **Future Date Locking**: Checkboxes beyond the current date are disabled and rendered faded to prevent logging habits in the future.
- **Hero Heading (`HeroSection.tsx`)**:
  - Displays **"Daily <dynamic_word>"** with static bold serif "Daily" and smoothly morphing italic accent words ("Practice", "Growing", "Learning", "Motivation", "Mindfulness", "Focus", "Reflection", "Progress") using Framer Motion `AnimatePresence`.
- **Weekly Pulse**:
  - Displays percentage of completed habits for each day of the current week.
  - Dynamic week-over-week performance comparison against the previous week.
  - Excludes future dates from skewing current week averages.
- **Zustand Reactive Store (`lib/store.ts`)**:
  - Global single source of truth for habits, streak, hydration, mood history, journal entries, intentions, sleep, exercise, and academic tasks.
  - Persisted in `localStorage` via Zustand middleware (`mentebloom-v3-storage`).
  - **Unified Real-time Synchronization**: All widgets across the entire product (Hero, Habits, Today's Note, Weekly Pulse, Milestones, Wellness Score, Analytics, Journal, Academic Stress, Consultation) read reactively from `useStore()`. Checking a habit or logging mood dynamically updates streaks, progress bars, milestone counts, and wellness scores across the entire application instantly.

---

## 3. Mood Gate Overlay (`MoodGate.tsx`)
- **Interactive daily mood check-in splash screen before revealing the main dashboard.**
- **Dark `#000000` background with dynamic WebGL `GradientWaves` shader background.**
- **Direct Transition**: 2 phases (Mood Selection -> Factors -> Motivational Quote), directly transitioning to the main dashboard after the quote without showing a redundant final confirmation screen.
- **Session & Landing Page Navigation**: MoodGate completion state is stored in `sessionStorage`. Clicking "Get Started" on the Landing Page resets this state so the **MoodGate check-in screen always appears when entering from the Landing Page**. Navigating between tabs (Journal, Wellness, Academic, Meditation, Consultation) and clicking `DASHBOARD` retains your active session and stays on the main dashboard.
- **Heading**: Large, high-contrast white serif header (`How would you describe your mood?`).
- **WebGL GradientWaves Background (`GradientWaves.tsx`)**:
  - Full-screen raymarching sine-plasma WebGL shader (`ogl` library) with subtle animated film grain and cursor parallax.
  - **Dynamic Mood Color Morphing**: Per-frame smooth RGB lerping (`+= 0.05 * (target - current)`) transitions wave colors smoothly as user hovers/selects different moods:
    - **Down (Sad)**: Deep Crimson/Blood Red (`horizon: "#050000"`, `wave: "#4a1520"`, `crest: "#a33d4e"`)
    - **Low**: Deep Purple/Violet (`horizon: "#020005"`, `wave: "#2c1a40"`, `crest: "#7a52a3"`)
    - **Neutral (Okay)**: Warm Grey/Beige (`horizon: "#050505"`, `wave: "#4a4641"`, `crest: "#d4ccbe"`)
    - **Good**: Deep Navy Blue (`horizon: "#000508"`, `wave: "#1a2c40"`, `crest: "#527aa3"`)
    - **Great**: Deep Forest Green (`horizon: "#000500"`, `wave: "#1a4020"`, `crest: "#52a36b"`)
- **Gauge Dial & Factors**:
  - Semicircular gauge with 5 colored mood segments & faces.
  - Factor chip selection ("Sleep", "Work", "Fitness", "Social", "Weather", "Health").
  - Inspirational quote phase with Mentebloom branding dismiss.

---

## 4. Wellness Page Shader & Dark Aesthetic Updates (`/app/wellness`)
- **Sleep & Exercise Shader Cards**:
  - Re-themed Sleep Tracker, Exercise Logger, and summary/correlation cards to dark aesthetic (`bg-[#111111]`).
- **WebGL React Bits Integration**:
  - **`<LightRays />`**: Integrated behind Sleep Tracker cards.
  - **`<Aurora />`**: Integrated behind Exercise summary cards and Sleep correlation cards with green/white and grayscale/black aurora colorStops (`["#eaf2e9", "#0c0d0c", "#f0eef5"]`).
  - **`<FaultyTerminal />`**: Integrated WebGL shader variant.
  - **`<LiquidChrome />`**: Integrated fluid WebGL chrome distortion.

---

## 5. Academic Stress Score & Workload Tracker (`/app/academic-stress`)
- **Algorithmic Workload Index**:
  - Evaluates pending tasks based on: study hours * difficulty multipliers (Easy 1.0x, Medium 1.35x, Hard 1.75x, Extreme 2.3x) * deadline urgency (Overdue 2.5x, <=1d 2.1x, <=3d 1.6x, <=7d 1.25x).
  - Normalizes into a **0–100 Academic Stress Scale**.
- **Circular Progress Ring & 5 Stress Levels**:
  - Relaxed (0–20%) Green, Manageable (21–40%) Light Green, Busy (41–60%) Yellow, Overloaded (61–80%) Orange, Critical (81–100%) Red.
- **Subject Strain Breakdown**:
  - Calculates stress percentage per subject; highlights highest contributor with `HIGHEST STRAIN` badge.

---

## 6. Student Mental Health Consultation Portal (`/app/consultation`)
- **Verified Counselor Directory**:
  - Cards: credentials, rating, specializations, consultation mode (Online / In-Person / Both), clinic location.
  - Filter pills by specialization & mode.
  - **Black Border Glow**: Doctor profile cards feature an animated border glow (`BorderGlow.tsx`).
- **Interactive Booking Modal**: Date picker, time slots, mode toggle, Sonner toast notifications.
- **Slide-up Fill Buttons (`button-6.tsx`)**: All portal buttons use dark navy gradient slide-up fill animations on hover.

---

## 7. Mindful Meditation & Breathing Portal (`/app/meditation`)
- **Iridescent WebGL Plasma Orb (`Orb.tsx`)**:
  - Full-page WebGL shader background (`ogl`) with mouse proximity hover distortion filling page `#121212`.
  - All breathing content floats over the WebGL plasma orb (`z-index: 10`).

---

## 8. Component Library Index (`client/src/components/ui/`)

| Component | Description | Technologies |
|---|---|---|
| `BlurText.tsx` | Animated blur-in text component with word-by-word or letter-by-letter entrance animations | `framer-motion`, React |
| `card-fan-carousel.tsx` | GSAP 3D interactive circular emoji orb fan carousel | GSAP, Tailwind, React |
| `glass-shine-card.tsx` | Glassmorphism card container with glossy shine animation sweep effect | CSS Keyframes, Tailwind, React |
| `OverlappingMoodStack.tsx` | Overlapping avatar circular emoji badge stack component matching reference design | `framer-motion`, Tailwind, React |
| `SpecularButton.tsx` | Interactive WebGL shader specular highlight glass button component (`ogl`) | WebGL, `ogl`, Tailwind, React |
| `GradientWaves.tsx` | Full-screen raymarching sine-plasma wave WebGL background with frame-by-frame color lerping, grain, and mouse parallax | WebGL, `ogl`, React |
| `MaskedHeading.tsx` | Text masking heading component powered by GSAP entrance animations | GSAP, SVG ClipPath |
| `WaveMaskedHeading.tsx` | Specialized heading component masking live WebGL `GradientWaves` inside text glyphs | WebGL, GSAP, SVG ClipPath |
| `Orb.tsx` | WebGL iridescent plasma orb background shader | WebGL, `ogl` |
| `BorderGlow.tsx` | Animated border glow wrapper component | CSS Keyframes, Tailwind |
| `button-6.tsx` | Slide-up navy gradient fill action button | CSS Transitions, Tailwind |

---

## 9. File Structure Summary

```
client/src/
├── components/
│   ├── ui/
│   │   ├── GradientWaves.tsx     -- Mood-reactive WebGL wave background (MoodGate)
│   │   ├── MaskedHeading.tsx     -- GSAP-powered masked heading
│   │   ├── WaveMaskedHeading.tsx -- Live WebGL wave text clipping component
│   │   ├── Orb.tsx               -- WebGL shader orb (Meditation background)
│   │   ├── button-6.tsx          -- Slide-up fill button (Consultation)
│   │   └── BorderGlow.tsx        -- Animated border glow wrapper (Consultation)
│   ├── MoodGate.tsx              -- Full-screen mood gate with dynamic GradientWaves colors
│   ├── MoodCheckIn.tsx           -- Daily mood log widget
│   ├── MoodHistory.tsx           -- 28-day mood calendar grid
│   ├── MoodFaces.tsx             -- SVG face illustrations & color tokens
│   ├── WellnessScore.tsx         -- Circular wellness progress ring
│   ├── HabitsTable.tsx           -- Habit tracking grid (week/month modes)
│   ├── TopNav.tsx                -- Navigation header (Focus removed)
│   └── ...other widgets
├── pages/
│   ├── Home.tsx                  -- Dashboard home
│   ├── Wellness.tsx              -- Wellness page with LightRays/Aurora/Dark card themes
│   ├── Meditation.tsx            -- Dark meditation page with WebGL Orb
│   ├── Consultation.tsx          -- Consultation portal
│   ├── Journal.tsx               -- Mindful journaling space
│   ├── Analytics.tsx             -- Detailed analytics dashboard
│   └── AcademicStress.tsx        -- Academic workload & stress tracker
└── lib/
    └── store.ts                  -- Zustand store for app state & calculations
```
