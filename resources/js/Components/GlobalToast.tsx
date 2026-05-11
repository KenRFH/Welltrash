import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

export default function GlobalToast({ initialFlash }: { initialFlash?: { success?: string, error?: string } }) {
    const [toast, setToast] = useState<{ type: 'success' | 'error', message: string, id: number } | null>(null);

    useEffect(() => {
        // Initial check on mount
        if (initialFlash?.success) {
            setToast({ type: 'success', message: initialFlash.success, id: Date.now() });
        } else if (initialFlash?.error) {
            setToast({ type: 'error', message: initialFlash.error, id: Date.now() });
        }

        // Listen for Inertia navigations
        const removeListener = router.on('success', (event) => {
            const props = event.detail.page.props as any;
            if (props.flash?.success) {
                setToast({ type: 'success', message: props.flash.success, id: Date.now() });
            } else if (props.flash?.error) {
                setToast({ type: 'error', message: props.flash.error, id: Date.now() });
            }
        });

        // Listen for custom client-side toast events
        const handleCustomToast = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail?.type === 'success' || customEvent.detail?.type === 'error') {
                setToast({ type: customEvent.detail.type, message: customEvent.detail.message, id: Date.now() });
            }
        };
        window.addEventListener('toast', handleCustomToast);

        return () => {
            removeListener();
            window.removeEventListener('toast', handleCustomToast);
        };
    }, [initialFlash]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                setToast(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    if (!toast) return null;

    return (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] animate-[slideDown_0.3s_ease-out_forwards]">
            <div className={`px-6 py-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex items-center gap-3 border ${toast.type === 'success' ? 'bg-white border-green-200' : 'bg-white border-red-200'}`}>
                {toast.type === 'success' ? (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                ) : (
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                )}
                <p className="text-gray-800 font-bold text-sm tracking-tight">{toast.message}</p>
                <button onClick={() => setToast(null)} className="ml-4 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}} />
        </div>
    );
}
