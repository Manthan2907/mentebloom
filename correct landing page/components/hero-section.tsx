"use client"
import { useEffect, useState } from "react"
import ParticleText from "./ParticleText"
import { ShinyButton } from "./ui/shiny-button"

const VIDEO_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/af7687fd-f2ad-4f2a-96f0-b56fa7d3769c-08wERpo5U1sktxs1vcRsJW9ueslNZv.mp4"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="h-[100svh] w-full max-h-[100svh] relative overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="h-full w-full object-cover"
          src={VIDEO_URL}
        />
      </div>

      <div className="absolute inset-0 z-10 flex h-full flex-col items-center px-6">
        <div
          className={`pt-8 transition-all duration-1000 delay-[400ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          <span className="text-xl font-light tracking-widest text-white">mentebloom</span>
        </div>

        <div className="flex w-full flex-1 flex-col items-center justify-center pb-24">
          <div
            className={`relative -top-12 w-full max-w-5xl h-[65vh] min-h-[500px] transition-all duration-1000 delay-[800ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            <ParticleText
              text={"Your Daily\nWellness\nJourney\nStarts Here"}
              particleSize={2}
              density={2}
              color="#ffffff"
              highlightColor="#e7e7ec"
              scatter={180}
              gatherDuration={1600}
              stagger={420}
              pointerRepel={40}
              repelRadius={120}
              idleDrift={0.7}
              trigger="hover"
              fontSize={110}
              fontWeight={300}
              fontFamily="Playfair Display, serif"
              className="font-serif"
              glow
            />
          </div>

          <div
            className={`relative top-10 mt-32 transition-all duration-1000 delay-[1200ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <ShinyButton>
              Get Started
            </ShinyButton>
          </div>
        </div>
      </div>
    </section>
  )
}
