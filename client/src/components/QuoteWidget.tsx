/**
 * QuoteWidget — Rotating wellness reflections
 * Editorial Theme: Light white card
 */
import { Quote } from "lucide-react";
import { useStore } from "@/lib/store";

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
  const { currentQuote } = useStore();

  const dayIdx = new Date().getDay() % REFLECTIONS.length;
  const reflection = REFLECTIONS[dayIdx];

  return (
    <div className="bg-white rounded-xl border border-[#e8e4df] p-6 shadow-sm relative overflow-hidden">
      {/* Decorative quote mark */}
      <Quote className="absolute top-3 right-4 w-8 h-8 text-[#c8f54e]/10" />

      <div className="relative z-10">
        <p className="font-display text-sm text-[#1a1a1a]/55 italic leading-relaxed mb-3">
          "{reflection.text}"
        </p>
        <span className="text-[9px] font-mono text-[#1a1a1a]/20 tracking-wider">
          — {reflection.author}
        </span>
      </div>
    </div>
  );
}
