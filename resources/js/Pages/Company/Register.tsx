import { Head, useForm, Link } from '@inertiajs/react';
import React from 'react';
import CompanySidebar from '@/Components/CompanySidebar';

export default function Register({ auth }: any) {
    const { data, setData, post, processing, errors } = useForm({
        company_name: '',
        pic_name: auth?.user?.name || '',
        address: '',
        phone: '',
        business_category: '', // NEW Field
        subscription_plan: 'Basic',
        pickup_schedule: [] as string[],
        payment_evidence: null as File | null,
        signed_mou: null as File | null,
    });

    const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const predefinedCategories = ['Hotel', 'Restoran', 'Cafe', 'SPPG', 'Gudang'];
    const [isCustomCategory, setIsCustomCategory] = React.useState(false);

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

    const handleDayToggle = (day: string) => {
        if (data.pickup_schedule.includes(day)) {
            setData('pickup_schedule', data.pickup_schedule.filter(d => d !== day));
        } else {
            setData('pickup_schedule', [...data.pickup_schedule, day]);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('company.store'));
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Pendaftaran Mitra | WellMaggot" />

            {/* Sidebar Component (Locked) */}
            <CompanySidebar active="mitra" theme="green" isLocked={true} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                
                {/* Top Navbar */}
                <header className="h-20 flex items-center justify-between px-6 sm:px-10 bg-white/60 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                    {/* Search Bar - Decorative for this view based on screenshot */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
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
                        {/* Notification Bell */}
                        <button className="text-gray-400 hover:text-gray-500 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </button>
                        
                        {/* User Profile */}
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
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
                                    placeholder="Nama WA PIC"
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Basic Card */}
                                    <div 
                                        onClick={() => setData('subscription_plan', 'Basic')}
                                        className={`relative rounded-2xl p-6 cursor-pointer transition-all border flex flex-col h-full ${data.subscription_plan === 'Basic' ? 'border-teal-500 ring-4 ring-teal-50 bg-white' : 'border-gray-200 bg-white hover:border-teal-300'}`}
                                    >
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Basic</h3>
                                        <p className="text-sm text-gray-500 mb-6 min-h-[40px]">Layanan pengangkutan sampah esensial untuk bisnis skala kecil.</p>
                                        <div className="mb-6">
                                            <span className="text-3xl font-black text-gray-900">Rp 899.000</span>
                                            <span className="text-sm text-gray-500 font-medium">/bulan</span>
                                        </div>
                                        <ul className="space-y-3 text-sm text-gray-600 mb-8 flex-1">
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-teal-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                Penjemputan Sampah Terjadwal
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-teal-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                Sesuai SLA Perusahaan
                                            </li>
                                            <li className="flex items-start text-gray-400">
                                                <svg className="w-5 h-5 text-gray-300 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                Akses Dashboard Emisi &amp; Data
                                            </li>
                                            <li className="flex items-start text-gray-400">
                                                <svg className="w-5 h-5 text-gray-300 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                Laporan ESG &amp; Environmental
                                            </li>
                                        </ul>
                                        <div className={`w-full py-3 rounded-lg text-center font-bold text-sm transition-colors mt-auto ${data.subscription_plan === 'Basic' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                                            Pilih Basic
                                        </div>
                                    </div>

                                    {/* Premium Card */}
                                    <div 
                                        onClick={() => setData('subscription_plan', 'Premium')}
                                        className={`relative rounded-2xl p-6 cursor-pointer transition-all flex flex-col h-full ${data.subscription_plan === 'Premium' ? 'bg-[#0f172a] ring-4 ring-teal-50 border border-[#0f172a]' : 'bg-[#0f172a] border border-[#0f172a] opacity-90 transform scale-[0.98] hover:opacity-100 hover:scale-[1.02]'}`}
                                    >
                                        <div className="absolute -top-3 left-6 bg-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            TERPOPULER
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 mt-2">Premium</h3>
                                        <p className="text-sm text-gray-400 mb-6 min-h-[40px]">Manajemen sampah terotomatisasi dengan data pelaporan emisi.</p>
                                        <div className="mb-6">
                                            <span className="text-3xl font-black text-white">Rp 1.129.000</span>
                                            <span className="text-sm text-gray-400 font-medium">/bulan</span>
                                        </div>
                                        <ul className="space-y-3 text-sm text-gray-300 mb-8 flex-1">
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-teal-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                Penjemputan Sampah Terjadwal
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-teal-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                Akses Penuh Dashboard Web
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-teal-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                Pelacakan Historis Sampah
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-teal-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                Unduh Laporan Format ESG
                                            </li>
                                        </ul>
                                        <div className={`w-full py-3 rounded-lg text-center font-bold text-sm transition-colors mt-auto ${data.subscription_plan === 'Premium' ? 'bg-[#22c55e] text-white shadow-lg shadow-green-500/20' : 'bg-[#22c55e]/30 text-green-400 hover:bg-[#22c55e]/40'}`}>
                                            Pilih Premium
                                        </div>
                                    </div>

                                    {/* Premium+ Card */}
                                    <div 
                                        onClick={() => setData('subscription_plan', 'Premium +')}
                                        className={`relative rounded-2xl p-6 cursor-pointer transition-all border flex flex-col h-full ${data.subscription_plan === 'Premium +' ? 'border-teal-500 ring-4 ring-teal-50 bg-white' : 'border-gray-200 bg-white hover:border-teal-300'}`}
                                    >
                                        <div className="absolute top-4 right-4 bg-orange-100 text-orange-600 text-[10px] font-bold px-3 py-1 rounded-full">
                                            Hemat 15%
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Premium +</h3>
                                        <p className="text-sm text-gray-500 mb-6 min-h-[40px] pr-8 leading-snug">Kontrak jangka panjang (6 Bulan) dengan semua fitur premium dan harga lebih hemat.</p>
                                        <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline">
                                            <span className="text-2xl lg:text-3xl font-black text-gray-900">Rp 5.750.000</span>
                                            <span className="text-sm text-gray-500 font-medium sm:ml-1">/6 bulan</span>
                                        </div>
                                        <ul className="space-y-3 text-sm text-gray-600 mb-8 flex-1">
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                Semua Fitur di Paket Premium
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                Dashboard &amp; Laporan Data ESG
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                Harga Jauh Lebih Menguntungkan
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                Prioritas Customer Support
                                            </li>
                                        </ul>
                                        <div className={`w-full py-3 rounded-lg text-center font-bold text-sm transition-colors mt-auto ${data.subscription_plan === 'Premium +' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                                            Pilih Premium +
                                        </div>
                                    </div>
                                </div>
                                {errors.subscription_plan && <p className="text-xs text-red-500 mt-2">{errors.subscription_plan}</p>}
                            </div>

                            {/* Jadwal Penjemputan */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Jadwal Penjemputan</label>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex flex-wrap gap-2">
                                        {daysOfWeek.map((day) => (
                                            <label
                                                key={day}
                                                className={`cursor-pointer px-4 py-2 text-sm rounded-md transition-colors ${
                                                    data.pickup_schedule.includes(day)
                                                        ? 'bg-teal-600 text-white font-semibold'
                                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={data.pickup_schedule.includes(day)}
                                                    onChange={() => handleDayToggle(day)}
                                                />
                                                {day}
                                            </label>
                                        ))}
                                    </div>
                                </div>
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
                            
                            {/* File Uploads for existing backend support */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-end mb-1.5">
                                        <label className="block text-sm font-bold text-gray-700">MOU yang Telah Ditandatangani (PDF)</label>
                                        <a href="/downloads/mou_template.pdf" target="_blank" className="text-xs text-teal-600 hover:text-teal-800 hover:underline flex items-center">
                                            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            Unduh Template MoU
                                        </a>
                                    </div>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setData('signed_mou', e.target.files ? e.target.files[0] : null)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                                        required
                                    />
                                    {errors.signed_mou && <p className="text-xs text-red-500 mt-1">{errors.signed_mou}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Bukti Pembayaran (Image/PDF)</label>
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={(e) => setData('payment_evidence', e.target.files ? e.target.files[0] : null)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                                        required
                                    />
                                    {errors.payment_evidence && <p className="text-xs text-red-500 mt-1">{errors.payment_evidence}</p>}
                                </div>
                            </div>
                            
                            {/* Form Action Buttons */}
                            <div className="flex justify-center items-center gap-4 pt-8">
                                <a 
                                    href="https://wa.me/628123456789" 
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
