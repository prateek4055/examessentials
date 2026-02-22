import { CheckCircle2, Award, Zap, ShieldCheck } from "lucide-react";

const features = [
    {
        icon: Award,
        title: "Medically Accurate",
        desc: "Designed by doctors & anatomists for precision."
    },
    {
        icon: Zap,
        title: "High-DPI Print",
        desc: "Crystal clear visibility from any distance."
    },
    {
        icon: ShieldCheck,
        title: "Laminated & Durable",
        desc: "Water-resistant matte finish that lasts years."
    },
    {
        icon: CheckCircle2,
        title: "Vivid Colors",
        desc: "UV-resistant inks to prevent fading over time."
    }
];

export const FeaturesSection = () => {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Top Clinics Choose Us</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        We don't just print posters; we create educational assets that enhance your professional space.
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-center">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                                <f.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
