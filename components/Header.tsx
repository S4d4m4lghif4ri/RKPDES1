
import React from 'react';
import { useApp } from '../App';
import { BUDGET_YEARS } from '../constants';
import { Bell, Search, Calendar } from 'lucide-react';

const Header: React.FC = () => {
  const { selectedYear, setSelectedYear } = useApp();

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 z-10 shadow-sm">
      <div className="flex items-center space-x-10">
        <div className="relative group hidden lg:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari data anggaran..."
            className="pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 w-80 transition-all font-medium"
          />
        </div>
        
        <div className="flex items-center space-x-3 text-base font-semibold text-slate-600">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span>Tahun Anggaran:</span>
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-slate-100 border-none rounded-lg px-3 py-1.5 text-blue-900 font-black focus:ring-0 cursor-pointer hover:bg-slate-200 transition text-lg"
          >
            {BUDGET_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button className="p-3 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>
        <div className="w-px h-8 bg-slate-200"></div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-black text-green-700 bg-green-50 px-4 py-1.5 rounded-full border border-green-100 shadow-sm">
            STATUS: ONLINE
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
