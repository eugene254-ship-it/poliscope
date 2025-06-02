"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface IdeologyMapProps {
  selectedFilter: string
}

export function IdeologyMap({ selectedFilter }: IdeologyMapProps) {
  const [hoveredPoint, setHoveredPoint] = useState<any>(null)

  const ideologyPoints = [
    { id: 1, x: 20, y: 30, ideology: "Progressive", topic: "Universal Healthcare", intensity: 0.8 },
    { id: 2, x: 50, y: 50, ideology: "Centrist", topic: "Moderate Reform", intensity: 0.5 },
    { id: 3, x: 80, y: 40, ideology: "Conservative", topic: "Free Market", intensity: 0.7 },
    { id: 4, x: 15, y: 70, ideology: "Socialist", topic: "Wealth Redistribution", intensity: 0.9 },
    { id: 5, x: 85, y: 20, ideology: "Libertarian", topic: "Minimal Government", intensity: 0.6 },
  ]

  const getPointColor = (ideology: string) => {
    switch (ideology) {
      case "Progressive":
      case "Socialist":
        return "bg-red-500"
      case "Centrist":
        return "bg-purple-500"
      case "Conservative":
      case "Libertarian":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      {/* Map visualization */}
      <div className="relative h-64 bg-slate-900 rounded-lg overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute border-slate-600"
              style={{
                left: `${i * 10}%`,
                top: 0,
                bottom: 0,
                borderLeft: "1px solid",
              }}
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute border-slate-600"
              style={{
                top: `${i * 10}%`,
                left: 0,
                right: 0,
                borderTop: "1px solid",
              }}
            />
          ))}
        </div>

        {/* Axis labels */}
        <div className="absolute bottom-2 left-2 text-xs text-gray-400">Economic Left</div>
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">Economic Right</div>
        <div className="absolute top-2 left-2 text-xs text-gray-400">Authoritarian</div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">Libertarian</div>

        {/* Ideology points */}
        {ideologyPoints.map((point) => (
          <div
            key={point.id}
            className={`absolute w-3 h-3 rounded-full cursor-pointer transition-all duration-200 ${getPointColor(point.ideology)} ${
              hoveredPoint?.id === point.id ? "scale-150 shadow-lg" : "hover:scale-125"
            }`}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              opacity: point.intensity,
            }}
            onMouseEnter={() => setHoveredPoint(point)}
            onMouseLeave={() => setHoveredPoint(null)}
          />
        ))}

        {/* Hover tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-10 bg-slate-800 border border-slate-600 rounded-lg p-2 text-xs text-white shadow-lg"
            style={{
              left: `${hoveredPoint.x + 5}%`,
              top: `${hoveredPoint.y - 10}%`,
            }}
          >
            <p className="font-semibold">{hoveredPoint.ideology}</p>
            <p className="text-gray-300">{hoveredPoint.topic}</p>
            <p className="text-electricBlue-400">Intensity: {(hoveredPoint.intensity * 100).toFixed(0)}%</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="border-red-500 text-red-400">
          Left
        </Badge>
        <Badge variant="outline" className="border-purple-500 text-purple-400">
          Center
        </Badge>
        <Badge variant="outline" className="border-blue-500 text-blue-400">
          Right
        </Badge>
      </div>

      {/* Filter-specific info */}
      <Card className="bg-slate-900 border-slate-700">
        <CardContent className="p-3">
          <p className="text-sm text-gray-300">
            Filtering by: <span className="text-electricBlue-400 font-semibold capitalize">{selectedFilter}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {selectedFilter === "country" && "Showing ideological distribution across different countries"}
            {selectedFilter === "time" && "Temporal evolution of ideological positions"}
            {selectedFilter === "emotion" && "Emotional intensity mapping across the spectrum"}
            {selectedFilter === "fallacy" && "Logical fallacy distribution by ideology"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
