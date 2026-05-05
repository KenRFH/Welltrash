import { Head, Link } from '@inertiajs/react';
import React from 'react';
import Navbar from '@/Components/Navbar';

interface Activity {
    id: number;
    title: string;
    description: string;
    image_path: string | null;
    date: string | null;
}

interface Props {
    activity: Activity;
    canLogin: boolean;
    canRegister: boolean;
}

export default function ActivityDetail({ activity, canLogin, canRegister }: Props) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-green-500 selection:text-white">
            <Head title={`${activity.title} | Aktivitas Welltrash`} />
            
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <Link href={route('activity')} className="inline-flex items-center text-gray-500 hover:text-green-600 font-medium mb-8 transition-colors group">
                    <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Kembali ke Daftar Aktivitas
                </Link>

                <article className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    {activity.image_path ? (
                        <div className="w-full h-[400px] md:h-[500px] relative">
                            <img src={`/storage/${activity.image_path}`} alt={activity.title} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-full h-[300px] bg-green-50 flex items-center justify-center text-green-200">
                            <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                    )}
                    
                    <div className="p-8 md:p-12 lg:p-16">
                        {activity.date && (
                            <div className="text-sm font-bold text-green-500 mb-4 uppercase tracking-wider">
                                {new Date(activity.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        )}
                        
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-8 leading-tight">
                            {activity.title}
                        </h1>
                        
                        <div className="prose prose-lg prose-green max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {activity.description}
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
}
