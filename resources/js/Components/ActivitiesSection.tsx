import React from "react";
import { Link } from "@inertiajs/react";
import { Calendar, ArrowRight, ArrowUpRight, Camera } from "lucide-react";
import { motion } from "motion/react";

export interface Activity {
    id: number;
    title: string;
    description: string;
    image_path: string | null;
    date: string | null;
}

interface ActivitiesSectionProps {
    activities: Activity[];
}

function formatDate(d: string | null) {
    if (!d) return null;
    return new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ activities }) => {
    return (
        <section id="kegiatan" className="scroll-mt-24 bg-white py-20 lg:py-28 border-b border-zinc-100">
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
                            DOKUMENTASI OPERASIONAL
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-zinc-900 leading-tight">
                            Kegiatan di lapangan.
                        </h2>
                        <p className="text-zinc-600 font-sans text-base max-w-xl mt-3 leading-relaxed">
                            Dokumentasi komitmen berkelanjutan dan keterlibatan tim WellTrash dalam menjaga standar kebersihan di berbagai sektor industri.
                        </p>
                    </div>

                    <Link
                        href={route("activity")}
                        className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-zinc-900 hover:text-emerald-700 transition-colors shrink-0 group"
                    >
                        <span>Lihat Semua Kegiatan</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>

                {activities.length === 0 ? (
                    <div className="py-16 text-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50">
                        <p className="text-zinc-500 font-sans text-sm">Belum ada dokumentasi kegiatan yang dipublikasikan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                        {activities[0] && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="lg:col-span-7"
                            >
                                <Link
                                    href={route("activity.show", activities[0].id)}
                                    className="group relative rounded-2xl overflow-hidden min-h-[380px] lg:min-h-[460px] flex items-end border border-zinc-200/80 bg-zinc-900 shadow-md block h-full"
                                >
                                    <div className="absolute inset-0">
                                        {activities[0].image_path ? (
                                            <img
                                                src={`/storage/${activities[0].image_path}`}
                                                alt={activities[0].title}
                                                loading="lazy"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-zinc-900 text-zinc-400">
                                                <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center mb-3 text-emerald-400 shadow-sm">
                                                    <Camera className="w-7 h-7" />
                                                </div>
                                                <span className="font-mono text-xs tracking-wider uppercase text-zinc-400">
                                                    Dokumentasi Operasional
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />
                                    </div>
                                    <div className="relative p-6 sm:p-8 z-10 w-full">
                                        {activities[0].date && (
                                            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono mb-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{formatDate(activities[0].date)}</span>
                                            </div>
                                        )}
                                        <h3 className="font-sans font-bold text-xl sm:text-2xl text-white mb-2 tracking-tight group-hover:text-emerald-300 transition-colors">
                                            {activities[0].title}
                                        </h3>
                                        <p className="font-sans text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed">
                                            {activities[0].description}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        )}

                        <div className="lg:col-span-5 flex flex-col gap-6">
                            {activities.slice(1, 3).map((act, idx) => (
                                <motion.div
                                    key={act.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className="flex-1"
                                >
                                    <Link
                                        href={route("activity.show", act.id)}
                                        className="group bg-zinc-50/60 hover:bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between h-full hover:border-zinc-300 hover:shadow-md transition-all duration-300"
                                    >
                                        <div>
                                            {act.date && (
                                                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono mb-2">
                                                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                                                    <span>{formatDate(act.date)}</span>
                                                </div>
                                            )}
                                            <h3 className="font-sans font-bold text-lg text-zinc-900 mb-2 group-hover:text-emerald-700 transition-colors">
                                                {act.title}
                                            </h3>
                                            <p className="font-sans text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                                                {act.description}
                                            </p>
                                        </div>
                                        <span className="font-sans text-xs font-semibold text-zinc-900 group-hover:text-emerald-700 mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-all">
                                            Baca selengkapnya <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ActivitiesSection;
