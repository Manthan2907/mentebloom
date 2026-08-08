import React from "react";
import { motion } from "framer-motion";
import type { Mood } from "@/lib/store";
import { LargeFace } from "../MoodGate";

interface MoodItem {
  value: Mood;
  label: string;
  color: string;
}

interface OverlappingMoodStackProps {
  segments: MoodItem[];
  currentMood: Mood;
  onSelectMood: (mood: Mood) => void;
  onHoverMood: (mood: Mood | null) => void;
}

export const OverlappingMoodStack: React.FC<OverlappingMoodStackProps> = ({
  segments,
  currentMood,
  onSelectMood,
  onHoverMood,
}) => {
  return (
    <div className="flex items-center justify-center -space-x-3 md:-space-x-4 my-6 py-4 px-2 relative z-20">
      {segments.map((segment, index) => {
        const isActive = currentMood === segment.value;

        return (
          <motion.div
            key={segment.value}
            whileHover={{ scale: 1.25, zIndex: 40 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectMood(segment.value)}
            onMouseEnter={() => onHoverMood(segment.value)}
            onMouseLeave={() => onHoverMood(null)}
            className={`relative rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center border-2 border-white shadow-xl ${
              isActive
                ? "w-16 h-16 md:w-20 md:h-20 z-30 ring-4 ring-white/80 shadow-[0_0_30px_rgba(255,255,255,0.6)] -translate-y-2"
                : "w-14 h-14 md:w-16 md:h-16 hover:z-30 hover:-translate-y-1 opacity-90 hover:opacity-100"
            }`}
            style={{
              zIndex: isActive ? 30 : index + 1,
              background: `radial-gradient(circle at 35% 35%, ${segment.color}, ${segment.color}bb)`,
            }}
          >
            {/* Emoji Face */}
            <LargeFace mood={segment.value} size={isActive ? 44 : 34} />

            {/* Active mood label badge below circle */}
            {isActive && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-7 px-3 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-semibold tracking-wider text-white border border-white/30 whitespace-nowrap shadow-lg"
              >
                {segment.label}
              </motion.span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default OverlappingMoodStack;
