"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

const fallacyData = [
  { name: "Ad Hominem", value: 25, color: "#EF4444" },
  { name: "Strawman", value: 20, color: "#F97316" },
  { name: "Appeal to Emotion", value: 18, color: "#EAB308" },
  { name: "False Dilemma", value: 15, color: "#22C55E" },
  { name: "Appeal to Authority", value: 12, color: "#3B82F6" },
  { name: "Other", value: 10, color: "#8B5CF6" },
]

const biasData = [
  { name: "Confirmation Bias", value: 30, color: "#DC2626" },
  { name: "Selection Bias", value: 25, color: "#EA580C" },
  { name: "Anchoring Bias", value: 20, color: "#CA8A04" },
  { name: "Availability Bias", value: 15, color: "#16A34A" },
  { name: "Other", value: 10, color: "#2563EB" },
]

export function BiasFallacyChart() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-64">
      {/* Fallacies */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-2 text-center">Logical Fallacies</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={fallacyData}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {fallacyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
                color: "#ffffff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Biases */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-2 text-center">Cognitive Biases</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={biasData} cx="50%" cy="50%" innerRadius={30} outerRadius={80} paddingAngle={2} dataKey="value">
              {biasData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
                color: "#ffffff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
