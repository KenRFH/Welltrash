import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Truck, RefreshCw, ChevronDown, ChevronUp, MapPin, Building2 } from 'lucide-react';
import LiveTrackingMap, { MapMarker } from '@/Components/LiveTrackingMap';

interface Driver {
    id: number;
    name: string;
    current_lat: number | null;
    current_lng: number | null;
    last_location_at: string | null;
    is_online: boolean;
    vehicle?: {
        id: number;
        name: string;
        license_plate: string;
        type: string;
        capacity?: string | null;
    } | null;
    active_task: {
        id: number;
        status: string;
        company_name?: string;
        address?: string;
        dest_lat?: number | null;
        dest_lng?: number | null;
    } | null;
}

interface CompanyLocation {
    id: number;
    company_name: string;
    pic_name?: string;
    phone?: string;
    address: string;
    latitude: number;
    longitude: number;
    status: 'completed' | 'on_the_way' | 'scheduled' | 'failed' | 'none';
    driver_name?: string | null;
    vehicle_name?: string | null;
    vehicle_plate?: string | null;
    total_weight: number;
    trash_bag_count: number;
    pickup_id?: number | null;
    pickup_time?: string | null;
    detail_url: string;
}

const buildCompanyPopup = (c: CompanyLocation) => {
    let badgeText = 'Tidak Ada Jadwal Hari Ini';
    let badgeBg = '#f1f5f9';
    let badgeColor = '#475569';
    let badgeBorder = '#cbd5e1';

    if (c.status === 'completed') {
        badgeText = '✓ Sudah Diambil';
        badgeBg = '#ecfdf5';
        badgeColor = '#047857';
        badgeBorder = '#a7f3d0';
    } else if (c.status === 'on_the_way') {
        badgeText = '🚚 Sedang Dijemput (OTW)';
        badgeBg = '#fffbeb';
        badgeColor = '#b45309';
        badgeBorder = '#fde68a';
    } else if (c.status === 'scheduled') {
        badgeText = '⏳ Belum Diambil (Jadwal Hari Ini)';
        badgeBg = '#eff6ff';
        badgeColor = '#1d4ed8';
        badgeBorder = '#bfdbfe';
    } else if (c.status === 'failed') {
        badgeText = '✕ Penjemputan Gagal';
        badgeBg = '#fff1f2';
        badgeColor = '#be123c';
        badgeBorder = '#fecdd3';
    }

    let detailRows = '';
    const vehicleInfo = c.vehicle_plate ? ` • ${c.vehicle_name ? `${c.vehicle_name} ` : ''}(${c.vehicle_plate})` : '';

    if (c.status === 'completed') {
        detailRows = `
            <div style="background: #f8fafc; border-radius: 8px; padding: 6px 8px; margin-top: 6px; font-size: 11px; color: #334155; line-height: 1.4;">
                <div><strong>Driver:</strong> ${c.driver_name || '-'}${vehicleInfo}</div>
                <div><strong>Total Sampah:</strong> ${c.total_weight} Kg ${c.trash_bag_count > 0 ? `(${c.trash_bag_count} kantong)` : ''}</div>
                ${c.pickup_time ? `<div><strong>Selesai:</strong> ${c.pickup_time} WIB</div>` : ''}
            </div>
        `;
    } else if (c.status === 'on_the_way') {
        detailRows = `
            <div style="background: #fffbeb; border-radius: 8px; padding: 6px 8px; margin-top: 6px; font-size: 11px; color: #92400e; line-height: 1.4;">
                <div><strong>Driver Bertugas:</strong> ${c.driver_name || 'Armada CleanUP'}${vehicleInfo}</div>
                <div>Armada sedang dalam perjalanan menuju lokasi mitra.</div>
            </div>
        `;
    } else if (c.status === 'scheduled') {
        detailRows = `
            <div style="background: #eff6ff; border-radius: 8px; padding: 6px 8px; margin-top: 6px; font-size: 11px; color: #1e40af; line-height: 1.4;">
                <div>Menunggu jadwal giliran penjemputan armada hari ini.</div>
            </div>
        `;
    }

    return `
        <div style="font-family: inherit; font-size: 12px; min-width: 230px; max-width: 290px; padding: 2px;">
            <div style="font-weight: 800; font-size: 13px; color: #0f172a; line-height: 1.25; margin-bottom: 4px;">${c.company_name}</div>
            <div style="margin-bottom: 6px;">
                <span style="display: inline-block; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 9999px; background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder};">
                    ${badgeText}
                </span>
            </div>
            <div style="font-size: 11px; color: #64748b; line-height: 1.35; margin-bottom: 6px;">
                📍 ${c.address}
            </div>
            ${detailRows}
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
                <a href="${c.detail_url}" style="display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 800; color: #059669; text-decoration: none;">
                    Lihat Data Penjemputan &rarr;
                </a>
            </div>
        </div>
    `;
};

export default function AdminFleetGpsCard() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [companies, setCompanies] = useState<CompanyLocation[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const [markerFilter, setMarkerFilter] = useState<'all' | 'today' | 'completed' | 'pending' | 'trucks'>('all');

    const fetchFleet = () => {
        setLoading(true);
        axios.get(route('admin.cleanups.liveLocations'))
            .then((res) => {
                setDrivers(res.data.cleanups || []);
                setCompanies(res.data.companies || []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchFleet();
        const timer = setInterval(fetchFleet, 20000);
        return () => clearInterval(timer);
    }, []);

    const filteredCompanies = useMemo(() => {
        if (markerFilter === 'trucks') return [];
        if (markerFilter === 'today') return companies.filter((c) => c.status !== 'none');
        if (markerFilter === 'completed') return companies.filter((c) => c.status === 'completed');
        if (markerFilter === 'pending') return companies.filter((c) => c.status === 'scheduled' || c.status === 'on_the_way');
        return companies;
    }, [companies, markerFilter]);

    const markers = useMemo<MapMarker[]>(() => {
        const list: MapMarker[] = [];
        drivers.forEach((d) => {
            if (typeof d.current_lat === 'number' && typeof d.current_lng === 'number') {
                const isOtw = d.active_task?.status === 'on_the_way';
                const vPlate = d.vehicle ? ` [${d.vehicle.license_plate}] ${d.vehicle.name}` : '';
                list.push({
                    id: `driver-${d.id}`,
                    lat: d.current_lat,
                    lng: d.current_lng,
                    title: `Driver: ${d.name}${vPlate}`,
                    subtitle: isOtw ? `🚚 OTW ke ${d.active_task?.company_name}` : `Update: ${d.last_location_at || '-'}`,
                    type: 'truck',
                    isOnline: d.is_online,
                });
            }
        });

        filteredCompanies.forEach((c) => {
            if (typeof c.latitude === 'number' && typeof c.longitude === 'number') {
                list.push({
                    id: `company-${c.id}`,
                    lat: c.latitude,
                    lng: c.longitude,
                    title: c.company_name,
                    subtitle: c.address,
                    type: 'company',
                    status: c.status,
                    popupHtml: buildCompanyPopup(c),
                });
            }
        });

        return list;
    }, [drivers, filteredCompanies]);

    const activeCount = drivers.filter((d) => d.is_online).length;
    const completedCount = companies.filter((c) => c.status === 'completed').length;
    const pendingCount = companies.filter((c) => c.status === 'scheduled' || c.status === 'on_the_way').length;
    const todayScheduledCount = companies.filter((c) => c.status !== 'none').length;

    return (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden mb-6">
            <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider">
                                Monitoring Peta Real-Time
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs text-slate-500 font-medium">
                                {activeCount} Armada Online &bull; {companies.length} Titik Mitra
                            </span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
                            Peta Lokasi Mitra & Armada CleanUP
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                    <button
                        onClick={fetchFleet}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 rounded-lg border border-slate-200 transition-colors disabled:opacity-50"
                        title="Refresh data"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
                        <span>Refresh</span>
                    </button>
                    <button
                        onClick={() => setOpen(!open)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                        aria-label="Toggle map"
                    >
                        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>

            {open && (
                <div className="p-4 sm:p-5">
                    {/* Quick Metric Pills & Filter Bar */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3.5 pb-3 border-b border-slate-100">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Filter:</span>
                            <button
                                onClick={() => setMarkerFilter('all')}
                                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors ${
                                    markerFilter === 'all'
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                Semua ({companies.length})
                            </button>
                            <button
                                onClick={() => setMarkerFilter('today')}
                                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors ${
                                    markerFilter === 'today'
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`}
                            >
                                Jadwal Hari Ini ({todayScheduledCount})
                            </button>
                            <button
                                onClick={() => setMarkerFilter('completed')}
                                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors ${
                                    markerFilter === 'completed'
                                        ? 'bg-emerald-700 text-white'
                                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                }`}
                            >
                                🟢 Sudah Diambil ({completedCount})
                            </button>
                            <button
                                onClick={() => setMarkerFilter('pending')}
                                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors ${
                                    markerFilter === 'pending'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                }`}
                            >
                                ⏳ Belum / OTW ({pendingCount})
                            </button>
                            <button
                                onClick={() => setMarkerFilter('trucks')}
                                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors ${
                                    markerFilter === 'trucks'
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                }`}
                            >
                                🚚 Armada ({activeCount})
                            </button>
                        </div>

                        {/* Visual Legend */}
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                                <span>Sudah Diambil</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block animate-pulse" />
                                <span>Sedang Dijemput</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                                <span>Belum Diambil</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                                <span>Tanpa Jadwal</span>
                            </span>
                        </div>
                    </div>

                    {markers.length > 0 ? (
                        <div className="rounded-xl overflow-hidden mb-4">
                            <LiveTrackingMap markers={markers} height="360px" />
                        </div>
                    ) : (
                        <div className="p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center mb-4">
                            <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-slate-600">Tidak ada titik yang sesuai dengan filter</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Pilih filter "Semua" untuk melihat seluruh titik mitra</p>
                        </div>
                    )}

                    {drivers.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                            {drivers.map((driver) => {
                                const isOtw = driver.active_task?.status === 'on_the_way';
                                return (
                                    <div
                                        key={driver.id}
                                        className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                                            driver.is_online ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50/60 border-slate-200'
                                        }`}
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                                <span className={`w-2 h-2 rounded-full shrink-0 ${driver.is_online ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                <span className="truncate">{driver.name}</span>
                                            </div>
                                            <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                                {isOtw ? <span className="text-emerald-700 font-semibold">OTW: {driver.active_task?.company_name}</span> : <span>Update: {driver.last_location_at || '-'}</span>}
                                            </div>
                                            {driver.vehicle ? (
                                                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-700 font-semibold truncate">
                                                    <span className="font-mono font-bold px-1.5 py-0.2 bg-slate-900 text-white rounded text-[10px]">
                                                        {driver.vehicle.license_plate}
                                                    </span>
                                                    <span className="truncate">{driver.vehicle.name}</span>
                                                </div>
                                            ) : (
                                                <div className="text-[10px] text-slate-400 italic mt-0.5">Tanpa armada terdaftar</div>
                                            )}
                                        </div>
                                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                                            isOtw ? 'bg-amber-100 text-amber-800' : driver.is_online ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                                        }`}>
                                            {isOtw ? 'OTW' : driver.is_online ? 'Online' : 'Offline'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
