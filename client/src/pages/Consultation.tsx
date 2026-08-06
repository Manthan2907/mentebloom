import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { AppFooter } from "@/components/AppFooter";
import {
  useStore,
  calculateWellnessScore,
  calculateAcademicStressScore,
  getSubjectStressBreakdown,
} from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  HeartHandshake,
  FileText,
  Calendar,
  Clock,
  Video,
  MapPin,
  Star,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  User,
  Activity,
  Award,
} from "lucide-react";

interface Counselor {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  mode: "Online" | "Offline" | "Both";
  availability: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  location: string;
  imageColor: string;
}

const COUNSELORS: Counselor[] = [
  {
    id: "c1",
    name: "Dr. Aris Thorne, PsyD",
    title: "Licensed Clinical Psychologist",
    specializations: ["Academic Burnout", "Exam Anxiety", "Performance Stress"],
    mode: "Both",
    availability: "Available Today (2 slots)",
    rating: 4.95,
    reviewsCount: 142,
    experienceYears: 12,
    location: "Student Health Center (Room 302) & Virtual",
    imageColor: "#3b82f6",
  },
  {
    id: "c2",
    name: "Sarah Jenkins, LMFT",
    title: "Licensed Marriage & Family Therapist",
    specializations: ["Stress Management", "Anxiety", "Sleep Hygiene"],
    mode: "Online",
    availability: "Available Tomorrow (4 slots)",
    rating: 4.91,
    reviewsCount: 98,
    experienceYears: 8,
    location: "Telehealth / Video Call Only",
    imageColor: "#ec4899",
  },
  {
    id: "c3",
    name: "Michael Vance, LCSW",
    title: "Licensed Clinical Social Worker",
    specializations: ["Depression", "Identity & Transitions", "Mindfulness"],
    mode: "Offline",
    availability: "Next Available: Friday",
    rating: 4.88,
    reviewsCount: 112,
    experienceYears: 10,
    location: "Campus Counseling Annex B",
    imageColor: "#10b981",
  },
  {
    id: "c4",
    name: "Dr. Elena Rostova, PhD",
    title: "Cognitive Behavioral Specialist",
    specializations: ["Perfectionism", "Panic Attacks", "Exam Phobia"],
    mode: "Both",
    availability: "Available Today (1 slot)",
    rating: 4.98,
    reviewsCount: 210,
    experienceYears: 15,
    location: "Student Wellness Wing & Virtual",
    imageColor: "#8b5cf6",
  },
];

const FAQS = [
  {
    question: "When should I consult a counselor?",
    answer:
      "You should consider consulting a counselor whenever your thoughts, stress, emotions, or academic pressure begin interfering with your daily life, sleep, relationships, or ability to focus. You don't need to be in a crisis to seek support—counseling is equally effective for preventative care, building resilience, and learning time management.",
  },
  {
    question: "What is burnout?",
    answer:
      "Burnout is a state of chronic physical, mental, and emotional exhaustion caused by prolonged stress or overwork. Key symptoms include feelings of chronic fatigue, reduced academic efficacy, detachment, cynicism towards your studies, and a sense of helplessness despite working long hours.",
  },
  {
    question: "How do I know if I'm stressed or anxious?",
    answer:
      "Stress is typically a reaction to an external trigger (like an impending exam or assignment deadline) and tends to subside once the event passes. Anxiety is often an internal response characterized by persistent, excessive worry that doesn't disappear even when external pressure is absent, often accompanied by physical symptoms like muscle tension or racing heart.",
  },
  {
    question: "How can I manage exam stress?",
    answer:
      "Effective exam stress management involves breaking your study material into smaller, manageable chunks (like the Pomodoro technique), maintaining consistent sleep and hydration schedules, practicing gentle mindfulness exercises, and scheduling regular 10-minute mental breaks to let your brain consolidate information.",
  },
  {
    question: "What happens during a counseling session?",
    answer:
      "In a counseling session, you'll talk with a trained professional in a private, confidential, and judgment-free space. The first session usually focuses on discussing your current challenges, background, and goals. Together, you will explore evidence-based strategies (like Cognitive Behavioral tools) tailored to your needs.",
  },
  {
    question: "When should I seek professional help?",
    answer:
      "Seek professional help immediately if you experience persistent hopelessness, severe anxiety attacks, extreme sleep disturbances, loss of appetite lasting several days, or thoughts of self-harm. If you ever feel unsafe or overwhelmed, reach out to campus emergency services or national helplines right away.",
  },
];

export default function Consultation() {
  const store = useStore();
  const [activeSpecFilter, setActiveSpecFilter] = useState<string>("all");
  const [activeModeFilter, setActiveModeFilter] = useState<string>("all");
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [bookingTime, setBookingTime] = useState("10:00 AM");
  const [bookingMode, setBookingMode] = useState<"Online" | "Offline">("Online");
  const [attachReport, setAttachReport] = useState(true);

  // Live Compiled Metrics for Wellness Report
  const wellnessScore = calculateWellnessScore(store);
  const academicStress = calculateAcademicStressScore(
    store.academicTasks,
    store.subjects
  );
  const subjectBreakdown = getSubjectStressBreakdown(
    store.academicTasks,
    store.subjects
  );
  const topStrainSubject = subjectBreakdown[0];

  const avgMoodNum =
    store.moodHistory.length > 0
      ? (
          store.moodHistory.reduce((acc, m) => {
            const vals: Record<string, number> = {
              great: 5,
              good: 4,
              okay: 3,
              low: 2,
              sad: 1,
            };
            return acc + (vals[m.mood] || 3);
          }, 0) / store.moodHistory.length
        ).toFixed(1)
      : "N/A";

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCounselor) return;

    toast.success(
      `Consultation Booked with ${selectedCounselor.name} for ${bookingDate} at ${bookingTime}!`,
      {
        description: attachReport
          ? "Your compiled Wellness Report has been attached to the appointment."
          : "Appointment confirmation sent.",
      }
    );

    setShowBookingModal(false);
    setSelectedCounselor(null);
  };

  const handleCopyReport = () => {
    const reportSummaryText = `
=== MENTABLEOOM STUDENT WELLNESS REPORT ===
Generated: ${new Date().toLocaleDateString()}

- Overall Wellness Score: ${wellnessScore}/100
- Academic Stress Index: ${academicStress.score}% (${academicStress.label})
- Highest Strain Subject: ${
      topStrainSubject ? topStrainSubject.subject.name : "None"
    }
- Current Habit Streak: ${store.currentStreak} Days
- Hydration Today: ${store.hydration.today}ml
- 30-Day Avg Mood Rating: ${avgMoodNum}/5.0
- Journal Entries Saved: ${store.journalEntries.length}

Notes for Counselor: Generated via Mentebloom Student Self-Tracking System.
`.trim();

    navigator.clipboard.writeText(reportSummaryText);
    toast.success("Wellness Report Summary copied to clipboard!");
  };

  // Filter counselors
  const filteredCounselors = COUNSELORS.filter((c) => {
    if (
      activeSpecFilter !== "all" &&
      !c.specializations.some((s) =>
        s.toLowerCase().includes(activeSpecFilter.toLowerCase())
      )
    ) {
      return false;
    }
    if (activeModeFilter !== "all" && c.mode !== "Both" && c.mode !== activeModeFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a]">
      <TopNav />

      <main className="container max-w-[1280px] mx-auto px-4 lg:px-8 py-8">
        {/* Header Hero Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-[#e8e4df]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono tracking-widest uppercase bg-[#c8f54e] text-[#1a1a1a] px-2.5 py-0.5 rounded-sm font-bold flex items-center gap-1">
                <HeartHandshake className="w-3 h-3" />
                VERIFIED MENTAL HEALTH CARE
              </span>
              <span className="text-xs font-mono text-[#1a1a1a]/40">
                CONFIDENTIAL STUDENT SUPPORT
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#1a1a1a] tracking-tight">
              Student Consultation & Wellness
            </h1>
            <p className="text-sm text-[#1a1a1a]/60 mt-1 max-w-2xl font-sans">
              Browse licensed campus counselors, schedule online or offline sessions, and generate a confidential wellness report compiling your habits and mood data.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-2 bg-[#c8f54e] hover:bg-[#b5e43b] text-[#1a1a1a] px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#1a1a1a]" />
              GENERATE WELLNESS REPORT
            </button>
          </div>
        </div>

        {/* Top Banner Alert for Emergency Crisis */}
        <div className="bg-[#1a1a1a] text-white p-4 rounded-2xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ef4444]/20 rounded-lg text-[#ef4444] shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-mono font-bold text-[#c8f54e] uppercase">
                IN IMMEDIATE CRISIS?
              </p>
              <p className="text-xs text-white/70 font-sans">
                If you or a student need urgent safety support, call Campus Crisis Line: <strong>1-800-273-8255</strong> (24/7 Free & Confidential).
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-white/40 uppercase bg-white/10 px-2.5 py-1 rounded-md shrink-0">
            IMMEDIATE HELP
          </span>
        </div>

        {/* Main Section Grid */}
        <div className="space-y-12">
          {/* Section 1: Counselor Directory */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-[#1a1a1a]">
                  Verified Mental Health Professionals
                </h2>
                <p className="text-xs font-mono text-[#1a1a1a]/40 uppercase">
                  SELECT A COUNSELOR TO BOOK A CONFIDENTIAL SESSION
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Specialization Filter */}
                <div className="flex items-center gap-1 bg-[#f5f3ef] p-1 rounded-lg">
                  {[
                    { id: "all", label: "All Specializations" },
                    { id: "burnout", label: "Burnout" },
                    { id: "anxiety", label: "Anxiety" },
                    { id: "sleep", label: "Sleep & Stress" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setActiveSpecFilter(f.id)}
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        activeSpecFilter === f.id
                          ? "bg-white text-[#1a1a1a] font-bold shadow-xs"
                          : "text-[#1a1a1a]/50 hover:text-[#1a1a1a]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Mode Filter */}
                <div className="flex items-center gap-1 bg-[#f5f3ef] p-1 rounded-lg">
                  {[
                    { id: "all", label: "All Modes" },
                    { id: "Online", label: "Online Video" },
                    { id: "Offline", label: "In-Person" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveModeFilter(m.id)}
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        activeModeFilter === m.id
                          ? "bg-[#1a1a1a] text-white font-bold"
                          : "text-[#1a1a1a]/50 hover:text-[#1a1a1a]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Counselor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredCounselors.map((counselor) => (
                <motion.div
                  key={counselor.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-[#e8e4df] p-6 shadow-sm flex flex-col justify-between space-y-5 hover:border-[#1a1a1a]/20 transition-all"
                >
                  <div className="space-y-4">
                    {/* Counselor Header */}
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-display text-xl font-bold shrink-0 relative shadow-sm"
                        style={{ backgroundColor: counselor.imageColor }}
                      >
                        {counselor.name.split(" ")[1]?.[0] || "C"}
                        <span className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                          <CheckCircle2 className="w-4 h-4 text-[#22c55e] fill-[#22c55e]/20" />
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display font-bold text-base text-[#1a1a1a] truncate">
                            {counselor.name}
                          </h3>
                          <div className="flex items-center gap-1 bg-[#faf8f5] px-2 py-0.5 rounded-md border border-[#e8e4df]/60 text-xs font-mono">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="font-bold">{counselor.rating}</span>
                          </div>
                        </div>

                        <p className="text-xs font-mono text-[#1a1a1a]/50">
                          {counselor.title} · {counselor.experienceYears}+ yrs exp
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                              counselor.mode === "Online"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : counselor.mode === "Offline"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-purple-50 text-purple-700 border border-purple-200"
                            }`}
                          >
                            {counselor.mode === "Both"
                              ? "Online Video & In-Person"
                              : counselor.mode === "Online"
                              ? "Online Video Only"
                              : "In-Person Campus Clinic"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Specializations Tags */}
                    <div>
                      <span className="text-[10px] font-mono text-[#1a1a1a]/40 uppercase block mb-1.5 font-semibold">
                        SPECIALIZATIONS
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {counselor.specializations.map((spec) => (
                          <span
                            key={spec}
                            className="text-[11px] font-sans bg-[#f5f3ef] text-[#1a1a1a]/80 px-2.5 py-1 rounded-lg border border-[#e8e4df]/40"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Location & Availability info */}
                    <div className="space-y-1.5 text-xs font-mono text-[#1a1a1a]/60 bg-[#faf8f5] p-3 rounded-xl border border-[#e8e4df]/60">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#c8f54e] fill-[#1a1a1a]" />
                        <span className="font-bold text-[#1a1a1a]">
                          {counselor.availability}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#1a1a1a]/40">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{counselor.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Book Action Button */}
                  <button
                    onClick={() => {
                      setSelectedCounselor(counselor);
                      setBookingMode(
                        counselor.mode === "Offline" ? "Offline" : "Online"
                      );
                      setShowBookingModal(true);
                    }}
                    className="w-full bg-[#1a1a1a] hover:bg-[#333] text-white py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-xs active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-[#c8f54e]" />
                    BOOK CONSULTATION
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Section 2: Student Wellness FAQs */}
          <div className="bg-white rounded-2xl border border-[#e8e4df] p-6 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono tracking-widest uppercase bg-[#c8f54e] text-[#1a1a1a] px-2 py-0.5 rounded-sm font-bold">
                  STUDENT GUIDANCE
                </span>
              </div>
              <h2 className="font-display text-2xl font-extrabold text-[#1a1a1a]">
                Student Wellness FAQs
              </h2>
              <p className="text-xs font-mono text-[#1a1a1a]/40 uppercase mt-0.5">
                COMMON QUESTIONS ABOUT COUNSELING, BURNOUT, AND EXAM PRESSURE
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.question}
                    className="border border-[#e8e4df] rounded-xl overflow-hidden transition-all bg-[#faf8f5]"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-display text-sm font-bold text-[#1a1a1a] hover:bg-[#f0ece7] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#1a1a1a]/30 font-normal">
                          0{idx + 1}.
                        </span>
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#1a1a1a]/40 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#1a1a1a]/40 shrink-0" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="px-4 pb-4 pt-1 text-xs font-sans text-[#1a1a1a]/70 leading-relaxed border-t border-[#e8e4df]/50 bg-white"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Book Consultation Modal */}
      <AnimatePresence>
        {showBookingModal && selectedCounselor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#e8e4df] p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#e8e4df] pb-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#1a1a1a]">
                    Book Session
                  </h3>
                  <p className="text-xs font-mono text-[#1a1a1a]/50">
                    With {selectedCounselor.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-[#1a1a1a]/40 hover:text-[#1a1a1a] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleBookSubmit} className="space-y-4 font-sans text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] text-[#1a1a1a]/60 uppercase mb-1 font-bold">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e4df] rounded-xl focus:outline-none focus:border-[#1a1a1a] bg-[#faf8f5]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-[#1a1a1a]/60 uppercase mb-1 font-bold">
                      Time Slot
                    </label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e4df] rounded-xl focus:outline-none focus:border-[#1a1a1a] bg-[#faf8f5]"
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#1a1a1a]/60 uppercase mb-1 font-bold">
                    Consultation Mode
                  </label>
                  <div className="flex gap-2">
                    {selectedCounselor.mode !== "Offline" && (
                      <button
                        type="button"
                        onClick={() => setBookingMode("Online")}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          bookingMode === "Online"
                            ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                            : "bg-[#faf8f5] text-[#1a1a1a]/60 border-[#e8e4df]"
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        Online Video
                      </button>
                    )}

                    {selectedCounselor.mode !== "Online" && (
                      <button
                        type="button"
                        onClick={() => setBookingMode("Offline")}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          bookingMode === "Offline"
                            ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                            : "bg-[#faf8f5] text-[#1a1a1a]/60 border-[#e8e4df]"
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        In-Person / Offline
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#e8e4df]/60 space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={attachReport}
                      onChange={(e) => setAttachReport(e.target.checked)}
                      className="rounded text-[#c8f54e] focus:ring-0"
                    />
                    <span className="text-xs font-mono font-bold text-[#1a1a1a]">
                      Attach My Generated Wellness Report
                    </span>
                  </label>
                  <p className="text-[11px] text-[#1a1a1a]/50 leading-normal pl-6 font-sans">
                    Includes confidential mood history, habit streak, hydration, and academic stress score for your counselor to review.
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-[#1a1a1a]/60 hover:text-[#1a1a1a] cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#c8f54e] text-[#1a1a1a] font-mono text-xs font-bold rounded-xl hover:bg-[#b5e43b] transition-colors cursor-pointer"
                  >
                    CONFIRM BOOKING
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Generate Wellness Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#e8e4df] p-6 max-w-xl w-full shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#e8e4df] pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#1a1a1a]" />
                  <h3 className="font-display text-lg font-bold text-[#1a1a1a]">
                    Confidential Wellness Report
                  </h3>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-[#1a1a1a]/40 hover:text-[#1a1a1a] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Report Preview Document */}
              <div className="bg-[#faf8f5] rounded-xl border border-[#e8e4df] p-5 space-y-4 font-mono text-xs text-[#1a1a1a]">
                <div className="flex justify-between items-start border-b border-[#e8e4df] pb-3">
                  <div>
                    <span className="text-[10px] bg-[#c8f54e] px-2 py-0.5 rounded font-bold uppercase text-[#1a1a1a]">
                      MENTEBLOOM CLINICAL SUMMARY
                    </span>
                    <h4 className="font-display text-base font-extrabold mt-1">
                      Student Behavioral & Academic Analytics
                    </h4>
                  </div>
                  <span className="text-[10px] text-[#1a1a1a]/40">
                    DATE: {new Date().toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-lg border border-[#e8e4df]/60">
                    <span className="text-[10px] text-[#1a1a1a]/40 block">
                      WELLNESS SCORE
                    </span>
                    <span className="text-xl font-bold">{wellnessScore}/100</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#e8e4df]/60">
                    <span className="text-[10px] text-[#1a1a1a]/40 block">
                      ACADEMIC STRESS INDEX
                    </span>
                    <span
                      className="text-xl font-bold"
                      style={{ color: academicStress.color }}
                    >
                      {academicStress.score}% ({academicStress.label})
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#e8e4df]/60">
                    <span className="text-[10px] text-[#1a1a1a]/40 block">
                      HABIT STREAK
                    </span>
                    <span className="text-xl font-bold">{store.currentStreak} Days</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#e8e4df]/60">
                    <span className="text-[10px] text-[#1a1a1a]/40 block">
                      MOOD AVERAGE
                    </span>
                    <span className="text-xl font-bold">{avgMoodNum} / 5.0</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#e8e4df]">
                  <span className="text-[10px] text-[#1a1a1a]/40 uppercase font-bold">
                    ACADEMIC STRAIN FOCUS
                  </span>
                  <p className="text-xs font-sans text-[#1a1a1a]/80">
                    {topStrainSubject
                      ? `Primary stress contributor: ${topStrainSubject.subject.name} (${topStrainSubject.subject.code}) with ${topStrainSubject.pendingHours} pending study hours.`
                      : "No active high-strain academic subjects recorded."}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#e8e4df]">
                  <span className="text-[10px] text-[#1a1a1a]/40 uppercase font-bold">
                    JOURNAL SUMMARY
                  </span>
                  <p className="text-xs font-sans text-[#1a1a1a]/80">
                    {store.journalEntries.length > 0
                      ? `${store.journalEntries.length} reflection entries saved. Latest entry prompt: "${store.journalEntries[0]?.prompt}"`
                      : "No student journal reflections recorded yet."}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-mono text-[#1a1a1a]/40">
                  READY TO SHARE WITH COUNSELOR
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyReport}
                    className="px-4 py-2 bg-[#1a1a1a] text-white font-mono text-xs font-bold rounded-xl hover:bg-[#333] transition-colors cursor-pointer"
                  >
                    COPY REPORT TEXT
                  </button>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 bg-[#c8f54e] text-[#1a1a1a] font-mono text-xs font-bold rounded-xl hover:bg-[#b5e43b] transition-colors cursor-pointer"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AppFooter />
    </div>
  );
}
