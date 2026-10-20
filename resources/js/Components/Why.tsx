import React from "react";
import { Link } from "@inertiajs/react";
import imgTransport from "@/assets/img/hero_waste_transport.webp";
import imgSorting from "@/assets/img/hero_waste_sorting.webp";
import imgTeam from "@/assets/img/karyawanWelltrash.webp";
import { Building2, Factory, Recycle, ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface SolutionItem {
    segment: string;
    title: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    image: string;
    imageAlt: string;
    tag: string;
    accentColor: "green" | "orange";
}

const solutions: SolutionItem[] = [
    {
        segment: "Komersial & Ritel",
        title: "Corporate Waste",
        desc: "Pengangkutan terjadwal untuk gedung perkantoran, pusat retail, hotel, dan kawasan komersial dengan jaminan kebersihan serta ketepatan ritme penjemputan armada.",
        icon: Building2,
        image: imgTransport,
        imageAlt: "Armada logistik pengangkutan komersial WellTrash",
        tag: "Logistik Terjadwal",
        accentColor: "green",
    },
    {
        segment: "Industri Non-B3",
        title: "Industrial Waste",
        desc: "Penanganan sampah non-B3 industri dan manufaktur dengan standar operasional yang aman, kapasitas angkut tonase besar, dan bukti timbangan manifest legal.",
        icon: Factory,
        image: imgSorting,
        imageAlt: "Fasilitas pemilahan material industri WellTrash Farm",
        tag: "Kepatuhan Regulasi",
        accentColor: "orange",
    },
    {
        segment: "Ekonomi Sirkular",
        title: "Recyclable Recovery",
        desc: "Pemilahan dan pemulihan material bernilai ekonomis untuk dialihkan dari TPA, mendukung rantai nilai daur ulang industri dan komitmen ESG perusahaan Anda.",
        icon: Recycle,
        image: imgTeam,
        imageAlt: "Tim pemrosesan dan daur ulang WellTrash Jember",
        tag: "Biokonversi & Daur Ulang",
        accentColor: "green",
    },
];

const tiers = [
    {
        name: "Paket Reguler",
        freq: "2–3x / minggu",
        ideal: "Perkantoran, ruko, kafe, & retail skala menengah",
        accent: "border-emerald-600 text-emerald-700",
    },
    {
        name: "Paket Prime",
        freq: "4–5x / minggu",
        ideal: "Hotel, restoran besar, & properti komersial aktif",
        accent: "border-orange-500 text-orange-600",
    },
    {
        name: "Paket Premium+",
        freq: "Hingga 7x / minggu (Harian)",
        ideal: "Pabrik, manufaktur, rumah sakit, & kawasan institusi",
        accent: "border-emerald-700 text-emerald-800",
    },
];

const Why: React.FC = () => {
    return (
        <section id="solusi" className="scroll-mt-24 bg-white py-20 lg:py-28 border-b border-zinc-100">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mb-14 lg:mb-16"
                >
                    <span className="text-xs font-semibold tracking-wider uppercase text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full font-mono mb-4 inline-block">
                        SOLUSI B2B TERPADU
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-zinc-900 leading-tight mb-4">
                        Dirancang untuk skala operasional bisnis Anda.
                    </h2>
                    <p className="text-zinc-600 font-sans text-base lg:text-lg leading-relaxed">
                        Pengelolaan sampah komersial membutuhkan keandalan logistik, kepatuhan regulasi lingkungan hidup, dan transparansi data yang dapat dipertanggungjawabkan.
                    </p>
                </motion.div>

                {/* 3 Solution Columns with Real Operational Photography */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-14">
                    {solutions.map((item, idx) => {
                        const IconComponent = item.icon;
                        const isOrange = item.accentColor === "orange";
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="bg-white border border-zinc-200/80 rounded-2xl p-6 lg:p-7 flex flex-col justify-between hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-300 group"
                            >
                                <div>
                                    {/* Real Photo with Aspect Ratio & Badges */}
                                    <div className="relative aspect-[16/10] bg-zinc-100 rounded-xl mb-6 overflow-hidden border border-zinc-200/70">
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
                                            <div className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md text-zinc-900 flex items-center justify-center shadow-xs">
                                                <IconComponent className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-sans font-bold text-zinc-900 mb-2.5 tracking-tight group-hover:text-emerald-700 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-zinc-600 font-sans text-sm leading-relaxed mb-6">
                                        {item.desc}
                                    </p>
                                </div>

                                <Link
                                    href={route("services")}
                                    className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-zinc-900 group-hover:text-emerald-700 transition-colors pt-4 border-t border-zinc-100"
                                >
                                    <span>Pelajari solusi</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Service Tiers Info Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="border border-zinc-200/80 rounded-2xl p-6 lg:p-8 bg-zinc-50/50"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-200/70">
                        <div>
                            <h4 className="font-sans font-bold text-lg sm:text-xl text-zinc-900">
                                Sesuaikan ritme pengangkutan dengan kapasitas operasional Anda
                            </h4>
                            <p className="font-sans text-xs sm:text-sm text-zinc-500 mt-1">
                                Skema paket berlangganan dengan penjadwalan armada terdedikasi se-Kabupaten Jember.
                            </p>
                        </div>
                        <Link
                            href={route("services")}
                            className="font-sans text-sm font-semibold text-zinc-900 hover:text-emerald-700 inline-flex items-center gap-1.5 shrink-0 transition-colors"
                        >
                            <span>Detail Rincian Paket</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {tiers.map((tier) => (
                            <div key={tier.name} className={`border-l-2 pl-4 py-1 ${tier.accent.split(" ")[0]}`}>
                                <span className="font-sans font-bold text-base text-zinc-900 block">{tier.name}</span>
                                <span className={`font-mono text-xs font-semibold block mt-0.5 mb-1 ${tier.accent.split(" ")[1]}`}>
                                    {tier.freq}
                                </span>
                                <p className="text-xs text-zinc-500 leading-relaxed">{tier.ideal}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Why;
