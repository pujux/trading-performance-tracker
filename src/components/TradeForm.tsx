import React, { useState } from 'react';
import { PlusCircle, Download } from 'lucide-react';
import type { Trade } from '../types/trade';
import { exportTradesAsCSV } from '../utils/csvExport';

interface TradeFormProps {
  onAddTrade: (trade: Omit<Trade, 'id'>) => void;
  trades: Trade[];
}

export default function TradeForm({ onAddTrade, trades }: TradeFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'buy',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    entryDate: '',
    exitDate: '',
    strategy: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTrade({
      ...formData,
      entryPrice: Number(formData.entryPrice),
      exitPrice: Number(formData.exitPrice),
      quantity: Number(formData.quantity)
    } as Trade);
    setFormData({
      symbol: '',
      type: 'buy',
      entryPrice: '',
      exitPrice: '',
      quantity: '',
      entryDate: '',
      exitDate: '',
      strategy: '',
      notes: ''
    });
    setIsOpen(false);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} />
          Add Trade
        </button>

        <button
          onClick={() => exportTradesAsCSV(trades)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-4 bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Symbol</label>
              <input
                required
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'buy' | 'sell' })}
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.exitPrice}
                onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                required
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Strategy</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.strategy}
                onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Entry Date</label>
              <input
                required
                type="datetime-local"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.entryDate}
                onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Exit Date</label>
              <input
                required
                type="datetime-local"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.exitDate}
                onChange={(e) => setFormData({ ...formData, exitDate: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Add Trade
            </button>
          </div>
        </form>
      )}
    </div>
  );
}