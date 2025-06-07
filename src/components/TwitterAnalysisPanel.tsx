"use client"

import type React from "react"
import { useState } from "react"
import { CheckCircle, Circle, Loader2, Twitter, Upload, Plus, X, History, ArrowRight } from "lucide-react"
import TabNavigation from "./TabNavigation"
import DateRangePicker from "./DateRangePicker"

interface ProcessingStep {
  id: string
  label: string
  completed: boolean
  active: boolean
}

interface TwitterAnalysisResult {
  totalTweets: number
  totalAccounts: number
  dateRange: { start: string; end: string }
  usernames: string[]
  usernameData: Record<string, PerUserData>

  
  // Global data (aggregated from all accounts)
  heatmapData: Array<{ date: string; value: number; accounts: string[] }>
  namedEntities: {
    people: Array<{ name: string; count: number; sentiment: number }>
    organizations: Array<{ name: string; count: number; sentiment: number }>
    locations: Array<{ name: string; count: number; sentiment: number }>
    hashtags: Array<{ name: string; count: number; sentiment: number }>
  }
  stanceAnalysis: {
    india: { positive: number; negative: number; neutral: number; keyTweets: string[] }
    china: { positive: number; negative: number; neutral: number; keyTweets: string[] }
  }
  timelineData: Array<{ date: string; tweetCount: number; sentiment: number; topTopics: string[] }>
  wordcloudData: Array<{ word: string; count: number; sentiment: number }>
}

interface PerUserData {
  totalTweets: number
  avgTweetsPerDay: number
  heatmapData?: Array<{ date: string; value: number; accounts: string[] }>
  namedEntities?: {
    people: Array<{ name: string; count: number; sentiment: number }>
    organizations: Array<{ name: string; count: number; sentiment: number }>
    locations: Array<{ name: string; count: number; sentiment: number }>
    hashtags: Array<{ name: string; count: number; sentiment: number }>
  }
  stanceAnalysis?: {
    india: { positive: number; negative: number; neutral: number; keyTweets: string[] }
    china: { positive: number; negative: number; neutral: number; keyTweets: string[] }
  }
  timelineData?: Array<{ date: string; tweetCount: number; sentiment: number; topTopics: string[] }>
  wordcloudData?: Array<{ word: string; count: number; sentiment: number }>
}

interface TwitterAnalysisPanelProps {
  onAnalysisStart?: () => void
  onAnalysisComplete?: (result: TwitterAnalysisResult) => void
}

interface MonitoringSession {
  id: number
  usernames: string[]
  dateRange: { start: string; end: string }
  totalTweets: number
  totalAccounts: number
  timestamp: string
}

const TwitterAnalysisPanel: React.FC<TwitterAnalysisPanelProps> = ({ onAnalysisStart, onAnalysisComplete }) => {
  const [activeTab, setActiveTab] = useState("monitor")
  const [usernames, setUsernames] = useState<string[]>([""])
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days ago
    end: new Date().toISOString().split("T")[0], // today
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [monitoringHistory, setMonitoringHistory] = useState<MonitoringSession[]>([])

  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: "fetch", label: "Fetching Twitter data", completed: false, active: false },
    { id: "analyze", label: "Analyzing tweet content", completed: false, active: false },
    { id: "entities", label: "Extracting named entities", completed: false, active: false },
    { id: "sentiment", label: "Performing sentiment analysis", completed: false, active: false },
    { id: "insights", label: "Generating insights", completed: false, active: false },
  ])

  const addUsername = () => {
    setUsernames([...usernames, ""])
  }

  const removeUsername = (index: number) => {
    if (usernames.length > 1) {
      setUsernames(usernames.filter((_, i) => i !== index))
    }
  }

  const updateUsername = (index: number, value: string) => {
    const newUsernames = [...usernames]
    newUsernames[index] = value
    setUsernames(newUsernames)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csv = e.target?.result as string
        const lines = csv.split("\n")
        const csvUsernames = lines
          .map((line) => line.trim())
          .filter((line) => line && !line.startsWith("#"))
          .slice(0, 50) // Limit to 50 usernames
        setUsernames(csvUsernames)
      }
      reader.readAsText(file)
    }
  }

  const generateMockHeatmapData = () => {
    const data = []
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      data.push({
        date: d.toISOString().split("T")[0],
        value: Math.floor(Math.random() * 100),
        accounts: usernames
          .filter((u) => u.trim())
          .slice(0, 3)
          .map((u) => u.replace("@", "")),
      })
    }
    return data
  }

  const generateMockTimelineData = () => {
    const data = []
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      data.push({
        date: d.toISOString().split("T")[0],
        tweetCount: Math.floor(Math.random() * 500) + 100,
        sentiment: (Math.random() - 0.5) * 2,
        topTopics: ["trade", "diplomacy", "economy"].slice(0, Math.floor(Math.random() * 3) + 1),
      })
    }
    return data
  }

  const generateMockUserData = (username: string, totalTweets: number) => {
    const userTweets = Math.floor(totalTweets * (0.1 + Math.random() * 0.3)) // 10-40% of total
    const days = Math.ceil((new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) / (1000 * 60 * 60 * 24))
    
    return {
      totalTweets: userTweets,
      avgTweetsPerDay: Math.round(userTweets / days),
      heatmapData: generateMockHeatmapData().map(item => ({
        ...item,
        value: Math.floor(item.value * 0.3), // Individual user has less activity
        accounts: [username.replace("@", "")]
      })),
      namedEntities: {
        people: [
          { name: "Narendra Modi", count: Math.floor(Math.random() * 50) + 10, sentiment: Math.random() * 2 - 1 },
          { name: "Xi Jinping", count: Math.floor(Math.random() * 40) + 5, sentiment: Math.random() * 2 - 1 },
          { name: "Joe Biden", count: Math.floor(Math.random() * 30) + 5, sentiment: Math.random() * 2 - 1 },
        ],
        organizations: [
          { name: "BJP", count: Math.floor(Math.random() * 60) + 15, sentiment: Math.random() * 2 - 1 },
          { name: "Congress", count: Math.floor(Math.random() * 50) + 10, sentiment: Math.random() * 2 - 1 },
          { name: "CCP", count: Math.floor(Math.random() * 40) + 8, sentiment: Math.random() * 2 - 1 },
        ],
        locations: [
          { name: "India", count: Math.floor(Math.random() * 100) + 30, sentiment: Math.random() * 2 - 1 },
          { name: "China", count: Math.floor(Math.random() * 80) + 20, sentiment: Math.random() * 2 - 1 },
          { name: "Delhi", count: Math.floor(Math.random() * 40) + 10, sentiment: Math.random() * 2 - 1 },
        ],
        hashtags: [
          { name: "#IndiaChina", count: Math.floor(Math.random() * 60) + 15, sentiment: Math.random() * 2 - 1 },
          { name: "#BorderDispute", count: Math.floor(Math.random() * 50) + 10, sentiment: Math.random() * 2 - 1 },
          { name: "#Trade", count: Math.floor(Math.random() * 40) + 8, sentiment: Math.random() * 2 - 1 },
        ],
      },
      stanceAnalysis: {
        india: {
          positive: Math.floor(Math.random() * 40) + 30,
          negative: Math.floor(Math.random() * 30) + 10,
          neutral: Math.floor(Math.random() * 20) + 10,
          keyTweets: [
            `${username}: India's policies are showing positive results`,
            `${username}: Supporting India's growth initiatives`,
          ],
        },
        china: {
          positive: Math.floor(Math.random() * 20) + 10,
          negative: Math.floor(Math.random() * 40) + 30,
          neutral: Math.floor(Math.random() * 25) + 15,
          keyTweets: [
            `${username}: China's approach needs reconsideration`,
            `${username}: Concerns about China's recent policies`,
          ],
        },
      },
      timelineData: generateMockTimelineData().map(item => ({
        ...item,
        tweetCount: Math.floor(item.tweetCount * 0.2), // Individual user has less tweets
      })),
        wordcloudData: [
        { word: "india", count: Math.floor(Math.random() * 100) + 30, sentiment: Math.random() * 2 - 1 },
        { word: "china", count: Math.floor(Math.random() * 80) + 20, sentiment: Math.random() * 2 - 1 },
        { word: "trade", count: Math.floor(Math.random() * 60) + 15, sentiment: Math.random() * 2 - 1 },
        { word: "diplomacy", count: Math.floor(Math.random() * 50) + 10, sentiment: Math.random() * 2 - 1 },
        { word: "economy", count: Math.floor(Math.random() * 40) + 8, sentiment: Math.random() * 2 - 1 },
        { word: "technology", count: Math.floor(Math.random() * 70) + 20, sentiment: Math.random() * 2 - 1 },
        { word: "inflation", count: Math.floor(Math.random() * 60) + 10, sentiment: Math.random() * 2 - 1 },
        { word: "growth", count: Math.floor(Math.random() * 50) + 10, sentiment: Math.random() * 2 - 1 },
        { word: "politics", count: Math.floor(Math.random() * 80) + 20, sentiment: Math.random() * 2 - 1 },
        { word: "conflict", count: Math.floor(Math.random() * 30) + 10, sentiment: Math.random() * 2 - 1 },
        { word: "defense", count: Math.floor(Math.random() * 35) + 10, sentiment: Math.random() * 2 - 1 },
        { word: "war", count: Math.floor(Math.random() * 40) + 5, sentiment: Math.random() * 2 - 1 },
        { word: "peace", count: Math.floor(Math.random() * 40) + 8, sentiment: Math.random() * 2 - 1 },
        { word: "military", count: Math.floor(Math.random() * 45) + 15, sentiment: Math.random() * 2 - 1 },
        { word: "exports", count: Math.floor(Math.random() * 50) + 10, sentiment: Math.random() * 2 - 1 },
        { word: "imports", count: Math.floor(Math.random() * 50) + 10, sentiment: Math.random() * 2 - 1 },
        { word: "currency", count: Math.floor(Math.random() * 30) + 10, sentiment: Math.random() * 2 - 1 },
        { word: "dollar", count: Math.floor(Math.random() * 25) + 10, sentiment: Math.random() * 2 - 1 },
        { word: "youth", count: Math.floor(Math.random() * 40) + 10, sentiment: Math.random() * 2 - 1 },
        { word: "jobs", count: Math.floor(Math.random() * 60) + 10, sentiment: Math.random() * 2 - 1 },
        { word: "reform", count: Math.floor(Math.random() * 30) + 5, sentiment: Math.random() * 2 - 1 },
        { word: "education", count: Math.floor(Math.random() * 40) + 10, sentiment: Math.random() * 2 - 1 },
        { word: "sanctions", count: Math.floor(Math.random() * 20) + 5, sentiment: Math.random() * 2 - 1 },
        { word: "crisis", count: Math.floor(Math.random() * 30) + 10, sentiment: Math.random() * 2 - 1 },
        { word: "alliance", count: Math.floor(Math.random() * 35) + 10, sentiment: Math.random() * 2 - 1 },
        { word: "summit", count: Math.floor(Math.random() * 25) + 10, sentiment: Math.random() * 2 - 1 },
        { word: "budget", count: Math.floor(Math.random() * 50) + 10, sentiment: Math.random() * 2 - 1 },
        { word: "tax", count: Math.floor(Math.random() * 45) + 15, sentiment: Math.random() * 2 - 1 },
        { word: "industry", count: Math.floor(Math.random() * 55) + 15, sentiment: Math.random() * 2 - 1 },
        { word: "sanitation", count: Math.floor(Math.random() * 20) + 5, sentiment: Math.random() * 2 - 1 },
        ],
    }
  }

  const handleStartMonitoring = async () => {
    const validUsernames = usernames.filter((u) => u.trim())
    if (validUsernames.length === 0) return

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

      await new Promise((resolve) => setTimeout(resolve, 2000))

      setProcessingSteps((steps) =>
        steps.map((step, index) => ({
          ...step,
          active: false,
          completed: index <= i,
        })),
      )
    }

    // Generate mock analysis result with user-specific data
    const totalTweets = 15420
    const cleanUsernames = validUsernames.map(u => u.startsWith('@') ? u : `@${u}`)
    
    // Generate user-specific data
    const usernameData: Record<string, PerUserData> = {}
    cleanUsernames.forEach(username => {
      usernameData[username] = generateMockUserData(username, totalTweets)
    })

    const mockResult: TwitterAnalysisResult = {
      totalTweets,
      totalAccounts: validUsernames.length,
      dateRange,
      usernames: cleanUsernames,
      usernameData,
      heatmapData: generateMockHeatmapData(),
      namedEntities: {
        people: [
          { name: "Narendra Modi", count: 245, sentiment: 0.6 },
          { name: "Xi Jinping", count: 189, sentiment: -0.2 },
          { name: "Joe Biden", count: 156, sentiment: 0.1 },
          { name: "Rahul Gandhi", count: 134, sentiment: -0.1 },
          { name: "Donald Trump", count: 98, sentiment: -0.4 },
        ],
        organizations: [
          { name: "BJP", count: 312, sentiment: 0.3 },
          { name: "Congress", count: 287, sentiment: -0.1 },
          { name: "CCP", count: 198, sentiment: -0.5 },
          { name: "UN", count: 145, sentiment: 0.2 },
          { name: "WHO", count: 89, sentiment: 0.1 },
        ],
        locations: [
          { name: "India", count: 892, sentiment: 0.4 },
          { name: "China", count: 567, sentiment: -0.3 },
          { name: "Delhi", count: 234, sentiment: 0.2 },
          { name: "Beijing", count: 198, sentiment: -0.2 },
          { name: "Mumbai", count: 156, sentiment: 0.3 },
        ],
        hashtags: [
          { name: "#IndiaChina", count: 445, sentiment: -0.1 },
          { name: "#BorderDispute", count: 334, sentiment: -0.6 },
          { name: "#Trade", count: 289, sentiment: 0.2 },
          { name: "#Diplomacy", count: 234, sentiment: 0.1 },
          { name: "#Economy", count: 198, sentiment: 0.3 },
        ],
      },
      stanceAnalysis: {
        india: {
          positive: 65,
          negative: 20,
          neutral: 15,
          keyTweets: [
            "India's economic growth continues to outpace global averages",
            "Proud of India's technological achievements in space exploration",
            "India's democratic values remain strong despite challenges",
          ],
        },
        china: {
          positive: 25,
          negative: 55,
          neutral: 20,
          keyTweets: [
            "Concerns about China's trade practices affecting global markets",
            "China's border policies creating regional tensions",
            "Need for transparent dialogue with China on various issues",
          ],
        },
      },
      timelineData: generateMockTimelineData(),
    wordcloudData: [
    { word: "india", count: 892, sentiment: 0.4 },
    { word: "china", count: 567, sentiment: -0.3 },
    { word: "trade", count: 445, sentiment: 0.2 },
    { word: "border", count: 334, sentiment: -0.5 },
    { word: "economy", count: 289, sentiment: 0.3 },
    { word: "diplomacy", count: 234, sentiment: 0.1 },
    { word: "security", count: 198, sentiment: -0.2 },
    { word: "cooperation", count: 167, sentiment: 0.4 },
    { word: "tension", count: 145, sentiment: -0.6 },
    { word: "growth", count: 134, sentiment: 0.5 },
    { word: "military", count: 128, sentiment: -0.4 },
    { word: "peace", count: 122, sentiment: 0.6 },
    { word: "technology", count: 118, sentiment: 0.2 },
    { word: "conflict", count: 111, sentiment: -0.5 },
    { word: "investment", count: 106, sentiment: 0.3 },
    { word: "alliance", count: 102, sentiment: 0.2 },
    { word: "exports", count: 98, sentiment: 0.1 },
    { word: "imports", count: 94, sentiment: -0.1 },
    { word: "inflation", count: 89, sentiment: -0.4 },
    { word: "summit", count: 85, sentiment: 0.5 },
    { word: "sanctions", count: 82, sentiment: -0.6 },
    { word: "reform", count: 78, sentiment: 0.3 },
    { word: "budget", count: 76, sentiment: 0.1 },
    { word: "policy", count: 74, sentiment: 0.2 },
    { word: "jobs", count: 70, sentiment: 0.4 },
    { word: "youth", count: 66, sentiment: 0.3 },
    { word: "crisis", count: 64, sentiment: -0.5 },
    { word: "leadership", count: 61, sentiment: 0.6 },
    { word: "strategy", count: 58, sentiment: 0.2 },
    { word: "dialogue", count: 55, sentiment: 0.5 },
    ]
    }

    // Add to history
    const historyItem = {
      id: Date.now(),
      usernames: cleanUsernames,
      dateRange,
      totalTweets: mockResult.totalTweets,
      totalAccounts: mockResult.totalAccounts,
      timestamp: new Date().toISOString(),
    }

    setMonitoringHistory([historyItem, ...monitoringHistory])
    setIsProcessing(false)
    onAnalysisComplete?.(mockResult)
  }

  const ProcessingSteps = () => (
    <div className="space-y-4 py-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Monitoring Twitter</h3>
        <p className="text-sm text-gray-400">Analyzing tweets and generating insights...</p>
        <div className="mt-4 text-xs text-gray-500">
          Processing {usernames.filter(u => u.trim()).length} account{usernames.filter(u => u.trim()).length !== 1 ? 's' : ''}
        </div>
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

      {/* Show usernames being processed */}
      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
        <div className="text-xs text-gray-400 mb-2">Processing accounts:</div>
        <div className="flex flex-wrap gap-2">
          {usernames.filter(u => u.trim()).map((username, index) => (
            <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
              {username.startsWith('@') ? username : `@${username}`}
            </span>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-800/50">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} tabs={["monitor", "history"]} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {activeTab === "monitor" ? (
          <div className="p-6">
            {!isProcessing ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4">
                    <Twitter className="w-8 h-8 text-blue-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">Twitter Monitoring</h2>
                  <p className="text-gray-400">Monitor Twitter accounts and analyze their content</p>
                </div>

                {/* Username Input */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-300">Twitter Usernames</label>
                    <button
                      onClick={addUsername}
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-32 overflow-y-auto hide-scrollbar">
                    {usernames.map((username, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="@username"
                            value={username}
                            onChange={(e) => updateUsername(index, e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                          />
                          <Twitter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        </div>
                        {usernames.length > 1 && (
                          <button
                            onClick={() => removeUsername(index)}
                            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Show preview of usernames */}
                  {usernames.filter(u => u.trim()).length > 0 && (
                    <div className="p-3 bg-gray-800/30 rounded-lg">
                      <div className="text-xs text-gray-400 mb-2">
                        {usernames.filter(u => u.trim()).length} account{usernames.filter(u => u.trim()).length !== 1 ? 's' : ''} to monitor:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {usernames.filter(u => u.trim()).map((username, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                            {username.startsWith('@') ? username : `@${username}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CSV Upload */}
                  <div className="border-2 border-dashed border-gray-700/50 rounded-lg p-4 text-center hover:border-gray-600/50 transition-colors">
                    <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 mb-2">Or upload a CSV file with usernames</p>
                    <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
                    <label
                      htmlFor="csv-upload"
                      className="inline-flex items-center px-3 py-1 bg-gray-800/50 text-gray-300 text-sm rounded-md hover:bg-gray-700/50 cursor-pointer transition-colors"
                    >
                      Choose CSV File
                    </label>
                  </div>
                </div>

                {/* Enhanced Date Range Picker */}
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  disabled={isProcessing}
                  placeholder="Select monitoring period"
                />

                {/* Action Button */}
                <button
                  onClick={handleStartMonitoring}
                  disabled={usernames.filter((u) => u.trim()).length === 0 || isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group shadow-lg"
                >
                  <span>Start Monitoring</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>

                {/* Feature Highlights */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <h4 className="text-sm font-medium text-white mb-1">Sentiment Analysis</h4>
                    <p className="text-xs text-gray-400">Track sentiment trends across accounts</p>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <h4 className="text-sm font-medium text-white mb-1">Entity Recognition</h4>
                    <p className="text-xs text-gray-400">Identify key people, places, and topics</p>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <h4 className="text-sm font-medium text-white mb-1">Activity Heatmap</h4>
                    <p className="text-xs text-gray-400">Visualize engagement patterns</p>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <h4 className="text-sm font-medium text-white mb-1">Per-User Analysis</h4>
                    <p className="text-xs text-gray-400">Individual account insights</p>
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
              <h3 className="text-lg font-semibold text-white">Monitoring History</h3>
              {monitoringHistory.length > 0 && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                  {monitoringHistory.length}
                </span>
              )}
            </div>

            {monitoringHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4">
                  <History className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400 mb-2">No monitoring sessions yet</p>
                <p className="text-sm text-gray-500">Your monitoring history will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {monitoringHistory.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:bg-gray-800/50 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium mb-1">
                          {session.usernames.slice(0, 3).join(", ")}
                          {session.usernames.length > 3 && ` +${session.usernames.length - 3} more`}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {new Date(session.timestamp).toLocaleDateString()} •{" "}
                          {new Date(session.dateRange.start).toLocaleDateString()} to{" "}
                          {new Date(session.dateRange.end).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-gray-700/30 rounded-lg">
                        <div className="text-sm font-medium text-white">{session.totalTweets.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">tweets</div>
                      </div>
                      <div className="text-center p-2 bg-gray-700/30 rounded-lg">
                        <div className="text-sm font-medium text-white">{session.totalAccounts}</div>
                        <div className="text-xs text-gray-400">accounts</div>
                      </div>
                    </div>

                    {/* Show usernames in history */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {session.usernames.map((username: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                          {username}
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

export default TwitterAnalysisPanel