export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  entryDate: string;
  exitDate: string;
  strategy: string;
  notes: string;
}

export interface TradeStats {
  totalTrades: number;
  winRate: number;
  profitLoss: number;
  averageReturn: number;
}