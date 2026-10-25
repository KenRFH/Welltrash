import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect, useCallback } from 'react';
import CleanUPSidebar from '@/Components/CleanUPSidebar';
import AbsensiFloatingButton from '@/Components/AbsensiFloatingButton';
import {
    getOfflinePickups,
    syncSinglePickup,
    syncAllOfflinePickups,
    removeOfflinePickupByPickupId,
    refreshCsrfToken,
    OfflinePickupRecord,
} from '@/utils/offlinePickupQueue';

interface Props {
    auth: { user: { id: number; name: string; email: string } };
}

export default function Sync({ auth }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const [records, setRecords] = useState<OfflinePickupRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{ type: 'ok' | 'err' | 'info'; text: string } | null>(null);

    const reloadQueue = useCallback(async () => {
        setIsLoading(true);
        try {
            const list = await getOfflinePickups();
            setRecords(list);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        reloadQueue();
        const onOn = () => setIsOnline(true);
        const onOff = () => setIsOnline(false);
        window.addEventListener('online', onOn);
        window.addEventListener('offline', onOff);
        return () => {
            window.removeEventListener('online', onOn);
            window.removeEventListener('offline', onOff);
        };
    }, [reloadQueue]);

    const handleSyncAll = async () => {
        if (isSyncing || records.length === 0) return;
        setIsSyncing(true);
        setStatusMsg({ type: 'info', text: 'Menyinkronkan data...' });
        try {
            const res = await syncAllOfflinePickups();
            window.dispatchEvent(new Event('welltrash:refresh-offline-queue'));
            if (res.synced > 0) {
                setStatusMsg({ type: 'ok', text: `Berhasil menyinkronkan ${res.synced} penjemputan!` });
            } else if (res.errors.length > 0) {
                setStatusMsg({ type: 'err', text: res.errors[0] });
            }
        } catch (e: any) {
            setStatusMsg({ type: 'err', text: e?.message || 'Gagal sinkronisasi.' });
        } finally {
            setIsSyncing(false);
            reloadQueue();
        }
    };

    const handleSyncOne = async (record: OfflinePickupRecord) => {
        if (isSyncing) return;
        setIsSyncing(true);
        try {
            const res = await syncSinglePickup(record);
            window.dispatchEvent(new Event('welltrash:refresh-offline-queue'));
            if (res.success) {
                setStatusMsg({ type: 'ok', text: `Berhasil kirim: ${record.companyName}` });
            } else {
                setStatusMsg({ type: 'err', text: res.error || 'Gagal kirim data.' });
            }
        } finally {
            setIsSyncing(false);
            reloadQueue();
        }
    };

    const handleDelete = async (pickupId: number) => {
        if (!confirm('Hapus antrean ini dari HP?')) return;
        await removeOfflinePickupByPickupId(pickupId);
        window.dispatchEvent(new Event('welltrash:refresh-offline-queue'));
        reloadQueue();
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Sinkronisasi Data Manual" />
            <CleanUPSidebar active="sync" isMobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-10 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsSidebarOpen(true)} 
                            className="p-2 -ml-1.5 text-gray-600 hover:text-green-600 md:hidden focus:outline-none rounded-xl hover:bg-gray-100/70 transition-colors" 
                            aria-label="Buka Menu"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight truncate">Sinkronisasi Data Manual</h2>
                    </div>
                    <Link href={route('cleanup.dashboard')} className="text-xs font-bold px-3 py-1.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-xs shrink-0">
                        ← Jadwal
                    </Link>
                </header>

                <main className="flex-1 overflow-y-auto px-4 sm:px-10 py-5 sm:py-6 pb-32 md:pb-24 max-w-4xl mx-auto w-full space-y-4">
                    {statusMsg && (
                        <div className={`p-4 rounded-xl text-sm font-semibold flex justify-between ${statusMsg.type === 'ok' ? 'bg-green-50 text-green-800 border border-green-200' : statusMsg.type === 'err' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
                            <span>{statusMsg.text}</span>
                            <button onClick={() => setStatusMsg(null)} className="ml-2 font-bold text-gray-400">✕</button>
                        </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                            <span className="text-[11px] font-bold text-gray-400 uppercase">Koneksi</span>
                            <div className="flex items-center gap-2 mt-1 font-bold text-sm">
                                <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                {isOnline ? 'Online' : 'Offline'}
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                            <span className="text-[11px] font-bold text-gray-400 uppercase">Antrean di HP</span>
                            <div className="font-extrabold text-lg text-gray-900 mt-0.5">{records.length} Item</div>
                        </div>
                        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center">
                            <button onClick={() => refreshCsrfToken().then(() => alert('Sesi token berhasil diperbarui!'))} className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 rounded-xl border border-gray-200">
                                🔄 Cek Sesi Server
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-gray-900 text-sm">Antrean Tersimpan ({records.length})</h3>
                        {records.length > 0 && (
                            <button onClick={handleSyncAll} disabled={isSyncing} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50">
                                {isSyncing ? 'Sinkronisasi...' : 'Sinkronkan Semua'}
                            </button>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="bg-white p-8 text-center rounded-2xl border border-gray-100 text-gray-500 text-sm">Memuat antrean...</div>
                    ) : records.length === 0 ? (
                        <div className="bg-white p-8 text-center rounded-2xl border border-dashed border-gray-200">
                            <div className="text-3xl mb-2">✨</div>
                            <h4 className="font-bold text-gray-800 text-sm">Semua Data Sudah Tersinkronkan</h4>
                            <p className="text-xs text-gray-400 mt-1">Tidak ada data penjemputan tertunda di HP.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {records.map((item) => (
                                <div key={item.pickupId} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-gray-900">{item.companyName}</span>
                                            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">#{item.pickupId}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 flex flex-wrap gap-2 items-center">
                                            {item.trash_bag_count && Number(item.trash_bag_count) > 0 && (
                                                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                                    📦 {item.trash_bag_count} Trashbag
                                                </span>
                                            )}
                                            {(Number(item.organic_weight || 0) > 0 || Number(item.anorganic_weight || 0) > 0 || Number(item.residue_weight || 0) > 0) ? (
                                                <>
                                                    <span>Org: {item.organic_weight || 0}kg</span>
                                                    <span>Anorg: {item.anorganic_weight || 0}kg</span>
                                                    <span>Res: {item.residue_weight || 0}kg</span>
                                                </>
                                            ) : (
                                                <span className="text-gray-400 italic">Hanya Trashbag</span>
                                            )}
                                        </div>
                                        {item.lastError && (
                                            <p className="text-[11px] text-red-600 bg-red-50 p-1.5 rounded">⚠ {item.lastError}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 self-end sm:self-auto">
                                        <button onClick={() => handleDelete(item.pickupId)} disabled={isSyncing} className="text-xs px-3 py-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                            Hapus
                                        </button>
                                        <button onClick={() => handleSyncOne(item)} disabled={isSyncing} className="text-xs font-bold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50">
                                            Kirim
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
            <AbsensiFloatingButton />
        </div>
    );
}
