import { Link } from '@inertiajs/react';
import React from 'react';
import Welltrash_logo from '../../../public/build/assets/logowelltrash.png'

const HomeIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>;
const KegiatanIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const KatalogIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const NewsIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15M9 11l3 3m0 0l3-3m-3 3V8" /></svg>;

interface Props {
    active: 'dashboard' | 'activities' | 'katalogs' | 'news';
    isMobileOpen?: boolean;
    onClose?: () => void;
}

export default function WebAdminSidebar({ active, isMobileOpen = false, onClose }: Props) {
    // Standard Green Theme configurations
    const t = {
        title: 'from-green-600 to-emerald-500',
        activeText: 'text-green-700',
        activeBg: 'bg-green-50/80',
        hoverText: 'hover:text-green-600',
        groupHoverText: 'group-hover:text-green-500',
        logoutHoverBg: 'hover:bg-red-50 hover:border-red-100',
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={onClose}
                ></div>
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col justify-between shadow-xl md:shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-shrink-0 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div>
                    <div className="h-24 flex items-center justify-between px-8 border-b border-gray-50 mt-10">
                        <img src={Welltrash_logo} alt="Welltrash Logo" className="h-30 w-auto" />
                        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                
                <nav className="mt-8 px-4 space-y-2">
                    <div className="px-4 mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">Web Admin Menu</div>
                    
                    <Link href={route('webadmin.dashboard')} className={`flex items-center px-4 py-3 rounded-2xl transition-all ${active === 'dashboard' ? `${t.activeText} ${t.activeBg} font-semibold shadow-sm` : `text-gray-500 hover:bg-gray-50 ${t.hoverText} font-medium group`}`}>
                        <span className={active !== 'dashboard' ? t.groupHoverText : ''}><HomeIcon /></span> Beranda
                    </Link>
                    
                    <Link href={route('webadmin.activities.index')} className={`flex items-center px-4 py-3 rounded-2xl transition-all ${active === 'activities' ? `${t.activeText} ${t.activeBg} font-semibold shadow-sm` : `text-gray-500 hover:bg-gray-50 ${t.hoverText} font-medium group`}`}>
                        <span className={active !== 'activities' ? t.groupHoverText : ''}><KegiatanIcon /></span> Aktivitas Publik
                    </Link>

                    <Link href={route('webadmin.katalogs.index')} className={`flex items-center px-4 py-3 rounded-2xl transition-all ${active === 'katalogs' ? `${t.activeText} ${t.activeBg} font-semibold shadow-sm` : `text-gray-500 hover:bg-gray-50 ${t.hoverText} font-medium group`}`}>
                        <span className={active !== 'katalogs' ? t.groupHoverText : ''}><KatalogIcon /></span> Katalog
                    </Link>

                    <Link href={route('webadmin.news.index')} className={`flex items-center px-4 py-3 rounded-2xl transition-all ${active === 'news' ? `${t.activeText} ${t.activeBg} font-semibold shadow-sm` : `text-gray-500 hover:bg-gray-50 ${t.hoverText} font-medium group`}`}>
                        <span className={active !== 'news' ? t.groupHoverText : ''}><NewsIcon /></span> Berita / Blog
                    </Link>
                </nav>
            </div>

            <div className="p-6 mb-2 border-t border-gray-50">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className={`flex items-center justify-center w-full px-4 py-3 text-gray-600 border border-gray-200 hover:text-red-600 rounded-2xl font-semibold transition-all shadow-sm group ${t.logoutHoverBg}`}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Keluar
                </Link>
            </div>
        </aside>
        </>
    );
}
