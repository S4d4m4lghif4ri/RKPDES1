
import React, { useState } from 'react';
import { useApp } from '../App';
import { Plus, Search, FileText, ChevronRight, MapPin, User, Wallet, Hash, Construction, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BudgetStatus, Sector, Expenditure } from '../types';
import { SECTORS } from '../constants';

const ExpenditurePage: React.FC = () => {
  const { expenditures, setExpenditures, selectedYear, accountConfigs } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Expenditure>>({
    sector: Sector.GOVERNANCE,
    activityType: 'Non-Fisik',
    activityName: '',
    location: '',
    manager: '',
    source: 'Dana Desa',
    budgetCap: 0,
    status: BudgetStatus.PLANNING
  });

  const yearExpenditures = expenditures.filter(e => e.year === selectedYear);

  const generateActivityCode = (sector: Sector) => {
    const config = accountConfigs.find(c => c.sector === sector);
    const prefix = config ? config.prefix : '0';
    const count = yearExpenditures.filter(e => e.sector === sector).length + 1;
    return `${prefix}.${count.toString().padStart(2, '0')}`;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const sector = formData.sector || Sector.GOVERNANCE;
    const newExpenditure: Expenditure = {
      id: 'exp-' + Math.random().toString(36).substr(2, 5),
      year: selectedYear,
      sector: sector,
      activityType: formData.activityType as 'Fisik' | 'Non-Fisik',
      activityName: formData.activityName || '',
      accountCode: generateActivityCode(sector),
      location: formData.location || '',
      manager: formData.manager || '',
      source: formData.source || '',
      budgetCap: formData.budgetCap || 0,
      status: formData.status || BudgetStatus.PLANNING,
    };
    setExpenditures([...expenditures, newExpenditure]);
    setShowModal(false);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const getStatusColor = (status: BudgetStatus) => {
    switch (status) {
      case BudgetStatus.APPROVED: return 'bg-green-100 text-green-700 border-green-300';
      case BudgetStatus.REVISION: return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-amber-100 text-amber-700 border-amber-300';
    }
  };

  return (
    <div className="animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Perencanaan Belanja</h2>
          <p className="text-lg text-slate-500 font-medium mt-1">Kelola daftar kegiatan dan rincian belanja per bidang desa.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-3 px-8 py-3.5 bg-green-600 text-white rounded-2xl font-black text-base hover:bg-green-700 shadow-xl shadow-green-100 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-6 h-6" /> Tambah Kegiatan
        </button>
      </div>

      <div className="space-y-12">
        {SECTORS.map((sector) => {
          const sectorActs = yearExpenditures.filter(e => e.sector === sector);
          if (sectorActs.length === 0) return null;

          return (
            <div key={sector} className="space-y-6">
              <h3 className="flex items-center gap-4 font-black text-slate-800 text-xl border-l-8 border-green-500 pl-6 py-2 bg-white rounded-r-2xl shadow-sm pr-10 inline-block">
                {sector}
                <span className="text-base font-bold text-slate-400">({sectorActs.length} Proyek)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {sectorActs.map(act => (
                  <div key={act.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col border-b-4 border-b-slate-200 hover:border-b-blue-500">
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-wrap gap-2">
                          {act.activityType === 'Fisik' ? (
                            <div className="flex items-center gap-2 text-[11px] font-black text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 uppercase tracking-widest shadow-sm">
                              <Construction className="w-3.5 h-3.5" /> Fisik
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-[11px] font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-widest shadow-sm">
                              <BookOpen className="w-3.5 h-3.5" /> Non-Fisik
                            </div>
                          )}
                          <div className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">KODE: {act.accountCode}</div>
                        </div>
                        <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border shadow-sm tracking-widest ${getStatusColor(act.status)}`}>
                          {act.status}
                        </span>
                      </div>
                      
                      <h4 className="text-xl font-black text-slate-900 mb-6 group-hover:text-blue-700 transition-colors leading-snug min-h-[60px]">
                        {act.activityName}
                      </h4>
                      
                      <div className="space-y-4 text-sm font-bold text-slate-600 mb-8 mt-auto border-t border-slate-50 pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <span className="truncate">{act.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                            <User className="w-4 h-4" />
                          </div>
                          <span className="truncate">PJ: {act.manager}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                            <Wallet className="w-4 h-4" />
                          </div>
                          <span className="truncate">Sumber: {act.source}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Pagu Anggaran</p>
                          <p className="text-2xl font-black text-blue-900 leading-none">{formatCurrency(act.budgetCap)}</p>
                        </div>
                        <Link 
                          to={`/expenditure/${act.id}`}
                          className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-blue-600 rounded-2xl text-base font-black group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-slate-100"
                        >
                          RAB
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {yearExpenditures.length === 0 && (
          <div className="bg-white p-24 text-center rounded-3xl border-4 border-dashed border-slate-200">
            <div className="max-w-md mx-auto">
              <div className="p-6 bg-slate-50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center border border-slate-100 shadow-inner">
                <FileText className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-xl font-black text-slate-500">Data Kosong</p>
              <p className="text-base text-slate-400 mt-2 font-medium">Belum ada kegiatan yang direncanakan untuk tahun anggaran {selectedYear}</p>
            </div>
          </div>
        )}
      </div>

      {/* Basic Modal for Kegiatan */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-3xl overflow-hidden animate-slideUp my-8">
            <div className="p-10 border-b border-slate-100 bg-green-50/50 relative">
              <h3 className="text-3xl font-black text-green-900 tracking-tight">Tambah Kegiatan Baru</h3>
              <p className="text-lg text-slate-600 font-medium mt-1">Definisikan rencana strategis desa untuk penganggaran</p>
              <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 p-2 hover:bg-green-100 rounded-full transition-colors">
                <Plus className="w-8 h-8 text-green-800 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-sm font-black text-slate-500 uppercase mb-2 tracking-widest">Nama Kegiatan (Usulan)</label>
                  <input 
                    type="text" required
                    placeholder="Contoh: Pembangunan Jaringan Irigasi Usaha Tani"
                    value={formData.activityName}
                    onChange={e => setFormData({...formData, activityName: e.target.value})}
                    className="w-full px-6 py-4 border-2 border-slate-100 bg-slate-50 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all text-lg font-bold placeholder:text-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-500 uppercase mb-2 tracking-widest">Klasifikasi Teknis</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, activityType: 'Fisik'})}
                      className={`flex-1 py-4 rounded-2xl text-base font-black border-2 transition-all flex items-center justify-center gap-3 shadow-sm ${formData.activityType === 'Fisik' ? 'bg-orange-600 text-white border-orange-600 scale-105' : 'bg-white text-slate-600 border-slate-100 hover:border-orange-200'}`}
                    >
                      <Construction className="w-5 h-5" /> Fisik
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, activityType: 'Non-Fisik'})}
                      className={`flex-1 py-4 rounded-2xl text-base font-black border-2 transition-all flex items-center justify-center gap-3 shadow-sm ${formData.activityType === 'Non-Fisik' ? 'bg-blue-600 text-white border-blue-600 scale-105' : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200'}`}
                    >
                      <BookOpen className="w-5 h-5" /> Non-Fisik
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-500 uppercase mb-2 tracking-widest">Bidang / Sektor Kewenangan</label>
                  <select 
                    value={formData.sector}
                    onChange={e => setFormData({...formData, sector: e.target.value as any})}
                    className="w-full px-6 py-4 border-2 border-slate-100 bg-slate-50 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all text-base font-bold"
                  >
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-500 uppercase mb-2 tracking-widest">Lokasi Pengerjaan</label>
                  <input 
                    type="text" required placeholder="Wilayah/RT/RW/Dusun"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full px-6 py-4 border-2 border-slate-100 bg-slate-50 rounded-2xl focus:ring-4 focus:ring-green-100 outline-none text-base font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-500 uppercase mb-2 tracking-widest">Pagu Anggaran (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-blue-900 text-lg">Rp</span>
                    <input 
                      type="number" required
                      value={formData.budgetCap}
                      onChange={e => setFormData({...formData, budgetCap: Number(e.target.value)})}
                      className="w-full pl-16 pr-6 py-4 border-2 border-slate-100 bg-slate-50 rounded-2xl focus:ring-4 focus:ring-green-100 outline-none font-black text-blue-900 text-2xl tracking-tighter"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-500 uppercase mb-2 tracking-widest">PJ Kegiatan / Kasie</label>
                  <input 
                    type="text" placeholder="Nama Pejabat Penanggung Jawab"
                    value={formData.manager}
                    onChange={e => setFormData({...formData, manager: e.target.value})}
                    className="w-full px-6 py-4 border-2 border-slate-100 bg-slate-50 rounded-2xl focus:ring-4 focus:ring-green-100 outline-none text-base font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-500 uppercase mb-2 tracking-widest">Sumber Pembiayaan</label>
                  <select 
                    value={formData.source}
                    onChange={e => setFormData({...formData, source: e.target.value})}
                    className="w-full px-6 py-4 border-2 border-slate-100 bg-slate-50 rounded-2xl focus:ring-4 focus:ring-green-100 outline-none text-base font-bold"
                  >
                    <option value="Dana Desa">Dana Desa (DD)</option>
                    <option value="ADD">Alokasi Dana Desa (ADD)</option>
                    <option value="PADes">Pendapatan Asli Desa</option>
                    <option value="Bantuan Keuangan">Bantuan Keuangan</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-6 pt-10 border-t border-slate-50">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-base hover:bg-slate-200 transition-all"
                >BATALKAN</button>
                <button 
                  type="submit"
                  className="px-10 py-4 bg-green-600 text-white rounded-2xl font-black text-lg hover:bg-green-700 shadow-xl shadow-green-100 transition-all hover:scale-105 active:scale-95"
                >SIMPAN KEGIATAN</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenditurePage;
