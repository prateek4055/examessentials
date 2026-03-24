import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export const AboutUsSection = () => {
    return (
        <section id="about" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="inline-block bg-blue-50 text-blue-700 font-semibold px-4 py-1.5 rounded-full text-sm mb-2 border border-blue-100">
                            About MedPosterHub
                        </div>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
                            Elevating Patient Education in Clinical Practice
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            At MedPosterHub, we understand that a doctor's walls are an extension of their practice. That's why we've partnered with leading anatomists to curate the finest collection of clinical-grade medical posters in India.
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Trusted by hundreds of clinics, hospitals, and medical colleges, our high-resolution charts do more than just decorate — they help you explain complex conditions to patients clearly and effectively.
                        </p>

                        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                "Medically Accurate Details",
                                "Premium 250gsm Matte Finish",
                                "UV-Resistant Vibrant Inks",
                                "Perfect for Clinics & Hospitals",
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-slate-700 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10">
                            <img 
                                src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80" 
                                alt="Doctor explaining anatomy to a patient" 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                <h3 className="text-2xl font-bold mb-2">Built for Professionals</h3>
                                <p className="text-slate-200">Enhance your consultation room with visual aids that patients understand.</p>
                            </div>
                        </div>
                        
                        {/* Decorative elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
                        <div className="absolute top-1/2 -translate-y-1/2 -left-12 w-24 h-48 bg-slate-100 rounded-full blur-2xl opacity-50 pointer-events-none" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
