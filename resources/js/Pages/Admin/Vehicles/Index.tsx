import React, { useState, useMemo } from 'react';
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
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Armada</span>
                </button>
            }
        >
            <div className="space-y-6">
                {/* 1. Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Armada</span>
                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                                <CarFront className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
                            {stats.total}
                            <span className="text-xs font-medium text-slate-400 ml-1">unit</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Siap Jalan</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-emerald-700 tracking-tight tabular-nums">
                            {stats.active}
                            <span className="text-xs font-medium text-slate-400 ml-1">aktif</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Perawatan</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-amber-700 tracking-tight tabular-nums">
                            {stats.maintenance}
                            <span className="text-xs font-medium text-slate-400 ml-1">unit</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Nonaktif</span>
                            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                                <XCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-rose-700 tracking-tight tabular-nums">
                            {stats.inactive}
                            <span className="text-xs font-medium text-slate-400 ml-1">unit</span>
                        </div>
                    </div>
                </div>

                {/* 2. Filter & Search Controls */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                statusFilter === 'all'
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Semua ({stats.total})
                        </button>
                        <button
                            onClick={() => setStatusFilter('active')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                statusFilter === 'active'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                        >
                            Siap Jalan ({stats.active})
                        </button>
                        <button
                            onClick={() => setStatusFilter('maintenance')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                statusFilter === 'maintenance'
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            }`}
                        >
                            Perawatan ({stats.maintenance})
                        </button>
                        <button
                            onClick={() => setStatusFilter('inactive')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                statusFilter === 'inactive'
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            }`}
                        >
                            Nonaktif ({stats.inactive})
                        </button>
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

                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
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
                                                {v.drivers?.map((d) => d.name).join(', ') || <span className="text-slate-400 font-normal italic">Standby</span>}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <select
                                                    value={v.status}
                                                    onChange={(e) => handleToggleStatus(v, e.target.value as any)}
                                                    className="text-xs font-bold rounded px-2 py-1 border bg-slate-50"
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
