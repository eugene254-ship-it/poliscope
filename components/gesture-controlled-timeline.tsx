"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Volume2 } from "lucide-react"

interface TimelineEvent {
  id: string
  timestamp: number
  title: string
  description: string
  type: "argument" | "response" | "fact-check" | "shift"
  ideology: "left" | "center" | "right"
  intensity: number
  participants: string[]
}

export function GestureControlledTimeline() {
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [volume, setVolume] = useState(0.7)
  const [isDragging, setIsDragging] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panOffset, setPanOffset] = useState(0)
  const [gestureStartPos, setGestureStartPos] = useState<{ x: number; y: number } | null>(null)
  const [lastTouchDistance, setLastTouchDistance] = useState(0)

  const timelineRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const maxTime = 100

  // Mock timeline events
  const events: TimelineEvent[] = [
    {
      id: "1",
      timestamp: 10,
      title: "Opening Statement",
      description: "Tech industry representative presents initial position on AI regulation",
      type: "argument",
      ideology: "right",
      intensity: 0.7,
      participants: ["Tech CEO"],
    },
    {
      id: "2",
      timestamp: 25,
      title: "Counter-Argument",
      description: "Ethics researcher challenges industry position with safety concerns",
      type: "response",
      ideology: "left",
      intensity: 0.8,
      participants: ["Ethics Researcher"],
    },
    {
      id: "3",
      timestamp: 40,
      title: "Fact Check",
      description: "Statistical claims verified by independent analysis",
      type: "fact-check",
      ideology: "center",
      intensity: 0.5,
      participants: ["Fact Checker"],
    },
    {
      id: "4",
      timestamp: 60,
      title: "Ideological Shift",
      description: "Moderate position emerges as compromise solution",
      type: "shift",
      ideology: "center",
      intensity: 0.9,
      participants: ["Policy Expert", "Mediator"],
    },
    {
      id: "5",
      timestamp: 85,
      title: "Final Response",
      description: "Industry acknowledges concerns and proposes self-regulation framework",
      type: "response",
      ideology: "right",
      intensity: 0.6,
      participants: ["Tech CEO", "Industry Coalition"],
    },
  ]

  // Gesture handling for touch devices
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - start dragging
      setGestureStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY })
      setIsDragging(true)
    } else if (e.touches.length === 2) {
      // Two finger touch - start pinch/zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      )
      setLastTouchDistance(distance)
    }
  }, [])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()

      if (e.touches.length === 1 && gestureStartPos && isDragging) {
        // Single finger drag - scrub timeline
        const deltaX = e.touches[0].clientX - gestureStartPos.x
        const timelineBounds = timelineRef.current?.getBoundingClientRect()

        if (timelineBounds) {
          const timelineWidth = timelineBounds.width
          const timeDelta = (deltaX / timelineWidth) * maxTime
          const newTime = Math.max(0, Math.min(maxTime, currentTime + timeDelta))
          setCurrentTime(newTime)
          setGestureStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY })
        }
      } else if (e.touches.length === 2) {
        // Two finger pinch - zoom
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        )

        if (lastTouchDistance > 0) {
          const scale = distance / lastTouchDistance
          const newZoom = Math.max(0.5, Math.min(3, zoomLevel * scale))
          setZoomLevel(newZoom)
        }

        setLastTouchDistance(distance)
      }
    },
    [gestureStartPos, isDragging, currentTime, lastTouchDistance, zoomLevel, maxTime],
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    setGestureStartPos(null)
    setLastTouchDistance(0)
  }, [])

  // Mouse wheel for desktop zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1
        const newZoom = Math.max(0.5, Math.min(3, zoomLevel * zoomDelta))
        setZoomLevel(newZoom)
      } else {
        // Horizontal scroll for panning
        const panDelta = e.deltaX || e.deltaY
        const newPan = Math.max(-50, Math.min(50, panOffset + panDelta * 0.1))
        setPanOffset(newPan)
      }
    },
    [zoomLevel, panOffset],
  )

  // Keyboard shortcuts
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
          e.preventDefault()
          setIsPlaying(!isPlaying)
          break
        case "ArrowLeft":
          setCurrentTime(Math.max(0, currentTime - 5))
          break
        case "ArrowRight":
          setCurrentTime(Math.min(maxTime, currentTime + 5))
          break
        case "Home":
          setCurrentTime(0)
          break
        case "End":
          setCurrentTime(maxTime)
          break
        case "1":
          setPlaybackSpeed(0.5)
          break
        case "2":
          setPlaybackSpeed(1)
          break
        case "3":
          setPlaybackSpeed(2)
          break
      }
    },
    [isPlaying, currentTime, maxTime],
  )

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setCurrentTime((prev) => {
          const newTime = prev + 0.5 * playbackSpeed
          if (newTime >= maxTime) {
            setIsPlaying(false)
            return maxTime
          }
          return newTime
        })
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, playbackSpeed, maxTime])

  // Event listeners
  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline) return

    timeline.addEventListener("touchstart", handleTouchStart, { passive: false })
    timeline.addEventListener("touchmove", handleTouchMove, { passive: false })
    timeline.addEventListener("touchend", handleTouchEnd)
    timeline.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("keydown", handleKeyPress)

    return () => {
      timeline.removeEventListener("touchstart", handleTouchStart)
      timeline.removeEventListener("touchmove", handleTouchMove)
      timeline.removeEventListener("touchend", handleTouchEnd)
      timeline.removeEventListener("wheel", handleWheel)
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleWheel, handleKeyPress])

  // Get events visible in current time window
  const getVisibleEvents = () => {
    const windowSize = 20 / zoomLevel
    const windowStart = currentTime - windowSize / 2 + panOffset
    const windowEnd = currentTime + windowSize / 2 + panOffset

    return events.filter((event) => event.timestamp >= windowStart && event.timestamp <= windowEnd)
  }

  const getEventColor = (ideology: string) => {
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

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "argument":
        return "💬"
      case "response":
        return "↩️"
      case "fact-check":
        return "✅"
      case "shift":
        return "🔄"
      default:
        return "📍"
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Play className="w-5 h-5 mr-2 text-electricBlue-400" />🎮 Gesture-Controlled Timeline
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-electricBlue-500 text-electricBlue-400">
              {playbackSpeed}x speed
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              {zoomLevel.toFixed(1)}x zoom
            </Badge>
          </div>
        </CardTitle>
        <p className="text-gray-400 text-sm">
          Touch: drag to scrub, pinch to zoom | Mouse: wheel+Ctrl to zoom, wheel to pan | Keys: Space, arrows, 1-3
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Playback Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentTime(0)}
              className="border-slate-600 text-gray-400 hover:bg-slate-600 hover:text-white"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-electricBlue-600 hover:bg-electricBlue-700 text-white"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentTime(maxTime)}
              className="border-slate-600 text-gray-400 hover:bg-slate-600 hover:text-white"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCurrentTime(0)
                setZoomLevel(1)
                setPanOffset(0)
              }}
              className="border-slate-600 text-gray-400 hover:bg-slate-600 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            {/* Speed Control */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Speed:</span>
              {[0.5, 1, 1.5, 2].map((speed) => (
                <Button
                  key={speed}
                  size="sm"
                  variant={playbackSpeed === speed ? "default" : "outline"}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`${
                    playbackSpeed === speed ? "bg-electricBlue-600 text-white" : "border-slate-600 text-gray-400"
                  }`}
                >
                  {speed}x
                </Button>
              ))}
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
                className="w-16 accent-electricBlue-500"
              />
            </div>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div
          ref={timelineRef}
          className="relative bg-slate-900 rounded-lg p-4 h-64 overflow-hidden cursor-grab active:cursor-grabbing touch-none"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "center",
          }}
        >
          {/* Time Grid */}
          <div className="absolute inset-0">
            {Array.from({ length: 11 }, (_, i) => (
              <div
                key={i}
                className="absolute border-l border-slate-700 text-xs text-gray-500"
                style={{
                  left: `${i * 10 + panOffset}%`,
                  height: "100%",
                  paddingLeft: "4px",
                  paddingTop: "4px",
                }}
              >
                {i * 10}%
              </div>
            ))}
          </div>

          {/* Current Time Indicator */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-electricBlue-500 z-20"
            style={{ left: `${currentTime + panOffset}%` }}
          >
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-electricBlue-500 rounded-full" />
            <div className="absolute -top-8 -left-8 bg-electricBlue-500 text-white text-xs px-2 py-1 rounded">
              {currentTime.toFixed(1)}%
            </div>
          </div>

          {/* Timeline Events */}
          {getVisibleEvents().map((event) => (
            <div
              key={event.id}
              className="absolute cursor-pointer group"
              style={{
                left: `${event.timestamp + panOffset}%`,
                top: `${20 + event.intensity * 40}%`,
                transform: "translateX(-50%)",
              }}
            >
              {/* Event Marker */}
              <div
                className={`w-4 h-4 rounded-full ${getEventColor(event.ideology)} border-2 border-white shadow-lg transition-all duration-200 group-hover:scale-150`}
                style={{ opacity: event.intensity }}
              />

              {/* Event Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-white shadow-lg max-w-64">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                    <span className="font-semibold text-sm">{event.title}</span>
                  </div>
                  <p className="text-xs text-gray-300 mb-2">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        event.ideology === "left"
                          ? "border-red-500 text-red-400"
                          : event.ideology === "right"
                            ? "border-blue-500 text-blue-400"
                            : "border-purple-500 text-purple-400"
                      }`}
                    >
                      {event.ideology}
                    </Badge>
                    <span className="text-xs text-gray-400">{event.timestamp.toFixed(1)}%</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-xs text-gray-400">Participants: </span>
                    <span className="text-xs text-white">{event.participants.join(", ")}</span>
                  </div>
                </div>
              </div>

              {/* Intensity Wave */}
              <div
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full ${getEventColor(event.ideology)} animate-ping`}
                style={{
                  width: `${event.intensity * 32}px`,
                  height: `${event.intensity * 32}px`,
                  opacity: 0.3,
                }}
              />
            </div>
          ))}

          {/* Gesture Hints */}
          <div className="absolute bottom-4 right-4 text-xs text-gray-500">
            <p>👆 Drag to scrub</p>
            <p>🤏 Pinch to zoom</p>
            <p>🖱️ Ctrl+Wheel to zoom</p>
          </div>
        </div>

        {/* Current Event Details */}
        {(() => {
          const currentEvent = events.find((e) => Math.abs(e.timestamp - currentTime) < 2)

          if (currentEvent) {
            return (
              <Card className="bg-slate-900 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getEventTypeIcon(currentEvent.type)}</span>
                      <div>
                        <h3 className="text-white font-semibold">{currentEvent.title}</h3>
                        <p className="text-gray-400 text-sm">{currentEvent.description}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${
                        currentEvent.ideology === "left"
                          ? "border-red-500 text-red-400"
                          : currentEvent.ideology === "right"
                            ? "border-blue-500 text-blue-400"
                            : "border-purple-500 text-purple-400"
                      }`}
                    >
                      {currentEvent.ideology}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Participants: {currentEvent.participants.join(", ")}</span>
                    <span className="text-sm text-electricBlue-400">
                      Intensity: {(currentEvent.intensity * 100).toFixed(0)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          }
          return null
        })()}

        {/* Keyboard Shortcuts Help */}
        <div className="text-xs text-gray-400">
          <p>
            💡 <strong>Shortcuts:</strong> Space (play/pause), ←→ (seek), Home/End (start/end), 1-3 (speed)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
