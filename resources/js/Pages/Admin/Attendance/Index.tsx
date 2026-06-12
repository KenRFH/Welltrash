import React, { useState } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

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
        weekday: 'short', day: 'numeric', month: 'short'
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
    const [activeTab, setActiveTab] = useState<'absensi' | 'izin' | 'lembur' | 'permohonan-lembur'>('absensi');
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

    const pendingOvertimeCount = overtimeRequests.filter(o => o.status === 'pending').length;
    const selectedCleanup = selectedCleanupId
        ? cleanups.find(d => d.id === selectedCleanupId)
        : null;

    const pendingLeaveCount = leaveRequests.filter(l => l.status === 'pending').length;

    return (
        <AdminLayout title="Absensi CleanUP" activeTab="attendance" subtitle="Rekap kehadiran CleanUP">
            <div className="space-y-6 pb-10">

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-3 rounded-2xl shadow-sm">
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-2xl shadow-sm">
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {flash.error}
                    </div>
                )}



                {/* Filters */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Filter</h2>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col gap-1 min-w-[200px]">
                            <label className="text-xs font-bold text-gray-500">CleanUP</label>
                            <select
                                id="filter-cleanup"
                                value={selectedCleanupId ?? ''}
                                onChange={e => handleFilter('cleanup_id', e.target.value)}
                                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-orange-100 focus:border-orange-400 focus:bg-white transition-all"
                            >
                                <option value="">Semua CleanUP</option>
                                {cleanups.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-500">Tanggal</label>
                            <input
                                id="filter-date"
                                type="date"
                                value={selectedDate}
                                onChange={e => handleFilter('date', e.target.value)}
                                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-orange-100 focus:border-orange-400 focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                </div>



                {/* Tab Navigation */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setActiveTab('absensi')}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'absensi' ? 'bg-orange-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'}`}
                    >
                        Rekap Absensi ({attendances.total})
                    </button>
                    <button
                        onClick={() => setActiveTab('lembur')}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'lembur' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'}`}
                    >
                        Rekap Lembur ({overtimes.total})
                    </button>
                    <button
                        onClick={() => setActiveTab('izin')}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'izin' ? 'bg-amber-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-300'}`}
                    >
                        Pengajuan Izin/Sakit ({leaveRequests.length})
                        {pendingLeaveCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{pendingLeaveCount}</span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('permohonan-lembur')}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'permohonan-lembur' ? 'bg-violet-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300'}`}
                    >
                        Permohonan Lembur ({overtimeRequests.length})
                        {pendingOvertimeCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{pendingOvertimeCount}</span>
                        )}
                    </button>
                </div>

                {/* Attendance Records Tab */}
                {activeTab === 'absensi' && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-gray-900">Rekap Kehadiran</h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {attendances.total} data — {formatDate(selectedDate)}
                                </p>
                            </div>
                        </div>
                        {attendances.data.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 text-sm font-semibold">Tidak ada data absensi</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/80">
                                            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3">CleanUP</th>
                                            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Tanggal</th>
                                            <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Masuk</th>
                                            <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Pulang</th>
                                            <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Durasi</th>
                                            <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Upah Hari</th>
                                            <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Lokasi Masuk</th>
                                            <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Lokasi Pulang</th>
                                            <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Foto</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {attendances.data.map(att => {
                                            const qualified = (att.work_hours ?? 0) >= MIN_WORK_HOURS;
                                            return (
                                                <tr key={att.id} className={`transition-colors ${qualified ? 'hover:bg-green-50/30' : 'hover:bg-gray-50/50 bg-gray-50/20'}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-700 font-black text-xs border border-orange-200 flex-shrink-0">
                                                                {att.user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">{att.user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                        {formatDate(att.date)}
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className="text-sm font-bold text-gray-900">{formatTime(att.clock_in_at)}</span>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className={`text-sm font-bold ${att.clock_out_at ? 'text-gray-900' : 'text-gray-300 italic'}`}>
                                                            {formatTime(att.clock_out_at)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        {att.work_hours != null ? (
                                                            <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${att.work_hours >= MIN_WORK_HOURS ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                {att.work_hours} jam
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        {qualified ? (
                                                            <span className="text-sm font-black text-green-700">{formatCurrency(DAILY_RATE)}</span>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">Tidak dihitung</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        {att.clock_in_lat ? (
                                                            <a href={`https://www.google.com/maps?q=${att.clock_in_lat},${att.clock_in_lng}`} target="_blank" rel="noreferrer"
                                                                className="text-xs font-mono text-blue-600 hover:underline">
                                                                {parseFloat(att.clock_in_lat).toFixed(4)}, {parseFloat(att.clock_in_lng!).toFixed(4)}
                                                            </a>
                                                        ) : <span className="text-gray-400 text-xs">-</span>}
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        {att.clock_out_lat ? (
                                                            <a href={`https://www.google.com/maps?q=${att.clock_out_lat},${att.clock_out_lng}`} target="_blank" rel="noreferrer"
                                                                className="text-xs font-mono text-blue-600 hover:underline">
                                                                {parseFloat(att.clock_out_lat).toFixed(4)}, {parseFloat(att.clock_out_lng!).toFixed(4)}
                                                            </a>
                                                        ) : <span className="text-gray-400 text-xs">-</span>}
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            {att.clock_in_photo && (
                                                                <a href={`/storage/${att.clock_in_photo}`} target="_blank" rel="noreferrer"
                                                                    className="text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 px-2 py-1 rounded-lg">
                                                                    Masuk
                                                                </a>
                                                            )}
                                                            {att.clock_out_photo && (
                                                                <a href={`/storage/${att.clock_out_photo}`} target="_blank" rel="noreferrer"
                                                                    className="text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200 hover:bg-orange-100 px-2 py-1 rounded-lg">
                                                                    Pulang
                                                                </a>
                                                            )}
                                                            {!att.clock_in_photo && !att.clock_out_photo && <span className="text-gray-400 text-xs">-</span>}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {attendances.data.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-center">
                                <div className="flex flex-wrap gap-1">
                                    {attendances.links.map((link, i) => (
                                        <button
                                            key={i}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                            disabled={!link.url}
                                            className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-colors ${
                                                link.active
                                                    ? 'bg-orange-500 text-white shadow-sm'
                                                    : link.url
                                                    ? 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
                                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100'
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
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-gray-900">Rekap Lembur</h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {overtimes.total} data — {formatDate(selectedDate)}
                                </p>
                            </div>
                        </div>
                        {overtimes.data.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 text-sm font-semibold">Tidak ada data lembur</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-indigo-50/50">
                                            <th className="text-left text-xs font-bold text-indigo-500 uppercase tracking-wider px-6 py-3">CleanUP</th>
                                            <th className="text-left text-xs font-bold text-indigo-500 uppercase tracking-wider px-4 py-3">Tanggal</th>
                                            <th className="text-center text-xs font-bold text-indigo-500 uppercase tracking-wider px-4 py-3">Mulai Lembur</th>
                                            <th className="text-center text-xs font-bold text-indigo-500 uppercase tracking-wider px-4 py-3">Selesai Lembur</th>
                                            <th className="text-center text-xs font-bold text-indigo-500 uppercase tracking-wider px-4 py-3">Durasi</th>
                                            <th className="text-center text-xs font-bold text-indigo-500 uppercase tracking-wider px-4 py-3">Gaji Lembur</th>
                                            <th className="text-center text-xs font-bold text-indigo-500 uppercase tracking-wider px-4 py-3">Lokasi (M/P)</th>
                                            <th className="text-center text-xs font-bold text-indigo-500 uppercase tracking-wider px-4 py-3">Foto</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {overtimes.data.map(att => (
                                            <tr key={att.id} className="transition-colors hover:bg-indigo-50/20">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-xs border border-indigo-200 flex-shrink-0">
                                                            {att.user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">{att.user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                    {formatDate(att.date)}
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className="text-sm font-bold text-gray-900">{formatTime(att.overtime_clock_in_at)}</span>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className={`text-sm font-bold ${att.overtime_clock_out_at ? 'text-gray-900' : 'text-gray-300 italic'}`}>
                                                        {formatTime(att.overtime_clock_out_at)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    {att.overtime_hours != null ? (
                                                        <span className="text-sm font-bold px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700">
                                                            {att.overtime_hours} jam
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    {att.overtime_hours != null ? (
                                                        <span className="text-sm font-black text-indigo-700">{formatCurrency(att.overtime_hours * 10000)}</span>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        {att.overtime_clock_in_lat ? (
                                                            <a href={`https://www.google.com/maps?q=${att.overtime_clock_in_lat},${att.overtime_clock_in_lng}`} target="_blank" rel="noreferrer"
                                                                className="text-[10px] font-mono text-blue-600 hover:underline">
                                                                M: {parseFloat(att.overtime_clock_in_lat).toFixed(3)}, {parseFloat(att.overtime_clock_in_lng!).toFixed(3)}
                                                            </a>
                                                        ) : <span className="text-gray-400 text-[10px]">-</span>}
                                                        {att.overtime_clock_out_lat ? (
                                                            <a href={`https://www.google.com/maps?q=${att.overtime_clock_out_lat},${att.overtime_clock_out_lng}`} target="_blank" rel="noreferrer"
                                                                className="text-[10px] font-mono text-blue-600 hover:underline">
                                                                P: {parseFloat(att.overtime_clock_out_lat).toFixed(3)}, {parseFloat(att.overtime_clock_out_lng!).toFixed(3)}
                                                            </a>
                                                        ) : <span className="text-gray-400 text-[10px]">-</span>}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        {att.overtime_clock_in_photo && (
                                                            <a href={`/storage/${att.overtime_clock_in_photo}`} target="_blank" rel="noreferrer"
                                                                className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 px-2 py-1 rounded-lg">
                                                                Masuk
                                                            </a>
                                                        )}
                                                        {att.overtime_clock_out_photo && (
                                                            <a href={`/storage/${att.overtime_clock_out_photo}`} target="_blank" rel="noreferrer"
                                                                className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 px-2 py-1 rounded-lg">
                                                                Pulang
                                                            </a>
                                                        )}
                                                        {!att.overtime_clock_in_photo && !att.overtime_clock_out_photo && <span className="text-gray-400 text-xs">-</span>}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {overtimes.data.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-center">
                                <div className="flex flex-wrap gap-1">
                                    {overtimes.links.map((link, i) => (
                                        <button
                                            key={i}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                            disabled={!link.url}
                                            className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-colors ${
                                                link.active
                                                    ? 'bg-indigo-500 text-white shadow-sm'
                                                    : link.url
                                                    ? 'bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200'
                                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100'
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
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-gray-900">Pengajuan Izin / Sakit</h2>
                                <p className="text-xs text-gray-500 mt-0.5">{leaveRequests.length} pengajuan — {formatDate(selectedDate)}</p>
                            </div>
                            {pendingLeaveCount > 0 && (
                                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                                    Menunggu review
                                </span>
                            )}
                        </div>

                        {leaveRequests.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <p className="text-gray-500 font-semibold text-sm">Tidak ada pengajuan izin/sakit</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {leaveRequests.map(leave => (
                                    <div key={leave.id} className={`px-6 py-5 ${leave.status === 'pending' ? 'bg-amber-50/30' : ''}`}>
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 mt-0.5 ${leave.type === 'izin' ? 'bg-blue-50' : 'bg-red-50'}`}>
                                                    {leave.type === 'izin' ? 'Izin' : 'Sakit'}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="font-bold text-gray-900 text-sm">{leave.user.name}</p>
                                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${leave.type === 'izin' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-red-700 bg-red-50 border-red-200'}`}>
                                                            {leave.type === 'izin' ? 'IZIN' : 'SAKIT'}
                                                        </span>
                                                        <span className="text-xs text-gray-500">{formatDate(leave.date)}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">{leave.reason}</p>
                                                    {leave.admin_note && (
                                                        <p className="text-xs text-gray-400 mt-1.5 italic">Catatan: {leave.admin_note}</p>
                                                    )}
                                                    {leave.proof_image && (
                                                        <div className="mt-2">
                                                            <a href={`/storage/${leave.proof_image}`} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-2.5 py-1 rounded-lg inline-block">
                                                                Lihat Bukti Sakit
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                                {leave.status === 'pending' && (
                                                    <>
                                                        <span className="text-[11px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full">
                                                            Menunggu
                                                        </span>
                                                        {reviewingId === leave.id ? (
                                                            <div className="space-y-2 w-56">
                                                                <textarea
                                                                    value={reviewData.admin_note}
                                                                    onChange={e => setReviewData('admin_note', e.target.value)}
                                                                    placeholder="Catatan admin (opsional)"
                                                                    rows={2}
                                                                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl resize-none focus:ring-1 focus:ring-orange-200 focus:border-orange-400"
                                                                />
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => submitReview(leave.id)}
                                                                        disabled={reviewProcessing}
                                                                        className={`flex-1 py-2 text-xs font-bold text-white rounded-xl transition-all disabled:opacity-50 ${
                                                                            reviewData.status === 'approved'
                                                                                ? 'bg-green-600 hover:bg-green-700'
                                                                                : 'bg-red-500 hover:bg-red-600'
                                                                        }`}
                                                                    >
                                                                        {reviewData.status === 'approved' ? 'Setujui' : 'Tolak'}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setReviewingId(null)}
                                                                        className="px-3 py-2 text-xs font-bold bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200"
                                                                    >
                                                                        Batal
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => openReview(leave, 'approved')}
                                                                    className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 px-3 py-1.5 rounded-xl transition-colors"
                                                                >
                                                                    Setujui
                                                                </button>
                                                                <button
                                                                    onClick={() => openReview(leave, 'rejected')}
                                                                    className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors"
                                                                >
                                                                    Tolak
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                                {leave.status === 'approved' && (
                                                    <span className="text-[11px] font-bold text-green-700 bg-green-100 border border-green-200 px-2.5 py-1 rounded-full">
                                                        ✅ Disetujui
                                                    </span>
                                                )}
                                                {leave.status === 'rejected' && (
                                                    <span className="text-[11px] font-bold text-red-700 bg-red-100 border border-red-200 px-2.5 py-1 rounded-full">
                                                        ❌ Ditolak
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
                {/* ── TAB PERMOHONAN LEMBUR ── */}
                {activeTab === 'permohonan-lembur' && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-gray-900">Permohonan Izin Lembur</h2>
                                <p className="text-xs text-gray-500 mt-0.5">{overtimeRequests.length} permohonan</p>
                            </div>
                            {pendingOvertimeCount > 0 && (
                                <span className="text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-xl">
                                    {pendingOvertimeCount} menunggu review
                                </span>
                            )}
                        </div>

                        {overtimeRequests.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <p className="text-gray-500 font-semibold text-sm">Tidak ada permohonan lembur</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {overtimeRequests.map(ot => (
                                    <div key={ot.id} className={`px-6 py-5 ${ot.status === 'pending' ? 'bg-violet-50/30' : ''}`}>
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 ${
                                                    ot.status === 'approved' ? 'bg-green-100 text-green-700'
                                                    : ot.status === 'rejected' ? 'bg-red-100 text-red-700'
                                                    : 'bg-violet-100 text-violet-700'
                                                }`}>
                                                    {ot.status === 'approved' ? '✓' : ot.status === 'rejected' ? '✕' : '⏳'}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="font-bold text-gray-900 text-sm">{ot.user.name}</p>
                                                        <span className="text-xs text-gray-500">{formatDate(ot.date)}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">{ot.reason}</p>
                                                    {ot.admin_note && (
                                                        <p className="text-xs text-gray-400 mt-1.5 italic">Catatan: {ot.admin_note}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                                {ot.status === 'pending' && (
                                                    <>
                                                        <span className="text-[11px] font-bold text-violet-700 bg-violet-100 border border-violet-200 px-2.5 py-1 rounded-full">
                                                            Menunggu
                                                        </span>
                                                        {reviewingOvertimeId === ot.id ? (
                                                            <div className="space-y-2 w-56">
                                                                <textarea
                                                                    value={overtimeReviewData.admin_note}
                                                                    onChange={e => setOvertimeReviewData('admin_note', e.target.value)}
                                                                    placeholder="Catatan admin (opsional)"
                                                                    rows={2}
                                                                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl resize-none focus:ring-1 focus:ring-violet-200 focus:border-violet-400"
                                                                />
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => submitOvertimeReview(ot.id)}
                                                                        disabled={overtimeReviewProcessing}
                                                                        className={`flex-1 py-2 text-xs font-bold text-white rounded-xl transition-all disabled:opacity-50 ${
                                                                            overtimeReviewData.status === 'approved'
                                                                                ? 'bg-green-600 hover:bg-green-700'
                                                                                : 'bg-red-500 hover:bg-red-600'
                                                                        }`}
                                                                    >
                                                                        {overtimeReviewData.status === 'approved' ? 'Setujui' : 'Tolak'}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setReviewingOvertimeId(null)}
                                                                        className="px-3 py-2 text-xs font-bold bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200"
                                                                    >
                                                                        Batal
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => openOvertimeReview(ot, 'approved')}
                                                                    className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 px-3 py-1.5 rounded-xl transition-colors"
                                                                >
                                                                    ✓ Setujui
                                                                </button>
                                                                <button
                                                                    onClick={() => openOvertimeReview(ot, 'rejected')}
                                                                    className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors"
                                                                >
                                                                    ✕ Tolak
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                                {ot.status === 'approved' && (
                                                    <span className="text-[11px] font-bold text-green-700 bg-green-100 border border-green-200 px-2.5 py-1 rounded-full">
                                                        ✅ Disetujui
                                                    </span>
                                                )}
                                                {ot.status === 'rejected' && (
                                                    <span className="text-[11px] font-bold text-red-700 bg-red-100 border border-red-200 px-2.5 py-1 rounded-full">
                                                        ❌ Ditolak
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
