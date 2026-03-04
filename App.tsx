
import React, { useState, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import IncomePage from './pages/IncomePage';
import ExpenditurePage from './pages/ExpenditurePage';
import RABDetailPage from './pages/RABDetailPage';
import FinancingPage from './pages/FinancingPage';
import RealizationPage from './pages/RealizationPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ReportPage from './pages/ReportPage';
import { 
  User, UserRole, Income, Expenditure, RABItem, Financing, FundCeiling, VillageProfile, StandardPrice, AccountConfig, Realization 
} from './types';
import { 
  INITIAL_INCOMES, INITIAL_EXPENDITURES, INITIAL_RAB, INITIAL_FINANCING, INITIAL_CEILINGS, INITIAL_VILLAGE_PROFILE,
  INITIAL_STANDARD_PRICES, INITIAL_ACCOUNT_CONFIGS, INITIAL_REALIZATIONS
} from './constants';

interface AppState {
  user: User | null;
  setUser: (u: User | null) => void;
  villageProfile: VillageProfile;
  setVillageProfile: React.Dispatch<React.SetStateAction<VillageProfile>>;
  incomes: Income[];
  setIncomes: React.Dispatch<React.SetStateAction<Income[]>>;
  expenditures: Expenditure[];
  setExpenditures: React.Dispatch<React.SetStateAction<Expenditure[]>>;
  rabItems: RABItem[];
  setRabItems: React.Dispatch<React.SetStateAction<RABItem[]>>;
  financings: Financing[];
  setFinancings: React.Dispatch<React.SetStateAction<Financing[]>>;
  realizations: Realization[];
  setRealizations: React.Dispatch<React.SetStateAction<Realization[]>>;
  fundCeilings: FundCeiling[];
  setFundCeilings: React.Dispatch<React.SetStateAction<FundCeiling[]>>;
  standardPrices: StandardPrice[];
  setStandardPrices: React.Dispatch<React.SetStateAction<StandardPrice[]>>;
  accountConfigs: AccountConfig[];
  setAccountConfigs: React.Dispatch<React.SetStateAction<AccountConfig[]>>;
  selectedYear: number;
  setSelectedYear: (y: number) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>({ id: '1', name: 'Admin Desa', role: UserRole.ADMIN });
  const [villageProfile, setVillageProfile] = useState<VillageProfile>(INITIAL_VILLAGE_PROFILE);
  const [incomes, setIncomes] = useState<Income[]>(INITIAL_INCOMES);
  const [expenditures, setExpenditures] = useState<Expenditure[]>(INITIAL_EXPENDITURES);
  const [rabItems, setRabItems] = useState<RABItem[]>(INITIAL_RAB);
  const [financings, setFinancings] = useState<Financing[]>(INITIAL_FINANCING);
  const [realizations, setRealizations] = useState<Realization[]>(INITIAL_REALIZATIONS);
  const [fundCeilings, setFundCeilings] = useState<FundCeiling[]>(INITIAL_CEILINGS);
  const [standardPrices, setStandardPrices] = useState<StandardPrice[]>(INITIAL_STANDARD_PRICES);
  const [accountConfigs, setAccountConfigs] = useState<AccountConfig[]>(INITIAL_ACCOUNT_CONFIGS);
  const [selectedYear, setSelectedYear] = useState(2024);

  const state = {
    user, setUser, villageProfile, setVillageProfile, incomes, setIncomes,
    expenditures, setExpenditures, rabItems, setRabItems,
    financings, setFinancings, realizations, setRealizations, 
    fundCeilings, setFundCeilings, standardPrices, setStandardPrices,
    accountConfigs, setAccountConfigs, selectedYear, setSelectedYear
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">Login Perencanaan Desa</h1>
          <div className="space-y-4">
            <button onClick={() => setUser({ id: '1', name: 'Admin Perencanaan', role: UserRole.ADMIN })} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Login as Admin</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={state}>
      <HashRouter>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/income" element={<IncomePage />} />
                <Route path="/expenditure" element={<ExpenditurePage />} />
                <Route path="/expenditure/:id" element={<RABDetailPage />} />
                <Route path="/realization" element={<RealizationPage />} />
                <Route path="/financing" element={<FinancingPage />} />
                <Route path="/report" element={<ReportPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
