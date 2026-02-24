import { Head, useForm, Link } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        company_name: '',
        address: '',
        phone: '',
        subscription_plan: 'Basic',
        payment_evidence: null as File | null,
        signed_mou: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('company.store'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col font-sans">
            <Head title="Pendaftaran Perusahaan | WellMaggot" />

            {/* Navbar */}
            <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 lg:px-12 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center">
                   <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 tracking-tight">WellMaggot</span>
                </div>
                <div>
                   <Link href={route('logout')} method="post" as="button" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">Keluar</Link>
                </div>
            </nav>

            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-100 relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full blur-2xl opacity-50 pointer-events-none"></div>

                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Lengkapi Profil Anda</h2>
                        <p className="text-base text-gray-500">
                            Silakan masukkan detail perusahaan Anda dan unggah dokumen persyaratan untuk mengakses dasbor.
                        </p>
                    </div>

                    <div className="rounded-xl bg-indigo-50/50 p-5 border border-indigo-100/50">
                        <h3 className="text-sm font-semibold text-indigo-800 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Panduan Pendaftaran
                        </h3>
                        <div className="text-sm text-indigo-700/80 space-y-2">
                            <p><strong>Langkah 1:</strong> <a href="/downloads/mou_template.pdf" download className="font-medium underline decoration-indigo-300 hover:decoration-indigo-600 transition-all">Unduh Template MOU (PDF)</a></p>
                            <p><strong>Langkah 2:</strong> Tandatangani MOU dan unggah di bawah ini bersama dengan bukti pembayaran Anda.</p>
                        </div>
                    </div>

                    <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">
                        
                        <div className="space-y-5">
                            {/* Company Name */}
                            <div className="relative">
                                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Perusahaan
                                </label>
                                <input
                                    id="company_name"
                                    type="text"
                                    name="company_name"
                                    value={data.company_name}
                                    placeholder="PT. Contoh Perusahaan"
                                    className="block w-full border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-shadow sm:text-sm py-2.5 px-3 bg-gray-50/50 focus:bg-white"
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    required
                                    autoFocus
                                />
                                {errors.company_name && <p className="text-sm text-red-500 mt-1">{errors.company_name}</p>}
                            </div>

                            {/* Address */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Alamat Lengkap
                                </label>
                                <input
                                    id="address"
                                    type="text"
                                    name="address"
                                    value={data.address}
                                    placeholder="Jl. Sudirman No. 123, Jakarta"
                                    className="block w-full border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-shadow sm:text-sm py-2.5 px-3 bg-gray-50/50 focus:bg-white"
                                    onChange={(e) => setData('address', e.target.value)}
                                    required
                                />
                                {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Phone Number */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nomor Telepon
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        value={data.phone}
                                        placeholder="0812xxxxxx"
                                        className="block w-full border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-shadow sm:text-sm py-2.5 px-3 bg-gray-50/50 focus:bg-white"
                                        onChange={(e) => setData('phone', e.target.value)}
                                        required
                                    />
                                    {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                                </div>

                                {/* Subscription Plan */}
                                <div>
                                    <label htmlFor="subscription_plan" className="block text-sm font-medium text-gray-700 mb-1">
                                        Paket Layanan
                                    </label>
                                    <select
                                        id="subscription_plan"
                                        name="subscription_plan"
                                        className="block w-full border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-shadow sm:text-sm py-2.5 px-3 bg-gray-50/50 focus:bg-white"
                                        value={data.subscription_plan}
                                        onChange={(e) => setData('subscription_plan', e.target.value)}
                                        required
                                    >
                                        <option value="Basic">Basic Plan</option>
                                        <option value="Premium">Premium Plan</option>
                                        <option value="Enterprise">Enterprise Plan</option>
                                    </select>
                                    {errors.subscription_plan && <p className="text-sm text-red-500 mt-1">{errors.subscription_plan}</p>}
                                </div>
                            </div>
                        </div>

                        {/* File Uploads */}
                        <div className="pt-6 border-t border-gray-100 space-y-5">
                            <h4 className="text-sm font-semibold text-gray-900">Dokumen Pendukung</h4>
                            
                            <div>
                                <label htmlFor="payment_evidence" className="block text-sm font-medium text-gray-700 mb-1">
                                    Bukti Pembayaran <span className="text-gray-400 font-normal">(Gambar / PDF)</span>
                                </label>
                                <div className="mt-1 flex items-center justify-center w-full">
                                    <label className="flex flex-col w-full border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors cursor-pointer group px-4 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors truncate">
                                                    {data.payment_evidence ? data.payment_evidence.name : "Pilih file bukti pembayaran"}
                                                </span>
                                                <span className="block text-xs text-gray-400 mt-0.5 max-w-xs">Maksimal 5MB. Format: JPG, PNG, PDF.</span>
                                            </div>
                                        </div>
                                        <input
                                            id="payment_evidence"
                                            type="file"
                                            className="hidden"
                                            accept="image/*,application/pdf"
                                            onChange={(e) => setData('payment_evidence', e.target.files ? e.target.files[0] : null)}
                                            required
                                        />
                                    </label>
                                </div>
                                {errors.payment_evidence && <p className="text-sm text-red-500 mt-1.5">{errors.payment_evidence}</p>}
                            </div>

                            <div>
                                <label htmlFor="signed_mou" className="block text-sm font-medium text-gray-700 mb-1">
                                    MOU yang Telah Ditandatangani <span className="text-gray-400 font-normal">(Wajib PDF)</span>
                                </label>
                                <div className="mt-1 flex items-center justify-center w-full">
                                    <label className="flex flex-col w-full border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors cursor-pointer group px-4 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors truncate">
                                                    {data.signed_mou ? data.signed_mou.name : "Pilih file dokumen MOU"}
                                                </span>
                                                <span className="block text-xs text-gray-400 mt-0.5 max-w-xs">Maksimal 10MB. Format: PDF.</span>
                                            </div>
                                        </div>
                                        <input
                                            id="signed_mou"
                                            type="file"
                                            className="hidden"
                                            accept="application/pdf"
                                            onChange={(e) => setData('signed_mou', e.target.files ? e.target.files[0] : null)}
                                            required
                                        />
                                    </label>
                                </div>
                                {errors.signed_mou && <p className="text-sm text-red-500 mt-1.5">{errors.signed_mou}</p>}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
                                    processing ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'
                                }`}
                            >
                                {processing ? 'Memproses...' : 'Kirim Pendaftaran'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
