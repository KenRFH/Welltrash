import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

interface Company {
    id: number;
    company_name: string;
    subscription_plan: string;
    subscription_status: string;
    user: {
        name: string;
        email: string;
    };
}

interface Props {
    companies: Company[];
}

export default function Index({ companies }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-700 border border-green-100 shadow-sm">Aktif</span>;
            case 'pending':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-yellow-50 text-yellow-700 border border-yellow-100 shadow-sm">Menunggu</span>;
            case 'rejected':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-700 border border-red-100 shadow-sm">Ditolak</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-700 border border-gray-100 shadow-sm">{status}</span>;
        }
    };

    return (
        <AdminLayout
            title="Semua Perusahaan"
            subtitle="Manajemen Mitra Bisnis"
            activeTab="companies"
        >
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-6 border-b border-gray-50">
                    <div>
                        <h2 className="text-lg font-black text-gray-900">Daftar Mitra</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Total {companies.length} Perusahaan</p>
                    </div>
                </div>

                {companies.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Belum ada perusahaan terdaftar</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-50">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Perusahaan & Kontak</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Paket Layanan</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {companies.map((company) => (
                                        <tr key={company.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{company.company_name}</span>
                                                    <span className="text-xs text-gray-400 font-medium">{company.user.name} &bull; {company.user.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-black text-gray-700 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">{company.subscription_plan}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                {getStatusBadge(company.subscription_status)}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Link
                                                    href={route('admin.companies.show', company.id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all border border-orange-100 hover:border-orange-600"
                                                >
                                                    Detail
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-50">
                            {companies.map((company) => (
                                <div key={company.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex flex-col">
                                            <span className="font-black text-gray-900 text-base">{company.company_name}</span>
                                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">{company.subscription_plan}</span>
                                        </div>
                                        {getStatusBadge(company.subscription_status)}
                                    </div>
                                    <div className="flex flex-col gap-1 mb-4">
                                        <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                                            <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                            {company.user.name}
                                        </p>
                                        <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                                            <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                            {company.user.email}
                                        </p>
                                    </div>
                                    <Link
                                        href={route('admin.companies.show', company.id)}
                                        className="w-full py-2.5 rounded-xl text-[10px] font-black bg-gray-900 text-white hover:bg-orange-600 transition-all uppercase tracking-widest text-center block"
                                    >
                                        Lihat Detail Perusahaan
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
