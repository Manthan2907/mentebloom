import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Activity, ArrowUpRight, Droplet, HeartHandshake, Moon, Plus, Trash2 } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { AppFooter } from "@/components/AppFooter";
import { useStore, type ExerciseIntensity, type ExerciseType, type Mood } from "@/lib/store";
import { toast } from "sonner";

const EXERCISE_TYPES: ExerciseType[] = ["Running", "Yoga", "Gym", "Sports", "Walk", "Cycling", "Swimming", "Other"];
const INTENSITIES: ExerciseIntensity[] = ["Low", "Medium", "High"];
const MOODS: { value: Mood; label: string; note: string }[] = [
  { value: "great", label: "Great", note: "Feeling energised" },
  { value: "good", label: "Good", note: "Steady and okay" },
  { value: "okay", label: "Okay", note: "Taking it gently" },
  { value: "low", label: "Low", note: "A little heavy" },
  { value: "sad", label: "Sad", note: "Could use support" },
];

function qualityLabel(q: number) { return ["", "Poor", "Fair", "Good", "Great", "Excellent"][q] ?? ""; }
function moodLabel(mood: Mood | null) { return MOODS.find((item) => item.value === mood)?.label ?? "Not checked in"; }

export default function Wellness() {
  const { sleepEntries, addSleepEntry, removeSleepEntry, exerciseSessions, addExerciseSession, removeExerciseSession, hydration, todayMood, setMood } = useStore();
  const [sleepDate, setSleepDate] = useState(new Date().toISOString().split("T")[0]);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [sleepQuality, setSleepQuality] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [sleepNotes, setSleepNotes] = useState("");
  const [exType, setExType] = useState<ExerciseType>("Walk");
  const [exDuration, setExDuration] = useState(30);
  const [exIntensity, setExIntensity] = useState<ExerciseIntensity>("Medium");
  const last7Sleep = sleepEntries.slice(0, 7).reverse();
  const avgSleep = useMemo(() => last7Sleep.length ? +(last7Sleep.reduce((total, entry) => total + entry.hours, 0) / last7Sleep.length).toFixed(1) : 0, [last7Sleep]);
  const totalExercise = useMemo(() => exerciseSessions.reduce((total, session) => total + session.durationMinutes, 0), [exerciseSessions]);
  const hydrationGlasses = Math.round((hydration.today / 1000) * 4);
  const wellnessScore = Math.round(Math.min(100, Math.min(avgSleep / 8, 1) * 33 + Math.min(totalExercise / 150, 1) * 33 + Math.min(hydrationGlasses / 8, 1) * 34));

  const handleAddSleep = () => {
    if (sleepHours <= 0) return toast.error("Enter valid sleep hours.");
    addSleepEntry({ date: sleepDate, hours: sleepHours, quality: sleepQuality, notes: sleepNotes });
    setSleepNotes(""); toast.success("Sleep logged.");
  };
  const handleAddExercise = () => {
    if (exDuration <= 0) return toast.error("Enter valid duration.");
    addExerciseSession({ date: new Date().toISOString().split("T")[0], type: exType, durationMinutes: exDuration, intensity: exIntensity });
    toast.success("Session logged.");
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a]">
      <TopNav />
      <main className="container mx-auto max-w-[1280px] px-4 py-8 lg:px-8">
        <header className="mb-8 flex flex-col justify-between gap-5 border-b border-[#e8e4df] pb-7 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2"><span className="rounded-sm bg-[#c8f54e] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest">Personal wellbeing</span><span className="font-mono text-xs text-[#1a1a1a]/40">A daily check-in</span></div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">How are you feeling today?</h1>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#1a1a1a]/60">A quieter place to notice your mood, care for your body, and find support when you need it.</p>
          </div>
          <Link href="/app" className="flex items-center gap-2 self-start rounded-xl bg-[#1a1a1a] px-4 py-2.5 font-mono text-xs font-semibold text-white transition-colors hover:bg-[#333] md:self-auto">Back to dashboard <ArrowUpRight className="h-4 w-4 text-[#c8f54e]" /></Link>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-[#e8e4df] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4"><div><p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/40">Today&apos;s check-in</p><h2 className="font-display text-2xl font-bold">{todayMood ? `You&apos;re feeling ${moodLabel(todayMood).toLowerCase()}.` : "Start with one word."}</h2></div><HeartHandshake className="h-5 w-5 text-[#1a1a1a]/40" /></div>
            <div className="grid grid-cols-5 gap-2">{MOODS.map((item) => <button key={item.value} onClick={() => { setMood(item.value, []); toast.success(`Mood saved: ${item.label}.`); }} aria-pressed={todayMood === item.value} className={`rounded-xl border px-2 py-3 text-center transition-colors ${todayMood === item.value ? "border-[#c8f54e] bg-[#c8f54e]" : "border-[#e8e4df] bg-[#faf8f5] hover:border-[#1a1a1a]/30"}`}><span className="block font-display text-sm font-bold">{item.label}</span><span className="mt-1 hidden text-[10px] text-[#1a1a1a]/50 sm:block">{item.note}</span></button>)}</div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0ece7] pt-4"><p className="text-xs text-[#1a1a1a]/50">Your check-in stays private and helps you notice patterns.</p><Link href="/app/journal" className="font-mono text-xs font-bold underline decoration-[#c8f54e] decoration-2 underline-offset-4">Reflect in journal <ArrowUpRight className="ml-1 inline h-3 w-3" /></Link></div>
          </div>
          <div className="rounded-2xl bg-[#1a1a1a] p-6 text-white"><p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#c8f54e]">Your wellbeing snapshot</p><div className="flex items-end gap-3"><span className="font-display text-6xl font-black leading-none">{wellnessScore}</span><span className="pb-1 font-mono text-xs text-white/60">/ 100 today</span></div><p className="mt-4 text-sm leading-relaxed text-white/65">A gentle view of sleep, movement, and hydration — not a grade.</p><div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/15 pt-4 text-xs"><span><strong className="block font-display text-lg text-white">{avgSleep}h</strong>sleep</span><span><strong className="block font-display text-lg text-white">{totalExercise}m</strong>movement</span><span><strong className="block font-display text-lg text-white">{hydrationGlasses}/8</strong>water</span></div></div>
        </section>

        <section className="mb-8 flex flex-col justify-between gap-4 border-y border-[#e8e4df] py-5 md:flex-row md:items-center"><div><p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/40">Need a person, not another metric?</p><h2 className="mt-1 font-display text-xl font-bold">Talk with a counsellor</h2><p className="mt-1 text-sm text-[#1a1a1a]/55">Get a little more support when things feel difficult to carry alone.</p></div><Link href="/app/consultation" className="flex items-center gap-2 self-start rounded-xl border border-[#1a1a1a] px-4 py-2.5 font-mono text-xs font-bold transition-colors hover:bg-[#1a1a1a] hover:text-white">Explore support <ArrowUpRight className="h-4 w-4" /></Link></section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[#e8e4df] bg-white p-6 shadow-sm"><div className="mb-4 flex items-center gap-2"><Moon className="h-4 w-4 text-[#7c5cff]" /><h2 className="font-display text-lg font-bold">Sleep tracker</h2></div><div className="mb-5 flex h-12 items-end gap-1.5">{last7Sleep.map((entry) => <div key={entry.id} title={`${entry.hours} hours`} className="flex-1 rounded-sm bg-[#c8f54e]" style={{ height: `${Math.max(8, (entry.hours / 12) * 100)}%` }} />)}</div><div className="grid grid-cols-2 gap-3 border-t border-[#f0ece7] pt-4"><input type="date" value={sleepDate} onChange={(e) => setSleepDate(e.target.value)} className="rounded-lg border border-[#e8e4df] bg-[#faf8f5] px-3 py-2 text-xs" /><input type="number" min={0} max={12} step={0.5} value={sleepHours} onChange={(e) => setSleepHours(+e.target.value)} className="rounded-lg border border-[#e8e4df] bg-[#faf8f5] px-3 py-2 text-xs" /></div><div className="mt-3 flex gap-2">{([1,2,3,4,5] as const).map((q) => <button key={q} onClick={() => setSleepQuality(q)} className={`flex-1 rounded-md border py-1.5 text-xs ${sleepQuality === q ? "border-[#c8f54e] bg-[#c8f54e]" : "border-[#e8e4df]"}`}>{q}</button>)}</div><textarea rows={2} value={sleepNotes} onChange={(e) => setSleepNotes(e.target.value)} placeholder="A note about last night (optional)" className="mt-3 w-full resize-none rounded-lg border border-[#e8e4df] bg-[#faf8f5] px-3 py-2 text-xs" /><button onClick={handleAddSleep} className="mt-3 flex items-center gap-2 rounded-lg bg-[#c8f54e] px-4 py-2 font-mono text-xs font-semibold"><Plus className="h-3 w-3" /> Log sleep</button><div className="mt-4 flex flex-col gap-2">{sleepEntries.slice(0, 4).map((entry) => <div key={entry.id} className="flex items-center justify-between font-mono text-xs text-[#1a1a1a]/55"><span>{entry.date}</span><span>{entry.hours}h · {qualityLabel(entry.quality)}</span><button onClick={() => removeSleepEntry(entry.id)} aria-label={`Remove sleep entry from ${entry.date}`}><Trash2 className="h-3 w-3" /></button></div>)}</div></motion.section>
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-2xl border border-[#e8e4df] bg-white p-6 shadow-sm"><div className="mb-5 flex items-center gap-2"><Activity className="h-4 w-4 text-[#1a1a1a]" /><h2 className="font-display text-lg font-bold">Movement today</h2></div><div className="flex flex-wrap gap-2">{EXERCISE_TYPES.map((type) => <button key={type} onClick={() => setExType(type)} className={`rounded-md border px-2.5 py-1.5 font-mono text-[10px] ${exType === type ? "border-[#c8f54e] bg-[#c8f54e]" : "border-[#e8e4df]"}`}>{type}</button>)}</div><div className="mt-5 grid grid-cols-2 gap-3"><label className="font-mono text-[10px] text-[#1a1a1a]/45">MINUTES<input type="number" min={1} value={exDuration} onChange={(e) => setExDuration(+e.target.value)} className="mt-1 w-full rounded-lg border border-[#e8e4df] bg-[#faf8f5] px-3 py-2 text-xs text-[#1a1a1a]" /></label><label className="font-mono text-[10px] text-[#1a1a1a]/45">INTENSITY<select value={exIntensity} onChange={(e) => setExIntensity(e.target.value as ExerciseIntensity)} className="mt-1 w-full rounded-lg border border-[#e8e4df] bg-[#faf8f5] px-3 py-2 text-xs text-[#1a1a1a]">{INTENSITIES.map((intensity) => <option key={intensity}>{intensity}</option>)}</select></label></div><button onClick={handleAddExercise} className="mt-5 flex items-center gap-2 rounded-lg bg-[#c8f54e] px-4 py-2 font-mono text-xs font-semibold"><Plus className="h-3 w-3" /> Log movement</button><div className="mt-6 border-t border-[#f0ece7] pt-4"><div className="mb-3 flex items-center gap-2"><Droplet className="h-4 w-4 text-[#38bdf8]" /><span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/45">Hydration</span></div><p className="font-display text-2xl font-bold">{hydrationGlasses} <span className="font-sans text-sm font-normal text-[#1a1a1a]/45">of 8 glasses</span></p><div className="mt-3 h-2 rounded-full bg-[#f0ece7]"><div className="h-full rounded-full bg-[#38bdf8]" style={{ width: `${Math.min(100, hydrationGlasses / 8 * 100)}%` }} /></div></div><div className="mt-5 flex flex-col gap-2">{exerciseSessions.slice(0, 4).map((session) => <div key={session.id} className="flex items-center justify-between font-mono text-xs text-[#1a1a1a]/55"><span className="font-semibold text-[#1a1a1a]">{session.type}</span><span>{session.durationMinutes}m · {session.intensity}</span><button onClick={() => removeExerciseSession(session.id)} aria-label={`Remove ${session.type} session`}><Trash2 className="h-3 w-3" /></button></div>)}</div></motion.section>
        </div>
      </main><AppFooter />
    </div>
  );
}
