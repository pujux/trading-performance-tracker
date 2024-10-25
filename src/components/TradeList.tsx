import { ArrowUpCircle, ArrowDownCircle, Edit2, Trash, ChevronUp, ChevronDown } from "lucide-react";
import type { Trade } from "../types/trade";
import { Fragment, useState } from "react";
import { calculatePnL, getAveragePrice, getTotalQuantity, getTotalOrderCosts, getHoldingPeriod } from "../utils/misc";

interface TradeListProps {
  trades: Trade[];
  onDeleteTrade: (id: string) => void;
  onEditTrade: (trade: Trade) => void;
}

export default function TradeList({ trades, onDeleteTrade, onEditTrade }: TradeListProps) {
  const [expandedTrades, setExpandedTrades] = useState<Set<string>>(new Set());

  const sortedTrades = [...trades].sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

  const toggleExpand = (tradeId: string) => {
    setExpandedTrades((prev) => {
      const set = new Set(prev);
      if (set.has(tradeId)) {
        set.delete(tradeId);
      } else {
        set.add(tradeId);
      }
      return set;
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full overflow-hidden bg-white rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Symbol</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Avg Entry</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Avg Exit</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Total Qty</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Open Qty</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Order Costs</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">P&L</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Holding Period</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedTrades.map((trade) => {
            const pnl = calculatePnL(trade);
            const isExpanded = expandedTrades.has(trade.id);
            const avgEntryPrice = getAveragePrice(trade, "entry");
            const avgExitPrice = getAveragePrice(trade, "exit");
            const totalEntryQty = getTotalQuantity(trade, "entry");
            const totalExitQty = getTotalQuantity(trade, "exit");
            const openQty = totalEntryQty - totalExitQty;
            const holdingPeriod = getHoldingPeriod(trade);
            const totalOrderCosts = getTotalOrderCosts(trade);

            return (
              <Fragment key={trade.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleExpand(trade.id)} className="p-1 rounded hover:bg-gray-100">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
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
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{avgEntryPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{avgExitPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{totalEntryQty}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{openQty}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{totalOrderCosts.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <span className={openQty === 0 ? (pnl >= 0 ? "text-green-600" : "text-red-600") : ""}>
                      {openQty === 0 ? pnl.toFixed(2) : "..."}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap" title={holdingPeriod.fullPeriod}>
                    {holdingPeriod.shortPeriod}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <div className="flex items-center justify-around gap-2">
                      <button onClick={() => onEditTrade(trade)} className="text-blue-600 hover:text-blue-900" title="Edit Trade">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => onDeleteTrade(trade.id)} className="text-red-600 hover:text-red-900" title="Remove Trade">
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
                {isExpanded && (
                  <tr>
                    <td colSpan={11} className="p-8 bg-gray-50">
                      <div className="flex flex-col gap-4">
                        <h4 className="font-medium text-gray-900">Transactions</h4>
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-xs font-medium text-left text-gray-500">Type</th>
                              <th className="px-4 py-2 text-xs font-medium text-left text-gray-500">Price</th>
                              <th className="px-4 py-2 text-xs font-medium text-left text-gray-500">Quantity</th>
                              <th className="px-4 py-2 text-xs font-medium text-left text-gray-500">Order Cost</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {trade.transactions.map((transaction, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-sm">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      transaction.type === "entry" ? "bg-purple-100 text-purple-800" : "bg-orange-100 text-orange-800"
                                    }`}
                                  >
                                    {transaction.type.toUpperCase()}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-sm">{transaction.price.toFixed(2)}</td>
                                <td className="px-4 py-2 text-sm">{transaction.quantity}</td>
                                <td className="px-4 py-2 text-sm">{transaction.orderCost.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {trade.notes && (
                          <div>
                            <h4 className="font-medium text-gray-900">Notes / Learnings</h4>
                            <p className="mt-1 text-sm text-gray-600">{trade.notes}</p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
