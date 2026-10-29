import React, { useState } from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Link } from "@inertiajs/react";
import SEO from "@/Components/SEO";
import { CtaBackgroundIllustration } from "@/Components/Illustrations/CtaBackgroundIllustration";
import videoDemo from "@/assets/img/mini_demo.mp4";

const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const DayPicker = ({ maxDays, disabled }: { maxDays: number; disabled?: boolean }) => {
    const [selected, setSelected] = useState<number[]>([]);

    const toggle = (i: number) => {
        if (disabled) return;
        if (selected.includes(i)) {
            setSelected(selected.filter((d) => d !== i));
        } else if (selected.length < maxDays) {
            setSelected([...selected, i]);
        }
    };

    if (disabled) {
        return (
            <div className="mt-4 pt-3 border-t border-black/10 dark:border-zinc-800">
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted dark:text-zinc-400 mb-1">Ritase Panggilan</p>
                <p className="font-sans text-xs text-muted dark:text-zinc-400">Jadwal fleksibel disesuaikan panggilan fasilitas</p>
            </div>
        );
    }

    return (
        <div className="mt-4 pt-3 border-t border-black/10 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted dark:text-zinc-400">
                    Simulasi Hari Ritase
                </span>
                <span className="font-mono text-[11px] text-green-forest dark:text-emerald-400 font-semibold">
                    {selected.length}/{maxDays} Hari
                </span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
                {DAYS.map((day, i) => {
                    const isSelected = selected.includes(i);
                    const isDisabled = !isSelected && selected.length >= maxDays;
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => toggle(i)}
                            disabled={isDisabled}
                            className={`h-7 px-2.5 rounded-sm font-mono text-[11px] font-medium transition-colors border ${
                                isSelected
                                    ? "bg-green-forest text-lime border-green-forest dark:bg-emerald-600 dark:text-white dark:border-emerald-600"
                                    : isDisabled
                                    ? "bg-black/5 dark:bg-zinc-800/60 text-muted/40 dark:text-zinc-600 border-transparent cursor-not-allowed"
                                    : "bg-white dark:bg-zinc-800 text-ink dark:text-zinc-200 border-black/15 dark:border-zinc-700 hover:border-green-forest dark:hover:border-emerald-500"
                            }`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
const Services = () => {
    const [activeTab, setActiveTab] = useState<"all" | "commercial" | "ondemand">("all");

    const packages = [
        {
            id: "reguler",
            category: "commercial",
            name: "Paket Reguler Komersial",
            target: "Kafe, Resto & Usaha Menengah",
            price: "2.500.000",
            priceDetail: "Estimasi mulai dari / bln",
            pickup: "5 Hari / Minggu",
            capacity: "Maks. 4m³ per ritase",
            maxDays: 5,
            description: "Solusi pengangkutan teratur untuk bisnis menengah yang membutuhkan keteraturan ritase dan manifest lingkungan.",
            features: [
                "Ideal untuk kafe, resto, dan ruko",
                "Kapasitas muat s.d. 4m³ per ritase",
                "Pilihan 5 hari kerja terjadwal",
                "Akses Dashboard & Manifest Digital",
                "Sertifikat Kemitraan Ramah Lingkungan",
            ],
        },
        {
            id: "prime",
            category: "commercial",
            isFeatured: true,
            name: "Paket Prime Korporat",
            target: "Hotel, RS, SPPG & Fasilitas Besar",
            price: "3.200.000",
            priceDetail: "Estimasi mulai dari / bln",
            pickup: "Hingga 7 Hari / Minggu",
            capacity: "Maks. 4m³ per ritase",
            maxDays: 7,
            description: "Layanan prioritas harian untuk institusi dengan timbulan sampah tinggi dan audit kebersihan ketat.",
            features: [
                "Prioritas armada pagi / malam",
                "Pilihan ritase harian fleksibel (Sen - Min)",
                "Kapasitas muat s.d. 4m³ per ritase",
                "Pelaporan tonase berkala untuk audit ESG",
                "Dedicated Customer Support Officer",
            ],
        },
        {
            id: "premium-plus",
            category: "commercial",
            name: "Paket Industri Premium+",
            target: "Kawasan Industri, Mall & Pabrik",
            price: "5.200.000",
            priceDetail: "Estimasi mulai dari / bln",
            pickup: "Setiap Hari (7 Hari)",
            capacity: "Maks. 4m³ per ritase (Multi-trip)",
            maxDays: 7,
            description: "Pengelolaan limbah terpadu skala industri tanpa perlu memilah di hulu dengan komitmen recovery sirkular maksimal.",
            features: [
                "Layanan residu tanpa pemilahan awal",
                "Jadwal fleksibel multi-ritase per hari",
                "Sertifikat Penyerapan Residu & ESG Report",
                "Kunjungan audit kebersihan berkala",
                "Akses penuh analitik limbah real-time",
            ],
        },
        {
            id: "request",
            category: "ondemand",
            name: "Paket Request (On-Demand)",
            target: "Event, Renovasi & Insidental",
            price: "500.000",
            priceDetail: "Mulai dari / penjemputan",
            pickup: "Sekali Angkut (Sesuai Panggilan)",
            capacity: "Sesuai armada yang dipesan",
            maxDays: 0,
            dayPickerDisabled: true,
            description: "Layanan penjemputan sampah on-call yang cepat dan fleksibel untuk kebutuhan penanganan mendadak.",
            features: [
                "Layanan jemput cepat berdasarkan panggilan",
                "Jadwal fleksibel (Booking sesuai kebutuhan)",
                "Armada pickup / truk boks resmi",
                "Konsultasi estimasi via WhatsApp",
            ],
        },
        {
            id: "household-suburban",
            category: "ondemand",
            name: "Paket Klaster Residensial",
            target: "Klaster Hunian & Radius >10km",
            price: "1.000.000",
            priceDetail: "Mulai dari / bln",
            pickup: "Maks. 5 Hari / Minggu",
            capacity: "Maks. 1m³ (4 kantong besar)",
            maxDays: 5,
            description: "Penjemputan rutin untuk area klaster hunian atau lokasi dengan jarak logistik lebih dari 10 km dari fasilitas pusat.",
            features: [
                "Maksimal 1m³ per jadwal ritase",
                "Pilihan 5 hari penjemputan per minggu",
                "Armada berjadwal berkala",
                "Akses pencatatan jadwal aplikasi",
            ],
        },
    ];

    const filteredPackages = packages.filter((pkg) => {
        if (activeTab === "all") return true;
        return pkg.category === activeTab;
    });

    return (
        <div className="bg-[#F8FAF8] dark:bg-zinc-950 min-h-screen font-sans text-ink dark:text-zinc-100 selection:bg-lime selection:text-ink">
            <SEO
                title="Layanan & Paket Pengelolaan Sampah - WellTrash"
                description="Pilihan skema jasa pengangkutan limbah komersial terjadwal, legalitas resmi, dan pelaporan ESG transparan untuk bisnis di Kabupaten Jember."
            />
            <Navbar />

            {/* Hero Section: Green Deep Editorial Background per design.md */}
            <section className="bg-green-deep dark:bg-zinc-900 text-white pt-36 md:pt-44 pb-20 md:pb-28 px-6 lg:px-12 border-b border-white/10 dark:border-zinc-800 relative overflow-hidden">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-12">
                        <div className="lg:col-span-8">
                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold text-white tracking-tight leading-[1.05]">
                                Pengelolaan sampah terjadwal &amp;{" "}
                                <span className="font-serif italic font-normal text-lime dark:text-emerald-400">
                                    legalitas lengkap.
                                </span>
                            </h1>
                        </div>
                        <div className="lg:col-span-4">
                            <p className="font-sans text-base sm:text-lg text-white/80 dark:text-zinc-300 leading-relaxed">
                                Dirancang khusus untuk operasional bisnis, fasilitas kesehatan non-B3, hotel, dan restoran di Kabupaten Jember dengan jaminan SLA dan ketepatan ritase.
                            </p>
                        </div>
                    </div>

                    {/* Operational Highlights */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/10 dark:border-zinc-800">
                        <div>
                            <span className="font-mono text-2xl md:text-3xl font-bold text-lime dark:text-emerald-400 block mb-1 tabular-nums">99.2%</span>
                            <span className="font-sans text-xs text-white/75 dark:text-zinc-400 font-medium">Ketepatan SLA Ritase</span>
                        </div>
                        <div>
                            <span className="font-mono text-2xl md:text-3xl font-bold text-lime dark:text-emerald-400 block mb-1 tabular-nums">100%</span>
                            <span className="font-sans text-xs text-white/75 dark:text-zinc-400 font-medium">Manifest Terverifikasi</span>
                        </div>
                        <div>
                            <span className="font-mono text-2xl md:text-3xl font-bold text-lime dark:text-emerald-400 block mb-1 tabular-nums">5-7 Hari</span>
                            <span className="font-sans text-xs text-white/75 dark:text-zinc-400 font-medium">Fleksibilitas Penjemputan</span>
                        </div>
                        <div>
                            <span className="font-mono text-2xl md:text-3xl font-bold text-lime dark:text-emerald-400 block mb-1 tabular-nums">Audit ESG</span>
                            <span className="font-sans text-xs text-white/75 dark:text-zinc-400 font-medium">Laporan Tonase Bulanan</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Segmented Control & Packages Section */}
            <section className="py-16 md:py-24 px-6 lg:px-12">
                <div className="max-w-[1440px] mx-auto">
                    {/* Segmented Control Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 pb-6 border-b border-black/10 dark:border-zinc-800">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-ink dark:text-white tracking-tight mb-1">
                                Skema Kemitraan Fasilitas
                            </h2>
                            <p className="font-sans text-xs sm:text-sm text-muted dark:text-zinc-400">
                                Sesuaikan jenis kontrak dengan frekuensi dan karakteristik timbulan limbah fasilitas Anda.
                            </p>
                        </div>

                        {/* Segmented Control Pill */}
                        <div className="inline-flex p-1 bg-white dark:bg-zinc-900 border border-black/15 dark:border-zinc-800 rounded-full self-start sm:self-auto shadow-sm">
                            <button
                                type="button"
                                onClick={() => setActiveTab("all")}
                                className={`px-4 py-1.5 rounded-full font-sans text-xs font-medium transition-colors ${
                                    activeTab === "all" ? "bg-green-forest dark:bg-emerald-600 text-white" : "text-muted dark:text-zinc-400 hover:text-ink dark:hover:text-white"
                                }`}
                            >
                                Semua Paket
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("commercial")}
                                className={`px-4 py-1.5 rounded-full font-sans text-xs font-medium transition-colors ${
                                    activeTab === "commercial" ? "bg-green-forest dark:bg-emerald-600 text-white" : "text-muted dark:text-zinc-400 hover:text-ink dark:hover:text-white"
                                }`}
                            >
                                Rutin Komersial
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("ondemand")}
                                className={`px-4 py-1.5 rounded-full font-sans text-xs font-medium transition-colors ${
                                    activeTab === "ondemand" ? "bg-green-forest dark:bg-emerald-600 text-white" : "text-muted dark:text-zinc-400 hover:text-ink dark:hover:text-white"
                                }`}
                            >
                                On-Demand & Khusus
                            </button>
                        </div>
                    </div>

                    {/* 3-Column Grid per design.md */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

                        {filteredPackages.map((pkg) => {
                            const isFeatured = pkg.isFeatured;
                            return (
                                <div
                                    key={pkg.id}
                                    className={`relative flex flex-col justify-between bg-white dark:bg-zinc-900 rounded-sm p-6 sm:p-8 transition-colors ${
                                        isFeatured
                                            ? "border-2 border-green-forest dark:border-emerald-500 shadow-md"
                                            : "border border-black/10 dark:border-zinc-800 hover:border-black/25 dark:hover:border-zinc-700"
                                    }`}
                                >
                                    {isFeatured && (
                                        <div className="absolute -top-3.5 left-6 bg-green-forest dark:bg-emerald-600 text-lime dark:text-white font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-medium">
                                            ★ PILIHAN UTAMA MITRA
                                        </div>
                                    )}

                                    <div>
                                        <span className="font-mono text-xs uppercase tracking-wider text-muted dark:text-zinc-400 block mb-1">
                                            {pkg.target}
                                        </span>
                                        <h3 className="font-sans font-semibold text-xl text-ink dark:text-white mb-2">
                                            {pkg.name}
                                        </h3>
                                        <p className="font-sans text-xs text-muted dark:text-zinc-400 leading-relaxed mb-6">
                                            {pkg.description}
                                        </p>

                                        {/* Price block */}
                                        <div className="pt-4 pb-4 border-t border-black/10 dark:border-zinc-800">
                                            <span className="font-mono text-[11px] uppercase tracking-wider text-muted dark:text-zinc-400 block mb-1">
                                                {pkg.priceDetail}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="font-mono text-xs text-muted dark:text-zinc-400">Rp</span>
                                                <span className="font-mono text-3xl sm:text-4xl font-medium text-green-forest dark:text-emerald-400 tracking-tight">
                                                    {pkg.price}
                                                </span>
                                            </div>
                                            <p className="font-sans text-[11px] text-muted/75 dark:text-zinc-500 italic mt-1 leading-snug">
                                                *Nilai final disesuaikan dengan audit volume & ritase timbulan.
                                            </p>
                                        </div>

                                        {/* Capacity & Pickup Details */}
                                        <div className="grid grid-cols-2 gap-2 py-3 border-y border-black/10 dark:border-zinc-800 text-xs">
                                            <div>
                                                <span className="font-mono text-[10px] text-muted dark:text-zinc-500 block uppercase">Kapasitas</span>
                                                <span className="font-sans font-medium text-ink dark:text-zinc-200">{pkg.capacity}</span>
                                            </div>
                                            <div>
                                                <span className="font-mono text-[10px] text-muted dark:text-zinc-500 block uppercase">Frekuensi</span>
                                                <span className="font-sans font-medium text-ink dark:text-zinc-200">{pkg.pickup}</span>
                                            </div>
                                        </div>

                                        {/* Interactive Day Picker */}
                                        <DayPicker maxDays={pkg.maxDays} disabled={pkg.dayPickerDisabled} />

                                        {/* Feature Checklist */}
                                        <ul className="space-y-2.5 my-6 text-xs font-sans text-ink dark:text-zinc-200">
                                            {pkg.features.map((feat, fIdx) => (
                                                <li key={fIdx} className="flex items-start gap-2.5">
                                                    <svg className="w-4 h-4 text-green-forest dark:text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                    <span className="leading-tight text-ink/90 dark:text-zinc-300">{feat}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action CTA */}
                                    <div className="pt-4 border-t border-black/10 dark:border-zinc-800">
                                        {pkg.id === "request" ? (
                                            <a
                                                href="https://wa.me/62819848706?text=Halo%20WellTrash,%20saya%20ingin%20konsultasi%20Paket%20Request%20On-Demand%20untuk%20fasilitas%20kami"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full block py-3 rounded-sm font-sans text-xs font-semibold uppercase tracking-wider text-center transition-colors bg-white dark:bg-zinc-800 border border-green-forest dark:border-emerald-500 text-green-forest dark:text-emerald-400 hover:bg-green-forest dark:hover:bg-emerald-600 hover:text-white"
                                            >
                                                Hubungi WhatsApp Bisnis
                                            </a>
                                        ) : (
                                            <Link
                                                href={route("register")}
                                                className={`w-full block py-3 rounded-sm font-sans text-xs font-semibold uppercase tracking-wider text-center transition-colors ${
                                                    isFeatured
                                                        ? "bg-green-forest dark:bg-emerald-600 text-lime dark:text-white hover:bg-black dark:hover:bg-emerald-500"
                                                        : "bg-green-forest dark:bg-emerald-600 text-white hover:bg-black dark:hover:bg-emerald-500"
                                                }`}
                                            >
                                                Pilih Paket Kemitraan
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Video & Komitmen Operasional */}
            <section className="bg-white dark:bg-zinc-900 border-t border-black/10 dark:border-zinc-800 py-20 md:py-28 px-6 lg:px-12">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        <div className="lg:col-span-5">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-ink dark:text-white tracking-tight leading-tight mb-6">
                                Mengapa fasilitas bisnis mempercayakan limbah kepada{" "}
                                <span className="font-serif italic font-normal text-green-forest dark:text-emerald-400">
                                    WellTrash.
                                </span>
                            </h2>
                            <p className="font-sans text-base text-muted dark:text-zinc-400 leading-relaxed mb-6">
                                Pengelolaan limbah komersial dijalankan melalui tata kelola terukur. Setiap ritase dikelola dengan SOP kebersihan ketat, armada berizin resmi, dan pelaporan terstandarisasi untuk audit lingkungan korporat.
                            </p>
                            <div className="space-y-4 pt-4 border-t border-black/10 dark:border-zinc-800">
                                {[
                                    { title: "Manifest & Timbangan Digital", desc: "Data tonase real-time tercatat transparan untuk pemenuhan ESG." },
                                    { title: "Zero Spill Commitment", desc: "Armada tertutup dengan wadah terstandar mencegah ceceran bau & cairan." },
                                    { title: "Pemulihan Hilir Berkelanjutan", desc: "Material diarahkan ke biokonversi maggot BSF & daur ulang industri." },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <span className="w-2 h-2 rounded-full bg-green-forest dark:bg-emerald-400 shrink-0 mt-1.5" />
                                        <div>
                                            <h4 className="font-sans font-semibold text-sm text-ink dark:text-white">{item.title}</h4>
                                            <p className="font-sans text-xs text-muted dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <div className="relative rounded-sm overflow-hidden border border-black/10 dark:border-zinc-800">
                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full aspect-video object-cover"
                                    src={videoDemo}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section - Lime Background */}
            <section className="bg-lime dark:bg-zinc-900 text-green-deep dark:text-white py-20 md:py-28 px-6 lg:px-12 relative overflow-hidden border-t border-black/5 dark:border-zinc-800">
                <CtaBackgroundIllustration />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold text-green-deep dark:text-white tracking-tight leading-tight mb-6">
                        Dapatkan Asesmen Volume & Penawaran Resmi
                    </h2>
                    <p className="font-sans text-base sm:text-lg text-green-deep/90 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-10">
                        Tim spesialis kami siap mengunjungi fasilitas bisnis Anda di Jember untuk menghitung estimasi timbulan sampah dan merancang jadwal ritase paling efisien.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href={route("register")}
                            className="w-full sm:w-auto px-8 py-3.5 bg-green-deep dark:bg-emerald-600 text-white hover:bg-black dark:hover:bg-emerald-500 font-sans font-semibold text-sm rounded-sm transition-colors duration-200 tracking-tight"
                        >
                            Daftar Kemitraan Sekarang
                        </Link>
                        <a
                            href="https://wa.me/62819848706?text=Halo%20WellTrash,%20kami%20ingin%20jadwalkan%20survei%20dan%20asesmen%20limbah%20fasilitas%20kami"
                            target="_blank"
                            rel="noreferrer"
                            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-green-deep/30 dark:border-zinc-700 text-green-deep dark:text-zinc-200 hover:border-green-deep dark:hover:border-zinc-500 dark:hover:bg-zinc-800/60 font-sans font-semibold text-sm rounded-sm transition-colors duration-200 tracking-tight"
                        >
                            Hubungi Tim Bisnis (WhatsApp)
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Services;

