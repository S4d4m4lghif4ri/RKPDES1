
import React, { useState, useMemo } from 'react';
import { useApp } from '../App';
import { PencilLine, ShieldCheck, Landmark } from 'lucide-react';
import { FundCeiling } from '../types';

const IncomePage: React.FC = () => {
  const { expenditures, fundCeilings, setFundCeilings, selectedYear } = useApp();
  const [showCeilingModal, setShowCeilingModal] = useState(false);
  
  const currentCeiling = useMemo(() => 
    fundCeilings.find(c => c.year === selectedYear) || { year: selectedYear, dd: 0, add: 0, bhp: 0, pad: 0 },
    [fundCeilings, selectedYear]
  );

  const [ceilingFormData, setCeilingFormData] = useState<FundCeiling>(currentCeiling);

  const yearExpenditures = expenditures.filter(e => e.year === selectedYear);

  const stats = useMemo(() => {
    return {
      dd: yearExpenditures.filter(i => i.source === 'Dana Desa').reduce((a, b) => a + b.budgetCap, 0),
      add: yearExpenditures.filter(i => i.source === 'ADD').reduce((a, b) => a + b.budgetCap, 0),
      bhp: yearExpenditures.filter(i => i.source === 'BHP').reduce((a, b) => a + b.budgetCap, 0),
      pad: yearExpenditures.filter(i => i.source === 'PADes').reduce((a, b) => a + b.budgetCap, 0),
    };
  }, [yearExpenditures]);

  const handleSaveCeiling = (e: React.FormEvent) => {
    e.preventDefault();
    const existingIndex = fundCeilings.findIndex(c => c.year === selectedYear);
    const updatedCeilings = [...fundCeilings];
    if (existingIndex >= 0) {
      updatedCeilings[existingIndex] = ceilingFormData;
    } else {
      updatedCeilings.push(ceilingFormData);
    }
    setFundCeilings(updatedCeilings);
    setShowCeilingModal(false);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const PaguCard = ({ title, target, planned, colorClass }: { title: string, target: number, planned: number, colorClass: string }) => {
    const isExceeded = planned > target && target > 0;

    return (
      <div className={`bg-white p-8 rounded-3xl shadow-sm border ${isExceeded ? 'border-red-200 bg-red-50/30' : 'border-slate-100'} flex flex-col justify-between transition-all`}>
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</h4>
          <ShieldCheck className={`w-6 h-6 ${isExceeded ? 'text-red-500' : colorClass}`} />
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Pagu Dana:</p>
            <p className="text-2xl font-black text-slate-900">{formatCurrency(target)}</p>
          </div>
          <div className="pt-4 border-t border-slate-50">
            <div className="flex justify-between items-center mb-2 text-xs font-bold">
              <span className="text-slate-500">TERALOKASI KE KEGIATAN:</span>
              <span className={isExceeded ? 'text-red-600' : colorClass}>{target > 0 ? ((planned/target)*100).toFixed(1) : '0.0'}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${isExceeded ? 'bg-red-500' : colorClass.replace('text-', 'bg-')}`} 
                style={{ width: `${Math.min((planned/(target||1))*100, 100)}%` }}
              ></div>
            </div>
            <p className={`text-[11px] font-bold mt-2 ${isExceeded ? 'text-red-500' : 'text-slate-400'}`}>
               {isExceeded ? `Melebihi Pagu: ${formatCurrency(planned - target)}` : `Sisa Alokasi: ${formatCurrency(target - planned)}`}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fadeIn space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Pagu Dana (Target Pendapatan)</h2>
          <p className="text-lg text-slate-500 font-medium">Tetapkan target penerimaan desa sebagai dasar perencanaan belanja.</p>
        </div>
        <button 
          onClick={() => {
            setCeilingFormData(currentCeiling);
            setShowCeilingModal(true);
          }}
          className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:scale-105 active:scale-95"
        >
          <PencilLine className="w-6 h-6" /> Edit Pagu Dana Desa
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-900 text-white p-10 rounded-[40px] shadow-xl flex flex-col md:flex-row items-center gap-10">
        <div className="p-6 bg-blue-800 rounded-3xl border border-blue-700">
          <Landmark className="w-16 h-16 text-blue-300" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-black mb-2">Total Estimasi Pendapatan Tahun {selectedYear}</h3>
          <p className="text-blue-200 font-medium text-lg mb-6">Berikut adalah total dana yang direncanakan masuk ke kas desa dari berbagai sumber transfer dan pendapatan asli.</p>
          <div className="text-5xl font-black tracking-tighter text-green-400">
            {formatCurrency(currentCeiling.dd + currentCeiling.add + currentCeiling.bhp + currentCeiling.pad)}
          </div>
        </div>
      </div>

      {/* Pagu Dana Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PaguCard title="DANA DESA (DD)" target={currentCeiling.dd} planned={stats.dd} colorClass="text-blue-600" />
        <PaguCard title="ALOKASI DANA DESA (ADD)" target={currentCeiling.add} planned={stats.add} colorClass="text-emerald-600" />
        <PaguCard title="BAGI HASIL PAJAK (BHP)" target={currentCeiling.bhp} planned={stats.bhp} colorClass="text-amber-600" />
        <PaguCard title="PENDAPATAN ASLI DESA (PAD)" target={currentCeiling.pad} planned={stats.pad} colorClass="text-indigo-600" />
      </div>

      {/* Modal Edit Pagu */}
      {showCeilingModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-slideUp">
            <div className="p-10 border-b border-slate-100 bg-blue-50/50">
              <h3 className="text-3xl font-black text-blue-900 tracking-tight">Setting Target Pagu</h3>
              <p className="text-lg text-slate-500 font-medium mt-2">Tentukan target pendapatan desa untuk tahun anggaran {selectedYear}</p>
            </div>
            <form onSubmit={handleSaveCeiling} className="p-10 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-slate-500 uppercase mb-2 tracking-widest">Target Dana Desa (DD)</label>
                  <input 
                    type="number" required
                    value={ceilingFormData.dd}
                    onChange={e => setCeilingFormData({...ceilingFormData, dd: Number(e.target.value)})}
                    className="w-full px-8 py-5 border-2 border-slate-100 bg-slate-50 rounded-[24px] focus:ring-4 focus:ring-blue-100 outline-none font-black text-2xl text-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-500 uppercase mb-2 tracking-widest">Target Alokasi Dana Desa (ADD)</label>
                  <input 
                    type="number" required
                    value={ceilingFormData.add}
                    onChange={e => setCeilingFormData({...ceilingFormData, add: Number(e.target.value)})}
                    className="w-full px-8 py-5 border-2 border-slate-100 bg-slate-50 rounded-[24px] focus:ring-4 focus:ring-blue-100 outline-none font-black text-2xl text-blue-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-black text-slate-500 uppercase mb-2 tracking-widest">Target BHP</label>
                    <input 
                      type="number" required
                      value={ceilingFormData.bhp}
                      onChange={e => setCeilingFormData({...ceilingFormData, bhp: Number(e.target.value)})}
                      className="w-full px-6 py-4 border-2 border-slate-100 bg-slate-50 rounded-[20px] focus:ring-4 focus:ring-blue-100 outline-none font-bold text-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-slate-500 uppercase mb-2 tracking-widest">Target PADes</label>
                    <input 
                      type="number" required
                      value={ceilingFormData.pad}
                      onChange={e => setCeilingFormData({...ceilingFormData, pad: Number(e.target.value)})}
                      className="w-full px-6 py-4 border-2 border-slate-100 bg-slate-50 rounded-[20px] focus:ring-4 focus:ring-blue-100 outline-none font-bold text-xl"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-6 pt-10 border-t border-slate-100">
                <button type="button" onClick={() => setShowCeilingModal(false)} className="px-10 py-5 bg-slate-100 text-slate-600 rounded-[24px] font-black text-base uppercase tracking-widest">Batal</button>
                <button type="submit" className="px-12 py-5 bg-blue-600 text-white rounded-[24px] font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 uppercase tracking-widest">Simpan Pagu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomePage;
