import { motion } from "framer-motion";

const subjects = [
  { name: "Physics", color: "from-blue-500 to-blue-700" },
  { name: "Chemistry", color: "from-green-500 to-emerald-700" },
  { name: "Mathematics", color: "from-orange-500 to-red-600" },
  { name: "Biology", color: "from-pink-500 to-rose-700" },
];

const SubjectsSection = () => {
  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Subjects Covered
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
            Comprehensive notes for all major subjects in CBSE & State Board syllabus.
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
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-muted-foreground/30 transition-all duration-300 text-center cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <span className="text-xl font-bold text-foreground">
                  {subject.name[0]}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
                {subject.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
