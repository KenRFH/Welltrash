import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold leading-5 bg-green-50 text-green-700 border border-green-100">Aktif</span>;
            case 'pending':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold leading-5 bg-yellow-50 text-yellow-700 border border-yellow-100">Menunggu</span>;
            case 'rejected':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold leading-5 bg-red-50 text-red-700 border border-red-100">Ditolak</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold leading-5 bg-gray-50 text-gray-700 border border-gray-100">{status}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col font-sans">
            <Head title="Daftar Perusahaan | Admin Portal" />

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
                    <Link href={route('admin.companies.index')} className="text-sm font-bold text-green-600 border-b-2 border-green-600 pb-1">Semua Perusahaan</Link>
                    <Link href={route('admin.companies.pending')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Menunggu Persetujuan</Link>
                    <Link href={route('logout')} method="post" as="button" className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">Keluar</Link>
                </div>

                {/* Mobile Dropdown */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden w-full flex flex-col items-center space-y-4 mt-4 py-4 border-t border-gray-100 bg-white shadow-lg rounded-b-xl absolute top-full left-0">
                        <Link href={route('admin.dashboard')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Dasbor</Link>
                        <Link href={route('admin.companies.index')} className="text-sm font-bold text-green-600 w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Semua Perusahaan</Link>
                        <Link href={route('admin.companies.pending')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Menunggu Persetujuan</Link>
                        <Link href={route('logout')} method="post" as="button" className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Keluar</Link>
                    </div>
                )}
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-green-100 to-emerald-50 opacity-40 rounded-full blur-3xl pointer-events-none -z-10"></div>
                
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-5">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Daftar Perusahaan</h2>
                        <p className="text-base text-gray-500 max-w-2xl text-shadow-sm">
                            Kelola semua perusahaan yang terdaftar, lihat status dan detail layanan mereka.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 bg-green-50 text-green-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm border border-green-100">
                        {companies.length} Total
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl border border-gray-100 relative overflow-hidden">
                    {companies.length === 0 ? (
                        <div className="p-16 flex flex-col items-center justify-center text-center">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Belum Ada Perusahaan</h3>
                            <p className="text-gray-500">Saat ini belum ada perusahaan terdaftar.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Perusahaan & Kontak</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Layanan</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {companies.map((company) => (
                                        <tr key={company.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <div className="text-sm font-bold text-gray-900">{company.company_name}</div>
                                                    <div className="text-sm text-gray-500">{company.user.name} ({company.user.email})</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 font-medium">{company.subscription_plan}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(company.subscription_status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link href={route('admin.companies.show', company.id)} className="text-green-600 hover:text-green-900 font-bold bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors">
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
