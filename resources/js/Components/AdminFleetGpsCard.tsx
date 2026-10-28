import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Truck, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import LiveTrackingMap, { MapMarker } from '@/Components/LiveTrackingMap';

interface Driver {
    id: number;
    name: string;
    current_lat: number | null;
    current_lng: number | null;
    last_location_at: string | null;
    is_online: boolean;
    active_task: {
        id: number;
        status: string;
        company_name?: string;
        address?: string;
        dest_lat?: number | null;
        dest_lng?: number | null;
    } | null;
}

export default function AdminFleetGpsCard() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);

    const fetchFleet = () => {
        setLoading(true);
        axios.get(route('admin.cleanups.liveLocations'))
            .then((res) => setDrivers(res.data.cleanups || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchFleet();
        const timer = setInterval(fetchFleet, 20000);
        return () => clearInterval(timer);
    }, []);

    const markers = useMemo<MapMarker[]>(() => {
        const list: MapMarker[] = [];
        drivers.forEach((d) => {
            if (typeof d.current_lat === 'number' && typeof d.current_lng === 'number') {
                const isOtw = d.active_task?.status === 'on_the_way';
                list.push({
                    id: `driver-${d.id}`,
                    lat: d.current_lat,
                    lng: d.current_lng,
                    title: `Driver: ${d.name}`,
                    subtitle: isOtw ? `🚚 OTW ke ${d.active_task?.company_name}` : `Update: ${d.last_location_at || '-'}`,
                    type: 'truck',
                    isOnline: d.is_online,
                });
                if (isOtw && d.active_task?.dest_lat && d.active_task?.dest_lng) {
                    list.push({
                        id: `task-${d.active_task.id}`,
                        lat: d.active_task.dest_lat,
                        lng: d.active_task.dest_lng,
                        title: `Tujuan: ${d.active_task.company_name}`,
                        subtitle: d.active_task.address,
                        type: 'building',
                    });
                }
            }
        });
        return list;
    }, [drivers]);

    const activeCount = drivers.filter(d => d.is_online).length;

    return (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden mb-6">
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Truck className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <h3 className="text-sm font-bold text-slate-900">Live GPS Monitoring Armada CleanUP</h3>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                {activeCount} Aktif
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">Pemantauan rute dan koordinat driver lapangan secara real-time</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchFleet}
                        disabled={loading}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                        title="Segarkan data GPS"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
                    </button>
                    <button
                        onClick={() => setOpen(!open)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                    >
                        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>

            {open && (
                <div className="p-4 sm:p-5">
                    {markers.length > 0 ? (
                        <div className="rounded-xl overflow-hidden mb-4">
                            <LiveTrackingMap markers={markers} height="320px" />
                        </div>
                    ) : (
                        <div className="p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center mb-4">
                            <Truck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-slate-600">Belum ada sinyal GPS aktif hari ini</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Koordinat terekam saat driver memulai penjemputan (OTW)</p>
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
