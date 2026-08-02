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
  weekCompletions: boolean[]; // 7 days
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

export interface AppState {
  // Habits
  habits: Habit[];
  toggleHabitDay: (habitId: string, dayIndex: number) => void;
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

function getWeekCompletions(index: number): boolean[] {
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
  return patterns[index] || patterns.map(() => false);
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
        { id: 'h1', name: 'Wake by 6 AM', detail: '', color: '#8b5cf6', monthlyTarget: 30, monthlyCount: 25, weekCompletions: getWeekCompletions(0) },
        { id: 'h2', name: 'Walk', detail: '20 minutes', color: '#d97706', monthlyTarget: 30, monthlyCount: 22, weekCompletions: getWeekCompletions(1) },
        { id: 'h3', name: 'Read', detail: '20 pages', color: '#be185d', monthlyTarget: 30, monthlyCount: 20, weekCompletions: getWeekCompletions(2) },
        { id: 'h4', name: 'Stretch', detail: '10 min', color: '#059669', monthlyTarget: 30, monthlyCount: 18, weekCompletions: getWeekCompletions(3) },
        { id: 'h5', name: 'Drink water', detail: '2L', color: '#0891b2', monthlyTarget: 30, monthlyCount: 28, weekCompletions: getWeekCompletions(4) },
        { id: 'h6', name: 'Journal', detail: 'one page', color: '#ca8a04', monthlyTarget: 30, monthlyCount: 20, weekCompletions: getWeekCompletions(5) },
        { id: 'h7', name: 'Meditate', detail: '10 min', color: '#2563eb', monthlyTarget: 30, monthlyCount: 25, weekCompletions: getWeekCompletions(6) },
        { id: 'h8', name: 'No phone after 9 PM', detail: '', color: '#dc2626', monthlyTarget: 30, monthlyCount: 22, weekCompletions: getWeekCompletions(7) },
      ],
      toggleHabitDay: (habitId, dayIndex) => set((state) => ({
        habits: state.habits.map((h) => {
          if (h.id !== habitId) return h;
          const newCompletions = [...h.weekCompletions];
          newCompletions[dayIndex] = !newCompletions[dayIndex];
          const completedDays = newCompletions.filter(Boolean).length;
          return { ...h, weekCompletions: newCompletions, monthlyCount: Math.min(h.monthlyTarget, h.monthlyCount + (newCompletions[dayIndex] ? 1 : -1)) };
        }),
        currentStreak: dayIndex === 6 ? state.currentStreak + 1 : state.currentStreak,
      })),
      addHabit: (name, detail) => set((state) => ({
        habits: [...state.habits, {
          id: generateId(),
          name,
          detail,
          color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
          monthlyTarget: 30,
          monthlyCount: 0,
          weekCompletions: [false, false, false, false, false, false, false],
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
        const newToday = state.hydration.today + amount;
        const newWeek = [...state.hydration.week];
        newWeek[6] = newToday;
        return { hydration: { today: newToday, week: newWeek } };
      }),
      resetWater: () => set((state) => {
        const newWeek = [...state.hydration.week];
        newWeek[6] = 0;
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
      name: 'myhabits-wellness-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const DAY_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function getWeeklyPulse(habits: Habit[]): number[] {
  return DAY_LABELS.map((_, dayIdx) => {
    const total = habits.length;
    if (total === 0) return 0;
    const completed = habits.filter((h) => h.weekCompletions[dayIdx]).length;
    return Math.round((completed / total) * 100);
  });
}

export function getTodayIndex(): number {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1; // Convert to 0-indexed Monday start
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
  const todayIdx = getTodayIndex();
  const completedToday = state.habits.filter((h) => h.weekCompletions[todayIdx]).length;
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
