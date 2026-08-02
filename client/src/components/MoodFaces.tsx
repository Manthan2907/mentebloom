/**
 * MoodFaces — Custom SVG illustrated mood faces
 * Replaces emojis with flat-design illustrated faces
 * Each face has a color-coded circular background
 * Style: simple geometric faces with minimal features (eyes + mouth)
 */
import React from "react";
import type { Mood } from "@/lib/store";

export const MOOD_COLORS: Record<Mood, string> = {
  sad: "#e07b39",       // warm coral/orange
  low: "#e6a23c",       // amber/golden
  okay: "#f0c040",      // bright yellow-amber
  good: "#7cb342",      // soft green
  great: "#c8f54e",     // lime green (brand accent)
};

export const MOOD_LABELS: Record<Mood, string> = {
  sad: "Sad",
  low: "Low",
  okay: "Neutral",
  good: "Good",
  great: "Great",
};

function SadFace({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" fill="#e07b39" />
      {/* Left eye - simple dot */}
      <circle cx="28" cy="32" r="3" fill="#1a1a1a" opacity="0.8" />
      {/* Right eye - simple dot */}
      <circle cx="52" cy="32" r="3" fill="#1a1a1a" opacity="0.8" />
      {/* Sad mouth - downward curve */}
      <path d="M28 52 C34 46, 46 46, 52 52" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function LowFace({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" fill="#e6a23c" />
      {/* Left eye */}
      <circle cx="28" cy="32" r="3" fill="#1a1a1a" opacity="0.8" />
      {/* Right eye */}
      <circle cx="52" cy="32" r="3" fill="#1a1a1a" opacity="0.8" />
      {/* Slightly downturned mouth */}
      <path d="M30 48 L50 48" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function OkayFace({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" fill="#f0c040" />
      {/* Left eye */}
      <circle cx="28" cy="32" r="3" fill="#1a1a1a" opacity="0.8" />
      {/* Right eye */}
      <circle cx="52" cy="32" r="3" fill="#1a1a1a" opacity="0.8" />
      {/* Neutral straight mouth */}
      <path d="M28 48 L52 48" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function GoodFace({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" fill="#7cb342" />
      {/* Left eye */}
      <circle cx="28" cy="30" r="3" fill="#1a1a1a" opacity="0.8" />
      {/* Right eye */}
      <circle cx="52" cy="30" r="3" fill="#1a1a1a" opacity="0.8" />
      {/* Smiling mouth */}
      <path d="M26 46 C32 54, 48 54, 54 46" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function GreatFace({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" fill="#c8f54e" />
      {/* Left eye */}
      <circle cx="28" cy="28" r="3" fill="#1a1a1a" opacity="0.8" />
      {/* Right eye */}
      <circle cx="52" cy="28" r="3" fill="#1a1a1a" opacity="0.8" />
      {/* Wide smile mouth */}
      <path d="M24 44 C32 56, 48 56, 56 44" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

const FACE_MAP: Record<Mood, React.FC<{ size?: number }>> = {
  sad: SadFace,
  low: LowFace,
  okay: OkayFace,
  good: GoodFace,
  great: GreatFace,
};

const TEXT_MAP: Record<Mood, string> = {
  sad: "I Feel Down.",
  low: "I Feel Low.",
  okay: "I Feel Neutral.",
  good: "I Feel Good.",
  great: "I Feel Great.",
};

export function MoodFace({ mood, size = 48 }: { mood: Mood | null; size?: number }) {
  if (!mood) {
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="38" fill="#e8e4df" />
        <circle cx="28" cy="32" r="3" fill="#1a1a1a" opacity="0.2" />
        <circle cx="52" cy="32" r="3" fill="#1a1a1a" opacity="0.2" />
        <path d="M28 48 L52 48" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" opacity="0.2" />
      </svg>
    );
  }
  const Component = FACE_MAP[mood];
  return <Component size={size} />;
}

export function getMoodText(mood: Mood | null): string {
  if (!mood) return "No mood selected.";
  return TEXT_MAP[mood];
}

export function getMoodColor(mood: Mood | null): string {
  if (!mood) return "#e8e4df";
  return MOOD_COLORS[mood];
}

export function MoodFaceMini({ mood }: { mood: Mood | null }) {
  if (!mood) return null;
  const Component = FACE_MAP[mood];
  return <Component size={28} />;
}
