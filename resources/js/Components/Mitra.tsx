import React from "react";
import sppg from "@/assets/icon/mitra/sppg_bgn.png";
import dlh from "@/assets/icon/mitra/dlh.png";
import pemkab from "@/assets/icon/mitra/pemkab.png";
import siloam from "@/assets/icon/mitra/rs_siloam.png";
import rskaliwates from "@/assets/icon/mitra/logo_rsu_kaliwates.png";
import subandi from "@/assets/icon/mitra/logo_rsu_subandi.jpg";
import {
    Hotel,
    Factory,
    ShoppingBag,
    Building2,
    HeartPulse,
    Landmark,
} from "lucide-react";
import { motion } from "motion/react";

interface Partner {
    id: string;
    name: string;
    sector: string;
    category: "kesehatan" | "pemerintah" | "komersial";
    icon: string;
    badge: string;
    verifiedYear: string;
}

const partners: Partner[] = [
    {
        id: "rsud-subandi",
        name: "RSUD dr. Soebandi Jember",
        sector: "Fasilitas Kesehatan Rujukan Tipe A",
        category: "kesehatan",
        icon: subandi,
        badge: "RS Rujukan Tipe A",
        verifiedYear: "Aktif Sejak 2023",
    },
    {
        id: "dlh-jember",
        name: "DLH Kab. Jember",
        sector: "Pemerintah & Regulasi Lingkungan",
        category: "pemerintah",
        icon: dlh,
        badge: "Regulator Lingkungan",
        verifiedYear: "Mitra Strategis",
    },
    {
        id: "pemkab-jember",
        name: "Pemkab Jember",
        sector: "Instansi Pemerintahan Daerah",
        category: "pemerintah",
        icon: pemkab,
        badge: "Pemerintah Daerah",
        verifiedYear: "Kemitraan Daerah",
    },
    {
        id: "rs-siloam",
        name: "RS Siloam Jember",
        sector: "Fasilitas Kesehatan Swasta",
        category: "kesehatan",
        icon: siloam,
        badge: "RS Swasta Terstandar",
        verifiedYear: "Aktif Sejak 2023",
    },
    {
        id: "rs-kaliwates",
        name: "RS Kaliwates (Rolang)",
        sector: "Fasilitas Kesehatan",
        category: "kesehatan",
        icon: rskaliwates,
        badge: "Mitra Fasilitas Kesehatan",
        verifiedYear: "Aktif Sejak 2024",
    },
    {
        id: "sppg",
        name: "SPPG (BGN) Jember",
        sector: "Instansi Komersial & Distribusi",
        category: "komersial",
        icon: sppg,
        badge: "Mitra Komersial BGN",
        verifiedYear: "Kemitraan Aktif",
    },
];

const industries = [
    { name: "Hospitality & Hotel", icon: Hotel },
    { name: "Manufacturing", icon: Factory },
    { name: "Retail & F&B", icon: ShoppingBag },
    { name: "Property & Mall", icon: Building2 },
    { name: "Kesehatan & Edukasi", icon: HeartPulse },
    { name: "Instansi Pemerintah", icon: Landmark },
];

// Susunan baris 1 & baris 2 dengan urutan bervariasi agar ritme visual dinamis
const row1Partners = [
    partners[0], // RSUD dr. Soebandi Jember
    partners[1], // DLH Kab. Jember
    partners[3], // RS Siloam Jember
    partners[2], // Pemkab Jember
    partners[4], // RS Kaliwates (Rolang)
    partners[5], // SPPG (BGN) Jember
];

const row2Partners = [
    partners[2], // Pemkab Jember
    partners[4], // RS Kaliwates (Rolang)
    partners[5], // SPPG (BGN) Jember
    partners[0], // RSUD dr. Soebandi Jember
    partners[3], // RS Siloam Jember
    partners[1], // DLH Kab. Jember
];

// Diulang 3x agar total lebar konten per child melampaui lebar layar monitor ultra-wide
const row1List = [...row1Partners, ...row1Partners, ...row1Partners];
const row2List = [...row2Partners, ...row2Partners, ...row2Partners];

const PartnerCard: React.FC<{ partner: Partner }> = ({ partner }) => {
    return (
        <div className="flex-shrink-0 group/card flex items-center gap-3.5 px-4 sm:px-5 py-3 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 hover:bg-white hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-950/5 transition-all duration-300 select-none cursor-default">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-zinc-200/70 p-2 flex items-center justify-center shrink-0 shadow-2xs group-hover/card:scale-105 transition-transform duration-300">
                <img
                    src={partner.icon}
                    alt={partner.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain grayscale opacity-80 group-hover/card:grayscale-0 group-hover/card:opacity-100 transition-all duration-300"
                />
            </div>
            <div className="flex flex-col text-left">
                <span className="font-sans font-bold text-xs sm:text-sm text-zinc-900 group-hover/card:text-emerald-950 transition-colors whitespace-nowrap">
                    {partner.name}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-mono text-[10px] sm:text-[11px] text-zinc-500 group-hover/card:text-emerald-700 transition-colors uppercase tracking-wider whitespace-nowrap">
                        {partner.badge}
                    </span>
                </div>
            </div>
        </div>
    );
};

const Mitra: React.FC = () => {
    return (
        <section className="bg-white border-b border-zinc-100 py-16 lg:py-24 overflow-hidden">
            <style>{`
                @keyframes marqueeLeft {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes marqueeRight {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(0%); }
                }
                .animate-marquee-left {
                    animation: marqueeLeft 35s linear infinite;
                }
                .animate-marquee-right {
                    animation: marqueeRight 35s linear infinite;
                }
                .marquee-row:hover .animate-marquee-left,
                .marquee-row:hover .animate-marquee-right {
                    animation-play-state: paused;
                }
                @media (max-width: 640px) {
                    .animate-marquee-left {
                        animation-duration: 25s;
                    }
                    .animate-marquee-right {
                        animation-duration: 25s;
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .animate-marquee-left,
                    .animate-marquee-right {
                        animation-play-state: paused;
                    }
                }
            `}</style>

            {/* Header Section */}
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto mb-10 sm:mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-mono font-medium mb-3.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>KEMITRAAN RESMI &amp; TERVERIFIKASI</span>
                        <span className="text-orange-600 font-bold ml-1">• JEMBER</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-zinc-900 tracking-tight leading-tight mb-3">
                        Dipercaya oleh Rumah Sakit, Instansi Publik, &amp; Bisnis Terkemuka
                    </h2>

                    <p className="text-zinc-600 font-sans text-sm sm:text-base leading-relaxed">
                        Kolaborasi strategis pengelolaan limbah bertanggung jawab bersama fasilitas kesehatan rujukan, regulator daerah, dan sektor komersial di Kabupaten Jember.
                    </p>
                </motion.div>
            </div>

            {/* 2-Row Running Marquee (Edge-to-Edge) */}
            <div className="relative w-full overflow-hidden flex flex-col gap-4 sm:gap-5 py-2">
                {/* Edge fade gradients for smooth entrance/exit */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 lg:w-44 z-10 bg-gradient-to-r from-white via-white/80 to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 lg:w-44 z-10 bg-gradient-to-l from-white via-white/80 to-transparent" />

                {/* Baris 1: Running ke Kiri */}
                <div className="marquee-row flex overflow-hidden select-none">
                    <div className="flex shrink-0 items-center gap-4 sm:gap-6 animate-marquee-left pr-4 sm:pr-6 will-change-transform">
                        {row1List.map((partner, index) => (
                            <PartnerCard key={`row1-a-${index}`} partner={partner} />
                        ))}
                    </div>
                    <div
                        className="flex shrink-0 items-center gap-4 sm:gap-6 animate-marquee-left pr-4 sm:pr-6 will-change-transform"
                        aria-hidden="true"
                    >
                        {row1List.map((partner, index) => (
                            <PartnerCard key={`row1-b-${index}`} partner={partner} />
                        ))}
                    </div>
                </div>

                {/* Baris 2: Running ke Kanan */}
                <div className="marquee-row flex overflow-hidden select-none">
                    <div className="flex shrink-0 items-center gap-4 sm:gap-6 animate-marquee-right pr-4 sm:pr-6 will-change-transform">
                        {row2List.map((partner, index) => (
                            <PartnerCard key={`row2-a-${index}`} partner={partner} />
                        ))}
                    </div>
                    <div
                        className="flex shrink-0 items-center gap-4 sm:gap-6 animate-marquee-right pr-4 sm:pr-6 will-change-transform"
                        aria-hidden="true"
                    >
                        {row2List.map((partner, index) => (
                            <PartnerCard key={`row2-b-${index}`} partner={partner} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Sektor Bisnis Dilayani */}
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-10 sm:mt-12 pt-8 border-t border-zinc-100">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-3 text-center">
                    SEKTOR USAHA &amp; FASILITAS YANG DILAYANI
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {industries.map((ind) => {
                        const IconComponent = ind.icon;
                        return (
                            <div
                                key={ind.name}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-sans font-medium text-zinc-600 bg-zinc-50 border border-zinc-200/70 hover:border-emerald-300 hover:text-zinc-900 transition-colors"
                            >
                                <IconComponent className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{ind.name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Mitra;
