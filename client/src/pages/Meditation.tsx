import { useState, useEffect } from "react";
import { TopNav } from "@/components/TopNav";
import { AppFooter } from "@/components/AppFooter";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Wind,
  ShieldCheck,
  CheckCircle2,
  Smile,
  Coffee,
  Zap,
} from "lucide-react";
import { CardCanvas, Card } from "@/components/ui/animated-glow-card";
import Orb from "@/components/ui/Orb";

type BreathPhase = "In" | "Hold" | "Out" | "Rest";

export interface Technique {
  id: string;
  name: string;
  subtitle: string;
  inSec: number;
  holdSec: number;
  outSec: number;
  restSec: number;
  badge: string;
  color: string;
}

const TECHNIQUES: Technique[] = [
  {
    id: "box",
    name: "Box Breathing",
    subtitle: "Equal 4-4-4-4 rhythm for exam stress & mental clarity",
    inSec: 4,
    holdSec: 4,
    outSec: 4,
    restSec: 4,
    badge: "EXAM STRESS RESET",
    color: "#c8f54e",
  },
  {
    id: "478",
    name: "4-7-8 Relaxing Breath",
    subtitle: "Deep calming technique to soothe nervous tension",
    inSec: 4,
    holdSec: 7,
    outSec: 8,
    restSec: 0,
    badge: "ANXIETY RELIEF",
    color: "#38bdf8",
  },
  {
    id: "coherent",
    name: "Coherent Breathing",
    subtitle: "Steady 5s in / 5s out to align heart rate variability",
    inSec: 5,
    holdSec: 0,
    outSec: 5,
    restSec: 0,
    badge: "EMOTIONAL BALANCE",
    color: "#a855f7",
  },
];

export default function Meditation() {
  const [selectedTech, setSelectedTech] = useState<Technique>(TECHNIQUES[0]);
  const [sessionMinutes, setSessionMinutes] = useState<number>(5);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(300);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>("In");
  const [phaseSeconds, setPhaseSeconds] = useState<number>(4);

  // Reset timer when technique or duration changes
  useEffect(() => {
    setIsPlaying(false);
    setTimeRemaining(sessionMinutes * 60);
    setBreathPhase("In");
    setPhaseSeconds(selectedTech.inSec);
  }, [selectedTech, sessionMinutes]);

  // Main Guided Breathing Timer Engine
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

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
              if (prevPhase === "In") {
                if (selectedTech.holdSec > 0) return "Hold";
                return "Out";
              }
              if (prevPhase === "Hold") {
                return "Out";
              }
              if (prevPhase === "Out") {
                if (selectedTech.restSec > 0) return "Rest";
                return "In";
              }
              return "In";
            });

            if (breathPhase === "In") return selectedTech.holdSec || selectedTech.outSec;
            if (breathPhase === "Hold") return selectedTech.outSec;
            if (breathPhase === "Out") return selectedTech.restSec || selectedTech.inSec;
            return selectedTech.inSec;
          }
          return prevSec - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, timeRemaining, breathPhase, selectedTech]);

  const handleReset = () => {
    setIsPlaying(false);
    setTimeRemaining(sessionMinutes * 60);
    setBreathPhase("In");
    setPhaseSeconds(selectedTech.inSec);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Phase color & text styling config
  const phaseStyles: Record<
    BreathPhase,
    { text: string; subText: string; color: string; scale: number; orbHue: number }
  > = {
    In: {
      text: "Breathe In...",
      subText: "Deep slow breath expanding into your chest and belly",
      color: selectedTech.color,
      scale: 1.4,
      orbHue: 80, // Lime green
    },
    Hold: {
      text: "Hold Breath...",
      subText: "Pause softly and feel the calm stillness inside",
      color: "#eab308",
      scale: 1.4,
      orbHue: 45, // Golden warm
    },
    Out: {
      text: "Breathe Out...",
      subText: "Release all stress, tension, and unwanted thoughts",
      color: "#f97316",
      scale: 0.85,
      orbHue: 15, // Terracotta orange
    },
    Rest: {
      text: "Rest & Relax...",
      subText: "Allow your body and mind to settle completely",
      color: "#38bdf8",
      scale: 0.85,
      orbHue: 200, // Sky blue
    },
  };

  const currentPhase = phaseStyles[breathPhase];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a] flex flex-col justify-between selection:bg-[#c8f54e] selection:text-[#1a1a1a]">
      <TopNav />

      <main className="container max-w-[1280px] mx-auto px-4 lg:px-8 py-8 flex-1">
        {/* Page Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-[#e8e4df]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono tracking-widest uppercase bg-[#c8f54e] text-[#1a1a1a] px-2.5 py-0.5 rounded-sm font-bold flex items-center gap-1">
                <Wind className="w-3.5 h-3.5" />
                MINDFUL SANCTUARY
              </span>
              <span className="text-xs font-mono text-[#1a1a1a]/40 uppercase">
                CALM GUIDED BREATHWORK
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#1a1a1a] tracking-tight">
              Mindfulness & Breathing Space
            </h1>
            <p className="text-sm text-[#1a1a1a]/60 mt-1 max-w-2xl font-sans">
              Slow down, reset your nervous system, and restore inner clarity with animated guided breathwork. No distractions, just quiet calm.
            </p>
          </div>

          {/* Quick Affirmation Pill */}
          <div className="flex items-center gap-3 bg-[#1a1a1a] text-white p-3 px-4 rounded-2xl shadow-xs shrink-0">
            <Sparkles className="w-4 h-4 text-[#c8f54e] shrink-0" />
            <div className="text-xs font-mono">
              <span className="text-[#c8f54e] font-bold block">DAILY MINDFULNESS REMINDER</span>
              <span className="text-white/70">"You don't have to figure it all out right now."</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Interactive Breathing Canvas with Dark Background & Glowing React Bits Orb, Right Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* ============================================================ */}
          {/* LEFT: DARK BREATHING CARD WITH GLOWING REACT BITS ORB        */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <CardCanvas className="w-full">
              <Card className="shadow-2xl">
                {/* Sleek Dark Card Background (#121212) */}
                <div className="relative w-full rounded-3xl bg-[#121212] text-white p-6 sm:p-10 flex flex-col items-center justify-between min-h-[580px] border border-white/10 overflow-hidden text-center shadow-2xl">
                  
                  {/* React Bits Full-Background <Orb /> Shader Ring */}
                  <div className="absolute inset-0 pointer-events-none z-0">
                    <Orb
                      hue={currentPhase.orbHue}
                      hoverIntensity={0.5}
                      rotateOnHover={true}
                      forceHoverState={false}
                      backgroundColor="#121212"
                      className="w-full h-full"
                    />
                  </div>

                  {/* Top Status Pill Badges */}
                  <div className="w-full flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#c8f54e] animate-pulse shadow-[0_0_8px_#c8f54e]" />
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#c8f54e]">
                        {selectedTech.name.toUpperCase()} MODE
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/70 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 font-bold uppercase">
                      GUIDED BREATHWORK
                    </div>
                  </div>

                  {/* Center Content Overlay (Framed inside the glowing Orb Ring) */}
                  <div className="my-auto py-8 space-y-4 z-10 max-w-md mx-auto">
                    <motion.div
                      animate={{
                        scale: isPlaying ? currentPhase.scale : 1,
                      }}
                      transition={{ duration: selectedTech.inSec, ease: "easeInOut" }}
                      className="space-y-2"
                    >
                      <motion.h2
                        key={breathPhase}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md"
                      >
                        {currentPhase.text}
                      </motion.h2>
                      <p className="text-xs sm:text-sm font-sans text-white/75 leading-relaxed max-w-sm mx-auto">
                        {currentPhase.subText}
                      </p>
                    </motion.div>

                    {/* Large Timer Display */}
                    <div className="pt-2 font-mono">
                      <span className="text-5xl sm:text-6xl font-black text-[#c8f54e] tracking-tight drop-shadow-sm">
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Controls */}
                  <div className="w-full flex items-center justify-center gap-4 pt-4 z-10">
                    <button
                      onClick={handleReset}
                      className="p-3.5 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-full transition-all cursor-pointer border border-white/15 backdrop-blur-md active:scale-95"
                      title="Reset Session"
                    >
                      <RotateCcw className="w-4.5 h-4.5" />
                    </button>

                    {/* Clean Simple CTA Button */}
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`px-8 py-3.5 rounded-full font-mono text-xs font-extrabold transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                        isPlaying
                          ? "bg-white text-[#121212] hover:bg-white/90"
                          : "bg-[#c8f54e] text-[#121212] hover:bg-[#b5e43b]"
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-4 h-4 fill-current" />
                          PAUSE SESSION
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                          BEGIN BREATHING
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </Card>
            </CardCanvas>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: TECHNIQUE SELECTOR & DURATION CONFIG (5 cols)         */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Technique Cards */}
            <div className="bg-white rounded-2xl border border-[#e8e4df] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#e8e4df] pb-3">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#1a1a1a]">
                    Breathing Patterns
                  </h3>
                  <p className="text-xs font-mono text-[#1a1a1a]/40 uppercase">
                    CHOOSE YOUR GUIDED MINDFUL RHYTHM
                  </p>
                </div>
                <Wind className="w-5 h-5 text-[#1a1a1a]/40" />
              </div>

              <div className="space-y-3">
                {TECHNIQUES.map((tech) => {
                  const isSelected = selectedTech.id === tech.id;

                  return (
                    <div
                      key={tech.id}
                      onClick={() => setSelectedTech(tech)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? "bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-sm"
                          : "bg-[#faf8f5] text-[#1a1a1a] border-[#e8e4df] hover:border-[#1a1a1a]/30 hover:bg-[#f0ece7]"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-sm ${
                              isSelected
                                ? "bg-[#c8f54e] text-[#1a1a1a]"
                                : "bg-[#1a1a1a]/10 text-[#1a1a1a]/70"
                            }`}
                          >
                            {tech.badge}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-sm">
                          {tech.name}
                        </h4>
                        <p
                          className={`text-xs font-sans ${
                            isSelected ? "text-white/70" : "text-[#1a1a1a]/60"
                          }`}
                        >
                          {tech.subtitle}
                        </p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                          isSelected
                            ? "border-[#c8f54e] bg-[#c8f54e] text-[#1a1a1a]"
                            : "border-[#e8e4df] bg-white text-transparent"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Session Duration Selector */}
            <div className="bg-white rounded-2xl border border-[#e8e4df] p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-display font-bold text-base text-[#1a1a1a]">
                  Session Duration
                </h3>
                <p className="text-xs font-mono text-[#1a1a1a]/40 uppercase">
                  SET YOUR DEDICATED QUIET TIME
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[3, 5, 10, 15].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setSessionMinutes(mins)}
                    className={`py-2.5 rounded-xl font-mono text-xs font-bold border transition-colors cursor-pointer ${
                      sessionMinutes === mins
                        ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                        : "bg-[#faf8f5] text-[#1a1a1a]/70 border-[#e8e4df] hover:bg-[#e8e4df]"
                    }`}
                  >
                    {mins} MIN
                  </button>
                ))}
              </div>
            </div>



          </div>
        </div>

        {/* Bottom Section: 3-Step Sensory Grounding Cards */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-xl text-[#1a1a1a]">
                Quick Mindful Grounding Techniques
              </h2>
              <p className="text-xs font-mono text-[#1a1a1a]/40 uppercase">
                SIMPLE PRACTICES TO RESET ACADEMIC ANXIETY ANYTIME
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-2xl border border-[#e8e4df] p-5 shadow-xs space-y-3 hover:border-[#1a1a1a]/20 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-[#faf8f5] border border-[#e8e4df] px-2 py-0.5 rounded-md">
                  TECHNIQUE 01
                </span>
                <Smile className="w-4 h-4 text-[#c8f54e] fill-[#1a1a1a]" />
              </div>
              <h3 className="font-display font-bold text-base text-[#1a1a1a]">
                Physical Unclench
              </h3>
              <p className="text-xs font-sans text-[#1a1a1a]/70 leading-relaxed">
                Release your jaw, lower your shoulders away from your ears, and rest your hands palms-up on your lap.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#e8e4df] p-5 shadow-xs space-y-3 hover:border-[#1a1a1a]/20 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-[#faf8f5] border border-[#e8e4df] px-2 py-0.5 rounded-md">
                  TECHNIQUE 02
                </span>
                <Zap className="w-4 h-4 text-[#38bdf8]" />
              </div>
              <h3 className="font-display font-bold text-base text-[#1a1a1a]">
                5-4-3-2-1 Sensory Anchor
              </h3>
              <p className="text-xs font-sans text-[#1a1a1a]/70 leading-relaxed">
                Look around to spot 5 objects, feel 4 textures, listen for 3 sounds, smell 2 scents, and take 1 deep breath.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#e8e4df] p-5 shadow-xs space-y-3 hover:border-[#1a1a1a]/20 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-[#faf8f5] border border-[#e8e4df] px-2 py-0.5 rounded-md">
                  TECHNIQUE 03
                </span>
                <Coffee className="w-4 h-4 text-[#a855f7]" />
              </div>
              <h3 className="font-display font-bold text-base text-[#1a1a1a]">
                Mindful Micro-Break
              </h3>
              <p className="text-xs font-sans text-[#1a1a1a]/70 leading-relaxed">
                Step away from all screens for 3 minutes. Sip warm water slowly, noticing the sensation of each swallow.
              </p>
            </div>

          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
