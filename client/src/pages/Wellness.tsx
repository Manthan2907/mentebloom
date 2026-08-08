/**
 * /app/wellness — Physical Wellness & Sleep Tracker
 * Sleep logging, exercise tracking, hydration, and correlation cards
 */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Moon, Activity, Droplet, Zap, Plus, Trash2,
} from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { AppFooter } from "@/components/AppFooter";
import LightRays from "@/components/ui/LightRays";
import FaultyTerminal from "@/components/ui/FaultyTerminal";
import Aurora from "@/components/ui/Aurora";
import { useStore, type ExerciseType, type ExerciseIntensity } from "@/lib/store";
import { toast } from "sonner";

const fade = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }),
};

const EXERCISE_TYPES: ExerciseType[] = ["Running", "Yoga", "Gym", "Sports", "Walk", "Cycling", "Swimming", "Other"];
const INTENSITIES: ExerciseIntensity[] = ["Low", "Medium", "High"];

function sleepColor(hours: number) {
  if (hours < 6) return "#ef4444";
  if (hours < 7) return "#eab308";
  if (hours <= 9) return "#c8f54e";
  return "#38bdf8";
}

function qualityLabel(q: number) {
  return ["", "Poor", "Fair", "Good", "Great", "Excellent"][q] ?? "";
}

export default function Wellness() {
  const {
    sleepEntries, addSleepEntry, removeSleepEntry,
    exerciseSessions, addExerciseSession, removeExerciseSession,
    hydration,
  } = useStore();

  // Sleep form
  const [sleepDate, setSleepDate] = useState(new Date().toISOString().split("T")[0]);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [sleepQuality, setSleepQuality] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [sleepNotes, setSleepNotes] = useState("");

  // Exercise form
  const [exType, setExType] = useState<ExerciseType>("Walk");
  const [exDuration, setExDuration] = useState(30);
  const [exIntensity, setExIntensity] = useState<ExerciseIntensity>("Medium");

  // Weekly sleep sparkline (last 7 entries)
  const last7Sleep = sleepEntries.slice(0, 7).reverse();

  // Exercise bar chart by type
  const exerciseByType = useMemo(() => {
    const acc: Record<string, number> = {};
    exerciseSessions.forEach((s) => {
      acc[s.type] = (acc[s.type] || 0) + s.durationMinutes;
    });
    return Object.entries(acc).map(([name, minutes]) => ({ name, minutes }));
  }, [exerciseSessions]);

  // Summary stats
  const avgSleep = useMemo(() => {
    const valid = last7Sleep.filter((e) => e.hours > 0);
    if (!valid.length) return 0;
    return +(valid.reduce((a, b) => a + b.hours, 0) / valid.length).toFixed(1);
  }, [last7Sleep]);

  const totalExercise = useMemo(() =>
    exerciseSessions.reduce((a, s) => a + s.durationMinutes, 0)
  , [exerciseSessions]);

  const hydrationGoal = 8;
  const hydrationGlasses = Math.round((hydration.today / 1000) * 4); // 250ml per glass
  const wellnessScore = Math.round(
    Math.min(100,
      (Math.min(avgSleep / 8, 1) * 33) +
      (Math.min(totalExercise / 150, 1) * 33) +
      (Math.min(hydrationGlasses / hydrationGoal, 1) * 34)
    )
  );

  const handleAddSleep = () => {
    if (sleepHours <= 0) { toast.error("Enter valid sleep hours."); return; }
    addSleepEntry({ date: sleepDate, hours: sleepHours, quality: sleepQuality, notes: sleepNotes });
    setSleepNotes("");
    toast.success("Sleep logged.");
  };

  const handleAddExercise = () => {
    if (exDuration <= 0) { toast.error("Enter valid duration."); return; }
    addExerciseSession({
      date: new Date().toISOString().split("T")[0],
      type: exType, durationMinutes: exDuration, intensity: exIntensity,
    });
    toast.success("Session logged.");
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <TopNav />

      <main className="container max-w-[1280px] mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <motion.div variants={fade} custom={0} initial="hidden" animate="visible" className="mb-8">
          <h1 className="font-display text-2xl font-bold text-[#1a1a1a]">Holistic Wellness Hub</h1>
          <p className="text-sm text-[#1a1a1a]/50 font-mono mt-0.5">Sleep, exercise, hydration & correlation</p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={fade} custom={1} initial="hidden" animate="visible"
          className="grid grid-cols-2 gap-4 mb-6"
        >
          {[
            { label: "Avg Sleep", value: `${avgSleep}h`, icon: <Moon className="w-4 h-4" />, color: "#a78bfa" },
            { label: "Total Exercise", value: `${totalExercise}min`, icon: <Activity className="w-4 h-4" />, color: "#c8f54e" },
          ].map((card, i) => (
            <motion.div key={i} variants={fade} custom={i + 2} initial="hidden" animate="visible"
              className="bg-[#111111] border-white/10 border rounded-xl p-4 shadow-sm relative overflow-hidden"
            >
              {card.label === "Total Exercise" && (
                <div className="absolute inset-0 z-0 opacity-60">
                  <Aurora colorStops={["#eaf2e9","#10e610","#ffffff"]} blend={0.8} speed={0.5} amplitude={1.2} />
                </div>
              )}
              {card.label === "Avg Sleep" && (
                <div className="absolute inset-0 z-0 opacity-60">
                  <Aurora colorStops={["#eaf2e9","#0c0d0c","#f0eef5"]} blend={0.5} speed={0.5} amplitude={1.0} />
                </div>
              )}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2" style={{ color: card.color }}>
                  {card.icon}
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">{card.label}</span>
                </div>
                <p className="font-display text-xl font-bold text-white">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sleep Tracker */}
          <motion.div variants={fade} custom={6} initial="hidden" animate="visible"
            className="bg-[#111111] border border-white/10 rounded-xl p-6 shadow-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 z-0 opacity-100">
              <LightRays
                raysColor="#d8b4fe"
                raysSpeed={2.5}
                rayLength={2.5}
                lightSpread={1.5}
                mouseInfluence={0.5}
                saturation={1.2}
              />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Moon className="w-4 h-4 text-[#a78bfa]" />
                <h3 className="font-display font-bold text-white">Sleep Tracker</h3>
              </div>

              {/* Sparkline */}
              <div className="flex items-end gap-1.5 h-12 mb-4">
                {last7Sleep.map((entry, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                    <div
                      className="w-full rounded-sm transition-all shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                      style={{
                        height: `${(entry.hours / 12) * 100}%`,
                        backgroundColor: sleepColor(entry.hours),
                        minHeight: 4,
                      }}
                    />
                    <span className="text-[9px] font-mono text-white/80 hidden group-hover:block absolute -top-4 bg-neutral-800 border border-white/10 px-1 rounded z-10 whitespace-nowrap">
                      {entry.hours}h
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 text-[10px] font-mono text-white/50 mb-4">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#ef4444]" /> {`<6h`}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#eab308]" /> 6–7h</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#c8f54e]" /> 7–9h</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#38bdf8]" /> 9+h</span>
              </div>

              {/* Form */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1 block">Date</label>
                    <input
                      type="date" value={sleepDate} onChange={(e) => setSleepDate(e.target.value)}
                      className="w-full text-xs border border-white/10 rounded-lg px-3 py-2 bg-white/5 text-white font-mono focus:outline-none focus:border-[#c8f54e]"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1 block">Hours</label>
                    <input
                      type="number" min={0} max={12} step={0.5} value={sleepHours}
                      onChange={(e) => setSleepHours(+e.target.value)}
                      className="w-full text-xs border border-white/10 rounded-lg px-3 py-2 bg-white/5 text-white font-mono focus:outline-none focus:border-[#c8f54e]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1 block">
                    Quality — {qualityLabel(sleepQuality)}
                  </label>
                  <div className="flex gap-2">
                    {([1, 2, 3, 4, 5] as const).map((q) => (
                      <button
                        key={q} onClick={() => setSleepQuality(q)}
                        className={`flex-1 py-1.5 text-xs font-mono rounded-md transition-all border backdrop-blur-sm ${
                          sleepQuality === q
                            ? "bg-[#c8f54e] border-[#c8f54e] text-[#1a1a1a] font-semibold shadow-[0_0_12px_rgba(200,245,78,0.3)]"
                            : "bg-white/5 border-white/10 text-white/50 hover:border-[#c8f54e]/50 hover:text-white"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  placeholder="Sleep notes (optional)…"
                  value={sleepNotes} onChange={(e) => setSleepNotes(e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-white/10 rounded-lg px-3 py-2 bg-white/5 text-white font-sans resize-none focus:outline-none focus:border-[#c8f54e] placeholder:text-white/30"
                />
                <button
                  onClick={handleAddSleep}
                  className="flex items-center gap-2 px-4 py-2 bg-[#c8f54e] text-[#1a1a1a] text-xs font-semibold font-mono rounded-lg hover:bg-[#b8e840] transition-colors shadow-[0_0_12px_rgba(200,245,78,0.2)]"
                >
                  <Plus className="w-3 h-3" /> Log Sleep
                </button>
              </div>

              {/* Recent entries */}
              <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-1">
                {sleepEntries.slice(0, 5).map((e) => (
                  <div key={e.id} className="flex items-center justify-between text-xs font-mono bg-white/5 p-2 rounded-md border border-white/5">
                    <span className="text-white/70">{e.date}</span>
                    <span style={{ color: sleepColor(e.hours) }} className="font-semibold">{e.hours}h</span>
                    <span className="text-white/60">{qualityLabel(e.quality)}</span>
                    <button onClick={() => removeSleepEntry(e.id)} className="text-white/30 hover:text-[#ef4444] transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={fade} custom={7} initial="hidden" animate="visible"
            className="bg-[#111111] border border-white/10 rounded-xl p-6 shadow-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 z-0 opacity-40">
              <FaultyTerminal
                scale={2}
                gridMul={[2.5, 1.5]}
                digitSize={1.5}
                tint="#c8f54e"
                brightness={0.8}
                mouseReact={true}
                mouseStrength={0.8}
                glitchAmount={1.5}
                flickerAmount={1.2}
              />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-[#c8f54e]" />
                <h3 className="font-display font-bold text-white">Exercise Logger</h3>
              </div>

              {/* Bar chart */}
              {exerciseByType.length > 0 && (
                <div className="mb-4 bg-white/5 rounded-lg p-2 border border-white/10 backdrop-blur-sm shadow-[0_0_8px_rgba(0,0,0,0.5)]">
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={exerciseByType} layout="vertical" barSize={10}>
                      <XAxis type="number" tick={{ fontSize: 9, fill: "#ffffff", opacity: 0.35 }} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "#ffffff", opacity: 0.7, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} width={58} />
                      <Tooltip
                        contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11, color: "white" }}
                        itemStyle={{ color: "#c8f54e" }}
                        formatter={(v: number) => [`${v} min`, "Total"]}
                      />
                      <Bar dataKey="minutes" fill="#c8f54e" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Form */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <div>
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1 block">Activity</label>
                  <div className="flex flex-wrap gap-1.5">
                    {EXERCISE_TYPES.map((t) => (
                      <button
                        key={t} onClick={() => setExType(t)}
                        className={`px-2.5 py-1 text-[10px] font-mono rounded-md border transition-all backdrop-blur-sm ${
                          exType === t
                            ? "bg-[#c8f54e] border-[#c8f54e] text-[#1a1a1a] font-semibold shadow-[0_0_12px_rgba(200,245,78,0.3)]"
                            : "bg-white/5 border-white/10 text-white/50 hover:border-[#c8f54e]/50 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1 block">Duration (min)</label>
                    <input
                      type="number" min={1} max={300} value={exDuration}
                      onChange={(e) => setExDuration(+e.target.value)}
                      className="w-full text-xs border border-white/10 rounded-lg px-3 py-2 bg-white/5 font-mono text-white focus:outline-none focus:border-[#c8f54e]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1 block">Intensity</label>
                    <div className="flex gap-1">
                      {INTENSITIES.map((i) => (
                        <button key={i} onClick={() => setExIntensity(i)}
                          className={`flex-1 py-2 text-[10px] font-mono rounded-md border transition-all backdrop-blur-sm ${
                            exIntensity === i
                              ? "bg-[#c8f54e] border-[#c8f54e] text-[#1a1a1a] font-semibold shadow-[0_0_12px_rgba(200,245,78,0.3)]"
                              : "bg-white/5 border-white/10 text-white/50 hover:border-[#c8f54e]/50 hover:text-white"
                          }`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleAddExercise}
                  className="flex items-center gap-2 px-4 py-2 bg-[#c8f54e] text-[#1a1a1a] text-xs font-semibold font-mono rounded-lg hover:bg-[#b8e840] transition-colors shadow-[0_0_12px_rgba(200,245,78,0.2)]"
                >
                  <Plus className="w-3 h-3" /> Log Session
                </button>
              </div>

              {/* Recent sessions */}
              <div className="mt-4 space-y-2 max-h-36 overflow-y-auto pr-1">
                {exerciseSessions.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-xs font-mono bg-white/5 p-2 rounded-md border border-white/5">
                    <span className="text-[#c8f54e] font-semibold">{s.type}</span>
                    <span className="text-white/80">{s.durationMinutes}min</span>
                    <span className="text-white/40">{s.intensity}</span>
                    <button onClick={() => removeExerciseSession(s.id)} className="text-white/30 hover:text-[#ef4444] transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Correlation Cards */}
        <motion.div variants={fade} custom={8} initial="hidden" animate="visible">
          <h3 className="font-display font-bold text-[#1a1a1a] mb-3">Wellness Correlations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Sleep Quality ↔ Mood",
                value: `${Math.round(Math.min(avgSleep / 8, 1) * 100)}% alignment`,
                description: avgSleep >= 7 ? "Good sleep is supporting your mood." : "More sleep may improve your daily mood.",
                color: "#a78bfa",
                icon: <Moon className="w-4 h-4" />,
              },
              {
                title: "Exercise ↔ Stress Reduction",
                value: totalExercise > 0 ? `${Math.min(totalExercise, 150)} / 150 min` : "No sessions yet",
                description: totalExercise >= 150 ? "You hit the weekly activity goal." : `${150 - totalExercise} min left to reach weekly goal.`,
                color: "#c8f54e",
                icon: <Activity className="w-4 h-4" />,
              },
            ].map((card, i) => (
              <div key={i} className="bg-[#111111] border-white/10 border rounded-xl p-5 shadow-sm relative overflow-hidden">
                {card.title === "Exercise ↔ Stress Reduction" && (
                  <div className="absolute inset-0 z-0 opacity-60">
                    <Aurora colorStops={["#eaf2e9","#10e610","#ffffff"]} blend={0.8} speed={0.5} amplitude={1.2} />
                  </div>
                )}
                {card.title === "Sleep Quality ↔ Mood" && (
                  <div className="absolute inset-0 z-0 opacity-60">
                    <Aurora colorStops={["#eaf2e9","#0c0d0c","#f0eef5"]} blend={0.5} speed={0.5} amplitude={1.0} />
                  </div>
                )}
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2" style={{ color: card.color }}>
                    {card.icon}
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">{card.title}</span>
                  </div>
                  <p className="font-display font-bold text-white">{card.value}</p>
                  <p className="text-xs font-sans mt-1 text-white/50">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
      <AppFooter />
    </div>
  );
}
