import type { Trade } from "../types/trade";

export function exportTradesAsCSV(trades: Trade[]) {
  const headers = ["Symbol", "Type", "Category", "Entry Price", "Exit Price", "Quantity", "Entry Date", "Exit Date", "Strategy", "Notes", "P&L"];

  const rows = trades.map((trade) => {
    const pnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.type === "buy" ? 1 : -1);
    return [
      trade.symbol,
      trade.type,
      trade.category,
      trade.entryPrice,
      trade.exitPrice,
      trade.quantity,
      trade.entryDate,
      trade.exitDate,
      trade.strategy,
      trade.notes,
      pnl.toFixed(2),
    ];
  });

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `trades_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
