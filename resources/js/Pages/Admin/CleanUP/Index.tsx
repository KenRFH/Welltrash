import React, { useState, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminFleetGpsCard from '@/Components/AdminFleetGpsCard';
import { Link } from '@inertiajs/react';
import {
    Truck,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    ArrowUpDown,
    ArrowUpRight,
    Award,
    TrendingUp,
    Shield,
    Activity,
    Calendar,
    X,
} from 'lucide-react';

interface CleanUP {
    id: number;
    name: string;
    email: string;
    total_pickups: number;
    completed_pickups: number;
    failed_pickups: number;
    last_activity: string | null;
    vehicle?: {
        id: number;
        name: string;
        license_plate: string;
        type: string;
    } | null;
}

interface Props {
    cleanups: CleanUP[];
}

export default function Index({ cleanups }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'pickups' | 'rate' | 'name' | 'activity'>('pickups');

    // Infographics & Aggregates
    const totalFleet = cleanups.length;
    const totalPickups = useMemo(() => cleanups.reduce((acc, c) => acc + (c.total_pickups || 0), 0), [cleanups]);
    const totalCompleted = useMemo(() => cleanups.reduce((acc, c) => acc + (c.completed_pickups || 0), 0), [cleanups]);
    const totalFailed = useMemo(() => cleanups.reduce((acc, c) => acc + (c.failed_pickups || 0), 0), [cleanups]);

    const overallSuccessRate = totalPickups > 0 ? Math.round((totalCompleted / totalPickups) * 100) : 0;
    const avgPerDriver = totalFleet > 0 ? (totalPickups / totalFleet).toFixed(1) : '0';

    // Top performer
    const topPerformer = useMemo(() => {
        if (cleanups.length === 0) return null;
        return [...cleanups].sort((a, b) => (b.completed_pickups || 0) - (a.completed_pickups || 0))[0];
    }, [cleanups]);

    // Filter & Sort
    const filteredCleanups = useMemo(() => {
        return cleanups
            .filter((c) => {
                const q = searchQuery.toLowerCase();
                return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
            })
            .sort((a, b) => {
                if (sortBy === 'pickups') {
                    return (b.total_pickups || 0) - (a.total_pickups || 0);
                }
                if (sortBy === 'rate') {
                    const rateA = (a.total_pickups || 0) > 0 ? (a.completed_pickups || 0) / a.total_pickups : 0;
                    const rateB = (b.total_pickups || 0) > 0 ? (b.completed_pickups || 0) / b.total_pickups : 0;
                    return rateB - rateA;
                }
                if (sortBy === 'name') {
                    return a.name.localeCompare(b.name);
                }
                if (sortBy === 'activity') {
                    if (!a.last_activity) return 1;
                    if (!b.last_activity) return -1;
                    return new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime();
                }
                return 0;
            });
    }, [cleanups, searchQuery, sortBy]);

    return (
        <AdminLayout
            title="Armada & Personel CleanUP"
            subtitle="Monitoring performa ritase penjemputan limbah dan log aktivitas driver"
            activeTab="cleanups"
        >
            <div className="space-y-6">
                {/* 1. Infographic Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Armada</span>
                            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                                <Truck className="w-4.5 h-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                            {totalFleet}
                            <span className="text-xs font-medium text-slate-400 ml-1 font-sans">Driver</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            <span>Rata-rata </span>
                            <span className="font-bold text-slate-700">{avgPerDriver} trip / driver</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Penjemputan</span>
                            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Activity className="w-4.5 h-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-emerald-700 tracking-tight tabular-nums">
                            {totalPickups}
                            <span className="text-xs font-medium text-slate-400 ml-1 font-sans">Trip</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>{totalCompleted} penjemputan selesai</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tingkat Keberhasilan</span>
                            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                                <CheckCircle2 className="w-4.5 h-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-teal-700 tracking-tight tabular-nums">
                            {overallSuccessRate}%
                            <span className="text-xs font-medium text-slate-400 ml-1 font-sans">Sukses</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            <span className="text-rose-600 font-semibold">{totalFailed} gagal</span>
                            <span>dari {totalPickups} trip</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Driver Paling Aktif</span>
                            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Award className="w-4.5 h-4.5" />
                            </div>
                        </div>
                        <div className="text-lg font-extrabold text-slate-900 tracking-tight truncate" title={topPerformer?.name || '-'}>
                            {topPerformer ? topPerformer.name : 'Belum Ada'}
                        </div>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            {topPerformer ? (
                                <span className="font-bold text-amber-600">{topPerformer.completed_pickups} trip sukses</span>
                            ) : (
                                <span>Menunggu aktivitas</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Live GPS Fleet Tracking Map */}
                <AdminFleetGpsCard />


                {/* 2. Visual Trip Distribution & Driver Performance Chart */}
                {cleanups.length > 0 && totalPickups > 0 && (
                    <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                                        Distribusi Ritase Penjemputan per Personel
                                    </h3>
                                </div>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">
                                    Komparasi jumlah penjemputan berhasil dan tingkat penyelesaian tugas driver
                                </p>
                            </div>
                            <span className="text-xs font-semibold text-slate-500">
                                Total {totalCompleted} Penjemputan Selesai
                            </span>
                        </div>

                        <div className="space-y-3">
                            {cleanups.slice(0, 5).map((cleanup) => {
                                const rate = cleanup.total_pickups > 0 ? Math.round((cleanup.completed_pickups / cleanup.total_pickups) * 100) : 0;
                                const barWidth = totalPickups > 0 ? Math.max(4, Math.round((cleanup.total_pickups / totalPickups) * 100)) : 0;
                                return (
                                    <div key={cleanup.id} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-semibold text-slate-800">{cleanup.name}</span>
                                            <div className="flex items-center gap-3 text-slate-500">
                                                <span className="font-bold text-slate-900">{cleanup.completed_pickups} <span className="font-normal text-slate-400 text-[11px]">selesai</span></span>
                                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                                    rate >= 90 ? 'bg-emerald-50 text-emerald-700' : rate >= 70 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {rate}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-md overflow-hidden flex">
                                            <div
                                                style={{ width: `${barWidth}%` }}
                                                className="bg-emerald-500 rounded-md transition-all duration-500"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 3. Search & Sort Bar */}
                <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari nama driver atau email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Urutkan:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                        >
                            <option value="pickups">Penjemputan Terbanyak</option>
                            <option value="rate">Tingkat Keberhasilan</option>
                            <option value="name">Nama (A - Z)</option>
                            <option value="activity">Aktivitas Terbaru</option>
                        </select>
                    </div>
                </div>

                {/* 4. Table Container */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                Daftar Personel CleanUP
                            </h2>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                Menampilkan {filteredCleanups.length} dari {totalFleet} personel aktif
                            </p>
                        </div>
                    </div>

                    {filteredCleanups.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                                <Truck className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800">Tidak ada data driver ditemukan</h4>
                            <p className="text-xs text-slate-400 font-medium mt-1">
                                Coba ubah kata kunci pencarian.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-100 text-left">
                                    <thead>
                                        <tr className="bg-slate-50/75">
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                Personel CleanUP
                                            </th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                                                Ritase (Total / Selesai / Gagal)
                                            </th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                                                Keberhasilan
                                            </th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                Aktivitas Terakhir
                                            </th>
                                            <th className="px-5 py-3.5 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                Tindakan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">

                                        {filteredCleanups.map((cleanup) => {
                                            const rate = cleanup.total_pickups > 0 ? Math.round((cleanup.completed_pickups / cleanup.total_pickups) * 100) : 0;
                                            return (
                                                <tr key={cleanup.id} className="hover:bg-slate-50/70 transition-colors group">
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-extrabold text-xs shrink-0">
                                                                {cleanup.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                                                    {cleanup.name}
                                                                </div>
                                                                <div className="text-xs text-slate-400 font-medium mt-0.5">
                                                                    {cleanup.email}
                                                                </div>
                                                                {cleanup.vehicle ? (
                                                                    <div className="flex items-center gap-1.5 mt-1">
                                                                        <span className="font-mono font-bold px-1.5 py-0.2 bg-slate-900 text-white rounded text-[10px]">
                                                                            {cleanup.vehicle.license_plate}
                                                                        </span>
                                                                        <span className="text-[11px] text-slate-600 font-medium truncate max-w-[150px]">
                                                                            {cleanup.vehicle.name}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-[10px] text-slate-400 italic mt-0.5">Belum pilih armada</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold">
                                                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold" title="Total Ritase">
                                                                {cleanup.total_pickups}
                                                            </span>
                                                            <span className="text-slate-300">/</span>
                                                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold" title="Selesai">
                                                                {cleanup.completed_pickups}
                                                            </span>
                                                            <span className="text-slate-300">/</span>
                                                            <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold" title="Gagal">
                                                                {cleanup.failed_pickups}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4 text-center">
                                                        <div className="inline-flex items-center gap-2">
                                                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                <div
                                                                    style={{ width: `${rate}%` }}
                                                                    className={`h-full rounded-full ${
                                                                        rate >= 80 ? 'bg-emerald-500' : rate >= 50 ? 'bg-amber-500' : 'bg-slate-300'
                                                                    }`}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-700">{rate}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-xs font-medium text-slate-600">
                                                        {cleanup.last_activity ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                                <span>{new Date(cleanup.last_activity).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 italic">Belum ada trip</span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <Link
                                                            href={route('admin.cleanups.show', cleanup.id)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs"
                                                        >
                                                            <span>Log Aktivitas</span>
                                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card Feed View */}
                            <div className="md:hidden divide-y divide-slate-100">
                                {filteredCleanups.map((cleanup) => {
                                    const rate = cleanup.total_pickups > 0 ? Math.round((cleanup.completed_pickups / cleanup.total_pickups) * 100) : 0;
                                    return (
                                        <div key={cleanup.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-extrabold text-xs shrink-0">
                                                        {cleanup.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 text-sm">{cleanup.name}</h3>
                                                        <p className="text-xs text-slate-400 font-medium">
                                                            {cleanup.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                    rate >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {rate}% Sukses
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-xs py-2.5 px-3 rounded-lg bg-slate-50 border border-slate-100 mb-3">
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ritase Selesai</span>
                                                    <span className="font-semibold text-slate-800 mt-0.5 inline-block">{cleanup.completed_pickups} dari {cleanup.total_pickups} trip</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Aktivitas Terakhir</span>
                                                    <span className="font-medium text-slate-600 mt-0.5 inline-block">
                                                        {cleanup.last_activity ? new Date(cleanup.last_activity).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Belum ada'}
                                                    </span>
                                                </div>
                                            </div>

                                            <Link
                                                href={route('admin.cleanups.show', cleanup.id)}
                                                className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white text-center hover:bg-slate-800 transition-colors block"
                                            >
                                                Lihat Log Aktivitas Lengkap
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
