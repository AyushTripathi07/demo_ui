"use client"

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'

interface DateRange {
  start: string
  end: string
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (dateRange: DateRange) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  value, 
  onChange, 
  disabled = false,
  placeholder = "Select date range",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectingStart, setSelectingStart] = useState(true)
  const [tempRange, setTempRange] = useState<DateRange>(value)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setTempRange(value) // Reset temp range on outside click
        setSelectingStart(true)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [value])

  useEffect(() => {
    setTempRange(value)
  }, [value])

  useEffect(() => {
    if (isOpen && dropdownRef.current && triggerRef.current) {
      // Scroll the calendar into view when opened
      const rect = triggerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const dropdownHeight = 400 // Approximate height of the dropdown
      
      // Check if there's enough space below
      if (rect.bottom + dropdownHeight > viewportHeight) {
        // Scroll to make the calendar visible
        const scrollAmount = rect.bottom + dropdownHeight - viewportHeight + 20
        window.scrollBy({
          top: scrollAmount,
          behavior: 'smooth'
        })
      }
    }
  }, [isOpen])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString + 'T00:00:00') // Ensure local timezone
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const parseDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const isDateInRange = (date: Date) => {
    if (!tempRange.start || !tempRange.end) {
      // If we're selecting and have a start date, show preview range
      if (tempRange.start && hoveredDate && !selectingStart) {
        const startDate = parseDate(tempRange.start)
        const hoverDate = parseDate(hoveredDate)
        const currentDate = date
        
        const minDate = startDate < hoverDate ? startDate : hoverDate
        const maxDate = startDate > hoverDate ? startDate : hoverDate
        
        return currentDate >= minDate && currentDate <= maxDate
      }
      return false
    }
    
    const startDate = parseDate(tempRange.start)
    const endDate = parseDate(tempRange.end)
    return date >= startDate && date <= endDate
  }

  const isDateSelected = (date: Date) => {
    const dateStr = formatDateForInput(date)
    return dateStr === tempRange.start || dateStr === tempRange.end
  }

  const isDateToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date > today // Disable future dates
  }

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return
    
    const dateStr = formatDateForInput(date)
    
    if (selectingStart || !tempRange.start) {
      setTempRange({ start: dateStr, end: '' })
      setSelectingStart(false)
    } else {
      if (dateStr < tempRange.start) {
        setTempRange({ start: dateStr, end: tempRange.start })
      } else {
        setTempRange({ ...tempRange, end: dateStr })
      }
      setSelectingStart(true)
    }
  }

  const handleDateHover = (date: Date) => {
    if (!isDateDisabled(date)) {
      setHoveredDate(formatDateForInput(date))
    }
  }

  const handleApply = () => {
    if (tempRange.start && tempRange.end) {
      onChange(tempRange)
      setIsOpen(false)
      setSelectingStart(true)
    }
  }

  const handleCancel = () => {
    setTempRange(value)
    setSelectingStart(true)
    setIsOpen(false)
  }

  const handleClear = () => {
    const clearedRange = { start: '', end: '' }
    setTempRange(clearedRange)
    onChange(clearedRange)
    setSelectingStart(true)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const setQuickRange = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - days + 1) // Include today
    
    setTempRange({
      start: formatDateForInput(start),
      end: formatDateForInput(end)
    })
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">Date Range</label>
        
        <button
          ref={triggerRef}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800/70"
        >
          <div className="flex items-center space-x-3">
            <CalendarDays className="w-5 h-5 text-gray-400" />
            <div className="text-left">
              {value.start && value.end ? (
                <span className="text-sm">
                  {formatDate(value.start)} - {formatDate(value.end)}
                </span>
              ) : (
                <span className="text-gray-500 text-sm">{placeholder}</span>
              )}
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 p-6 min-w-[320px]">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            
            <h3 className="text-white font-semibold text-lg">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Selection Status */}
          <div className="mb-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
            <div className="text-xs text-gray-400 mb-2 font-medium">
              {selectingStart ? 'Select start date' : 'Select end date'}
            </div>
            <div className="text-sm text-white">
              {tempRange.start && (
                <span>
                  <span className="text-blue-400">Start:</span> {formatDate(tempRange.start)}
                  {tempRange.end && (
                    <span className="ml-4">
                      <span className="text-green-400">End:</span> {formatDate(tempRange.end)}
                    </span>
                  )}
                </span>
              )}
              {!tempRange.start && <span className="text-gray-500">No dates selected</span>}
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs text-gray-400 py-2 font-semibold">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {getDaysInMonth(currentMonth).map((date, index) => (
              <div key={index} className="aspect-square">
                {date ? (
                  <button
                    onClick={() => handleDateClick(date)}
                    onMouseEnter={() => handleDateHover(date)}
                    onMouseLeave={() => setHoveredDate(null)}
                    disabled={isDateDisabled(date)}
                    className={`w-full h-full text-sm rounded-lg transition-all duration-200 flex items-center justify-center font-medium relative ${
                      isDateSelected(date)
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : isDateInRange(date)
                        ? 'bg-blue-500/20 text-blue-300'
                        : isDateToday(date)
                        ? 'bg-gray-600 text-white ring-2 ring-blue-400/50'
                        : isDateDisabled(date)
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    {date.getDate()}
                    {isDateToday(date) && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
                    )}
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Select Options */}
          <div className="mb-6">
            <div className="text-xs text-gray-400 mb-3 font-medium">Quick select:</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Last 7 days', days: 7 },
                { label: 'Last 30 days', days: 30 },
                { label: 'Last 90 days', days: 90 },
              ].map(option => (
                <button
                  key={option.label}
                  onClick={() => setQuickRange(option.days)}
                  className="px-3 py-2 text-xs bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 hover:text-white transition-colors font-medium"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm text-gray-400 bg-gray-700/30 rounded-lg hover:bg-gray-600/50 hover:text-gray-300 transition-colors font-medium"
            >
              Clear
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 text-sm text-gray-300 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!tempRange.start || !tempRange.end}
              className="flex-1 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangePicker
