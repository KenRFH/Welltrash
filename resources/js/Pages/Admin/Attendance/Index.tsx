import React, { useState, useMemo } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Calendar,
    Clock,
    UserCheck,
    UserX,
    MapPin,
    Camera,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Layers,
    DollarSign,
    Filter,
    ArrowUpRight,
    Search,
    ChevronRight,
    FileText,
} from 'lucide-react';

const DAILY_RATE     = 67692;
const MIN_WORK_HOURS = 8;

interface CleanUP {
    id: number;
    name: string;
    daily_salary: number;
}

interface Attendance {
    id: number;
    user_id: number;
    date: string;
    clock_in_at: string;
    clock_out_at: string | null;
    clock_in_photo: string | null;
    clock_out_photo: string | null;
    clock_in_lat: string | null;
    clock_in_lng: string | null;
    clock_out_lat: string | null;
    clock_out_lng: string | null;
    work_hours: number | null;
    status: 'present' | 'incomplete';
    overtime_clock_in_at: string | null;
    overtime_clock_out_at: string | null;
    overtime_hours: number | null;
    overtime_clock_in_photo: string | null;
    overtime_clock_out_photo: string | null;
    overtime_clock_in_lat: string | null;
    overtime_clock_in_lng: string | null;
    overtime_clock_out_lat: string | null;
    overtime_clock_out_lng: string | null;
    user: {
        id: number;
        name: string;
        daily_salary: number;
    };
}

interface LeaveRequest {
    id: number;
    user_id: number;
    date: string;
    type: 'izin' | 'sakit';
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_note: string | null;
    proof_image: string | null;
    user: {
        id: number;
        name: string;
    };
}

interface OvertimeRequest {
    id: number;
    user_id: number;
    date: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_note: string | null;
    user: {
        id: number;
        name: string;
    };
}

interface PaginatedData<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
}

interface Props {
    cleanups: CleanUP[];
    attendances: PaginatedData<Attendance>;
    overtimes: PaginatedData<Attendance>;
    leaveRequests: LeaveRequest[];
    overtimeRequests: OvertimeRequest[];
    selectedCleanupId: number | null;
    selectedDate: string;
    dailyRate: number;
    minWorkHours: number;
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

export default function AttendanceIndex({
    cleanups,
    attendances,
    overtimes,
    leaveRequests,
    overtimeRequests,
    selectedCleanupId,
    selectedDate,
    dailyRate,
    minWorkHours,
    flash,
}: Props) {
    const [activeTab, setActiveTab] = useState<'absensi' | 'lembur' | 'izin' | 'permohonan-lembur'>('absensi');
    const [reviewingId, setReviewingId] = useState<number | null>(null);
    const [reviewingOvertimeId, setReviewingOvertimeId] = useState<number | null>(null);

    const { data: reviewData, setData: setReviewData, patch, processing: reviewProcessing, reset: resetReview } = useForm({
        status: '' as 'approved' | 'rejected',
        admin_note: '',
    });

    const {
        data: overtimeReviewData,
        setData: setOvertimeReviewData,
        patch: patchOvertime,
        processing: overtimeReviewProcessing,
        reset: resetOvertimeReview,
    } = useForm({
        status: '' as 'approved' | 'rejected',
        admin_note: '',
    });

    const handleFilter = (key: string, value: string) => {
        const params: Record<string, string> = {
            date: selectedDate,
            ...(selectedCleanupId ? { cleanup_id: String(selectedCleanupId) } : {}),
            [key]: value,
        };
        if (key === 'cleanup_id' && value === '') {
            delete params.cleanup_id;
        }
        router.get(route('admin.attendance.index'), params, { preserveState: true });
    };

    const openReview = (leave: LeaveRequest, status: 'approved' | 'rejected') => {
        setReviewData('status', status);
        setReviewData('admin_note', '');
        setReviewingId(leave.id);
    };

    const submitReview = (leaveId: number) => {
        patch(route('admin.attendance.leave.review', leaveId), {
            onSuccess: () => {
                setReviewingId(null);
                resetReview();
            },
        });
    };

    const openOvertimeReview = (ot: OvertimeRequest, status: 'approved' | 'rejected') => {
        setOvertimeReviewData('status', status);
        setOvertimeReviewData('admin_note', '');
        setReviewingOvertimeId(ot.id);
    };

    const submitOvertimeReview = (otId: number) => {
        patchOvertime(route('admin.attendance.overtime.review', otId), {
            onSuccess: () => {
                setReviewingOvertimeId(null);
                resetOvertimeReview();
            },
        });
    };

    // Infographics & Analytics
    const pendingOvertimeCount = overtimeRequests.filter(o => o.status === 'pending').length;
    const pendingLeaveCount = leaveRequests.filter(l => l.status === 'pending').length;

    const totalPresent = attendances.total;
    const qualifiedCount = useMemo(() => {
        return attendances.data.filter(a => (a.work_hours || 0) >= (minWorkHours || MIN_WORK_HOURS)).length;
    }, [attendances.data, minWorkHours]);

    const totalOvertimeHours = useMemo(() => {
        return overtimes.data.reduce((acc, ot) => acc + (ot.overtime_hours || 0), 0);
    }, [overtimes.data]);

    const qualifiedRate = attendances.data.length > 0 ? Math.round((qualifiedCount / attendances.data.length) * 100) : 0;

    return (
        <AdminLayout title="Absensi CleanUP" activeTab="attendance" subtitle="Rekap kehadiran, durasi kerja, dan persetujuan lembur CleanUP">
            <div className="space-y-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-3 rounded-lg shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold px-4 py-3 rounded-lg shadow-2xs">
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* 1. Infographic Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kehadiran Tercatat</span>
                            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <UserCheck className="w-4.5 h-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                            {totalPresent}
                            <span className="text-xs font-medium text-slate-400 ml-1 font-sans">Driver</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Tanggal {formatDate(selectedDate)}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Memenuhi Standar</span>
                            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                                <Clock className="w-4.5 h-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-teal-700 tracking-tight tabular-nums">
                            {qualifiedCount}
                            <span className="text-xs font-medium text-slate-400 ml-1 font-sans">Driver</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            <span className="font-bold text-emerald-600">{qualifiedRate}%</span>
                            <span>kerja &ge; {minWorkHours} jam</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Akumulasi Lembur</span>
                            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <Layers className="w-4.5 h-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-indigo-700 tracking-tight tabular-nums">
                            {totalOvertimeHours}
                            <span className="text-xs font-medium text-slate-400 ml-1 font-sans">Jam</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            <span>Total {overtimes.total} sesi lembur</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Perlu Tindakan</span>
                            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                <AlertCircle className="w-4.5 h-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-amber-700 tracking-tight tabular-nums">
                            {pendingLeaveCount + pendingOvertimeCount}
                            <span className="text-xs font-medium text-slate-400 ml-1 font-sans">Permohonan</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            {pendingLeaveCount + pendingOvertimeCount > 0 ? (
                                <span className="text-amber-700 font-semibold">{pendingLeaveCount} izin &bull; {pendingOvertimeCount} lembur</span>
                            ) : (
                                <span>Semua permohonan diproses</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Minimalist Filter Bar */}
                <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personel:</span>
                            <select
                                id="filter-cleanup"
                                value={selectedCleanupId ?? ''}
                                onChange={e => handleFilter('cleanup_id', e.target.value)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                            >
                                <option value="">Semua CleanUP</option>
                                {cleanups.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal:</span>
                            <input
                                id="filter-date"
                                type="date"
                                value={selectedDate}
                                onChange={e => handleFilter('date', e.target.value)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                    </div>

                    <div className="text-xs text-slate-400 font-medium">
                        Standar Kerja: <span className="font-bold text-slate-700">{minWorkHours} Jam</span> &bull; Upah Pokok: <span className="font-bold text-emerald-700">{formatCurrency(dailyRate)}</span>
                    </div>
                </div>

                {/* 3. Segmented Tab Navigation */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setActiveTab('absensi')}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            activeTab === 'absensi'
                                ? 'bg-slate-900 text-white shadow-2xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <span>Rekap Kehadiran</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            activeTab === 'absensi' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                            {attendances.total}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('lembur')}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            activeTab === 'lembur'
                                ? 'bg-indigo-600 text-white shadow-2xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <span>Rekap Lembur</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            activeTab === 'lembur' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                            {overtimes.total}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('izin')}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            activeTab === 'izin'
                                ? 'bg-amber-600 text-white shadow-2xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <span>Pengajuan Izin / Sakit</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            activeTab === 'izin' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                            {leaveRequests.length}
                        </span>
                        {pendingLeaveCount > 0 && (
                            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                                {pendingLeaveCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('permohonan-lembur')}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            activeTab === 'permohonan-lembur'
                                ? 'bg-purple-600 text-white shadow-2xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <span>Permohonan Lembur</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            activeTab === 'permohonan-lembur' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                            {overtimeRequests.length}
                        </span>
                        {pendingOvertimeCount > 0 && (
                            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                                {pendingOvertimeCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* 4. Tab Contents */}
                {activeTab === 'absensi' && (
                    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900">Rekap Kehadiran Harian</h2>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">
                                    {attendances.total} data tercatat &bull; {formatDate(selectedDate)}
                                </p>
                            </div>
                        </div>

                        {attendances.data.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                                    <UserCheck className="w-6 h-6" />
                                </div>
                                <h4 className="text-sm font-bold text-slate-800">Tidak ada data absensi</h4>
                                <p className="text-xs text-slate-400 font-medium mt-1">
                                    Belum ada presensi yang tercatat untuk tanggal atau filter ini.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-100 text-left">
                                    <thead>
                                        <tr className="bg-slate-50/75">
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">CleanUP Driver</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Jam Masuk</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Jam Pulang</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Durasi Kerja</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Upah Harian</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Lokasi Presensi</th>
                                            <th className="px-5 py-3.5 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">Foto Masuk/Pulang</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">

                                        {attendances.data.map((att) => {
                                            const qualified = att.work_hours != null && att.work_hours >= (minWorkHours || MIN_WORK_HOURS);
                                            return (
                                                <tr key={att.id} className="hover:bg-slate-50/70 transition-colors">
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-extrabold text-xs">
                                                                {att.user.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-900 text-xs">{att.user.name}</div>
                                                                <div className="text-[11px] text-slate-400 font-medium">{formatDate(att.date)}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className="text-xs font-bold text-slate-800">{formatTime(att.clock_in_at)}</span>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className={`text-xs font-bold ${att.clock_out_at ? 'text-slate-800' : 'text-slate-300 italic'}`}>
                                                            {formatTime(att.clock_out_at)}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        {att.work_hours != null ? (
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                                                                qualified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70' : 'bg-amber-50 text-amber-700 border border-amber-200/70'
                                                            }`}>
                                                                {att.work_hours} Jam
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-slate-300">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        {qualified ? (
                                                            <span className="text-xs font-extrabold text-emerald-700 tabular-nums">
                                                                {formatCurrency(dailyRate)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[11px] text-slate-400 italic">Belum memenuhi</span>
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            {att.clock_in_lat ? (
                                                                <a
                                                                    href={`https://www.google.com/maps?q=${att.clock_in_lat},${att.clock_in_lng}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                                                    title="Lihat Peta Masuk"
                                                                >
                                                                    <MapPin className="w-3 h-3 text-emerald-600" />
                                                                    <span>Masuk</span>
                                                                </a>
                                                            ) : null}
                                                            {att.clock_out_lat ? (
                                                                <a
                                                                    href={`https://www.google.com/maps?q=${att.clock_out_lat},${att.clock_out_lng}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                                                                    title="Lihat Peta Pulang"
                                                                >
                                                                    <MapPin className="w-3 h-3 text-teal-600" />
                                                                    <span>Pulang</span>
                                                                </a>
                                                            ) : null}
                                                            {!att.clock_in_lat && !att.clock_out_lat && <span className="text-slate-300 text-xs">-</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            {att.clock_in_photo && (
                                                                <a
                                                                    href={`/storage/${att.clock_in_photo}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 hover:bg-emerald-100"
                                                                >
                                                                    <Camera className="w-3 h-3" />
                                                                    <span>Masuk</span>
                                                                </a>
                                                            )}
                                                            {att.clock_out_photo && (
                                                                <a
                                                                    href={`/storage/${att.clock_out_photo}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/70 hover:bg-teal-100"
                                                                >
                                                                    <Camera className="w-3 h-3" />
                                                                    <span>Pulang</span>
                                                                </a>
                                                            )}
                                                            {!att.clock_in_photo && !att.clock_out_photo && <span className="text-slate-300 text-xs">-</span>}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Attendance Pagination */}
                        {attendances.data.length > 0 && attendances.links.length > 3 && (
                            <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-center">
                                <div className="flex flex-wrap gap-1">
                                    {attendances.links.map((link, i) => (
                                        <button
                                            key={i}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                            disabled={!link.url}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                                link.active
                                                    ? 'bg-slate-900 text-white shadow-2xs'
                                                    : link.url
                                                    ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                                    : 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-100'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Overtime Records Tab */}
                {activeTab === 'lembur' && (
                    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900">Rekap Jam Lembur</h2>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">
                                    {overtimes.total} data tercatat &bull; {formatDate(selectedDate)}
                                </p>
                            </div>
                        </div>

                        {overtimes.data.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h4 className="text-sm font-bold text-slate-800">Tidak ada data lembur</h4>
                                <p className="text-xs text-slate-400 font-medium mt-1">
                                    Belum ada catatan lembur pada tanggal atau filter ini.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-100 text-left">
                                    <thead>
                                        <tr className="bg-slate-50/75">
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">CleanUP Driver</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Mulai Lembur</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Selesai Lembur</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Total Durasi</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Estimasi Upah</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Lokasi & Foto</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">

                                        {overtimes.data.map((att) => (
                                            <tr key={att.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-extrabold text-xs">
                                                            {att.user.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 text-xs">{att.user.name}</div>
                                                            <div className="text-[11px] text-slate-400 font-medium">{formatDate(att.date)}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <span className="text-xs font-bold text-slate-800">{formatTime(att.overtime_clock_in_at)}</span>
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <span className={`text-xs font-bold ${att.overtime_clock_out_at ? 'text-slate-800' : 'text-slate-300 italic'}`}>
                                                        {formatTime(att.overtime_clock_out_at)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    {att.overtime_hours != null ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                                                            {att.overtime_hours} Jam
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-300">-</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    {att.overtime_hours != null ? (
                                                        <span className="text-xs font-extrabold text-indigo-700 tabular-nums">
                                                            {formatCurrency(att.overtime_hours * 10000)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[11px] text-slate-400">-</span>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        {att.overtime_clock_in_photo && (
                                                            <a href={`/storage/${att.overtime_clock_in_photo}`} target="_blank" rel="noreferrer"
                                                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70 hover:bg-indigo-100">
                                                                Foto Mulai
                                                            </a>
                                                        )}
                                                        {att.overtime_clock_out_photo && (
                                                            <a href={`/storage/${att.overtime_clock_out_photo}`} target="_blank" rel="noreferrer"
                                                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/70 hover:bg-purple-100">
                                                                Foto Selesai
                                                            </a>
                                                        )}
                                                        {!att.overtime_clock_in_photo && !att.overtime_clock_out_photo && <span className="text-slate-300 text-xs">-</span>}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {overtimes.data.length > 0 && overtimes.links.length > 3 && (
                            <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-center">
                                <div className="flex flex-wrap gap-1">
                                    {overtimes.links.map((link, i) => (
                                        <button
                                            key={i}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                            disabled={!link.url}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                                    : link.url
                                                    ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                                    : 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-100'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Leave Requests Tab */}
                {activeTab === 'izin' && (
                    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900">Pengajuan Izin & Sakit CleanUP</h2>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">
                                    Total {leaveRequests.length} pengajuan tercatat
                                </p>
                            </div>
                        </div>

                        {leaveRequests.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h4 className="text-sm font-bold text-slate-800">Tidak ada pengajuan izin atau sakit</h4>
                                <p className="text-xs text-slate-400 font-medium mt-1">
                                    Belum ada personel yang mengajukan surat izin atau keterangan sakit.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {leaveRequests.map((leave) => (
                                    <div key={leave.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-xs shrink-0 ${
                                                    leave.type === 'izin' ? 'bg-blue-50 text-blue-700 border border-blue-200/80' : 'bg-rose-50 text-rose-700 border border-rose-200/80'
                                                }`}>
                                                    {leave.type === 'izin' ? 'IZIN' : 'SAKIT'}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-bold text-slate-900 text-xs">{leave.user.name}</span>
                                                        <span className="text-[11px] text-slate-400 font-medium">&bull;</span>
                                                        <span className="text-[11px] text-slate-500 font-medium">{formatDate(leave.date)}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{leave.reason}</p>
                                                    {leave.admin_note && (
                                                        <p className="text-[11px] text-slate-400 italic">Catatan Admin: {leave.admin_note}</p>
                                                    )}
                                                    {leave.proof_image && (
                                                        <div className="pt-1">
                                                            <a href={`/storage/${leave.proof_image}`} target="_blank" rel="noreferrer"
                                                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                                                                <FileText className="w-3.5 h-3.5" />
                                                                <span>Lihat Dokumen / Bukti Medis</span>
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2 shrink-0">
                                                {leave.status === 'pending' && (
                                                    <>
                                                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                                                            Menunggu Review
                                                        </span>
                                                        {reviewingId === leave.id ? (
                                                            <div className="space-y-2 w-64 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                                                <textarea
                                                                    value={reviewData.admin_note}
                                                                    onChange={e => setReviewData('admin_note', e.target.value)}
                                                                    placeholder="Catatan review admin..."
                                                                    rows={2}
                                                                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                                                                />
                                                                <div className="flex gap-1.5">
                                                                    <button
                                                                        onClick={() => submitReview(leave.id)}
                                                                        disabled={reviewProcessing}
                                                                        className={`flex-1 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors ${
                                                                            reviewData.status === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                                                                        }`}
                                                                    >
                                                                        {reviewData.status === 'approved' ? 'Setujui' : 'Tolak'}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setReviewingId(null)}
                                                                        className="px-2.5 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                                                                    >
                                                                        Batal
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex gap-1.5">
                                                                <button
                                                                    onClick={() => openReview(leave, 'approved')}
                                                                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-colors"
                                                                >
                                                                    Setujui
                                                                </button>
                                                                <button
                                                                    onClick={() => openReview(leave, 'rejected')}
                                                                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white transition-colors"
                                                                >
                                                                    Tolak
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                {leave.status === 'approved' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        <span>Disetujui</span>
                                                    </span>
                                                )}
                                                {leave.status === 'rejected' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        <span>Ditolak</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Overtime Requests Tab */}
                {activeTab === 'permohonan-lembur' && (
                    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900">Permohonan Kerja Lembur CleanUP</h2>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">
                                    Total {overtimeRequests.length} pengajuan lembur tercatat
                                </p>
                            </div>
                        </div>

                        {overtimeRequests.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h4 className="text-sm font-bold text-slate-800">Tidak ada permohonan lembur</h4>
                                <p className="text-xs text-slate-400 font-medium mt-1">
                                    Belum ada personel yang mengajukan permohonan jadwal kerja lembur.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {overtimeRequests.map((ot) => (
                                    <div key={ot.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center justify-center font-extrabold text-xs shrink-0">
                                                    LEMBUR
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-bold text-slate-900 text-xs">{ot.user.name}</span>
                                                        <span className="text-[11px] text-slate-400 font-medium">&bull;</span>
                                                        <span className="text-[11px] text-slate-500 font-medium">{formatDate(ot.date)}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{ot.reason}</p>
                                                    {ot.admin_note && (
                                                        <p className="text-[11px] text-slate-400 italic">Catatan Admin: {ot.admin_note}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2 shrink-0">
                                                {ot.status === 'pending' && (
                                                    <>
                                                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
                                                            Menunggu Review
                                                        </span>
                                                        {reviewingOvertimeId === ot.id ? (
                                                            <div className="space-y-2 w-64 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                                                <textarea
                                                                    value={overtimeReviewData.admin_note}
                                                                    onChange={e => setOvertimeReviewData('admin_note', e.target.value)}
                                                                    placeholder="Catatan review lembur..."
                                                                    rows={2}
                                                                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
                                                                />
                                                                <div className="flex gap-1.5">
                                                                    <button
                                                                        onClick={() => submitOvertimeReview(ot.id)}
                                                                        disabled={overtimeReviewProcessing}
                                                                        className={`flex-1 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors ${
                                                                            overtimeReviewData.status === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                                                                        }`}
                                                                    >
                                                                        {overtimeReviewData.status === 'approved' ? 'Setujui' : 'Tolak'}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setReviewingOvertimeId(null)}
                                                                        className="px-2.5 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                                                                    >
                                                                        Batal
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex gap-1.5">
                                                                <button
                                                                    onClick={() => openOvertimeReview(ot, 'approved')}
                                                                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-colors"
                                                                >
                                                                    Setujui
                                                                </button>
                                                                <button
                                                                    onClick={() => openOvertimeReview(ot, 'rejected')}
                                                                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white transition-colors"
                                                                >
                                                                    Tolak
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                {ot.status === 'approved' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        <span>Disetujui</span>
                                                    </span>
                                                )}
                                                {ot.status === 'rejected' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        <span>Ditolak</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
