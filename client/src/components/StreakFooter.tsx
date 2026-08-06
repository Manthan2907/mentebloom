/**
 * StreakFooter — Current streak display
 * Editorial Theme: Light white card
 */
import { useStore, getWeeklyPulse } from "@/lib/store";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";

export function StreakFooter() {
  const { currentStreak, habits } = useStore();
  const pulse = getWeeklyPulse(habits);

  // Generate random embers for the fire effect
  const embers = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    xOffset: Math.random() * 100 - 50,
    duration: Math.random() * 2 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <motion.div
      className="rounded-xl p-6 relative overflow-hidden shadow-sm border border-orange-200/50"
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      style={{ 
        background: "linear-gradient(270deg, #fde68a, #fbd38d, #f6ad55, #fbd38d, #fde68a)",
        backgroundSize: "200% 200%" 
      }}
    >
      {/* Animated Embers / Sparks */}
      <div className="absolute right-12 bottom-0 pointer-events-none z-0">
        {embers.map((ember) => (
          <motion.div
            key={ember.id}
            className="absolute rounded-full bg-orange-100"
            style={{ width: ember.size, height: ember.size }}
            initial={{ y: 20, x: ember.xOffset, opacity: 0, scale: 0 }}
            animate={{ 
              y: -150, 
              x: ember.xOffset + (Math.random() * 30 - 15), 
              opacity: [0, 0.9, 0], 
              scale: [0, 1, 0.5]
            }}
            transition={{
              duration: ember.duration,
              repeat: Infinity,
              delay: ember.delay,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      <motion.div
        className="absolute -right-3 -bottom-5 z-0 text-orange-400/30"
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [-12, -8, -14, -12],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Flame
          size={140}
          strokeWidth={1}
          fill="currentColor"
        />
      </motion.div>
      
      <div className="relative z-10 flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-orange-900/70 mb-1 tracking-widest uppercase">
            Current Streak
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-display font-bold text-orange-950">
              {currentStreak}
            </span>
            <span className="text-xl font-display font-medium text-orange-900/60 ml-1 tracking-tight">
              · DAYS
            </span>
          </div>
        </div>

        {/* Soundwave Mini Chart */}
        <div className="flex items-end gap-1.5 h-10 pb-1">
          {pulse.map((val, i) => (
             <motion.div
                key={i}
                initial={{ height: 4 }}
                animate={{ height: Math.max((val / 100) * 40, 4) }} // max 40px (h-10) height
                className="w-1 rounded-full bg-orange-600/60"
             />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
