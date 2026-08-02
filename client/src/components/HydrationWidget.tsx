/**
 * HydrationWidget — Water tracking with progress and mini chart
 * Editorial Theme: Light white card, blue accents
 */
import { motion } from "framer-motion";
import { Droplets, RotateCcw, Plus } from "lucide-react";
import { useStore, DAY_SHORT } from "@/lib/store";

const GOAL = 2000;

export function HydrationWidget() {
  const { hydration, addWater, resetWater } = useStore();
  const percentage = Math.min((hydration.today / GOAL) * 100, 100);
  const todayIdx = 6;

  return (
    <div className="bg-white rounded-xl border border-[#e8e4df] p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-[#38bdf8]" />
          <h3 className="font-display text-lg font-bold text-[#1a1a1a]">
            Today's Water
          </h3>
        </div>
        <span className="text-sm font-mono text-[#38bdf8]">
          {hydration.today}ml
        </span>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono text-[#1a1a1a]/30 uppercase tracking-wider">
            Progress
          </span>
          <span className="text-[10px] font-mono text-[#1a1a1a]/30">
            {Math.round(percentage)}%
          </span>
        </div>
        <div className="h-2 bg-[#f0ece7] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-[#38bdf8] rounded-full"
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[9px] font-mono text-[#1a1a1a]/20">0ml</span>
          <span className="text-[9px] font-mono text-[#1a1a1a]/20">{GOAL}ml goal</span>
        </div>
      </div>

      {/* Quick Buttons */}
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => addWater(250)}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-mono bg-[#38bdf8]/8 text-[#38bdf8] border border-[#38bdf8]/20 py-2 rounded-sm hover:bg-[#38bdf8]/15 transition-colors"
        >
          <Plus className="w-3 h-3" />
          250ml
        </button>
        <button
          onClick={() => addWater(500)}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-mono bg-[#38bdf8]/8 text-[#38bdf8] border border-[#38bdf8]/20 py-2 rounded-sm hover:bg-[#38bdf8]/15 transition-colors"
        >
          <Plus className="w-3 h-3" />
          500ml
        </button>
        <button
          onClick={resetWater}
          className="flex items-center justify-center text-xs font-mono bg-[#faf8f5] text-[#1a1a1a]/40 border border-[#e0dcd7] py-2 px-3 rounded-sm hover:bg-[#f0ece7] transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Mini Weekly Chart */}
      <div>
        <p className="text-[9px] font-mono text-[#1a1a1a]/20 tracking-wider mb-2 uppercase">
          This Week
        </p>
        <div className="flex items-end gap-1.5 h-14">
          {hydration.week.map((val, i) => {
            const maxVal = Math.max(...hydration.week, 1);
            const height = (val / maxVal) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className={`w-full max-w-[20px] rounded-sm ${
                    i === todayIdx
                      ? "bg-[#38bdf8]"
                      : "bg-[#38bdf8]/15"
                  }`}
                />
                <span className={`text-[8px] font-mono ${
                  i === todayIdx ? "text-[#38bdf8]" : "text-[#1a1a1a]/20"
                }`}>
                  {DAY_SHORT[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
