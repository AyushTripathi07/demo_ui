"use client"

import type React from "react"
import { useState } from "react"
import { Hash, TrendingUp, ChevronRight } from 'lucide-react'
import Popover from "../ui/Popover"

interface WordFrequencyData {
  words: Array<{
    word: string
    count: number
    percentage: number
  }>
  totalWords: number
  uniqueWords: number
  stopWordsRemoved: number
}

interface WordFrequencyCardProps {
  data?: WordFrequencyData
  isLoading?: boolean
}

const WordFrequencyCard: React.FC<WordFrequencyCardProps> = ({ data, isLoading = false }) => {
  const [showPopover, setShowPopover] = useState(false)

  // Fallback data when no analysis is available
  const fallbackData: WordFrequencyData = {
    words: [],
    totalWords: 0,
    uniqueWords: 0,
    stopWordsRemoved: 0,
  }

  const displayData = data || fallbackData
  const isEmpty = !data

  if (isLoading) {
    return (
      <div className="card bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Word Frequency
          </h3>
          <div className="animate-pulse">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-20 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  const topWords = displayData.words.slice(0, 5)

  return (
    <>
      <div className="card bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Word Frequency
          </h3>
          {!isEmpty && displayData.words.length > 0 && (
            <button
              onClick={() => setShowPopover(true)}
              className="p-1 hover:bg-violet-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{displayData.uniqueWords}</div>
            <p className="text-sm text-gray-600">
              {isEmpty ? "No words analyzed" : "unique words"}
            </p>
          </div>

          {!isEmpty && displayData.words.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-2">Most Frequent Words</p>
              {topWords.map((wordData, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-violet-100 text-violet-700 rounded-full text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{wordData.word}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{wordData.count}</span>
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-violet-500 h-2 rounded-full"
                        style={{ width: `${Math.min(wordData.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              {displayData.words.length > 5 && (
                <p className="text-xs text-gray-500 text-center pt-2">
                  +{displayData.words.length - 5} more words
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <Hash className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                {isEmpty ? "Analyze an article to see word frequency" : "No words detected"}
              </p>
            </div>
          )}
        </div>
      </div>

      <Popover
        isOpen={showPopover}
        onClose={() => setShowPopover(false)}
        title="Word Frequency Analysis"
        className="bg-gradient-to-br from-violet-50 to-purple-50"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{displayData.totalWords}</div>
              <p className="text-sm text-gray-600">Total Words</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{displayData.uniqueWords}</div>
              <p className="text-sm text-gray-600">Unique Words</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{displayData.stopWordsRemoved}</div>
              <p className="text-sm text-gray-600">Stop Words Removed</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-violet-600" />
              <h5 className="font-semibold text-gray-900">Word Frequency Distribution</h5>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {displayData.words.map((wordData, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-violet-100 text-violet-700 rounded-full text-sm flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">{wordData.word}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{wordData.count} times</span>
                    <span className="text-sm text-violet-600 font-medium">
                      {wordData.percentage.toFixed(1)}%
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-violet-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(wordData.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-violet-100/50 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-2">About Word Frequency Analysis</h5>
            <p className="text-sm text-gray-700 leading-relaxed">
              This analysis shows the most frequently used words in the article after removing common stop words 
              (like "the", "and", "is", etc.). It helps identify the key terms and concepts that the author 
              emphasizes throughout the text. Higher frequency often indicates more important topics or themes.
            </p>
          </div>
        </div>
      </Popover>
    </>
  )
}

export default WordFrequencyCard
