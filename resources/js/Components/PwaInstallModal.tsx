import React from 'react';
import Welltrash_logo from '../assets/img/logowelltrash.webp';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    isIos: boolean;
}

export default function PwaInstallModal({ isOpen, onClose, isIos }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute top-0 right-0 w-36 h-36 bg-green-100 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none opacity-60" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
                    aria-label="Tutup"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex items-center gap-3 mb-4">
                    <img src={Welltrash_logo} alt="WellTrash" className="w-12 h-12 object-contain" />
                    <div>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-extrabold uppercase">
                            PWA App
                        </span>
                        <h3 className="text-lg font-black text-gray-900">WellTrash</h3>
                    </div>
                </div>

                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                    Pasang aplikasi WellTrash di layar utama perangkat Anda untuk akses instan dan lebih cepat.
                </p>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-4">
                    <p className="text-xs font-bold text-gray-700 mb-2">
                        {isIos ? 'Cara Pasang di iOS (Safari):' : 'Cara Pasang di Browser:'}
                    </p>

                    {isIos ? (
                        <ol className="space-y-2 text-xs text-gray-600 list-decimal list-inside">
                            <li>Tekan tombol <strong>Bagikan (Share)</strong> di menu bawah Safari.</li>
                            <li>Pilih menu <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>.</li>
                            <li>Tekan <strong>"Tambah"</strong> di pojok kanan atas.</li>
                        </ol>
                    ) : (
                        <ol className="space-y-2 text-xs text-gray-600 list-decimal list-inside">
                            <li>Buka menu browser (ikon titik tiga ⋮ atau tombol install di address bar).</li>
                            <li>Pilih <strong>"Install WellTrash"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.</li>
                            <li>Konfirmasi pemasangan aplikasi.</li>
                        </ol>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm"
                >
                    Saya Mengerti
                </button>
            </div>
        </div>
    );
}
