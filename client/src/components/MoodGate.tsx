/**
 * MoodGate — Full-screen mood check-in overlay
 * Semicircular gauge dial with smooth arc segments
 * Uses CSS-positioned clickable buttons over a decorative SVG gauge background
 * 
 * Design: Matches the referenced app — title, large face, gauge with faces, Skip button
 */
import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import type { Mood } from "@/lib/store";
import { MOOD_COLORS } from "./MoodFaces";

interface MoodSegment {
  value: Mood;
  label: string;
  text: string;
  color: string;
  /** Position on the gauge: 0=left (sad), 4=right (great) */
  position: number;
}

const MOOD_SEGMENTS: MoodSegment[] = [
  { value: "sad", label: "Down", text: "I Feel Down.", color: "#e07b39", position: 0 },
  { value: "low", label: "Low", text: "I Feel Low.", color: "#e6a23c", position: 1 },
  { value: "okay", label: "Neutral", text: "I Feel Neutral.", color: "#f0c040", position: 2 },
  { value: "good", label: "Good", text: "I Feel Good.", color: "#7cb342", position: 3 },
  { value: "great", label: "Great", text: "I Feel Great.", color: "#c8f54e", position: 4 },
];

const FACTORS = ["Work", "Study", "Family", "Sleep", "Health"];

const MOOD_QUOTES: Record<Mood, string[]> = {
  sad: [
    "Even the darkest night will end and the sun will rise.",
    "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared, or anxious.",
    "Tough times never last, but tough people do.",
  ],
  low: [
    "Small steps every day. That's how mountains are moved.",
    "You are doing better than you think you are.",
    "It's okay to move slowly. Just don't stop.",
  ],
  okay: [
    "Balance is not something you find, it's something you create.",
    "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
    "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.",
  ],
  good: [
    "Every day may not be good, but there's something good in every day.",
    "Happiness is not something ready made. It comes from your own actions.",
    "The secret of change is to focus all your energy not on fighting the old, but on building the new.",
  ],
  great: [
    "Rise up and attack the day with enthusiasm.",
    "You are capable of more than you know. Choose a goal that seems right for you and strive to be the best, however hard the path.",
    "The energy of enthusiasm is the most powerful force in the universe.",
  ],
};

function getRandomQuote(mood: Mood): string {
  const quotes = MOOD_QUOTES[mood];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function MoodGate({ onComplete }: { onComplete: () => void }) {
  const { setMood } = useStore();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [phase, setPhase] = useState<"dial" | "factors" | "quote" | "done">("dial");
  const [hoveredMood, setHoveredMood] = useState<Mood | null>(null);
  const [quote, setQuote] = useState<string>("");

  const currentMood = hoveredMood || selectedMood || "okay";
  const currentMoodData = MOOD_SEGMENTS.find((s) => s.value === currentMood) || MOOD_SEGMENTS[2];

  const handleMoodClick = useCallback((mood: Mood) => {
    setSelectedMood(mood);
    // Briefly show the selected state, then transition to factors
    setTimeout(() => setPhase("factors"), 500);
  }, []);

  const handleFactorToggle = (factor: string) => {
    setSelectedFactors((prev) =>
      prev.includes(factor)
        ? prev.filter((f) => f !== factor)
        : [...prev, factor]
    );
  };

  const handleDone = () => {
    if (selectedMood) {
      setMood(selectedMood, selectedFactors);
      setQuote(getRandomQuote(selectedMood));
      setPhase("quote");
      setTimeout(() => {
        setPhase("done");
        setTimeout(onComplete, 800);
      }, 3500);
    }
  };

  const handleSkip = () => {
    setSelectedMood("okay");
    setMood("okay", []);
    setPhase("done");
    setTimeout(onComplete, 600);
  };

  const displayMood = currentMoodData || MOOD_SEGMENTS[2]; // default to neutral

  // Helper: convert hex color to rgba string with alpha
  const hexWithAlpha = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Map mood to a warm background tint — visible but soft versions of the mood color
  const backgroundColor = useMemo(() => {
    if (phase === "dial" && hoveredMood) {
      const seg = MOOD_SEGMENTS.find(s => s.value === hoveredMood);
      return seg ? hexWithAlpha(seg.color, 0.15) : "#faf8f5";
    }
    if (phase === "factors" || phase === "quote" || phase === "done") {
      const seg = MOOD_SEGMENTS.find(s => s.value === selectedMood);
      return seg ? hexWithAlpha(seg.color, 0.15) : "#faf8f5";
    }
    return "#faf8f5";
  }, [hoveredMood, selectedMood, phase]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor, transition: 'background-color 0.5s ease' }}
    >
      <AnimatePresence mode="wait">
        {phase === "dial" && (
          <motion.div
            key="dial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-center w-full max-w-lg px-6"
          >
            {/* Skip button */}
            <div className="w-full flex justify-end mb-6">
              <button
                onClick={handleSkip}
                className="text-sm font-sans text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60 transition-colors"
              >
                Skip
              </button>
            </div>

            {/* Title */}
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1a1a1a] text-center mb-3 leading-tight">
              How would you describe
              <br />
              your mood?
            </h2>

            {/* "I Feel..." text */}
            <motion.p
              key={`mood-text-${currentMood}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xl font-sans mt-2 mb-3"
              style={{ color: currentMoodData.color }}
            >
              {currentMoodData.text}
            </motion.p>

            {/* Large mood face */}
            <motion.div
              key={`mood-face-${currentMood}`}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mb-4"
            >
              <LargeFace mood={currentMood} size={140} />
            </motion.div>

            {/* Gauge area — SVG background + clickable buttons */}
            <div className="relative w-[380px] h-[220px] mb-4 overflow-hidden">
              {/* SVG gauge background (decorative) */}
              <svg
                viewBox="0 0 380 210"
                className="absolute inset-0 w-full h-full"
              >
                {/* Semicircle arc segments */}
                {MOOD_SEGMENTS.map((segment, i) => {
                  const startDeg = 180 - ((i + 1) * 36);
                  const endDeg = 180 - (i * 36);
                  const cx = 190;
                  const cy = 200;
                  const outerR = 180;
                  const innerR = 70;

                  const isActive = currentMood === segment.value;

                  const outerStartX = cx + outerR * Math.cos((startDeg * Math.PI) / 180);
                  const outerStartY = cy - outerR * Math.sin((startDeg * Math.PI) / 180);
                  const outerEndX = cx + outerR * Math.cos((endDeg * Math.PI) / 180);
                  const outerEndY = cy - outerR * Math.sin((endDeg * Math.PI) / 180);

                  const innerEndX = cx + innerR * Math.cos((endDeg * Math.PI) / 180);
                  const innerEndY = cy - innerR * Math.sin((endDeg * Math.PI) / 180);
                  const innerStartX = cx + innerR * Math.cos((startDeg * Math.PI) / 180);
                  const innerStartY = cy - innerR * Math.sin((startDeg * Math.PI) / 180);

                  const spanDeg = endDeg - startDeg;
                  const largeArc = spanDeg > 180 ? 1 : 0;

                  const d = [
                    `M ${outerStartX} ${outerStartY}`,
                    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEndX} ${outerEndY}`,
                    `L ${innerEndX} ${innerEndY}`,
                    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStartX} ${innerStartY}`,
                    `Z`,
                  ].join(" ");

                  return (
                    <path
                      key={segment.value}
                      d={d}
                      fill={segment.color}
                      opacity={isActive ? 1 : 0.5}
                      style={{ transition: "opacity 0.25s" }}
                    />
                  );
                })}

                {/* Small face circles drawn as SVG (not foreignObject) */}
                {MOOD_SEGMENTS.map((segment, i) => {
                  const midDeg = 180 - (i * 36) - 18;
                  const faceR = 125;
                  const fx = 190 + faceR * Math.cos((midDeg * Math.PI) / 180);
                  const fy = 200 - faceR * Math.sin((midDeg * Math.PI) / 180);
                  const isActive = currentMood === segment.value;

                  return (
                    <g key={`mini-${segment.value}`}>
                      <circle cx={fx} cy={fy} r={20} fill={segment.color} opacity={isActive ? 1 : 0.7} style={{ transition: "opacity 0.25s" }} />
                      <SmallFaceSvg cx={fx} cy={fy} mood={segment.value} />
                    </g>
                  );
                })}
              </svg>

              {/* Clickable invisible buttons positioned over each segment */}
              {MOOD_SEGMENTS.map((segment) => {
                const midDeg = 180 - (segment.position * 36) - 18;
                const btnR = 125;
                // Position as percentage of container
                const pctX = ((190 + btnR * Math.cos((midDeg * Math.PI) / 180)) / 380) * 100;
                const pctY = ((200 - btnR * Math.sin((midDeg * Math.PI) / 180)) / 210) * 100;

                return (
                  <button
                    key={`btn-${segment.value}`}
                    onClick={() => handleMoodClick(segment.value)}
                    onMouseEnter={() => setHoveredMood(segment.value)}
                    onMouseLeave={() => setHoveredMood(null)}
                    className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full cursor-pointer"
                    style={{
                      left: `${pctX}%`,
                      top: `${pctY}%`,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      zIndex: 10,
                    }}
                    aria-label={`Select ${segment.label} mood`}
                  />
                );
              })}

              {/* Needle indicator */}
              <AnimatePresence>
                {currentMood && (
                  <motion.div
                    key="needle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-14 pointer-events-none"
                    style={{ zIndex: 5 }}
                  >
                    <svg viewBox="0 0 20 56" className="w-full h-full">
                      <polygon points="10,0 0,56 20,56" fill="#1a1a1a" />
                      <circle cx="10" cy="50" r="6" fill="#1a1a1a" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Continue button — only visible when mood is selected */}
            <AnimatePresence>
              {selectedMood && phase === "dial" && (
                <motion.button
                  key="continue-btn"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setPhase("factors")}
                  className="text-sm font-mono tracking-wider bg-[#c8f54e] text-[#1a1a1a] px-10 py-3 rounded-sm hover:bg-[#d4f76a] transition-colors uppercase font-semibold"
                >
                  Continue
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {phase === "factors" && (
          <motion.div
            key="factors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-center w-full max-w-md px-6"
          >
            <div className="mb-8">
              <LargeFace mood={selectedMood || "okay"} size={110} />
            </div>

            <h3 className="font-display text-2xl md:text-3xl font-bold text-[#1a1a1a] text-center mb-8">
              What's affecting you?
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8 max-w-sm">
              {FACTORS.map((factor) => (
                <button
                  key={factor}
                  onClick={() => handleFactorToggle(factor)}
                  className={`text-sm font-sans px-6 py-3 rounded-full border-2 transition-all duration-200 ${
                    selectedFactors.includes(factor)
                      ? "bg-[#c8f54e] text-[#1a1a1a] border-[#c8f54e] font-medium"
                      : "bg-white text-[#1a1a1a]/50 border-[#e8e4df] hover:border-[#c8f54e]/40 hover:text-[#1a1a1a]/70"
                  }`}
                >
                  {factor}
                </button>
              ))}
            </div>

            <p className="text-xs font-mono text-[#1a1a1a]/30 mb-6">
              Select any that apply, or skip
            </p>

            <button
              onClick={handleDone}
              className="text-sm font-mono tracking-wider bg-[#c8f54e] text-[#1a1a1a] px-12 py-3 rounded-sm hover:bg-[#d4f76a] transition-colors uppercase font-semibold"
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
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-center w-full max-w-lg px-8"
          >
            <div className="mb-6">
              <LargeFace mood={selectedMood || "okay"} size={80} />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="absolute -left-8 -top-4 text-6xl font-display text-[#c8f54e]/40 select-none">"</div>
              <p className="font-display text-2xl md:text-3xl text-[#1a1a1a] text-center leading-relaxed max-w-md italic">
                {quote}
              </p>
              <div className="absolute -right-4 -bottom-6 text-6xl font-display text-[#c8f54e]/40 select-none rotate-180">"</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-10 flex items-center gap-2"
            >
              <div className="w-8 h-0.5 bg-[#c8f54e]" />
              <span className="text-xs font-mono tracking-wider text-[#1a1a1a]/40 uppercase">Mentebloom</span>
              <div className="w-8 h-0.5 bg-[#c8f54e]" />
            </motion.div>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <LargeFace mood={selectedMood || "okay"} size={110} />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-display text-[#1a1a1a] mt-4"
            >
              {currentMoodData?.text}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** Large face for the dial display */
function LargeFace({ mood, size }: { mood: Mood; size: number }) {
  const color = MOOD_COLORS[mood];
  const mouthPath = mood === "sad"
    ? "M34 80 C48 66, 72 66, 86 80"
    : mood === "low"
    ? "M38 76 L82 76"
    : mood === "okay"
    ? "M38 76 L82 76"
    : mood === "good"
    ? "M34 70 C48 86, 72 86, 86 70"
    : "M30 66 C48 88, 72 88, 90 66";

  const eyeY = mood === "great" ? 44 : mood === "good" ? 46 : 50;

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="56" fill={color} />
      <circle cx="42" cy={eyeY} r="5" fill="#1a1a1a" opacity="0.8" />
      <circle cx="78" cy={eyeY} r="5" fill="#1a1a1a" opacity="0.8" />
      <path d={mouthPath} stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Small face drawn as SVG primitives (no foreignObject) */
function SmallFaceSvg({ cx, cy, mood }: { cx: number; cy: number; mood: Mood }) {
  const s = 8; // scale for small face features
  const mouthPath = mood === "sad"
    ? `M ${cx - 7} ${cy + 4} C ${cx - 2} ${cy - 1}, ${cx + 2} ${cy - 1}, ${cx + 7} ${cy + 4}`
    : mood === "low"
    ? `M ${cx - 7} ${cy + 2} L ${cx + 7} ${cy + 2}`
    : mood === "okay"
    ? `M ${cx - 7} ${cy + 2} L ${cx + 7} ${cy + 2}`
    : mood === "good"
    ? `M ${cx - 7} ${cy - 1} C ${cx - 2} ${cy + 5}, ${cx + 2} ${cy + 5}, ${cx + 7} ${cy - 1}`
    : `M ${cx - 9} ${cy - 2} C ${cx - 2} ${cy + 7}, ${cx + 2} ${cy + 7}, ${cx + 9} ${cy - 2}`;

  return (
    <>
      <circle cx={cx - 6} cy={cy - 4} r={2} fill="#1a1a1a" opacity="0.8" />
      <circle cx={cx + 6} cy={cy - 4} r={2} fill="#1a1a1a" opacity="0.8" />
      <path d={mouthPath} stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  );
}
