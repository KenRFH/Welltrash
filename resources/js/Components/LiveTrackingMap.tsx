import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapMarker {
    id: string | number;
    lat: number;
    lng: number;
    title: string;
    subtitle?: string;
    type: 'truck' | 'building';
    isOnline?: boolean;
}

interface Props {
    markers: MapMarker[];
    height?: string;
    className?: string;
    defaultCenter?: [number, number];
    defaultZoom?: number;
}

// ponytail: custom inline HTML icons via L.divIcon; avoids Vite/Leaflet broken png assets.
const createTruckIcon = (isOnline: boolean = true) => {
    return L.divIcon({
        className: 'custom-map-icon',
        html: `
            <div class="relative flex items-center justify-center">
                ${isOnline ? '<span class="absolute -top-1 -right-1 flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>' : ''}
                <div class="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                </div>
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20],
    });
};

const createBuildingIcon = () => {
    return L.divIcon({
        className: 'custom-map-icon',
        html: `
            <div class="relative flex items-center justify-center">
                <div class="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20],
    });
};

export default function LiveTrackingMap({
    markers,
    height = '320px',
    className = '',
    defaultCenter = [-8.1724, 113.6995], // default center Jember
    defaultZoom = 13,
}: Props) {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const layerGroup = useRef<L.LayerGroup | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        const map = L.map(mapRef.current).setView(defaultCenter, defaultZoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        layerGroup.current = markersLayer;
        mapInstance.current = map;

        return () => {
            map.remove();
            mapInstance.current = null;
        };
    }, []);

    useEffect(() => {
        if (!mapInstance.current || !layerGroup.current) return;

        const group = layerGroup.current;
        group.clearLayers();

        const validMarkers = markers.filter((m) => typeof m.lat === 'number' && typeof m.lng === 'number');

        if (validMarkers.length === 0) return;

        const bounds = L.latLngBounds([]);

        validMarkers.forEach((m) => {
            const icon = m.type === 'truck' ? createTruckIcon(m.isOnline) : createBuildingIcon();
            const marker = L.marker([m.lat, m.lng], { icon });

            const popupContent = `
                <div class="text-xs p-1">
                    <div class="font-bold text-slate-800">${m.title}</div>
                    ${m.subtitle ? `<div class="text-slate-500 mt-0.5">${m.subtitle}</div>` : ''}
                </div>
            `;
            marker.bindPopup(popupContent);
            group.addLayer(marker);
            bounds.extend([m.lat, m.lng]);
        });

        if (validMarkers.length === 1) {
            mapInstance.current.setView([validMarkers[0].lat, validMarkers[0].lng], 15);
        } else {
            mapInstance.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
        }
    }, [markers]);

    return (
        <div
            ref={mapRef}
            style={{ height }}
            className={`w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner z-0 ${className}`}
        />
    );
}
