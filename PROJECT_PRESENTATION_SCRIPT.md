# 🎤 Mentebloom — Project Pitch & Presentation Script

> **Tone**: Confident, engaging, empathetic, and professional  
> **Target Audience**: Hackathon Judges, Professors, Evaluators, or Investors  
> **Duration**: ~3 to 5 minutes  

---

## 🎬 Act 1: The Hook & The Problem (0:00 - 0:45)

**[Speaker standing confidently / Screen sharing the Landing Page]**

> *"Good morning/afternoon everyone.*  
>  
> *If you ask any college student what their biggest source of daily anxiety is, it’s rarely just one thing — it’s the relentless pressure of overlapping deadlines. An assignment due at midnight, a midterm prep set in Linear Algebra, a lab report in Quantum Physics, and zero time left to check in on their own mental health.*  
>  
> *Existing mental health applications are mostly generic — they offer static meditation timers or basic mood logs, but completely ignore the **#1 trigger for student burnout: academic workload density**.*  
>  
> *That is why we built **Mentebloom** — an editorial mental wellness and academic stress management platform designed to help students balance high academic demands with genuine emotional well-being."*

---

## 🌟 Act 2: Interactive Mood Gate Overlay (0:45 - 1:30)

**[Action: Click 'Get Started' on the Landing Page. The WebGL Mood Gate opens]**

> *"Let me walk you through the experience.*  
>  
> *When a student enters Mentebloom, they aren't greeted by cold data tables. Instead, they experience a **full-screen WebGL Raymarching Shader** background that dynamically reacts to their emotional state.*  
>  
> *As I hover over or select different moods — from **Sad** to **Great** — notice how the WebGL plasma waves smoothly morph colors in real-time. We’ve designed a custom **Overlapping Emoji Badge Stack** with illustrated ring avatars.*  
>  
> *After selecting how they feel and tagging key life factors — like Study, Sleep, or Family — Mentebloom delivers a curated motivational quote before smoothly fading into the main dashboard."*

---

## 🏠 Act 3: Editorial Dashboard & Dynamic Hero (1:30 - 2:30)

**[Action: Transition into the Main Dashboard]**

> *"Once inside the dashboard, everything is designed with an editorial aesthetic — crisp typography, warm cream backgrounds, and high-contrast dark accents.*  
>  
> *Notice our Hero Header: **'Daily'** remains static, while the accent word — **Practice, Growing, Learning, Motivation, Focus** — smoothly transitions with vertical blur animations.*  
>  
> *Here on the dashboard, students have access to:*  
> 1. **Live Habit Tracker**: A 7-day weekly grid and 30-day calendar matrix with checkmark micro-animations and future date locking to prevent accidental logging.  
> 2. **Today's Note Carousel**: Powered by a custom `MoltenMetal` WebGL shader that dynamically calculates your steadiest habit and weekly completion rate.  
> 3. **Streak & Weekly Pulse**: Live soundwave charts that track consistency week-over-week."*

---

## 📚 Act 4: The Core Innovation — Subject-Wise Academic Stress Engine (2:30 - 3:30)

**[Action: Navigate to 'Academic' tab (`/app/academic-stress`)]**

> *"Now, let us show you Mentebloom’s core differentiator: our **Subject-Wise Academic Stress Engine**.*  
>  
> *Rather than just listing tasks, Mentebloom uses a dynamic mathematical formula to calculate an overall **Academic Stress Score** based on:*  
> - **Task Difficulty**: Easy, Medium, Hard, and Extreme  
> - **Deadline Proximity**: Exponential urgency weights for tasks due within 24–72 hours  
> - **Estimated Hours Required**  
>  
> *The engine diagnoses the student’s stress level into 5 actionable states: **Relaxed, Manageable, Busy, Overloaded, or Critical**.*  
>  
> *It also breaks down stress per subject — so a student can instantly see if 60% of their workload strain is coming from Data Structures, allowing them to prioritize intelligently before reaching burnout."*

---

## 💧 Act 5: Holistic Wellness, Reflections & Consultation (3:30 - 4:15)

**[Action: Quickly show 'Wellness', 'Journal', and 'Consult' tabs]**

> *"Mentebloom covers every pillar of student wellness:*  
> - **Physical Wellness**: Track sleep duration, sleep quality ratings, hydration glasses, and exercise intensity.  
> - **Reflections & Journal**: An auto-saving journal featuring real-time sentiment analysis (*Positive, Reflective, Neutral*) and daily prompts.  
> - **Guided Meditation**: A 4-4-4 breathwork timer and calming ambient soundscapes.  
> - **Counselor Consultation**: Direct booking interface with certified student mental health advisors."*

---

## ⚡ Act 6: Tech Stack & Technical Excellence (4:15 - 4:45)

> *"Under the hood, Mentebloom is engineered for speed and precision:*  
> - **Frontend**: React 19, TypeScript, Vite 7, TailwindCSS  
> - **Animations & Visuals**: Framer Motion 12, GSAP 3, and OGL WebGL Raymarching Shaders  
> - **State Management**: A reactive Zustand single-source-of-truth store with `localStorage` and `sessionStorage` persistence across all widgets.  
> - **Deployment**: Fully optimized for Vercel client-side routing with Node/Express backend capabilities."*

---

## 🎯 Act 7: Closing & Q&A (4:45 - 5:00)

> *"To summarize: Mentebloom doesn't just ask students how they feel — it gives them the exact tools to manage why they feel that way.*  
>  
> *Thank you so much, and we'd love to take any questions!"*

---

## 💡 Quick Q&A Cheat Sheet for Presenters

| Potential Question | Best Answer |
|---|---|
| **What makes Mentebloom different from Notion or Habitica?** | Notion is a generic notebook, and Habitica gamifies tasks. Mentebloom specifically connects **academic workload urgency** to **mental health metrics**, offering an integrated stress diagnosis and mood check-in. |
| **How does data synchronization work?** | We use a single Zustand reactive store (`useStore`) so modifying a habit or logging a mood updates streaks, progress bars, wellness scores, and analytics across all tabs instantaneously without page reloads. |
| **How performant are the WebGL shaders?** | We use lightweight WebGL fragment shaders (`ogl` library) rendered at device pixel ratio with auto-cleanup on component unmount to ensure 60 FPS performance on standard laptops and mobile devices. |
