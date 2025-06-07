"use client"

import type React from "react"
import { useState } from "react"
import StatisticsHeader from "./StatisticsHeader"
import TwitterHeatmapCard from "./twitter/TwitterHeatmapCard"
import NamedEntityTwitterCard from "./twitter/NamedEntityTwitterCard"
import StanceAnalysisTwitterCard from "./twitter/StanceAnalysisTwitterCard"
import TweetTimelineCard from "./twitter/TweetTimelineCard"
import WordcloudCard from "./twitter/WordcloudCard"
import TwitterMonitoringCard from "./twitter/TwitterMonitoringCard"
import TwitterAnalysisPanel from "./TwitterAnalysisPanel"

interface WordcloudEntry {
  word: string
  count: number
  sentiment: number
}

interface TimelineEntry {
  date: string
  tweetCount: number
  sentiment: number
  topTopics: string[]
}

interface NamedEntities {
  people: Array<{ name: string; count: number; sentiment: number }>
  organizations: Array<{ name: string; count: number; sentiment: number }>
  locations: Array<{ name: string; count: number; sentiment: number }>
  hashtags: Array<{ name: string; count: number; sentiment: number }>
}

interface StanceAnalysis {
  india: { positive: number; negative: number; neutral: number; keyTweets: string[] }
  china: { positive: number; negative: number; neutral: number; keyTweets: string[] }
}

interface HeatmapEntry {
  date: string
  value: number
  accounts: string[]
}

interface PerUserData {
  totalTweets: number
  avgTweetsPerDay: number
  heatmapData?: HeatmapEntry[]
  namedEntities?: NamedEntities
  stanceAnalysis?: StanceAnalysis
  timelineData?: TimelineEntry[]
  wordcloudData?: WordcloudEntry[]
}

interface TwitterAnalysisResult {
  totalTweets: number
  totalAccounts: number
  dateRange: { start: string; end: string }
  usernames: string[]
  usernameData: Record<string, PerUserData>
  heatmapData: HeatmapEntry[]
  namedEntities: NamedEntities
  stanceAnalysis: StanceAnalysis
  timelineData: TimelineEntry[]
  wordcloudData: WordcloudEntry[]
}


const TwitterMonitoring: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<TwitterAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null)

  // Individual card username selections
  const [timelineUsername, setTimelineUsername] = useState<string | null>(null)
  const [stanceUsername, setStanceUsername] = useState<string | null>(null)
  const [heatmapUsername, setHeatmapUsername] = useState<string | null>(null)
  const [entityUsername, setEntityUsername] = useState<string | null>(null)
  const [wordcloudUsername, setWordcloudUsername] = useState<string | null>(null)

  const handleAnalysisComplete = (result: TwitterAnalysisResult) => {
    setAnalysisResult(result)
    setIsAnalyzing(false)
    setSelectedUsername(null) // Reset selection when new analysis completes
    // Reset individual card selections
    setTimelineUsername(null)
    setStanceUsername(null)
    setHeatmapUsername(null)
    setEntityUsername(null)
    setWordcloudUsername(null)
  }

  const handleAnalysisStart = () => {
    setIsAnalyzing(true)
    setAnalysisResult(null)
    setSelectedUsername(null)
    // Reset individual card selections
    setTimelineUsername(null)
    setStanceUsername(null)
    setHeatmapUsername(null)
    setEntityUsername(null)
    setWordcloudUsername(null)
  }

  const handleUsernameChange = (username: string) => {
    setSelectedUsername(username === "All Accounts" ? null : username)
  }

  // Get the appropriate data based on selected username for main monitoring card
  const getCurrentData = () => {
    if (!analysisResult) return null

    if (!selectedUsername) {
      return analysisResult // Return all data
    }

    const userData = analysisResult.usernameData[selectedUsername]
    if (!userData) return analysisResult

    // Return filtered data for the selected username
    return {
      ...analysisResult,
      totalTweets: userData.totalTweets,
      heatmapData: userData.heatmapData || analysisResult.heatmapData,
      namedEntities: userData.namedEntities || analysisResult.namedEntities,
      stanceAnalysis: userData.stanceAnalysis || analysisResult.stanceAnalysis,
      timelineData: userData.timelineData || analysisResult.timelineData,
      wordcloudData: userData.wordcloudData || analysisResult.wordcloudData,
    }
  }

  // Get data for individual cards based on their specific username selection
  const getCardData = (cardUsername: string | null, dataType: keyof TwitterAnalysisResult) => {
    if (!analysisResult) return null

    if (!cardUsername || cardUsername === "All Accounts") {
      return analysisResult[dataType]
    }

    const userData = analysisResult.usernameData[cardUsername]
    if (!userData) return analysisResult[dataType]

    return analysisResult[dataType]
  }

  // const currentData = getCurrentData()

  return (
    <div className="flex gap-6 px-6 py-6">
      {/* Main Content Area */}
      <div className="flex-[0.65] space-y-6">
        <StatisticsHeader title="Twitter Monitoring" onRefresh={() => console.log("Refreshing Twitter data...")} />

        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <TwitterMonitoringCard
              data={
                analysisResult
                  ? {
                      totalTweets: getCurrentData()?.totalTweets || analysisResult.totalTweets,
                      totalAccounts: analysisResult.totalAccounts,
                      dateRange: analysisResult.dateRange,
                      usernames: analysisResult.usernames,
                      usernameData: analysisResult.usernameData,
                    }
                  : undefined
              }
              isLoading={isAnalyzing}
              onUsernameChange={handleUsernameChange}
            />
          </div>

          <TwitterHeatmapCard
            data={getCardData(heatmapUsername, "heatmapData") as HeatmapEntry[]}
            isLoading={isAnalyzing}
          />
          <NamedEntityTwitterCard
            data={getCardData(entityUsername, "namedEntities") as NamedEntities}
            isLoading={isAnalyzing}
            usernames={analysisResult?.usernames}
            usernameData={analysisResult?.usernameData}
            onUsernameChange={setEntityUsername}
          />
        </div>

        <div className="space-y-6">
        <TweetTimelineCard
            data={getCardData(timelineUsername, "timelineData") as TimelineEntry[]}
            isLoading={isAnalyzing}
            usernames={analysisResult?.usernames}
            usernameData={analysisResult?.usernameData}
            onUsernameChange={setTimelineUsername}
        />
        <StanceAnalysisTwitterCard
            data={getCardData(stanceUsername, "stanceAnalysis") as StanceAnalysis}
            isLoading={isAnalyzing}
            usernames={analysisResult?.usernames}
            usernameData={analysisResult?.usernameData}
            onUsernameChange={setStanceUsername}
        />
        </div>

        <WordcloudCard
          data={getCardData(wordcloudUsername, "wordcloudData") as WordcloudEntry[]}
          isLoading={isAnalyzing}
          usernames={analysisResult?.usernames}
          usernameData={analysisResult?.usernameData}
          onUsernameChange={setWordcloudUsername}
        />
      </div>

      {/* Right Panel - Twitter Analysis */}
      <div className="flex-[0.35] sticky top-0 h-[calc(100vh-6rem)]">
        <TwitterAnalysisPanel onAnalysisStart={handleAnalysisStart} onAnalysisComplete={handleAnalysisComplete} />
      </div>
    </div>
  )
}

export default TwitterMonitoring
