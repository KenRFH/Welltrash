import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

interface TrashStat {
    company_name: string;
    subscription_plan: string;
    subscription_status: string;
    organic: number;
    anorganic: number;
    residue: number;
    total_pickups: number;
}

interface Totals {
    organic: number;
    anorganic: number;
    residue: number;
    total_pickups: number;
    total_companies: number;
    active_companies: number;
    pending_companies: number;
}

interface Props {
    trashStats: TrashStat[];
    totals: Totals;
}

const StatCard = ({ label, value, unit, color, icon }: { label: string; value: number | string; unit?: string; color: string; icon: React.ReactNode }) => (
    <div className={`bg-white rounded-2xl p-4 sm:p-6 border shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center gap-4 sm:gap-5 group hover:shadow-lg transition-all border-gray-100 hover:border-orange-100`}>
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">{label}</p>
            <p className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">{value} <span className="text-sm font-bold text-gray-300">{unit}</span></p>
        </div>
    </div>
);

export default function Dashboard({ trashStats, totals }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">Aktif</span>;
            case 'pending': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-100">Menunggu</span>;
            default: return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-50 text-gray-600 border border-gray-100">{status}</span>;
        }
    };

    return (
        <AdminLayout 
            title="Dasbor Admin" 
            subtitle="Ringkasan platform WellTrash" 
            activeTab="dashboard"
        >
            {/* Summary Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    label="Perusahaan" value={totals.total_companies} color="bg-orange-50 text-orange-600"
                    icon={<svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>}
                />
                <StatCard
                    label="Aktif" value={totals.active_companies} color="bg-green-50 text-green-600"
                    icon={<svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>}
                />
                <StatCard
                    label="Approval" value={totals.pending_companies} color="bg-yellow-50 text-yellow-600"
                    icon={<svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                />
                <StatCard
                    label="Total Pickup" value={totals.total_pickups} color="bg-blue-50 text-blue-600"
                    icon={<svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
                />
            </div>

            {/* Waste Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-amber-100 transition-colors" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl">🍞</div>
                            <p className="text-xs font-bold text-amber-800 uppercase tracking-widest">Total Organik</p>
                        </div>
                        <p className="text-4xl font-black text-gray-900 tracking-tight">{totals.organic} <span className="text-sm font-bold text-amber-400 uppercase">Kg</span></p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-teal-100 transition-colors" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center text-xl">🛍️</div>
                            <p className="text-xs font-bold text-teal-800 uppercase tracking-widest">Total Anorganik</p>
                        </div>
                        <p className="text-4xl font-black text-gray-900 tracking-tight">{totals.anorganic} <span className="text-sm font-bold text-teal-400 uppercase">Kg</span></p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-gray-100 transition-colors" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center text-xl">🗑️</div>
                            <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Total Residu</p>
                        </div>
                        <p className="text-4xl font-black text-gray-900 tracking-tight">{totals.residue} <span className="text-sm font-bold text-gray-300 uppercase">Kg</span></p>
                    </div>
                </div>
            </div>

            {/* Per-Company Trash Data Table */}
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-6 border-b border-gray-50 gap-4">
                    <div>
                        <h2 className="text-lg font-black text-gray-900">Data Sampah Per Perusahaan</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Akumulasi pickup selesai</p>
                    </div>
                    <Link href="/admin/companies" className="text-xs font-bold text-orange-600 hover:text-white bg-orange-50 hover:bg-orange-600 px-4 py-2 rounded-xl transition-all border border-orange-100 hover:border-orange-600 self-start sm:self-auto">
                        Lihat Semua Perusahaan
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-50">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Perusahaan</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:table-cell">Layanan</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-amber-600 uppercase tracking-widest">Organik</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-teal-600 uppercase tracking-widest">Anorganik</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:table-cell">Residu</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-900 uppercase tracking-widest">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {trashStats.map((stat, i) => (
                                <tr key={i} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{stat.company_name}</span>
                                            <span className="sm:hidden mt-1">{getStatusBadge(stat.subscription_status)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 hidden sm:table-cell">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-gray-600">{stat.subscription_plan}</span>
                                            {getStatusBadge(stat.subscription_status)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right font-black text-amber-700 text-sm">{stat.organic} <span className="text-[10px] font-bold opacity-40">Kg</span></td>
                                    <td className="px-6 py-5 text-right font-black text-teal-700 text-sm">{stat.anorganic} <span className="text-[10px] font-bold opacity-40">Kg</span></td>
                                    <td className="px-6 py-5 text-right font-black text-gray-500 text-sm hidden sm:table-cell">{stat.residue} <span className="text-[10px] font-bold opacity-40">Kg</span></td>
                                    <td className="px-6 py-5 text-right">
                                        <span className="font-black text-gray-900 bg-gray-100 px-2 py-1 rounded-lg text-xs group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors">{stat.total_pickups}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                    { label: 'Persetujuan', sub: 'Tinjau mitra baru', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100', href: '/admin/companies/pending' },
                    { label: 'Pembatalan', sub: 'Permintaan berhenti', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', href: '/admin/companies/cancellations/requests' },
                    { label: 'Monitor Driver', sub: 'Lacak aktivitas log', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', href: '/admin/drivers' },
                ].map((action, i) => (
                    <Link key={i} href={action.href} className={`group bg-white rounded-3xl p-6 border ${action.border} hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-5`}>
                        <div className={`w-14 h-14 ${action.bg} ${action.color} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon}/></svg>
                        </div>
                        <div>
                            <p className="font-black text-gray-900 group-hover:text-orange-600 transition-colors leading-tight">{action.label}</p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{action.sub}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </AdminLayout>
    );
}
