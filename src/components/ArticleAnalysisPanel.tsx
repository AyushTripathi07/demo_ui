"use client"

import type React from "react"
import { useState } from "react"
import { CheckCircle, Circle, Loader2, Upload, FileText, History, ArrowRight, X, Plus, Globe } from "lucide-react"
import TabNavigation from "./TabNavigation"

interface ProcessingStep {
  id: string
  label: string
  completed: boolean
  active: boolean
}

interface URLInput {
  id: string
  url: string
  title?: string
  status: "idle" | "validating" | "valid" | "invalid"
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
  stance: string
  wordCount: number
  fluffIndex: number
  fileCount: number
  urlCount: number
  dateRange: {
    start: string
    end: string
  }
}

const ArticleScraperPanel: React.FC<ArticleAnalysisPanelProps> = ({ onAnalysisStart, onAnalysisComplete }) => {
  const [activeTab, setActiveTab] = useState("analyze")
  const [urlInputs, setUrlInputs] = useState<URLInput[]>([{ id: "1", url: "", status: "idle" }])
  const [selectedUrlId, setSelectedUrlId] = useState<string>("1")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [dateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days ago
    end: new Date().toISOString().split("T")[0], // today
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [analyzedArticles, setAnalyzedArticles] = useState<AnalyzedArticle[]>([])
  const [totalStats, setTotalStats] = useState({
    totalArticles: 0,
    totalWords: 0,
    avgFluffIndex: 0,
    avgSentiment: 0,
  })

  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: "fetch", label: "Processing uploaded files", completed: false, active: false },
    { id: "analyze", label: "Analyzing content structure", completed: false, active: false },
    { id: "extract", label: "Extracting key topics", completed: false, active: false },
    { id: "insights", label: "Generating insights", completed: false, active: false },
  ])

  const addUrlInput = () => {
    const newId = Date.now().toString()
    setUrlInputs((prev) => [...prev, { id: newId, url: "", status: "idle" }])
  }

  const removeUrlInput = (id: string) => {
    if (urlInputs.length <= 1) return

    setUrlInputs((prev) => prev.filter((input) => input.id !== id))

    if (selectedUrlId === id) {
      const remainingInputs = urlInputs.filter((input) => input.id !== id)
      setSelectedUrlId(remainingInputs[0]?.id || "")
    }
  }

  const updateUrlInput = (id: string, url: string) => {
    setUrlInputs((prev) => prev.map((input) => (input.id === id ? { ...input, url, status: "idle" } : input)))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter((file) => {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ]
      return (
        validTypes.includes(file.type) ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".pdf") ||
        file.name.endsWith(".docx")
      )
    })

    setUploadedFiles((prev) => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getValidUrls = () => {
    return urlInputs.filter((input) => input.url.trim())
  }

  const handleAnalyze = async () => {
    const validUrls = getValidUrls()
    if (validUrls.length === 0 && uploadedFiles.length === 0) return

    setIsProcessing(true)
    onAnalysisStart?.()

    // Reset steps
    setProcessingSteps((steps) => steps.map((step) => ({ ...step, completed: false, active: false })))

    // Simulate processing steps
    for (let i = 0; i < processingSteps.length; i++) {
      setProcessingSteps((steps) =>
        steps.map((step, index) => ({
          ...step,
          active: index === i,
          completed: index < i,
        })),
      )

      await new Promise((resolve) => setTimeout(resolve, 1500))

      setProcessingSteps((steps) =>
        steps.map((step, index) => ({
          ...step,
          active: false,
          completed: index <= i,
        })),
      )
    }

    // Generate mock analysis result
    const totalSources = validUrls.length + uploadedFiles.length
    const mockResult: AnalysisResult = {
      // Summary data
      title:
        totalSources > 1
          ? `Comprehensive Analysis of ${totalSources} Sources`
          : validUrls.length > 0
            ? validUrls[0].title || "Article Analysis"
            : `Analysis of ${uploadedFiles.length} Uploaded Document${uploadedFiles.length > 1 ? "s" : ""}`,
      summary: `Comprehensive analysis covering ${totalSources} sources including ${validUrls.length} web articles and ${uploadedFiles.length} uploaded documents. The analysis spans the selected date range from ${dateRange.start} to ${dateRange.end}, providing insights into contemporary issues and their implications for global markets and society.`,
      readTime: `${totalSources * 3} min`,
      wordCount: totalSources * 1200,

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
      mainTheme: totalSources > 1 ? "Multi-Source Analysis" : "Economic Analysis",

      // Author data
      author: {
        name: totalSources > 1 ? "Multiple Authors" : "Dr. Sarah Johnson",
        credentials: totalSources > 1 ? "Various Credentials" : "Ph.D. in International Economics",
        organization: totalSources > 1 ? "Multiple Organizations" : "Global Economic Institute",
        publicationDate: dateRange.start,
        lastUpdated: dateRange.end,
        otherArticles: totalSources > 1 ? totalSources : 27,
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
          "The analyzed sources present a balanced view of China's economic role across multiple perspectives and timeframes.",
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
        dates: [dateRange.start, dateRange.end, "Q4 2022", "January 2023"],
        misc: ["COVID-19", "Belt and Road Initiative", "CHIPS Act", "Digital Yuan"],
      },

      // Fluff Index data
      fluffIndex: {
        fluffPercentage: 18.5 + totalSources * 2,
        totalWords: totalSources * 1200,
        totalAdjectives: totalSources * 267,
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
          { word: "economic", count: totalSources * 23, percentage: 8.2 },
          { word: "policy", count: totalSources * 21, percentage: 7.3 },
          { word: "global", count: totalSources * 19, percentage: 6.6 },
          { word: "trade", count: totalSources * 17, percentage: 6.1 },
          { word: "China", count: totalSources * 16, percentage: 5.6 },
          { word: "market", count: totalSources * 14, percentage: 5.0 },
          { word: "international", count: totalSources * 13, percentage: 4.5 },
          { word: "technology", count: totalSources * 12, percentage: 4.2 },
          { word: "monetary", count: totalSources * 11, percentage: 3.8 },
          { word: "supply", count: totalSources * 10, percentage: 3.5 },
        ],
        totalWords: totalSources * 1200,
        uniqueWords: totalSources * 287,
        stopWordsRemoved: totalSources * 593,
      },
    }

    // Add to history
    const historyItem: AnalyzedArticle = {
      id: Date.now(),
      url: validUrls.length > 0 ? `${validUrls.length} URLs` : `${uploadedFiles.length} files`,
      title: mockResult.title,
      summary: mockResult.summary.substring(0, 100) + "...",
      topics: mockResult.topics.slice(0, 3).map((t) => t.name),
      author: mockResult.author.name,
      date: mockResult.author.publicationDate,
      stance: mockResult.stanceOnChina.stance,
      wordCount: mockResult.wordFrequency.totalWords,
      fluffIndex: mockResult.fluffIndex.fluffPercentage,
      fileCount: uploadedFiles.length,
      urlCount: validUrls.length,
      dateRange: dateRange,
    }

    setAnalyzedArticles([historyItem, ...analyzedArticles])

    // Update total stats
    setTotalStats((prev) => ({
      totalArticles: prev.totalArticles + totalSources,
      totalWords: prev.totalWords + mockResult.wordFrequency.totalWords,
      avgFluffIndex:
        (prev.avgFluffIndex * prev.totalArticles + mockResult.fluffIndex.fluffPercentage) / (prev.totalArticles + 1),
      avgSentiment: (prev.avgSentiment * prev.totalArticles + 0.65) / (prev.totalArticles + 1),
    }))

    // Reset inputs
    setUrlInputs([{ id: Date.now().toString(), url: "", status: "idle" }])
    setSelectedUrlId(urlInputs[0]?.id || "")
    setUploadedFiles([])
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
        <h3 className="text-lg font-semibold text-white mb-2">Analyzing Content</h3>
        <p className="text-sm text-gray-400">
          Processing {getValidUrls().length + uploadedFiles.length} sources for insights...
        </p>
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

  const URLManagementCard = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-300">Article URLs</label>
          <button
            onClick={addUrlInput}
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1 transition-colors"
            disabled={isProcessing}
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        <div className="space-y-2 max-h-32 overflow-y-auto hide-scrollbar">
          {urlInputs.map((input) => (
            <div key={input.id} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="https://example.com/article"
                  value={input.url}
                  onChange={(e) => updateUrlInput(input.id, e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                  disabled={isProcessing}
                />
                <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
              {urlInputs.length > 1 && (
                <button
                  onClick={() => removeUrlInput(input.id)}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  disabled={isProcessing}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-800/50">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} tabs={["analyze", "history", "stats"]} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "analyze" ? (
          <div className="p-6">
            {!isProcessing ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4">
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">Article Analysis</h2>
                  <p className="text-gray-400">Upload files or enter URLs to analyze content</p>
                </div>

                {/* File Upload Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">Upload Documents</label>

                  <div className="border-2 border-dashed border-gray-700/50 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 mb-2">Upload PDF, DOCX, or TXT files</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-4 py-2 bg-gray-800/50 text-gray-300 text-sm rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Choose Files
                    </label>
                  </div>

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-white truncate">{file.name}</span>
                            <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* URL Management Card */}
                <URLManagementCard />

                {/* Action Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={(getValidUrls().length === 0 && uploadedFiles.length === 0) || isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <span>Analyze Content</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>

                {/* Feature Highlights */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <h4 className="text-sm font-medium text-white mb-1">Multi-URL Support</h4>
                    <p className="text-xs text-gray-400">Add multiple article URLs</p>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <h4 className="text-sm font-medium text-white mb-1">Smart Validation</h4>
                    <p className="text-xs text-gray-400">Auto-validate URLs and extract titles</p>
                  </div>
                </div>
              </div>
            ) : (
              <ProcessingSteps />
            )}
          </div>
        ) : activeTab === "stats" ? (
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-white">Overall Statistics</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                <div className="text-2xl font-bold text-white">{totalStats.totalArticles}</div>
                <div className="text-sm text-gray-400">Total Articles</div>
              </div>
              <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                <div className="text-2xl font-bold text-white">{totalStats.totalWords.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Words</div>
              </div>
              <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                <div className="text-2xl font-bold text-white">{totalStats.avgFluffIndex.toFixed(1)}%</div>
                <div className="text-sm text-gray-400">Avg Fluff Index</div>
              </div>
              <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                <div className="text-2xl font-bold text-white">{(totalStats.avgSentiment * 100).toFixed(0)}%</div>
                <div className="text-sm text-gray-400">Avg Sentiment</div>
              </div>
            </div>

            {totalStats.totalArticles === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4">
                  <FileText className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400 mb-2">No articles analyzed yet</p>
                <p className="text-sm text-gray-500">Statistics will appear here after analysis</p>
              </div>
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
                    className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:bg-gray-800/50 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 mr-3">
                        <p className="text-white text-sm font-medium mb-1 line-clamp-2">{article.title}</p>
                        <p className="text-gray-400 text-xs">
                          {article.urlCount > 0 && `${article.urlCount} URLs`}
                          {article.urlCount > 0 && article.fileCount > 0 && " • "}
                          {article.fileCount > 0 && `${article.fileCount} files`}
                          {" • "}
                          {article.dateRange.start} to {article.dateRange.end}
                        </p>
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
                        <div className="text-sm font-medium text-white">{article.wordCount.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">words</div>
                      </div>
                      <div className="text-center p-2 bg-gray-700/30 rounded-lg">
                        <div className="text-sm font-medium text-white">{article.fluffIndex.toFixed(1)}%</div>
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
