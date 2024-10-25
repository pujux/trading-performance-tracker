export interface TradeTransaction {
  price: number;
  quantity: number;
  type: "entry" | "exit";
  orderCost: number;
}

export interface Trade {
  id: string;
  symbol: string;
  type: "buy" | "sell";
  category: "Scalp" | "Swing" | "Daytrade" | "Position";
  transactions: TradeTransaction[];
  startDate: string;
  endDate?: string;
  strategy: string;
  notes: string;
}

export interface TradeStats {
  totalTrades: number;
  winRate: number;
  profitLoss: number;
  averageReturn: number;
}
