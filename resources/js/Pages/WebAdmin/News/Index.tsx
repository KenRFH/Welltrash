import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import WebAdminSidebar from '@/Components/WebAdminSidebar';

interface NewsItem {
    id: number;
    title: string;
    content: string;
    image_path: string | null;
    published_date: string | null;
    created_at: string;
}

interface Props {
    news: NewsItem[];
}

export default function Index({ news }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus artikel ini?')) {
            router.delete(route('webadmin.news.destroy', id));
        }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Kelola Berita | Web Admin" />

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
                        <h1 className="text-xl font-bold text-gray-800">Kelola Berita & Blog</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 sm:px-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Daftar Berita</h2>
                        <Link href={route('webadmin.news.create')} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm">
                            + Tulis Artikel Baru
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                                    <th className="px-6 py-4 font-semibold">Judul Artikel</th>
                                    <th className="px-6 py-4 font-semibold">Tanggal Publikasi</th>
                                    <th className="px-6 py-4 font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {news.length > 0 ? news.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-900 font-medium">
                                            {item.title}
                                            {item.image_path && <span className="ml-2 text-xs text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">Ada Gambar</span>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {item.published_date ? new Date(item.published_date).toLocaleDateString('id-ID') : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-3">
                                                <Link href={route('webadmin.news.edit', item.id)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</Link>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 font-medium">Hapus</button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                            Belum ada artikel berita.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}
