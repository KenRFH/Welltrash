import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

import CompanySidebar from '@/Components/CompanySidebar';

const CalendarIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>;

interface Pickup {
    id: number;
    pickup_date: string;
    status: 'scheduled' | 'on_the_way' | 'completed' | 'failed';
    organic_weight: number | null;
    anorganic_weight: number | null;
    residue_weight: number | null;
    cancellation_reason: string | null;
}

interface Company {
    id: number;
    company_name: string;
    pickup_schedule: string[];
}

interface Props {
    company: Company;
    pickups: Pickup[];
}

const DAYS_OF_WEEK = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function Schedule({ company, pickups }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        pickup_schedule: company.pickup_schedule || [],
    });

    const toggleDay = (day: string) => {
        if (data.pickup_schedule.includes(day)) {
            setData('pickup_schedule', data.pickup_schedule.filter(d => d !== day));
        } else {
            setData('pickup_schedule', [...data.pickup_schedule, day]);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('company.schedule.update'), {
            preserveScroll: true
        });
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'completed': return <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-green-100 text-green-700 border border-green-200">Selesai</span>;
            case 'scheduled': return <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-100 text-gray-700 border border-gray-200">Terjadwal</span>;
            case 'on_the_way': return <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-yellow-100 text-yellow-700 border border-yellow-200">Menuju Lokasi</span>;
            case 'failed': return <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-100 text-red-700 border border-red-200">Batal / Gagal</span>;
            default: return null;
        }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Jadwal Pengambilan | WellMaggot" />

             {/* Sidebar Component */}
             <CompanySidebar active="schedule" theme="green" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-green-50 to-emerald-50 opacity-50 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>

                {/* Header Navbar */}
                <header className="h-24 flex items-center justify-between px-6 sm:px-10 bg-white/60 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex-1">
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Manajemen Jadwal</h2>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3 cursor-pointer p-1.5 pr-4 rounded-full border border-gray-100 bg-white hover:bg-gray-50 hover:shadow-sm transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-100 to-emerald-100 flex items-center justify-center p-0.5">
                                <span className="text-green-700 font-bold text-sm">{company.company_name.substring(0, 2).toUpperCase()}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-800 leading-none mb-1">{company.company_name}</span>
                                <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider leading-none">Hub Perusahaan</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 sm:px-10 py-8 pb-24 relative z-10 w-full max-w-5xl mx-auto">
                    
                    {/* Section 1: Manage Schedule Profile */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 mb-8 transition-all hover:shadow-lg">
                        <div className="flex items-start mb-6 border-b border-gray-100 pb-5">
                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mr-4 flex-shrink-0">
                                <CalendarIcon />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-gray-900 mb-1">Pengaturan Hari Penjemputan</h2>
                                <p className="text-gray-500 text-sm">Pilih jadwal rutin penjemputan sampah. Sistem akan otomatis menjadwalkan armada pada hari yang dipilih.</p>
                            </div>
                        </div>
                        
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
                                {DAYS_OF_WEEK.map((day) => {
                                    const isSelected = data.pickup_schedule.includes(day);
                                    return (
                                        <button
                                            type="button"
                                            key={day}
                                            onClick={() => toggleDay(day)}
                                            className={`p-4 rounded-2xl text-center border-2 transition-all font-bold flex flex-col items-center justify-center gap-2 ${
                                                isSelected 
                                                    ? 'bg-green-50 border-green-500 text-green-700 shadow-sm shadow-green-100 transform -translate-y-1' 
                                                    : 'bg-white border-gray-200 text-gray-400 hover:border-green-300 hover:bg-green-50/30'
                                            }`}
                                        >
                                            {isSelected && (
                                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white shadow-sm">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                </div>
                                            )}
                                            {!isSelected && (
                                                 <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                                            )}
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.pickup_schedule && <p className="text-red-500 text-sm mt-1 mb-4 p-3 bg-red-50 rounded-xl">{errors.pickup_schedule}</p>}

                            <div className="flex justify-end pt-4 border-t border-gray-50">
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-[0_4px_14px_rgba(22,163,74,0.3)] transition-all flex items-center disabled:opacity-50 hover:-translate-y-0.5"
                                >
                                    {processing ? 'Menyimpan...' : 'Perbarui Jadwal & Terapkan'}
                                    {!processing && <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Section 2: History and Upcoming Pickups */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 transition-all hover:shadow-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                            <div>
                                <h2 className="text-xl font-extrabold text-gray-900 mb-1">Agenda & Riwayat</h2>
                                <p className="text-gray-500 text-sm">Daftar jadwal terencana yang dibuat otomatis dan aktivitas yang sudah berlalu.</p>
                            </div>
                            <div className="mt-4 sm:mt-0 px-4 py-2 bg-gray-50 rounded-xl text-sm font-bold text-gray-600 border border-gray-200">
                                Total Data: {pickups.length}
                            </div>
                        </div>

                        {pickups.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Belum Ada Agenda</h3>
                                <p className="text-gray-500 text-sm mt-1">Sistem belum menjadwalkan pengambilan untuk perusahaan Anda.</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden border border-gray-100 rounded-2xl">
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead>
                                            <tr className="border-b border-gray-200 text-gray-500 bg-gray-50/80">
                                                <th className="font-bold py-4 pr-4 pl-6 uppercase tracking-wider text-xs">Tanggal Pengambilan</th>
                                                <th className="font-bold py-4 pr-4 uppercase tracking-wider text-xs">Status Penjemputan</th>
                                                <th className="font-bold py-4 pr-4 uppercase tracking-wider text-xstext-center text-xs">Organik</th>
                                                <th className="font-bold py-4 pr-4 uppercase tracking-wider text-xs text-center">Anorganik</th>
                                                <th className="font-bold py-4 pr-6 uppercase tracking-wider text-xs text-center">Residu</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 bg-white">
                                            {pickups.map(pickup => (
                                                <tr key={pickup.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-4 font-bold text-gray-800 tracking-tight pl-6 flex items-center">
                                                        <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                                                        {new Date(pickup.pickup_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </td>
                                                    <td className="py-4"><StatusBadge status={pickup.status} /></td>
                                                    <td className="py-4 font-mono font-medium text-gray-600 bg-gray-50/30 text-center">
                                                        {pickup.status === 'completed' ? (
                                                            <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg border border-amber-100">{pickup.organic_weight} kg</span>
                                                        ) : <span className="text-gray-400">-</span>}
                                                    </td>
                                                    <td className="py-4 font-mono font-medium text-gray-600 text-center">
                                                        {pickup.status === 'completed' ? (
                                                            <span className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-lg border border-teal-100">{pickup.anorganic_weight} kg</span>
                                                        ) : <span className="text-gray-400">-</span>}
                                                    </td>
                                                    <td className="py-4 font-mono font-medium text-gray-600 bg-gray-50/30 text-center pr-6">
                                                        {pickup.status === 'completed' ? (
                                                            <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200">{pickup.residue_weight} kg</span>
                                                        ) : <span className="text-gray-400">-</span>}
                                                        
                                                        {pickup.status === 'failed' && pickup.cancellation_reason && (
                                                            <span className="block text-xs text-red-600 mt-2 bg-red-50 p-2 rounded-lg border border-red-100 text-left whitespace-normal min-w-[150px]" title={pickup.cancellation_reason}>
                                                                <strong>Alasan:</strong> {pickup.cancellation_reason}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
