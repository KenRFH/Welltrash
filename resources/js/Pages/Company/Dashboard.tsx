import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import CompanySidebar from '@/Components/CompanySidebar';

const CalendarIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>;

interface Props {
    company: {
        id: number;
        company_name: string;
        subscription_plan: string;
        subscription_status: string;
    };
    auth: {
        user: {
            name: string;
        }
    };
    statistics: {
        total_organic: number;
        total_anorganic: number;
        total_residue: number;
    };
    weekly_statistics: Array<{
        week: string;
        organic: number;
        anorganic: number;
    }>;
}

export default function Dashboard({ auth, company, statistics, weekly_statistics }: Props) {
    const { post, processing } = useForm();
    
    const handleUnsubscribe = () => {
        if (confirm('Apakah Anda yakin ingin membatalkan berlangganan? Anda akan kehilangan akses ke layanan ini dan harus mendaftar ulang jika ingin kembali.')) {
            post(route('company.unsubscribe'));
        }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Dasbor Perusahaan | WellMaggot" />

            {/* Sidebar Component */}
            <CompanySidebar active="dashboard" theme="indigo" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-50 to-blue-50 opacity-50 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>

                {/* Header Navbar */}
                <header className="h-24 flex items-center justify-between px-10 bg-white/60 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Cari data..." 
                                className="w-full sm:w-80 pl-11 pr-4 py-2.5 rounded-2xl border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        <button className="relative text-gray-400 hover:text-indigo-600 transition-colors p-2 rounded-xl hover:bg-indigo-50">
                            <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>

                        <div className="flex items-center space-x-3 cursor-pointer p-1.5 pr-4 rounded-full border border-gray-100 bg-white hover:bg-gray-50 hover:shadow-sm transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-100 flex items-center justify-center p-0.5">
                                <img className="rounded-full w-full h-full object-cover" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=ffffff&color=4f46e5&bold=true`} alt="User avatar" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-800 leading-none mb-1">{auth.user.name}</span>
                                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider leading-none">{company.company_name}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Body */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 sm:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative z-10">
                        
                        {/* Welcome Card */}
                        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(79,70,229,0.2)] text-white relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            {/* Abstract shapes */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-10 -mt-20"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400 opacity-20 rounded-full blur-2xl -ml-10 -mb-10"></div>
                            
                            <div className="relative z-10 mb-6 sm:mb-0">
                                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Halo Mitra! 👋</h2>
                                <p className="text-indigo-100 text-sm sm:text-base font-medium mb-4">Selamat datang kembali di dasbor WellMaggot.</p>
                                
                                {company.subscription_status === 'cancellation_requested' && (
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-yellow-400/20 text-yellow-100 border border-yellow-400/30">
                                        Menunggu Proses Pembatalan Layanan
                                    </span>
                                )}
                            </div>
                            
                            <div className="relative z-10 flex flex-col sm:flex-row gap-3">
                                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-2xl text-sm font-semibold transition-all flex items-center shadow-sm">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                    Unduh Laporan
                                </button>

                                {company.subscription_status === 'active' && (
                                    <button 
                                        onClick={handleUnsubscribe}
                                        disabled={processing}
                                        className="px-6 py-3 bg-red-500/80 hover:bg-red-600 backdrop-blur-sm border border-red-500 text-white rounded-2xl text-sm font-semibold transition-all flex items-center shadow-sm group disabled:opacity-50"
                                    >
                                        <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                                        Batalkan Layanan
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Date Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col justify-center relative overflow-hidden group hover:border-indigo-100 transition-colors">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <CalendarIcon />
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Hari Ini</p>
                            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                                {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative z-10">
                         {/* Organic Card */}
                         <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-amber-100/50 flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-amber-100 transition-colors"></div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-2xl shadow-inner border border-amber-100 relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-transform">
                                    🍞
                                </div>
                            </div>
                            
                            <div className="relative z-10">
                                <p className="text-sm font-bold text-gray-500 mb-1">Total Organik</p>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-3xl sm:text-4xl font-black text-gray-900">{Number(statistics.total_organic).toLocaleString('id-ID')}</span>
                                    <span className="text-lg font-bold text-amber-500">Kg</span>
                                </div>
                            </div>
                        </div>

                        {/* Anorganic Card */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-teal-100/50 flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-teal-100 transition-colors"></div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-2xl shadow-inner border border-teal-100 relative z-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform">
                                    🛍️
                                </div>
                            </div>

                            <div className="relative z-10">
                                <p className="text-sm font-bold text-gray-500 mb-1">Total Anorganik</p>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-3xl sm:text-4xl font-black text-gray-900">{Number(statistics.total_anorganic).toLocaleString('id-ID')}</span>
                                    <span className="text-lg font-bold text-teal-500">Kg</span>
                                </div>
                            </div>
                        </div>

                        {/* Residue Card */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-200/50 flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-gray-100 transition-colors"></div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl shadow-inner border border-gray-200 relative z-10 group-hover:scale-110 transition-transform">
                                    🗑️
                                </div>
                            </div>

                            <div className="relative z-10">
                                <p className="text-sm font-bold text-gray-500 mb-1">Total Residu</p>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-3xl sm:text-4xl font-black text-gray-900">{Number(statistics.total_residue).toLocaleString('id-ID')}</span>
                                    <span className="text-lg font-bold text-gray-400">Kg</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart Container Placeholder */}
                    <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 mb-12 relative z-10">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Statistik Pengumpulan Mingguan</h3>
                                <p className="text-sm text-gray-500 mt-1">Bulan {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                            </div>
                            <Link href={route('company.history')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-xl transition-colors">
                                Lihat Detail
                            </Link>
                        </div>

                        {/* Real Bar Chart rendering */}
                        <div className="relative h-64 border-l border-b border-gray-200 ml-4 pb-4 w-full flex items-end">
                            {/* Grid lines */}
                            <div className="absolute inset-y-0 left-0 w-full flex flex-col justify-between pointer-events-none">
                                <div className="border-t border-gray-100 w-full"></div>
                                <div className="border-t border-gray-100 w-full"></div>
                                <div className="border-t border-gray-100 w-full"></div>
                                <div className="border-t border-gray-100 w-full"></div>
                            </div>

                            <div className="absolute inset-0 flex justify-around px-4 sm:px-12 items-end bottom-0 pb-0 z-10 w-full">
                                {(() => {
                                    // Calculate maximum value for normalization to set bar heights correctly
                                    const rawMax = Math.max(
                                        ...weekly_statistics.flatMap(w => [Number(w.organic), Number(w.anorganic)])
                                    );
                                    // Ensure division by zero doesn't happen, set a min max of 100
                                    const maxVal = Math.max(rawMax, 100);

                                    return weekly_statistics.map((stat, index) => {
                                        // Calculate percentage height, capped at 100% just in case
                                        let hOrg = (Number(stat.organic) / maxVal) * 100;
                                        let hAno = (Number(stat.anorganic) / maxVal) * 100;

                                        // Ensure minimum height of 4% so bars are slightly visible even for 0 values to show the baseline exist
                                        hOrg = Math.max(hOrg, 4);
                                        hAno = Math.max(hAno, 4);

                                        return (
                                            <div key={index} className="flex flex-col items-center group relative">
                                                {/* Tooltip visible on group hover */}
                                                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded-lg py-1.5 px-3 whitespace-nowrap z-20 pointer-events-none shadow-lg">
                                                    Org: {stat.organic}kg | Ano: {stat.anorganic}kg
                                                </div>

                                                <div className="flex items-end space-x-1.5 h-64">
                                                    {/* Organic Bar */}
                                                    <div 
                                                        className="w-6 sm:w-12 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-md group-hover:opacity-90 transition-all duration-500 ease-out flex items-end justify-center pb-2"
                                                        style={{ height: `${hOrg}%` }}
                                                        title={`Organik: ${stat.organic} Kg`}
                                                    >
                                                        {hOrg > 15 && <span className="text-[10px] font-bold text-amber-700/80 -rotate-90 origin-bottom">{stat.organic > 0 ? stat.organic : ''}</span>}
                                                    </div>
                                                    
                                                    {/* Anorganic Bar */}
                                                    <div 
                                                        className="w-6 sm:w-12 bg-gradient-to-t from-teal-200 to-teal-100 rounded-t-md group-hover:opacity-90 transition-all duration-500 ease-out flex items-end justify-center pb-2"
                                                        style={{ height: `${hAno}%` }}
                                                        title={`Anorganik: ${stat.anorganic} Kg`}
                                                    >
                                                        {hAno > 15 && <span className="text-[10px] font-bold text-teal-700/80 -rotate-90 origin-bottom">{stat.anorganic > 0 ? stat.anorganic : ''}</span>}
                                                    </div>
                                                </div>
                                                <span className="text-gray-500 font-semibold text-xs sm:text-sm mt-4 block absolute -bottom-8 whitespace-nowrap">{stat.week}</span>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                        <div className="mt-12 flex justify-center space-x-6 text-sm font-medium text-gray-600">
                             <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-amber-200 mr-2"></span> Organik (Kg)</div>
                             <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-teal-200 mr-2"></span> Anorganik (Kg)</div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}
