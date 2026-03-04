
export enum UserRole {
  ADMIN = 'ADMIN',
  KEPALA_DESA = 'KEPALA_DESA',
  KEPALA_BIDANG = 'KEPALA_BIDANG',
  OPERATOR = 'OPERATOR'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  sector?: string;
}

export interface VillageProfile {
  name: string;
  code: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  villageHead: string;
  villageHeadNip?: string;
  secretary: string;
  treasurer: string;
  phone?: string;
  email?: string;
  website?: string;
}

export enum BudgetStatus {
  PLANNING = 'Perencanaan',
  APPROVED = 'Disetujui',
  REVISION = 'Revisi'
}

export enum Sector {
  GOVERNANCE = 'Penyelenggaraan Pemerintahan Desa',
  DEVELOPMENT = 'Pelaksanaan Pembangunan Desa',
  COMMUNITY_DEV = 'Pembinaan Kemasyarakatan',
  EMPOWERMENT = 'Pemberdayaan Masyarakat',
  DISASTER = 'Penanggulangan Bencana / Darurat'
}

export interface StandardPrice {
  id: string;
  name: string;
  category: 'Bahan' | 'Alat' | 'Upah';
  unit: string;
  price: number;
}

export interface AccountConfig {
  sector: Sector;
  prefix: string;
}

export interface FundCeiling {
  year: number;
  dd: number;
  add: number;
  bhp: number;
  pad: number;
}

export interface Income {
  id: string;
  year: number;
  type: 'PADes' | 'Transfer' | 'Lain-lain';
  description: string;
  source: string;
  amount: number;
  note: string;
  document?: string;
}

export interface Expenditure {
  id: string;
  year: number;
  sector: Sector;
  activityType: 'Fisik' | 'Non-Fisik';
  activityName: string;
  accountCode: string;
  location: string;
  manager: string;
  source: string;
  budgetCap: number;
  status: BudgetStatus;
  planningImage?: string;
  document?: string;
}

export interface RABItem {
  id: string;
  expenditureId: string;
  accountCode: string;
  description: string;
  category: 'Bahan' | 'Alat' | 'Upah';
  volume: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface Financing {
  id: string;
  year: number;
  type: 'Penerimaan' | 'Pengeluaran';
  description: string;
  amount: number;
  note: string;
}

/**
 * Interface for realization data structure
 */
export interface Realization {
  id: string;
  expenditureId: string;
  date: string;
  description: string;
  amount: number;
  recipient: string;
  documentNumber: string;
}
