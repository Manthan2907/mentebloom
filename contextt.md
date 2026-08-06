# Development Context & Changelog

This document summarizes the recent fixes, redesigns, and new features implemented in the project to establish a clean, reactive, and premium "Mental Wellness Editorial" application.

## 1. Landing Page Fixes
* **Tailwind Configuration:** Added a Tailwind `@source` directive to `client/src/index.css` to force the compiler to scan the external `correct landing page` directory for CSS utility classes. This fixed an issue where the landing page appeared completely unstyled.
* **Typography:** Added the missing `--font-serif` alias to `index.css` so that the landing page's `font-serif` classes properly map to "Playfair Display".
* **Component Cleanup:** Updated `client/src/pages/LandingPage.tsx` to remove all legacy sections (Features, Stats, Reviews, FAQ) that were cluttering the UI. The page now strictly renders only the intended `NavWrapper` and `HeroSection` (the beautiful fullscreen video background).

## 2. Dashboard Reactivity & Bug Fixes
* **Global Store (`store.ts`):** 
  * Fixed a bug in `addWater` and `resetWater` where water intake was always being attributed to Sunday (index 6). It now dynamically uses `getTodayIndex()`.
  * Patched `toggleHabitDay` to prevent a habit's `monthlyCount` from dropping below zero when toggled rapidly.
* **Wellness Score (`WellnessScore.tsx`):** 
  * Centralized the wellness score calculation by importing `calculateWellnessScore` directly from the store.
  * Fixed the internal "Habits" progress bar to correctly measure *today's* completions (matching the actual score logic) rather than checking if a habit was completed *at least once* this week.
* **Hydration Widget (`HydrationWidget.tsx`):** 
  * Fixed the mini-chart to dynamically highlight the current day using `getTodayIndex()` instead of hardcoding the highlight to Sunday.
* **Wellness Analytics (`WellnessAnalytics.tsx`):**
  * Fixed the "Water Intake" bar chart to highlight today dynamically instead of Sunday.
  * Corrected the "Happiest Day" text insight logic. Previously, it assumed the 7-day rolling window always ended on a Sunday, resulting in incorrect day names. It now dynamically calculates the exact day name based on the rolling window index.

## 3. Streak Widget Redesign (Stitch Integration)
* **Premium Editorial Redesign:** Used the Stitch AI tool to entirely redesign the `StreakFooter.tsx` component to match the premium "Mental Wellness Edition" theme.
* **Dynamic Styling:** Implemented a warm yellow-to-orange gradient background and upgraded the typography to use high-contrast `Source Serif 4` and `JetBrains Mono`.
* **Soundwave Pulse Chart:** Replaced the static design with a dynamic "soundwave" mini bar chart. The chart directly reads `WeeklyPulse` from the store, meaning the 7 vertical bars instantly grow or shrink as habits are completed throughout the week.
* **Animations:**
  * Added a `framer-motion` loop to the background gradient, creating a slow, shimmering effect.
  * Added a breathing animation to the background `Lucide` Flame graphic (slow scaling, rotation, and opacity shifts).
  * Built a custom CSS particle system using `framer-motion` that generates floating embers/sparks that continuously drift up from the flame and fade out.

## 4. Global Smooth Scrolling
* **Lenis Integration:** Installed the `lenis` library via `pnpm` to add momentum-based smooth scrolling to the entire application.
* Wrapped the application's routing tree inside `App.tsx` with `<ReactLenis root>` to ensure both the dashboard and the long Landing Page scroll beautifully.
