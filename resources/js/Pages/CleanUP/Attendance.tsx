import React, { useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import CleanUPSidebar from '@/Components/CleanUPSidebar';
import AbsensiFloatingButton from '@/Components/AbsensiFloatingButton';
import { compressImage } from '@/utils/compressImage';

const DAILY_RATE     = 67692;
const MIN_WORK_HOURS = 8;

interface AttendanceRecord {
    id: number;
    date: string;
    clock_in_at: string;
    clock_out_at: string | null;
    work_hours: number | null;
    status: 'present' | 'incomplete';
    clock_in_photo: string | null;
    clock_out_photo: string | null;
    overtime_clock_in_at: string | null;
    overtime_clock_out_at: string | null;
    overtime_hours: number | null;
}

interface LeaveRecord {
    id: number;
    date: string;
    type: 'izin' | 'sakit';
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_note: string | null;
    proof_image: string | null;
}

interface OvertimeRecord {
    id: number;
    date: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_note: string | null;
}

interface Summary {
    total_days: number;
    qualified_days: number;
    total_hours: number;
    estimated_salary: number;
    daily_rate: number;
    min_hours: number;
    total_overtime_hours: number;
    overtime_salary: number;
}

interface Props {
    attendances: AttendanceRecord[];
    leaveRequests: LeaveRecord[];
    overtimeRequests: OvertimeRecord[];
    todayApprovedOvertime: boolean;
    selectedMonth: string;
    summary: Summary;
    auth: { user: { name: string; email: string } };
    flash: { success?: string; error?: string };
}

function formatTime(dt: string | null) {
    if (!dt) return '-';
    return new Date(dt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dt: string) {
    return new Date(dt).toLocaleDateString('id-ID', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(amount);
}

export default function CleanUPAttendance({
    attendances,
    leaveRequests,
    overtimeRequests,
    todayApprovedOvertime,
    selectedMonth,
    summary,
    auth,
    flash,
}: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'absensi' | 'izin' | 'lembur'>('absensi');
    const [showLeaveForm, setShowLeaveForm] = useState(false);
    const [showOvertimeForm, setShowOvertimeForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        date: new Date().toLocaleDateString('en-CA'),
        type: 'izin' as 'izin' | 'sakit',
        reason: '',
        proof_image: null as File | null,
    });

    const {
        data: overtimeData,
        setData: setOvertimeData,
        post: postOvertime,
        processing: overtimeProcessing,
        errors: overtimeErrors,
        reset: resetOvertime,
    } = useForm({
        date: new Date().toLocaleDateString('en-CA'),
        reason: '',
    });

    const handleMonthChange = (month: string) => {
        router.get(route('cleanup.attendance'), { month }, { preserveState: true });
    };

    const handleSubmitLeave = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('cleanup.leave.store'), {
            onSuccess: () => {
                reset('reason');
                setShowLeaveForm(false);
            },
        });
    };

    const handleSubmitOvertime = (e: React.FormEvent) => {
        e.preventDefault();
        postOvertime(route('cleanup.attendance.requestOvertime'), {
            onSuccess: () => {
                resetOvertime();
                setShowOvertimeForm(false);
            },
        });
    };

    const isQualified = (att: AttendanceRecord) => (att.work_hours ?? 0) >= MIN_WORK_HOURS;

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Absensi & Gaji" />

            <CleanUPSidebar
                active="attendance"
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="h-24 flex items-center justify-between px-6 sm:px-10 bg-white/60 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-500 hover:text-green-600 md:hidden focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">Absensi & Gaji</h1>
                            <p className="text-xs text-gray-500 font-medium hidden sm:block">Transparansi kehadiran dan perhitungan upah</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={e => handleMonthChange(e.target.value)}
                            className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium bg-white focus:ring-2 focus:ring-green-100 focus:border-green-400 transition-all shadow-sm"
                        />
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 sm:px-10 py-6 pb-28">

                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-5 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-3 rounded-2xl">
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-2xl">
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            {flash.error}
                        </div>
                    )}

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Hari Absen</p>
                            <p className="text-3xl font-black text-gray-900">{summary.total_days}</p>
                            <p className="text-xs text-gray-400 mt-0.5">hari</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-4 shadow-sm">
                            <p className="text-[11px] font-bold text-green-600 uppercase tracking-wider mb-1">≥ 8 Jam</p>
                            <p className="text-3xl font-black text-gray-900">{summary.qualified_days}</p>
                            <p className="text-xs text-green-500 mt-0.5">hari dihitung</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Jam</p>
                            <p className="text-3xl font-black text-gray-900">{summary.total_hours}</p>
                            <p className="text-xs text-gray-400 mt-0.5">jam kerja</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100 p-4 shadow-sm col-span-2 sm:col-span-1">
                            <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider mb-1">Estimasi Gaji</p>
                            <p className="text-xl font-black text-gray-900">{formatCurrency(summary.estimated_salary)}</p>
                            <p className="text-xs text-orange-500 mt-0.5">{formatCurrency(DAILY_RATE)} × {summary.qualified_days} hari</p>
                        </div>
                    </div>

                    {/* Overtime Summary Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-4 shadow-sm">
                            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Total Jam Lembur</p>
                            <p className="text-3xl font-black text-gray-900">{summary.total_overtime_hours}</p>
                            <p className="text-xs text-indigo-500 mt-0.5">jam lembur</p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl border border-indigo-200 p-4 shadow-sm text-white">
                            <p className="text-[11px] font-bold text-indigo-100 uppercase tracking-wider mb-1">Pendapatan Lembur</p>
                            <p className="text-xl font-black">{formatCurrency(summary.overtime_salary)}</p>
                            <p className="text-xs text-indigo-200 mt-0.5">Rp 10.000 / jam</p>
                        </div>
                    </div>

                    {/* Grand Total Card */}
                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-6 shadow-[0_8px_30px_rgb(16,185,129,0.2)] mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-white border border-emerald-400/30">
                        <div>
                            <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest mb-1.5 opacity-90">Total Estimasi Gaji Keseluruhan</p>
                            <p className="text-4xl font-black tracking-tight">{formatCurrency(summary.estimated_salary + summary.overtime_salary)}</p>
                        </div>
                        <div className="mt-4 sm:mt-0 bg-white/20 px-4 py-2.5 rounded-xl border border-white/20 backdrop-blur-md flex flex-col items-end sm:items-center gap-1 min-w-40">
                            <div className="flex justify-between w-full text-xs font-bold text-emerald-50">
                                <span>Gaji Reguler:</span>
                                <span>{formatCurrency(summary.estimated_salary)}</span>
                            </div>
                            <div className="flex justify-between w-full text-xs font-bold text-emerald-50">
                                <span>Gaji Lembur:</span>
                                <span>{formatCurrency(summary.overtime_salary)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Salary rule notice */}
                    <div className="mb-6 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                        <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-blue-700 font-medium leading-relaxed">
                            <span className="font-bold">Aturan Gaji:</span> Upah harian sebesar <span className="font-black">{formatCurrency(DAILY_RATE)}</span> dihitung untuk setiap hari Anda bekerja minimal <span className="font-black">8 jam</span> (absen masuk dan absen pulang). Hari dengan durasi kerja kurang dari 8 jam tidak masuk perhitungan.
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 mb-5 flex-wrap">
                        <button
                            onClick={() => setActiveTab('absensi')}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'absensi' ? 'bg-green-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'}`}
                        >
                            Riwayat Absensi ({attendances.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('izin')}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'izin' ? 'bg-amber-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-300'}`}
                        >
                            Izin/Sakit ({leaveRequests.length})
                            {leaveRequests.some(l => l.status === 'pending') && (
                                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('lembur')}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'lembur' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'}`}
                        >
                            Pengajuan Lembur ({overtimeRequests.length})
                            {overtimeRequests.some(o => o.status === 'pending') && (
                                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                            )}
                        </button>
                    </div>

                    {/* Attendance Records Tab */}
                    {activeTab === 'absensi' && (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            {attendances.length === 0 ? (
                                <div className="px-6 py-16 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-semibold">Tidak ada data absensi bulan ini</p>
                                    <p className="text-gray-400 text-sm mt-1">Mulai absen menggunakan tombol floating di bawah kanan</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {attendances.map(att => {
                                        const qualified = isQualified(att);
                                        return (
                                            <div key={att.id} className={`px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 ${qualified ? '' : 'bg-gray-50/50'}`}>
                                                {/* Date & Status */}
                                                <div className="flex items-center gap-3 sm:w-44 flex-shrink-0">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${qualified ? 'bg-green-100 text-green-700' : att.clock_out_at ? 'bg-amber-100 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                                                        {qualified ? 'OK' : att.clock_out_at ? '!' : 'X'}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-900">{formatDate(att.date)}</p>
                                                        {qualified ? (
                                                            <p className="text-[10px] text-green-600 font-bold">Terhitung gaji</p>
                                                        ) : (
                                                            <p className="text-[10px] text-amber-600 font-bold">
                                                                {att.clock_out_at ? 'Kurang dari 8 jam' : 'Belum absen pulang'}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Times */}
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="text-center">
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Masuk</p>
                                                        <p className="text-sm font-black text-gray-900">{formatTime(att.clock_in_at)}</p>
                                                    </div>
                                                    <div className="text-gray-300">→</div>
                                                    <div className="text-center">
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Pulang</p>
                                                        <p className={`text-sm font-black ${att.clock_out_at ? 'text-gray-900' : 'text-gray-300'}`}>
                                                            {formatTime(att.clock_out_at)}
                                                        </p>
                                                    </div>
                                                    {att.work_hours != null && (
                                                        <div className={`ml-2 px-3 py-1 rounded-lg text-xs font-bold ${att.work_hours >= MIN_WORK_HOURS ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                            {att.work_hours} jam
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Overtime Times */}
                                                {(att.overtime_clock_in_at || att.overtime_clock_out_at) && (
                                                    <div className="flex items-center gap-4 flex-1 border-l pl-4 border-gray-100">
                                                        <div className="text-center">
                                                            <p className="text-[10px] text-indigo-400 font-bold uppercase">Lembur</p>
                                                            <p className="text-sm font-black text-gray-900">{formatTime(att.overtime_clock_in_at)}</p>
                                                        </div>
                                                        <div className="text-gray-300">→</div>
                                                        <div className="text-center">
                                                            <p className="text-[10px] text-indigo-400 font-bold uppercase">Selesai</p>
                                                            <p className={`text-sm font-black ${att.overtime_clock_out_at ? 'text-gray-900' : 'text-gray-300'}`}>
                                                                {formatTime(att.overtime_clock_out_at)}
                                                            </p>
                                                        </div>
                                                        {att.overtime_hours != null && (
                                                            <div className="ml-2 px-3 py-1 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-700">
                                                                {att.overtime_hours} jam
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Salary amount */}
                                                <div className="text-right flex-shrink-0">
                                                    {qualified ? (
                                                        <p className="text-sm font-black text-green-700">{formatCurrency(DAILY_RATE)}</p>
                                                    ) : (
                                                        <p className="text-sm font-bold text-gray-300">{formatCurrency(0)}</p>
                                                    )}
                                                    {att.overtime_hours ? (
                                                        <p className="text-[10px] font-bold text-indigo-600">+ {formatCurrency(att.overtime_hours * 10000)} (Lembur)</p>
                                                    ) : (
                                                        <p className="text-[10px] text-gray-400">hari ini</p>
                                                    )}
                                                </div>

                                                {/* Photo links */}
                                                {(att.clock_in_photo || att.clock_out_photo) && (
                                                    <div className="flex gap-2 flex-shrink-0">
                                                        {att.clock_in_photo && (
                                                            <a href={`/storage/${att.clock_in_photo}`} target="_blank" rel="noreferrer"
                                                                className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 hover:bg-green-100 px-2 py-1 rounded-lg">
                                                                Masuk
                                                            </a>
                                                        )}
                                                        {att.clock_out_photo && (
                                                            <a href={`/storage/${att.clock_out_photo}`} target="_blank" rel="noreferrer"
                                                                className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100 px-2 py-1 rounded-lg">
                                                                Pulang
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Leave Requests Tab */}
                    {activeTab === 'izin' && (
                        <div className="space-y-4">
                            {/* Submit leave button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowLeaveForm(!showLeaveForm)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Ajukan Izin/Sakit
                                </button>
                            </div>

                            {/* Leave Form */}
                            {showLeaveForm && (
                                <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                                        <h3 className="font-bold text-gray-900">Pengajuan Izin / Sakit</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">Isi keterangan untuk disetujui oleh admin</p>
                                    </div>
                                    <form onSubmit={handleSubmitLeave} className="p-6 space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Tanggal</label>
                                                <input
                                                    type="date"
                                                    value={data.date}
                                                    onChange={e => setData('date', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition-all"
                                                />
                                                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Jenis</label>
                                                <div className="flex gap-3">
                                                    {(['izin', 'sakit'] as const).map(type => (
                                                        <button
                                                            key={type}
                                                            type="button"
                                                            onClick={() => setData('type', type)}
                                                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                                                                data.type === type
                                                                    ? type === 'izin'
                                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                                        : 'bg-red-500 text-white border-red-500'
                                                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                                            }`}
                                                        >
                                                            {type === 'izin' ? 'Izin' : 'Sakit'}
                                                        </button>
                                                    ))}
                                                </div>
                                                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Keterangan</label>
                                            <textarea
                                                value={data.reason}
                                                onChange={e => setData('reason', e.target.value)}
                                                placeholder={data.type === 'izin' ? 'Cth: Keperluan keluarga, ada acara adat...' : 'Cth: Demam, flu, sakit perut...'}
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition-all"
                                            />
                                            {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
                                        </div>
                                        {data.type === 'sakit' && (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Bukti / Surat Sakit (Opsional)</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0] || null;
                                                        if (file) {
                                                            const compressed = await compressImage(file, 1280, 1280, 0.78);
                                                            setData('proof_image', compressed);
                                                        } else {
                                                            setData('proof_image', null);
                                                        }
                                                    }}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                                                />
                                                {/* @ts-ignore */}
                                                {errors.proof_image && <p className="text-red-500 text-xs mt-1">{errors.proof_image}</p>}
                                            </div>
                                        )}
                                        <div className="flex gap-3">
                                            <button
                                                type="submit"
                                                disabled={processing || !data.reason}
                                                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                                            >
                                                {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowLeaveForm(false)}
                                                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Leave records */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                {leaveRequests.length === 0 ? (
                                    <div className="px-6 py-14 text-center">
                                        <p className="text-gray-500 font-semibold text-sm">Belum ada pengajuan izin/sakit bulan ini</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {leaveRequests.map(leave => (
                                            <div key={leave.id} className="px-5 py-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${leave.type === 'izin' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                                                            {leave.type === 'izin' ? 'IZIN' : 'SAKIT'}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">
                                                                {leave.type === 'izin' ? 'Izin' : 'Sakit'} — {formatDate(leave.date)}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-0.5">{leave.reason}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        {leave.status === 'pending' && (
                                                            <span className="text-[11px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full">
                                                                Menunggu
                                                            </span>
                                                        )}
                                                        {leave.status === 'approved' && (
                                                            <span className="text-[11px] font-bold text-green-700 bg-green-100 border border-green-200 px-2.5 py-1 rounded-full">
                                                                Disetujui
                                                            </span>
                                                        )}
                                                        {leave.status === 'rejected' && (
                                                            <span className="text-[11px] font-bold text-red-700 bg-red-100 border border-red-200 px-2.5 py-1 rounded-full">
                                                                Ditolak
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {leave.admin_note && (
                                                    <div className="mt-2.5 ml-13 pl-13 border-l-2 border-gray-100 ml-[52px] pl-3">
                                                        <p className="text-[11px] font-bold text-gray-400 uppercase">Catatan Admin</p>
                                                        <p className="text-xs text-gray-600 mt-0.5">{leave.admin_note}</p>
                                                    </div>
                                                )}
                                                {leave.proof_image && (
                                                    <div className="mt-2.5 ml-[52px]">
                                                        <a href={`/storage/${leave.proof_image}`} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-100 inline-block">
                                                            Lihat Bukti Sakit
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {/* ── TAB LEMBUR ── */}
                    {activeTab === 'lembur' && (
                        <div className="space-y-4">
                            {/* Info izin lembur hari ini */}
                            <div className={`flex items-start gap-3 px-5 py-4 rounded-2xl border ${
                                todayApprovedOvertime
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-amber-50 border-amber-200'
                            }`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                    todayApprovedOvertime ? 'bg-green-100' : 'bg-amber-100'
                                }`}>
                                    {todayApprovedOvertime ? (
                                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    )}
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${todayApprovedOvertime ? 'text-green-800' : 'text-amber-800'}`}>
                                        {todayApprovedOvertime
                                            ? '✓ Anda memiliki izin lembur yang disetujui untuk hari ini'
                                            : 'Belum ada izin lembur yang disetujui untuk hari ini'}
                                    </p>
                                    <p className={`text-xs mt-0.5 ${todayApprovedOvertime ? 'text-green-600' : 'text-amber-600'}`}>
                                        {todayApprovedOvertime
                                            ? 'Anda dapat melakukan absen lembur menggunakan tombol floating.'
                                            : 'Ajukan permohonan lembur dan tunggu persetujuan admin sebelum absen lembur.'}
                                    </p>
                                </div>
                            </div>

                            {/* Tombol + Form ajukan lembur */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowOvertimeForm(!showOvertimeForm)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Ajukan Permohonan Lembur
                                </button>
                            </div>

                            {showOvertimeForm && (
                                <div className="bg-white rounded-3xl border border-indigo-100 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
                                        <h3 className="font-bold text-gray-900">Permohonan Izin Lembur</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">Ajukan terlebih dahulu. Absen lembur hanya bisa dilakukan setelah admin menyetujui.</p>
                                    </div>
                                    <form onSubmit={handleSubmitOvertime} className="p-6 space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Tanggal Rencana Lembur</label>
                                            <input
                                                type="date"
                                                value={overtimeData.date}
                                                onChange={e => setOvertimeData('date', e.target.value)}
                                                min={new Date().toLocaleDateString('en-CA')}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                                            />
                                            {overtimeErrors.date && <p className="text-red-500 text-xs mt-1">{overtimeErrors.date}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Alasan / Keperluan Lembur</label>
                                            <textarea
                                                value={overtimeData.reason}
                                                onChange={e => setOvertimeData('reason', e.target.value)}
                                                placeholder="Cth: Menyelesaikan pickup mitra tambahan, target pickup belum tercapai..."
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                                            />
                                            {overtimeErrors.reason && <p className="text-red-500 text-xs mt-1">{overtimeErrors.reason}</p>}
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                type="submit"
                                                disabled={overtimeProcessing || !overtimeData.reason}
                                                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                                            >
                                                {overtimeProcessing ? 'Mengirim...' : 'Kirim Permohonan'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowOvertimeForm(false)}
                                                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Daftar pengajuan lembur */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-50">
                                    <h3 className="font-bold text-gray-900 text-sm">Riwayat Permohonan Lembur</h3>
                                </div>
                                {overtimeRequests.length === 0 ? (
                                    <div className="px-6 py-14 text-center">
                                        <p className="text-gray-500 font-semibold text-sm">Belum ada permohonan lembur</p>
                                        <p className="text-gray-400 text-xs mt-1">Klik tombol di atas untuk mengajukan</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {overtimeRequests.map(ot => (
                                            <div key={ot.id} className="px-5 py-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                                                            ot.status === 'approved' ? 'bg-green-100 text-green-700'
                                                            : ot.status === 'rejected' ? 'bg-red-100 text-red-700'
                                                            : 'bg-indigo-100 text-indigo-700'
                                                        }`}>
                                                            {ot.status === 'approved' ? '✓' : ot.status === 'rejected' ? '✕' : '⏳'}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">
                                                                Lembur — {formatDate(ot.date)}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-0.5">{ot.reason}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        {ot.status === 'pending' && (
                                                            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-full">Menunggu</span>
                                                        )}
                                                        {ot.status === 'approved' && (
                                                            <span className="text-[11px] font-bold text-green-700 bg-green-100 border border-green-200 px-2.5 py-1 rounded-full">Disetujui ✓</span>
                                                        )}
                                                        {ot.status === 'rejected' && (
                                                            <span className="text-[11px] font-bold text-red-700 bg-red-100 border border-red-200 px-2.5 py-1 rounded-full">Ditolak</span>
                                                        )}
                                                    </div>
                                                </div>
                                                {ot.admin_note && (
                                                    <div className="mt-2.5 ml-[52px] border-l-2 border-gray-100 pl-3">
                                                        <p className="text-[11px] font-bold text-gray-400 uppercase">Catatan Admin</p>
                                                        <p className="text-xs text-gray-600 mt-0.5">{ot.admin_note}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <AbsensiFloatingButton />
        </div>
    );
}
