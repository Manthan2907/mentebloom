"use client"
import { useEffect, useState } from "react"
import { AnimatedText } from "./animated-text"

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

        <div className="flex flex-1 flex-col items-center justify-center pb-24">
          <div
            className={`relative -top-12 w-full max-w-3xl transition-all duration-1000 delay-[800ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            <h1 className="text-center font-serif text-[2.5rem] font-light leading-tight text-white sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem]">
              <AnimatedText text="Your Daily Wellness Journey Starts Here" delay={0.3} />
            </h1>
          </div>

          <div
            className={`relative top-10 mt-32 transition-all duration-1000 delay-[1200ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <button type="button" className="group rounded-lg bg-white px-12 py-4 font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-2xl active:scale-95">
              <span className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">Get Started</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
