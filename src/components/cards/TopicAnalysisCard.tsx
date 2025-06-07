"use client"

import type React from "react"
import { useState } from "react"
import { Tag, BarChart2, ChevronRight } from "lucide-react"
import Popover from "../ui/Popover"

interface TopicData {
  topics: Array<{
    name: string
    relevance: number
  }>
  mainTheme: string
}

interface TopicAnalysisCardProps {
  data?: TopicData
  isLoading?: boolean
}

const TopicAnalysisCard: React.FC<TopicAnalysisCardProps> = ({ data, isLoading = false }) => {
  const [showPopover, setShowPopover] = useState(false)

  // Fallback data when no analysis is available
  const fallbackData: TopicData = {
    topics: [],
    mainTheme: "No theme detected",
  }

  const displayData = data || fallbackData
  const isEmpty = !data

  if (isLoading) {
    return (
      <div className="card bg-gradient-to-br from-green-50 to-teal-50 border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Topic Analysis
          </h3>
          <div className="animate-pulse">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-20 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="card bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Topic Analysis
          </h3>
          {!isEmpty && displayData.topics.length > 0 && (
            <button
              onClick={() => setShowPopover(true)}
              className="p-1 hover:bg-green-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Main Theme</p>
            <h4 className={`font-semibold text-lg ${isEmpty ? "text-gray-500" : "text-gray-900"}`}>
              {displayData.mainTheme}
            </h4>
          </div>

          {!isEmpty && displayData.topics.length > 0 ? (
            <div>
              <p className="text-sm text-gray-600 mb-2">Key Topics</p>
              <div className="flex flex-wrap gap-2">
                {displayData.topics.slice(0, 5).map((topic, index) => (
                  <div
                    key={index}
                    className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full flex items-center gap-1"
                  >
                    <span className="text-sm">{topic.name}</span>
                    <span className="text-xs bg-green-200 px-1.5 py-0.5 rounded-full">
                      {Math.round(topic.relevance * 100)}%
                    </span>
                  </div>
                ))}
                {displayData.topics.length > 5 && (
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm">
                    +{displayData.topics.length - 5} more
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <Tag className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                {isEmpty ? "Analyze an article to see topic analysis" : "No topics detected"}
              </p>
            </div>
          )}
        </div>
      </div>

      <Popover
        isOpen={showPopover}
        onClose={() => setShowPopover(false)}
        title="Topic Analysis"
        className="bg-gradient-to-br from-green-50 to-teal-50"
      >
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Main Theme</p>
            <h4 className="font-semibold text-xl text-gray-900">{displayData.mainTheme}</h4>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
              <BarChart2 className="w-4 h-4" />
              Topic Relevance Analysis
            </p>
            <div className="space-y-3">
              {displayData.topics.map((topic, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{topic.name}</span>
                    <span className="text-gray-600">{Math.round(topic.relevance * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.round(topic.relevance * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-3">All Topics</p>
            <div className="flex flex-wrap gap-2">
              {displayData.topics.map((topic, index) => (
                <div
                  key={index}
                  className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full flex items-center gap-1"
                >
                  <span className="text-sm">{topic.name}</span>
                  <span className="text-xs bg-green-200 px-1.5 py-0.5 rounded-full">
                    {Math.round(topic.relevance * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Popover>
    </>
  )
}

export default TopicAnalysisCard
