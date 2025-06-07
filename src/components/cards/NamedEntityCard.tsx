"use client"

import type React from "react"
import { useState } from "react"
import { Users, Building, MapPin, Calendar, ChevronRight } from "lucide-react"
import Popover from "../ui/Popover"

interface EntityData {
  people: string[]
  organizations: string[]
  locations: string[]
  dates: string[]
  misc: string[]
}

interface NamedEntityCardProps {
  data?: EntityData
  isLoading?: boolean
}

const NamedEntityCard: React.FC<NamedEntityCardProps> = ({ data, isLoading = false }) => {
  const [showPopover, setShowPopover] = useState(false)

  // Fallback data when no analysis is available
  const fallbackData: EntityData = {
    people: [],
    organizations: [],
    locations: [],
    dates: [],
    misc: [],
  }

  const displayData = data || fallbackData
  const isEmpty = !data

  const totalEntities = Object.values(displayData).reduce((sum, arr) => sum + arr.length, 0)

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "people":
        return <Users className="w-4 h-4 text-blue-600" />
      case "organizations":
        return <Building className="w-4 h-4 text-green-600" />
      case "locations":
        return <MapPin className="w-4 h-4 text-red-600" />
      case "dates":
        return <Calendar className="w-4 h-4 text-purple-600" />
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />
    }
  }

  const getEntityColor = (type: string) => {
    switch (type) {
      case "people":
        return "bg-blue-100 text-blue-800"
      case "organizations":
        return "bg-green-100 text-green-800"
      case "locations":
        return "bg-red-100 text-red-800"
      case "dates":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="card bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Named Entities
          </h3>
          <div className="animate-pulse">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-20 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="card bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Named Entities
          </h3>
          {!isEmpty && totalEntities > 0 && (
            <button
              onClick={() => setShowPopover(true)}
              className="p-1 hover:bg-rose-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{totalEntities}</div>
            <p className="text-sm text-gray-600">{isEmpty ? "No entities detected" : "entities identified"}</p>
          </div>

          {!isEmpty && totalEntities > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {displayData.people.length > 0 && (
                <div className="flex items-center gap-2">
                  {getEntityIcon("people")}
                  <span className="text-sm text-gray-700">{displayData.people.length} People</span>
                </div>
              )}
              {displayData.organizations.length > 0 && (
                <div className="flex items-center gap-2">
                  {getEntityIcon("organizations")}
                  <span className="text-sm text-gray-700">{displayData.organizations.length} Orgs</span>
                </div>
              )}
              {displayData.locations.length > 0 && (
                <div className="flex items-center gap-2">
                  {getEntityIcon("locations")}
                  <span className="text-sm text-gray-700">{displayData.locations.length} Places</span>
                </div>
              )}
              {displayData.dates.length > 0 && (
                <div className="flex items-center gap-2">
                  {getEntityIcon("dates")}
                  <span className="text-sm text-gray-700">{displayData.dates.length} Dates</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                {isEmpty ? "Analyze an article to see named entities" : "No entities detected"}
              </p>
            </div>
          )}
        </div>
      </div>

      <Popover
        isOpen={showPopover}
        onClose={() => setShowPopover(false)}
        title="Named Entity Recognition"
        className="bg-gradient-to-br from-rose-50 to-pink-50"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">{totalEntities}</div>
            <p className="text-gray-600">Total entities identified in the article</p>
          </div>

          <div className="space-y-4">
            {Object.entries(displayData).map(([type, entities]) => {
              if (entities.length === 0) return null
              return (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-3">
                    {getEntityIcon(type)}
                    <h5 className="font-semibold text-gray-900 capitalize">
                      {type} ({entities.length})
                    </h5>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entities.map((entity: string, index: number) => (
                      <span key={index} className={`px-3 py-1.5 rounded-full text-sm ${getEntityColor(type)}`}>
                        {entity}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Popover>
    </>
  )
}

export default NamedEntityCard
