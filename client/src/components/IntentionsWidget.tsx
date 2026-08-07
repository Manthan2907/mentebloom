/**
 * IntentionsWidget — Set and track weekly intentions
 * Editorial Theme: Light white card
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { useStore } from "@/lib/store";

export function IntentionsWidget() {
  const { intentions, addIntention, toggleIntention, removeIntention } = useStore();
  const [newIntention, setNewIntention] = useState("");

  const completedCount = intentions.filter((i) => i.completed).length;

  const handleAdd = () => {
    if (newIntention.trim()) {
      addIntention(newIntention.trim());
      setNewIntention("");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#e8e4df] p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-xl font-bold text-[#1a1a1a]">Intentions</h3>
        <span className="text-xs font-mono text-[#1a1a1a]/35">
          {completedCount} / {Math.max(intentions.length, 3)} SET
        </span>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {intentions.map((intention) => (
            <motion.div
              key={intention.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 group"
            >
              <button
                onClick={() => toggleIntention(intention.id)}
                className={`w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 transition-all ${
                  intention.completed
                    ? "bg-[#c8f54e] border-[#c8f54e]"
                    : "border-[#e0dcd7] hover:border-[#c8f54e]/50"
                }`}
              >
                {intention.completed && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="#1a1a1a"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                )}
              </button>
              <span
                className={`text-sm flex-1 transition-all ${
                  intention.completed
                    ? "text-[#1a1a1a]/35 line-through"
                    : "text-[#1a1a1a]/80"
                }`}
              >
                {intention.text}
              </span>
              <button
                onClick={() => removeIntention(intention.id)}
                className="opacity-0 group-hover:opacity-100 text-[#1a1a1a]/20 hover:text-red-500 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Intention */}
        <div className="flex items-center gap-2 border border-dashed border-[#e0dcd7] rounded-sm px-3 py-2 hover:border-[#c8f54e]/40 transition-colors">
          <Plus className="w-3.5 h-3.5 text-[#1a1a1a]/20 shrink-0" />
          <input
            type="text"
            value={newIntention}
            onChange={(e) => setNewIntention(e.target.value)}
            placeholder="Add an intention…"
            className="flex-1 bg-transparent text-sm text-[#1a1a1a]/60 placeholder-[#1a1a1a]/20 border-none outline-none font-sans"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
        </div>
      </div>
    </div>
  );
}
