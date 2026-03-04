
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../App';
import { 
  LayoutDashboard, TrendingUp, Wallet, Briefcase, Building2, LogOut, Settings, FileSpreadsheet, CheckCircle2
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { setUser, user } = useApp();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-6 h-6" /> },
    { label: 'Pagu Dana (Pendapatan)', path: '/income', icon: <TrendingUp className="w-6 h-6" /> },
    { label: 'Rencana Belanja', path: '/expenditure', icon: <Wallet className="w-6 h-6" /> },
    { label: 'Realisasi Belanja', path: '/realization', icon: <CheckCircle2 className="w-6 h-6" /> },
    { label: 'Rencana Pembiayaan', path: '/financing', icon: <Briefcase className="w-6 h-6" /> },
    { label: 'Rekap APBDes', path: '/report', icon: <FileSpreadsheet className="w-6 h-6" /> },
    { label: 'Profil Desa', path: '/profile', icon: <Building2 className="w-6 h-6" /> },
    { label: 'Pengaturan', path: '/settings', icon: <Settings className="w-6 h-6" /> },
  ];

  return (
    <aside className="w-72 bg-blue-900 text-slate-100 hidden md:flex flex-col h-full shadow-2xl">
      <div className="p-8 border-b border-blue-800">
        <h1 className="text-2xl font-extrabold tracking-tight text-white italic">APBDes <span className="text-green-400">Digital</span></h1>
        <p className="text-sm text-blue-300 mt-2 uppercase font-bold tracking-widest opacity-80">Perencanaan & Anggaran</p>
      </div>
      
      <nav className="flex-1 px-4 py-8 space-y-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-4 px-5 py-4 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-blue-600 text-white shadow-lg scale-105' : 'hover:bg-blue-800 text-blue-100 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-bold text-[16px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-blue-800">
        <div className="flex items-center space-x-4 mb-6 px-2">
          <div className="w-12 h-12 rounded-full bg-green-500 border-2 border-white/20 flex items-center justify-center text-white font-black text-lg shadow-inner">{user?.name.charAt(0)}</div>
          <div className="overflow-hidden">
            <p className="text-base font-bold truncate text-white">{user?.name}</p>
            <p className="text-xs text-blue-400 font-black uppercase tracking-wider">{user?.role.replace('_', ' ')}</p>
          </div>
        </div>
        <button onClick={() => setUser(null)} className="w-full flex items-center space-x-4 px-5 py-3 rounded-xl text-blue-300 hover:text-white hover:bg-blue-800 transition-colors font-bold text-sm">
          <LogOut className="w-5 h-5" />
          <span>Keluar Sistem</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
