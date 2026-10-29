import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import SEO from "@/Components/SEO";
import Navbar from "@/Components/Navbar";
import Mitra from "@/Components/Mitra";
import Why, { SolutionData, SolutionSettingsData } from "@/Components/Why";
import WasteFlow from "@/Components/WasteFlow";
import ActivitiesSection, { Activity } from "@/Components/ActivitiesSection";
import NewsSection, { NewsItem } from "@/Components/NewsSection";
import FaqSection from "@/Components/FaqSection";
import Footer from "@/Components/Footer";
import {
    Sparkles,
    ArrowRight,
    MessageSquare,
    Building2,
    Scale,
    MapPin,
    CheckCircle2,
    Package,
    PackageSearch,
    PackageOpen,
    Boxes,
    X,
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
    solutions?: SolutionData[];
    solutionSettings?: SolutionSettingsData;
}

const STATS = [
    {
        number: "30+",
        label: "Mitra Bisnis Aktif",
        icon: Building2,
        color: "text-emerald-700 bg-emerald-50",
    },
    {
        number: "8.000 kg+",
        label: "Sampah Teralihkan",
        icon: Scale,
        color: "text-orange-600 bg-orange-50",
    },
    {
        number: "100%",
        label: "Cakupan Kab. Jember",
        icon: MapPin,
        color: "text-emerald-700 bg-emerald-50",
    },
];

const Welcome: React.FC<Props> = ({
    activities = [],
    news = [],
    katalogs = [],
    solutions = [],
    solutionSettings,
}) => {
    const [selectedKatalog, setSelectedKatalog] = useState<KatalogItem | null>(
        null,
    );
    return (
        <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen font-sans selection:bg-emerald-100 dark:selection:bg-emerald-900/60 selection:text-emerald-900 dark:selection:text-emerald-100">
            <SEO
                title="Pengelolaan Sampah Terjadwal untuk Bisnis di Jember"
                description="Layanan jasa pengangkutan dan pengelolaan sampah komersial B2B di Jember. Terjadwal, bertanggung jawab, dan terukur untuk mendukung pelaporan ESG bisnis Anda."
            />
            <Navbar />

            {/* Modern Minimalist Hero Section */}
            <section className="relative bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pt-36 pb-20 lg:pt-44 lg:pb-32 overflow-hidden border-b border-zinc-100 dark:border-zinc-800/80">
                {/* Ambient Light Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.45] dark:opacity-[0.12] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                    }}
                />
                {/* Soft ambient radial glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-50/50 dark:bg-emerald-900/20 rounded-full blur-3xl pointer-events-none -z-0" />

                {/* Hero Content Container */}
                <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 w-full text-center">
                    {/* Headline & Description */}
                    <div className="max-w-4xl mx-auto">
                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-sans font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.08] mb-6"
                        >
                            Pengelolaan sampah terjadwal untuk bisnis &amp;{" "}
                            <span className="font-serif italic text-emerald-800 dark:text-emerald-400 font-normal">
                                institusi di Jember.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-zinc-600 dark:text-zinc-300 font-sans text-base sm:text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl mx-auto font-normal"
                        >
                            Layanan penjemputan berkala terstandarisasi,
                            pemilahan bertanggung jawab di fasilitas WellTrash
                            Farm, dan pelaporan kepatuhan ESG yang transparan.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14 sm:mb-16"
                        >
                            <a
                                href="https://wa.me/62819848706"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto bg-zinc-900 dark:bg-emerald-600 text-white hover:bg-zinc-800 dark:hover:bg-emerald-500 font-sans font-medium text-sm px-7 py-3.5 rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2.5 shadow-sm hover:shadow group"
                            >
                                <MessageSquare className="w-4 h-4 text-emerald-400 dark:text-white" />
                                <span>Hubungi Welltrash</span>
                            </a>
                        </motion.div>
                    </div>

                    {/* Operational Showcase Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.35 }}
                        className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xl shadow-zinc-900/5 dark:shadow-black/40 p-6 sm:p-8 relative text-left"
                    >
                        {/* Consolidated Stats Grid with Logo Harmony */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                            {STATS.map((stat, i) => {
                                const IconComponent = stat.icon;
                                return (
                                    <div
                                        key={stat.label}
                                        className={
                                            i !== 0
                                                ? "sm:border-l sm:border-zinc-100 sm:dark:border-zinc-800 sm:pl-6 lg:pl-8"
                                                : ""
                                        }
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div
                                                className={`w-6 h-6 rounded-md flex items-center justify-center ${stat.color} dark:bg-opacity-20`}
                                            >
                                                <IconComponent className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="font-sans text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                                {stat.label}
                                            </span>
                                        </div>
                                        <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white tabular-nums">
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
            <Why solutions={solutions} settings={solutionSettings} />

            {/* 4-Step Operational Flow */}
            <WasteFlow />

            {/* Circular Economy Catalog */}
            <section className="bg-white dark:bg-zinc-950 py-20 lg:py-28 border-b border-zinc-100 dark:border-zinc-800">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
                    >
                        <div>
                            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-3 py-1 rounded-full font-mono mb-4 inline-block">
                                EKONOMI SIRKULAR
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
                                Dari sampah menjadi produk bernilai.
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-300 font-sans text-base max-w-xl mt-3 leading-relaxed">
                                Wujud nyata rantai nilai sirkular dari sampah
                                terpilah yang kami olah kembali menjadi material
                                dan produk bernilai guna di Kabupaten Jember.
                            </p>
                        </div>

                        <Link
                            href={route("katalog")}
                            className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-zinc-900 dark:text-zinc-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors shrink-0 group"
                        >
                            <span>Lihat Semua Katalog</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>

                    {katalogs.length === 0 ? (
                        <div className="py-14 px-6 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center mb-4 text-emerald-800 dark:text-emerald-400 shadow-2xs">
                                <Boxes className="w-8 h-8 text-emerald-700 dark:text-emerald-400" />
                            </div>
                            <h4 className="font-sans font-bold text-zinc-900 dark:text-white text-base mb-1">
                                Portofolio Produk Daur Ulang WellTrash Farm
                            </h4>
                            <p className="text-zinc-500 dark:text-zinc-400 font-sans text-xs sm:text-sm max-w-md">
                                WellTrash Farm memproses material organik
                                menjadi pupuk hayati &amp; pakan maggot BSF,
                                serta membaling limbah anorganik bernilai
                                ekonomis untuk industri daur ulang.
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
                                    transition={{
                                        duration: 0.5,
                                        delay: idx * 0.1,
                                    }}
                                >
                                    <div
                                        onClick={() => setSelectedKatalog(item)}
                                        className="group cursor-pointer bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between h-full hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div>
                                            <div className="aspect-[4/3] bg-zinc-50 dark:bg-zinc-800/60 rounded-xl overflow-hidden mb-5 border border-zinc-100 dark:border-zinc-700/60 flex items-center justify-center">
                                                {item.image_path ? (
                                                    <img
                                                        src={`/storage/${item.image_path}`}
                                                        alt={item.name}
                                                        loading="lazy"
                                                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center p-6 text-zinc-400">
                                                        <PackageOpen className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mb-1.5" />
                                                        <span className="font-mono text-[11px] text-zinc-400">
                                                            Produk Daur Ulang
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="font-sans font-bold text-lg text-zinc-900 dark:text-white mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                                {item.name}
                                            </h3>
                                            <p className="font-sans text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-6">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                            <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">
                                                {item.price &&
                                                Number(item.price) > 0
                                                    ? `Rp ${Number(item.price).toLocaleString("id-ID")}`
                                                    : "Hubungi kami untuk penawaran"}
                                            </span>
                                            <span className="text-xs font-sans font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 inline-flex items-center gap-1 transition-colors">
                                                Detail{" "}
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Katalog Detail Modal */}
                {selectedKatalog && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedKatalog(null)}
                    >
                        <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-xs" />
                        <div
                            className="relative bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 z-10 max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedKatalog.image_path ? (
                                <div className="relative aspect-[16/10] bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-center p-6">
                                    <img
                                        src={`/storage/${selectedKatalog.image_path}`}
                                        alt={selectedKatalog.name}
                                        className="w-full h-full object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setSelectedKatalog(null)}
                                        aria-label="Tutup"
                                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-900/60 hover:bg-zinc-900/80 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedKatalog(null)}
                                        aria-label="Tutup"
                                        className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <div className="p-6 sm:p-7 overflow-y-auto space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                        Material Terverifikasi
                                    </span>
                                    <span className="font-mono text-base font-bold text-emerald-700 dark:text-emerald-400">
                                        {selectedKatalog.price &&
                                        Number(selectedKatalog.price) > 0
                                            ? `Rp ${Number(selectedKatalog.price).toLocaleString("id-ID")}`
                                            : "Penawaran MOQ"}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-sans font-bold text-zinc-900 dark:text-white tracking-tight">
                                        {selectedKatalog.name}
                                    </h3>
                                    <p className="text-zinc-600 dark:text-zinc-300 font-sans text-sm leading-relaxed mt-2.5 whitespace-pre-line">
                                        {selectedKatalog.description}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                                    <span className="font-mono uppercase text-[11px] font-bold text-zinc-700 dark:text-zinc-300 block">
                                        Ketentuan Pasokan &amp; Pengiriman:
                                    </span>
                                    <p>
                                        • Pasokan berkala untuk kebutuhan
                                        agribisnis dan industri daur ulang.
                                    </p>
                                    <p>
                                        • Pengiriman langsung dari fasilitas MRF
                                        WellTrash Farm Jember.
                                    </p>
                                </div>
                            </div>

                            <div className="p-5 sm:px-7 bg-zinc-50/70 dark:bg-zinc-850/80 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setSelectedKatalog(null)}
                                    className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                                >
                                    Tutup
                                </button>
                                <a
                                    href={`https://wa.me/62819848706?text=${encodeURIComponent(`Halo WellTrash, saya tertarik mengajukan penawaran untuk produk: ${selectedKatalog.name}.`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                                >
                                    Ajukan Penawaran (RFQ)
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Field Activities */}
            <ActivitiesSection activities={activities} />

            {/* News and Insights */}
            <NewsSection news={news} />

            {/* FAQ Accordion with JSON-LD */}
            <FaqSection />

            {/* Final Conversion CTA: Minimalist Modern Card with Logo Green & Orange Accents */}
            <section className="bg-white dark:bg-zinc-950 py-20 lg:py-28 relative overflow-hidden">
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
                                <span className="text-orange-400 font-bold ml-1">
                                    • JEMBER
                                </span>
                            </span>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-white leading-tight max-w-2xl mx-auto mb-5">
                                Operasional lebih bersih dimulai dari satu
                                percakapan.
                            </h2>

                            <p className="text-zinc-400 font-sans text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-9">
                                Konsultasikan volume sampah dan pola operasional
                                bisnis Anda bersama tim WellTrash. Dapatkan
                                skema penjemputan berkala dan estimasi
                                penanganan limbah terpadu se-Kabupaten Jember.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">

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
                                    <span>
                                        Surat Perjanjian Kerja Sama (MOU)
                                    </span>
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
