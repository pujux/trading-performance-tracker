import React, { useState, useEffect } from "react";
import { PlusCircle, Download, X } from "lucide-react";
import type { Trade } from "../types/trade";
import { exportTradesAsCSV } from "../utils/csvExport";

interface TradeFormProps {
  onAddTrade: (trade: Omit<Trade, "id">) => void;
  onUpdateTrade: (trade: Trade) => void;
  trades: Trade[];
  editingTrade: Trade | null;
  onCancelEdit: () => void;
}

const emptyFormData = {
  symbol: "",
  type: "buy",
  entryPrice: "",
  exitPrice: "",
  quantity: "",
  entryDate: "",
  exitDate: "",
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
        entryPrice: editingTrade.entryPrice.toString(),
        exitPrice: editingTrade.exitPrice.toString(),
        quantity: editingTrade.quantity.toString(),
        entryDate: editingTrade.entryDate,
        exitDate: editingTrade.exitDate,
        strategy: editingTrade.strategy,
        notes: editingTrade.notes,
      });
    }
  }, [editingTrade]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tradeData = {
      ...formData,
      entryPrice: Number(formData.entryPrice),
      exitPrice: Number(formData.exitPrice),
      quantity: Number(formData.quantity),
    };

    if (editingTrade) {
      onUpdateTrade({ ...tradeData, id: editingTrade.id } as Trade);
    } else {
      onAddTrade(tradeData as Trade);
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

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={!!editingTrade}
            className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            <PlusCircle size={20} />
            Add Trade
          </button>
        }

        <button
          onClick={() => exportTradesAsCSV(trades)}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {(isOpen || editingTrade) && (
        <form onSubmit={handleSubmit} className="p-6 mt-4 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{editingTrade ? "Edit Trade" : "Add New Trade"}</h2>
            <button type="button" onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Symbol</label>
              <input
                required
                type="text"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "buy" | "sell" })}
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Entry Price</label>
              <input
                required
                type="number"
                step="0.01"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.entryPrice}
                onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Exit Price</label>
              <input
                required
                type="number"
                step="0.01"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.exitPrice}
                onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                required
                type="number"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Strategy</label>
              <input
                type="text"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.strategy}
                onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Entry Date</label>
              <input
                required
                type="datetime-local"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.entryDate}
                onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Exit Date</label>
              <input
                required
                type="datetime-local"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.exitDate}
                onChange={(e) => setFormData({ ...formData, exitDate: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
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
