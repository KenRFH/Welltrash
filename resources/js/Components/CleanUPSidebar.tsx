import { Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import PwaInstallButton from './PwaInstallButton';
import { countOfflinePickups } from '../utils/offlinePickupQueue';

const HistoryIcon = ({ className = "w-5 h-5 mr-3" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const CalendarIcon = ({ className = "w-5 h-5 mr-3" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const ActivitiesIcon = ({ className = "w-5 h-5 mr-3" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const AttendanceIcon = ({ className = "w-5 h-5 mr-3" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);
const SyncIcon = ({ className = "w-5 h-5 mr-3" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);
const LogoutIcon = ({ className = "w-5 h-5 mr-2" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

interface Props {
    active: 'dashboard' | 'history' | 'kegiatan' | 'attendance' | 'sync';
    isMobileOpen?: boolean;
    onClose?: () => void;
}

export default function CleanUPSidebar({ active, isMobileOpen = false, onClose }: Props) {
    const [pendingCount, setPendingCount] = useState<number>(0);

    useEffect(() => {
        let isMounted = true;
        const updateCount = () => {
            countOfflinePickups()
                .then(cnt => {
                    if (isMounted) setPendingCount(cnt);
                })
                .catch(() => {});
        };

        updateCount();
        window.addEventListener('welltrash:refresh-offline-queue', updateCount);
        return () => {
            isMounted = false;
            window.removeEventListener('welltrash:refresh-offline-queue', updateCount);
        };
    }, []);
    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={onClose}
                ></div>
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col shadow-xl md:shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-shrink-0 transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="h-20 flex items-center justify-between px-6 border-b border-gray-50">
                        <div className="flex items-center">
                            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500 tracking-tight">Welltrash</span>
                            <span className="ml-2 text-[10px] font-bold text-white bg-green-500 px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">CleanUP</span>
                        </div>
                        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600" aria-label="Close menu">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                
                <nav className="mt-4 px-4 space-y-4 pb-6">
                    <div>
                        <div className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase">Aktivitas Utama</div>
                        <div className="space-y-1">
                            <Link href={route('cleanup.dashboard')} onClick={onClose} className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${active === 'dashboard' ? 'text-green-700 bg-green-50/80 shadow-xs' : 'text-gray-600 hover:bg-gray-50 hover:text-green-600 group'}`}>
                                <span className={active !== 'dashboard' ? 'group-hover:text-green-500 transition-colors' : ''}><CalendarIcon /></span> Jadwal & Tugas
                            </Link>

                            <Link href={route('cleanup.sync')} onClick={onClose} className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${active === 'sync' ? 'text-green-700 bg-green-50/80 shadow-xs' : 'text-gray-600 hover:bg-gray-50 hover:text-green-600 group'}`}>
                                <span className="flex items-center">
                                    <span className={active !== 'sync' ? 'group-hover:text-green-500 transition-colors' : ''}><SyncIcon /></span> Sinkronisasi
                                </span>
                                {pendingCount > 0 && (
                                    <span className="bg-amber-500 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full animate-pulse shadow-xs">
                                        {pendingCount}
                                    </span>
                                )}
                            </Link>

                            <Link href={route('cleanup.kegiatan')} onClick={onClose} className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${active === 'kegiatan' ? 'text-green-700 bg-green-50/80 shadow-xs' : 'text-gray-600 hover:bg-gray-50 hover:text-green-600 group'}`}>
                                <span className={active !== 'kegiatan' ? 'group-hover:text-green-500 transition-colors' : ''}><ActivitiesIcon /></span> Kegiatan
                            </Link>
                            
                            <Link href={route('cleanup.history')} onClick={onClose} className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${active === 'history' ? 'text-green-700 bg-green-50/80 shadow-xs' : 'text-gray-600 hover:bg-gray-50 hover:text-green-600 group'}`}>
                                <span className={active !== 'history' ? 'group-hover:text-green-500 transition-colors' : ''}><HistoryIcon /></span> Riwayat
                            </Link>
                        </div>
                    </div>

                    <div>
                        <div className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase">Kepegawaian</div>
                        <div className="space-y-1">
                            <Link href={route('cleanup.attendance')} onClick={onClose} className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${active === 'attendance' ? 'text-green-700 bg-green-50/80 shadow-xs' : 'text-gray-600 hover:bg-gray-50 hover:text-green-600 group'}`}>
                                <span className={active !== 'attendance' ? 'group-hover:text-green-500 transition-colors' : ''}><AttendanceIcon /></span> Absensi & Gaji
                            </Link>
                        </div>
                    </div>

                    {/* Akses & Sesi Sistem */}
                    <div className="pt-2">
                        <div className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase">Akses & Sesi</div>
                        <div className="space-y-1.5">
                            <PwaInstallButton variant="sidebar" label="Unduh Aplikasi PWA" />
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="group flex items-center w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200/80 hover:border-rose-600 transition-all duration-200 shadow-2xs"
                            >
                                <LogoutIcon /> Keluar Sistem
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>
        </aside>

        {/* Mobile Bottom Navigation Bar - native mobile app experience */}
        <nav
            aria-label="Navigasi Bawah Operator"
            className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] md:hidden pb-[env(safe-area-inset-bottom,0px)]"
        >
            <div className="grid grid-cols-5 h-16 max-w-md mx-auto px-1 items-stretch">
                <Link
                    href={route('cleanup.dashboard')}
                    className={`relative flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                        active === 'dashboard'
                            ? 'text-emerald-600 font-bold'
                            : 'text-slate-400 hover:text-slate-600 font-medium'
                    }`}
                >
                    {active === 'dashboard' && (
                        <span className="absolute top-0 w-8 h-1 bg-emerald-600 rounded-b-full shadow-xs" />
                    )}
                    <div className={`p-1 rounded-xl transition-colors ${active === 'dashboard' ? 'bg-emerald-50' : ''}`}>
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] leading-none tracking-tight">Tugas</span>
                </Link>

                <Link
                    href={route('cleanup.kegiatan')}
                    className={`relative flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                        active === 'kegiatan'
                            ? 'text-emerald-600 font-bold'
                            : 'text-slate-400 hover:text-slate-600 font-medium'
                    }`}
                >
                    {active === 'kegiatan' && (
                        <span className="absolute top-0 w-8 h-1 bg-emerald-600 rounded-b-full shadow-xs" />
                    )}
                    <div className={`p-1 rounded-xl transition-colors ${active === 'kegiatan' ? 'bg-emerald-50' : ''}`}>
                        <ActivitiesIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] leading-none tracking-tight">Kegiatan</span>
                </Link>

                <Link
                    href={route('cleanup.attendance')}
                    className={`relative flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                        active === 'attendance'
                            ? 'text-emerald-600 font-bold'
                            : 'text-slate-400 hover:text-slate-600 font-medium'
                    }`}
                >
                    {active === 'attendance' && (
                        <span className="absolute top-0 w-8 h-1 bg-emerald-600 rounded-b-full shadow-xs" />
                    )}
                    <div className={`p-1 rounded-xl transition-colors ${active === 'attendance' ? 'bg-emerald-50' : ''}`}>
                        <AttendanceIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] leading-none tracking-tight">Absensi</span>
                </Link>

                <Link
                    href={route('cleanup.history')}
                    className={`relative flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                        active === 'history'
                            ? 'text-emerald-600 font-bold'
                            : 'text-slate-400 hover:text-slate-600 font-medium'
                    }`}
                >
                    {active === 'history' && (
                        <span className="absolute top-0 w-8 h-1 bg-emerald-600 rounded-b-full shadow-xs" />
                    )}
                    <div className={`p-1 rounded-xl transition-colors ${active === 'history' ? 'bg-emerald-50' : ''}`}>
                        <HistoryIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] leading-none tracking-tight">Riwayat</span>
                </Link>

                <Link
                    href={route('cleanup.sync')}
                    className={`relative flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                        active === 'sync'
                            ? 'text-emerald-600 font-bold'
                            : 'text-slate-400 hover:text-slate-600 font-medium'
                    }`}
                >
                    {active === 'sync' && (
                        <span className="absolute top-0 w-8 h-1 bg-emerald-600 rounded-b-full shadow-xs" />
                    )}
                    <div className="relative">
                        <div className={`p-1 rounded-xl transition-colors ${active === 'sync' ? 'bg-emerald-50' : ''}`}>
                            <SyncIcon className="w-5 h-5" />
                        </div>
                        {pendingCount > 0 && (
                            <span className="absolute -top-1 -right-1.5 bg-amber-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-xs">
                                {pendingCount > 9 ? '9+' : pendingCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] leading-none tracking-tight">Sinkron</span>
                </Link>
            </div>
        </nav>
        </>
    );
}
