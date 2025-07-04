"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, Bookmark, History, Zap, X, ChevronDown, Mic, Camera, FileText } from "lucide-react"

interface SearchSuggestion {
  id: string
  text: string
  type: "query" | "filter" | "topic" | "person"
  metadata?: any
}

interface SavedSearch {
  id: string
  query: string
  filters: string[]
  timestamp: Date
  name: string
}

interface SearchResult {
  id: string
  title: string
  snippet: string
  type: "debate" | "argument" | "person" | "document"
  relevance: number
  ideology: string
  tags: string[]
  timestamp: Date
}

export function SmartSearchInterface() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [results, setResults] = useState<SearchResult[]>([])
  const [isVoiceSearch, setIsVoiceSearch] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedFacets, setSelectedFacets] = useState<Record<string, string[]>>({})

  const searchInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Smart suggestions based on input
  useEffect(() => {
    if (query.length > 2) {
      const mockSuggestions: SearchSuggestion[] = [
        { id: "1", text: `"${query}" in AI regulation debates`, type: "query" },
        { id: "2", text: `Arguments about ${query}`, type: "topic" },
        { id: "3", text: `Filter by: contains "${query}"`, type: "filter" },
        { id: "4", text: `People discussing ${query}`, type: "person" },
        { id: "5", text: `Recent debates on ${query}`, type: "query" },
      ]
      setSuggestions(mockSuggestions)
    } else {
      setSuggestions([])
    }
  }, [query])

  // Voice search functionality
  const startVoiceSearch = async () => {
    try {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onstart = () => setIsVoiceSearch(true)
      recognition.onend = () => setIsVoiceSearch(false)
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
        performSearch(transcript)
      }

      recognition.start()
    } catch (error) {
      console.error("Voice search not supported:", error)
    }
  }

  // Image search (OCR)
  const handleImageSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Mock OCR extraction
      const mockExtractedText = "AI regulation policy framework implementation"
      setQuery(mockExtractedText)
      performSearch(mockExtractedText)
    }
  }

  // Perform search with intelligent ranking
  const performSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    // Add to search history
    setSearchHistory((prev) => [searchQuery, ...prev.filter((h) => h !== searchQuery)].slice(0, 10))

    // Mock intelligent search results
    const mockResults: SearchResult[] = [
      {
        id: "1",
        title: "AI Regulation Framework Debate",
        snippet: `Comprehensive discussion on ${searchQuery} involving multiple stakeholders...`,
        type: "debate",
        relevance: 95,
        ideology: "center",
        tags: ["AI", "regulation", "policy"],
        timestamp: new Date(),
      },
      {
        id: "2",
        title: "Tech Industry Response",
        snippet: `Industry leaders argue that ${searchQuery} could impact innovation...`,
        type: "argument",
        relevance: 87,
        ideology: "right",
        tags: ["industry", "innovation"],
        timestamp: new Date(),
      },
      {
        id: "3",
        title: "Ethics Committee Report",
        snippet: `Ethical implications of ${searchQuery} require careful consideration...`,
        type: "document",
        relevance: 82,
        ideology: "left",
        tags: ["ethics", "report"],
        timestamp: new Date(),
      },
    ]

    setResults(mockResults)
  }

  // Save current search
  const saveCurrentSearch = () => {
    const savedSearch: SavedSearch = {
      id: Date.now().toString(),
      query,
      filters: activeFilters,
      timestamp: new Date(),
      name: `Search: ${query.slice(0, 30)}...`,
    }
    setSavedSearches((prev) => [savedSearch, ...prev])
  }

  // Apply suggestion
  const applySuggestion = (suggestion: SearchSuggestion) => {
    if (suggestion.type === "filter") {
      setActiveFilters((prev) => [...prev, suggestion.text])
    } else {
      setQuery(suggestion.text)
      performSearch(suggestion.text)
    }
    setSuggestions([])
  }

  // Remove filter
  const removeFilter = (filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter))
  }

  // Faceted search filters
  const facets = {
    Ideology: ["Left", "Center", "Right", "Progressive", "Conservative"],
    Type: ["Debate", "Argument", "Document", "Person"],
    Time: ["Last Hour", "Today", "This Week", "This Month"],
    Source: ["Parliament", "Media", "Academic", "Social Media"],
    Emotion: ["Anger", "Hope", "Fear", "Confidence"],
  }

  const toggleFacet = (category: string, value: string) => {
    setSelectedFacets((prev) => ({
      ...prev,
      [category]: prev[category]?.includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...(prev[category] || []), value],
    }))
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "k":
            e.preventDefault()
            searchInputRef.current?.focus()
            break
          case "s":
            e.preventDefault()
            if (query) saveCurrentSearch()
            break
        }
      }
      if (e.key === "Escape") {
        setSuggestions([])
        setShowAdvanced(false)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [query])

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Search className="w-5 h-5 mr-2 text-electricBlue-400" />🔍 Smart Search & Discovery
        </CardTitle>
        <p className="text-gray-400 text-sm">Intelligent search with voice, image, and contextual suggestions</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Search Bar */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && performSearch()}
                placeholder="Search debates, arguments, people... (Ctrl+K to focus)"
                className="bg-slate-900 border-slate-600 text-white pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Voice Search */}
            <Button
              size="sm"
              variant="outline"
              onClick={startVoiceSearch}
              className={`${
                isVoiceSearch
                  ? "border-red-500 text-red-400 bg-red-500/10"
                  : "border-electricBlue-600 text-electricBlue-400"
              }`}
            >
              <Mic className="w-4 h-4" />
            </Button>

            {/* Image Search */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-slate-600 text-gray-400 hover:bg-slate-600 hover:text-white"
            >
              <Camera className="w-4 h-4" />
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSearch} className="hidden" />

            {/* Advanced Search Toggle */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="border-slate-600 text-gray-400 hover:bg-slate-600 hover:text-white"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-600 rounded-lg shadow-lg z-50">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => applySuggestion(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-slate-800 text-white text-sm flex items-center gap-2"
                >
                  {suggestion.type === "query" && <Search className="w-3 h-3 text-electricBlue-400" />}
                  {suggestion.type === "filter" && <Filter className="w-3 h-3 text-green-400" />}
                  {suggestion.type === "topic" && <FileText className="w-3 h-3 text-purple-400" />}
                  {suggestion.type === "person" && <div className="w-3 h-3 rounded-full bg-yellow-400" />}
                  {suggestion.text}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-electricBlue-500 text-electricBlue-400 flex items-center gap-1"
              >
                {filter}
                <button onClick={() => removeFilter(filter)} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Advanced Search Panel */}
        {showAdvanced && (
          <Card className="bg-slate-900 border-slate-600">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-4">Advanced Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(facets).map(([category, values]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">{category}</h4>
                    <div className="space-y-1">
                      {values.map((value) => (
                        <label key={value} className="flex items-center gap-2 text-sm text-gray-400">
                          <input
                            type="checkbox"
                            checked={selectedFacets[category]?.includes(value) || false}
                            onChange={() => toggleFacet(category, value)}
                            className="rounded border-slate-600 bg-slate-800"
                          />
                          {value}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={saveCurrentSearch}
              disabled={!query}
              className="border-slate-600 text-gray-400 hover:bg-slate-600 hover:text-white bg-transparent"
            >
              <Bookmark className="w-4 h-4 mr-1" />
              Save Search
            </Button>
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="relative">
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-gray-400 hover:bg-slate-600 hover:text-white bg-transparent"
              >
                <History className="w-4 h-4 mr-1" />
                Recent
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
              {/* History dropdown would go here */}
            </div>
          )}
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Search Results ({results.length})</h3>
            {results.map((result) => (
              <Card
                key={result.id}
                className="bg-slate-900 border-slate-600 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-medium">{result.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          result.ideology === "left"
                            ? "border-red-500 text-red-400"
                            : result.ideology === "right"
                              ? "border-blue-500 text-blue-400"
                              : "border-purple-500 text-purple-400"
                        }`}
                      >
                        {result.ideology}
                      </Badge>
                      <span className="text-xs text-gray-400">{result.relevance}% match</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{result.snippet}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {result.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{result.timestamp.toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3">Saved Searches</h3>
            <div className="space-y-2">
              {savedSearches.slice(0, 3).map((saved) => (
                <div
                  key={saved.id}
                  className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-600"
                >
                  <div>
                    <p className="text-white text-sm">{saved.name}</p>
                    <p className="text-gray-400 text-xs">{saved.timestamp.toLocaleDateString()}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setQuery(saved.query)
                      setActiveFilters(saved.filters)
                      performSearch(saved.query)
                    }}
                    className="text-electricBlue-400 hover:text-electricBlue-300"
                  >
                    <Zap className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Help */}
        <div className="text-xs text-gray-400">
          <p>
            💡 <strong>Shortcuts:</strong> Ctrl+K (focus search), Ctrl+S (save search), Esc (close suggestions)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
