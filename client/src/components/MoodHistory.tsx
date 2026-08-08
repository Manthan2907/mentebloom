/**
 * MoodHistory — Mini calendar showing daily mood faces
 * Uses custom SVG illustrated faces instead of emojis
 * Editorial Theme: Light white card
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Mood } from "@/lib/store";
import { MoodFaceMini, MOOD_COLORS, MOOD_LABELS } from "./MoodFaces";

export function MoodHistory() {
  const { moodHistory } = useStore();
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const days: { date: string; mood: Mood | null; factors: string[]; dayOfWeek: string }[] = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const entry = moodHistory.find((e) => e.date === dateStr);
    days.push({
      date: dateStr,
      mood: entry?.mood || null,
      factors: entry?.factors || [],
      dayOfWeek: dayNames[d.getDay()],
    });
  }

  return (
    <div className="rounded-2xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#c8f54e]" />
          <h3 className="font-display text-lg font-bold text-[#1a1a1a]">
            Mood History
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#1a1a1a]/30">
          Last 28 days
        </span>
      </div>

      {/* Mini Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center text-[8px] font-mono text-[#1a1a1a]/20 pb-1">
            {d}
          </div>
        ))}

        {/* Days */}
        {days.map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15, delay: i * 0.01 }}
            className="relative"
            onMouseEnter={() => setHoveredDay(day.date)}
            onMouseLeave={() => setHoveredDay(null)}
          >
            <div
              className={`aspect-square flex items-center justify-center rounded-sm cursor-default transition-all ${
                day.mood
                  ? "bg-[#faf8f5] hover:bg-[#f0ece7]"
                  : "bg-[#faf8f5]/50"
              }`}
              style={{
                borderColor: hoveredDay === day.date && day.mood ? MOOD_COLORS[day.mood] : undefined,
                borderWidth: hoveredDay === day.date && day.mood ? "1px" : undefined,
                borderStyle: hoveredDay === day.date && day.mood ? "solid" : undefined,
              }}
            >
              {day.mood && <MoodFaceMini mood={day.mood} />}
            </div>

            {/* Tooltip */}
            {hoveredDay === day.date && day.mood && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 bg-white/90 backdrop-blur-md border border-white/60 rounded-xl px-3 py-2 shadow-lg pointer-events-none"
              >
                <div className="text-center">
                  <span className="text-[10px] font-mono text-[#1a1a1a]/40 block">
                    {day.dayOfWeek} · {day.date}
                  </span>
                  <div className="my-1 flex justify-center">
                    <MoodFaceMini mood={day.mood} />
                  </div>
                  <span className="text-[10px] font-mono block" style={{ color: MOOD_COLORS[day.mood] }}>
                    {MOOD_LABELS[day.mood]}
                  </span>
                  {day.factors.length > 0 && (
                    <span className="text-[9px] font-mono text-[#1a1a1a]/30 block mt-0.5">
                      {day.factors.join(", ")}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-[#f0ece7]">
        {(["sad", "low", "okay", "good", "great"] as Mood[]).map((mood) => (
          <div key={mood} className="flex items-center gap-1">
            <MoodFaceMini mood={mood} />
            <span className="text-[8px] font-mono text-[#1a1a1a]/25">{MOOD_LABELS[mood]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
