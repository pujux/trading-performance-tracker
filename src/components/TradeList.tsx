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

  const sortedTrades = [...trades].sort((a, b) => {
    const aHasEndDate = Boolean(a.endDate);
    const bHasEndDate = Boolean(b.endDate);

    if (aHasEndDate && bHasEndDate) {
      // Both trades have endDate, sort by endDate ascending
      return +new Date(b.endDate!) - +new Date(a.endDate!);
    } else if (!aHasEndDate && !bHasEndDate) {
      // Neither trade has endDate, sort by startDate ascending
      return +new Date(b.startDate) - +new Date(a.startDate);
    } else {
      // Trades with no endDate come before those with an endDate
      return +aHasEndDate - +bHasEndDate;
    }
  });

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
    <div className="overflow-x-auto rounded-lg">
      <table className="min-w-full bg-white">
        <thead className="border-b bg-slate-50 border-slate-300">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-center uppercase text-slate-500">Symbol</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-center uppercase text-slate-500">Type</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-center uppercase text-slate-500">Category</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-center uppercase text-slate-500">Avg Entry</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-center uppercase text-slate-500">Avg Exit</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-center uppercase text-slate-500">Total Qty</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-center uppercase text-slate-500">Open Qty</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-center uppercase text-slate-500">Order Costs</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-center uppercase text-slate-500">P&L</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-center uppercase text-slate-500">Holding Period</th>
            <th className="sticky right-0 p-3 text-xs font-medium tracking-wider text-center uppercase bg-slate-50 text-slate-500 before:content-['\00a0'] before:block before:absolute before:inset-0 before:-right-px before:-z-10 before:border-l before:border-slate-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-300">
          {sortedTrades.length === 0 && (
            <tr>
              <td colSpan={11} className="p-6 text-center text-slate-900">
                No trades to display
              </td>
            </tr>
          )}
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
                <tr className="hover:bg-slate-50 group">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {pnl >= 0 ? <ArrowUpCircle className="text-green-500" size={20} /> : <ArrowDownCircle className="text-red-500" size={20} />}
                      {trade.symbol}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-slate-500 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${trade.type === "buy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {trade.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-slate-500 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">{trade.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-slate-500 whitespace-nowrap">{avgEntryPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-right text-slate-500 whitespace-nowrap">{avgExitPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-right text-slate-500 whitespace-nowrap">{totalEntryQty}</td>
                  <td className="px-6 py-4 text-sm text-right text-slate-500 whitespace-nowrap">{openQty}</td>
                  <td className="px-6 py-4 text-sm text-right text-slate-500 whitespace-nowrap">{totalOrderCosts.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-right text-slate-500 whitespace-nowrap">
                    <span className={openQty === 0 ? (pnl >= 0 ? "text-green-600" : "text-red-600") : ""}>
                      {openQty === 0 ? pnl.toFixed(2) : "..."}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-slate-500 whitespace-nowrap" title={holdingPeriod.fullPeriod}>
                    {holdingPeriod.shortPeriod}
                  </td>
                  <td className="sticky right-0 p-4 text-sm bg-white group-hover:bg-slate-50 text-slate-500 whitespace-nowrap before:content-['\00a0'] before:block before:absolute before:inset-0 before:-right-px before:-z-10 before:border-l before:border-slate-300">
                    <div className="flex items-center justify-around gap-1">
                      <button onClick={() => toggleExpand(trade.id)} className="p-1 rounded hover:bg-slate-100">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                      <button
                        onClick={() => onEditTrade(trade)}
                        className="p-1.5 text-blue-600 rounded hover:bg-slate-100 hover:text-blue-900"
                        title="Edit Trade"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteTrade(trade.id)}
                        className="p-1.5 text-red-600 rounded hover:bg-slate-100 hover:text-red-900"
                        title="Remove Trade"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
                {isExpanded && (
                  <tr>
                    <td colSpan={11} className="p-8 bg-slate-50">
                      <div className="flex flex-col gap-4">
                        <h4 className="font-medium text-slate-900">Transactions</h4>
                        <table className="min-w-full divide-y divide-slate-300">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-xs font-medium text-center text-slate-500">Type</th>
                              <th className="px-4 py-2 text-xs font-medium text-right text-slate-500">Price</th>
                              <th className="px-4 py-2 text-xs font-medium text-right text-slate-500">Quantity</th>
                              <th className="px-4 py-2 text-xs font-medium text-right text-slate-500">Order Cost</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-300">
                            {trade.transactions.map((transaction, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-sm text-center">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      transaction.type === "entry" ? "bg-purple-100 text-purple-800" : "bg-orange-100 text-orange-800"
                                    }`}
                                  >
                                    {transaction.type.toUpperCase()}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-sm text-right">{transaction.price.toFixed(2)}</td>
                                <td className="px-4 py-2 text-sm text-right">{transaction.quantity}</td>
                                <td className="px-4 py-2 text-sm text-right">{transaction.orderCost.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {trade.notes && (
                          <div>
                            <h4 className="font-medium text-slate-900">Notes / Learnings</h4>
                            <p className="mt-1 text-sm text-slate-600">{trade.notes}</p>
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
