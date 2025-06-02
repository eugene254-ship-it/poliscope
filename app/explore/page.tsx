"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IdeologyMap } from "@/components/ideology-map"
import { DebateTopics } from "@/components/debate-topics"
import { ArrowLeft, Filter, Globe, Clock, Heart, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function ExplorePage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("country")
  const [selectedTopic, setSelectedTopic] = useState<string>("")

  const filters = [
    { id: "country", label: "By Country", icon: Globe },
    { id: "time", label: "By Time", icon: Clock },
    { id: "emotion", label: "By Emotion", icon: Heart },
    { id: "fallacy", label: "By Fallacy", icon: AlertTriangle },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-electricBlue-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Welcome
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white font-inter">
            Poli<span className="text-electricBlue-400">Scope</span>
          </h1>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Main prompt */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">🧠 How do you want to explore today?</h2>
          <p className="text-xl text-gray-300">Choose your lens to see through the ideological spectrum</p>
        </div>

        {/* Filter toggles */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-2 bg-slate-800 rounded-xl">
            {filters.map((filter) => {
              const Icon = filter.icon
              return (
                <Button
                  key={filter.id}
                  variant={selectedFilter === filter.id ? "default" : "ghost"}
                  className={`${
                    selectedFilter === filter.id ? "bg-electricBlue-600 text-white" : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setSelectedFilter(filter.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {filter.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Split-screen layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Ideology Map */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Filter className="w-5 h-5 mr-2 text-electricBlue-400" />
                Ideological Spectrum
              </CardTitle>
              <p className="text-gray-400">Track how Left, Right, and Center shape the same issue</p>
            </CardHeader>
            <CardContent>
              <IdeologyMap selectedFilter={selectedFilter} />
            </CardContent>
          </Card>

          {/* Right: Debate Topics */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="w-5 h-5 mr-2 text-electricBlue-400" />
                Debate Topics
              </CardTitle>
              <p className="text-gray-400">Jump into global issues and ongoing debates</p>
            </CardHeader>
            <CardContent>
              <DebateTopics
                selectedFilter={selectedFilter}
                onTopicSelect={setSelectedTopic}
                selectedTopic={selectedTopic}
              />
            </CardContent>
          </Card>
        </div>

        {/* Continue button */}
        {selectedTopic && (
          <div className="text-center mt-8">
            <Link href={`/debate?topic=${encodeURIComponent(selectedTopic)}&filter=${selectedFilter}`}>
              <Button
                size="lg"
                className="bg-electricBlue-600 hover:bg-electricBlue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Explore "{selectedTopic}" Debate
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
