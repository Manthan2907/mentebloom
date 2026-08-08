import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Leaf, PenLine, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Mood } from "@/lib/store";

const MOODS: Array<{ value: Mood; name: string; detail: string; color: string; emoji: string }> = [
  { value: "sad", name: "Heavy", detail: "I need gentleness today", color: "#9aa8c0", emoji: "😔" },
  { value: "low", name: "Low", detail: "I am moving slowly", color: "#c29e83", emoji: "😕" },
  { value: "okay", name: "Steady", detail: "I am finding my balance", color: "#d9bc6b", emoji: "😐" },
  { value: "good", name: "Light", detail: "There is some ease today", color: "#85aa8a", emoji: "🙂" },
  { value: "great", name: "Bright", detail: "I feel open and energised", color: "#b6d875", emoji: "😊" },
];

const FACTORS = ["Study", "Sleep", "People", "Health", "Work"];

function getInsight(mood: Mood, factors: string[], note: string) {
  const lead = mood === "sad" || mood === "low" ? "Today does not need to be a performance." : mood === "great" || mood === "good" ? "There is useful energy here." : "A steady day is still a meaningful day.";
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
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 overflow-y-auto bg-[#081019] p-3 text-[#f6f3eb] sm:p-6 lg:grid lg:place-items-center">
      <div className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-[1180px] flex-col overflow-y-auto rounded-[2rem] border border-white/15 bg-[#15202b]/95 shadow-[0_40px_120px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:min-h-[calc(100vh-3rem)] lg:min-h-[665px] lg:grid lg:grid-cols-[0.84fr_1.16fr] lg:overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 top-1/3 size-64 rounded-full bg-[#c9d8b5]/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 bottom-0 size-72 rounded-full bg-[#b6d875]/10 blur-3xl" />

        <section className="relative flex min-h-64 flex-col justify-between overflow-hidden bg-[#c9d8b5] p-6 text-[#18212b] sm:min-h-72 sm:p-9 lg:min-h-full lg:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute -left-16 top-20 size-48 rounded-full bg-white/25 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-8 right-6 size-40 rounded-full bg-[#8cb29a]/30 blur-2xl" />
          <div className="relative z-10 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]"><Leaf className="size-4" /> mentebloom</div>
          <div className="relative z-10 max-w-sm pb-4 sm:pb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#18212b]/55">A quiet arrival</p>
            <h1 className="font-display text-4xl font-semibold leading-[0.95] sm:text-6xl">Before the day starts, check in with yourself.</h1>
            <p className="mt-5 max-w-xs text-sm leading-6 text-[#18212b]/70">Your answer shapes the small thought waiting for you on the dashboard.</p>
          </div>
          <motion.img src="/meditating_character.png" alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-10 right-[-1rem] w-52 opacity-75 mix-blend-multiply sm:w-72 lg:right-[-2rem] lg:w-[22rem]" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 0.75, y: 0 }} transition={{ duration: 0.9, ease: "easeOut" }} />
        </section>

        <section className="relative flex flex-1 flex-col p-6 sm:p-10 lg:p-14">
          <div className="mb-8 flex items-center justify-end">
            <button type="button" onClick={() => { setMood("okay", [], ""); onComplete(); }} className="text-xs text-white/45 underline-offset-4 transition hover:text-white hover:underline">Skip for now</button>
          </div>

          <AnimatePresence mode="wait">
            {step === "mood" && <motion.div key="mood" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }} className="flex flex-col items-center text-center">
              <h2 className="max-w-md font-display text-[2.3rem] leading-[1.02] tracking-[-0.02em] sm:text-5xl">How would you describe your mood?</h2>
              <AnimatePresence mode="wait">
                <motion.p key={mood ?? "none"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="mt-4 text-base font-medium" style={{ color: mood ? selected.color : "rgba(255,255,255,0.35)" }}>
                  {mood ? `I feel ${selected.name.toLowerCase()}.` : "Notice where you are right now."}
                </motion.p>
              </AnimatePresence>

              <motion.div key={`face-${mood ?? "none"}`} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }} className="relative z-20 mt-8 grid size-28 place-items-center rounded-full border border-white/20 text-5xl shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_20px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:size-32" style={{ backgroundColor: mood ? `${selected.color}cc` : "rgba(255,255,255,0.08)" }}>
                <span role="img" aria-label={mood ? selected.name : "Neutral"}>{mood ? selected.emoji : "😐"}</span>
              </motion.div>

              <div className="relative mt-2 flex h-44 w-full max-w-md items-end justify-center sm:h-48">
                {MOODS.map((item, index) => {
                  const isSelected = mood === item.value;
                  const angle = (index - (MOODS.length - 1) / 2) * 17;
                  const height = 140 - Math.abs(index - 2) * 16;
                  return (
                    <motion.button
                      type="button"
                      key={item.value}
                      onClick={() => setMoodChoice(item.value)}
                      aria-pressed={isSelected}
                      aria-label={item.name}
                      className="absolute bottom-0 left-1/2 origin-bottom outline-none"
                      style={{ width: 96, height, zIndex: isSelected ? 10 : index }}
                      animate={{ rotate: angle, x: "-50%", y: isSelected ? -14 : 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      whileHover={{ y: -8 }}
                    >
                      <span
                        className={`block h-full w-full border transition-all ${isSelected ? "border-white/50 shadow-[0_0_0_1px_rgba(255,255,255,0.25),0_18px_35px_rgba(0,0,0,0.35)] backdrop-blur-md" : "border-white/10"}`}
                        style={{
                          backgroundColor: isSelected ? `${item.color}e6` : `${item.color}55`,
                          clipPath: "polygon(50% 100%, 4% 22%, 22% 0%, 78% 0%, 96% 22%)",
                        }}
                      />
                      <motion.span animate={{ rotate: -angle }} className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 text-2xl leading-none" role="img" aria-hidden="true">
                        {item.emoji}
                      </motion.span>
                    </motion.button>
                  );
                })}
                <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 translate-y-full border-x-[10px] border-t-[16px] border-x-transparent border-t-[#f3f1e8]" />
              </div>

              <div className="mt-10 flex w-full max-w-md flex-col items-center gap-4 sm:flex-row sm:justify-between"><p className="text-xs text-white/35">There is no better or worse answer. Noticing is enough.</p><button type="button" disabled={!mood} onClick={() => setStep("context")} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c9d8b5] px-5 py-2.5 text-sm font-semibold text-[#18212b] transition hover:bg-[#d9e8c6] disabled:cursor-not-allowed disabled:opacity-35">Continue <ArrowRight className="size-4" /></button></div>
            </motion.div>}

            {step === "context" && <motion.div key="context" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}><div className="mb-8 flex items-center gap-3"><span className="size-3 rounded-full" style={{ backgroundColor: selected.color }} /><p className="text-sm text-white/55">You feel <span className="font-semibold text-white">{selected.name.toLowerCase()}</span> today.</p></div><h2 className="max-w-lg font-display text-3xl leading-tight sm:text-5xl">What is part of the picture?</h2><div className="mt-8 flex flex-wrap gap-3">{FACTORS.map((factor) => <button type="button" key={factor} onClick={() => setFactors((current) => current.includes(factor) ? current.filter((item) => item !== factor) : [...current, factor])} className={`rounded-full border px-5 py-3 text-sm transition-colors ${factors.includes(factor) ? "border-[#c9d8b5] bg-[#c9d8b5] text-[#18212b]" : "border-white/15 text-white/65 hover:border-white/40"}`}>{factors.includes(factor) && <Check className="mr-2 inline size-4" />}{factor}</button>)}</div><button type="button" onClick={() => setStep("reflection")} className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#c9d8b5] px-6 py-3 text-sm font-semibold text-[#18212b]">Continue <ArrowRight className="size-4" /></button></motion.div>}

            {step === "reflection" && <motion.div key="reflection" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}><div className="mb-8 flex items-center gap-3"><PenLine className="size-5 text-[#c9d8b5]" /><p className="text-sm text-white/55">Optional, but useful for your future self.</p></div><h2 className="max-w-lg font-display text-3xl leading-tight sm:text-5xl">Give the feeling a little context.</h2><textarea autoFocus value={note} onChange={(event) => setNote(event.target.value)} maxLength={280} rows={5} placeholder="What is on your mind?" className="mt-8 w-full resize-none rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-base leading-7 text-white outline-none placeholder:text-white/25 focus:border-[#c9d8b5]" /><div className="mt-2 flex items-center justify-between text-xs text-white/30"><span>Your words stay in your journal.</span><span>{note.length}/280</span></div><button type="button" onClick={finish} className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#c9d8b5] px-6 py-3 text-sm font-semibold text-[#18212b]">See my thought <Sparkles className="size-4" /></button></motion.div>}

            {step === "ready" && <motion.div key="ready" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}><Sparkles className="mb-8 size-8 text-[#c9d8b5]" /><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9d8b5]/70">Your thought for today</p><h2 className="max-w-xl font-display text-3xl leading-tight sm:text-5xl">{insight}</h2><p className="mt-8 text-sm leading-6 text-white/45">We will carry this gently into your dashboard.</p><button type="button" onClick={onComplete} className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-sm text-white hover:border-[#c9d8b5]">Open dashboard <ArrowRight className="size-4" /></button></motion.div>}
          </AnimatePresence>
          {step !== "ready" && <div className="mt-auto pt-12 text-xs text-white/25">{step === "mood" ? "01 / 03" : step === "context" ? "02 / 03" : "03 / 03"}</div>}
        </section>
      </div>
    </motion.main>
  );
}
