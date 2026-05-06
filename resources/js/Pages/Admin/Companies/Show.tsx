import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

interface Company {
    id: number;
    company_name: string;
    pic_name: string;
    address: string;
    phone: string;
    business_category: string | null;
    subscription_plan: string;
    subscription_status: string;
    payment_evidence_path: string | null;
    signed_mou_path: string | null;
    pickup_schedule: string[] | null;
    user: {
        name: string;
        email: string;
    };
    created_at: string;
}

interface Props {
    company: Company;
}

export default function Show({ company }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black bg-green-50 text-green-700 border border-green-200 shadow-sm uppercase tracking-widest">Aktif</span>;
            case 'pending':
                return <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black bg-yellow-50 text-yellow-700 border border-yellow-200 shadow-sm uppercase tracking-widest">Menunggu</span>;
            case 'rejected':
                return <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black bg-red-50 text-red-700 border border-red-200 shadow-sm uppercase tracking-widest">Ditolak</span>;
            default:
                return <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black bg-gray-50 text-gray-700 border border-gray-200 shadow-sm uppercase tracking-widest">{status}</span>;
        }
    };

    return (
        <AdminLayout
            title={company.company_name}
            subtitle="Detail Profil Perusahaan"
            activeTab="companies"
            headerAction={
                <Link href="/admin/companies" className="p-2 bg-white rounded-full text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-all shadow-sm border border-gray-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                </Link>
            }
        >
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Information Card */}
                <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-orange-100 transition-colors" />
                    <div className="p-8 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{company.company_name}</h2>
                                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                        PIC: {company.pic_name}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                        {company.user.email}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-start md:items-end gap-3">
                                {getStatusBadge(company.subscription_status)}
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Terdaftar: {new Date(company.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-gray-100">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 pb-4 border-b border-gray-50 flex items-center gap-3">
                                <span className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center text-xs">ℹ️</span>
                                Informasi Utama
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Telepon</p>
                                    <p className="text-sm font-black text-gray-900">{company.phone}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kategori Bisnis</p>
                                    <p className="text-sm font-black text-gray-900">{company.business_category || 'N/A'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Alamat Perusahaan</p>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm font-medium text-gray-600 leading-relaxed italic">
                                        "{company.address}"
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-gray-100">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 pb-4 border-b border-gray-50 flex items-center gap-3">
                                <span className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center text-xs">📅</span>
                                Jadwal & Layanan
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Paket Berlangganan</p>
                                    <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-black bg-orange-50 text-orange-600 border border-orange-100">{company.subscription_plan}</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Hari Pengambilan Sampah</p>
                                    <div className="flex flex-wrap gap-2">
                                        {company.pickup_schedule && company.pickup_schedule.length > 0 ? (
                                            company.pickup_schedule.map((day, i) => (
                                                <span key={i} className="px-4 py-2 rounded-xl text-xs font-black bg-blue-50 text-blue-600 border border-blue-100">{day}</span>
                                            ))
                                        ) : (
                                            <span className="text-xs font-bold text-gray-300 italic">Belum diatur</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documents Sidebar Section */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-gray-100 sticky top-28">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 pb-4 border-b border-gray-50">Dokumen</h3>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Legalitas & Pembayaran</p>
                                
                                {company.payment_evidence_path ? (
                                    <a href={`/storage/${company.payment_evidence_path}`} target="_blank" className="group block p-4 bg-gray-50 hover:bg-orange-50 rounded-2xl border border-gray-100 hover:border-orange-100 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white text-orange-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-0.5">Bukti Bayar</p>
                                                <p className="text-xs font-bold text-gray-900 truncate">payment_proof.jpg</p>
                                            </div>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-center">
                                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Belum Ada Pembayaran</p>
                                    </div>
                                )}

                                {company.signed_mou_path ? (
                                    <a href={`/storage/${company.signed_mou_path}`} target="_blank" className="group block p-4 bg-gray-50 hover:bg-blue-50 rounded-2xl border border-gray-100 hover:border-blue-100 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Dokumen MOU</p>
                                                <p className="text-xs font-bold text-gray-900 truncate">signed_mou_v1.pdf</p>
                                            </div>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-center">
                                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Belum Ada MOU</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
