import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import WebAdminSidebar from '@/Components/WebAdminSidebar';

interface NewsItem {
    id: number;
    title: string;
    content: string;
    image_path: string | null;
    published_date: string | null;
}

interface Props {
    newsItem: NewsItem;
}

export default function Edit({ newsItem }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        title: newsItem.title || '',
        content: newsItem.content || '',
        published_date: newsItem.published_date || '',
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('webadmin.news.update', newsItem.id));
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Edit Artikel | Web Admin" />

            <WebAdminSidebar 
                active="news" 
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-24 flex items-center justify-between px-6 sm:px-10 bg-white/60 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex items-center gap-4 flex-1">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-500 hover:text-purple-600 md:hidden focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">Edit Artikel</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 sm:px-10">
                    <div className="max-w-4xl bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Artikel</label>
                                <input 
                                    type="text" 
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                    required
                                />
                                {errors.title && <span className="text-red-500 text-xs mt-1">{errors.title}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Publikasi</label>
                                <input 
                                    type="date" 
                                    value={data.published_date}
                                    onChange={e => setData('published_date', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                />
                                {errors.published_date && <span className="text-red-500 text-xs mt-1">{errors.published_date}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Konten Artikel</label>
                                <textarea 
                                    value={data.content}
                                    onChange={e => setData('content', e.target.value)}
                                    rows={10}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-y"
                                    required
                                ></textarea>
                                {errors.content && <span className="text-red-500 text-xs mt-1">{errors.content}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Ganti Gambar Header (Opsional)</label>
                                {newsItem.image_path && (
                                    <div className="mb-3">
                                        <img src={`/storage/${newsItem.image_path}`} alt="Preview" className="h-32 rounded-lg object-cover" />
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                />
                                {errors.image && <span className="text-red-500 text-xs mt-1">{errors.image}</span>}
                            </div>

                            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                                <Link href={route('webadmin.news.index')} className="px-6 py-3 text-gray-600 font-semibold hover:bg-gray-50 rounded-xl transition-colors">Batal</Link>
                                <button disabled={processing} type="submit" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50">
                                    Perbarui Artikel
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
