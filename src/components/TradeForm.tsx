import React, { useState, useEffect } from "react";
import { PlusCircle, Download, X, Trash, Plus } from "lucide-react";
import type { Trade, TradeTransaction } from "../types/trade";
import { exportTradesAsCSV } from "../utils/csvExport";

type TradeFormProps = {
  onAddTrade: (trade: Omit<Trade, "id">) => void;
  onUpdateTrade: (trade: Trade) => void;
  trades: Trade[];
  editingTrade: Trade | null;
  onCancelEdit: () => void;
};

type TransactionFormData = {
  price: string;
  quantity: string;
  type: TradeTransaction["type"];
};

type TradeFormData = {
  symbol: string;
  type: Trade["type"];
  category: Trade["category"];
  transactions: TransactionFormData[];
  startDate: string;
  endDate: string;
  strategy: string;
  notes: string;
};

const emptyTransaction: TransactionFormData = {
  price: "",
  quantity: "",
  type: "entry",
};

const emptyFormData: TradeFormData = {
  symbol: "",
  type: "buy",
  category: "Scalp",
  transactions: [{ ...emptyTransaction }],
  startDate: "",
  endDate: "",
  strategy: "",
  notes: "",
};

export default function TradeForm({ onAddTrade, onUpdateTrade, trades, editingTrade, onCancelEdit }: TradeFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(emptyFormData);

  useEffect(() => {
    if (editingTrade) {
      setIsOpen(true);
      setFormData({
        symbol: editingTrade.symbol,
        type: editingTrade.type,
        category: editingTrade.category,
        transactions: editingTrade.transactions.map((t) => ({
          price: t.price.toString(),
          quantity: t.quantity.toString(),
          type: t.type,
        })),
        startDate: editingTrade.startDate,
        endDate: editingTrade.endDate,
        strategy: editingTrade.strategy,
        notes: editingTrade.notes,
      });
    }
  }, [editingTrade]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tradeData = {
      ...formData,
      transactions: formData.transactions.map((t) => ({
        price: Number(t.price),
        quantity: Number(t.quantity),
        type: t.type,
      })),
    } as Trade;

    if (editingTrade) {
      onUpdateTrade({ ...tradeData, id: editingTrade.id });
    } else {
      onAddTrade(tradeData);
    }

    setFormData(emptyFormData);
    setIsOpen(false);
    if (editingTrade) {
      onCancelEdit();
    }
  };

  const handleCancel = () => {
    setFormData(emptyFormData);
    setIsOpen(false);
    if (editingTrade) {
      onCancelEdit();
    }
  };

  const addTransaction = () => {
    setFormData((prev) => ({
      ...prev,
      transactions: [...prev.transactions, { ...emptyTransaction }],
    }));
  };

  const removeTransaction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((_, i) => i !== index),
    }));
  };

  const updateTransaction = (index: number, field: keyof TransactionFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    }));
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={!!editingTrade}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700"
        >
          <PlusCircle size={20} />
          Add Trade
        </button>

        <button
          onClick={() => exportTradesAsCSV(trades)}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {(isOpen || editingTrade) && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 mt-8 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{editingTrade ? "Edit Trade" : "Add New Trade"}</h2>
            <button type="button" onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Symbol</label>
              <input
                required
                type="text"
                className="block border-2 px-1 py-0.5 w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                className="block w-full p-1 mt-1 border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "buy" | "sell" })}
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                className="block w-full p-1 mt-1 border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Trade["category"] })}
              >
                <option value="Scalp">Scalp</option>
                <option value="Swing">Swing</option>
                <option value="Daytrade">Daytrade</option>
                <option value="Position">Position</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                required
                type="datetime-local"
                className="block w-full border-2 px-1 py-0.5 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                required
                type="datetime-local"
                className="block w-full border-2 px-1 py-0.5 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-medium text-gray-700">Notes / Learnings</label>
              <textarea
                className="block border-2 px-1 py-0.5 w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Transactions</h3>
              <button
                type="button"
                onClick={addTransaction}
                className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
              >
                <Plus size={16} />
                Add Transaction
              </button>
            </div>

            {formData.transactions.map((transaction, index) => (
              <div key={index} className="relative grid grid-cols-1 gap-4 p-8 border-2 rounded-lg md:p-4 md:pt-6 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    required
                    className="block w-full p-1 mt-1 border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={transaction.type}
                    onChange={(e) => updateTransaction(index, "type", e.target.value as "entry" | "exit")}
                  >
                    <option value="entry">Entry</option>
                    <option value="exit">Exit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="block border-2 px-1 py-0.5 w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={transaction.price}
                    onChange={(e) => updateTransaction(index, "price", e.target.value)}
                  />
                </div>
                <div className="flex justify-between gap-4">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      required
                      type="number"
                      className="block border-2 px-1 py-0.5 w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={transaction.quantity}
                      onChange={(e) => updateTransaction(index, "quantity", e.target.value)}
                    />
                  </div>

                  {formData.transactions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTransaction(index)}
                      className="absolute mt-1 text-red-600 hover:text-red-800 top-3 right-3"
                    >
                      <Trash size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              {editingTrade ? "Update Trade" : "Add Trade"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
