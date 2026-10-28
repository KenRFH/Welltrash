import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import axios from 'axios';
import CleanUPSidebar from '@/Components/CleanUPSidebar';
import AbsensiFloatingButton from '@/Components/AbsensiFloatingButton';
import PwaInstallButton from '@/Components/PwaInstallButton';
import CleanUPOfflineSync from '@/Components/CleanUPOfflineSync';
import { compressImage } from '@/utils/compressImage';
import { saveOfflinePickup, syncSinglePickup, getOfflinePickupIds } from '@/utils/offlinePickupQueue';

// Icons
const CameraIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const GalleryIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

interface Pickup {
    id: number;
    status: 'scheduled' | 'on_the_way' | 'completed' | 'failed';
    organic_weight: number | null;
    anorganic_weight?: number | null;
    residue_weight?: number | null;
    trash_bag_count?: number | null;
    evidence_pickup_path?: string | null;
    pickup_date: string;
    company: {
        id: number;
        company_name: string;
        address: string;
        phone: string;
        pic_name: string;
    };
    cleanup: {
        id: number;
        name: string;
    } | null;
}

interface Props {
    daysOfWeek: string[];
    selectedDay: string;
    targetDate: string;
    isToday: boolean;
    pickups: Pickup[];
    auth: {
        user: { name: string; email: string };
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function Dashboard({ daysOfWeek, selectedDay, targetDate, isToday, pickups, auth, flash }: Props) {
    const [activeModal, setActiveModal] = useState<number | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [fileSizeError, setFileSizeError] = useState<string | null>(null);
    const [pendingPickupIds, setPendingPickupIds] = useState<number[]>([]);
    const [offlineNotice, setOfflineNotice] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [inputMode, setInputMode] = useState<'trashbag_only' | 'weight_and_trashbag'>('trashbag_only');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const cameraInputRef = React.useRef<HTMLInputElement | null>(null);
    const galleryInputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        getOfflinePickupIds().then(ids => setPendingPickupIds(ids));
    }, []);

    // Send initial location ping on mount so driver immediately appears as Standby/Active on Admin map.
    React.useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    axios.post(route('cleanup.location.update'), {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    }).catch(() => {});
                },
                () => {},
                { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
            );
        }
    }, []);

    // ponytail: periodic GPS broadcast while on the way; stops automatically when finished.
    const hasActiveOnTheWay = pickups.some(p => p.status === 'on_the_way');
    const [isGpsSharing, setIsGpsSharing] = useState(false);

    React.useEffect(() => {
        if (!hasActiveOnTheWay || !navigator.geolocation) {
            setIsGpsSharing(false);
            return;
        }

        const sendCurrentLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setIsGpsSharing(true);
                    axios.post(route('cleanup.location.update'), {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    }).catch(() => {});
                },
                () => {
                    setIsGpsSharing(false);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
            );
        };

        sendCurrentLocation();
        const timer = setInterval(sendCurrentLocation, 20000);
        return () => clearInterval(timer);
    }, [hasActiveOnTheWay]);

    const MAX_FILE_MB = 10;
    const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

    const handleImageChange = async (file: File | null) => {
        if (!file) {
            setData('evidence_pickup_path', null);
            setImagePreview(null);
            setFileSizeError(null);
            return;
        }

        if (file.size > MAX_FILE_BYTES) {
            setFileSizeError(`Ukuran foto terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimal ${MAX_FILE_MB} MB.`);
            setData('evidence_pickup_path', null);
            setImagePreview(null);
            return;
        }

        setFileSizeError(null);
        try {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            const compressed = await compressImage(file, 1280, 1280, 0.78);
            setData('evidence_pickup_path', compressed);
        } catch {
            setData('evidence_pickup_path', file);
        }
    };

    // Form for status update
    const { post: postStatus, processing: processingStatus } = useForm();
    
    const { data, setData, post: postSubmit, processing: processingSubmit, errors, reset } = useForm({
        trash_bag_count: '',
        organic_weight: '',
        anorganic_weight: '',
        residue_weight: '',
        evidence_pickup_path: null as File | null,
    });

    const handleDayClick = (day: string) => {
        router.get(route('cleanup.dashboard'), { day }, { preserveState: true });
    };

    const handleUpdateStatus = (pickupId: number, status: string, reason?: string) => {
        if (status === 'on_the_way' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    router.put(route('cleanup.updateStatus', pickupId), {
                        status,
                        cancellation_reason: reason,
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    }, { preserveScroll: true });
                },
                () => {
                    router.put(route('cleanup.updateStatus', pickupId), { status, cancellation_reason: reason }, {
                        preserveScroll: true
                    });
                },
                { enableHighAccuracy: true, timeout: 3000, maximumAge: 10000 }
            );
            return;
        }

        router.put(route('cleanup.updateStatus', pickupId), { status, cancellation_reason: reason }, {
            preserveScroll: true
        });
    };

    const handleOpenSubmitModal = (pickupId: number) => {
        reset();
        setImagePreview(null);
        setFileSizeError(null);
        setInputMode('trashbag_only');
        setActiveModal(pickupId);
    };

    const handleSubmitPickup = async (e: React.FormEvent, pickupId: number) => {
        e.preventDefault();
        if (fileSizeError || isSubmitting) return;

        if (inputMode === 'trashbag_only') {
            if (!data.trash_bag_count || Number(data.trash_bag_count) <= 0) {
                alert('Harap masukkan jumlah total trashbag (minimal 1 kantong).');
                return;
            }
        } else {
            const hasWeight = (Number(data.organic_weight) > 0 || Number(data.anorganic_weight) > 0 || Number(data.residue_weight) > 0);
            const hasBags = Number(data.trash_bag_count) > 0;
            if (!hasWeight && !hasBags) {
                alert('Harap isi jumlah trashbag atau berat sampah.');
                return;
            }
        }

        if (!data.evidence_pickup_path) {
            alert('Harap sertakan foto bukti pengambilan sampah (dari kamera atau galeri).');
            return;
        }

        const activePickup = pickups.find(p => p.id === pickupId);
        const companyName = activePickup?.company?.company_name || 'Mitra';

        setIsSubmitting(true);
        const numericPickupId = Number(pickupId);

        const offlinePayload = {
            pickupId: numericPickupId,
            companyName,
            trash_bag_count: data.trash_bag_count ? Number(data.trash_bag_count) : null,
            organic_weight: inputMode === 'trashbag_only' ? '0' : (data.organic_weight || '0'),
            anorganic_weight: inputMode === 'trashbag_only' ? '0' : (data.anorganic_weight || '0'),
            residue_weight: inputMode === 'trashbag_only' ? '0' : (data.residue_weight || '0'),
            evidence_blob: data.evidence_pickup_path,
            evidence_filename: data.evidence_pickup_path.name || `evidence_${numericPickupId}.jpg`,
            offline_recorded_at: new Date().toISOString(),
        };

        // If offline: save directly to IndexedDB
        if (!navigator.onLine) {
            try {
                await saveOfflinePickup(offlinePayload);
                setPendingPickupIds(prev => Array.from(new Set([...prev, numericPickupId])));
                setActiveModal(null);
                reset();
                setImagePreview(null);
                setOfflineNotice(`Mode Offline: Data penjemputan ${companyName} tersimpan di HP. Akan otomatis diunggah saat terhubung ke internet.`);
                window.dispatchEvent(new Event('welltrash:refresh-offline-queue'));
            } catch (err: any) {
                alert(`Gagal menyimpan data offline: ${err?.message || err}`);
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        // Online Store-and-Forward: save to IndexedDB as backup first, then attempt immediate upload
        try {
            await saveOfflinePickup(offlinePayload);

            const syncRecord = {
                ...offlinePayload,
                created_at: Date.now(),
            };

            const res = await syncSinglePickup(syncRecord);

            if (res.success) {
                setActiveModal(null);
                reset();
                setImagePreview(null);
                setPendingPickupIds(prev => prev.filter(id => id !== numericPickupId));
                router.reload();
            } else if (res.sessionExpired) {
                setActiveModal(null);
                reset();
                setImagePreview(null);
                setPendingPickupIds(prev => Array.from(new Set([...prev, numericPickupId])));
                setOfflineNotice('Sesi Anda berakhir. Data tersimpan aman di HP. Silakan login kembali untuk melanjutkan pengiriman.');
            } else {
                // Network issue or server error - keep safely in IndexedDB
                setActiveModal(null);
                reset();
                setImagePreview(null);
                setPendingPickupIds(prev => Array.from(new Set([...prev, numericPickupId])));
                setOfflineNotice(`Jaringan tidak stabil. Data penjemputan ${companyName} tersimpan di HP dan akan diunggah otomatis.`);
                window.dispatchEvent(new Event('welltrash:refresh-offline-queue'));
            }
        } catch {
            setActiveModal(null);
            reset();
            setImagePreview(null);
            setPendingPickupIds(prev => Array.from(new Set([...prev, numericPickupId])));
            setOfflineNotice(`Koneksi terputus. Data tersimpan aman di HP dan akan diunggah saat sinyal kembali.`);
            window.dispatchEvent(new Event('welltrash:refresh-offline-queue'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="CleanUP Dashboard" />

             {/* Sidebar Component */}
             <CleanUPSidebar 
                 active="dashboard" 
                 isMobileOpen={isSidebarOpen}
                 onClose={() => setIsSidebarOpen(false)}
             />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-green-50 to-emerald-50 opacity-50 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>

                {/* Header Navbar */}
                <header className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-10 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-1.5 text-gray-600 hover:text-green-600 md:hidden focus:outline-none rounded-xl hover:bg-gray-100/70 transition-colors"
                            aria-label="Buka Menu"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <div className="min-w-0">
                            <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight truncate">Tugas Hari Ini</h2>
                            <p className="text-[11px] text-gray-500 font-medium hidden sm:block truncate">Kelola jadwal dan konfirmasi penjemputan sampah</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
                        <Link
                            href={route('cleanup.sync')}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition shadow-xs"
                            title="Sinkronisasi Data Manual"
                        >
                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            <span>Sinkronisasi</span>
                            {pendingPickupIds.length > 0 && (
                                <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                                    {pendingPickupIds.length}
                                </span>
                            )}
                        </Link>
                        <div className="hidden sm:block">
                            <PwaInstallButton variant="header" label="Unduh App" />
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(true)}
                            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-1 sm:p-1.5 sm:pr-4 rounded-full border border-gray-100 bg-white hover:bg-gray-50 hover:shadow-sm transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                            title="Profil & Pengaturan"
                        >
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-green-100 to-emerald-100 flex items-center justify-center p-0.5">
                                <img className="rounded-full w-full h-full object-cover" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=ffffff&color=16a34a&bold=true`} alt="CleanUP avatar" />
                            </div>
                            <div className="flex flex-col text-left hidden sm:flex">
                                <span className="text-sm font-bold text-gray-800 leading-none mb-1">{auth.user.name}</span>
                                <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider leading-none">Mitra CleanUP</span>
                            </div>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 sm:px-10 py-5 sm:py-8 pb-32 md:pb-24 relative z-10 w-full max-w-5xl mx-auto">

                     {/* Offline Synchronization Banner */}
                     <CleanUPOfflineSync onPendingListChange={ids => setPendingPickupIds(ids)} />

                     {/* Local Offline Action Notice */}
                     {offlineNotice && (
                         <div className="mb-6 flex items-start justify-between gap-3 bg-amber-50 border border-amber-300 text-amber-900 text-sm font-medium px-4 py-3.5 rounded-2xl shadow-sm animate-fadeIn">
                             <div className="flex items-start gap-2.5">
                                 <span className="text-amber-600 mt-0.5 text-base">📦</span>
                                 <span>{offlineNotice}</span>
                             </div>
                             <button onClick={() => setOfflineNotice(null)} className="text-amber-700 hover:text-amber-900 font-bold ml-2">✕</button>
                         </div>
                     )}

                     {/* Flash Messages */}
                     {flash?.error && (
                         <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3.5 rounded-2xl shadow-sm">
                             <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                             </svg>
                             <span>{flash.error}</span>
                         </div>
                     )}
                     {flash?.success && (
                         <div className="mb-6 flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-3.5 rounded-2xl shadow-sm">
                             <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                             </svg>
                             <span>{flash.success}</span>
                         </div>
                     )}

                     {/* Day Selector Area */}
                     <div className="mb-6 sm:mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Pilih Hari Operasional</h3>
                            <span className="text-[11px] font-semibold text-emerald-600 sm:hidden">Geser hari →</span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                            {daysOfWeek.map((day) => (
                                <button
                                    key={day}
                                    onClick={() => handleDayClick(day)}
                                    className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm whitespace-nowrap shrink-0 sm:shrink ${
                                        selectedDay === day
                                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30'
                                             : 'bg-white border text-gray-500 hover:bg-gray-50 hover:text-green-600 border-gray-200'
                                    }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pickups Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 sm:gap-4">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Jadwal: {selectedDay}</h2>
                            <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">Daftar lokasi untuk <span className="font-bold">{targetDate}</span>.</p>
                            {!isToday && <p className="text-[11px] sm:text-xs font-bold text-red-500 mt-2 bg-red-50 inline-block px-2.5 py-1 rounded-md border border-red-100">⚠️ Anda hanya dapat memproses pengambilan untuk jadwal hari ini.</p>}
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">Filter:</span>
                            {(['all', 'pending', 'completed'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setStatusFilter(f)}
                                    className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap shrink-0 ${
                                        statusFilter === f
                                            ? f === 'completed' ? 'bg-green-600 text-white border-green-600'
                                              : f === 'pending' ? 'bg-amber-500 text-white border-amber-500'
                                              : 'bg-gray-900 text-white border-gray-900'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {f === 'all' ? `Semua (${pickups.length})` : f === 'pending' ? `Belum Selesai (${pickups.filter(p => p.status !== 'completed' && p.status !== 'failed').length})` : `Selesai (${pickups.filter(p => p.status === 'completed' || p.status === 'failed').length})`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Live GPS Broadcast Indicator */}
                    {hasActiveOnTheWay && (
                        <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs font-semibold text-emerald-800 shadow-2xs">
                            <div className="flex items-center gap-2.5">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                                <span>
                                    <strong>GPS Aktif:</strong> Lokasi armada Anda sedang dibagikan secara real-time ke Mitra & Admin.
                                </span>
                            </div>
                            <span className="hidden sm:inline-block text-[11px] font-bold text-emerald-600 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                                Update otomatis
                            </span>
                        </div>
                    )}

                    {/* Pickup Cards */}
                    {pickups.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Libur Dulu 🌴</h3>
                            <p className="text-gray-500 text-sm max-w-md mx-auto">Tampaknya jadwal Anda kosong untuk hari ini. Waktunya istirahat atau periksa hari lainnya.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {pickups
                                .filter(pickup => {
                                    if (statusFilter === 'pending') return pickup.status !== 'completed' && pickup.status !== 'failed';
                                    if (statusFilter === 'completed') return pickup.status === 'completed' || pickup.status === 'failed';
                                    return true;
                                })
                                .map((pickup) => {
                                const status = pickup.status;
                                const isPendingOffline = pendingPickupIds.includes(pickup.id);
                                
                                return (
                                    <div key={pickup.id} className={`bg-white rounded-2xl p-5 flex flex-col justify-between transition-all border relative overflow-hidden group ${
                                        isPendingOffline ? 'border-amber-300 bg-amber-50/20 shadow-sm' :
                                        status === 'completed' ? 'border-green-200 bg-green-50/30' : 
                                        status === 'on_the_way' ? 'border-emerald-300 shadow-sm' : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                                    }`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="pr-2">
                                                <h3 className="text-[17px] font-bold text-gray-900 leading-tight mb-1.5">{pickup.company.company_name}</h3>
                                                <div className="text-sm text-gray-500 leading-snug">
                                                    <span className="line-clamp-2">{pickup.company.address}</span>
                                                </div>
                                                {/* CleanUP badge — shown when pickup has been handled */}
                                                {pickup.cleanup && (
                                                    <div className={`mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                                        status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        {status === 'completed' ? 'Diselesaikan oleh' : 'Dikerjakan oleh'}: {pickup.cleanup.name}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-shrink-0">
                                                {isPendingOffline ? (
                                                    <span className="text-[10px] font-bold tracking-wider uppercase text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span> Menunggu Sinyal
                                                    </span>
                                                ) : (
                                                    <>
                                                        {status === 'completed' && <span className="text-[10px] font-bold tracking-wider uppercase text-green-700 bg-green-100 px-2.5 py-1 rounded-md">Selesai</span>}
                                                        {status === 'failed' && <span className="text-[10px] font-bold tracking-wider uppercase text-red-700 bg-red-100 px-2.5 py-1 rounded-md">Gagal</span>}
                                                        {status === 'scheduled' && <span className="text-[10px] font-bold tracking-wider uppercase text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">Terjadwal</span>}
                                                        {status === 'on_the_way' && <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> OTW</span>}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {pickup.company.phone && (
                                            <div className="mb-4">
                                                <a 
                                                    href={`https://wa.me/${pickup.company.phone.replace(/^0/, '62')}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-100"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                                                    Hubungi PIC: {pickup.company.pic_name}
                                                </a>
                                            </div>
                                        )}

                                        <div className="pt-4 border-t border-gray-100 flex gap-2">
                                            {isPendingOffline ? (
                                                <div className="w-full flex items-center justify-between py-2.5 px-3.5 bg-amber-50 rounded-xl text-xs font-semibold text-amber-900 border border-amber-200">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-amber-600">⏳</span>
                                                        <span>Tersimpan di HP (Menunggu Sinyal)</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => window.dispatchEvent(new Event('welltrash:refresh-offline-queue'))}
                                                        className="text-xs bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-amber-700 transition shadow-sm"
                                                    >
                                                        Upload
                                                    </button>
                                                </div>
                                            ) : isToday && status !== 'completed' && status !== 'failed' ? (
                                                <>
                                                    {status === 'scheduled' && (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(pickup.id, 'on_the_way')}
                                                            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all"
                                                        >
                                                            Mulai Pickup
                                                        </button>
                                                    )}
                                                    
                                                    {status === 'on_the_way' && (
                                                        <button 
                                                            onClick={() => handleOpenSubmitModal(pickup.id)}
                                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all"
                                                        >
                                                            Input & Selesai
                                                        </button>
                                                    )}
                                                    
                                                    <button 
                                                        onClick={() => {
                                                            const reason = prompt("Alasan pembatalan (misal: Tutup, Tidak ada sampah):");
                                                            if (reason) handleUpdateStatus(pickup.id, 'failed', reason);
                                                        }}
                                                        className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-sm font-semibold rounded-xl transition-colors"
                                                    >
                                                        Batal
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="w-full text-center py-2.5 bg-gray-50 rounded-xl text-xs font-semibold text-gray-500 border border-gray-100">
                                                    {isToday ? 'Tugas telah diproses.' : 'Tugas hanya dapat diproses pada hari kejadian.'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>

                {/* Submission Modal Overlay */}
                {activeModal && (
                    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-opacity p-0 sm:p-4">
                        <div className="bg-white rounded-t-[2rem] sm:rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transform transition-all border border-gray-100">
                            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                                <div>
                                    <h3 className="text-xl font-extrabold text-gray-900">Input Data Sampah</h3>
                                    <p className="text-xs font-medium text-green-700 mt-1">Dokumentasikan jumlah dan berat sampah</p>
                                </div>
                                <button onClick={() => setActiveModal(null)} className="p-2 text-gray-400 hover:text-gray-700 bg-white shadow-sm border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            
                            <div className="overflow-y-auto p-6 pb-8 space-y-5 flex-1 custom-scrollbar">
                                <form id={`submit-form-${activeModal}`} onSubmit={(e) => handleSubmitPickup(e, activeModal)}>

                                    {/* File size error banner */}
                                    {fileSizeError && (
                                        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl mb-2">
                                            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <span>{fileSizeError}</span>
                                        </div>
                                    )}
                                    {/* Organic */}
                                    {/* Mode Selector Tabs */}
                                    <div className="p-1 bg-gray-100 rounded-2xl grid grid-cols-2 gap-1 border border-gray-200 mb-4">
                                        <button
                                            type="button"
                                            onClick={() => setInputMode('trashbag_only')}
                                            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                                                inputMode === 'trashbag_only'
                                                    ? 'bg-white text-emerald-800 shadow-sm border border-emerald-100'
                                                    : 'text-gray-500 hover:text-gray-800'
                                            }`}
                                        >
                                            <span>🗑️</span>
                                            <span>Trashbag Saja</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setInputMode('weight_and_trashbag')}
                                            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                                                inputMode === 'weight_and_trashbag'
                                                    ? 'bg-white text-emerald-800 shadow-sm border border-emerald-100'
                                                    : 'text-gray-500 hover:text-gray-800'
                                            }`}
                                        >
                                            <span>⚖️</span>
                                            <span>Tonase & Trashbag</span>
                                        </button>
                                    </div>

                                    {/* TRASHBAG INPUT */}
                                    <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 shadow-xs mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-blue-900 text-sm flex items-center">
                                                <span className="w-5 h-5 bg-blue-200 text-blue-800 rounded-md flex items-center justify-center mr-1.5 text-xs font-black">TB</span>
                                                Total Trashbag
                                            </h4>
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                                {inputMode === 'trashbag_only' ? 'Wajib' : 'Opsional'}
                                            </span>
                                        </div>

                                        <div className="relative mt-1">
                                            <input 
                                                type="number" 
                                                min="0" 
                                                step="1"
                                                inputMode="numeric"
                                                placeholder="0"
                                                value={data.trash_bag_count}
                                                onChange={e => setData('trash_bag_count', e.target.value)}
                                                className="w-full text-right pr-20 pl-4 py-2.5 bg-white border-blue-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 font-extrabold text-lg shadow-inner text-gray-900"
                                            />
                                            <span className="absolute right-3.5 top-[11px] text-gray-400 font-bold text-xs uppercase">Kantong</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 mt-2">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">Cepat:</span>
                                            {[1, 2, 5, 10].map(n => (
                                                <button
                                                    key={n}
                                                    type="button"
                                                    onClick={() => setData('trash_bag_count', String(Number(data.trash_bag_count || 0) + n))}
                                                    className="px-2 py-0.5 text-xs font-bold bg-white text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100"
                                                >
                                                    +{n}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {inputMode === 'weight_and_trashbag' && (
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center justify-between px-1">
                                                <span className="text-xs font-bold text-gray-600">Timbangan Sampah</span>
                                                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                                    Total: {(Number(data.organic_weight || 0) + Number(data.anorganic_weight || 0) + Number(data.residue_weight || 0)).toFixed(2)} Kg
                                                </span>
                                            </div>

                                            {/* Organic */}
                                            <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-100 shadow-xs">
                                                <h4 className="font-bold text-amber-900 text-xs mb-1.5 flex items-center">
                                                    <span className="w-5 h-5 bg-amber-200 text-amber-800 rounded-md flex items-center justify-center mr-1.5 text-xs font-black">O</span> Organik
                                                </h4>
                                                <div className="relative">
                                                    <input 
                                                        type="number" step="0.01" min="0" inputMode="decimal" placeholder="0.00"
                                                        value={data.organic_weight} onChange={e => setData('organic_weight', e.target.value)}
                                                        className="w-full text-right pr-12 pl-4 py-2 bg-white border-amber-200 rounded-xl font-bold text-base shadow-inner"
                                                    />
                                                    <span className="absolute right-3.5 top-[9px] text-gray-400 font-bold text-xs">Kg</span>
                                                </div>
                                            </div>

                                            {/* Anorganic */}
                                            <div className="bg-teal-50/60 p-3 rounded-2xl border border-teal-100 shadow-xs">
                                                <h4 className="font-bold text-teal-900 text-xs mb-1.5 flex items-center">
                                                    <span className="w-5 h-5 bg-teal-200 text-teal-800 rounded-md flex items-center justify-center mr-1.5 text-xs font-black">A</span> Anorganik
                                                </h4>
                                                <div className="relative">
                                                    <input 
                                                        type="number" step="0.01" min="0" inputMode="decimal" placeholder="0.00"
                                                        value={data.anorganic_weight} onChange={e => setData('anorganic_weight', e.target.value)}
                                                        className="w-full text-right pr-12 pl-4 py-2 bg-white border-teal-200 rounded-xl font-bold text-base shadow-inner"
                                                    />
                                                    <span className="absolute right-3.5 top-[9px] text-gray-400 font-bold text-xs">Kg</span>
                                                </div>
                                            </div>

                                            {/* Residue */}
                                            <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-200 shadow-xs">
                                                <h4 className="font-bold text-gray-800 text-xs mb-1.5 flex items-center">
                                                    <span className="w-5 h-5 bg-gray-200 text-gray-700 rounded-md flex items-center justify-center mr-1.5 text-xs font-black">R</span> Residu
                                                </h4>
                                                <div className="relative">
                                                    <input 
                                                        type="number" step="0.01" min="0" inputMode="decimal" placeholder="0.00"
                                                        value={data.residue_weight} onChange={e => setData('residue_weight', e.target.value)}
                                                        className="w-full text-right pr-12 pl-4 py-2 bg-white border-gray-300 rounded-xl font-bold text-base shadow-inner"
                                                    />
                                                    <span className="absolute right-3.5 top-[9px] text-gray-400 font-bold text-xs">Kg</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Evidence Upload */}
                                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 shadow-xs mt-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-emerald-950 text-xs flex items-center">
                                                <span className="w-5 h-5 bg-emerald-200 text-emerald-800 rounded-md flex items-center justify-center mr-1.5 text-xs">📸</span> Bukti Foto
                                            </h4>
                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Wajib</span>
                                        </div>
                                        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handleImageChange(e.target.files ? e.target.files[0] : null)} />
                                        <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageChange(e.target.files ? e.target.files[0] : null)} />
                                        {imagePreview ? (
                                            <div className="rounded-xl border border-emerald-200 bg-white p-2 flex items-center gap-3">
                                                <img src={imagePreview} alt="Preview" className="w-14 h-14 object-cover rounded-lg border shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-emerald-700 font-extrabold text-xs">✓ Foto Terpilih</div>
                                                    <div className="flex gap-2 mt-1">
                                                        <button type="button" onClick={() => cameraInputRef.current?.click()} className="text-[10px] font-bold text-emerald-700 hover:underline">Kamera</button>
                                                        <span className="text-gray-300">•</span>
                                                        <button type="button" onClick={() => galleryInputRef.current?.click()} className="text-[10px] font-bold text-blue-700 hover:underline">Galeri</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2 mt-1">
                                                <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center justify-center py-3 bg-white border border-emerald-200 hover:bg-emerald-50 rounded-xl transition active:scale-95 group">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1"><CameraIcon /></div>
                                                    <span className="text-xs font-bold text-gray-800">Buka Kamera</span>
                                                    <span className="text-[10px] text-gray-400">Foto Langsung</span>
                                                </button>
                                                <button type="button" onClick={() => galleryInputRef.current?.click()} className="flex flex-col items-center justify-center py-3 bg-white border border-blue-200 hover:bg-blue-50 rounded-xl transition active:scale-95 group">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-1"><GalleryIcon /></div>
                                                    <span className="text-xs font-bold text-gray-800">Buka Galeri</span>
                                                    <span className="text-[10px] text-gray-400">Pilih dari HP</span>
                                                </button>
                                            </div>
                                        )}
                                        {errors.evidence_pickup_path && <p className="text-red-500 text-xs mt-2">{errors.evidence_pickup_path}</p>}
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50">
                                <button 
                                    type="submit" 
                                    form={`submit-form-${activeModal}`}
                                    disabled={isSubmitting || !!fileSizeError}
                                    className={`w-full font-extrabold text-lg py-4 rounded-2xl transition-all flex items-center justify-center hover:-translate-y-0.5 text-white ${
                                        fileSizeError
                                            ? 'bg-red-400 cursor-not-allowed opacity-80'
                                            : 'bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(22,163,74,0.3)]'
                                    }`}
                                >
                                    {fileSizeError
                                        ? 'Foto Terlalu Besar — Ganti Foto'
                                        : isSubmitting ? 'Menyimpan & Mengirim...' : 'Simpan Data Pengambilan'}
                                    {!isSubmitting && !fileSizeError && <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <AbsensiFloatingButton />
        </div>
    );
}
