import { motion } from "framer-motion";
import { posters } from "../data/posters";
import { ClayButton } from "./ClayButton";

export const HeroSection = () => {
    // Duplicate posters for seamless loop
    const marqueePosters = [...posters, ...posters];

    return (
        <section className="relative overflow-hidden pt-32 pb-12 bg-medical-bg">
            {/* Abstract Background Shapes - Clay Bubbles */}
            <div className="absolute top-0 left-0 -z-10 h-full w-full overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-10 left-[10%] h-64 w-64 rounded-full bg-[#F4F7FB] shadow-clay-lg opacity-60"
                />
                <motion.div
                    animate={{ y: [0, 30, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/3 right-[5%] h-80 w-80 rounded-full bg-[#F4F7FB] shadow-clay-md opacity-60"
                />
            </div>

            <div className="container mx-auto px-4 text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-5xl mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-slate-900 mb-6 leading-tight drop-shadow-sm">
                        Upgrade Your Clinic Walls Into <br className="hidden md:block" />
                        <span className="font-handwritten text-brand-red text-5xl md:text-7xl font-normal">Teaching Tools</span>
                    </h1>

                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-500 mb-8 leading-relaxed">
                        Clinically accurate anatomical posters trusted by physiotherapists, medical students,
                        and healthcare professionals across India.
                    </p>

                    {/* Trust Bullets */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10 text-sm md:text-base font-medium text-slate-700">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </span>
                            Doctor-reviewed designs
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </span>
                            Premium laminated quality
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-600">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </span>
                            Fast delivery across India
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <ClayButton
                            variant="primary"
                            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-10 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all"
                        >
                            Browse Posters
                        </ClayButton>

                        <ClayButton
                            variant="secondary"
                            onClick={() => window.open("https://wa.me/919460970342?text=Hi, I want a custom poster order", "_blank")}
                            className="w-full sm:w-auto px-10 py-4 text-lg rounded-full border border-slate-200"
                        >
                            Custom Order
                        </ClayButton>
                    </div>
                </motion.div>
            </div>

            {/* Infinite Slideshow */}
            <div className="w-full overflow-hidden py-8 relative">
                <div className="absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-[#F4F7FB] to-transparent" />
                <div className="absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-[#F4F7FB] to-transparent" />

                <motion.div
                    className="flex gap-6 min-w-max px-4"
                    animate={{ x: [0, -1500] }} // Adjust based on width
                    transition={{
                        duration: 60, // Minimal speed (Very slow)
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop"
                    }}
                >
                    {marqueePosters.map((poster, index) => (
                        <div
                            key={`${poster.id}-${index}`}
                            className="w-48 md:w-56 h-auto flex-shrink-0 bg-white p-2 rounded-xl shadow-clay-sm"
                        >
                            <img
                                src={poster.image}
                                alt={poster.title}
                                className="w-full h-full object-cover rounded-lg aspect-[3/4]"
                                draggable={false}
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
