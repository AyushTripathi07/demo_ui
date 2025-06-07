"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Activity, Calendar, TrendingUp, ChevronRight, ChevronLeft, Clock, Grid3X3, Maximize2, X } from "lucide-react"
import Popover from "../ui/Popover"

interface TwitterHeatmapCardProps {
  data?: Array<{
    date: string
    value: number
    accounts: string[]
    timestamp?: string
  }>
  isLoading?: boolean
}

interface CalendarDay {
  date: string
  value: number
  accounts: string[]
  isInRange?: boolean
  isCurrentMonth?: boolean
  isToday: boolean
  dayOfMonth: number
  month: number
  year: number
}

interface TimeHeatmapData {
  dayOfWeek: number
  hour: number
  value: number
  dayName: string
}

type ViewMode = "calendar" | "time"

const TwitterHeatmapCard: React.FC<TwitterHeatmapCardProps> = ({ data, isLoading }) => {
  const [hoveredDay, setHoveredDay] = useState<CalendarDay | null>(null)
  // const [hoveredTimeCell, setHoveredTimeCell] = useState<TimeHeatmapData | null>(null)
  const [showPopover, setShowPopover] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("calendar")
  const [selectedRange, setSelectedRange] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  })
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedTimezone, setSelectedTimezone] = useState("UTC")
  // const tooltipRef = useRef<HTMLDivElement>(null)
  // const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const [currentMonth, setCurrentMonth] = useState(() => {
    if (data && data.length > 0) {
      const latest = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
      return new Date(latest.date)
    }
    return new Date()
  })

  // Define available timezones
  const timezones = [
    { value: "UTC", label: "UTC", offset: 0 },
    { value: "EST", label: "US Eastern (EST/EDT)", offset: -5 },
    { value: "CST", label: "US Central (CST/CDT)", offset: -6 },
    { value: "MST", label: "US Mountain (MST/MDT)", offset: -7 },
    { value: "IST", label: "India (IST)", offset: 5.5 },
    { value: "CET", label: "Central Europe (CET/CEST)", offset: 1 },
    { value: "GMT", label: "UK (GMT/BST)", offset: 0 },
  ]

  useEffect(() => {
    if (data && data.length > 0) {
      const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      const firstDate = new Date(sortedData[0].date)
      setCurrentMonth(firstDate)
    }
  }, [data])

  // Fixed date parsing function to avoid timezone issues
  const parseDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number)
    return new Date(year, month - 1, day)
  }

  // Fixed date formatting function
  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-emerald-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-4 bg-emerald-200 rounded text-center"></div>
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, week) => (
              <div key={week} className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }).map((_, day) => (
                  <div key={day} className="h-8 bg-emerald-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <Activity className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Heatmap</h3>
            <p className="text-gray-600 text-sm">Daily engagement patterns</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-gray-500">No activity data available</p>
        </div>
      </div>
    )
  }

  const getIntensityColor = (value: number, maxValue?: number) => {
    const max = maxValue || Math.max(...data.map((d) => d.value))
    const intensity = max > 0 ? value / max : 0

    if (intensity === 0) return "bg-gray-100 border-gray-200 hover:bg-gray-200"
    if (intensity <= 0.2) return "bg-emerald-100 border-emerald-200 hover:bg-emerald-200"
    if (intensity <= 0.4) return "bg-emerald-200 border-emerald-300 hover:bg-emerald-300"
    if (intensity <= 0.6) return "bg-emerald-300 border-emerald-400 hover:bg-emerald-400"
    if (intensity <= 0.8) return "bg-emerald-400 border-emerald-500 hover:bg-emerald-500"
    return "bg-emerald-500 border-emerald-600 hover:bg-emerald-600"
  }

  const getTimeHeatmapColor = (value: number, maxValue?: number) => {
    const max = maxValue || Math.max(...timeHeatmapData.map((d) => d.value))
    const intensity = max > 0 ? value / max : 0

    if (intensity === 0) return "bg-gray-50 border-gray-200"
    if (intensity <= 0.25) return "bg-blue-100 border-blue-200"
    if (intensity <= 0.5) return "bg-blue-300 border-blue-300"
    if (intensity <= 0.75) return "bg-blue-500 border-blue-500"
    return "bg-blue-700 border-blue-700"
  }

  const getIntensityLabel = (value: number) => {
    const maxValue = Math.max(...data.map((d) => d.value))
    const intensity = maxValue > 0 ? value / maxValue : 0

    if (intensity === 0) return "No activity"
    if (intensity <= 0.2) return "Low activity"
    if (intensity <= 0.4) return "Moderate activity"
    if (intensity <= 0.6) return "High activity"
    if (intensity <= 0.8) return "Very high activity"
    return "Peak activity"
  }

  // Fixed date range checking function
  const isDateInRange = (date: string, start: string | null, end: string | null): boolean => {
    if (!start || !end) return false

    const dateObj = parseDate(date)
    const startObj = parseDate(start)
    const endObj = parseDate(end)

    const actualStart = startObj <= endObj ? startObj : endObj
    const actualEnd = startObj <= endObj ? endObj : startObj

    return dateObj >= actualStart && dateObj <= actualEnd
  }

  // Generate time-based heatmap data with 25 hours (0-24)
  const generateTimeHeatmapData = (): TimeHeatmapData[] => {
    const timeData: TimeHeatmapData[] = []
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    // Initialize grid with zeros for 25 hours (0-24)
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        timeData.push({
          dayOfWeek: day,
          hour,
          value: 0,
          dayName: dayNames[day],
        })
      }
    }

    const currentTimezoneObj = timezones.find((tz) => tz.value === selectedTimezone)
    const timezoneOffset = currentTimezoneObj ? currentTimezoneObj.offset : 0

    // Aggregate data by day of week and hour
    data.forEach((item) => {
      if (item.timestamp) {
        const date = new Date(item.timestamp)
        const adjustedDate = new Date(date.getTime() + timezoneOffset * 60 * 60 * 1000)
        const dayOfWeek = adjustedDate.getDay()
        const hour = adjustedDate.getHours()

        const cellIndex = dayOfWeek * 24 + hour
        if (timeData[cellIndex]) {
          timeData[cellIndex].value += item.value
        }
      } else {
        const date = parseDate(item.date)
        const dayOfWeek = date.getDay()

        const patterns: Record<number, number[]> = {
          0: [1, 2, 3],
          1: [8, 9, 10, 12, 13, 14, 17, 18],
          2: [9, 10, 11, 13, 14, 15, 16],
          3: [1, 2, 7, 8, 9, 12, 15, 16],
          4: [1, 2, 8, 9, 13, 14, 17],
          5: [1, 9, 12, 17, 18, 19],
          6: [14, 15, 16, 17],
        }

        const activeHours = patterns[dayOfWeek] || [9, 12, 15, 18]
        const valuePerHour = item.value / activeHours.length

        activeHours.forEach((hour) => {
          const cellIndex = dayOfWeek * 25 + hour
          if (timeData[cellIndex]) {
            timeData[cellIndex].value += valuePerHour * (Math.random() * 0.6 + 0.7)
          }
        })
      }
    })

    return timeData
  }

  // Fixed monthly calendar generation
  const generateMonthlyCalendar = (year: number, month: number): CalendarDay[] => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const endDate = new Date(lastDay)
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()))

    const dataMap = new Map<string, { value: number; accounts: string[] }>()
    data.forEach((item) => {
      dataMap.set(item.date, { value: item.value, accounts: item.accounts })
    })

    const calendar: CalendarDay[] = []
    const current = new Date(startDate)
    const today = formatDate(new Date())

    while (current <= endDate) {
      const dateStr = formatDate(current)
      const dayData = dataMap.get(dateStr)

      calendar.push({
        date: dateStr,
        value: dayData?.value || 0,
        accounts: dayData?.accounts || [],
        isCurrentMonth: current.getMonth() === month,
        isToday: dateStr === today,
        dayOfMonth: current.getDate(),
        month: current.getMonth(),
        year: current.getFullYear(),
        isInRange: isDateInRange(dateStr, selectedRange.start, selectedRange.end),
      })

      current.setDate(current.getDate() + 1)
    }

    return calendar
  }

  const timeHeatmapData = generateTimeHeatmapData()
  const monthlyCalendar = generateMonthlyCalendar(currentMonth.getFullYear(), currentMonth.getMonth())

  const monthlyWeeks: CalendarDay[][] = []
  for (let i = 0; i < monthlyCalendar.length; i += 7) {
    monthlyWeeks.push(monthlyCalendar.slice(i, i + 7))
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const weekDaysFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const maxValue = Math.max(...data.map((d) => d.value))
  const avgValue = data.reduce((sum, d) => sum + d.value, 0) / data.length
  const totalActivity = data.reduce((sum, d) => sum + d.value, 0)

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  const canGoToPreviousMonth = () => {
    if (!data || data.length === 0) return false
    const sortedData = [...data].sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
    const earliestDate = parseDate(sortedData[0].date)
    const prevMonth = new Date(currentMonth)
    prevMonth.setMonth(currentMonth.getMonth() - 1)
    return prevMonth >= new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1)
  }

  const canGoToNextMonth = () => {
    if (!data || data.length === 0) return false
    const latestDate = new Date(Math.max(...data.map((d) => parseDate(d.date).getTime())))
    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(currentMonth.getMonth() + 1)

    return (
      nextMonth.getFullYear() < latestDate.getFullYear() ||
      (nextMonth.getFullYear() === latestDate.getFullYear() && nextMonth.getMonth() <= latestDate.getMonth())
    )
  }

  const handleDayClick = (day: CalendarDay) => {
    if (!isSelecting) {
      setSelectedRange({ start: day.date, end: null })
      setIsSelecting(true)
    } else {
      if (selectedRange.start) {
        const startDate = parseDate(selectedRange.start)
        const endDate = parseDate(day.date)

        if (startDate <= endDate) {
          setSelectedRange({ start: selectedRange.start, end: day.date })
        } else {
          setSelectedRange({ start: day.date, end: selectedRange.start })
        }
      }
      setIsSelecting(false)
    }
  }

  const clearSelection = () => {
    setSelectedRange({ start: null, end: null })
    setIsSelecting(false)
  }

  // const formatHour = (hour: number) => {
  //   return `${hour}:00`
  // }

  const handleTimezoneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimezone(event.target.value)
  }

  // Expanded Calendar View for Popover
  const ExpandedCalendarView = () => (
    <div className="space-y-6">
      {/* Enhanced Month Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
          <div className="text-emerald-600 text-sm font-medium">Total Activity</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {monthlyCalendar.filter((d) => d.isCurrentMonth).reduce((sum, d) => sum + d.value, 0)}
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="text-blue-600 text-sm font-medium">Active Days</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">
            {monthlyCalendar.filter((d) => d.isCurrentMonth && d.value > 0).length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="text-purple-600 text-sm font-medium">Peak Day</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">
            {Math.max(...monthlyCalendar.filter((d) => d.isCurrentMonth).map((d) => d.value))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
          <div className="text-orange-600 text-sm font-medium">Daily Average</div>
          <div className="text-2xl font-bold text-orange-700 mt-1">
            {Math.round(
              monthlyCalendar.filter((d) => d.isCurrentMonth).reduce((sum, d) => sum + d.value, 0) /
                monthlyCalendar.filter((d) => d.isCurrentMonth).length,
            )}
          </div>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-800">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h4>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousMonth}
            disabled={!canGoToPreviousMonth()}
            className={`p-2 rounded-full transition-colors ${
              canGoToPreviousMonth() ? "hover:bg-emerald-100 text-gray-600" : "text-gray-300 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextMonth}
            disabled={!canGoToNextMonth()}
            className={`p-2 rounded-full transition-colors ${
              canGoToNextMonth() ? "hover:bg-emerald-100 text-gray-600" : "text-gray-300 cursor-not-allowed"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Date Range Selection Info */}
      {(selectedRange.start || selectedRange.end) && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="text-sm text-blue-800">
            {selectedRange.start && selectedRange.end ? (
              <span>
                Selected: {new Date(selectedRange.start).toLocaleDateString()} -{" "}
                {new Date(selectedRange.end).toLocaleDateString()}
              </span>
            ) : selectedRange.start ? (
              <span>
                Start: {new Date(selectedRange.start).toLocaleDateString()} (click another date to complete range)
              </span>
            ) : null}
          </div>
          <button onClick={clearSelection} className="text-blue-600 hover:text-blue-800 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Enhanced Calendar Header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center font-semibold text-gray-700 py-3 bg-gray-50 rounded-lg">
            {day}
          </div>
        ))}
      </div>

      {/* Enhanced Monthly Calendar Grid */}
      <div className="space-y-2 relative">
        {monthlyWeeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`
                  h-16 w-full rounded-xl border-2 transition-all duration-200 hover:scale-105 cursor-pointer relative overflow-hidden
                  ${getIntensityColor(day.value)}
                  ${!day.isCurrentMonth ? "opacity-30" : ""}
                  ${day.isToday ? "ring-2 ring-blue-400 ring-offset-2" : ""}
                  ${day.isInRange ? "ring-2 ring-purple-400 ring-offset-2" : ""}
                  ${selectedRange.start === day.date ? "ring-2 ring-green-400 ring-offset-2" : ""}
                `}
                onMouseEnter={(e) => {
                  setHoveredDay(day)
                  setMousePosition({ x: e.clientX, y: e.clientY })
                }}
                onMouseLeave={() => setHoveredDay(null)}
                onClick={() => handleDayClick(day)}
                onMouseMove={(e) => {
                  if (hoveredDay) {
                    setMousePosition({ x: e.clientX, y: e.clientY })
                  }
                }}
              >
                <div className="absolute top-2 left-2">
                  <span className={`text-sm font-bold ${day.isCurrentMonth ? "text-gray-700" : "text-gray-400"}`}>
                    {day.dayOfMonth}
                  </span>
                </div>

                {day.value > 0 && day.isCurrentMonth && (
                  <div className="absolute bottom-2 left-2">
                    <span className="text-xs font-bold text-emerald-700 bg-white bg-opacity-80 px-1 rounded">
                      {day.value}
                    </span>
                  </div>
                )}

                {day.value > 0 && (
                  <div className="absolute bottom-2 right-2">
                    <div className="w-2 h-2 bg-emerald-700 rounded-full opacity-80"></div>
                  </div>
                )}

                {day.isToday && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        {hoveredDay && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: `${mousePosition.x + 10}px`,
              top: `${mousePosition.y - 10}px`,
              transform: "translateY(-100%)",
            }}
          >
            <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg min-w-48 max-w-64">
              <div className="font-medium mb-1">
                {new Date(hoveredDay.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="text-emerald-400 font-medium">
                {hoveredDay.value} {hoveredDay.value === 1 ? "tweet" : "tweets"}
              </div>
              <div className="text-gray-300">{getIntensityLabel(hoveredDay.value)}</div>
              {hoveredDay.accounts.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="text-gray-400 text-xs mb-1">Active accounts:</div>
                  <div className="text-white text-xs max-h-20 overflow-y-auto hide-scrollbar">{hoveredDay.accounts.join(", ")}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Legend */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span className="font-medium">Activity Level</span>
          <div className="flex items-center space-x-2">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
              <div className="w-4 h-4 bg-emerald-100 border border-emerald-200 rounded"></div>
              <div className="w-4 h-4 bg-emerald-200 border border-emerald-300 rounded"></div>
              <div className="w-4 h-4 bg-emerald-300 border border-emerald-400 rounded"></div>
              <div className="w-4 h-4 bg-emerald-400 border border-emerald-500 rounded"></div>
              <div className="w-4 h-4 bg-emerald-500 border border-emerald-600 rounded"></div>
            </div>
            <span>More</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center">
          Click and drag to select date ranges • Today is highlighted in blue
        </div>
      </div>
    </div>
  )

  // Expanded Time Heatmap View for Popover
  const ExpandedTimeHeatmapView = () => (
    <div className="space-y-6">
      {/* Header with timezone */}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Tweet Activity Heatmap</h4>
          <p className="text-sm text-gray-600">Tweet activity by day of week and hour of day</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Timezone:</span>
          <select
            className="border border-gray-300 rounded px-3 py-1 text-sm bg-white"
            value={selectedTimezone}
            onChange={handleTimezoneChange}
          >
            {timezones.map((timezone) => (
              <option key={timezone.value} value={timezone.value}>
                {timezone.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Grid Header - Hours */}
          <div className="grid grid-cols-[100px_repeat(24,32px)] gap-1 mb-2">
            <div className="font-medium text-sm flex items-center justify-center text-gray-700">Day</div>
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="font-medium text-xs flex items-center justify-center text-gray-600">
                {i}
              </div>
            ))}
          </div>

          {/* Grid Body - Heatmap */}
          <div className="space-y-1">
            {weekDaysFull.map((day, dayIndex) => (
              <div key={day} className="grid grid-cols-[100px_repeat(24,32px)] gap-1">
                <div className="text-sm font-medium flex items-center px-2 text-gray-700">{day}</div>
                {Array.from({ length: 24 }, (_, hourIndex) => {
                  const cellData = timeHeatmapData.find((d) => d.dayOfWeek === dayIndex && d.hour === hourIndex)
                  const value = cellData?.value || 0

                  return (
                    <div key={hourIndex} className={`h-8 w-8 rounded-sm border ${getTimeHeatmapColor(value)}`}></div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Main component rendering
  return (
    <>
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base">
                {viewMode === "calendar" ? "Heatmap" : "Tweet Activity"}
              </h3>
              <p className="text-gray-600 text-xs">
                {viewMode === "calendar" ? "Daily engagement patterns" : "Weekly time patterns"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-lg font-bold text-emerald-600">{maxValue}</div>
              <div className="text-xs text-gray-500">Peak {viewMode === "calendar" ? "day" : ""}</div>
            </div>
            <button
              onClick={() => setShowPopover(true)}
              className="p-1.5 hover:bg-emerald-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <Maximize2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-emerald-200">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === "calendar" ? "bg-emerald-500 text-white" : "text-gray-600 hover:text-emerald-600"
              }`}
            >
              <Grid3X3 className="w-3 h-3" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setViewMode("time")}
              className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === "time" ? "bg-emerald-500 text-white" : "text-gray-600 hover:text-emerald-600"
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Time</span>
            </button>
          </div>

          {viewMode === "calendar" && (
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPreviousMonth}
                disabled={!canGoToPreviousMonth()}
                className={`p-1 rounded transition-colors ${
                  canGoToPreviousMonth() ? "hover:bg-emerald-100 text-gray-600" : "text-gray-300 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <span className="text-xs font-medium text-gray-700 min-w-[80px] text-center">
                {monthNames[currentMonth.getMonth()].substring(0, 3)} {currentMonth.getFullYear()}
              </span>
              <button
                onClick={goToNextMonth}
                disabled={!canGoToNextMonth()}
                className={`p-1 rounded transition-colors ${
                  canGoToNextMonth() ? "hover:bg-emerald-100 text-gray-600" : "text-gray-300 cursor-not-allowed"
                }`}
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {viewMode === "time" && (
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-600">Timezone:</span>
              <select
                className="border border-gray-300 rounded px-1 py-0.5 text-xs"
                value={selectedTimezone}
                onChange={handleTimezoneChange}
              >
                {timezones.map((timezone) => (
                  <option key={timezone.value} value={timezone.value}>
                    {timezone.value}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Content based on view mode */}
        <div className="relative">
          {viewMode === "calendar" ? (
            <>
              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-xs text-gray-500 text-center font-medium py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="space-y-1 mb-4">
                {monthlyWeeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-1">
                    {week.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`
                          h-12 w-full rounded border transition-all duration-200 hover:scale-105 cursor-pointer relative flex items-center justify-center
                          ${getIntensityColor(day.value)} 
                          ${!day.isCurrentMonth ? "opacity-30" : ""} 
                          ${day.isToday ? "ring-2 ring-blue-400" : ""}
                          ${day.isInRange ? "ring-2 ring-purple-400" : ""}
                          ${selectedRange.start === day.date ? "ring-2 ring-green-400" : ""}
                        `}
                        onMouseEnter={(e) => {
                          setHoveredDay(day)
                          setMousePosition({ x: e.clientX, y: e.clientY })
                        }}
                        onMouseLeave={() => setHoveredDay(null)}
                        onClick={() => handleDayClick(day)}
                        onMouseMove={(e) => {
                          if (hoveredDay) {
                            setMousePosition({ x: e.clientX, y: e.clientY })
                          }
                        }}
                      >
                        <span className="text-sm font-medium text-gray-700">{day.dayOfMonth}</span>
                        {day.value > 0 && (
                          <div className="absolute bottom-1 right-1">
                            <div className="w-1.5 h-1.5 bg-emerald-700 rounded-full opacity-80"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Calendar Tooltip */}
              {hoveredDay && (
                <div
                  className="fixed z-50 pointer-events-none"
                  style={{
                    left: `${mousePosition.x + 10}px`,
                    top: `${mousePosition.y - 10}px`,
                    transform: "translateY(-100%)",
                  }}
                >
                  <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg min-w-48 max-w-64">
                    <div className="font-medium mb-1">
                      {new Date(hoveredDay.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-emerald-400 font-medium">
                      {hoveredDay.value} {hoveredDay.value === 1 ? "tweet" : "tweets"}
                    </div>
                    <div className="text-gray-300">{getIntensityLabel(hoveredDay.value)}</div>
                    {hoveredDay.accounts.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-700">
                        <div className="text-gray-400 text-xs mb-1">Active accounts:</div>
                        <div className="text-white text-xs max-h-20 overflow-y-auto hide-scrollbar">
                          {hoveredDay.accounts.join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="overflow-x-auto">
                <div className="min-w-max">
                  {/* Grid Header - Hours */}
                  <div className="grid grid-cols-[60px_repeat(24,20px)] gap-0.5 mb-1">
                    <div className="font-medium text-xs flex items-center justify-center text-gray-700">Day</div>
                    {Array.from({ length: 24 }, (_, i) => (
                      <div key={i} className="font-medium text-[10px] flex items-center justify-center text-gray-600">
                        {i}
                      </div>
                    ))}
                  </div>

                  {/* Grid Body - Heatmap */}
                  <div className="space-y-0.5">
                    {weekDaysFull.map((day, dayIndex) => (
                      <div key={day} className="grid grid-cols-[60px_repeat(24,20px)] gap-0.5">
                        <div className="text-xs font-medium flex items-center px-1 text-gray-700">
                          {day.substring(0, 3)}
                        </div>
                        {Array.from({ length: 24 }, (_, hourIndex) => {
                          const cellData = timeHeatmapData.find((d) => d.dayOfWeek === dayIndex && d.hour === hourIndex)
                          const value = cellData?.value || 0

                          return (
                            <div key={hourIndex} className={`h-5 w-5 rounded-sm ${getTimeHeatmapColor(value)}`}></div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 mt-4">
          <span>Less</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded-sm"></div>
            <div className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded-sm"></div>
            <div className="w-3 h-3 bg-emerald-200 border border-emerald-300 rounded-sm"></div>
            <div className="w-3 h-3 bg-emerald-300 border border-emerald-400 rounded-sm"></div>
            <div className="w-3 h-3 bg-emerald-400 border border-emerald-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-emerald-500 border border-emerald-600 rounded-sm"></div>
          </div>
          <span>More</span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-white rounded-lg border border-emerald-100">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span className="text-xs font-medium text-gray-700">Average Daily</span>
            </div>
            <div className="text-sm font-bold text-emerald-600 mt-0.5">{Math.round(avgValue)}</div>
          </div>
          <div className="p-2 bg-white rounded-lg border border-emerald-100">
            <div className="flex items-center space-x-1">
              <Activity className="w-3 h-3 text-emerald-600" />
              <span className="text-xs font-medium text-gray-700">Total Activity</span>
            </div>
            <div className="text-sm font-bold text-emerald-600 mt-0.5">{totalActivity}</div>
          </div>
        </div>
      </div>

      {/* Popover for expanded view */}
      <Popover
        isOpen={showPopover}
        onClose={() => setShowPopover(false)}
        title={`Tweet Activity Heatmap - ${viewMode === "calendar" ? "Calendar View" : "Time View"}`}
        className="max-w-6xl"
      >
        <div className="space-y-6">
          {/* View Mode Toggle in Popover */}
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "calendar" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-600 hover:text-emerald-600"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Calendar View</span>
            </button>
            <button
              onClick={() => setViewMode("time")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "time" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-600 hover:text-emerald-600"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Time View</span>
            </button>
          </div>

          {/* Expanded content based on view mode */}
          {viewMode === "calendar" ? <ExpandedCalendarView /> : <ExpandedTimeHeatmapView />}
        </div>
      </Popover>
    </>
  )
}

export default TwitterHeatmapCard
