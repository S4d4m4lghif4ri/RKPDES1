
import React, { useState } from 'react';
import { useApp } from '../App';
import { 
  Building2, MapPin, User, Mail, Phone, 
  Globe, Edit3, Save, X, Hash, Landmark,
  ShieldCheck, FileBadge
} from 'lucide-react';
import { VillageProfile } from '../types';

const ProfilePage: React.FC = () => {
  const { villageProfile, setVillageProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<VillageProfile>(villageProfile);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setVillageProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(villageProfile);
    setIsEditing(false);
  };

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Profil Desa</h2>
          <p className="text-slate-500">Identitas resmi desa dan susunan pemerintahan.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
          >
            <Edit3 className="w-4 h-4" /> Edit Profil
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Visual & Identitas Utama */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden text-center p-8">
            <div className="w-32 h-32 bg-blue-50 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white shadow-xl">
              <Building2 className="w-16 h-16 text-blue-600" />
            </div>
            <h3 className="text-2xl font-black text-blue-900 leading-tight mb-2">
              {villageProfile.name}
            </h3>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-500 mb-6">
              <Hash className="w-3 h-3" />
              KODE DESA: {villageProfile.code}
            </div>
            <div className="space-y-4 pt-6 border-t border-slate-50">
              <div className="flex items-start gap-4 text-left">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                <div className="text-sm">
                  <p className="font-bold text-slate-800">Alamat</p>
                  <p className="text-slate-500 leading-relaxed">{villageProfile.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-left">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <div className="text-sm">
                  <p className="font-bold text-slate-800">Kontak</p>
                  <p className="text-slate-500">{villageProfile.phone || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-left">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <div className="text-sm">
                  <p className="font-bold text-slate-800">Email Resmi</p>
                  <p className="text-slate-500">{villageProfile.email || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-3xl text-white shadow-xl shadow-blue-100">
            <h4 className="font-bold flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-blue-300" />
              Situs Web Desa
            </h4>
            <p className="text-blue-100 text-sm mb-4">Akses informasi publik desa melalui portal resmi:</p>
            <a 
              href={`https://${villageProfile.website}`} 
              target="_blank" 
              rel="noreferrer"
              className="block w-full text-center py-2.5 bg-blue-700/50 hover:bg-blue-700 rounded-xl border border-blue-500/30 font-bold transition-all"
            >
              {villageProfile.website || 'Belum diatur'}
            </a>
          </div>
        </div>

        {/* Right Column: Form Edit atau Info Pemerintahan */}
        <div className="lg:col-span-2">
          {isEditing ? (
            <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-600" />
                  Mode Pengeditan Profil
                </h3>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Nama Desa</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Kode Desa (Kemendagri)</label>
                    <input 
                      type="text" 
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Alamat Kantor Desa</label>
                    <textarea 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Kecamatan</label>
                    <input 
                      type="text" 
                      value={formData.subDistrict}
                      onChange={(e) => setFormData({...formData, subDistrict: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Kabupaten/Kota</label>
                    <input 
                      type="text" 
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Struktur Pemerintahan
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Nama Kepala Desa</label>
                      <input 
                        type="text" 
                        value={formData.villageHead}
                        onChange={(e) => setFormData({...formData, villageHead: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">NIP Kepala Desa</label>
                      <input 
                        type="text" 
                        value={formData.villageHeadNip}
                        onChange={(e) => setFormData({...formData, villageHeadNip: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Sekretaris Desa</label>
                      <input 
                        type="text" 
                        value={formData.secretary}
                        onChange={(e) => setFormData({...formData, secretary: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Bendahara Desa</label>
                      <input 
                        type="text" 
                        value={formData.treasurer}
                        onChange={(e) => setFormData({...formData, treasurer: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-8 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
                  >
                    <X className="w-4 h-4" /> Batal
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Simpan Perubahan
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              {/* Wilayah Admin */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-blue-600" /> Wilayah Administratif
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Kecamatan</p>
                    <p className="font-bold text-slate-800">{villageProfile.subDistrict}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Kabupaten/Kota</p>
                    <p className="font-bold text-slate-800">{villageProfile.district}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Provinsi</p>
                    <p className="font-bold text-slate-800">{villageProfile.province}</p>
                  </div>
                </div>
              </div>

              {/* Aparatur Desa */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 bg-slate-50 border-b border-slate-100">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-600" /> Pejabat Berwenang
                  </h4>
                </div>
                <div className="p-0">
                  <AparaturItem 
                    title="Kepala Desa" 
                    name={villageProfile.villageHead} 
                    sub={villageProfile.villageHeadNip ? `NIP. ${villageProfile.villageHeadNip}` : 'Non-PNS'} 
                    icon={<FileBadge className="w-6 h-6 text-blue-600" />}
                  />
                  <AparaturItem 
                    title="Sekretaris Desa" 
                    name={villageProfile.secretary} 
                    icon={<User className="w-6 h-6 text-slate-400" />}
                  />
                  <AparaturItem 
                    title="Bendahara Desa" 
                    name={villageProfile.treasurer} 
                    last
                    icon={<User className="w-6 h-6 text-slate-400" />}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AparaturItem = ({ title, name, sub, icon, last }: any) => (
  <div className={`p-8 flex items-center justify-between ${!last ? 'border-b border-slate-50' : ''}`}>
    <div className="flex items-center gap-6">
      <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-lg font-black text-slate-800 leading-tight">{name}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
    <div className="hidden sm:block">
       <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-full border border-green-100">Aktif</span>
    </div>
  </div>
);

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default ProfilePage;
