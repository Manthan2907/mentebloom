import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Plasma from "@/components/ui/Plasma";

const REFLECTIONS = [
  { text: "The quiet moments between habits are where growth takes root.", author: "Mentebloom" },
  { text: "You don't need to be perfect. You just need to keep showing up.", author: "Mentebloom" },
  { text: "A gentle morning routine can hold more power than a rigid schedule.", author: "Mentebloom" },
  { text: "Your body remembers what your mind tries to forget. Be kind to both.", author: "Mentebloom" },
  { text: "Progress isn't always visible. Trust the practice.", author: "Mentebloom" },
  { text: "The days you didn't feel like it are the ones that built your resilience.", author: "Mentebloom" },
  { text: "Notice how you feel, not just what you did.", author: "Mentebloom" },
];

export function QuoteWidget() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % REFLECTIONS.length);
    }, 20000); // 20 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border border-[#e8e4df] p-6 shadow-sm relative overflow-hidden bg-white/40 backdrop-blur-xs min-h-[140px] flex flex-col justify-center">
      {/* Plasma Background */}
      <div className="absolute inset-0 z-0 opacity-45 pointer-events-none">
        <Plasma
          color="#becf97"
          speed={0.5}
          direction="forward"
          scale={1.2}
          opacity={0.8}
          mouseInteractive={true}
          iterations={65}
        />
      </div>

      {/* Decorative quote mark */}
      <Quote className="absolute top-3 right-4 w-8 h-8 text-[#1a1a1a]/5" />

      {/* Scrolling Container */}
      <div className="relative z-10 h-[88px] overflow-hidden">
        <motion.div
          animate={{ y: -idx * 88 }}
          transition={{ type: "spring", stiffness: 70, damping: 14 }}
          className="w-full"
        >
          {REFLECTIONS.map((reflection, i) => (
            <div key={i} className="h-[88px] flex flex-col justify-center">
              <p className="font-display text-sm md:text-base text-[#1a1a1a]/80 italic leading-relaxed mb-1.5">
                "{reflection.text}"
              </p>
              <span className="text-[9px] font-mono text-[#1a1a1a]/40 tracking-wider">
                — {reflection.author}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
