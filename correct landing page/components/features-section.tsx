"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const wellnessFeatures = [
  { text: "Track your daily mood and emotions", icon: "😊", bgColor: "bg-yellow-200" },
  { text: "Guided meditation & breathing exercises", icon: "🧘", bgColor: "bg-purple-200" },
  { text: "Personalized wellness insights", icon: "💡", bgColor: "bg-green-200" },
  { text: "Community support & challenges", icon: "👥", bgColor: "bg-pink-200" },
  { text: "Sleep & habit tracking", icon: "😴", bgColor: "bg-blue-200" },
  { text: "Expert mental health resources", icon: "📚", bgColor: "bg-orange-200" },
]

const impactStats = [
  { percentage: 93, label: "Feel More Mentally Clear", description: "Most users say daily writing helps organize thoughts and reduce overwhelm" },
  { percentage: 87, label: "Feel More Connected", description: "Through guided prompts, they gain insight into their emotions and needs" },
  { percentage: 95, label: "Build Self-Care Routine", description: "Small, daily steps turn into powerful wellness routines for mental health" },
]

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let current = 0
    const increment = target / 40
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 40)
    return () => clearInterval(timer)
  }, [target])

  return count
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-28"
        >
          <h2 className="text-6xl md:text-7xl font-serif font-light mb-8 text-gray-900">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Everything you need
            </span>
            <br />
            for better mental wellness
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            mentebloom combines intelligent mood tracking, guided practices, and a supportive community to help you build sustainable wellness habits.
          </p>
        </motion.div>

        {/* Feature Cards - Larger with vibrant colors */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {wellnessFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className={`${feature.bgColor} rounded-3xl p-12 md:p-16 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2`}
            >
              <div className="text-7xl md:text-8xl mb-8">{feature.icon}</div>
              <p className="text-lg md:text-xl font-medium text-gray-900 leading-relaxed">{feature.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Impact Section */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center text-5xl md:text-6xl font-serif font-light text-gray-900 mb-24"
          >
            Your space to feel, reflect,
            <span className="italic"> and grow</span>
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-10">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-center p-10 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 hover:shadow-xl transition-shadow"
              >
                <div className="text-8xl md:text-9xl font-serif font-light bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-8">
                  <AnimatedCounter target={stat.percentage} />%
                </div>
                <h4 className="text-2xl md:text-3xl font-serif font-light text-gray-900 mb-6 leading-tight">{stat.label}</h4>
                <p className="text-gray-600 leading-relaxed text-base">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
