import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

interface Katalog {
    id: number;
    name: string;
    description: string;
    price: number | null;
    image_path: string | null;
}

interface Props {
    katalogs: Katalog[];
    canLogin: boolean;
    canRegister: boolean;
}

export default function KatalogPage({ katalogs }: Props) {
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: '#0E172A', color: '#F0F4FF' }}>
            <Head title="Katalog Produk | Welltrash" />
            <Navbar dark />

            {/* Hero */}
            <section className="pt-36 pb-20 px-6 max-w-7xl mx-auto" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-xs font-bold tracking-[0.4em] uppercase mb-4" style={{ color: '#7CC13B' }}>Katalog Produk</p>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]" style={{ color: '#F0F4FF' }}>
                        Welltrash<br /><em className="not-italic" style={{ color: '#FE961C' }}>Katalog.</em>
                    </h1>
                    <p className="max-w-xs text-base leading-relaxed lg:text-right" style={{ color: 'rgba(240,244,255,0.45)' }}>
                        Jelajahi produk daur ulang berkualitas tinggi — dari bahan baku hingga produk siap pakai.
                    </p>
                </div>
            </section>

            {/* Product grid */}
            <section className="max-w-7xl mx-auto px-6 py-16 pb-28">
                {katalogs.length === 0 ? (
                    <div className="py-40 text-center text-2xl font-black" style={{ color: 'rgba(255,255,255,0.1)' }}>
                        Katalog kosong
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {katalogs.map(item => {
                                const isHovered = hoveredId === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        className="relative group rounded-3xl overflow-hidden transition-all duration-400 cursor-pointer"
                                        style={{
                                            backgroundColor: isHovered ? '#1A2540' : '#141F35',
                                            border: isHovered ? '1px solid rgba(254,150,28,0.3)' : '1px solid rgba(255,255,255,0.06)',
                                            transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                                            boxShadow: isHovered ? '0 20px 60px rgba(0,0,0,0.4)' : 'none',
                                        }}
                                        onMouseEnter={() => setHoveredId(item.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                    >
                                      
                                        

                                        {/* Image */}
                                        <div className="aspect-[4/3] overflow-hidden relative" style={{ backgroundColor: '#0A1020' }}>
                                            {item.image_path ? (
                                                <img
                                                    src={`/storage/${item.image_path}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain p-6 transition-transform duration-600"
                                                    style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg className="w-16 h-16" style={{ color: 'rgba(255,255,255,0.06)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                </div>
                                            )}

                                            {/* Price badge */}
                                            {item.price && (
                                                <div
                                                    className="absolute top-4 right-4 text-white text-xs font-black px-3 py-1.5 rounded-full"
                                                    style={{ backgroundColor: '#FE961C' }}
                                                >
                                                    Rp {Number(item.price).toLocaleString('id-ID')}
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-6 pb-0">
                                            <h3
                                                className="text-lg font-black leading-tight mb-2 transition-colors duration-300"
                                                style={{ color: isHovered ? '#FE961C' : '#F0F4FF' }}
                                            >
                                                {item.name}
                                            </h3>
                                            <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: 'rgba(240,244,255,0.4)' }}>
                                                {item.description}
                                            </p>
                                            {!item.price && (
                                                <span className="inline-block mt-2 text-xs font-bold uppercase tracking-widest" style={{ color: '#7CC13B' }}>
                                                    Harga bervariasi
                                                </span>
                                            )}
                                        </div>

                                        {/* Slide-up CTA */}
                                        <div className="overflow-hidden">
                                            <div
                                                className="transition-all duration-400 ease-out"
                                                style={{
                                                    maxHeight: isHovered ? '80px' : '0px',
                                                    opacity: isHovered ? 1 : 0,
                                                }}
                                            >
                                                <div className="p-6 pt-4">
                                                    <a
                                                        href="https://wa.me/6281336104254"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                                                        style={{ backgroundColor: '#7CC13B' }}
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                        </svg>
                                                        Pesan via WhatsApp
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTA */}
                        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <p className="text-sm" style={{ color: 'rgba(240,244,255,0.35)' }}>
                                Tertarik dengan produk kami?
                            </p>
                            <a
                                href="https://wa.me/6281336104254"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-3 font-bold px-7 py-3.5 rounded-full text-white text-sm transition-all duration-300 bg-[#0E172A] hover:bg-[#0E172A]/80"

                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Hubungi via WhatsApp
                            </a>
                        </div>
                    </>
                )}
            </section>
            <Footer dark />
        </div>
    );
}
