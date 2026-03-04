
import { Sector, BudgetStatus, Income, Expenditure, RABItem, Financing, FundCeiling, VillageProfile, StandardPrice, AccountConfig, Realization } from './types';

export const INITIAL_VILLAGE_PROFILE: VillageProfile = {
  name: 'Desa Maju Sejahtera',
  code: '32.01.05.2001',
  address: 'Jl. Raya Desa No. 45, Kompleks Perkantoran Desa',
  subDistrict: 'Kecamatan Cemerlang',
  district: 'Kabupaten Gemilang',
  province: 'Provinsi Harapan',
  villageHead: 'Bpk. Suhardi, S.Sos',
  villageHeadNip: '19750812 200501 1 002',
  secretary: 'Ibu Fitria Rahmawati',
  treasurer: 'Bpk. Ahmad Jaelani',
  phone: '021-88997766',
  email: 'pemdes@maju-sejahtera.desa.id',
  website: 'www.maju-sejahtera.desa.id'
};

export const INITIAL_ACCOUNT_CONFIGS: AccountConfig[] = [
  { sector: Sector.GOVERNANCE, prefix: '1' },
  { sector: Sector.DEVELOPMENT, prefix: '2' },
  { sector: Sector.COMMUNITY_DEV, prefix: '3' },
  { sector: Sector.EMPOWERMENT, prefix: '4' },
  { sector: Sector.DISASTER, prefix: '5' },
];

export const INITIAL_STANDARD_PRICES: StandardPrice[] = [
  { id: 'p1', name: 'Semen Portland 50kg', category: 'Bahan', unit: 'Zak', price: 75000 },
  { id: 'p2', name: 'Pasir Beton', category: 'Bahan', unit: 'm3', price: 250000 },
  { id: 'p3', name: 'Batu Kali/Belah', category: 'Bahan', unit: 'm3', price: 280000 },
  { id: 'p4', name: 'Tukang Batu', category: 'Upah', unit: 'HOK', price: 120000 },
  { id: 'p5', name: 'Pekerja', category: 'Upah', unit: 'HOK', price: 90000 },
  { id: 'p6', name: 'Sewa Molen', category: 'Alat', unit: 'Hari', price: 350000 },
];

export const ACCOUNT_CODES = {
  INCOME: {
    PAD: { prefix: '4.1', label: 'Pendapatan Asli Desa' },
    DD: { prefix: '4.2.1', label: 'Dana Desa' },
    BHP: { prefix: '4.2.2', label: 'Bagi Hasil Pajak & Retribusi' },
    ADD: { prefix: '4.2.3', label: 'Alokasi Dana Desa' },
    BK_PROV: { prefix: '4.2.4', label: 'Bantuan Keuangan Provinsi' },
    BK_KAB: { prefix: '4.2.5', label: 'Bantuan Keuangan Kab/Kota' },
    LAIN_LAIN: { prefix: '4.3', label: 'Pendapatan Lain-lain' },
  },
  EXPENDITURE: {
    PEGAWAI: { prefix: '5.1', label: 'Belanja Pegawai' },
    BARANG_JASA: { prefix: '5.2', label: 'Belanja Barang dan Jasa' },
    MODAL: { prefix: '5.3', label: 'Belanja Modal' },
    TAK_TERDUGA: { prefix: '5.4', label: 'Belanja Tak Terduga' },
  },
  FINANCING: {
    RECEIPT: { prefix: '6.1', label: 'Penerimaan Pembiayaan' },
    DISBURSEMENT: { prefix: '6.2', label: 'Pengeluaran Pembiayaan' },
  }
};

export const INITIAL_INCOMES: Income[] = [
  { id: '1', year: 2024, type: 'Transfer', description: 'Dana Desa Tahap 1', source: 'DD', amount: 500000000, note: 'Pencairan rutin' },
  { id: '2', year: 2024, type: 'PADes', description: 'Hasil BUMDes', source: 'PAD', amount: 75000000, note: 'Profit tahun lalu' },
];

export const INITIAL_CEILINGS: FundCeiling[] = [
  { year: 2024, dd: 1000000000, add: 600000000, bhp: 150000000, pad: 200000000 },
];

export const INITIAL_EXPENDITURES: Expenditure[] = [
  { 
    id: 'exp1', year: 2024, sector: Sector.DEVELOPMENT, activityType: 'Fisik',
    activityName: 'Pembangunan Jalan Lingkungan', accountCode: '2.2.01', 
    location: 'Dusun I', manager: 'Kasi Pembangunan', source: 'Dana Desa', 
    budgetCap: 200000000, status: BudgetStatus.PLANNING 
  },
];

export const INITIAL_RAB: RABItem[] = [
  { id: 'rab1', expenditureId: 'exp1', accountCode: '5.2.1.01', description: 'Semen Portland 50kg', category: 'Bahan', volume: 100, unit: 'Zak', unitPrice: 75000, total: 7500000 },
];

export const INITIAL_FINANCING: Financing[] = [
  { id: 'f1', year: 2024, type: 'Penerimaan', description: 'SiLPA 2023', amount: 45000000, note: 'Sisa lebih anggaran' },
];

export const INITIAL_REALIZATIONS: Realization[] = [];

export const SECTORS = Object.values(Sector);
export const BUDGET_YEARS = [2023, 2024, 2025];
