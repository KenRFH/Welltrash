import React from 'react';
import { usePwa } from '../utils/pwa';
import PwaInstallModal from './PwaInstallModal';

interface Props {
    variant?: 'sidebar' | 'header' | 'floating' | 'custom';
    className?: string;
    label?: string;
    showIfInstalled?: boolean;
}

export default function PwaInstallButton({
    variant = 'sidebar',
    className = '',
    label,
    showIfInstalled = false,
}: Props) {
    const { isInstalled, install, showInstructionsModal, setShowInstructionsModal, isIos } = usePwa();

    if (isInstalled && !showIfInstalled) {
        return null;
    }

    const defaultLabel = isInstalled ? 'Terpasang' : (label || 'Unduh Aplikasi');

    const downloadIcon = (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    );

    const checkIcon = (
        <svg className="w-4 h-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
        </svg>
    );

    let buttonClass = className;

    if (!className) {
        if (variant === 'sidebar') {
            buttonClass = `flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all duration-150 border shadow-sm ${
                isInstalled
                    ? 'bg-gray-50 text-gray-500 border-gray-200/70 cursor-default'
                    : 'bg-emerald-50 hover:bg-emerald-100/90 text-emerald-800 border-emerald-200/80 hover:border-emerald-300 active:scale-[0.98]'
            }`;
        } else if (variant === 'header') {
            buttonClass = `inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full font-semibold text-xs transition-all duration-150 border shadow-sm ${
                isInstalled
                    ? 'bg-gray-50 text-gray-500 border-gray-200/70 cursor-default'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 border-emerald-200/80 active:scale-95'
            }`;
        } else if (variant === 'floating') {
            buttonClass = 'inline-flex items-center gap-2 px-3.5 py-2 rounded-full font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition-all';
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={install}
                className={buttonClass}
                title={isInstalled ? 'Aplikasi WellTrash sudah terpasang' : 'Unduh & Pasang Aplikasi WellTrash'}
            >
                <span className="inline-flex items-center justify-center">
                    {isInstalled ? checkIcon : downloadIcon}
                </span>
                <span>{defaultLabel}</span>
            </button>

            <PwaInstallModal
                isOpen={showInstructionsModal}
                onClose={() => setShowInstructionsModal(false)}
                isIos={isIos}
            />
        </>
    );
}
