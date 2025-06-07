"use client"

import type React from "react"
import { useState } from "react"
import { Globe, TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react"
import Popover from "../ui/Popover"

interface StanceData {
  entity: string
  stance: "positive" | "negative" | "neutral" | "not mentioned"
  confidence: number
  keyPhrases: string[]
  context: string
}

interface StanceAnalysisCardProps {
  data?: StanceData
  isLoading?: boolean
}

const StanceAnalysisCard: React.FC<StanceAnalysisCardProps> = ({ data, isLoading = false }) => {
  const [showPopover, setShowPopover] = useState(false)

  // Fallback data when no analysis is available
  const fallbackData: StanceData = {
    entity: "China",
    stance: "not mentioned",
    confidence: 0,
    keyPhrases: [],
    context: "",
  }

  const displayData = data || fallbackData
  const isEmpty = !data

  const getStanceIcon = (stance: string) => {
    switch (stance) {
      case "positive":
        return <TrendingUp className="w-5 h-5 text-green-600" />
      case "negative":
        return <TrendingDown className="w-5 h-5 text-red-600" />
      case "neutral":
        return <Minus className="w-5 h-5 text-yellow-600" />
      default:
        return <Globe className="w-5 h-5 text-gray-500" />
    }
  }

  const getStanceColor = (stance: string) => {
    switch (stance) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-200"
      case "negative":
        return "bg-red-100 text-red-800 border-red-200"
      case "neutral":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (isLoading) {
    return (
      <div className="card bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Stance Analysis
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
      <div className="card bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Stance Analysis
          </h3>
          {!isEmpty && displayData.stance !== "not mentioned" && (
            <button
              onClick={() => setShowPopover(true)}
              className="p-1 hover:bg-purple-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {getStanceIcon(displayData.stance)}
            <div className={`px-4 py-2 rounded-lg border ${getStanceColor(displayData.stance)}`}>
              <span className="font-medium">
                {displayData.stance === "not mentioned"
                  ? "Not Mentioned"
                  : displayData.stance.charAt(0).toUpperCase() + displayData.stance.slice(1)}
              </span>
              {displayData.stance !== "not mentioned" && !isEmpty && (
                <span className="text-sm ml-2">({Math.round(displayData.confidence * 100)}% confidence)</span>
              )}
            </div>
          </div>

          {displayData.stance === "not mentioned" ? (
            <p className="text-sm text-gray-600">
              {isEmpty
                ? "Analyze an article to see stance analysis"
                : "China is not mentioned in this article"}
            </p>
          ) : (
            !isEmpty && <p className="text-sm text-gray-700 mt-2">{displayData.context}</p>
          )}
        </div>
      </div>

      <Popover
        isOpen={showPopover}
        onClose={() => setShowPopover(false)}
        title="Stance Analysis on China"
        className="bg-gradient-to-br from-purple-50 to-indigo-50"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {getStanceIcon(displayData.stance)}
            <div>
              <div className={`px-4 py-2 rounded-lg border ${getStanceColor(displayData.stance)} inline-block`}>
                <span className="font-medium text-lg">
                  {displayData.stance.charAt(0).toUpperCase() + displayData.stance.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Confidence: {Math.round(displayData.confidence * 100)}%</p>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Context</h5>
            <p className="text-gray-700 leading-relaxed">{displayData.context}</p>
          </div>

          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Key Phrases</h5>
            <div className="space-y-2">
              {displayData.keyPhrases.length > 0 ? (
                displayData.keyPhrases.map((phrase, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-purple-100 text-sm text-gray-700">
                    "{phrase}"
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No key phrases detected</p>
              )}
            </div>
          </div>
        </div>
      </Popover>
    </>
  )
}

export default StanceAnalysisCard
