"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { DebateVisualizer } from "@/components/debate-visualizer"
import { ArrowLeft, Play, Pause, RotateCcw, Filter, TrendingUp, Brain } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { GrokDebatePredictor } from "@/components/grok-debate-predictor"
import { InteractiveDebateCanvas } from "@/components/interactive-debate-canvas"
import { CollaborativeAnnotationSystem } from "@/components/collaborative-annotation-system"
import { GestureControlledTimeline } from "@/components/gesture-controlled-timeline"

export default function DebatePage() {
  const searchParams = useSearchParams()
  const topic = searchParams.get("topic") || "AI Regulation"
  const filter = searchParams.get("filter") || "country"

  const [timelinePosition, setTimelinePosition] = useState([50])
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("rational")
  const [selectedArgument, setSelectedArgument] = useState<any>(null)
  const [activeView, setActiveView] = useState<"visualizer" | "canvas" | "annotation" | "timeline">("visualizer")

  const filters = [
    { id: "rational", label: "Most Rational" },
    { id: "emotional", label: "Most Emotional" },
    { id: "recent", label: "Most Recent" },
    { id: "influential", label: "Most Influential" },
  ]

  const views = [
    { id: "visualizer", label: "Debate Visualizer" },
    { id: "canvas", label: "Interactive Canvas" },
    { id: "annotation", label: "Collaborative Notes" },
    { id: "timeline", label: "Gesture Timeline" },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setTimelinePosition((prev) => {
          const newPos = prev[0] + 1
          return newPos > 100 ? [0] : [newPos]
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  // Mock document text for annotation system
  const mockDocument = `
    The debate over AI regulation has intensified as artificial intelligence systems become more sophisticated and widespread. 
    
    Proponents of strict regulation argue that without proper oversight, AI systems could perpetuate bias, invade privacy, and potentially pose existential risks to humanity. They point to examples of algorithmic discrimination in hiring, lending, and criminal justice as evidence that immediate action is needed.
    
    Industry leaders, however, contend that excessive regulation could stifle innovation and put democratic nations at a disadvantage against authoritarian regimes that may not impose similar restrictions. They advocate for self-regulation and industry standards rather than government intervention.
    
    A middle ground has emerged among policy experts who propose a risk-based approach to AI governance, with different levels of oversight depending on the potential impact and application domain of the AI system.
  `

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/explore">
            <Button variant="ghost" className="text-white hover:text-electricBlue-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Explore
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white font-inter">
              Poli<span className="text-electricBlue-400">Scope</span>
            </h1>
            <p className="text-sm text-gray-400">Advanced Debate Analysis</p>
          </div>
          <Link href="/insights">
            <Button
              variant="outline"
              className="border-electricBlue-600 text-electricBlue-400 hover:bg-electricBlue-600 hover:text-white bg-transparent"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Insights
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Topic header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">🗣️ Advanced Debate Analysis</h2>
          <p className="text-xl text-gray-300 mb-4">
            Exploring <span className="text-electricBlue-400 font-semibold">"{topic}"</span> through multiple
            interaction modes
          </p>
          <p className="text-gray-400">🎮 Interactive visualizations, collaborative tools, and gesture controls</p>
        </div>

        {/* View Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-2 bg-slate-800 rounded-xl">
            {views.map((view) => (
              <Button
                key={view.id}
                variant={activeView === view.id ? "default" : "ghost"}
                className={`${
                  activeView === view.id ? "bg-electricBlue-600 text-white" : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setActiveView(view.id as any)}
              >
                {view.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Dynamic Content Based on Active View */}
        {activeView === "visualizer" && (
          <>
            {/* Controls */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Timeline Control */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center">
                    <Play className="w-4 h-4 mr-2 text-electricBlue-400" />
                    Debate Playback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Slider
                    value={timelinePosition}
                    onValueChange={setTimelinePosition}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="border-electricBlue-600 text-electricBlue-400 hover:bg-electricBlue-600 hover:text-white"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setTimelinePosition([0])}
                      className="border-slate-600 text-gray-400 hover:bg-slate-600 hover:text-white"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Filter Control */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center">
                    <Filter className="w-4 h-4 mr-2 text-electricBlue-400" />
                    Argument Filter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {filters.map((filter) => (
                      <Button
                        key={filter.id}
                        size="sm"
                        variant={selectedFilter === filter.id ? "default" : "outline"}
                        className={`${
                          selectedFilter === filter.id
                            ? "bg-electricBlue-600 text-white"
                            : "border-slate-600 text-gray-400 hover:bg-slate-600 hover:text-white"
                        }`}
                        onClick={() => setSelectedFilter(filter.id)}
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Ideology Gradient */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center">
                    <Brain className="w-4 h-4 mr-2 text-electricBlue-400" />
                    Ideology Spectrum
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Left</span>
                      <span>Center</span>
                      <span>Right</span>
                    </div>
                    <div className="h-4 rounded-full bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 opacity-70"></div>
                    <div className="flex justify-between text-xs">
                      <Badge variant="outline" className="border-red-500 text-red-400">
                        Progressive
                      </Badge>
                      <Badge variant="outline" className="border-purple-500 text-purple-400">
                        Moderate
                      </Badge>
                      <Badge variant="outline" className="border-blue-500 text-blue-400">
                        Conservative
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main debate visualization */}
            <DebateVisualizer
              topic={topic}
              timelinePosition={timelinePosition[0]}
              selectedFilter={selectedFilter}
              onArgumentSelect={setSelectedArgument}
            />
          </>
        )}

        {activeView === "canvas" && <InteractiveDebateCanvas />}

        {activeView === "annotation" && (
          <CollaborativeAnnotationSystem documentText={mockDocument} documentId={`debate-${topic}`} />
        )}

        {activeView === "timeline" && <GestureControlledTimeline />}

        {/* Grok Debate Predictor - Always visible */}
        <div className="mt-8">
          <GrokDebatePredictor topic={topic} currentArguments={[]} />
        </div>

        {/* Selected argument details */}
        {selectedArgument && (
          <Card className="mt-6 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Argument Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Emotional Tone</p>
                  <Badge
                    variant="outline"
                    className={`${
                      selectedArgument.emotion === "anger"
                        ? "border-red-500 text-red-400"
                        : selectedArgument.emotion === "hope"
                          ? "border-green-500 text-green-400"
                          : "border-yellow-500 text-yellow-400"
                    }`}
                  >
                    {selectedArgument.emotion}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Bias Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-electricBlue-500 h-2 rounded-full"
                        style={{ width: `${selectedArgument.biasScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-white">{selectedArgument.biasScore}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Fallacy Detected</p>
                  <Badge variant="outline" className="border-orange-500 text-orange-400">
                    {selectedArgument.fallacy || "None"}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Argument Tree</p>
                <div className="bg-slate-900 p-4 rounded-lg">
                  <p className="text-white text-sm">{selectedArgument.text}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
