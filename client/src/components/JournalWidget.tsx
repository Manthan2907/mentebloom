/**
 * JournalWidget — Today's reflection / journal
 * Editorial Theme: Light white card
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, Clock, ChevronDown, ChevronUp, Save } from "lucide-react";
import { useStore, getJournalPrompts } from "@/lib/store";

export function JournalWidget() {
  const { journalEntries, saveJournalEntry } = useStore();
  const [content, setContent] = useState("");
  const [showPrevious, setShowPrevious] = useState(false);
  const [saved, setSaved] = useState(false);

  const prompts = getJournalPrompts();
  const currentPrompt = prompts[new Date().getDay() % prompts.length];

  const handleSave = () => {
    if (content.trim()) {
      saveJournalEntry(currentPrompt, content.trim());
      setContent("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#e8e4df] p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <PenLine className="w-4 h-4 text-[#c8f54e]" />
          <h3 className="font-display text-lg font-bold text-[#1a1a1a]">
            Today's Reflection
          </h3>
        </div>
        <span className="text-[10px] font-mono tracking-wider text-[#1a1a1a]/30">
          {journalEntries.length} entries
        </span>
      </div>

      {/* Prompt */}
      <div className="mb-4">
        <label className="text-[10px] font-mono text-[#1a1a1a]/30 tracking-wider uppercase block mb-2">
          Prompt
        </label>
        <p className="text-sm text-[#1a1a1a]/45 italic font-sans">
          {currentPrompt}
        </p>
      </div>

      {/* Writing Area */}
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts..."
          rows={4}
          className="w-full bg-[#faf8f5] border border-[#e8e4df] rounded-sm px-4 py-3 text-sm text-[#1a1a1a]/70 placeholder-[#1a1a1a]/20 font-sans resize-none focus:outline-none focus:border-[#c8f54e]/40 transition-colors"
        />
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        <AnimatePresence>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs font-mono text-[#c8f54e] font-semibold"
            >
              Entry saved ✓
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={handleSave}
          disabled={!content.trim()}
          className="flex items-center gap-2 text-xs font-mono tracking-wider bg-[#c8f54e] text-[#1a1a1a] px-4 py-2 rounded-sm hover:bg-[#d4f76a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed uppercase ml-auto font-semibold"
        >
          <Save className="w-3 h-3" />
          Save Entry
        </button>
      </div>

      {/* Previous Entries */}
      <div className="mt-5 pt-4 border-t border-[#f0ece7]">
        <button
          onClick={() => setShowPrevious(!showPrevious)}
          className="flex items-center gap-2 text-xs font-mono text-[#1a1a1a]/35 hover:text-[#1a1a1a]/55 transition-colors"
        >
          <Clock className="w-3.5 h-3.5" />
          Previous Entries ({journalEntries.length})
          {showPrevious ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <AnimatePresence>
          {showPrevious && journalEntries.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {journalEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#faf8f5] rounded-sm p-3 border border-[#e8e4df]"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-[#1a1a1a]/20">
                        {entry.date}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-[#c8f54e]/70 italic mb-1">
                      {entry.prompt}
                    </p>
                    <p className="text-xs text-[#1a1a1a]/50 font-sans leading-relaxed line-clamp-3">
                      {entry.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
