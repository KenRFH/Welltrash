import React from 'react';
import { X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    isEditing: boolean;
    cardForm: any;
    previewImage: string | null;
    setPreviewImage: (val: string | null) => void;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    availableIcons: { value: string; label: string }[];
}

export default function SolutionModal({
    isOpen,
    isEditing,
    cardForm,
    previewImage,
    setPreviewImage,
    onClose,
    onSubmit,
    availableIcons,
}: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">
                        {isEditing ? 'Edit Kartu Solusi B2B' : 'Tambah Kartu Solusi B2B'}
                    </h3>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Judul Layanan *</label>
                        <input
                            type="text"
                            value={cardForm.data.title}
                            onChange={(e) => cardForm.setData('title', e.target.value)}
                            placeholder="Contoh: Corporate Waste Management"
                            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                            required
                        />
                        {cardForm.errors.title && <p className="text-xs text-red-600 mt-1">{cardForm.errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Segmen (Atas) *</label>
                            <input
                                type="text"
                                value={cardForm.data.segment}
                                onChange={(e) => cardForm.setData('segment', e.target.value)}
                                placeholder="Komersial & Ritel"
                                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                                required
                            />
                            {cardForm.errors.segment && <p className="text-xs text-red-600 mt-1">{cardForm.errors.segment}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Tag (Bawah) *</label>
                            <input
                                type="text"
                                value={cardForm.data.tag}
                                onChange={(e) => cardForm.setData('tag', e.target.value)}
                                placeholder="Logistik Terjadwal"
                                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                                required
                            />
                            {cardForm.errors.tag && <p className="text-xs text-red-600 mt-1">{cardForm.errors.tag}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Warna Tag</label>
                            <select
                                value={cardForm.data.accent_color}
                                onChange={(e) => cardForm.setData('accent_color', e.target.value)}
                                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-white"
                            >
                                <option value="green">Hijau (Emerald)</option>
                                <option value="orange">Oranye</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Ikon</label>
                            <select
                                value={cardForm.data.icon}
                                onChange={(e) => cardForm.setData('icon', e.target.value)}
                                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-white"
                            >
                                {availableIcons.map((i) => (
                                    <option key={i.value} value={i.value}>{i.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi *</label>
                        <textarea
                            rows={3}
                            value={cardForm.data.desc}
                            onChange={(e) => cardForm.setData('desc', e.target.value)}
                            placeholder="Jelaskan spesifikasi dan cakupan layanan..."
                            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none leading-relaxed"
                            required
                        />
                        {cardForm.errors.desc && <p className="text-xs text-red-600 mt-1">{cardForm.errors.desc}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">URL Link</label>
                            <input
                                type="text"
                                value={cardForm.data.link_url}
                                onChange={(e) => cardForm.setData('link_url', e.target.value)}
                                placeholder="/layanan"
                                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Urutan</label>
                            <input
                                type="number"
                                value={cardForm.data.order_num}
                                onChange={(e) => cardForm.setData('order_num', e.target.value)}
                                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 outline-none font-mono"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Foto Kartu</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                cardForm.setData('image', file);
                                if (file) setPreviewImage(URL.createObjectURL(file));
                            }}
                            className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                        />
                        {cardForm.errors.image && <p className="text-xs text-red-600 mt-1">{cardForm.errors.image}</p>}
                        {previewImage && (
                            <div className="mt-2.5 relative w-24 aspect-[16/10] rounded-lg overflow-hidden border border-slate-200">
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={cardForm.processing}
                            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50"
                        >
                            {cardForm.processing ? 'Menyimpan...' : isEditing ? 'Perbarui Kartu' : 'Tambah Kartu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
