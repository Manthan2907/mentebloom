import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ─── Types ───────────────────────────────────────────────────────────────────

export type Mood = 'great' | 'good' | 'okay' | 'low' | 'sad';
export type DayOfWeek = 'M' | 'T' | 'W' | 'T' | 'F' | 'S' | 'S';

export interface Habit {
  id: string;
  name: string;
  detail: string;
  color: string;
  monthlyTarget: number;
  monthlyCount: number;
  monthlyCount: number;
  history: Record<string, boolean>;
}

export interface MoodEntry {
  date: string; // YYYY-MM-DD
  mood: Mood;
  factors: string[];
}

export interface HydrationData {
  today: number; // ml
  week: number[]; // 7 days in ml
}

export interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  content: string;
}

export interface Intention {
  id: string;
  text: string;
  completed: boolean;
}

export type TaskDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
}

export interface AcademicTask {
  id: string;
  subjectId: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  difficulty: TaskDifficulty;
  estimatedHours: number;
  completed: boolean;
}

export interface StressLevelInfo {
  score: number;
  label: 'Relaxed' | 'Manageable' | 'Busy' | 'Overloaded' | 'Critical';
  color: string;
  textColor: string;
  description: string;
}

export interface AppState {
  // Habits
  habits: Habit[];
  toggleHabitDate: (habitId: string, dateStr: string) => void;
  addHabit: (name: string, detail: string) => void;
  removeHabit: (habitId: string) => void;

  // Mood
  todayMood: Mood | null;
  moodFactors: string[];
  moodHistory: MoodEntry[];
  setMood: (mood: Mood, factors: string[]) => void;

  // Hydration
  hydration: HydrationData;
  addWater: (amount: number) => void;
  resetWater: () => void;

  // Journal
  journalEntries: JournalEntry[];
  saveJournalEntry: (prompt: string, content: string) => void;

  // Intentions
  intentions: Intention[];
  addIntention: (text: string) => void;
  toggleIntention: (id: string) => void;
  removeIntention: (id: string) => void;

  // Academic Stress & Workload
  subjects: Subject[];
  academicTasks: AcademicTask[];
  addSubject: (name: string, code: string, color: string) => void;
  addAcademicTask: (task: Omit<AcademicTask, 'id' | 'completed'>) => void;
  toggleAcademicTask: (id: string) => void;
  removeAcademicTask: (id: string) => void;

  // Streak
  currentStreak: number;
  weeklyStreak: number;

  // Goal Progress
  goalProgress: number;
  goalTarget: number;

  // Quote
  currentQuote: { text: string; author: string };
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export function getDatesForCurrentWeek(): string[] {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export function getDatesForLastWeek(): string[] {
  const dates = getDatesForCurrentWeek();
  return dates.map(d => {
    const date = new Date(d);
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });
}

function getWeekHistory(index: number): Record<string, boolean> {
  const patterns: boolean[][] = [
    [true, true, true, true, true, true, true],   // Wake by 6 AM
    [true, true, false, true, true, false, true],  // Walk
    [false, false, true, false, true, false, false], // Read
    [false, false, false, false, false, false, false], // Stretch
    [false, true, false, true, false, false, false], // Drink water
    [false, false, false, false, false, false, false], // Journal
    [true, false, false, true, true, false, true],  // Meditate
    [true, true, false, true, true, false, false],  // No phone
  ];
  const pattern = patterns[index] || patterns.map(() => false);
  const dates = getDatesForCurrentWeek();
  const lastWeekDates = getDatesForLastWeek();
  const history: Record<string, boolean> = {};
  
  dates.forEach((dateStr, i) => {
    history[dateStr] = pattern[i];
  });
  
  // Last week mock data (slightly varied)
  lastWeekDates.forEach((dateStr, i) => {
    history[dateStr] = i % 2 === 0 ? pattern[i] : !pattern[i];
  });
  
  return history;
}

function getMonthlyCounts(): number[] {
  return [25, 22, 20, 18, 28, 20, 25, 22];
}

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "Small deeds done are better than great deeds planned.", author: "Peter Marshall" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "We are what we repeatedly do. Excellence is not an act, but a habit.", author: "Aristotle" },
  { text: "Your body hears everything your mind says. Stay positive.", author: "Unknown" },
  { text: "Rest when you're weary. Refresh and renew yourself.", author: "Oprah Winfrey" },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Habits
      habits: [
        { id: 'h1', name: 'Wake by 6 AM', detail: '', color: '#8b5cf6', monthlyTarget: 30, monthlyCount: 25, history: getWeekHistory(0) },
        { id: 'h2', name: 'Walk', detail: '20 minutes', color: '#d97706', monthlyTarget: 30, monthlyCount: 22, history: getWeekHistory(1) },
        { id: 'h3', name: 'Read', detail: '20 pages', color: '#be185d', monthlyTarget: 30, monthlyCount: 20, history: getWeekHistory(2) },
        { id: 'h4', name: 'Stretch', detail: '10 min', color: '#059669', monthlyTarget: 30, monthlyCount: 18, history: getWeekHistory(3) },
        { id: 'h5', name: 'Drink water', detail: '2L', color: '#0891b2', monthlyTarget: 30, monthlyCount: 28, history: getWeekHistory(4) },
        { id: 'h6', name: 'Journal', detail: 'one page', color: '#ca8a04', monthlyTarget: 30, monthlyCount: 20, history: getWeekHistory(5) },
        { id: 'h7', name: 'Meditate', detail: '10 min', color: '#2563eb', monthlyTarget: 30, monthlyCount: 25, history: getWeekHistory(6) },
        { id: 'h8', name: 'No phone after 9 PM', detail: '', color: '#dc2626', monthlyTarget: 30, monthlyCount: 22, history: getWeekHistory(7) },
      ],
      toggleHabitDate: (habitId, dateStr) => set((state) => {
        const todayStr = getTodayString();
        const completedTodayBefore = state.habits.some((h) => h.history && h.history[todayStr]);

        const newHabits = state.habits.map((h) => {
          if (h.id !== habitId) return h;
          const newValue = !(h.history && h.history[dateStr]);
          const newHistory = { ...(h.history || {}), [dateStr]: newValue };
          return { ...h, history: newHistory, monthlyCount: Math.min(h.monthlyTarget, Math.max(0, h.monthlyCount + (newValue ? 1 : -1))) };
        });

        const completedTodayAfter = newHabits.some((h) => h.history && h.history[todayStr]);

        let streakDelta = 0;
        if (dateStr === todayStr) {
          if (!completedTodayBefore && completedTodayAfter) streakDelta = 1;
          else if (completedTodayBefore && !completedTodayAfter) streakDelta = -1;
        }

        return {
          habits: newHabits,
          currentStreak: Math.max(0, state.currentStreak + streakDelta),
        };
      }),
      addHabit: (name, detail) => set((state) => ({
        habits: [...state.habits, {
          id: generateId(),
          name,
          detail,
          color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
          monthlyTarget: 30,
          monthlyCount: 0,
          history: {},
        }],
      })),
      removeHabit: (habitId) => set((state) => ({
        habits: state.habits.filter((h) => h.id !== habitId),
      })),

      // Mood
      todayMood: null,
      moodFactors: [],
      moodHistory: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const moods: Mood[] = ['great', 'good', 'okay', 'low', 'sad'];
        const weights = [0.15, 0.35, 0.3, 0.15, 0.05];
        const r = Math.random();
        let cum = 0;
        let mood = 'okay';
        for (let j = 0; j < weights.length; j++) {
          cum += weights[j];
          if (r < cum) { mood = moods[j]; break; }
        }
        const factors: string[] = [];
        const allFactors = ['Work', 'Study', 'Family', 'Sleep', 'Health'];
        allFactors.forEach((f) => { if (Math.random() > 0.5) factors.push(f); });
        return { date: date.toISOString().split('T')[0], mood: mood as Mood, factors };
      }),
      setMood: (mood, factors) => set((state) => {
        const today = getTodayString();
        const existing = state.moodHistory.findIndex((e) => e.date === today);
        const entry: MoodEntry = { date: today, mood, factors };
        let newHistory = [...state.moodHistory];
        if (existing >= 0) {
          newHistory[existing] = entry;
        } else {
          newHistory.push(entry);
        }
        return { todayMood: mood, moodFactors: factors, moodHistory: newHistory };
      }),

      // Hydration
      hydration: { today: 1250, week: [1800, 2100, 1500, 2500, 1900, 2200, 1250] },
      addWater: (amount) => set((state) => {
        const todayIdx = getTodayIndex();
        const newToday = state.hydration.today + amount;
        const newWeek = [...state.hydration.week];
        newWeek[todayIdx] = newToday;
        return { hydration: { today: newToday, week: newWeek } };
      }),
      resetWater: () => set((state) => {
        const todayIdx = getTodayIndex();
        const newWeek = [...state.hydration.week];
        newWeek[todayIdx] = 0;
        return { hydration: { today: 0, week: newWeek } };
      }),

      // Journal
      journalEntries: [
        { id: 'j1', date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], prompt: 'What made you smile today?', content: 'I noticed the morning light coming through the window. It felt like a gentle reminder to slow down.' },
        { id: 'j2', date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0], prompt: 'Describe a moment of peace.', content: 'Sitting quietly with my coffee before the house woke up. No phone, no noise. Just presence.' },
        { id: 'j3', date: new Date(Date.now() - 86400000 * 8).toISOString().split('T')[0], prompt: 'What are you grateful for?', content: 'Good health, supportive friends, and the ability to keep growing.' },
      ],
      saveJournalEntry: (prompt, content) => set((state) => ({
        journalEntries: [{ id: generateId(), date: getTodayString(), prompt, content }, ...state.journalEntries],
      })),

      // Intentions
      intentions: [
        { id: 'i1', text: 'Walk every morning this month', completed: true },
      ],
      addIntention: (text) => set((state) => ({
        intentions: [...state.intentions, { id: generateId(), text, completed: false }],
      })),
      toggleIntention: (id: string) => set((state) => ({
        intentions: state.intentions.map((i: Intention) => i.id === id ? { ...i, completed: !i.completed } : i),
      })),
      removeIntention: (id: string) => set((state: AppState) => ({
        intentions: state.intentions.filter((i: Intention) => i.id !== id),
      })),

      // Academic Stress & Workload
      subjects: [
        { id: 's1', name: 'Data Structures & Algorithms', code: 'CS101', color: '#3b82f6' },
        { id: 's2', name: 'Linear Algebra', code: 'MATH201', color: '#8b5cf6' },
        { id: 's3', name: 'Quantum Mechanics', code: 'PHYS102', color: '#ec4899' },
        { id: 's4', name: 'Cognitive Psychology', code: 'PSYCH110', color: '#10b981' },
      ],
      academicTasks: [
        {
          id: 'at1',
          subjectId: 's1',
          title: 'Algorithms Assignment 3 — Binary Trees',
          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          difficulty: 'hard',
          estimatedHours: 6,
          completed: false,
        },
        {
          id: 'at2',
          subjectId: 's2',
          title: 'Linear Algebra Midterm Prep Set',
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          difficulty: 'extreme',
          estimatedHours: 8,
          completed: false,
        },
        {
          id: 'at3',
          subjectId: 's3',
          title: 'Quantum Lab Report #4',
          dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
          difficulty: 'medium',
          estimatedHours: 4,
          completed: false,
        },
        {
          id: 'at4',
          subjectId: 's4',
          title: 'Cognitive Essay Outline',
          dueDate: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
          difficulty: 'easy',
          estimatedHours: 2,
          completed: false,
        },
        {
          id: 'at5',
          subjectId: 's1',
          title: 'CS101 Code Review & Refactoring',
          dueDate: new Date(Date.now() + 86400000 * 8).toISOString().split('T')[0],
          difficulty: 'medium',
          estimatedHours: 3,
          completed: true,
        },
      ],
      addSubject: (name, code, color) => set((state) => ({
        subjects: [...state.subjects, { id: generateId(), name, code, color }],
      })),
      addAcademicTask: (task) => set((state) => ({
        academicTasks: [{ ...task, id: generateId(), completed: false }, ...state.academicTasks],
      })),
      toggleAcademicTask: (id) => set((state) => ({
        academicTasks: state.academicTasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t),
      })),
      removeAcademicTask: (id) => set((state) => ({
        academicTasks: state.academicTasks.filter((t) => t.id !== id),
      })),

      // Streak
      currentStreak: 27,
      weeklyStreak: 2,

      // Goal Progress
      goalProgress: 53,
      goalTarget: 100,

      // Quote
      currentQuote: QUOTES[new Date().getDay() % QUOTES.length],
    }),
    {
      name: 'mentebloom-v3-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const DAY_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function getWeeklyPulse(habits: Habit[]): number[] {
  const dates = getDatesForCurrentWeek();
  const todayStr = getTodayString();
  return dates.map((dateStr) => {
    if (dateStr > todayStr) return 0;
    const total = habits.length;
    if (total === 0) return 0;
    const completed = habits.filter((h) => h.history && h.history[dateStr]).length;
    return Math.round((completed / total) * 100);
  });
}

export function getTodayIndex(): number {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1; // Convert to 0-indexed Monday start
}

export function getLastWeekPulse(habits: Habit[]): number[] {
  const dates = getDatesForLastWeek();
  return dates.map((dateStr) => {
    const total = habits.length;
    if (total === 0) return 0;
    const completed = habits.filter((h) => h.history && h.history[dateStr]).length;
    return Math.round((completed / total) * 100);
  });
}

export function calculateWellnessScore(state: AppState): number {
  let score = 0;
  // Mood: 25 points
  if (state.todayMood === 'great') score += 25;
  else if (state.todayMood === 'good') score += 20;
  else if (state.todayMood === 'okay') score += 12;
  else if (state.todayMood === 'low') score += 6;
  else if (state.todayMood === 'sad') score += 3;

  // Habits: 25 points (based on today's completion)
  const todayStr = getTodayString();
  const completedToday = state.habits.filter((h) => h.history && h.history[todayStr]).length;
  if (state.habits.length > 0) {
    score += Math.round((completedToday / state.habits.length) * 25);
  }

  // Water: 25 points (goal 2000ml)
  const waterPct = Math.min(state.hydration.today / 2000, 1);
  score += Math.round(waterPct * 25);

  // Journal: 25 points
  const today = getTodayString();
  const hasJournal = state.journalEntries.some((e) => e.date === today);
  if (hasJournal) score += 25;

  return Math.min(100, score);
}

export function calculateAcademicStressScore(
  tasks: AcademicTask[],
  subjects: Subject[]
): StressLevelInfo {
  const pendingTasks = tasks.filter((t) => !t.completed);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let rawWorkloadScore = 0;

  pendingTasks.forEach((task) => {
    const diffWeights: Record<TaskDifficulty, number> = {
      easy: 1.0,
      medium: 1.35,
      hard: 1.75,
      extreme: 2.3,
    };
    const diffMultiplier = diffWeights[task.difficulty] || 1.0;

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let urgencyMultiplier = 1.0;
    if (daysLeft <= 0) urgencyMultiplier = 2.5;
    else if (daysLeft <= 1) urgencyMultiplier = 2.1;
    else if (daysLeft <= 3) urgencyMultiplier = 1.6;
    else if (daysLeft <= 7) urgencyMultiplier = 1.25;
    else urgencyMultiplier = 0.9;

    rawWorkloadScore += task.estimatedHours * diffMultiplier * urgencyMultiplier;
  });

  const MAX_BASELINE = 45;
  const score = Math.min(100, Math.max(0, Math.round((rawWorkloadScore / MAX_BASELINE) * 100)));

  if (score <= 20) {
    return {
      score,
      label: 'Relaxed',
      color: '#22c55e',
      textColor: '#15803d',
      description: 'Your workload is easily manageable. Great time for deep learning or rest.',
    };
  } else if (score <= 40) {
    return {
      score,
      label: 'Manageable',
      color: '#84cc16',
      textColor: '#4d7c0f',
      description: 'Healthy academic pacing. Stay on top of your upcoming assignments.',
    };
  } else if (score <= 60) {
    return {
      score,
      label: 'Busy',
      color: '#eab308',
      textColor: '#a16207',
      description: 'Moderate academic strain. Prioritize high-difficulty tasks coming up soon.',
    };
  } else if (score <= 80) {
    return {
      score,
      label: 'Overloaded',
      color: '#f97316',
      textColor: '#c2410c',
      description: 'High workload density! Break tasks down into smaller study sessions to avoid burnout.',
    };
  } else {
    return {
      score,
      label: 'Critical',
      color: '#ef4444',
      textColor: '#b91c1c',
      description: 'Critical academic stress! Reach out to professors or peers to re-prioritize.',
    };
  }
}

export function getSubjectStressBreakdown(tasks: AcademicTask[], subjects: Subject[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const subjectWorkloads: Record<string, { pendingHours: number; rawStress: number; taskCount: number }> = {};
  
  subjects.forEach(s => {
    subjectWorkloads[s.id] = { pendingHours: 0, rawStress: 0, taskCount: 0 };
  });

  let totalRawStress = 0;

  tasks.filter(t => !t.completed).forEach(task => {
    const diffWeights: Record<TaskDifficulty, number> = {
      easy: 1.0,
      medium: 1.35,
      hard: 1.75,
      extreme: 2.3,
    };
    const diffMultiplier = diffWeights[task.difficulty] || 1.0;

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let urgencyMultiplier = 1.0;
    if (daysLeft <= 0) urgencyMultiplier = 2.5;
    else if (daysLeft <= 1) urgencyMultiplier = 2.1;
    else if (daysLeft <= 3) urgencyMultiplier = 1.6;
    else if (daysLeft <= 7) urgencyMultiplier = 1.25;
    else urgencyMultiplier = 0.9;

    const taskStress = task.estimatedHours * diffMultiplier * urgencyMultiplier;
    totalRawStress += taskStress;

    if (!subjectWorkloads[task.subjectId]) {
      subjectWorkloads[task.subjectId] = { pendingHours: 0, rawStress: 0, taskCount: 0 };
    }
    subjectWorkloads[task.subjectId].pendingHours += task.estimatedHours;
    subjectWorkloads[task.subjectId].rawStress += taskStress;
    subjectWorkloads[task.subjectId].taskCount += 1;
  });

  return subjects.map(sub => {
    const data = subjectWorkloads[sub.id] || { pendingHours: 0, rawStress: 0, taskCount: 0 };
    const stressPct = totalRawStress > 0 ? Math.round((data.rawStress / totalRawStress) * 100) : 0;
    return {
      subject: sub,
      pendingHours: data.pendingHours,
      rawStress: data.rawStress,
      taskCount: data.taskCount,
      stressPercentage: stressPct,
    };
  }).sort((a, b) => b.stressPercentage - a.stressPercentage);
}

export function getJournalPrompts(): string[] {
  const prompts = [
    'What made you feel alive today?',
    'Describe a moment of peace.',
    'What are you grateful for?',
    'What would you do differently tomorrow?',
    'Who brought you joy today?',
    'What does your body need right now?',
    'Write about something that surprised you.',
    'What is one small win from today?',
  ];
  return prompts;
}
