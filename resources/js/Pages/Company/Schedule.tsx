import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

interface Pickup {
    id: number;
    pickup_date: string;
    status: 'scheduled' | 'on_the_way' | 'completed' | 'failed';
    organic_weight: number | null;
    anorganic_weight: number | null;
    residue_weight: number | null;
    cancellation_reason: string | null;
}

interface Company {
    id: number;
    company_name: string;
    pickup_schedule: string[];
}

interface Props {
    company: Company;
    pickups: Pickup[];
}

const DAYS_OF_WEEK = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function Schedule({ company, pickups }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        pickup_schedule: company.pickup_schedule || [],
    });

    const toggleDay = (day: string) => {
        if (data.pickup_schedule.includes(day)) {
            setData('pickup_schedule', data.pickup_schedule.filter(d => d !== day));
        } else {
            setData('pickup_schedule', [...data.pickup_schedule, day]);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('company.schedule.update'), {
            preserveScroll: true
        });
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'completed': return <span className="px-2 py-1 text-xs font-bold rounded-md bg-green-100 text-green-700 border border-green-200">Selesai</span>;
            case 'scheduled': return <span className="px-2 py-1 text-xs font-bold rounded-md bg-gray-100 text-gray-700 border border-gray-200">Terjadwal</span>;
            case 'on_the_way': return <span className="px-2 py-1 text-xs font-bold rounded-md bg-yellow-100 text-yellow-700 border border-yellow-200">Menuju Lokasi</span>;
            case 'failed': return <span className="px-2 py-1 text-xs font-bold rounded-md bg-red-100 text-red-700 border border-red-200">Batal / Gagal</span>;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans mb-10 md:mb-0">
            <Head title="Jadwal & Riwayat | Membara" />

            {/* Header */}
            <header className="bg-white px-4 py-4 md:px-6 shadow-sm flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center">
                    <span className="text-xl font-extrabold text-green-600 tracking-tight">WellMaggot</span>
                    <span className="ml-2 text-sm font-bold text-gray-400 border-l border-gray-200 pl-2">Hub Perusahaan</span>
                </div>
                <div className="flex space-x-2">
                    <Link href={route('company.dashboard')} className="text-sm font-bold text-gray-500 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors">Utama</Link>
                    <Link href={route('company.schedule')} className="text-sm font-bold text-green-600 bg-green-50 px-3 py-2 rounded-lg">Jadwal</Link>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:py-10">
                
                {/* Section 1: Manage Schedule Profile */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-xl font-extrabold text-gray-900 mb-1">Pengaturan Hari Operasional</h2>
                    <p className="text-gray-500 text-sm mb-6">Pilih hari-hari dimana perusahaan Anda akan dikunjungi untuk penjemputan. Perubahan akan mereset jadwal yang belum diambil ke depan.</p>
                    
                    <form onSubmit={submit}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            {DAYS_OF_WEEK.map((day) => {
                                const isSelected = data.pickup_schedule.includes(day);
                                return (
                                    <button
                                        type="button"
                                        key={day}
                                        onClick={() => toggleDay(day)}
                                        className={`p-3 rounded-2xl text-center border-2 transition-all font-bold ${
                                            isSelected 
                                                ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' 
                                                : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                                        }`}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                        {errors.pickup_schedule && <p className="text-red-500 text-sm mt-1 mb-4">{errors.pickup_schedule}</p>}

                        <div className="flex justify-end">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Perbarui Jadwal & Terapkan'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Section 2: History and Upcoming Pickups */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-extrabold text-gray-900 mb-1">Agenda & Riwayat Pengambilan</h2>
                    <p className="text-gray-500 text-sm mb-6">Daftar jadwal terencana yang dibuat otomatis dan aktivitas yang sudah berlalu.</p>

                    {pickups.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500 font-medium">Belum ada agenda yang dijadwalkan.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-gray-200 text-gray-500 bg-gray-50">
                                        <th className="font-bold py-3 pr-4 rounded-tl-xl pl-4">Tanggal Pengambilan</th>
                                        <th className="font-bold py-3 pr-4">Status</th>
                                        <th className="font-bold py-3 pr-4">O. (Kg)</th>
                                        <th className="font-bold py-3 pr-4">An. (Kg)</th>
                                        <th className="font-bold py-3 rounded-tr-xl">Res. (Kg)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pickups.map(pickup => (
                                        <tr key={pickup.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                            <td className="py-4 font-bold text-gray-800 tracking-tight pl-4">{pickup.pickup_date}</td>
                                            <td className="py-4"><StatusBadge status={pickup.status} /></td>
                                            <td className="py-4 font-mono text-gray-600">
                                                {pickup.status === 'completed' ? pickup.organic_weight || '0' : '-'}
                                            </td>
                                            <td className="py-4 font-mono text-gray-600">
                                                {pickup.status === 'completed' ? pickup.anorganic_weight || '0' : '-'}
                                            </td>
                                            <td className="py-4 font-mono text-gray-600">
                                                {pickup.status === 'completed' ? pickup.residue_weight || '0' : '-'}
                                                {pickup.status === 'failed' && pickup.cancellation_reason && (
                                                    <span className="block text-xs text-red-500 mt-1 max-w-[150px] truncate" title={pickup.cancellation_reason}>
                                                        Alasan: {pickup.cancellation_reason}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
