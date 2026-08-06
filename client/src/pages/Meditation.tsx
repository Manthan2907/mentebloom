import { useState, useEffect } from "react";
import { TopNav } from "@/components/TopNav";
import { AppFooter } from "@/components/AppFooter";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, ArrowLeft, Sparkles, Heart } from "lucide-react";

type BreathPhase = "In" | "Hold" | "Out" | "Rest";

export default function Meditation() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionDuration, setSessionDuration] = useState<number>(300); // 5 mins
  const [timeRemaining, setTimeRemaining] = useState<number>(300);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>("In");
  const [phaseSeconds, setPhaseSeconds] = useState<number>(4);

  // Main Breathing Cycle Engine (4s In, 4s Hold, 4s Out, 4s Rest)
  useEffect(() => {
    let timer: any = null;

    if (isPlaying && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });

        setPhaseSeconds((prevSec) => {
          if (prevSec <= 1) {
            setBreathPhase((prevPhase) => {
              if (prevPhase === "In") return "Hold";
              if (prevPhase === "Hold") return "Out";
              if (prevPhase === "Out") return "Rest";
              return "In";
            });
            return 4;
          }
          return prevSec - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, timeRemaining]);

  const handleStartMeditation = () => {
    setHasStarted(true);
    setIsPlaying(true);
    setTimeRemaining(sessionDuration);
    setBreathPhase("In");
    setPhaseSeconds(4);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeRemaining(sessionDuration);
    setBreathPhase("In");
    setPhaseSeconds(4);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Phase color & text styling
  const phaseStyles: Record<
    BreathPhase,
    { text: string; subText: string; color: string; scale: number }
  > = {
    In: {
      text: "Breathe In...",
      subText: "Deep slow breath into your belly",
      color: "#84cc16", // Lime Green
      scale: 1.4,
    },
    Hold: {
      text: "Hold...",
      subText: "Pause and feel the stillness inside",
      color: "#eab308", // Warm Gold
      scale: 1.4,
    },
    Out: {
      text: "Breathe Out...",
      subText: "Release all stress and tension",
      color: "#f97316", // Warm Terracotta
      scale: 0.85,
    },
    Rest: {
      text: "Rest...",
      subText: "Allow your body to relax completely",
      color: "#38bdf8", // Sky Blue
      scale: 0.85,
    },
  };

  const currentPhaseStyle = phaseStyles[breathPhase];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a] flex flex-col justify-between">
      <TopNav />

      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <AnimatePresence mode="wait">
          {!hasStarted ? (
            /* ============================================================ */
            /* STAGE 1: WARM WELCOME CARD (Inspired by Reference Images)      */
            /* ============================================================ */
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-sm rounded-[36px] bg-[#1d3d2a] text-white p-8 text-center flex flex-col items-center justify-between min-h-[580px] shadow-2xl relative overflow-hidden"
            >
              {/* Organic Wavy Background Lines */}
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 300 600" fill="none">
                  <path d="M-50 100 Q150 200 350 50" stroke="#f5f3ef" strokeWidth="2" />
                  <path d="M-50 150 Q150 250 350 100" stroke="#f5f3ef" strokeWidth="1.5" />
                  <path d="M-50 500 Q150 400 350 450" stroke="#f5f3ef" strokeWidth="2" />
                  <path d="M-50 550 Q150 450 350 500" stroke="#f5f3ef" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Top Pill Badge */}
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-white/10 text-[#c8f54e] px-3 py-1 rounded-full border border-white/10">
                MINDFULNESS & CARE
              </span>

              {/* Welcoming Illustration (Generated 3D Therapy Hands Image) */}
              <div className="my-6 relative flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-48 h-48 rounded-full flex items-center justify-center p-2 relative"
                >
                  <img
                    src="/therapy_hands.png"
                    alt="Therapy & Care"
                    className="w-full h-full object-contain rounded-full drop-shadow-xl"
                  />
                </motion.div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2 z-10">
                <h1 className="font-display text-2xl font-extrabold text-white tracking-tight">
                  Therapy & Care
                </h1>
                <p className="text-xs font-sans text-white/75 leading-relaxed max-w-[260px] mx-auto">
                  We help you understand your feelings, build small daily habits, and find your quiet calm.
                </p>
              </div>

              {/* Big Prominent Get Started CTA */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStartMeditation}
                className="w-full bg-white text-[#1d3d2a] font-mono text-sm font-extrabold py-4 rounded-full shadow-lg hover:bg-[#c8f54e] transition-colors cursor-pointer mt-6 uppercase tracking-wider"
              >
                Get Started
              </motion.button>
            </motion.div>
          ) : (
            /* ============================================================ */
            /* STAGE 2: IMMERSIVE MINIMAL MEDITATION SPACE                  */
            /* ============================================================ */
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-sm rounded-[36px] bg-white border border-[#e8e4df] p-8 text-center flex flex-col items-center justify-between min-h-[620px] shadow-xl relative overflow-hidden"
            >
              {/* Top Navigation & Duration Controls */}
              <div className="w-full flex items-center justify-between z-10">
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setHasStarted(false);
                  }}
                  className="flex items-center gap-1 text-xs font-mono text-[#1a1a1a]/50 hover:text-[#1a1a1a] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Welcome
                </button>

                <div className="flex gap-1 bg-[#faf8f5] p-1 rounded-full border border-[#e8e4df]">
                  {[3, 5, 10].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        const secs = mins * 60;
                        setSessionDuration(secs);
                        setTimeRemaining(secs);
                      }}
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                        sessionDuration === mins * 60
                          ? "bg-[#1a1a1a] text-white font-bold"
                          : "text-[#1a1a1a]/50 hover:text-[#1a1a1a]"
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Center Meditating Figure & Concentric Aura Rings */}
              <div className="my-6 relative flex items-center justify-center w-full max-w-[280px] aspect-square">
                {/* Outer Concentric Aura Ring 3 */}
                <motion.div
                  animate={{
                    scale: isPlaying ? currentPhaseStyle.scale * 1.25 : 1,
                    opacity: isPlaying ? 0.2 : 0.08,
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: currentPhaseStyle.color }}
                />

                {/* Outer Concentric Aura Ring 2 */}
                <motion.div
                  animate={{
                    scale: isPlaying ? currentPhaseStyle.scale * 1.12 : 1,
                    opacity: isPlaying ? 0.4 : 0.15,
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="absolute inset-4 rounded-full"
                  style={{ backgroundColor: currentPhaseStyle.color }}
                />

                {/* Center 3D Floating Meditating Figure */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-44 h-44 relative z-10 flex items-center justify-center"
                >
                  <img
                    src="/meditating_character.png"
                    alt="Meditating Lotus Figure"
                    className="w-full h-full object-contain drop-shadow-md"
                  />
                </motion.div>
              </div>

              {/* Breath Phase Indicator & Countdown */}
              <div className="space-y-1 z-10">
                <motion.h2
                  key={breathPhase}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-2xl font-black text-[#1a1a1a]"
                >
                  {currentPhaseStyle.text}
                </motion.h2>
                <p className="text-xs font-sans text-[#1a1a1a]/60">
                  {currentPhaseStyle.subText}
                </p>

                <div className="pt-2 font-mono">
                  <span className="text-3xl font-extrabold text-[#1a1a1a]">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>

              {/* Play / Pause / Reset Controls */}
              <div className="w-full flex items-center justify-center gap-4 pt-4 border-t border-[#e8e4df]/60 z-10">
                <button
                  onClick={handleReset}
                  className="p-3.5 bg-[#faf8f5] hover:bg-[#e8e4df] text-[#1a1a1a]/60 rounded-full transition-colors cursor-pointer border border-[#e8e4df]"
                  title="Reset"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-4 rounded-full shadow-md transition-all active:scale-95 cursor-pointer ${
                    isPlaying
                      ? "bg-[#1a1a1a] text-white"
                      : "bg-[#c8f54e] text-[#1a1a1a] hover:bg-[#b5e43b]"
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 fill-current ml-0.5" />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AppFooter />
    </div>
  );
}
