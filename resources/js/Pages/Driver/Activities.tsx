import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import DriverSidebar from '@/Components/DriverSidebar';

interface Company {
    id: number;
    company_name: string;
    address: string | null;
}

interface Activity {
    id: number;
    activity_date: string;
    note: string | null;
    media_path: string | null;
    media_type: 'image' | 'video' | null;
    created_at: string;
    company: Company | null;
}

interface Props {
    companies: Company[];
    activities: Activity[];
}

export default function Activities({ companies, activities }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Default to today's date
    const todayStr = new Date().toLocaleDateString('en-CA');
    
    const { data, setData, post, processing, errors, reset } = useForm({
        company_id: '',
        activity_date: todayStr,
        note: '',
        media: null as File | null,
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('media', file);
            
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('driver.kegiatan.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('note', 'media');
                setPreviewUrl(null);
            },
        });
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Kegiatan Pemanfaatan | WellMaggot Driver" />

            <DriverSidebar 
                active="kegiatan" 
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-24 flex items-center justify-between px-6 sm:px-10 bg-white border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex items-center gap-4 flex-1">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-500 hover:text-green-600 md:hidden focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 hidden sm:block">Log Kegiatan Pemanfaatan</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 sm:px-10">
                    <div className="max-w-6xl mx-auto flex flex-col xl:flex-row gap-8">
                        
                        {/* Upload Form */}
                        <div className="xl:w-1/3 xl:sticky xl:top-8 h-fit">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative z-10">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Tambah Kegiatan</h3>
                                <p className="text-gray-500 font-medium text-sm mb-6">Dokumentasikan proses pemanfaatan sampah setiap mitra.</p>
                                
                                <form onSubmit={handleUpload} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700">Mitra / Perusahaan</label>
                                        <select 
                                            value={data.company_id}
                                            onChange={(e) => setData('company_id', e.target.value)}
                                            className="w-full pl-4 pr-10 py-3 rounded-2xl border-gray-200 bg-gray-50/50 text-gray-900 focus:ring-2 focus:ring-green-100 focus:border-green-400 focus:bg-white transition-all shadow-sm"
                                        >
                                            <option value="">Pilih Mitra...</option>
                                            {companies.map(c => (
                                                <option key={c.id} value={c.id}>{c.company_name}</option>
                                            ))}
                                        </select>
                                        {errors.company_id && <p className="text-red-500 text-xs">{errors.company_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700">Tanggal Proses</label>
                                        <input 
                                            type="date" 
                                            value={data.activity_date}
                                            onChange={(e) => setData('activity_date', e.target.value)}
                                            className="w-full pl-4 pr-10 py-3 rounded-2xl border-gray-200 bg-gray-50/50 text-gray-900 focus:ring-2 focus:ring-green-100 focus:border-green-400 focus:bg-white transition-all shadow-sm"
                                        />
                                        {errors.activity_date && <p className="text-red-500 text-xs">{errors.activity_date}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700">Catatan Proses</label>
                                        <textarea 
                                            value={data.note}
                                            onChange={(e) => setData('note', e.target.value)}
                                            placeholder="Cth: Sampah organik diolah menjadi pakan maggot."
                                            rows={3}
                                            className="w-full pl-4 pr-4 py-3 rounded-2xl border-gray-200 bg-gray-50/50 text-gray-900 focus:ring-2 focus:ring-green-100 focus:border-green-400 focus:bg-white transition-all shadow-sm resize-none"
                                        />
                                        {errors.note && <p className="text-red-500 text-xs">{errors.note}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700">Dokumentasi (Opsional)</label>
                                        
                                        <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-2xl transition-colors ${previewUrl ? 'border-green-300 bg-green-50/30' : 'border-gray-300 hover:border-green-400 hover:bg-green-50/10'}`}>
                                            <div className="space-y-1 text-center w-full">
                                                {previewUrl ? (
                                                    <div className="mb-4 overflow-hidden rounded-lg bg-black/5 text-center flex items-center justify-center h-40">
                                                        {data.media?.type.startsWith('video/') ? (
                                                            <video src={previewUrl} controls className="max-h-full mx-auto rounded-lg" />
                                                        ) : (
                                                            <img src={previewUrl} alt="Preview" className="max-h-full mx-auto object-contain rounded-lg" />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                                
                                                <div className="flex text-sm text-gray-600 justify-center">
                                                    <label className="relative cursor-pointer bg-transparent rounded-md font-bold text-green-600 hover:text-green-500 transition-colors">
                                                        <span>{data.media ? 'Ganti media' : 'Unggah foto/video'}</span>
                                                        <input type="file" className="sr-only" accept="image/*,video/*" onChange={handleFileChange} />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        {errors.media && <p className="text-red-500 text-xs">{errors.media}</p>}
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={processing || !data.company_id || (!data.media && !data.note)}
                                        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-sm xl:text-base text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {processing ? 'Menyimpan...' : 'Kirim Laporan'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Timeline Feed */}
                        <div className="xl:w-2/3">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Riwayat Log Dokumentasi
                            </h3>
                            
                            {activities.length === 0 ? (
                                <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-gray-300">
                                    <p className="text-gray-500 text-sm">Belum ada riwayat kegiatan pengolahan.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {activities.map((activity) => {
                                        const isExpanded = expandedId === activity.id;
                                        return (
                                        <div key={activity.id} className="p-4 sm:px-6 sm:py-5 rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 transition-all hover:border-green-200">
                                            
                                            {/* Minimalist Header Row */}
                                            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(activity.id)}>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                            {new Date(activity.activity_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </span>
                                                        {activity.media_path && (
                                                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                        )}
                                                    </div>
                                                    <div className="font-bold text-gray-900 text-sm sm:text-base">
                                                        {activity.company?.company_name || 'Mitra Tidak Diketahui'}
                                                    </div>
                                                </div>
                                                
                                                <button 
                                                    className={`p-2 rounded-full transition-colors flex shrink-0 items-center justify-center ${isExpanded ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                                                    title={isExpanded ? "Tutup Detail" : "Lihat Detail"}
                                                >
                                                    <svg className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Expandable Details Section */}
                                            {isExpanded && (
                                                <div className="mt-5 pt-5 border-t border-gray-100 animate-fade-in-up">
                                                    <div className="flex flex-col sm:flex-row gap-5">
                                                        {activity.media_path && (
                                                            <div className="sm:w-1/3 shrink-0">
                                                                <div className="rounded-xl overflow-hidden bg-black/5 aspect-square relative shadow-inner">
                                                                    {activity.media_type === 'video' ? (
                                                                        <video src={`/storage/${activity.media_path}`} className="w-full h-full object-cover" controls preload="metadata" />
                                                                    ) : (
                                                                        <div className="w-full h-full group/img relative cursor-pointer">
                                                                             <img src={`/storage/${activity.media_path}`} className="w-full h-full object-cover transition-transform group-hover/img:scale-105" alt="Media Kegiatan" />
                                                                             <a href={`/storage/${activity.media_path}`} target="_blank" className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 flex items-center justify-center transition-colors">
                                                                                <span className="text-white text-xs font-bold opacity-0 group-hover/img:opacity-100 backdrop-blur-sm px-3 py-1.5 bg-black/40 rounded-full">Buka Penuh</span>
                                                                             </a>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        <div className={activity.media_path ? "sm:w-2/3" : "w-full"}>
                                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Catatan Laporan</h4>
                                                            {activity.note ? (
                                                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap p-4 bg-gray-50 rounded-xl border border-gray-100">{activity.note}</p>
                                                            ) : (
                                                                <p className="text-gray-400 text-sm italic p-4 bg-gray-50 rounded-xl border border-gray-100 border-dashed">Tidak ada catatan tertulis.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    )})}
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
