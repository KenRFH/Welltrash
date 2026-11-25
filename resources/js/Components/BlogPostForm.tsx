import React, { useEffect, useRef, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, ImageUp, Menu, Loader2 } from 'lucide-react';
import WebAdminSidebar from '@/Components/WebAdminSidebar';
import BlogEditor, { useAutoGrow } from '@/Components/BlogEditor';
import { compressImage } from '@/utils/compressImage';

/** Write/edit screen for Aktivitas (Berita was merged into it). */
const CONFIG = {
    activity: {
        label: 'Aktivitas', active: 'activities', routeBase: 'webadmin.activities',
        bodyField: 'description', dateField: 'date', bodyRequired: false,
    },
} as const;

interface Props {
    type: keyof typeof CONFIG;
    item?: { id: number; title: string; image_path: string | null } & Record<string, any>;
}

export default function BlogPostForm({ type, item }: Props) {
    const c = CONFIG[type];
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [coverPreview, setCoverPreview] = useState<string | null>(item?.image_path ? `/storage/${item.image_path}` : null);
    const [coverBusy, setCoverBusy] = useState(false);

    const { data, setData, post, processing, errors } = useForm<Record<string, any>>({
        ...(item ? { _method: 'put' } : {}),
        title: item?.title ?? '',
        [c.bodyField]: item?.[c.bodyField] ?? '',
        [c.dateField]: item?.[c.dateField] ?? '',
        image: null as File | null,
    });

    const titleRef = useRef<HTMLTextAreaElement>(null);
    useAutoGrow(titleRef, data.title);

    useEffect(() => () => { if (coverPreview?.startsWith('blob:')) URL.revokeObjectURL(coverPreview); }, [coverPreview]);

    const pickCover = async (file?: File) => {
        if (!file) return;
        setCoverBusy(true);
        const compressed = await compressImage(file);
        setData('image', compressed);
        setCoverPreview(URL.createObjectURL(compressed));
        setCoverBusy(false);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(item ? route(`${c.routeBase}.update`, item.id) : route(`${c.routeBase}.store`));
    };

    const err = (k: string) => errors[k] && <p className="mt-1.5 text-xs font-medium text-red-600">{errors[k]}</p>;
    const heading = item ? `Edit ${c.label}` : `Tulis ${c.label} Baru`;

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title={`${heading} | Web Admin`} />
            <WebAdminSidebar active={c.active} isMobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <form onSubmit={submit} className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="h-16 shrink-0 flex items-center gap-3 px-4 sm:px-8 bg-white border-b border-gray-200">
                    <button type="button" onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-500 md:hidden" aria-label="Buka menu">
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link href={route(`${c.routeBase}.index`)} className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">
                        <ArrowLeft className="w-4 h-4" /> {c.label}
                    </Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-sm font-semibold text-gray-900 truncate">{heading}</span>

                    <div className="ml-auto flex items-center gap-2">
                        <Link href={route(`${c.routeBase}.index`)} className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-gray-600 rounded-lg hover:bg-gray-100">
                            Batal
                        </Link>
                        <button type="submit" disabled={processing || coverBusy} className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 shadow-sm">
                            {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                            {item ? 'Simpan Perubahan' : 'Publikasikan'}
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-7xl px-4 sm:px-8 py-8 flex flex-col lg:flex-row gap-8 items-start">
                        {/* Writing canvas */}
                        <section className="w-full flex-1 min-w-0 bg-white rounded-2xl border border-gray-200 shadow-sm">
                            <div className="px-6 sm:px-12 pt-10 pb-2">
                                <textarea
                                    ref={titleRef}
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value.replace(/\n/g, ' '))}
                                    placeholder={`Judul ${c.label.toLowerCase()}…`}
                                    rows={1}
                                    required
                                    aria-label="Judul"
                                    className="w-full resize-none border-0 p-0 focus:ring-0 outline-none text-3xl sm:text-4xl font-bold leading-tight text-gray-900 placeholder:text-gray-300 bg-transparent"
                                />
                                {err('title')}
                            </div>
                            <BlogEditor value={data[c.bodyField] ?? ''} onChange={(v) => setData(c.bodyField, v)} required={c.bodyRequired} />
                            {errors[c.bodyField] && <div className="px-6 sm:px-12 pb-4">{err(c.bodyField)}</div>}
                        </section>

                        {/* Settings */}
                        <aside className="w-full lg:w-80 shrink-0 space-y-5 lg:sticky lg:top-8">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                                <label htmlFor="post-date" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                                    <CalendarDays className="w-4 h-4 text-gray-400" /> Tanggal
                                </label>
                                <input
                                    id="post-date"
                                    type="date"
                                    value={data[c.dateField] ?? ''}
                                    onChange={(e) => setData(c.dateField, e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                                />
                                {err(c.dateField)}
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                                <p className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-1">
                                    <ImageUp className="w-4 h-4 text-gray-400" /> Gambar Sampul
                                </p>
                                <p className="text-xs text-gray-500 mb-3">Tampil di daftar dan di atas tulisan. Opsional.</p>
                                <label className="group relative block aspect-[16/10] rounded-xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-emerald-400 bg-gray-50 cursor-pointer transition-colors">
                                    {coverPreview ? (
                                        <>
                                            <img src={coverPreview} alt="Sampul" className="w-full h-full object-cover" />
                                            <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                                Ganti gambar
                                            </span>
                                        </>
                                    ) : (
                                        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-400">
                                            <ImageUp className="w-7 h-7" />
                                            <span className="text-xs font-medium">Klik untuk memilih gambar</span>
                                        </span>
                                    )}
                                    {coverBusy && (
                                        <span className="absolute inset-0 flex items-center justify-center bg-white/70">
                                            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                                        </span>
                                    )}
                                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => pickCover(e.target.files?.[0])} />
                                </label>
                                {err('image')}
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-5 text-xs text-gray-600 space-y-2">
                                <p className="text-sm font-semibold text-gray-900">Tips menulis</p>
                                <p>Pisahkan paragraf dengan satu baris kosong.</p>
                                <p>Foto bisa disisipkan lewat tombol, ditempel (Ctrl/⌘+V), atau diseret ke area tulisan.</p>
                                <p>Ketik keterangan foto di dalam <code className="px-1 rounded bg-white border border-gray-200">![…]</code>.</p>
                            </div>
                        </aside>
                    </div>
                </div>
            </form>
        </div>
    );
}
