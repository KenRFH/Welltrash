import { Head, Link, router, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import WebAdminSidebar from '@/Components/WebAdminSidebar';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    desc: string | null;
    image_path: string | null;
    order_num: number;
    created_at: string;
}

interface Props {
    teams: TeamMember[];
    auth: {
        user: {
            name: string;
        }
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Index({ teams, auth, flash }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        id: '',
        name: '',
        role: '',
        desc: '',
        image: null as File | null,
        order_num: '',
        _method: '',
    });

    const openAddModal = () => {
        reset();
        clearErrors();
        setPreviewImage(null);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (member: TeamMember) => {
        reset();
        clearErrors();
        setPreviewImage(member.image_path ? `/storage/${member.image_path}` : null);
        setIsEditing(true);
        setData({
            id: member.id.toString(),
            name: member.name,
            role: member.role,
            desc: member.desc || '',
            image: null,
            order_num: member.order_num.toString(),
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Standard Laravel Inertia form update with files requires POST with _method PUT/PATCH
        if (isEditing) {
            data._method = 'PUT';
            post(route('webadmin.teams.update', data.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            data._method = '';
            post(route('webadmin.teams.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus anggota tim Kopasus ini?')) {
            router.delete(route('webadmin.teams.destroy', id));
        }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Kelola Tim Kopasus | Web Admin" />

            <WebAdminSidebar 
                active="teams" 
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="h-24 flex items-center justify-between px-6 sm:px-10 bg-white/60 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex items-center gap-4 flex-1">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-500 hover:text-green-600 md:hidden focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">Kelola Tim Kopasus</h1>
                    </div>

                    <div className="flex items-center space-x-3 p-1.5 pr-4 rounded-full border border-gray-100 bg-white shadow-sm">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-100 to-emerald-100 flex items-center justify-center p-0.5">
                            <img className="rounded-full w-full h-full object-cover" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=ffffff&color=22c55e&bold=true`} alt="User avatar" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800 leading-none mb-1">{auth.user.name}</span>
                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider leading-none">Web Admin</span>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 sm:px-10">
                    {/* Toast Success */}
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-green-50 text-green-800 border border-green-100 rounded-2xl flex items-center gap-3 text-sm font-medium">
                            <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {flash.success}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Daftar Tim Kopasus</h2>
                            <p className="text-gray-500 text-sm mt-1">Kelola foto, nama, jabatan, dan urutan tampil Tim Kopasus di halaman Tentang Kami.</p>
                        </div>
                        <button 
                            onClick={openAddModal} 
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-semibold transition-all shadow-lg shadow-green-600/20 flex items-center gap-2 self-start"
                        >
                            + Tambah Anggota
                        </button>
                    </div>

                    {/* Table View */}
                    <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                                        <th className="px-6 py-4 font-black">Foto</th>
                                        <th className="px-6 py-4 font-black">Nama</th>
                                        <th className="px-6 py-4 font-black">Jabatan</th>
                                        <th className="px-6 py-4 font-black">Deskripsi</th>
                                        <th className="px-6 py-4 font-black text-center">No Urut</th>
                                        <th className="px-6 py-4 font-black text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {teams.length > 0 ? (
                                        teams.map(member => (
                                            <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden border border-gray-100">
                                                        {member.image_path ? (
                                                            <img src={`/storage/${member.image_path}`} alt={member.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-900 font-bold">
                                                    {member.name}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 font-medium">
                                                    {member.role}
                                                </td>
                                                <td className="px-6 py-4 text-gray-400 max-w-xs truncate font-light">
                                                    {member.desc || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-center text-gray-700 font-bold">
                                                    {member.order_num}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <button 
                                                            onClick={() => openEditModal(member)} 
                                                            className="text-green-600 hover:text-green-800 font-bold text-sm"
                                                        >
                                                            Edit
                                                        </button>
                                                        <span className="text-gray-200">|</span>
                                                        <button 
                                                            onClick={() => handleDelete(member.id)} 
                                                            className="text-red-600 hover:text-red-800 font-bold text-sm"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-16 text-center text-gray-500 font-medium">
                                                Belum ada anggota tim Kopasus yang terdaftar.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* CRUD Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">
                                {isEditing ? 'Edit Anggota Kopasus' : 'Tambah Anggota Kopasus'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Modal Body / Form */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nama Lengkap</label>
                                <input 
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                                    placeholder="Contoh: Mashudi"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Jabatan / Peran</label>
                                <input 
                                    type="text"
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                                    placeholder="Contoh: Direktur Utama"
                                    required
                                />
                                {errors.role && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.role}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">No Urut Tampil</label>
                                    <input 
                                        type="number"
                                        value={data.order_num}
                                        onChange={e => setData('order_num', e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                                        placeholder="Kosongkan = otomatis"
                                    />
                                    {errors.order_num && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.order_num}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Deskripsi Singkat</label>
                                <textarea 
                                    value={data.desc}
                                    onChange={e => setData('desc', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all min-h-[100px]"
                                    placeholder="Deskripsikan peran atau kualifikasi singkat..."
                                />
                                {errors.desc && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.desc}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Foto Profil</label>
                                
                                {previewImage && (
                                    <div className="mb-3 w-28 h-28 rounded-2xl border border-gray-100 overflow-hidden relative group">
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setPreviewImage(null);
                                                setData('image', null);
                                            }}
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                )}

                                <input 
                                    type="file"
                                    accept="image/*"
                                    onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setData('image', file);
                                            setPreviewImage(URL.createObjectURL(file));
                                        }
                                    }}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:transition-all"
                                />
                                {errors.image && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.image}</p>}
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 font-poppins">
                                <button 
                                    type="button" 
                                    onClick={closeModal}
                                    className="px-5 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-2xl hover:bg-gray-50 transition-colors focus:outline-none"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-green-600/20 transition-all focus:outline-none disabled:opacity-50"
                                >
                                    {isEditing ? 'Simpan' : 'Tambah'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
