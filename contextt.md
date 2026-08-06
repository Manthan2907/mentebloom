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
  - **Future Date Locking**: Checkboxes beyond the current date are strictly disabled (`disabled={isFuture}`) and rendered faded to prevent logging habits in the future.
- **Weekly Pulse Chart (`WeeklyPulse.tsx`)**:
  - Displays percentage of completed habits for each day of the current week.
  - Dynamic week-over-week performance comparison against the previous week.
  - Excludes future dates from skewing current week averages.
- **Streak Calculation Engine (`store.ts`)**:
  - Threshold-based streak logic: Completing at least one habit today increments streak by +1; unchecking all habits for today decrements streak by 1.
- **Mood Gate Overlay (`MoodGate.tsx`)**:
  - Interactive daily mood check-in splash screen before revealing the main dashboard.
- **Wellness Analytics & Hydration (`WellnessAnalytics.tsx`, `HydrationWidget.tsx`)**:
  - Daily water intake logger (2000ml goal) with future date zero-height guards on trend charts.
- **Reflections & Goals**:
  - *Today's Note*, *Intentions Widget*, *Journal Widget*, *Milestones*, and *Quote Widget*.

---

## 3. Academic Stress Score & Workload Tracker (`/app/academic-stress`)
- **Algorithmic Workload Index**:
  - Evaluates pending tasks based on study hours, difficulty multipliers (*Easy 1.0x, Medium 1.35x, Hard 1.75x, Extreme 2.3x*), and deadline urgency (*Overdue/Today 2.5x, <=1d 2.1x, <=3d 1.6x, <=7d 1.25x*).
  - Normalizes workload density into a **0–100% Academic Stress Scale**.
- **Circular Progress Ring & 5 Stress Levels**:
  - **Relaxed (0–20%)**: Green (`#22c55e`)
  - **Manageable (21–40%)**: Light Green (`#84cc16`)
  - **Busy (41–60%)**: Yellow (`#eab308`)
  - **Overloaded (61–80%)**: Orange (`#f97316`)
  - **Critical (81–100%)**: Red (`#ef4444`)
- **Subject Strain Breakdown**:
  - Calculates subject stress percentages and highlights the highest contributor with a **`HIGHEST STRAIN`** badge.
- **Custom Subject Creation**:
  - Add custom subjects specifying Course Code, Full Subject Name, and Theme Color choices.
- **Task Management**:
  - Filter tasks by status (*All, Pending, Completed*) or by Subject.
  - Check off tasks to dynamically recalculate the Academic Stress Score in real time.

---

## 4. Student Mental Health Consultation Portal (`/app/consultation`)
- **Verified Counselor Directory**:
  - Counselor profile cards displaying credentials, rating, specializations, consultation mode (*Online Video*, *In-Person / Offline*, or *Both*), and clinic location.
  - Specialization & Mode filter pills.
- **Interactive Booking Modal**:
  - Date picker, time slot selection, mode toggle, and toast notifications powered by Sonner.
- **Automated Wellness Report Generator**:
  - Prominent **"GENERATE WELLNESS REPORT"** button compiling live student metrics directly from the store (Wellness score, 30-day mood average, habit streak, hydration, academic stress index, journal summary).
  - Includes a clinical summary preview modal with a **"COPY REPORT TEXT"** action to share with counselors before sessions.
- **Student Wellness FAQs Accordion**:
  - Covers 6 core questions (*When to consult?, What is burnout?, Stress vs anxiety?, Managing exam stress, Session expectations, When to seek professional help*).

---

## 5. Mindful Meditation & Breathing Portal (`/app/meditation`)
- **2-Stage Immersive Journey**:
  - **Stage 1 (Warm Welcoming Screen)**: Deep forest sage card (`#1d3d2a`) featuring the 3D Welcoming Care Hands illustration (`/therapy_hands.png`), organic background curves, and a prominent **`Get Started`** button.
  - **Stage 2 (Minimalist Focused Breathing Space)**: Uncluttered, focused space featuring a 3D Lotus Meditating Figure (`/meditating_character.png`) floating gracefully (`y: [0, -8, 0]`) in front of expanding/contracting concentric aura rings.
- **4-Phase Rhythmic Breath Cycle**:
  - *Breathe In...* (Lime Green) $\rightarrow$ *Hold...* (Warm Gold) $\rightarrow$ *Breathe Out...* (Terracotta) $\rightarrow$ *Rest...* (Sky Blue).
- **Minimal Controls**:
  - Session duration selector (*3m, 5m, 10m*), large Play/Pause toggle, and a top `← Welcome` back button.

---

## 6. Build & Verification Status
- Production bundle compiled with `vite build` — **0 compilation or Typescript errors**.
