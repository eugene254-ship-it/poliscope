"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IdeologyClusterChart } from "@/components/ideology-cluster-chart"
import { SentimentTimeChart } from "@/components/sentiment-time-chart"
import { PhraseComparisonChart } from "@/components/phrase-comparison-chart"
import { BiasFallacyChart } from "@/components/bias-fallacy-chart"
import { ArrowLeft, Download, Share, Zap } from "lucide-react"
import Link from "next/link"

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/debate">
            <Button variant="ghost" className="text-white hover:text-electricBlue-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Debate
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white font-inter">
            Poli<span className="text-electricBlue-400">Scope</span> Insights
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-electricBlue-600 text-electricBlue-400 hover:bg-electricBlue-600 hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-gray-400 hover:bg-slate-600 hover:text-white"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Main prompt */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">📊 Insights Dashboard</h2>
          <p className="text-xl text-gray-300 mb-2">
            💡 "These are the dominant narratives around this issue. Want to compare?"
          </p>
          <p className="text-gray-400">Deep dive into the ideological patterns and rhetorical structures</p>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Ideology Map Cluster */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">🧭 Ideology Map Cluster</CardTitle>
              <p className="text-gray-400 text-sm">How different ideological groups cluster around key arguments</p>
            </CardHeader>
            <CardContent>
              <IdeologyClusterChart />
            </CardContent>
          </Card>

          {/* Sentiment Over Time */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">📈 Sentiment Over Time</CardTitle>
              <p className="text-gray-400 text-sm">Emotional trajectory of the debate across different periods</p>
            </CardHeader>
            <CardContent>
              <SentimentTimeChart />
            </CardContent>
          </Card>

          {/* Most Used Phrases */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">💬 Most Used Phrases (Left vs. Right)</CardTitle>
              <p className="text-gray-400 text-sm">Comparative analysis of language patterns across the spectrum</p>
            </CardHeader>
            <CardContent>
              <PhraseComparisonChart />
            </CardContent>
          </Card>

          {/* AI Bias Detected */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">🤖 AI Bias Detected</CardTitle>
              <p className="text-gray-400 text-sm">Fallacies, appeals, and deflections identified by AI analysis</p>
            </CardHeader>
            <CardContent>
              <BiasFallacyChart />
            </CardContent>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          <Button size="lg" className="bg-electricBlue-600 hover:bg-electricBlue-700 text-white px-6 py-3 rounded-xl">
            🔁 Compare Countries
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-electricBlue-600 text-electricBlue-400 hover:bg-electricBlue-600 hover:text-white px-6 py-3 rounded-xl"
          >
            📄 Export Summary
          </Button>
          <Link href="/contribute">
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-gray-300 hover:bg-slate-600 hover:text-white px-6 py-3 rounded-xl"
            >
              <Zap className="w-4 h-4 mr-2" />🧠 Challenge an Argument
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
