
import React from 'react';
import { useApp } from '../App';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { 
  ArrowUpRight, Activity, AlertCircle, 
  CheckCircle2, Clock, Wallet, Landmark
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { expenditures, financings, selectedYear, fundCeilings } = useApp();

  const yearExpenditures = expenditures.filter(e => e.year === selectedYear);
  const yearFinancings = financings.filter(f => f.year === selectedYear);
  const currentCeiling = fundCeilings.find(c => c.year === selectedYear) || { dd: 0, add: 0, bhp: 0, pad: 0 };

  const totalPaguPendapatan = currentCeiling.dd + currentCeiling.add + currentCeiling.bhp + currentCeiling.pad;
  const totalRencanaBelanja = yearExpenditures.reduce((acc, curr) => acc + curr.budgetCap, 0);
  
  const netFinancing = yearFinancings.reduce((acc, curr) => 
    curr.type === 'Penerimaan' ? acc + curr.amount : acc - curr.amount, 0);

  const surplus = totalPaguPendapatan - totalRencanaBelanja + netFinancing;

  // Chart Data
  const compositionData = [
    { name: 'Target Pendapatan', value: totalPaguPendapatan, color: '#2563eb' },
    { name: 'Rencana Belanja', value: totalRencanaBelanja, color: '#16a34a' },
    { name: 'Rencana Pembiayaan', value: Math.abs(netFinancing), color: '#d97706' },
  ];

  const sectorData = yearExpenditures.reduce((acc: any[], curr) => {
    const existing = acc.find(a => a.name === curr.sector);
    if (existing) {
      existing.value += curr.budgetCap;
    } else {
      acc.push({ name: curr.sector.split(' ').slice(0, 1).join(' '), value: curr.budgetCap });
    }
    return acc;
  }, []);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const allocationRate = totalPaguPendapatan > 0 ? (totalRencanaBelanja / totalPaguPendapatan) * 100 : 0;

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Ringkasan Perencanaan</h2>
          <p className="text-lg text-slate-500 font-medium">Monitoring alokasi anggaran APBDes Tahun {selectedYear}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="px-6 py-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 font-black text-base flex items-center gap-3 shadow-sm">
            <CheckCircle2 className="w-6 h-6" />
            Mode Perencanaan Aktif
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <SummaryCard 
          label="Total Pagu Dana" 
          value={formatCurrency(totalPaguPendapatan)} 
          sub="Target Penerimaan Desa" 
          type="neutral" 
          icon={<Landmark className="text-blue-600 w-6 h-6" />}
          color="blue"
        />
        
        <SummaryCard 
          label="Total Rencana Belanja" 
          value={formatCurrency(totalRencanaBelanja)} 
          sub={`${allocationRate.toFixed(1)}% Dana Teralokasi`} 
          type="neutral" 
          icon={<Wallet className="text-green-600 w-6 h-6" />}
          color="green"
        />

        <SummaryCard 
          label="Rencana Pembiayaan" 
          value={formatCurrency(netFinancing)} 
          sub="SiLPA / Penyertaan Modal" 
          type="neutral" 
          icon={<Activity className="text-amber-600 w-6 h-6" />}
          color="amber"
        />
        <SummaryCard 
          label="Sisa Dana (Belum Direncanakan)" 
          value={formatCurrency(surplus)} 
          sub={surplus >= 0 ? "Anggaran Seimbang" : "Defisit: Rencana > Pagu"} 
          type={surplus >= 0 ? "up" : "down"} 
          icon={<AlertCircle className={surplus >= 0 ? "text-blue-600 w-6 h-6" : "text-red-600 w-6 h-6"} />}
          color={surplus >= 0 ? "indigo" : "red"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-8 border-b border-slate-50 pb-4">Struktur Anggaran</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={compositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {compositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend verticalAlign="bottom" height={40} iconType="circle" wrapperStyle={{fontSize: '14px', fontWeight: 'bold'}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-8 border-b border-slate-50 pb-4">Distribusi Belanja per Bidang</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} />
                <Tooltip cursor={{fill: '#f8fafc'}} formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Planning Items */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
          <Clock className="w-6 h-6 text-blue-600" />
          Daftar Usulan Kegiatan Terbaru
        </h3>
        <div className="divide-y divide-slate-100">
          {yearExpenditures.slice(0, 5).map(e => (
            <div key={e.id} className="py-5 flex items-center justify-between group cursor-pointer hover:bg-slate-50 rounded-xl transition-all px-2">
              <div>
                <p className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{e.activityName}</p>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Pagu: {formatCurrency(e.budgetCap)} | {e.sector}</p>
              </div>
              <div className={`text-xs px-3 py-1.5 rounded-full font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100`}>
                {e.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, sub, type, icon, color, children }: any) => {
  const colorMap: any = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    amber: 'bg-amber-50 border-amber-200',
    indigo: 'bg-indigo-50 border-indigo-200',
    red: 'bg-red-50 border-red-200',
  };

  return (
    <div className={`p-8 rounded-3xl shadow-sm border ${colorMap[color] || 'bg-white border-slate-200'} flex flex-col transition-transform hover:scale-105 duration-300`}>
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-100">{icon}</div>
      </div>
      <p className="text-sm font-black text-slate-500 mb-2 uppercase tracking-widest">{label}</p>
      <h4 className="text-[22px] font-black text-slate-900 truncate leading-tight mb-2">{value}</h4>
      <p className="text-sm text-slate-600 font-bold opacity-80">{sub}</p>
      {children}
    </div>
  );
};

export default Dashboard;
