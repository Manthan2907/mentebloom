import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Edit3,
  Frown,
  Heart,
  Laugh,
  Lock,
  Meh,
  PencilLine,
  Sparkles,
  Smile,
  Trash2,
  X,
} from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { AppFooter } from "@/components/AppFooter";
import { getJournalPrompts, useStore } from "@/lib/store";
import { toast } from "sonner";

const MOOD_OPTIONS = [
  { icon: Frown, label: "Low", value: "sad" },
  { icon: Meh, label: "Flat", value: "low" },
  { icon: Smile, label: "Okay", value: "okay" },
  { icon: Smile, label: "Good", value: "good" },
  { icon: Laugh, label: "Great", value: "great" },
];

const SENTIMENT_POSITIVE = ["happy", "great", "grateful", "joy", "love", "calm", "proud", "amazing", "wonderful", "excited"];
const SENTIMENT_NEGATIVE = ["stress", "anxious", "worry", "sad", "tired", "overwhelm", "struggle", "difficult", "hard", "fail"];

function getSentiment(text: string): "Positive" | "Reflective" | "Neutral" {
  const lower = text.toLowerCase();
  const pos = SENTIMENT_POSITIVE.filter((word) => lower.includes(word)).length;
  const neg = SENTIMENT_NEGATIVE.filter((word) => lower.includes(word)).length;
  if (pos > neg) return "Positive";
  if (neg > pos) return "Reflective";
  return "Neutral";
}

const fade = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.28, delay: i * 0.05 } }),
};

export default function Journal() {
  const { journalEntries, saveJournalEntry, updateJournalEntry, removeJournalEntry } = useStore();
  const prompts = getJournalPrompts();
  const today = new Date().toISOString().split("T")[0];
  const [activeDate, setActiveDate] = useState(today);
  const [selectedMood, setSelectedMood] = useState("okay");
  const [content, setContent] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [archiveOpen, setArchiveOpen] = useState(true);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const existing = journalEntries.find((entry) => entry.date === activeDate);
    setContent(existing?.content ?? "");
    setSavedAt(null);
  }, [activeDate, journalEntries]);

  useEffect(() => {
    if (!content.trim()) return;
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      const existing = journalEntries.find((entry) => entry.date === activeDate);
      if (existing) updateJournalEntry(existing.id, content);
      setSavedAt(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    }, 1500);
    return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
  }, [content, activeDate, journalEntries, updateJournalEntry]);

  const navigateDate = (direction: -1 | 1) => {
    const next = new Date(activeDate);
    next.setDate(next.getDate() + direction);
    if (next > new Date()) return;
    setActiveDate(next.toISOString().split("T")[0]);
  };

  const handleSave = () => {
    if (!content.trim()) { toast.error("Write something first."); return; }
    const existing = journalEntries.find((entry) => entry.date === activeDate);
    if (existing) updateJournalEntry(existing.id, content);
    else saveJournalEntry(`${selectedMood} — ${activeDate}`, content);
    setSavedAt(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    toast.success("Entry saved.");
  };

  const displayDate = new Date(`${activeDate}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });
  const recentEntries = [...journalEntries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);
  const sentiment = content.length > 20 ? getSentiment(content) : null;
  const sentimentClass = sentiment === "Positive" ? "text-[#526b00] bg-[#c8f54e]/25" : sentiment === "Reflective" ? "text-[#a4420c] bg-[#f97316]/10" : "text-[#176d8c] bg-[#38bdf8]/10";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f5f1] text-[#1a1a1a]">
      <TopNav />
      <main className="container mx-auto max-w-[1240px] px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <motion.header variants={fade} custom={0} initial="hidden" animate="visible" className="mb-8 flex flex-col gap-4 border-b border-[#1a1a1a]/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#6e7568]">A quiet place to check in</p>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Journal</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#1a1a1a]/55">Write without performing. A few honest lines are enough.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#1a1a1a]/45"><Lock className="size-3.5" aria-hidden="true" /> Private on this device</div>
        </motion.header>

        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="min-w-0">
            <motion.div variants={fade} custom={1} initial="hidden" animate="visible" className="mb-4 flex items-center justify-between rounded-xl border border-[#1a1a1a]/10 bg-white px-3 py-2.5 shadow-sm sm:px-4">
              <button aria-label="Previous day" onClick={() => navigateDate(-1)} className="grid size-9 place-items-center rounded-lg text-[#1a1a1a]/50 transition-colors hover:bg-[#f1efe9] hover:text-[#1a1a1a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526b00]"><ArrowLeft className="size-4" /></button>
              <div className="text-center"><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8b9086]">Writing for</p><p className="mt-0.5 font-display text-sm font-bold sm:text-base">{displayDate}</p></div>
              <button aria-label="Next day" onClick={() => navigateDate(1)} disabled={activeDate === today} className="grid size-9 place-items-center rounded-lg text-[#1a1a1a]/50 transition-colors hover:bg-[#f1efe9] hover:text-[#1a1a1a] disabled:pointer-events-none disabled:opacity-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526b00]"><ArrowRight className="size-4" /></button>
            </motion.div>

            <motion.div variants={fade} custom={2} initial="hidden" animate="visible" className="overflow-hidden rounded-2xl border border-[#1a1a1a]/10 bg-white shadow-[0_16px_50px_rgba(32,35,26,0.07)]">
              <div className="border-b border-[#1a1a1a]/10 px-5 py-5 sm:px-7 sm:py-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8b9086]">Today&apos;s check-in</p><h2 className="mt-1 font-display text-xl font-bold">How are you arriving?</h2></div>{sentiment && <span className={`w-fit rounded-full px-2.5 py-1 font-mono text-[10px] ${sentimentClass}`}>{sentiment}</span>}</div>
                <div className="grid grid-cols-5 gap-2 sm:max-w-[430px] sm:gap-3">
                  {MOOD_OPTIONS.map((mood) => { const Icon = mood.icon; const selected = selectedMood === mood.value; return <button key={mood.value} type="button" aria-label={`Mood: ${mood.label}`} aria-pressed={selected} onClick={() => setSelectedMood(mood.value)} className={`flex min-w-0 flex-col items-center gap-2 rounded-xl border px-1 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526b00] ${selected ? "border-[#526b00] bg-[#c8f54e]/25 text-[#1a1a1a]" : "border-transparent bg-[#f7f5f1] text-[#1a1a1a]/45 hover:border-[#1a1a1a]/15 hover:text-[#1a1a1a]"}`}><Icon className="size-5" aria-hidden="true" /><span className="truncate font-mono text-[9px] uppercase tracking-wide">{mood.label}</span></button>; })}
                </div>
              </div>
              <div className="px-5 py-5 sm:px-7 sm:py-7">
                <div className="mb-3 flex items-center justify-between gap-3"><label htmlFor="journal-entry" className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8b9086]">Your thoughts</label><span className="shrink-0 font-mono text-[10px] text-[#1a1a1a]/30">{content.length} characters</span></div>
                <textarea id="journal-entry" value={content} onChange={(event) => setContent(event.target.value)} placeholder="What is taking up space in your mind?" rows={10} className="min-h-[230px] w-full resize-y rounded-xl border border-[#1a1a1a]/10 bg-[#fbfaf8] px-4 py-4 text-sm leading-7 text-[#1a1a1a] outline-none transition-colors placeholder:text-[#1a1a1a]/30 focus:border-[#526b00] focus:ring-4 focus:ring-[#c8f54e]/20 sm:min-h-[280px]" />
                <div className="mt-4 flex flex-col-reverse gap-3 border-t border-[#1a1a1a]/10 pt-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-1.5 font-mono text-[10px] text-[#1a1a1a]/40">{savedAt ? <><Check className="size-3 text-[#526b00]" /> Saved at {savedAt}</> : "Autosaves as you write"}</div><button type="button" onClick={handleSave} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1a1a1a] px-5 font-mono text-xs font-semibold text-white transition-colors hover:bg-[#36382f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526b00]"><PencilLine className="size-3.5" /> Save entry</button></div>
              </div>
            </motion.div>

            <motion.div variants={fade} custom={3} initial="hidden" animate="visible" className="mt-4 rounded-xl border border-[#1a1a1a]/10 bg-[#eeeadf] px-5 py-4 sm:px-6"><div className="mb-3 flex items-center gap-2"><Sparkles className="size-3.5 text-[#526b00]" /><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6e7568]">Need a way in?</span></div><div className="flex flex-wrap gap-2">{prompts.map((prompt) => <button key={prompt} type="button" onClick={() => setContent((previous) => previous ? `${previous}\n\n${prompt}\n` : `${prompt}\n`)} className="rounded-full border border-[#1a1a1a]/15 bg-white/60 px-3 py-2 text-left font-mono text-[10px] text-[#1a1a1a]/65 transition-colors hover:border-[#526b00] hover:text-[#1a1a1a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526b00]">{prompt}</button>)}</div></motion.div>
          </section>

          <aside className="min-w-0 lg:sticky lg:top-6">
            <button type="button" aria-expanded={archiveOpen} onClick={() => setArchiveOpen((open) => !open)} className="flex w-full items-center justify-between border-b border-[#1a1a1a]/10 pb-3 text-left lg:pointer-events-none"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8b9086]">Your archive</p><h2 className="mt-1 font-display text-xl font-bold">Recent entries</h2></div><div className="flex items-center gap-3"><span className="font-mono text-[10px] text-[#1a1a1a]/40">{recentEntries.length} saved</span><ChevronDown className={`size-4 transition-transform lg:hidden ${archiveOpen ? "rotate-180" : ""}`} /></div></button>
            <div className={`${archiveOpen ? "mt-4 block" : "hidden"} space-y-2.5`}>
              {recentEntries.length === 0 && <div className="rounded-xl border border-dashed border-[#1a1a1a]/15 px-4 py-6 text-sm leading-6 text-[#1a1a1a]/45">Your saved reflections will appear here.</div>}
              <AnimatePresence initial={false}>{recentEntries.map((entry) => { const expanded = expandedId === entry.id; const editing = editingId === entry.id; const entrySentiment = getSentiment(entry.content); return <motion.article key={entry.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="rounded-xl border border-[#1a1a1a]/10 bg-white p-4 shadow-sm"><div className="flex items-start gap-3"><button type="button" onClick={() => setExpandedId(expanded ? null : entry.id)} className="min-w-0 flex-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526b00]"><div className="mb-2 flex flex-wrap items-center gap-2"><time className="font-mono text-[10px] text-[#1a1a1a]/40">{entry.date}</time><span className="rounded-full bg-[#f1efe9] px-2 py-0.5 font-mono text-[9px] text-[#1a1a1a]/55">{entrySentiment}</span></div><p className={`text-sm leading-6 text-[#1a1a1a]/70 ${expanded ? "" : "line-clamp-2"}`}>{entry.content}</p></button><div className="flex shrink-0 items-center gap-1"><button aria-label={`Edit entry from ${entry.date}`} type="button" onClick={() => { setEditingId(entry.id); setEditContent(entry.content); }} className="grid size-8 place-items-center rounded-lg text-[#1a1a1a]/35 hover:bg-[#f1efe9] hover:text-[#1a1a1a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526b00]"><Edit3 className="size-3.5" /></button><button aria-label={`Delete entry from ${entry.date}`} type="button" onClick={() => { removeJournalEntry(entry.id); toast.success("Entry deleted."); }} className="grid size-8 place-items-center rounded-lg text-[#1a1a1a]/35 hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"><Trash2 className="size-3.5" /></button></div></div>{editing && <div className="mt-3 border-t border-[#1a1a1a]/10 pt-3"><textarea aria-label="Edit journal entry" value={editContent} onChange={(event) => setEditContent(event.target.value)} rows={5} className="w-full resize-y rounded-lg border border-[#1a1a1a]/10 bg-[#fbfaf8] p-3 text-sm leading-6 outline-none focus:border-[#526b00]" /><div className="mt-2 flex flex-wrap gap-2"><button type="button" onClick={() => { updateJournalEntry(entry.id, editContent); setEditingId(null); toast.success("Entry updated."); }} className="rounded-lg bg-[#1a1a1a] px-3 py-2 font-mono text-[10px] font-semibold text-white">Save changes</button><button type="button" onClick={() => setEditingId(null)} className="inline-flex items-center gap-1 rounded-lg border border-[#1a1a1a]/15 px-3 py-2 font-mono text-[10px] text-[#1a1a1a]/60"><X className="size-3" /> Cancel</button></div></div>}</motion.article>; })}</AnimatePresence>
            </div>
            <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-[#1a1a1a]/40"><Heart className="mt-0.5 size-3.5 shrink-0" /> No perfect entry required. Showing up counts.</div>
          </aside>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
