import { Head, Link, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';

import DriverSidebar from '@/Components/DriverSidebar';

// Icons
const CameraIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

interface Pickup {
    id: number;
    status: 'scheduled' | 'on_the_way' | 'completed' | 'failed';
    organic_weight: number | null;
    pickup_date: string;
    company: {
        id: number;
        company_name: string;
        address: string;
    };
}

interface Props {
    daysOfWeek: string[];
    selectedDay: string;
    targetDate: string;
    isToday: boolean;
    pickups: Pickup[];
    auth: {
        user: { name: string; email: string };
    };
}

export default function Dashboard({ daysOfWeek, selectedDay, targetDate, isToday, pickups, auth }: Props) {
    const [activeModal, setActiveModal] = useState<number | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Form for status update
    const { post: postStatus, processing: processingStatus } = useForm();
    
    // Form for final submission
    const { data, setData, post: postSubmit, processing: processingSubmit, errors, reset } = useForm({
        organic_weight: '',
        anorganic_weight: '',
        residue_weight: '',
        organic_image: null as File | null,
        anorganic_image: null as File | null,
        residue_image: null as File | null,
    });

    const handleDayClick = (day: string) => {
        router.get(route('driver.dashboard'), { day }, { preserveState: true });
    };

    const handleUpdateStatus = (pickupId: number, status: string, reason?: string) => {
        router.post(route('driver.pickup.status', pickupId), { status, cancellation_reason: reason }, {
            preserveScroll: true
        });
    };

    const handleOpenSubmitModal = (pickupId: number) => {
        reset();
        setActiveModal(pickupId);
    };

    const handleSubmitPickup = (e: React.FormEvent, pickupId: number) => {
        e.preventDefault();
        postSubmit(route('driver.pickup.submit', pickupId), {
            preserveScroll: true,
            onSuccess: () => setActiveModal(null),
        });
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Driver Dashboard | WellMaggot" />

             {/* Sidebar Component */}
             <DriverSidebar 
                 active="dashboard" 
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
                        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">Tugas Hari Ini</h2>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3 cursor-pointer p-1.5 pr-4 rounded-full border border-gray-100 bg-white hover:bg-gray-50 hover:shadow-sm transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-100 to-emerald-100 flex items-center justify-center p-0.5">
                                <img className="rounded-full w-full h-full object-cover" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=ffffff&color=16a34a&bold=true`} alt="Driver avatar" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-800 leading-none mb-1">{auth.user.name}</span>
                                <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider leading-none">Mitra Pengemudi</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 sm:px-10 py-8 pb-24 relative z-10 w-full max-w-5xl mx-auto">
                     {/* Day Selector Area */}
                     <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Pilih Hari Operasional</h3>
                        <div className="flex flex-wrap gap-2">
                            {daysOfWeek.map((day) => (
                                <button
                                    key={day}
                                    onClick={() => handleDayClick(day)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                                        selectedDay === day
                                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30'
                                            : 'bg-white border text-gray-500 hover:bg-gray-50 hover:text-green-600 border-gray-200'
                                    }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pickups Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-900">Jadwal: {selectedDay}</h2>
                            <p className="text-gray-500 text-sm mt-1">Daftar lokasi untuk <span className="font-bold">{targetDate}</span>.</p>
                            {!isToday && <p className="text-xs font-bold text-red-500 mt-2 bg-red-50 inline-block px-3 py-1 rounded-md border border-red-100">⚠️ Anda hanya dapat memproses pengambilan untuk jadwal hari ini.</p>}
                        </div>
                        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-bold border border-green-100 hidden sm:block">
                            Total: {pickups.length} Lokasi
                        </div>
                    </div>

                    {/* Pickup Cards */}
                    {pickups.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Libur Dulu 🌴</h3>
                            <p className="text-gray-500 text-sm max-w-md mx-auto">Tampaknya jadwal Anda kosong untuk hari ini. Waktunya istirahat atau periksa hari lainnya.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {pickups.map((pickup) => {
                                const status = pickup.status;
                                
                                return (
                                    <div key={pickup.id} className={`bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all hover:shadow-lg border shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden group ${
                                        status === 'completed' ? 'border-green-100 bg-green-50/20' : 
                                        status === 'on_the_way' ? 'border-emerald-200 ring-2 ring-emerald-100' : 'border-gray-100'
                                    }`}>
                                        
                                        {/* Status Indicators background decor */}
                                        {status === 'completed' && <div className="absolute top-0 right-0 w-32 h-32 bg-green-100/40 rounded-full blur-2xl -mr-10 -mt-10"></div>}
                                        {status === 'on_the_way' && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/40 rounded-full blur-2xl -mr-10 -mt-10"></div>}

                                        <div className="relative z-10 flex justify-between items-start mb-6 border-b border-gray-100 pb-5">
                                            <div>
                                                <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-2 group-hover:text-green-700 transition-colors">{pickup.company.company_name}</h3>
                                                <div className="flex items-start text-xs text-gray-500 font-medium">
                                                    <svg className="w-4 h-4 mr-1 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    <span className="line-clamp-2 leading-relaxed">{pickup.company.address}</span>
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-shrink-0">
                                                {status === 'completed' && (
                                                    <span className="inline-flex items-center bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-green-200">Selesai</span>
                                                )}
                                                {status === 'failed' && (
                                                    <span className="inline-flex items-center bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-200">Gagal</span>
                                                )}
                                                {status === 'scheduled' && (
                                                    <span className="inline-flex items-center bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200">Terjadwal</span>
                                                )}
                                                {status === 'on_the_way' && (
                                                    <span className="inline-flex items-center bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-200 animate-pulse">Menuju Lokasi</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons based on status & isToday */}
                                        <div className="relative z-10 pt-2 transition-all">
                                            {isToday && status !== 'completed' && status !== 'failed' ? (
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    {status === 'scheduled' && (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(pickup.id, 'on_the_way')}
                                                            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 text-sm font-bold py-3 px-4 rounded-xl shadow-[0_2px_10px_rgba(250,204,21,0.3)] transition-all text-center flex items-center justify-center hover:-translate-y-0.5"
                                                        >
                                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                            Mulai Pickup (Otw)
                                                        </button>
                                                    )}
                                                    
                                                    {status === 'on_the_way' && (
                                                        <button 
                                                            onClick={() => handleOpenSubmitModal(pickup.id)}
                                                            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-3.5 px-4 rounded-xl shadow-[0_4px_14px_rgba(22,163,74,0.3)] transition-all flex items-center justify-center hover:-translate-y-0.5"
                                                        >
                                                            Input Data & Selesai
                                                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        </button>
                                                    )}
                                                    
                                                    {/* Cancel Option */}
                                                    <button 
                                                        onClick={() => {
                                                            const reason = prompt("Alasan pembatalan (misal: Tutup, Tidak ada sampah):");
                                                            if (reason) handleUpdateStatus(pickup.id, 'failed', reason);
                                                        }}
                                                        className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-sm font-bold rounded-xl transition-colors sm:w-1/3 text-center"
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-center py-2 px-4 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 border border-gray-100">
                                                    {isToday ? 'Tugas telah diproses.' : 'Tugas hanya dapat diproses pada hari kejadian.'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>

                {/* Submission Modal Overlay */}
                {activeModal && (
                    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-opacity p-0 sm:p-4">
                        <div className="bg-white rounded-t-[2rem] sm:rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transform transition-all border border-gray-100">
                            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                                <div>
                                    <h3 className="text-xl font-extrabold text-gray-900">Input Data Sampah</h3>
                                    <p className="text-xs font-medium text-green-700 mt-1">Dokumentasikan jumlah dan berat sampah</p>
                                </div>
                                <button onClick={() => setActiveModal(null)} className="p-2 text-gray-400 hover:text-gray-700 bg-white shadow-sm border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            
                            <div className="overflow-y-auto p-6 pb-8 space-y-5 flex-1 custom-scrollbar">
                                <form id={`submit-form-${activeModal}`} onSubmit={(e) => handleSubmitPickup(e, activeModal)}>
                                    
                                    {/* Organic */}
                                    <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100/60 shadow-sm relative group mb-4">
                                        <h4 className="font-bold text-amber-900 flex items-center mb-3">
                                            <span className="w-6 h-6 bg-amber-200 text-amber-700 rounded-lg flex items-center justify-center mr-2 text-sm">O</span> Organik
                                        </h4>
                                        <div className="flex gap-4">
                                            <div className="flex-1 relative">
                                                <input 
                                                    type="number" step="0.01" min="0" required 
                                                    placeholder="0.00"
                                                    value={data.organic_weight}
                                                    onChange={e => setData('organic_weight', e.target.value)}
                                                    className="w-full text-right pr-12 pl-4 py-3.5 bg-white border-amber-200 rounded-xl focus:ring-amber-500 focus:border-amber-500 font-bold text-lg shadow-inner"
                                                />
                                                <span className="absolute right-4 top-[14px] text-gray-400 font-bold">Kg</span>
                                                {errors.organic_weight && <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-1">{errors.organic_weight}</p>}
                                            </div>
                                            <label className="flex flex-col items-center justify-center w-24 bg-white border border-amber-200 hover:bg-amber-100 text-amber-600 rounded-xl cursor-pointer transition-colors shadow-sm relative overflow-hidden">
                                                {data.organic_image ? (
                                                    <div className="absolute inset-0 bg-amber-500 flex flex-col items-center justify-center text-white">
                                                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        <span className="text-[10px] font-bold">TERFOTO</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <CameraIcon />
                                                        <span className="text-[10px] font-bold mt-1">AMBIL FOTO</span>
                                                    </>
                                                )}
                                                <input 
                                                    type="file" accept="image/*" capture="environment" className="hidden" 
                                                    onChange={e => setData('organic_image', e.target.files ? e.target.files[0] : null)}
                                                />
                                            </label>
                                        </div>
                                        {errors.organic_image && <p className="text-red-500 text-xs mt-2">{errors.organic_image}</p>}
                                    </div>

                                    {/* Anorganic */}
                                    <div className="bg-teal-50/50 p-5 rounded-2xl border border-teal-100/60 shadow-sm relative group mb-4">
                                        <h4 className="font-bold text-teal-900 flex items-center mb-3">
                                            <span className="w-6 h-6 bg-teal-200 text-teal-700 rounded-lg flex items-center justify-center mr-2 text-sm">A</span> Anorganik
                                        </h4>
                                        <div className="flex gap-4">
                                            <div className="flex-1 relative">
                                                <input 
                                                    type="number" step="0.01" min="0" required 
                                                    placeholder="0.00"
                                                    value={data.anorganic_weight}
                                                    onChange={e => setData('anorganic_weight', e.target.value)}
                                                    className="w-full text-right pr-12 pl-4 py-3.5 bg-white border-teal-200 rounded-xl focus:ring-teal-500 focus:border-teal-500 font-bold text-lg shadow-inner"
                                                />
                                                <span className="absolute right-4 top-[14px] text-gray-400 font-bold">Kg</span>
                                                {errors.anorganic_weight && <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-1">{errors.anorganic_weight}</p>}
                                            </div>
                                            <label className="flex flex-col items-center justify-center w-24 bg-white border border-teal-200 hover:bg-teal-100 text-teal-600 rounded-xl cursor-pointer transition-colors shadow-sm relative overflow-hidden">
                                                {data.anorganic_image ? (
                                                    <div className="absolute inset-0 bg-teal-500 flex flex-col items-center justify-center text-white">
                                                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        <span className="text-[10px] font-bold">TERFOTO</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <CameraIcon />
                                                        <span className="text-[10px] font-bold mt-1">AMBIL FOTO</span>
                                                    </>
                                                )}
                                                <input 
                                                    type="file" accept="image/*" capture="environment" className="hidden" 
                                                    onChange={e => setData('anorganic_image', e.target.files ? e.target.files[0] : null)}
                                                />
                                            </label>
                                        </div>
                                        {errors.anorganic_image && <p className="text-red-500 text-xs mt-2">{errors.anorganic_image}</p>}
                                    </div>

                                    {/* Residue */}
                                    <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-200 shadow-sm relative group">
                                        <h4 className="font-bold text-gray-800 flex items-center mb-3">
                                            <span className="w-6 h-6 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center mr-2 text-sm">R</span> Residu
                                        </h4>
                                        <div className="flex gap-4">
                                            <div className="flex-1 relative">
                                                <input 
                                                    type="number" step="0.01" min="0" required 
                                                    placeholder="0.00"
                                                    value={data.residue_weight}
                                                    onChange={e => setData('residue_weight', e.target.value)}
                                                    className="w-full text-right pr-12 pl-4 py-3.5 bg-white border-gray-300 rounded-xl focus:ring-gray-500 focus:border-gray-500 font-bold text-lg shadow-inner"
                                                />
                                                <span className="absolute right-4 top-[14px] text-gray-400 font-bold">Kg</span>
                                                {errors.residue_weight && <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-1">{errors.residue_weight}</p>}
                                            </div>
                                            <label className="flex flex-col items-center justify-center w-24 bg-white border border-gray-300 hover:bg-gray-200 text-gray-600 rounded-xl cursor-pointer transition-colors shadow-sm relative overflow-hidden">
                                                 {data.residue_image ? (
                                                    <div className="absolute inset-0 bg-gray-500 flex flex-col items-center justify-center text-white">
                                                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        <span className="text-[10px] font-bold">TERFOTO</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <CameraIcon />
                                                        <span className="text-[10px] font-bold mt-1">AMBIL FOTO</span>
                                                    </>
                                                )}
                                                <input 
                                                    type="file" accept="image/*" capture="environment" className="hidden" 
                                                    onChange={e => setData('residue_image', e.target.files ? e.target.files[0] : null)}
                                                />
                                            </label>
                                        </div>
                                        {errors.residue_image && <p className="text-red-500 text-xs mt-2">{errors.residue_image}</p>}
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50">
                                <button 
                                    type="submit" 
                                    form={`submit-form-${activeModal}`}
                                    disabled={processingSubmit}
                                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-lg py-4 rounded-2xl shadow-[0_4px_14px_rgba(22,163,74,0.3)] transition-all flex items-center justify-center hover:-translate-y-0.5"
                                >
                                    {processingSubmit ? 'Menyimpan & Memproses...' : 'Simpan Data Pengambilan'}
                                    {!processingSubmit && <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
