import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

interface Pickup {
    id: number;
    pickup_date: string;
    status: 'scheduled' | 'on_the_way' | 'completed' | 'failed' | string;
    organic_weight: number | string | null;
    anorganic_weight: number | string | null;
    residue_weight: number | string | null;
    cancellation_reason: string | null;
    company: {
        id: number;
        company_name: string;
        address: string;
    } | null;
}

interface Driver {
    id: number;
    name: string;
    email: string;
}

interface Props {
    driver: Driver;
    pickups: Pickup[];
}

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
    completed:  { label: 'Selesai',       bg: 'bg-green-50',   text: 'text-green-700',  border: 'border-green-200' },
    failed:     { label: 'Dibatalkan',    bg: 'bg-red-50',     text: 'text-red-700',    border: 'border-red-200' },
    on_the_way: { label: 'Menuju Lokasi', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    scheduled:  { label: 'Terjadwal',    bg: 'bg-gray-100',   text: 'text-gray-700',   border: 'border-gray-200' },
};

export default function DriversShow({ driver, pickups = [] }: Props) {
    const [filter, setFilter] = useState<'all' | 'completed' | 'failed' | 'scheduled' | 'on_the_way'>('all');

    if (!driver) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 p-6">
                <div className="text-center">
                    <h1 className="text-xl font-black text-gray-900 mb-2">Driver Tidak Ditemukan</h1>
                    <Link href="/admin/drivers" className="text-sm font-bold text-blue-600 hover:underline">Kembali ke Daftar</Link>
                </div>
            </div>
        );
    }

    const filtered = filter === 'all' ? pickups : pickups.filter(p => p.status === filter);
    const completed = pickups.filter(p => p.status === 'completed');
    
    const totalOrg = completed.reduce((s, p) => s + Number(p.organic_weight || 0), 0);
    const totalAnorg = completed.reduce((s, p) => s + Number(p.anorganic_weight || 0), 0);
    const totalResidue = completed.reduce((s, p) => s + Number(p.residue_weight || 0), 0);

    return (
        <AdminLayout
            title={driver.name}
            subtitle="Log Aktivitas Driver"
            activeTab="drivers"
            headerAction={
                <Link href="/admin/drivers" className="p-2 bg-white rounded-full text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-all shadow-sm border border-gray-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                </Link>
            }
        >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-amber-200 transition-colors">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🍞</div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Organik</p>
                        <p className="text-2xl font-black text-gray-900 leading-tight">{totalOrg.toFixed(1)} <span className="text-xs font-bold text-amber-400">Kg</span></p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-teal-200 transition-colors">
                    <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🛍️</div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Anorganik</p>
                        <p className="text-2xl font-black text-gray-900 leading-tight">{totalAnorg.toFixed(1)} <span className="text-xs font-bold text-teal-400">Kg</span></p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-gray-300 transition-colors">
                    <div className="w-12 h-12 bg-gray-50 text-gray-500 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🗑️</div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Residu</p>
                        <p className="text-2xl font-black text-gray-900 leading-tight">{totalResidue.toFixed(1)} <span className="text-xs font-bold text-gray-300">Kg</span></p>
                    </div>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
                {(['all', 'completed', 'failed', 'scheduled', 'on_the_way'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            filter === f
                                ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-100'
                                : 'bg-white text-gray-400 border-gray-200 hover:border-orange-200 hover:text-orange-600 shadow-sm'
                        }`}
                    >
                        {f === 'all' ? `Semua (${pickups.length})`
                            : f === 'completed' ? `Selesai (${pickups.filter(p => p.status === 'completed').length})`
                            : f === 'failed' ? `Gagal (${pickups.filter(p => p.status === 'failed').length})`
                            : f === 'on_the_way' ? `OTW (${pickups.filter(p => p.status === 'on_the_way').length})`
                            : `Jadwal (${pickups.filter(p => p.status === 'scheduled').length})`
                        }
                    </button>
                ))}
            </div>

            {/* Activity List */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Tidak ada data untuk filter ini</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((pickup) => {
                        const sc = statusConfig[pickup.status] || { label: pickup.status, bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' };
                        const dateStr = pickup.pickup_date ? new Date(pickup.pickup_date).toLocaleDateString('id-ID', {
                            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                        }) : 'Tanggal tidak valid';
                        const isCompleted = pickup.status === 'completed';

                        return (
                            <div
                                key={pickup.id}
                                className={`bg-white rounded-3xl border shadow-sm hover:shadow-md transition-all overflow-hidden ${sc.border}`}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center p-6 gap-6">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-widest ${sc.bg} ${sc.text} ${sc.border}`}>{sc.label}</span>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{dateStr}</span>
                                        </div>
                                        <h3 className="font-black text-gray-900 text-lg mb-1">{pickup.company?.company_name || 'Tanpa Perusahaan'}</h3>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                            <span className="text-xs font-medium text-gray-400 truncate">{pickup.company?.address || '-'}</span>
                                        </div>
                                    </div>

                                    {isCompleted ? (
                                        <div className="grid grid-cols-3 gap-3 flex-shrink-0 lg:w-72">
                                            <div className="bg-amber-50 rounded-2xl px-3 py-3 text-center border border-amber-100">
                                                <p className="text-[10px] font-black text-amber-600 mb-1 uppercase tracking-widest">Org</p>
                                                <p className="text-base font-black text-gray-900">{Number(pickup.organic_weight || 0)}<span className="text-[10px] ml-0.5 opacity-40">kg</span></p>
                                            </div>
                                            <div className="bg-teal-50 rounded-2xl px-3 py-3 text-center border border-teal-100">
                                                <p className="text-[10px] font-black text-teal-600 mb-1 uppercase tracking-widest">Anorg</p>
                                                <p className="text-base font-black text-gray-900">{Number(pickup.anorganic_weight || 0)}<span className="text-[10px] ml-0.5 opacity-40">kg</span></p>
                                            </div>
                                            <div className="bg-gray-50 rounded-2xl px-3 py-3 text-center border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest">Res</p>
                                                <p className="text-base font-black text-gray-900">{Number(pickup.residue_weight || 0)}<span className="text-[10px] ml-0.5 opacity-40">kg</span></p>
                                            </div>
                                        </div>
                                    ) : pickup.status === 'failed' && pickup.cancellation_reason ? (
                                        <div className="bg-red-50 rounded-2xl px-5 py-4 border border-red-100 lg:w-72">
                                            <p className="text-[10px] font-black text-red-500 mb-1 uppercase tracking-widest">Alasan Gagal</p>
                                            <p className="text-xs text-red-800 font-bold italic">"{pickup.cancellation_reason}"</p>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50/50 rounded-2xl px-5 py-4 border border-gray-100 lg:w-72 flex items-center justify-center">
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Belum Ada Data</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </AdminLayout>
    );
}
