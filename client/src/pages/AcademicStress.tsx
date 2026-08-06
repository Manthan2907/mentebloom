import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { AppFooter } from "@/components/AppFooter";
import {
  useStore,
  calculateAcademicStressScore,
  getSubjectStressBreakdown,
  TaskDifficulty,
} from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Clock,
  BookOpen,
  Calendar,
  Sparkles,
  BarChart2,
  X,
} from "lucide-react";

export default function AcademicStress() {
  const {
    subjects,
    academicTasks,
    addAcademicTask,
    toggleAcademicTask,
    removeAcademicTask,
    addSubject,
  } = useStore();

  const [activeSubjectFilter, setActiveSubjectFilter] = useState<string>("all");
  const [activeStatusFilter, setActiveStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState<boolean>(false);

  // New subject form state
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectCode, setNewSubjectCode] = useState("");
  const [newSubjectColor, setNewSubjectColor] = useState("#3b82f6");

  // New task form state
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0]
  );
  const [difficulty, setDifficulty] = useState<TaskDifficulty>("medium");
  const [estimatedHours, setEstimatedHours] = useState<number>(3);

  // Calculated metrics
  const stressInfo = calculateAcademicStressScore(academicTasks, subjects);
  const subjectBreakdown = getSubjectStressBreakdown(academicTasks, subjects);
  const pendingTasks = academicTasks.filter((t) => !t.completed);
  const completedTasks = academicTasks.filter((t) => t.completed);
  const totalHours = pendingTasks.reduce((acc, t) => acc + t.estimatedHours, 0);

  // Highest strain subject
  const topSubject = subjectBreakdown[0];

  // Urgent tasks (due within 3 days)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const urgentCount = pendingTasks.filter((t) => {
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff <= 3;
  }).length;

  // Filtered tasks
  const filteredTasks = academicTasks.filter((task) => {
    if (activeSubjectFilter !== "all" && task.subjectId !== activeSubjectFilter)
      return false;
    if (activeStatusFilter === "pending" && task.completed) return false;
    if (activeStatusFilter === "completed" && !task.completed) return false;
    return true;
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId) return;

    addAcademicTask({
      title: title.trim(),
      subjectId,
      dueDate,
      difficulty,
      estimatedHours: Number(estimatedHours) || 1,
    });

    setTitle("");
    setShowAddModal(false);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim() || !newSubjectCode.trim()) return;

    addSubject(newSubjectName.trim(), newSubjectCode.trim().toUpperCase(), newSubjectColor);
    setNewSubjectName("");
    setNewSubjectCode("");
    setShowAddSubjectModal(false);
  };

  // SVG Circular Gauge Math
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (stressInfo.score / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a]">
      <TopNav />

      <main className="container max-w-[1280px] mx-auto px-4 lg:px-8 py-8">
        {/* Header Hero */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e8e4df]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono tracking-widest uppercase bg-[#c8f54e] text-[#1a1a1a] px-2 py-0.5 rounded-sm font-bold">
                ACADEMIC INTELLIGENCE
              </span>
              <span className="text-xs font-mono text-[#1a1a1a]/40">
                REAL-TIME WORKLOAD ALGORITHM
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#1a1a1a] tracking-tight">
              Academic Stress Score
            </h1>
            <p className="text-sm text-[#1a1a1a]/60 mt-1 max-w-2xl font-sans">
              Dynamic workload assessment calculated from pending assignment difficulty, deadline proximity, and required study hours.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddSubjectModal(true)}
              className="flex items-center gap-1.5 bg-[#f5f3ef] hover:bg-[#e8e4df] text-[#1a1a1a] px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#1a1a1a]" />
              ADD SUBJECT
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#333] text-white px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#c8f54e]" />
              ADD ACADEMIC TASK
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          {/* Left Column: Metrics & Analytics */}
          <div className="space-y-6">
            {/* Main Circular Stress Score Card */}
            <div className="bg-white rounded-2xl border border-[#e8e4df] p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#1a1a1a]" />
                  <h2 className="font-display text-lg font-bold text-[#1a1a1a]">
                    Overall Workload Density
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-[#1a1a1a]/40 uppercase tracking-wider">
                  AUTOMATIC EVALUATION
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-8 py-4">
                {/* Circular Progress Gauge */}
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-44 h-44 -rotate-90 transform">
                    {/* Background Ring */}
                    <circle
                      cx="88"
                      cy="88"
                      r={radius}
                      stroke="#f0ece7"
                      strokeWidth="12"
                      fill="transparent"
                    />
                    {/* Progress Ring */}
                    <motion.circle
                      cx="88"
                      cy="88"
                      r={radius}
                      stroke={stressInfo.color}
                      strokeWidth="12"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: strokeOffset }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  {/* Gauge Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-display text-4xl font-black text-[#1a1a1a]">
                      {stressInfo.score}%
                    </span>
                    <span
                      className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1"
                      style={{
                        backgroundColor: `${stressInfo.color}20`,
                        color: stressInfo.textColor,
                      }}
                    >
                      {stressInfo.label}
                    </span>
                  </div>
                </div>

                {/* Level Details & Breakdown */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold text-[#1a1a1a]/40 uppercase">
                        STRESS CATEGORY:
                      </span>
                      <span
                        className="text-xs font-mono font-bold"
                        style={{ color: stressInfo.textColor }}
                      >
                        {stressInfo.label.toUpperCase()} (
                        {stressInfo.score <= 20
                          ? "0–20%"
                          : stressInfo.score <= 40
                          ? "21–40%"
                          : stressInfo.score <= 60
                          ? "41–60%"
                          : stressInfo.score <= 80
                          ? "61–80%"
                          : "81–100%"}
                        )
                      </span>
                    </div>
                    <p className="text-sm font-sans text-[#1a1a1a]/70 leading-relaxed">
                      {stressInfo.description}
                    </p>
                  </div>

                  {/* 5-Level Scale Bar Indicator */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[10px] font-mono text-[#1a1a1a]/40">
                      <span>STRESS SCALE</span>
                      <span>5 LEVELS</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[
                        { label: "Relaxed", range: "0-20%", color: "#22c55e" },
                        { label: "Manageable", range: "21-40%", color: "#84cc16" },
                        { label: "Busy", range: "41-60%", color: "#eab308" },
                        { label: "Overloaded", range: "61-80%", color: "#f97316" },
                        { label: "Critical", range: "81-100%", color: "#ef4444" },
                      ].map((lvl, idx) => {
                        const isActive =
                          (idx === 0 && stressInfo.score <= 20) ||
                          (idx === 1 && stressInfo.score > 20 && stressInfo.score <= 40) ||
                          (idx === 2 && stressInfo.score > 40 && stressInfo.score <= 60) ||
                          (idx === 3 && stressInfo.score > 60 && stressInfo.score <= 80) ||
                          (idx === 4 && stressInfo.score > 80);
                        return (
                          <div
                            key={lvl.label}
                            className={`h-2 rounded-full transition-all ${
                              isActive ? "ring-2 ring-offset-1 ring-[#1a1a1a]" : "opacity-35"
                            }`}
                            style={{ backgroundColor: lvl.color }}
                            title={`${lvl.label} (${lvl.range})`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Metric Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#e8e4df]">
                <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#e8e4df]/60">
                  <div className="flex items-center gap-1.5 text-xs text-[#1a1a1a]/50 font-mono mb-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    PENDING TASKS
                  </div>
                  <span className="text-xl font-display font-bold text-[#1a1a1a]">
                    {pendingTasks.length}
                  </span>
                </div>

                <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#e8e4df]/60">
                  <div className="flex items-center gap-1.5 text-xs text-[#1a1a1a]/50 font-mono mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    EST. STUDY HOURS
                  </div>
                  <span className="text-xl font-display font-bold text-[#1a1a1a]">
                    {totalHours}h
                  </span>
                </div>

                <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#e8e4df]/60">
                  <div className="flex items-center gap-1.5 text-xs text-[#1a1a1a]/50 font-mono mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    DUE SOON (&le;3d)
                  </div>
                  <span className="text-xl font-display font-bold text-[#1a1a1a]">
                    {urgentCount}
                  </span>
                </div>

                <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#e8e4df]/60">
                  <div className="flex items-center gap-1.5 text-xs text-[#1a1a1a]/50 font-mono mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    HIGHEST STRAIN
                  </div>
                  <span className="text-sm font-display font-bold text-[#1a1a1a] truncate block">
                    {topSubject ? topSubject.subject.code : "None"}
                  </span>
                </div>
              </div>
            </div>

            {/* Subject-Wise Stress Percentages & Progress Bars */}
            <div className="bg-white rounded-2xl border border-[#e8e4df] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#1a1a1a]">
                    Subject Stress Breakdown
                  </h3>
                  <p className="text-xs font-mono text-[#1a1a1a]/40 uppercase">
                    Which subjects contribute most to your academic strain
                  </p>
                </div>
                <BarChart2 className="w-5 h-5 text-[#1a1a1a]/30" />
              </div>

              <div className="space-y-5">
                {subjectBreakdown.map((item, idx) => {
                  const isTopStrain = idx === 0 && item.stressPercentage > 0;
                  return (
                    <div key={item.subject.id} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.subject.color }}
                          />
                          <span className="font-bold text-[#1a1a1a]">
                            {item.subject.code}
                          </span>
                          <span className="text-[#1a1a1a]/50 font-sans text-xs">
                            — {item.subject.name}
                          </span>
                          {isTopStrain && (
                            <span className="bg-[#ef4444]/10 text-[#ef4444] text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-1">
                              HIGHEST STRAIN
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[#1a1a1a]/40">
                            {item.pendingHours}h study · {item.taskCount} tasks
                          </span>
                          <span className="font-bold text-[#1a1a1a] w-10 text-right">
                            {item.stressPercentage}%
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-3 bg-[#f0ece7] rounded-full overflow-hidden p-0.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.stressPercentage}%` }}
                          transition={{ duration: 0.7, delay: idx * 0.1 }}
                          className="h-full rounded-full transition-all"
                          style={{
                            backgroundColor: item.subject.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Workload Distribution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Distribution by Difficulty */}
              <div className="bg-white rounded-2xl border border-[#e8e4df] p-5 shadow-sm">
                <h4 className="font-display text-sm font-bold text-[#1a1a1a] mb-3">
                  Workload by Difficulty
                </h4>
                <div className="space-y-2.5">
                  {[
                    { label: "Extreme (2.3x)", level: "extreme", color: "#ef4444" },
                    { label: "Hard (1.75x)", level: "hard", color: "#f97316" },
                    { label: "Medium (1.35x)", level: "medium", color: "#eab308" },
                    { label: "Easy (1.0x)", level: "easy", color: "#22c55e" },
                  ].map((d) => {
                    const count = pendingTasks.filter(
                      (t) => t.difficulty === d.level
                    ).length;
                    const hours = pendingTasks
                      .filter((t) => t.difficulty === d.level)
                      .reduce((acc, t) => acc + t.estimatedHours, 0);

                    return (
                      <div
                        key={d.level}
                        className="flex items-center justify-between text-xs font-mono p-2 rounded-lg bg-[#faf8f5] border border-[#e8e4df]/40"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: d.color }}
                          />
                          <span className="text-[#1a1a1a]/80 font-medium">
                            {d.label}
                          </span>
                        </div>
                        <span className="font-bold text-[#1a1a1a]">
                          {count} tasks ({hours}h)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="bg-[#1a1a1a] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#c8f54e] font-mono text-xs font-bold mb-2">
                    <Sparkles className="w-4 h-4" />
                    RECOMMENDED STRATEGY
                  </div>
                  <h4 className="font-display text-base font-bold mb-2">
                    {stressInfo.score > 60
                      ? "Deload High-Weight Assignments"
                      : "Maintain Study Momentum"}
                  </h4>
                  <p className="text-xs text-white/70 font-sans leading-relaxed">
                    {topSubject
                      ? `Focus your upcoming study block on ${topSubject.subject.name} (${topSubject.subject.code}) to clear ${topSubject.pendingHours} hours of heavy workload.`
                      : "Add your pending tasks to calculate exact subject priorities."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between text-[10px] font-mono text-white/40 uppercase">
                  <span>MENTEBLOOM ALGORITHM</span>
                  <span>UPDATED REAL-TIME</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Academic Task Manager */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#e8e4df] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#1a1a1a]">
                    Academic Tasks
                  </h3>
                  <p className="text-xs font-mono text-[#1a1a1a]/40 uppercase">
                    Toggle to update stress score
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="p-2 bg-[#c8f54e] text-[#1a1a1a] hover:bg-[#b5e43b] rounded-lg transition-colors cursor-pointer"
                  title="Add Task"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex gap-1 p-1 bg-[#f5f3ef] rounded-lg mb-4">
                {[
                  { id: "all", label: `All (${academicTasks.length})` },
                  { id: "pending", label: `Pending (${pendingTasks.length})` },
                  { id: "completed", label: `Done (${completedTasks.length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveStatusFilter(tab.id as any)}
                    className={`flex-1 text-[11px] font-mono py-1.5 rounded-md transition-colors cursor-pointer ${
                      activeStatusFilter === tab.id
                        ? "bg-white text-[#1a1a1a] font-bold shadow-xs"
                        : "text-[#1a1a1a]/50 hover:text-[#1a1a1a]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Subject Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-[#e8e4df]/60 scrollbar-none">
                <button
                  onClick={() => setActiveSubjectFilter("all")}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-md shrink-0 transition-colors cursor-pointer ${
                    activeSubjectFilter === "all"
                      ? "bg-[#1a1a1a] text-white font-bold"
                      : "bg-[#f5f3ef] text-[#1a1a1a]/60 hover:bg-[#e8e4df]"
                  }`}
                >
                  ALL SUBJECTS
                </button>
                {subjects.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSubjectFilter(s.id)}
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-md shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
                      activeSubjectFilter === s.id
                        ? "bg-[#1a1a1a] text-white font-bold"
                        : "bg-[#f5f3ef] text-[#1a1a1a]/60 hover:bg-[#e8e4df]"
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.code}
                  </button>
                ))}
              </div>

              {/* Task Items List */}
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-[#e8e4df] rounded-xl">
                    <p className="text-xs font-mono text-[#1a1a1a]/40">
                      NO TASKS FOUND FOR SELECTED FILTERS
                    </p>
                  </div>
                ) : (
                  filteredTasks.map((task) => {
                    const sub = subjects.find((s) => s.id === task.subjectId);
                    const diffColors: Record<TaskDifficulty, string> = {
                      easy: "#22c55e",
                      medium: "#eab308",
                      hard: "#f97316",
                      extreme: "#ef4444",
                    };

                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                          task.completed
                            ? "bg-[#faf8f5] border-[#e8e4df]/40 opacity-60"
                            : "bg-white border-[#e8e4df] hover:border-[#1a1a1a]/20 shadow-xs"
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <button
                            onClick={() => toggleAcademicTask(task.id)}
                            className="mt-0.5 text-[#1a1a1a]/30 hover:text-[#1a1a1a] transition-colors shrink-0 cursor-pointer"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>

                          <div className="space-y-1 min-w-0 flex-1">
                            <p
                              className={`text-xs font-sans font-semibold text-[#1a1a1a] truncate ${
                                task.completed ? "line-through text-[#1a1a1a]/40" : ""
                              }`}
                            >
                              {task.title}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                              {sub && (
                                <span
                                  className="px-1.5 py-0.5 rounded text-white font-bold"
                                  style={{ backgroundColor: sub.color }}
                                >
                                  {sub.code}
                                </span>
                              )}

                              <span
                                className="px-1.5 py-0.5 rounded font-bold uppercase"
                                style={{
                                  backgroundColor: `${diffColors[task.difficulty]}15`,
                                  color: diffColors[task.difficulty],
                                }}
                              >
                                {task.difficulty}
                              </span>

                              <span className="text-[#1a1a1a]/40 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {task.estimatedHours}h
                              </span>

                              <span className="text-[#1a1a1a]/40 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {task.dueDate}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => removeAcademicTask(task.id)}
                          className="text-[#1a1a1a]/20 hover:text-[#ef4444] transition-colors p-1 cursor-pointer"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Task Modal / Form */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#e8e4df] p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#e8e4df] pb-3">
                <h3 className="font-display text-lg font-bold text-[#1a1a1a]">
                  Add Academic Task
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-[#1a1a1a]/40 hover:text-[#1a1a1a] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block font-mono text-[10px] text-[#1a1a1a]/60 uppercase mb-1 font-bold">
                    Assignment / Task Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Midterm Problem Set 2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e8e4df] rounded-xl focus:outline-none focus:border-[#1a1a1a] bg-[#faf8f5]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] text-[#1a1a1a]/60 uppercase mb-1 font-bold">
                      Subject
                    </label>
                    <select
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e4df] rounded-xl focus:outline-none focus:border-[#1a1a1a] bg-[#faf8f5]"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.code} ({s.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-[#1a1a1a]/60 uppercase mb-1 font-bold">
                      Due Date
                    </label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e4df] rounded-xl focus:outline-none focus:border-[#1a1a1a] bg-[#faf8f5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] text-[#1a1a1a]/60 uppercase mb-1 font-bold">
                      Difficulty Rating
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as TaskDifficulty)}
                      className="w-full px-3 py-2 border border-[#e8e4df] rounded-xl focus:outline-none focus:border-[#1a1a1a] bg-[#faf8f5]"
                    >
                      <option value="easy">Easy (1.0x multiplier)</option>
                      <option value="medium">Medium (1.35x multiplier)</option>
                      <option value="hard">Hard (1.75x multiplier)</option>
                      <option value="extreme">Extreme (2.3x multiplier)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-[#1a1a1a]/60 uppercase mb-1 font-bold">
                      Estimated Study Hours
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-[#e8e4df] rounded-xl focus:outline-none focus:border-[#1a1a1a] bg-[#faf8f5]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-[#1a1a1a]/60 hover:text-[#1a1a1a] cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#c8f54e] text-[#1a1a1a] font-mono text-xs font-bold rounded-xl hover:bg-[#b5e43b] transition-colors cursor-pointer"
                  >
                    ADD TASK
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Subject Modal */}
      <AnimatePresence>
        {showAddSubjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#e8e4df] p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#e8e4df] pb-3">
                <h3 className="font-display text-lg font-bold text-[#1a1a1a]">
                  Add New Subject
                </h3>
                <button
                  onClick={() => setShowAddSubjectModal(false)}
                  className="text-[#1a1a1a]/40 hover:text-[#1a1a1a] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubject} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block font-mono text-[10px] text-[#1a1a1a]/60 uppercase mb-1 font-bold">
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BIO301 or ECON101"
                    value={newSubjectCode}
                    onChange={(e) => setNewSubjectCode(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e8e4df] rounded-xl focus:outline-none focus:border-[#1a1a1a] bg-[#faf8f5] uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#1a1a1a]/60 uppercase mb-1 font-bold">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Molecular Biology"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e8e4df] rounded-xl focus:outline-none focus:border-[#1a1a1a] bg-[#faf8f5]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#1a1a1a]/60 uppercase mb-1 font-bold">
                    Subject Theme Color
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {[
                      "#3b82f6",
                      "#8b5cf6",
                      "#ec4899",
                      "#10b981",
                      "#f59e0b",
                      "#6366f1",
                      "#14b8a6",
                      "#ef4444",
                    ].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewSubjectColor(c)}
                        className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                          newSubjectColor === c ? "scale-110 ring-2 ring-offset-2 ring-[#1a1a1a]" : "hover:scale-105 opacity-80"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSubjectModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-[#1a1a1a]/60 hover:text-[#1a1a1a] cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#c8f54e] text-[#1a1a1a] font-mono text-xs font-bold rounded-xl hover:bg-[#b5e43b] transition-colors cursor-pointer"
                  >
                    CREATE SUBJECT
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AppFooter />
    </div>
  );
}
