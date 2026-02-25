import { Head, Link, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';

// Icons
const CameraIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = () => <svg className="w-5 h-5 text-gray-500 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

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
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans mb-10 md:mb-0">
            <Head title="Driver Dashboard | WellMaggot" />

            {/* Header */}
            <header className="bg-white px-4 py-4 md:px-6 shadow-sm flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center">
                    <span className="text-xl font-extrabold text-green-600 tracking-tight">WellMaggot</span>
                    <span className="ml-2 text-sm font-bold text-gray-400 border-l border-gray-200 pl-2">Driver</span>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-800 leading-tight">{auth.user.name}</p>
                    </div>
                    <Link href={route('logout')} method="post" as="button" className="p-2 bg-gray-50 rounded-full">
                        <LogoutIcon />
                    </Link>
                </div>
            </header>

            {/* Day Selector (Horizontal Scroll) */}
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-[60px] md:top-[68px] z-20">
                <div className="flex overflow-x-auto no-scrollbar py-3 px-2 sm:px-4">
                    {daysOfWeek.map((day) => (
                        <button
                            key={day}
                            onClick={() => handleDayClick(day)}
                            className={`flex-shrink-0 px-5 py-2 mx-1 rounded-full text-sm font-bold transition-colors ${
                                selectedDay === day
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 pb-24">
                <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Jadwal Pengambilan</h1>
                <p className="text-gray-500 text-sm mb-6">
                    Daftar truk untuk hari <strong>{selectedDay}</strong> ({targetDate}).
                    {!isToday && <span className="block text-red-500 mt-1 font-bold">Aksi hanya dapat dilakukan pada jadwal *Hari Ini*.</span>}
                </p>

                {pickups.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 mt-10 text-center border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Tidak Ada Jadwal</h3>
                        <p className="text-gray-500 text-sm mt-1">Tidak ada perusahaan yang dijadwalkan untuk tanggal ini.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pickups.map((pickup) => {
                            const status = pickup.status;
                            
                            return (
                                <div key={pickup.id} className={`bg-white rounded-3xl p-5 shadow-sm border transition-all ${
                                    status === 'completed' ? 'border-green-200 bg-green-50/30' : 
                                    status === 'on_the_way' ? 'border-blue-300 shadow-md' : 'border-gray-100'
                                }`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-extrabold text-gray-900 leading-tight">{pickup.company.company_name}</h3>
                                            <p className="text-xs text-gray-500 mt-1">{pickup.company.address}</p>
                                        </div>
                                        {status === 'completed' && (
                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Selesai</span>
                                        )}
                                        {status === 'failed' && (
                                            <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">Gagal / Dibatalkan</span>
                                        )}
                                        {status === 'scheduled' && (
                                            <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">Terjadwal</span>
                                        )}
                                    </div>

                                    {/* Action Buttons based on status & isToday */}
                                    {isToday && status !== 'completed' && status !== 'failed' && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                                            {status === 'scheduled' && (
                                                <button 
                                                    onClick={() => handleUpdateStatus(pickup.id, 'on_the_way')}
                                                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 text-sm font-bold py-2.5 px-4 rounded-xl shadow-sm transition-colors text-center"
                                                >
                                                    Otw Lokasi
                                                </button>
                                            )}
                                            
                                            {status === 'on_the_way' && (
                                                <button 
                                                    onClick={() => handleOpenSubmitModal(pickup.id)}
                                                    className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center animate-pulse"
                                                >
                                                    Selesai & Input Data Sampah
                                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                </button>
                                            )}
                                            
                                            {/* Cancel Option */}
                                            <button 
                                                onClick={() => {
                                                    const reason = prompt("Alasan pembatalan (misal: Tutup, Tidak ada sampah):");
                                                    if (reason) handleUpdateStatus(pickup.id, 'failed', reason);
                                                }}
                                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold rounded-xl transition-colors"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Submission Modal Overlay */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/60 transition-opacity p-0 sm:p-4">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transform transition-all">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-extrabold text-gray-900">Input Data Sampah</h3>
                            <button onClick={() => setActiveModal(null)} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto p-5 pb-8 space-y-6 flex-1">
                            <form id={`submit-form-${activeModal}`} onSubmit={(e) => handleSubmitPickup(e, activeModal)}>
                                
                                {/* Organic */}
                                <div className="bg-amber-50/30 p-4 rounded-2xl border border-amber-100 mb-5 relative group">
                                    <h4 className="font-bold text-amber-800 flex items-center mb-3">
                                        <span className="w-3 h-3 bg-amber-400 rounded-full mr-2"></span> Organik
                                    </h4>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <input 
                                                    type="number" step="0.01" min="0" required 
                                                    placeholder="0.00"
                                                    value={data.organic_weight}
                                                    onChange={e => setData('organic_weight', e.target.value)}
                                                    className="w-full text-right pr-10 pl-4 py-3 bg-white border-amber-200 rounded-xl focus:ring-amber-500 focus:border-amber-500 font-bold text-lg"
                                                />
                                                <span className="absolute right-4 top-3.5 text-gray-400 font-bold">Kg</span>
                                            </div>
                                            {errors.organic_weight && <p className="text-red-500 text-xs mt-1">{errors.organic_weight}</p>}
                                        </div>
                                        <label className="flex flex-col items-center justify-center w-20 bg-amber-500 hover:bg-amber-600 text-white rounded-xl cursor-pointer transition-colors shadow-sm">
                                            <CameraIcon />
                                            <span className="text-[10px] font-bold mt-1 text-amber-100">{data.organic_image ? 'OK ✓' : 'FOTO'}</span>
                                            <input 
                                                type="file" accept="image/*" capture="environment" className="hidden" 
                                                onChange={e => setData('organic_image', e.target.files ? e.target.files[0] : null)}
                                            />
                                        </label>
                                    </div>
                                    {errors.organic_image && <p className="text-red-500 text-xs mt-1">{errors.organic_image}</p>}
                                </div>

                                {/* Anorganic */}
                                <div className="bg-teal-50/30 p-4 rounded-2xl border border-teal-100 mb-5 relative group">
                                    <h4 className="font-bold text-teal-800 flex items-center mb-3">
                                        <span className="w-3 h-3 bg-teal-400 rounded-full mr-2"></span> Anorganik
                                    </h4>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <input 
                                                    type="number" step="0.01" min="0" required 
                                                    placeholder="0.00"
                                                    value={data.anorganic_weight}
                                                    onChange={e => setData('anorganic_weight', e.target.value)}
                                                    className="w-full text-right pr-10 pl-4 py-3 bg-white border-teal-200 rounded-xl focus:ring-teal-500 focus:border-teal-500 font-bold text-lg"
                                                />
                                                <span className="absolute right-4 top-3.5 text-gray-400 font-bold">Kg</span>
                                            </div>
                                            {errors.anorganic_weight && <p className="text-red-500 text-xs mt-1">{errors.anorganic_weight}</p>}
                                        </div>
                                        <label className="flex flex-col items-center justify-center w-20 bg-teal-500 hover:bg-teal-600 text-white rounded-xl cursor-pointer transition-colors shadow-sm">
                                            <CameraIcon />
                                            <span className="text-[10px] font-bold mt-1 text-teal-100">{data.anorganic_image ? 'OK ✓' : 'FOTO'}</span>
                                            <input 
                                                type="file" accept="image/*" capture="environment" className="hidden" 
                                                onChange={e => setData('anorganic_image', e.target.files ? e.target.files[0] : null)}
                                            />
                                        </label>
                                    </div>
                                    {errors.anorganic_image && <p className="text-red-500 text-xs mt-1">{errors.anorganic_image}</p>}
                                </div>

                                {/* Residu */}
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-2 relative group">
                                    <h4 className="font-bold text-gray-700 flex items-center mb-3">
                                        <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span> Residu
                                    </h4>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <input 
                                                    type="number" step="0.01" min="0" required 
                                                    placeholder="0.00"
                                                    value={data.residue_weight}
                                                    onChange={e => setData('residue_weight', e.target.value)}
                                                    className="w-full text-right pr-10 pl-4 py-3 bg-white border-gray-300 rounded-xl focus:ring-gray-500 focus:border-gray-500 font-bold text-lg"
                                                />
                                                <span className="absolute right-4 top-3.5 text-gray-400 font-bold">Kg</span>
                                            </div>
                                            {errors.residue_weight && <p className="text-red-500 text-xs mt-1">{errors.residue_weight}</p>}
                                        </div>
                                        <label className="flex flex-col items-center justify-center w-20 bg-gray-500 hover:bg-gray-600 text-white rounded-xl cursor-pointer transition-colors shadow-sm">
                                            <CameraIcon />
                                            <span className="text-[10px] font-bold mt-1 text-gray-100">{data.residue_image ? 'OK ✓' : 'FOTO'}</span>
                                            <input 
                                                type="file" accept="image/*" capture="environment" className="hidden" 
                                                onChange={e => setData('residue_image', e.target.files ? e.target.files[0] : null)}
                                            />
                                        </label>
                                    </div>
                                    {errors.residue_image && <p className="text-red-500 text-xs mt-1">{errors.residue_image}</p>}
                                </div>
                            </form>
                        </div>

                        <div className="p-5 border-t border-gray-100 bg-white">
                            <button 
                                type="submit" 
                                form={`submit-form-${activeModal}`}
                                disabled={processingSubmit}
                                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-lg py-4 rounded-2xl shadow-lg shadow-green-600/20 transition-all flex items-center justify-center"
                            >
                                {processingSubmit ? 'Menyimpan...' : 'Simpan Data Pengambilan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
