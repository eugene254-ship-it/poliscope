"use client"

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const data = [
  { time: "00:00", positive: 45, negative: 30, neutral: 25 },
  { time: "04:00", positive: 52, negative: 28, neutral: 20 },
  { time: "08:00", positive: 38, negative: 45, neutral: 17 },
  { time: "12:00", positive: 42, negative: 35, neutral: 23 },
  { time: "16:00", positive: 48, negative: 32, neutral: 20 },
  { time: "20:00", positive: 55, negative: 25, neutral: 20 },
  { time: "24:00", positive: 50, negative: 30, neutral: 20 },
]

export function SentimentTimeChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
          <YAxis
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            label={{
              value: "Sentiment %",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "#9CA3AF" },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
              color: "#ffffff",
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="positive" stroke="#10B981" strokeWidth={2} name="Positive" />
          <Line type="monotone" dataKey="negative" stroke="#EF4444" strokeWidth={2} name="Negative" />
          <Line type="monotone" dataKey="neutral" stroke="#6B7280" strokeWidth={2} name="Neutral" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
