import { useState, useEffect } from 'react';

// Type definitions for PWA BeforeInstallPromptEvent
export interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

// Global state holding the install prompt
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
    listeners.forEach((listener) => listener());
}

/**
 * Check if the application is currently running as a standalone PWA
 */
export function isRunningStandalone(): boolean {
    if (typeof window === 'undefined') return false;
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://')
    );
}

/**
 * Check if current device is iOS (Safari doesn't support beforeinstallprompt)
 */
export function isIosDevice(): boolean {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent;
    const isIos = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isIpadOs = navigator.maxTouchPoints > 1 && /Macintosh/.test(ua);
    return isIos || isIpadOs;
}

/**
 * Initialize Service Worker registration and PWA install prompt listeners
 */
export function initPwa() {
    if (typeof window === 'undefined') return;

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        const registerSw = () => {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('[WellTrash PWA] Service Worker registered with scope:', registration.scope);
                })
                .catch((error) => {
                    console.warn('[WellTrash PWA] Service Worker registration failed:', error);
                });
        };

        if (document.readyState === 'complete') {
            registerSw();
        } else {
            window.addEventListener('load', registerSw);
        }
    }

    // Capture beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        globalDeferredPrompt = e as BeforeInstallPromptEvent;
        console.log('[WellTrash PWA] beforeinstallprompt event captured');
        notifyListeners();
    });

    // Capture appinstalled
    window.addEventListener('appinstalled', () => {
        globalDeferredPrompt = null;
        console.log('[WellTrash PWA] Application was successfully installed');
        notifyListeners();
    });
}

/**
 * Trigger installation prompt or return false if manual instructions needed
 */
export async function triggerPwaInstall(): Promise<'accepted' | 'dismissed' | 'manual'> {
    if (globalDeferredPrompt) {
        try {
            await globalDeferredPrompt.prompt();
            const choice = await globalDeferredPrompt.userChoice;
            if (choice.outcome === 'accepted') {
                globalDeferredPrompt = null;
                notifyListeners();
                return 'accepted';
            }
            return 'dismissed';
        } catch (err) {
            console.error('[WellTrash PWA] Install prompt error:', err);
            return 'manual';
        }
    }
    return 'manual';
}

/**
 * React Hook for consuming PWA capabilities in any component
 */
export function usePwa() {
    const [isStandalone, setIsStandalone] = useState<boolean>(() => isRunningStandalone());
    const [hasPrompt, setHasPrompt] = useState<boolean>(() => globalDeferredPrompt !== null);
    const [isIos, setIsIos] = useState<boolean>(() => isIosDevice());
    const [showInstructionsModal, setShowInstructionsModal] = useState<boolean>(false);

    useEffect(() => {
        const updateState = () => {
            setIsStandalone(isRunningStandalone());
            setHasPrompt(globalDeferredPrompt !== null);
            setIsIos(isIosDevice());
        };

        updateState();
        listeners.add(updateState);

        return () => {
            listeners.delete(updateState);
        };
    }, []);

    const install = async () => {
        if (isStandalone) {
            // Already installed
            return;
        }

        if (globalDeferredPrompt) {
            const result = await triggerPwaInstall();
            if (result === 'manual') {
                setShowInstructionsModal(true);
            }
        } else {
            // On iOS or browsers without native prompt
            setShowInstructionsModal(true);
        }
    };

    return {
        isInstalled: isStandalone,
        canInstall: !isStandalone,
        hasNativePrompt: hasPrompt,
        isIos,
        install,
        showInstructionsModal,
        setShowInstructionsModal,
    };
}
