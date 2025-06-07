"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
  Brush,
  TooltipProps,
} from "recharts"
import {
  TrendingUp,
  Calendar,
  BarChart3,
  ChevronRight,
  Twitter,
  Users,
  ChevronDown,
  X,
  Check,
} from "lucide-react"
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent"

/* ------------------------------------------------------------------ */
/*                              Types                                 */
/* ------------------------------------------------------------------ */

/**
 * A single point on the chart.
 * - `date`, `tweetCount`, `topTopics` are always known keys.
 * - Any username becomes an *extra* property whose value is a number.
 */
export interface ChartPoint {
  date: string
  tweetCount?: number
  topTopics?: string[]
  // dynamic username keys
  [username: string]: string | number | string[] | undefined
}

/** Prop shape coming from the TwitterMonitoring parent */
interface TweetTimelineCardProps {
  data?: Array<{
    date: string
    tweetCount: number
    topTopics: string[]
  }>
  isLoading?: boolean
  /** Every distinct account found in the analysis */
  usernames?: string[]
  /**
   * Per-account data (same shape as `data` but keyed by username)
   * {
   *   "@elonmusk": { timelineData: [...] },
   *   "@nasa":     { timelineData: [...] },
   * }
   */
  usernameData?: Record<
    string,
    {
      timelineData?: Array<{
        date: string
        tweetCount: number
        topTopics: string[]
      }>
    }
  >
  onUsernameChange?: (username: string) => void
}

/* ------------------------------------------------------------------ */
/*                    Full-screen pop-over shell                      */
/* ------------------------------------------------------------------ */

const FullScreenPopover: React.FC<{
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full h-[80vh] max-w-[95vw] flex flex-col">
        <header className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*                        Main card component                         */
/* ------------------------------------------------------------------ */

const TweetTimelineCard: React.FC<TweetTimelineCardProps> = ({
  data,
  isLoading,
  usernames = [],
  usernameData = {},
}) => {
  /* ------------------------- local UI-state ------------------------ */
  const [chartType, setChartType] = useState<"line" | "area">("area")
  const [showPopover, setShowPopover] = useState(false)
  const [expandedChartType, setExpandedChartType] = useState<"line" | "area">("area")

  const [showUsernameDropdown, setShowUsernameDropdown] = useState(false)
  const [selectedUsernames, setSelectedUsernames] = useState<string[]>(["All Accounts"])

  const [popoverSelectedUsernames, setPopoverSelectedUsernames] = useState<string[]>(["All Accounts"])
  const [showPopoverUsernameDropdown, setShowPopoverUsernameDropdown] = useState(false)

  /* ---------------------------- helpers ---------------------------- */

  /** Tail-wind colour palette (cycled per username) */
  const colors = [
    "#0891b2", // cyan-600
    "#dc2626", // red-600
    "#16a34a", // green-600
    "#ca8a04", // yellow-600
    "#9333ea", // purple-600
    "#ea580c", // orange-600
    "#0d9488", // teal-600
    "#be185d", // pink-600
  ]

  /** Ensure “All Accounts” is selected by default if nothing else is */
  useEffect(() => {
    if (usernames.length && selectedUsernames.length === 0) {
      setSelectedUsernames(["All Accounts"])
    }
  }, [usernames, selectedUsernames])

  /* ------------------ username-selection (inline) ------------------ */

  const toggleUsername = (u: string, setFn: React.Dispatch<React.SetStateAction<string[]>>) => {
    setFn((prev) => {
      if (u === "All Accounts") return ["All Accounts"]
      const withoutAll = prev.filter((x) => x !== "All Accounts")
      return withoutAll.includes(u)
        ? withoutAll.filter((x) => x !== u) || ["All Accounts"]
        : [...withoutAll, u]
    })
  }

  /* ----------------------- data preparation ------------------------ */

  /**
   * Combine/merge per-user timeline data into a single array suitable
   * for Recharts.  Always returns **ChartPoint[]**.
   */
  const buildChartData = (selUsers: string[]): ChartPoint[] => {
    /* CASE 1 – “All Accounts” with >1 user ⇒ multi-series chart */
    const wantsAll = selUsers.includes("All Accounts") && usernames.length > 1
    /* CASE 2 – explicit multi-selection (no “All Accounts”) */
    const wantsMultiSpecific = selUsers.length > 1 && !selUsers.includes("All Accounts")

    if (wantsAll || wantsMultiSpecific) {
      /* Collect every unique date across chosen users + top-level data */
      const allDates = new Set<string>()
      data?.forEach((p) => allDates.add(p.date))
      ;(wantsAll ? usernames : selUsers).forEach((u) =>
        usernameData[u]?.timelineData?.forEach((p) => allDates.add(p.date)),
      )

      /* Build a ChartPoint per day */
      return [...allDates]
        .sort()
        .map((date) => {
          const point: ChartPoint = { date }
          ;(wantsAll ? usernames : selUsers).forEach((u) => {
            const hit = usernameData[u]?.timelineData?.find((p) => p.date === date)
            if (hit) point[u] = hit.tweetCount
          })
          return point
        })
    }

    /* CASE 3 – single user             */
    if (selUsers.length === 1 && !selUsers.includes("All Accounts")) {
      return usernameData[selUsers[0]]?.timelineData ?? []
    }

    /* CASE 4 – fallback to aggregate    */
    return data ?? []
  }

  /** Do we need multi-line/area rendering? */
  const isMultiSeries = (selUsers: string[]) =>
    (selUsers.includes("All Accounts") && usernames.length > 1) ||
    (selUsers.length > 1 && !selUsers.includes("All Accounts"))

  /* -------------------- chart-level pure helpers ------------------- */

  const totalTweets = (ds: ChartPoint[], selUsers: string[]) =>
    isMultiSeries(selUsers)
      ? ds.reduce(
          (sum, p) =>
            sum +
            usernames.reduce((inner, u) => inner + (typeof p[u] === "number" ? (p[u] as number) : 0), 0),
          0,
        )
      : ds.reduce((sum, p) => sum + (p.tweetCount ?? 0), 0)

  const peakTweets = (ds: ChartPoint[], selUsers: string[]) =>
    isMultiSeries(selUsers)
      ? Math.max(
          ...ds.map((p) => usernames.reduce((m, u) => Math.max(m, (p[u] as number) || 0), 0)),
        )
      : Math.max(...ds.map((p) => p.tweetCount ?? 0))

  /* ------------------------ tooltip markup ------------------------- */

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>): React.ReactElement | null => {
    if (!active || !payload?.length) return null
    const point = payload[0].payload as ChartPoint

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg">
        <p className="font-semibold text-gray-800 mb-2">
          {new Date(label as string).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>

        {/* value lines */}
        <div className="space-y-1">
          {payload.map((entry, idx) => (
            <p key={idx} className="text-sm" style={{ color: entry.color as string }}>
              <span className="font-medium">{(entry.value as number).toLocaleString()}</span> tweets
              {entry.dataKey !== "tweetCount" && (
                <span className="text-gray-600"> – {entry.dataKey}</span>
              )}
            </p>
          ))}

          {/* top topics */}
          {point.topTopics?.length && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-gray-500 text-xs mb-1">Top topics:</p>
              <div className="flex flex-wrap gap-1">
                {point.topTopics.map((t, i) => (
                  <span key={i} className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded-md">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ---------------------- data for each view ----------------------- */
  const currentData = buildChartData(selectedUsernames)
  const popoverData = buildChartData(popoverSelectedUsernames)

  /* --------------------------- loading ----------------------------- */
  if (isLoading)
    return (
      <div className="card bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200">
        <div className="h-6 bg-cyan-200 rounded w-1/2 mb-6" />
        <div className="h-48 bg-cyan-200 rounded mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-16 bg-cyan-200 rounded" />
          ))}
        </div>
      </div>
    )

  if (!currentData.length)
    return (
      <div className="card bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-cyan-500/10 rounded-xl">
            <TrendingUp className="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Tweet Timeline</h3>
            <p className="text-gray-600 text-sm">Activity over time</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-cyan-500" />
          </div>
          <p className="text-gray-500">No timeline data available</p>
        </div>
      </div>
    )

  /* --------------------------- renderer ---------------------------- */
  const renderChart = (
    ds: ChartPoint[],
    type: "line" | "area",
    expanded = false,
    selUsers = selectedUsernames,
  ) => {
    const activeUsers = selUsers.includes("All Accounts") ? usernames : selUsers
    const multi = isMultiSeries(selUsers)

    if (type === "area") {
      return (
        <AreaChart data={ds} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          {/* gradients */}
          <defs>
            {multi ? (
              activeUsers.map((u, i) => (
                <linearGradient key={u} id={`grad-${u}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0} />
                </linearGradient>
              ))
            ) : (
              <linearGradient id="grad-default" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
              </linearGradient>
            )}
          </defs>

          {expanded && <CartesianGrid strokeDasharray="3 3" opacity={0.1} />}
          <XAxis
            dataKey="date"
            axisLine={expanded}
            tickLine={expanded}
            tick={{ fill: "#6B7280", fontSize: expanded ? 12 : 10 }}
            tickFormatter={(d) =>
              new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            }
          />
          {expanded ? <YAxis /> : <YAxis hide />}
          <Tooltip content={<CustomTooltip />} />
          {expanded && multi && <Legend />}

          {multi
            ? activeUsers.map((u, i) => (
                <Area
                  key={u}
                  type="monotone"
                  name={u}
                  dataKey={u}
                  stroke={colors[i % colors.length]}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#grad-${u})`}
                />
              ))
            : (
              <Area
                type="monotone"
                name="Tweet Count"
                dataKey="tweetCount"
                stroke="#0891b2"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#grad-default)"
              />
            )}

          {expanded && <Brush dataKey="date" height={30} stroke="#0891b2" />}
        </AreaChart>
      )
    }

    /* line-chart branch */
    return (
      <LineChart data={ds} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        {expanded && <CartesianGrid strokeDasharray="3 3" opacity={0.1} />}
        <XAxis
          dataKey="date"
          axisLine={expanded}
          tickLine={expanded}
          tick={{ fill: "#6B7280", fontSize: expanded ? 12 : 10 }}
          tickFormatter={(d) =>
            new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          }
        />
        {expanded ? <YAxis /> : <YAxis hide />}
        <Tooltip content={<CustomTooltip />} />
        {expanded && multi && <Legend />}

        {multi
          ? activeUsers.map((u, i) => (
              <Line
                key={u}
                type="monotone"
                name={u}
                dataKey={u}
                stroke={colors[i % colors.length]}
                strokeWidth={3}
                dot={{ fill: colors[i % colors.length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors[i % colors.length], strokeWidth: 2, fill: "#fff" }}
              />
            ))
          : (
            <Line
              type="monotone"
              name="Tweet Count"
              dataKey="tweetCount"
              stroke="#0891b2"
              strokeWidth={3}
              dot={{ fill: "#0891b2", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#0891b2", strokeWidth: 2, fill: "#fff" }}
            />
          )}

        {expanded && <Brush dataKey="date" height={30} stroke="#0891b2" />}
      </LineChart>
    )
  }

  /* --------------------------- JSX tree --------------------------- */
  return (
    <>
      {/* ---------- collapsed card (click → pop-over) ---------- */}
      <div className="card bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
        {/* header & controls */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Tweet Timeline</h3>
              <p className="text-gray-600 text-sm">Activity over time</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <button
                onClick={() => setChartType("area")}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  chartType === "area"
                    ? "bg-cyan-500 text-white"
                    : "bg-white text-gray-600 hover:bg-cyan-50"
                }`}
              >
                Area
              </button>
              <button
                onClick={() => setChartType("line")}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  chartType === "line"
                    ? "bg-cyan-500 text-white"
                    : "bg-white text-gray-600 hover:bg-cyan-50"
                }`}
              >
                Line
              </button>
            </div>

            <button
              onClick={() => setShowPopover(true)}
              className="p-2 hover:bg-cyan-100 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>

        {/* ---------------- username dropdown (collapsed) -------------- */}
        {usernames.length > 1 && (
          <div className="mb-6 relative">
            <div
              className="flex items-center justify-between p-3 bg-white rounded-xl border border-cyan-100 cursor-pointer hover:shadow-md"
              onClick={() => setShowUsernameDropdown((v) => !v)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                  <Twitter className="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Timeline for</p>
                  <p className="font-medium text-black">
                    {selectedUsernames.includes("All Accounts")
                      ? "All Accounts"
                      : selectedUsernames.length === 1
                      ? selectedUsernames[0]
                      : `${selectedUsernames.length} accounts selected`}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  showUsernameDropdown ? "rotate-180" : ""
                }`}
              />
            </div>

            {showUsernameDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-cyan-100 shadow-lg z-10 max-h-60 overflow-y-auto">
                {/* “All Accounts” option */}
                  <div
                      className="p-3 hover:bg-cyan-50 cursor-pointer border-b border-gray-100 flex items-center justify-between"
                      onClick={() => {
                        toggleUsername("All Accounts", setSelectedUsernames)   // 1️⃣ update selection
                        setShowUsernameDropdown(false)            // 2️⃣ collapse menu
                      }}
                    >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-800">All Accounts</span>
                  </div>
                  {selectedUsernames.includes("All Accounts") && <Check className="w-4 h-4 text-cyan-600" />}
                </div>

                {/* each username */}
                {usernames.map((u) => (
                  <div
                      key={u}
                      className="p-3 hover:bg-cyan-50 cursor-pointer border-b border-gray-100 flex items-center justify-between"
                      onClick={() => {
                        toggleUsername(u, setSelectedUsernames)   // 1️⃣ update selection
                        setShowUsernameDropdown(false)            // 2️⃣ collapse menu
                      }}
                    >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                        <Twitter className="w-4 h-4 text-cyan-600" />
                      </div>
                      <span className="font-medium text-gray-800">{u}</span>
                    </div>
                    {selectedUsernames.includes(u) && <Check className="w-4 h-4 text-cyan-600" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ----------------------- chart (collapsed) -------------------- */}
        <div className="h-56 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart(currentData, chartType)}
          </ResponsiveContainer>
        </div>

        {/* stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-xl border border-cyan-100 text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-cyan-100 rounded-lg mx-auto mb-2">
              <BarChart3 className="w-5 h-5 text-cyan-600" />
            </div>
            <p className="text-2xl font-bold text-cyan-600 mb-1">
              {totalTweets(currentData, selectedUsernames).toLocaleString()}
            </p>
            <p className="text-xs font-medium text-gray-600">Total Tweets</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-cyan-100 text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-600 mb-1">
              {peakTweets(currentData, selectedUsernames).toLocaleString()}
            </p>
            <p className="text-xs font-medium text-gray-600">Peak Day</p>
          </div>
        </div>

        {/* period footer */}
        <footer className="mt-4 p-3 bg-cyan-50 rounded-lg border border-cyan-100 text-sm flex justify-between">
          <span className="text-gray-600">
            Monitoring period: <span className="font-medium">{currentData.length} days</span>
          </span>
          <span className="text-cyan-600 font-medium">
            {new Date(currentData[0].date).toLocaleDateString()} –{" "}
            {
              new Date(
                currentData[currentData.length - 1].date
              ).toLocaleDateString()
            }
          </span>
        </footer>
      </div>

      {/* --------------- POP-OVER (expanded analytics) ---------------- */}
      <FullScreenPopover
        isOpen={showPopover}
        onClose={() => setShowPopover(false)}
        title="Tweet Timeline Analysis"
      >
        {/* user selection inside pop-over */}
        {usernames.length > 1 && (
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-cyan-100">
            <div className="flex items-center space-x-3">
              <Twitter className="w-5 h-5 text-cyan-600" />
              <span className="font-medium text-gray-800">Compare timelines</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowPopoverUsernameDropdown((v) => !v)}
                className="flex items-center text-gray-600 space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                <span>
                  {popoverSelectedUsernames.includes("All Accounts")
                    ? "All Accounts"
                    : popoverSelectedUsernames.length === 1
                    ? popoverSelectedUsernames[0]
                    : `${popoverSelectedUsernames.length} accounts`}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showPopoverUsernameDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl border border-cyan-100 shadow-lg z-10 max-h-60 overflow-y-auto min-w-[200px]">
                  <div
                    className="p-3 hover:bg-cyan-50 cursor-pointer border-b border-gray-100 flex items-center justify-between"
                    onClick={() => toggleUsername("All Accounts", setPopoverSelectedUsernames)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-3 h-3 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-800">All Accounts</span>
                    </div>
                    {popoverSelectedUsernames.includes("All Accounts") && (
                      <Check className="w-4 h-4 text-cyan-600" />
                    )}
                  </div>

                  {usernames.map((u) => (
                    <div
                      key={u}
                      className="p-3 hover:bg-cyan-50 cursor-pointer border-b border-gray-100 flex items-center justify-between"
                      onClick={() => toggleUsername(u, setPopoverSelectedUsernames)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center">
                          <Twitter className="w-3 h-3 text-cyan-600" />
                        </div>
                        <span className="font-medium text-gray-800">{u}</span>
                      </div>
                      {popoverSelectedUsernames.includes(u) && <Check className="w-4 h-4 text-cyan-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* chart-type toggles */}
        <div className="flex justify-center space-x-3 mt-6">
          <button
            onClick={() => setExpandedChartType("area")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              expandedChartType === "area"
                ? "bg-cyan-500 text-white"
                : "bg-white text-gray-600 hover:bg-cyan-50"
            }`}
          >
            Area
          </button>
          <button
            onClick={() => setExpandedChartType("line")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              expandedChartType === "line"
                ? "bg-cyan-500 text-white"
                : "bg-white text-gray-600 hover:bg-cyan-50"
            }`}
          >
            Line
          </button>
        </div>

        {/* expanded chart */}
        <section className="bg-white p-6 rounded-xl border border-cyan-100 mt-6">
          <div className="h-[50vh]">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart(popoverData, expandedChartType, true, popoverSelectedUsernames)}
            </ResponsiveContainer>
          </div>
        </section>

        {/* summary stats */}
        <section className="grid grid-cols-4 gap-4 mt-6">
          {[
            {
              label: "Total Tweets",
              value: totalTweets(popoverData, popoverSelectedUsernames),
            },
            {
              label: "Daily Average",
              value: Math.round(
                totalTweets(popoverData, popoverSelectedUsernames) / popoverData.length,
              ),
            },
            { label: "Days Analysed", value: popoverData.length },
            {
              label: "Peak Day",
              value: peakTweets(popoverData, popoverSelectedUsernames),
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="p-4 bg-white rounded-xl border border-cyan-100 text-center"
            >
              <p className="text-2xl font-bold text-cyan-600 mb-1">{value.toLocaleString()}</p>
              <p className="text-sm text-gray-600">{label}</p>
            </div>
          ))}
        </section>
      </FullScreenPopover>
    </>
  )
}

export default TweetTimelineCard
