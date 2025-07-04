"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MessageSquare,
  HighlighterIcon as Highlight,
  ReplyIcon,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Users,
  Zap,
  Pin,
} from "lucide-react"

interface Annotation {
  id: string
  text: string
  author: {
    id: string
    name: string
    avatar?: string
    color: string
  }
  position: {
    start: number
    end: number
    top: number
    left: number
  }
  timestamp: Date
  type: "comment" | "highlight" | "question" | "suggestion"
  replies: any[]
  votes: { up: number; down: number }
  isResolved: boolean
  isPinned: boolean
  viewers: string[]
}

interface CollaborativeAnnotationSystemProps {
  documentText: string
  documentId: string
}

export function CollaborativeAnnotationSystem({ documentText, documentId }: CollaborativeAnnotationSystemProps) {
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [selectedText, setSelectedText] = useState<{
    text: string
    start: number
    end: number
    rect: DOMRect
  } | null>(null)
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null)
  const [newAnnotationType, setNewAnnotationType] = useState<"comment" | "highlight" | "question" | "suggestion">(
    "comment",
  )
  const [newAnnotationText, setNewAnnotationText] = useState("")
  const [replyText, setReplyText] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [liveViewers, setLiveViewers] = useState<Array<{ id: string; name: string; color: string }>>([])
  const [showResolved, setShowResolved] = useState(false)

  const documentRef = useRef<HTMLDivElement>(null)
  const currentUser = {
    id: "current-user",
    name: "You",
    color: "#3b82f6",
  }

  // Handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      setSelectedText({
        text: selection.toString(),
        start: range.startOffset,
        end: range.endOffset,
        rect,
      })
    } else {
      setSelectedText(null)
    }
  }

  // Add new annotation
  const addAnnotation = () => {
    if (!selectedText || !newAnnotationText.trim()) return

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      text: newAnnotationText,
      author: currentUser,
      position: {
        start: selectedText.start,
        end: selectedText.end,
        top: selectedText.rect.top,
        left: selectedText.rect.left,
      },
      timestamp: new Date(),
      type: newAnnotationType,
      replies: [],
      votes: { up: 0, down: 0 },
      isResolved: false,
      isPinned: false,
      viewers: [currentUser.id],
    }

    setAnnotations((prev) => [...prev, newAnnotation])
    setSelectedText(null)
    setNewAnnotationText("")
  }

  // Add reply to annotation
  const addReply = (annotationId: string) => {
    if (!replyText.trim()) return

    const newReply = {
      id: Date.now().toString(),
      text: replyText,
      author: currentUser,
      timestamp: new Date(),
      votes: { up: 0, down: 0 },
    }

    setAnnotations((prev) =>
      prev.map((ann) => (ann.id === annotationId ? { ...ann, replies: [...ann.replies, newReply] } : ann)),
    )

    setReplyText("")
    setReplyingTo(null)
  }

  // Vote on annotation or reply
  const vote = (annotationId: string, replyId: string | null, voteType: "up" | "down") => {
    setAnnotations((prev) =>
      prev.map((ann) => {
        if (ann.id === annotationId) {
          if (replyId) {
            return {
              ...ann,
              replies: ann.replies.map((reply) =>
                reply.id === replyId
                  ? { ...reply, votes: { ...reply.votes, [voteType]: reply.votes[voteType] + 1 } }
                  : reply,
              ),
            }
          } else {
            return { ...ann, votes: { ...ann.votes, [voteType]: ann.votes[voteType] + 1 } }
          }
        }
        return ann
      }),
    )
  }

  // Toggle annotation resolution
  const toggleResolution = (annotationId: string) => {
    setAnnotations((prev) =>
      prev.map((ann) => (ann.id === annotationId ? { ...ann, isResolved: !ann.isResolved } : ann)),
    )
  }

  // Pin/unpin annotation
  const togglePin = (annotationId: string) => {
    setAnnotations((prev) => prev.map((ann) => (ann.id === annotationId ? { ...ann, isPinned: !ann.isPinned } : ann)))
  }

  // Mock live viewers
  useEffect(() => {
    const mockViewers = [
      { id: "user1", name: "Alice", color: "#ef4444" },
      { id: "user2", name: "Bob", color: "#22c55e" },
      { id: "user3", name: "Carol", color: "#f59e0b" },
    ]
    setLiveViewers(mockViewers)
  }, [])

  // Render highlighted text with annotations
  const renderAnnotatedText = () => {
    if (annotations.length === 0) return documentText

    let result = documentText
    const sortedAnnotations = [...annotations].sort((a, b) => a.position.start - b.position.start)

    // Insert annotation markers
    sortedAnnotations.forEach((annotation, index) => {
      const marker = `<span class="annotation-${annotation.id} ${getAnnotationClass(annotation)}" data-annotation="${annotation.id}">`
      const endMarker = "</span>"

      // This is a simplified version - in production you'd need more sophisticated text processing
      result =
        result.slice(0, annotation.position.start) +
        marker +
        result.slice(annotation.position.start, annotation.position.end) +
        endMarker +
        result.slice(annotation.position.end)
    })

    return result
  }

  const getAnnotationClass = (annotation: Annotation) => {
    const baseClass = "cursor-pointer transition-all duration-200"
    switch (annotation.type) {
      case "highlight":
        return `${baseClass} bg-yellow-400/30 border-b-2 border-yellow-400`
      case "comment":
        return `${baseClass} bg-blue-400/20 border-b-2 border-blue-400`
      case "question":
        return `${baseClass} bg-purple-400/20 border-b-2 border-purple-400`
      case "suggestion":
        return `${baseClass} bg-green-400/20 border-b-2 border-green-400`
      default:
        return baseClass
    }
  }

  const getAnnotationIcon = (type: string) => {
    switch (type) {
      case "highlight":
        return <Highlight className="w-4 h-4" />
      case "comment":
        return <MessageSquare className="w-4 h-4" />
      case "question":
        return <span className="text-sm font-bold">?</span>
      case "suggestion":
        return <Zap className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const filteredAnnotations = showResolved ? annotations : annotations.filter((ann) => !ann.isResolved)

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Document with Annotations */}
      <div className="lg:col-span-2">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-electricBlue-400" />
                Collaborative Document
              </CardTitle>
              <div className="flex items-center gap-2">
                {/* Live viewers */}
                <div className="flex -space-x-2">
                  {liveViewers.map((viewer) => (
                    <Avatar key={viewer.id} className="w-6 h-6 border-2 border-slate-700">
                      <AvatarFallback className="text-xs text-white" style={{ backgroundColor: viewer.color }}>
                        {viewer.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <Badge variant="outline" className="border-green-500 text-green-400">
                  <Eye className="w-3 h-3 mr-1" />
                  {liveViewers.length + 1} viewing
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div
              ref={documentRef}
              className="prose prose-invert max-w-none p-4 bg-slate-900 rounded-lg leading-relaxed select-text"
              onMouseUp={handleTextSelection}
              dangerouslySetInnerHTML={{ __html: renderAnnotatedText() }}
            />

            {/* Text Selection Toolbar */}
            {selectedText && (
              <div
                className="fixed z-50 bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg"
                style={{
                  top: selectedText.rect.top - 60,
                  left: selectedText.rect.left,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {(["comment", "highlight", "question", "suggestion"] as const).map((type) => (
                    <Button
                      key={type}
                      size="sm"
                      variant={newAnnotationType === type ? "default" : "outline"}
                      onClick={() => setNewAnnotationType(type)}
                      className={`${
                        newAnnotationType === type ? "bg-electricBlue-600 text-white" : "border-slate-600 text-gray-400"
                      }`}
                    >
                      {getAnnotationIcon(type)}
                    </Button>
                  ))}
                </div>
                <Textarea
                  value={newAnnotationText}
                  onChange={(e) => setNewAnnotationText(e.target.value)}
                  placeholder={`Add ${newAnnotationType}...`}
                  className="bg-slate-900 border-slate-600 text-white text-sm mb-2"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={addAnnotation}
                    className="bg-electricBlue-600 hover:bg-electricBlue-700 text-white"
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedText(null)}
                    className="border-slate-600 text-gray-400"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Annotations Panel */}
      <div>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-electricBlue-400" />
                Annotations ({filteredAnnotations.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowResolved(!showResolved)}
                  className="border-slate-600 text-gray-400 hover:bg-slate-600 hover:text-white"
                >
                  {showResolved ? "Hide Resolved" : "Show All"}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {filteredAnnotations
              .sort((a, b) => {
                // Pinned first, then by timestamp
                if (a.isPinned && !b.isPinned) return -1
                if (!a.isPinned && b.isPinned) return 1
                return b.timestamp.getTime() - a.timestamp.getTime()
              })
              .map((annotation) => (
                <Card
                  key={annotation.id}
                  className={`bg-slate-900 border-slate-600 ${
                    activeAnnotation === annotation.id ? "ring-2 ring-electricBlue-500" : ""
                  } ${annotation.isResolved ? "opacity-60" : ""}`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback
                            className="text-xs text-white"
                            style={{ backgroundColor: annotation.author.color }}
                          >
                            {annotation.author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white text-sm font-medium">{annotation.author.name}</p>
                          <p className="text-gray-400 text-xs">{annotation.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {annotation.isPinned && <Pin className="w-3 h-3 text-yellow-400" />}
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            annotation.type === "highlight"
                              ? "border-yellow-500 text-yellow-400"
                              : annotation.type === "comment"
                                ? "border-blue-500 text-blue-400"
                                : annotation.type === "question"
                                  ? "border-purple-500 text-purple-400"
                                  : "border-green-500 text-green-400"
                          }`}
                        >
                          {getAnnotationIcon(annotation.type)}
                          {annotation.type}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-3">{annotation.text}</p>

                    {/* Annotation Actions */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => vote(annotation.id, null, "up")}
                          className="flex items-center gap-1 text-green-400 hover:text-green-300 text-xs"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          {annotation.votes.up}
                        </button>
                        <button
                          onClick={() => vote(annotation.id, null, "down")}
                          className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs"
                        >
                          <ThumbsDown className="w-3 h-3" />
                          {annotation.votes.down}
                        </button>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => togglePin(annotation.id)}
                          className="w-6 h-6 p-0 text-gray-400 hover:text-yellow-400"
                        >
                          <Pin className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setReplyingTo(annotation.id)}
                          className="w-6 h-6 p-0 text-gray-400 hover:text-electricBlue-400"
                        >
                          <ReplyIcon className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleResolution(annotation.id)}
                          className={`w-6 h-6 p-0 ${
                            annotation.isResolved
                              ? "text-green-400 hover:text-green-300"
                              : "text-gray-400 hover:text-green-400"
                          }`}
                        >
                          ✓
                        </Button>
                      </div>
                    </div>

                    {/* Replies */}
                    {annotation.replies.length > 0 && (
                      <div className="space-y-2 pl-4 border-l-2 border-slate-600">
                        {annotation.replies.map((reply) => (
                          <div key={reply.id} className="bg-slate-800 p-2 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar className="w-4 h-4">
                                <AvatarFallback
                                  className="text-xs text-white"
                                  style={{ backgroundColor: reply.author.color }}
                                >
                                  {reply.author.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-white text-xs">{reply.author.name}</span>
                              <span className="text-gray-400 text-xs">{reply.timestamp.toLocaleTimeString()}</span>
                            </div>
                            <p className="text-gray-300 text-xs mb-1">{reply.text}</p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => vote(annotation.id, reply.id, "up")}
                                className="flex items-center gap-1 text-green-400 hover:text-green-300 text-xs"
                              >
                                <ThumbsUp className="w-2 h-2" />
                                {reply.votes.up}
                              </button>
                              <button
                                onClick={() => vote(annotation.id, reply.id, "down")}
                                className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs"
                              >
                                <ThumbsDown className="w-2 h-2" />
                                {reply.votes.down}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input */}
                    {replyingTo === annotation.id && (
                      <div className="mt-3 pt-3 border-t border-slate-600">
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="bg-slate-800 border-slate-600 text-white text-sm mb-2"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => addReply(annotation.id)}
                            className="bg-electricBlue-600 hover:bg-electricBlue-700 text-white"
                          >
                            Reply
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setReplyingTo(null)}
                            className="border-slate-600 text-gray-400"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

            {filteredAnnotations.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No annotations yet. Select text to add one!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
