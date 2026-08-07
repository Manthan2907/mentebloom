/**
 * /app/analytics — Mental Health Analytics Dashboard
 * 30-day mood trends, stress history, habit heatmap, emotion breakdown
 */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, BarChart3, Calendar, Target, Brain } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { AppFooter } from "@/components/AppFooter";
import { useStore } from "@/lib/store";
import type { Mood } from "@/lib/store";

type Range = "week" | "month" | "30days";

const MOOD_VALUES: Record<Mood, number> = { great: 5, good: 4, okay: 3, low: 2, sad: 1 };
const MOOD_COLORS: Record<Mood, string> = {
  great: "#c8f54e", good: "#84cc16", okay: "#eab308", low: "#f97316", sad: "#ef4444",
};
const EMOTION_COLORS = ["#c8f54e", "#38bdf8", "#a78bfa", "#f97316", "#fb7185", "#34d399"];

const fade = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }),
};

export default function Analytics() {
  const { moodHistory, habits, academicTasks, subjects } = useStore();
  const [range, setRange] = useState<Range>("month");

  const days = range === "week" ? 7 : range === "month" ? 30 : 30;

  const moodData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (days - 1 - i));
      const dateStr = d.toISOString().split("T")[0];
      const entry = moodHistory.find((e) => e.date === dateStr);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return { date: dateStr, label, score: entry ? MOOD_VALUES[entry.mood] : null };
    });
  }, [moodHistory, days]);

  const avgMood = useMemo(() => {
    const valid = moodData.filter((d) => d.score !== null) as { score: number }[];
    if (!valid.length) return 0;
    return +(valid.reduce((a, b) => a + b.score, 0) / valid.length).toFixed(1);
  }, [moodData]);

  const moodTrend = useMemo(() => {
    const valid = moodData.filter((d) => d.score !== null) as { score: number }[];
    if (valid.length < 2) return 0;
    return valid[valid.length - 1].score - valid[0].score;
  }, [moodData]);

  // Habit heatmap – last 30 days
  const heatmapData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (29 - i));
      const dateStr = d.toISOString().split("T")[0];
      const total = habits.length;
      if (total === 0) return { date: dateStr, pct: 0 };
      const done = habits.filter((h) => h.history?.[dateStr]).length;
      return { date: dateStr, pct: Math.round((done / total) * 100), done, total };
    });
  }, [habits]);

  // Emotion breakdown from moodHistory factors
  const emotionData = useMemo(() => {
    const counts: Record<string, number> = {};
    moodHistory.slice(-days).forEach((e) => {
      e.factors.forEach((f) => { counts[f] = (counts[f] || 0) + 1; });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));
  }, [moodHistory, days]);

  // Stress trend – derive from academicTasks due dates over last 30 days
  const stressData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (days - 1 - i));
      const dateStr = d.toISOString().split("T")[0];
      // proxy: count tasks due within 3 days of this point
      const pending = academicTasks.filter((t) => {
        const diff = (new Date(t.dueDate).getTime() - d.getTime()) / 86400000;
        return diff >= 0 && diff <= 3 && !t.completed;
      }).length;
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return { date: dateStr, label, stress: Math.min(100, pending * 25) };
    });
  }, [academicTasks, days]);

  // Best streak
  const bestStreak = useMemo(() => {
    let best = 0, cur = 0;
    heatmapData.forEach((d) => {
      if (d.pct > 0) { cur++; best = Math.max(best, cur); } else cur = 0;
    });
    return best;
  }, [heatmapData]);

  const highestStressDay = useMemo(() => {
    const max = Math.max(...stressData.map((d) => d.stress));
    const day = stressData.find((d) => d.stress === max);
    if (!max) return "N/A";
    return day?.label ?? "N/A";
  }, [stressData]);

  const moodLabel = avgMood >= 4 ? "Great" : avgMood >= 3 ? "Good" : avgMood >= 2 ? "Okay" : "Low";

  const trendIcon =
    moodTrend > 0.3 ? <TrendingUp className="w-3 h-3 text-[#c8f54e]" /> :
    moodTrend < -0.3 ? <TrendingDown className="w-3 h-3 text-[#ef4444]" /> :
    <Minus className="w-3 h-3 text-[#1a1a1a]/40" />;

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <TopNav />

      <main className="container max-w-[1280px] mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          variants={fade} custom={0} initial="hidden" animate="visible"
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1a1a1a]">Your Wellness Journey</h1>
            <p className="text-sm text-[#1a1a1a]/50 font-mono mt-0.5">Emotional patterns & habit insights</p>
          </div>
          <div className="flex gap-1.5 bg-white border border-[#e8e4df] rounded-lg p-1">
            {(["week", "month", "30days"] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`text-xs font-mono px-3 py-1.5 rounded-md transition-all ${
                  range === r ? "bg-[#c8f54e] text-[#1a1a1a] font-semibold" : "text-[#1a1a1a]/50 hover:text-[#1a1a1a]"
                }`}
              >
                {r === "week" ? "This Week" : r === "month" ? "This Month" : "Last 30 Days"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Key Metric Cards */}
        <motion.div variants={fade} custom={1} initial="hidden" animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          {[
            {
              label: "Avg Mood This Month",
              value: `${avgMood} / 5`,
              sub: moodLabel,
              icon: <Brain className="w-4 h-4 text-[#c8f54e]" />,
              accent: "#c8f54e",
              extra: trendIcon,
            },
            {
              label: "Highest Stress Day",
              value: highestStressDay,
              sub: "Based on pending tasks",
              icon: <TrendingUp className="w-4 h-4 text-[#f97316]" />,
              accent: "#f97316",
            },
            {
              label: "Best Habit Streak",
              value: `${bestStreak} days`,
              sub: "Consecutive active days",
              icon: <Target className="w-4 h-4 text-[#38bdf8]" />,
              accent: "#38bdf8",
            },
          ].map((card, i) => (
            <motion.div key={i} variants={fade} custom={i + 2} initial="hidden" animate="visible"
              className="bg-white border border-[#e8e4df] rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                {card.icon}
                {card.extra}
              </div>
              <p className="font-display text-2xl font-bold text-[#1a1a1a]">{card.value}</p>
              <p className="text-xs font-mono text-[#1a1a1a]/40 mt-1">{card.label}</p>
              <p className="text-xs text-[#1a1a1a]/35 mt-0.5">{card.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts — 2 column on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Mood Trend */}
          <motion.div variants={fade} custom={5} initial="hidden" animate="visible"
            className="bg-white border border-[#e8e4df] rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#c8f54e]" />
              <h3 className="font-display font-bold text-[#1a1a1a]">Mood Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece7" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 9, fill: "#1a1a1a", opacity: 0.35, fontFamily: "JetBrains Mono" }}
                  tickLine={false} axisLine={false}
                  interval={Math.floor(moodData.length / 5)}
                />
                <YAxis domain={[0, 5]} tick={{ fontSize: 9, fill: "#1a1a1a", opacity: 0.35 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 8, fontSize: 11 }}
                  formatter={(v: number) => [v ? v.toFixed(1) : "—", "Mood"]}
                />
                <Line
                  type="monotone" dataKey="score" stroke="#c8f54e" strokeWidth={2.5}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    if (!payload.score) return <g key={props.key} />;
                    return <circle key={props.key} cx={cx} cy={cy} r={3} fill="#c8f54e" stroke="#faf8f5" strokeWidth={1.5} />;
                  }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Stress Score History */}
          <motion.div variants={fade} custom={6} initial="hidden" animate="visible"
            className="bg-white border border-[#e8e4df] rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-[#f97316]" />
              <h3 className="font-display font-bold text-[#1a1a1a]">Academic Stress Level</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stressData}>
                <defs>
                  <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece7" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 9, fill: "#1a1a1a", opacity: 0.35, fontFamily: "JetBrains Mono" }}
                  tickLine={false} axisLine={false}
                  interval={Math.floor(stressData.length / 5)}
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#1a1a1a", opacity: 0.35 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 8, fontSize: 11 }}
                  formatter={(v: number) => [`${v}`, "Stress"]}
                />
                <Area type="monotone" dataKey="stress" stroke="#f97316" strokeWidth={2} fill="url(#stressGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Habit Heatmap + Emotion Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Habit Heatmap */}
          <motion.div variants={fade} custom={7} initial="hidden" animate="visible"
            className="bg-white border border-[#e8e4df] rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-[#c8f54e]" />
              <h3 className="font-display font-bold text-[#1a1a1a]">Habit Completion Heatmap</h3>
              <span className="text-[10px] font-mono text-[#1a1a1a]/35 ml-auto">Last 30 days</span>
            </div>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(10, 1fr)" }}>
              {heatmapData.map((d, i) => (
                <div
                  key={i}
                  title={`${d.date}: ${d.pct ?? 0}% (${(d as any).done ?? 0}/${(d as any).total ?? 0} habits)`}
                  className="aspect-square rounded-sm cursor-default transition-all hover:scale-110"
                  style={{
                    backgroundColor: d.pct === 0
                      ? "#f0ece7"
                      : `rgba(200,245,78,${0.15 + (d.pct / 100) * 0.85})`,
                  }}
                />
              ))}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[10px] font-mono text-[#1a1a1a]/35">Less</span>
              {[0, 25, 50, 75, 100].map((v) => (
                <div
                  key={v}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: v === 0 ? "#f0ece7" : `rgba(200,245,78,${0.15 + (v / 100) * 0.85})` }}
                />
              ))}
              <span className="text-[10px] font-mono text-[#1a1a1a]/35">More</span>
            </div>
          </motion.div>

          {/* Emotion Breakdown */}
          <motion.div variants={fade} custom={8} initial="hidden" animate="visible"
            className="bg-white border border-[#e8e4df] rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-[#a78bfa]" />
              <h3 className="font-display font-bold text-[#1a1a1a]">Emotion Breakdown</h3>
            </div>
            {emotionData.length > 0 ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={emotionData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value" paddingAngle={3}>
                      {emotionData.map((_, i) => (
                        <Cell key={i} fill={EMOTION_COLORS[i % EMOTION_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: 8, fontSize: 11 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 flex-1">
                  {emotionData.map((e, i) => (
                    <div key={e.name} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: EMOTION_COLORS[i % EMOTION_COLORS.length] }}
                      />
                      <span className="text-xs text-[#1a1a1a]/70 font-sans flex-1">{e.name}</span>
                      <span className="text-xs font-mono text-[#1a1a1a]/40">{e.value}x</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#1a1a1a]/30 italic font-sans mt-4">
                Keep logging moods to see your emotion breakdown.
              </p>
            )}
          </motion.div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
