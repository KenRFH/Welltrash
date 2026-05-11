import { Head, useForm, Link } from '@inertiajs/react';
import React from 'react';

interface Props {
    company: {
        subscription_plan: string;
    };
}

export default function AwaitingPayment({ company }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        payment_evidence: null as File | null,
    });

    const planPrices = {
        'Request': 'Rp 500.000',
        'Rumah Tangga': 'Rp 750.000',
        'Reguler': 'Rp 2.000.000',
        'Prime': 'Rp 3.000.000',
        'Premium+': 'Rp 5.000.000'
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('company.payment.store'));
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] p-4 font-sans relative overflow-hidden">
            <Head title="Unggah Pembayaran | WellTrash" />
            
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-teal-50 to-transparent -z-10"></div>

            <div className="max-w-xl w-full">
                <div className="bg-white shadow-[0_20px_60px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 sm:p-12 border border-gray-100 text-center">
                    
                    <div className="w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-teal-100">
                        <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Pendaftaran Disetujui!</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Pendaftaran kemitraan Anda telah disetujui. Langkah terakhir, silakan selesaikan pembayaran untuk mengaktifkan jadwal penjemputan Anda.
                    </p>

                    <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-8 text-left">
                        <h3 className="text-sm font-bold text-teal-800 mb-4">Informasi Tagihan</h3>
                        <div className="bg-white rounded-xl p-5 border border-teal-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Bank Mandiri</p>
                                <p className="font-bold text-gray-900 text-lg tracking-wide">123-456-789-0123</p>
                                <p className="text-sm text-gray-600">a.n. PT Welltrash Indonesia</p>
                            </div>
                            <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-6">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Nominal ({company.subscription_plan})</p>
                                <p className="font-black text-teal-600 text-2xl">{planPrices[company.subscription_plan as keyof typeof planPrices] || 'Sesuai Tagihan'}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} encType="multipart/form-data" className="text-left">
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Unggah Bukti Transfer</label>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => setData('payment_evidence', e.target.files ? e.target.files[0] : null)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-all focus:ring-2 focus:ring-teal-500"
                                required
                            />
                            {errors.payment_evidence && <p className="text-xs text-red-500 mt-2 font-medium">{errors.payment_evidence}</p>}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                type="submit"
                                disabled={processing || !data.payment_evidence}
                                className="flex-1 flex items-center justify-center px-6 py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all disabled:opacity-50"
                            >
                                {processing ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
                            </button>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="px-6 py-4 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 transition-all text-center"
                            >
                                Keluar Sementara
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
