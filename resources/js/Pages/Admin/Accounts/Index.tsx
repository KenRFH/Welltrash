import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link, router } from '@inertiajs/react';

interface CompanyProfile {
    id: number;
    user_id: number;
    company_name: string;
    pic_name: string;
    address: string;
    phone: string;
    business_category: string | null;
    subscription_plan: string | null;
    subscription_status: string;
    subscription_end_date: string | null;
    signed_mou_path: string | null;
    pickup_schedule: string[] | null;
}

interface UserAccount {
    id: number;
    name: string;
    email: string;
    role: 'CleanUP' | 'web_admin' | 'company';
    created_at: string;
    company?: CompanyProfile | null;
}

interface Props {
    cleanups: UserAccount[];
    webAdmins: UserAccount[];
    companies: UserAccount[];
    flash?: {
        success: string | null;
        error: string | null;
    };
}

export default function Index({ cleanups, webAdmins, companies, flash }: Props) {
    const [activeSubTab, setActiveSubTab] = useState<'CleanUP' | 'web_admin' | 'company'>('CleanUP');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Form logic
    const { data, setData, post, reset, errors, processing } = useForm({
        id: '',
        name: '',
        email: '',
        password: '',
        role: 'CleanUP',
        company_name: '',
        pic_name: '',
        address: '',
        phone: '',
        business_category: '',
        subscription_plan: 'Reguler',
        pickup_schedule: [] as string[],
        signed_mou: null as File | null,
    });

    // Plan-based schedule limits
    const getScheduleLimit = (plan: string) => {
        return ['Prime', 'Premium+'].includes(plan) ? 7 : 5;
    };

    const handleDayToggle = (day: string) => {
        const currentSchedule = [...data.pickup_schedule];
        if (currentSchedule.includes(day)) {
            setData('pickup_schedule', currentSchedule.filter(d => d !== day));
        } else {
            const limit = getScheduleLimit(data.subscription_plan);
            if (currentSchedule.length >= limit) {
                alert(`Paket ${data.subscription_plan} maksimal hanya dapat memilih ${limit} hari penjemputan.`);
                return;
            }
            setData('pickup_schedule', [...currentSchedule, day]);
        }
    };

    const openAddModal = () => {
        reset();
        setIsEditing(false);
        setShowPassword(false);
        setData(prev => ({
            ...prev,
            role: activeSubTab,
            pickup_schedule: []
        }));
        setIsModalOpen(true);
    };

    const openEditModal = (user: UserAccount) => {
        setIsEditing(true);
        setShowPassword(false);
        setData(prev => ({
            ...prev,
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            password: '', // Kept empty unless changing
            role: user.role,
            company_name: user.company?.company_name || '',
            pic_name: user.company?.pic_name || '',
            address: user.company?.address || '',
            phone: user.company?.phone || '',
            business_category: user.company?.business_category || '',
            subscription_plan: user.company?.subscription_plan || 'Reguler',
            pickup_schedule: user.company?.pickup_schedule || [],
            signed_mou: null,
        }));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setShowPassword(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Custom front-end check for company schedule
        if (data.role === 'company') {
            const limit = getScheduleLimit(data.subscription_plan);
            if (data.pickup_schedule.length === 0) {
                alert('Jadwal penjemputan wajib dipilih setidaknya 1 hari.');
                return;
            }
            if (data.pickup_schedule.length > limit) {
                alert(`Paket ${data.subscription_plan} maksimal hanya dapat memilih ${limit} hari penjemputan.`);
                return;
            }
            if (!isEditing && !data.signed_mou) {
                alert('Bukti MOU wajib diunggah untuk mitra baru.');
                return;
            }
        }

        if (isEditing) {
            // We use standard POST to handle multipart files cleanly in Inertia update
            post(route('admin.accounts.update', data.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.accounts.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const confirmDelete = (user: UserAccount) => {
        setDeleteConfirmId(user.id);
    };

    const executeDelete = () => {
        if (deleteConfirmId) {
            router.delete(route('admin.accounts.destroy', deleteConfirmId), {
                onSuccess: () => setDeleteConfirmId(null),
                onError: () => setDeleteConfirmId(null),
            });
        }
    };

    const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    return (
        <AdminLayout
            title="Kelola Akun Pengguna"
            subtitle="Manajemen akun CleanUP, Web Admin, dan Mitra/Company"
            activeTab="accounts"
            headerAction={
                <button
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95 duration-300 transform"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    TAMBAH AKUN BARU
                </button>
            }
        >
            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-semibold shadow-sm animate-in fade-in duration-300">
                    <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                    </span>
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-800 text-sm font-semibold shadow-sm animate-in fade-in duration-300">
                    <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
                    </span>
                    {flash.error}
                </div>
            )}

            {/* Dashboard Stats Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total CleanUP</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-1 group-hover:text-orange-600 transition-colors">{cleanups.length}</h3>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">DAPAT BERTUGAS</p>
                    </div>
                    <div className="w-14 h-14 bg-orange-50 border border-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Web Admin</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-1 group-hover:text-amber-600 transition-colors">{webAdmins.length}</h3>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">PENGELOLA KONTEN</p>
                    </div>
                    <div className="w-14 h-14 bg-amber-50 border border-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mitra / Perusahaan</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-1 group-hover:text-emerald-600 transition-colors">{companies.length}</h3>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">PROFIL AKTIF</p>
                    </div>
                    <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Premium Sliding Tabs */}
            <div className="flex bg-gray-100/70 p-1.5 rounded-2xl max-w-lg mb-8 border border-gray-200/20 backdrop-blur-sm shadow-inner">
                <button
                    onClick={() => setActiveSubTab('CleanUP')}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                        activeSubTab === 'CleanUP'
                            ? 'bg-white text-gray-900 shadow-md border border-gray-100'
                            : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                    CleanUP
                </button>
                <button
                    onClick={() => setActiveSubTab('web_admin')}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                        activeSubTab === 'web_admin'
                            ? 'bg-white text-gray-900 shadow-md border border-gray-100'
                            : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                    Web Admin
                </button>
                <button
                    onClick={() => setActiveSubTab('company')}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                        activeSubTab === 'company'
                            ? 'bg-white text-gray-900 shadow-md border border-gray-100'
                            : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                    Mitra (Company)
                </button>
            </div>

            {/* List Table Container */}
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
                <div className="px-6 py-6 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black text-gray-900 capitalize">Daftar Akun {activeSubTab.replace('_', ' ')}</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            Menampilkan {activeSubTab === 'CleanUP' ? cleanups.length : activeSubTab === 'web_admin' ? webAdmins.length : companies.length} pengguna
                        </p>
                    </div>
                </div>

                {/* Tab content rendering */}
                <div className="overflow-x-auto">
                    {/* CLEANUP TABLE */}
                    {activeSubTab === 'CleanUP' && (
                        cleanups.length === 0 ? (
                            <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Belum ada akun CleanUP terdaftar</div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-50">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama / Email</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Tanggal Terdaftar</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {cleanups.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        className="w-10 h-10 rounded-xl shadow-sm border border-orange-100"
                                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=fff7ed&color=ea580c&bold=true`}
                                                        alt={user.name}
                                                    />
                                                    <div>
                                                        <p className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{user.name}</p>
                                                        <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                                                {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-5 text-right flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="inline-flex items-center justify-center p-2 rounded-xl text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-all border border-transparent hover:border-orange-100"
                                                    title="Edit Akun"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(user)}
                                                    className="inline-flex items-center justify-center p-2 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all border border-transparent hover:border-rose-100"
                                                    title="Hapus Akun"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    )}

                    {/* WEB ADMIN TABLE */}
                    {activeSubTab === 'web_admin' && (
                        webAdmins.length === 0 ? (
                            <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Belum ada akun web admin terdaftar</div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-50">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama / Email</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Tanggal Terdaftar</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {webAdmins.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        className="w-10 h-10 rounded-xl shadow-sm border border-amber-100"
                                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=fef3c7&color=d97706&bold=true`}
                                                        alt={user.name}
                                                    />
                                                    <div>
                                                        <p className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{user.name}</p>
                                                        <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                                                {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-5 text-right flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="inline-flex items-center justify-center p-2 rounded-xl text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-all border border-transparent hover:border-orange-100"
                                                    title="Edit Akun"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(user)}
                                                    className="inline-flex items-center justify-center p-2 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all border border-transparent hover:border-rose-100"
                                                    title="Hapus Akun"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    )}

                    {/* MITRA / COMPANY TABLE */}
                    {activeSubTab === 'company' && (
                        companies.length === 0 ? (
                            <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Belum ada akun mitra terdaftar</div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-50">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Perusahaan / PIC</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Paket / Kontak</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Bukti MOU</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Jadwal Pickup</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {companies.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        className="w-10 h-10 rounded-xl shadow-sm border border-emerald-100"
                                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.company?.company_name || user.name)}&background=ecfdf5&color=059669&bold=true`}
                                                        alt={user.company?.company_name || user.name}
                                                    />
                                                    <div>
                                                        <p className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{user.company?.company_name || 'Tidak Ada Data Perusahaan'}</p>
                                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">PIC: {user.company?.pic_name || user.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium truncate max-w-[200px]">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1">
                                                    <span className="inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-black tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                        {user.company?.subscription_plan || 'Belum Memilih'}
                                                    </span>
                                                    <p className="text-xs text-gray-500 font-medium">{user.company?.phone || '-'}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm">
                                                {user.company?.signed_mou_path ? (
                                                    <a
                                                        href={`/storage/${user.company.signed_mou_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-800 transition-colors hover:underline"
                                                    >
                                                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                                        Unduh MOU
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Belum Ada</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-wrap gap-1 max-w-[250px]">
                                                    {user.company?.pickup_schedule && user.company.pickup_schedule.length > 0 ? (
                                                        user.company.pickup_schedule.map((day, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider bg-gray-100 text-gray-700 border border-gray-200"
                                                            >
                                                                {day.substring(0, 3)}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Kosong</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="inline-flex items-center justify-center p-2 rounded-xl text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-all border border-transparent hover:border-orange-100"
                                                    title="Edit Akun & Profil"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(user)}
                                                    className="inline-flex items-center justify-center p-2 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all border border-transparent hover:border-rose-100"
                                                    title="Hapus Akun"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    )}
                </div>
            </div>

            {/* Dynamic Morphing Add/Edit Modal */}
            {isModalOpen && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 md:p-10">
                        {/* Glassmorphic Background overlay */}
                        <div
                            className="fixed inset-0 transition-opacity bg-gray-900/60 backdrop-blur-sm z-0"
                            aria-hidden="true"
                            onClick={closeModal}
                        />

                        {/* Centered Modal content */}
                        <div className="relative z-10 bg-white rounded-[32px] text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-300 my-auto flex flex-col max-h-[90vh]">
                            {/* Minimalist, Clean Header */}
                            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-shrink-0">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900 tracking-tight" id="modal-title">
                                        {isEditing ? 'Edit Akun Pengguna' : 'Tambah Akun Pengguna Baru'}
                                    </h3>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                        {isEditing ? 'Perbarui login dan data pendukung' : 'Daftarkan nama, login, dan detail akses'}
                                    </p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all focus:outline-none"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden m-0">
                                {/* Scrollable form area */}
                                <div className="px-8 py-6 space-y-5 overflow-y-auto max-h-[60vh] sm:max-h-[65vh]">
                                {/* Role Selection - only visible on create */}
                                {!isEditing ? (
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Pilih Peran Akun (Role)</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['CleanUP', 'web_admin', 'company'].map(r => (
                                                <button
                                                    key={r}
                                                    type="button"
                                                    onClick={() => {
                                                        setData('role', r);
                                                        // Reset schedule if changing away from company
                                                        if (r !== 'company') {
                                                            setData('pickup_schedule', []);
                                                        }
                                                    }}
                                                    className={`py-3 px-4 rounded-2xl border text-xs font-black uppercase tracking-wider text-center transition-all ${
                                                        data.role === r
                                                            ? 'bg-gray-900 border-gray-900 text-white shadow-md'
                                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {r === 'web_admin' ? 'Web Admin' : r}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.role && <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.role}</p>}
                                    </div>
                                ) : (
                                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200/50 flex items-center justify-between">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Peran Pengguna saat ini</span>
                                        <span className="px-3.5 py-1 rounded-xl text-xs font-black tracking-wider uppercase bg-orange-100 text-orange-700 border border-orange-200">
                                            {data.role === 'web_admin' ? 'Web Admin' : data.role}
                                        </span>
                                    </div>
                                )}

                                {/* User Details (Name, Email, Password) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-300"
                                            placeholder="Masukkan nama lengkap..."
                                            required
                                        />
                                        {errors.name && <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Email Aktif (Opsional)</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-300"
                                            placeholder="contoh@welltrash.com (opsional)"
                                        />
                                        {errors.email && <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.email}</p>}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                                            Kata Sandi (Password) {isEditing && <span className="text-[10px] text-gray-400 font-medium">(Kosongkan jika tidak ingin diubah)</span>}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-300"
                                                placeholder="Minimal 8 karakter..."
                                                required={!isEditing}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black focus:outline-none"
                                            >
                                                {showPassword ? (
                                                    <svg className="h-5 w-5 animate-in fade-in duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                                ) : (
                                                    <svg className="h-5 w-5 animate-in fade-in duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.025 10.025 0 012.247-4.025m3.479-2.871A9.957 9.957 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-9-9a3 3 0 11-6 0 3 3 0 016 0z" strokeDasharray="3 3"/></svg>
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.password}</p>}
                                    </div>
                                </div>

                                {/* Dynamic Company/Mitra Profile Fields */}
                                {data.role === 'company' && (
                                    <div className="space-y-6 pt-6 border-t border-gray-100 animate-in slide-in-from-top-4 duration-500">
                                        <div className="px-4 py-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-black tracking-widest uppercase border border-emerald-100">
                                            Profil Perusahaan / Mitra
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Nama Perusahaan</label>
                                                <input
                                                    type="text"
                                                    value={data.company_name}
                                                    onChange={e => setData('company_name', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-300"
                                                    placeholder="PT. Sampah Bersih Utama"
                                                    required
                                                />
                                                {errors.company_name && <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.company_name}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Nama PIC</label>
                                                <input
                                                    type="text"
                                                    value={data.pic_name}
                                                    onChange={e => setData('pic_name', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-300"
                                                    placeholder="Nama penanggung jawab..."
                                                    required
                                                />
                                                {errors.pic_name && <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.pic_name}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">No. Telepon / WhatsApp</label>
                                                <input
                                                    type="text"
                                                    value={data.phone}
                                                    onChange={e => setData('phone', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-300"
                                                    placeholder="081234567890"
                                                    required
                                                />
                                                {errors.phone && <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.phone}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Kategori Bisnis</label>
                                                <input
                                                    type="text"
                                                    value={data.business_category}
                                                    onChange={e => setData('business_category', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-300"
                                                    placeholder="e.g. Kuliner, Perkantoran, Ritel"
                                                />
                                                {errors.business_category && <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.business_category}</p>}
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Alamat Lengkap</label>
                                                <textarea
                                                    rows={2}
                                                    value={data.address}
                                                    onChange={e => setData('address', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-300 resize-none"
                                                    placeholder="Alamat kantor perusahaan..."
                                                    required
                                                />
                                                {errors.address && <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.address}</p>}
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Paket Langganan</label>
                                                <select
                                                    value={data.subscription_plan}
                                                    onChange={e => {
                                                        const newPlan = e.target.value;
                                                        setData(prev => ({
                                                            ...prev,
                                                            subscription_plan: newPlan,
                                                            pickup_schedule: [] // Reset schedule to prevent exceeding new limits
                                                        }));
                                                    }}
                                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all bg-white"
                                                    required
                                                >
                                                    <option value="Rumah Tangga (> 10km)">Rumah Tangga (&gt; 10km)</option>
                                                    <option value="Reguler">Reguler</option>
                                                    <option value="Prime">Prime (Maks. 6 Hari Penjemputan)</option>
                                                    <option value="Premium+">Premium+ (Maks. 6 Hari Penjemputan)</option>
                                                </select>
                                                {errors.subscription_plan && <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.subscription_plan}</p>}
                                            </div>

                                            {/* Clickable Days Schedule Picker */}
                                            <div className="sm:col-span-2">
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Jadwal Penjemputan</label>
                                                    <span className="text-[10px] text-gray-400 font-bold">
                                                        TERPILIH: {data.pickup_schedule.length} / {getScheduleLimit(data.subscription_plan)} HARI
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                                    {daysOfWeek.map((day, idx) => {
                                                        const isSelected = data.pickup_schedule.includes(day);
                                                        return (
                                                            <button
                                                                key={idx}
                                                                type="button"
                                                                onClick={() => handleDayToggle(day)}
                                                                className={`py-2.5 px-2 rounded-xl border text-[11px] font-black uppercase tracking-wider text-center transition-all ${
                                                                    isSelected
                                                                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                                                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                                }`}
                                                            >
                                                                {day.substring(0, 3)}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                {errors.pickup_schedule && <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.pickup_schedule}</p>}
                                            </div>

                                            {/* File Upload Zone - MOU Document */}
                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                                                    Berkas Bukti MOU {isEditing && <span className="text-[10px] text-gray-400 font-medium">(Pilih file baru jika ingin mengganti)</span>}
                                                </label>
                                                <div className="border-2 border-dashed border-gray-200 hover:border-emerald-400 rounded-3xl p-5 text-center transition-all cursor-pointer relative group">
                                                    <input
                                                        type="file"
                                                        accept=".pdf,image/jpeg,image/png,image/jpg"
                                                        onChange={e => setData('signed_mou', e.target.files?.[0] || null)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        required={!isEditing}
                                                    />
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <span className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                                                        </span>
                                                        <p className="text-xs font-bold text-gray-700">
                                                            {data.signed_mou ? data.signed_mou.name : 'Klik atau seret file Bukti MOU di sini'}
                                                        </p>
                                                        <p className="text-[9px] text-gray-400 font-medium uppercase">Format: PDF, JPG, PNG &bull; Maks. 10MB</p>
                                                    </div>
                                                </div>
                                                {errors.signed_mou && <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.signed_mou}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                </div>

                                {/* Fixed Footer buttons */}
                                <div className="flex items-center justify-end gap-3 px-8 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-5 py-3 rounded-2xl text-xs font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all active:scale-95"
                                    >
                                        BATAL
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg hover:shadow-orange-200 disabled:opacity-50 transition-all active:scale-95"
                                    >
                                        {processing ? (
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : null}
                                        SIMPAN AKUN
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Custom Premium Deletion Confirmation Modal */}
            {deleteConfirmId && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4 text-center">
                        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity z-0" onClick={() => setDeleteConfirmId(null)} />
                        <div className="relative z-10 inline-block bg-white rounded-3xl p-6 text-left overflow-hidden shadow-2xl transform transition-all max-w-md w-full border border-gray-100 animate-in fade-in zoom-in-95 duration-300 my-auto">
                            <div className="w-14 h-14 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                            </div>
                            <h3 className="text-lg font-black text-gray-900 leading-tight">Apakah Anda yakin ingin menghapus akun ini?</h3>
                            <p className="text-xs font-semibold text-gray-400 mt-2">
                                Tindakan ini bersifat permanen. Menghapus akun ini juga akan menghapus data profil perusahaan (untuk mitra) beserta seluruh jadwal pickup terkait secara bersih.
                            </p>
                            <div className="mt-6 flex gap-3 justify-end">
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={executeDelete}
                                    className="px-4 py-2.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-md shadow-rose-100"
                                >
                                    Ya, Hapus Akun
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}
