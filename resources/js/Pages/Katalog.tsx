import React, { useState, useEffect, useRef } from "react";
import SEO from "@/Components/SEO";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Link } from "@inertiajs/react";
import { CatalogEmptyIllustration } from "@/Components/Illustrations/CatalogEmptyIllustration";
import { CtaBackgroundIllustration } from "@/Components/Illustrations/CtaBackgroundIllustration";

interface KatalogItem {
    id: number;
    name: string;
    description: string;
    price: number | null;
    image_path: string | null;
}

interface Props {
    katalogs: KatalogItem[];
    canLogin: boolean;
    canRegister: boolean;
}

function formatRupiah(value: number | null) {
    if (!value) return null;
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
}

export default function KatalogPage({ katalogs }: Props) {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<KatalogItem | null>(null);
    const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
    const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    const filtered = katalogs.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = Number(entry.target.getAttribute("data-id"));
                        if (!isNaN(id)) setVisibleCards((prev) => new Set(prev).add(id));
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        cardRefs.current.forEach((el) => { if (el) observer.observe(el); });
        return () => observer.disconnect();
    }, [filtered]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        document.body.style.overflow = selected ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [selected]);

    return (
        <div className="min-h-screen bg-[#F8FAF8] font-sans text-ink selection:bg-lime selection:text-ink">
            <SEO
                title="Katalog Produk Daur Ulang & Material Sirkular - WellTrash"
                description="Katalog material daur ulang berkualitas industri, kompos organik, pakan protein BSF, dan cacahan plastik daur ulang dari WellTrash Farm Jember."
            />
            <Navbar />

            {/* Editorial Page Header */}
            <section className="pt-36 md:pt-44 pb-16 md:pb-24 px-6 lg:px-12 border-b border-black/10 bg-white">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
                        <div className="lg:col-span-8">
                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold text-ink tracking-tight leading-[1.05]">
                                Produk olahan &amp;{" "}
                                <span className="font-serif italic font-normal text-green-forest">
                                    ekonomi sirkular.
                                </span>
                            </h1>
                        </div>
                        <div className="lg:col-span-4">
                            <p className="font-sans text-base sm:text-lg text-muted leading-relaxed">
                                Output pemulihan material terstandarisasi untuk kebutuhan agribisnis, industri manufaktur, dan mitra sirkular di Jawa Timur.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search & Material Counter */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-10 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10">
                    <div className="relative w-full sm:max-w-md">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari spesifikasi material atau nama produk..."
                            className="w-full pl-10 pr-10 py-2.5 rounded-sm border border-black/15 bg-white text-xs sm:text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-green-forest transition-colors"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink text-xs font-mono"
                                aria-label="Hapus pencarian"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <p className="font-mono text-xs uppercase tracking-wider text-muted shrink-0">
                        // Menampilkan {filtered.length} Jenis Material Sirkular
                    </p>
                </div>
            </section>

            {/* Product Grid Section */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pb-24">
                {filtered.length === 0 ? (
                    <div className="py-24 text-center border border-black/10 rounded-sm bg-white p-8">
                        <div className="max-w-md mx-auto">
                            <CatalogEmptyIllustration />
                            <h3 className="font-sans font-semibold text-lg text-ink mt-6 mb-2">
                                {search ? "Material Tidak Ditemukan" : "Katalog Sedang Diperbarui"}
                            </h3>
                            <p className="font-sans text-xs text-muted leading-relaxed">
                                {search
                                    ? `Tidak ada material recovery yang cocok dengan kata kunci "${search}". Silakan coba kata kunci lain atau hubungi tim bisnis kami.`
                                    : "Stok material sirkular sedang dalam proses kurasi berkala oleh tim operasional WellTrash Farm."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {filtered.map((item, idx) => (
                            <div
                                key={item.id}
                                data-id={item.id}
                                ref={(el) => { if (el) cardRefs.current.set(item.id, el); }}
                                onClick={() => setSelected(item)}
                                className="group cursor-pointer rounded-sm border border-black/10 bg-white hover:border-black/30 transition-all duration-200 overflow-hidden flex flex-col justify-between"
                                style={{
                                    opacity: visibleCards.has(item.id) ? 1 : 0,
                                    transform: visibleCards.has(item.id) ? "translateY(0)" : "translateY(24px)",
                                    transition: `opacity 0.5s ease ${idx * 0.05}s, transform 0.5s ease ${idx * 0.05}s, border-color 0.2s`,
                                }}
                            >
                                <div>
                                    <div className="aspect-square bg-paper overflow-hidden relative border-b border-black/10">
                                        {item.image_path ? (
                                            <img
                                                src={`/storage/${item.image_path}`}
                                                alt={`Material WellTrash - ${item.name}`}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500 ease-out"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center p-6 text-muted/30">
                                                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <span className="font-mono text-[10px] uppercase tracking-wider text-green-forest bg-white/90 border border-black/10 px-2 py-0.5 rounded-sm">
                                                OUTPUT SIRKULAR
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-sans font-semibold text-lg text-ink mb-2 group-hover:text-green-forest transition-colors leading-snug">
                                            {item.name}
                                        </h3>
                                        <p className="font-sans text-xs text-muted leading-relaxed line-clamp-2 mb-6">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 pt-3 border-t border-black/5 mt-auto flex items-baseline justify-between">
                                    <div>
                                        <span className="font-mono text-[10px] uppercase text-muted block">Estimasi Nilai</span>
                                        {item.price ? (
                                            <span className="font-mono text-base font-medium text-green-forest">{formatRupiah(item.price)}</span>
                                        ) : (
                                            <span className="font-mono text-xs text-muted">Penawaran MOQ</span>
                                        )}
                                    </div>
                                    <span className="font-sans text-xs font-semibold text-green-forest group-hover:underline uppercase tracking-wider">
                                        Detail RFQ →
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Final CTA Section - Lime Background */}
            <section className="bg-lime text-green-deep py-20 md:py-28 px-6 lg:px-12 relative overflow-hidden">
                <CtaBackgroundIllustration />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold text-green-deep tracking-tight leading-tight mb-6">
                        Pasokan Material Daur Ulang untuk Industri Anda
                    </h2>
                    <p className="font-sans text-base sm:text-lg text-green-deep/90 max-w-2xl mx-auto leading-relaxed mb-10">
                        Kami melayani kontrak pasokan berkala untuk pupuk organik curah, pakan protein maggot BSF, dan cacahan plastik daur ulang dengan MOQ fleksibel.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="https://wa.me/62819848706?text=Halo%20WellTrash,%20kami%20tertarik%20dengan%20pasokan%20material%20daur%20ulang%20industri"
                            target="_blank"
                            rel="noreferrer"
                            className="w-full sm:w-auto px-8 py-3.5 bg-green-deep text-white hover:bg-black font-sans font-semibold text-sm rounded-sm transition-colors duration-200 tracking-tight"
                        >
                            Konsultasikan Pasokan Industri (RFQ)
                        </a>
                        <Link
                            href={route("services")}
                            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-green-deep/30 text-green-deep hover:border-green-deep font-sans font-semibold text-sm rounded-sm transition-colors duration-200 tracking-tight"
                        >
                            Lihat Layanan Penjemputan
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />

            {/* Detail Modal per design.md */}
            {selected && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="absolute inset-0 bg-green-deep/75 backdrop-blur-sm transition-opacity"
                    />
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white rounded-sm border border-black/15 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto z-10"
                    >
                        <button
                            type="button"
                            onClick={() => setSelected(null)}
                            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-sm bg-white/90 border border-black/10 flex items-center justify-center text-muted hover:text-ink hover:bg-gray-50 transition-colors"
                            aria-label="Tutup"
                        >
                            ✕
                        </button>

                        <div className="aspect-[16/10] bg-paper overflow-hidden border-b border-black/10 relative">
                            {selected.image_path ? (
                                <img
                                    src={`/storage/${selected.image_path}`}
                                    alt={`Detail - ${selected.name}`}
                                    className="w-full h-full object-contain p-6"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-6 text-muted/30">
                                    <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                    </svg>
                                </div>
                            )}
                            <div className="absolute top-3 left-3">
                                <span className="font-mono text-[10px] uppercase tracking-wider text-green-forest bg-lime/30 px-2 py-0.5 rounded-sm">
                                    SPESIFIKASI PRODUK
                                </span>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4 pb-4 border-b border-black/10">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-sans font-medium text-ink leading-tight">
                                        {selected.name}
                                    </h2>
                                </div>
                                <div className="sm:text-right shrink-0">
                                    <span className="font-mono text-[10px] uppercase text-muted block">Estimasi Nilai</span>
                                    {selected.price ? (
                                        <span className="font-mono text-xl font-medium text-green-forest">{formatRupiah(selected.price)}</span>
                                    ) : (
                                        <span className="font-mono text-xs text-muted">Sesuai MOQ</span>
                                    )}
                                </div>
                            </div>

                            <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed mb-8">
                                {selected.description}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href={`https://wa.me/62819848706?text=${encodeURIComponent(
                                        `Halo WellTrash, saya tertarik dengan informasi spesifikasi & penawaran untuk "${selected.name}". Mohon informasi lebih lanjut.`
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-forest text-white hover:bg-black font-sans font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors text-center"
                                >
                                    Minta Penawaran B2B (RFQ)
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setSelected(null)}
                                    className="px-6 py-3 border border-black/15 text-muted hover:text-ink font-sans font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
