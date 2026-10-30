import React from 'react';
import { Truck, Check, X, AlertCircle } from 'lucide-react';

export interface Vehicle {
    id: number;
    name: string;
    license_plate: string;
    type: string;
    capacity: string | null;
    is_occupied?: boolean;
    occupied_by?: string | null;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    activeVehicles: Vehicle[];
    currentVehicleId?: number | null;
    onSelect: (vehicleId: number | null) => void;
    isSaving: boolean;
}

export default function CleanUPVehicleSelectorModal({
    isOpen,
    onClose,
    activeVehicles = [],
    currentVehicleId,
    onSelect,
    isSaving,
}: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-gray-900/50 backdrop-blur-xs p-0 sm:p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-emerald-50">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <Truck className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-gray-900">Pilih Armada Operasional</h3>
                            <p className="text-[11px] text-gray-500">Pilih kendaraan untuk penjemputan hari ini</p>
                        </div>
                    </div>
                    <button onClick={onClose} disabled={isSaving} className="p-1 text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="overflow-y-auto p-4 space-y-2 flex-1">
                    {activeVehicles.length === 0 ? (
                        <div className="p-6 text-center text-xs text-gray-500">Belum ada armada aktif yang terdaftar di sistem.</div>
                    ) : (
                        activeVehicles.map((v) => {
                            const isSelected = currentVehicleId === v.id;
                            const isOccupied = Boolean(v.is_occupied) && !isSelected;
                            return (
                                <button
                                    key={v.id}
                                    type="button"
                                    disabled={isSaving || isOccupied}
                                    onClick={() => onSelect(v.id)}
                                    className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between gap-2 ${
                                        isSelected
                                            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                                            : isOccupied
                                            ? 'bg-slate-100/70 border-slate-200 opacity-60 cursor-not-allowed'
                                            : 'bg-white hover:bg-slate-50 border-gray-200'
                                    }`}
                                >
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-[11px] px-1.5 py-0.2 rounded bg-slate-900 text-white">
                                                {v.license_plate}
                                            </span>
                                            <span className="text-xs font-bold text-slate-900 truncate">{v.name}</span>
                                        </div>
                                        <div className="text-[11px] text-slate-500 mt-0.5">{v.type} {v.capacity ? `• ${v.capacity}` : ''}</div>
                                    </div>
                                    {isSelected ? (
                                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 shrink-0">
                                            <Check className="w-3.5 h-3.5" /> Terpilih
                                        </span>
                                    ) : isOccupied ? (
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full shrink-0">
                                            Dipakai {v.occupied_by || 'driver lain'}
                                        </span>
                                    ) : (
                                        <span className="text-xs font-bold text-emerald-700 shrink-0">Pilih &rarr;</span>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>

                {currentVehicleId && (
                    <div className="p-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                        <button type="button" disabled={isSaving} onClick={() => onSelect(null)} className="text-xs font-bold text-rose-600 hover:underline">
                            Lepas Armada
                        </button>
                        <button type="button" onClick={onClose} className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg">
                            Tutup
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
