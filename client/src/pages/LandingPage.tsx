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
import { Header } from "@landing/components/header";
import { HeroSection } from "@landing/components/hero-section";
import { FeaturesSection } from "@landing/components/features-section";
import { TestimonialsSection } from "@landing/components/testimonials-section";
import { FAQSection } from "@landing/components/faq-section";
import { StatsSection } from "@landing/components/stats-section";
import { Footer } from "@landing/components/footer";

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
    <div className="min-h-screen bg-background text-foreground">
      {/*
       * Header: wrap so the CTA button ("List a property" / whatever the
       * landing page calls it) navigates to /app in the Vite context.
       */}
      <NavWrapper>
        <Header />
      </NavWrapper>

      <main>
        {/*
         * Hero: "Get Started" button navigates to /app.
         * NavWrapper intercepts the click without touching the source file.
         */}
        <NavWrapper>
          <HeroSection />
        </NavWrapper>

        {/* These sections are purely informational — no nav needed */}
        <StatsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection />
      </main>

      {/* Footer: wrap so any CTA links navigate to /app */}
      <NavWrapper selector="button, a[href='#']">
        <Footer />
      </NavWrapper>
    </div>
  );
}
