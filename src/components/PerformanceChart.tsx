import { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import type { Trade } from "../types/trade";
import { calculatePnL } from "../utils/misc";

interface PerformanceChartProps {
  trades: Trade[];
}

export default function PerformanceChart({ trades }: PerformanceChartProps) {
  const chartData = useMemo(() => {
    const sortedTrades = [...trades].sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

    let runningPnL = 0;
    return sortedTrades.map((trade) => {
      const pnl = calculatePnL(trade);
      runningPnL += pnl;
      return {
        date: new Date(trade.endDate).toLocaleDateString(),
        cpnl: runningPnL,
        pnl,
        symbol: trade.symbol,
      };
    });
  }, [trades]);

  const formatYAxis = (value: number) => `$${value.toFixed(2)}`;

  return (
    <div className="p-6 mb-8 bg-white rounded-lg shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Performance Over Time</h2>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
            <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="cpnl" name="Cumulative P&L" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="pnl" name="P&L" stroke="#a00aa6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
