import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import WebAdminSidebar from '@/Components/WebAdminSidebar';

interface Props {
    auth: {
        user: {
            name: string;
        }
    };
    activitiesCount: number;
    katalogCount: number;
    newsCount: number;
}

export default function Dashboard({ auth, activitiesCount, katalogCount, newsCount }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Dasbor Web Admin | Welltrash" />

            <WebAdminSidebar 
                active="dashboard" 
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-24 flex items-center justify-between px-6 sm:px-10 bg-white/60 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex items-center gap-4 flex-1">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-500 hover:text-green-600 md:hidden focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">Dasbor Web Admin</h1>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-1.5 pr-4 rounded-full border border-gray-100 bg-white shadow-sm">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-100 to-emerald-100 flex items-center justify-center p-0.5">
                            <img className="rounded-full w-full h-full object-cover" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=ffffff&color=4f46e5&bold=true`} alt="User avatar" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800 leading-none mb-1">{auth.user.name}</span>
                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider leading-none">Web Admin</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 sm:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        
                        <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-green-100 transition-colors pointer-events-none"></div>
                            
                            <h3 className="text-gray-500 font-bold mb-2">Total Aktivitas Publik</h3>
                            <div className="flex items-end space-x-2">
                                <span className="text-5xl font-black text-gray-900">{activitiesCount}</span>
                                <span className="text-lg font-bold text-green-500 mb-1">Postingan</span>
                            </div>
                            
                            <Link href={route('webadmin.activities.index')} className="mt-8 text-sm font-bold text-green-600 hover:text-green-700 flex items-center group-hover:translate-x-1 transition-transform">
                                Kelola Aktivitas <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </Link>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-100 transition-colors pointer-events-none"></div>
                            
                            <h3 className="text-gray-500 font-bold mb-2">Total Katalog</h3>
                            <div className="flex items-end space-x-2">
                                <span className="text-5xl font-black text-gray-900">{katalogCount}</span>
                                <span className="text-lg font-bold text-blue-500 mb-1">Item</span>
                            </div>
                            
                            <Link href={route('webadmin.katalogs.index')} className="mt-8 text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center group-hover:translate-x-1 transition-transform">
                                Kelola Katalog <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </Link>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-100 transition-colors pointer-events-none"></div>
                            
                            <h3 className="text-gray-500 font-bold mb-2">Total Berita / Blog</h3>
                            <div className="flex items-end space-x-2">
                                <span className="text-5xl font-black text-gray-900">{newsCount}</span>
                                <span className="text-lg font-bold text-purple-500 mb-1">Artikel</span>
                            </div>
                            
                            <Link href={route('webadmin.news.index')} className="mt-8 text-sm font-bold text-purple-600 hover:text-purple-700 flex items-center group-hover:translate-x-1 transition-transform">
                                Kelola Berita <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </Link>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
