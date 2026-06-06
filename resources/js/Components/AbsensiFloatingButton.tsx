import React, { useState, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';

import { PageProps } from '@/types';

interface AttendanceToday {
    id: number;
    clock_in_at: string;
    clock_out_at: string | null;
    status: 'present' | 'incomplete';
    overtime_clock_in_at: string | null;
    overtime_clock_out_at: string | null;
}

type ModalMode = 'clock-in' | 'clock-out' | 'overtime-in' | 'overtime-out';

export default function AbsensiFloatingButton() {
    const { attendance_today } = usePage<PageProps<{ attendance_today: AttendanceToday | null }>>().props;

    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState<ModalMode>('clock-in');
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [locating, setLocating] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        photo: null as File | null,
        lat: '',
        lng: '',
    });

    const isDone = attendance_today?.clock_out_at != null;
    const hasClockedIn = attendance_today != null && !isDone;

    const isOvertimeDone = attendance_today?.overtime_clock_out_at != null;
    const hasOvertimeClockedIn = attendance_today?.overtime_clock_in_at != null && !isOvertimeDone;

    const openModal = (m: ModalMode) => {
        reset();
        setPhotoPreview(null);
        setLocationError(null);
        setMode(m);
        setShowModal(true);
    };

    const handlePhotoChange = (file: File | null) => {
        if (!file) return;
        setData('photo', file);
        const reader = new FileReader();
        reader.onload = (e) => setPhotoPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const getLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Browser tidak mendukung GPS.');
            return;
        }
        setLocating(true);
        setLocationError(null);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setData('lat', pos.coords.latitude.toString());
                setData('lng', pos.coords.longitude.toString());
                setLocating(false);
            },
            (err) => {
                setLocationError('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
                setLocating(false);
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let routeName = 'cleanup.attendance.clockIn';
        if (mode === 'clock-out') routeName = 'cleanup.attendance.clockOut';
        if (mode === 'overtime-in') routeName = 'cleanup.attendance.clockInOvertime';
        if (mode === 'overtime-out') routeName = 'cleanup.attendance.clockOutOvertime';

        post(route(routeName), {
            forceFormData: true,
            onSuccess: () => {
                setShowModal(false);
                reset();
                setPhotoPreview(null);
            },
        });
    };

    const formatTime = (dt: string) => {
        return new Date(dt).toLocaleTimeString('id-ID', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    // Floating button state
    const floatingBtn = () => {
        if (isDone) {
            if (isOvertimeDone) {
                return (
                    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
                        <div className="bg-white/90 backdrop-blur-md border border-green-200 rounded-2xl shadow-lg px-4 py-2 text-xs font-bold text-green-700 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                            Absen & Lembur selesai hari ini
                        </div>
                    </div>
                );
            }

            if (hasOvertimeClockedIn) {
                return (
                    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
                        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow px-3 py-1.5 text-[11px] font-bold text-gray-500">
                            Mulai Lembur: <span className="text-gray-800">{formatTime(attendance_today!.overtime_clock_in_at!)}</span>
                        </div>
                        <button
                            onClick={() => openModal('overtime-out')}
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 shadow-[0_8px_24px_rgba(244,63,94,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                            title="Lembur Pulang"
                        >
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                        <span className="text-[10px] font-black tracking-wider text-rose-600 uppercase mr-1">Selesai Lembur</span>
                    </div>
                );
            }

            return (
                <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
                    <div className="bg-white/90 backdrop-blur-md border border-green-200 rounded-2xl shadow-lg px-4 py-2 text-xs font-bold text-green-700 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                        Absen shift selesai
                    </div>
                    <button
                        onClick={() => openModal('overtime-in')}
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-[0_8px_24px_rgba(79,70,229,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all animate-pulse-slow mt-1"
                        title="Lembur Masuk"
                    >
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                    <span className="text-[10px] font-black tracking-wider text-indigo-600 uppercase mr-1">Mulai Lembur</span>
                </div>
            );
        }

        if (hasClockedIn) {
            return (
                <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow px-3 py-1.5 text-[11px] font-bold text-gray-500">
                        Masuk: <span className="text-gray-800">{formatTime(attendance_today!.clock_in_at)}</span>
                    </div>
                    <button
                        onClick={() => openModal('clock-out')}
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-[0_8px_24px_rgba(249,115,22,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                        title="Absen Pulang"
                    >
                        {/* Moon/End icon */}
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                    <span className="text-[10px] font-black tracking-wider text-orange-600 uppercase mr-1">Absen Pulang</span>
                </div>
            );
        }

        return (
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-1">
                <button
                    onClick={() => openModal('clock-in')}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-[0_8px_24px_rgba(22,163,74,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all animate-pulse-slow"
                    title="Absen Masuk"
                >
                    {/* Fingerprint / check-in icon */}
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </button>
                <span className="text-[10px] font-black tracking-wider text-green-600 uppercase mr-1">Absen Masuk</span>
            </div>
        );
    };

    return (
        <>
            {floatingBtn()}

            {/* Absensi Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-gray-900/50 backdrop-blur-sm p-0 sm:p-4">
                    <div className="bg-white rounded-t-[2rem] sm:rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100">
                        {/* Header */}
                        <div className={`px-6 py-5 border-b border-gray-100 flex items-center justify-between ${
                            mode === 'clock-in'
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50'
                                : 'bg-gradient-to-r from-orange-50 to-amber-50'
                        }`}>
                            <div>
                                <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                                    {mode === 'clock-in' && (
                                        <>
                                            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                            Absen Masuk
                                        </>
                                    )}
                                    {mode === 'clock-out' && (
                                        <>
                                            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            Absen Pulang
                                        </>
                                    )}
                                    {mode === 'overtime-in' && (
                                        <>
                                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                            Lembur Masuk
                                        </>
                                    )}
                                    {mode === 'overtime-out' && (
                                        <>
                                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Lembur Pulang
                                        </>
                                    )}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5 font-medium">
                                    {new Date().toLocaleDateString('id-ID', {
                                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-700 bg-white shadow-sm border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Photo Section */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    Foto Selfie <span className="text-gray-400 text-xs font-normal">(Opsional)</span>
                                </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative w-full h-48 rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all ${
                                        photoPreview
                                            ? 'border-green-400 bg-green-50'
                                            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                                    }`}
                                >
                                    {photoPreview ? (
                                        <>
                                            <img
                                                src={photoPreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <span className="text-white font-bold text-sm bg-black/50 px-3 py-1.5 rounded-full">
                                                    Ganti Foto
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-sm font-semibold">Klik untuk ambil foto</span>
                                            <span className="text-xs text-gray-400">Gunakan kamera depan (selfie)</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="user"
                                    className="hidden"
                                    onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
                                />
                                {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo}</p>}
                            </div>

                            {/* Location Section */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    Lokasi <span className="text-gray-400 text-xs font-normal">(Opsional)</span>
                                </label>
                                {data.lat && data.lng ? (
                                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-green-700">Lokasi berhasil diambil</p>
                                            <p className="text-[11px] text-green-600 font-mono truncate">
                                                {parseFloat(data.lat).toFixed(6)}, {parseFloat(data.lng).toFixed(6)}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={getLocation}
                                            className="text-xs text-green-600 font-bold hover:underline flex-shrink-0"
                                        >
                                            Perbarui
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={getLocation}
                                        disabled={locating}
                                        className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 transition-colors disabled:opacity-60"
                                    >
                                        {locating ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Mengambil lokasi...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Ambil Lokasi GPS
                                            </>
                                        )}
                                    </button>
                                )}
                                {locationError && <p className="text-red-500 text-xs mt-1">{locationError}</p>}
                                {errors.lat && <p className="text-red-500 text-xs mt-1">{errors.lat}</p>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full font-extrabold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-white ${
                                    mode.includes('in')
                                        ? mode === 'clock-in' ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-[0_4px_14px_rgba(22,163,74,0.3)] hover:from-green-600 hover:to-emerald-700' : 'bg-gradient-to-r from-indigo-500 to-blue-600 shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:from-indigo-600 hover:to-blue-700'
                                        : mode === 'clock-out' ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:from-orange-600 hover:to-amber-600' : 'bg-gradient-to-r from-red-500 to-rose-500 shadow-[0_4px_14px_rgba(244,63,94,0.3)] hover:from-red-600 hover:to-rose-600'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        {mode === 'clock-in' && 'Konfirmasi Absen Masuk'}
                                        {mode === 'clock-out' && 'Konfirmasi Absen Pulang'}
                                        {mode === 'overtime-in' && 'Konfirmasi Lembur Masuk'}
                                        {mode === 'overtime-out' && 'Konfirmasi Lembur Pulang'}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
