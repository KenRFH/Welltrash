import { Link } from '@inertiajs/react';
import SEO from '@/Components/SEO';
import React from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

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
        <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 flex flex-col justify-between">
            <SEO 
                title={`${activity.title} | Aktivitas Welltrash`}
                description={activity.description.substring(0, 160)}
                image={activity.image_path ? `https://welltrash.id/storage/${activity.image_path}` : undefined}
                type="article"
            />
            
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
                <Link href={route('activity')} className="inline-flex items-center text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium mb-8 transition-colors group">
                    <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Kembali ke Daftar Aktivitas
                </Link>

                <article className="bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-zinc-100 dark:border-zinc-800">
                    {activity.image_path ? (
                        <div className="w-full h-[400px] md:h-[500px] relative">
                            <img src={`/storage/${activity.image_path}`} alt={activity.title} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-full h-[300px] bg-emerald-50 dark:bg-zinc-800 flex items-center justify-center text-emerald-200 dark:text-zinc-600">
                            <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                    )}
                    
                    <div className="p-8 md:p-12 lg:p-16">
                        {activity.date && (
                            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-4 uppercase tracking-wider font-mono">
                                {new Date(activity.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        )}
                        
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white mb-8 leading-tight">
                            {activity.title}
                        </h1>
                        
                        <div className="prose prose-lg prose-emerald dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {activity.description}
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
