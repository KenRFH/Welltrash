import React from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Link } from "@inertiajs/react";

const Services = () => {
    return (
        <div className="bg-slate-50 min-h-screen font-poppins">
            <Navbar />

            {/* Header Section */}
            <section className="relative w-full pt-32 pb-16 lg:pt-40 lg:pb-20 bg-white overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-white/100" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="inline-flex items-center space-x-2 bg-lime-50 rounded-full px-4 py-2 border border-green-100 mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-lime-500"></span>
                        <span className="text-sm font-medium text-green-700">Layanan & Harga</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Pilih Paket <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-600">Terbaik</span> Untuk Bisnis Anda
                    </h1>
                    
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Tingkatkan efisiensi pengelolaan sampah perusahaan Anda dengan sistem yang transparan, profesional, dan terjadwal.
                    </p>
                </div>
            </section>

            {/* Pricing Cards Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        
                        {/* Basic Plan */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Basic</h3>
                                <p className="text-slate-500 text-sm h-10">Layanan pengangkutan sampah esensial untuk bisnis skala kecil.</p>
                            </div>
                            <div className="mb-8">
                                <span className="text-4xl font-extrabold text-slate-900">Rp 899.000</span>
                                <span className="text-slate-500">/bulan</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-slate-600">Penjemputan Sampah Terjadwal</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-slate-600">Sesuai SLA Perusahaan</span>
                                </li>
                                <li className="flex items-start gap-3 opacity-50">
                                    <svg className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className="text-slate-500">Akses Dashboard Emisi & Data</span>
                                </li>
                                <li className="flex items-start gap-3 opacity-50">
                                    <svg className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className="text-slate-500">Laporan ESG & Environmental</span>
                                </li>
                            </ul>
                            <Link href={route('register')} className="block w-full text-center px-6 py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-green-500 hover:text-green-600 transition-colors">
                                Pilih Basic
                            </Link>
                        </div>

                        {/* Premium Plan */}
                        <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-1 transform scale-105 z-10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full blur-[80px] opacity-40"></div>
                            <div className="mb-8 relative">
                                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Terpopuler</span>
                                <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                                <p className="text-slate-400 text-sm h-10">Manajemen sampah terotomatisasi dengan data pelaporan emisi.</p>
                            </div>
                            <div className="mb-8">
                                <span className="text-4xl font-extrabold text-white">Rp 1.129.000</span>
                                <span className="text-slate-400">/bulan</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-slate-200">Penjemputan Sampah Terjadwal</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-slate-200">Akses Penuh Dashboard Web</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-slate-200">Pelacakan Historis Sampah</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-slate-200">Unduh Laporan Format ESG</span>
                                </li>
                            </ul>
                            <Link href={route('register')} className="block w-full text-center px-6 py-4 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30">
                                Pilih Premium
                            </Link>
                        </div>

                        {/* Premium+ Plan */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">Hemat 15%</span>
                            </div>
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Premium +</h3>
                                <p className="text-slate-500 text-sm h-10">Kontrak jangka panjang (6 Bulan) dengan semua fitur premium dan harga lebih hemat.</p>
                            </div>
                            <div className="mb-8">
                                <span className="text-4xl font-extrabold text-slate-900">Rp 5.750.000</span>
                                <span className="text-slate-500">/6 bulan</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-slate-600">Semua Fitur di Paket Premium</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-slate-600">Dashboard & Laporan Data ESG</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-slate-600">Harga Jauh Lebih Menguntungkan</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-slate-600">Prioritas Customer Support</span>
                                </li>
                            </ul>
                            <Link href={route('register')} className="block w-full text-center px-6 py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-green-500 hover:text-green-600 transition-colors">
                                Pilih Premium +
                            </Link>
                        </div>
                        
                    </div>
                </div>
            </section>

            {/* Trust Indicators Section */}
            <section className="py-16 bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Mengapa Perusahaan Memilih Welltrash?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">Kami memberikan kepastian operasional dengan standar kepatuhan pengelolaan limbah tertinggi di Indonesia.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">100% Sesuai Regulasi LH</h4>
                            <p className="text-slate-500 text-sm">Setiap alur pembuangan dan daur ulang kami terdokumentasi dan mematuhi standar Kementerian LHK.</p>
                        </div>

                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Jaminan Tepat Waktu</h4>
                            <p className="text-slate-500 text-sm">Armada logistik kami memprioritaskan jadwal angkut SLA perusahaan Anda tanpa keterlambatan.</p>
                        </div>

                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Laporan Emisi Akurat</h4>
                            <p className="text-slate-500 text-sm">Dapatkan data footprint emisi dan rasio recovery yang valid untuk keperluan audit ESG perusahaan.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Pertanyaan yang Sering Diajukan</h2>
                    <div className="space-y-4">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-2">Apakah ada biaya tambahan di luar biaya paket?</h4>
                            <p className="text-slate-600 text-sm">Tidak. Semua biaya operasional angkut sesuai rute dan kuota dimensi yang disepakati sudah termasuk dalam biaya bulanan. Tidak ada biaya tersembunyi.</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-2">Bagaimana cara mengakses dashboard pelaporan emisi?</h4>
                            <p className="text-slate-600 text-sm">Bagi pengguna paket Premium dan Premium+, Anda akan mendapatkan akses web portal khusus menggunakan akun perusahaan yang didaftarkan setelah kontrak disetujui.</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-2">Apakah bisa upgrade paket di pertengahan bulan?</h4>
                            <p className="text-slate-600 text-sm">Tentu saja. Anda dapat menghubungi Customer Support kami kapan saja untuk melakukan penyesuaian layanan atau peningkatan paket (Upgrade).</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-12 bg-slate-900 text-center">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Konsultasikan Kebutuhan Spesifik Pabrik Anda</h2>
                    <Link href={route('register')} className="inline-block px-8 py-3 bg-white text-green-700 font-bold rounded-full hover:bg-slate-50 transition shadow-lg">
                        Hubungi Tim Sales
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Services;
