import { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import type { Trade } from "../types/trade";
import { calculatePnL } from "../utils/misc";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { ChevronDown, ChevronUp, LineChartIcon } from "lucide-react";

interface PerformanceChartProps {
  trades: Trade[];
}

const CATEGORY_COLORS = {
  Scalp: "#10b981", // emerald-500
  Swing: "#f59e0b", // amber-500
  Daytrade: "#6366f1", // indigo-500
  Position: "#ec4899", // pink-500
};

export default function PerformanceChart({ trades }: PerformanceChartProps) {
  const [hiddenLines, setHiddenLines] = useState(new Set(Object.keys(CATEGORY_COLORS)));

  const { chartData, activeCategories } = useMemo(() => {
    const categories = [...new Set(trades.map((t) => t.category))];
    const pnlByDate = new Map<string, { pnl: number; categories: Record<string, number> }>();
    let runningTotal = 0;

    trades
      .filter((trade) => !!trade.endDate)
      .forEach((trade) => {
        const date = new Date(trade.endDate!).toLocaleDateString();
        const pnl = calculatePnL(trade);

        // Initialize category object for this date if it doesn't exist
        if (!pnlByDate.has(date)) {
          pnlByDate.set(date, { pnl: 0, categories: {} });
        }

        const dateEntry = pnlByDate.get(date)!;
        dateEntry.pnl += pnl;
        dateEntry.categories[trade.category] = (dateEntry.categories[trade.category] || 0) + pnl;
      });

    const data = [...pnlByDate.entries()]
      .sort(([dateA], [dateB]) => +new Date(dateA) - +new Date(dateB))
      .map(([date, entry]) => {
        const categoryData = categories.reduce((acc, category) => {
          acc[category] = entry.categories[category] || 0;
          return acc;
        }, {} as Record<string, number>);

        return {
          date,
          cpnl: (runningTotal += entry.pnl),
          pnl: entry.pnl,
          ...categoryData,
        };
      });

    return {
      chartData: data,
      activeCategories: categories,
    };
  }, [trades]);

  const handleLegendClick = ({ dataKey }: Payload) => {
    const key = dataKey?.toString();
    if (!key) return;

    setHiddenLines((prev) => {
      const set = new Set(prev);
      if (set.has(key)) {
        set.delete(key);
      } else {
        set.add(key);
      }
      return set;
    });
  };

  return (
    <details className="mb-8 bg-white rounded-lg shadow-sm group">
      <summary className="flex items-center justify-between p-6 list-none cursor-pointer">
        <div className="flex items-center gap-4">
          <LineChartIcon size={24} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Performance Over Time</h2>
        </div>
        <ChevronUp size={24} className="hidden group-open:block" />
        <ChevronDown size={24} className="block group-open:hidden" />
      </summary>
      <div className="w-full pb-6 aspect-video max-h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
            <YAxis tickFormatter={(value: number) => value.toFixed(2)} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number, name: string) => [value.toFixed(2), name]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px",
              }}
            />
            <Legend onClick={handleLegendClick} />
            <Line
              type="monotone"
              dataKey="cpnl"
              hide={hiddenLines.has("cpnl")}
              name="Cumulative P&L"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="pnl"
              hide={hiddenLines.has("pnl")}
              name="Daily P&L"
              stroke="#a00aa6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            {activeCategories.map((category) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                hide={hiddenLines.has(category)}
                name={category}
                stroke={CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </details>
  );
}
