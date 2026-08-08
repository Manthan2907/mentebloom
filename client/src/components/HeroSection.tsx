import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";

import ColorBends from "@/components/ui/ColorBends";

const DYNAMIC_WORDS = [
  "Practice",
  "Growing",
  "Learning",
  "Motivation",
  "Mindfulness",
  "Focus",
  "Reflection",
  "Progress"
];

export function HeroSection() {
  const { currentStreak, weeklyStreak, goalProgress, goalTarget } = useStore();
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % DYNAMIC_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="bg-white/75 backdrop-blur-md rounded-xl p-6 lg:p-8 shadow-sm border border-[#e8e4df] relative overflow-hidden">
      {/* Eye-catching ColorBends Shader Background */}
      <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
        <ColorBends
          colors={["#c8f54e", "#38bdf8", "#818cf8"]}
          rotation={-141}
          speed={0.25}
          scale={1.2}
          frequency={1.0}
          warpStrength={1.2}
          mouseInfluence={0.6}
          noise={0.06}
          parallax={0.4}
          iterations={1}
          intensity={1.8}
          bandWidth={6}
          transparent={true}
          autoRotate={2}
        />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        {/* Avatar / Brand Icon */}
        <div className="relative shrink-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-16 h-16 rounded-full flex items-center justify-center border border-black/30 relative overflow-hidden shadow-md cursor-pointer"
            style={{
              background: "conic-gradient(from 0deg, #1a1a1a 0%, #3a3a3a 18%, #1a1a1a 35%, #c8f54e 50%, #1a1a1a 65%, #3a3a3a 82%, #c8f54e 93%, #1a1a1a 100%)",
            }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          >
            {/* Concentric grooves */}
            <div className="absolute inset-1 rounded-full border border-black/45" />
            <div className="absolute inset-2.5 rounded-full border border-white/5" />
            <div className="absolute inset-4 rounded-full border border-black/35" />

            {/* Inner record label */}
            <div className="w-6 h-6 rounded-full bg-[#2a2a2a] border border-black/60 flex items-center justify-center z-10">
              {/* Spindle hole */}
              <div className="w-1.5 h-1.5 rounded-full bg-[#c8f54e]" />
            </div>
          </motion.div>

          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#c8f54e] text-[#1a1a1a] text-[8px] font-mono font-bold px-2 py-0.5 rounded-sm tracking-wider whitespace-nowrap z-20 shadow-xs">
            ★ STEADY HAND
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono tracking-widest text-white bg-[#1a1a1a] px-2 py-0.5 rounded-sm shadow-xs">
              MONTH 09
            </span>
            <span className="text-xs text-[#1a1a1a]/60 font-sans italic">
              A quiet practice, kept honestly
            </span>
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-tight flex items-center gap-2">
            <span>Daily</span>
            <span className="inline-block relative overflow-hidden py-1 h-[1.3em]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={DYNAMIC_WORDS[wordIndex]}
                  initial={{ y: 22, opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -22, opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                  className="italic text-[#1a1a1a]/70 inline-block font-display"
                >
                  {DYNAMIC_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3">
            <span className="text-xs font-mono tracking-wider text-[#1a1a1a]/50 uppercase font-semibold">
              Goal Progress · This Month
            </span>
            <div className="flex-1 max-w-[300px]">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2.5 bg-[#e8e4df]/80 rounded-full overflow-hidden p-0.5 border border-black/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goalProgress}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-[#c8f54e] rounded-full shadow-xs"
                  />
                </div>
                <span className="text-sm font-mono text-[#1a1a1a]/60 font-bold">
                  {goalProgress} / {goalTarget}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="hidden md:flex flex-col items-end shrink-0 pl-4 border-l border-[#e8e4df]/60">
          <span className="text-[10px] font-mono tracking-widest text-[#1a1a1a]/40 uppercase mb-1 font-semibold">
            Current Streak
          </span>
          <div className="text-5xl font-display font-bold text-[#1a1a1a] tracking-tight">
            ·{currentStreak}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[#4a7c15] bg-[#c8f54e]/20 px-2 py-0.5 rounded-full border border-[#c8f54e]/30">
            <svg className="w-3 h-3" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M3 6l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-[10px] font-mono font-bold tracking-wider">
              DAYS · +{weeklyStreak} THIS WEEK
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
