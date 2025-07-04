"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Mic, MicOff, Link2, Plus, MessageSquare, Eye, EyeOff, Maximize2, Minimize2 } from "lucide-react"

interface ArgumentNode {
  id: string
  text: string
  author: string
  ideology: "left" | "center" | "right"
  position: { x: number; y: number }
  connections: string[]
  votes: { up: number; down: number }
  annotations: Array<{
    id: string
    text: string
    author: string
    position: { start: number; end: number }
  }>
  isCollapsed: boolean
}

interface LiveCursor {
  userId: string
  userName: string
  position: { x: number; y: number }
  color: string
}

export function InteractiveDebateCanvas() {
  const [argList, setArgList] = useState<ArgumentNode[]>([
    {
      id: "arg1",
      text: "AI regulation must balance innovation with safety to prevent potential risks while fostering technological advancement.",
      author: "Tech Policy Expert",
      ideology: "center",
      position: { x: 300, y: 200 },
      connections: ["arg2"],
      votes: { up: 24, down: 3 },
      annotations: [],
      isCollapsed: false,
    },
    {
      id: "arg2",
      text: "Excessive regulation will stifle innovation and put us behind in the global AI race.",
      author: "Industry Leader",
      ideology: "right",
      position: { x: 600, y: 300 },
      connections: ["arg1", "arg3"],
      votes: { up: 18, down: 12 },
      annotations: [],
      isCollapsed: false,
    },
    {
      id: "arg3",
      text: "Without proper oversight, AI systems could perpetuate bias and harm vulnerable communities.",
      author: "Ethics Researcher",
      ideology: "left",
      position: { x: 100, y: 350 },
      connections: ["arg2"],
      votes: { up: 31, down: 5 },
      annotations: [],
      isCollapsed: false,
    },
  ])

  const [selectedArgument, setSelectedArgument] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStart, setConnectionStart] = useState<string | null>(null)
  const [liveCursors, setLiveCursors] = useState<LiveCursor[]>([])
  const [isVoiceRecording, setIsVoiceRecording] = useState(false)
  const [newArgumentText, setNewArgumentText] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedText, setSelectedText] = useState<{
    argumentId: string
    start: number
    end: number
    text: string
  } | null>(null)

  const canvasRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  // Voice recording functionality
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const audioChunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        // Here you would typically send to speech-to-text service
        const transcription = await mockSpeechToText(audioBlob)
        setNewArgumentText(transcription)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsVoiceRecording(true)
    } catch (error) {
      console.error("Voice recording failed:", error)
    }
  }

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isVoiceRecording) {
      mediaRecorderRef.current.stop()
      setIsVoiceRecording(false)
    }
  }

  // Mock speech-to-text (replace with actual service)
  const mockSpeechToText = async (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("This is a transcribed argument from voice input about AI regulation and its implications.")
      }, 1000)
    })
  }

  // Drag and drop handling
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId === "canvas" && destination.droppableId === "canvas") {
      // Handle argument repositioning on canvas
      setArgList((prev) =>
        prev.map((arg) =>
          arg.id === draggableId ? { ...arg, position: { x: destination.index * 100, y: Math.random() * 400 } } : arg,
        ),
      )
    }
  }

  // Text selection and annotation
  const handleTextSelection = (argumentId: string) => {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      const range = selection.getRangeAt(0)
      setSelectedText({
        argumentId,
        start: range.startOffset,
        end: range.endOffset,
        text: selection.toString(),
      })
    }
  }

  // Add annotation to selected text
  const addAnnotation = (comment: string) => {
    if (!selectedText) return

    const newAnnotation = {
      id: Date.now().toString(),
      text: comment,
      author: "Current User",
      position: { start: selectedText.start, end: selectedText.end },
    }

    setArgList((prev) =>
      prev.map((arg) =>
        arg.id === selectedText.argumentId ? { ...arg, annotations: [...arg.annotations, newAnnotation] } : arg,
      ),
    )

    setSelectedText(null)
  }

  // Connection creation between arguments
  const startConnection = (argumentId: string) => {
    setIsConnecting(true)
    setConnectionStart(argumentId)
  }

  const completeConnection = (targetId: string) => {
    if (connectionStart && connectionStart !== targetId) {
      setArgList((prev) =>
        prev.map((arg) => (arg.id === connectionStart ? { ...arg, connections: [...arg.connections, targetId] } : arg)),
      )
    }
    setIsConnecting(false)
    setConnectionStart(null)
  }

  // Voting on arguments
  const voteOnArgument = (argumentId: string, voteType: "up" | "down") => {
    setArgList((prev) =>
      prev.map((arg) =>
        arg.id === argumentId
          ? {
              ...arg,
              votes: {
                ...arg.votes,
                [voteType]: arg.votes[voteType] + 1,
              },
            }
          : arg,
      ),
    )
  }

  // Add new argument
  const addNewArgument = () => {
    if (!newArgumentText.trim()) return

    const newArg: ArgumentNode = {
      id: `arg${Date.now()}`,
      text: newArgumentText,
      author: "Current User",
      ideology: "center",
      position: { x: Math.random() * 600, y: Math.random() * 400 },
      connections: [],
      votes: { up: 0, down: 0 },
      annotations: [],
      isCollapsed: false,
    }

    setArgList((prev) => [...prev, newArg])
    setNewArgumentText("")
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "n":
            e.preventDefault()
            // Focus on new argument input
            break
          case "f":
            e.preventDefault()
            setIsFullscreen(!isFullscreen)
            break
          case "c":
            e.preventDefault()
            if (selectedArgument) {
              startConnection(selectedArgument)
            }
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [selectedArgument, isFullscreen])

  // Mouse tracking for live cursors (mock implementation)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // In a real app, this would broadcast to other users
      const mockCursors: LiveCursor[] = [
        {
          userId: "user1",
          userName: "Alice",
          position: { x: e.clientX + 50, y: e.clientY + 30 },
          color: "#ef4444",
        },
        {
          userId: "user2",
          userName: "Bob",
          position: { x: e.clientX - 30, y: e.clientY - 20 },
          color: "#22c55e",
        },
      ]
      setLiveCursors(mockCursors)
    }

    if (canvasRef.current) {
      canvasRef.current.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [])

  const getIdeologyColor = (ideology: string) => {
    switch (ideology) {
      case "left":
        return "border-red-500 bg-red-500/10"
      case "center":
        return "border-purple-500 bg-purple-500/10"
      case "right":
        return "border-blue-500 bg-blue-500/10"
      default:
        return "border-gray-500 bg-gray-500/10"
    }
  }

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-slate-900" : ""}`}>
      <Card className="bg-slate-800/50 border-slate-700 h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-electricBlue-400" />
              Interactive Debate Canvas
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="border-slate-600 text-gray-400 hover:bg-slate-600 hover:text-white"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Drag arguments, create connections, annotate text, and collaborate in real-time
          </p>
        </CardHeader>

        <CardContent className="p-6">
          {/* Voice Input Controls */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex-1">
              <Textarea
                value={newArgumentText}
                onChange={(e) => setNewArgumentText(e.target.value)}
                placeholder="Add your argument here... (Ctrl+N to focus, or use voice input)"
                className="bg-slate-900 border-slate-600 text-white"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={isVoiceRecording ? stopVoiceRecording : startVoiceRecording}
                className={`${
                  isVoiceRecording
                    ? "border-red-500 text-red-400 bg-red-500/10"
                    : "border-electricBlue-600 text-electricBlue-400"
                }`}
              >
                {isVoiceRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                onClick={addNewArgument}
                disabled={!newArgumentText.trim()}
                className="bg-electricBlue-600 hover:bg-electricBlue-700 text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Interactive Canvas */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div
              ref={canvasRef}
              className="relative bg-slate-900 rounded-lg p-6 min-h-96 overflow-hidden"
              style={{ height: isFullscreen ? "calc(100vh - 200px)" : "600px" }}
            >
              {/* Connection Lines */}
              <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                {argList.map((arg) =>
                  arg.connections.map((connId) => {
                    const targetArg = argList.find((a) => a.id === connId)
                    if (!targetArg) return null

                    return (
                      <line
                        key={`${arg.id}-${connId}`}
                        x1={arg.position.x + 100}
                        y1={arg.position.y + 50}
                        x2={targetArg.position.x + 100}
                        y2={targetArg.position.y + 50}
                        stroke="rgba(59, 130, 246, 0.4)"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                      />
                    )
                  }),
                )}
              </svg>

              {/* Live Cursors */}
              {liveCursors.map((cursor) => (
                <div
                  key={cursor.userId}
                  className="absolute pointer-events-none z-50"
                  style={{
                    left: cursor.position.x,
                    top: cursor.position.y,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white"
                    style={{ backgroundColor: cursor.color }}
                  />
                  <div
                    className="mt-1 px-2 py-1 rounded text-xs text-white font-medium"
                    style={{ backgroundColor: cursor.color }}
                  >
                    {cursor.userName}
                  </div>
                </div>
              ))}

              {/* Argument Nodes */}
              <Droppable droppableId="canvas">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="relative h-full">
                    {argList.map((argument, index) => (
                      <Draggable key={argument.id} draggableId={argument.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`absolute w-64 ${getIdeologyColor(argument.ideology)} border-2 rounded-lg p-4 cursor-move transition-all duration-200 ${
                              snapshot.isDragging ? "shadow-lg scale-105 z-10" : "hover:shadow-md"
                            } ${selectedArgument === argument.id ? "ring-2 ring-electricBlue-500" : ""}`}
                            style={{
                              left: argument.position.x,
                              top: argument.position.y,
                              zIndex: selectedArgument === argument.id ? 20 : 10,
                            }}
                            onClick={() => setSelectedArgument(argument.id)}
                            onDoubleClick={() => handleTextSelection(argument.id)}
                          >
                            {/* Argument Header */}
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className={`text-xs ${getIdeologyColor(argument.ideology)}`}>
                                {argument.ideology}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    startConnection(argument.id)
                                  }}
                                  className="w-6 h-6 p-0 text-gray-400 hover:text-electricBlue-400"
                                >
                                  <Link2 className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setArgList((prev) =>
                                      prev.map((arg) =>
                                        arg.id === argument.id ? { ...arg, isCollapsed: !arg.isCollapsed } : arg,
                                      ),
                                    )
                                  }}
                                  className="w-6 h-6 p-0 text-gray-400 hover:text-white"
                                >
                                  {argument.isCollapsed ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                </Button>
                              </div>
                            </div>

                            {/* Argument Content */}
                            {!argument.isCollapsed && (
                              <>
                                <p className="text-white text-sm mb-3 leading-relaxed select-text">{argument.text}</p>

                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-400">{argument.author}</span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        voteOnArgument(argument.id, "up")
                                      }}
                                      className="text-green-400 hover:text-green-300 transition-colors"
                                    >
                                      ↑{argument.votes.up}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        voteOnArgument(argument.id, "down")
                                      }}
                                      className="text-red-400 hover:text-red-300 transition-colors"
                                    >
                                      ↓{argument.votes.down}
                                    </button>
                                  </div>
                                </div>

                                {/* Annotations */}
                                {argument.annotations.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-slate-600">
                                    {argument.annotations.map((annotation) => (
                                      <div key={annotation.id} className="text-xs text-yellow-300 mb-1">
                                        💬 {annotation.text} - {annotation.author}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}

                            {/* Connection Target */}
                            {isConnecting && connectionStart !== argument.id && (
                              <div
                                className="absolute inset-0 bg-electricBlue-500/20 border-2 border-electricBlue-500 rounded-lg cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  completeConnection(argument.id)
                                }}
                              />
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>

          {/* Selected Text Annotation */}
          {selectedText && (
            <div className="mt-4 p-4 bg-slate-900 border border-slate-600 rounded-lg">
              <p className="text-white text-sm mb-2">Selected: "{selectedText.text}"</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add annotation..."
                  className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white text-sm"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addAnnotation((e.target as HTMLInputElement).value)
                      ;(e.target as HTMLInputElement).value = ""
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => setSelectedText(null)}
                  variant="outline"
                  className="border-slate-600 text-gray-400 hover:bg-slate-600 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Keyboard Shortcuts Help */}
          <div className="mt-4 text-xs text-gray-400">
            <p>
              💡 <strong>Shortcuts:</strong> Ctrl+N (new argument), Ctrl+F (fullscreen), Ctrl+C (connect), Double-click
              (select text)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
