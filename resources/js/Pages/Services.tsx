import React from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Head, Link } from "@inertiajs/react";

const Services = () => {
    const packages = [
        {
            name: "Paket Request (By Call)",
            price: "500k",
            priceDetail: "Biaya mulai dari",
            pickup: "Sekali Angkut",
            description: "Jasa angkut sampah on-demand yang fleksibel untuk kebutuhan mendadak atau frekuensi tidak rutin.",
            features: [
                "Layanan Jemput Sesuai Panggilan",
                "Jadwal Fleksibel & Cepat",
                "Pemilahan Sampah Standar",
                "Konsultasi via WhatsApp"
            ]
        },
        {
            name: "Paket Rumah Tangga",
            price: "750k - 1.000k",
            priceDetail: "Estimasi Biaya",
            pickup: "5 Hari / Minggu",
            description: "Layanan penjemputan sampah rumah tangga harian agar lingkungan hunian tetap bersih dan sehat.",
            features: [
                "Max 100kg (6 kantong trashbag) / sekali angkut",
                "Jadwal Jemput Rutin Harian",
                "Akses Aplikasi WellTrash",
                "Laporan Kebersihan Bulanan",
                "Sangat direkomendasikan untuk UMKM dll"
            ]
        },
        {
            name: "Paket Reguler",
            price: "2.000k",
            priceDetail: "Biaya mulai dari",
            pickup: "2 - 3x / Minggu",
            description: "Solusi pengolahan limbah untuk bisnis kecil dan menengah dengan jadwal pengambilan teratur.",
            features: [
                "Ideal untuk Kafe, Restoran atau bagian non-klinis RS",
                "Maksimum 400kg / 24 kantong trashbag / sekali angkut",
                "Akses Aplikasi WellTrash",
                "Laporan Kebersihan Bulanan",
                "Sertifikat Mitra Ramah Lingkungan"
            ]
        },
        {
            name: "Paket Prime (Bisnis)",
            price: "3.000k",
            priceDetail: "Biaya mulai dari",
            pickup: "5 Hari / Minggu",
            isFeatured: true,
            description: "Layanan pengolahan sampah prioritas untuk perusahaan yang fokus pada standar kebersihan tinggi.",
            features: [
                "Ideal untuk SPPG, Gudang, dan Hotel atau unit oprasional besar lainnya",
                "Maksimum 500kg / 36 kantong trashbag / sekali angkut",
                "Akses Aplikasi WellTrash",
                "Laporan Kebersihan Bulanan",
                "Sertifikat Mitra Ramah Lingkungan"
            ]
        },
        {
            name: "Paket Premium+",
            price: "5.000k",
            priceDetail: "Biaya mulai dari",
            pickup: "5 Hari / Minggu",
            description: "Solusi pengelolaan limbah industri skala besar dengan sistem pelaporan audit yang mendalam.",
            features: [
                "Tanpa perlu pilah sampah",
                "Maksimum 500kg / 36 kantong trashbag / sekali angkut",
                "Akses Aplikasi WellTrash",
                "Laporan Kebersihan Bulanan",
                "Sertifikat Mitra Ramah Lingkungan"
            ]
        }
    ];

    return (
        <div className="bg-white min-h-screen font-sans selection:bg-lime-100">
            <Head>
                <title>Harga Jasa Angkut Sampah & Pengolahan Limbah</title>
                <meta name="description" content="Cari jasa angkut sampah terpercaya? WellTrash menyediakan layanan penjemputan sampah rumah tangga dan industri dengan harga terjangkau dan ramah lingkungan." />
                <meta name="keywords" content="jasa angkut sampah, penjemputan sampah, pengolahan limbah, harga jasa sampah, WellTrash Indonesia" />
            </Head>
            <Navbar />

            <section className="pt-40 pb-24 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-8">
                        Layanan <span className="text-lime-500 italic font-serif italic">Penjemputan</span> Sampah <br />
                        Terbaik & Terpercaya
                    </h1>
                    
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        Cari solusi pengelolaan limbah yang bersih dan profesional? 
                        WellTrash hadir dengan paket jasa angkut sampah yang transparan dan sesuai regulasi.
                    </p>
                </div>
            </section>

            <section className="pb-40 px-6">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {packages.map((pkg, idx) => {
                            const isPremiumPlus = pkg.name.includes("Premium+");
                            return (
                                <div 
                                    key={idx}
                                    className={`group relative flex flex-col rounded-[40px] p-8 transition-all duration-700 hover:-translate-y-2 ${
                                        isPremiumPlus
                                        ? 'bg-slate-900 border-2 border-lime-500 shadow-2xl shadow-lime-500/20 text-white'
                                        : pkg.isFeatured 
                                        ? 'bg-white border-2 border-lime-500 shadow-2xl shadow-lime-500/10' 
                                        : 'bg-white border border-slate-100 hover:border-lime-200 shadow-sm hover:shadow-xl'
                                    }`}
                                >
                                    {(pkg.isFeatured || isPremiumPlus) && (
                                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[9px] font-black uppercase tracking-[0.3em] px-5 py-1.5 rounded-full shadow-lg whitespace-nowrap ${
                                            isPremiumPlus ? 'bg-slate-900 border border-lime-500' : 'bg-lime-500 shadow-lime-500/30'
                                        }`}>
                                            {isPremiumPlus ? 'Paket Eksklusif' : 'Pilihan Populer'}
                                        </div>
                                    )}
                                    
                                    <div className="mb-10">
                                        <h3 className={`text-xl font-black leading-tight mb-3 transition-colors ${
                                            isPremiumPlus ? 'text-white' : 'text-slate-900 group-hover:text-lime-600'
                                        }`}>
                                            {pkg.name}
                                        </h3>
                                        <p className={`text-[11px] font-semibold leading-relaxed h-12 overflow-hidden ${
                                            isPremiumPlus ? 'text-slate-400' : 'text-slate-400'
                                        }`}>
                                            {pkg.description}
                                        </p>
                                    </div>

                                    <div className="mb-10">
                                        <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-2 ${
                                            isPremiumPlus ? 'text-lime-500' : 'text-slate-300'
                                        }`}>
                                            {pkg.priceDetail}
                                        </p>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className={`text-xs font-bold ${isPremiumPlus ? 'text-slate-500' : 'text-slate-300'}`}>Rp</span>
                                            <span className={`text-3xl font-black tracking-tighter ${isPremiumPlus ? 'text-white' : 'text-slate-900'}`}>
                                                {pkg.price}
                                            </span>
                                        </div>
                                        <div className={`mt-4 flex items-center gap-2.5 px-4 py-2 rounded-2xl border w-fit ${
                                            isPremiumPlus ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'
                                        }`}>
                                            <svg className="w-3.5 h-3.5 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${isPremiumPlus ? 'text-white' : 'text-slate-900'}`}>{pkg.pickup}</span>
                                        </div>
                                    </div>

                                    <div className={`w-full h-px mb-10 ${isPremiumPlus ? 'bg-white/10' : 'bg-slate-100'}`} />

                                    <ul className="space-y-4 mb-12 flex-grow">
                                        {pkg.features.map((feature, fIdx) => (
                                            <li key={fIdx} className="flex items-start gap-4">
                                                <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-lime-50 text-lime-600 flex items-center justify-center">
                                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span className={`text-xs font-bold leading-tight ${isPremiumPlus ? 'text-slate-300' : 'text-slate-500'}`}>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link 
                                        href={route('register')} 
                                        className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center transition-all active:scale-[0.98] ${
                                            isPremiumPlus
                                            ? 'bg-lime-500 text-white hover:bg-lime-400 shadow-lg shadow-lime-500/30'
                                            : pkg.isFeatured 
                                            ? 'bg-lime-500 text-white hover:bg-lime-600 shadow-lg shadow-lime-500/20' 
                                            : 'bg-slate-900 text-white hover:bg-lime-600'
                                        }`}
                                    >
                                        Pilih Paket
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-32 px-6 bg-[#FAFBFC]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1">
                            <h2 className="text-3xl font-black text-slate-900 leading-none mb-6">
                                Kenapa <br /> WellTrash?
                            </h2>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-loose">
                                Komitmen kami <br /> adalah lingkungan <br /> yang bersih & sehat.
                            </p>
                        </div>
                        {[
                            { title: "Sesuai Regulasi", desc: "Layanan angkut sampah kami sepenuhnya mematuhi standar Kementerian LHK.", icon: "✓" },
                            { title: "Laporan Digital", desc: "Sistem pelaporan sampah transparan yang mudah diakses kapan saja.", icon: "✓" },
                            { title: "Jaminan SLA", desc: "Kepastian waktu penjemputan limbah sesuai dengan jadwal kontrak.", icon: "✓" }
                        ].map((item, i) => (
                            <div key={i} className="p-10 rounded-[40px] bg-white border border-slate-100 transition-all hover:border-lime-200">
                                <div className="w-8 h-8 rounded-full bg-lime-500 text-white flex items-center justify-center font-black mb-6 shadow-lg shadow-lime-500/20">
                                    {item.icon}
                                </div>
                                <h4 className="text-lg font-black text-slate-900 mb-3">{item.title}</h4>
                                <p className="text-xs font-semibold text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-40 px-6 bg-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-lime-50/30 rounded-full blur-[140px] pointer-events-none" />
                <div className="max-w-3xl mx-auto relative z-10">
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-10">
                        Mulai Hidup Bersih <br /> Bersama WellTrash.
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                            href={route('register')} 
                            className="px-12 py-5 bg-none text-black border border-lime-500 font-black uppercase tracking-[0.2em] rounded-full hover:bg-lime-500 hover:shadow-2xl hover:text-white duration-500 text-[10px]"
                        >
                            Daftar Sekarang
                        </Link>
                        <button className="px-12 py-5 bg-white text-slate-900 font-black uppercase tracking-[0.2em] rounded-full border border-slate-100 hover:bg-slate-50 transition-all active:scale-[0.98] text-[10px]">
                            Hubungi Kami
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Services;
