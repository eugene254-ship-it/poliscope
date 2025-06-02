"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const data = [
  { phrase: "Innovation", left: 45, right: 25 },
  { phrase: "Regulation", left: 75, right: 35 },
  { phrase: "Freedom", left: 20, right: 80 },
  { phrase: "Safety", left: 85, right: 40 },
  { phrase: "Competition", left: 30, right: 70 },
  { phrase: "Ethics", left: 90, right: 45 },
  { phrase: "Progress", left: 60, right: 55 },
]

export function PhraseComparisonChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis type="number" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
          <YAxis type="category" dataKey="phrase" tick={{ fill: "#9CA3AF", fontSize: 12 }} width={80} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
              color: "#ffffff",
            }}
          />
          <Legend />
          <Bar dataKey="left" fill="#EF4444" name="Left Usage" radius={[0, 4, 4, 0]} />
          <Bar dataKey="right" fill="#3B82F6" name="Right Usage" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
