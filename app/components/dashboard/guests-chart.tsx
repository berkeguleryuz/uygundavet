"use client";

import { useState, useMemo } from "react";
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
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useTheme } from "next-themes";
import { chartDataMonth, chartDataWeek } from "@/mock-data/dashboard";

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

export function GuestsChart() {
  const t = useTranslations("Dashboard");
  const { theme } = useTheme();
  const [chartType, setChartType] = useState<ChartType>("area");
  const [period, setPeriod] = useState<Period>("last_month");
  const [showGrid, setShowGrid] = useState(true);
  const [visibleLines, setVisibleLines] = useState({
    confirmed: true,
    declined: true,
    pending: true,
  });

  const lineLabels: Record<string, string> = {
    confirmed: t("confirmed"),
    declined: t("declined"),
    pending: t("pending"),
  };

  const axisColor = theme === "dark" ? "#71717a" : "#868c98";
  const gridColor = theme === "dark" ? "#3f3f46" : "#e2e4e9";

  const chartData = useMemo(() => {
    const raw = period === "last_week" ? chartDataWeek : chartDataMonth;
    return raw.map((d) => ({ ...d, date: t(d.date) }));
  }, [period, t]);

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
    <div className="bg-card text-card-foreground rounded-lg border flex-1">
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
        <div className="h-[200px] sm:h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            {chartType === "area" ? (
              <AreaChart
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
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
