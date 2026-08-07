/**
 * WeeklyPulse — Bar chart showing habit completion % per day
 * Editorial Theme: Light white card
 */
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useStore, getWeeklyPulse, getTodayIndex, getLastWeekPulse } from "@/lib/store";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function WeeklyPulse() {
  const { habits } = useStore();
  const pulse = getWeeklyPulse(habits);
  const lastWeekPulse = getLastWeekPulse(habits);
  const todayIdx = getTodayIndex();
  const maxPulse = Math.max(...pulse, 1);
  
  const pulseUpToToday = pulse.slice(0, todayIdx + 1);
  const avgPulse = pulseUpToToday.length > 0 
    ? Math.round(pulseUpToToday.reduce((a, b) => a + b, 0) / pulseUpToToday.length)
    : 0;
    
  const lastWeekPulseUpToToday = lastWeekPulse.slice(0, todayIdx + 1);
  const lastWeekAvg = lastWeekPulseUpToToday.length > 0
    ? Math.round(lastWeekPulseUpToToday.reduce((a, b) => a + b, 0) / lastWeekPulseUpToToday.length)
    : 0;
    
  const change = avgPulse - lastWeekAvg;

  return (
    <div className="bg-white rounded-xl border border-[#e8e4df] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-xl font-bold text-[#1a1a1a]">
          Weekly Pulse
        </h3>
        <div className="flex items-center gap-1">
          {change < 0 ? (
            <TrendingDown className="w-3.5 h-3.5 text-red-500" />
          ) : (
            <TrendingUp className="w-3.5 h-3.5 text-[#c8f54e]" />
          )}
          <span className={`text-xs font-mono font-semibold ${change < 0 ? "text-red-500" : "text-[#c8f54e]"}`}>
            {change > 0 ? "+" : ""}{change}%
          </span>
        </div>
      </div>
      <p className="text-[10px] font-mono text-[#1a1a1a]/30 tracking-wider mb-5 uppercase">
        % of habits done each day · last 7
      </p>

      {/* Bar Chart */}
      <div className="flex items-end justify-between gap-2 h-20 mb-3">
        {pulse.map((value, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full h-16 flex items-end justify-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(value / maxPulse) * 100}%` }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: "easeOut",
                }}
                className={`w-full max-w-[28px] rounded-sm transition-colors ${
                  i === todayIdx
                    ? "bg-[#c8f54e]"
                    : i < todayIdx
                    ? "bg-[#1a1a1a]/80"
                    : "bg-[#1a1a1a]/5"
                }`}
              />
            </div>
            <span className={`text-[10px] font-mono ${
              i === todayIdx ? "text-[#c8f54e] font-semibold" : "text-[#1a1a1a]/25"
            }`}>
              {DAY_LABELS[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
