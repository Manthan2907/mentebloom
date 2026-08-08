# 🌸 Mentebloom — Mental Wellness & Academic Stress Platform

<p align="center">
  <a href="https://mental-wellness-lemon.vercel.app/">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-https%3A%2F%2Fmental--wellness--lemon.vercel.app%2F-000000?style=for-the-badge&logo=vercel&logoColor=white&color=000000" alt="Live Demo on Vercel" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7.1-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/WebGL-OGL-000000?style=for-the-badge&logo=webgl&logoColor=white" alt="WebGL OGL" />
  <img src="https://img.shields.io/badge/Framer_Motion-12.4-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

> 🚀 **Live Deployment URL**: [https://mental-wellness-lemon.vercel.app/](https://mental-wellness-lemon.vercel.app/)

---

## 📌 Overview

**Mentebloom** is a state-of-the-art mental wellness and academic stress management platform built specifically for students and individuals. It seamlessly combines daily mood check-ins, habit formation tracking, reflection journaling, hydration monitoring, and an algorithmic **Subject-Wise Academic Stress Engine** within an elegant editorial light/dark glassmorphism design.

---

## ✨ Core Features

### 🌊 1. Interactive WebGL Mood Check-In Overlay (`MoodGate`)
* **Raymarching Shader Background**: Full-screen sine-plasma WebGL background powered by `ogl` with live film grain and cursor parallax.
* **Dynamic Color Morphing**: Per-frame RGB lerping morphs background plasma colors as users hover or select different mood states (Sad, Low, Neutral, Good, Great).
* **Overlapping Avatar Stack (`OverlappingMoodStack`)**: Illustrated emoji badge avatar stack featuring crisp white rings, hover pop-out scaling, and active label pills.
* **Motivational Inspiration**: Presents tailored motivational quotes based on selected mood before transitioning smoothly into the main dashboard.

### 🏠 2. Editorial Dashboard & Dynamic Hero Header
* **Dynamic Morphing Header**: Features static bold serif typography ("Daily") alongside a smoothly morphing italic accent word (*Practice*, *Growing*, *Learning*, *Motivation*, *Mindfulness*, *Focus*, *Reflection*, *Progress*) using Framer Motion blur-slide transitions.
* **Today's Note Carousel**: Reactive card powered by `MoltenMetal` WebGL shader that dynamically computes your highest-performing habit and weekly consistency.
* **Live Habit Matrix (`HabitsTable`)**: Multi-mode 7-day weekly grid & 30-day monthly calendar matrix with checkmark micro-animations and future date protection.
* **Weekly Pulse**: Week-over-week habit completion percentage charts comparing performance against previous weeks.

### 📚 3. Subject-Wise Academic Stress Engine (`AcademicStress`)
* **Algorithmic Stress Score**: Dynamically computes workload pressure (Relaxed, Manageable, Busy, Overloaded, Critical) based on task difficulty (Easy, Medium, Hard, Extreme) and deadline urgency.
* **Subject Breakdown**: Color-coded stress distribution across enrolled courses (e.g., Data Structures, Linear Algebra, Quantum Mechanics).
* **Interactive Task Manager**: Add, filter, and track assignments with estimated time commitments and difficulty tags.

### 💧 4. Physical Wellness, Hydration & Sleep Tracker (`Wellness`)
* **Hydration Counter**: Target tracking with quick-add water controls and week-long intake bar charts.
* **Sleep Quality Monitor**: Log sleep duration and rating (Poor to Excellent) with visual quality color codes and weekly trend sparklines.
* **Exercise Log**: Track duration and intensity across Yoga, Gym, Running, Walking, Swimming, and Sports.

### 📝 5. Journal & Reflections (`Journal`)
* **Sentiment Analysis**: Automatic sentiment tagging (Positive, Reflective, Neutral) for journal entries.
* **Auto-Save & Prompts**: Real-time auto-saving with prompt suggestions ("What made you smile today?", "Describe a moment of peace").

### 🧘 6. Meditation & Audio Soundscapes (`Meditation`)
* **Breathwork Timer**: Interactive breathing animation cycle (4s Inhale, 4s Hold, 4s Exhale).
* **Calming Soundscapes**: Ambient audio routines for focus and relaxation.

### 🩺 7. Counselor Consultation Booking (`Consultation`)
* **Professional Matching**: Directory of certified counselors with specialized focus areas (Anxiety, Academic Stress, Burnout).
* **Interactive Booking**: Date selection and instant appointment confirmation.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend Core** | React 19, TypeScript, Vite 7, Wouter Routing |
| **Styling & Design Token** | Tailwind CSS 3.4, Lucide Icons, Google Inter & Serif Typography |
| **Animations** | Framer Motion 12, GSAP 3 |
| **WebGL & Shaders** | `ogl` (Raymarching Sine-Plasma, ColorBends, MoltenMetal) |
| **State & Persistence** | Zustand 5 with `localStorage` & `sessionStorage` sync |
| **Backend & Server** | Node.js, Express.js, TypeScript, Esbuild |
| **UI Components** | Custom Glassmorphism, SpecularButton, ShinyButton, BlurText, CardFanCarousel |

---

## 📂 Project Structure

```
c:/meow/pixxo/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── SpecularButton.tsx     # WebGL specular highlight glass button
│   │   │   │   ├── OverlappingMoodStack.tsx # Circular avatar mood badge stack
│   │   │   │   ├── BlurText.tsx           # Animated text entrance component
│   │   │   │   ├── ColorBends.tsx         # Shader background for hero section
│   │   │   │   ├── MoltenMetal.tsx        # Shader background for Today's Note
│   │   │   │   └── card-fan-carousel.tsx  # GSAP 3D interactive orb carousel
│   │   │   ├── MoodGate.tsx              # Interactive WebGL mood check-in overlay
│   │   │   ├── HeroSection.tsx           # Hero section with dynamic word switcher
│   │   │   ├── HabitsTable.tsx           # Habit tracker table (Week/Month views)
│   │   │   ├── TodaysNote.tsx            # Reactive note carousel
│   │   │   ├── WeeklyPulse.tsx           # Week-over-week performance chart
│   │   │   ├── WellnessScore.tsx         # Overall wellness progress ring
│   │   │   └── TopNav.tsx                # PillNav header navigation
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx           # Landing page wrapper
│   │   │   ├── Home.tsx                  # Dashboard entry page
│   │   │   ├── AcademicStress.tsx        # Academic stress tracker page
│   │   │   ├── Wellness.tsx              # Sleep & physical wellness page
│   │   │   ├── Journal.tsx               # Reflection journal page
│   │   │   ├── Analytics.tsx              # 30-day analytics dashboard page
│   │   │   ├── Meditation.tsx             # Guided breathwork & meditation page
│   │   │   └── Consultation.tsx           # Counselor booking page
│   │   ├── lib/
│   │   │   └── store.ts                  # Central reactive Zustand store
│   │   └── App.tsx                       # Main router & theme provider
├── correct landing page/                 # Standalone hero landing page module
│   ├── components/
│   │   ├── hero-section.tsx
│   │   └── ui/SpecularButton.tsx
├── server/
│   └── index.ts                          # Express backend API server
├── contextt.md                           # Developer context & architecture guide
└── README.md                             # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Package Manager**: `pnpm` (recommended) or `npm` / `yarn`

### 1. Clone Repository
```bash
git clone https://github.com/vihanshah/Mental-Wellness.git
cd Mental-Wellness
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Start Development Server
```bash
pnpm dev
```
The application will be available locally at `http://localhost:5000` (or `http://localhost:5173`).

### 4. Build for Production
```bash
pnpm build
```
This compiles the Vite frontend bundle and builds the Express server into `dist/`.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
