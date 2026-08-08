import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Brain } from "lucide-react";
import { useStore } from "@/lib/store";
import MoltenMetal from "@/components/ui/MoltenMetal";

const NOTES = [
  {
    text: (
      <>
        Good morning. <strong className="text-white">Wake by 6 AM</strong> has been your steadiest habit at <span className="text-[#c8f54e] font-mono">38%</span> this month — start there, and the rest tends to follow.
      </>
    ),
  },
  {
    text: (
      <>
        Your consistency is building. <strong className="text-white">5 habits</strong> checked this week — you're on track for a new personal best.
      </>
    ),
  },
  {
    text: (
      <>
        Remember: <span className="italic text-[#c8f54e]">small, repeated things</span> compound. You don't need to be perfect — you just need to keep showing up.
      </>
    ),
  },
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 120 : -120,
    opacity: 0
  })
};

export function TodaysNote() {
  const { todayMood, moodFactors, moodNote } = useStore();
  const [activeIdx, setActiveIdx] = useState(0);

  const moodInsight = useMemo(() => {
    if (!todayMood) return "Check in with yourself to unlock a small, personal read on today.";
    const factor = moodFactors[0]?.toLowerCase();
    const tone = todayMood === "sad" || todayMood === "low" ? "Take the pressure down a notch" : todayMood === "great" || todayMood === "good" ? "Protect the momentum you have" : "Keep today simple and steady";
    return `${tone}${factor ? `, especially around ${factor}` : ""}. One honest next step is enough.`;
  }, [moodFactors, todayMood]);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const nextNote = () => {
    setDirection(1);
    setActiveIdx((prev) => (prev + 1) % NOTES.length);
  };

  const prevNote = () => {
    setDirection(-1);
    setActiveIdx((prev) => (prev - 1 + NOTES.length) % NOTES.length);
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 relative overflow-hidden min-h-[180px] flex flex-col justify-between">
      {/* Background Molten Metal Shader */}
      <div className="absolute inset-0 z-0 opacity-45 pointer-events-none">
        <MoltenMetal
          color1="#111111"
          color2="#c8f54e"
          color3="#ffffff"
          speed={0.25}
          scale={4}
          detail={3}
          glow={1.4}
          coreSize={0.08}
          swirl={1}
          fold={-0.2}
          blackPoint={0.05}
          brightness={1.2}
          colorMode="molten"
          grain={true}
          grainIntensity={0.03}
          mouseInteraction={true}
          mouseStrength={0.25}
          opacity={0.9}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-[#c8f54e] text-base font-mono">m</span>
          <span className="text-sm font-display font-bold text-white">
            Today's Note
          </span>
        </div>
        <span className="text-[10px] font-mono tracking-widest text-[#c8f54e] uppercase">
          ● TODAY
        </span>
      </div>

      {/* Mood reflection and local analysis */}
      {todayMood && (
        <div className="relative z-10 mb-4 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#c8f54e]"><Brain className="h-3.5 w-3.5" /> Mood read</div>
          <p className="mt-1 text-sm leading-relaxed text-white/85">{moodInsight}</p>
          {moodNote && <p className="mt-2 truncate text-xs italic text-white/45">“{moodNote}”</p>}
        </div>
      )}

      {/* Content Carousel with very smooth transitions */}
      <div className="relative z-10 h-14 overflow-hidden flex items-center">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeIdx}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 220, damping: 24 },
              opacity: { duration: 0.25 }
            }}
            className="text-sm text-white/85 leading-relaxed font-sans w-full"
          >
            {NOTES[activeIdx].text}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/10 relative z-10">
        <button
          onClick={prevNote}
          className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white/70 active:scale-90 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1.5 ml-2">
          {NOTES.map((_, i) => {
            const isActive = i === activeIdx;
            return (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isActive ? "w-5 bg-[#c8f54e]" : "w-1.5 bg-white/20"
                }`}
              />
            );
          })}
        </div>
        <button
          onClick={nextNote}
          className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white/70 active:scale-90 transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
