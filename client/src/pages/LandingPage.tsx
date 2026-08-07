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
        navigate("/app");
      }
    };

    container.addEventListener("click", handler);
    return () => container.removeEventListener("click", handler);
  }, [navigate, selector]);

  return <div ref={ref}>{children}</div>;
}

export default function LandingPage() {
  // Reset scroll when landing page mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="h-svh w-full overflow-hidden bg-background">
      <NavWrapper>
        <HeroSection />
      </NavWrapper>
    </main>
  );
}
