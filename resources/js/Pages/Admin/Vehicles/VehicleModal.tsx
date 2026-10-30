import React from 'react';
import { X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    isEditing: boolean;
    data: any;
    setData: (field: any, val: any) => void;
    errors: Record<string, string>;
    processing: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

const TYPES = ['Truk Boks', 'Truk Bak', 'Pick Up', 'Motor Roda Tiga', 'Minibus', 'Lainnya'];

export default function VehicleModal({ isOpen, isEditing, data, setData, errors, processing, onClose, onSubmit }: Props) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-extrabold text-slate-900">{isEditing ? 'Edit Data Armada' : 'Tambah Armada Baru'}</h3>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={onSubmit} className="mt-4 space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nama Armada *</label>
                        <input type="text" required placeholder="Truk Isuzu Elf Box 01" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white" />
                        {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Plat Nomor *</label>
                            <input type="text" required placeholder="P 8492 GA" value={data.license_plate} onChange={(e) => setData('license_plate', e.target.value.toUpperCase())} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:bg-white" />
                            {errors.license_plate && <p className="text-[11px] text-rose-500 mt-1">{errors.license_plate}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Jenis *</label>
                            <select value={data.type} onChange={(e) => setData('type', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white">
                                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Kapasitas</label>
                            <input type="text" placeholder="4 m³ / 1.500 kg" value={data.capacity} onChange={(e) => setData('capacity', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Status *</label>
                            <select value={data.status} onChange={(e) => setData('status', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white">
                                <option value="active">Siap Jalan</option>
                                <option value="maintenance">Perawatan</option>
                                <option value="inactive">Nonaktif</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Catatan / Rute</label>
                        <textarea rows={2} placeholder="Catatan rute atau info armada" value={data.notes} onChange={(e) => setData('notes', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white" />
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Batal</button>
                        <button type="submit" disabled={processing} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan Armada'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
