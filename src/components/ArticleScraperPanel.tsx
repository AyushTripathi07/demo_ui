"use client"

import type React from "react"
import { useState } from "react"
import { CheckCircle, Circle, Loader2, Link, History, ArrowRight, ChevronDown } from "lucide-react"
import TabNavigation from "./TabNavigation"
import DateRangePicker from "./DateRangePicker"

interface ProcessingStep {
  id: string
  label: string
  completed: boolean
  active: boolean
}

interface DateRange {
  start: string
  end: string
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

interface ArticleScraperPanelProps {
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
  mediaHouse: string
}

const mediaHouses = [
  { id: "media1", name: "Media House 1", description: "Leading news organization" },
  { id: "media2", name: "Media House 2", description: "International news network" },
  { id: "media3", name: "Media House 3", description: "Digital media platform" },
  { id: "media4", name: "Media House 4", description: "Business news outlet" },
  { id: "media5", name: "Media House 5", description: "Technology news source" },
]

const ArticleScraperPanel: React.FC<ArticleScraperPanelProps> = ({ onAnalysisStart, onAnalysisComplete }) => {
  const [activeTab, setActiveTab] = useState("analyze")
  const [articleURL, setArticleURL] = useState("")
  const [selectedMediaHouse, setSelectedMediaHouse] = useState("")
  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" })
  const [isProcessing, setIsProcessing] = useState(false)
  const [analyzedArticles, setAnalyzedArticles] = useState<AnalyzedArticle[]>([])
  const [isMediaDropdownOpen, setIsMediaDropdownOpen] = useState(false)
  const [foundArticles, setFoundArticles] = useState<AnalysisResult[]>([])
  const [showArticleSelection, setShowArticleSelection] = useState(false)
  const [selectedArticleIndex, setSelectedArticleIndex] = useState<number | null>(null)

  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: "fetch", label: "Fetching article content", completed: false, active: false },
    { id: "analyze", label: "Analyzing content structure", completed: false, active: false },
    { id: "extract", label: "Extracting key topics", completed: false, active: false },
    { id: "insights", label: "Generating insights", completed: false, active: false },
  ])

  const handleAnalyze = async () => {
    if (!articleURL.trim() && !selectedMediaHouse) return

    setIsProcessing(true)
    setShowArticleSelection(false)
    setFoundArticles([])
    setSelectedArticleIndex(null) // ADD THIS LINE
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

    // Generate mock articles list
    const mockArticles: AnalysisResult[] = [
      {
        title: "Understanding Modern Economic Policies and Their Global Impact",
        summary:
          "This comprehensive analysis explores the intricate relationship between contemporary economic policies and their far-reaching effects on global markets.",
        readTime: "8 min",
        wordCount: 2340,
        topics: [
          { name: "Economics", relevance: 0.95 },
          { name: "Global Trade", relevance: 0.87 },
          { name: "Monetary Policy", relevance: 0.82 },
          { name: "China", relevance: 0.78 },
          { name: "Technology", relevance: 0.65 },
        ],
        mainTheme: "Global Economic Interdependence",
        author: {
          name: "Dr. Sarah Johnson",
          credentials: "Ph.D. in International Economics",
          organization: "Global Economic Institute",
          publicationDate: "March 15, 2023",
          otherArticles: 27,
        },
        stanceOnChina: {
          entity: "China",
          stance: "neutral",
          confidence: 0.82,
          keyPhrases: ["China's economic policies have influenced global supply chains"],
          context: "The article presents a balanced view of China's economic role.",
        },
        namedEntities: {
          people: ["Dr. Sarah Johnson", "Xi Jinping", "Jerome Powell"],
          organizations: ["Federal Reserve", "European Central Bank"],
          locations: ["China", "United States", "European Union"],
          dates: ["March 15, 2023", "2020-2023"],
          misc: ["COVID-19", "Belt and Road Initiative"],
        },
        fluffIndex: {
          fluffPercentage: 18.5,
          totalWords: 2340,
          totalAdjectives: 433,
          qualityScore: "good",
          examples: ["comprehensive", "intricate", "contemporary"],
        },
        wordFrequency: {
          words: [
            { word: "economic", count: 47, percentage: 8.2 },
            { word: "policy", count: 42, percentage: 7.3 },
            { word: "global", count: 38, percentage: 6.6 },
          ],
          totalWords: 2340,
          uniqueWords: 574,
          stopWordsRemoved: 1186,
        },
      },
      {
        title: "Climate Change and Renewable Energy: A Path Forward",
        summary:
          "An in-depth look at how renewable energy technologies are reshaping the global energy landscape and addressing climate challenges.",
        readTime: "6 min",
        wordCount: 1890,
        topics: [
          { name: "Climate Change", relevance: 0.92 },
          { name: "Renewable Energy", relevance: 0.89 },
          { name: "Technology", relevance: 0.76 },
          { name: "Environment", relevance: 0.71 },
          { name: "Policy", relevance: 0.68 },
        ],
        mainTheme: "Sustainable Energy Transition",
        author: {
          name: "Dr. Michael Chen",
          credentials: "Ph.D. in Environmental Science",
          organization: "Climate Research Institute",
          publicationDate: "March 12, 2023",
          otherArticles: 34,
        },
        stanceOnChina: {
          entity: "China",
          stance: "positive",
          confidence: 0.75,
          keyPhrases: ["China leads in renewable energy investment"],
          context: "China is portrayed as a leader in clean energy adoption.",
        },
        namedEntities: {
          people: ["Dr. Michael Chen", "Greta Thunberg"],
          organizations: ["IPCC", "Tesla", "BYD"],
          locations: ["China", "Germany", "California"],
          dates: ["March 12, 2023", "2030"],
          misc: ["Paris Agreement", "Solar panels"],
        },
        fluffIndex: {
          fluffPercentage: 15.2,
          totalWords: 1890,
          totalAdjectives: 287,
          qualityScore: "excellent",
          examples: ["sustainable", "innovative", "transformative"],
        },
        wordFrequency: {
          words: [
            { word: "energy", count: 52, percentage: 9.1 },
            { word: "renewable", count: 38, percentage: 6.8 },
            { word: "climate", count: 34, percentage: 6.2 },
          ],
          totalWords: 1890,
          uniqueWords: 456,
          stopWordsRemoved: 892,
        },
      },
      // Add more mock articles here (I'll add a few more for variety)
      {
        title: "The Future of Artificial Intelligence in Healthcare",
        summary:
          "Exploring how AI technologies are revolutionizing medical diagnosis, treatment, and patient care across the healthcare industry.",
        readTime: "7 min",
        wordCount: 2150,
        topics: [
          { name: "Artificial Intelligence", relevance: 0.94 },
          { name: "Healthcare", relevance: 0.91 },
          { name: "Technology", relevance: 0.85 },
          { name: "Medicine", relevance: 0.79 },
          { name: "Innovation", relevance: 0.72 },
        ],
        mainTheme: "AI-Driven Healthcare Transformation",
        author: {
          name: "Dr. Emily Rodriguez",
          credentials: "M.D., Ph.D. in Computer Science",
          organization: "Medical AI Research Center",
          publicationDate: "March 10, 2023",
          otherArticles: 19,
        },
        stanceOnChina: {
          entity: "China",
          stance: "neutral",
          confidence: 0.68,
          keyPhrases: ["China's AI healthcare initiatives show promise"],
          context: "Neutral coverage of China's healthcare AI developments.",
        },
        namedEntities: {
          people: ["Dr. Emily Rodriguez", "Andrew Ng"],
          organizations: ["Google Health", "IBM Watson", "Baidu"],
          locations: ["Silicon Valley", "Beijing", "Boston"],
          dates: ["March 10, 2023", "2025"],
          misc: ["Machine Learning", "Deep Learning"],
        },
        fluffIndex: {
          fluffPercentage: 22.1,
          totalWords: 2150,
          totalAdjectives: 475,
          qualityScore: "good",
          examples: ["revolutionary", "cutting-edge", "transformative"],
        },
        wordFrequency: {
          words: [
            { word: "AI", count: 45, percentage: 7.8 },
            { word: "healthcare", count: 41, percentage: 7.2 },
            { word: "medical", count: 36, percentage: 6.4 },
          ],
          totalWords: 2150,
          uniqueWords: 523,
          stopWordsRemoved: 1024,
        },
      },
    ]

    // Generate more articles to reach 10-15 total
    const additionalTitles = [
      "Cryptocurrency Market Trends and Regulatory Challenges",
      "Space Exploration: The New Commercial Frontier",
      "Social Media's Impact on Mental Health Among Teenagers",
      "Supply Chain Disruptions in the Post-Pandemic Era",
      "The Rise of Remote Work and Its Economic Implications",
      "Cybersecurity Threats in the Digital Age",
      "Electric Vehicles: Accelerating Toward a Sustainable Future",
      "Gene Therapy Breakthroughs in Rare Disease Treatment",
      "The Metaverse: Hype or the Future of Digital Interaction",
      "Food Security and Agricultural Innovation",
      "Quantum Computing: Breaking the Barriers of Traditional Computing",
      "Urban Planning for Smart Cities of Tomorrow",
    ]

    // Create additional mock articles
    const moreArticles = additionalTitles.map((title, index) => ({
      ...mockArticles[0], // Use first article as template
      title,
      summary: `A comprehensive analysis of ${title.toLowerCase()} and its implications for the future.`,
      readTime: `${5 + Math.floor(Math.random() * 5)} min`,
      wordCount: 1500 + Math.floor(Math.random() * 1000),
      author: {
        ...mockArticles[0].author,
        name: `Dr. ${["Alex", "Jordan", "Taylor", "Morgan", "Casey"][index % 5]} ${["Smith", "Johnson", "Williams", "Brown", "Davis"][Math.floor(index / 5)]}`,
        publicationDate: `March ${10 + index}, 2023`,
      },
      fluffIndex: {
        ...mockArticles[0].fluffIndex,
        fluffPercentage: 15 + Math.floor(Math.random() * 15),
      },
    }))

    const allArticles = [...mockArticles, ...moreArticles.slice(0, 10)]
    setFoundArticles(allArticles)
    setIsProcessing(false)
    setShowArticleSelection(true)
  }

  const handleArticleSelect = (selectedArticle: AnalysisResult, index: number) => {
    // Set the selected article index for visual indication
    setSelectedArticleIndex(index)

    // Add to history only if it's a new selection
    const selectedMedia = selectedMediaHouse ? mediaHouses.find((m) => m.id === selectedMediaHouse) : null
    const historyItem = {
      id: Date.now(),
      url: articleURL || "No URL provided",
      title: selectedArticle.title,
      summary: selectedArticle.summary.substring(0, 100) + "...",
      topics: selectedArticle.topics.slice(0, 3).map((t) => t.name),
      author: selectedArticle.author.name,
      date: selectedArticle.author.publicationDate,
      stance: selectedArticle.stanceOnChina.stance,
      wordCount: selectedArticle.wordCount,
      fluffIndex: selectedArticle.fluffIndex.fluffPercentage,
      mediaHouse: selectedMedia?.name || "No media house selected",
    }

    // Only add to history if this article isn't already the most recent
    if (analyzedArticles.length === 0 || analyzedArticles[0].title !== selectedArticle.title) {
      setAnalyzedArticles([historyItem, ...analyzedArticles])
    }

    // DON'T clear the selection interface - keep it persistent
    // setShowArticleSelection(false) - REMOVE THIS
    // setFoundArticles([]) - REMOVE THIS
    // setArticleURL("") - REMOVE THIS
    // setSelectedMediaHouse("") - REMOVE THIS
    // setDateRange({ start: "", end: "" }) - REMOVE THIS

    // Notify parent component with the selected article data
    onAnalysisComplete?.(selectedArticle)
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

  const ArticleSelectionView = () => (
    <div className="space-y-4 py-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Articles Found</h3>
        <p className="text-sm text-gray-400">
          {selectedArticleIndex !== null
            ? "Switch between articles or start a new search"
            : "Select an article to analyze in detail"}
        </p>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {foundArticles.map((article, index) => (
          <button
            key={index}
            onClick={() => handleArticleSelect(article, index)}
            className={`w-full p-4 rounded-xl border transition-colors duration-200 text-left group ${
              selectedArticleIndex === index
                ? "bg-blue-500/20 border-blue-500/50 ring-2 ring-blue-500/30"
                : "bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4
                className={`text-sm font-medium line-clamp-2 flex-1 mr-3 transition-colors ${
                  selectedArticleIndex === index ? "text-blue-300" : "text-white group-hover:text-blue-400"
                }`}
              >
                {article.title}
              </h4>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <span className="text-xs text-gray-400">{article.readTime}</span>
                {selectedArticleIndex === index && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>

            <p className="text-gray-400 text-xs mb-3 line-clamp-2">{article.summary}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>{article.author.name}</span>
                <span>{article.wordCount} words</span>
                <span
                  className={`px-2 py-1 rounded-full ${
                    article.stanceOnChina.stance === "neutral"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : article.stanceOnChina.stance === "positive"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {article.stanceOnChina.stance}
                </span>
              </div>
              <ArrowRight
                className={`w-4 h-4 transition-all duration-200 ${
                  selectedArticleIndex === index
                    ? "text-blue-400"
                    : "text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1"
                }`}
              />
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          setShowArticleSelection(false)
          setFoundArticles([])
          setSelectedArticleIndex(null)
          setArticleURL("")
          setSelectedMediaHouse("")
          setDateRange({ start: "", end: "" })
        }}
        className="w-full mt-4 px-4 py-2 text-sm text-gray-400 bg-gray-700/30 rounded-lg hover:bg-gray-600/50 hover:text-gray-300 transition-colors font-medium"
      >
        New Search
      </button>
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
            {!isProcessing && !showArticleSelection ? (
              <div className="space-y-6">
                {/* Input Section */}
                <div className="space-y-4">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4">
                      <Link className="w-8 h-8 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">Article Scraper</h2>
                    <p className="text-gray-400">
                      Enter an article URL or select a media house to get detailed insights
                    </p>
                  </div>

                  {/* Media House Dropdown */}
                  <div className="space-y-3 relative">
                    <label className="block text-sm font-medium text-gray-300">Media House</label>
                    <div className="relative">
                      <button
                        onClick={() => setIsMediaDropdownOpen(!isMediaDropdownOpen)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 flex items-center justify-between"
                        disabled={isProcessing}
                      >
                        <span className={selectedMediaHouse ? "text-white" : "text-gray-500"}>
                          {selectedMediaHouse
                            ? mediaHouses.find((m) => m.id === selectedMediaHouse)?.name
                            : "Select a media house"}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isMediaDropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {isMediaDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                          {mediaHouses.map((media) => (
                            <button
                              key={media.id}
                              onClick={() => {
                                setSelectedMediaHouse(media.id)
                                setIsMediaDropdownOpen(false)
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-700/50 transition-colors duration-200 border-b border-gray-700/30 last:border-b-0"
                            >
                              <div className="text-white font-medium">{media.name}</div>
                              <div className="text-gray-400 text-sm">{media.description}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date Range Picker */}
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    disabled={isProcessing}
                    placeholder="Select publication date range"
                  />

                  {/* Article URL Input */}
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
                  disabled={(!articleURL.trim() && !selectedMediaHouse) || isProcessing}
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
            ) : showArticleSelection ? (
              <ArticleSelectionView />
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
                        <p className="text-gray-400 text-xs mb-1">{article.mediaHouse}</p>
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

export default ArticleScraperPanel
