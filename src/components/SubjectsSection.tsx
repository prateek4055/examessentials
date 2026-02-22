import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const subjects = [
  { name: "Physics", color: "bg-blue-500", icon: "⚡" },
  { name: "Chemistry", color: "bg-green-500", icon: "🧪" },
  { name: "Mathematics", color: "bg-orange-500", icon: "📐" },
  { name: "Biology", color: "bg-pink-500", icon: "🧬" },
];

const SubjectsSection = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Subjects We Cover
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
            Comprehensive notes for all major subjects in CBSE & State Board syllabus
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/products?subject=${subject.name.toLowerCase()}`}
                className="group block p-6 rounded-xl bg-card border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${subject.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 text-3xl`}
                >
                  {subject.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                  {subject.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;