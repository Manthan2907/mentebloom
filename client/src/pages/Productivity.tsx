/**
 * /app/productivity — Focus & Flow Sessions (Pomodoro)
 * SVG circle timer, task panel, session history, weekly stats
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, Zap, Volume2, VolumeX, Clock, Flame } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { AppFooter } from "@/components/AppFooter";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

type Phase = "Work" | "Short Break" | "Long Break";
type Duration = 5 | 25 | 45;

interface PhaseConfig {
  label: Phase;
  borderColor: string;
  bgGlow: string;
  textColor: string;
}

const PHASES: PhaseConfig[] = [
  { label: "Work", borderColor: "#c8f54e", bgGlow: "#c8f54e20", textColor: "#1a1a1a" },
  { label: "Short Break", borderColor: "#eab308", bgGlow: "#eab30820", textColor: "#a16207" },
  { label: "Long Break", borderColor: "#a78bfa", bgGlow: "#a78bfa20", textColor: "#6d28d9" },
];

const DURATIONS: Duration[] = [5, 25, 45];

const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const fade = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06 } }),
};

export default function Productivity() {
  const { pomodoroSessions, addPomodoroSession, subjects } = useStore();

  const [duration, setDuration] = useState<Duration>(25);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sound, setSound] = useState(true);
  const [taskNote, setTaskNote] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phase = PHASES[phaseIdx];
  const totalSeconds = duration * 60;
  const progress = (totalSeconds - secondsLeft) / totalSeconds;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  const complete = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phase.label === "Work") {
      addPomodoroSession({
        date: new Date().toISOString().split("T")[0],
        completedAt: new Date().toISOString(),
        durationMinutes: duration,
        taskNote: taskNote || "Focus session",
        subjectId: selectedSubjectId || null,
      });
      toast.success(`Focus session complete! ${duration} minutes logged.`);
    }
  }, [phase, duration, taskNote, selectedSubjectId, addPomodoroSession]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) { complete(); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, complete]);

  const handleDurationChange = (d: Duration) => {
    setDuration(d);
    setSecondsLeft(d * 60);
    setRunning(false);
  };

  const handleSkip = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const next = (phaseIdx + 1) % PHASES.length;
    setPhaseIdx(next);
    setSecondsLeft(duration * 60);
  };

  // Stats
  const today = new Date().toISOString().split("T")[0];
  const todaySessions = pomodoroSessions.filter((s) => s.date === today);
  const todayMinutes = todaySessions.reduce((a, s) => a + s.durationMinutes, 0);

  const weekMinutes = pomodoroSessions.reduce((a, s) => a + s.durationMinutes, 0);
  const weekPomodoros = pomodoroSessions.length;
  const avgSessionLen = weekPomodoros > 0 ? Math.round(weekMinutes / weekPomodoros) : 0;

  // Most productive subject
  const subjectCounts: Record<string, number> = {};
  pomodoroSessions.forEach((s) => {
    if (s.subjectId) subjectCounts[s.subjectId] = (subjectCounts[s.subjectId] || 0) + s.durationMinutes;
  });
  const topSubjectId = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topSubject = subjects.find((s) => s.id === topSubjectId);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <TopNav />

      <main className="container max-w-[1280px] mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <motion.div variants={fade} custom={0} initial="hidden" animate="visible" className="mb-8">
          <h1 className="font-display text-2xl font-bold text-[#1a1a1a]">Focus & Flow Sessions</h1>
          <p className="text-sm text-[#1a1a1a]/50 font-mono mt-0.5">Deep work + mindful breaks</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mb-8">
          {/* Timer */}
          <motion.div variants={fade} custom={1} initial="hidden" animate="visible"
            className="bg-white border border-[#e8e4df] rounded-2xl p-8 shadow-sm flex flex-col items-center"
            style={{ backgroundColor: phase.bgGlow }}
          >
            {/* Phase selector */}
            <div className="flex gap-2 mb-6">
              {PHASES.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => { setPhaseIdx(i); setSecondsLeft(duration * 60); setRunning(false); }}
                  className={`text-[10px] font-mono px-3 py-1 rounded-full border transition-all ${
                    phaseIdx === i
                      ? "font-semibold"
                      : "border-[#e8e4df] text-[#1a1a1a]/40 hover:border-[#1a1a1a]/20"
                  }`}
                  style={phaseIdx === i ? { borderColor: p.borderColor, color: p.textColor, backgroundColor: `${p.borderColor}20` } : {}}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* SVG Timer */}
            <div className="relative" style={{ width: 264, height: 264 }}>
              <svg width="264" height="264" className="-rotate-90">
                <circle cx="132" cy="132" r={RADIUS} fill="none" stroke="#f0ece7" strokeWidth="8" />
                <motion.circle
                  cx="132" cy="132" r={RADIUS} fill="none"
                  stroke={phase.borderColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={strokeDashoffset}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-5xl font-bold text-[#1a1a1a] tabular-nums tracking-tight">
                  {mins}:{secs}
                </span>
                <span className="text-xs font-mono text-[#1a1a1a]/40 mt-1">{phase.label}</span>
              </div>
            </div>

            {/* Duration presets */}
            <div className="flex gap-2 my-5">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => handleDurationChange(d)}
                  className={`px-4 py-1.5 text-xs font-mono rounded-lg border transition-all ${
                    duration === d
                      ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                      : "border-[#e8e4df] text-[#1a1a1a]/50 hover:border-[#1a1a1a]/40"
                  }`}
                >
                  {d}min
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSound((s) => !s)}
                className="text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60 transition-colors"
                aria-label={sound ? "Mute" : "Unmute"}
              >
                {sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setRunning((r) => !r)}
                className="w-16 h-16 rounded-full flex items-center justify-center text-[#1a1a1a] shadow-md transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: phase.borderColor }}
                aria-label={running ? "Pause" : "Play"}
              >
                <AnimatePresence mode="wait">
                  {running ? (
                    <motion.span key="pause" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                      <Pause className="w-7 h-7" />
                    </motion.span>
                  ) : (
                    <motion.span key="play" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                      <Play className="w-7 h-7 ml-0.5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button
                onClick={handleSkip}
                className="text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60 transition-colors"
                aria-label="Skip phase"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Task Panel */}
          <motion.div variants={fade} custom={2} initial="hidden" animate="visible"
            className="bg-white border border-[#e8e4df] rounded-2xl p-6 shadow-sm flex flex-col gap-5"
          >
            <div>
              <h3 className="font-display font-bold text-[#1a1a1a] mb-3">Current Task</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono text-[#1a1a1a]/40 uppercase tracking-wider mb-1 block">Subject</label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full text-xs border border-[#e8e4df] rounded-lg px-3 py-2 bg-[#faf8f5] font-mono text-[#1a1a1a] focus:outline-none focus:border-[#c8f54e] appearance-none"
                  >
                    <option value="">No subject</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.code} — {s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[#1a1a1a]/40 uppercase tracking-wider mb-1 block">What are you focusing on?</label>
                  <textarea
                    value={taskNote}
                    onChange={(e) => setTaskNote(e.target.value)}
                    placeholder="e.g. Chapter 3 review, Problem set 4…"
                    rows={3}
                    className="w-full text-xs border border-[#e8e4df] rounded-lg px-3 py-2 bg-[#faf8f5] font-sans text-[#1a1a1a] resize-none focus:outline-none focus:border-[#c8f54e] placeholder:text-[#1a1a1a]/20"
                  />
                </div>
              </div>
            </div>

            {/* Today's sessions */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[10px] font-mono text-[#1a1a1a]/40 uppercase tracking-wider">Today</h4>
                <span className="text-xs font-mono text-[#c8f54e] font-semibold">{todayMinutes}min focused</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {todaySessions.length === 0 && (
                  <p className="text-xs text-[#1a1a1a]/25 italic font-sans">No sessions yet today.</p>
                )}
                {todaySessions.map((s) => {
                  const sub = subjects.find((sub) => sub.id === s.subjectId);
                  return (
                    <div key={s.id} className="flex items-start gap-2 border border-[#f0ece7] rounded-lg px-3 py-2">
                      <Clock className="w-3 h-3 text-[#c8f54e] mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-sans text-[#1a1a1a]/70 truncate">{s.taskNote}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-mono text-[#1a1a1a]/35">{s.durationMinutes}min</span>
                          {sub && (
                            <span
                              className="text-[8px] font-mono px-1.5 py-0.5 rounded-full"
                              style={{ backgroundColor: `${sub.color}20`, color: sub.color }}
                            >
                              {sub.code}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Weekly Stats */}
        <motion.div variants={fade} custom={3} initial="hidden" animate="visible">
          <h3 className="font-display font-bold text-[#1a1a1a] mb-3">Weekly Productivity</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Focus Time", value: `${weekMinutes}min`, icon: <Zap className="w-4 h-4 text-[#c8f54e]" /> },
              { label: "Pomodoros Done", value: String(weekPomodoros), icon: <Flame className="w-4 h-4 text-[#f97316]" /> },
              { label: "Avg Session Length", value: `${avgSessionLen}min`, icon: <Clock className="w-4 h-4 text-[#38bdf8]" /> },
              {
                label: "Most Focused Subject",
                value: topSubject ? topSubject.code : "—",
                icon: (
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: topSubject?.color ?? "#e8e4df" }}
                  />
                ),
              },
            ].map((card, i) => (
              <div key={i} className="bg-white border border-[#e8e4df] rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">{card.icon}</div>
                <p className="font-display text-xl font-bold text-[#1a1a1a]">{card.value}</p>
                <p className="text-[10px] font-mono text-[#1a1a1a]/40 mt-1 uppercase tracking-wider">{card.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
      <AppFooter />
    </div>
  );
}
