import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Zap, Loader2 } from 'lucide-react';

export interface QuickAccount {
    role: string;
    label: string;
    actorTitle: string;
    email: string;
    password: string;
    dotColor: string;
}

// ponytail: Hardcoded seeded demo credentials; upgrade to dynamic seeder-driven config if auth schema changes.
const DEMO_ACCOUNTS: Record<'staff' | 'mitra', QuickAccount[]> = {
    staff: [
        { role: 'admin', label: 'Admin', actorTitle: 'Hak Akses & Sistem', email: 'admin@welltrash.com', password: 'admin123', dotColor: 'bg-violet-500' },
        { role: 'web_admin', label: 'Web Admin', actorTitle: 'Kelola Tampilan', email: 'webadmin@welltrash.com', password: 'webadmin123', dotColor: 'bg-sky-500' },
        { role: 'CleanUP', label: 'Operator', actorTitle: 'Armada CleanUP', email: 'cleanup@welltrash.com', password: 'cleanup123', dotColor: 'bg-emerald-500' },
    ],
    mitra: [
        { role: 'company', label: 'Mitra Bisnis', actorTitle: 'PT WellTrash Sejahtera (B2B)', email: 'company@welltrash.com', password: 'company123', dotColor: 'bg-emerald-500' },
    ],
};

interface Props {
    isDemo?: boolean;
    onFill: (email: string, password: string) => void;
    activeEmail?: string;
    submitRoute?: string;
    actorScope?: 'staff' | 'mitra';
}

export default function QuickLoginDemo({
    isDemo = false,
    onFill,
    activeEmail,
    submitRoute,
    actorScope = 'mitra',
}: Props) {
    const [submittingRole, setSubmittingRole] = useState<string | null>(null);

    if (!isDemo) return null;

    const accounts = DEMO_ACCOUNTS[actorScope] || DEMO_ACCOUNTS.mitra;

    const handleDirectLogin = (account: QuickAccount) => {
        setSubmittingRole(account.role);
        onFill(account.email, account.password);

        const targetRoute = submitRoute || (actorScope === 'mitra' ? route('login') : route('admin.login'));

        router.post(
            targetRoute,
            { email: account.email, password: account.password, remember: true },
            { onFinish: () => setSubmittingRole(null) }
        );
    };

    return (
        <div className="mb-5 p-3.5 rounded-2xl bg-zinc-50/90 border border-zinc-200/90">
            <div className="flex items-center justify-between mb-2.5 px-0.5">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-700 tracking-wide uppercase">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {actorScope === 'mitra' ? 'Kredensial Demo Mitra' : 'Kredensial Demo Staf Internal'}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">klik ⚡ login instan</span>
            </div>

            <div className={`grid gap-2 ${actorScope === 'mitra' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
                {accounts.map((acc) => {
                    const isActive = activeEmail === acc.email;
                    const isBusy = submittingRole === acc.role;

                    return (
                        <div
                            key={acc.role}
                            onClick={() => onFill(acc.email, acc.password)}
                            title={`Isi otomatis kredensial ${acc.label}`}
                            className={`group relative flex items-center justify-between p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                                isActive
                                    ? 'border-emerald-500 bg-white shadow-xs ring-1 ring-emerald-500/20'
                                    : 'border-zinc-200/80 bg-white/80 hover:border-zinc-300 hover:bg-white'
                            }`}
                        >
                            <div className="min-w-0 pr-1">
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${acc.dotColor}`} />
                                    <span className="text-xs font-bold text-zinc-900 leading-tight truncate">
                                        {acc.label}
                                    </span>
                                </div>
                                <p className="text-[10px] text-emerald-700 font-semibold truncate mt-0.5">
                                    {acc.actorTitle}
                                </p>
                                <p className="text-[10px] text-zinc-400 truncate mt-0.5 font-mono">
                                    {acc.email}
                                </p>
                            </div>

                            <button
                                type="button"
                                title={`Langsung masuk sebagai ${acc.label}`}
                                disabled={Boolean(submittingRole)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDirectLogin(acc);
                                }}
                                className="shrink-0 p-2 rounded-lg bg-zinc-100 hover:bg-emerald-600 text-zinc-500 hover:text-white transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
                            >
                                {isBusy ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600 group-hover:text-white" />
                                ) : (
                                    <Zap className="w-3.5 h-3.5" />
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
