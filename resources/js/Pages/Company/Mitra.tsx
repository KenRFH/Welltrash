import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import CompanySidebar from '@/Components/CompanySidebar';

interface Props {
    company: {
        id: number;
        company_name: string;
        pic_name: string;
        business_category: string;
        subscription_plan: string;
        subscription_status: string;
        subscription_end_date: string | null;
        address: string;
        phone: string;
    };
    activeDaysLeft: number;
    auth: {
        user: { name: string }
    };
}

export default function Mitra({ auth, company, activeDaysLeft }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        subscription_plan: company.subscription_plan,
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleUpgrade = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('company.mitra.upgrade'), {
            preserveScroll: true,
            onSuccess: () => alert('Permintaan peningkatan layanan telah diajukan kepada sistem.'),
        });
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Kemitraan | WellMaggot" />

            <CompanySidebar 
                active="mitra" 
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                plan={company.subscription_plan}
            />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-green-50 to-emerald-50 opacity-50 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>

                <header className="h-24 flex items-center justify-between px-6 sm:px-10 bg-white/60 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex items-center gap-4 flex-1">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-500 hover:text-green-600 md:hidden focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 hidden sm:block">Detail Kemitraan</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 sm:px-10">
                    <div className="max-w-4xl mx-auto space-y-6">
                        
                        {/* Partnership Overview Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden group">
                            <div className="relative z-10">
                                <h2 className="text-xl font-bold text-gray-900">{company.company_name}</h2>
                                <p className="text-gray-500 font-medium">{company.business_category || 'Kategori Bisnis Tidak Diatur'}</p>
                                <div className="mt-4 flex items-center space-x-4 text-sm font-medium">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700">
                                        Status: {company.subscription_status.toUpperCase()}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                                        Paket: {company.subscription_plan}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6 md:mt-0 text-center md:text-right relative z-10 bg-green-50 px-6 py-4 rounded-2xl border border-green-100">
                                <p className="text-sm font-bold text-green-600 uppercase tracking-wider mb-1">Masa Aktif Tersisa</p>
                                <div className="text-4xl font-extrabold text-green-700">
                                    {activeDaysLeft} <span className="text-lg font-bold text-green-600/70">Hari</span>
                                </div>
                            </div>
                        </div>

                        {/* Partnership Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative z-10">
                                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">Informasi Kontak</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nama PIC</p>
                                        <p className="font-semibold text-gray-800">{company.pic_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email / Kontak</p>
                                        <p className="font-semibold text-gray-800">{company.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Alamat Lengkap</p>
                                        <p className="font-semibold text-gray-800">{company.address}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative z-10">
                                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">Tingkatkan Layanan (Upgrade)</h3>
                                <form onSubmit={handleUpgrade} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Paket Layanan</label>
                                        <select 
                                            value={data.subscription_plan}
                                            onChange={(e) => setData('subscription_plan', e.target.value)}
                                            className="w-full pl-4 pr-10 py-3 rounded-2xl border-gray-200 bg-gray-50/50 text-gray-900 focus:ring-2 focus:ring-green-100 focus:border-green-400 focus:bg-white transition-all shadow-sm"
                                        >
                                            <option value="Basic">Basic</option>
                                            <option value="Premium">Premium</option>
                                            <option value="Premium +">Premium +</option>
                                        </select>
                                        {errors.subscription_plan && <p className="text-red-500 text-sm mt-1">{errors.subscription_plan}</p>}
                                    </div>
                                    
                                    <div className="pt-2">
                                        <button 
                                            type="submit" 
                                            disabled={processing || data.subscription_plan === company.subscription_plan}
                                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            {processing ? 'Memproses...' : 'Kirim Permintaan Upgrade'}
                                        </button>
                                        {data.subscription_plan === company.subscription_plan && (
                                            <p className="text-xs text-gray-500 text-center mt-3">Silakan pilih paket lain untuk melakukan upgrade.</p>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
