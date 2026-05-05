import { Head, Link } from '@inertiajs/react';
import React from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

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
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ActivityPage({ activities }: Props) {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Head title="Aktivitas Kami | Welltrash" />
            <Navbar />

            {/* Hero Banner */}
            <section className="pt-36 pb-20 px-6 max-w-7xl mx-auto border-b border-gray-100">
                <p className="text-xs font-bold tracking-[0.4em] uppercase mb-4" style={{ color: '#7CC13B' }}>Aktivitas</p>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-gray-900">
                        Apa yang<br />Kami<br /><em className="not-italic" style={{ color: '#FE961C' }}>Lakukan.</em>
                    </h1>
                    <p className="text-gray-400 max-w-sm text-base leading-relaxed lg:text-right">
                        Berbagai kegiatan, edukasi, dan aksi nyata Welltrash bersama komunitas demi lingkungan yang lebih baik.
                    </p>
                </div>
            </section>

            {/* Alternating rows */}
            <section className="max-w-7xl mx-auto px-6 divide-y divide-gray-100">
                {activities.length === 0 && (
                    <div className="py-40 text-center text-gray-200 text-2xl font-black tracking-tight">
                        Belum ada aktivitas
                    </div>
                )}
                {activities.map((activity, i) => {
                    const isEven = i % 2 === 0;
                    return (
                        <Link
                            key={activity.id}
                            href={route('activity.show', activity.id)}
                            className="group flex flex-col md:flex-row items-stretch gap-0 py-0 transition-colors duration-300 hover:bg-gray-50 -mx-6 px-6"
                        >
                            {/* Image side */}
                            <div className={`w-full md:w-[42%] h-64 md:h-80 overflow-hidden flex-shrink-0 my-8 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                                <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-100">
                                    {activity.image_path ? (
                                        <img
                                            src={`/storage/${activity.image_path}`}
                                            alt={activity.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center" style={{ background: '#FFF8F0' }}>
                                            <svg className="w-14 h-14" style={{ color: '#FE961C', opacity: 0.25 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content side */}
                            <div className={`flex-1 flex flex-col justify-center py-8 ${isEven ? 'md:order-2 md:pl-14' : 'md:order-1 md:pr-14'}`}>
                                <div className="flex items-center gap-3 mb-5">
                                    <span className="text-3xl font-black text-gray-100 tabular-nums">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    {activity.date && (
                                        <span className="text-xs text-gray-400 font-medium">{formatDate(activity.date)}</span>
                                    )}
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black leading-tight text-gray-900 mb-4 group-hover:text-[#FE961C] transition-colors duration-300">
                                    {activity.title}
                                </h2>
                                <p className="text-gray-500 leading-relaxed line-clamp-3 mb-7">{activity.description}</p>
                                <span className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: '#7CC13B' }}>
                                    <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-[#7CC13B] after:transition-all after:duration-300 group-hover:after:w-full">
                                        Selengkapnya
                                    </span>
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </section>

            <div className="pb-24"></div>
            <Footer />
        </div>
    );
}
