"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Twitter, Users, Calendar, TrendingUp, ChevronRight, Clock, BarChart3, ChevronDown } from "lucide-react"
import Popover from "../ui/Popover"

interface TwitterMonitoringCardProps {
  data?: {
    totalTweets: number
    totalAccounts: number
    dateRange: {
      start: string
      end: string
    }
    usernames?: string[] // Add usernames array
    usernameData?: Record<
      string,
      {
        totalTweets: number
        avgTweetsPerDay: number
      }
    > // Add per-username data
  }
  isLoading?: boolean
  onUsernameChange?: (username: string) => void // Add callback for username changes
}

const TwitterMonitoringCard: React.FC<TwitterMonitoringCardProps> = ({ data, isLoading, onUsernameChange }) => {
  const [showPopover, setShowPopover] = useState(false)
  const [showUsernameDropdown, setShowUsernameDropdown] = useState(false)
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null)

  useEffect(() => {
    if (data?.usernames && data.usernames.length > 0 && !selectedUsername) {
      setSelectedUsername("All Accounts")
    }
  }, [data?.usernames, selectedUsername])

  const handleUsernameSelect = (username: string) => {
    setSelectedUsername(username)
    setShowUsernameDropdown(false)
    if (onUsernameChange) {
      onUsernameChange(username)
    }
  }

  if (isLoading) {
    return (
      <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
        <div className="animate-pulse">
          <div className="h-6 bg-blue-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6 bg-blue-100 rounded-xl">
                <div className="w-12 h-12 bg-blue-200 rounded-full mx-auto mb-4"></div>
                <div className="h-8 bg-blue-200 rounded mb-2"></div>
                <div className="h-4 bg-blue-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <Twitter className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">No Twitter Data</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Start monitoring Twitter accounts to see comprehensive analytics and insights
          </p>
        </div>
      </div>
    )
  }

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} day${diffDays !== 1 ? "s" : ""}`
  }

  const avgTweetsPerDay = Math.round(
    data.totalTweets / Number.parseInt(formatDateRange(data.dateRange.start, data.dateRange.end)),
  )

  return (
    <>
      <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 hover:shadow-xl transition-all duration-300 group cursor-pointer">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Twitter Monitoring Overview</h3>
            <p className="text-gray-600">Real-time social media analytics and insights</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-4 bg-blue-500 rounded-2xl shadow-lg">
              <Twitter className="w-8 h-8 text-white" />
            </div>
            <button
              onClick={() => setShowPopover(true)}
              className="p-2 hover:bg-blue-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {data?.usernames && data.usernames.length > 1 && (
          <div className="mb-6 relative">
            <div
              className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => setShowUsernameDropdown(!showUsernameDropdown)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Twitter className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Selected Account</div>
                  <div className="font-medium text-black">{selectedUsername || "All Accounts"}</div>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showUsernameDropdown ? "transform rotate-180" : ""}`}
              />
            </div>

            {showUsernameDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-blue-100 shadow-lg z-10 max-h-60 overflow-y-auto hide-scrollbar">
                <div
                  className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 flex items-center space-x-3"
                  onClick={() => handleUsernameSelect("All Accounts")}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="font-medium text-gray-800">All Accounts</div>
                </div>
                {data.usernames.map((username) => (
                  <div
                    key={username}
                    className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 flex items-center space-x-3"
                    onClick={() => handleUsernameSelect(username)}
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Twitter className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="font-medium text-gray-800">{username}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div className="group/card relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-100">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-center w-14 h-14 bg-blue-500/10 rounded-xl mb-4 group-hover/card:scale-110 transition-transform duration-300">
                <Twitter className="w-7 h-7 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {selectedUsername && selectedUsername !== "All Accounts" && data?.usernameData?.[selectedUsername]
                  ? data.usernameData[selectedUsername].totalTweets.toLocaleString()
                  : data?.totalTweets.toLocaleString()}
              </div>
              <div className="text-sm font-medium text-gray-600">Total Tweets Analyzed</div>
              <div className="flex items-center mt-2 text-xs text-blue-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>Active monitoring</span>
              </div>
            </div>
          </div>

          <div className="group/card relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-green-100">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-center w-14 h-14 bg-green-500/10 rounded-xl mb-4 group-hover/card:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{data.totalAccounts}</div>
              <div className="text-sm font-medium text-gray-600">Accounts Monitored</div>
              <div className="flex items-center mt-2 text-xs text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span>Live tracking</span>
              </div>
            </div>
          </div>

          <div className="group/card relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-purple-100">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-center w-14 h-14 bg-purple-500/10 rounded-xl mb-4 group-hover/card:scale-110 transition-transform duration-300">
                <Calendar className="w-7 h-7 text-purple-600" />
              </div>
              <div className="text-lg font-bold text-gray-800 mb-1">
                {formatDateRange(data.dateRange.start, data.dateRange.end)}
              </div>
              <div className="text-sm font-medium text-gray-600 mb-2">Monitoring Period</div>
              <div className="text-xs text-gray-500">
                {new Date(data.dateRange.start).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                {new Date(data.dateRange.end).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Monitoring Status: Active</span>
            </div>
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>
      </div>

      <Popover
        isOpen={showPopover}
        onClose={() => setShowPopover(false)}
        title="Twitter Monitoring Details"
        className="bg-gradient-to-br from-blue-50 to-indigo-50"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-white rounded-xl border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-800">Daily Average</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{avgTweetsPerDay.toLocaleString()}</div>
              <div className="text-sm text-gray-600">tweets per day</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-green-100">
              <div className="flex items-center space-x-3 mb-3">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-800">Monitoring Duration</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatDateRange(data.dateRange.start, data.dateRange.end)}
              </div>
              <div className="text-sm text-gray-600">continuous tracking</div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white">
            <h4 className="font-semibold mb-2">Monitoring Summary</h4>
            <p className="text-sm opacity-90">
              Currently tracking {data.totalAccounts} Twitter accounts over a{" "}
              {formatDateRange(data.dateRange.start, data.dateRange.end)} period, analyzing{" "}
              {data.totalTweets.toLocaleString()} tweets with an average of {avgTweetsPerDay} tweets per day.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{data.totalTweets.toLocaleString()}</div>
              <div className="text-xs text-gray-600">Total Tweets</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{data.totalAccounts}</div>
              <div className="text-xs text-gray-600">Accounts</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{avgTweetsPerDay}</div>
              <div className="text-xs text-gray-600">Daily Avg</div>
            </div>
          </div>
        </div>
      </Popover>
    </>
  )
}

export default TwitterMonitoringCard
