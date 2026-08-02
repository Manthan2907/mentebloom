/**
 * HabitsTable — Main habit tracking table with weekly grid
 * Editorial Theme: Light white card, dark text, lime green accents
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useStore, DAY_SHORT } from "@/lib/store";
import type { Habit } from "@/lib/store";

export function HabitsTable() {
  const { habits, toggleHabitDay, addHabit, removeHabit } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDetail, setNewDetail] = useState("");

  const handleAdd = () => {
    if (newName.trim()) {
      addHabit(newName.trim(), newDetail.trim());
      setNewName("");
      setNewDetail("");
      setShowAdd(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#e8e4df] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-4xl font-bold text-[#1a1a1a]">
              Habits<span className="text-[#c8f54e]">.</span>
              <span className="text-lg text-[#c8f54e] font-mono align-super ml-1">w17</span>
            </h2>
            <p className="text-sm text-[#1a1a1a]/45 mt-2 max-w-md font-sans">
              Your daily practice for this week. Tap a day to mark it done — small, repeated kept things, that's the whole point.
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
              onClick={() => {}}
              className="flex items-center gap-1 text-xs font-mono text-[#1a1a1a]/40 hover:text-[#1a1a1a] border border-[#e0dcd7] hover:border-[#1a1a1a]/20 px-3 py-1.5 rounded-sm transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev
            </button>
            <span className="text-xs font-mono text-[#1a1a1a]/50 px-3">
              {getWeekDateRange()}
            </span>
            <button
              onClick={() => {}}
              className="flex items-center gap-1 text-xs font-mono text-[#1a1a1a]/40 hover:text-[#1a1a1a] border border-[#e0dcd7] hover:border-[#1a1a1a]/20 px-3 py-1.5 rounded-sm transition-all"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-[10px] font-mono tracking-wider text-[#1a1a1a] bg-[#c8f54e] px-3 py-1.5 rounded-sm uppercase font-semibold">
              Week
            </button>
            <button className="text-[10px] font-mono tracking-wider text-[#1a1a1a]/35 hover:text-[#1a1a1a]/55 px-3 py-1.5 rounded-sm uppercase transition-colors">
              Month
            </button>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="w-8 h-8 flex items-center justify-center bg-[#c8f54e] text-[#1a1a1a] rounded-sm hover:bg-[#d4f76a] transition-colors"
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
          {DAY_SHORT.map((d) => (
            <div key={d} className="w-8 text-center text-[10px] font-mono text-[#1a1a1a]/30">
              {d}
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
            onToggle={(dayIndex) => toggleHabitDay(habit.id, dayIndex)}
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
  onToggle,
  onRemove,
}: {
  habit: Habit;
  index: number;
  onToggle: (dayIndex: number) => void;
  onRemove: () => void;
}) {
  const completionRatio = habit.monthlyCount;

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
        <span className="text-sm font-medium text-[#1a1a1a]">
          {habit.name}
          {habit.detail && (
            <span className="text-[#1a1a1a]/40 ml-1 font-sans">· {habit.detail}</span>
          )}
        </span>
      </div>

      {/* Monthly Badge */}
      <span className="text-[11px] font-mono text-[#1a1a1a]/35 bg-[#f0ece7] px-2 py-0.5 rounded-sm mr-4">
        {habit.monthlyCount}/MO
      </span>

      {/* Week Grid */}
      <div className="flex gap-1 mr-4">
        {habit.weekCompletions.map((done, dayIdx) => (
          <button
            key={dayIdx}
            onClick={() => onToggle(dayIdx)}
            className={`w-8 h-8 rounded-sm flex items-center justify-center transition-all duration-200 ${
              done
                ? "bg-[#c8f54e] text-[#1a1a1a]"
                : "bg-[#f5f3ef] text-[#1a1a1a]/15 hover:bg-[#ede9e4]"
            }`}
          >
            {done && (
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
          </button>
        ))}
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

function getWeekDateRange(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const format = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${format(monday)} — ${format(sunday)} · ${now.getFullYear()}`;
}
