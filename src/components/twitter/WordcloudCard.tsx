"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Type, Filter, ChevronRight, Twitter, Users, ChevronDown } from "lucide-react"
import Popover from "../ui/Popover"

interface WordcloudCardProps {
  data?: Array<{
    word: string
    count: number
    sentiment: number
  }>
  isLoading?: boolean
  usernames?: string[]
  usernameData?: Record<
    string,
    {
      wordcloudData?: Array<{
        word: string
        count: number
        sentiment: number
      }>
    }
  >
  onUsernameChange?: (username: string) => void
}

const WordcloudCard: React.FC<WordcloudCardProps> = ({
  data,
  isLoading,
  usernames = [],
  usernameData = {},
  onUsernameChange,
}) => {
  const [sentimentFilter, setSentimentFilter] = useState<"all" | "positive" | "negative" | "neutral">("all")
  const [showPopover, setShowPopover] = useState(false)
  const [showUsernameDropdown, setShowUsernameDropdown] = useState(false)
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null)

  useEffect(() => {
    if (usernames.length > 0 && !selectedUsername) {
      setSelectedUsername("All Accounts")
    }
  }, [usernames, selectedUsername])

  const handleUsernameSelect = (username: string) => {
    setSelectedUsername(username)
    setShowUsernameDropdown(false)
    if (onUsernameChange) {
      onUsernameChange(username)
    }
  }

  // Get current data based on selected username
  const getCurrentData = () => {
    if (!selectedUsername || selectedUsername === "All Accounts") {
      return data
    }
    return usernameData[selectedUsername]?.wordcloudData || data
  }

  const currentData = getCurrentData()

  const filteredData = useMemo(() => {
    if (!currentData) return []

    return currentData.filter((word) => {
      switch (sentimentFilter) {
        case "positive":
          return word.sentiment > 0.2
        case "negative":
          return word.sentiment < -0.2
        case "neutral":
          return word.sentiment >= -0.2 && word.sentiment <= 0.2
        default:
          return true
      }
    })
  }, [currentData, sentimentFilter])

  if (isLoading) {
    return (
      <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
        <div className="animate-pulse">
          <div className="h-6 bg-indigo-200 rounded w-1/3 mb-6"></div>
          <div className="h-80 bg-indigo-200 rounded mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-indigo-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!currentData || currentData.length === 0) {
    return (
      <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-indigo-500/10 rounded-xl">
            <Type className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Word Cloud</h3>
            <p className="text-gray-600 text-sm">Most mentioned terms</p>
          </div>
        </div>
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Type className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="text-gray-500">No word data available</p>
        </div>
      </div>
    )
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.2) return "text-green-600 hover:text-green-700"
    if (sentiment < -0.2) return "text-red-600 hover:text-red-700"
    return "text-blue-600 hover:text-blue-700"
  }

  const getSentimentBg = (sentiment: number) => {
    if (sentiment > 0.2) return "bg-green-50 border-green-200"
    if (sentiment < -0.2) return "bg-red-50 border-red-200"
    return "bg-blue-50 border-blue-200"
  }

  const getFontSize = (count: number, maxCount: number) => {
    const ratio = count / maxCount
    const minSize = 16
    const maxSize = 56
    return Math.floor(minSize + (maxSize - minSize) * ratio)
  }

  // Advanced positioning algorithm for better distribution
  const getWordPosition = (index: number, word: string, fontSize: number) => {
    const centerX = 50
    const centerY = 50

    // Create spiral pattern for better distribution
    const angle = index * 0.5 + word.length * 0.1
    const radius = Math.sqrt(index + 1) * 8 + fontSize / 4

    // Add some randomness based on word characteristics
    const wordHash = word.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
    const randomOffset = (wordHash % 20) - 10

    const x = centerX + Math.cos(angle) * radius + randomOffset
    const y = centerY + Math.sin(angle) * radius + randomOffset * 0.5

    // Ensure words stay within bounds
    const boundedX = Math.max(5, Math.min(95, x))
    const boundedY = Math.max(10, Math.min(90, y))

    return { x: boundedX, y: boundedY }
  }

  const getWordRotation = (index: number, word: string) => {
    // Rotate some words for visual variety
    const shouldRotate = (word.length + index) % 4 === 0
    if (!shouldRotate) return 0

    const rotations = [-45, -30, -15, 0, 15, 30, 45]
    return rotations[index % rotations.length]
  }

  const maxCount = Math.max(...filteredData.map((d) => d.count))

  return (
    <>
      <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <Type className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Word Cloud</h3>
              <p className="text-gray-600 text-sm">Most mentioned terms with sentiment</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value as "all" | "positive" | "negative" | "neutral")}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Words</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            <button
              onClick={() => setShowPopover(true)}
              className="p-2 hover:bg-indigo-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Username Selection Dropdown */}
        {usernames && usernames.length > 1 && (
          <div className="mb-6 relative">
            <div
              className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-100 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => setShowUsernameDropdown(!showUsernameDropdown)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Twitter className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Word cloud for</div>
                  <div className="font-medium text-black">{selectedUsername || "All Accounts"}</div>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showUsernameDropdown ? "transform rotate-180" : ""}`}
              />
            </div>

            {showUsernameDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-indigo-100 shadow-lg z-10 max-h-60 overflow-y-auto">
                <div
                  className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 flex items-center space-x-3"
                  onClick={() => handleUsernameSelect("All Accounts")}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="font-medium text-gray-600">All Accounts</div>
                </div>
                {usernames.map((username) => (
                  <div
                    key={username}
                    className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 flex items-center space-x-3"
                    onClick={() => handleUsernameSelect(username)}
                  >
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Twitter className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="font-medium text-gray-600">{username}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Enhanced Dynamic Word Cloud */}
        <div className="relative h-80 overflow-hidden rounded-xl bg-white border border-indigo-100 mb-6">
          <div className="absolute inset-0">
            {filteredData.slice(0, 30).map((word, index) => {
              const fontSize = getFontSize(word.count, maxCount)
              const position = getWordPosition(index, word.word, fontSize)
              const rotation = getWordRotation(index, word.word)

              return (
                <div
                  key={index}
                  className={`absolute transition-all duration-500 hover:scale-110 cursor-pointer font-bold select-none ${getSentimentColor(word.sentiment)}`}
                  style={{
                    fontSize: `${fontSize}px`,
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    opacity: 0.8 + (word.count / maxCount) * 0.2,
                    fontWeight: Math.min(900, 400 + (word.count / maxCount) * 500),
                    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                    animation: `fadeInScale 0.6s ease-out ${index * 0.1}s both`,
                  }}
                  title={`${word.word}: ${word.count} mentions, ${(word.sentiment * 100).toFixed(1)}% sentiment`}
                >
                  {word.word}
                </div>
              )
            })}
          </div>

          {/* Gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-indigo-50/30 pointer-events-none"></div>
        </div>


        {/* Summary */}
        <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
          <div className="text-center text-sm text-gray-600">
            Displaying {Math.min(30, filteredData.length)} of {currentData.length} total words
            {sentimentFilter !== "all" && (
              <span className="ml-2 text-indigo-600 font-medium">({sentimentFilter} sentiment filter active)</span>
            )}
          </div>
        </div>
      </div>

      <Popover
        isOpen={showPopover}
        onClose={() => setShowPopover(false)}
        title="Word Cloud Analysis"
        className="bg-gradient-to-br from-indigo-50 to-purple-50"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-indigo-100 text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-1">{currentData.length}</div>
              <div className="text-sm text-gray-600">Total Words</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-indigo-100 text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-1">{maxCount}</div>
              <div className="text-sm text-gray-600">Most Frequent</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-indigo-100 text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                {Math.round((currentData.reduce((sum, w) => sum + w.sentiment, 0) / currentData.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Avg Sentiment</div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
            <h4 className="font-semibold mb-2">Word Cloud Insights</h4>
            <p className="text-sm opacity-90">
              The word cloud visualizes {currentData.length} unique terms with varying sentiment scores. Words are
              positioned dynamically with size indicating frequency and color representing sentiment polarity.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Top Words by Frequency</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {currentData.slice(0, 15).map((word, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getSentimentBg(word.sentiment)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-800">{word.word}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">{word.count} mentions</span>
                      <span className={`text-sm font-medium ${getSentimentColor(word.sentiment).split(" ")[0]}`}>
                        {word.sentiment > 0 ? "+" : ""}
                        {(word.sentiment * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Popover>

      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
          }
          100% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1) rotate(var(--rotation, 0deg));
          }
        }
      `}</style>
    </>
  )
}

export default WordcloudCard
