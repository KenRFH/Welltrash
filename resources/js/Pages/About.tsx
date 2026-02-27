import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import React from "react";
import { Link } from "@inertiajs/react";

const About = () => {
    return (
        <div className="bg-slate-50 min-h-screen font-poppins">
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-28 bg-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-white/100" />
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-green-100/50 rounded-full blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-lime-100/50 rounded-full blur-3xl opacity-50" />
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center space-x-2 bg-lime-50 rounded-full px-4 py-2 border border-green-100 mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-lime-500"></span>
                        <span className="text-sm font-medium text-green-700">Masa Depan Berkelanjutan</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                        Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-600">Welltrash</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Kami adalah pelopor manajemen limbah digital di Indonesia. Welltrash mengintegrasikan teknologi logistik untuk 
                        memberikan solusi persampahan komersial yang terjadwal, efisien, dan ramah lingkungan.
                    </p>
                </div>
            </section>

            {/* Profil Perusahaan */}
            <section className="py-16 lg:py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-slate-900">
                                Mewujudkan Ekonomi Sirkular di Jember dan Sekitarnya
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                PT Sarana Utama Welltrash Farm didirikan dengan visi untuk mentransformasi cara perusahaan dan fasilitas komersial mengelola limbah mereka. Kami memahami bahwa manajemen sampah sering kali menjadi tantangan operasional yang kompleks.
                            </p>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                Dengan pendekatan End-to-End Waste Management, kami memastikan bahwa setiap proses—dari penjemputan hingga pemrosesan akhir—dilakukan secara transparan, mudah dilacak, dan sepenuhnya mematuhi regulasi lingkungan hidup (ESG) di Indonesia.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 relative">
                             <div className="absolute -inset-4 bg-gradient-to-tr from-green-100 to-lime-50 opacity-50 rounded-3xl blur-2xl -z-10"></div>
                             
                             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                                 <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                     </svg>
                                 </div>
                                 <h3 className="text-xl font-bold text-slate-900 mb-1">Terjadwal</h3>
                                 <p className="text-slate-500 text-sm">Penjemputan rutin sesuai SLA</p>
                             </div>

                             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center translate-y-8">
                                 <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                     </svg>
                                 </div>
                                 <h3 className="text-xl font-bold text-slate-900 mb-1">Efisien</h3>
                                 <p className="text-slate-500 text-sm">Sistem logistik pintar</p>
                             </div>
                             
                             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                                 <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                     </svg>
                                 </div>
                                 <h3 className="text-xl font-bold text-slate-900 mb-1">Transparan</h3>
                                 <p className="text-slate-500 text-sm">Laporan data real-time</p>
                             </div>

                             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center translate-y-8">
                                 <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                     </svg>
                                 </div>
                                 <h3 className="text-xl font-bold text-slate-900 mb-1">Kepatuhan</h3>
                                 <p className="text-slate-500 text-sm">Standar regulasi LH</p>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visi & Misi */}
            <section className="py-16 lg:py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Visi */}
                        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                            <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-600/30">
                                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Visi Kami</h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                Menjadi platform kolaboratif nomor satu di Indonesia yang mengintegrasikan kecerdasan logistik dan prinsip ekonomi sirkular untuk mewujudkan lanskap industri masa depan yang *Zero Waste to Landfill*.
                            </p>
                        </div>

                        {/* Misi */}
                        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-50 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                            <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-600/30">
                                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Misi Kami</h3>
                            <ul className="space-y-4 text-slate-600">
                                <li className="flex items-start gap-3">
                                    <span className="flex h-2 w-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                                    <span>Menyediakan solusi B2B yang hemat waktu, praktis, dan dapat diandalkan setiap harinya.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex h-2 w-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                                    <span>Menyajikan pelaporan data secara rutin yang kredibel untuk mendukung inisiatif *Environmental, Social, and Governance* (ESG) mitra bisnis.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex h-2 w-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                                    <span>Mendorong *recovery rate* sampah yang dapat didaur ulang bersama jaringan fasilitas pengolahan.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dokumentasi Aktivitas */}
            <section className="py-16 lg:py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 bg-green-50 rounded-full px-4 py-2 border border-green-100 mb-4">
                            <span className="text-sm font-medium text-green-700">Galeri Kami</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            Aksi Nyata untuk Lingkungan
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Sekilas dokumentasi aktivitas kami di lapangan, menunjukkan dedikasi tim Welltrash dalam mengelola limbah secara profesional.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pb-10 lg:pb-24">
                        {/* Column 1 */}
                        <div className="space-y-6 lg:space-y-8">
                            <div className="group relative overflow-hidden rounded-3xl aspect-[4/5] shadow-sm">
                                <img 
                                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop" 
                                    alt="Pengangkutan Terjadwal" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent transition-opacity duration-300"></div>
                                <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Armada Logistik</h3>
                                    <p className="text-slate-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        Proses pengangkutan terjadwal dari fasilitas mitra komersial menuju pusat pengolahan.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="group relative overflow-hidden rounded-3xl aspect-[4/3] shadow-sm">
                                <img 
                                    src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=800&auto=format&fit=crop" 
                                    alt="Edukasi Lingkungan" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent transition-opacity duration-300"></div>
                                <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-xl font-bold text-white mb-2">Edukasi & Pelatihan</h3>
                                    <p className="text-slate-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        Memberikan pendampingan tata kelola sampah kepada staf operasional mitra.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-6 lg:space-y-8 lg:translate-y-12">
                            <div className="group relative overflow-hidden rounded-3xl aspect-[4/3] shadow-sm">
                                <img 
                                    src="https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?q=80&w=800&auto=format&fit=crop" 
                                    alt="Pemilahan Sampah" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent transition-opacity duration-300"></div>
                                <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-xl font-bold text-white mb-2">Pemisahan Material</h3>
                                    <p className="text-slate-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        Pekerja terampil kami menyortir sampah anorganik sesuai jenis dan nilainya.
                                    </p>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-3xl aspect-[4/5] shadow-sm">
                                <img 
                                    src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=800&auto=format&fit=crop" 
                                    alt="Material Recovery" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent transition-opacity duration-300"></div>
                                <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Material Recovery</h3>
                                    <p className="text-slate-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        Mendistribusikan material daur ulang ke berbagai pabrik peleburan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Column 3 */}
                        <div className="space-y-6 lg:space-y-8 lg:translate-y-24">
                            <div className="group relative overflow-hidden rounded-3xl aspect-[4/5] shadow-sm">
                                <img 
                                    src="https://images.unsplash.com/photo-1528323273322-d81458248d40?q=80&w=800&auto=format&fit=crop" 
                                    alt="Pengolahan Kompos" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent transition-opacity duration-300"></div>
                                <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-2xl font-bold text-white mb-2">Pengolahan Organik</h3>
                                    <p className="text-slate-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        Mengurai limbah makanan dan organik menjadi kompos bernutrisi tinggi.
                                    </p>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-3xl aspect-[4/3] shadow-sm">
                                <img 
                                    src="https://images.unsplash.com/photo-1516992654410-9309d4587e94?q=80&w=800&auto=format&fit=crop" 
                                    alt="Sistem Monitoring" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent transition-opacity duration-300"></div>
                                <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-xl font-bold text-white mb-2">Integrasi Data</h3>
                                    <p className="text-slate-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        Pencatatan volume sampah secara real-time untuk kebutuhan ESG report.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden rounded-t-[4rem]">
                <div className="absolute inset-0 bg-slate-900"></div>
                <div className="absolute inset-0 bg-slate-900"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                        Siap Memulai Transformasi Hijau Anda?
                    </h2>
                    <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                        Bergabunglah bersama mitra-mitra kami lainnya untuk mengelola limbah dengan cara yang lebih pintar, aman, dan efisien.
                    </p>
                    
                    <Link 
                        href={route('login')} 
                        className="inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-green-500/25"
                    >
                        Jadi Mitra Kami
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;