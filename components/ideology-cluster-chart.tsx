"use client"

import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { x: 20, y: 30, ideology: "Progressive", size: 120, topic: "Healthcare" },
  { x: 50, y: 50, ideology: "Centrist", size: 80, topic: "Education" },
  { x: 80, y: 40, ideology: "Conservative", size: 100, topic: "Economy" },
  { x: 15, y: 70, ideology: "Socialist", size: 60, topic: "Labor" },
  { x: 85, y: 20, ideology: "Libertarian", size: 90, topic: "Regulation" },
  { x: 45, y: 75, ideology: "Green", size: 70, topic: "Environment" },
  { x: 75, y: 60, ideology: "Populist", size: 110, topic: "Immigration" },
]

export function IdeologyClusterChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 100]}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            label={{
              value: "Economic Axis",
              position: "insideBottom",
              offset: -5,
              style: { textAnchor: "middle", fill: "#9CA3AF" },
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 100]}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            label={{
              value: "Social Axis",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "#9CA3AF" },
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-white">
                    <p className="font-semibold">{data.ideology}</p>
                    <p className="text-sm text-gray-300">Topic: {data.topic}</p>
                    <p className="text-sm text-electricBlue-400">Influence: {data.size}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Scatter dataKey="size" fill="#007FFF" fillOpacity={0.7} stroke="#00BCD4" strokeWidth={2} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
