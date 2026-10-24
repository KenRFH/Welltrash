import { Head, router, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import WebAdminSidebar from '@/Components/WebAdminSidebar';
import SolutionModal from './SolutionModal';
import {
    Building2,
    Factory,
    Recycle,
    ShieldCheck,
    Sparkles,
    Truck,
    Leaf,
    Package,
    Warehouse,
    Plus,
    Pencil,
    Trash2,
    Save,
    Image as ImageIcon,
    Sliders,
    Layers,
    Menu,
    X,
    ExternalLink,
    CheckCircle2,
} from 'lucide-react';

export interface SolutionItem {
    id: number;
    title: string;
    segment: string;
    tag: string;
    desc: string;
    icon: string;
    accent_color: 'green' | 'orange';
    image_path: string | null;
    link_url: string | null;
    order_num: number;
    created_at: string;
}

export interface SectionSettings {
    badge: string;
    title: string;
    subtitle: string;
}

interface Props {
    solutions: SolutionItem[];
    settings: SectionSettings;
    auth: {
        user: {
            name: string;
        };
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

const AVAILABLE_ICONS = [
    { value: 'Building2', label: 'Gedung / Perkantoran', Icon: Building2 },
    { value: 'Factory', label: 'Pabrik / Manufaktur', Icon: Factory },
    { value: 'Recycle', label: 'Daur Ulang / Sirkular', Icon: Recycle },
    { value: 'Truck', label: 'Armada / Logistik', Icon: Truck },
    { value: 'ShieldCheck', label: 'Kepatuhan & Legalitas', Icon: ShieldCheck },
    { value: 'Leaf', label: 'Ekologis / Hijau', Icon: Leaf },
    { value: 'Package', label: 'Paket / Logistik', Icon: Package },
    { value: 'Warehouse', label: 'Fasilitas / Gudang', Icon: Warehouse },
    { value: 'Sparkles', label: 'Inovasi / Unggulan', Icon: Sparkles },
];

export const getSolutionIcon = (iconName: string) => {
    const found = AVAILABLE_ICONS.find((i) => i.value === iconName);
    return found ? found.Icon : Building2;
};

export default function Index({ solutions, settings, auth, flash }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const headerForm = useForm({
        badge: settings?.badge || 'SOLUSI B2B TERPADU',
        title: settings?.title || 'Dirancang untuk skala operasional bisnis Anda.',
        subtitle: settings?.subtitle || 'Pengelolaan sampah komersial membutuhkan keandalan logistik, kepatuhan regulasi lingkungan hidup, dan transparansi data yang dapat dipertanggungjawabkan.',
    });

    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        headerForm.put(route('webadmin.solutions.settings'));
    };

    const cardForm = useForm({
        id: '',
        title: '',
        segment: '',
        tag: '',
        desc: '',
        icon: 'Building2',
        accent_color: 'green' as 'green' | 'orange',
        image: null as File | null,
        link_url: '/layanan',
        order_num: '',
        _method: '',
    });

    const openAddModal = () => {
        cardForm.reset();
        cardForm.clearErrors();
        cardForm.setData({
            id: '',
            title: '',
            segment: '',
            tag: '',
            desc: '',
            icon: 'Building2',
            accent_color: 'green',
            image: null,
            link_url: '/layanan',
            order_num: (solutions.length + 1).toString(),
            _method: '',
        });
        setPreviewImage(null);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (item: SolutionItem) => {
        cardForm.reset();
        cardForm.clearErrors();
        setPreviewImage(item.image_path ? `/storage/${item.image_path}` : null);
        setIsEditing(true);
        cardForm.setData({
            id: item.id.toString(),
            title: item.title,
            segment: item.segment,
            tag: item.tag,
            desc: item.desc,
            icon: item.icon || 'Building2',
            accent_color: item.accent_color || 'green',
            image: null,
            link_url: item.link_url || '/layanan',
            order_num: item.order_num.toString(),
            _method: 'PUT',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        cardForm.reset();
        setPreviewImage(null);
    };

    const handleCardSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            cardForm.data._method = 'PUT';
            cardForm.post(route('webadmin.solutions.update', cardForm.data.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            cardForm.data._method = '';
            cardForm.post(route('webadmin.solutions.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Yakin ingin menghapus kartu solusi "${title}"?`)) {
            router.delete(route('webadmin.solutions.destroy', id));
        }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased text-slate-800">
            <Head title="Kelola Solusi B2B | Web Admin" />
            <WebAdminSidebar active="solutions" isMobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden relative" id="main-container">
                {/* Header */}
                <header className="h-20 flex items-center justify-between px-6 sm:px-10 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl md:hidden transition-all"
                            aria-label="Buka Menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Kelola Solusi B2B</h1>
                                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                    <Layers className="w-3 h-3 text-emerald-600" /> Halaman Depan
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 hidden sm:block">Kustomisasi judul bagian dan kartu solusi operasional bisnis.</p>
                        </div>
                    </div>

                    <a
                        href="/#solusi"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200 rounded-xl transition-all shadow-2xs"
                    >
                        <span>Lihat di Web</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">
                    {flash?.success && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-3 rounded-xl flex items-center gap-2.5 shadow-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{flash.success}</span>
                        </div>
                    )}

                    {/* Section 1: Header Customization Form */}
                    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                                <Sliders className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-900">Teks Bagian (Section Header)</h2>
                                <p className="text-xs text-slate-500">Sesuaikan teks label atas, judul utama, dan narasi pengantar bagian solusi.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSaveSettings} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                                        Label Badge Atas
                                    </label>
                                    <input
                                        type="text"
                                        value={headerForm.data.badge}
                                        onChange={(e) => headerForm.setData('badge', e.target.value)}
                                        placeholder="Contoh: SOLUSI B2B TERPADU"
                                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all font-mono"
                                    />
                                    {headerForm.errors.badge && (
                                        <p className="text-xs text-red-600 mt-1">{headerForm.errors.badge}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                                        Judul Utama
                                    </label>
                                    <input
                                        type="text"
                                        value={headerForm.data.title}
                                        onChange={(e) => headerForm.setData('title', e.target.value)}
                                        placeholder="Contoh: Dirancang untuk skala operasional bisnis Anda."
                                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all font-semibold"
                                    />
                                    {headerForm.errors.title && (
                                        <p className="text-xs text-red-600 mt-1">{headerForm.errors.title}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                                    Subjudul / Deskripsi Pengantar
                                </label>
                                <textarea
                                    rows={2}
                                    value={headerForm.data.subtitle}
                                    onChange={(e) => headerForm.setData('subtitle', e.target.value)}
                                    placeholder="Deskripsi singkat mengenai keunggulan operasional B2B..."
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all leading-relaxed"
                                />
                                {headerForm.errors.subtitle && (
                                    <p className="text-xs text-red-600 mt-1">{headerForm.errors.subtitle}</p>
                                )}
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={headerForm.processing}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{headerForm.processing ? 'Menyimpan...' : 'Simpan Teks Bagian'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                    {/* Section 2: Solution Cards List */}
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-5 gap-3">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Daftar Kartu Solusi B2B</h2>
                                <p className="text-xs text-slate-500">Kelola item kartu yang tampil di bagian solusi ({solutions.length} kartu aktif).</p>
                            </div>

                            <button
                                onClick={openAddModal}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Tambah Kartu Solusi</span>
                            </button>
                        </div>

                        {solutions.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80">
                                <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <h3 className="text-base font-bold text-slate-800">Belum ada kartu solusi</h3>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                                    Tambahkan kartu pertama Anda untuk menginformasikan spesialisasi layanan B2B kepada pengunjung.
                                </p>
                                <button
                                    onClick={openAddModal}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                                >
                                    <Plus className="w-4 h-4" /> Tambah Sekarang
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="cards-grid">
                                {solutions.map((item) => (
                                    <div key={item.id} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
                                        <div>
                                            <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden border-b border-slate-100">
                                                {item.image_path ? (
                                                    <img src={`/storage/${item.image_path}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1">
                                                        <ImageIcon className="w-8 h-8 opacity-40" />
                                                        <span className="text-[11px] font-mono">Foto Default</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                                                <span className="absolute top-3 left-3 font-mono text-[10px] text-white/95 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                                                    {item.segment}
                                                </span>
                                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg ${item.accent_color === 'orange' ? 'bg-orange-500/90 text-white' : 'bg-emerald-600/90 text-white'}`}>
                                                        {item.tag}
                                                    </span>
                                                    <div className="w-7 h-7 rounded-lg bg-white/90 backdrop-blur-md text-zinc-900 flex items-center justify-center shadow-xs">
                                                        {React.createElement(getSolutionIcon(item.icon), { className: 'w-3.5 h-3.5' })}
                                                    </div>
                                                </div>
                                                <span className="absolute top-3 right-3 font-mono text-[10px] font-bold text-white bg-slate-900/70 backdrop-blur-sm px-2 py-0.5 rounded-md">
                                                    #{item.order_num}
                                                </span>
                                            </div>

                                            <div className="p-5">
                                                <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                                                    {item.desc}
                                                </p>
                                                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                                    <span>Link: {item.link_url || '/layanan'}</span>
                                                    <span className="font-mono">{item.icon}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-2">
                                            <button onClick={() => openEditModal(item)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg">
                                                <Pencil className="w-3.5 h-3.5" /> Edit
                                            </button>
                                            <button onClick={() => handleDelete(item.id, item.title)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-red-700 hover:bg-red-50 rounded-lg">
                                                <Trash2 className="w-3.5 h-3.5" /> Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <SolutionModal
                        isOpen={isModalOpen}
                        isEditing={isEditing}
                        cardForm={cardForm}
                        previewImage={previewImage}
                        setPreviewImage={setPreviewImage}
                        onClose={closeModal}
                        onSubmit={handleCardSubmit}
                        availableIcons={AVAILABLE_ICONS}
                    />
                </main>
            </div>
        </div>
    );
}
