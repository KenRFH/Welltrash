import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col font-sans">
            <Head title="Dasbor Admin | Portal Admin" />

            {/* Navbar */}
            <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 lg:px-12 py-4 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-50">
                <div className="flex items-center mb-4 sm:mb-0">
                   <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
                       WellMaggot <span className="text-xl font-medium text-gray-400 ml-2">| Portal Admin</span>
                   </span>
                </div>
                <div className="flex space-x-6">
                    <Link href={route('admin.dashboard')} className="text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 pb-1">Dasbor</Link>
                    <Link href={route('admin.companies.index')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Semua Perusahaan</Link>
                    <Link href={route('admin.companies.pending')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Menunggu Persetujuan</Link>
                    <Link href={route('admin.companies.cancellations')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Pembatalan</Link>
                    <Link href={route('logout')} method="post" as="button" className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">Keluar</Link>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-gradient-to-br from-indigo-100 to-blue-50 opacity-40 rounded-full blur-3xl pointer-events-none -z-10"></div>
                
                <div className="mb-10 text-center sm:text-left">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Dasbor Utama</h2>
                    <p className="text-base text-gray-500 max-w-2xl text-shadow-sm mx-auto sm:mx-0">
                        Selamat datang kembali. Anda masuk sebagai Administrator Utama aplikasi ini.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Management Card */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(79,70,229,0.1)] transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-indigo-100 transition-colors"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            
                            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Manajemen Perusahaan</h3>
                            <p className="text-sm text-gray-500 mb-8 flex-1 leading-relaxed">
                                Tinjau, verifikasi, dan setujui pendaftaran dari mitra perusahaan baru yang ingin bergabung ke platform.
                            </p>
                            
                            <Link 
                                href={route('admin.companies.pending')} 
                                className="inline-flex items-center justify-center w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all group-hover:shadow-[0_4px_14px_rgba(79,70,229,0.39)]"
                            >
                                Lihat Permintaan Persetujuan
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </Link>
                        </div>
                    </div>

                    {/* Cancellations Card */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-100 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(239,68,68,0.1)] transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-red-100 transition-colors"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            
                            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Permintaan Pembatalan</h3>
                            <p className="text-sm text-gray-500 mb-8 flex-1 leading-relaxed">
                                Tinjau daftar perusahaan yang ingin membatalkan layanan berlangganan mereka.
                            </p>
                            
                            <Link 
                                href={route('admin.companies.cancellations')} 
                                className="inline-flex items-center justify-center w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all group-hover:shadow-[0_4px_14px_rgba(239,68,68,0.39)]"
                            >
                                Lihat Pembatalan
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </Link>
                        </div>
                    </div>

                    {/* Placeholder Card 2 */}
                    <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-dashed border-gray-200 relative overflow-hidden flex flex-col justify-center items-center text-center opacity-70">
                        <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mb-4">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Pengaturan Sistem</h3>
                        <p className="text-sm text-gray-400">Konfigurasi pengaturan aplikasi dan kelola pengguna.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
