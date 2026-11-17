import React, { useState, useMemo } from 'react';
import StatCard from '@/Components/Admin/StatCard';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, router } from '@inertiajs/react';
import VehicleModal from './VehicleModal';
import {
    CarFront,
    Truck,
    Plus,
    Search,
    Edit2,
    Trash2,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    UserCheck,
    X,
} from 'lucide-react';

interface Driver {
    id: number;
    name: string;
    email: string;
}

interface Vehicle {
    id: number;
    name: string;
    license_plate: string;
    type: string;
    capacity: string | null;
    status: 'active' | 'maintenance' | 'inactive';
    notes: string | null;
    created_at: string;
    drivers?: Driver[];
}

interface Props {
    vehicles: Vehicle[];
    stats: {
        total: number;
        active: number;
        maintenance: number;
        inactive: number;
    };
    filters: {
        search: string;
        status: string;
    };
}

const VEHICLE_TYPES = ['Truk Boks', 'Truk Bak', 'Pick Up', 'Motor Roda Tiga', 'Minibus', 'Lainnya'];

export default function Index({ vehicles, stats, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'maintenance' | 'inactive'>((filters.status as any) || 'all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        license_plate: '',
        type: 'Truk Boks',
        capacity: '',
        status: 'active' as 'active' | 'maintenance' | 'inactive',
        notes: '',
    });

    const openCreateModal = () => {
        setEditingVehicle(null);
        reset();
        clearErrors();
        setData({
            name: '',
            license_plate: '',
            type: 'Truk Boks',
            capacity: '4 m³ / 1.500 kg',
            status: 'active',
            notes: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        clearErrors();
        setData({
            name: vehicle.name,
            license_plate: vehicle.license_plate,
            type: vehicle.type,
            capacity: vehicle.capacity || '',
            status: vehicle.status,
            notes: vehicle.notes || '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingVehicle(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingVehicle) {
            put(route('admin.vehicles.update', editingVehicle.id), { onSuccess: () => closeModal() });
        } else {
            post(route('admin.vehicles.store'), { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (vehicle: Vehicle) => {
        if (confirm(`Hapus armada "${vehicle.name} (${vehicle.license_plate})"?`)) {
            router.delete(route('admin.vehicles.destroy', vehicle.id));
        }
    };

    const handleReleaseDriver = (vehicle: Vehicle) => {
        const names = vehicle.drivers?.map((d) => d.name).join(', ');
        if (confirm(`Lepas ${names} dari "${vehicle.name}"? Armada akan tersedia untuk driver lain.`)) {
            router.patch(route('admin.vehicles.releaseDriver', vehicle.id), {}, { preserveScroll: true });
        }
    };

    const handleToggleStatus = (vehicle: Vehicle, newStatus: 'active' | 'maintenance' | 'inactive') => {
        router.patch(route('admin.vehicles.toggleStatus', vehicle.id), { status: newStatus });
    };

    const filteredVehicles = useMemo(() => {
        return vehicles.filter((v) => {
            const matchesSearch =
                v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.license_plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.type.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [vehicles, searchQuery, statusFilter]);

    return (
        <AdminLayout
            title="Inventaris Armada Operasional"
            subtitle="Manajemen data kendaraan operasional, plat nomor, kapasitas muat, dan kesiapan rute"
            activeTab="vehicles"
            headerAction={
                <button
                    onClick={openCreateModal}
                    className="adm-btn adm-btn-primary"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Armada</span>
                </button>
            }
        >
            <div className="space-y-6">
                {/* 1. Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard index={0} tone="brand" icon={CarFront} label="Total armada" value={stats.total} unit="unit" />
                    <StatCard index={1} tone="ok" icon={CheckCircle2} label="Siap jalan" value={stats.active} unit="aktif" />
                    <StatCard index={2} tone="warn" icon={AlertTriangle} label="Perawatan" value={stats.maintenance} unit="unit" />
                    <StatCard index={3} tone="bad" icon={XCircle} label="Nonaktif" value={stats.inactive} unit="unit" />
                </div>

                {/* 2. Filter & Search Controls */}
                <div className="bg-white rounded-md border border-slate-200/80 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="adm-seg" role="group" aria-label="Filter status armada">
                        {([
                            ['all', 'Semua', stats.total],
                            ['active', 'Siap jalan', stats.active],
                            ['maintenance', 'Perawatan', stats.maintenance],
                            ['inactive', 'Nonaktif', stats.inactive],
                        ] as const).map(([key, label, count]) => (
                            <button key={key} type="button" onClick={() => setStatusFilter(key)} aria-pressed={statusFilter === key} className="adm-seg-item">
                                {label} <span className="adm-seg-count">{count}</span>
                            </button>
                        ))}
                    </div>

                    <div className="relative min-w-[240px]">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari armada, plat nomor..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-emerald-500"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                                    <th className="py-3 px-4">Nama Armada</th>
                                    <th className="py-3 px-4">Plat Nomor</th>
                                    <th className="py-3 px-4">Kapasitas</th>
                                    <th className="py-3 px-4">Driver Aktif</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                {filteredVehicles.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">Tidak ada armada</td>
                                    </tr>
                                ) : (
                                    filteredVehicles.map((v) => (
                                        <tr key={v.id} className="hover:bg-slate-50/60">
                                            <td className="py-3.5 px-4 font-bold text-slate-900">
                                                <div>{v.name}</div>
                                                <div className="text-[10px] text-slate-400 font-normal">{v.type}</div>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono font-bold">{v.license_plate}</td>
                                            <td className="py-3.5 px-4">{v.capacity || '-'}</td>
                                            <td className="py-3.5 px-4 text-emerald-800 font-bold text-[11px]">
                                                {v.drivers?.length ? (
                                                    <div className="flex items-center gap-2">
                                                        <span>{v.drivers.map((d) => d.name).join(', ')}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleReleaseDriver(v)}
                                                            title="Lepas driver agar armada tersedia kembali"
                                                            aria-label={`Lepas driver dari ${v.name}`}
                                                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                                                        >
                                                            <X className="w-3 h-3" /> Lepas
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 font-normal italic">Standby</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <select
                                                    value={v.status}
                                                    onChange={(e) => handleToggleStatus(v, e.target.value as any)}
                                                    className="text-xs font-semibold rounded-lg border-slate-200 bg-white pl-2.5 pr-8 py-1.5 focus:border-green-deep focus:ring-lime"
                                                    aria-label={`Status ${v.name}`}
                                                >
                                                    <option value="active">Siap Jalan</option>
                                                    <option value="maintenance">Perawatan</option>
                                                    <option value="inactive">Nonaktif</option>
                                                </select>
                                            </td>
                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                <button onClick={() => openEditModal(v)} className="p-1.5 text-slate-500 hover:text-emerald-700">
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => handleDelete(v)} className="p-1.5 text-slate-400 hover:text-rose-600 ml-1">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <VehicleModal
                    isOpen={isModalOpen}
                    isEditing={Boolean(editingVehicle)}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                />
            </div>
        </AdminLayout>
    );
}
