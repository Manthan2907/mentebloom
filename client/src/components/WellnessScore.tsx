/**
 * WellnessScore — Wellness indicator
 * Editorial Theme: Light white card
 */
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useStore, calculateWellnessScore } from "@/lib/store";
import Silk from "@/components/ui/Silk";

export function WellnessScore() {
  const state = useStore();

  const score = useMemo(() => {
    return calculateWellnessScore(state);
  }, [state]);

  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  const todayDateStr = new Date().toISOString().split("T")[0];
  const completedToday = state.habits.filter((h) => h.history && h.history[todayDateStr]).length;
  const habitPct = state.habits.length > 0 ? Math.round((completedToday / state.habits.length) * 100) : 0;
  const moodPct = state.todayMood === "great" ? 100 : state.todayMood === "good" ? 80 : state.todayMood === "okay" ? 48 : state.todayMood === "low" ? 24 : state.todayMood === "sad" ? 12 : 0;
  const waterPct = Math.min(Math.round((state.hydration.today / 2000) * 100), 100);
  const journalPct = state.journalEntries.some((e) => e.date === todayDateStr) ? 100 : 0;

  return (
    <div className="bg-white/90 rounded-xl border border-[#d8d4cf] p-6 shadow-md relative overflow-hidden backdrop-blur-md">
      {/* Dynamic WebGL Silk Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <Silk
          speed={3}
          scale={1.2}
          color="#c8f54e"
          noiseIntensity={0.8}
          rotation={0.2}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-xs">
              <Heart className="w-3.5 h-3.5 text-[#c8f54e]" fill="#c8f54e" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#1a1a1a]">
              Wellness
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#1a1a1a]/60 uppercase bg-black/5 px-2 py-0.5 rounded-sm">
            SCORE
          </span>
        </div>

        <div className="flex items-center gap-5">
          {/* Circular Progress */}
          <div className="relative w-22 h-22 shrink-0 flex items-center justify-center bg-white/60 rounded-full shadow-inner border border-black/5">
            <svg className="w-22 h-22 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" fill="none" stroke="#e8e4df" strokeWidth="4" />
              <motion.circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-display font-black text-[#1a1a1a]">{score}</span>
              <span className="text-[8px] font-mono font-bold text-[#1a1a1a]/50 tracking-wider">/100</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2 flex-1">
            <BreakdownRow label="Mood" pct={moodPct} color="#8b5cf6" />
            <BreakdownRow label="Habits" pct={habitPct} color="#84cc16" />
            <BreakdownRow label="Water" pct={waterPct} color="#0284c7" />
            <BreakdownRow label="Journal" pct={journalPct} color="#d97706" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BreakdownRow({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono font-bold text-[#1a1a1a]/85 w-14 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-[#e8e4df] rounded-full overflow-hidden p-0.5 border border-black/5 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full shadow-xs"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-[11px] font-mono font-bold text-[#1a1a1a]/70 w-8 text-right shrink-0">
        {pct}%
      </span>
    </div>
  );
}
