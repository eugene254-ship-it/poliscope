"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SnowflakeIcon as Crystal, TrendingUp, Users, AlertTriangle, Globe } from "lucide-react"

interface PredictionData {
  evolutionPrediction: {
    phase1: {
      timeframe: string
      expectedDevelopments: string[]
      newActors: string[]
      shiftingPositions: Array<{
        actor: string
        from: string
        to: string
        probability: number
      }>
    }
    phase2: any
    phase3: any
  }
  catalystEvents: Array<{
    event: string
    probability: number
    impact: string
    timeframe: string
  }>
  emergingNarratives: Array<{
    narrative: string
    ideology: string
    virality: number
    factualBasis: number
  }>
  resolutionScenarios: Array<{
    scenario: string
    probability: number
    timeline: string
    winners: string[]
    losers: string[]
  }>
}

interface GrokDebatePredictorProps {
  topic: string
  currentArguments: any[]
}

export function GrokDebatePredictor({ topic, currentArguments }: GrokDebatePredictorProps) {
  const [prediction, setPrediction] = useState<PredictionData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState("48h")

  const generatePrediction = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/grok/predict-debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          currentArguments,
          timeframe: selectedTimeframe,
        }),
      })
      const data = await response.json()
      setPrediction(data)
    } catch (error) {
      console.error("Prediction failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Crystal className="w-5 h-5 mr-2 text-electricBlue-400" />🔮 Grok Debate Evolution Predictor
        </CardTitle>
        <p className="text-gray-400 text-sm">AI-powered prediction of how this debate will evolve</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {["24h", "48h", "1week"].map((timeframe) => (
              <Button
                key={timeframe}
                size="sm"
                variant={selectedTimeframe === timeframe ? "default" : "outline"}
                className={selectedTimeframe === timeframe ? "bg-electricBlue-600" : "border-slate-600 text-gray-400"}
                onClick={() => setSelectedTimeframe(timeframe)}
              >
                {timeframe}
              </Button>
            ))}
          </div>
          <Button
            onClick={generatePrediction}
            disabled={isLoading}
            className="bg-electricBlue-600 hover:bg-electricBlue-700 text-white"
          >
            {isLoading ? "Analyzing..." : "Generate Prediction"}
          </Button>
        </div>

        {prediction && (
          <div className="space-y-6">
            {/* Evolution Phases */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Predicted Evolution Phases
              </h3>
              <div className="grid gap-4">
                {Object.entries(prediction.evolutionPrediction).map(([phase, data]: [string, any]) => (
                  <Card key={phase} className="bg-slate-900 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white capitalize">{phase}</h4>
                        <Badge variant="outline" className="border-electricBlue-500 text-electricBlue-400">
                          {data.timeframe}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Expected Developments:</p>
                          <ul className="text-sm text-gray-300 ml-4">
                            {data.expectedDevelopments.map((dev: string, i: number) => (
                              <li key={i}>• {dev}</li>
                            ))}
                          </ul>
                        </div>
                        {data.newActors.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-400 mb-1">New Actors:</p>
                            <div className="flex flex-wrap gap-1">
                              {data.newActors.map((actor: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs border-green-500 text-green-400">
                                  {actor}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Catalyst Events */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Potential Catalyst Events
              </h3>
              <div className="space-y-3">
                {prediction.catalystEvents.map((event, index) => (
                  <Card key={index} className="bg-slate-900 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-white text-sm flex-1">{event.event}</p>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              event.impact === "high"
                                ? "border-red-500 text-red-400"
                                : event.impact === "medium"
                                  ? "border-yellow-500 text-yellow-400"
                                  : "border-green-500 text-green-400"
                            }`}
                          >
                            {event.impact} impact
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-400">Probability:</span>
                            <span className="text-xs text-white">{event.probability}%</span>
                          </div>
                          <Progress value={event.probability} className="h-2" />
                        </div>
                        <Badge variant="outline" className="text-xs border-electricBlue-500 text-electricBlue-400">
                          {event.timeframe}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Emerging Narratives */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Emerging Narratives
              </h3>
              <div className="space-y-3">
                {prediction.emergingNarratives.map((narrative, index) => (
                  <Card key={index} className="bg-slate-900 border-slate-600">
                    <CardContent className="p-4">
                      <p className="text-white text-sm mb-3">{narrative.narrative}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              narrative.ideology === "left"
                                ? "border-red-500 text-red-400"
                                : narrative.ideology === "right"
                                  ? "border-blue-500 text-blue-400"
                                  : "border-purple-500 text-purple-400"
                            }`}
                          >
                            {narrative.ideology}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Viral Potential:</span>
                            <Progress value={narrative.virality} className="h-2 w-16" />
                            <span className="text-xs text-white">{narrative.virality}%</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Factual:</span>
                          <Progress value={narrative.factualBasis} className="h-2 w-16" />
                          <span className="text-xs text-white">{narrative.factualBasis}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Resolution Scenarios */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Resolution Scenarios
              </h3>
              <div className="space-y-3">
                {prediction.resolutionScenarios.map((scenario, index) => (
                  <Card key={index} className="bg-slate-900 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <p className="text-white text-sm flex-1">{scenario.scenario}</p>
                        <div className="flex items-center gap-2 ml-4">
                          <Progress value={scenario.probability} className="h-2 w-20" />
                          <span className="text-xs text-white">{scenario.probability}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs border-electricBlue-500 text-electricBlue-400">
                          {scenario.timeline}
                        </Badge>
                        <div className="flex gap-2">
                          {scenario.winners.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-green-400">Winners:</span>
                              <span className="text-xs text-white">{scenario.winners.join(", ")}</span>
                            </div>
                          )}
                          {scenario.losers.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-red-400">Losers:</span>
                              <span className="text-xs text-white">{scenario.losers.join(", ")}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
