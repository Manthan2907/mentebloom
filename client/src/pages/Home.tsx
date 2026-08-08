/**
 * Mentebloom — Mental Wellness Edition
 * Editorial Theme: LIGHT cream/white background, dark text, lime green accents
 * Today's Note is the ONLY dark card (black bg with white/green text)
 * MoodGate appears first as full-screen overlay, then reveals the dashboard
 */
import { lazy, Suspense, useState } from "react";
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
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

export default function Home() {
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);

  const openMoodCheckIn = () => setShowMoodCheckIn(true);
  const closeMoodCheckIn = () => setShowMoodCheckIn(false);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a]">
      <AnimatePresence mode="wait">
        <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Suspense fallback={<DashboardLoading />}>
              <TopNav onResetCheckIn={openMoodCheckIn} />

            <main className="container max-w-[1280px] mx-auto px-4 lg:px-8 pb-8">
              {/* Hero Section */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <HeroSection />
              </motion.div>

              {/* Main Two-Column Layout */}
              <motion.div
                initial="hidden"
                animate="visible"
                className="mt-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
                  {/* Left Column — Primary Content */}
                  <div className="space-y-5">
                    <motion.div variants={itemVariants}>
                      <HabitsTable />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <TodaysNote />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <IntentionsWidget />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <WeeklyPulse />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <JournalWidget />
                    </motion.div>
                  </div>

                  {/* Right Column — Wellness Widgets */}
                  <div className="space-y-5">
                    <motion.div variants={itemVariants}>
                      <HydrationWidget />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <WellnessScore />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <MoodHistory />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <QuoteWidget />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <MilestonesWidget />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <WellnessAnalytics />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <StreakFooter />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </main>

              <AppFooter />
            </Suspense>
  </motion.div>
  </AnimatePresence>

  <AnimatePresence>
    {showMoodCheckIn && <MoodGate key="mood-check-in" onComplete={closeMoodCheckIn} />}
  </AnimatePresence>
  </div>
  );
}
