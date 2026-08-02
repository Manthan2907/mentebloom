/**
 * MyHabits — Mental Wellness Edition
 * Editorial Theme: LIGHT cream/white background, dark text, lime green accents
 * Today's Note is the ONLY dark card (black bg with white/green text)
 * MoodGate appears first as full-screen overlay, then reveals the dashboard
 */
import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { HeroSection } from "@/components/HeroSection";
import { HabitsTable } from "@/components/HabitsTable";
import { TodaysNote } from "@/components/TodaysNote";
import { IntentionsWidget } from "@/components/IntentionsWidget";
import { WeeklyPulse } from "@/components/WeeklyPulse";
import { MilestonesWidget } from "@/components/MilestonesWidget";
import { StreakFooter } from "@/components/StreakFooter";
import { HydrationWidget } from "@/components/HydrationWidget";
import { JournalWidget } from "@/components/JournalWidget";
import { WellnessAnalytics } from "@/components/WellnessAnalytics";
import { WellnessScore } from "@/components/WellnessScore";
import { MoodHistory } from "@/components/MoodHistory";
import { QuoteWidget } from "@/components/QuoteWidget";
import { AppFooter } from "@/components/AppFooter";
import { MoodGate } from "@/components/MoodGate";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

function getGateKey(): string {
  return `myhabits_gate_${new Date().toISOString().split("T")[0]}`;
}

export default function Home() {
  const [gateDone, setGateDone] = useState<boolean>(false);

  const handleGateComplete = () => {
    setGateDone(true);
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
            <TopNav />

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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
