import React from "react";
import { Link } from "@inertiajs/react";
import SEO from "@/Components/SEO";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { EditorialPlaceholderIllustration } from "@/Components/Illustrations/EditorialPlaceholderIllustration";
import { CtaBackgroundIllustration } from "@/Components/Illustrations/CtaBackgroundIllustration";

interface Activity {
    id: number;
    title: string;
    description: string;
    image_path: string | null;
    date: string | null;
}

interface Props {
    activities: Activity[];
    canLogin: boolean;
    canRegister: boolean;
}

function formatDate(d: string | null) {
    if (!d) return null;
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function ActivityPage({ activities }: Props) {
    return (
        <div className="min-h-screen bg-[#F8FAF8] font-sans text-ink selection:bg-lime selection:text-ink">
            <SEO 
                title="Aktivitas & Jurnal Lapangan - WellTrash" 
                description="Dokumentasi kegiatan operasional, aksi nyata pemilahan sampah, dan edukasi keberlanjutan bersama komunitas di Kabupaten Jember." 
            />
            <Navbar />

            {/* Editorial Page Header */}
            <section className="pt-36 md:pt-44 pb-16 md:pb-24 px-6 lg:px-12 border-b border-black/10 bg-white">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
                        <div className="lg:col-span-8">
                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold text-ink tracking-tight leading-[1.05]">
                                Jurnal operasional &amp;{" "}
                                <span className="font-serif italic font-normal text-green-forest">
                                    edukasi lapangan.
                                </span>
                            </h1>
                        </div>
                        <div className="lg:col-span-4">
                            <p className="font-sans text-base sm:text-lg text-muted leading-relaxed">
                                Dokumentasi inisiatif operasional WellTrash bersama mitra industri, komunitas, dan institusi pendidikan dalam pengelolaan lingkungan di Kabupaten Jember.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Alternating Editorial Journal List */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 md:py-20">
                {activities.length === 0 ? (
                    <div className="py-32 text-center border border-black/10 rounded-sm bg-white p-8">
                        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">// ARSIP AKTIVITAS</p>
                        <p className="font-sans text-base text-muted">Belum ada dokumentasi aktivitas yang dipublikasikan saat ini.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-black/10 border-y border-black/10 bg-white">
                        {activities.map((activity, i) => {
                            const isEven = i % 2 === 0;
                            return (
                                <Link
                                    key={activity.id}
                                    href={route("activity.show", activity.id)}
                                    className="group grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center py-10 md:py-14 px-6 md:px-10 hover:bg-[#F4F6EF]/60 transition-colors"
                                >
                                    {/* Image side */}
                                    <div className={`md:col-span-5 ${isEven ? "md:order-1" : "md:order-2"}`}>
                                        <div className="w-full aspect-[16/10] rounded-sm overflow-hidden border border-black/10 bg-paper relative">
                                            {activity.image_path ? (
                                                <img
                                                    src={`/storage/${activity.image_path}`}
                                                    alt={activity.title}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full p-4 flex items-center justify-center bg-[#F4F6EF]">
                                                    <EditorialPlaceholderIllustration label="Dokumentasi Aktivitas" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content side */}
                                    <div className={`md:col-span-7 ${isEven ? "md:order-2" : "md:order-1"}`}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="font-mono text-2xl font-medium text-green-forest">
                                                {String(i + 1).padStart(2, "0")}.
                                            </span>
                                            {activity.date && (
                                                <span className="font-mono text-xs uppercase tracking-wider text-muted border-l border-black/15 pl-3">
                                                    {formatDate(activity.date)}
                                                </span>
                                            )}
                                            <span className="font-mono text-[10px] uppercase tracking-wider text-green-forest bg-lime/30 px-2 py-0.5 rounded-sm">
                                                DOKUMENTASI
                                            </span>
                                        </div>

                                        <h2 className="text-2xl sm:text-3xl font-sans font-medium text-ink leading-tight mb-3 group-hover:text-green-forest transition-colors">
                                            {activity.title}
                                        </h2>

                                        <p className="font-sans text-sm text-muted leading-relaxed line-clamp-3 mb-6">
                                            {activity.description}
                                        </p>

                                        <div className="inline-flex items-center gap-2 font-sans font-semibold text-xs uppercase tracking-wider text-green-forest">
                                            <span>Baca Laporan Dokumentasi</span>
                                            <svg
                                                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Final CTA Section - Lime Background per design.md */}
            <section className="bg-lime text-green-deep py-20 md:py-28 px-6 lg:px-12 relative overflow-hidden">
                <CtaBackgroundIllustration />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold text-green-deep tracking-tight leading-tight mb-6">
                        Bermitra untuk Aksi Keberlanjutan Nyata
                    </h2>
                    <p className="font-sans text-base sm:text-lg text-green-deep/90 max-w-2xl mx-auto leading-relaxed mb-10">
                        Tertarik mengadakan workshop pemilahan sampah, kunjungan studi biokonversi maggot BSF, atau program CSR lingkungan bersama WellTrash di institusi Anda?
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="https://wa.me/62819848706?text=Halo%20WellTrash,%20kami%20tertarik%20mengajukan%20kolaborasi%20edukasi%20atau%20studi%20lapangan"
                            target="_blank"
                            rel="noreferrer"
                            className="w-full sm:w-auto px-8 py-3.5 bg-green-deep text-white hover:bg-black font-sans font-semibold text-sm rounded-sm transition-colors duration-200 tracking-tight"
                        >
                            Ajukan Kolaborasi / Kunjungan
                        </a>
                        <Link
                            href={route("services")}
                            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-green-deep/30 text-green-deep hover:border-green-deep font-sans font-semibold text-sm rounded-sm transition-colors duration-200 tracking-tight"
                        >
                            Lihat Layanan Operasional
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
