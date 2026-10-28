import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Truck, MapPin, Radio, Clock, ShieldCheck } from 'lucide-react';
import LiveTrackingMap, { MapMarker } from '@/Components/LiveTrackingMap';

interface TrackingData {
    tracking_active: boolean;
    pickup?: { id: number; status: string; pickup_date: string };
    driver?: {
        name: string;
        lat: number | null;
        lng: number | null;
        last_updated: string | null;
        is_recent: boolean;
    };
    destination?: {
        company_name: string;
        address: string;
        lat: number | null;
        lng: number | null;
    };
}

export default function CompanyTrackingCard() {
    const [data, setData] = useState<TrackingData | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchTracking = () => {
            axios.get(route('company.tracking.active'))
                .then((res) => { if (isMounted) setData(res.data); })
                .catch(() => {});
        };

        fetchTracking();
        const interval = setInterval(fetchTracking, 20000);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    const markers = useMemo<MapMarker[]>(() => {
        if (!data?.tracking_active || !data.driver?.lat || !data.driver?.lng) return [];

        const list: MapMarker[] = [{
            id: 'driver',
            lat: data.driver.lat,
            lng: data.driver.lng,
            title: `Armada CleanUP: ${data.driver.name}`,
            subtitle: `Update: ${data.driver.last_updated || 'baru saja'}`,
            type: 'truck',
            isOnline: data.driver.is_recent,
        }];

        if (data.destination?.lat && data.destination?.lng) {
            list.push({
                id: 'destination',
                lat: data.destination.lat,
                lng: data.destination.lng,
                title: data.destination.company_name,
                subtitle: data.destination.address,
                type: 'building',
            });
        }
        return list;
    }, [data]);

    if (!data?.tracking_active || !data.driver) return null;

    const hasGps = typeof data.driver.lat === 'number' && typeof data.driver.lng === 'number';

    return (
        <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-5 shadow-sm overflow-hidden mb-6 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Truck className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider">
                                Live GPS Driver
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {data.driver.last_updated || 'Aktif'}
                            </span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                            Driver <span className="text-emerald-700">{data.driver.name}</span> Sedang Menuju Lokasi Anda
                        </h3>
                    </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shrink-0 self-start sm:self-auto">
                    <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                    <span>Dalam Perjalanan</span>
                </div>
            </div>

            {hasGps ? (
                <div className="rounded-xl overflow-hidden mb-3.5">
                    <LiveTrackingMap markers={markers} height="260px" />
                </div>
            ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center mb-3.5 text-xs text-slate-500">
                    Menunggu driver menyalakan sinyal GPS...
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">Tujuan: <strong>{data.destination?.company_name}</strong> — {data.destination?.address}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Penjemputan hari ini</span>
                </div>
            </div>
        </div>
    );
}
