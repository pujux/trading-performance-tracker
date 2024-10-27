import { TrendingUp, TrendingDown, BarChart2, Percent } from "lucide-react";
import type { TradeStats } from "../types/trade";

interface DashboardProps {
  stats: TradeStats;
}

export default function Dashboard({ stats }: DashboardProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="overflow-hidden bg-white shadow-sm rounded-xl">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Total Trades</p>
              <p className="text-2xl font-semibold tracking-tight text-slate-900">{stats.totalTrades}</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-50">
              <BarChart2 className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow-sm rounded-xl">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Win Rate</p>
              <p className="text-2xl font-semibold tracking-tight text-slate-900">{(stats.winRate * 100).toFixed(1)}%</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-50">
              <Percent className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow-sm rounded-xl">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Total P&L</p>
              <p className={`text-2xl font-semibold tracking-tight ${stats.profitLoss >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                ${stats.profitLoss.toFixed(2)}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${stats.profitLoss >= 0 ? "bg-emerald-50" : "bg-red-50"}`}>
              {stats.profitLoss >= 0 ? <TrendingUp className="text-emerald-600" size={24} /> : <TrendingDown className="text-red-600" size={24} />}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow-sm rounded-xl">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Average Return</p>
              <p className={`text-2xl font-semibold tracking-tight ${stats.averageReturn >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {(stats.averageReturn * 100).toFixed(2)}%
              </p>
            </div>
            <div className={`p-2 rounded-lg ${stats.averageReturn >= 0 ? "bg-emerald-50" : "bg-red-50"}`}>
              {stats.averageReturn >= 0 ? <TrendingUp className="text-emerald-600" size={24} /> : <TrendingDown className="text-red-600" size={24} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
