import { Head, useForm, Link } from '@inertiajs/react';
import React, { useState } from 'react';

interface Company {
    id: number;
    company_name: string;
    pic_name: string;
    address: string;
    phone: string;
    business_category: string | null;
    pickup_schedule: string[] | null;
    subscription_plan: string;
    payment_evidence_path: string | null;
    signed_mou_path: string | null;
    user: {
        name: string;
        email: string;
    };
}

interface Props {
    companies: Company[];
}

export default function PendingCompanies({ companies }: Props) {
    const { patch, delete: destroy, processing } = useForm();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleApprove = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        patch(route('admin.companies.approve', id));
    };

    const handleReject = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        if (confirm('Apakah Anda yakin ingin menolak dan menghapus pendaftaran ini?')) {
            destroy(route('admin.companies.reject', id));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col font-sans">
            <Head title="Persetujuan Perusahaan | Admin Portal" />

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
                    <Link href={route('admin.companies.index')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Semua Perusahaan</Link>
                    <Link href={route('admin.companies.pending')} className="text-sm font-bold text-green-600 border-b-2 border-green-600 pb-1">Menunggu Persetujuan</Link>
                    <Link href={route('logout')} method="post" as="button" className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">Keluar</Link>
                </div>

                {/* Mobile Dropdown */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden w-full flex flex-col items-center space-y-4 mt-4 py-4 border-t border-gray-100 bg-white shadow-lg rounded-b-xl absolute top-full left-0">
                        <Link href={route('admin.dashboard')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Dasbor</Link>
                        <Link href={route('admin.companies.index')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Semua Perusahaan</Link>
                        <Link href={route('admin.companies.pending')} className="text-sm font-bold text-green-600 w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Menunggu Persetujuan</Link>
                        <Link href={route('logout')} method="post" as="button" className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Keluar</Link>
                    </div>
                )}
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                {/* Decorative Elements */}
                <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-green-100 to-emerald-50 opacity-40 rounded-full blur-3xl pointer-events-none -z-10"></div>
                
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-5">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Perusahaan Menunggu Persetujuan</h2>
                        <p className="text-base text-gray-500 max-w-2xl text-shadow-sm">
                            Tinjau pendaftaran perusahaan baru, verifikasi pembayaran, dan setujui akses masuk ke sistem.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 bg-green-50 text-green-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm border border-green-100">
                        {companies.length} Menunggu
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl border border-gray-100 relative overflow-hidden">
                    {companies.length === 0 ? (
                        <div className="p-16 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Tidak Ada Pendaftaran</h3>
                            <p className="text-gray-500">Saat ini tidak ada perusahaan yang menunggu persetujuan Anda.</p>
                        </div>
                    ) : (
                        <ul role="list" className="divide-y divide-gray-100">
                            {companies.map((company) => (
                                <li key={company.id} className="hover:bg-gray-50/50 transition-colors">
                                    <div className="px-6 py-6 flex flex-col lg:flex-row lg:items-center">
                                        <div className="flex-1 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                            
                                            {/* Company & User Info */}
                                            <div className="mb-4 lg:mb-0 lg:pr-6 lg:w-1/2">
                                                <div className="flex flex-col">
                                                    <h3 className="text-xl font-bold text-gray-900 truncate mb-2">{company.company_name}</h3>
                                                    <div className="text-sm text-gray-600 space-y-1.5 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                        <p className="flex justify-between">
                                                            <span className="font-semibold text-gray-500">PIC:</span>
                                                            <span className="text-right text-gray-900">{company.pic_name} ({company.phone})</span>
                                                        </p>
                                                        <p className="flex justify-between">
                                                            <span className="font-semibold text-gray-500">Akun:</span>
                                                            <span className="text-right text-gray-900">{company.user.name} ({company.user.email})</span>
                                                        </p>
                                                        <p className="flex justify-between">
                                                            <span className="font-semibold text-gray-500">Kategori:</span>
                                                            <span className="text-right text-gray-900">{company.business_category || '-'}</span>
                                                        </p>
                                                        <div className="pt-2 mt-2 border-t border-gray-200">
                                                            <p className="flex flex-col">
                                                                <span className="font-semibold text-gray-500 mb-1">Alamat:</span>
                                                                <span className="text-gray-900 leading-snug">{company.address}</span>
                                                            </p>
                                                        </div>
                                                        <div className="pt-2 mt-2 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                            <span className="font-semibold text-gray-500 shrink-0">Jadwal:</span>
                                                            <div className="flex flex-wrap gap-1.5 justify-end">
                                                                {company.pickup_schedule && company.pickup_schedule.length > 0 ? (
                                                                    company.pickup_schedule.map((day, index) => (
                                                                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                                                                            {day}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-[10px] text-gray-400 italic">Belum diset</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold leading-5 bg-green-50 text-green-700 border border-green-100 shadow-sm">
                                                        Paket: {company.subscription_plan}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* Embedded Documents */}
                                            <div className="mb-6 lg:mb-0 flex-shrink-0 lg:mx-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Dokumen Terlampir</h4>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm font-medium">
                                                    {company.payment_evidence_path ? (
                                                        <a href={`/storage/${company.payment_evidence_path}`} target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 bg-white text-emerald-600 hover:text-emerald-800 border border-emerald-100 hover:border-emerald-300 hover:shadow-sm rounded-xl transition-all">
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                            Lihat Pembayaran
                                                        </a>
                                                    ) : (
                                                        <span className="flex items-center px-4 py-2 bg-gray-50 text-gray-400 border border-dashed border-gray-200 rounded-xl">Belum Ada Pembayaran</span>
                                                    )}

                                                    {company.signed_mou_path ? (
                                                        <a href={`/storage/${company.signed_mou_path}`} target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 bg-white text-green-600 hover:text-green-800 border border-green-100 hover:border-green-300 hover:shadow-sm rounded-xl transition-all">
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                            Lihat MOU
                                                        </a>
                                                    ) : (
                                                        <span className="flex items-center px-4 py-2 bg-gray-50 text-gray-400 border border-dashed border-gray-200 rounded-xl">Belum Ada MOU</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex-shrink-0 flex items-center gap-3 lg:border-l lg:border-gray-100 lg:pl-6">
                                            <form onSubmit={(e) => handleReject(e, company.id)} className="w-full sm:w-auto">
                                                <button type="submit" disabled={processing} className="w-full sm:w-auto px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl font-bold text-sm flex items-center justify-center transition-colors disabled:opacity-50" title="Tolak Pendaftaran">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                    Tolak
                                                </button>
                                            </form>

                                            <form onSubmit={(e) => handleApprove(e, company.id)} className="w-full sm:w-auto">
                                                <button type="submit" disabled={processing} className="w-full sm:w-auto px-6 py-2.5 text-white bg-green-600 hover:bg-green-700 border border-transparent rounded-xl font-bold text-sm flex items-center justify-center shadow-sm transition-colors disabled:opacity-50" title="Setujui Pendaftaran">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                    Setujui
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
}
