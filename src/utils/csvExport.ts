import type { Trade } from "../types/trade";

export function exportTradesAsCSV(trades: Trade[]) {
  const headers = ["Symbol", "Type", "Category", "Transaction Type", "Price", "Quantity", "Start Date", "End Date", "Strategy", "Notes"];

  const rows: string[][] = [];
  for (const trade of trades) {
    for (const transaction of trade.transactions) {
      rows.push([
        trade.symbol,
        trade.type,
        trade.category,
        transaction.type,
        transaction.price.toString(),
        transaction.quantity.toString(),
        trade.startDate,
        trade.endDate,
        trade.strategy,
        trade.notes,
      ]);
    }
  }

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
