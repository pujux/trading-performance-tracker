import { useState, useEffect, useMemo } from "react";
import { LineChart } from "lucide-react";
import TradeForm from "./components/TradeForm";
import TradeList from "./components/TradeList";
import Dashboard from "./components/Dashboard";
import PerformanceChart from "./components/PerformanceChart";
import Footer from "./components/Footer";
import type { Trade, TradeStats, TradeTransaction } from "./types/trade";
import { calculatePnL, getAveragePrice, getTotalOrderCosts, getTotalQuantity } from "./utils/misc";

const deserializeTrades = () => {
  const savedTrades = localStorage.getItem("trades");
  if (!savedTrades) return [];

  const trades = JSON.parse(savedTrades) as Trade[];

  return trades.map((trade) => {
    const savedTransactions = localStorage.getItem(`trade_${trade.id}_transactions`);
    return {
      ...trade,
      transactions: savedTransactions ? JSON.parse(savedTransactions) : trade.transactions ?? [],
    };
  });
};

const serializeTrades = (trades: Trade[]) => {
  const transactionMap = trades.reduce(
    (map, trade) => ({
      ...map,
      [trade.id]: [...trade.transactions],
    }),
    {} as Record<string, TradeTransaction[]>
  );

  localStorage.setItem("trades", JSON.stringify(trades.map((trade) => ({ ...trade, transactions: [] }))));
  for (const [id, transactions] of Object.entries(transactionMap)) {
    localStorage.setItem(`trade_${id}_transactions`, JSON.stringify(transactions));
  }
};

export default function App() {
  const [trades, setTrades] = useState<Trade[]>(deserializeTrades());
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  useEffect(() => {
    serializeTrades(trades);
  }, [trades]);

  const tradeStats: TradeStats = useMemo(() => {
    const closedTrades = trades.filter(
      (trade) => getTotalQuantity(trade, "entry") > 0 && getTotalQuantity(trade, "entry") - getTotalQuantity(trade, "exit") === 0
    );
    const winningTrades = closedTrades.filter((trade) => calculatePnL(trade) > 0);

    const totalPnL = closedTrades.reduce((sum, trade) => sum + calculatePnL(trade), 0);

    const averageReturn = closedTrades.length
      ? closedTrades.reduce((sum, trade) => {
          const avgEntryPrice = getAveragePrice(trade, "entry");
          const avgExitPrice = getAveragePrice(trade, "exit");
          const orderCostPerQty = getTotalOrderCosts(trade) / getTotalQuantity(trade, "entry");

          if (!avgEntryPrice || !avgExitPrice || isNaN(orderCostPerQty)) {
            return sum;
          }

          return sum + (avgExitPrice - avgEntryPrice - orderCostPerQty) / avgEntryPrice;
        }, 0) / closedTrades.length
      : 0;

    return {
      totalTrades: trades.length,
      winRate: closedTrades.length ? winningTrades.length / closedTrades.length : 0,
      profitLoss: totalPnL,
      averageReturn,
    };
  }, [trades]);

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
    localStorage.removeItem(`trade_${id}_transactions`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-1 w-full px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <LineChart className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Trading Performance Tracker</h1>
        </div>

        <Dashboard stats={tradeStats} />
        {trades.length > 0 && <PerformanceChart trades={trades} />}
        <TradeForm
          onAddTrade={handleAddTrade}
          onUpdateTrade={handleUpdateTrade}
          trades={trades}
          editingTrade={editingTrade}
          onCancelEdit={() => setEditingTrade(null)}
        />
        <TradeList trades={trades} onDeleteTrade={handleDeleteTrade} onEditTrade={setEditingTrade} />
      </div>
      <Footer />
    </div>
  );
}
