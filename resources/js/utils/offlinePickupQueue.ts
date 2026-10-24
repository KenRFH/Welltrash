/**
 * Offline Pickup Queue Manager using IndexedDB.
 * Handles storage of pickup data when connection is lost,
 * and synchronizes automatically when connection is restored.
 */

export interface OfflinePickupRecord {
    id?: number;
    pickupId: number;
    companyName: string;
    organic_weight: string | number;
    anorganic_weight: string | number;
    residue_weight: string | number;
    evidence_blob: Blob;
    evidence_filename: string;
    offline_recorded_at: string; // ISO string
    created_at: number;
    retryCount?: number;
    lastError?: string;
}

export interface SyncResult {
    total: number;
    synced: number;
    sessionExpired: boolean;
    errors: string[];
}

const DB_NAME = 'welltrash_offline_db';
const DB_VERSION = 2;
const STORE_NAME = 'pickup_queue';

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !window.indexedDB) {
            return reject(new Error('IndexedDB tidak didukung pada browser ini.'));
        }

        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (db.objectStoreNames.contains(STORE_NAME)) {
                db.deleteObjectStore(STORE_NAME);
            }
            // Use pickupId as primary key so each pickup has a deterministic unique key
            db.createObjectStore(STORE_NAME, { keyPath: 'pickupId' });
        };

        request.onsuccess = () => {
            const db = request.result;
            db.onversionchange = () => {
                db.close();
            };
            resolve(db);
        };

        request.onerror = () => reject(request.error);
        request.onblocked = () => {
            console.warn('Database upgrade terblokir oleh tab lain.');
        };
    });
}

/**
 * Save or update offline pickup record in IndexedDB.
 */
export async function saveOfflinePickup(
    data: Omit<OfflinePickupRecord, 'created_at'>
): Promise<number> {
    const numericPickupId = Number(data.pickupId);
    if (!numericPickupId || isNaN(numericPickupId)) {
        throw new Error('ID penjemputan tidak valid.');
    }

    const existing = await getOfflinePickupByPickupId(numericPickupId);
    const db = await openDB();

    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);

            const record: Record<string, any> = {
                ...data,
                pickupId: numericPickupId,
                created_at: existing ? existing.created_at : Date.now(),
                retryCount: 0,
            };

            // Safeguard: NEVER allow id: undefined on the stored object
            if (store.keyPath === 'id') {
                if (existing && (existing as any).id !== undefined) {
                    record.id = (existing as any).id;
                } else {
                    delete record.id;
                }
            } else {
                delete record.id;
            }

            const req = store.put(record);
            req.onsuccess = () => resolve(numericPickupId);
            req.onerror = () => reject(req.error);
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Get all pending offline pickup records.
 */
export async function getOfflinePickups(): Promise<OfflinePickupRecord[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();

        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
    });
}

/**
 * Get pending pickup record by pickupId.
 */
export async function getOfflinePickupByPickupId(pickupId: number): Promise<OfflinePickupRecord | undefined> {
    const numericPickupId = Number(pickupId);
    const db = await openDB();
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);

            if (store.keyPath === 'pickupId') {
                const req = store.get(numericPickupId);
                req.onsuccess = () => resolve(req.result || undefined);
                req.onerror = () => reject(req.error);
            } else if (store.indexNames.contains('pickupId')) {
                const index = store.index('pickupId');
                const req = index.get(numericPickupId);
                req.onsuccess = () => resolve(req.result || undefined);
                req.onerror = () => reject(req.error);
            } else {
                const req = store.getAll();
                req.onsuccess = () => {
                    const list: OfflinePickupRecord[] = req.result || [];
                    resolve(list.find((item) => Number(item.pickupId) === numericPickupId));
                };
                req.onerror = () => reject(req.error);
            }
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Get array of pickup IDs that are currently pending sync.
 */
export async function getOfflinePickupIds(): Promise<number[]> {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);

            if (store.keyPath === 'pickupId') {
                const req = store.getAllKeys();
                req.onsuccess = () => {
                    const keys = req.result || [];
                    resolve(keys.map(k => Number(k)));
                };
                req.onerror = () => reject(req.error);
            } else {
                const req = store.getAll();
                req.onsuccess = () => {
                    const list: OfflinePickupRecord[] = req.result || [];
                    resolve(list.map(item => Number(item.pickupId)));
                };
                req.onerror = () => reject(req.error);
            }
        });
    } catch {
        return [];
    }
}

/**
 * Count total pending offline records.
 */
export async function countOfflinePickups(): Promise<number> {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.count();

            req.onsuccess = () => resolve(req.result || 0);
            req.onerror = () => reject(req.error);
        });
    } catch {
        return 0;
    }
}

/**
 * Remove record by its pickupId.
 */
export async function removeOfflinePickup(pickupId: number): Promise<void> {
    return removeOfflinePickupByPickupId(pickupId);
}

/**
 * Remove record by its pickupId.
 */
export async function removeOfflinePickupByPickupId(pickupId: number): Promise<void> {
    const numericPickupId = Number(pickupId);
    const db = await openDB();
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);

            if (store.keyPath === 'pickupId') {
                const req = store.delete(numericPickupId);
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            } else if (store.indexNames.contains('pickupId')) {
                const keyReq = store.index('pickupId').getKey(numericPickupId);
                keyReq.onsuccess = () => {
                    if (keyReq.result !== undefined) {
                        store.delete(keyReq.result);
                    }
                    resolve();
                };
                keyReq.onerror = () => reject(keyReq.error);
            } else {
                const allReq = store.getAll();
                allReq.onsuccess = () => {
                    const list: any[] = allReq.result || [];
                    const found = list.find((item) => Number(item.pickupId) === numericPickupId);
                    if (found && found.id !== undefined) {
                        store.delete(found.id);
                    }
                    resolve();
                };
                allReq.onerror = () => reject(allReq.error);
            }
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Get CSRF token from page meta tag or cookie.
 */
export function getCsrfToken(): string {
    const meta = document.querySelector('meta[name="csrf-token"]');
    if (meta) {
        const token = meta.getAttribute('content');
        if (token) return token;
    }

    const match = document.cookie.match(new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : '';
}

/**
 * Fetch fresh CSRF token from the server and update meta tag.
 */
export async function refreshCsrfToken(): Promise<string> {
    try {
        const pingRes = await fetch('/cleanup/sync-status', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        });

        if (pingRes.ok) {
            const data = await pingRes.json().catch(() => null);
            if (data?.csrf) {
                const meta = document.querySelector('meta[name="csrf-token"]');
                if (meta) {
                    meta.setAttribute('content', data.csrf);
                }
                return data.csrf;
            }
        }
    } catch {}
    return getCsrfToken();
}

/**
 * Clear all pending records in IndexedDB.
 */
export async function clearAllOfflinePickups(): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.clear();
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Synchronize a single record to the server.
 */
export async function syncSinglePickup(
    record: OfflinePickupRecord
): Promise<{ success: boolean; sessionExpired?: boolean; error?: string }> {
    let csrf = getCsrfToken();
    if (!csrf) {
        csrf = await refreshCsrfToken();
    }
    const numericPickupId = Number(record.pickupId);

    const buildFormData = () => {
        const formData = new FormData();
        formData.append('organic_weight', String(record.organic_weight));
        formData.append('anorganic_weight', String(record.anorganic_weight));
        formData.append('residue_weight', String(record.residue_weight));
        formData.append('offline_recorded_at', record.offline_recorded_at);
        formData.append(
            'evidence_pickup_path',
            record.evidence_blob,
            record.evidence_filename || `evidence_${numericPickupId}.jpg`
        );
        return formData;
    };

    const targetUrl = `/cleanup/submit-pickup/${numericPickupId}`;

    const executePost = async (token: string) => {
        return await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': token,
                'X-Requested-With': 'XMLHttpRequest',
                'X-Background-Sync': 'true',
                'Accept': 'application/json',
            },
            body: buildFormData(),
        });
    };

    try {
        let response = await executePost(csrf);

        // Auto retry once if session CSRF expired
        if (response.status === 419) {
            const freshToken = await refreshCsrfToken();
            if (freshToken) {
                csrf = freshToken;
                response = await executePost(csrf);
            }
        }

        if (response.ok) {
            await removeOfflinePickupByPickupId(numericPickupId);
            return { success: true };
        }

        if (response.status === 419 || response.status === 401) {
            return {
                success: false,
                sessionExpired: true,
                error: 'Sesi Anda telah berakhir. Silakan login kembali.',
            };
        }

        const data = await response.json().catch(() => null);
        const msg = data?.message || `Gagal mengunggah (HTTP ${response.status})`;

        try {
            const existing = await getOfflinePickupByPickupId(numericPickupId);
            if (existing) {
                const db = await openDB();
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                existing.retryCount = (existing.retryCount || 0) + 1;
                existing.lastError = msg;
                store.put(existing);
            }
        } catch {}

        return { success: false, error: msg };
    } catch (err: any) {
        return {
            success: false,
            error: err?.message || 'Gagal terhubung ke server.',
        };
    }
}


/**
 * Synchronize all pending offline pickups.
 */
export async function syncAllOfflinePickups(
    onProgress?: (current: number, total: number) => void
): Promise<SyncResult> {
    const records = await getOfflinePickups();
    const result: SyncResult = {
        total: records.length,
        synced: 0,
        sessionExpired: false,
        errors: [],
    };

    if (records.length === 0) {
        return result;
    }

    try {
        const pingRes = await fetch('/cleanup/sync-status', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        });

        if (pingRes.status === 401 || pingRes.status === 419) {
            result.sessionExpired = true;
            result.errors.push('Sesi kedaluwarsa. Data penjemputan tetap aman di HP.');
            return result;
        }

        if (pingRes.ok) {
            const pingData = await pingRes.json().catch(() => null);
            if (pingData?.csrf) {
                const meta = document.querySelector('meta[name="csrf-token"]');
                if (meta) meta.setAttribute('content', pingData.csrf);
            }
        }
    } catch {
        // Network might still be intermittent, try sync anyway
    }

    for (let i = 0; i < records.length; i++) {
        const item = records[i];
        if (onProgress) {
            onProgress(i + 1, records.length);
        }

        const res = await syncSinglePickup(item);
        if (res.success) {
            result.synced++;
        } else {
            if (res.sessionExpired) {
                result.sessionExpired = true;
                result.errors.push('Sesi kedaluwarsa saat sinkronisasi.');
                break;
            }
            if (res.error) {
                result.errors.push(`${item.companyName}: ${res.error}`);
            }
        }
    }

    return result;
}

