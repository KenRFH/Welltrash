import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

interface CleanUP {
    id: number;
    name: string;
    email: string;
    total_pickups: number;
    last_activity: string | null;
}

interface Props {
    cleanups: CleanUP[];
}

export default function Index({ cleanups }: Props) {
    return (
        <AdminLayout
            title="Monitor CleanUP"
            subtitle="Daftar CleanUP dan log aktivitas"
            activeTab="cleanups"
        >
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-6 border-b border-gray-50">
                    <div>
                        <h2 className="text-lg font-black text-gray-900">Semua CleanUP</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Total {cleanups.length} CleanUP Aktif</p>
                    </div>
                </div>

                {cleanups.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Belum ada CleanUP terdaftar</p>
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-50">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">CleanUP</th>
                                        <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pickup</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Aktivitas Terakhir</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {cleanups.map((cleanup) => (
                                        <tr key={cleanup.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        className="w-10 h-10 rounded-xl shadow-sm border border-orange-100"
                                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(cleanup.name)}&background=fff7ed&color=ea580c&bold=true`}
                                                        alt={cleanup.name}
                                                    />
                                                    <div>
                                                        <p className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{cleanup.name}</p>
                                                        <p className="text-xs text-gray-400 font-medium">{cleanup.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-xl text-sm group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors">
                                                    {cleanup.total_pickups}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                                                {cleanup.last_activity ? new Date(cleanup.last_activity).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Link
                                                    href={route('admin.cleanups.show', cleanup.id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all border border-orange-100 hover:border-orange-600"
                                                >
                                                    Lihat Log Aktivitas
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden divide-y divide-gray-50">
                            {cleanups.map((cleanup) => (
                                <div key={cleanup.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                className="w-12 h-12 rounded-xl border border-orange-100"
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(cleanup.name)}&background=fff7ed&color=ea580c&bold=true`}
                                                alt={cleanup.name}
                                            />
                                            <div>
                                                <p className="font-bold text-gray-900">{cleanup.name}</p>
                                                <p className="text-xs text-gray-400 font-medium truncate max-w-[150px]">{cleanup.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Pickup</p>
                                            <span className="font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-lg text-sm border border-orange-100">{cleanup.total_pickups}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Aktivitas Terakhir</p>
                                            <p className="text-xs font-bold text-gray-600">
                                                {cleanup.last_activity ? new Date(cleanup.last_activity).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Belum ada'}
                                            </p>
                                        </div>
                                        <Link
                                            href={route('admin.cleanups.show', cleanup.id)}
                                            className="px-4 py-2 rounded-xl text-[10px] font-black bg-gray-900 text-white hover:bg-orange-600 transition-all uppercase tracking-widest"
                                        >
                                            Log Aktivitas
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
