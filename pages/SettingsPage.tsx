
import React, { useState } from 'react';
import { useApp } from '../App';
import { Tag, Hash, Plus, Trash2, Edit2, Save, X, DollarSign, Package } from 'lucide-react';
import { StandardPrice, Sector } from '../types';
import { SECTORS } from '../constants';

const SettingsPage: React.FC = () => {
  const { standardPrices, setStandardPrices, accountConfigs, setAccountConfigs } = useApp();
  const [activeTab, setActiveTab] = useState<'prices' | 'codes'>('prices');
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [editingPrice, setEditingPrice] = useState<StandardPrice | null>(null);

  const [priceForm, setPriceForm] = useState<Partial<StandardPrice>>({
    name: '', category: 'Bahan', unit: 'Buah', price: 0
  });

  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPrice) {
      setStandardPrices(standardPrices.map(p => p.id === editingPrice.id ? { ...p, ...priceForm } as StandardPrice : p));
    } else {
      const newPrice: StandardPrice = {
        id: 'p-' + Math.random().toString(36).substr(2, 5),
        name: priceForm.name || '',
        category: priceForm.category as any,
        unit: priceForm.unit || 'Buah',
        price: priceForm.price || 0
      };
      setStandardPrices([...standardPrices, newPrice]);
    }
    setShowPriceModal(false);
    setEditingPrice(null);
  };

  const deletePrice = (id: string) => {
    if (confirm('Hapus item harga standar ini?')) {
      setStandardPrices(standardPrices.filter(p => p.id !== id));
    }
  };

  const updateAccountPrefix = (sector: Sector, prefix: string) => {
    setAccountConfigs(accountConfigs.map(c => c.sector === sector ? { ...c, prefix } : c));
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Pengaturan Sistem</h2>
        <p className="text-slate-500">Konfigurasi database harga barang dan struktur kode rekening.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('prices')}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'prices' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Daftar Harga Barang & Upah (SSH)
        </button>
        <button 
          onClick={() => setActiveTab('codes')}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'codes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Konfigurasi Kode Rekening
        </button>
      </div>

      {activeTab === 'prices' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-700">Daftar Harga Standar Terkini</h3>
            <button 
              onClick={() => { setEditingPrice(null); setPriceForm({ name: '', category: 'Bahan', unit: 'Buah', price: 0 }); setShowPriceModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" /> Tambah Barang/Upah
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Nama Barang / Jasa</th>
                  <th className="px-6 py-4">Satuan</th>
                  <th className="px-6 py-4 text-right">Harga (IDR)</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {standardPrices.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.category === 'Bahan' ? 'bg-orange-50 text-orange-600' : p.category === 'Upah' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                      }`}>
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{p.name}</td>
                    <td className="px-6 py-4 text-slate-500">{p.unit}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(p.price)}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => { setEditingPrice(p); setPriceForm(p); setShowPriceModal(true); }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deletePrice(p.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-blue-800">
            <Hash className="w-5 h-5 shrink-0" />
            <p className="text-xs font-semibold">Ubah prefix kode untuk setiap bidang kegiatan. Kode kegiatan baru akan otomatis mengikuti konfigurasi ini.</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm divide-y divide-slate-100">
            {accountConfigs.map(config => (
              <div key={config.sector} className="p-6 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">{config.sector}</h4>
                  <p className="text-xs text-slate-400">Prefix Kode: {config.prefix}.x.xx</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs font-bold uppercase">Prefix:</span>
                  <input 
                    type="text"
                    value={config.prefix}
                    onChange={(e) => updateAccountPrefix(config.sector, e.target.value)}
                    className="w-16 px-3 py-1.5 border border-slate-200 rounded-lg text-center font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Price */}
      {showPriceModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-slate-100 bg-blue-50/50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-blue-900">{editingPrice ? 'Edit Harga Standar' : 'Tambah Harga Standar'}</h3>
              <button onClick={() => setShowPriceModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSavePrice} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Barang / Upah</label>
                <input 
                  type="text" required
                  value={priceForm.name}
                  onChange={e => setPriceForm({...priceForm, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Contoh: Semen Gresik 50kg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kategori</label>
                  <select 
                    value={priceForm.category}
                    onChange={e => setPriceForm({...priceForm, category: e.target.value as any})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Bahan">Bahan</option>
                    <option value="Upah">Upah</option>
                    <option value="Alat">Alat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Satuan</label>
                  <input 
                    type="text" required
                    value={priceForm.unit}
                    onChange={e => setPriceForm({...priceForm, unit: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Zak, m3, HOK, dll"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Harga Satuan (IDR)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="number" required
                    value={priceForm.price}
                    onChange={e => setPriceForm({...priceForm, price: Number(e.target.value)})}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowPriceModal(false)} className="px-6 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600">Batal</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition flex items-center gap-2">
                  <Save className="w-4 h-4" /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
