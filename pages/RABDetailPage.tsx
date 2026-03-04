
import React, { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { 
  ArrowLeft, Plus, Download, Printer, 
  AlertCircle, CheckCircle, Trash2, Calculator, Hash, Upload, FileText,
  Image as ImageIcon, X, Construction, BookOpen, Layers, Zap
} from 'lucide-react';
import { RABItem, Expenditure, StandardPrice } from '../types';

const RABDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { expenditures, setExpenditures, rabItems, setRabItems, standardPrices } = useApp();

  const activity = expenditures.find(e => e.id === id);
  const items = rabItems.filter(i => i.expenditureId === id);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<RABItem>>({
    description: '',
    category: 'Bahan',
    volume: 1,
    unit: 'Buah',
    unitPrice: 0,
    accountCode: '5.2.1.01'
  });

  const totalRAB = useMemo(() => items.reduce((acc, curr) => acc + curr.total, 0), [items]);
  const isOverBudget = activity ? totalRAB > activity.budgetCap : false;

  if (!activity) return <div className="p-20 text-center font-black text-2xl text-slate-400">Data kegiatan tidak ditemukan atau telah dihapus.</div>;

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: RABItem = {
      id: 'rab-item-' + Math.random().toString(36).substr(2, 5),
      expenditureId: id!,
      accountCode: formData.accountCode || '5.2.1.01',
      description: formData.description || '',
      category: formData.category as any,
      volume: formData.volume || 0,
      unit: formData.unit || 'Buah',
      unitPrice: formData.unitPrice || 0,
      total: (formData.volume || 0) * (formData.unitPrice || 0)
    };
    setRabItems([...rabItems, newItem]);
    setShowModal(false);
    setFormData({ description: '', category: 'Bahan', volume: 1, unit: 'Buah', unitPrice: 0, accountCode: '5.2.1.01' });
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, description: val }));

    const standard = standardPrices.find(p => p.name.toLowerCase() === val.toLowerCase());
    if (standard) {
      setFormData(prev => ({
        ...prev,
        unit: standard.unit,
        unitPrice: standard.price,
        category: standard.category
      }));
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if(confirm('Hapus item ini dari rincian RAB?')) {
      setRabItems(rabItems.filter(i => i.id !== itemId));
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="animate-fadeIn space-y-10 pb-20">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <button onClick={() => navigate('/expenditure')} className="p-4 bg-white border-2 border-slate-100 rounded-[20px] text-slate-500 hover:bg-slate-50 hover:border-blue-200 transition-all shadow-sm">
            <ArrowLeft className="w-8 h-8" />
          </button>
          <div>
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">{activity.activityName}</h2>
              {activity.activityType === 'Fisik' ? (
                <span className="flex items-center gap-2 text-[12px] font-black text-orange-700 bg-orange-50 px-4 py-1.5 rounded-full border border-orange-200 uppercase tracking-widest shadow-sm"><Construction className="w-4 h-4" /> FISIK</span>
              ) : (
                <span className="flex items-center gap-2 text-[12px] font-black text-blue-700 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200 uppercase tracking-widest shadow-sm"><BookOpen className="w-4 h-4" /> NON-FISIK</span>
              )}
            </div>
            <p className="text-xl text-slate-500 font-bold mt-1">Kode Rekening: <span className="text-blue-600 font-black">{activity.accountCode}</span> | Lokasi: {activity.location}</p>
          </div>
        </div>
        <div className="flex gap-4">
             <button className="flex items-center gap-3 px-6 py-3.5 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-black text-base hover:bg-slate-50 transition-all shadow-sm">
              <Printer className="w-5 h-5" /> Cetak RAB
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h3 className="text-sm font-black text-slate-400 uppercase mb-8 tracking-[4px] border-b border-slate-50 pb-4">Status Anggaran</h3>
            <div className="space-y-8">
              <div>
                <p className="text-sm text-slate-400 font-black uppercase tracking-widest mb-1">Pagu Kegiatan</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{formatCurrency(activity.budgetCap)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 font-black uppercase tracking-widest mb-1">Kebutuhan Biaya (RAB)</p>
                <p className={`text-3xl font-black tracking-tighter ${isOverBudget ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>{formatCurrency(totalRAB)}</p>
              </div>
              <div className="pt-8 border-t border-slate-100">
                <p className="text-sm text-slate-400 font-black uppercase tracking-widest mb-1">Sisa Pagu</p>
                <p className="text-2xl font-black text-blue-900 tracking-tighter">{formatCurrency(activity.budgetCap - totalRAB)}</p>
              </div>
            </div>
            {isOverBudget && (
              <div className="mt-10 p-6 bg-red-50 border-2 border-red-100 rounded-[24px] flex gap-4 text-red-900 shadow-sm animate-bounce">
                <AlertCircle className="w-8 h-8 shrink-0 text-red-600" />
                <p className="text-sm font-black leading-snug uppercase italic tracking-tight">Peringatan! Penggunaan Dana Melebihi Pagu Anggaran Desa.</p>
              </div>
            )}
          </div>

          {/* Visual Evidence (simplified for font size focus) */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 text-center">
            <div className="p-10 bg-slate-50 rounded-[24px] border-2 border-dashed border-slate-200 cursor-pointer group hover:bg-slate-100 transition-all">
                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Dokumentasi Teknis</p>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase">Upload Foto Perencanaan</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-black text-slate-800 text-xl tracking-tight">Rincian Item Belanja</h3>
            <button 
              onClick={() => setShowModal(true)} 
              className="flex items-center gap-3 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-base hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 hover:scale-105 active:scale-95"
            >
              <Plus className="w-6 h-6" /> Tambah Item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase font-black tracking-[2px]">
                  <th className="px-8 py-6">KD REK</th>
                  <th className="px-8 py-6">URAIAN PEKERJAAN</th>
                  <th className="px-8 py-6 text-center">VOL</th>
                  <th className="px-8 py-6 text-center">SATUAN</th>
                  <th className="px-8 py-6 text-right">HARGA (Rp)</th>
                  <th className="px-8 py-6 text-right">TOTAL (Rp)</th>
                  <th className="px-8 py-6 text-center">OPSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[15px] font-bold">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6 font-mono text-[13px] text-slate-400">{item.accountCode}</td>
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-800 text-base">{item.description}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">{item.category}</p>
                    </td>
                    <td className="px-8 py-6 text-center text-slate-700 font-black">{item.volume}</td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-600 uppercase tracking-widest border border-slate-200">{item.unit}</span>
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-slate-600">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-8 py-6 text-right font-black text-slate-900 text-lg tracking-tight">{formatCurrency(item.total)}</td>
                    <td className="px-8 py-6 text-center">
                      <button 
                        onClick={() => handleDeleteItem(item.id)} 
                        className="text-slate-300 hover:text-red-600 p-3 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-8 py-24 text-center">
                      <div className="max-w-xs mx-auto opacity-30">
                        <FileText className="w-16 h-16 mx-auto mb-4" />
                        <p className="font-black text-lg uppercase tracking-widest">Belum Ada Item Belanja</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-10 bg-slate-900 text-white flex justify-between items-center">
             <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[3px] opacity-60">Total Kebutuhan Anggaran</p>
                <p className="text-4xl font-black tracking-tighter text-green-400">{formatCurrency(totalRAB)}</p>
             </div>
             <div className="text-right">
                <p className="text-[11px] font-black uppercase tracking-[3px] opacity-60">Status Realisasi</p>
                <p className="text-xl font-black">{((totalRAB/activity.budgetCap)*100).toFixed(1)}% Terhadap Pagu</p>
             </div>
          </div>
        </div>
      </div>

      {/* Modal Add Item */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-slideUp my-8">
            <div className="p-12 border-b border-slate-100 bg-blue-50/30 relative">
              <h3 className="text-3xl font-black text-blue-900 tracking-tight">Tambah Item Belanja</h3>
              <p className="text-lg text-slate-600 font-bold mt-2">Rincian teknis harga satuan dan kuantitas barang/jasa</p>
              <button onClick={() => setShowModal(false)} className="absolute top-12 right-12 p-3 hover:bg-blue-100 rounded-full transition-colors">
                <Plus className="w-8 h-8 text-blue-900 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSaveItem} className="p-12 space-y-10">
              <div className="space-y-3">
                <label className="block text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-3"><Zap className="w-5 h-5 text-orange-500" /> Nama Barang / Uraian Pekerjaan</label>
                <input 
                  list="standard-prices" required placeholder="Ketik atau cari di daftar harga standar..."
                  value={formData.description}
                  onChange={onDescriptionChange}
                  className="w-full px-8 py-5 border-2 border-slate-100 bg-slate-50 rounded-[20px] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-xl font-black"
                />
                <datalist id="standard-prices">
                  {standardPrices.map(p => <option key={p.id} value={p.name}>{p.category} - {formatCurrency(p.price)}/{p.unit}</option>)}
                </datalist>
              </div>
              
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="block text-sm font-black text-slate-500 uppercase tracking-widest">Kategori Belanja</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full px-8 py-5 border-2 border-slate-100 bg-slate-50 rounded-[20px] focus:ring-4 focus:ring-blue-100 outline-none font-bold text-lg">
                    <option value="Bahan">BAHAN / MATERIAL</option>
                    <option value="Alat">PERALATAN / SEWA</option>
                    <option value="Upah">UPAH KERJA / HOK</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-black text-slate-500 uppercase tracking-widest">Satuan Ukur</label>
                  <input list="units" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full px-8 py-5 border-2 border-slate-100 bg-slate-50 rounded-[20px] focus:ring-4 focus:ring-blue-100 outline-none font-black text-lg uppercase" placeholder="PILIH SATUAN..."/>
                  <datalist id="units">
                    <option value="BUAH"/><option value="ZAK"/><option value="M3"/><option value="M2"/><option value="METER"/><option value="LS"/><option value="HOK"/><option value="ORANG/BULAN"/><option value="PAKET"/><option value="UNIT"/><option value="LITER"/><option value="KG"/>
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="block text-sm font-black text-slate-500 uppercase tracking-widest">Volume / Kuantitas</label>
                  <input type="number" required min="0.1" step="any" value={formData.volume} onChange={e => setFormData({...formData, volume: Number(e.target.value)})} className="w-full px-8 py-5 border-2 border-slate-100 bg-slate-50 rounded-[20px] focus:ring-4 focus:ring-blue-100 outline-none font-black text-2xl" />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-black text-slate-500 uppercase tracking-widest">Harga Satuan (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-slate-400">Rp</span>
                    <input type="number" required value={formData.unitPrice} onChange={e => setFormData({...formData, unitPrice: Number(e.target.value)})} className="w-full pl-16 pr-8 py-5 border-2 border-slate-100 bg-slate-50 rounded-[20px] focus:ring-4 focus:ring-blue-100 outline-none font-black text-2xl text-blue-900" />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-blue-900 rounded-[32px] flex items-center justify-between shadow-xl shadow-blue-100 border border-blue-800">
                <div className="flex items-center gap-4 text-blue-200">
                  <div className="p-3 bg-blue-800 rounded-2xl"><Calculator className="w-6 h-6" /></div>
                  <span className="text-sm font-black uppercase tracking-[3px]">Total Anggaran Item</span>
                </div>
                <span className="text-3xl font-black text-green-400 tracking-tighter">{formatCurrency((formData.volume || 0) * (formData.unitPrice || 0))}</span>
              </div>

              <div className="flex justify-end gap-6 pt-10 border-t border-slate-50">
                <button type="button" onClick={() => setShowModal(false)} className="px-10 py-5 bg-slate-100 text-slate-600 rounded-[20px] font-black text-base hover:bg-slate-200 transition-all uppercase tracking-widest">Tutup</button>
                <button type="submit" className="px-12 py-5 bg-blue-600 text-white rounded-[20px] font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 uppercase tracking-widest">Simpan Ke RAB</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RABDetailPage;
