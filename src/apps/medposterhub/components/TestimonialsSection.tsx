import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
    {
        name: "Dr. Rajesh Kumar",
        role: "Orthopedic Surgeon",
        credibility: "12 yrs experience",
        quote: "The anatomical accuracy is impressive. Most posters I've seen are generic, but these highlight the clinical relevance perfectly.",
        avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop&crop=faces",
    },
    {
        name: "Dr. Priya Sharma",
        role: "Physiotherapist",
        credibility: "Sports Rehab Specialist",
        quote: "My patients love these! Having visual aids on the wall makes explaining injuries so much easier. The print quality is top-notch.",
        avatar: "https://images.unsplash.com/photo-1594824413326-07331823952f?w=200&h=200&fit=crop&crop=faces",
    },
    {
        name: "Arjun Mehta",
        role: "MBBS Student",
        credibility: "Final Year",
        quote: "A huge help for my revision. The charts are detailed and clear. Way better than scrolling through PDFs on a phone.",
        avatar: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&h=150&fit=crop&crop=faces",
    },
];

export const TestimonialsSection = () => {
    return (
        <section className="py-24 bg-[#F4F7FB] relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Trusted by Professionals</h2>
                    <p className="text-lg text-slate-500">Join thousands of satisfied doctors and students.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="bg-white rounded-3xl p-8 shadow-clay-sm hover:shadow-clay-md transition-shadow duration-300 relative"
                        >
                            <div className="absolute -top-6 left-8 bg-blue-600 text-white rounded-full p-2 shadow-lg">
                                <Quote className="w-5 h-5" />
                            </div>

                            <div className="mb-6 text-slate-600 italic leading-relaxed text-lg">
                                "{testimonial.quote}"
                            </div>

                            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-100">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover bg-slate-200"
                                />
                                <div>
                                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                                    <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{testimonial.role}</div>
                                    <div className="text-xs text-slate-400">{testimonial.credibility}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
