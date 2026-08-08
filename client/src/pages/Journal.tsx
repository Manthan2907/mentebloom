/**
 * /app/journal — Reflections & Enhanced Journal Page
 * Mood tagging, quick prompts, auto-save indicator, entry list with edit/delete
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Lock, Sparkles, Trash2, Edit3, Check,
} from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { AppFooter } from "@/components/AppFooter";
import { useStore, getJournalPrompts, type Mood } from "@/lib/store";
import { MoodFace } from "@/components/MoodFaces";
import HalftoneReveal from "@/components/ui/HalftoneReveal";
import Scanner from "@/components/ui/Scanner";
import GooeyNav from "@/components/ui/GooeyNav";
import { toast } from "sonner";

const MOOD_OPTIONS = [
  { label: "sad", value: "sad" },
  { label: "neutral", value: "low" },
  { label: "okay", value: "okay" },
  { label: "good", value: "good" },
  { label: "great", value: "great" },
];

const SENTIMENT_POSITIVE = ["happy", "great", "grateful", "joy", "love", "calm", "proud", "amazing", "wonderful", "excited"];
const SENTIMENT_NEGATIVE = ["stress", "anxious", "worry", "sad", "tired", "overwhelm", "struggle", "difficult", "hard", "fail"];

function getSentiment(text: string): "Positive" | "Reflective" | "Neutral" {
  const lower = text.toLowerCase();
  const pos = SENTIMENT_POSITIVE.filter((w) => lower.includes(w)).length;
  const neg = SENTIMENT_NEGATIVE.filter((w) => lower.includes(w)).length;
  if (pos > neg) return "Positive";
  if (neg > pos) return "Reflective";
  return "Neutral";
}

const fade = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06 } }),
};

export default function Journal() {
  const { journalEntries, saveJournalEntry, updateJournalEntry, removeJournalEntry } = useStore();

  const prompts = getJournalPrompts();

  // Active date for navigation
  const [activeDate, setActiveDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedMood, setSelectedMood] = useState("okay");
  const [content, setContent] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pre-fill if entry exists for active date
  useEffect(() => {
    const existing = journalEntries.find((e) => e.date === activeDate);
    if (existing) {
      setContent(existing.content);
    } else {
      setContent("");
    }
    setSavedAt(null);
  }, [activeDate]);

  // Auto-save after 1.5s of inactivity
  useEffect(() => {
    if (!content.trim()) return;
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      const existing = journalEntries.find((e) => e.date === activeDate);
      if (existing) {
        updateJournalEntry(existing.id, content);
      }
      setSavedAt(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    }, 1500);
    return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
  }, [content]);

  const navigateDate = (dir: -1 | 1) => {
    const d = new Date(activeDate);
    d.setDate(d.getDate() + dir);
    if (d > new Date()) return; // no future
    setActiveDate(d.toISOString().split("T")[0]);
  };

  const handleSave = () => {
    if (!content.trim()) { toast.error("Write something first."); return; }
    const existing = journalEntries.find((e) => e.date === activeDate);
    if (existing) {
      updateJournalEntry(existing.id, content);
    } else {
      saveJournalEntry(`${selectedMood} — ${activeDate}`, content);
    }
    setSavedAt(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    toast.success("Entry saved.");
  };

  const handleInsertPrompt = (p: string) => {
    setContent((prev) => prev ? `${prev}\n\n${p}\n` : `${p}\n`);
  };

  const displayDate = new Date(activeDate + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  // Last 7 entries sorted newest first
  const recentEntries = [...journalEntries]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  const sentiment = content.length > 20 ? getSentiment(content) : null;
  const sentimentColor = sentiment === "Positive" ? "#c8f54e" : sentiment === "Reflective" ? "#f97316" : "#38bdf8";

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <TopNav />

      <main className="container max-w-[1280px] mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <motion.div variants={fade} custom={0} initial="hidden" animate="visible" className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1a1a1a]">Your Private Reflections</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <Lock className="w-3 h-3 text-[#1a1a1a]/30" />
              <span className="text-xs font-mono text-[#1a1a1a]/30">Stored locally on your device</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Editor */}
          <div className="space-y-4">
            {/* Date nav */}
            <motion.div variants={fade} custom={1} initial="hidden" animate="visible"
              className="relative flex items-center gap-3 bg-[#161313] border-none rounded-xl px-4 py-3 shadow-sm overflow-hidden min-h-[60px]"
            >
              <div className="absolute inset-0 z-0 pointer-events-auto">
                <Scanner
                  color1="#51bf3e"
                  color2="#f8fcf7"
                  color3="#161313"
                  speed={0.5}
                  sweepSpeed={0.25}
                  sweepWidth={1.6}
                  sweepFalloff={6}
                  scale={1.5}
                  frequency={2}
                  ripple={0.22}
                  bandDensity={11}
                  lineSharpness={5.5}
                  glow={0.22}
                  scanDirection="vertical"
                  colorSpread={0.7}
                  brightness={1.0}
                  contrast={1.15}
                  softness={1.4}
                  vignette={0.45}
                  scanline={true}
                  grain={true}
                  grainIntensity={0.05}
                  opacity={1.0}
                  mouseInteraction={true}
                  mouseRadius={0.5}
                  mouseStrength={0.5}
                />
              </div>
              <button onClick={() => navigateDate(-1)} className="relative z-10 text-white/50 hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="relative z-10 flex-1 text-center text-sm font-display font-bold text-white drop-shadow-md">{displayDate}</span>
              <button
                onClick={() => navigateDate(1)}
                disabled={activeDate === new Date().toISOString().split("T")[0]}
                className="relative z-10 text-white/50 hover:text-white transition-colors disabled:opacity-20"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Mood selector */}
            <motion.div variants={fade} custom={2} initial="hidden" animate="visible"
              className="bg-white border border-[#e8e4df] rounded-xl px-4 py-3 shadow-sm"
            >
              <p className="text-[10px] font-mono text-[#1a1a1a]/40 uppercase tracking-wider mb-2">How are you feeling?</p>
              <div className="flex gap-3">
                {MOOD_OPTIONS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setSelectedMood(m.value)}
                    title={m.label}
                    className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border transition-all duration-300 ${
                      selectedMood === m.value
                        ? "border-[#c8f54e] bg-[#c8f54e]/10 scale-105 shadow-xs"
                        : "border-[#f0ece7] hover:border-[#c8f54e]/40 hover:scale-105"
                    }`}
                  >
                    <MoodFace mood={m.value as Mood} size={36} />
                    <span className="text-[9px] font-mono text-[#1a1a1a]/40 mt-1 uppercase font-semibold">{m.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Text editor */}
            <motion.div variants={fade} custom={3} initial="hidden" animate="visible"
              className="bg-white border border-[#e8e4df] rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-[#1a1a1a]/35 uppercase tracking-wider">Entry</span>
                <div className="flex items-center gap-3">
                  {sentiment && (
                    <span
                      className="text-[9px] font-mono px-2 py-0.5 rounded-full border"
                      style={{ color: sentimentColor, borderColor: sentimentColor, backgroundColor: `${sentimentColor}15` }}
                    >
                      {sentiment}
                    </span>
                  )}
                  {savedAt && (
                    <span className="text-[9px] font-mono text-[#1a1a1a]/30 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 text-[#c8f54e]" /> Saved {savedAt}
                    </span>
                  )}
                  <span className="text-[9px] font-mono text-[#1a1a1a]/25">{content.length} chars</span>
                </div>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind today?"
                rows={8}
                className="w-full text-sm font-sans text-[#1a1a1a] bg-transparent resize-none focus:outline-none placeholder:text-[#1a1a1a]/20 leading-relaxed"
              />
              <div className="flex justify-end mt-3 pt-3 border-t border-[#f0ece7]">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-[#c8f54e] text-[#1a1a1a] text-xs font-semibold font-mono rounded-lg hover:bg-[#b8e840] transition-colors"
                >
                  Save Entry
                </button>
              </div>
            </motion.div>

            {/* Quick prompts */}
            <motion.div variants={fade} custom={4} initial="hidden" animate="visible"
              className="bg-white border border-[#e8e4df] rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#c8f54e]" />
                <span className="text-[10px] font-mono text-[#1a1a1a]/40 uppercase tracking-wider">Quick Prompts</span>
              </div>
              <GooeyNav
                items={prompts.map(p => ({
                  label: p,
                  onClick: () => handleInsertPrompt(p)
                }))}
                initialActiveIndex={-1}
              />
            </motion.div>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Entry list */}
            <motion.div variants={fade} custom={6} initial="hidden" animate="visible"
              className="bg-white border border-[#e8e4df] rounded-xl p-5 shadow-sm h-fit"
            >
              <h3 className="font-display font-bold text-[#1a1a1a] mb-4">Recent Entries</h3>
              {recentEntries.length === 0 && (
                <p className="text-xs text-[#1a1a1a]/30 italic font-sans">No entries yet. Start writing above.</p>
              )}
              <div className="space-y-3">
                <AnimatePresence>
                  {recentEntries.map((entry) => {
                    const isExpanded = expandedId === entry.id;
                    const isEditing = editingId === entry.id;
                    const entrySentiment = getSentiment(entry.content);
                    const eColor = entrySentiment === "Positive" ? "#c8f54e" : entrySentiment === "Reflective" ? "#f97316" : "#38bdf8";
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                        className="border border-[#f0ece7] rounded-lg p-3 hover:border-[#e8e4df] transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : entry.id)}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-mono text-[#1a1a1a]/35">{entry.date}</span>
                              <span
                                className="text-[8px] font-mono px-1.5 py-0.5 rounded-full border"
                                style={{ color: eColor, borderColor: `${eColor}60`, backgroundColor: `${eColor}10` }}
                              >
                                {entrySentiment}
                              </span>
                            </div>
                            <p className="text-xs text-[#1a1a1a]/70 font-sans truncate">
                              {entry.content.slice(0, 60)}{entry.content.length > 60 ? "…" : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => { setEditingId(entry.id); setEditContent(entry.content); }}
                              className="text-[#1a1a1a]/25 hover:text-[#1a1a1a]/60 transition-colors"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => { removeJournalEntry(entry.id); toast.success("Entry deleted."); }}
                              className="text-[#1a1a1a]/25 hover:text-[#ef4444] transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Expanded view */}
                        <AnimatePresence>
                          {isExpanded && !isEditing && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <p className="mt-2 pt-2 border-t border-[#f0ece7] text-xs text-[#1a1a1a]/70 font-sans leading-relaxed whitespace-pre-wrap">
                                {entry.content}
                              </p>
                            </motion.div>
                          )}
                          {isEditing && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={4}
                                className="mt-2 w-full text-xs font-sans text-[#1a1a1a] border border-[#e8e4df] rounded-md p-2 bg-[#faf8f5] resize-none focus:outline-none focus:border-[#c8f54e]"
                              />
                              <div className="flex gap-2 mt-1.5">
                                <button
                                  onClick={() => { updateJournalEntry(entry.id, editContent); setEditingId(null); toast.success("Updated."); }}
                                  className="text-[9px] font-mono px-2.5 py-1 bg-[#c8f54e] text-[#1a1a1a] rounded-md font-semibold"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="text-[9px] font-mono px-2.5 py-1 border border-[#e8e4df] text-[#1a1a1a]/50 rounded-md"
                                >
                                  Cancel
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
