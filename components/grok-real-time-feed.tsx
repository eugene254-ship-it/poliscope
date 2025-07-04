"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, Users, Zap, Globe, Clock } from "lucide-react"

interface RealTimeUpdate {
  type: string
  topic: string
  development?: string
  impact?: string
  ideology?: string
  urgency: "low" | "medium" | "high" | "breaking"
  timestamp: string
  sources?: string[]
  predictions?: string[]
  from?: any
  to?: any
  cause?: string
  actor?: string
  position?: string
  influence?: number
  claim?: string
  status?: string
  evidence?: string
}

export function GrokRealTimeFeed() {
  const [updates, setUpdates] = useState<RealTimeUpdate[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [selectedTopics, setSelectedTopics] = useState(["AI regulation", "Climate policy", "Immigration"])

  useEffect(() => {
    const eventSource = new EventSource(`/api/grok/real-time-monitor?topics=${selectedTopics.join(",")}`)

    eventSource.onopen = () => {
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data)
        setUpdates((prev) => [update, ...prev.slice(0, 49)]) // Keep last 50 updates
      } catch (error) {
        console.error("Failed to parse update:", error)
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
    }

    return () => {
      eventSource.close()
    }
  }, [selectedTopics])

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "breaking":
        return "border-red-500 text-red-400 bg-red-500/10"
      case "high":
        return "border-orange-500 text-orange-400 bg-orange-500/10"
      case "medium":
        return "border-yellow-500 text-yellow-400 bg-yellow-500/10"
      default:
        return "border-green-500 text-green-400 bg-green-500/10"
    }
  }

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "update":
        return <TrendingUp className="w-4 h-4" />
      case "sentiment_shift":
        return <Zap className="w-4 h-4" />
      case "new_actor":
        return <Users className="w-4 h-4" />
      case "fact_check":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Globe className="w-5 h-5 mr-2 text-electricBlue-400" />🤖 Grok Real-Time Global Monitor
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-sm text-gray-400">{isConnected ? "Live" : "Disconnected"}</span>
          </div>
        </CardTitle>
        <p className="text-gray-400 text-sm">AI-powered real-time analysis of global political developments</p>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {updates.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Connecting to global political intelligence...</p>
          </div>
        ) : (
          updates.map((update, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${getUrgencyColor(update.urgency)} transition-all duration-300`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{getUpdateIcon(update.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {update.topic}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getUrgencyColor(update.urgency)}`}>
                      {update.urgency.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(update.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  {update.type === "update" && (
                    <div>
                      <p className="text-white text-sm mb-1">{update.development}</p>
                      <p className="text-gray-300 text-xs">{update.impact}</p>
                      {update.predictions && (
                        <div className="mt-2">
                          <p className="text-xs text-electricBlue-400">Predictions:</p>
                          <ul className="text-xs text-gray-300 ml-2">
                            {update.predictions.map((pred, i) => (
                              <li key={i}>• {pred}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {update.type === "sentiment_shift" && (
                    <div>
                      <p className="text-white text-sm mb-1">Sentiment shift detected</p>
                      <p className="text-gray-300 text-xs">{update.cause}</p>
                      <div className="flex gap-4 mt-2 text-xs">
                        <div>
                          <span className="text-gray-400">Before:</span>
                          <span className="text-red-400 ml-1">😠{update.from?.anger}</span>
                          <span className="text-yellow-400 ml-1">😨{update.from?.fear}</span>
                          <span className="text-green-400 ml-1">🙂{update.from?.hope}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">After:</span>
                          <span className="text-red-400 ml-1">😠{update.to?.anger}</span>
                          <span className="text-yellow-400 ml-1">😨{update.to?.fear}</span>
                          <span className="text-green-400 ml-1">🙂{update.to?.hope}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {update.type === "new_actor" && (
                    <div>
                      <p className="text-white text-sm mb-1">
                        New voice: <strong>{update.actor}</strong>
                      </p>
                      <p className="text-gray-300 text-xs">{update.position}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {update.ideology}
                        </Badge>
                        <span className="text-xs text-electricBlue-400">Influence: {update.influence}%</span>
                      </div>
                    </div>
                  )}

                  {update.type === "fact_check" && (
                    <div>
                      <p className="text-white text-sm mb-1">Fact Check Alert</p>
                      <p className="text-gray-300 text-xs mb-1">"{update.claim}"</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            update.status === "verified"
                              ? "border-green-500 text-green-400"
                              : update.status === "disputed"
                                ? "border-yellow-500 text-yellow-400"
                                : "border-red-500 text-red-400"
                          }`}
                        >
                          {update.status?.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{update.evidence}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
