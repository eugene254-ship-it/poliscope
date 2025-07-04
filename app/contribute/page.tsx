"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadForm } from "@/components/upload-form"
import { ArrowLeft, Upload, GraduationCap, MessageSquare, Globe } from "lucide-react"
import Link from "next/link"
import { GrokCulturalBridge } from "@/components/grok-cultural-bridge"

export default function ContributePage() {
  const [activeTab, setActiveTab] = useState("upload")

  const tabs = [
    { id: "upload", label: "Upload & Analyze", icon: Upload },
    { id: "student", label: "Student Edition", icon: GraduationCap },
    { id: "bridge", label: "Cultural Bridge", icon: Globe },
    { id: "debate", label: "Debate Live", icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/insights">
            <Button variant="ghost" className="text-white hover:text-electricBlue-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Insights
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white font-inter">
            Become a Citizen <span className="text-electricBlue-400">Analyst</span>
          </h1>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Main prompt */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">🙋 Become a Citizen Analyst</h2>
          <p className="text-xl text-gray-300 mb-4">
            ⚖️ PoliScope isn't just for spectators. It's a platform for truth-seekers, students, and challengers.
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-400">
              <div className="flex items-center justify-center">
                <span>✅ Upload a speech or transcript</span>
              </div>
              <div className="flex items-center justify-center">
                <span>✅ Generate an ideological analysis</span>
              </div>
              <div className="flex items-center justify-center">
                <span>✅ Add your own counter-arguments to test the machine</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-2 bg-slate-800 rounded-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className={`${
                    activeTab === tab.id ? "bg-electricBlue-600 text-white" : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === "upload" && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-electricBlue-400" />
                  ✍️ Upload & Analyze
                </CardTitle>
                <p className="text-gray-400">Upload a speech, transcript, or political document for AI analysis</p>
              </CardHeader>
              <CardContent>
                <UploadForm />
              </CardContent>
            </Card>
          )}

          {activeTab === "student" && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-electricBlue-400" />🎓 Student Edition
                </CardTitle>
                <p className="text-gray-400">Educational tools for students and researchers</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Research Tools</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Historical debate analysis</li>
                      <li>• Citation and source tracking</li>
                      <li>• Comparative ideology studies</li>
                      <li>• Academic paper integration</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Learning Modules</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Rhetoric and argumentation</li>
                      <li>• Bias detection training</li>
                      <li>• Political spectrum mapping</li>
                      <li>• Critical thinking exercises</li>
                    </ul>
                  </div>
                </div>
                <Button className="w-full bg-electricBlue-600 hover:bg-electricBlue-700 text-white">
                  Access Student Dashboard
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "bridge" && <GrokCulturalBridge />}

          {activeTab === "debate" && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-electricBlue-400" />📢 Debate Live
                </CardTitle>
                <p className="text-gray-400">Join live political discussions and real-time analysis</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-slate-900 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Active Debates</h3>
                  <div className="space-y-3">
                    {[
                      { topic: "AI Regulation in Healthcare", participants: 127, status: "live" },
                      { topic: "Climate Policy Implementation", participants: 89, status: "live" },
                      { topic: "Digital Privacy Rights", participants: 156, status: "starting-soon" },
                    ].map((debate, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{debate.topic}</p>
                          <p className="text-sm text-gray-400">{debate.participants} participants</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              debate.status === "live"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {debate.status === "live" ? "🔴 Live" : "⏰ Starting Soon"}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-electricBlue-600 text-electricBlue-400 hover:bg-electricBlue-600 hover:text-white bg-transparent"
                          >
                            Join
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-electricBlue-600 hover:bg-electricBlue-700 text-white">
                  Start New Debate
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
