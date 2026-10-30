import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapMarker {
    id: string | number;
    lat: number;
    lng: number;
    title: string;
    subtitle?: string;
    type: 'truck' | 'building' | 'company';
    isOnline?: boolean;
    status?: 'completed' | 'on_the_way' | 'scheduled' | 'failed' | 'none';
    popupHtml?: string;
}

interface Props {
    markers: MapMarker[];
    height?: string;
    className?: string;
    defaultCenter?: [number, number];
    defaultZoom?: number;
    focusCoordinate?: { lat: number; lng: number } | null;
}

// Override Leaflet's default local image paths with reliable web CDN assets
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Web-hosted CDN colored pin markers (pointhi/leaflet-color-markers via jsDelivr CDN)
const createCompanyIcon = (status: string = 'none') => {
    const colorMap: Record<string, string> = {
        completed: 'green',
        on_the_way: 'gold',
        scheduled: 'blue',
        failed: 'red',
        none: 'grey',
    };
    const color = colorMap[status] || 'grey';

    return L.icon({
        iconUrl: `https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });
};

// Web-hosted icon for truck fleet (via jsDelivr web CDN)
const createTruckIcon = (isOnline: boolean = true) => {
    return L.divIcon({
        className: 'custom-map-icon',
        html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                ${isOnline ? '<span style="position: absolute; top: -3px; right: -3px; width: 12px; height: 12px; background-color: #10b981; border: 2px solid white; border-radius: 9999px;"></span>' : ''}
                <div style="width: 38px; height: 38px; border-radius: 9999px; background-color: #059669; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; padding: 7px;">
                    <img src="https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/truck.svg" style="width: 22px; height: 22px; filter: brightness(0) invert(1);" alt="Truck" />
                </div>
            </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -20],
    });
};

// Web-hosted icon for building destination (via jsDelivr web CDN)
const createBuildingIcon = () => {
    return L.divIcon({
        className: 'custom-map-icon',
        html: `
            <div style="width: 36px; height: 36px; border-radius: 9999px; background-color: #f59e0b; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; padding: 7px;">
                <img src="https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/building-2.svg" style="width: 20px; height: 20px; filter: brightness(0) invert(1);" alt="Building" />
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
    });
};

export default function LiveTrackingMap({
    markers,
    height = '320px',
    className = '',
    defaultCenter = [-8.1724, 113.6995], // default center Jember
    defaultZoom = 13,
    focusCoordinate,
}: Props) {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const layerGroup = useRef<L.LayerGroup | null>(null);

    useEffect(() => {
        if (!mapInstance.current || !focusCoordinate) return;
        mapInstance.current.setView([focusCoordinate.lat, focusCoordinate.lng], 16, { animate: true });
    }, [focusCoordinate]);

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
            let icon;
            if (m.type === 'truck') {
                icon = createTruckIcon(m.isOnline);
            } else if (m.type === 'company') {
                icon = createCompanyIcon(m.status);
            } else {
                icon = createBuildingIcon();
            }

            const marker = L.marker([m.lat, m.lng], { icon });

            const popupContent = m.popupHtml || `
                <div class="text-xs p-1">
                    <div class="font-bold text-slate-800">${m.title}</div>
                    ${m.subtitle ? `<div class="text-slate-500 mt-0.5">${m.subtitle}</div>` : ''}
                </div>
            `;
            marker.bindPopup(popupContent, { maxWidth: 320, minWidth: 220 });
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
