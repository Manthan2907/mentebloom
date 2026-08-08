/**
 * MoodCheckIn — Dashboard mood widget
 * Glass card with a subtle mood-tinted glow, a sliding glass-pill selector
 * (shared visual language with MoodGate), and a smooth week strip.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, DAY_SHORT } from "@/lib/store";
import type { Mood } from "@/lib/store";
import { GlassOrb, MOOD_GRADIENTS, MOOD_LABELS, getMoodText } from "./MoodFaces";

const MOODS: { value: Mood; label: string }[] = [
  { value: "sad", label: "Sad" },
  { value: "low", label: "Low" },
  { value: "okay", label: "Neutral" },
  { value: "good", label: "Good" },
  { value: "great", label: "Great" },
];

const FACTORS = ["Work", "Study", "Family", "Sleep", "Health"];

function hexWithAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function MoodCheckIn() {
  const { todayMood, moodFactors, moodHistory, setMood } = useStore();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(todayMood);
  const [selectedFactors, setSelectedFactors] = useState<string[]>(moodFactors);
  const [submitted, setSubmitted] = useState(!!todayMood);

  const handleSubmit = () => {
    if (selectedMood) {
      setMood(selectedMood, selectedFactors);
      setSubmitted(true);
    }
  };

  const reset = () => {
    setSubmitted(false);
  };

  const getWeekMoods = () => {
    const today = new Date();
    const weekMoods: (Mood | null)[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const entry = moodHistory.find((e) => e.date === dateStr);
      weekMoods.push(entry?.mood || null);
    }
    return weekMoods;
  };

  const weekMoods = getWeekMoods();
  const glowColor = selectedMood ? MOOD_GRADIENTS[selectedMood][1] : "#c8f54e";

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl"
      style={{
        boxShadow: `0 1px 0 rgba(255,255,255,0.6) inset, 0 20px 40px -20px ${hexWithAlpha(glowColor, 0.35)}`,
      }}
    >
      {/* mood-tinted ambient glow */}
      <motion.div
        className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full blur-3xl"
        animate={{ backgroundColor: hexWithAlpha(glowColor, 0.35) }}
        transition={{ duration: 0.6 }}
      />

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="checkin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <div className="mb-6 text-center">
              <motion.div
                key={`orb-${selectedMood}`}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="mx-auto"
              >
                <GlassOrb mood={selectedMood} size={64} active={!!selectedMood} />
              </motion.div>
              <h3 className="font-display text-xl font-bold text-[#1a1a1a] mt-3">
                How are you feeling today?
              </h3>
              <p className="text-sm text-[#1a1a1a]/40 mt-1 font-sans">{getMoodText(selectedMood)}</p>
            </div>

            {/* Sliding glass-pill selector */}
            <div className="relative flex items-center justify-between gap-1 rounded-full border border-[#e8e4df] bg-[#faf8f5] p-1.5">
              {MOODS.map((mood) => {
                const isActive = selectedMood === mood.value;
                return (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className="relative flex-1"
                    aria-pressed={isActive}
                    aria-label={`Select ${mood.label} mood`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="dashboard-mood-pill"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `linear-gradient(135deg, ${MOOD_GRADIENTS[mood.value][0]}, ${MOOD_GRADIENTS[mood.value][1]})`,
                        }}
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span
                      className={`relative z-10 flex items-center justify-center rounded-full px-2 py-2 text-[11px] font-mono uppercase tracking-wide transition-colors ${
                        isActive ? "text-[#1a1a1a] font-semibold" : "text-[#1a1a1a]/40 hover:text-[#1a1a1a]/70"
                      }`}
                    >
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Factor selection */}
            <AnimatePresence>
              {selectedMood && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-xs font-mono text-[#1a1a1a]/40 text-center mt-5 mb-3">
                    What affected your mood?
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pb-1">
                    {FACTORS.map((factor) => (
                      <button
                        key={factor}
                        onClick={() =>
                          setSelectedFactors((prev) =>
                            prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor]
                          )
                        }
                        className={`text-xs font-mono px-3 py-1.5 rounded-full transition-all ${
                          selectedFactors.includes(factor)
                            ? "bg-[#1a1a1a] text-white"
                            : "bg-white text-[#1a1a1a]/40 border border-[#e0dcd7] hover:border-[#1a1a1a]/30"
                        }`}
                      >
                        {factor}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center mt-5">
              <button
                onClick={handleSubmit}
                disabled={!selectedMood}
                className="text-xs font-mono tracking-wider bg-[#1a1a1a] text-white px-6 py-2.5 rounded-full hover:bg-[#1a1a1a]/85 transition-colors disabled:opacity-30 disabled:cursor-not-allowed uppercase font-semibold"
              >
                Save Mood
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <div className="flex items-center justify-center gap-3 mb-5">
              <GlassOrb mood={selectedMood} size={48} />
              <div className="text-left">
                <h3 className="font-display text-lg font-bold text-[#1a1a1a]">Today&apos;s Mood</h3>
                <p className="text-xs text-[#1a1a1a]/40 mt-0.5">
                  {selectedMood ? MOOD_LABELS[selectedMood] : "Not recorded"}
                  {selectedFactors.length > 0 && (
                    <span className="text-[#1a1a1a]/30"> · {selectedFactors.join(", ")}</span>
                  )}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-mono text-[#1a1a1a]/25 tracking-wider text-center mb-3 uppercase">
                This Week
              </p>
              <div className="flex items-center justify-center gap-2">
                {weekMoods.map((mood, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <GlassOrb mood={mood} size={26} />
                    </motion.div>
                    <span className="text-[9px] font-mono text-[#1a1a1a]/20">{DAY_SHORT[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-4">
              <button
                onClick={reset}
                className="text-[10px] font-mono text-[#1a1a1a]/20 hover:text-[#1a1a1a]/40 transition-colors"
              >
                Update mood
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
