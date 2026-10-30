import React from 'react';
import { Link } from '@inertiajs/react';
import { MapPin, Scale, Navigation, ArrowUpRight, X, CheckCircle2, Radio, Clock, MessageCircle } from 'lucide-react';
import { CompanyLocation } from './MonitoringMap';

interface Props {
    company: CompanyLocation | null;
    onClose: () => void;
    onFocusMap: (lat: number, lng: number) => void;
}

export default function MonitoringCompanyDetailModal({ company, onClose, onFocusMap }: Props) {
    if (!company) return null;
    const wa = company.phone?.startsWith('0') ? '62' + company.phone.slice(1) : company.phone;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div>
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {company.business_category || 'Mitra'} • {company.subscription_plan || 'Reguler'}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 mt-1">{company.company_name}</h3>
                    </div>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                </div>

                <div className="py-3 space-y-2.5 text-xs text-slate-700">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5">
                            {company.status === 'completed' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : company.status === 'on_the_way' ? <Radio className="w-4 h-4 text-amber-600 animate-pulse" /> : <Clock className="w-4 h-4 text-blue-600" />}
                            <span>{company.status === 'completed' ? 'Sudah Diambil' : company.status === 'on_the_way' ? 'Armada OTW' : company.status === 'scheduled' ? 'Terjadwal' : 'Tanpa Jadwal'}</span>
                        </span>
                        {company.pickup_time && <span className="font-mono font-bold text-[11px]">{company.pickup_time} WIB</span>}
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Armada & Driver</div>
                        <div className="flex items-center justify-between">
                            <span>Driver: <strong>{company.driver_name || '-'}</strong></span>
                            {company.vehicle_plate ? (
                                <span className="px-2 py-0.5 bg-slate-900 text-white font-mono font-bold rounded text-[10px]">
                                    {company.vehicle_plate} {company.vehicle_name ? `(${company.vehicle_name})` : ''}
                                </span>
                            ) : <span className="text-slate-400 italic">Belum ada armada</span>}
                        </div>
                    </div>

                    {company.status === 'completed' && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                            <div className="text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1 mb-1">
                                <Scale className="w-3.5 h-3.5" /> Timbangan: {company.total_weight || 0} Kg
                            </div>
                            <div className="text-[11px] text-slate-500">
                                Organik: {company.organic_weight || 0} Kg • Anorganik: {company.anorganic_weight || 0} Kg • Residu: {company.residue_weight || 0} Kg
                            </div>
                        </div>
                    )}

                    <div className="space-y-1 pt-1">
                        <div className="flex items-start gap-1.5 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{company.address}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500 pt-0.5">
                            <span>PIC: <strong>{company.pic_name || '-'}</strong></span>
                            {company.phone && (
                                <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold hover:underline flex items-center gap-1">
                                    <MessageCircle className="w-3 h-3" /> WA: {company.phone}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button onClick={() => { onFocusMap(company.latitude, company.longitude); onClose(); }} className="px-3 py-1.5 rounded-xl border bg-slate-50 hover:bg-slate-100 text-xs font-bold flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-emerald-600" /> Fokus Peta
                    </button>
                    <Link href={company.detail_url} className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1">
                        <span>Profil Lengkap</span> <ArrowUpRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
