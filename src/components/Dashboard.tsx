"use client"

import type React from "react"
import { useState } from "react"
import StatisticsHeader from "./StatisticsHeader"
import SummaryCard from "./cards/SummaryCard"
import TopicAnalysisCard from "./cards/TopicAnalysisCard"
import AuthorInfoCard from "./cards/AuthorInfoCard"
import StanceAnalysisCard from "./cards/StanceAnalysisCard"
import NamedEntityCard from "./cards/NamedEntityCard"
import FluffIndexCard from "./cards/FluffIndexCard"
import WordFrequencyCard from "./cards/WordFrequencyCard"
import ArticleAnalysisPanel from "./ArticleAnalysis"

interface AnalysisResult {
  // Summary data
  title: string
  summary: string
  readTime: string
  wordCount: number

  // Topic data
  topics: Array<{
    name: string
    relevance: number
  }>
  mainTheme: string

  // Author data
  author: {
    name: string
    credentials?: string
    organization?: string
    publicationDate: string
    lastUpdated?: string
    profileUrl?: string
    otherArticles?: number
  }

  // Stance data
  stanceOnChina: {
    entity: string
    stance: "positive" | "negative" | "neutral" | "not mentioned"
    confidence: number
    keyPhrases: string[]
    context: string
  }

  // Named Entity data
  namedEntities: {
    people: string[]
    organizations: string[]
    locations: string[]
    dates: string[]
    misc: string[]
  }

  // Fluff Index data
  fluffIndex: {
    fluffPercentage: number
    totalWords: number
    totalAdjectives: number
    qualityScore: "excellent" | "good" | "fair" | "poor"
    examples: string[]
  }

  // Word Frequency data
  wordFrequency: {
    words: Array<{
      word: string
      count: number
      percentage: number
    }>
    totalWords: number
    uniqueWords: number
    stopWordsRemoved: number
  }
}

const Dashboard: React.FC = () => {
  // const [activeTab, setActiveTab] = useState("today")
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result)
    setIsAnalyzing(false)
  }

  const handleAnalysisStart = () => {
    setIsAnalyzing(true)
    setAnalysisResult(null)
  }

  return (
    <div className="flex gap-6 px-6 py-6">
      {/* Main Content Area */}
      <div className="flex-[0.65] space-y-6">
        <StatisticsHeader onRefresh={() => console.log("Refreshing dashboard data...")} />

        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <SummaryCard
              data={
                analysisResult
                  ? {
                      title: analysisResult.title,
                      summary: analysisResult.summary,
                      readTime: analysisResult.readTime,
                      wordCount: analysisResult.wordCount,
                    }
                  : undefined
              }
              isLoading={isAnalyzing}
            />
          </div>

          <TopicAnalysisCard
            data={
              analysisResult
                ? {
                    topics: analysisResult.topics,
                    mainTheme: analysisResult.mainTheme,
                  }
                : undefined
            }
            isLoading={isAnalyzing}
          />

          <AuthorInfoCard data={analysisResult?.author} isLoading={isAnalyzing} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FluffIndexCard data={analysisResult?.fluffIndex} isLoading={isAnalyzing} />

          <NamedEntityCard data={analysisResult?.namedEntities} isLoading={isAnalyzing} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <StanceAnalysisCard data={analysisResult?.stanceOnChina} isLoading={isAnalyzing} />
          <WordFrequencyCard data={analysisResult?.wordFrequency} isLoading={isAnalyzing} />
          {/* <VisitorsCard /> */}
        </div>

        {/* <FeatureCards /> */}
      </div>

      {/* Right Panel - Article Analysis */}
      <div className="flex-[0.35] sticky top-0 h-[calc(100vh-6rem)]">
        <ArticleAnalysisPanel onAnalysisStart={handleAnalysisStart} onAnalysisComplete={handleAnalysisComplete} />
      </div>
    </div>
  )
}

export default Dashboard
