"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Mic, Video, Loader2 } from "lucide-react"

export function UploadForm() {
  const [uploadType, setUploadType] = useState("text")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [textContent, setTextContent] = useState("")

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      setAnalysisResult({
        ideology: "Center-Left",
        biasScore: 35,
        emotionalTone: "Hopeful",
        keyPhrases: ["innovation", "regulation", "safety"],
        fallacies: ["Appeal to Authority"],
        confidence: 87,
      })
      setIsAnalyzing(false)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Upload type selection */}
      <div className="grid grid-cols-3 gap-4">
        <Button
          variant={uploadType === "text" ? "default" : "outline"}
          className={uploadType === "text" ? "bg-electricBlue-600" : "border-slate-600 text-gray-400"}
          onClick={() => setUploadType("text")}
        >
          <FileText className="w-4 h-4 mr-2" />
          Text
        </Button>
        <Button
          variant={uploadType === "audio" ? "default" : "outline"}
          className={uploadType === "audio" ? "bg-electricBlue-600" : "border-slate-600 text-gray-400"}
          onClick={() => setUploadType("audio")}
        >
          <Mic className="w-4 h-4 mr-2" />
          Audio
        </Button>
        <Button
          variant={uploadType === "video" ? "default" : "outline"}
          className={uploadType === "video" ? "bg-electricBlue-600" : "border-slate-600 text-gray-400"}
          onClick={() => setUploadType("video")}
        >
          <Video className="w-4 h-4 mr-2" />
          Video
        </Button>
      </div>

      {/* Content input */}
      {uploadType === "text" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="content" className="text-white">
              Speech or Document Content
            </Label>
            <Textarea
              id="content"
              placeholder="Paste your speech, transcript, or political document here..."
              className="mt-2 bg-slate-900 border-slate-600 text-white min-h-32"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source" className="text-white">
                Source
              </Label>
              <Select>
                <SelectTrigger className="mt-2 bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="Select source type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="speech">Political Speech</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="debate">Debate Transcript</SelectItem>
                  <SelectItem value="article">News Article</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="country" className="text-white">
                Country/Region
              </Label>
              <Select>
                <SelectTrigger className="mt-2 bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="eu">European Union</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {uploadType !== "text" && (
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-white mb-2">Drop your {uploadType} file here or click to browse</p>
          <p className="text-sm text-gray-400">Supports MP3, WAV, MP4, MOV files up to 100MB</p>
          <Button
            variant="outline"
            className="mt-4 border-electricBlue-600 text-electricBlue-400 hover:bg-electricBlue-600 hover:text-white"
          >
            Choose File
          </Button>
        </div>
      )}

      {/* Analyze button */}
      <Button
        onClick={handleAnalyze}
        disabled={isAnalyzing || (uploadType === "text" && !textContent.trim())}
        className="w-full bg-electricBlue-600 hover:bg-electricBlue-700 text-white py-3"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Generate Ideological Analysis"
        )}
      </Button>

      {/* Analysis results */}
      {analysisResult && (
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Analysis Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400">Ideology</p>
                <p className="text-white font-semibold">{analysisResult.ideology}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Bias Score</p>
                <p className="text-white font-semibold">{analysisResult.biasScore}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Emotional Tone</p>
                <p className="text-white font-semibold">{analysisResult.emotionalTone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Confidence</p>
                <p className="text-white font-semibold">{analysisResult.confidence}%</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-400">Key Phrases</p>
                <p className="text-white">{analysisResult.keyPhrases.join(", ")}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-electricBlue-600 text-electricBlue-400 hover:bg-electricBlue-600 hover:text-white"
              >
                View Detailed Report
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-gray-400 hover:bg-slate-600 hover:text-white"
              >
                Add Counter-Argument
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
