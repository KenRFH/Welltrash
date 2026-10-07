import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { initPwa, usePwa } from '../utils/pwa';
import PwaInstallModal from './PwaInstallModal';
import Welltrash_logo from '../assets/img/logowelltrash.webp';

interface Props {
    initialAuth?: {
        user?: {
            id: number;
            name: string;
            role?: string;
        } | null;
    };
}

export default function PwaGlobalManager({ initialAuth }: Props) {
    const [user, setUser] = useState(() => initialAuth?.user || null);
    const [isDismissed, setIsDismissed] = useState(() => {
        if (typeof window === 'undefined') return false;
        try {
            return sessionStorage.getItem('welltrash_pwa_dismissed') === 'true';
        } catch {
            return false;
        }
    });
    const { isInstalled, install, showInstructionsModal, setShowInstructionsModal, isIos } = usePwa();

    useEffect(() => {
        // Initialize Service Worker and PWA prompt listeners
        initPwa();

        // Listen for Inertia navigation to keep track of logged in user state
        const removeListener = router.on('success', (event) => {
            const pageProps = event.detail.page.props as any;
            if (pageProps?.auth?.user) {
                setUser(pageProps.auth.user);
            } else if (pageProps?.auth && !pageProps.auth.user) {
                setUser(null);
            }
        });

        return () => {
            removeListener();
        };
    }, []);

    const handleDismiss = () => {
        setIsDismissed(true);
        try {
            sessionStorage.setItem('welltrash_pwa_dismissed', 'true');
        } catch {}
    };

    const isCleanupPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/cleanup');

    // Only display prompt if the user is logged into the system, app is not standalone, and not dismissed
    if (!user || isInstalled || isDismissed) {
        return (
            <PwaInstallModal
                isOpen={showInstructionsModal}
                onClose={() => setShowInstructionsModal(false)}
                isIos={isIos}
            />
        );
    }

    return (
        <>
            <aside 
                aria-label="Unduh Aplikasi WellTrash"
                className={`fixed z-40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 duration-300 ${
                    isCleanupPage ? 'bottom-24 right-4 sm:right-6' : 'bottom-6 right-4 sm:right-6'
                }`}
            >
                <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md border border-emerald-200/90 rounded-full pl-2 pr-1.5 py-1.5 shadow-lg shadow-emerald-950/10 hover:shadow-xl transition-all">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </div>

                    <div className="pr-1">
                        <p className="text-xs font-bold text-gray-800 leading-none">
                            <span className="hidden sm:inline">Pasang Aplikasi WellTrash</span>
                            <span className="sm:hidden">App WellTrash</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            type="button"
                            onClick={install}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/30 active:scale-95 transition-all"
                            title="Unduh & Pasang Aplikasi"
                        >
                            <span>Unduh</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleDismiss}
                            className="w-6 h-6 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
                            aria-label="Tutup notifikasi unduh"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>

            <PwaInstallModal
                isOpen={showInstructionsModal}
                onClose={() => setShowInstructionsModal(false)}
                isIos={isIos}
            />
        </>
    );
}
