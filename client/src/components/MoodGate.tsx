/**
 * MoodGate — Full-screen daily mood check-in
 * Glassmorphic redesign: a living aurora-gradient backdrop that slowly drifts
 * and re-tints toward the selected mood's color, with a frosted glass panel
 * floating on top. The mood picker is a sliding glass-pill selector (no dial),
 * driven by framer-motion layout animations for a fluid, premium feel.
 */
import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import type { Mood } from "@/lib/store";
import { GlassOrb, MOOD_GRADIENTS } from "./MoodFaces";

interface MoodOption {
  value: Mood;
  label: string;
  text: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  { value: "sad", label: "Down", text: "I feel down." },
  { value: "low", label: "Low", text: "I feel low." },
  { value: "okay", label: "Neutral", text: "I feel neutral." },
  { value: "good", label: "Good", text: "I feel good." },
  { value: "great", label: "Great", text: "I feel great." },
];

const FACTORS = ["Work", "Study", "Family", "Sleep", "Health"];

const MOOD_QUOTES: Record<Mood, string[]> = {
  sad: [
    "Even the darkest night will end and the sun will rise.",
    "It's perfectly okay to feel sad, angry, or scared. This too will pass.",
    "Tough times never last, but tough people do.",
  ],
  low: [
    "Small steps every day. That's how mountains are moved.",
    "You are doing better than you think you are.",
    "It's okay to move slowly. Just don't stop.",
  ],
  okay: [
    "Balance is not something you find, it's something you create.",
    "The present moment is filled with joy, if you are attentive.",
    "Breathe. Let go. This very moment is the only one you know for sure.",
  ],
  good: [
    "Every day may not be good, but there's something good in every day.",
    "Happiness comes from your own actions, not ready made.",
    "Focus all your energy on building the new.",
  ],
  great: [
    "Rise up and attack the day with enthusiasm.",
    "You are capable of more than you know.",
    "Enthusiasm is the most powerful force in the universe.",
  ],
};

function getRandomQuote(mood: Mood): string {
  const quotes = MOOD_QUOTES[mood];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function hexWithAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function MoodGate({ onComplete }: { onComplete: () => void }) {
  const { setMood } = useStore();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [phase, setPhase] = useState<"pick" | "factors" | "quote">("pick");
  const [quote, setQuote] = useState("");

  const activeMood = selectedMood ?? "okay";
  const [gradFrom, gradTo] = MOOD_GRADIENTS[activeMood];

  const handleSelect = useCallback((mood: Mood) => setSelectedMood(mood), []);

  const handleFactorToggle = (factor: string) => {
    setSelectedFactors((prev) =>
      prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor]
    );
  };

  const handleDone = () => {
    if (!selectedMood) return;
    setMood(selectedMood, selectedFactors);
    setQuote(getRandomQuote(selectedMood));
    setPhase("quote");
    setTimeout(onComplete, 3200);
  };

  const handleSkip = () => {
    setMood("okay", []);
    onComplete();
  };

  const auroraStyle = useMemo(
    () => ({
      background: `
        radial-gradient(50% 55% at 18% 12%, ${hexWithAlpha(gradFrom, 0.55)} 0%, transparent 65%),
        radial-gradient(45% 50% at 85% 20%, ${hexWithAlpha(gradTo, 0.4)} 0%, transparent 70%),
        radial-gradient(60% 60% at 50% 100%, ${hexWithAlpha(gradFrom, 0.3)} 0%, transparent 70%),
        #0e0f0c
      `,
    }),
    [gradFrom, gradTo]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Living aurora backdrop */}
      <motion.div
        className="absolute inset-0 animate-aurora-drift"
        style={auroraStyle}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-black/10" />

      {/* Skip */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={handleSkip}
          className="text-sm font-sans text-white/50 hover:text-white/90 transition-colors"
        >
          Skip
        </button>
      </div>

      <div className="relative z-10 flex min-h-full items-center justify-center px-6 py-10">
        <AnimatePresence mode="wait">
          {phase === "pick" && (
            <motion.div
              key="pick"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg rounded-[28px] border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl sm:p-10"
            >
              <h2 className="font-display text-2xl font-bold text-white text-center sm:text-3xl">
                How would you describe
                <br />
                your mood today?
              </h2>

              <div className="mt-6 flex flex-col items-center">
                <motion.div
                  key={`orb-${activeMood}`}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  <GlassOrb mood={selectedMood} size={112} active />
                </motion.div>
                <motion.p
                  key={`text-${activeMood}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-base font-sans text-white/80"
                >
                  {selectedMood ? MOOD_OPTIONS.find((m) => m.value === selectedMood)?.text : "Select a mood below."}
                </motion.p>
              </div>

              {/* Sliding glass-pill selector */}
              <div className="relative mt-8 flex items-center justify-between gap-1.5 rounded-full border border-white/15 bg-black/20 p-1.5">
                {MOOD_OPTIONS.map((opt) => {
                  const isActive = selectedMood === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className="relative flex-1"
                      aria-pressed={isActive}
                      aria-label={`Select ${opt.label} mood`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="mood-pill"
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `linear-gradient(135deg, ${MOOD_GRADIENTS[opt.value][0]}, ${MOOD_GRADIENTS[opt.value][1]})`,
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                      <span
                        className={`relative z-10 flex items-center justify-center gap-1.5 rounded-full px-2 py-2.5 text-xs font-mono uppercase tracking-wide transition-colors ${
                          isActive ? "text-[#1a1a1a] font-semibold" : "text-white/60 hover:text-white/90"
                        }`}
                      >
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {selectedMood && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 flex justify-center overflow-hidden"
                  >
                    <button
                      onClick={() => setPhase("factors")}
                      className="rounded-full bg-white px-10 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-[#1a1a1a] transition-transform hover:scale-[1.03] active:scale-[0.98]"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {phase === "factors" && (
            <motion.div
              key="factors"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md rounded-[28px] border border-white/15 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-2xl sm:p-10"
            >
              <div className="flex justify-center">
                <GlassOrb mood={selectedMood} size={88} />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-white sm:text-2xl">
                What&apos;s affecting you?
              </h3>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                {FACTORS.map((factor) => {
                  const active = selectedFactors.includes(factor);
                  return (
                    <button
                      key={factor}
                      onClick={() => handleFactorToggle(factor)}
                      className={`rounded-full border px-5 py-2.5 text-sm font-sans transition-all ${
                        active
                          ? "border-white bg-white text-[#1a1a1a] font-medium"
                          : "border-white/25 bg-white/5 text-white/70 hover:border-white/50 hover:text-white"
                      }`}
                    >
                      {factor}
                    </button>
                  );
                })}
              </div>
              <p className="mt-5 text-xs font-mono text-white/40">Select any that apply, or skip</p>
              <button
                onClick={handleDone}
                className="mt-6 rounded-full bg-white px-12 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-[#1a1a1a] transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                Done
              </button>
            </motion.div>
          )}

          {phase === "quote" && (
            <motion.div
              key="quote"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-full max-w-lg flex-col items-center rounded-[28px] border border-white/15 bg-white/10 px-10 py-12 text-center shadow-2xl backdrop-blur-2xl"
            >
              <GlassOrb mood={selectedMood} size={72} />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-8 font-display text-2xl italic leading-relaxed text-white sm:text-3xl"
              >
                &ldquo;{quote}&rdquo;
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-10 flex items-center gap-2"
              >
                <div className="h-px w-8 bg-white/40" />
                <span className="text-xs font-mono uppercase tracking-wider text-white/50">Mentebloom</span>
                <div className="h-px w-8 bg-white/40" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
