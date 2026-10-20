import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link, router } from '@inertiajs/react';
import {
    Users,
    Truck,
    Shield,
    Building2,
    Plus,
    Search,
    Edit2,
    Trash2,
    Calendar,
    Phone,
    Mail,
    Eye,
    EyeOff,
    Check,
    X,
    FileText,
    AlertTriangle,
    Layers,
    Sparkles,
    Briefcase,
} from 'lucide-react';

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
    const [searchQuery, setSearchQuery] = useState('');
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
            password: '',
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

    // Aggregates & Infographics
    const totalCleanups = cleanups.length;
    const totalWebAdmins = webAdmins.length;
    const totalCompanies = companies.length;
    const totalAccounts = totalCleanups + totalWebAdmins + totalCompanies;

    // Filtered lists
    const activeList = useMemo(() => {
        const list = activeSubTab === 'CleanUP' ? cleanups : activeSubTab === 'web_admin' ? webAdmins : companies;
        if (!searchQuery) return list;
        const q = searchQuery.toLowerCase();
        return list.filter(u =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            (u.company?.company_name && u.company.company_name.toLowerCase().includes(q))
        );
    }, [activeSubTab, cleanups, webAdmins, companies, searchQuery]);

    return (
        <AdminLayout
            title="Kelola Akun Pengguna"
            subtitle="Manajemen otorisasi & kredensial akun CleanUP, Web Admin, dan Mitra Bisnis"
            activeTab="accounts"
            headerAction={
                <button
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Akun Baru</span>
                </button>
            }
        >
            <div className="space-y-6">
                {/* 1. Infographic Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Akun</span>
                            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                                <Users className="w-4.5 h-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                            {totalAccounts}
                            <span className="text-xs font-medium text-slate-400 ml-1 font-sans">Pengguna</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Terdaftar pada sistem terpusat</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CleanUP Driver</span>
                            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Truck className="w-4.5 h-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-emerald-700 tracking-tight tabular-nums">
                            {totalCleanups}
                            <span className="text-xs font-medium text-slate-400 ml-1 font-sans">Personel</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            <span className="font-bold text-emerald-600">
                                {totalAccounts > 0 ? Math.round((totalCleanups / totalAccounts) * 100) : 0}%
                            </span>
                            <span>dari total akun</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Web Admin</span>
                            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Shield className="w-4.5 h-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-blue-700 tracking-tight tabular-nums">
                            {totalWebAdmins}
                            <span className="text-xs font-medium text-slate-400 ml-1 font-sans">Pengelola</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            <span>Portal berita & katalog</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Akun Mitra</span>
                            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                                <Building2 className="w-4.5 h-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-teal-700 tracking-tight tabular-nums">
                            {totalCompanies}
                            <span className="text-xs font-medium text-slate-400 ml-1 font-sans">Entitas</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            <span>Perusahaan industri & komersial</span>
                        </div>
                    </div>
                </div>

                {/* 2. Visual Role Proportion Meter */}
                <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-emerald-600" />
                            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                                Komposisi Hak Akses Pengguna Sistem
                            </h3>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">
                            Total {totalAccounts} Akun Aktif
                        </span>
                    </div>

                    <div className="space-y-2">
                        <div className="h-2.5 w-full bg-slate-100 rounded-md overflow-hidden flex">
                            {totalAccounts > 0 ? (
                                <>
                                    <div
                                        style={{ width: `${(totalCleanups / totalAccounts) * 100}%` }}
                                        className="bg-emerald-500 transition-all duration-500"
                                        title={`CleanUP: ${totalCleanups}`}
                                    />
                                    <div
                                        style={{ width: `${(totalWebAdmins / totalAccounts) * 100}%` }}
                                        className="bg-blue-500 transition-all duration-500"
                                        title={`Web Admin: ${totalWebAdmins}`}
                                    />
                                    <div
                                        style={{ width: `${(totalCompanies / totalAccounts) * 100}%` }}
                                        className="bg-teal-500 transition-all duration-500"
                                        title={`Mitra Perusahaan: ${totalCompanies}`}
                                    />
                                </>
                            ) : null}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 pt-1">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                                <span>CleanUP ({totalCleanups})</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-xs bg-blue-500" />
                                <span>Web Admin ({totalWebAdmins})</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-xs bg-teal-500" />
                                <span>Mitra Perusahaan ({totalCompanies})</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Segmented Role Tabs & Search Bar */}
                <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 bg-slate-100/70 p-1 rounded-lg border border-slate-200/60 text-xs">
                        <button
                            onClick={() => setActiveSubTab('CleanUP')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                activeSubTab === 'CleanUP'
                                    ? 'bg-white text-emerald-700 shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Truck className="w-3.5 h-3.5" />
                            <span>CleanUP</span>
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                activeSubTab === 'CleanUP' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-600'
                            }`}>
                                {totalCleanups}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveSubTab('web_admin')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                activeSubTab === 'web_admin'
                                    ? 'bg-white text-blue-700 shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Shield className="w-3.5 h-3.5" />
                            <span>Web Admin</span>
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                activeSubTab === 'web_admin' ? 'bg-blue-50 text-blue-700' : 'bg-slate-200 text-slate-600'
                            }`}>
                                {totalWebAdmins}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveSubTab('company')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                activeSubTab === 'company'
                                    ? 'bg-white text-teal-700 shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Mitra Bisnis</span>
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                activeSubTab === 'company' ? 'bg-teal-50 text-teal-700' : 'bg-slate-200 text-slate-600'
                            }`}>
                                {totalCompanies}
                            </span>
                        </button>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari nama, email, perusahaan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* 4. Accounts Table */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                {activeSubTab === 'CleanUP' ? 'Daftar Personel CleanUP' : activeSubTab === 'web_admin' ? 'Daftar Web Administrator' : 'Daftar Akun Mitra Bisnis'}
                            </h2>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                Menampilkan {activeList.length} akun pengguna
                            </p>
                        </div>
                    </div>

                    {activeList.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                                <Users className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800">Tidak ada akun ditemukan</h4>
                            <p className="text-xs text-slate-400 font-medium mt-1">
                                Belum ada akun dalam kategori ini atau hasil pencarian nihil.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100 text-left">
                                <thead>
                                    <tr className="bg-slate-50/75">
                                        <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            Pengguna / Akun
                                        </th>
                                        <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            Peran / Otoritas
                                        </th>
                                        {activeSubTab === 'company' && (
                                            <>
                                                <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                    Paket & Kategori
                                                </th>
                                                <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                    Jadwal Rutin
                                                </th>
                                            </>
                                        )}
                                        <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            Tanggal Daftar
                                        </th>
                                        <th className="px-5 py-3.5 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">

                                    {activeList.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/70 transition-colors group">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-xs border ${
                                                        user.role === 'CleanUP'
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                            : user.role === 'web_admin'
                                                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                            : 'bg-teal-50 text-teal-700 border-teal-100'
                                                    }`}>
                                                        {user.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-xs text-slate-400 font-medium">
                                                            {user.email}
                                                        </div>
                                                        {user.company && (
                                                            <div className="text-[11px] text-teal-700 font-semibold mt-0.5">
                                                                {user.company.company_name} {user.company.phone ? `(${user.company.phone})` : ''}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                                                    user.role === 'CleanUP'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                                                        : user.role === 'web_admin'
                                                        ? 'bg-blue-50 text-blue-700 border border-blue-200/70'
                                                        : 'bg-teal-50 text-teal-700 border border-teal-200/70'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        user.role === 'CleanUP' ? 'bg-emerald-500' : user.role === 'web_admin' ? 'bg-blue-500' : 'bg-teal-500'
                                                    }`} />
                                                    {user.role === 'CleanUP' ? 'Driver / Armada' : user.role === 'web_admin' ? 'Web Admin' : 'Mitra Industri'}
                                                </span>
                                            </td>

                                            {activeSubTab === 'company' && (
                                                <>
                                                    <td className="px-5 py-4 text-xs font-medium text-slate-700">
                                                        <div>
                                                            <span className="font-bold text-slate-900">{user.company?.subscription_plan || 'Reguler'}</span>
                                                            <div className="text-slate-400 text-[11px]">{user.company?.business_category || 'Komersial'}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                            {user.company?.pickup_schedule && user.company.pickup_schedule.length > 0 ? (
                                                                user.company.pickup_schedule.map((day) => (
                                                                    <span key={day} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                                                                        {day.substring(0, 3)}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-xs text-slate-400 italic">Belum diatur</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                            <td className="px-5 py-4 text-xs font-medium text-slate-500">
                                                {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="inline-flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors"
                                                        title="Edit Akun"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(user)}
                                                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                                                        title="Hapus Akun"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Create / Edit Account Modal */}
            {isModalOpen && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" onClick={closeModal} />
                        <div className="relative bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden my-8 z-10">
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                        {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">
                                            {isEditing ? 'Perbarui Akun Pengguna' : 'Tambah Akun Pengguna Baru'}
                                        </h3>
                                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                                            Lengkapi kredensial dan hak akses akun
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                                {/* Role Selection */}
                                <div>
                                    <label className="text-xs font-bold text-slate-600 block mb-1.5">Peran Akun Sistem</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['CleanUP', 'web_admin', 'company'] as const).map((r) => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => setData('role', r)}
                                                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                                                    data.role === r
                                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                {r === 'CleanUP' ? 'CleanUP' : r === 'web_admin' ? 'Web Admin' : 'Mitra Bisnis'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Nama pengguna..."
                                            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                        {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Email Pengguna</label>
                                        <input
                                            type="email"
                                            required
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="email@example.com"
                                            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                        {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-600 block mb-1">
                                        Kata Sandi {isEditing && <span className="text-slate-400 font-normal">(kosongkan jika tidak diubah)</span>}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required={!isEditing}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-3 pr-10 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-[11px] text-rose-600 mt-1">{errors.password}</p>}
                                </div>

                                {data.role === 'company' && (
                                    <div className="space-y-3 pt-3 border-t border-slate-100">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                            <Building2 className="w-4 h-4 text-emerald-600" />
                                            <span>Informasi Profil Perusahaan / Mitra</span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Nama Perusahaan</label>
                                                <input
                                                    type="text"
                                                    required={data.role === 'company'}
                                                    value={data.company_name}
                                                    onChange={(e) => setData('company_name', e.target.value)}
                                                    placeholder="PT / CV / Resto..."
                                                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Nama PIC</label>
                                                <input
                                                    type="text"
                                                    required={data.role === 'company'}
                                                    value={data.pic_name}
                                                    onChange={(e) => setData('pic_name', e.target.value)}
                                                    placeholder="Nama penanggung jawab..."
                                                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Nomor Telepon / WhatsApp</label>
                                                <input
                                                    type="text"
                                                    required={data.role === 'company'}
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="08xxxxxxxxxx"
                                                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Paket Berlangganan</label>
                                                <select
                                                    value={data.subscription_plan}
                                                    onChange={(e) => setData('subscription_plan', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                >
                                                    <option value="Reguler">Reguler (Maks. 5 hari)</option>
                                                    <option value="Prime">Prime (Maks. 7 hari)</option>
                                                    <option value="Premium+">Premium+ (Maks. 7 hari)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Alamat Operasional</label>
                                            <textarea
                                                required={data.role === 'company'}
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                rows={2}
                                                placeholder="Alamat penjemputan limbah..."
                                                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label className="text-xs font-bold text-slate-600">Jadwal Hari Penjemputan Rutin</label>
                                                <span className="text-[11px] text-slate-400 font-medium">
                                                    Terpilih: {data.pickup_schedule.length} / {getScheduleLimit(data.subscription_plan)} hari
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {daysOfWeek.map((day) => {
                                                    const isSelected = data.pickup_schedule.includes(day);
                                                    return (
                                                        <button
                                                            key={day}
                                                            type="button"
                                                            onClick={() => handleDayToggle(day)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                                                isSelected
                                                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                                                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                                            }`}
                                                        >
                                                            {day}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">
                                                Unggah Bukti MOU / Kontrak {isEditing ? '(Opsional)' : '(Wajib)'}
                                            </label>
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => setData('signed_mou', e.target.files ? e.target.files[0] : null)}
                                                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Modal Actions */}
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs disabled:opacity-50"
                                    >
                                        {processing && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        <span>{isEditing ? 'Perbarui Akun' : 'Simpan Akun Baru'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Minimalist Delete Confirmation Modal */}
            {deleteConfirmId && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" onClick={() => setDeleteConfirmId(null)} />
                        <div className="relative bg-white rounded-xl max-w-sm w-full p-6 border border-slate-200 shadow-xl overflow-hidden my-8 z-10">
                            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-900">
                                Konfirmasi Hapus Akun
                            </h3>
                            <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed">
                                Apakah Anda yakin ingin menghapus akun ini secara permanen? Data mitra dan jadwal penjemputan terkait juga akan dibersihkan.
                            </p>
                            <div className="mt-5 flex items-center justify-end gap-2">
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={executeDelete}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-xs"
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
