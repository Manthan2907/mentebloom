/**
 * HeroSection — "Daily Practice" hero
 * Editorial: Light cream card, dark text, lime green accents
 */
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";

export function HeroSection() {
  const { currentStreak, weeklyStreak, goalProgress, goalTarget } = useStore();

  return (
    <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-[#e8e4df]">
      <div className="flex items-center gap-6">
        {/* Avatar / Brand Icon */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-[#2a2a2a] flex items-center justify-center border-2 border-[#c8f54e]/40">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="14" r="6" fill="#c8f54e" opacity="0.8" />
              <path d="M8 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#c8f54e" strokeWidth="2" opacity="0.5" />
            </svg>
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#c8f54e] text-[#1a1a1a] text-[8px] font-mono font-bold px-2 py-0.5 rounded-sm tracking-wider whitespace-nowrap">
            ★ STEADY HAND
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono tracking-widest text-white bg-[#1a1a1a] px-2 py-0.5 rounded-sm">
              MONTH 09
            </span>
            <span className="text-xs text-[#1a1a1a]/50 font-sans italic">
              A quiet practice, kept honestly
            </span>
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-tight">
            Daily <span className="italic text-[#1a1a1a]/70">Practice</span>
          </h1>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-xs font-mono tracking-wider text-[#1a1a1a]/40 uppercase">
              Goal Progress · This Month
            </span>
            <div className="flex-1 max-w-[300px]">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-[#e8e4df] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goalProgress}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-[#c8f54e] rounded-full"
                  />
                </div>
                <span className="text-sm font-mono text-[#1a1a1a]/50">
                  {goalProgress} / {goalTarget}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] font-mono tracking-widest text-[#1a1a1a]/30 uppercase mb-1">
            Current Streak
          </span>
          <div className="text-5xl font-display font-bold text-[#1a1a1a]">
            ·{currentStreak}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[#c8f54e]">
            <svg className="w-3 h-3" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M3 6l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-mono font-semibold">
              DAYS · +{weeklyStreak} THIS WEEK
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
