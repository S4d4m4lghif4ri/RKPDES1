
import React, { useMemo } from 'react';
import { useApp } from '../App';
import { FileText, Printer, Download, Calculator, Building2 } from 'lucide-react';
import { Sector } from '../types';
import { SECTORS } from '../constants';

const ReportPage: React.FC = () => {
  const { expenditures, financings, selectedYear, villageProfile, fundCeilings } = useApp();

  const currentCeiling = fundCeilings.find(c => c.year === selectedYear) || { dd: 0, add: 0, bhp: 0, pad: 0 };
  const yearExpenditures = expenditures.filter(e => e.year === selectedYear);
  const yearFinancings = financings.filter(f => f.year === selectedYear);

  const totalIncome = currentCeiling.dd + currentCeiling.add + currentCeiling.bhp + currentCeiling.pad;

  // Group Expenditures by Sector
  const expenditureSummary = useMemo(() => {
    return SECTORS.map(sector => ({
      name: sector,
      amount: yearExpenditures.filter(e => e.sector === sector).reduce((a, b) => a + b.budgetCap, 0)
    }));
  }, [yearExpenditures]);

  const totalExpenditure = expenditureSummary.reduce((a, b) => a + b.amount, 0);

  // Financing
  const financingSummary = useMemo(() => {
    return {
      receipt: yearFinancings.filter(f => f.type === 'Penerimaan').reduce((a, b) => a + b.amount, 0),
      disbursement: yearFinancings.filter(f => f.type === 'Pengeluaran').reduce((a, b) => a + b.amount, 0),
    };
  }, [yearFinancings]);

  const netFinancing = financingSummary.receipt - financingSummary.disbursement;
  const surplusDefisit = totalIncome - totalExpenditure;
  const silpa = surplusDefisit + netFinancing;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="animate-fadeIn space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Rancangan APBDes</h2>
          <p className="text-lg text-slate-500 font-medium">Laporan rencana struktur anggaran desa Tahun {selectedYear}</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-5 h-5" /> Export Excel
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-3 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:scale-105"
          >
            <Printer className="w-6 h-6" /> Cetak Rancangan
          </button>
        </div>
      </div>

      {/* Report Container */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden print:shadow-none print:border-none">
        {/* Header Laporan */}
        <div className="p-12 border-b-4 border-double border-slate-200 text-center bg-slate-50/30">
          <Building2 className="w-16 h-16 text-blue-900 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Rancangan Anggaran Pendapatan dan Belanja Desa</h1>
          <h2 className="text-2xl font-black text-blue-900 uppercase mt-1">Desa {villageProfile.name}</h2>
          <p className="text-xl text-slate-500 font-bold mt-2 italic">Tahun Anggaran {selectedYear}</p>
        </div>

        {/* Content Table */}
        <div className="p-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-slate-900 text-slate-900 text-sm font-black uppercase tracking-widest">
                <th className="px-6 py-6 w-24">KODE</th>
                <th className="px-6 py-6">URAIAN RENCANA</th>
                <th className="px-6 py-6 text-right w-64">JUMLAH (IDR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-lg">
              {/* 4. PENDAPATAN */}
              <tr className="bg-slate-50/50 font-black">
                <td className="px-6 py-6">4.</td>
                <td className="px-6 py-6">PENDAPATAN DESA (PAGU)</td>
                <td className="px-6 py-6 text-right">{formatCurrency(totalIncome)}</td>
              </tr>
              <tr className="text-slate-600 font-bold italic">
                <td className="px-6 py-4 pl-12 text-base">4.1.</td>
                <td className="px-6 py-4 text-base">Pendapatan Asli Desa (PADes)</td>
                <td className="px-6 py-4 text-right text-base">{formatCurrency(currentCeiling.pad)}</td>
              </tr>
              <tr className="text-slate-600 font-bold italic">
                <td className="px-6 py-4 pl-12 text-base">4.2.</td>
                <td className="px-6 py-4 text-base">Pendapatan Transfer</td>
                <td className="px-6 py-4 text-right text-base">{formatCurrency(currentCeiling.dd + currentCeiling.add + currentCeiling.bhp)}</td>
              </tr>
              <tr className="text-slate-500 text-sm font-medium">
                <td className="px-6 py-2 pl-20 italic">4.2.1.</td>
                <td className="px-6 py-2 italic">Dana Desa (DD)</td>
                <td className="px-6 py-2 text-right italic">{formatCurrency(currentCeiling.dd)}</td>
              </tr>
              <tr className="text-slate-500 text-sm font-medium">
                <td className="px-6 py-2 pl-20 italic">4.2.2.</td>
                <td className="px-6 py-2 italic">Alokasi Dana Desa (ADD)</td>
                <td className="px-6 py-2 text-right italic">{formatCurrency(currentCeiling.add)}</td>
              </tr>
              <tr className="text-slate-500 text-sm font-medium">
                <td className="px-6 py-2 pl-20 italic">4.2.3.</td>
                <td className="px-6 py-2 italic">Bagi Hasil Pajak & Retribusi</td>
                <td className="px-6 py-2 text-right italic">{formatCurrency(currentCeiling.bhp)}</td>
              </tr>

              {/* 5. BELANJA */}
              <tr className="bg-slate-50/50 font-black pt-10">
                <td className="px-6 py-6">5.</td>
                <td className="px-6 py-6">RENCANA BELANJA DESA</td>
                <td className="px-6 py-6 text-right">{formatCurrency(totalExpenditure)}</td>
              </tr>
              {expenditureSummary.map((item, idx) => (
                <tr key={idx} className="text-slate-600 font-bold italic">
                  <td className="px-6 py-4 pl-12 text-base">5.{idx+1}.</td>
                  <td className="px-6 py-4 text-base">Bidang {item.name}</td>
                  <td className="px-6 py-4 text-right text-base">{formatCurrency(item.amount)}</td>
                </tr>
              ))}

              {/* SURPLUS / DEFISIT */}
              <tr className={`font-black ${surplusDefisit >= 0 ? 'text-green-700 bg-green-50/30' : 'text-red-700 bg-red-50/30'}`}>
                <td className="px-6 py-8"></td>
                <td className="px-6 py-8 text-xl uppercase tracking-widest">SURPLUS / (DEFISIT) RENCANA</td>
                <td className="px-6 py-8 text-right text-2xl">{formatCurrency(surplusDefisit)}</td>
              </tr>

              {/* 6. PEMBIAYAAN */}
              <tr className="bg-slate-50/50 font-black">
                <td className="px-6 py-6">6.</td>
                <td className="px-6 py-6">RENCANA PEMBIAYAAN</td>
                <td className="px-6 py-6 text-right">{formatCurrency(netFinancing)}</td>
              </tr>
              <tr className="text-slate-600 font-bold italic">
                <td className="px-6 py-4 pl-12 text-base">6.1.</td>
                <td className="px-6 py-4 text-base">Penerimaan Pembiayaan (SiLPA)</td>
                <td className="px-6 py-4 text-right text-base">{formatCurrency(financingSummary.receipt)}</td>
              </tr>
              <tr className="text-slate-600 font-bold italic border-b-2">
                <td className="px-6 py-4 pl-12 text-base">6.2.</td>
                <td className="px-6 py-4 text-base">Pengeluaran Pembiayaan (Penyertaan Modal)</td>
                <td className="px-6 py-4 text-right text-base">({formatCurrency(financingSummary.disbursement)})</td>
              </tr>

              {/* SILPA AKHIR */}
              <tr className="bg-blue-900 text-white font-black">
                <td className="px-6 py-10"></td>
                <td className="px-6 py-10 text-2xl uppercase tracking-[5px] flex items-center gap-4">
                  <Calculator className="w-8 h-8 text-green-400" />
                  Sisa Lebih Pembiayaan (Estimasi SiLPA Akhir)
                </td>
                <td className="px-6 py-10 text-right text-3xl text-green-400 tracking-tighter">{formatCurrency(silpa)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-16 grid grid-cols-2 gap-20 text-center font-black uppercase text-sm tracking-widest mt-10">
          <div>
            <p className="mb-32">Mengesahkan,<br/>Kepala Desa {villageProfile.name}</p>
            <div className="w-64 mx-auto border-b-2 border-slate-900 pb-2 mb-1">{villageProfile.villageHead}</div>
            <p className="text-xs font-bold text-slate-500 lowercase italic">NIP: {villageProfile.villageHeadNip || '-'}</p>
          </div>
          <div>
            <p className="mb-32">Dibuat Oleh,<br/>Tim Pelaksana Perencanaan</p>
            <div className="w-64 mx-auto border-b-2 border-slate-900 pb-2 mb-1">{villageProfile.secretary}</div>
            <p className="text-xs font-bold text-slate-500 lowercase italic">Draft Rancangan: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
