/**
 * Mentebloom — Mental Wellness Edition
 * Editorial Theme: LIGHT cream/white background, dark text, lime green accents
 * Today's Note is the ONLY dark card (black bg with white/green text)
 * MoodGate appears first as full-screen overlay, then reveals the dashboard
 */
import { lazy, Suspense, useState, type ReactNode } from "react";
import { MoodGate } from "@/components/MoodGate";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";

const TopNav = lazy(() => import("@/components/TopNav").then((module) => ({ default: module.TopNav })));
const HeroSection = lazy(() => import("@/components/HeroSection").then((module) => ({ default: module.HeroSection })));
const HabitsTable = lazy(() => import("@/components/HabitsTable").then((module) => ({ default: module.HabitsTable })));
const TodaysNote = lazy(() => import("@/components/TodaysNote").then((module) => ({ default: module.TodaysNote })));
const IntentionsWidget = lazy(() => import("@/components/IntentionsWidget").then((module) => ({ default: module.IntentionsWidget })));
const WeeklyPulse = lazy(() => import("@/components/WeeklyPulse").then((module) => ({ default: module.WeeklyPulse })));
const MilestonesWidget = lazy(() => import("@/components/MilestonesWidget").then((module) => ({ default: module.MilestonesWidget })));
const StreakFooter = lazy(() => import("@/components/StreakFooter").then((module) => ({ default: module.StreakFooter })));
const HydrationWidget = lazy(() => import("@/components/HydrationWidget").then((module) => ({ default: module.HydrationWidget })));
const JournalWidget = lazy(() => import("@/components/JournalWidget").then((module) => ({ default: module.JournalWidget })));
const WellnessAnalytics = lazy(() => import("@/components/WellnessAnalytics").then((module) => ({ default: module.WellnessAnalytics })));
const WellnessScore = lazy(() => import("@/components/WellnessScore").then((module) => ({ default: module.WellnessScore })));
const MoodHistory = lazy(() => import("@/components/MoodHistory").then((module) => ({ default: module.MoodHistory })));
const QuoteWidget = lazy(() => import("@/components/QuoteWidget").then((module) => ({ default: module.QuoteWidget })));
const AppFooter = lazy(() => import("@/components/AppFooter").then((module) => ({ default: module.AppFooter })));

function DashboardLoading() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-sm text-[#1a1a1a]/50" role="status" aria-live="polite">
      Loading your dashboard…
    </div>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Wraps a dashboard section so it glides into view as the user scrolls,
 * rather than firing once on mount — this is what gives the page its
 * smooth, "playing forward" feel while scrolling. */
function ScrollReveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

function getGateKey(): string {
  return `mentebloom_gate_${new Date().toISOString().split("T")[0]}`;
}

function hasCompletedTodayCheckIn(): boolean {
  try {
    return window.localStorage.getItem(getGateKey()) === "done";
  } catch {
    return false;
  }
}

export default function Home() {
  const [gateDone, setGateDone] = useState<boolean>(hasCompletedTodayCheckIn);

  const handleGateComplete = () => {
    try {
      window.localStorage.setItem(getGateKey(), "done");
    } catch {
      // Continue without persistence when storage is unavailable.
    }
    setGateDone(true);
  };

  const handleResetCheckIn = () => {
    try {
      window.localStorage.removeItem(getGateKey());
    } catch {
      // Continue without persistence when storage is unavailable.
    }
    setGateDone(false);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a]">
      <AnimatePresence mode="wait">
        {!gateDone ? (
          <MoodGate key="gate" onComplete={handleGateComplete} />
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Suspense fallback={<DashboardLoading />}>
              <TopNav onResetCheckIn={handleResetCheckIn} />

            <main className="container max-w-[1280px] mx-auto px-4 lg:px-8 pb-8">
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <HeroSection />
              </motion.div>

              {/* Main Two-Column Layout */}
              <div className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
                  {/* Left Column — Primary Content */}
                  <div className="space-y-5">
                    <ScrollReveal>
                      <HabitsTable />
                    </ScrollReveal>
                    <ScrollReveal>
                      <TodaysNote />
                    </ScrollReveal>
                    <ScrollReveal>
                      <IntentionsWidget />
                    </ScrollReveal>
                    <ScrollReveal>
                      <WeeklyPulse />
                    </ScrollReveal>
                    <ScrollReveal>
                      <JournalWidget />
                    </ScrollReveal>
                  </div>

                  {/* Right Column — Wellness Widgets */}
                  <div className="space-y-5">
                    <ScrollReveal>
                      <HydrationWidget />
                    </ScrollReveal>
                    <ScrollReveal>
                      <WellnessScore />
                    </ScrollReveal>
                    <ScrollReveal>
                      <MoodHistory />
                    </ScrollReveal>
                    <ScrollReveal>
                      <QuoteWidget />
                    </ScrollReveal>
                    <ScrollReveal>
                      <MilestonesWidget />
                    </ScrollReveal>
                    <ScrollReveal>
                      <WellnessAnalytics />
                    </ScrollReveal>
                    <ScrollReveal>
                      <StreakFooter />
                    </ScrollReveal>
                  </div>
                </div>
              </div>
            </main>

              <AppFooter />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
