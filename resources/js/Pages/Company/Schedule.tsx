import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import CompanyLayout from '@/Layouts/CompanyLayout';
import CompanyTrackingCard from '@/Components/CompanyTrackingCard';
import {
    CalendarDays,
    Check,
    Clock,
    AlertCircle,
    Truck,
    Info,
    ChevronLeft,
    ChevronRight,
    Save,
    CalendarCheck,
} from 'lucide-react';

interface Pickup {
    id: number;
    pickup_date: string;
    status: 'scheduled' | 'on_the_way' | 'completed' | 'failed';
    organic_weight: number | null;
    anorganic_weight: number | null;
    residue_weight: number | null;
    trash_bag_count?: number | null;
    cancellation_reason: string | null;
}

interface Company {
    id: number;
    company_name: string;
    subscription_plan: string;
    pickup_schedule: string[];
}

interface Props {
    company: Company;
    pickups: {
        data: Pickup[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
        total: number;
    };
}

const DAYS_OF_WEEK = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function Schedule({ company, pickups }: Props) {
    const isRestrictedPlan =
        company.subscription_plan?.includes('Rumah Tangga') ||
        company.subscription_plan === 'Reguler';
    const maxDays = isRestrictedPlan ? 5 : 7;

    const { data, setData, post, processing, errors } = useForm({
        pickup_schedule: company.pickup_schedule || [],
    });

    const toggleDay = (day: string) => {
        if (data.pickup_schedule.includes(day)) {
            setData('pickup_schedule', data.pickup_schedule.filter((d) => d !== day));
        } else {
            if (isRestrictedPlan && data.pickup_schedule.length >= 5) {
                window.dispatchEvent(
                    new CustomEvent('toast', {
                        detail: {
                            type: 'error',
                            message: `Paket ${company.subscription_plan} maksimal hanya dapat memilih 5 hari penjemputan per minggu.`,
                        },
                    })
                );
                return;
            }
            setData('pickup_schedule', [...data.pickup_schedule, day]);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('company.schedule.update'), {
            preserveScroll: true,
        });
    };

    const formatDateIndo = (dateStr: string) => {
        try {
            return new Intl.DateTimeFormat('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }).format(new Date(dateStr));
        } catch {
            return dateStr;
        }
    };

    return (
        <CompanyLayout
            activeTab="schedule"
            title="Jadwal & Agenda Pengambilan"
            subtitle="Atur hari rutin penjemputan sampah dan pantau jadwal agenda armada CleanUP mendatang."
            company={company}
        >
            {/* Live GPS Driver Tracking */}
            <CompanyTrackingCard />


            {/* 1. SCHEDULE CONFIGURATION CARD */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <CalendarDays className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                                Pengaturan Hari Rutin Penjemputan
                            </h3>
                            <p className="text-xs text-slate-400">
                                Pilih hari operasional saat armada WellTrash CleanUP datang ke lokasi drop point bisnis Anda.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                            {data.pickup_schedule.length} dari {maxDays} Hari Dipilih
                        </span>
                    </div>
                </div>

                <form onSubmit={submit} className="mt-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                        {DAYS_OF_WEEK.map((day) => {
                            const isSelected = data.pickup_schedule.includes(day);
                            return (
                                <button
                                    type="button"
                                    key={day}
                                    onClick={() => toggleDay(day)}
                                    className={`p-3.5 sm:p-4 rounded-xl text-center border transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer ${
                                        isSelected
                                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs font-extrabold'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50/50 font-medium'
                                    }`}
                                >
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                            isSelected
                                                ? 'bg-emerald-600 text-white'
                                                : 'border border-slate-300'
                                        }`}
                                    >
                                        {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                                    </div>
                                    <span className="text-xs">{day}</span>
                                </button>
                            );
                        })}
                    </div>

                    {errors.pickup_schedule && (
                        <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100 mb-4">
                            {errors.pickup_schedule}
                        </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
                        <p className="text-[11px] text-slate-400">
                            Perubahan jadwal akan diterapkan otomatis pada siklus agenda armada mulai minggu berikutnya.
                        </p>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span>{processing ? 'Menyimpan...' : 'Simpan Jadwal Rutin'}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* 2. SOP & PANDUAN PENGAMBILAN INFOGRAPHIC */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-900">Jam Operasional Ritase</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Armada CleanUP beroperasi antara pukul <strong>07:00 – 15:00 WIB</strong> pada hari yang telah dipilih.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Info className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-900">Pemisahan di Drop Point</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Pisahkan wadah organik dan anorganik sebelum armada tiba untuk efisiensi penimbangan.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-900">Verifikasi Timbangan Digital</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Setiap penjemputan ditimbang dan difoto oleh driver secara realtime ke sistem WellTrash.
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. AGENDA & UPCOMING PICKUPS TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden mt-6">
                <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                            Agenda Penjemputan Terjadwal
                        </h3>
                        <p className="text-xs text-slate-400">
                            Daftar jadwal penjemputan armada CleanUP yang terencana
                        </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg self-start sm:self-auto">
                        Total {pickups.total} Agenda
                    </span>
                </div>

                {pickups.data.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                            <CalendarCheck className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-700">Belum Ada Agenda</h4>
                        <p className="text-xs text-slate-400 mt-1">Sistem belum membuat agenda ritase untuk perusahaan Anda.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    <th className="py-3 px-5">Tanggal</th>
                                    <th className="py-3 px-5">Status Armada</th>
                                    <th className="py-3 px-5 text-center">Organik</th>
                                    <th className="py-3 px-5 text-center">Anorganik</th>
                                    <th className="py-3 px-5 text-center">Residu</th>
                                    <th className="py-3 px-5">Catatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                                {pickups.data.map((pickup) => {
                                    const isCompleted = pickup.status === 'completed';
                                    const isFailed = pickup.status === 'failed';
                                    const isOnTheWay = pickup.status === 'on_the_way';

                                    return (
                                        <tr key={pickup.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3.5 px-5 font-semibold text-slate-800">
                                                {formatDateIndo(pickup.pickup_date)}
                                            </td>
                                            <td className="py-3.5 px-5">
                                                {isCompleted ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <Check className="w-3 h-3 text-emerald-600" /> Selesai
                                                    </span>
                                                ) : isOnTheWay ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                                                        <Truck className="w-3 h-3 text-amber-600" /> Menuju Lokasi
                                                    </span>
                                                ) : isFailed ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                        Batal / Gagal
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                        <Clock className="w-3 h-3 text-slate-400" /> Terjadwal
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-5 text-center font-mono font-semibold">
                                                {isCompleted ? (
                                                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                                                        {pickup.organic_weight} kg
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300">-</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-5 text-center font-mono font-semibold">
                                                {isCompleted ? (
                                                    <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                                                        {pickup.anorganic_weight} kg
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300">-</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-5 text-center font-mono font-semibold">
                                                {isCompleted ? (
                                                    <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                                        {pickup.residue_weight} kg
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300">-</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-5 text-slate-500">
                                                {isFailed && pickup.cancellation_reason ? (
                                                    <span className="text-rose-600 font-medium">
                                                        {pickup.cancellation_reason}
                                                    </span>
                                                ) : isCompleted ? (
                                                    <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                                                        <span>Selesai</span>
                                                        {pickup.trash_bag_count && Number(pickup.trash_bag_count) > 0 && (
                                                            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-bold">
                                                                {pickup.trash_bag_count} TB
                                                            </span>
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">Menunggu jadwal</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>


            {/* PAGINATION */}
            {pickups.last_page > 1 && (
                <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium">
                        Halaman <strong>{pickups.current_page}</strong> dari <strong>{pickups.last_page}</strong>
                    </span>
                    <div className="flex items-center gap-1.5">
                        {pickups.links.map((link, i) => {
                            const isPrev = link.label.includes('Previous') || link.label.includes('&laquo;');
                            const isNext = link.label.includes('Next') || link.label.includes('&raquo;');
                            const content = isPrev ? <ChevronLeft className="w-4 h-4" /> : isNext ? <ChevronRight className="w-4 h-4" /> : link.label;

                            if (!link.url) {
                                return (
                                    <span
                                        key={i}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold text-slate-300 cursor-not-allowed"
                                    >
                                        {content}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                                        link.active
                                            ? 'bg-emerald-600 text-white shadow-xs'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    {content}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </CompanyLayout>
    );
}

