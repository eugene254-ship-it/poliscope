"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe } from "lucide-react"
import Link from "next/link"

const fadingWords = ["Ideology", "Narrative", "Power", "Data"]

export default function WelcomePage() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % fadingWords.length)
        setIsVisible(true)
      }, 500)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-electricBlue-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-electricBlue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Globe visualization */}
      <div className="absolute top-20 right-20 opacity-20">
        <Globe className="w-32 h-32 text-electricBlue-400 animate-spin" style={{ animationDuration: "20s" }} />
      </div>

      <div className="text-center z-10 max-w-4xl mx-auto px-6">
        {/* Logo and tagline */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 font-inter">
            Poli<span className="text-electricBlue-400">Scope</span>
          </h1>
          <p className="text-xl text-gray-300 mb-2">See Through the Noise. Understand Every Side.</p>
          <p className="text-lg text-electricBlue-300 font-ibm-plex-mono">
            💬 "You're not here to take sides. You're here to see them all."
          </p>
        </div>

        {/* Fading words animation */}
        <div className="mb-12 h-20 flex items-center justify-center">
          <span
            className={`text-4xl font-bold transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
            style={{
              background: "linear-gradient(45deg, #007FFF, #00BCD4, #26C6DA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {fadingWords[currentWordIndex]}
          </span>
        </div>

        {/* Main description */}
        <div className="mb-12 max-w-3xl mx-auto">
          <p className="text-xl text-gray-200 leading-relaxed mb-6">
            Welcome to PoliScope — your lens into the world's ideological conversations. Discover what people are really
            saying. Across parliaments, platforms, and political divides.
          </p>
          <p className="text-lg text-electricBlue-200 font-ibm-plex-mono">
            Powered by AI. Rooted in reality. Always in your hands.
          </p>
        </div>

        {/* CTA Button */}
        <Link href="/explore">
          <Button
            size="lg"
            className="bg-electricBlue-600 hover:bg-electricBlue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-electricBlue-500/25"
          >
            👉 Enter the Arena
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-electricBlue-400 rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
