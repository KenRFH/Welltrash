export const parseCoordinatesOrGoogleMapsUrl = (input: string): { lat: number; lng: number } | null => {
    const s = input.trim();
    if (!s) return null;
    const raw = s.match(/(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/);
    if (raw) {
        const lat = parseFloat(raw[1]), lng = parseFloat(raw[2]);
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) return { lat, lng };
    }
    const at = s.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (at) return { lat: parseFloat(at[1]), lng: parseFloat(at[2]) };
    const q = s.match(/[?&](?:q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (q) return { lat: parseFloat(q[1]), lng: parseFloat(q[2]) };
    return null;
};
