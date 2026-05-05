import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import CompanySidebar from '@/Components/CompanySidebar';

interface Activity {
    id: number;
    activity_date: string;
    note: string | null;
    media_path: string | null;
    media_type: 'image' | 'video' | null;
}

interface Props {
    company: any;
    activities: Activity[];
    plan: string;
    auth: {
        user: { name: string }
    };
}

export default function Activities({ auth, company, activities, plan }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Kegiatan & Dokumentasi | WellMaggot" />

            <CompanySidebar 
                active="kegiatan" 
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                plan={plan}
            />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-green-50 to-emerald-50 opacity-50 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>

                <header className="h-24 flex items-center justify-between px-6 sm:px-10 bg-white/60 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex items-center gap-4 flex-1">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-500 hover:text-green-600 md:hidden focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 hidden sm:block">Kegiatan & Dokumentasi</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 sm:px-10">
                    <div className="max-w-4xl mx-auto">
                        
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative z-10 mb-8 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">Log Dokumentasi Pemanfaatan</h3>
                                <p className="text-gray-500 font-medium text-sm">Dokumentasi kegiatan pemanfaatan sampah yang dilakukan oleh tim WellMaggot.</p>
                            </div>
                            <div className="hidden md:flex p-3 bg-green-50 rounded-2xl text-green-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                        </div>

                        {activities.length === 0 ? (
                            <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-gray-300">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Belum Ada Riwayat</h3>
                                <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">Kami akan menampilkan dokumentasi proses pengangkutan saat tim kami selesai melayani titik Anda.</p>
                            </div>
                        ) : (
                            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                {activities.map((activity, index) => (
                                    <div key={activity.id} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        
                                        {/* Timeline marker */}
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-100 text-green-600 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 font-bold text-xs ring-4 ring-white">
                                            {new Date(activity.activity_date).getDate()}
                                        </div>
                                        
                                        {/* Card Content */}
                                        <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 group-hover:border-green-200 transition-colors">
                                            <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
                                                <div>
                                                    <time className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                                                        {new Date(activity.activity_date).toLocaleDateString('id-ID', { weekday: 'long', month: 'short', year: 'numeric' })}
                                                    </time>
                                                </div>
                                                <div className="bg-green-500 rounded-full p-2 text-white shadow-sm">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col gap-4">
                                                {activity.media_path && (
                                                    <div className="w-full rounded-xl overflow-hidden bg-gray-50 relative border border-gray-100">
                                                        {activity.media_type === 'video' ? (
                                                            <video src={`/storage/${activity.media_path}`} className="w-full object-contain max-h-64" controls preload="metadata" />
                                                        ) : (
                                                            <div className="w-full group/img relative cursor-pointer">
                                                                 <img src={`/storage/${activity.media_path}`} className="w-full object-contain max-h-64 transition-transform group-hover/img:scale-105" alt="Media Kegiatan" />
                                                                 <a href={`/storage/${activity.media_path}`} target="_blank" className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 flex items-center justify-center transition-colors">
                                                                    <span className="text-white text-xs font-bold opacity-0 group-hover/img:opacity-100 backdrop-blur-sm px-3 py-1.5 bg-black/40 rounded-full">Lihat Penuh</span>
                                                                 </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="w-full">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Catatan Kegiatan</h4>
                                                    {activity.note ? (
                                                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap p-4 bg-gray-50 rounded-xl border border-gray-100">{activity.note}</p>
                                                    ) : (
                                                        <p className="text-gray-400 text-sm italic p-4 bg-gray-50 rounded-xl border border-gray-100 border-dashed">Tidak ada catatan tertulis.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
