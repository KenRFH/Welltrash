import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FaqItem {
    q: string;
    a: string;
}

const faqData: FaqItem[] = [
    {
        q: "Apa model kemitraan pengelolaan limbah yang disediakan WellTrash?",
        a: "WellTrash menyediakan perjanjian kerja sama (MOU) resmi untuk pengangkutan sampah terjadwal dan terpadu bagi perkantoran, perhotelan, sentra komersial, hingga sektor industri. Kami menyediakan jadwal rutin, armada khusus, dan dokumentasi penanganan terpadu.",
    },
    {
        q: "Bagaimana sistem pencatatan dan pelaporan limbah untuk pemenuhan ESG?",
        a: "Setiap pengangkutan limbah dicatat berdasarkan volume timbulan dan klasifikasi material. Data ini direkapitulasi secara berkala dalam bentuk laporan resmi yang siap digunakan untuk audit operasional internal dan pelaporan ESG (Environmental, Social, and Governance).",
    },
    {
        q: "Wilayah operasional mana saja yang dijangkau di Kabupaten Jember?",
        a: "Layanan penjemputan berkala WellTrash menjangkau seluruh area Kabupaten Jember, mencakup kawasan bisnis perkotaan hingga sentra industri dan fasilitas umum di wilayah penyangga.",
    },
    {
        q: "Apa saja pilihan frekuensi pengangkutan sampah?",
        a: "Kami menyediakan opsi frekuensi yang fleksibel, mulai dari Paket Reguler (2–3x seminggu), Paket Prime (4–5x seminggu), hingga Paket Premium+ (hingga 7x seminggu / setiap hari) dengan armada terdedikasi.",
    },
    {
        q: "Bagaimana proses pengolahan limbah setelah pengangkutan?",
        a: "Material non-B3 dibawa ke fasilitas WellTrash Farm untuk dipilah secara bertanggung jawab. Fraksi organik dan anorganik bernilai diproses ke alur daur ulang sirkular, sehingga residu akhir yang terbuang ke TPA diminimalkan secara drastis.",
    },
];

const FaqSection: React.FC = () => {
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    return (
        <section id="faq" className="scroll-mt-24 py-20 lg:py-28 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 relative">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: faqData.map((item) => ({
                            "@type": "Question",
                            name: item.q,
                            acceptedAnswer: {
                                "@type": "Answer",
                                text: item.a,
                            },
                        })),
                    }),
                }}
            />

            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mb-14"
                >
                    <span className="text-xs font-semibold tracking-wider uppercase text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-3 py-1 rounded-full font-mono mb-4 inline-block">
                        PERTANYAAN UMUM
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
                        Pertanyaan mitra bisnis.
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-300 font-sans text-base max-w-xl mt-3 leading-relaxed">
                        Jawaban seputar skema kerja sama operasional, kepatuhan regulasi lingkungan, dan standar pengangkutan WellTrash.
                    </p>
                </motion.div>

                <div className="max-w-3xl space-y-3.5">
                    {faqData.map((item, idx) => {
                        const isOpen = openIdx === idx;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                                    isOpen
                                        ? "bg-zinc-50/70 dark:bg-zinc-900/80 border-zinc-300 dark:border-zinc-700 shadow-sm"
                                        : "bg-white dark:bg-zinc-900/40 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/30 dark:hover:bg-zinc-850/40"
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                                    className="w-full flex items-center justify-between text-left p-6 focus:outline-none"
                                    aria-expanded={isOpen}
                                >
                                    <span className="font-sans font-semibold text-base sm:text-lg text-zinc-900 dark:text-white pr-6">
                                        {item.q}
                                    </span>
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                                            isOpen
                                                ? "bg-zinc-900 dark:bg-emerald-600 border-zinc-900 dark:border-emerald-600 text-white rotate-180"
                                                : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400"
                                        }`}
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 pt-1 text-zinc-600 dark:text-zinc-300 font-sans text-sm sm:text-base leading-relaxed border-t border-zinc-200/50 dark:border-zinc-800">
                                                {item.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;
