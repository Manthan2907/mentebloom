/**
 * Landing Page — assembles sections directly from the `landing page/` folder.
 *
 * The `landing page/` folder is kept SEPARATE from this codebase.
 * Future updates to that folder are automatically picked up here.
 *
 * Architecture:
 *   - @landing  →  resolves to `landing page/`  (see vite.config.ts)
 *   - next/link →  shim in client/src/shims/NextLink.tsx
 *   - next/image → shim in client/src/shims/NextImage.tsx
 *
 * Navigation is wired via event delegation so the landing page
 * components stay completely unmodified.
 */
import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

const preloadDashboard = () => {
  void import("./Home");
};

// ─── Sections imported directly from the standalone landing page folder ────
import { HeroSection } from "@landing/components/hero-section";

// ─── Wrapper: intercepts button clicks and navigates to /app ──────────────
interface NavWrapperProps {
  children: React.ReactNode;
  /** CSS selector to match buttons that should navigate to /app */
  selector?: string;
}

function NavWrapper({ children, selector = "button" }: NavWrapperProps) {
  const [, navigate] = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest(selector)) {
        e.preventDefault();
        preloadDashboard();
        navigate("/app");
      }
    };
    const preloadOnIntent = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest(selector)) preloadDashboard();
    };

    container.addEventListener("click", handler);
    container.addEventListener("pointerenter", preloadOnIntent, true);
    container.addEventListener("focusin", preloadOnIntent);
    return () => {
      container.removeEventListener("click", handler);
      container.removeEventListener("pointerenter", preloadOnIntent, true);
      container.removeEventListener("focusin", preloadOnIntent);
    };
  }, [navigate, selector]);

  return <div ref={ref}>{children}</div>;
}

export default function LandingPage() {
  // Reset scroll and warm the dashboard chunk while the user reads the hero.
  useEffect(() => {
    window.scrollTo(0, 0);
    const idle = window.setTimeout(preloadDashboard, 1200);

    return () => window.clearTimeout(idle);
  }, []);

  return (
    <main className="h-svh w-full overflow-hidden bg-background">
      <NavWrapper>
        <HeroSection />
      </NavWrapper>
    </main>
  );
}
