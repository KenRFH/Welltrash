import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import SEO from "@/Components/SEO";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { EditorialPlaceholderIllustration } from "@/Components/Illustrations/EditorialPlaceholderIllustration";
import { CtaBackgroundIllustration } from "@/Components/Illustrations/CtaBackgroundIllustration";

interface NewsItem {
    id: number;
    title: string;
    content: string;
    image_path: string | null;
    published_date: string | null;
}

interface Props {
    news: NewsItem[];
    canLogin: boolean;
    canRegister: boolean;
}

function formatDate(d: string | null) {
    if (!d) return null;
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function NewsPage({ news }: Props) {
    const [activeId, setActiveId] = useState<number | null>(news[0]?.id ?? null);
    const activeArticle = news.find((n) => n.id === activeId) ?? news[0];

    return (
        <div className="min-h-screen bg-[#F8FAF8] font-sans text-ink selection:bg-lime selection:text-ink">
            <SEO 
                title="Warta & Publikasi Resmi - WellTrash" 
                description="Baca analisis terkini seputar regulasi lingkungan, pengelolaan limbah B2B, pelaporan ESG, dan inovasi ekonomi sirkular dari WellTrash Jember." 
            />
            <Navbar />

            {/* Editorial Page Header */}
            <section className="pt-36 md:pt-44 pb-16 md:pb-24 px-6 lg:px-12 border-b border-black/10 bg-white">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
                        <div className="lg:col-span-8">
                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold text-ink tracking-tight leading-[1.05]">
                                Wawasan keberlanjutan &amp;{" "}
                                <span className="font-serif italic font-normal text-green-forest">
                                    kabar industri.
                                </span>
                            </h1>
                        </div>
                        <div className="lg:col-span-4">
                            <p className="font-sans text-base sm:text-lg text-muted leading-relaxed">
                                Panduan regulasi KLHK, strategi kepatuhan ESG korporasi, serta inovasi rantai pasok ekonomi sirkular langsung dari praktisi lapangan WellTrash.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {news.length === 0 ? (
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32 text-center">
                    <div className="border border-black/10 rounded-sm bg-white p-12">
                        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">// ARSIP WARTA</p>
                        <p className="font-sans text-base text-muted">Belum ada warta atau publikasi yang dipublikasikan saat ini.</p>
                    </div>
                </div>
            ) : (
                <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                        {/* List column */}
                        <div className="lg:col-span-5 divide-y divide-black/10 border-y border-black/10 bg-white">
                            {news.map((item, i) => {
                                const isCurrent = activeArticle?.id === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setActiveId(item.id)}
                                        className={`w-full text-left p-6 transition-all duration-200 border-l-2 ${
                                            isCurrent
                                                ? "bg-[#F4F6EF]/70 border-green-forest"
                                                : "border-transparent hover:bg-[#F4F6EF]/30"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-mono text-xs text-green-forest font-medium">
                                                {String(i + 1).padStart(2, "0")}.
                                            </span>
                                            {item.published_date && (
                                                <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                                                    {formatDate(item.published_date)}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className={`font-sans text-base font-semibold leading-snug mb-2 transition-colors ${
                                            isCurrent ? "text-green-forest" : "text-ink"
                                        }`}>
                                            {item.title}
                                        </h3>
                                        <p className="font-sans text-xs text-muted leading-relaxed line-clamp-2">
                                            {item.content}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Sticky Active Article Column */}
                        <div className="lg:col-span-7 lg:sticky lg:top-32">
                            {activeArticle && (
                                <div className="bg-white border border-black/10 rounded-sm overflow-hidden">
                                    <div className="w-full aspect-[16/10] bg-paper overflow-hidden relative border-b border-black/10">
                                        {activeArticle.image_path ? (
                                            <img
                                                key={activeArticle.id}
                                                src={`/storage/${activeArticle.image_path}`}
                                                alt={activeArticle.title}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full p-4 flex items-center justify-center bg-[#F4F6EF]">
                                                <EditorialPlaceholderIllustration label="Dokumentasi Berita" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 sm:p-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            {activeArticle.published_date && (
                                                <span className="font-mono text-xs uppercase tracking-wider text-muted">
                                                    {formatDate(activeArticle.published_date)}
                                                </span>
                                            )}
                                            <span className="font-mono text-[10px] uppercase tracking-wider text-green-forest bg-lime/30 px-2 py-0.5 rounded-sm">
                                                WARTA RESMI
                                            </span>
                                        </div>

                                        <h2 className="text-2xl sm:text-3xl font-sans font-medium text-ink leading-tight mb-4">
                                            {activeArticle.title}
                                        </h2>

                                        <p className="font-sans text-sm text-muted leading-relaxed line-clamp-4 mb-8">
                                            {activeArticle.content}
                                        </p>

                                        <Link
                                            href={route("news.show", activeArticle.id)}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-forest text-white hover:bg-black font-sans font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors duration-200"
                                        >
                                            <span>Baca Artikel Lengkap</span>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Final CTA Section - Lime Background */}
            <section className="bg-lime text-green-deep py-20 md:py-28 px-6 lg:px-12 relative overflow-hidden">
                <CtaBackgroundIllustration />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold text-green-deep tracking-tight leading-tight mb-6">
                        Diskusikan Kebutuhan Pengelolaan Limbah Perusahaan
                    </h2>
                    <p className="font-sans text-base sm:text-lg text-green-deep/90 max-w-2xl mx-auto leading-relaxed mb-10">
                        Konsultasikan penanganan limbah komersial Anda bersama tim profesional WellTrash untuk memenuhi target ESG dan efisiensi operasional.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href={route("services")}
                            className="w-full sm:w-auto px-8 py-3.5 bg-green-deep text-white hover:bg-black font-sans font-semibold text-sm rounded-sm transition-colors duration-200 tracking-tight"
                        >
                            Lihat Paket Layanan
                        </Link>
                        <a
                            href="https://wa.me/62819848706?text=Halo%20WellTrash,%20kami%20ingin%20konsultasi%20pengelolaan%20limbah%20bisnis"
                            target="_blank"
                            rel="noreferrer"
                            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-green-deep/30 text-green-deep hover:border-green-deep font-sans font-semibold text-sm rounded-sm transition-colors duration-200 tracking-tight"
                        >
                            Hubungi Tim Bisnis (WhatsApp)
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
