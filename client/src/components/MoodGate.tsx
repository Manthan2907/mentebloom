import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Leaf, PenLine, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Mood } from "@/lib/store";

const MOODS: Array<{ value: Mood; name: string; detail: string; color: string; emoji: string }> = [
  { value: "sad", name: "Heavy", detail: "I need gentleness today", color: "#7d8aa3", emoji: "😔" },
  { value: "low", name: "Low", detail: "I am moving slowly", color: "#a58c78", emoji: "😕" },
  { value: "okay", name: "Steady", detail: "I am finding my balance", color: "#b7a66a", emoji: "😐" },
  { value: "good", name: "Light", detail: "There is some ease today", color: "#7d9d80", emoji: "🙂" },
  { value: "great", name: "Bright", detail: "I feel open and energised", color: "#a8c878", emoji: "😊" },
];

const FACTORS = ["Study", "Sleep", "People", "Health", "Work"];

function getInsight(mood: Mood, factors: string[], note: string) {
  const lead = mood === "sad" || mood === "low"
    ? "Today does not need to be a performance."
    : mood === "great" || mood === "good"
      ? "There is useful energy here."
      : "A steady day is still a meaningful day.";
  const context = factors.length ? ` You are noticing ${factors.slice(0, 2).join(" and ").toLowerCase()}.` : "";
  const next = mood === "sad" || mood === "low" ? "Choose one small thing that makes the next hour softer." : "Choose one thing worth carrying forward.";
  return `${lead}${context} ${next}${note.trim() ? " Your reflection is part of the picture." : ""}`;
}

export function MoodGate({ onComplete }: { onComplete: () => void }) {
  const { setMood } = useStore();
  const [step, setStep] = useState<"mood" | "context" | "reflection" | "ready">("mood");
  const [mood, setMoodChoice] = useState<Mood | null>(null);
  const [factors, setFactors] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const selected = MOODS.find((item) => item.value === mood) ?? MOODS[2];
  const insight = useMemo(() => mood ? getInsight(mood, factors, note) : "Take a breath. There is no wrong answer here.", [factors, mood, note]);

  const finish = () => {
    if (!mood) return;
    setMood(mood, factors, note.trim());
    setStep("ready");
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#101720] px-4 py-5 text-[#f3f1e8] sm:px-8 sm:py-8"
    >
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#18212b] shadow-2xl sm:min-h-[calc(100vh-4rem)] lg:grid lg:grid-cols-[0.84fr_1.16fr]">
        <section className="relative flex min-h-56 flex-col justify-between overflow-hidden bg-[#c9d8b5] p-6 text-[#18212b] sm:p-9 lg:min-h-full">
          <div className="relative z-10 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]"><Leaf className="size-4" /> mentebloom</div>
          <div className="relative z-10 max-w-sm pb-4 sm:pb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#18212b]/55">A quiet arrival</p>
            <h1 className="font-display text-4xl font-semibold leading-[0.95] sm:text-6xl">Before the day starts, check in with yourself.</h1>
            <p className="mt-5 max-w-xs text-sm leading-6 text-[#18212b]/70">Your answer shapes the small thought waiting for you on the dashboard.</p>
          </div>
          <motion.img src="/meditating_character.png" alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-10 right-[-1rem] w-48 opacity-70 mix-blend-multiply sm:w-64 lg:right-[-2rem] lg:w-80" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 0.7, y: 0 }} transition={{ duration: 0.8 }} />
        </section>

        <section className="flex flex-1 flex-col p-6 sm:p-10 lg:p-14">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9d8b5]/70">Daily pulse</p><p className="mt-2 text-sm text-white/45">A minute for your inner weather</p></div>
            <button type="button" onClick={() => { setMoodChoice("okay"); setMood("okay", [], ""); onComplete(); }} className="text-xs text-white/45 underline-offset-4 hover:text-white hover:underline">Skip for now</button>
          </div>

          <AnimatePresence mode="wait">
            {step === "mood" && (
              <motion.div key="mood" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                <h2 className="max-w-lg font-display text-3xl leading-tight sm:text-5xl">What is the truest word for today?</h2>
                <div className="mt-8 grid gap-2 sm:grid-cols-5">
                  {MOODS.map((item) => (
                    <motion.button type="button" key={item.value} whileTap={{ scale: 0.96 }} onClick={() => { setMoodChoice(item.value); setStep("context"); }} className={`group relative min-h-32 overflow-hidden rounded-2xl border p-3 text-left transition-colors sm:min-h-36 ${mood === item.value ? "border-[#c9d8b5] bg-[#c9d8b5] text-[#18212b]" : "border-white/10 bg-white/[0.03] text-white hover:border-white/30 hover:bg-white/[0.07]"}`}>
                      <motion.span animate={mood === item.value ? { scale: [1, 1.45, 1], opacity: [1, 0.45, 1] } : { scale: 1, opacity: 1 }} transition={{ duration: 0.7, ease: "easeOut" }} className="absolute -right-5 -top-5 size-20 rounded-full blur-xl" style={{ backgroundColor: item.color }} />
                      <motion.span animate={mood === item.value ? { scale: [1, 1.15, 1], rotate: [0, -8, 8, 0] } : { scale: 1, rotate: 0 }} transition={{ duration: 0.55 }} className="relative z-10 mb-6 block text-3xl leading-none" role="img" aria-label={item.name}>{item.emoji}</motion.span>
                      <span className="relative z-10 block text-sm font-semibold">{item.name}</span><span className={`relative z-10 mt-1 block text-[11px] leading-4 ${mood === item.value ? "text-[#18212b]/60" : "text-white/40"}`}>{item.detail}</span>
                    </motion.button>
                  ))}
                </div>
                <p className="mt-6 text-xs text-white/35">There is no better or worse answer. Noticing is enough.</p>
              </motion.div>
            )}

            {step === "context" && (
              <motion.div key="context" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                <div className="mb-8 flex items-center gap-3"><span className="size-3 rounded-full" style={{ backgroundColor: selected.color }} /><p className="text-sm text-white/55">You feel <span className="font-semibold text-white">{selected.name.toLowerCase()}</span> today.</p></div>
                <h2 className="max-w-lg font-display text-3xl leading-tight sm:text-5xl">What is part of the picture?</h2>
                <div className="mt-8 flex flex-wrap gap-3">{FACTORS.map((factor) => <button type="button" key={factor} onClick={() => setFactors((current) => current.includes(factor) ? current.filter((item) => item !== factor) : [...current, factor])} className={`rounded-full border px-5 py-3 text-sm transition-colors ${factors.includes(factor) ? "border-[#c9d8b5] bg-[#c9d8b5] text-[#18212b]" : "border-white/15 text-white/65 hover:border-white/40"}`}>{factors.includes(factor) && <Check className="mr-2 inline size-4" />}{factor}</button>)}</div>
                <button type="button" onClick={() => setStep("reflection")} className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#c9d8b5] px-6 py-3 text-sm font-semibold text-[#18212b] transition-transform hover:translate-x-1">Continue <ArrowRight className="size-4" /></button>
              </motion.div>
            )}

            {step === "reflection" && (
              <motion.div key="reflection" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                <div className="mb-8 flex items-center gap-3"><PenLine className="size-5 text-[#c9d8b5]" /><p className="text-sm text-white/55">Optional, but useful for your future self.</p></div>
                <h2 className="max-w-lg font-display text-3xl leading-tight sm:text-5xl">Give the feeling a little context.</h2>
                <textarea autoFocus value={note} onChange={(event) => setNote(event.target.value)} maxLength={280} rows={5} placeholder="What is on your mind?" className="mt-8 w-full resize-none rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-base leading-7 text-white outline-none placeholder:text-white/25 focus:border-[#c9d8b5]" />
                <div className="mt-2 flex items-center justify-between text-xs text-white/30"><span>Your words stay in your journal.</span><span>{note.length}/280</span></div>
                <button type="button" onClick={finish} className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#c9d8b5] px-6 py-3 text-sm font-semibold text-[#18212b] transition-transform hover:translate-x-1">See my thought <Sparkles className="size-4" /></button>
              </motion.div>
            )}

            {step === "ready" && (
              <motion.div key="ready" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
                <Sparkles className="mb-8 size-8 text-[#c9d8b5]" /><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9d8b5]/70">Your thought for today</p><h2 className="font-display text-3xl leading-tight sm:text-5xl">{insight}</h2>
                <p className="mt-8 text-sm leading-6 text-white/45">We will carry this gently into your dashboard. You can always revisit it from Mood history.</p>
                <button type="button" onClick={onComplete} className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-sm text-white hover:border-[#c9d8b5]">Open dashboard <ArrowRight className="size-4" /></button>
              </motion.div>
            )}
          </AnimatePresence>

          {step !== "ready" && <div className="mt-auto pt-12 text-xs text-white/25">{step === "mood" ? "01 / 03" : step === "context" ? "02 / 03" : "03 / 03"}</div>}
        </section>
      </div>
    </motion.main>
  );
}
