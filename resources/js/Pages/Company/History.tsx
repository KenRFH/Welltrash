import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

import CompanySidebar from '@/Components/CompanySidebar';

// Icons placeholder
const HistoryIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const CalendarIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>;

interface Pickup {
    id: number;
    status: 'completed' | 'failed';
    organic_weight: number | null;
    anorganic_weight: number | null;
    residue_weight: number | null;
    organic_image_path: string | null;
    anorganic_image_path: string | null;
    residue_image_path: string | null;
    cancellation_reason: string | null;
    pickup_date: string;
    driver: {
        id: number;
        name: string;
    } | null;
}

interface Props {
    company: {
        id: number;
        company_name: string;
    };
    auth: {
        user: { name: string; email: string };
    };
    pickups: Pickup[];
}

export default function History({ auth, company, pickups }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Riwayat | WellMaggot" />

            {/* Sidebar Component */}
            <CompanySidebar 
                active="history" 
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-green-50 to-emerald-50 opacity-50 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>

                {/* Header Navbar */}
                <header className="h-24 flex items-center justify-between px-6 sm:px-10 bg-white/60 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex items-center gap-4 flex-1">
                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-500 hover:text-green-600 md:hidden focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">Riwayat Pengambilan</h2>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3 cursor-pointer p-1.5 pr-4 rounded-full border border-gray-100 bg-white hover:bg-gray-50 hover:shadow-sm transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-100 to-emerald-100 flex items-center justify-center p-0.5">
                                <img className="rounded-full w-full h-full object-cover" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=ffffff&color=4f46e5&bold=true`} alt="User avatar" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-800 leading-none mb-1">{auth.user.name}</span>
                                <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider leading-none">{company.company_name}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Body Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 sm:px-10">
                    {pickups.length === 0 ? (
                        <div className="bg-white rounded-3xl p-10 mt-6 text-center border border-dashed border-gray-300 relative z-10">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HistoryIcon />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Belum Ada Riwayat</h3>
                            <p className="text-gray-500 text-sm mt-1">Belum ada data pengambilan sampah yang tercatat untuk perusahaan Anda.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 relative z-10">
                            {pickups.map((pickup) => {
                                const isCompleted = pickup.status === 'completed';
                                const dateStr = new Date(pickup.pickup_date).toLocaleDateString('id-ID', {
                                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                                });

                                return (
                                    <div key={pickup.id} className={`bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border transition-all hover:shadow-md ${isCompleted ? 'border-gray-100 hover:border-green-100' : 'border-red-100'}`}>
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-50 pb-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isCompleted ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                        <CalendarIcon />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-extrabold text-gray-900 leading-tight">{dateStr}</h3>
                                                        <p className="text-xs font-bold text-gray-500 mt-1">Supir: {pickup.driver?.name || 'Belum Ditugaskan'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 md:mt-0">
                                                {isCompleted ? (
                                                    <span className="inline-flex items-center bg-green-50 text-green-700 text-sm font-bold px-4 py-1.5 rounded-full border border-green-100">
                                                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Selesai
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center bg-red-50 text-red-700 text-sm font-bold px-4 py-1.5 rounded-full border border-red-100">
                                                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> Dibatalkan
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {isCompleted ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                {/* Organic */}
                                                <div className="bg-amber-50/30 rounded-2xl p-5 border border-amber-100/50 flex flex-col items-center sm:items-start relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100/50 rounded-full blur-xl -mr-10 -mt-10"></div>
                                                    <div className="flex items-center gap-2 mb-3 relative z-10 w-full justify-center sm:justify-start">
                                                        <span className="text-xl">🍞</span>
                                                        <span className="text-sm font-bold text-amber-800">Organik</span>
                                                    </div>
                                                    <div className="text-3xl font-black text-gray-900 mb-4 relative z-10">{pickup.organic_weight} <span className="text-base font-bold text-amber-500">Kg</span></div>
                                                    {pickup.organic_image_path && (
                                                        <a href={`/storage/${pickup.organic_image_path}`} target="_blank" rel="noreferrer" className="w-full text-center text-xs font-bold bg-white border border-amber-200 text-amber-700 px-4 py-2 rounded-xl hover:bg-amber-50 hover:border-amber-300 transition-colors relative z-10 shadow-sm">
                                                            Lihat Foto Bukti
                                                        </a>
                                                    )}
                                                </div>

                                                {/* Anorganic */}
                                                <div className="bg-teal-50/30 rounded-2xl p-5 border border-teal-100/50 flex flex-col items-center sm:items-start relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 w-20 h-20 bg-teal-100/50 rounded-full blur-xl -mr-10 -mt-10"></div>
                                                    <div className="flex items-center gap-2 mb-3 relative z-10 w-full justify-center sm:justify-start">
                                                        <span className="text-xl">🛍️</span>
                                                        <span className="text-sm font-bold text-teal-800">Anorganik</span>
                                                    </div>
                                                    <div className="text-3xl font-black text-gray-900 mb-4 relative z-10">{pickup.anorganic_weight} <span className="text-base font-bold text-teal-500">Kg</span></div>
                                                    {pickup.anorganic_image_path && (
                                                        <a href={`/storage/${pickup.anorganic_image_path}`} target="_blank" rel="noreferrer" className="w-full text-center text-xs font-bold bg-white border border-teal-200 text-teal-700 px-4 py-2 rounded-xl hover:bg-teal-50 hover:border-teal-300 transition-colors relative z-10 shadow-sm">
                                                            Lihat Foto Bukti
                                                        </a>
                                                    )}
                                                </div>

                                                {/* Residue */}
                                                <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-200/50 flex flex-col items-center sm:items-start relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gray-100 rounded-full blur-xl -mr-10 -mt-10"></div>
                                                    <div className="flex items-center gap-2 mb-3 relative z-10 w-full justify-center sm:justify-start">
                                                        <span className="text-xl">🗑️</span>
                                                        <span className="text-sm font-bold text-gray-600">Residu</span>
                                                    </div>
                                                    <div className="text-3xl font-black text-gray-900 mb-4 relative z-10">{pickup.residue_weight} <span className="text-base font-bold text-gray-400">Kg</span></div>
                                                    {pickup.residue_image_path && (
                                                        <a href={`/storage/${pickup.residue_image_path}`} target="_blank" rel="noreferrer" className="w-full text-center text-xs font-bold bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors relative z-10 shadow-sm">
                                                            Lihat Foto Bukti
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100 flex items-start gap-4">
                                                <div className="bg-red-100 p-2 rounded-lg text-red-600">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-red-800 mb-1">Alasan Pembatalan:</p>
                                                    <p className="text-sm text-red-600">{pickup.cancellation_reason || 'Tidak ada alasan.'}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
