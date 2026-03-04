
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
      case BudgetStatus.APPROVED: return 'bg-green-100 text-green-700 border-green-200';
      case BudgetStatus.REVISION: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daftar Kegiatan & Belanja</h2>
          <p className="text-slate-500">Perencanaan belanja desa per bidang kegiatan.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 shadow-lg shadow-green-200 transition"
        >
          <Plus className="w-4 h-4" /> Tambah Kegiatan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {SECTORS.map((sector) => {
          const sectorActs = yearExpenditures.filter(e => e.sector === sector);
          if (sectorActs.length === 0) return null;

          return (
            <div key={sector} className="space-y-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-700 text-lg border-l-4 border-green-500 pl-4 py-1">
                {sector}
                <span className="text-sm font-normal text-slate-400">({sectorActs.length} Kegiatan)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sectorActs.map(act => (
                  <div key={act.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition group">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-1.5">
                          {act.activityType === 'Fisik' ? (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 uppercase">
                              <Construction className="w-2.5 h-2.5" /> Fisik
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 uppercase">
                              <BookOpen className="w-2.5 h-2.5" /> Non-Fisik
                            </div>
                          )}
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider ml-1">KD Rek: {act.accountCode}</span>
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusColor(act.status)}`}>
                          {act.status}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-4 line-clamp-2 leading-snug h-12">
                        {act.activityName}
                      </h4>
                      
                      <div className="space-y-2 text-xs text-slate-600 mb-6">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{act.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">PJ: {act.manager}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wallet className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">Sumber: {act.source}</span>
                        </div>
                      </div>

                      <div className="flex items-end justify-between border-t border-slate-50 pt-4 mt-auto">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Pagu Anggaran</p>
                          <p className="text-lg font-bold text-blue-900">{formatCurrency(act.budgetCap)}</p>
                        </div>
                        <Link 
                          to={`/expenditure/${act.id}`}
                          className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-blue-600 rounded-lg text-sm font-bold group-hover:bg-blue-600 group-hover:text-white transition-all"
                        >
                          <FileText className="w-4 h-4" />
                          RAB
                          <ChevronRight className="w-4 h-4" />
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
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-400">Belum ada kegiatan yang direncanakan untuk tahun {selectedYear}</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-slate-100 bg-green-50/50">
              <h3 className="text-xl font-bold text-green-900">Tambah Kegiatan Baru</h3>
              <p className="text-sm text-slate-500">Definisikan rencana kegiatan untuk penganggaran</p>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Kegiatan</label>
                  <input 
                    type="text" required
                    placeholder="Contoh: Pembangunan Drainase Dusun II"
                    value={formData.activityName}
                    onChange={e => setFormData({...formData, activityName: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jenis Kegiatan</label>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, activityType: 'Fisik'})}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border transition flex items-center justify-center gap-2 ${formData.activityType === 'Fisik' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-600 border-slate-200'}`}
                    >
                      <Construction className="w-3 h-3" /> Fisik
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, activityType: 'Non-Fisik'})}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border transition flex items-center justify-center gap-2 ${formData.activityType === 'Non-Fisik' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}
                    >
                      <BookOpen className="w-3 h-3" /> Non-Fisik
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bidang / Sektor</label>
                  <select 
                    value={formData.sector}
                    onChange={e => setFormData({...formData, sector: e.target.value as any})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Lokasi Kegiatan</label>
                  <input 
                    type="text" required placeholder="Wilayah/Dusun"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pagu Anggaran (IDR)</label>
                  <input 
                    type="number" required
                    value={formData.budgetCap}
                    onChange={e => setFormData({...formData, budgetCap: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-bold text-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Penanggung Jawab</label>
                  <input 
                    type="text" placeholder="Nama/Jabatan"
                    value={formData.manager}
                    onChange={e => setFormData({...formData, manager: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sumber Dana</label>
                  <select 
                    value={formData.source}
                    onChange={e => setFormData({...formData, source: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="Dana Desa">Dana Desa (DD)</option>
                    <option value="ADD">Alokasi Dana Desa (ADD)</option>
                    <option value="PADes">Pendapatan Asli Desa</option>
                    <option value="Bantuan Keuangan">Bantuan Keuangan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status Awal</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value={BudgetStatus.PLANNING}>{BudgetStatus.PLANNING}</option>
                    <option value={BudgetStatus.APPROVED}>{BudgetStatus.APPROVED}</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50">Batal</button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 shadow-lg shadow-green-200">Simpan Kegiatan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenditurePage;
