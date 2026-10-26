import React from "react";
import { Link } from "@inertiajs/react";
import { Calendar, ArrowRight, ArrowUpRight, Newspaper } from "lucide-react";
import { motion } from "motion/react";

export interface NewsItem {
    id: number;
    title: string;
    content: string;
    image_path: string | null;
    published_date: string | null;
}

interface NewsSectionProps {
    news: NewsItem[];
}

function formatDate(d: string | null) {
    if (!d) return null;
    return new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

const NewsSection: React.FC<NewsSectionProps> = ({ news }) => {
    return (
        <section id="berita" className="scroll-mt-24 bg-zinc-50/50 dark:bg-zinc-900/40 py-20 lg:py-28 border-b border-zinc-200/60 dark:border-zinc-800">
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
                            ARTIKEL &amp; RISET
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
                            Wawasan &amp; berita terkini.
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-300 font-sans text-base max-w-xl mt-3 leading-relaxed">
                            Analisis seputar regulasi lingkungan, pengelolaan limbah komersial, dan kepatuhan ESG korporasi.
                        </p>
                    </div>

                    <Link
                        href={route("news")}
                        className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-zinc-900 dark:text-zinc-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors shrink-0 group"
                    >
                        <span>Lihat Semua Berita</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>

                {news.length === 0 ? (
                    <div className="py-16 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
                        <p className="text-zinc-500 dark:text-zinc-400 font-sans text-sm">Belum ada artikel berita yang dipublikasikan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.slice(0, 3).map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <Link
                                    href={route("news.show", item.id)}
                                    className="group bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between h-full hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg transition-all duration-300"
                                >
                                    <div>
                                        <div className="aspect-[16/10] bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden mb-5 border border-zinc-100 dark:border-zinc-700/60">
                                            {item.image_path ? (
                                                <img
                                                    src={`/storage/${item.image_path}`}
                                                    alt={item.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-800 text-zinc-400">
                                                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-700 border border-zinc-200/80 dark:border-zinc-600 flex items-center justify-center mb-2.5 text-orange-600 dark:text-orange-400 shadow-2xs">
                                                        <Newspaper className="w-6 h-6" />
                                                    </div>
                                                    <span className="font-mono text-[11px] tracking-wider uppercase text-zinc-400">
                                                        WellTrash Berita
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {item.published_date && (
                                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono mb-2">
                                                <Calendar className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                                                <span>{formatDate(item.published_date)}</span>
                                            </div>
                                        )}
                                        <h3 className="font-sans font-bold text-lg text-zinc-900 dark:text-white mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="font-sans text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                                            {item.content.replace(/<[^>]*>?/gm, "")}
                                        </p>
                                    </div>

                                    <div className="pt-4 mt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-sans font-semibold">
                                        <span className="text-zinc-900 dark:text-zinc-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">Baca Artikel</span>
                                        <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default NewsSection;
