import { Head, useForm, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import CompanySidebar from '@/Components/CompanySidebar';

export default function Register({ auth }: any) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        company_name: '',
        pic_name: auth?.user?.name || '',
        address: '',
        phone: '',
        business_category: '', // NEW Field
        subscription_plan: 'Reguler',
        pickup_schedule: [] as string[],
        signed_mou: null as File | null,
    });

    const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const predefinedCategories = ['Hotel', 'Restoran', 'Cafe', 'SPPG', 'Gudang'];
    const [isCustomCategory, setIsCustomCategory] = React.useState(false);



    const packagesData = [
        {
            id: 'Rumah Tangga (< 10km)',
            name: 'Paket Rumah Tangga (< 10km)',
            price: 'Rp 750.000',
            period: '/bulan',
            maxDays: 4,
            desc: 'Penjemputan sampah harian untuk area dengan radius kurang dari 10km.',
            features: ['Max 1m³ (4 trashbag) / sekali angkut', 'Pilih maks. 4 hari (Senin–Sabtu)', 'Tanpa Akses Dashboard'],
            isPopular: false,
        },
        {
            id: 'Rumah Tangga (> 10km)',
            name: 'Paket Rumah Tangga (> 10km)',
            price: 'Rp 1.000.000',
            period: '/bulan',
            maxDays: 4,
            desc: 'Penjemputan sampah harian untuk area dengan radius lebih dari 10km.',
            features: ['Max 1m³ (4 trashbag) / sekali angkut', 'Pilih maks. 4 hari (Senin–Sabtu)', 'Akses Penuh Dashboard'],
            isPopular: false,
        },
        {
            id: 'Reguler',
            name: 'Paket Reguler',
            price: 'Rp 2.500.000',
            period: '/bulan',
            maxDays: 4,
            desc: 'Solusi pengolahan limbah untuk bisnis menengah dengan jadwal pengambilan teratur.',
            features: ['Maks 4m³ / sekali angkut', 'Pilih maks. 4 hari (Senin–Sabtu)', 'Akses Penuh Dashboard'],
            isPopular: false,
        },
        {
            id: 'Prime',
            name: 'Paket Prime (Bisnis)',
            price: 'Rp 3.200.000',
            period: '/bulan',
            maxDays: 6,
            desc: 'Layanan pengolahan sampah prioritas dengan standar kebersihan tinggi.',
            features: ['Maks 4m³ / sekali angkut', 'Pilih hingga 6 hari (Senin–Sabtu)', 'Akses Penuh Dashboard'],
            isPopular: true,
        },
        {
            id: 'Premium+',
            name: 'Paket Premium+',
            price: 'Rp 4.499.000',
            period: '/bulan',
            maxDays: 6,
            desc: 'Solusi limbah industri skala besar dengan sistem pelaporan audit mendalam.',
            features: ['Tanpa perlu pilah sampah', 'Pilih hingga 6 hari (Senin–Sabtu)', 'Akses Penuh Dashboard'],
            isPopular: false,
        }
    ];

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === 'Lainnya') {
            setIsCustomCategory(true);
            setData('business_category', '');
        } else {
            setIsCustomCategory(false);
            setData('business_category', val);
        }
    };

    const getMaxDays = (plan: string) => {
        if (plan === 'Rumah Tangga (< 10km)' || plan === 'Rumah Tangga (> 10km)' || plan === 'Reguler') return 4;
        if (plan === 'Prime' || plan === 'Premium+') return 6;
        return 0;
    };

    const handleDayToggle = (day: string) => {
        const maxDays = getMaxDays(data.subscription_plan);
        if (data.pickup_schedule.includes(day)) {
            setData('pickup_schedule', data.pickup_schedule.filter(d => d !== day));
        } else {
            if (maxDays > 0 && data.pickup_schedule.length >= maxDays) {
                window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message: `Paket ${data.subscription_plan} maksimal hanya dapat memilih ${maxDays} hari penjemputan.` } }));
                return;
            }
            setData('pickup_schedule', [...data.pickup_schedule, day]);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('company.store'));
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Pendaftaran Mitra" />

            {/* Sidebar Component (Locked) */}
            <CompanySidebar 
                active="mitra" 
                isLocked={true} 
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                
                {/* Top Navbar */}
                <header className="h-20 flex items-center justify-between px-6 sm:px-10 bg-white/60 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                    {/* Mobile Menu Toggle & Search Bar */}
                    <div className="flex items-center gap-4 flex-1 max-w-md">
                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-500 hover:text-teal-600 md:hidden focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <div className="relative hidden sm:block w-full">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-300">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border-0 bg-white/80 rounded-lg text-sm placeholder-gray-400 focus:ring-0 shadow-sm"
                                placeholder="Cari"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">

                        
                        {/* User Profile */}
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth?.user?.name || 'User')}&background=e0e7ff&color=4f46e5`} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div className="hidden md:flex flex-col">
                                <span className="text-sm font-bold text-gray-800 leading-none">{auth?.user?.name || 'User'}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{data.company_name || 'PT. SPPG'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Body */}
                <main className="flex-1 overflow-y-auto p-6 sm:p-10 relative z-10">
                    
                    {/* Form Card */}
                    <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-8 max-w-4xl">
                        
                        <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">
                            
                            {/* Nama Perusahaan */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nama Perusahaan</label>
                                <input
                                    type="text"
                                    value={data.company_name}
                                    onChange={e => setData('company_name', e.target.value)}
                                    placeholder="Nama Perusahaan"
                                    className="w-full bg-gray-50 border-0 rounded-lg py-3 px-4 text-sm text-gray-700 focus:ring-2 focus:ring-teal-500 transition-colors"
                                    required
                                />
                                {errors.company_name && <p className="text-xs text-red-500 mt-1">{errors.company_name}</p>}
                            </div>

                            {/* Nama PIC */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nama PIC / Penanggung Jawab</label>
                                <input
                                    type="text"
                                    value={data.pic_name}
                                    onChange={e => setData('pic_name', e.target.value)}
                                    placeholder="Nama Penanggung Jawab"
                                    className="w-full bg-gray-50 border-0 rounded-lg py-3 px-4 text-sm text-gray-700 focus:ring-2 focus:ring-teal-500 transition-colors"
                                    required
                                />
                                {errors.pic_name && <p className="text-xs text-red-500 mt-1">{errors.pic_name}</p>}
                            </div>

                            {/* Alamat Perusahaan */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Alamat Perusahaan</label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    placeholder="Alamat Perusahaan"
                                    className="w-full bg-gray-50 border-0 rounded-lg py-3 px-4 text-sm text-gray-700 focus:ring-2 focus:ring-teal-500 transition-colors"
                                    required
                                />
                                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                            </div>

                            {/* Nomer WA PIC */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nomer WA PIC</label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    placeholder="Nomer WA PIC"
                                    className="w-full bg-gray-50 border-0 rounded-lg py-3 px-4 text-sm text-gray-700 focus:ring-2 focus:ring-teal-500 transition-colors"
                                    required
                                />
                                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                            </div>

                            {/* Email PIC */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Email PIC</label>
                                <input
                                    type="email"
                                    defaultValue={auth?.user?.email || ''}
                                    placeholder="Email PIC"
                                    className="w-full bg-gray-50 border-0 rounded-lg py-3 px-4 text-sm text-gray-700 focus:ring-2 focus:ring-teal-500 transition-colors"
                                    disabled
                                />
                            </div>

                            {/* Pilih Paket Langganan */}
                            <div className="pt-2 pb-4">
                                <label className="block text-sm font-bold text-gray-700 mb-4">Pilih Paket Langganan</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {packagesData.map((pkg) => {
                                        const isSelected = data.subscription_plan === pkg.id;
                                        
                                        // Different styling logic based on popularity or selection
                                        let cardStyles = '';
                                        let titleStyles = '';
                                        let btnStyles = '';
                                        
                                        if (pkg.isPopular) {
                                            cardStyles = isSelected 
                                                ? 'bg-[#0f172a] ring-4 ring-teal-50 border border-[#0f172a] transform scale-[1.02]' 
                                                : 'bg-[#0f172a] border border-[#0f172a] opacity-90 transform scale-[0.98] hover:opacity-100 hover:scale-[1.02]';
                                            titleStyles = 'text-white';
                                            btnStyles = isSelected 
                                                ? 'bg-[#22c55e] text-white shadow-lg shadow-green-500/20' 
                                                : 'bg-[#22c55e]/30 text-green-400 hover:bg-[#22c55e]/40';
                                        } else {
                                            cardStyles = isSelected 
                                                ? 'border-teal-500 ring-4 ring-teal-50 bg-white' 
                                                : 'border-gray-200 bg-white hover:border-teal-300';
                                            titleStyles = 'text-gray-900';
                                            btnStyles = isSelected 
                                                ? 'bg-teal-50 text-teal-700 border border-teal-200' 
                                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50';
                                        }

                                        return (
                                            <div 
                                                key={pkg.id}
                                                onClick={() => {
                                                    setData((prevData) => {
                                                        const maxDays = pkg.maxDays ?? 0;
                                                        let newSchedule = prevData.pickup_schedule;
                                                        if (maxDays > 0 && newSchedule.length > maxDays) {
                                                            newSchedule = newSchedule.slice(0, maxDays);
                                                        }
                                                        return { ...prevData, subscription_plan: pkg.id, pickup_schedule: newSchedule };
                                                    });
                                                }}
                                                className={`relative rounded-2xl p-6 cursor-pointer transition-all flex flex-col h-full border ${cardStyles}`}
                                            >
                                                {pkg.isPopular && (
                                                    <div className="absolute -top-3 left-6 bg-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                        TERPOPULER
                                                    </div>
                                                )}
                                                
                                                <h3 className={`text-xl font-bold mb-2 ${pkg.isPopular ? 'mt-2' : ''} ${titleStyles}`}>
                                                    {pkg.name}
                                                </h3>
                                                <p className={`text-sm mb-6 min-h-[40px] ${pkg.isPopular ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {pkg.desc}
                                                </p>
                                                
                                                <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline">
                                                    <span className={`text-2xl font-black ${titleStyles}`}>{pkg.price}</span>
                                                    <span className={`text-sm font-medium sm:ml-1 ${pkg.isPopular ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {pkg.period}
                                                    </span>
                                                </div>
                                                
                                                <ul className={`space-y-3 text-sm mb-8 flex-1 ${pkg.isPopular ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {pkg.features.map((feature, i) => (
                                                        <li key={i} className="flex items-start">
                                                            <svg className={`w-5 h-5 mr-3 shrink-0 ${pkg.isPopular ? 'text-teal-400' : 'text-teal-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                                
                                                <div className={`w-full py-3 rounded-lg text-center font-bold text-sm transition-colors mt-auto ${btnStyles}`}>
                                                    Pilih {pkg.id}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {errors.subscription_plan && <p className="text-xs text-red-500 mt-2">{errors.subscription_plan}</p>}
                            </div>

                            {/* Jadwal Penjemputan */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Jadwal Penjemputan
                                    {data.subscription_plan !== 'Request' && (
                                        <span className="ml-2 text-xs font-normal text-gray-400">
                                            ({data.pickup_schedule.length}/{getMaxDays(data.subscription_plan)} hari dipilih)
                                        </span>
                                    )}
                                </label>
                                {data.subscription_plan === 'Request' ? (
                                    <p className="text-sm text-gray-400 bg-gray-50 rounded-lg px-4 py-3">
                                        Paket By Call tidak memerlukan jadwal tetap — tim kami akan merespons setiap panggilan Anda.
                                    </p>
                                ) : (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex flex-wrap gap-2">
                                            {daysOfWeek.map((day) => {
                                                const maxDays = getMaxDays(data.subscription_plan);
                                                const isSelected = data.pickup_schedule.includes(day);
                                                const isDisabled = !isSelected && data.pickup_schedule.length >= maxDays;
                                                return (
                                                    <label
                                                        key={day}
                                                        className={`cursor-pointer px-4 py-2 text-sm rounded-md transition-colors ${
                                                            isSelected
                                                                ? 'bg-teal-600 text-white font-semibold'
                                                                : isDisabled
                                                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only"
                                                            checked={isSelected}
                                                            disabled={isDisabled}
                                                            onChange={() => handleDayToggle(day)}
                                                        />
                                                        {day}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                {errors.pickup_schedule && <p className="text-xs text-red-500 mt-1">{errors.pickup_schedule}</p>}
                            </div>

                            {/* Kategori Bisnis */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Kategori Bisnis</label>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <select
                                            value={isCustomCategory ? 'Lainnya' : data.business_category}
                                            onChange={handleCategoryChange}
                                            className="w-full bg-gray-50 border-0 rounded-lg py-3 px-4 text-sm text-gray-700 focus:ring-2 focus:ring-teal-500 transition-colors appearance-none"
                                            required
                                        >
                                            <option value="" disabled hidden>Pilih Kategori Bisnis</option>
                                            {predefinedCategories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                            <option value="Lainnya">Lainnya (Isi Sendiri)</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                            <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    {isCustomCategory && (
                                        <input
                                            type="text"
                                            value={data.business_category}
                                            onChange={e => setData('business_category', e.target.value)}
                                            placeholder="Masukkan kategori bisnis Anda"
                                            className="w-full bg-gray-50 border-0 rounded-lg py-3 px-4 text-sm text-gray-700 focus:ring-2 focus:ring-teal-500 transition-colors"
                                            required
                                        />
                                    )}
                                </div>
                                {errors.business_category && <p className="text-xs text-red-500 mt-1">{errors.business_category}</p>}
                            </div>

                            <hr className="border-gray-100 my-8" />
                            
                            {/* MoU Download Section */}
                            <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-bold text-orange-800 mb-1">Template MoU (Memorandum of Understanding)</h4>
                                    <p className="text-sm text-orange-700">
                                        Silakan unduh, baca dengan seksama, tandatangani, dan unggah kembali dokumen MoU ini.
                                    </p>
                                </div>
                                <a 
                                    href="/downloads/mou_template.pdf" 
                                    target="_blank" 
                                    className="shrink-0 bg-white border border-orange-200 text-orange-600 hover:bg-orange-100 hover:border-orange-300 font-bold py-2 px-4 rounded-lg text-sm flex items-center transition-colors shadow-sm"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    Unduh Template
                                </a>
                            </div>
                            
                            {/* Registration Flow Information */}
                            <div className="bg-teal-50 border border-teal-100 rounded-xl p-5 mb-6">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-teal-600 mt-0.5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h4 className="font-bold text-teal-800 mb-2">Informasi Alur Pendaftaran</h4>
                                        <p className="text-sm text-teal-700">
                                            Anda <strong>tidak perlu melakukan pembayaran</strong> pada tahap ini. Setelah mengirimkan formulir, tim admin kami akan meninjau pendaftaran Anda. Jika disetujui, Anda akan diarahkan ke halaman tagihan untuk melakukan pembayaran sesuai paket yang dipilih guna mengaktifkan akun kemitraan.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Partnership Period Info */}
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h4 className="font-bold text-blue-800 mb-1">Informasi Masa Aktif Kemitraan</h4>
                                        <p className="text-sm text-blue-700">
                                            Semua layanan kemitraan memiliki estimasi masa aktif <strong>30 hari</strong> yang dimulai sejak tanggal persetujuan admin. Anda dapat memantau informasi sisa masa aktif beserta opsi perpanjangan melalui halaman <strong>Mitra</strong> dan <strong>Tagihan</strong> setelah pendaftaran Anda diverifikasi.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* File Uploads for existing backend support */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">MOU yang Telah Ditandatangani (PDF)</label>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setData('signed_mou', e.target.files ? e.target.files[0] : null)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                                        required
                                    />
                                    {errors.signed_mou && <p className="text-xs text-red-500 mt-1">{errors.signed_mou}</p>}
                                </div>
                            </div>
                            
                            {/* Form Action Buttons */}
                            <div className="flex justify-center items-center gap-4 pt-8">
                                <a 
                                    href="https://wa.me/62811988706" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="px-8 py-3 rounded-lg border border-teal-600 text-teal-700 font-bold hover:bg-teal-50 transition-colors text-sm"
                                >
                                    Konsultasi WA
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`px-8 py-3 rounded-lg bg-teal-700 text-white font-bold hover:bg-teal-800 transition-colors text-sm ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {processing ? 'Memproses...' : 'Kirim Jawaban'}
                                </button>
                            </div>

                        </form>
                    </div>

                </main>
            </div>
        </div>
    );
}
