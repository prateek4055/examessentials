import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Dr. Ananya Iyer",
    role: "Physiotherapist",
    quote: "Excellent clarity for patient education. The dermatomes chart is a daily essential in my clinic.",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=150&h=150&fit=crop&crop=faces",
    rating: 5,
  },
  {
    name: "Dr. Sameer Khan",
    role: "Ortho Surgeon",
    quote: "Medically precise and professionally printed. The size options are perfect for our OPD walls.",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=faces",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "Medical Student",
    quote: "Helped me memorize the cranial nerves much faster than textbook diagrams. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=faces",
    rating: 5,
  }
];

export const ProductReviews = () => {
  return (
    <section className="py-12 border-t border-slate-100 mt-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
        <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
        Customer Reviews
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={review.avatar} 
                alt={review.name}
                className="w-12 h-12 rounded-full object-cover shadow-sm bg-slate-100"
              />
              <div>
                <h4 className="font-bold text-slate-900 leading-tight">{review.name}</h4>
                <p className="text-xs text-blue-600 font-semibold uppercase">{review.role}</p>
              </div>
            </div>
            
            <div className="relative">
              <Quote className="absolute -top-1 -left-1 w-4 h-4 text-blue-100 opacity-50" />
              <p className="text-slate-600 text-sm italic leading-relaxed pl-4">
                "{review.quote}"
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
