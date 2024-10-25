import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { Trade } from '../types/trade';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceChartProps {
  trades: Trade[];
}

export default function PerformanceChart({ trades }: PerformanceChartProps) {
  const chartData = useMemo(() => {
    const sortedTrades = [...trades].sort((a, b) => 
      new Date(a.exitDate).getTime() - new Date(b.exitDate).getTime()
    );

    let runningPnL = 0;
    const data = sortedTrades.map(trade => {
      const pnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * 
        (trade.type === 'buy' ? 1 : -1);
      runningPnL += pnl;
      return {
        date: new Date(trade.exitDate).toLocaleDateString(),
        pnl: runningPnL
      };
    });

    return {
      labels: data.map(d => d.date),
      datasets: [
        {
          label: 'Cumulative P&L',
          data: data.map(d => d.pnl),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.4
        }
      ]
    };
  }, [trades]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Performance Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value.toFixed(2)}`
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <Line data={chartData} options={options} />
    </div>
  );
}