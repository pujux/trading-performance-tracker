import { ArrowUpCircle, ArrowDownCircle, Edit2, Trash } from "lucide-react";
import type { Trade } from "../types/trade";

interface TradeListProps {
  trades: Trade[];
  onDeleteTrade: (id: string) => void;
  onEditTrade: (trade: Trade) => void;
}

export default function TradeList({ trades, onDeleteTrade, onEditTrade }: TradeListProps) {
  const calculatePnL = (trade: Trade) => {
    const pnl = (trade.exitPrice - trade.entryPrice) * trade.quantity;
    return trade.type === "buy" ? pnl : -pnl;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full overflow-hidden bg-white rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Symbol</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Entry</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Exit</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Quantity</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">P&L</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Period</th>
            {/* <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Strategy</th> */}
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {trades.map((trade) => {
            const pnl = calculatePnL(trade);
            return (
              <tr key={trade.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {pnl >= 0 ? <ArrowUpCircle className="text-green-500" size={20} /> : <ArrowDownCircle className="text-red-500" size={20} />}
                    {trade.symbol}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${trade.type === "buy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {trade.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">{trade.category}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${trade.entryPrice.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${trade.exitPrice.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{trade.quantity}</td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  <span className={pnl >= 0 ? "text-green-600" : "text-red-600"}>${pnl.toFixed(2)}</span>
                </td>
                {/* <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{trade.strategy}</td> */}
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {trade.entryDate}-{trade.exitDate}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  <div className="flex items-center justify-around gap-2">
                    <button onClick={() => onEditTrade(trade)} className="text-blue-600 hover:text-blue-900">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDeleteTrade(trade.id)} className="text-red-600 hover:text-red-900">
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
