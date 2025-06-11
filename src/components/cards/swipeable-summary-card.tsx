"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, type PanInfo, useAnimation } from "framer-motion"
import { FileText, Clock, Eye, ChevronLeft, ChevronRight, Expand } from "lucide-react"
import Popover from "../ui/Popover"

interface SummaryData {
  id: string
  title: string
  summary: string
  readTime: string
  wordCount: number
}

interface SummaryCardProps {
  initialData?: SummaryData
  isLoading?: boolean
  onSelectSummary?: (summary: SummaryData) => void
  disableSampleSelection?: boolean
}

// Sample data for summaries
const SAMPLE_SUMMARIES: SummaryData[] = [
  {
    id: "1",
    title: "The Future of AI in Healthcare",
    summary:
      "Artificial intelligence is revolutionizing healthcare by improving diagnostic accuracy, personalizing treatment plans, and streamlining administrative tasks. Recent studies show that AI algorithms can detect certain cancers with higher accuracy than human radiologists. However, challenges remain in terms of data privacy, regulatory approval, and integration with existing healthcare systems. Experts predict that within the next decade, AI will become a standard tool in medical practice, potentially saving millions of lives and billions in healthcare costs. Artificial intelligence is revolutionizing healthcare by improving diagnostic accuracy, personalizing treatment plans, and streamlining administrative tasks. Recent studies show that AI algorithms can detect certain cancers with higher accuracy than human radiologists. However, challenges remain in terms of data privacy, regulatory approval, and integration with existing healthcare systems. Experts predict that within the next decade, AI will become a standard tool in medical practice, potentially saving millions of lives and billions in healthcare costs. Artificial intelligence is revolutionizing healthcare by improving diagnostic accuracy, personalizing treatment plans, and streamlining administrative tasks. Recent studies show that AI algorithms can detect certain cancers with higher accuracy than human radiologists. However, challenges remain in terms of data privacy, regulatory approval, and integration with existing healthcare systems. Experts predict that within the next decade, AI will become a standard tool in medical practice, potentially saving millions of lives and billions in healthcare costs.",
    readTime: "4 min",
    wordCount: 420,
  },
  {
    id: "2",
    title: "Climate Change: Latest Research",
    summary:
      "Recent climate research indicates that global temperatures are rising faster than previously predicted. The latest IPCC report warns that we may reach critical tipping points within the next 20 years if carbon emissions aren't drastically reduced. Scientists have observed accelerated ice sheet melting in Antarctica and Greenland, contributing to sea level rise. Meanwhile, extreme weather events including floods, droughts, and wildfires have increased in frequency and intensity worldwide. The report calls for immediate action to transition to renewable energy sources and implement carbon capture technologies.Recent climate research indicates that global temperatures are rising faster than previously predicted. The latest IPCC report warns that we may reach critical tipping points within the next 20 years if carbon emissions aren't drastically reduced. Scientists have observed accelerated ice sheet melting in Antarctica and Greenland, contributing to sea level rise. Meanwhile, extreme weather events including floods, droughts, and wildfires have increased in frequency and intensity worldwide. The report calls for immediate action to transition to renewable energy sources and implement carbon capture technologies.Recent climate research indicates that global temperatures are rising faster than previously predicted. The latest IPCC report warns that we may reach critical tipping points within the next 20 years if carbon emissions aren't drastically reduced. Scientists have observed accelerated ice sheet melting in Antarctica and Greenland, contributing to sea level rise. Meanwhile, extreme weather events including floods, droughts, and wildfires have increased in frequency and intensity worldwide. The report calls for immediate action to transition to renewable energy sources and implement carbon capture technologies.",
    readTime: "6 min",
    wordCount: 560,
  },
  {
    id: "3",
    title: "The Psychology of Decision Making",
    summary:
      "Cognitive biases significantly impact our decision-making processes in ways we often don't recognize. Research in behavioral economics has identified dozens of these biases, from confirmation bias to the sunk cost fallacy. These mental shortcuts evolved to help us make quick decisions but can lead to systematic errors in judgment. Studies show that awareness of these biases doesn't necessarily prevent them; instead, creating decision-making frameworks and checklists can help mitigate their effects. Organizations that implement structured decision processes tend to outperform those relying on intuition alone.",
    readTime: "5 min",
    wordCount: 490,
  },
  {
    id: "4",
    title: "Advances in Quantum Computing",
    summary:
      "Quantum computing has reached several milestones in the past year, with researchers achieving quantum supremacy in new domains. Unlike classical computers that use bits, quantum computers use qubits that can exist in multiple states simultaneously, allowing them to solve complex problems exponentially faster. Recent breakthroughs in error correction and qubit stability have extended coherence times, making practical quantum applications more feasible. Industries from pharmaceuticals to finance are exploring how quantum algorithms could transform their operations, though widespread commercial applications remain several years away.",
    readTime: "7 min",
    wordCount: 610,
  },
]

// Fallback data when no analysis is available
const FALLBACK_DATA: SummaryData = {
  id: "0",
  title: "No Article Analyzed Yet",
  summary:
    "Analyze an article to see a detailed summary here. The summary will provide an overview of the article's main points and key arguments.",
  readTime: "0 min",
  wordCount: 0,
}

// interface PopoverProps {
//   isOpen: boolean
//   onClose: () => void
//   title: string
//   children: React.ReactNode
// }

const SwipeableSummaryCard: React.FC<SummaryCardProps> = ({
  initialData,
  isLoading = false,
  onSelectSummary,
  disableSampleSelection = false,
}) => {
  const [currentSummary, setCurrentSummary] = useState<SummaryData>(initialData || FALLBACK_DATA)
  const [isOpen, setIsOpen] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const controls = useAnimation()
  const constraintsRef = useRef(null)

  const isEmpty = !initialData && currentSummary.id === "0"

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100

    if (info.offset.x < -threshold && !isOpen) {
      // Open the side panel
      controls.start({ x: "-60%" })
      setIsOpen(true)
    } else if ((info.offset.x > threshold && isOpen) || (isOpen && info.velocity.x > 100)) {
      // Close the side panel
      controls.start({ x: 0 })
      setIsOpen(false)
    } else {
      // Return to original position
      controls.start({ x: isOpen ? "-60%" : 0 })
    }
  }

  const selectSummary = (summary: SummaryData) => {
    if (disableSampleSelection) {
      return // Don't allow selection of sample summaries if analysis hasn't been completed
    }

    setCurrentSummary(summary)
    // Trigger the callback to update parent component
    onSelectSummary?.(summary)
    controls.start({ x: 0 })
    setIsOpen(false)
  }

  const toggleSidePanel = () => {
    if (isOpen) {
      controls.start({ x: 0 })
      setIsOpen(false)
    } else {
      controls.start({ x: "-60%" })
      setIsOpen(true)
    }
  }

  if (isLoading) {
    return (
      <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow">
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
    <div className="relative overflow-hidden rounded-lg" style={{ touchAction: "pan-y" }} ref={constraintsRef}>
      {/* Main card content */}
      <motion.div
        className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow relative z-10"
        drag="x"
        dragConstraints={constraintsRef}
        onDragEnd={handleDragEnd}
        animate={controls}
        initial={{ x: 0 }}
        transition={{ type: "tween", duration: 0, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Article Summary
          </h3>
          <div className="flex items-center gap-1">
            {!isEmpty && (
              <button
                onClick={() => setIsPopoverOpen(true)}
                className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                aria-label="Expand summary"
              >
                <Expand className="w-4 h-4 text-gray-600" />
              </button>
            )}
            <button
              onClick={toggleSidePanel}
              className="p-1 hover:bg-blue-100 rounded-full transition-colors"
              aria-label={isOpen ? "Close summaries" : "View more summaries"}
            >
              {isOpen ? (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className={`font-semibold text-lg ${isEmpty ? "text-gray-500" : "text-gray-900"}`}>
            {currentSummary.title}
          </h4>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{currentSummary.readTime}</span>
            </div>
            {!isEmpty && (
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{currentSummary.wordCount} words</span>
              </div>
            )}
          </div>

          <p className={`text-sm leading-relaxed ${isEmpty ? "text-gray-500" : "text-gray-700"}`}>
            {currentSummary.summary.substring(0, 600)}...
          </p>

          {isEmpty && (
            <div className="text-center py-4 mt-2">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                {disableSampleSelection
                  ? "Start an analysis to see the summary here."
                  : "Analyze an article or swipe left to see available summaries."}
              </p>
            </div>
          )}
        </div>

        {/* Drag indicator */}
        <div className="absolute left-0 top-0 bottom-0 w-1 flex items-center">
          <div className="h-16 w-1 bg-blue-200 rounded-r opacity-50"></div>
        </div>
      </motion.div>

      {/* Side panel with summary options */}
      <div className="absolute top-0 right-0 bottom-0 w-[60%] bg-white border-l border-blue-200 rounded-r-lg shadow-lg p-4 overflow-y-auto">
        <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Available Summaries
        </h3>

        {!disableSampleSelection ? (
          <div className="space-y-3">
            {SAMPLE_SUMMARIES.map((summary) => (
              <div
                key={summary.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  currentSummary.id === summary.id
                    ? "bg-blue-100 border border-blue-200"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
                onClick={() => selectSummary(summary)}
              >
                <h4 className="font-medium text-gray-800 text-sm">{summary.title}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {summary.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {summary.wordCount} words
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No summaries available yet</p>
            <p className="text-gray-400 text-xs mt-1">Complete an analysis to see summaries here</p>
          </div>
        )}
      </div>
      {/* Popover for full summary */}
      <Popover isOpen={isPopoverOpen} onClose={() => setIsPopoverOpen(false)} title={currentSummary.title}>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{currentSummary.readTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{currentSummary.wordCount} words</span>
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{currentSummary.summary}</p>
          </div>
        </div>
      </Popover>
    </div>
  )
}

export default SwipeableSummaryCard
