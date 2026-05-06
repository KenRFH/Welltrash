import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminSidebar from '@/Components/AdminSidebar';

interface Props {
    children: React.ReactNode;
    title: string;
    activeTab: 'dashboard' | 'companies' | 'pending' | 'cancellations' | 'drivers';
    subtitle?: string;
    headerAction?: React.ReactNode;
}

export default function AdminLayout({ children, title, activeTab, subtitle, headerAction }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-sans selection:bg-orange-100 selection:text-orange-900">
            <Head title={`${title} | WellTrash Admin`} />
            
            {/* Sidebar Component */}
            <AdminSidebar 
                active={activeTab} 
                isMobileOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Background Blobs for Aesthetic */}
                <div className="fixed top-0 right-0 w-[600px] h-[400px] bg-gradient-to-br from-orange-50 to-amber-50 opacity-60 rounded-full blur-3xl -mr-48 -mt-24 pointer-events-none z-0" />
                <div className="fixed bottom-0 left-0 w-[400px] h-[300px] bg-gradient-to-tr from-blue-50 to-indigo-50 opacity-40 rounded-full blur-3xl -ml-24 -mb-12 pointer-events-none z-0" />

                {/* Header */}
                <header className={`h-20 flex items-center justify-between px-4 sm:px-10 sticky top-0 z-30 transition-all duration-300 ${
                    isScrolled ? 'bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm' : 'bg-transparent'
                }`}>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(true)} 
                            className="p-2.5 -ml-2.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl md:hidden focus:outline-none transition-all active:scale-95"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight transition-all">{title}</h1>
                            {subtitle && <p className="hidden sm:block text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">{subtitle}</p>}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {headerAction}
                        <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="text-right">
                                <p className="text-xs font-bold text-gray-900">Admin WellTrash</p>
                                <p className="text-[10px] text-gray-400 font-medium">Administrator</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 flex items-center justify-center text-orange-700 font-black shadow-sm">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 relative z-10 p-4 sm:p-10 pt-4 sm:pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </main>
                
                {/* Footer / Copyright for responsiveness check */}
                <footer className="p-6 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest border-t border-gray-50 bg-white/30 backdrop-blur-sm relative z-10">
                    &copy; {new Date().getFullYear()} WellTrash Platform &bull; Made with Excellence
                </footer>
            </div>
        </div>
    );
}
