import React from "react";
import { Link } from "@inertiajs/react";
import SEO from "@/Components/SEO";
import Navbar from "@/Components/Navbar";
import Mitra from "@/Components/Mitra";
import Why from "@/Components/Why";
import WasteFlow from "@/Components/WasteFlow";
import ActivitiesSection, { Activity } from "@/Components/ActivitiesSection";
import NewsSection, { NewsItem } from "@/Components/NewsSection";
import FaqSection from "@/Components/FaqSection";
import Footer from "@/Components/Footer";
import heroWasteTransport from "@/assets/img/hero_waste_transport.webp";
import {
    Sparkles,
    ArrowRight,
    MessageSquare,
    Building2,
    Scale,
    MapPin,
    ShieldCheck,
    Clock,
    Activity as ActivityIcon,
    CheckCircle2,
    Package,
    Recycle,
    PackageSearch,
    PackageOpen,
    Boxes,
    FileSpreadsheet,
    Layers,
} from "lucide-react";
import { motion } from "motion/react";

interface KatalogItem {
    id: number;
    name: string;
    description: string;
    price: number | null;
    image_path: string | null;
}

interface Props {
    activities: Activity[];
    news: NewsItem[];
    katalogs: KatalogItem[];
}

const STATS = [
    { number: "30+", label: "Mitra Bisnis Aktif", icon: Building2, color: "text-emerald-700 bg-emerald-50" },
    { number: "8.000 kg+", label: "Sampah Teralihkan", icon: Scale, color: "text-orange-600 bg-orange-50" },
    { number: "100%", label: "Cakupan Kab. Jember", icon: MapPin, color: "text-emerald-700 bg-emerald-50" },
];

const Welcome: React.FC<Props> = ({ activities = [], news = [], katalogs = [] }) => {
    return (
        <div className="bg-white text-zinc-900 min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900">
            <SEO
                title="Pengelolaan Sampah Terjadwal untuk Bisnis di Jember"
                description="Layanan jasa pengangkutan dan pengelolaan sampah komersial B2B di Jember. Terjadwal, bertanggung jawab, dan terukur untuk mendukung pelaporan ESG bisnis Anda."
            />
            <Navbar />

            {/* Modern Minimalist Hero Section (Dominant White) */}
            <section className="relative bg-white text-zinc-900 pt-36 pb-20 lg:pt-44 lg:pb-32 overflow-hidden border-b border-zinc-100">
                {/* Ambient Light Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.45] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                    }}
                />
                {/* Soft ambient radial glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-50/50 rounded-full blur-3xl pointer-events-none -z-0" />

                {/* Hero Content Container */}
                <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 w-full text-center">
                    {/* Operational Status Pill */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-zinc-50 border border-zinc-200/80 rounded-full font-mono text-xs text-zinc-700 mb-8 shadow-2xs backdrop-blur-sm"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="tracking-tight font-medium">Layanan Pengelolaan Sampah Komersial Terpadu • Jember</span>
                    </motion.div>

                    {/* Headline & Description */}
                    <div className="max-w-4xl mx-auto">
                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-sans font-bold tracking-tight text-zinc-900 leading-[1.08] mb-6"
                        >
                            Pengelolaan sampah terjadwal untuk bisnis &amp;{" "}
                            <span className="font-serif italic text-emerald-800 font-normal">
                                institusi di Jember.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-zinc-600 font-sans text-base sm:text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl mx-auto font-normal"
                        >
                            Layanan penjemputan berkala terstandarisasi, pemilahan bertanggung jawab di fasilitas WellTrash Farm, dan pelaporan kepatuhan ESG yang transparan.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14 sm:mb-16"
                        >
                            <Link
                                href={route("login")}
                                className="w-full sm:w-auto bg-zinc-900 text-white hover:bg-zinc-800 font-sans font-medium text-sm px-7 py-3.5 rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2.5 shadow-sm hover:shadow group"
                            >
                                <span>Konsultasi Kebutuhan Bisnis</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <a
                                href="https://wa.me/62819848706"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto border border-zinc-200 text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 px-7 py-3.5 rounded-xl font-sans font-medium text-sm transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-2xs"
                            >
                                <MessageSquare className="w-4 h-4 text-emerald-700" />
                                <span>WhatsApp Tim Bisnis</span>
                            </a>
                        </motion.div>
                    </div>

                    {/* Operational Showcase Card (Clean White Surface) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.35 }}
                        className="max-w-4xl mx-auto bg-white rounded-2xl border border-zinc-200/80 shadow-xl shadow-zinc-900/5 p-6 sm:p-8 relative text-left"
                    >
                        {/* Status bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-zinc-100 gap-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                    <ActivityIcon className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-zinc-900">WellTrash Operational Telemetry</div>
                                    <div className="text-[11px] text-zinc-500 font-mono">Sistem Penjadwalan &amp; Logistik Terintegrasi</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60 self-start sm:self-auto">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                <span>Armada &amp; MRF Aktif</span>
                            </div>
                        </div>

                        {/* Consolidated Stats Grid with Logo Harmony */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                            {STATS.map((stat, i) => {
                                const IconComponent = stat.icon;
                                return (
                                    <div
                                        key={stat.label}
                                        className={i !== 0 ? "sm:border-l sm:border-zinc-100 sm:pl-6 lg:pl-8" : ""}
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${stat.color}`}>
                                                <IconComponent className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="font-sans text-xs text-zinc-500 font-medium">
                                                {stat.label}
                                            </span>
                                        </div>
                                        <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 tabular-nums">
                                            {stat.number}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Trust Bar (Grayscale Partner Logos) */}
            <Mitra />

            {/* B2B Solutions */}
            <Why />

            {/* 4-Step Operational Flow */}
            <WasteFlow />

            {/* Mengapa WellTrash (Keunggulan Operasional) */}
            <section id="keunggulan" className="scroll-mt-24 bg-zinc-50/50 text-zinc-900 py-20 lg:py-28 border-b border-zinc-200/60">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="lg:col-span-7"
                        >
                            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full font-mono mb-4 inline-block">
                                KEUNGGULAN OPERASIONAL
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-zinc-900 leading-[1.15] mb-5">
                                Partner operasional yang dapat Anda andalkan.
                            </h2>
                            <p className="text-zinc-600 font-sans text-base lg:text-lg leading-relaxed mb-9 max-w-2xl">
                                Kami memahami reputasi dan kepatuhan institusi Anda. WellTrash hadir bukan sebagai perantara, melainkan mitra pengelola limbah profesional dengan integritas layanan tinggi di Jember.
                            </p>

                            <div className="space-y-4">
                                <div className="border border-zinc-200/80 bg-white p-5 sm:p-6 rounded-2xl hover:border-zinc-300 hover:shadow-xs transition-all duration-200">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center shrink-0">
                                            <Clock className="w-5 h-5 text-emerald-700" />
                                        </div>
                                        <div>
                                            <h3 className="font-sans font-bold text-base sm:text-lg text-zinc-900 mb-1">
                                                Terjadwal dan tepat waktu
                                            </h3>
                                            <p className="font-sans text-xs sm:text-sm text-zinc-500 leading-relaxed">
                                                Pilihan frekuensi penjemputan fleksibel dengan jaminan ketepatan jadwal armada logistik tanpa mengganggu kelancaran operasional bisnis Anda.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-zinc-200/80 bg-white p-5 sm:p-6 rounded-2xl hover:border-zinc-300 hover:shadow-xs transition-all duration-200">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center shrink-0">
                                            <ShieldCheck className="w-5 h-5 text-emerald-700" />
                                        </div>
                                        <div>
                                            <h3 className="font-sans font-bold text-base sm:text-lg text-zinc-900 mb-1">
                                                Proses aman dan transparan
                                            </h3>
                                            <p className="font-sans text-xs sm:text-sm text-zinc-500 leading-relaxed">
                                                Standar operasional higienis, tim terlatih dengan kelengkapan APD resmi, serta kepastian legalitas melalui surat perjanjian kerja sama (MOU) resmi.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-zinc-200/80 bg-white p-5 sm:p-6 rounded-2xl hover:border-zinc-300 hover:shadow-xs transition-all duration-200">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center shrink-0">
                                            <Recycle className="w-5 h-5 text-emerald-700" />
                                        </div>
                                        <div>
                                            <h3 className="font-sans font-bold text-base sm:text-lg text-zinc-900 mb-1">
                                                Berorientasi pada dampak nyata
                                            </h3>
                                            <p className="font-sans text-xs sm:text-sm text-zinc-500 leading-relaxed">
                                                Komitmen pemulihan material bernilai di WellTrash Farm untuk menekan timbulan residu yang berakhir di Tempat Pembuangan Akhir (TPA) Pakusari.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Operational Ecosystem Showcase Card with Real Photography & Telemetry */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="lg:col-span-5"
                        >
                            <div className="border border-zinc-200/80 rounded-2xl bg-white shadow-xl shadow-zinc-900/5 p-5 sm:p-6">
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-mono text-xs uppercase text-zinc-900 font-bold block">
                                                SISTEM TERINTEGRASI
                                            </span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        </div>
                                        <span className="font-sans text-xs text-zinc-500">Ekosistem Pengelolaan Limbah Jember</span>
                                    </div>
                                    <span className="font-mono text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200/70 px-2.5 py-1 rounded-full font-semibold">
                                        End-to-End
                                    </span>
                                </div>

                                {/* Real Transport Fleet Photo with Dynamic Overlay */}
                                <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-4 border border-zinc-200/70 shadow-2xs">
                                    <img
                                        src={heroWasteTransport}
                                        alt="Armada pengangkutan komersial WellTrash Jember"
                                        loading="lazy"
                                        className="w-full h-full object-cover filter brightness-[0.97]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                                        <div>
                                            <span className="font-mono text-[10px] uppercase text-white/80 block">
                                                Armada Resmi Berizin
                                            </span>
                                            <p className="font-sans text-xs sm:text-sm font-bold">
                                                Logistik Terjadwal Seluruh Jember
                                            </p>
                                        </div>
                                        <span className="font-mono text-[10px] bg-emerald-600/90 backdrop-blur-md px-2 py-0.5 rounded-md font-medium">
                                            Aktif Harian
                                        </span>
                                    </div>
                                </div>

                                {/* Telemetry Badges with Logo Color Accents */}
                                <div className="space-y-2.5">
                                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/70 flex items-center justify-between text-xs font-sans">
                                        <div className="flex items-center gap-2 text-zinc-700">
                                            <Clock className="w-4 h-4 text-emerald-700" />
                                            <span>Rute Terjadwal &amp; Zero-Spill</span>
                                        </div>
                                        <span className="font-mono font-semibold text-emerald-800 text-[11px]">SLA On-Time</span>
                                    </div>

                                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/70 flex items-center justify-between text-xs font-sans">
                                        <div className="flex items-center gap-2 text-zinc-700">
                                            <FileSpreadsheet className="w-4 h-4 text-orange-600" />
                                            <span>Pencatatan Manifest Tonase Digital</span>
                                        </div>
                                        <span className="font-mono font-semibold text-orange-700 text-[11px]">Audit DLH</span>
                                    </div>

                                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/70 flex items-center justify-between text-xs font-sans">
                                        <div className="flex items-center gap-2 text-zinc-700">
                                            <Layers className="w-4 h-4 text-emerald-700" />
                                            <span>Pemilahan Hilir di WellTrash Farm</span>
                                        </div>
                                        <span className="font-mono font-semibold text-emerald-800 text-[11px]">100% Sirkular</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Circular Economy Catalog */}
            <section className="bg-white py-20 lg:py-28 border-b border-zinc-100">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
                    >
                        <div>
                            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full font-mono mb-4 inline-block">
                                EKONOMI SIRKULAR
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-zinc-900 leading-tight">
                                Dari sampah menjadi produk bernilai.
                            </h2>
                            <p className="text-zinc-600 font-sans text-base max-w-xl mt-3 leading-relaxed">
                                Wujud nyata rantai nilai sirkular dari sampah terpilah yang kami olah kembali menjadi material dan produk bernilai guna di Kabupaten Jember.
                            </p>
                        </div>

                        <Link
                            href={route("katalog")}
                            className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-zinc-900 hover:text-emerald-700 transition-colors shrink-0 group"
                        >
                            <span>Lihat Semua Katalog</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>

                    {katalogs.length === 0 ? (
                        <div className="py-14 px-6 text-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/70 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-200/80 flex items-center justify-center mb-4 text-emerald-800 shadow-2xs">
                                <Boxes className="w-8 h-8 text-emerald-700" />
                            </div>
                            <h4 className="font-sans font-bold text-zinc-900 text-base mb-1">
                                Portofolio Produk Daur Ulang WellTrash Farm
                            </h4>
                            <p className="text-zinc-500 font-sans text-xs sm:text-sm max-w-md">
                                WellTrash Farm memproses material organik menjadi pupuk hayati &amp; pakan maggot BSF, serta membaling limbah anorganik bernilai ekonomis untuk industri daur ulang.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {katalogs.slice(0, 3).map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                >
                                    <Link
                                        href={route("katalog")}
                                        className="group bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between h-full hover:border-zinc-300 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div>
                                            <div className="aspect-[4/3] bg-zinc-50 rounded-xl overflow-hidden mb-5 border border-zinc-100 flex items-center justify-center">
                                                {item.image_path ? (
                                                    <img
                                                        src={`/storage/${item.image_path}`}
                                                        alt={item.name}
                                                        loading="lazy"
                                                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center p-6 text-zinc-400">
                                                        <PackageOpen className="w-10 h-10 text-zinc-300 mb-1.5" />
                                                        <span className="font-mono text-[11px] text-zinc-400">Produk Daur Ulang</span>
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="font-sans font-bold text-lg text-zinc-900 mb-2 group-hover:text-emerald-700 transition-colors">
                                                {item.name}
                                            </h3>
                                            <p className="font-sans text-xs sm:text-sm text-zinc-500 line-clamp-2 leading-relaxed mb-6">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                                            <span className="font-mono text-sm font-bold text-zinc-900">
                                                {item.price && Number(item.price) > 0
                                                    ? `Rp ${Number(item.price).toLocaleString("id-ID")}`
                                                    : "Hubungi kami untuk penawaran"}
                                            </span>
                                            <span className="text-xs font-sans font-semibold text-zinc-500 group-hover:text-emerald-700 inline-flex items-center gap-1 transition-colors">
                                                Detail <ArrowRight className="w-3.5 h-3.5" />
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Field Activities */}
            <ActivitiesSection activities={activities} />

            {/* News and Insights */}
            <NewsSection news={news} />

            {/* FAQ Accordion with JSON-LD */}
            <FaqSection />

            {/* Final Conversion CTA: Minimalist Modern Card with Logo Green & Orange Accents */}
            <section className="bg-white py-20 lg:py-28 relative overflow-hidden">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-5xl mx-auto rounded-3xl bg-zinc-950 text-white p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-2xl border border-zinc-800/80 text-center"
                    >
                        {/* Dual Ambient Glow: Green on left, Orange on right (matching WellTrash logo) */}
                        <div className="absolute -top-24 -left-16 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -right-16 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/80 text-zinc-300 text-xs font-mono font-medium mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span>KEMITRAAN OPERASIONAL BISNIS</span>
                                <span className="text-orange-400 font-bold ml-1">• JEMBER</span>
                            </span>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-white leading-tight max-w-2xl mx-auto mb-5">
                                Operasional lebih bersih dimulai dari satu percakapan.
                            </h2>

                            <p className="text-zinc-400 font-sans text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-9">
                                Konsultasikan volume sampah dan pola operasional bisnis Anda bersama tim WellTrash. Dapatkan skema penjemputan berkala dan estimasi penanganan limbah terpadu se-Kabupaten Jember.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
                                <Link
                                    href={route("login")}
                                    className="w-full sm:w-auto bg-white text-zinc-900 hover:bg-zinc-100 rounded-xl font-sans font-semibold text-sm px-8 py-4 transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-sm group"
                                >
                                    <span>Hubungi Tim Bisnis</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <a
                                    href="https://wa.me/62819848706"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full sm:w-auto border border-zinc-800 text-zinc-200 hover:bg-zinc-900 hover:border-zinc-700 rounded-xl font-sans font-medium text-sm px-8 py-4 transition-all duration-200 inline-flex items-center justify-center gap-2"
                                >
                                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                                    <span>Konsultasi via WhatsApp</span>
                                </a>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-400 pt-6 border-t border-zinc-800/80">
                                <span className="inline-flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Surat Perjanjian Kerja Sama (MOU)</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                                    <span>Laporan Timbangan Terverifikasi</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Dukungan Pelaporan ESG</span>
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Welcome;
