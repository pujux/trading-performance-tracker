import { TrendingUp, TrendingDown, BarChart2, Percent } from "lucide-react";
import type { TradeStats } from "../types/trade";

interface DashboardProps {
  stats: TradeStats;
}

export default function Dashboard({ stats }: DashboardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 lg:grid-cols-4">
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Trades</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalTrades}</p>
          </div>
          <BarChart2 className="text-blue-600" size={24} />
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Win Rate</p>
            <p className="text-2xl font-semibold text-gray-900">{(stats.winRate * 100).toFixed(1)}%</p>
          </div>
          <Percent className="text-blue-600" size={24} />
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total P&L</p>
            <p className={`text-2xl font-semibold ${stats.profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>{stats.profitLoss.toFixed(2)}</p>
          </div>
          {stats.profitLoss >= 0 ? <TrendingUp className="text-green-600" size={24} /> : <TrendingDown className="text-red-600" size={24} />}
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg Return</p>
            <p className={`text-2xl font-semibold ${stats.averageReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
              {(stats.averageReturn * 100).toFixed(2)}%
            </p>
          </div>
          {stats.averageReturn >= 0 ? <TrendingUp className="text-green-600" size={24} /> : <TrendingDown className="text-red-600" size={24} />}
        </div>
      </div>
    </div>
  );
}
