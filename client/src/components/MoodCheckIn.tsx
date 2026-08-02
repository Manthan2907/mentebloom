/**
 * MoodCheckIn — Mood tracker widget
 * Uses custom SVG illustrated faces instead of emojis
 * Editorial Theme: Light white card
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, DAY_SHORT } from "@/lib/store";
import type { Mood } from "@/lib/store";
import { MoodFace, MOOD_COLORS, MOOD_LABELS, getMoodText } from "./MoodFaces";

const MOODS: { value: Mood; label: string; color: string }[] = [
  { value: "sad", label: "Sad", color: "#e07b39" },
  { value: "low", label: "Low", color: "#e6a23c" },
  { value: "okay", label: "Neutral", color: "#f0c040" },
  { value: "good", label: "Good", color: "#7cb342" },
  { value: "great", label: "Great", color: "#c8f54e" },
];

const FACTORS = ["Work", "Study", "Family", "Sleep", "Health"];

export function MoodCheckIn() {
  const { todayMood, moodFactors, moodHistory, setMood } = useStore();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(todayMood);
  const [selectedFactors, setSelectedFactors] = useState<string[]>(moodFactors);
  const [submitted, setSubmitted] = useState(!!todayMood);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
  };

  const handleFactorToggle = (factor: string) => {
    setSelectedFactors((prev) =>
      prev.includes(factor)
        ? prev.filter((f) => f !== factor)
        : [...prev, factor]
    );
  };

  const handleSubmit = () => {
    if (selectedMood) {
      setMood(selectedMood, selectedFactors);
      setSubmitted(true);
    }
  };

  const reset = () => {
    setSelectedMood(null);
    setSelectedFactors([]);
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

  return (
    <div className="bg-white rounded-xl border border-[#e8e4df] p-6 shadow-sm">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="checkin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <MoodFace mood={selectedMood || "okay"} size={64} />
              <h3 className="font-display text-xl font-bold text-[#1a1a1a] mt-3">
                How are you feeling today?
              </h3>
              <p className="text-sm text-[#1a1a1a]/40 mt-1 font-sans">
                {getMoodText(selectedMood)}
              </p>
            </div>

            {/* Mood Selection */}
            <div className="flex items-center justify-center gap-3 mb-6">
              {MOODS.map((mood) => (
                <motion.button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood.value)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative transition-all duration-200 ${
                    selectedMood === mood.value
                      ? "opacity-100"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    boxShadow: selectedMood === mood.value ? `0 0 0 2px ${mood.color}` : "none",
                  }}
                >
                  <MoodFace mood={mood.value} size={44} />
                </motion.button>
              ))}
            </div>

            {/* Factor Selection */}
            <AnimatePresence>
              {selectedMood && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-5"
                >
                  <p className="text-xs font-mono text-[#1a1a1a]/40 text-center mb-3">
                    What affected your mood?
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {FACTORS.map((factor) => (
                      <button
                        key={factor}
                        onClick={() => handleFactorToggle(factor)}
                        className={`text-xs font-mono px-3 py-1.5 rounded-sm transition-all ${
                          selectedFactors.includes(factor)
                            ? "bg-[#c8f54e]/15 text-[#1a1a1a] border border-[#c8f54e]/40"
                            : "bg-[#faf8f5] text-[#1a1a1a]/40 border border-[#e0dcd7] hover:border-[#c8f54e]/30"
                        }`}
                      >
                        {factor}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={!selectedMood}
                className="text-xs font-mono tracking-wider bg-[#c8f54e] text-[#1a1a1a] px-6 py-2.5 rounded-sm hover:bg-[#d4f76a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed uppercase font-semibold"
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
          >
            {/* Today's Mood */}
            <div className="text-center mb-5">
              <div className="flex items-center justify-center gap-3 mb-2">
                <MoodFace mood={selectedMood} size={48} />
                <div className="text-left">
                  <h3 className="font-display text-lg font-bold text-[#1a1a1a]">
                    Today's Mood
                  </h3>
                  <p className="text-xs text-[#1a1a1a]/40 mt-0.5">
                    {selectedMood ? MOOD_LABELS[selectedMood] : "Not recorded"}
                    {selectedFactors.length > 0 && (
                      <span className="text-[#1a1a1a]/30"> · {selectedFactors.join(", ")}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* This Week */}
            <div>
              <p className="text-[10px] font-mono text-[#1a1a1a]/25 tracking-wider text-center mb-3 uppercase">
                This Week
              </p>
              <div className="flex items-center justify-center gap-2">
                {weekMoods.map((mood, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.06, duration: 0.2 }}
                    >
                      <MoodFace mood={mood} size={24} />
                    </motion.div>
                    <span className="text-[9px] font-mono text-[#1a1a1a]/20">
                      {DAY_SHORT[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset */}
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
