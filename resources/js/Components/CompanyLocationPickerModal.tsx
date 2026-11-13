import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Check, X, Link as LinkIcon } from 'lucide-react';
import { parseCoordinatesOrGoogleMapsUrl } from '@/utils/gmapsParser';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    companyId?: number;
    companyName: string;
    initialLat?: number | null;
    initialLng?: number | null;
    onSaved?: (lat: number, lng: number) => void;
}

// Portal to <body> so the picker stacks above other portaled modals (e.g. the edit-account modal)
// instead of being trapped under them inside the layout's stacking context.
export default function CompanyLocationPickerModal(props: Props) {
    if (!props.isOpen || typeof document === 'undefined') return null;
    return createPortal(<PickerContent {...props} />, document.body);
}

function PickerContent({ onClose, companyId, companyName, initialLat, initialLng, onSaved }: Props) {
    const defaultLat = typeof initialLat === 'number' && initialLat !== 0 ? initialLat : -8.1724;
    const defaultLng = typeof initialLng === 'number' && initialLng !== 0 ? initialLng : 113.6995;

    const [lat, setLat] = useState(defaultLat);
    const [lng, setLng] = useState(defaultLng);
    const [paste, setPaste] = useState('');
    const [saving, setSaving] = useState(false);
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapObj = useRef<L.Map | null>(null);
    const pinObj = useRef<L.Marker | null>(null);

    const pinIcon = L.icon({
        iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    useEffect(() => {
        if (!mapRef.current) return;
        const m = L.map(mapRef.current).setView([lat, lng], 15);
        mapObj.current = m;
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(m);
        const p = L.marker([lat, lng], { icon: pinIcon, draggable: true }).addTo(m);
        pinObj.current = p;
        p.on('dragend', () => {
            const pos = p.getLatLng();
            setLat(Number(pos.lat.toFixed(6)));
            setLng(Number(pos.lng.toFixed(6)));
        });
        m.on('click', (e) => {
            p.setLatLng(e.latlng);
            setLat(Number(e.latlng.lat.toFixed(6)));
            setLng(Number(e.latlng.lng.toFixed(6)));
        });
        return () => { m.remove(); mapObj.current = null; };
    }, []);

    const moveTo = (nLat: number, nLng: number) => {
        const rLat = Number(nLat.toFixed(6)), rLng = Number(nLng.toFixed(6));
        setLat(rLat); setLng(rLng);
        pinObj.current?.setLatLng([rLat, rLng]);
        mapObj.current?.setView([rLat, rLng], 16, { animate: true });
    };

    const handlePaste = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaste(e.target.value);
        const res = parseCoordinatesOrGoogleMapsUrl(e.target.value);
        if (res) moveTo(res.lat, res.lng);
    };

    const handleGPS = () => {
        if (!navigator.geolocation) return alert('Browser tidak mendukung GPS');
        navigator.geolocation.getCurrentPosition((pos) => moveTo(pos.coords.latitude, pos.coords.longitude), () => alert('Gagal deteksi GPS'));
    };

    const handleSave = () => {
        if (companyId) {
            setSaving(true);
            axios.patch(route('admin.companies.updateCoordinates', companyId), { latitude: lat, longitude: lng })
                .then(() => { onSaved?.(lat, lng); onClose(); })
                .catch((e) => alert('Gagal simpan: ' + (e.response?.data?.message || e.message)))
                .finally(() => setSaving(false));
        } else {
            onSaved?.(lat, lng);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 truncate">Atur Titik Lokasi: {companyName}</h3>
                        <p className="text-[11px] text-slate-500">Klik peta atau geser pin hijau ke gerbang mitra</p>
                    </div>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                </div>
                <div className="p-4 space-y-3">
                    <div className="relative">
                        <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Paste link Google Maps atau koordinat (-8.1518, 113.7161)"
                            value={paste}
                            onChange={handlePaste}
                            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-emerald-500"
                        />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex gap-2 font-mono text-[11px] font-bold text-emerald-800">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">Lat: {lat}</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">Lng: {lng}</span>
                        </div>
                        <button type="button" onClick={handleGPS} className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                            <Navigation className="w-3 h-3" /> Lokasi Saya
                        </button>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-slate-200">
                        <div ref={mapRef} style={{ height: '240px' }} className="w-full" />
                    </div>
                </div>
                <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl">Batal</button>
                    <button type="button" onClick={handleSave} disabled={saving} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 disabled:opacity-50">
                        <Check className="w-3.5 h-3.5" /> {saving ? 'Menyimpan...' : 'Simpan Titik Lokasi'}
                    </button>
                </div>
            </div>
        </div>
    );
}
