import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

interface Company {
    id: number;
    company_name: string;
    subscription_plan: string;
    subscription_status: string;
    remaining_days: number | null;
    phone: string;
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
            case 'approved':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">Disetujui</span>;
            case 'payment_uploaded':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-teal-50 text-teal-700 border border-teal-100 shadow-sm">Menunggu Aktivasi</span>;
            case 'inactive':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 border border-gray-200 shadow-sm">Nonaktif</span>;
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
                                                <div className="flex flex-col items-start gap-1.5">
                                                    {getStatusBadge(company.subscription_status)}
                                                    {company.subscription_status === 'active' && company.remaining_days !== null && (
                                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">Sisa {company.remaining_days} Hari</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right space-x-2">
                                                {company.subscription_status === 'payment_uploaded' && (
                                                    <Link
                                                        href={route('admin.companies.activate', company.id)}
                                                        method="patch"
                                                        as="button"
                                                        preserveScroll
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white transition-all border border-teal-100 hover:border-teal-600"
                                                    >
                                                        Tinjau & Aktifkan
                                                    </Link>
                                                )}
                                                
                                                {(company.subscription_status === 'active' || company.subscription_status === 'inactive') && (
                                                    <Link
                                                        href={route('admin.companies.toggleStatus', company.id)}
                                                        method="patch"
                                                        as="button"
                                                        preserveScroll
                                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all border ${
                                                            company.subscription_status === 'active' 
                                                                ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-100 hover:border-red-600'
                                                                : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white border-green-100 hover:border-green-600'
                                                        }`}
                                                    >
                                                        {company.subscription_status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                                                    </Link>
                                                )}

                                                {company.subscription_status === 'active' && (
                                                    <a 
                                                        href={`https://wa.me/${company.phone?.startsWith('0') ? '62' + company.phone.slice(1) : company.phone}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 hover:border-emerald-600"
                                                        title="Hubungi PIC via WhatsApp"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                        </svg>
                                                    </a>
                                                )}

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
                                        <div className="flex flex-col items-end gap-1.5">
                                            {getStatusBadge(company.subscription_status)}
                                            {company.subscription_status === 'active' && company.remaining_days !== null && (
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">Sisa {company.remaining_days} Hari</span>
                                            )}
                                        </div>
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
                                    <div className="flex flex-col gap-2">
                                        {company.subscription_status === 'payment_uploaded' && (
                                            <Link
                                                href={route('admin.companies.activate', company.id)}
                                                method="patch"
                                                as="button"
                                                preserveScroll
                                                className="w-full py-2.5 rounded-xl text-[10px] font-black bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white transition-all border border-teal-100 hover:border-teal-600 uppercase tracking-widest text-center block"
                                            >
                                                Tinjau & Aktifkan
                                            </Link>
                                        )}
                                        
                                        {(company.subscription_status === 'active' || company.subscription_status === 'inactive') && (
                                            <Link
                                                href={route('admin.companies.toggleStatus', company.id)}
                                                method="patch"
                                                as="button"
                                                preserveScroll
                                                className={`w-full py-2.5 rounded-xl text-[10px] font-black transition-all border uppercase tracking-widest text-center block ${
                                                    company.subscription_status === 'active' 
                                                        ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-100 hover:border-red-600'
                                                        : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white border-green-100 hover:border-green-600'
                                                }`}
                                            >
                                                {company.subscription_status === 'active' ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                                            </Link>
                                        )}

                                        {company.subscription_status === 'active' && (
                                            <a 
                                                href={`https://wa.me/${company.phone?.startsWith('0') ? '62' + company.phone.slice(1) : company.phone}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-2.5 rounded-xl text-[10px] font-black bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 hover:border-emerald-600 uppercase tracking-widest text-center flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                </svg>
                                                Hubungi WA
                                            </a>
                                        )}

                                        <Link
                                            href={route('admin.companies.show', company.id)}
                                            className="w-full py-2.5 rounded-xl text-[10px] font-black bg-gray-900 text-white hover:bg-orange-600 transition-all uppercase tracking-widest text-center block"
                                        >
                                            Lihat Detail Perusahaan
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
