/**
 * StreakFooter — Current streak display
 * Editorial Theme: Light white card
 */
import { useStore } from "@/lib/store";

export function StreakFooter() {
  const { currentStreak } = useStore();

  return (
    <div className="bg-white rounded-xl border border-[#e8e4df] p-6 shadow-sm">
      <span className="text-[10px] font-mono tracking-widest text-[#1a1a1a]/30 uppercase block mb-2">
        Current Streak
      </span>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-display font-bold text-[#1a1a1a]">
          {currentStreak}
        </span>
        <span className="text-sm font-mono text-[#1a1a1a]/30">
          · DAYS
        </span>
      </div>
      <p className="text-[10px] font-mono text-[#1a1a1a]/20 mt-2 italic">
        A quiet consistency.
      </p>
    </div>
  );
}
