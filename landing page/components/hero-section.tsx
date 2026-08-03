"use client"
import { useEffect, useState } from "react"
import { AnimatedText } from "./animated-text"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let rafId: number
    let currentProgress = 0

    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = 400
      const targetProgress = Math.min(scrollY / maxScroll, 1)

      const smoothUpdate = () => {
        currentProgress += (targetProgress - currentProgress) * 0.1

        if (Math.abs(targetProgress - currentProgress) > 0.001) {
          setScrollProgress(currentProgress)
          rafId = requestAnimationFrame(smoothUpdate)
        } else {
          setScrollProgress(targetProgress)
        }
      }

      cancelAnimationFrame(rafId)
      smoothUpdate()
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const easeOutQuad = (t: number) => t * (2 - t)
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

  const scale = 1 - easeOutQuad(scrollProgress) * 0.15
  const borderRadius = easeOutCubic(scrollProgress) * 48
  const heightVh = 100 - easeOutQuad(scrollProgress) * 37.5

  return (
    <section className="min-h-screen px-6 relative overflow-hidden flex flex-col items-center pt-32 bg-black">
      <div className="absolute inset-0 w-full top-0 left-0 z-0 h-screen">
        <div
          className="w-full h-full will-change-transform overflow-hidden"
          style={{
            transform: `scale(${scale})`,
            borderRadius: `${borderRadius}px`,
            height: `${heightVh}vh`,
          }}
        >
          <video autoPlay loop muted playsInline className="w-full h-full object-cover" src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/af7687fd-f2ad-4f2a-96f0-b56fa7d3769c-08wERpo5U1sktxs1vcRsJW9ueslNZv.mp4" />
        </div>
      </div>

      <div className="w-full relative z-10 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-20 max-w-3xl">
          <div
            className={`transition-all duration-1000 delay-[400ms] w-full ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            <div className="text-center mb-4">
              <span className="text-white text-xl font-light tracking-widest">mentebloom</span>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 delay-[800ms] w-full ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            <h1 className="font-serif text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] 2xl:text-[5rem] font-light leading-tight text-white text-center">
              <AnimatedText text="Your Daily Wellness Journey Starts Here" delay={0.3} />
            </h1>
          </div>

          <div
            className={`transition-all duration-1000 delay-[1200ms] mt-64 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <button className="group px-12 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95">
              <span className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">Get Started</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
