"use client"

import type React from "react"
import { useState } from "react"
import { FileText, Clock, Eye, ChevronRight } from "lucide-react"
import Popover from "../ui/Popover"

interface SummaryData {
  title: string
  summary: string
  readTime: string
  wordCount: number
}

interface SummaryCardProps {
  data?: SummaryData
  isLoading?: boolean
}

const SummaryCard: React.FC<SummaryCardProps> = ({ data, isLoading = false }) => {
  const [showPopover, setShowPopover] = useState(false)

  // Fallback data when no analysis is available
  const fallbackData: SummaryData = {
    title: "No Article Analyzed Yet",
    summary:
      "Analyze an article to see a detailed summary here. The summary will provide an overview of the article's main points and key arguments.",
    readTime: "0 min",
    wordCount: 0,
  }

  const displayData = data || fallbackData
  const isEmpty = !data

  if (isLoading) {
    return (
      <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Article Summary
          </h3>
          <div className="animate-pulse">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-20 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Article Summary
          </h3>
          {!isEmpty && (
            <button
              onClick={() => setShowPopover(true)}
              className="p-1 hover:bg-blue-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        <div className="space-y-3">
          <h4 className={`font-semibold text-lg ${isEmpty ? "text-gray-500" : "text-gray-900"}`}>
            {displayData.title}
          </h4>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{displayData.readTime}</span>
            </div>
            {!isEmpty && (
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{displayData.wordCount} words</span>
              </div>
            )}
          </div>

          <p className={`text-sm leading-relaxed ${isEmpty ? "text-gray-500" : "text-gray-700"}`}>
            {displayData.summary.substring(0, 150)}...
          </p>

          {isEmpty && (
            <div className="text-center py-4 mt-2">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Analyze an article to see its complete summary.</p>
            </div>
          )}
        </div>
      </div>

      <Popover
        isOpen={showPopover}
        onClose={() => setShowPopover(false)}
        title="Article Summary"
        className="bg-gradient-to-br from-blue-50 to-indigo-50"
      >
        <div className="space-y-4">
          <h4 className="font-semibold text-xl text-gray-900">{displayData.title}</h4>

          <div className="flex items-center gap-6 text-sm text-gray-600 pb-4 border-b border-blue-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{displayData.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{displayData.wordCount} words</span>
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">{displayData.summary}</p>
          </div>
        </div>
      </Popover>
    </>
  )
}

export default SummaryCard
