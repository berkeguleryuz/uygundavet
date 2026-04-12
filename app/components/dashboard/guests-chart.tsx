"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Calendar, ChevronDown, Settings } from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import { useTheme } from "next-themes";
import { useDashboardStore } from "@/store/dashboard-store";

const demoChartDataWeek = [
  { date: "dayMon", confirmed: 5, declined: 1, pending: 3 },
  { date: "dayTue", confirmed: 8, declined: 0, pending: 4 },
  { date: "dayWed", confirmed: 3, declined: 2, pending: 6 },
  { date: "dayThu", confirmed: 7, declined: 1, pending: 2 },
  { date: "dayFri", confirmed: 12, declined: 0, pending: 5 },
  { date: "daySat", confirmed: 9, declined: 3, pending: 1 },
  { date: "daySun", confirmed: 4, declined: 1, pending: 7 },
];

const demoChartDataMonth = [
  { date: "monthJan", confirmed: 12, declined: 3, pending: 40 },
  { date: "monthFeb", confirmed: 28, declined: 5, pending: 52 },
  { date: "monthMar", confirmed: 45, declined: 8, pending: 60 },
  { date: "monthApr", confirmed: 68, declined: 12, pending: 55 },
  { date: "monthMay", confirmed: 95, declined: 15, pending: 48 },
  { date: "monthJun", confirmed: 120, declined: 18, pending: 42 },
  { date: "monthJul", confirmed: 148, declined: 20, pending: 35 },
  { date: "monthAug", confirmed: 170, declined: 22, pending: 28 },
  { date: "monthSep", confirmed: 186, declined: 24, pending: 38 },
];

type ChartType = "line" | "area";
type Period = "last_week" | "last_month";

const periodLabelKeys: Record<Period, string> = {
  last_week: "lastWeek",
  last_month: "lastMonth",
};

const lineColors = {
  confirmed: "#22c55e",
  declined: "#ec4899",
  pending: "#06b6d4",
};


interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string;
  lineLabels?: Record<string, string>;
}

function CustomTooltip({ active, payload, label, lineLabels = {} }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-md p-3 shadow-lg">
        <p className="text-xs text-muted-foreground mb-2">{label}</p>
        <div className="grid grid-cols-1 gap-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground">
                {lineLabels[entry.dataKey] || entry.dataKey}:
              </span>
              <span className="text-xs font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export function GuestsChart({ isDemo }: { isDemo?: boolean }) {
  const t = useTranslations("Dashboard");
  const { guests } = useDashboardStore();
  const { theme } = useTheme();
  const [chartType, setChartType] = useState<ChartType>("area");
  const [period, setPeriod] = useState<Period>("last_week");
  const [showGrid, setShowGrid] = useState(true);
  const [visibleLines, setVisibleLines] = useState({
    confirmed: true,
    declined: true,
    pending: true,
  });

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const el = chartContainerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      if (width > 0) setChartWidth(Math.floor(width));
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const lineLabels: Record<string, string> = {
    confirmed: t("confirmed"),
    declined: t("declined"),
    pending: t("pending"),
  };

  const axisColor = theme === "dark" ? "#71717a" : "#868c98";
  const gridColor = theme === "dark" ? "#3f3f46" : "#e2e4e9";

  const chartData = useMemo(() => {
    if (isDemo) {
      const raw = period === "last_week" ? demoChartDataWeek : demoChartDataMonth;
      return raw.map((d) => ({ ...d, date: t(d.date) }));
    }

    // Derive chart data from real guests
    const now = new Date();
    const dayNames = ["daySun", "dayMon", "dayTue", "dayWed", "dayThu", "dayFri", "daySat"];
    const monthNames = ["monthJan", "monthFeb", "monthMar", "monthApr", "monthMay", "monthJun",
      "monthJul", "monthAug", "monthSep", "monthOct", "monthNov", "monthDec"];

    if (period === "last_week") {
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (6 - i));
        return d;
      });
      return days.map((day) => {
        const dayGuests = guests.filter((g) => {
          const created = new Date(g.createdAt);
          return created.toDateString() === day.toDateString();
        });
        return {
          date: t(dayNames[day.getDay()]),
          confirmed: dayGuests.filter((g) => g.rsvpStatus === "confirmed").length,
          declined: dayGuests.filter((g) => g.rsvpStatus === "declined").length,
          pending: dayGuests.filter((g) => g.rsvpStatus === "pending").length,
        };
      });
    }

    // last_month - group by month
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - (5 - i));
      return d;
    });
    return months.map((month) => {
      const monthGuests = guests.filter((g) => {
        const created = new Date(g.createdAt);
        return created.getMonth() === month.getMonth() && created.getFullYear() === month.getFullYear();
      });
      return {
        date: t(monthNames[month.getMonth()]),
        confirmed: monthGuests.filter((g) => g.rsvpStatus === "confirmed").length,
        declined: monthGuests.filter((g) => g.rsvpStatus === "declined").length,
        pending: monthGuests.filter((g) => g.rsvpStatus === "pending").length,
      };
    });
  }, [period, t, isDemo, guests]);

  const maxValue = useMemo(() => {
    const allValues = chartData.flatMap((d) => [
      d.confirmed,
      d.declined,
      d.pending,
    ]);
    return Math.ceil(Math.max(...allValues) / 50) * 50 || 200;
  }, [chartData]);

  const toggleLine = (line: keyof typeof visibleLines) => {
    setVisibleLines((prev) => ({
      ...prev,
      [line]: !prev[line],
    }));
  };

  const resetToDefault = () => {
    setChartType("area");
    setPeriod("last_month");
    setShowGrid(true);
    setVisibleLines({
      confirmed: true,
      declined: true,
      pending: true,
    });
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg border flex-1 min-w-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-border/50">
        <h3 className="font-medium text-sm sm:text-base">{t("rsvpStatus")}</h3>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1.5">
                <Calendar className="size-3.5" />
                <span className="text-sm">{t(periodLabelKeys[period])}</span>
                <ChevronDown className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(Object.keys(periodLabelKeys) as Period[]).map((p) => (
                <DropdownMenuItem key={p} onClick={() => setPeriod(p)}>
                  {t(periodLabelKeys[p])} {period === p && "✓"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="size-7">
                <Settings className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>{t("chartType")}</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setChartType("line")}>
                    {t("lineChart")} {chartType === "line" && "✓"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setChartType("area")}>
                    {t("areaChart")} {chartType === "area" && "✓"}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showGrid}
                onCheckedChange={setShowGrid}
              >
                {t("showGrid")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>{t("showSeries")}</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {Object.entries(visibleLines).map(([key, value]) => (
                    <DropdownMenuCheckboxItem
                      key={key}
                      checked={value}
                      onCheckedChange={() =>
                        toggleLine(key as keyof typeof visibleLines)
                      }
                    >
                      <span
                        className="size-2 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            lineColors[key as keyof typeof lineColors],
                        }}
                      />
                      {lineLabels[key]}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={resetToDefault}>
                {t("resetToDefault")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="p-4">
        <div ref={chartContainerRef} className="w-full">
          {chartWidth > 0 ? (
            chartType === "area" ? (
              <AreaChart
                width={chartWidth}
                height={Math.round(chartWidth / 3)}
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                {showGrid && (
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={gridColor}
                    vertical={false}
                  />
                )}
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: axisColor }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: axisColor }}
                  domain={[0, maxValue]}
                />
                <Tooltip content={<CustomTooltip lineLabels={lineLabels} />} />
                <defs>
                  {Object.entries(lineColors).map(([key, color]) => (
                    <linearGradient
                      key={key}
                      id={`gradient-${key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                {Object.entries(visibleLines).map(
                  ([key, visible]) =>
                    visible && (
                      <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={lineColors[key as keyof typeof lineColors]}
                        strokeWidth={2}
                        fill={`url(#gradient-${key})`}
                        dot={false}
                      />
                    )
                )}
              </AreaChart>
            ) : (
              <RechartsLineChart
                width={chartWidth}
                height={Math.round(chartWidth / 3)}
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                {showGrid && (
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={gridColor}
                    vertical={false}
                  />
                )}
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: axisColor }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: axisColor }}
                  domain={[0, maxValue]}
                />
                <Tooltip content={<CustomTooltip lineLabels={lineLabels} />} />
                {Object.entries(visibleLines).map(
                  ([key, visible]) =>
                    visible && (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={lineColors[key as keyof typeof lineColors]}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                      />
                    )
                )}
              </RechartsLineChart>
            )
          ) : (
            <div className="w-full animate-pulse bg-muted/30 rounded" style={{ aspectRatio: '3' }} />
          )}
        </div>
      </div>
    </div>
  );
}
