import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

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
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function NewsPage({ news }: Props) {
    const [activeId, setActiveId] = useState<number | null>(news[0]?.id ?? null);
    const activeArticle = news.find(n => n.id === activeId);

    return (
        <div className="min-h-screen bg-white font-sans">
            <Head title="Berita & Blog | Welltrash" />
            <Navbar />

            {/* Hero */}
            <section className="pt-36 pb-20 px-6 max-w-7xl mx-auto border-b border-gray-100">
                <p className="text-xs font-bold tracking-[0.4em] uppercase mb-4" style={{ color: '#FE961C' }}>Berita & Blog</p>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-gray-900">
                        Kabar<br /><em className="not-italic" style={{ color: '#7CC13B' }}>Terkini.</em>
                    </h1>
                    <p className="text-gray-400 max-w-sm text-base leading-relaxed lg:text-right">
                        Wawasan lingkungan, inspirasi hidup berkelanjutan, dan cerita langsung dari lapangan.
                    </p>
                </div>
            </section>

            {news.length === 0 ? (
                <div className="max-w-7xl mx-auto px-6 py-40 text-center text-gray-200 text-2xl font-black">
                    Belum ada artikel
                </div>
            ) : (
                /* Split panel — left: article list, right: live preview */
                <section className="max-w-7xl mx-auto px-6 py-16">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

                        {/* Left: Numbered article list */}
                        <div className="lg:w-1/2 divide-y divide-gray-100">
                            {news.map((item, i) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveId(item.id)}
                                    className={`w-full text-left flex items-start gap-5 py-6 group transition-colors duration-200 ${activeId === item.id ? '' : 'hover:bg-gray-50'} -mx-3 px-3 rounded-xl`}
                                >
                                    {/* Number */}
                                    <span
                                        className="text-3xl font-black tabular-nums flex-shrink-0 transition-colors duration-300 leading-none mt-1"
                                        style={{ color: activeId === item.id ? '#FE961C' : '#E5E7EB' }}
                                    >
                                        {String(i + 1).padStart(2, '0')}
                                    </span>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        {item.published_date && (
                                            <span className="text-xs text-gray-400 font-medium mb-1 block">{formatDate(item.published_date)}</span>
                                        )}
                                        <h3
                                            className="font-black text-lg leading-snug transition-colors duration-300"
                                            style={{ color: activeId === item.id ? '#FE961C' : '#111827' }}
                                        >
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{item.content}</p>
                                    </div>

                                    {/* Arrow */}
                                    <svg
                                        className="w-5 h-5 flex-shrink-0 mt-1.5 transition-all duration-300"
                                        style={{ color: activeId === item.id ? '#FE961C' : '#D1D5DB', transform: activeId === item.id ? 'translateX(2px)' : 'none' }}
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ))}
                        </div>

                        {/* Right: Preview panel — sticky */}
                        <div className="lg:w-1/2">
                            <div className="lg:sticky lg:top-28">
                                {activeArticle ? (
                                    <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                                        {/* Image */}
                                        <div className="h-64 bg-gray-100 overflow-hidden">
                                            {activeArticle.image_path ? (
                                                <img
                                                    key={activeArticle.id}
                                                    src={`/storage/${activeArticle.image_path}`}
                                                    alt={activeArticle.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center" style={{ background: '#F4FAF0' }}>
                                                    <svg className="w-16 h-16" style={{ color: '#7CC13B', opacity: 0.2 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-8 bg-white">
                                            {activeArticle.published_date && (
                                                <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#7CC13B' }}>
                                                    {formatDate(activeArticle.published_date)}
                                                </p>
                                            )}
                                            <h2 className="text-2xl font-black text-gray-900 mb-4 leading-tight">{activeArticle.title}</h2>
                                            <p className="text-gray-500 leading-relaxed line-clamp-4 mb-7">{activeArticle.content}</p>
                                            <Link
                                                href={route('news.show', activeArticle.id)}
                                                className="inline-flex items-center gap-3 text-white font-bold px-6 py-3 rounded-xl text-sm transition-opacity hover:opacity-90"
                                                style={{ backgroundColor: '#FE961C' }}
                                            >
                                                Baca Artikel Penuh
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </section>
            )}
            <Footer />
        </div>
    );
}
