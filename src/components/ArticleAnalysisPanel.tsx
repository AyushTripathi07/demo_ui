"use client"

import type React from "react"
import { useState } from "react"
import { CheckCircle, Circle, Loader2, Upload, History, ArrowRight, Plus, Globe, X } from "lucide-react"
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

interface AnalyzedDocument {
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
  source: string
}

const ArticleAnalysisPanel: React.FC<ArticleAnalysisPanelProps> = ({ onAnalysisStart, onAnalysisComplete }) => {
  const [activeTab, setActiveTab] = useState("analyze")
  const [articleURLs, setArticleURLs] = useState<string[]>([])
  const [newURL, setNewURL] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [analyzedDocuments, setAnalyzedDocuments] = useState<AnalyzedDocument[]>([])
  const [foundArticles, setFoundArticles] = useState<AnalysisResult[]>([])
  const [showArticleSelection, setShowArticleSelection] = useState(false)
  const [selectedArticleIndex, setSelectedArticleIndex] = useState<number | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: "fetch", label: "Processing documents", completed: false, active: false },
    { id: "analyze", label: "Analyzing content structure", completed: false, active: false },
    { id: "extract", label: "Extracting key topics", completed: false, active: false },
    { id: "insights", label: "Generating insights", completed: false, active: false },
  ])

  const handleAddURL = () => {
    if (newURL.trim() && !articleURLs.includes(newURL.trim())) {
      setArticleURLs([...articleURLs, newURL.trim()])
      setNewURL("")
    }
  }

  const handleRemoveURL = (index: number) => {
    setArticleURLs(articleURLs.filter((_, i) => i !== index))
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    const validFiles = Array.from(files).filter((file) => {
      const validTypes = [".pdf", ".doc", ".docx", ".txt"]
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
      return validTypes.includes(fileExtension) && file.size <= 10 * 1024 * 1024 // 10MB limit
    })

    setUploadedFiles([...uploadedFiles, ...validFiles])
  }

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0 && articleURLs.length === 0) return

    setIsProcessing(true)
    setShowArticleSelection(false)
    setFoundArticles([])
    setSelectedArticleIndex(null)
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

    // Generate mock articles based on uploaded files and URLs
    
const mockArticles: AnalysisResult[] = [
  {
    title: "Understanding Modern Economic Policies and Their Global Impact",
    summary:
      "This comprehensive analysis explores the intricate relationship between contemporary economic policies and their far-reaching effects on global markets. The study examines how central bank decisions, fiscal stimulus measures, and international trade agreements shape economic outcomes across developed and emerging economies. Through detailed case studies and statistical analysis, the research demonstrates the interconnected nature of modern financial systems and their vulnerability to policy changes. The analysis also covers the role of digital currencies, supply chain disruptions, and geopolitical tensions in shaping current economic landscapes. Furthermore, it investigates how technological innovations and demographic shifts are influencing long-term economic planning and policy formulation across different regions.",
    readTime: "12 min",
    wordCount: 3420,
    topics: [
      { name: "Economics", relevance: 0.95 },
      { name: "Global Trade", relevance: 0.87 },
      { name: "Monetary Policy", relevance: 0.82 },
      { name: "Fiscal Policy", relevance: 0.79 },
      { name: "Technology", relevance: 0.65 },
      { name: "Supply Chain", relevance: 0.71 },
      { name: "Digital Currency", relevance: 0.68 },
      { name: "International Relations", relevance: 0.73 },
      { name: "Market Analysis", relevance: 0.84 },
      { name: "Economic Growth", relevance: 0.76 },
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
      keyPhrases: ["China's economic policies have created supply chain dependencies"],
      context: "The article presents concerns about economic dependency while maintaining analytical objectivity.",
    },
    namedEntities: {
      people: ["Dr. Sarah Johnson", "Xi Jinping", "Jerome Powell", "Christine Lagarde"],
      organizations: ["Federal Reserve", "European Central Bank", "IMF", "World Bank"],
      locations: ["China", "United States", "European Union", "Japan", "India"],
      dates: ["March 15, 2023", "2020-2023", "2024"],
      misc: ["COVID-19", "Belt and Road Initiative", "SWIFT", "CBDC"],
    },
    fluffIndex: {
      fluffPercentage: 18.5,
      totalWords: 3420,
      totalAdjectives: 633,
      qualityScore: "good",
      examples: ["comprehensive", "intricate", "contemporary", "far-reaching", "interconnected"],
    },
    wordFrequency: {
      words: [
        { word: "economic", count: 67, percentage: 8.2 },
        { word: "policy", count: 62, percentage: 7.3 },
        { word: "global", count: 58, percentage: 6.6 },
        { word: "market", count: 45, percentage: 5.1 },
        { word: "trade", count: 41, percentage: 4.8 },
        { word: "financial", count: 38, percentage: 4.2 },
        { word: "analysis", count: 35, percentage: 3.9 },
        { word: "growth", count: 32, percentage: 3.6 },
      ],
      totalWords: 3420,
      uniqueWords: 824,
      stopWordsRemoved: 1586,
    },
  },
  {
    title: "Climate Change and Renewable Energy: A Path Forward",
    summary:
      "An in-depth look at how renewable energy technologies are reshaping the global energy landscape and addressing climate challenges. This extensive research examines the technological breakthroughs in solar, wind, and battery storage systems that are making clean energy more viable and cost-effective. The study analyzes government policies, private sector investments, and international cooperation frameworks that are accelerating the transition away from fossil fuels. Additionally, it explores the economic implications of the energy transition, including job creation in green industries, the phase-out of traditional energy sectors, and the infrastructure investments required for a sustainable future. The research also addresses the challenges of energy storage, grid modernization, and the integration of renewable sources into existing power systems.",
    readTime: "10 min",
    wordCount: 2890,
    topics: [
      { name: "Climate Change", relevance: 0.92 },
      { name: "Renewable Energy", relevance: 0.89 },
      { name: "Technology", relevance: 0.76 },
      { name: "Environment", relevance: 0.71 },
      { name: "Policy", relevance: 0.68 },
      { name: "Solar Energy", relevance: 0.83 },
      { name: "Wind Power", relevance: 0.78 },
      { name: "Battery Storage", relevance: 0.74 },
      { name: "Grid Infrastructure", relevance: 0.69 },
      { name: "Green Jobs", relevance: 0.72 },
      { name: "Investment", relevance: 0.75 },
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
      stance: "neutral",
      confidence: 0.75,
      keyPhrases: ["China's manufacturing dominance raises supply chain concerns in renewable sector"],
      context: "China is discussed as a major manufacturer with potential risks for supply chain dependency.",
    },
    namedEntities: {
      people: ["Dr. Michael Chen", "Greta Thunberg", "Bill Gates", "Elon Musk"],
      organizations: ["IPCC", "Tesla", "Vestas", "First Solar", "IEA"],
      locations: ["China", "Germany", "California", "Denmark", "Norway"],
      dates: ["March 12, 2023", "2030", "2050"],
      misc: ["Paris Agreement", "Solar panels", "Offshore wind", "Lithium-ion"],
    },
    fluffIndex: {
      fluffPercentage: 15.2,
      totalWords: 2890,
      totalAdjectives: 437,
      qualityScore: "excellent",
      examples: ["sustainable", "innovative", "transformative", "cost-effective", "viable"],
    },
    wordFrequency: {
      words: [
        { word: "energy", count: 72, percentage: 9.1 },
        { word: "renewable", count: 58, percentage: 6.8 },
        { word: "climate", count: 54, percentage: 6.2 },
        { word: "technology", count: 46, percentage: 5.3 },
        { word: "solar", count: 42, percentage: 4.9 },
        { word: "power", count: 39, percentage: 4.5 },
        { word: "investment", count: 35, percentage: 4.1 },
        { word: "storage", count: 31, percentage: 3.6 },
      ],
      totalWords: 2890,
      uniqueWords: 696,
      stopWordsRemoved: 1292,
    },
  },
  {
    title: "Artificial Intelligence in Healthcare: Transforming Patient Care",
    summary:
      "A comprehensive examination of how artificial intelligence is revolutionizing healthcare delivery, from diagnostic imaging to personalized treatment plans. This detailed study explores the current applications of machine learning algorithms in medical diagnosis, drug discovery, and patient monitoring systems. The research investigates how AI-powered tools are improving accuracy in radiology, pathology, and genomic analysis while reducing diagnostic errors and treatment delays. Furthermore, the analysis covers the ethical considerations, regulatory challenges, and data privacy concerns associated with implementing AI in clinical settings. The study also examines the economic impact of healthcare AI, including cost savings, efficiency improvements, and the potential for democratizing access to quality medical care in underserved regions.",
    readTime: "9 min",
    wordCount: 2650,
    topics: [
      { name: "Artificial Intelligence", relevance: 0.94 },
      { name: "Healthcare", relevance: 0.91 },
      { name: "Medical Diagnosis", relevance: 0.87 },
      { name: "Machine Learning", relevance: 0.84 },
      { name: "Technology", relevance: 0.79 },
      { name: "Drug Discovery", relevance: 0.73 },
      { name: "Medical Imaging", relevance: 0.81 },
      { name: "Patient Care", relevance: 0.78 },
      { name: "Data Privacy", relevance: 0.71 },
      { name: "Ethics", relevance: 0.69 },
      { name: "Regulatory", relevance: 0.66 },
      { name: "Genomics", relevance: 0.74 },
    ],
    mainTheme: "AI-Driven Healthcare Innovation",
    author: {
      name: "Dr. Elena Rodriguez",
      credentials: "M.D., Ph.D. in Biomedical Informatics",
      organization: "Medical AI Research Center",
      publicationDate: "March 20, 2023",
      otherArticles: 19,
    },
    stanceOnChina: {
      entity: "China",
      stance: "neutral",
      confidence: 0.68,
      keyPhrases: ["China's AI healthcare initiatives face regulatory scrutiny"],
      context: "The article discusses regulatory challenges in various countries including China.",
    },
    namedEntities: {
      people: ["Dr. Elena Rodriguez", "Dr. Eric Topol", "Dr. Regina Barzilay"],
      organizations: ["FDA", "IBM Watson", "Google Health", "MIT", "Stanford Medicine"],
      locations: ["United States", "European Union", "United Kingdom", "Canada"],
      dates: ["March 20, 2023", "2025", "2030"],
      misc: ["HIPAA", "GDPR", "Deep Learning", "Neural Networks"],
    },
    fluffIndex: {
      fluffPercentage: 16.8,
      totalWords: 2650,
      totalAdjectives: 445,
      qualityScore: "excellent",
      examples: ["revolutionary", "comprehensive", "personalized", "innovative", "transformative"],
    },
    wordFrequency: {
      words: [
        { word: "healthcare", count: 64, percentage: 8.7 },
        { word: "medical", count: 59, percentage: 7.9 },
        { word: "diagnosis", count: 48, percentage: 6.4 },
        { word: "patient", count: 45, percentage: 6.1 },
        { word: "treatment", count: 41, percentage: 5.5 },
        { word: "algorithm", count: 37, percentage: 5.0 },
        { word: "clinical", count: 34, percentage: 4.6 },
        { word: "data", count: 31, percentage: 4.2 },
      ],
      totalWords: 2650,
      uniqueWords: 687,
      stopWordsRemoved: 1248,
    },
  },
  {
    title: "The Future of Work: Remote Collaboration and Digital Transformation",
    summary:
      "An extensive analysis of how the global shift towards remote work is reshaping organizational structures, productivity metrics, and workplace culture. This comprehensive study examines the technological infrastructure required to support distributed teams, including collaboration platforms, cybersecurity measures, and digital communication tools. The research explores the psychological and social impacts of remote work on employee wellbeing, career development, and organizational loyalty. Additionally, it investigates how companies are adapting their management strategies, performance evaluation systems, and corporate culture to accommodate hybrid work models. The study also addresses the long-term implications for commercial real estate, urban planning, and regional economic development as workers gain location independence.",
    readTime: "11 min",
    wordCount: 3150,
    topics: [
      { name: "Remote Work", relevance: 0.93 },
      { name: "Digital Transformation", relevance: 0.89 },
      { name: "Workplace Culture", relevance: 0.85 },
      { name: "Technology", relevance: 0.82 },
      { name: "Productivity", relevance: 0.78 },
      { name: "Collaboration", relevance: 0.86 },
      { name: "Cybersecurity", relevance: 0.74 },
      { name: "Employee Wellbeing", relevance: 0.71 },
      { name: "Management", relevance: 0.77 },
      { name: "Real Estate", relevance: 0.69 },
      { name: "Urban Planning", relevance: 0.66 },
      { name: "Communication", relevance: 0.80 },
    ],
    mainTheme: "Evolution of Modern Workplace",
    author: {
      name: "Dr. James Patterson",
      credentials: "Ph.D. in Organizational Psychology",
      organization: "Future Work Institute",
      publicationDate: "March 25, 2023",
      otherArticles: 22,
    },
    stanceOnChina: {
      entity: "China",
      stance: "neutral",
      confidence: 0.71,
      keyPhrases: ["China's surveillance concerns impact global remote work policies"],
      context: "The article discusses data security concerns affecting international remote work arrangements.",
    },
    namedEntities: {
      people: ["Dr. James Patterson", "Satya Nadella", "Susan Wojcicki"],
      organizations: ["Microsoft", "Zoom", "Slack", "Google Workspace", "Salesforce"],
      locations: ["Silicon Valley", "New York", "London", "Toronto", "Singapore"],
      dates: ["March 25, 2023", "2020", "2024", "2025"],
      misc: ["COVID-19", "Hybrid Work", "Cloud Computing", "VPN"],
    },
    fluffIndex: {
      fluffPercentage: 17.3,
      totalWords: 3150,
      totalAdjectives: 545,
      qualityScore: "good",
      examples: ["comprehensive", "extensive", "distributed", "adaptive", "transformative"],
    },
    wordFrequency: {
      words: [
        { word: "work", count: 78, percentage: 8.9 },
        { word: "remote", count: 65, percentage: 7.4 },
        { word: "digital", count: 52, percentage: 5.9 },
        { word: "employee", count: 48, percentage: 5.5 },
        { word: "technology", count: 44, percentage: 5.0 },
        { word: "collaboration", count: 41, percentage: 4.7 },
        { word: "organization", count: 38, percentage: 4.3 },
        { word: "productivity", count: 35, percentage: 4.0 },
      ],
      totalWords: 3150,
      uniqueWords: 758,
      stopWordsRemoved: 1452,
    },
  },
];

    setFoundArticles(mockArticles)
    setIsProcessing(false)
    setShowArticleSelection(true)
  }

  const handleArticleSelect = (selectedArticle: AnalysisResult, index: number) => {
    setSelectedArticleIndex(index)

    const historyItem = {
      id: Date.now(),
      url: articleURLs[0] || "Uploaded Document",
      title: selectedArticle.title,
      summary: selectedArticle.summary.substring(0, 100) + "...",
      topics: selectedArticle.topics.slice(0, 3).map((t) => t.name),
      author: selectedArticle.author.name,
      date: selectedArticle.author.publicationDate,
      stance: selectedArticle.stanceOnChina.stance,
      wordCount: selectedArticle.wordCount,
      fluffIndex: selectedArticle.fluffIndex.fluffPercentage,
      source: uploadedFiles.length > 0 ? "Uploaded Document" : "Article URL",
    }

    if (analyzedDocuments.length === 0 || analyzedDocuments[0].title !== selectedArticle.title) {
      setAnalyzedDocuments([historyItem, ...analyzedDocuments])
    }

    onAnalysisComplete?.(selectedArticle)
  }

  const ProcessingSteps = () => (
    <div className="space-y-4 py-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Analyzing Articles</h3>
        <p className="text-sm text-gray-400">Processing your Articles for insights...</p>
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
        <h3 className="text-lg font-semibold text-white mb-2">Analysis Complete</h3>
        <p className="text-sm text-gray-400">
          {selectedArticleIndex !== null
            ? "Switch between results or start a new analysis"
            : "Select a result to view detailed insights"}
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
          setUploadedFiles([])
          setArticleURLs([])
        }}
        className="w-full mt-4 px-4 py-2 text-sm text-gray-400 bg-gray-700/30 rounded-lg hover:bg-gray-600/50 hover:text-gray-300 transition-colors font-medium"
      >
        New Analysis
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
                {/* Upload Documents Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Upload File</h3>

                  {/* Drag and Drop Area */}
                    <div
                        className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ease-in-out ${
                        isDragOver
                            ? "border-blue-400 bg-blue-500/10 shadow-md"
                            : "border-gray-600 hover:border-gray-400 bg-gray-800/30 hover:bg-gray-700/20"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="flex flex-col items-center justify-center space-y-5">
                        <div className="w-14 h-14 text-blue-300 animate-pulse">
                            <Upload className="w-full h-full" />
                        </div>

                        <div>
                            <p className="text-sm text-gray-300 mb-2">
                            Drag & drop your files here, or
                            </p>

                            <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            <Plus className="w-4 h-4" />
                            <span>Choose File</span>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={(e) => handleFileUpload(e.target.files)}
                                className="hidden"
                                disabled={isProcessing}
                            />
                            </label>

                            <p className="text-xs text-gray-400 mt-2">Supported formats: PDF, DOCX, TXT</p>
                        </div>
                        </div>
                    </div>

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Uploaded Files:</p>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                              <Upload className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm text-white">{file.name}</p>
                              <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Article URLs Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Article URLs</h3>
                    <button
                      onClick={handleAddURL}
                      disabled={!newURL.trim()}
                      className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 disabled:bg-gray-700/30 disabled:cursor-not-allowed text-blue-400 disabled:text-gray-500 rounded-lg transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* URL Input */}
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://example.com/article"
                      value={newURL}
                      onChange={(e) => setNewURL(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddURL()}
                      className="w-full px-4 py-3 pl-12 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      disabled={isProcessing}
                    />
                    <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>

                  {/* URL List */}
                  {articleURLs.length > 0 && (
                    <div className="space-y-2">
                      {articleURLs.map((url, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                              <Globe className="w-4 h-4 text-green-400" />
                            </div>
                            <p className="text-sm text-white truncate flex-1">{url}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveURL(index)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={(uploadedFiles.length === 0 && articleURLs.length === 0) || isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <span>Analyze Articles</span>
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
              {analyzedDocuments.length > 0 && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                  {analyzedDocuments.length}
                </span>
              )}
            </div>

            {analyzedDocuments.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4">
                  <History className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400 mb-2">No article analyzed yet</p>
                <p className="text-sm text-gray-500">Your analysis history will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analyzedDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:bg-gray-800/50 transition-colors duration-200 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 mr-3">
                        <p className="text-white text-sm font-medium mb-1 line-clamp-2">{document.title}</p>
                        <p className="text-gray-400 text-xs mb-1">{document.source}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                          document.stance === "neutral"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : document.stance === "positive"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {document.stance}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="text-center p-2 bg-gray-700/30 rounded-lg">
                        <div className="text-sm font-medium text-white">{document.wordCount}</div>
                        <div className="text-xs text-gray-400">words</div>
                      </div>
                      <div className="text-center p-2 bg-gray-700/30 rounded-lg">
                        <div className="text-sm font-medium text-white">{document.fluffIndex}%</div>
                        <div className="text-xs text-gray-400">fluff</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {document.topics.map((topic: string) => (
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
