
import React, { useState, useMemo } from 'react';
import { useApp } from '../App';
import { 
  Plus, Search, FileText, ChevronRight, Activity, 
  Wallet, Calendar, CheckCircle2, History, Trash2
} from 'lucide-react';
import { Realization } from '../types';

const RealizationPage: React.FC = () => {
  const { expenditures, realizations, setRealizations, selectedYear } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState('');
  
  const [formData, setFormData] = useState<Partial<Realization>>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    recipient: '',
    documentNumber: ''
  });

  const yearExpenditures = expenditures.filter(e => e.year === selectedYear);
  
  const filteredActivities = useMemo(() => {
    return yearExpenditures.filter(e => 
      e.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.accountCode.includes(searchTerm)
    );
  }, [yearExpenditures, searchTerm]);

  const activityStats = useMemo(() => {
    const stats: Record<string, number> = {};
    realizations.forEach(r => {
      stats[r.expenditureId] = (stats[r.expenditureId] || 0) + r.amount;
    });
    return stats;
  }, [realizations]);

  const totalBudget = yearExpenditures.reduce((a, b) => a + b.budgetCap, 0);
  // Fix: Explicitly cast Object.values to number[] to resolve unknown type errors in reduction
  const totalRealized = (Object.values(activityStats) as number[]).reduce((a, b) => a + b, 0);
  const realizationPercentage = totalBudget > 0 ? (totalRealized / totalBudget) * 100 : 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivityId) return;

    const newRel: Realization = {
      id: 'rel-' + Math.random().toString(36).substr(2, 5),
      expenditureId: selectedActivityId,
      date: formData.date || '',
      description: formData.description || '',
      amount: formData.amount || 0,
      recipient: formData.recipient || '',
      documentNumber: formData.documentNumber || ''
    };

    setRealizations([...realizations, newRel]);
    setShowModal(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: 0,
      recipient: '',
      documentNumber: ''
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus data realisasi ini?')) {
      setRealizations(realizations.filter(r => r.id !== id));
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Realisasi Belanja</h2>
          <p className="text-slate-500">Pantau dan catat penggunaan anggaran belanja desa Tahun {selectedYear}.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
        >
          <Plus className="w-4 h-4" /> Input Pengeluaran
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Pagu Belanja</p>
          <h4 className="text-2xl font-bold text-slate-900">{formatCurrency(totalBudget)}</h4>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <Wallet className="w-3.5 h-3.5" />
            <span>Anggaran Disetujui</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Realisasi</p>
          <h4 className="text-2xl font-bold text-blue-600">{formatCurrency(totalRealized)}</h4>
          <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full" style={{ width: `${realizationPercentage}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sisa Anggaran Belanja</p>
          <h4 className="text-2xl font-bold text-green-600">{formatCurrency(totalBudget - totalRealized)}</h4>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <Activity className="text-green-500 w-3.5 h-3.5" />
            <span>{(100 - realizationPercentage).toFixed(1)}% Belum Digunakan</span>
          </div>
        </div>
      </div>

      {/* Activity Realization Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Realisasi per Kegiatan
          </h3>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari kegiatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                <th className="px-6 py-4">Kegiatan</th>
                <th className="px-6 py-4 text-right">Pagu</th>
                <th className="px-6 py-4 text-right">Realisasi</th>
                <th className="px-6 py-4 text-right">Sisa</th>
                <th className="px-6 py-4">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredActivities.map(act => {
                const realized = activityStats[act.id] || 0;
                const pct = act.budgetCap > 0 ? (realized / act.budgetCap) * 100 : 0;
                return (
                  <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{act.activityName}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-mono">{act.accountCode} • {act.source}</p>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-600">{formatCurrency(act.budgetCap)}</td>
                    <td className="px-6 py-4 text-right font-bold text-blue-700">{formatCurrency(realized)}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-500">{formatCurrency(act.budgetCap - realized)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${pct > 100 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
                        </div>
                        <span className={`text-[10px] font-bold ${pct > 100 ? 'text-red-600' : 'text-slate-500'}`}>{pct.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Realization Logs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-500" />
            Riwayat Pengeluaran Terakhir
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                <th className="px-6 py-4">Tanggal / No Dok</th>
                <th className="px-6 py-4">Uraian / Penerima</th>
                <th className="px-6 py-4 text-right">Nominal</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {realizations.sort((a,b) => b.date.localeCompare(a.date)).slice(0, 10).map(rel => {
                const act = expenditures.find(e => e.id === rel.expenditureId);
                return (
                  <tr key={rel.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{rel.date}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{rel.documentNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{rel.description}</p>
                      <p className="text-[10px] text-blue-600 uppercase font-bold">{act?.activityName || 'Kegiatan dihapus'}</p>
                      <p className="text-[10px] text-slate-400">Penerima: {rel.recipient}</p>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(rel.amount)}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleDelete(rel.id)}
                        className="p-1.5 text-slate-300 hover:text-red-600 transition hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {realizations.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">Belum ada catatan realisasi belanja.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input Realization */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-slate-100 bg-blue-50/50">
              <h3 className="text-xl font-bold text-blue-900">Input Realisasi Belanja</h3>
              <p className="text-sm text-slate-500">Catat pengeluaran anggaran untuk kegiatan tertentu</p>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pilih Kegiatan</label>
                  <select 
                    required
                    value={selectedActivityId}
                    onChange={(e) => setSelectedActivityId(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">-- Pilih Kegiatan --</option>
                    {yearExpenditures.map(act => (
                      <option key={act.id} value={act.id}>
                        [{act.accountCode}] {act.activityName} (Pagu: {formatCurrency(act.budgetCap)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tanggal Transaksi</label>
                    <input 
                      type="date" required
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">No. Dokumen (SPP/Kwitansi)</label>
                    <input 
                      type="text" required placeholder="Contoh: 002/SPP/2024"
                      value={formData.documentNumber}
                      onChange={e => setFormData({...formData, documentNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Uraian Pembayaran</label>
                  <input 
                    type="text" required placeholder="Contoh: Belanja Semen 50 Sak"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jumlah Bayar (IDR)</label>
                    <input 
                      type="number" required
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Penerima</label>
                    <input 
                      type="text" required placeholder="Nama Toko / Perorangan"
                      value={formData.recipient}
                      onChange={e => setFormData({...formData, recipient: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-6 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
                >Batal</button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200"
                >Simpan Realisasi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealizationPage;
