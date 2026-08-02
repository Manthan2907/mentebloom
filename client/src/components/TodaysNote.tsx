/**
 * TodaysNote — Daily note card
 * Editorial Theme: The ONLY dark card - black background with white/green text
 * This is the visual accent piece in the otherwise light theme
 */
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const NOTES = [
  {
    text: (
      <>
        Good morning. <strong className="text-white">Wake by 6 AM</strong> has been your steadiest habit at <span className="text-[#c8f54e] font-mono">38%</span> this month — start there, and the rest tends to follow.
      </>
    ),
  },
  {
    text: (
      <>
        Your consistency is building. <strong className="text-white">5 habits</strong> checked this week — you're on track for a new personal best.
      </>
    ),
  },
  {
    text: (
      <>
        Remember: <span className="italic text-[#c8f54e]">small, repeated things</span> compound. You don't need to be perfect — you just need to keep showing up.
      </>
    ),
  },
];

export function TodaysNote() {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[#c8f54e] text-base font-mono">m</span>
          <span className="text-sm font-display font-bold text-white">
            Today's Note
          </span>
        </div>
        <span className="text-[10px] font-mono tracking-widest text-[#c8f54e] uppercase">
          ● TODAY
        </span>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-white/75 leading-relaxed font-sans"
      >
        {NOTES[new Date().getDay() % NOTES.length].text}
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/10">
        <button className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white/60 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1 ml-2">
          {NOTES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === 0 ? "w-5 bg-[#c8f54e]" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
        <button className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white/60 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
