/**
 * WellnessScore — Wellness indicator
 * Editorial Theme: Light white card
 */
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useStore, getTodayIndex, calculateWellnessScore } from "@/lib/store";

export function WellnessScore() {
  const state = useStore();

  const score = useMemo(() => {
    return calculateWellnessScore(state);
  }, [state]);

  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  const todayIdx = getTodayIndex();
  const completedToday = state.habits.filter((h) => h.weekCompletions[todayIdx]).length;
  const habitPct = state.habits.length > 0 ? Math.round((completedToday / state.habits.length) * 100) : 0;
  
  const todayDateStr = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-xl border border-[#e8e4df] p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-3.5 h-3.5 text-[#c8f54e]" />
        <h3 className="font-display text-lg font-bold text-[#1a1a1a]">
          Wellness
        </h3>
      </div>

      <div className="flex items-center gap-5">
        {/* Circular Progress */}
        <div className="relative w-20 h-20 shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#f0ece7" strokeWidth="3" />
            <motion.circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#c8f54e"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-display font-bold text-[#1a1a1a]">{score}</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-1.5 flex-1">
          <BreakdownRow label="Mood" pct={state.todayMood === "great" ? 100 : state.todayMood === "good" ? 80 : state.todayMood === "okay" ? 48 : state.todayMood === "low" ? 24 : state.todayMood === "sad" ? 12 : 0} color="#8b5cf6" />
          <BreakdownRow label="Habits" pct={habitPct} color="#c8f54e" />
          <BreakdownRow label="Water" pct={Math.min(Math.round((state.hydration.today / 2000) * 100), 100)} color="#38bdf8" />
          <BreakdownRow label="Journal" pct={state.journalEntries.some((e) => e.date === todayDateStr) ? 100 : 0} color="#eab308" />
        </div>
      </div>
    </div>
  );
}

function BreakdownRow({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono text-[#1a1a1a]/20 w-12">{label}</span>
      <div className="flex-1 h-1 bg-[#f0ece7] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color, opacity: 0.7 }}
        />
      </div>
    </div>
  );
}
