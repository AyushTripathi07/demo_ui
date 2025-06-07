"use client"

import type React from "react"
import { useState } from "react"
import { CheckCircle, Circle, Loader2, Link, History, ArrowRight } from "lucide-react"
import TabNavigation from "./TabNavigation"

interface ProcessingStep {
  id: string
  label: string
  completed: boolean
  active: boolean
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

interface ArticleAnalysisPanelProps {
  onAnalysisStart?: () => void
  onAnalysisComplete?: (result: AnalysisResult) => void
}

interface AnalyzedArticle {
  id: number
  url: string
  title: string
  summary: string
  topics: string[]
  author: string
  date: string
  stance: "positive" | "negative" | "neutral" | "not mentioned"
  wordCount: number
  fluffIndex: number
}

const ArticleAnalysisPanel: React.FC<ArticleAnalysisPanelProps> = ({ onAnalysisStart, onAnalysisComplete }) => {
  const [activeTab, setActiveTab] = useState("analyze")
  const [articleURL, setArticleURL] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [analyzedArticles, setAnalyzedArticles] = useState<AnalyzedArticle[]>([])

  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: "fetch", label: "Fetching article content", completed: false, active: false },
    { id: "analyze", label: "Analyzing content structure", completed: false, active: false },
    { id: "extract", label: "Extracting key topics", completed: false, active: false },
    { id: "insights", label: "Generating insights", completed: false, active: false },
  ])

  const handleAnalyze = async () => {
    if (!articleURL.trim()) return

    setIsProcessing(true)
    onAnalysisStart?.()

    // Reset steps
    setProcessingSteps((steps) => steps.map((step) => ({ ...step, completed: false, active: false })))

    // Simulate processing steps
    for (let i = 0; i < processingSteps.length; i++) {
      // Set current step as active
      setProcessingSteps((steps) =>
        steps.map((step, index) => ({
          ...step,
          active: index === i,
          completed: index < i,
        })),
      )

      // Wait for simulation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mark current step as completed
      setProcessingSteps((steps) =>
        steps.map((step, index) => ({
          ...step,
          active: false,
          completed: index <= i,
        })),
      )
    }

    // Generate mock analysis result
    const mockResult: AnalysisResult = {
      // Summary data
      title: "Understanding Modern Economic Policies and Their Global Impact",
      summary:
        "This comprehensive analysis explores the intricate relationship between contemporary economic policies and their far-reaching effects on global markets. The article delves into monetary policy decisions, fiscal strategies, and their implications for international trade relationships. Key findings suggest that coordinated policy approaches yield more stable outcomes than isolated national strategies. The research highlights how China's economic policies have influenced global supply chains and trade dynamics over the past decade, with particular emphasis on technology sectors and manufacturing. The author argues that multilateral cooperation is essential for addressing current economic challenges, especially in light of recent geopolitical tensions.This comprehensive analysis explores the intricate relationship between contemporary economic policies and their far-reaching effects on global markets. The article delves into monetary policy decisions, fiscal strategies, and their implications for international trade relationships. Key findings suggest that coordinated policy approaches yield more stable outcomes than isolated national strategies. The research highlights how China's economic policies have influenced global supply chains and trade dynamics over the past decade, with particular emphasis on technology sectors and manufacturing. The author argues that multilateral cooperation is essential for addressing current economic challenges, especially in light of recent geopolitical tensions.This comprehensive analysis explores the intricate relationship between contemporary economic policies and their far-reaching effects on global markets. The article delves into monetary policy decisions, fiscal strategies, and their implications for international trade relationships. Key findings suggest that coordinated policy approaches yield more stable outcomes than isolated national strategies. The research highlights how China's economic policies have influenced global supply chains and trade dynamics over the past decade, with particular emphasis on technology sectors and manufacturing. The author argues that multilateral cooperation is essential for addressing current economic challenges, especially in light of recent geopolitical tensions.",
      readTime: "8 min",
      wordCount: 2340,

      // Topic data
      topics: [
        { name: "Economics", relevance: 0.95 },
        { name: "Global Trade", relevance: 0.87 },
        { name: "Monetary Policy", relevance: 0.82 },
        { name: "China", relevance: 0.78 },
        { name: "Technology", relevance: 0.65 },
        { name: "Supply Chain", relevance: 0.61 },
        { name: "Geopolitics", relevance: 0.58 },
        { name: "Manufacturing", relevance: 0.52 },
        { name: "International Relations", relevance: 0.49 },
        { name: "Fiscal Policy", relevance: 0.45 },
      ],
      mainTheme: "Global Economic Interdependence",

      // Author data
      author: {
        name: "Dr. Sarah Johnson",
        credentials: "Ph.D. in International Economics",
        organization: "Global Economic Institute",
        publicationDate: "March 15, 2023",
        lastUpdated: "April 2, 2023",
        profileUrl: "https://example.com/authors/sjohnson",
        otherArticles: 27,
      },

      // Stance data
      stanceOnChina: {
        entity: "China",
        stance: "neutral",
        confidence: 0.82,
        keyPhrases: [
          "China's economic policies have influenced global supply chains",
          "China's approach to technology regulation deserves careful study",
          "Both cooperation and competition with China will shape future markets",
          "China's manufacturing sector continues to evolve in response to global demands",
        ],
        context:
          "The article presents a balanced view of China's economic role, acknowledging both its contributions to global growth and the challenges its policies present to Western economies. The author emphasizes the need for engagement rather than isolation, while also noting concerns about market access and intellectual property protection.",
      },

      // Named Entity data
      namedEntities: {
        people: ["Dr. Sarah Johnson", "Xi Jinping", "Jerome Powell", "Christine Lagarde", "Janet Yellen"],
        organizations: [
          "Federal Reserve",
          "European Central Bank",
          "World Trade Organization",
          "International Monetary Fund",
          "Bank of China",
          "Global Economic Institute",
        ],
        locations: ["China", "United States", "European Union", "Asia-Pacific", "Washington D.C.", "Beijing"],
        dates: ["March 15, 2023", "2020-2023", "Q4 2022", "January 2023"],
        misc: ["COVID-19", "Belt and Road Initiative", "CHIPS Act", "Digital Yuan"],
      },

      // Fluff Index data
      fluffIndex: {
        fluffPercentage: 18.5,
        totalWords: 2340,
        totalAdjectives: 433,
        qualityScore: "good",
        examples: [
          "comprehensive",
          "intricate",
          "contemporary",
          "far-reaching",
          "stable",
          "isolated",
          "global",
          "recent",
          "essential",
          "current",
          "multilateral",
          "economic",
          "international",
          "technological",
        ],
      },

      // Word Frequency data
      wordFrequency: {
        words: [
          { word: "economic", count: 47, percentage: 8.2 },
          { word: "policy", count: 42, percentage: 7.3 },
          { word: "global", count: 38, percentage: 6.6 },
          { word: "trade", count: 35, percentage: 6.1 },
          { word: "China", count: 32, percentage: 5.6 },
          { word: "market", count: 29, percentage: 5.0 },
          { word: "international", count: 26, percentage: 4.5 },
          { word: "technology", count: 24, percentage: 4.2 },
          { word: "monetary", count: 22, percentage: 3.8 },
          { word: "supply", count: 20, percentage: 3.5 },
          { word: "chain", count: 19, percentage: 3.3 },
          { word: "cooperation", count: 18, percentage: 3.1 },
          { word: "manufacturing", count: 17, percentage: 2.9 },
          { word: "fiscal", count: 16, percentage: 2.8 },
          { word: "growth", count: 15, percentage: 2.6 },
          { word: "strategy", count: 14, percentage: 2.4 },
          { word: "development", count: 13, percentage: 2.3 },
          { word: "investment", count: 12, percentage: 2.1 },
          { word: "regulation", count: 11, percentage: 1.9 },
          { word: "innovation", count: 10, percentage: 1.7 },
        ],
        totalWords: 2340,
        uniqueWords: 574,
        stopWordsRemoved: 1186,
      },
    }

    // Add to history
    const historyItem = {
      id: Date.now(), // Add unique ID
      url: articleURL,
      title: mockResult.title,
      summary: mockResult.summary.substring(0, 100) + "...",
      topics: mockResult.topics.slice(0, 3).map((t) => t.name),
      author: mockResult.author.name,
      date: mockResult.author.publicationDate,
      stance: mockResult.stanceOnChina.stance,
      wordCount: mockResult.wordCount,
      fluffIndex: mockResult.fluffIndex.fluffPercentage,
    }

    setAnalyzedArticles([historyItem, ...analyzedArticles])
    setArticleURL("")
    setIsProcessing(false)

    // Notify parent component
    onAnalysisComplete?.(mockResult)
  }

  const ProcessingSteps = () => (
    <div className="space-y-4 py-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Analyzing Article</h3>
        <p className="text-sm text-gray-400">Processing your article for insights...</p>
      </div>

      <div className="space-y-3">
        {processingSteps.map((step) => (
          <div key={step.id} className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {step.completed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : step.active ? (
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              ) : (
                <Circle className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  step.completed ? "text-green-400" : step.active ? "text-blue-400" : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
            </div>
            {step.completed && (
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-800/50">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} tabs={["analyze", "history"]} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "analyze" ? (
          <div className="p-6">
            {!isProcessing ? (
              <div className="space-y-6">
                {/* Input Section */}
                <div className="space-y-4">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4">
                      <Link className="w-8 h-8 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">Article Analysis</h2>
                    <p className="text-gray-400">Enter an article URL to get detailed insights and analysis</p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300">Article URL</label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://example.com/article"
                        value={articleURL}
                        onChange={(e) => setArticleURL(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                        disabled={isProcessing}
                      />
                      <Link className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={!articleURL.trim() || isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <span>Analyze Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>

                {/* Feature Highlights */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <h4 className="text-sm font-medium text-white mb-1">Content Analysis</h4>
                    <p className="text-xs text-gray-400">Extract key topics and themes</p>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <h4 className="text-sm font-medium text-white mb-1">Bias Detection</h4>
                    <p className="text-xs text-gray-400">Identify stance and perspective</p>
                  </div>
                </div>
              </div>
            ) : (
              <ProcessingSteps />
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <History className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-white">Analysis History</h3>
              {analyzedArticles.length > 0 && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                  {analyzedArticles.length}
                </span>
              )}
            </div>

            {analyzedArticles.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4">
                  <History className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400 mb-2">No articles analyzed yet</p>
                <p className="text-sm text-gray-500">Your analysis history will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analyzedArticles.map((article) => (
                  <div
                    key={article.id}
                    className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:bg-gray-800/50 transition-colors duration-200 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 mr-3">
                        <p className="text-white text-sm font-medium mb-1 line-clamp-2">{article.title}</p>
                        {/* <p className="text-gray-400 text-xs">
                          {new URL(article.url).hostname} • {article.date}
                        </p> */}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                          article.stance === "neutral"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : article.stance === "positive"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {article.stance}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="text-center p-2 bg-gray-700/30 rounded-lg">
                        <div className="text-sm font-medium text-white">{article.wordCount}</div>
                        <div className="text-xs text-gray-400">words</div>
                      </div>
                      <div className="text-center p-2 bg-gray-700/30 rounded-lg">
                        <div className="text-sm font-medium text-white">{article.fluffIndex}%</div>
                        <div className="text-xs text-gray-400">fluff</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {article.topics.map((topic: string) => (
                        <span key={topic} className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded-md">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ArticleAnalysisPanel
