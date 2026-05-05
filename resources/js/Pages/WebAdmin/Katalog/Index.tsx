import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import WebAdminSidebar from '@/Components/WebAdminSidebar';

interface Katalog {
    id: number;
    name: string;
    description: string;
    price: number | null;
    image_path: string;
    created_at: string;
}

interface Props {
    katalogs: Katalog[];
}

export default function Index({ katalogs }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus item katalog ini?')) {
            router.delete(route('webadmin.katalogs.destroy', id));
        }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Kelola Katalog | Web Admin" />

            <WebAdminSidebar 
                active="katalogs" 
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-24 flex items-center justify-between px-6 sm:px-10 bg-white/60 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex items-center gap-4 flex-1">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-500 hover:text-blue-600 md:hidden focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">Kelola Katalog Produk</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 sm:px-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Daftar Katalog</h2>
                        <Link href={route('webadmin.katalogs.create')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm">
                            + Tambah Item
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                                    <th className="px-6 py-4 font-semibold">Nama Item</th>
                                    <th className="px-6 py-4 font-semibold">Harga</th>
                                    <th className="px-6 py-4 font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {katalogs.length > 0 ? katalogs.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-900 font-medium">
                                            {item.name}
                                            {item.image_path && <span className="ml-2 text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">Ada Gambar</span>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {item.price ? `Rp ${Number(item.price).toLocaleString('id-ID')}` : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-3">
                                                <Link href={route('webadmin.katalogs.edit', item.id)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</Link>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 font-medium">Hapus</button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                            Belum ada item di katalog.
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
