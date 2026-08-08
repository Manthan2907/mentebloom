/**
 * MoodFaces — Premium glass-orb mood indicators
 * Each mood renders as a softly lit glass sphere with a radial gradient,
 * an animated specular highlight, and a minimal expressive arc — no flat
 * dot-eyes. Designed to feel like a tactile, physical object rather than
 * a static icon.
 */
import React from "react";
import type { Mood } from "@/lib/store";

export const MOOD_COLORS: Record<Mood, string> = {
  sad: "#ff8a65",
  low: "#ffb74d",
  okay: "#ffd54f",
  good: "#9ccc65",
  great: "#c8f54e",
};

export const MOOD_GRADIENTS: Record<Mood, [string, string]> = {
  sad: ["#ff9a76", "#e2593c"],
  low: ["#ffc773", "#e08a2a"],
  okay: ["#ffe184", "#e0aa1f"],
  good: ["#b6e07a", "#6f9e33"],
  great: ["#e4ff9c", "#a9d92a"],
};

export const MOOD_LABELS: Record<Mood, string> = {
  sad: "Sad",
  low: "Low",
  okay: "Neutral",
  good: "Good",
  great: "Great",
};

const TEXT_MAP: Record<Mood, string> = {
  sad: "I feel down.",
  low: "I feel low.",
  okay: "I feel neutral.",
  good: "I feel good.",
  great: "I feel great.",
};

/** Arc path for the expressive "mouth" line, drawn in a normalized 0-100 box */
function arcFor(mood: Mood): string {
  switch (mood) {
    case "sad":
      return "M32 66 C40 58, 60 58, 68 66";
    case "low":
      return "M34 62 L66 62";
    case "okay":
      return "M34 60 L66 60";
    case "good":
      return "M32 56 C40 66, 60 66, 68 56";
    case "great":
      return "M28 52 C38 68, 62 68, 72 52";
  }
}

function eyeYFor(mood: Mood): number {
  if (mood === "great") return 38;
  if (mood === "good") return 40;
  return 42;
}

let gradientSeq = 0;

export function GlassOrb({
  mood,
  size = 48,
  active = false,
}: {
  mood: Mood | null;
  size?: number;
  active?: boolean;
}) {
  const id = React.useMemo(() => `orb-${gradientSeq++}`, []);
  const [from, to] = mood ? MOOD_GRADIENTS[mood] : ["#e8e4df", "#d3cec7"];
  const eyeY = mood ? eyeYFor(mood) : 42;
  const arc = mood ? arcFor(mood) : "M34 60 L66 60";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id={`${id}-fill`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </radialGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor={to} stopOpacity="0" />
          <stop offset="100%" stopColor={to} stopOpacity="0.35" />
        </radialGradient>
      </defs>

      {/* soft outer glow when active */}
      {active && <circle cx="50" cy="50" r="48" fill={`url(#${id}-glow)`} />}

      {/* main sphere */}
      <circle cx="50" cy="50" r="42" fill={`url(#${id}-fill)`} />

      {/* rim light */}
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="1.2"
      />

      {/* specular highlight */}
      <ellipse cx="36" cy="30" rx="14" ry="9" fill="white" opacity="0.32" />

      {mood && (
        <>
          <circle cx="38" cy={eyeY} r="3" fill="#1a1a1a" opacity="0.72" />
          <circle cx="62" cy={eyeY} r="3" fill="#1a1a1a" opacity="0.72" />
          <path d={arc} stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.72" />
        </>
      )}
      {!mood && (
        <path d={arc} stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.18" />
      )}
    </svg>
  );
}

/** Back-compat wrapper matching the previous MoodFace API */
export function MoodFace({ mood, size = 48 }: { mood: Mood | null; size?: number }) {
  return <GlassOrb mood={mood} size={size} />;
}

export function MoodFaceMini({ mood }: { mood: Mood | null }) {
  if (!mood) return null;
  return <GlassOrb mood={mood} size={26} />;
}

export function getMoodText(mood: Mood | null): string {
  if (!mood) return "No mood recorded yet.";
  return TEXT_MAP[mood];
}

export function getMoodColor(mood: Mood | null): string {
  if (!mood) return "#e8e4df";
  return MOOD_COLORS[mood];
}
