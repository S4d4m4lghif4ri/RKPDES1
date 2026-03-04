
import React, { useState, useMemo } from 'react';
import { useApp } from '../App';
import { Plus, Download, Trash2, PieChart, Hash } from 'lucide-react';
import { Financing } from '../types';
import { ACCOUNT_CODES } from '../constants';

const FinancingPage: React.FC = () => {
  const { financings, setFinancings, selectedYear } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Financing>>({
    type: 'Penerimaan',
    description: '',
    amount: 0,
    note: ''
  });

  const yearFinancings = financings.filter(f => f.year === selectedYear);

  const generatedCode = useMemo(() => {
    return formData.type === 'Penerimaan' ? '6.1.1.01' : '6.2.2.01';
  }, [formData.type]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newFin: Financing = {
      id: Math.random().toString(36).substr(2, 9),
      year: selectedYear,
      type: formData.type as any,
      description: formData.description || '',
      amount: formData.amount || 0,
      note: formData.note || '',
    };
    setFinancings([...financings, newFin]);
    setShowModal(false);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const totalReceipts = yearFinancings.filter(f => f.type === 'Penerimaan').reduce((a,b) => a + b.amount, 0);
  const totalExpenditure = yearFinancings.filter(f => f.type === 'Pengeluaran').reduce((a,b) => a + b.amount, 0);

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pembiayaan Desa</h2>
          <p className="text-slate-500">Pengelolaan SiLPA [6.1.1] dan Penyertaan Modal [6.2.2].</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 shadow-lg shadow-amber-200 transition"
        >
          <Plus className="w-4 h-4" /> Tambah Pembiayaan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1 bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-2xl text-white shadow-lg shadow-amber-100">
          <PieChart className="w-8 h-8 mb-4 opacity-50" />
          <p className="text-amber-100 text-sm font-medium uppercase tracking-wider mb-1">Neto Pembiayaan</p>
          <h4 className="text-2xl font-bold">{formatCurrency(totalReceipts - totalExpenditure)}</h4>
        </div>
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Penerimaan [6.1]</p>
          <h4 className="text-xl font-bold text-slate-800">{formatCurrency(totalReceipts)}</h4>
        </div>
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Pengeluaran [6.2]</p>
          <h4 className="text-xl font-bold text-slate-800">{formatCurrency(totalExpenditure)}</h4>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              <th className="px-6 py-4">Kode</th>
              <th className="px-6 py-4">Jenis</th>
              <th className="px-6 py-4">Uraian</th>
              <th className="px-6 py-4 text-right">Nominal (IDR)</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {yearFinancings.map(item => {
              const code = item.type === 'Penerimaan' ? '6.1.1.01' : '6.2.2.01';
              return (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{code}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      item.type === 'Penerimaan' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{item.description}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(item.amount)}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => setFinancings(financings.filter(f => f.id !== item.id))} className="text-slate-300 hover:text-red-500 p-2 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {yearFinancings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Belum ada data pembiayaan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-slate-100 bg-amber-50/50">
              <h3 className="text-xl font-bold text-amber-900">Tambah Pembiayaan</h3>
              <p className="text-sm text-slate-500">Catat penerimaan atau pengeluaran pembiayaan desa</p>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jenis Pembiayaan</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'Penerimaan'})}
                    className={`py-2 rounded-lg text-sm font-bold border transition ${formData.type === 'Penerimaan' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}
                  >Penerimaan (6.1)</button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'Pengeluaran'})}
                    className={`py-2 rounded-lg text-sm font-bold border transition ${formData.type === 'Pengeluaran' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-200'}`}
                  >Pengeluaran (6.2)</button>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200 flex items-center gap-2">
                <Hash className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-500 uppercase">Kode Rekening Otomatis:</span>
                <span className="text-sm font-mono font-bold text-amber-700">{generatedCode}</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Uraian Pembiayaan</label>
                <input 
                  type="text" required placeholder="Contoh: SiLPA Tahun Sebelumnya"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nominal (IDR)</label>
                <input 
                  type="number" required
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Keterangan</label>
                <textarea 
                  rows={2}
                  value={formData.note}
                  onChange={e => setFormData({...formData, note: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                ></textarea>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50">Batal</button>
                <button type="submit" className="px-6 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 shadow-lg shadow-amber-200">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancingPage;
