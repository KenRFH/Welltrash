import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import LiveTrackingMap, { MapMarker } from '@/Components/LiveTrackingMap';
import MonitoringCompanyDetailModal from './MonitoringCompanyDetailModal';
import { MapPin, Truck, Building2, RefreshCw, Search, CheckCircle2, Clock, Navigation, ArrowUpRight } from 'lucide-react';

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
    } | null;
}

export interface CompanyLocation {
    id: number;
    company_name: string;
    pic_name?: string;
    phone?: string;
    address: string;
    latitude: number;
    longitude: number;
    status: 'completed' | 'on_the_way' | 'scheduled' | 'failed' | 'none';
    subscription_plan?: string | null;
    business_category?: string | null;
    driver_name?: string | null;
    vehicle_name?: string | null;
    vehicle_plate?: string | null;
    total_weight: number;
    organic_weight?: number;
    anorganic_weight?: number;
    residue_weight?: number;
    trash_bag_count: number;
    pickup_id?: number | null;
    pickup_time?: string | null;
    detail_url: string;
}

const buildPopupHtml = (c: CompanyLocation) => {
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
                <button onclick="window.__openMonitoringCompanyDetail && window.__openMonitoringCompanyDetail(${c.id})" style="display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 800; color: #059669; background: none; border: none; padding: 0; cursor: pointer;">
                    Lihat Data Penjemputan &rarr;
                </button>
            </div>
        </div>
    `;
};

export default function MonitoringMap() {
    const [companies, setCompanies] = useState<CompanyLocation[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'today' | 'completed' | 'on_the_way' | 'scheduled' | 'none'>('all');
    const [focusCoordinate, setFocusCoordinate] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<CompanyLocation | null>(null);

    // Global listener for map popup clicks
    useEffect(() => {
        (window as any).__openMonitoringCompanyDetail = (id: number) => {
            const target = companies.find((item) => item.id === id);
            if (target) setSelectedCompany(target);
        };
        return () => {
            delete (window as any).__openMonitoringCompanyDetail;
        };
    }, [companies]);

    const fetchData = () => {
        setLoading(true);
        axios.get(route('admin.cleanups.liveLocations'))
            .then((res) => {
                setCompanies(res.data.companies || []);
                setDrivers(res.data.cleanups || []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
        const timer = setInterval(fetchData, 20000);
        return () => clearInterval(timer);
    }, []);

    const filteredCompanies = useMemo(() => {
        return companies.filter((c) => {
            const matchesSearch =
                c.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.pic_name && c.pic_name.toLowerCase().includes(searchQuery.toLowerCase()));

            if (!matchesSearch) return false;
            if (statusFilter === 'all') return true;
            if (statusFilter === 'today') return c.status !== 'none';
            return c.status === statusFilter;
        });
    }, [companies, searchQuery, statusFilter]);

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
                    subtitle: isOtw ? `🚚 OTW: ${d.active_task?.company_name}` : `Update: ${d.last_location_at || '-'}`,
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
                    popupHtml: buildPopupHtml(c),
                });
            }
        });

        return list;
    }, [drivers, filteredCompanies]);

    const completedCount = companies.filter((c) => c.status === 'completed').length;
    const otwCount = companies.filter((c) => c.status === 'on_the_way').length;
    const scheduledCount = companies.filter((c) => c.status === 'scheduled').length;
    const activeDrivers = drivers.filter((d) => d.is_online).length;

    return (
        <AdminLayout
            title="Peta Monitor Mitra"
            subtitle="Pemantauan sebaran lokasi mitra bisnis dan status penjemputan sampah hari ini"
            activeTab="map"
            headerAction={
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl shadow-2xs transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
                    <span>Perbarui Data</span>
                </button>
            }
        >
            <div className="space-y-6">
                {/* 1. Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Total Mitra</div>
                        <div className="text-xl font-extrabold text-slate-900 mt-1">{companies.length}</div>
                        <div className="text-[11px] text-slate-400">Titik lokasi</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                        <div className="text-[10px] font-bold text-emerald-600 uppercase">🟢 Selesai</div>
                        <div className="text-xl font-extrabold text-emerald-700 mt-1">{completedCount}</div>
                        <div className="text-[11px] text-emerald-600">Sudah diambil</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                        <div className="text-[10px] font-bold text-amber-600 uppercase">🟡 OTW</div>
                        <div className="text-xl font-extrabold text-amber-700 mt-1">{otwCount}</div>
                        <div className="text-[11px] text-amber-600">Menuju lokasi</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                        <div className="text-[10px] font-bold text-blue-600 uppercase">🔵 Terjadwal</div>
                        <div className="text-xl font-extrabold text-blue-700 mt-1">{scheduledCount}</div>
                        <div className="text-[11px] text-blue-600">Hari ini</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs col-span-2 sm:col-span-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">🚚 Armada Online</div>
                        <div className="text-xl font-extrabold text-slate-900 mt-1">{activeDrivers} Driver</div>
                        <div className="text-[11px] text-slate-400">GPS terhubung</div>
                    </div>
                </div>

                {/* 2. Filter & Search Bar */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari nama mitra, PIC, atau alamat..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            Semua ({companies.length})
                        </button>
                        <button
                            onClick={() => setStatusFilter('today')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${statusFilter === 'today' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                        >
                            Hari Ini ({completedCount + otwCount + scheduledCount})
                        </button>
                        <button
                            onClick={() => setStatusFilter('completed')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${statusFilter === 'completed' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'}`}
                        >
                            🟢 Selesai ({completedCount})
                        </button>
                        <button
                            onClick={() => setStatusFilter('on_the_way')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${statusFilter === 'on_the_way' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
                        >
                            🟡 OTW ({otwCount})
                        </button>
                        <button
                            onClick={() => setStatusFilter('scheduled')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${statusFilter === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                        >
                            🔵 Belum ({scheduledCount})
                        </button>
                        <button
                            onClick={() => setStatusFilter('none')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${statusFilter === 'none' ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                            ⚪ Tanpa Jadwal
                        </button>
                    </div>
                </div>

                {/* 3. Map & Partner List Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-emerald-600" />
                                Peta Sebaran Mitra Kabupaten Jember
                            </span>
                            <span className="text-[11px] text-slate-400">Klik titik untuk detail penjemputan</span>
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-slate-200">
                            <LiveTrackingMap markers={markers} height="540px" focusCoordinate={focusCoordinate} />
                        </div>
                    </div>

                    <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <span className="text-sm font-extrabold text-slate-900">Daftar Titik Mitra</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                                {filteredCompanies.length}
                            </span>
                        </div>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                            {filteredCompanies.length > 0 ? (
                                filteredCompanies.map((c) => (
                                    <div key={c.id} className="p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-emerald-50/20 text-xs space-y-2 transition-all">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-900 truncate">{c.company_name}</div>
                                                <div className="text-[11px] text-slate-400 truncate">📍 {c.address}</div>
                                            </div>
                                            <span className={`shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                                c.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                c.status === 'on_the_way' ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse' :
                                                c.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                'bg-slate-100 text-slate-500'
                                            }`}>
                                                {c.status === 'completed' ? '✓ Selesai' : c.status === 'on_the_way' ? '🚚 OTW' : c.status === 'scheduled' ? '⏳ Terjadwal' : 'Tanpa Jadwal'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                                            <button
                                                onClick={() => { setFocusCoordinate({ lat: c.latitude, lng: c.longitude }); window.scrollTo({ top: 140, behavior: 'smooth' }); }}
                                                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-emerald-700"
                                            >
                                                <Navigation className="w-3 h-3 text-emerald-600" />
                                                <span>Fokus di Peta</span>
                                            </button>
                                            <button
                                                onClick={() => setSelectedCompany(c)}
                                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-800"
                                            >
                                                <span>Detail Data</span>
                                                <ArrowUpRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">Tidak ada mitra ditemukan</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Detail Data Mitra & Penjemputan */}
            <MonitoringCompanyDetailModal
                company={selectedCompany}
                onClose={() => setSelectedCompany(null)}
                onFocusMap={(lat, lng) => {
                    setFocusCoordinate({ lat, lng });
                    window.scrollTo({ top: 140, behavior: 'smooth' });
                }}
            />
        </AdminLayout>
    );
}