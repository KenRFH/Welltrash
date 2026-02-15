import React from "react";

const steps = [
    {
        id: 1,
        title: "Penjemputan Sampah",
        description: "Sampah anda dijemput oleh armada logistik kami yang terpercaya dan tepat waktu.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
        ),
    },
    {
        id: 2,
        title: "Penyortiran Terpusat",
        description: "Sampah diterima dan dipilah secara profesional di PT Sarana Utama Welltrash Farm.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
        ),
    },
    {
        id: 3,
        title: "Pengolahan Organik",
        description: "Limbah organik diolah menjadi pakan maggot (BSF) untuk ekosistem yang berkelanjutan.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
            </svg>
        ),
    },
    {
        id: 4,
        title: "Daur Ulang Anorganik",
        description: "Limbah anorganik disalurkan dan dijual kepada Creative Preneur untuk didaur ulang.",
        icon: (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
        ),
    },
];

const WasteFlow: React.FC = () => {
    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                     <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2 border border-blue-100 mb-4">
                        <span className="text-sm font-medium text-blue-700">
                            Proses Kami
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl font-poppins">
                        Alur Pengelolaan Sampah
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Kami memastikan setiap sampah dikelola dengan transparan dan bertanggung jawab demi lingkungan yang lebih baik.
                    </p>
                </div>

                {/* Flow Diagram */}
                <div className="relative">
                    {/* Horizontal Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-12 left-0 w-full h-1 bg-gray-200 -z-0 transform -translate-y-1/2" />
                    
                    {/* Vertical Connecting Line (Mobile) */}
                    <div className="lg:hidden absolute top-0 bottom-0 left-8 w-1 bg-gray-200 -z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                        {steps.map((step, index) => (
                            <div key={step.id} className="relative flex lg:flex-col items-start lg:items-center text-left lg:text-center group">
                                {/* Step Number Badge (Mobile/Desktop) */}
                                <div className="absolute -top-3 left-6 lg:-top-4 lg:-right-4 lg:left-auto lg:top-0 lg:right-1/4 bg-green-500 text-white w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center font-bold text-xs lg:text-sm shadow-md border-2 border-white z-20">
                                    {step.id}
                                </div>

                                {/* Icon Circle */}
                                <div className="relative w-16 h-16 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white mb-0 lg:mb-6 mr-6 lg:mr-0 z-10 transition-transform duration-300 group-hover:scale-110 group-hover:border-green-100 flex-shrink-0">
                                    <div className="text-green-600 group-hover:text-green-700 transition-colors">
                                        {/* Scale icon down for mobile */}
                                        {React.cloneElement(step.icon as React.ReactElement, { className: "w-6 h-6 lg:w-8 lg:h-8" })}
                                    </div>
                                    
                                    {/* Pulse Effect */}
                                    <div className="absolute inset-0 rounded-full bg-green-50 opacity-0 group-hover:animate-ping" />
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-1 lg:mb-2 font-poppins">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WasteFlow;
