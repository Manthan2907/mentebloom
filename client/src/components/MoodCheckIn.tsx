import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useStore, DAY_SHORT } from "@/lib/store";
import type { Mood } from "@/lib/store";
import { MoodFace, MOOD_COLORS, MOOD_LABELS, getMoodText } from "./MoodFaces";

const MOODS: { value: Mood; label: string; color: string }[] = [
  { value: "sad", label: "Down", color: "#e7a47e" },
  { value: "low", label: "Low", color: "#f0bd82" },
  { value: "okay", label: "Neutral", color: "#f3c43f" },
  { value: "good", label: "Good", color: "#b6d58b" },
  { value: "great", label: "Bright", color: "#ddf58b" },
];

const FACTORS = ["Work", "Study", "Family", "Sleep", "Health"];

export function MoodCheckIn() {
  const { todayMood, moodFactors, moodHistory, setMood } = useStore();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(todayMood);
  const [selectedFactors, setSelectedFactors] = useState<string[]>(moodFactors);
  const [submitted, setSubmitted] = useState(Boolean(todayMood));

  const selectedIndex = Math.max(0, MOODS.findIndex((item) => item.value === selectedMood));
  const selected = MOODS[selectedIndex];
  const weekMoods = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const key = date.toISOString().split("T")[0];
      return moodHistory.find((entry) => entry.date === key)?.mood || null;
    });
  }, [moodHistory]);

  const toggleFactor = (factor: string) => {
    setSelectedFactors((current) => current.includes(factor) ? current.filter((item) => item !== factor) : [...current, factor]);
  };

  const saveMood = () => {
    if (!selectedMood) return;
    setMood(selectedMood, selectedFactors);
    setSubmitted(true);
  };

  const reset = () => {
    setSubmitted(false);
    setSelectedMood(todayMood);
    setSelectedFactors(moodFactors);
  };

  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-[#e7e0d4] bg-[#f8f4ec] p-5 shadow-[0_25px_80px_rgba(72,62,45,0.12)] sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -left-20 -top-24 size-72 rounded-full bg-[#d9e8c7]/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full bg-[#f1d7bd]/60 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-48 -translate-x-1/2 rounded-full bg-white/60 blur-3xl" />

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div key="edit" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="relative z-10">
            <header className="flex items-start justify-between gap-4">
              <div><p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#1a1a1a]/40">Mind weather</p><h2 className="mt-2 max-w-lg font-display text-3xl leading-[0.98] text-[#18212b] sm:text-5xl">How would you describe your mood?</h2></div>
              <span className="hidden rounded-full border border-white/80 bg-white/45 px-3 py-1.5 text-[10px] font-mono text-[#1a1a1a]/45 sm:inline-flex">edit anytime</span>
            </header>

            <motion.div key={selectedMood || "empty"} initial={{ opacity: 0, scale: 0.82, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 180, damping: 16 }} className="mx-auto mt-8 grid max-w-md place-items-center">
              <div className="relative grid size-28 place-items-center rounded-full border border-white/85 bg-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_16px_35px_rgba(75,65,48,0.12)] backdrop-blur-xl sm:size-36">
                <div className="absolute inset-2 rounded-full opacity-50 blur-xl" style={{ backgroundColor: selected.color }} />
                <MoodFace mood={selectedMood || "okay"} size={selectedMood ? 96 : 82} />
              </div>
              <p className="mt-4 text-xl font-medium" style={{ color: selected.color }}>{getMoodText(selectedMood)}</p>
            </motion.div>

            <div className="relative mx-auto mt-8 max-w-3xl">
              <motion.div animate={{ left: `${((selectedIndex + 0.5) / MOODS.length) * 100}%` }} transition={{ type: "spring", stiffness: 240, damping: 20 }} className="absolute -top-4 z-20 -translate-x-1/2"><div className="h-0 w-0 border-x-[11px] border-t-[13px] border-x-transparent border-t-[#18212b]" /></motion.div>
              <div className="grid grid-cols-5 overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
                {MOODS.map((mood) => <motion.button key={mood.value} type="button" onClick={() => setSelectedMood(mood.value)} whileHover={{ y: -6 }} whileTap={{ scale: 0.94 }} aria-label={`Select ${mood.label} mood`} className="group flex min-h-24 flex-col items-center justify-center gap-2 border-r border-white/55 px-1 transition-colors last:border-r-0 hover:bg-white/35 sm:min-h-32"><motion.span animate={selectedMood === mood.value ? { scale: 1.24, rotate: [0, -5, 5, 0] } : { scale: 1 }} transition={{ duration: 0.5 }} className={`grid size-11 place-items-center rounded-full transition-all sm:size-14 ${selectedMood === mood.value ? "border border-white/90 bg-white/60 shadow-[0_10px_22px_rgba(75,65,48,0.14)] backdrop-blur-xl" : "bg-white/25"}`}><MoodFace mood={mood.value} size={selectedMood === mood.value ? 43 : 35} /></motion.span><span className="text-[10px] font-mono text-[#18212b]/60 sm:text-xs">{mood.label}</span></motion.button>)}
              </div>
            </div>

            <AnimatePresence>
              {selectedMood && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mx-auto mt-7 max-w-2xl overflow-hidden"><p className="mb-3 text-center text-xs text-[#1a1a1a]/50">What is shaping the weather?</p><div className="flex flex-wrap justify-center gap-2">{FACTORS.map((factor) => <button key={factor} type="button" onClick={() => toggleFactor(factor)} className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${selectedFactors.includes(factor) ? "border-[#18212b] bg-[#18212b] text-white" : "border-white/80 bg-white/40 text-[#1a1a1a]/55 hover:bg-white/70"}`}>{factor}</button>)}</div></motion.div>}
            </AnimatePresence>

            <div className="mt-8 flex justify-center"><button type="button" onClick={saveMood} disabled={!selectedMood} className="inline-flex items-center gap-2 rounded-full bg-[#18212b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#293744] disabled:cursor-not-allowed disabled:opacity-35">Save today <ArrowRight className="size-4" /></button></div>
          </motion.div>
        ) : (
          <motion.div key="saved" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
            <div className="flex flex-col items-center text-center"><div className="grid size-20 place-items-center rounded-full border border-white/90 bg-white/55 shadow-[0_15px_35px_rgba(75,65,48,0.12)] backdrop-blur-xl"><MoodFace mood={selectedMood} size={62} /></div><div className="mt-4 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#6d8766]"><Check className="size-4" /> Logged gently</div><h2 className="mt-2 font-display text-3xl text-[#18212b]">{selectedMood ? MOOD_LABELS[selectedMood] : "Your mood"} today</h2><p className="mt-2 max-w-md text-sm text-[#1a1a1a]/50">Your dashboard will carry this feeling forward with a small thought for the day.</p></div>
            <div className="mx-auto mt-8 max-w-xl rounded-[1.5rem] border border-white/75 bg-white/40 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl"><p className="mb-3 text-center text-[10px] font-mono uppercase tracking-widest text-[#1a1a1a]/35">Last seven days</p><div className="flex justify-between gap-2">{weekMoods.map((mood, index) => <div key={index} className="flex min-w-0 flex-1 flex-col items-center gap-1.5"><MoodFace mood={mood} size={index === 6 ? 34 : 26} /><span className="text-[9px] font-mono text-[#1a1a1a]/35">{DAY_SHORT[index]}</span></div>)}</div></div>
            <div className="mt-6 flex justify-center"><button type="button" onClick={reset} className="rounded-full border border-[#18212b]/20 bg-white/40 px-5 py-2.5 text-xs font-mono text-[#18212b]/70 transition hover:bg-white/70">Update mood</button></div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
