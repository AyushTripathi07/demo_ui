"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie, Tooltip, Legend } from "recharts"
import { Globe, TrendingUp, TrendingDown, Minus, ChevronRight, Twitter, Users, ChevronDown } from 'lucide-react'
import Popover from "../ui/Popover"

interface StanceAnalysisTwitterCardProps {
  data?: {
    india: {
      positive: number
      negative: number
      neutral: number
      keyTweets: string[]
    }
    china: {
      positive: number
      negative: number
      neutral: number
      keyTweets: string[]
    }
  }
  isLoading?: boolean
  usernames?: string[]
  usernameData?: Record<
    string,
    {
      stanceAnalysis?: {
        india: {
          positive: number
          negative: number
          neutral: number
          keyTweets: string[]
        }
        china: {
          positive: number
          negative: number
          neutral: number
          keyTweets: string[]
        }
      }
    }
  >
  onUsernameChange?: (username: string) => void
}

const StanceAnalysisTwitterCard: React.FC<StanceAnalysisTwitterCardProps> = ({ 
  data, 
  isLoading,
  usernames = [],
  usernameData = {},
  onUsernameChange,
}) => {
  const [viewMode, setViewMode] = useState<"bar" | "pie">("bar")
  const [showPopover, setShowPopover] = useState(false)
  const [expandedViewMode, setExpandedViewMode] = useState<"bar" | "pie" | "detailed">("bar")
  const [showUsernameDropdown, setShowUsernameDropdown] = useState(false)
  const [showExpandedUsernameDropdown, setShowExpandedUsernameDropdown] = useState(false)
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null)

  useEffect(() => {
    if (usernames.length > 0 && !selectedUsername) {
      setSelectedUsername("All Accounts")
    }
  }, [usernames, selectedUsername])

  const handleUsernameSelect = (username: string) => {
    setSelectedUsername(username)
    setShowUsernameDropdown(false)
    setShowExpandedUsernameDropdown(false)
    if (onUsernameChange) {
      onUsernameChange(username)
    }
  }

  // Get current data based on selected username
  const getCurrentData = () => {
    if (!selectedUsername || selectedUsername === "All Accounts") {
      return data
    }
    return usernameData[selectedUsername]?.stanceAnalysis || data
  }

  const currentData = getCurrentData()

  if (isLoading) {
    return (
      <div className="card bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
        <div className="animate-pulse">
          <div className="h-6 bg-purple-200 rounded w-1/2 mb-6"></div>
          <div className="h-48 bg-purple-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-purple-200 rounded"></div>
            <div className="h-20 bg-purple-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentData) {
    return (
      <div className="card bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-purple-500/10 rounded-xl">
            <Globe className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Stance Analysis</h3>
            <p className="text-gray-600 text-sm">India vs China sentiment</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Globe className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-gray-500">No stance data available</p>
        </div>
      </div>
    )
  }

  const chartData = [
    {
      country: "India",
      positive: currentData.india.positive,
      negative: currentData.india.negative,
      neutral: currentData.india.neutral,
    },
    {
      country: "China",
      positive: currentData.china.positive,
      negative: currentData.china.negative,
      neutral: currentData.china.neutral,
    },
  ]

  const pieData = [
    { name: "India Positive", value: currentData.india.positive, fill: "#10B981" },
    { name: "India Neutral", value: currentData.india.neutral, fill: "#F59E0B" },
    { name: "India Negative", value: currentData.india.negative, fill: "#EF4444" },
    { name: "China Positive", value: currentData.china.positive, fill: "#059669" },
    { name: "China Neutral", value: currentData.china.neutral, fill: "#D97706" },
    { name: "China Negative", value: currentData.china.negative, fill: "#DC2626" },
  ]

  // Detailed data for expanded view
  const detailedData = [
    { name: "Week 1", India_Positive: 65, India_Neutral: 25, India_Negative: 10, China_Positive: 30, China_Neutral: 40, China_Negative: 30 },
    { name: "Week 2", India_Positive: 60, India_Neutral: 30, India_Negative: 10, China_Positive: 25, China_Neutral: 45, China_Negative: 30 },
    { name: "Week 3", India_Positive: 70, India_Neutral: 20, India_Negative: 10, China_Positive: 20, China_Neutral: 40, China_Negative: 40 },
    { name: "Week 4", India_Positive: 55, India_Neutral: 30, India_Negative: 15, China_Positive: 15, China_Neutral: 45, China_Negative: 40 },
    { name: "Week 5", India_Positive: 50, India_Neutral: 35, India_Negative: 15, China_Positive: 20, China_Neutral: 35, China_Negative: 45 },
  ]

  const COLORS = {
    positive: "#10B981",
    negative: "#EF4444",
    neutral: "#F59E0B",
  }

  const getOverallSentiment = (country: "india" | "china") => {
    const countryData = currentData[country]
    if (countryData.positive > countryData.negative && countryData.positive > countryData.neutral) {
      return { sentiment: "positive", icon: TrendingUp, color: "text-green-600" }
    } else if (countryData.negative > countryData.positive && countryData.negative > countryData.neutral) {
      return { sentiment: "negative", icon: TrendingDown, color: "text-red-600" }
    } else {
      return { sentiment: "neutral", icon: Minus, color: "text-yellow-600" }
    }
  }

  const indiaOverall = getOverallSentiment("india")
  const chinaOverall = getOverallSentiment("china")

  return (
    <>
      <div className="card bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Stance Analysis</h3>
              <p className="text-gray-600 text-sm">India vs China sentiment comparison</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode("bar")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === "bar" ? "bg-purple-500 text-white" : "bg-white text-gray-600 hover:bg-purple-50"
                }`}
              >
                Bar
              </button>
              <button
                onClick={() => setViewMode("pie")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === "pie" ? "bg-purple-500 text-white" : "bg-white text-gray-600 hover:bg-purple-50"
                }`}
              >
                Pie
              </button>
            </div>
            <button
              onClick={() => setShowPopover(true)}
              className="p-2 hover:bg-purple-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Username Selection Dropdown */}
        {usernames && usernames.length > 1 && (
          <div className="mb-6 relative">
            <div
              className="flex items-center justify-between p-3 bg-white rounded-xl border border-purple-100 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => setShowUsernameDropdown(!showUsernameDropdown)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Twitter className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Stance analysis for</div>
                  <div className="font-medium text-black">{selectedUsername || "All Accounts"}</div>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showUsernameDropdown ? "transform rotate-180" : ""}`}
              />
            </div>

            {showUsernameDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-purple-100 shadow-lg z-10 max-h-60 overflow-y-auto">
                <div
                  className="p-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 flex items-center space-x-3"
                  onClick={() => handleUsernameSelect("All Accounts")}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="font-medium text-gray-600">All Accounts</div>
                </div>
                {usernames.map((username) => (
                  <div
                    key={username}
                    className="p-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 flex items-center space-x-3"
                    onClick={() => handleUsernameSelect(username)}
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Twitter className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="font-medium text-gray-600">{username}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chart */}
        <div className="h-56 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === "bar" ? (
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis
                  dataKey="country"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                />
                <YAxis hide />
                <Bar dataKey="positive" stackId="a" fill={COLORS.positive} radius={[0, 0, 0, 0]} />
                <Bar dataKey="neutral" stackId="a" fill={COLORS.neutral} radius={[0, 0, 0, 0]} />
                <Bar dataKey="negative" stackId="a" fill={COLORS.negative} radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Country Comparison */}
        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded-xl border border-green-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-gray-800 flex items-center space-x-2">
                <span>🇮🇳</span>
                <span>India</span>
              </h4>
              <div className={`flex items-center space-x-1 ${indiaOverall.color}`}>
                <indiaOverall.icon className="w-4 h-4" />
                <span className="text-xs font-medium capitalize">{indiaOverall.sentiment}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Positive:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${currentData.india.positive}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-green-600">{currentData.india.positive}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Neutral:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 transition-all duration-500"
                      style={{ width: `${currentData.india.neutral}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-yellow-600">{currentData.india.neutral}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Negative:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-500"
                      style={{ width: `${currentData.india.negative}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-red-600">{currentData.india.negative}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-red-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-gray-800 flex items-center space-x-2">
                <span>🇨🇳</span>
                <span>China</span>
              </h4>
              <div className={`flex items-center space-x-1 ${chinaOverall.color}`}>
                <chinaOverall.icon className="w-4 h-4" />
                <span className="text-xs font-medium capitalize">{chinaOverall.sentiment}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Positive:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${currentData.china.positive}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-green-600">{currentData.china.positive}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Neutral:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 transition-all duration-500"
                      style={{ width: `${currentData.china.neutral}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-yellow-600">{currentData.china.neutral}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Negative:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-500"
                      style={{ width: `${currentData.china.negative}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-red-600">{currentData.china.negative}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Analysis based on{" "}
              <span className="font-medium text-purple-600">
                {Math.round(
                  (currentData.india.positive +
                    currentData.india.negative +
                    currentData.india.neutral +
                    currentData.china.positive +
                    currentData.china.negative +
                    currentData.china.neutral) /
                    2,
                )}
                %
              </span>{" "}
              of monitored tweets
            </p>
          </div>
        </div>
      </div>

      <Popover
        isOpen={showPopover}
        onClose={() => setShowPopover(false)}
        title="Stance Analysis Details"
        className="bg-gradient-to-br from-purple-50 to-indigo-50"
      >
        <div className="space-y-6">
          {/* Username Selection in Popover */}
          {usernames && usernames.length > 1 && (
            <div className="relative">
              <div
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-purple-100 cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => setShowExpandedUsernameDropdown(!showExpandedUsernameDropdown)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Twitter className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Viewing data for</div>
                    <div className="font-medium text-black">{selectedUsername || "All Accounts"}</div>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showExpandedUsernameDropdown ? "transform rotate-180" : ""}`}
                />
              </div>

              {showExpandedUsernameDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-purple-100 shadow-lg z-10 max-h-60 overflow-y-auto">
                  <div
                    className="p-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 flex items-center space-x-3"
                    onClick={() => handleUsernameSelect("All Accounts")}
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="font-medium text-gray-600">All Accounts</div>
                  </div>
                  {usernames.map((username) => (
                    <div
                      key={username}
                      className="p-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 flex items-center space-x-3"
                      onClick={() => handleUsernameSelect(username)}
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Twitter className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="font-medium text-gray-600">{username}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


          {/* View Mode Selector */}
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setExpandedViewMode("bar")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                expandedViewMode === "bar" ? "bg-purple-500 text-white" : "bg-white text-gray-600 hover:bg-purple-50"
              }`}
            >
              Bar Chart
            </button>
            <button
              onClick={() => setExpandedViewMode("pie")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                expandedViewMode === "pie" ? "bg-purple-500 text-white" : "bg-white text-gray-600 hover:bg-purple-50"
              }`}
            >
              Pie Chart
            </button>
            <button
              onClick={() => setExpandedViewMode("detailed")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                expandedViewMode === "detailed" ? "bg-purple-500 text-white" : "bg-white text-gray-600 hover:bg-purple-50"
              }`}
            >
              Detailed View
            </button>
          </div>

          {/* Expanded Chart */}
          <div className="bg-white p-4 rounded-xl border border-purple-100">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                {expandedViewMode === "bar" ? (
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis
                      dataKey="country"
                      axisLine={true}
                      tickLine={true}
                      tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar name="Positive" dataKey="positive" stackId="a" fill={COLORS.positive} radius={[0, 0, 0, 0]} />
                    <Bar name="Neutral" dataKey="neutral" stackId="a" fill={COLORS.neutral} radius={[0, 0, 0, 0]} />
                    <Bar name="Negative" dataKey="negative" stackId="a" fill={COLORS.negative} radius={[6, 6, 0, 0]} />
                  </BarChart>
                ) : expandedViewMode === "pie" ? (
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={140}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                ) : (
                  <BarChart data={detailedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar name="India Positive" dataKey="India_Positive" fill="#10B981" />
                    <Bar name="India Neutral" dataKey="India_Neutral" fill="#F59E0B" />
                    <Bar name="India Negative" dataKey="India_Negative" fill="#EF4444" />
                    <Bar name="China Positive" dataKey="China_Positive" fill="#059669" />
                    <Bar name="China Neutral" dataKey="China_Neutral" fill="#D97706" />
                    <Bar name="China Negative" dataKey="China_Negative" fill="#DC2626" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Tweets */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Key Tweets</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto hide-scrollbar">
              <div className="p-4 bg-white rounded-xl border border-green-100">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-green-600 font-medium">Positive Tweet</span>
                  <span className="text-xs text-gray-500">about India</span>
                </div>
                <p className="text-sm text-gray-700">
                  {currentData.india.keyTweets[0] || "India's economic growth continues to impress global markets with consistent performance."}
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-yellow-100">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-yellow-600 font-medium">Neutral Tweet</span>
                  <span className="text-xs text-gray-500">about China</span>
                </div>
                <p className="text-sm text-gray-700">
                  {currentData.china.keyTweets[0] || "China announces new trade policies that will take effect next quarter."}
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-red-100">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-red-600 font-medium">Negative Tweet</span>
                  <span className="text-xs text-gray-500">about China</span>
                </div>
                <p className="text-sm text-gray-700">
                  {currentData.china.keyTweets[1] || "Concerns rise over China's approach to international regulations in the tech sector."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Popover>
    </>
  )
}

export default StanceAnalysisTwitterCard
