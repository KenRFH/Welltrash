import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import CleanUPSidebar from '@/Components/CleanUPSidebar';
import AbsensiFloatingButton from '@/Components/AbsensiFloatingButton';

interface Pickup {
    id: number;
    status: 'completed' | 'failed';
    organic_weight: number | null;
    anorganic_weight: number | null;
    residue_weight: number | null;
    trash_bag_count?: number | null;
    evidence_pickup_path: string | null;
    cancellation_reason: string | null;
    pickup_date: string;
    company: {
        id: number;
        company_name: string;
        address: string;
    };
}

interface Props {
    pickups: Pickup[];
    auth: {
        user: { name: string; email: string };
    };
}

export default function History({ pickups, auth }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Riwayat CleanUP" />

            {/* Sidebar Component */}
            <CleanUPSidebar 
                active="history" 
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-green-50 to-emerald-50 opacity-50 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>

                {/* Header Navbar */}
                <header className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-10 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-1.5 text-gray-600 hover:text-green-600 md:hidden focus:outline-none rounded-xl hover:bg-gray-100/70 transition-colors"
                            aria-label="Buka Menu"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <div className="min-w-0">
                            <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight truncate">Riwayat Pengambilan</h2>
                            <p className="text-[11px] text-gray-500 font-medium hidden sm:block truncate">Daftar penjemputan sampah yang telah selesai</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(true)}
                            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-1 sm:p-1.5 sm:pr-4 rounded-full border border-gray-100 bg-white hover:bg-gray-50 hover:shadow-sm transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                            title="Profil & Pengaturan"
                        >
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-green-100 to-emerald-100 flex items-center justify-center p-0.5">
                                <img className="rounded-full w-full h-full object-cover" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=ffffff&color=16a34a&bold=true`} alt="CleanUP avatar" />
                            </div>
                            <div className="flex flex-col text-left hidden sm:flex">
                                <span className="text-sm font-bold text-gray-800 leading-none mb-1">{auth.user.name}</span>
                                <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider leading-none">Mitra CleanUP</span>
                            </div>
                        </button>
                    </div>
                </header>

                {/* Body Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 sm:px-10 py-5 sm:py-8 pb-32 md:pb-24 relative z-10 w-full max-w-5xl mx-auto">
                    
                    {pickups.length === 0 ? (
                        <div className="bg-white rounded-3xl p-10 mt-6 text-center border border-dashed border-gray-300 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Belum Ada Riwayat</h3>
                            <p className="text-gray-500 text-sm mt-1">Anda belum menyelesaikan atau membatalkan jadwal apapun.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pickups.map((pickup) => {
                                const isCompleted = pickup.status === 'completed';
                                const dateStr = new Date(pickup.pickup_date).toLocaleDateString('id-ID', {
                                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                                });

                                return (
                                    <div key={pickup.id} className={`bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border transition-all hover:shadow-lg ${isCompleted ? 'border-gray-100 hover:border-green-100' : 'border-red-100'}`}>
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-50 pb-6">
                                            <div>
                                                <span className="text-xs font-bold text-gray-400 block mb-1">{dateStr}</span>
                                                <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-2 group-hover:text-green-700 transition-colors">{pickup.company.company_name}</h3>
                                                <div className="flex items-start text-xs text-gray-500 font-medium">
                                                    <svg className="w-4 h-4 mr-1 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    <span className="line-clamp-2 leading-relaxed">{pickup.company.address}</span>
                                                </div>
                                            </div>
                                            <div className="mt-4 sm:mt-0 flex-shrink-0">
                                                {isCompleted ? (
                                                    <span className="inline-flex items-center bg-green-100 text-green-700 text-sm font-bold px-4 py-1.5 rounded-xl border border-green-200">Selesai</span>
                                                ) : (
                                                    <span className="inline-flex items-center bg-red-100 text-red-700 text-sm font-bold px-4 py-1.5 rounded-xl border border-red-200">Dibatalkan</span>
                                                )}
                                            </div>
                                        </div>

                                        {isCompleted ? (
                                            <>
                                                {/* Trashbag indicator if recorded */}
                                                {pickup.trash_bag_count && Number(pickup.trash_bag_count) > 0 && (
                                                    <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold shadow-2xs">
                                                        <span>📦</span>
                                                        <span>Total Trashbag: <strong className="font-black text-blue-900">{pickup.trash_bag_count} Kantong</strong></span>
                                                    </div>
                                                )}

                                                {(Number(pickup.organic_weight || 0) > 0 || Number(pickup.anorganic_weight || 0) > 0 || Number(pickup.residue_weight || 0) > 0) ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                        {/* Organic */}
                                                        <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100/50 flex flex-col items-center sm:items-start text-center sm:text-left relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100/50 rounded-full blur-xl -mr-10 -mt-10"></div>
                                                            <div className="relative z-10 w-full">
                                                                <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 mb-2 justify-center sm:justify-start">
                                                                    <span className="text-xl">🍞</span>
                                                                    <span className="text-sm font-bold text-amber-800">Organik</span>
                                                                </div>
                                                                <div className="text-3xl font-black text-gray-900 mb-3">{pickup.organic_weight || 0} <span className="text-base font-bold text-amber-500">Kg</span></div>
                                                            </div>
                                                        </div>
                                                        {/* Anorganic */}
                                                        <div className="bg-teal-50/50 rounded-2xl p-5 border border-teal-100/50 flex flex-col items-center sm:items-start text-center sm:text-left relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 w-20 h-20 bg-teal-100/50 rounded-full blur-xl -mr-10 -mt-10"></div>
                                                            <div className="relative z-10 w-full">
                                                                <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 mb-2 justify-center sm:justify-start">
                                                                    <span className="text-xl">🛍️</span>
                                                                    <span className="text-sm font-bold text-teal-800">Anorganik</span>
                                                                </div>
                                                                <div className="text-3xl font-black text-gray-900 mb-3">{pickup.anorganic_weight || 0} <span className="text-base font-bold text-teal-500">Kg</span></div>
                                                            </div>
                                                        </div>
                                                        {/* Residue */}
                                                        <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-200/50 flex flex-col items-center sm:items-start text-center sm:text-left relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 w-20 h-20 bg-gray-100 rounded-full blur-xl -mr-10 -mt-10"></div>
                                                            <div className="relative z-10 w-full">
                                                                <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 mb-2 justify-center sm:justify-start">
                                                                    <span className="text-xl">🗑️</span>
                                                                    <span className="text-sm font-bold text-gray-600">Residu</span>
                                                                </div>
                                                                <div className="text-3xl font-black text-gray-900 mb-3">{pickup.residue_weight || 0} <span className="text-base font-bold text-gray-400">Kg</span></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-blue-50/40 rounded-2xl p-4 border border-blue-100 text-xs text-blue-700 font-medium">
                                                        ℹ️ Pengambilan ini diselesaikan dengan metode penghitungan kantong trashbag (tanpa penimbangan berat).
                                                    </div>
                                                )}
                                                
                                                {pickup.evidence_pickup_path && (
                                                    <div className="mt-4 flex justify-end">
                                                        <a href={`/storage/${pickup.evidence_pickup_path}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors shadow-sm">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                            Lihat Bukti Pengambilan
                                                        </a>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="bg-red-50 p-5 rounded-2xl border border-red-100 flex items-start gap-4">
                                                <div className="bg-red-100 p-2 rounded-lg text-red-600">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-red-800 mb-1">Alasan Pembatalan:</p>
                                                    <p className="text-sm text-red-600">"{pickup.cancellation_reason || 'Tidak ada alasan.'}"</p>
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
            <AbsensiFloatingButton />
        </div>
    );
}
