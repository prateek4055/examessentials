import { motion } from "framer-motion";
import { Building2, Stethoscope, GraduationCap, School } from "lucide-react";

export const BuyerPersonas = () => {
    const personas = [
        {
            icon: Stethoscope,
            title: "Physiotherapy Clinics",
            desc: "Expert posters to educate patients on injury & recovery protocols.",
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            icon: Building2,
            title: "Hospitals & OPDs",
            desc: "Professional anatomical references for high-volume clinical settings.",
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            icon: GraduationCap,
            title: "Medical Students",
            desc: "High-yield study aids for rapid revision and exam prep.",
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            icon: School,
            title: "Teaching Institutes",
            desc: "Large-format charts designed for classroom visibility.",
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Designed for Real Medical Spaces</h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Specialized resources tailored for every healthcare environment,
                        from private clinics to large teaching hospitals.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {personas.map((persona, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            className="bg-[#F8FAFC] rounded-2xl p-8 text-center border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                            <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center ${persona.bg} ${persona.color} group-hover:scale-110 transition-transform duration-300`}>
                                <persona.icon className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-xl text-slate-800 mb-3">{persona.title}</h3>
                            <p className="text-slate-500 leading-relaxed text-sm md:text-base">{persona.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
