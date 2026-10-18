import { motion } from "framer-motion";
import { posters, MEDPOSTER_AMAZON_URL } from "../data/posters";
import { Star, ShieldCheck, CheckCircle2, Truck, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
    // Duplicate posters for seamless loop
    const marqueePosters = [...posters.slice(0, 10), ...posters.slice(0, 10)];

    return (
        <section className="relative overflow-hidden pt-24 sm:pt-32 pb-10 bg-[#F8FAFC]">
            {/* Soft Ambient Light Gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[700px] h-[350px] bg-blue-100/60 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 text-center mb-10 sm:mb-14">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Top Amazon & Trust Badge */}
                    <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs mb-6 text-xs text-slate-700">
                        <a 
                            href={MEDPOSTER_AMAZON_URL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 transition-colors"
                        >
                            <span className="text-amber-700 font-extrabold">Amazon</span>
                            <span>Available on Amazon</span>
                            <ExternalLink className="w-2.5 h-2.5 text-amber-700 ml-0.5" />
                        </a>
                        <span className="text-slate-300 hidden sm:inline">•</span>
                        <div className="flex items-center gap-1 font-medium text-slate-600">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-slate-800">4.9/5</span> from 500+ Indian Clinics
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight text-slate-900 mb-4 sm:mb-6 leading-[1.15]">
                        Transform Clinic Walls Into <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Clinical Teaching Tools
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                        Medically verified anatomy charts and clinical illustrations available in{" "}
                        <strong className="text-slate-900 font-semibold">300 GSM Matte, Wooden Frames & Luxury Acrylic</strong>.
                    </p>

                    {/* 3 Physical Variants Highlight Pills */}
                    <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto mb-8 text-xs font-semibold text-slate-700">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                            <span className="block text-blue-600 font-bold">300 GSM Poster</span>
                            <span className="text-[10px] sm:text-xs text-slate-400 font-normal">From ₹699</span>
                        </div>
                        <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                            <span className="block text-indigo-600 font-bold">Gallery Framed</span>
                            <span className="text-[10px] sm:text-xs text-slate-400 font-normal">From ₹1,599</span>
                        </div>
                        <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                            <span className="block text-purple-600 font-bold">Ultra Acrylic</span>
                            <span className="text-[10px] sm:text-xs text-slate-400 font-normal">From ₹1,499</span>
                        </div>
                    </div>

                    {/* Mobile-optimized action buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <Button
                            size="lg"
                            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto h-12 px-8 rounded-full text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
                        >
                            <span>Browse Catalog</span>
                            <ArrowRight className="w-4 h-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => window.open("https://wa.me/919460970342?text=Hi, I want a custom clinic poster package", "_blank")}
                            className="w-full sm:w-auto h-12 px-8 rounded-full text-base font-semibold border-slate-300 text-slate-800 hover:bg-slate-100"
                        >
                            Custom Clinic Order
                        </Button>
                    </div>

                    {/* Mobile trust checkmarks */}
                    <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-6 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Doctor Reviewed
                        </span>
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                            Archival 250gsm Paper
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-indigo-600" />
                            Fast Pan-India Delivery
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Seamless Infinite Carousel */}
            <div className="w-full overflow-hidden py-4 sm:py-6 relative">
                <div className="absolute inset-y-0 left-0 w-12 sm:w-24 z-10 bg-gradient-to-r from-[#F8FAFC] to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-12 sm:w-24 z-10 bg-gradient-to-l from-[#F8FAFC] to-transparent pointer-events-none" />

                <motion.div
                    className="flex gap-3 sm:gap-5 min-w-max px-4"
                    animate={{ x: [0, -1200] }}
                    transition={{
                        duration: 45,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop"
                    }}
                >
                    {marqueePosters.map((poster, index) => (
                        <div
                            key={`${poster.id}-${index}`}
                            className="w-32 sm:w-44 flex-shrink-0 bg-white p-1.5 sm:p-2 rounded-xl border border-slate-200/80 shadow-xs"
                        >
                            <img
                                src={poster.image}
                                alt={poster.title}
                                className="w-full h-full object-cover rounded-lg aspect-[3/4]"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
