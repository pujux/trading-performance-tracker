import { Trade } from "../types/trade";

export const calculatePnL = (trade: Trade) => {
  const pnl = trade.transactions.reduce((sum, t) => {
    const transactionValue = t.price * t.quantity;
    return sum + (t.type === "exit" ? transactionValue : -transactionValue);
  }, 0);

  return trade.type === "buy" ? pnl : -pnl;
};

export const getAveragePrice = (trade: Trade, type: "entry" | "exit") => {
  const transactions = trade.transactions.filter((t) => t.type === type);
  if (transactions.length === 0) return 0;

  const totalValue = transactions.reduce((sum, t) => sum + t.price * t.quantity, 0);
  const totalQuantity = transactions.reduce((sum, t) => sum + t.quantity, 0);
  return totalValue / totalQuantity;
};

export const getTotalQuantity = (trade: Trade, type: "entry" | "exit") => {
  console.log(trade.transactions);
  return trade.transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.quantity, 0);
};

export const getPeriod = (trade: Trade) => {
  const start = new Date(trade.startDate);
  const end = new Date(trade.endDate);

  const fullPeriod = `${start.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })} - ${end.toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  })}`;

  let shortPeriod = `${start.toLocaleString(undefined, { dateStyle: "short" })} - ${end.toLocaleString(undefined, { dateStyle: "short" })}`;

  if (start.toDateString() === end.toDateString()) {
    shortPeriod = `${start.toLocaleString(undefined, { dateStyle: "short" })} ${start.toLocaleString(undefined, {
      timeStyle: "short",
    })} - ${end.toLocaleString(undefined, { timeStyle: "short" })}`;
  }

  return { fullPeriod, shortPeriod };
};