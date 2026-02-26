import { Head, useForm, Link } from '@inertiajs/react';
import React, { useState } from 'react';

interface Company {
    id: number;
    company_name: string;
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

export default function Cancellations({ companies }: Props) {
    const { delete: destroy, processing } = useForm();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleApproveCancellation = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        if (confirm('Apakah Anda yakin ingin menyetujui pembatalan ini? Data perusahaan akan dihapus dari sistem.')) {
            destroy(route('admin.companies.cancellations.approve', id));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col font-sans">
            <Head title="Permintaan Pembatalan | Admin Portal" />

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
                    <Link href={route('admin.companies.pending')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Menunggu Persetujuan</Link>
                    <Link href={route('admin.companies.cancellations')} className="text-sm font-bold text-red-600 border-b-2 border-red-600 pb-1">Pembatalan</Link>
                    <Link href={route('logout')} method="post" as="button" className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">Keluar</Link>
                </div>

                {/* Mobile Dropdown */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden w-full flex flex-col items-center space-y-4 mt-4 py-4 border-t border-gray-100 bg-white shadow-lg rounded-b-xl absolute top-full left-0">
                        <Link href={route('admin.dashboard')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Dasbor</Link>
                        <Link href={route('admin.companies.index')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Semua Perusahaan</Link>
                        <Link href={route('admin.companies.pending')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Menunggu Persetujuan</Link>
                        <Link href={route('admin.companies.cancellations')} className="text-sm font-bold text-red-600 w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Pembatalan</Link>
                        <Link href={route('logout')} method="post" as="button" className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Keluar</Link>
                    </div>
                )}
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                {/* Decorative Elements */}
                <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-red-100 to-orange-50 opacity-40 rounded-full blur-3xl pointer-events-none -z-10"></div>
                
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-5">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Permintaan Pembatalan Layanan</h2>
                        <p className="text-base text-gray-500 max-w-2xl text-shadow-sm">
                            Tinjau perusahaan yang meminta berhenti berlangganan. Menyetujui permintaan akan menghapus data berlangganan mereka.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 bg-red-50 text-red-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm border border-red-100">
                        {companies.length} Permintaan
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl border border-gray-100 relative overflow-hidden">
                    {companies.length === 0 ? (
                        <div className="p-16 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Tidak Ada Permintaan Pembatalan</h3>
                            <p className="text-gray-500">Saat ini tidak ada perusahaan yang meminta untuk berhenti berlangganan.</p>
                        </div>
                    ) : (
                        <ul role="list" className="divide-y divide-gray-100">
                            {companies.map((company) => (
                                <li key={company.id} className="hover:bg-gray-50/50 transition-colors">
                                    <div className="px-6 py-6 flex flex-col lg:flex-row lg:items-center">
                                        <div className="flex-1 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                            
                                            {/* Company & User Info */}
                                            <div className="mb-4 lg:mb-0 lg:pr-6 max-w-md">
                                                <div className="flex flex-col">
                                                    <h3 className="text-lg font-bold text-gray-900 truncate">{company.company_name}</h3>
                                                    <p className="text-sm font-medium text-gray-500 mt-1">
                                                        Oleh: <span className="text-gray-700">{company.user.name}</span> <span className="text-gray-400 font-normal">({company.user.email})</span>
                                                    </p>
                                                </div>
                                                <div className="mt-3">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold leading-5 bg-yellow-50 text-yellow-700 border border-yellow-100">
                                                        Menunggu Pembatalan
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex-shrink-0 flex items-center gap-3 lg:border-l lg:border-gray-100 lg:pl-6">
                                            <Link href={route('admin.companies.show', company.id)} className="w-full sm:w-auto px-4 py-2.5 text-green-600 bg-green-50 hover:bg-green-100 border border-green-100 rounded-xl font-bold text-sm flex items-center justify-center transition-colors">
                                                Detail
                                            </Link>
                                            
                                            <form onSubmit={(e) => handleApproveCancellation(e, company.id)} className="w-full sm:w-auto">
                                                <button type="submit" disabled={processing} className="w-full sm:w-auto px-6 py-2.5 text-white bg-red-600 hover:bg-red-700 border border-transparent rounded-xl font-bold text-sm flex items-center justify-center shadow-sm transition-colors disabled:opacity-50" title="Setujui Pembatalan">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                    Setujui Pembatalan & Hapus
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
