"use client"

import type React from "react"
import { useState } from "react"
import StatisticsHeader from "./StatisticsHeader"
import TopicAnalysisCard from "./cards/TopicAnalysisCard"
import AuthorInfoCard from "./cards/AuthorInfoCard"
import StanceAnalysisCard from "./cards/StanceAnalysisCard"
import NamedEntityCard from "./cards/NamedEntityCard"
import FluffIndexCard from "./cards/FluffIndexCard"
import WordFrequencyCard from "./cards/WordFrequencyCard"
import ArticleScraperPanel from "./ArticleAnalysisPanel"
import SwipeableSummaryCard from "./cards/swipeable-summary-card"

interface SummaryData {
  id: string
  title: string
  summary: string
  readTime: string
  wordCount: number
}

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

const ArticleScraper: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasCompletedAnalysis, setHasCompletedAnalysis] = useState(false)

  // Generate mock analysis data based on selected summary
  const generateMockAnalysisFromSummary = (summary: SummaryData): AnalysisResult => {
    const mockTopics = [
      ["AI", "Healthcare", "Technology", "Innovation", "Medicine"],
      ["Climate", "Environment", "Sustainability", "Policy", "Research"],
      ["Psychology", "Behavior", "Decision Making", "Cognitive Science", "Research"],
      ["Quantum", "Computing", "Technology", "Physics", "Innovation"],
    ]

    const mockAuthors = [
      { name: "Dr. Sarah Johnson", credentials: "Ph.D. in Computer Science", org: "MIT Technology Review" },
      { name: "Prof. Michael Chen", credentials: "Ph.D. in Environmental Science", org: "Stanford Research Institute" },
      { name: "Dr. Emily Rodriguez", credentials: "Ph.D. in Psychology", org: "Harvard Medical School" },
      { name: "Prof. David Kim", credentials: "Ph.D. in Physics", org: "Quantum Research Lab" },
    ]

    const mockStances = ["positive", "negative", "neutral"] as const
    const mockQualityScores = ["excellent", "good", "fair", "poor"] as const

    // Use summary ID to ensure consistent mock data for the same summary
    const summaryIndex = Number.parseInt(summary.id) || 0
    const topicSet = mockTopics[summaryIndex % mockTopics.length]
    const author = mockAuthors[summaryIndex % mockAuthors.length]
    const stance = mockStances[summaryIndex % mockStances.length]
    const qualityScore = mockQualityScores[summaryIndex % mockQualityScores.length]

    return {
      // Summary data
      title: summary.title,
      summary: summary.summary,
      readTime: summary.readTime,
      wordCount: summary.wordCount,

      // Topic data
      topics: topicSet.map((topic, index) => ({
        name: topic,
        relevance: Math.max(0.3, 1 - index * 0.15 + ((summaryIndex * 0.05) % 0.3)),
      })),
      mainTheme: topicSet[0],

      // Author data
      author: {
        name: author.name,
        credentials: author.credentials,
        organization: author.org,
        publicationDate: new Date(Date.now() - (summaryIndex + 1) * 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        lastUpdated: new Date(Date.now() - summaryIndex * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        otherArticles: Math.floor((summaryIndex + 1) * 12) + 5,
      },

      // Stance data
      stanceOnChina: {
        entity: "China",
        stance: stance,
        confidence: 0.6 + ((summaryIndex * 0.1) % 0.4), // Consistent confidence based on summary
        keyPhrases: [
          "China's technological advancement",
          "Economic cooperation with China",
          "China's global influence",
          "Bilateral trade relations",
          "China's research initiatives",
          "Sino-American relations",
        ].slice(summaryIndex, summaryIndex + 3),
        context: `Analysis of ${summary.title} reveals ${stance} sentiment regarding China's role in the discussed topics.`,
      },

      // Named Entity data
      namedEntities: {
        people: ["Xi Jinping", "Joe Biden", "Elon Musk", "Bill Gates", "Tim Cook", "Satya Nadella"].slice(
          summaryIndex,
          summaryIndex + 3,
        ),
        organizations: ["WHO", "UN", "Tesla", "Microsoft", "Google", "Apple", "Meta", "OpenAI"].slice(
          summaryIndex,
          summaryIndex + 4,
        ),
        locations: ["China", "United States", "Europe", "Asia", "Silicon Valley", "Beijing", "Washington DC"].slice(
          summaryIndex,
          summaryIndex + 3,
        ),
        dates: ["2024", "2023", "Q4 2023", "January 2024", "March 2024", "Q1 2024"].slice(
          summaryIndex,
          summaryIndex + 2,
        ),
        misc: [
          "COVID-19",
          "AI Revolution",
          "Climate Change",
          "Digital Transformation",
          "Quantum Computing",
          "Blockchain",
        ].slice(summaryIndex, summaryIndex + 2),
      },

      // Fluff Index data
      fluffIndex: {
        fluffPercentage: 15 + ((summaryIndex * 8) % 25), // 15-40% based on summary
        totalWords: summary.wordCount,
        totalAdjectives: Math.floor(summary.wordCount * (0.12 + ((summaryIndex * 0.03) % 0.1))), // Varies by summary
        qualityScore: qualityScore,
        examples: [
          "comprehensive",
          "innovative",
          "significant",
          "remarkable",
          "outstanding",
          "groundbreaking",
          "revolutionary",
        ].slice(summaryIndex, summaryIndex + 3),
      },

      // Word Frequency data
      wordFrequency: {
        words: topicSet
          .map((word, index) => ({
            word: word.toLowerCase(),
            count: Math.floor((summaryIndex + 1) * 5 + 15 - index * 2),
            percentage: (summaryIndex + 1) * 1.2 + 3 - index * 0.8,
          }))
          .slice(0, 8),
        totalWords: summary.wordCount,
        uniqueWords: Math.floor(summary.wordCount * (0.45 + ((summaryIndex * 0.05) % 0.2))), // 45-65% unique
        stopWordsRemoved: Math.floor(summary.wordCount * (0.35 + ((summaryIndex * 0.03) % 0.15))), // 35-50% stop words
      },
    }
  }

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result)
    setIsAnalyzing(false)
    setHasCompletedAnalysis(true)
  }

  const handleAnalysisStart = () => {
    setIsAnalyzing(true)
    setAnalysisResult(null)
    setHasCompletedAnalysis(false)
  }

  // Handle summary selection from SwipeableSummaryCard
  const handleSummarySelect = (summary: SummaryData) => {
    console.log("Summary selected:", summary.title)

    // Generate mock analysis data for all cards when a summary is selected
    const mockAnalysis = generateMockAnalysisFromSummary(summary)
    setAnalysisResult(mockAnalysis)

    // Mark as having completed analysis so the cards show data
    if (!hasCompletedAnalysis) {
      setHasCompletedAnalysis(true)
    }
  }

  return (
    <div className="flex gap-6 px-6 py-6">
      {/* Main Content Area */}
      <div className="flex-[0.65] space-y-6">
        <StatisticsHeader title="Article Analysis" onRefresh={() => console.log("Refreshing article data...")} />

        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <SwipeableSummaryCard
              initialData={
                hasCompletedAnalysis && analysisResult
                  ? {
                      id: "current",
                      title: analysisResult.title,
                      summary: analysisResult.summary,
                      readTime: analysisResult.readTime,
                      wordCount: analysisResult.wordCount,
                    }
                  : undefined
              }
              isLoading={isAnalyzing}
              onSelectSummary={handleSummarySelect}
              disableSampleSelection={false} // Allow sample selection to trigger mock data
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
          <StanceAnalysisCard data={analysisResult?.stanceOnChina} isLoading={isAnalyzing} />
          <NamedEntityCard data={analysisResult?.namedEntities} isLoading={isAnalyzing} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FluffIndexCard data={analysisResult?.fluffIndex} isLoading={isAnalyzing} />
          <WordFrequencyCard data={analysisResult?.wordFrequency} isLoading={isAnalyzing} />
        </div>
      </div>

      {/* Right Panel - Article Analysis */}
      <div className="flex-[0.35] sticky top-0 h-[calc(100vh-6rem)]">
        <ArticleScraperPanel onAnalysisStart={handleAnalysisStart} onAnalysisComplete={handleAnalysisComplete} />
      </div>
    </div>
  )
}

export default ArticleScraper
