"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Zap, Target, Shield } from "lucide-react"

interface EnhancedAnalysis {
  ideologicalMapping: {
    primaryIdeology: string
    secondaryInfluences: string[]
    spectrumPosition: { economic: number; social: number }
    confidence: number
  }
  rhetoricalAnalysis: {
    techniques: string[]
    fallacies: Array<{ type: string; severity: string; explanation: string }>
    persuasionTactics: string[]
    targetAudience: string
  }
  emotionalProfile: {
    primaryEmotion: string
    intensity: number
    triggers: string[]
    manipulation: { detected: boolean; techniques: string[] }
  }
  predictiveInsights: {
    likelyResponses: string[]
    debateEvolution: string
    polarizationRisk: number
  }
  recommendations: {
    strengthenArgument: string[]
    addressWeaknesses: string[]
    bridgeBuilding: string[]
  }
}

interface GrokEnhancedAnalysisProps {
  argument: string
  context: string
}

export function GrokEnhancedAnalysis({ argument, context }: GrokEnhancedAnalysisProps) {
  const [analysis, setAnalysis] = useState<EnhancedAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const analyzeArgument = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/grok/analyze-argument", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ argument, context }),
      })
      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!analysis) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="w-5 h-5 mr-2 text-electricBlue-400" />🧠 Grok Enhanced Analysis
          </CardTitle>
          <p className="text-gray-400 text-sm">Deep multi-dimensional argument analysis</p>
        </CardHeader>
        <CardContent>
          <Button
            onClick={analyzeArgument}
            disabled={isLoading}
            className="w-full bg-electricBlue-600 hover:bg-electricBlue-700 text-white"
          >
            {isLoading ? "Analyzing with Grok..." : "Analyze Argument"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Ideological Mapping */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2 text-electricBlue-400" />
            Ideological Mapping
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Primary Ideology</p>
              <Badge variant="outline" className="border-electricBlue-500 text-electricBlue-400">
                {analysis.ideologicalMapping.primaryIdeology}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Confidence</p>
              <div className="flex items-center gap-2">
                <Progress value={analysis.ideologicalMapping.confidence} className="h-2 flex-1" />
                <span className="text-sm text-white">{analysis.ideologicalMapping.confidence}%</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">Secondary Influences</p>
            <div className="flex flex-wrap gap-2">
              {analysis.ideologicalMapping.secondaryInfluences.map((influence, index) => (
                <Badge key={index} variant="outline" className="text-xs border-purple-500 text-purple-400">
                  {influence}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Economic Position</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-400">Left</span>
                <div className="flex-1 bg-slate-700 rounded-full h-2 relative">
                  <div
                    className="absolute top-0 w-1 h-2 bg-electricBlue-500 rounded-full"
                    style={{ left: `${(analysis.ideologicalMapping.spectrumPosition.economic + 100) / 2}%` }}
                  />
                </div>
                <span className="text-xs text-blue-400">Right</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Social Position</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-400">Liberal</span>
                <div className="flex-1 bg-slate-700 rounded-full h-2 relative">
                  <div
                    className="absolute top-0 w-1 h-2 bg-electricBlue-500 rounded-full"
                    style={{ left: `${(analysis.ideologicalMapping.spectrumPosition.social + 100) / 2}%` }}
                  />
                </div>
                <span className="text-xs text-blue-400">Conservative</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rhetorical Analysis */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="w-5 h-5 mr-2 text-electricBlue-400" />
            Rhetorical Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">Persuasion Techniques</p>
            <div className="flex flex-wrap gap-2">
              {analysis.rhetoricalAnalysis.techniques.map((technique, index) => (
                <Badge key={index} variant="outline" className="text-xs border-green-500 text-green-400">
                  {technique}
                </Badge>
              ))}
            </div>
          </div>

          {analysis.rhetoricalAnalysis.fallacies.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Detected Fallacies</p>
              <div className="space-y-2">
                {analysis.rhetoricalAnalysis.fallacies.map((fallacy, index) => (
                  <Card key={index} className="bg-slate-900 border-slate-600">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            fallacy.severity === "high"
                              ? "border-red-500 text-red-400"
                              : fallacy.severity === "medium"
                                ? "border-yellow-500 text-yellow-400"
                                : "border-orange-500 text-orange-400"
                          }`}
                        >
                          {fallacy.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {fallacy.severity} severity
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-300">{fallacy.explanation}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-400 mb-1">Target Audience</p>
            <p className="text-sm text-white">{analysis.rhetoricalAnalysis.targetAudience}</p>
          </div>
        </CardContent>
      </Card>

      {/* Emotional Profile */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-electricBlue-400" />
            Emotional Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Primary Emotion</p>
              <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                {analysis.emotionalProfile.primaryEmotion}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Intensity</p>
              <div className="flex items-center gap-2">
                <Progress value={analysis.emotionalProfile.intensity} className="h-2 flex-1" />
                <span className="text-sm text-white">{analysis.emotionalProfile.intensity}%</span>
              </div>
            </div>
          </div>

          {analysis.emotionalProfile.manipulation.detected && (
            <Card className="bg-red-900/20 border-red-500/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-red-400">Manipulation Detected</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {analysis.emotionalProfile.manipulation.techniques.map((technique, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-red-500 text-red-400">
                      {technique}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <p className="text-sm text-gray-400 mb-2">Emotional Triggers</p>
            <div className="flex flex-wrap gap-2">
              {analysis.emotionalProfile.triggers.map((trigger, index) => (
                <Badge key={index} variant="outline" className="text-xs border-yellow-500 text-yellow-400">
                  {trigger}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predictive Insights */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="w-5 h-5 mr-2 text-electricBlue-400" />
            Predictive Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Debate Evolution</p>
            <p className="text-sm text-white">{analysis.predictiveInsights.debateEvolution}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Polarization Risk</p>
            <div className="flex items-center gap-2">
              <Progress value={analysis.predictiveInsights.polarizationRisk} className="h-2 flex-1" />
              <span className="text-sm text-white">{analysis.predictiveInsights.polarizationRisk}%</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">Likely Responses</p>
            <ul className="text-sm text-gray-300 space-y-1">
              {analysis.predictiveInsights.likelyResponses.map((response, index) => (
                <li key={index}>• {response}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2 text-electricBlue-400" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">Strengthen Argument</p>
            <ul className="text-sm text-green-300 space-y-1">
              {analysis.recommendations.strengthenArgument.map((rec, index) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">Address Weaknesses</p>
            <ul className="text-sm text-yellow-300 space-y-1">
              {analysis.recommendations.addressWeaknesses.map((rec, index) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">Bridge Building</p>
            <ul className="text-sm text-blue-300 space-y-1">
              {analysis.recommendations.bridgeBuilding.map((rec, index) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
