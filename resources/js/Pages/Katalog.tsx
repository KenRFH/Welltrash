import React, { useState, useEffect, useRef } from 'react';
import SEO from '@/Components/SEO';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

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
    return `Rp ${Number(value).toLocaleString('id-ID')}`;
}

export default function KatalogPage({ katalogs }: Props) {
    const [search, setSearch] = useState('');
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
                        const id = Number(entry.target.getAttribute('data-id'));
                        if (!isNaN(id)) setVisibleCards((prev) => new Set(prev).add(id));
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );
        cardRefs.current.forEach((el) => { if (el) observer.observe(el); });
        return () => observer.disconnect();
    }, [filtered]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        document.body.style.overflow = selected ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [selected]);

    return (
        <div className="min-h-screen bg-white font-sans">
            <SEO title="Katalog Produk Daur Ulang | Welltrash" description="Temukan produk daur ulang berkualitas dari Welltrash Jember. Dari bahan baku hingga produk siap pakai yang ramah lingkungan." />
            <Navbar />

            {/* Hero */}
            <section className="pt-36 pb-20 px-6 max-w-7xl mx-auto border-b border-gray-100">
                <p className="text-xs font-bold tracking-[0.4em] uppercase mb-4" style={{ color: '#7CC13B' }}>Katalog Produk</p>
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-gray-900">
                        Produk<br /><em className="not-italic" style={{ color: '#FE961C' }}>Daur Ulang.</em>
                    </h1>
                    <p className="text-gray-400 max-w-sm text-base leading-relaxed lg:text-right">
                        Produk hasil daur ulang berkualitas tinggi — dari bahan baku hingga produk siap pakai dari Kabupaten Jember.
                    </p>
                </div>
            </section>

            {/* Search & Count */}
            <section className="max-w-7xl mx-auto px-6 pt-10 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:max-w-md">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari produk..."
                            className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/60 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7CC13B]/30 focus:border-[#7CC13B]/50 transition-all duration-300" />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors" aria-label="Hapus pencarian">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-gray-400 font-medium tabular-nums shrink-0">
                        {filtered.length} <span className="text-gray-300">produk ditemukan</span>
                    </p>
                </div>
            </section>

            {/* Product Grid */}
            <section className="max-w-7xl mx-auto px-6 pb-24">
                {filtered.length === 0 ? (
                    <div className="py-32 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gray-50 mb-6">
                            <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <p className="text-gray-300 text-xl font-black tracking-tight">{search ? 'Produk tidak ditemukan' : 'Belum ada produk'}</p>
                        {search && <p className="text-gray-300 text-sm mt-2">Coba kata kunci lain</p>}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {filtered.map((item, idx) => (
                            <div key={item.id} data-id={item.id}
                                ref={(el) => { if (el) cardRefs.current.set(item.id, el); }}
                                onClick={() => setSelected(item)}
                                className="group cursor-pointer rounded-3xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/80 transition-all duration-500 overflow-hidden"
                                style={{
                                    opacity: visibleCards.has(item.id) ? 1 : 0,
                                    transform: visibleCards.has(item.id) ? 'translateY(0)' : 'translateY(32px)',
                                    transition: `opacity 0.6s ease ${idx * 0.07}s, transform 0.6s ease ${idx * 0.07}s, border-color 0.3s, box-shadow 0.5s`,
                                }}>
                                <div className="aspect-square bg-gray-50 overflow-hidden relative">
                                    {item.image_path ? (
                                        <img src={`/storage/${item.image_path}`} alt={`Produk Welltrash - ${item.name}`} loading="lazy" decoding="async"
                                            className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-16 h-16 text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-700 shadow-lg">Lihat Detail</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-[#FE961C] transition-colors duration-300 leading-tight">{item.name}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 mb-5">{item.description}</p>
                                    <div className="flex items-center justify-between">
                                        {item.price ? (
                                            <span className="text-base font-black" style={{ color: '#FE961C' }}>{formatRupiah(item.price)}</span>
                                        ) : (
                                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#7CC13B' }}>Harga bervariasi</span>
                                        )}
                                        <span className="inline-flex items-center gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300" style={{ color: '#7CC13B' }}>
                                            Detail
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <Footer />

            {/* Detail Modal */}
            {selected && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setSelected(null)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" style={{ animation: 'fadeIn 0.25s ease-out forwards' }} />
                    <div onClick={(e) => e.stopPropagation()}
                        className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        style={{ animation: 'slideUp 0.35s ease-out forwards' }}>
                        <button onClick={() => setSelected(null)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm"
                            aria-label="Tutup">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <div className="aspect-[4/3] bg-gray-50 rounded-t-3xl overflow-hidden">
                            {selected.image_path ? (
                                <img src={`/storage/${selected.image_path}`} alt={`Produk Welltrash - ${selected.name}`} className="w-full h-full object-contain p-8" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-20 h-20 text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="p-8">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">{selected.name}</h2>
                                {selected.price ? (
                                    <span className="text-xl font-black shrink-0 mt-1" style={{ color: '#FE961C' }}>{formatRupiah(selected.price)}</span>
                                ) : (
                                    <span className="text-xs font-bold uppercase tracking-widest shrink-0 mt-2 px-3 py-1.5 rounded-full" style={{ color: '#7CC13B', backgroundColor: 'rgba(124,193,59,0.08)' }}>Harga bervariasi</span>
                                )}
                            </div>
                            <p className="text-gray-500 leading-relaxed text-base mb-8">{selected.description}</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a href={`https://wa.me/62819848706?text=${encodeURIComponent(`Halo, saya tertarik dengan produk "${selected.name}". Bisa info lebih lanjut?`)}`}
                                    target="_blank" rel="noreferrer"
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-300 hover:opacity-90"
                                    style={{ backgroundColor: '#7CC13B' }}>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                    Tanya Produk Ini
                                </a>
                                <button onClick={() => setSelected(null)} className="px-6 py-3.5 rounded-2xl text-sm font-bold text-gray-500 border border-gray-100 hover:bg-gray-50 transition-colors duration-200">Tutup</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
            `}</style>
        </div>
    );
}
