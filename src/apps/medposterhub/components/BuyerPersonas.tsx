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
        <section id="personas" className="py-12 sm:py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 sm:mb-14">
                    <h2 className="text-2xl sm:text-4xl font-sans font-extrabold text-slate-900 mb-2 sm:mb-4">
                        Designed for Real Medical Spaces
                    </h2>
                    <p className="text-sm sm:text-lg text-slate-500 max-w-2xl mx-auto">
                        Specialized resources tailored for every healthcare environment,
                        from private consultation rooms to hospital OPDs.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {personas.map((persona, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.08, duration: 0.4 }}
                            className="bg-[#F8FAFC] rounded-2xl p-4 sm:p-6 text-center border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 group"
                        >
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center ${persona.bg} ${persona.color} group-hover:scale-105 transition-transform duration-300`}>
                                <persona.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                            </div>
                            <h3 className="font-bold text-sm sm:text-lg text-slate-800 mb-1 sm:mb-2">{persona.title}</h3>
                            <p className="text-slate-500 leading-relaxed text-xs sm:text-sm line-clamp-3">{persona.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
