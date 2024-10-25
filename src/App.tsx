import { useState, useEffect } from "react";
import { LineChart } from "lucide-react";
import TradeForm from "./components/TradeForm";
import TradeList from "./components/TradeList";
import Dashboard from "./components/Dashboard";
import PerformanceChart from "./components/PerformanceChart";
import type { Trade, TradeStats } from "./types/trade";
import { calculatePnL, getTotalQuantity } from "./utils/misc";

export default function App() {
  const [trades, setTrades] = useState<Trade[]>(() => {
    const savedTrades = localStorage.getItem("trades");
    return savedTrades ? JSON.parse(savedTrades) : [];
  });
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  useEffect(() => {
    localStorage.setItem("trades", JSON.stringify(trades));
  }, [trades]);

  const calculateStats = (): TradeStats => {
    const closedTrades = trades.filter((trade) => getTotalQuantity(trade, "entry") - getTotalQuantity(trade, "exit") === 0);
    const winningTrades = closedTrades.filter((trade) => calculatePnL(trade) > 0);

    const totalPnL = closedTrades.reduce((sum, trade) => sum + calculatePnL(trade), 0);

    return {
      totalTrades: trades.length,
      winRate: trades.length ? winningTrades.length / trades.length : 0,
      profitLoss: totalPnL,
      averageReturn: trades.length ? totalPnL / trades.length / 100 : 0,
    };
  };

  const handleAddTrade = (newTrade: Omit<Trade, "id">) => {
    const trade: Trade = {
      ...newTrade,
      id: Date.now().toString(),
    };
    setTrades((prev) => [...prev, trade]);
  };

  const handleUpdateTrade = (updatedTrade: Trade) => {
    setTrades((prev) => prev.map((trade) => (trade.id === updatedTrade.id ? updatedTrade : trade)));
    setEditingTrade(null);
  };

  const handleDeleteTrade = (id: string) => {
    setTrades((prev) => prev.filter((trade) => trade.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <LineChart className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Trading Performance Tracker</h1>
        </div>

        <Dashboard stats={calculateStats()} />
        {trades.length > 1 && <PerformanceChart trades={trades} />}
        <TradeForm
          onAddTrade={handleAddTrade}
          onUpdateTrade={handleUpdateTrade}
          trades={trades}
          editingTrade={editingTrade}
          onCancelEdit={() => setEditingTrade(null)}
        />
        <TradeList trades={trades} onDeleteTrade={handleDeleteTrade} onEditTrade={setEditingTrade} />
      </div>
    </div>
  );
}
