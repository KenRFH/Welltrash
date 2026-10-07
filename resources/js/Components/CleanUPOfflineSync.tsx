import React, { useEffect, useState, useCallback } from 'react';
import { 
    countOfflinePickups, 
    syncAllOfflinePickups, 
    getOfflinePickupIds,
    SyncResult
} from '../utils/offlinePickupQueue';
import { router } from '@inertiajs/react';

interface CleanUPOfflineSyncProps {
    onPendingListChange?: (pendingIds: number[]) => void;
}

export default function CleanUPOfflineSync({ onPendingListChange }: CleanUPOfflineSyncProps) {
    const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [isSyncing, setIsSyncing] = useState<boolean>(false);
    const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
    const [bannerStatus, setBannerStatus] = useState<{
        type: 'idle' | 'offline' | 'pending' | 'syncing' | 'success' | 'session_expired' | 'error';
        message: string;
    }>({ type: 'idle', message: '' });

    const refreshPendingStatus = useCallback(async () => {
        try {
            const count = await countOfflinePickups();
            const ids = await getOfflinePickupIds();
            setPendingCount(count);
            if (onPendingListChange) {
                onPendingListChange(ids);
            }
            return count;
        } catch {
            return 0;
        }
    }, [onPendingListChange]);

    const runSync = useCallback(async () => {
        if (isSyncing) return;
        const count = await countOfflinePickups();
        if (count === 0) return;

        setIsSyncing(true);
        setBannerStatus({
            type: 'syncing',
            message: `Menyinkronkan ${count} data penjemputan...`,
        });

        try {
            const res: SyncResult = await syncAllOfflinePickups((current, total) => {
                setProgress({ current, total });
                setBannerStatus({
                    type: 'syncing',
                    message: `Mengunggah ${current} dari ${total} penjemputan...`,
                });
            });

            await refreshPendingStatus();

            if (res.sessionExpired) {
                setBannerStatus({
                    type: 'session_expired',
                    message: 'Sesi Anda telah kedaluwarsa. Data aman tersimpan di HP. Silakan muat ulang halaman atau login kembali.',
                });
            } else if (res.synced > 0) {
                setBannerStatus({
                    type: 'success',
                    message: `Berhasil menyinkronkan ${res.synced} penjemputan ke server!`,
                });
                setTimeout(() => {
                    setBannerStatus({ type: 'idle', message: '' });
                    router.reload();
                }, 2500);
            } else if (res.errors.length > 0) {
                setBannerStatus({
                    type: 'error',
                    message: res.errors[0] || 'Gagal menyinkronkan data.',
                });
            } else {
                setBannerStatus({ type: 'idle', message: '' });
            }
        } catch {
            setBannerStatus({
                type: 'error',
                message: 'Gagal terhubung ke server saat sinkronisasi.',
            });
        } finally {
            setIsSyncing(false);
            setProgress(null);
        }
    }, [isSyncing, refreshPendingStatus]);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            refreshPendingStatus().then((count) => {
                if (count > 0) {
                    runSync();
                }
            });
        };

        const handleOffline = () => {
            setIsOnline(false);
            setBannerStatus({
                type: 'offline',
                message: 'Koneksi terputus (Offline). Data penjemputan akan otomatis disimpan di HP.',
            });
        };

        const handleCustomRefresh = () => {
            refreshPendingStatus().then((count) => {
                if (count > 0) {
                    if (navigator.onLine) {
                        runSync();
                    } else {
                        setBannerStatus({
                            type: 'offline',
                            message: `Masih offline (${count} data tersimpan di HP). Sambungkan ke internet untuk sinkronisasi.`,
                        });
                    }
                }
            });
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        window.addEventListener('welltrash:refresh-offline-queue', handleCustomRefresh);

        refreshPendingStatus().then((count) => {
            if (navigator.onLine && count > 0) {
                runSync();
            } else if (!navigator.onLine) {
                setBannerStatus({
                    type: 'offline',
                    message: 'Koneksi terputus (Offline). Data penjemputan akan otomatis disimpan di HP.',
                });
            }
        });

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('welltrash:refresh-offline-queue', handleCustomRefresh);
        };
    }, [refreshPendingStatus, runSync]);

    if (!isOnline && bannerStatus.type !== 'offline') {
        return (
            <div className="bg-amber-500 text-white px-4 py-2.5 rounded-xl shadow-md flex items-center justify-between text-sm mb-6">
                <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    <span><strong>Mode Offline:</strong> Tidak ada internet. Data penjemputan tersimpan aman di HP.</span>
                </div>
            </div>
        );
    }

    if (bannerStatus.type === 'offline') {
        return (
            <div className="bg-amber-500 text-white px-4 py-2.5 rounded-xl shadow-md flex items-center justify-between text-sm mb-6">
                <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    <span>{bannerStatus.message}</span>
                </div>
                {pendingCount > 0 && (
                    <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                        {pendingCount} tersimpan
                    </span>
                )}
            </div>
        );
    }

    if (bannerStatus.type === 'session_expired') {
        return (
            <div className="bg-red-600 text-white px-4 py-3 rounded-xl shadow-md flex items-center justify-between text-sm mb-6">
                <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m11-3V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z" />
                    </svg>
                    <span>{bannerStatus.message}</span>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-white text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-100 transition shadow"
                >
                    Login / Muat Ulang
                </button>
            </div>
        );
    }

    if (bannerStatus.type === 'syncing') {
        return (
            <div className="bg-blue-600 text-white px-4 py-2.5 rounded-xl shadow-md flex items-center justify-between text-sm mb-6">
                <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{bannerStatus.message}</span>
                </div>
                {progress && (
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-mono">
                        {progress.current}/{progress.total}
                    </span>
                )}
            </div>
        );
    }

    if (bannerStatus.type === 'success') {
        return (
            <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2.5 text-sm mb-6">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{bannerStatus.message}</span>
            </div>
        );
    }

    if (pendingCount > 0) {
        return (
            <div className="bg-amber-500/10 border border-amber-300 text-amber-900 px-4 py-3 rounded-xl shadow-sm flex items-center justify-between text-sm mb-6">
                <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                    <span>
                        Ada <strong>{pendingCount}</strong> penjemputan tersimpan di HP yang belum disinkronkan.
                    </span>
                </div>
                <button
                    onClick={runSync}
                    disabled={isSyncing}
                    className="bg-amber-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-700 transition shadow disabled:opacity-50 flex items-center gap-1.5"
                >
                    {isSyncing ? 'Sinkronisasi...' : 'Sinkronkan Sekarang'}
                </button>
            </div>
        );
    }

    return null;
}

