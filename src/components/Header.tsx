import { LineChart } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <LineChart className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Trading Performance Tracker</h1>
        </div>
      </div>
    </header>
  );
}
