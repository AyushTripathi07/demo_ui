"use client"

import type React from "react"
import { User, Calendar, Award } from 'lucide-react'

interface AuthorData {
  name: string
  credentials?: string
  organization?: string
  publicationDate: string
  lastUpdated?: string
  profileUrl?: string
  otherArticles?: number
}

interface AuthorInfoCardProps {
  data?: AuthorData
  isLoading?: boolean
}

const AuthorInfoCard: React.FC<AuthorInfoCardProps> = ({ data, isLoading = false }) => {
  // Fallback data when no analysis is available
  const fallbackData: AuthorData = {
    name: "Unknown Author",
    publicationDate: "No date available"
  }

  const displayData = data || fallbackData
  const isEmpty = !data

  if (isLoading) {
    return (
      <div className="card bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 flex items-center gap-2">
            <User className="w-5 h-5" />
            Author Information
          </h3>
        </div>

        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700 flex items-center gap-2">
          <User className="w-5 h-5" />
          Author Information
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h4 className={`font-semibold text-lg ${isEmpty ? "text-gray-500" : "text-gray-900"}`}>
              {displayData.name}
            </h4>
            {!isEmpty && displayData.credentials && (
              <p className="text-sm text-gray-600">{displayData.credentials}</p>
            )}
            {!isEmpty && displayData.organization && (
              <p className="text-sm text-amber-700">{displayData.organization}</p>
            )}
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-amber-700" />
            <span>Published: </span>
            <span className={isEmpty ? "text-gray-500" : "font-medium"}>
              {displayData.publicationDate}
            </span>
          </div>
          
          {!isEmpty && displayData.lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-amber-700" />
              <span>Last updated: </span>
              <span className="font-medium">{displayData.lastUpdated}</span>
            </div>
          )}

          {!isEmpty && displayData.otherArticles && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Award className="w-4 h-4 text-amber-700" />
              <span>{displayData.otherArticles} other articles by this author</span>
            </div>
          )}
        </div>

        {/* {!isEmpty && displayData.profileUrl && (
          <a 
            href={displayData.profileUrl}
            target="_blank"
            rel="noopener noreferrer" 
            className="mt-2 inline-flex items-center gap-1 text-sm text-amber-700 hover:text-amber-800 transition-colors"
          >
            View author profile
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )} */}

        {isEmpty && (
          <div className="text-center py-4 mt-2">
            <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">
              Analyze an article to see author information
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthorInfoCard
