import React, { useState } from "react";
import SolutionDetailModal, { SolutionModalData } from "./SolutionDetailModal";
import imgTransport from "@/assets/img/hero_waste_transport.webp";
import imgSorting from "@/assets/img/hero_waste_sorting.webp";
import imgTeam from "@/assets/img/karyawanWelltrash.webp";
import {
    Building2,
    Factory,
    Recycle,
    ArrowRight,
    ShieldCheck,
    CheckCircle2,
    Sparkles,
    Truck,
    Leaf,
    Package,
    Warehouse,
} from "lucide-react";
import { motion } from "motion/react";

export interface SolutionData {
    id?: number;
    title: string;
    segment: string;
    tag: string;
    desc: string;
    icon?: string;
    accent_color?: "green" | "orange";
    image_path?: string | null;
    link_url?: string | null;
}

export interface SolutionSettingsData {
    badge?: string;
    title?: string;
    subtitle?: string;
    is_visible?: boolean;
}

interface WhyProps {
    solutions?: SolutionData[];
    settings?: SolutionSettingsData;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    Building2,
    Factory,
    Recycle,
    Truck,
    ShieldCheck,
    Leaf,
    Package,
    Warehouse,
    Sparkles,
};

const DEFAULT_SOLUTIONS = [
    {
        segment: "Komersial & Ritel",
        title: "Corporate Waste",
        desc: "Pengangkutan terjadwal untuk gedung perkantoran, pusat retail, hotel, dan kawasan komersial dengan jaminan kebersihan serta ketepatan ritme penjemputan armada.",
        icon: Building2,
        image: imgTransport,
        imageAlt: "Armada logistik pengangkutan komersial WellTrash",
        tag: "Logistik Terjadwal",
        accentColor: "green" as const,
        linkUrl: "/layanan",
    },
    {
        segment: "Industri Non-B3",
        title: "Industrial Waste",
        desc: "Penanganan sampah non-B3 industri dan manufaktur dengan standar operasional yang aman, kapasitas angkut tonase besar, dan bukti timbangan manifest legal.",
        icon: Factory,
        image: imgSorting,
        imageAlt: "Fasilitas pemilahan material industri WellTrash Farm",
        tag: "Kepatuhan Regulasi",
        accentColor: "orange" as const,
        linkUrl: "/layanan",
    },
    {
        segment: "Ekonomi Sirkular",
        title: "Recyclable Recovery",
        desc: "Pemilahan dan pemulihan material bernilai ekonomis untuk dialihkan dari TPA, mendukung rantai nilai daur ulang industri dan komitmen ESG perusahaan Anda.",
        icon: Recycle,
        image: imgTeam,
        imageAlt: "Tim pemrosesan dan daur ulang WellTrash Jember",
        tag: "Biokonversi & Daur Ulang",
        accentColor: "green" as const,
        linkUrl: "/layanan",
    },
];

const Why: React.FC<WhyProps> = ({ solutions: dbSolutions, settings }) => {
    const [selectedSolution, setSelectedSolution] = useState<SolutionModalData | null>(null);

    // Sembunyikan bagian jika dinonaktifkan di admin web atau semua kartu telah dihapus
    if (settings?.is_visible === false || (Array.isArray(dbSolutions) && dbSolutions.length === 0)) {
        return null;
    }

    const badgeText = settings?.badge || "SOLUSI B2B TERPADU";
    const titleText = settings?.title || "Dirancang untuk skala operasional bisnis Anda.";
    const subtitleText = settings?.subtitle || "Pengelolaan sampah komersial membutuhkan keandalan logistik, kepatuhan regulasi lingkungan hidup, dan transparansi data yang dapat dipertanggungjawabkan.";

    const items = dbSolutions && dbSolutions.length > 0
        ? dbSolutions.map((item, idx) => ({
            title: item.title,
            segment: item.segment,
            tag: item.tag,
            desc: item.desc,
            icon: (item.icon && ICON_MAP[item.icon]) ? ICON_MAP[item.icon] : Building2,
            image: item.image_path ? `/storage/${item.image_path}` : (idx === 1 ? imgSorting : idx === 2 ? imgTeam : imgTransport),
            imageAlt: item.title,
            accentColor: item.accent_color || "green",
            linkUrl: item.link_url || "/layanan",
        }))
        : DEFAULT_SOLUTIONS;

    return (
        <section id="solusi" className="scroll-mt-24 bg-white dark:bg-zinc-950 py-20 lg:py-28 border-b border-zinc-100 dark:border-zinc-800">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mb-14 lg:mb-16"
                >
                    <span className="text-xs font-semibold tracking-wider uppercase text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-3 py-1 rounded-full font-mono mb-4 inline-block">
                        {badgeText}
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-zinc-900 dark:text-white leading-tight mb-4">
                        {titleText}
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-300 font-sans text-base lg:text-lg leading-relaxed">
                        {subtitleText}
                    </p>
                </motion.div>

                {/* Solution Columns with Real Operational Photography */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {items.map((item, idx) => {
                        const IconComponent = item.icon;
                        const isOrange = item.accentColor === "orange";
                        return (
                            <motion.div
                                key={item.title + idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                whileHover={{ y: -4 }}
                                onClick={() => setSelectedSolution(item)}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6 lg:p-7 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-200/40 dark:hover:shadow-black/40 transition-all duration-300 group cursor-pointer text-left"
                            >
                                <div>
                                    {/* Real Photo with Aspect Ratio & Badges */}
                                    <div className="relative aspect-[16/10] bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-6 overflow-hidden border border-zinc-200/70 dark:border-zinc-700/60">
                                        <img
                                            src={item.image}
                                            alt={item.imageAlt}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                                        {/* Top Badge: Segment */}
                                        <div className="absolute top-3 left-3">
                                            <span className="font-mono text-[11px] font-medium text-white/95 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                                                {item.segment}
                                            </span>
                                        </div>

                                        {/* Bottom Tag & Icon Badge */}
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                            <span
                                                className={`text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md ${
                                                    isOrange
                                                        ? "bg-orange-500/90 text-white"
                                                        : "bg-emerald-600/90 text-white"
                                                }`}
                                            >
                                                {item.tag}
                                            </span>
                                            <div className="w-8 h-8 rounded-lg bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md text-zinc-900 dark:text-zinc-100 flex items-center justify-center shadow-xs">
                                                <IconComponent className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-sans font-bold text-zinc-900 dark:text-white mb-2.5 tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-zinc-600 dark:text-zinc-300 font-sans text-sm leading-relaxed mb-6">
                                        {item.desc}
                                    </p>
                                </div>

                                <div className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                    <span>Pelajari solusi</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <SolutionDetailModal
                solution={selectedSolution}
                onClose={() => setSelectedSolution(null)}
            />
        </section>
    );
};

export default Why;
