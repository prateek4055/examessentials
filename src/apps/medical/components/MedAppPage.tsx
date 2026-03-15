import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search, Heart, Brain, Eye, Zap, FileText, BookOpen, GraduationCap,
  Activity, Stethoscope, Dumbbell, Hand, Waves, ClipboardList,
  Scan, Layers, FileImage, PenTool, Pill, GitBranch, Table, Lightbulb,
  ArrowRight, Download, Bell, ChevronRight, Sparkles, Star, Users, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MedAppData, MedAppFeature } from "../data/medicalAppsData";
import { getOtherApps } from "../data/medicalAppsData";

// Icon mapping from string names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search, Heart, Brain, Eye, Zap, FileText, BookOpen, GraduationCap,
  Activity, Stethoscope, Dumbbell, Hand, Waves, ClipboardList,
  Scan, Layers, FileImage, PenTool, Pill, GitBranch, Table, Lightbulb,
  Bone: Shield, // fallback
};

const FeatureIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = iconMap[name] || Sparkles;
  return <Icon className={className} />;
};

interface MedAppPageProps {
  app: MedAppData;
}

const MedAppPage = ({ app }: MedAppPageProps) => {
  const otherApps = getOtherApps(app.slug);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-hidden">
      {/* ─── HERO ─── */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center"
        style={{ background: app.theme.heroBg }}
      >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]"
            style={{ background: app.theme.accent }}
          />
          <div
            className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] rounded-full opacity-15 blur-[80px]"
            style={{ background: app.theme.primary }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]"
            style={{ background: app.theme.accentLight }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${app.theme.accent}40 1px, transparent 1px), linear-gradient(90deg, ${app.theme.accent}40 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Navigation bar */}
        <nav className="absolute top-0 left-0 right-0 z-50">
          <div className="container mx-auto px-4 py-5 flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
            >
              <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Exam Essentials</span>
            </Link>
            <Link
              to="/#ecosystem"
              className="text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              All Apps
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-8"
            >
              <div
                className="inline-block p-1 rounded-[2rem] shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${app.theme.accent}40, ${app.theme.primary}60)`,
                  boxShadow: `0 20px 60px ${app.theme.primary}60`,
                }}
              >
                <img
                  src={app.logo}
                  alt={`${app.name} Logo`}
                  className="w-28 h-28 md:w-36 md:h-36 rounded-[1.75rem] object-cover"
                />
              </div>
            </motion.div>

            {/* Coming Soon badge */}
            {!app.published && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <span
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold tracking-wide uppercase shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${app.theme.badgeBg}, ${app.theme.accentLight})`,
                    color: app.theme.badgeText,
                    boxShadow: `0 4px 20px ${app.theme.badgeBg}50`,
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Coming Soon
                </span>
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight"
            >
              <span className="text-white">{app.name.slice(0, 3)}</span>
              <span style={{ color: app.theme.accent }}>{app.name.slice(3)}</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="text-xl md:text-2xl text-white/80 mb-4 font-medium max-w-2xl mx-auto"
            >
              {app.tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="text-base md:text-lg text-white/50 mb-10 max-w-xl mx-auto"
            >
              {app.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {app.published && app.playStoreLink ? (
                <>
                  <a href={app.playStoreLink} target="_blank" rel="noopener noreferrer">
                    <Button
                      size="lg"
                      className="rounded-full h-14 px-10 text-lg font-bold shadow-xl hover:scale-105 transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${app.theme.accent}, ${app.theme.primary})`,
                        color: "#FFF",
                        boxShadow: `0 8px 30px ${app.theme.accent}40`,
                      }}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download on Play Store
                    </Button>
                  </a>
                  <Link to="/#ecosystem">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full h-14 px-10 text-lg font-medium border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                    >
                      Explore More Apps
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="rounded-full h-14 px-10 text-lg font-bold shadow-xl hover:scale-105 transition-all duration-300 cursor-default"
                    style={{
                      background: `linear-gradient(135deg, ${app.theme.accent}, ${app.theme.primary})`,
                      color: "#FFF",
                      boxShadow: `0 8px 30px ${app.theme.accent}40`,
                    }}
                  >
                    <Bell className="w-5 h-5 mr-2" />
                    Launching Soon — Stay Tuned!
                  </Button>
                  <Link to="/#ecosystem">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full h-14 px-10 text-lg font-medium border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                    >
                      Explore Available Apps
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Highlights pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap gap-3 justify-center mt-10"
            >
              {app.highlights.map((h) => (
                <span
                  key={h}
                  className="px-4 py-2 rounded-full text-sm font-medium border"
                  style={{
                    borderColor: `${app.theme.accent}30`,
                    color: app.theme.accentLight,
                    background: `${app.theme.accent}10`,
                  }}
                >
                  {h}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0F] to-transparent" />
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-white">What's Inside </span>
              <span style={{ color: app.theme.accent }}>{app.name}</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Powerful features designed to accelerate your medical learning
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {app.features.map((feature: MedAppFeature, index: number) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative p-8 rounded-2xl border transition-all duration-500 hover:-translate-y-1"
                style={{
                  background: app.theme.cardBg,
                  borderColor: `${app.theme.accent}15`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${app.theme.accent}40`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${app.theme.primary}30`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${app.theme.accent}15`;
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: `linear-gradient(135deg, ${app.theme.primary}40, ${app.theme.accent}20)`,
                    color: app.theme.accent,
                  }}
                >
                  <FeatureIcon name={feature.icon} className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT / DETAILS ─── */}
      <section className="py-24 relative">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(${app.theme.accent} 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — details */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="text-white">Why Choose </span>
                <span style={{ color: app.theme.accent }}>{app.name}?</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                {app.longDescription}
              </p>

              {/* Target audience */}
              <div className="mb-8">
                <h3 className="text-sm uppercase tracking-wider text-white/40 mb-4 font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Built For
                </h3>
                <div className="flex flex-wrap gap-2">
                  {app.targetAudience.map((audience) => (
                    <span
                      key={audience}
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{
                        background: `${app.theme.primary}30`,
                        color: app.theme.accentLight,
                        border: `1px solid ${app.theme.primary}40`,
                      }}
                    >
                      {audience}
                    </span>
                  ))}
                </div>
              </div>

              {app.published && app.playStoreLink && (
                <a href={app.playStoreLink} target="_blank" rel="noopener noreferrer">
                  <Button
                    className="rounded-full h-12 px-8 font-bold hover:scale-105 transition-transform"
                    style={{
                      background: `linear-gradient(135deg, ${app.theme.accent}, ${app.theme.primary})`,
                      color: "#FFF",
                    }}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Get it on Play Store
                  </Button>
                </a>
              )}
            </motion.div>

            {/* Right — stats / visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div
                className="rounded-3xl p-10 border relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${app.theme.primary}15, ${app.theme.accent}08)`,
                  borderColor: `${app.theme.accent}15`,
                }}
              >
                {/* Decorative glow */}
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-30"
                  style={{ background: app.theme.accent }}
                />

                <div className="relative z-10 space-y-8">
                  {app.highlights.map((stat, i) => (
                    <div key={stat} className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${app.theme.accent}30, ${app.theme.primary}20)`,
                        }}
                      >
                        <Star className="w-5 h-5" style={{ color: app.theme.accent }} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">{stat}</p>
                        <p className="text-white/40 text-sm">
                          {i === 0 && "Comprehensive content library"}
                          {i === 1 && "Crystal clear visual learning"}
                          {i === 2 && "Learn without internet"}
                          {i === 3 && "Fresh content every month"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── COMING SOON NOTIFY (only for unpublished) ─── */}
      {!app.published && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto text-center rounded-3xl p-12 border relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${app.theme.primary}15, ${app.theme.accent}08)`,
                borderColor: `${app.theme.accent}20`,
              }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: `radial-gradient(ellipse at center, ${app.theme.accent}30, transparent 70%)`,
                }}
              />
              <div className="relative z-10">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${app.theme.accent}30, ${app.theme.primary}20)`,
                  }}
                >
                  <Bell className="w-10 h-10" style={{ color: app.theme.accent }} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {app.name} is Coming Soon
                </h3>
                <p className="text-white/50 text-lg mb-8 max-w-md mx-auto">
                  We're working hard to bring you the best {app.name.slice(3).toLowerCase()} learning experience.
                  Follow us to be the first to know when we launch!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="https://wa.me/919460970342" target="_blank" rel="noopener noreferrer">
                    <Button
                      className="rounded-full h-12 px-8 font-bold hover:scale-105 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${app.theme.accent}, ${app.theme.primary})`,
                        color: "#FFF",
                        boxShadow: `0 4px 20px ${app.theme.accent}30`,
                      }}
                    >
                      Get Notified on WhatsApp
                    </Button>
                  </a>
                  <Link to="/#ecosystem">
                    <Button
                      variant="outline"
                      className="rounded-full h-12 px-8 font-medium border-white/20 text-white hover:bg-white/10"
                    >
                      See Available Apps
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── EXPLORE MORE APPS ─── */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Explore More Apps
            </h2>
            <p className="text-white/40 text-lg">
              Part of the Exam Essentials medical education ecosystem
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {otherApps.slice(0, 5).map((other, index) => (
              <motion.div
                key={other.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                <Link
                  to={`/${other.slug}`}
                  className="group block p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 no-underline"
                  style={{
                    background: other.theme.cardBg,
                    borderColor: `${other.theme.accent}15`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${other.theme.accent}40`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${other.theme.primary}25`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${other.theme.accent}15`;
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={other.logo}
                      alt={other.name}
                      className="w-14 h-14 rounded-xl object-cover"
                      loading="lazy"
                    />
                    <div>
                      <h3 className="text-white font-bold text-lg group-hover:text-white/90 transition-colors">
                        {other.name}
                      </h3>
                      {!other.published && (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: `${other.theme.badgeBg}30`,
                            color: other.theme.accent,
                          }}
                        >
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed">{other.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium" style={{ color: other.theme.accent }}>
                    Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Back to ecosystem */}
          <div className="text-center mt-12">
            <Link to="/#ecosystem">
              <Button
                variant="outline"
                className="rounded-full h-12 px-8 font-medium border-white/20 text-white hover:bg-white/10"
              >
                View Full Ecosystem
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-10 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <Link to="/" className="text-white/50 hover:text-white/80 transition-colors text-sm">
            © {new Date().getFullYear()} Exam Essentials — India's Best Education Ecosystem
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default MedAppPage;
