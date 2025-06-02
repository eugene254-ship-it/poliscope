"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DebateVisualizerProps {
  topic: string
  timelinePosition: number
  selectedFilter: string
  onArgumentSelect: (argument: any) => void
}

export function DebateVisualizer({ topic, timelinePosition, selectedFilter, onArgumentSelect }: DebateVisualizerProps) {
  const [debateArguments, setDebateArguments] = useState<any[]>([])

  useEffect(() => {
    // Simulate dynamic arguments based on timeline position
    const baseArguments = [
      {
        id: 1,
        text: "AI regulation must prioritize innovation while ensuring safety standards.",
        author: "Tech Policy Expert",
        ideology: "center",
        emotion: "hope",
        biasScore: 25,
        fallacy: null,
        timestamp: 20,
        x: 30,
        y: 40,
      },
      {
        id: 2,
        text: "Unchecked AI development poses existential risks to humanity.",
        author: "Safety Researcher",
        ideology: "left",
        emotion: "fear",
        biasScore: 45,
        fallacy: "appeal to emotion",
        timestamp: 35,
        x: 15,
        y: 60,
      },
      {
        id: 3,
        text: "Market forces will naturally regulate AI better than government intervention.",
        author: "Free Market Advocate",
        ideology: "right",
        emotion: "confidence",
        biasScore: 60,
        fallacy: null,
        timestamp: 50,
        x: 75,
        y: 30,
      },
      {
        id: 4,
        text: "We need international cooperation to establish AI governance frameworks.",
        author: "UN Representative",
        ideology: "center",
        emotion: "urgency",
        biasScore: 20,
        fallacy: null,
        timestamp: 65,
        x: 50,
        y: 70,
      },
      {
        id: 5,
        text: "AI regulation will stifle American competitiveness against China.",
        author: "Industry Lobbyist",
        ideology: "right",
        emotion: "anger",
        biasScore: 75,
        fallacy: "false dilemma",
        timestamp: 80,
        x: 80,
        y: 50,
      },
    ]

    // Filter arguments based on timeline position
    const visibleArguments = baseArguments.filter((arg) => arg.timestamp <= timelinePosition)
    setDebateArguments(visibleArguments)
  }, [timelinePosition])

  const getIdeologyColor = (ideology: string) => {
    switch (ideology) {
      case "left":
        return "bg-red-500"
      case "center":
        return "bg-purple-500"
      case "right":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case "anger":
        return "border-red-500"
      case "fear":
        return "border-yellow-500"
      case "hope":
        return "border-green-500"
      case "confidence":
        return "border-blue-500"
      case "urgency":
        return "border-orange-500"
      default:
        return "border-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Main visualization area */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="relative h-96 bg-slate-900 rounded-lg overflow-hidden">
            {/* Background gradient representing ideology spectrum */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-blue-500/10"></div>

            {/* Argument bubbles */}
            {debateArguments.map((argument) => (
              <div
                key={argument.id}
                className={`absolute cursor-pointer transition-all duration-300 hover:scale-110`}
                style={{
                  left: `${argument.x}%`,
                  top: `${argument.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => onArgumentSelect(argument)}
              >
                {/* Thought orb */}
                <div
                  className={`w-12 h-12 rounded-full ${getIdeologyColor(argument.ideology)} opacity-70 flex items-center justify-center shadow-lg border-2 ${getEmotionColor(argument.emotion)}`}
                >
                  <span className="text-white text-xs font-bold">{argument.id}</span>
                </div>

                {/* Argument preview on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-xs text-white shadow-lg max-w-48">
                    <p className="font-semibold mb-1">{argument.author}</p>
                    <p className="text-gray-300">{argument.text.substring(0, 80)}...</p>
                    <div className="flex gap-1 mt-2">
                      <Badge variant="outline" className={`${getEmotionColor(argument.emotion)} text-xs`}>
                        {argument.emotion}
                      </Badge>
                      {argument.fallacy && (
                        <Badge variant="outline" className="border-orange-500 text-orange-400 text-xs">
                          {argument.fallacy}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Connection lines between related arguments */}
            <svg className="absolute inset-0 pointer-events-none">
              {debateArguments.map((arg1, i) =>
                debateArguments.slice(i + 1).map((arg2, j) => {
                  if (Math.abs(arg1.timestamp - arg2.timestamp) < 30) {
                    return (
                      <line
                        key={`${arg1.id}-${arg2.id}`}
                        x1={`${arg1.x}%`}
                        y1={`${arg1.y}%`}
                        x2={`${arg2.x}%`}
                        y2={`${arg2.y}%`}
                        stroke="rgba(59, 130, 246, 0.3)"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                      />
                    )
                  }
                  return null
                }),
              )}
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Argument list */}
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold text-white">Current Arguments ({debateArguments.length})</h3>
        {debateArguments.map((argument) => (
          <Card
            key={argument.id}
            className="bg-slate-800/50 border-slate-700 cursor-pointer hover:bg-slate-700/50 transition-colors"
            onClick={() => onArgumentSelect(argument)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full ${getIdeologyColor(argument.ideology)} flex items-center justify-center text-white text-sm font-bold`}
                >
                  {argument.id}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-white">{argument.author}</span>
                    <Badge variant="outline" className={`${getEmotionColor(argument.emotion)} text-xs`}>
                      {argument.emotion}
                    </Badge>
                    {argument.fallacy && (
                      <Badge variant="outline" className="border-orange-500 text-orange-400 text-xs">
                        {argument.fallacy}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm">{argument.text}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>Bias Score: {argument.biasScore}%</span>
                    <span>Timeline: {argument.timestamp}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
