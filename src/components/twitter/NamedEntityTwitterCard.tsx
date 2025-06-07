"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Users,
  Building,
  MapPin,
  Hash,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Twitter,
  ChevronDown,
} from "lucide-react"
import Popover from "../ui/Popover"

interface NamedEntityTwitterCardProps {
  data?: {
    people: Array<{ name: string; count: number; sentiment: number }>
    organizations: Array<{ name: string; count: number; sentiment: number }>
    locations: Array<{ name: string; count: number; sentiment: number }>
    hashtags: Array<{ name: string; count: number; sentiment: number }>
  }
  isLoading?: boolean
  usernames?: string[]
  usernameData?: Record<
    string,
    {
      namedEntities?: {
        people: Array<{ name: string; count: number; sentiment: number }>
        organizations: Array<{ name: string; count: number; sentiment: number }>
        locations: Array<{ name: string; count: number; sentiment: number }>
        hashtags: Array<{ name: string; count: number; sentiment: number }>
      }
    }
  >
  onUsernameChange?: (username: string) => void
}

const NamedEntityTwitterCard: React.FC<NamedEntityTwitterCardProps> = ({
  data,
  isLoading,
  usernames = [],
  usernameData = {},
  onUsernameChange,
}) => {
  const [activeCategory, setActiveCategory] = useState<"people" | "organizations" | "locations" | "hashtags">("people")
  const [showPopover, setShowPopover] = useState(false)
  const [showUsernameDropdown, setShowUsernameDropdown] = useState(false)
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null)

  useEffect(() => {
    if (usernames.length > 0 && !selectedUsername) {
      setSelectedUsername("All Accounts")
    }
  }, [usernames, selectedUsername])

  const handleUsernameSelect = (username: string) => {
    setSelectedUsername(username)
    setShowUsernameDropdown(false)
    if (onUsernameChange) {
      onUsernameChange(username)
    }
  }

  // Get current data based on selected username
  const getCurrentData = () => {
    if (!selectedUsername || selectedUsername === "All Accounts") {
      return data
    }
    return usernameData[selectedUsername]?.namedEntities || data
  }

  const currentData = getCurrentData()

  if (isLoading) {
    return (
      <div className="card bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
        <div className="animate-pulse">
          <div className="h-6 bg-orange-200 rounded w-1/2 mb-6"></div>
          <div className="flex space-x-2 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-orange-200 rounded-lg flex-1"></div>
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-orange-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!currentData) {
    return (
      <div className="card bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-orange-500/10 rounded-xl">
            <Users className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Named Entities</h3>
            <p className="text-gray-600 text-sm">Key mentions and references</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Users className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-gray-500">No entity data available</p>
        </div>
      </div>
    )
  }

  const categories = [
    {
      key: "people" as const,
      label: "People",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      activeColor: "bg-blue-500",
    },
    {
      key: "organizations" as const,
      label: "Organizations",
      icon: Building,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      activeColor: "bg-green-500",
    },
    {
      key: "locations" as const,
      label: "Locations",
      icon: MapPin,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      activeColor: "bg-red-500",
    },
    {
      key: "hashtags" as const,
      label: "Hashtags",
      icon: Hash,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      activeColor: "bg-purple-500",
    },
  ]

  const getSentimentIcon = (sentiment: number) => {
    if (sentiment > 0.2) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (sentiment < -0.2) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-yellow-500" />
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.2) return "text-green-600 bg-green-50 border-green-200"
    if (sentiment < -0.2) return "text-red-600 bg-red-50 border-red-200"
    return "text-yellow-600 bg-yellow-50 border-yellow-200"
  }

  const activeData = currentData[activeCategory]
  const totalMentions = activeData.reduce((sum, item) => sum + item.count, 0)
  // const avgSentiment = activeData.reduce((sum, item) => sum + item.sentiment, 0) / activeData.length

  return (
    <>
      <div className="card bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Named Entities</h3>
              <p className="text-gray-600 text-sm">Key mentions and references</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{totalMentions}</div>
              <div className="text-xs text-gray-500">Total mentions</div>
            </div>
            <button
              onClick={() => setShowPopover(true)}
              className="p-2 hover:bg-orange-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Username Selection Dropdown */}
        {usernames && usernames.length > 1 && (
          <div className="mb-6 relative">
            <div
              className="flex items-center justify-between p-3 bg-white rounded-xl border border-orange-100 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => setShowUsernameDropdown(!showUsernameDropdown)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Twitter className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Entities for</div>
                  <div className="font-medium text-black">{selectedUsername || "All Accounts"}</div>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showUsernameDropdown ? "transform rotate-180" : ""}`}
              />
            </div>

            {showUsernameDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-orange-100 shadow-lg z-10 max-h-60 overflow-y-auto">
                <div
                  className="p-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 flex items-center space-x-3"
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
                    className="p-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 flex items-center space-x-3"
                    onClick={() => handleUsernameSelect(username)}
                  >
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Twitter className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="font-medium text-gray-600">{username}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category Tabs */}
        <div className="grid grid-cols-4 gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.key
            return (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? `${category.activeColor} text-white shadow-md transform scale-105`
                    : "text-gray-600 hover:bg-white hover:shadow-sm"
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${isActive ? "text-white" : category.color}`} />
                <span className="hidden sm:block">{category.label}</span>
                <span className="sm:hidden">{category.label.slice(0, 3)}</span>
              </button>
            )
          })}
        </div>

        {/* Entity List */}
        <div className="space-y-3 max-h-64 overflow-y-auto hide-scrollbar">
          {activeData.slice(0, 6).map((entity, index) => (
            <div
              key={index}
              className="group/item p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-semibold text-gray-800">{entity.name}</span>
                    {getSentimentIcon(entity.sentiment)}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">{entity.count}</span> mentions
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getSentimentColor(entity.sentiment)}`}
                    >
                      {entity.sentiment > 0 ? "+" : ""}
                      {(entity.sentiment * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-500"
                    style={{ width: `${(entity.count / Math.max(...activeData.map((e) => e.count))) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeData.length > 6 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowPopover(true)}
              className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
            >
              View all {activeData.length} {categories.find((c) => c.key === activeCategory)?.label.toLowerCase()}
            </button>
          </div>
        )}
      </div>

      <Popover
        isOpen={showPopover}
        onClose={() => setShowPopover(false)}
        title="Named Entity Analysis"
        className="bg-gradient-to-br from-orange-50 to-red-50"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => {
              const Icon = category.icon
              const categoryData = currentData[category.key]
              const categoryTotal = categoryData.reduce((sum, item) => sum + item.count, 0)

              return (
                <div key={category.key} className="p-3 bg-white rounded-xl border border-gray-100 text-center">
                  <Icon className={`w-5 h-5 mx-auto mb-2 ${category.color}`} />
                  <div className="text-lg font-bold text-gray-800">{categoryTotal}</div>
                  <div className="text-xs text-gray-600">{category.label}</div>
                </div>
              )
            })}
          </div>

          <div className="p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white">
            <h4 className="font-semibold mb-2">Entity Recognition Summary</h4>
            <p className="text-sm opacity-90">
              Identified {Object.values(currentData).flat().length} total entities across all categories with
              {Object.values(currentData)
                .flat()
                .reduce((sum, item) => sum + item.count, 0)}{" "}
              total mentions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3">
              All {categories.find((c) => c.key === activeCategory)?.label}
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto hide-scrollbar">
              {activeData.map((entity, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-orange-100 text-orange-700 rounded-full text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-800">{entity.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">{entity.count}</span>
                      <span className={`text-sm font-medium ${getSentimentColor(entity.sentiment).split(" ")[0]}`}>
                        {entity.sentiment > 0 ? "+" : ""}
                        {(entity.sentiment * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Popover>
    </>
  )
}

export default NamedEntityTwitterCard
