import React, { useState, useEffect } from 'react';
import { LineChart } from 'lucide-react';
import TradeForm from './components/TradeForm';
import TradeList from './components/TradeList';
import Dashboard from './components/Dashboard';
import PerformanceChart from './components/PerformanceChart';
import type { Trade, TradeStats } from './types/trade';

export default function App() {
  const [trades, setTrades] = useState<Trade[]>(() => {
    const savedTrades = localStorage.getItem('trades');
    return savedTrades ? JSON.parse(savedTrades) : [];
  });

  useEffect(() => {
    localStorage.setItem('trades', JSON.stringify(trades));
  }, [trades]);

  const calculateStats = (): TradeStats => {
    const winningTrades = trades.filter(trade => {
      const pnl = (trade.exitPrice - trade.entryPrice) * trade.quantity;
      return trade.type === 'buy' ? pnl > 0 : -pnl > 0;
    });

    const totalPnL = trades.reduce((sum, trade) => {
      const pnl = (trade.exitPrice - trade.entryPrice) * trade.quantity;
      return sum + (trade.type === 'buy' ? pnl : -pnl);
    }, 0);

    return {
      totalTrades: trades.length,
      winRate: trades.length ? winningTrades.length / trades.length : 0,
      profitLoss: totalPnL,
      averageReturn: trades.length ? totalPnL / trades.length / 100 : 0
    };
  };

  const handleAddTrade = (newTrade: Omit<Trade, 'id'>) => {
    const trade: Trade = {
      ...newTrade,
      id: Date.now().toString()
    };
    setTrades(prev => [...prev, trade]);
  };

  const handleDeleteTrade = (id: string) => {
    setTrades(prev => prev.filter(trade => trade.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <LineChart className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Trading Performance Tracker</h1>
        </div>

        <Dashboard stats={calculateStats()} />
        <PerformanceChart trades={trades} />
        <TradeForm onAddTrade={handleAddTrade} trades={trades} />
        <TradeList trades={trades} onDeleteTrade={handleDeleteTrade} />
      </div>
    </div>
  );
}