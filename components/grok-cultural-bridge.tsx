"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Globe, BracketsIcon as Bridge, AlertTriangle, CheckCircle } from "lucide-react"

interface CulturalBridge {
  culturalTranslation: {
    directTranslation: string
    culturallyAdapted: string
    keyAdaptations: Array<{
      original: string
      adapted: string
      reason: string
    }>
  }
  bridgingStrategies: {
    commonGround: string[]
    framingAdjustments: string[]
    examplesAndAnalogies: Array<{
      concept: string
      sourceExample: string
      targetExample: string
    }>
  }
  effectivenessMetrics: {
    persuasionPotential: number
    offenseRisk: number
    clarityScore: number
    culturalAuthenticity: number
  }
  recommendations: {
    beforeEngaging: string[]
    duringDiscussion: string[]
    followUp: string[]
  }
}

export function GrokCulturalBridge() {
  const [argument, setArgument] = useState("")
  const [sourceCulture, setSourceCulture] = useState("")
  const [targetCulture, setTargetCulture] = useState("")
  const [bridge, setBridge] = useState<CulturalBridge | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const cultures = [
    "American",
    "British",
    "German",
    "French",
    "Japanese",
    "Chinese",
    "Indian",
    "Brazilian",
    "Russian",
    "Middle Eastern",
    "Scandinavian",
    "African",
    "Latin American",
    "Southeast Asian",
  ]

  const buildBridge = async () => {
    if (!argument || !sourceCulture || !targetCulture) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/grok/cultural-bridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ argument, sourceCulture, targetCulture }),
      })
      const data = await response.json()
      setBridge(data)
    } catch (error) {
      console.error("Cultural bridge failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Bridge className="w-5 h-5 mr-2 text-electricBlue-400" />🌍 Grok Cultural Bridge Builder
        </CardTitle>
        <p className="text-gray-400 text-sm">Translate political arguments across cultural contexts</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="space-y-4">
          <div>
            <label className="text-white text-sm mb-2 block">Political Argument</label>
            <Textarea
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder="Enter the political argument you want to translate across cultures..."
              className="bg-slate-900 border-slate-600 text-white min-h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white text-sm mb-2 block">Source Culture</label>
              <Select value={sourceCulture} onValueChange={setSourceCulture}>
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="Select source culture" />
                </SelectTrigger>
                <SelectContent>
                  {cultures.map((culture) => (
                    <SelectItem key={culture} value={culture}>
                      {culture}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Target Culture</label>
              <Select value={targetCulture} onValueChange={setTargetCulture}>
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="Select target culture" />
                </SelectTrigger>
                <SelectContent>
                  {cultures.map((culture) => (
                    <SelectItem key={culture} value={culture}>
                      {culture}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={buildBridge}
            disabled={isLoading || !argument || !sourceCulture || !targetCulture}
            className="w-full bg-electricBlue-600 hover:bg-electricBlue-700 text-white"
          >
            {isLoading ? "Building Cultural Bridge..." : "Build Cultural Bridge"}
          </Button>
        </div>

        {bridge && (
          <div className="space-y-6">
            {/* Cultural Translation */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Cultural Translation
              </h3>
              <div className="space-y-4">
                <Card className="bg-slate-900 border-slate-600">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-semibold text-electricBlue-400 mb-2">Direct Translation</h4>
                    <p className="text-gray-300 text-sm">{bridge.culturalTranslation.directTranslation}</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-600">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-semibold text-green-400 mb-2">Culturally Adapted Version</h4>
                    <p className="text-white text-sm">{bridge.culturalTranslation.culturallyAdapted}</p>
                  </CardContent>
                </Card>

                {bridge.culturalTranslation.keyAdaptations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Key Adaptations</h4>
                    <div className="space-y-2">
                      {bridge.culturalTranslation.keyAdaptations.map((adaptation, index) => (
                        <Card key={index} className="bg-slate-900 border-slate-600">
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <div className="flex gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs border-red-400 text-red-400">
                                    Original
                                  </Badge>
                                  <span className="text-sm text-gray-300">"{adaptation.original}"</span>
                                </div>
                                <div className="flex gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs border-green-400 text-green-400">
                                    Adapted
                                  </Badge>
                                  <span className="text-sm text-white">"{adaptation.adapted}"</span>
                                </div>
                                <p className="text-xs text-gray-400">{adaptation.reason}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Effectiveness Metrics */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Effectiveness Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(bridge.effectivenessMetrics).map(([metric, value]) => (
                  <Card key={metric} className="bg-slate-900 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300 capitalize">
                          {metric.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="text-sm text-white">{value}%</span>
                      </div>
                      <Progress
                        value={value}
                        className={`h-2 ${
                          metric === "offenseRisk"
                            ? value > 70
                              ? "text-red-500"
                              : value > 40
                                ? "text-yellow-500"
                                : "text-green-500"
                            : value > 70
                              ? "text-green-500"
                              : value > 40
                                ? "text-yellow-500"
                                : "text-red-500"
                        }`}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Bridging Strategies */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Bridge className="w-4 h-4 mr-2" />
                Bridging Strategies
              </h3>
              <div className="space-y-4">
                <Card className="bg-slate-900 border-slate-600">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-semibold text-green-400 mb-2">Common Ground</h4>
                    <div className="flex flex-wrap gap-2">
                      {bridge.bridgingStrategies.commonGround.map((ground, index) => (
                        <Badge key={index} variant="outline" className="border-green-500 text-green-400">
                          {ground}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-600">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-semibold text-electricBlue-400 mb-2">Framing Adjustments</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {bridge.bridgingStrategies.framingAdjustments.map((adjustment, index) => (
                        <li key={index}>• {adjustment}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Engagement Recommendations
              </h3>
              <div className="grid gap-4">
                {Object.entries(bridge.recommendations).map(([phase, recommendations]) => (
                  <Card key={phase} className="bg-slate-900 border-slate-600">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-semibold text-white mb-2 capitalize">
                        {phase.replace(/([A-Z])/g, " $1").trim()}
                      </h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {recommendations.map((rec: string, index: number) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
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
