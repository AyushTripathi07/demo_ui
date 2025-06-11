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
//   const generateMockAnalysisFromSummary = (summary: SummaryData): AnalysisResult => {
//     const mockTopics = [
//       ["AI", "Healthcare", "Technology", "Innovation", "Medicine"],
//       ["Climate", "Environment", "Sustainability", "Policy", "Research"],
//       ["Psychology", "Behavior", "Decision Making", "Cognitive Science", "Research"],
//       ["Quantum", "Computing", "Technology", "Physics", "Innovation"],
//     ]

//     const mockAuthors = [
//       { name: "Dr. Sarah Johnson", credentials: "Ph.D. in Computer Science", org: "MIT Technology Review" },
//       { name: "Prof. Michael Chen", credentials: "Ph.D. in Environmental Science", org: "Stanford Research Institute" },
//       { name: "Dr. Emily Rodriguez", credentials: "Ph.D. in Psychology", org: "Harvard Medical School" },
//       { name: "Prof. David Kim", credentials: "Ph.D. in Physics", org: "Quantum Research Lab" },
//     ]

//     const mockStances = ["positive", "negative", "neutral"] as const
//     const mockQualityScores = ["excellent", "good", "fair", "poor"] as const

//     const topicSet = mockTopics[Math.floor(Math.random() * mockTopics.length)]
//     const author = mockAuthors[Math.floor(Math.random() * mockAuthors.length)]
//     const stance = mockStances[Math.floor(Math.random() * mockStances.length)]
//     const qualityScore = mockQualityScores[Math.floor(Math.random() * mockQualityScores.length)]

//     return {
//       // Summary data
//       title: summary.title,
//       summary: summary.summary,
//       readTime: summary.readTime,
//       wordCount: summary.wordCount,

//       // Topic data
//       topics: topicSet.map((topic, index) => ({
//         name: topic,
//         relevance: Math.max(0.3, Math.random() * (1 - index * 0.1)),
//       })),
//       mainTheme: topicSet[0],

//       // Author data
//       author: {
//         name: author.name,
//         credentials: author.credentials,
//         organization: author.org,
//         publicationDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
//         lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
//         otherArticles: Math.floor(Math.random() * 50) + 5,
//       },

//       // Stance data
//       stanceOnChina: {
//         entity: "China",
//         stance: stance,
//         confidence: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
//         keyPhrases: [
//           "China's technological advancement",
//           "Economic cooperation with China",
//           "China's global influence",
//           "Bilateral trade relations",
//         ].slice(0, Math.floor(Math.random() * 3) + 2),
//         context: `Analysis of ${summary.title} reveals ${stance} sentiment regarding China's role in the discussed topics.`,
//       },

//       // Named Entity data
//       namedEntities: {
//         people: ["Xi Jinping", "Joe Biden", "Elon Musk", "Bill Gates"].slice(0, Math.floor(Math.random() * 3) + 2),
//         organizations: ["WHO", "UN", "Tesla", "Microsoft", "Google"].slice(0, Math.floor(Math.random() * 4) + 2),
//         locations: ["China", "United States", "Europe", "Asia", "Silicon Valley"].slice(
//           0,
//           Math.floor(Math.random() * 4) + 2,
//         ),
//         dates: ["2024", "2023", "Q4 2023", "January 2024"].slice(0, Math.floor(Math.random() * 3) + 1),
//         misc: ["COVID-19", "AI Revolution", "Climate Change", "Digital Transformation"].slice(
//           0,
//           Math.floor(Math.random() * 3) + 1,
//         ),
//       },

//       // Fluff Index data
//       fluffIndex: {
//         fluffPercentage: Math.random() * 40 + 10, // 10-50%
//         totalWords: summary.wordCount,
//         totalAdjectives: Math.floor(summary.wordCount * (Math.random() * 0.15 + 0.1)), // 10-25% of words
//         qualityScore: qualityScore,
//         examples: ["comprehensive", "innovative", "significant", "remarkable", "outstanding"].slice(
//           0,
//           Math.floor(Math.random() * 4) + 2,
//         ),
//       },

//       // Word Frequency data
//       wordFrequency: {
//         words: topicSet
//           .map((word, index) => ({
//             word: word.toLowerCase(),
//             count: Math.floor(Math.random() * 20) + 10 - index * 2,
//             percentage: Math.random() * 5 + 2 - index * 0.5,
//           }))
//           .slice(0, 8),
//         totalWords: summary.wordCount,
//         uniqueWords: Math.floor(summary.wordCount * (Math.random() * 0.3 + 0.4)), // 40-70% unique
//         stopWordsRemoved: Math.floor(summary.wordCount * (Math.random() * 0.2 + 0.3)), // 30-50% stop words
//       },
//     }
//   }

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
    // Only update the summary data, don't generate mock analysis for other cards
    // The full analysis should only happen through the actual analysis process
    console.log("Summary selected:", summary.title)
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
              disableSampleSelection={!hasCompletedAnalysis}
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
          {/* <VisitorsCard /> */}
        </div>

        {/* <FeatureCards /> */}
      </div>

      {/* Right Panel - Article Analysis */}
      <div className="flex-[0.35] sticky top-0 h-[calc(100vh-6rem)]">
        <ArticleScraperPanel onAnalysisStart={handleAnalysisStart} onAnalysisComplete={handleAnalysisComplete} />
      </div>
    </div>
  )
}

export default ArticleScraper
