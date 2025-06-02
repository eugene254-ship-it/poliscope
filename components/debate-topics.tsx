"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Clock, Globe } from "lucide-react"

interface DebateTopicsProps {
  selectedFilter: string
  onTopicSelect: (topic: string) => void
  selectedTopic: string
}

export function DebateTopics({ selectedFilter, onTopicSelect, selectedTopic }: DebateTopicsProps) {
  const topics = [
    {
      title: "AI Regulation",
      description: "Global governance of artificial intelligence",
      participants: 1247,
      trending: true,
      countries: ["US", "EU", "China"],
      lastActivity: "2 hours ago",
    },
    {
      title: "Climate Policy",
      description: "Carbon reduction and environmental legislation",
      participants: 892,
      trending: true,
      countries: ["Global"],
      lastActivity: "1 hour ago",
    },
    {
      title: "Free Speech Online",
      description: "Digital platform content moderation",
      participants: 634,
      trending: false,
      countries: ["US", "UK"],
      lastActivity: "4 hours ago",
    },
    {
      title: "Healthcare Reform",
      description: "Universal healthcare and medical access",
      participants: 567,
      trending: false,
      countries: ["US", "Canada"],
      lastActivity: "6 hours ago",
    },
    {
      title: "Economic Inequality",
      description: "Wealth distribution and social mobility",
      participants: 423,
      trending: true,
      countries: ["Global"],
      lastActivity: "3 hours ago",
    },
    {
      title: "Immigration Policy",
      description: "Border control and refugee assistance",
      participants: 789,
      trending: false,
      countries: ["US", "EU"],
      lastActivity: "5 hours ago",
    },
  ]

  return (
    <div className="space-y-4">
      {topics.map((topic, index) => (
        <Card
          key={index}
          className={`cursor-pointer transition-all duration-200 ${
            selectedTopic === topic.title
              ? "bg-electricBlue-900/30 border-electricBlue-500"
              : "bg-slate-900 border-slate-700 hover:bg-slate-800"
          }`}
          onClick={() => onTopicSelect(topic.title)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{topic.title}</h3>
                  {topic.trending && (
                    <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-2">{topic.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{topic.participants.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span>{topic.countries.join(", ")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{topic.lastActivity}</span>
                </div>
              </div>
            </div>

            {/* Filter-specific metadata */}
            {selectedFilter === "emotion" && (
              <div className="mt-2 flex gap-1">
                <Badge variant="outline" className="border-red-500 text-red-400 text-xs">
                  Anger: 34%
                </Badge>
                <Badge variant="outline" className="border-yellow-500 text-yellow-400 text-xs">
                  Fear: 28%
                </Badge>
                <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                  Hope: 38%
                </Badge>
              </div>
            )}

            {selectedFilter === "fallacy" && (
              <div className="mt-2 flex gap-1">
                <Badge variant="outline" className="border-orange-500 text-orange-400 text-xs">
                  Ad Hominem: 12%
                </Badge>
                <Badge variant="outline" className="border-purple-500 text-purple-400 text-xs">
                  Strawman: 8%
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
