import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-50 text-green-700 border border-green-200 shadow-sm">Aktif</span>;
            case 'pending':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 shadow-sm">Menunggu</span>;
            case 'rejected':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-50 text-red-700 border border-red-200 shadow-sm">Ditolak</span>;
            default:
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gray-50 text-gray-700 border border-gray-200 shadow-sm">{status}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col font-sans">
            <Head title={`Detail ${company.company_name} | Admin Portal`} />

            {/* Navbar */}
            <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 lg:px-12 py-4 flex flex-col sm:flex-row justify-between items-center sm:items-center sticky top-0 z-50">
                <div className="flex items-center justify-between w-full sm:w-auto">
                   <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
                       WellMaggot <span className="text-xl font-medium text-gray-400 ml-2">| Portal Admin</span>
                   </span>
                   {/* Mobile Menu Button */}
                   <button 
                       onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                       className="sm:hidden p-2 text-gray-500 hover:text-gray-900 focus:outline-none"
                   >
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           {isMobileMenuOpen ? (
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           ) : (
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                           )}
                       </svg>
                   </button>
                </div>

                {/* Desktop Links */}
                <div className="hidden sm:flex space-x-6 mt-4 sm:mt-0">
                    <Link href={route('admin.dashboard')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Dasbor</Link>
                    <Link href={route('admin.companies.index')} className="text-sm font-medium text-gray-500 hover:text-green-600 transition-colors">Semua Perusahaan</Link>
                    <Link href={route('admin.companies.pending')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Menunggu Persetujuan</Link>
                    <Link href={route('logout')} method="post" as="button" className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">Keluar</Link>
                </div>

                {/* Mobile Dropdown */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden w-full flex flex-col items-center space-y-4 mt-4 py-4 border-t border-gray-100 bg-white shadow-lg rounded-b-xl absolute top-full left-0">
                        <Link href={route('admin.dashboard')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Dasbor</Link>
                        <Link href={route('admin.companies.index')} className="text-sm font-medium text-green-600 w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Semua Perusahaan</Link>
                        <Link href={route('admin.companies.pending')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Menunggu Persetujuan</Link>
                        <Link href={route('logout')} method="post" as="button" className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Keluar</Link>
                    </div>
                )}
            </nav>

            <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={route('admin.companies.index')} className="p-2 bg-white rounded-full text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors shadow-sm border border-gray-100">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </Link>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Detail Perusahaan</h2>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-100 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8">
                        {getStatusBadge(company.subscription_status)}
                    </div>

                    <div className="p-8 sm:p-12 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent">
                        <h3 className="text-3xl font-black text-gray-900 mb-2">{company.company_name}</h3>
                        <p className="text-sm text-gray-500 font-medium">Akun Web: <span className="text-gray-900">{company.user.name}</span> ({company.user.email})</p>
                    </div>

                    <div className="p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Company Details */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">PIC / Penanggung Jawab</h4>
                                    <p className="text-base font-bold text-gray-900">{company.pic_name}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Telepon / WA</h4>
                                    <p className="text-base font-bold text-gray-900">{company.phone}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Kategori Bisnis</h4>
                                <p className="text-base font-medium text-gray-900">{company.business_category || '-'}</p>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Alamat</h4>
                                <p className="text-base text-gray-900 bg-gray-50 p-4 rounded-2xl border border-gray-100">{company.address}</p>
                            </div>
                            
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Paket Layanan</h4>
                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold bg-green-50 text-green-700 border border-green-100">{company.subscription_plan}</span>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Jadwal Pengambilan Hari</h4>
                                <div className="flex flex-wrap gap-2">
                                    {company.pickup_schedule && company.pickup_schedule.length > 0 ? (
                                        company.pickup_schedule.map((day, index) => (
                                            <span key={index} className="inline-flex items-center px-4 py-1.5 rounded-xl text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                                                {day}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-400 italic bg-gray-50 px-4 py-2 rounded-xl border border-dashed border-gray-200">Belum ada jadwal yang dipilih</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="space-y-6 bg-gray-50/50 p-6 sm:p-8 rounded-3xl border border-gray-100">
                            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-3">Dokumen Pendukung</h4>
                            
                            <div className="space-y-4 pt-2">
                                <div>
                                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bukti Pembayaran</h5>
                                    {company.payment_evidence_path ? (
                                        <a href={`/storage/${company.payment_evidence_path}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white text-emerald-600 hover:text-emerald-800 border-1 border-emerald-100 hover:border-emerald-300 hover:shadow-md rounded-2xl transition-all group">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-emerald-50 rounded-xl mr-3 group-hover:bg-emerald-100 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                </div>
                                                <span className="font-bold text-sm">Lihat Pembayaran</span>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                        </a>
                                    ) : (
                                        <span className="flex items-center p-4 bg-gray-50 text-gray-400 border border-dashed border-gray-300 rounded-2xl text-sm">Belum Ada Pembayaran</span>
                                    )}
                                </div>

                                <div>
                                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">MOU (Memorandum of Understanding)</h5>
                                    {company.signed_mou_path ? (
                                        <a href={`/storage/${company.signed_mou_path}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white text-green-600 hover:text-green-800 border-1 border-green-100 hover:border-green-300 hover:shadow-md rounded-2xl transition-all group">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-green-50 rounded-xl mr-3 group-hover:bg-green-100 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                </div>
                                                <span className="font-bold text-sm">Lihat Dokumen MOU</span>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                        </a>
                                    ) : (
                                        <span className="flex items-center p-4 bg-gray-50 text-gray-400 border border-dashed border-gray-300 rounded-2xl text-sm">Belum Ada Dokumen MOU</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
