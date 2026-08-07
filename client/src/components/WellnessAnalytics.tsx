/**
 * WellnessAnalytics — Mood trend, water intake, journal consistency, habit completion
 * Editorial Theme: Light white card
 */
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, BookOpen, Target } from "lucide-react";
import { useStore, getWeeklyPulse, getTodayIndex } from "@/lib/store";

const MOOD_VALUES: Record<string, number> = {
  great: 5,
  good: 4,
  okay: 3,
  low: 2,
  sad: 1,
};

export function WellnessAnalytics() {
  const { habits, hydration, journalEntries, moodHistory } = useStore();

  const getMoodTrend = () => {
    const today = new Date();
    const trend: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const entry = moodHistory.find((e) => e.date === dateStr);
      trend.push(entry ? MOOD_VALUES[entry.mood] : 0);
    }
    return trend;
  };

  const moodTrend = getMoodTrend();
  const avgMood = (moodTrend.reduce((a, b) => a + b, 0) / moodTrend.length).toFixed(1);

  const maxWater = Math.max(...hydration.week, 1);

  const journalDays = new Set(journalEntries.map((e) => e.date));
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
  const journalCount = last7Days.filter((d) => journalDays.has(d)).length;
  const journalConsistency = Math.round((journalCount / 7) * 100);

  const pulse = getWeeklyPulse(habits);
  const completedDays = pulse.filter((v) => v > 50).length;
  const habitsOnTrack = habits.length > 0
    ? `You completed habits on ${completedDays} of 7 days.`
    : "";

  const bestMoodIdx = moodTrend.indexOf(Math.max(...moodTrend));
  let happiestInsight = "";
  if (moodTrend[bestMoodIdx] >= 4) {
    const d = new Date();
    d.setDate(d.getDate() - (6 - bestMoodIdx));
    const bestMoodDayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
    happiestInsight = `You were happiest on ${bestMoodDayName}.`;
  }

  const todayIdx = getTodayIndex();

  return (
    <div className="bg-white rounded-xl border border-[#e8e4df] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#c8f54e]" />
          <h3 className="font-display text-lg font-bold text-[#1a1a1a]">
            Wellness Analytics
          </h3>
        </div>
      </div>

      <div className="space-y-5">
        {/* Mood Trend */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-3 h-3 text-[#c8f54e]" />
            <span className="text-[10px] font-mono text-[#1a1a1a]/35 tracking-wider uppercase">
              Mood Trend
            </span>
            <span className="text-[10px] font-mono text-[#c8f54e] ml-auto font-semibold">
              Avg: {avgMood}
            </span>
          </div>
          <div className="flex items-end gap-1 h-10">
            {moodTrend.map((val, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${(val / 5) * 100}%` }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`flex-1 rounded-sm max-w-[18px] ${
                  i === 6 ? "bg-[#c8f54e]" : "bg-[#c8f54e]/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Water Intake */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono text-[#1a1a1a]/35 tracking-wider uppercase">
              Water Intake
            </span>
            <span className="text-[10px] font-mono text-[#38bdf8] ml-auto">
              {hydration.today}ml today
            </span>
          </div>
          <div className="flex items-end gap-1 h-10">
            {hydration.week.map((val, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${i > todayIdx ? 0 : (val / maxWater) * 100}%` }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`flex-1 rounded-sm max-w-[18px] ${
                  i === todayIdx ? "bg-[#38bdf8]" : "bg-[#38bdf8]/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Journal Consistency */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-3 h-3 text-[#c8f54e]" />
            <span className="text-[10px] font-mono text-[#1a1a1a]/35 tracking-wider uppercase">
              Journal Consistency
            </span>
            <span className="text-[10px] font-mono text-[#c8f54e] ml-auto font-semibold">
              {journalConsistency}%
            </span>
          </div>
          <div className="h-1.5 bg-[#f0ece7] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${journalConsistency}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-[#c8f54e] rounded-full"
            />
          </div>
        </div>

        {/* Insights */}
        <div className="bg-[#faf8f5] rounded-sm p-3 border border-[#e8e4df]">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-3 h-3 text-[#c8f54e]" />
            <span className="text-[10px] font-mono text-[#1a1a1a]/35 tracking-wider uppercase">
              Insights
            </span>
          </div>
          <div className="space-y-1.5">
            {habitsOnTrack && (
              <p className="text-xs text-[#1a1a1a]/55 font-sans">
                {habitsOnTrack}
              </p>
            )}
            {happiestInsight && (
              <p className="text-xs text-[#1a1a1a]/55 font-sans">
                {happiestInsight}
              </p>
            )}
            {!habitsOnTrack && !happiestInsight && (
              <p className="text-xs text-[#1a1a1a]/30 font-sans italic">
                Keep tracking to see personalized insights.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
