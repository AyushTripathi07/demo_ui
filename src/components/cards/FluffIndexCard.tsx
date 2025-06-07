"use client"

import type React from "react"
import { useState } from "react"
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, ChevronRight } from "lucide-react"
import Popover from "../ui/Popover"

interface FluffData {
  fluffPercentage: number
  totalWords: number
  totalAdjectives: number
  qualityScore: "excellent" | "good" | "fair" | "poor"
  examples: string[]
}

interface FluffIndexCardProps {
  data?: FluffData
  isLoading?: boolean
}

const FluffIndexCard: React.FC<FluffIndexCardProps> = ({ data, isLoading = false }) => {
  const [showPopover, setShowPopover] = useState(false)

  // Fallback data when no analysis is available
  const fallbackData: FluffData = {
    fluffPercentage: 0,
    totalWords: 0,
    totalAdjectives: 0,
    qualityScore: "poor",
    examples: [],
  }

  const displayData = data || fallbackData
  const isEmpty = !data

  const getQualityColor = (score: string) => {
    switch (score) {
      case "excellent":
        return "text-green-600 bg-green-100"
      case "good":
        return "text-blue-600 bg-blue-100"
      case "fair":
        return "text-yellow-600 bg-yellow-100"
      case "poor":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getQualityIcon = (score: string) => {
    switch (score) {
      case "excellent":
        return <TrendingUp className="w-5 h-5 text-green-600" />
      case "good":
        return <TrendingUp className="w-5 h-5 text-blue-600" />
      case "fair":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "poor":
        return <TrendingDown className="w-5 h-5 text-red-600" />
      default:
        return <BarChart3 className="w-5 h-5 text-gray-600" />
    }
  }

  const getFluffDescription = (percentage: number) => {
    if (percentage < 15) return "Concise and direct"
    if (percentage < 25) return "Well-balanced"
    if (percentage < 35) return "Moderately descriptive"
    return "Highly descriptive"
  }

  if (isLoading) {
    return (
      <div className="card bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Fluff Index
          </h3>
          <div className="animate-pulse">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="space-y-3 animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-16 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="card bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Fluff Index
          </h3>
          {!isEmpty && (
            <button
              onClick={() => setShowPopover(true)}
              className="p-1 hover:bg-cyan-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {isEmpty ? "0" : Math.round(displayData.fluffPercentage)}%
            </div>
            <p className="text-sm text-gray-600">
              {isEmpty ? "No analysis available" : getFluffDescription(displayData.fluffPercentage)}
            </p>
          </div>

          {!isEmpty && (
            <div className="flex items-center justify-center gap-2">
              {getQualityIcon(displayData.qualityScore)}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getQualityColor(displayData.qualityScore)}`}
              >
                {displayData.qualityScore.charAt(0).toUpperCase() + displayData.qualityScore.slice(1)}
              </span>
            </div>
          )}

          {!isEmpty && (
            <div className="text-center text-sm text-gray-600">
              {displayData.totalAdjectives} adjectives out of {displayData.totalWords} words
            </div>
          )}

          {isEmpty && (
            <div className="text-center py-4">
              <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Analyze an article to see fluff index</p>
            </div>
          )}
        </div>
      </div>

      <Popover
        isOpen={showPopover}
        onClose={() => setShowPopover(false)}
        title="Fluff Index Analysis"
        className="bg-gradient-to-br from-cyan-50 to-blue-50"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">{Math.round(displayData.fluffPercentage)}%</div>
            <p className="text-lg text-gray-600 mb-4">{getFluffDescription(displayData.fluffPercentage)}</p>
            <div className="flex items-center justify-center gap-2">
              {getQualityIcon(displayData.qualityScore)}
              <span className={`px-4 py-2 rounded-full font-medium ${getQualityColor(displayData.qualityScore)}`}>
                {displayData.qualityScore.charAt(0).toUpperCase() + displayData.qualityScore.slice(1)} Quality
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">{displayData.totalAdjectives}</div>
              <p className="text-sm text-gray-600">Total Adjectives</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">{displayData.totalWords}</div>
              <p className="text-sm text-gray-600">Total Words</p>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-gray-900 mb-3">What is Fluff Index?</h5>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              The Fluff Index measures the ratio of adjectives to total words in an article. A lower percentage
              typically indicates more direct, factual writing, while a higher percentage suggests more descriptive or
              potentially subjective content.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>0-15%:</span>
                <span className="text-green-600 font-medium">Concise and direct</span>
              </div>
              <div className="flex justify-between">
                <span>15-25%:</span>
                <span className="text-blue-600 font-medium">Well-balanced</span>
              </div>
              <div className="flex justify-between">
                <span>25-35%:</span>
                <span className="text-yellow-600 font-medium">Moderately descriptive</span>
              </div>
              <div className="flex justify-between">
                <span>35%+:</span>
                <span className="text-red-600 font-medium">Highly descriptive</span>
              </div>
            </div>
          </div>

          {displayData.examples.length > 0 && (
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Example Adjectives Found</h5>
              <div className="flex flex-wrap gap-2">
                {displayData.examples.slice(0, 10).map((example, index) => (
                  <span key={index} className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded text-sm">
                    {example}
                  </span>
                ))}
                {displayData.examples.length > 10 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                    +{displayData.examples.length - 10} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Popover>
    </>
  )
}

export default FluffIndexCard
