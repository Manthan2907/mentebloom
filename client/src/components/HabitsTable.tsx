/**
 * HabitsTable — Main habit tracking table with weekly and monthly grids
 * Editorial Theme: Light white card, dark text, lime green accents
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useStore, DAY_SHORT } from "@/lib/store";
import type { Habit } from "@/lib/store";

function getDatesForView(date: Date, mode: "week" | "month"): Date[] {
  const dates: Date[] = [];
  if (mode === "week") {
    const dayOfWeek = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d);
    }
  } else {
    // Month mode
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(year, month, i));
    }
  }
  return dates;
}

function formatDateRange(date: Date, mode: "week" | "month"): string {
  const format = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (mode === "week") {
    const dates = getDatesForView(date, "week");
    return `${format(dates[0])} — ${format(dates[6])} · ${date.getFullYear()}`;
  } else {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase();
  }
}

export function HabitsTable() {
  const { habits, toggleHabitDate, addHabit, removeHabit } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDetail, setNewDetail] = useState("");
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  const handleAdd = () => {
    if (newName.trim()) {
      addHabit(newName.trim(), newDetail.trim());
      setNewName("");
      setNewDetail("");
      setShowAdd(false);
    }
  };

  const handlePrev = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (viewMode === "week") next.setDate(next.getDate() - 7);
      else next.setMonth(next.getMonth() - 1);
      return next;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (viewMode === "week") next.setDate(next.getDate() + 7);
      else next.setMonth(next.getMonth() + 1);
      return next;
    });
  };

  const datesToRender = getDatesForView(currentDate, viewMode);

  return (
    <div className="bg-white rounded-xl border border-[#e8e4df] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-4xl font-bold text-[#1a1a1a]">
              Habits<span className="text-[#c8f54e]">.</span>
            </h2>
            <p className="text-sm text-[#1a1a1a]/45 mt-2 max-w-md font-sans">
              Your daily practice. Tap a day to mark it done — small, repeated kept things, that's the whole point.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider text-[#1a1a1a]/25 uppercase">30·DAY</span>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 text-xs font-mono text-[#1a1a1a]/40 hover:text-[#1a1a1a] border border-[#e0dcd7] hover:border-[#1a1a1a]/20 px-3 py-1.5 rounded-sm transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev
            </button>
            <span className="text-xs font-mono text-[#1a1a1a]/50 px-3">
              {formatDateRange(currentDate, viewMode)}
            </span>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 text-xs font-mono text-[#1a1a1a]/40 hover:text-[#1a1a1a] border border-[#e0dcd7] hover:border-[#1a1a1a]/20 px-3 py-1.5 rounded-sm transition-all"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewMode("week")}
              className={`text-[10px] font-mono tracking-wider px-3 py-1.5 rounded-sm uppercase ${viewMode === "week" ? "bg-[#c8f54e] text-[#1a1a1a] font-semibold" : "text-[#1a1a1a]/35 hover:text-[#1a1a1a]/55 transition-colors"}`}>
              Week
            </button>
            <button 
              onClick={() => setViewMode("month")}
              className={`text-[10px] font-mono tracking-wider px-3 py-1.5 rounded-sm uppercase ${viewMode === "month" ? "bg-[#c8f54e] text-[#1a1a1a] font-semibold" : "text-[#1a1a1a]/35 hover:text-[#1a1a1a]/55 transition-colors"}`}>
              Month
            </button>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="w-8 h-8 flex items-center justify-center bg-[#c8f54e] text-[#1a1a1a] rounded-sm hover:bg-[#d4f76a] transition-colors ml-1"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Habit Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-3 overflow-hidden"
          >
            <div className="flex gap-2 items-center bg-[#faf8f5] rounded-sm p-3 border border-[#e8e4df]">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Habit name..."
                className="flex-1 bg-transparent text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 border-none outline-none font-mono"
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <input
                type="text"
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                placeholder="Detail (optional)..."
                className="w-40 bg-transparent text-sm text-[#1a1a1a]/60 placeholder-[#1a1a1a]/20 border-none outline-none font-mono"
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <button
                onClick={handleAdd}
                className="text-xs font-mono bg-[#c8f54e] text-[#1a1a1a] px-3 py-1.5 rounded-sm hover:bg-[#d4f76a] transition-colors font-semibold"
              >
                Add
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Header */}
      <div className="px-6 py-2 border-t border-b border-[#e8e4df] flex items-center">
        <div className="flex-1 text-[10px] font-mono tracking-widest text-[#1a1a1a]/30 uppercase">
          Daily Habit
        </div>
        <div className="flex gap-1 mr-4">
          {datesToRender.map((d) => (
            <div key={d.toISOString()} className={`${viewMode === 'week' ? 'w-8' : 'w-[18px]'} text-center text-[10px] font-mono text-[#1a1a1a]/30`}>
              {viewMode === 'week' ? DAY_SHORT[d.getDay() === 0 ? 6 : d.getDay() - 1] : d.getDate()}
            </div>
          ))}
        </div>
        <div className="w-16 text-right text-[10px] font-mono text-[#1a1a1a]/30">
          30·DAY
        </div>
      </div>

      {/* Habits Rows */}
      <div className="divide-y divide-[#f0ece7]">
        {habits.map((habit, index) => (
          <HabitRow
            key={habit.id}
            habit={habit}
            index={index}
            dates={datesToRender}
            viewMode={viewMode}
            onToggle={(dateStr) => toggleHabitDate(habit.id, dateStr)}
            onRemove={() => removeHabit(habit.id)}
          />
        ))}
      </div>
    </div>
  );
}

function HabitRow({
  habit,
  index,
  dates,
  viewMode,
  onToggle,
  onRemove,
}: {
  habit: Habit;
  index: number;
  dates: Date[];
  viewMode: "week" | "month";
  onToggle: (dateStr: string) => void;
  onRemove: () => void;
}) {
  const completionRatio = habit.monthlyCount;
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="px-6 py-3 flex items-center group hover:bg-[#faf8f5] transition-colors"
    >
      {/* Number */}
      <span className="w-6 text-[11px] font-mono text-[#1a1a1a]/20">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Color Dot & Name */}
      <div className="flex-1 flex items-center gap-2.5">
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: habit.color }}
        />
        <span className="text-sm font-medium text-[#1a1a1a] truncate max-w-[200px]">
          {habit.name}
          {habit.detail && (
            <span className="text-[#1a1a1a]/40 ml-1 font-sans">· {habit.detail}</span>
          )}
        </span>
      </div>

      {/* Monthly Badge */}
      <span className="text-[11px] font-mono text-[#1a1a1a]/35 bg-[#f0ece7] px-2 py-0.5 rounded-sm mr-4 hidden md:inline-block">
        {habit.monthlyCount}/MO
      </span>

      {/* Grid */}
      <div className="flex gap-1 mr-4">
        {dates.map((d) => {
          const dateStr = d.toISOString().split("T")[0];
          const isFuture = dateStr > todayStr;
          const done = !isFuture && !!(habit.history && habit.history[dateStr]);
          return (
            <button
              key={dateStr}
              onClick={() => { if (!isFuture) onToggle(dateStr); }}
              disabled={isFuture}
              className={`${viewMode === "week" ? "w-8 h-8" : "w-[18px] h-6"} rounded-sm flex items-center justify-center transition-all duration-200 ${
                done
                  ? "bg-[#c8f54e] text-[#1a1a1a]"
                  : isFuture
                  ? "bg-[#f9f8f6] text-transparent cursor-not-allowed opacity-60"
                  : "bg-[#f5f3ef] text-[#1a1a1a]/15 hover:bg-[#ede9e4]"
              }`}
            >
              {done && viewMode === "week" && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M3 7L6 10L11 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              )}
              {done && viewMode === "month" && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Completion Ratio */}
      <div className="flex items-center gap-1.5 w-16 justify-end">
        <span className="text-xs font-mono text-[#1a1a1a]/35">
          {completionRatio}/{habit.monthlyTarget}
        </span>
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 text-[#1a1a1a]/20 hover:text-red-500 transition-all"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
