import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import CleanUPSidebar from '@/Components/CleanUPSidebar';
import AbsensiFloatingButton from '@/Components/AbsensiFloatingButton';

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
        phone: string;
        pic_name: string;
    };
    cleanup: {
        id: number;
        name: string;
    } | null;
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
    flash: {
        success?: string;
        error?: string;
    };
}

export default function Dashboard({ daysOfWeek, selectedDay, targetDate, isToday, pickups, auth, flash }: Props) {
    const [activeModal, setActiveModal] = useState<number | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [fileSizeError, setFileSizeError] = useState<string | null>(null);

    const MAX_FILE_MB = 10;
    const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

    const handleImageChange = (field: 'organic_image' | 'anorganic_image' | 'residue_image', file: File | null) => {
        if (file && file.size > MAX_FILE_BYTES) {
            setFileSizeError(`Foto "${file.name}" terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal ${MAX_FILE_MB}MB per foto.`);
            return;
        }
        setFileSizeError(null);
        setData(field, file);
    };

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
        router.get(route('cleanup.dashboard'), { day }, { preserveState: true });
    };

    const handleUpdateStatus = (pickupId: number, status: string, reason?: string) => {
        router.put(route('cleanup.updateStatus', pickupId), { status, cancellation_reason: reason }, {
            preserveScroll: true
        });
    };

    const handleOpenSubmitModal = (pickupId: number) => {
        reset();
        setFileSizeError(null);
        setActiveModal(pickupId);
    };

    const handleSubmitPickup = (e: React.FormEvent, pickupId: number) => {
        e.preventDefault();
        if (fileSizeError) return;
        postSubmit(route('cleanup.submitPickup', pickupId), {
            preserveScroll: true,
            onSuccess: () => setActiveModal(null),
        });
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="CleanUP Dashboard" />

             {/* Sidebar Component */}
             <CleanUPSidebar 
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
                                <img className="rounded-full w-full h-full object-cover" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=ffffff&color=16a34a&bold=true`} alt="CleanUP avatar" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-800 leading-none mb-1">{auth.user.name}</span>
                                <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider leading-none">Mitra CleanUP</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 sm:px-10 py-8 pb-24 relative z-10 w-full max-w-5xl mx-auto">

                     {/* Flash Messages */}
                     {flash?.error && (
                         <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3.5 rounded-2xl shadow-sm">
                             <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                             </svg>
                             <span>{flash.error}</span>
                         </div>
                     )}
                     {flash?.success && (
                         <div className="mb-6 flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-3.5 rounded-2xl shadow-sm">
                             <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                             </svg>
                             <span>{flash.success}</span>
                         </div>
                     )}

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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-900">Jadwal: {selectedDay}</h2>
                            <p className="text-gray-500 text-sm mt-1">Daftar lokasi untuk <span className="font-bold">{targetDate}</span>.</p>
                            {!isToday && <p className="text-xs font-bold text-red-500 mt-2 bg-red-50 inline-block px-3 py-1 rounded-md border border-red-100">⚠️ Anda hanya dapat memproses pengambilan untuk jadwal hari ini.</p>}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">Filter:</span>
                            {(['all', 'pending', 'completed'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setStatusFilter(f)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                                        statusFilter === f
                                            ? f === 'completed' ? 'bg-green-600 text-white border-green-600'
                                              : f === 'pending' ? 'bg-amber-500 text-white border-amber-500'
                                              : 'bg-gray-900 text-white border-gray-900'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {f === 'all' ? `Semua (${pickups.length})` : f === 'pending' ? `Belum Selesai (${pickups.filter(p => p.status !== 'completed' && p.status !== 'failed').length})` : `Selesai (${pickups.filter(p => p.status === 'completed' || p.status === 'failed').length})`}
                                </button>
                            ))}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {pickups
                                .filter(pickup => {
                                    if (statusFilter === 'pending') return pickup.status !== 'completed' && pickup.status !== 'failed';
                                    if (statusFilter === 'completed') return pickup.status === 'completed' || pickup.status === 'failed';
                                    return true;
                                })
                                .map((pickup) => {
                                const status = pickup.status;
                                
                                return (
                                    <div key={pickup.id} className={`bg-white rounded-2xl p-5 flex flex-col justify-between transition-all border relative overflow-hidden group ${
                                        status === 'completed' ? 'border-green-200 bg-green-50/30' : 
                                        status === 'on_the_way' ? 'border-emerald-300 shadow-sm' : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                                    }`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="pr-2">
                                                <h3 className="text-[17px] font-bold text-gray-900 leading-tight mb-1.5">{pickup.company.company_name}</h3>
                                                <div className="text-sm text-gray-500 leading-snug">
                                                    <span className="line-clamp-2">{pickup.company.address}</span>
                                                </div>
                                                {/* CleanUP badge — shown when pickup has been handled */}
                                                {pickup.cleanup && (
                                                    <div className={`mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                                        status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        {status === 'completed' ? 'Diselesaikan oleh' : 'Dikerjakan oleh'}: {pickup.cleanup.name}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-shrink-0">
                                                {status === 'completed' && <span className="text-[10px] font-bold tracking-wider uppercase text-green-700 bg-green-100 px-2.5 py-1 rounded-md">Selesai</span>}
                                                {status === 'failed' && <span className="text-[10px] font-bold tracking-wider uppercase text-red-700 bg-red-100 px-2.5 py-1 rounded-md">Gagal</span>}
                                                {status === 'scheduled' && <span className="text-[10px] font-bold tracking-wider uppercase text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">Terjadwal</span>}
                                                {status === 'on_the_way' && <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> OTW</span>}
                                            </div>
                                        </div>

                                        {pickup.company.phone && (
                                            <div className="mb-4">
                                                <a 
                                                    href={`https://wa.me/${pickup.company.phone.replace(/^0/, '62')}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-100"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                                                    Hubungi PIC: {pickup.company.pic_name}
                                                </a>
                                            </div>
                                        )}

                                        <div className="pt-4 border-t border-gray-100 flex gap-2">
                                            {isToday && status !== 'completed' && status !== 'failed' ? (
                                                <>
                                                    {status === 'scheduled' && (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(pickup.id, 'on_the_way')}
                                                            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all"
                                                        >
                                                            Mulai Pickup
                                                        </button>
                                                    )}
                                                    
                                                    {status === 'on_the_way' && (
                                                        <button 
                                                            onClick={() => handleOpenSubmitModal(pickup.id)}
                                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all"
                                                        >
                                                            Input & Selesai
                                                        </button>
                                                    )}
                                                    
                                                    <button 
                                                        onClick={() => {
                                                            const reason = prompt("Alasan pembatalan (misal: Tutup, Tidak ada sampah):");
                                                            if (reason) handleUpdateStatus(pickup.id, 'failed', reason);
                                                        }}
                                                        className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-sm font-semibold rounded-xl transition-colors"
                                                    >
                                                        Batal
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="w-full text-center py-2.5 bg-gray-50 rounded-xl text-xs font-semibold text-gray-500 border border-gray-100">
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

                                    {/* File size error banner */}
                                    {fileSizeError && (
                                        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl mb-2">
                                            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <span>{fileSizeError}</span>
                                        </div>
                                    )}
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
                                                    onChange={e => handleImageChange('organic_image', e.target.files ? e.target.files[0] : null)}
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
                                                    onChange={e => handleImageChange('anorganic_image', e.target.files ? e.target.files[0] : null)}
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
                                                    onChange={e => handleImageChange('residue_image', e.target.files ? e.target.files[0] : null)}
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
                                    disabled={processingSubmit || !!fileSizeError}
                                    className={`w-full font-extrabold text-lg py-4 rounded-2xl transition-all flex items-center justify-center hover:-translate-y-0.5 text-white ${
                                        fileSizeError
                                            ? 'bg-red-400 cursor-not-allowed opacity-80'
                                            : 'bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(22,163,74,0.3)]'
                                    }`}
                                >
                                    {fileSizeError
                                        ? 'Foto Terlalu Besar — Ganti Foto'
                                        : processingSubmit ? 'Menyimpan & Memproses...' : 'Simpan Data Pengambilan'}
                                    {!processingSubmit && !fileSizeError && <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <AbsensiFloatingButton />
        </div>
    );
}
