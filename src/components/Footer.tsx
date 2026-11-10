import { Link } from "react-router-dom";
import { Mail, Instagram, Linkedin, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.webp";

const Footer = () => {
  return (
    <footer
      className="relative bg-[#0B0D14] text-zinc-300 pt-16 pb-12 border-t border-white/[0.08] overflow-hidden font-sans"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 lg:gap-8">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-3 mb-5 group"
              aria-label="Exam Essentials - Go to homepage"
            >
              {/* High-contrast crisp logo badge */}
              <div className="h-10 w-10 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm border border-white/20 shrink-0 group-hover:scale-105 transition-transform duration-200">
                <img
                  src={logo}
                  alt="Exam Essentials Logo"
                  className="w-full h-full object-contain"
                  width={40}
                  height={40}
                />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Exam Essentials
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xs mb-4">
              Premium handwritten study notes, clinical reference apps, and high-accuracy anatomy wall charts for medical and competitive exam aspirants.
            </p>
          </div>

          {/* Company */}
          <nav aria-label="Company links">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-zinc-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-zinc-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-zinc-400 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/medposterhub" className="text-zinc-400 hover:text-white transition-colors">
                  MedPosterHub
                </Link>
              </li>
            </ul>
          </nav>

          {/* Study Prep */}
          <nav aria-label="Notes by class">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-4">
              Study Prep
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/class-11-notes" className="text-zinc-400 hover:text-white transition-colors">
                  Class 11 Notes
                </Link>
              </li>
              <li>
                <Link to="/class-12-notes" className="text-zinc-400 hover:text-white transition-colors">
                  Class 12 Notes
                </Link>
              </li>
              <li>
                <Link to="/neet-notes" className="text-zinc-400 hover:text-white transition-colors">
                  NEET Notes
                </Link>
              </li>
              <li>
                <Link to="/products?search=mindmap" className="text-zinc-400 hover:text-white transition-colors">
                  Mind Maps
                </Link>
              </li>
            </ul>
          </nav>

          {/* Clinical Apps (All 6 medical apps) */}
          <nav aria-label="Our Apps">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-4">
              Our Apps
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/medortho" className="text-zinc-400 hover:text-white transition-colors flex items-center justify-between">
                  <span>MedOrtho</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Live</span>
                </Link>
              </li>
              <li>
                <Link to="/medcardio" className="text-zinc-400 hover:text-white transition-colors">
                  MedCardio
                </Link>
              </li>
              <li>
                <Link to="/medneuro" className="text-zinc-400 hover:text-white transition-colors">
                  MedNeuro
                </Link>
              </li>
              <li>
                <Link to="/medphysio" className="text-zinc-400 hover:text-white transition-colors">
                  MedPhysio
                </Link>
              </li>
              <li>
                <Link to="/medradio" className="text-zinc-400 hover:text-white transition-colors">
                  MedRadio
                </Link>
              </li>
              <li>
                <Link to="/medpharma" className="text-zinc-400 hover:text-white transition-colors">
                  MedPharma
                </Link>
              </li>
            </ul>
          </nav>

          {/* Learning & Resources */}
          <nav aria-label="Resources">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-4">
              Learning
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/blog" className="text-zinc-400 hover:text-white transition-colors">
                  Clinical Articles
                </Link>
              </li>
              <li>
                <Link to="/medortho/special-tests" className="text-zinc-400 hover:text-white transition-colors">
                  Ortho Special Tests
                </Link>
              </li>
              <li>
                <Link to="/products?search=physics" className="text-zinc-400 hover:text-white transition-colors">
                  Physics Topper Notes
                </Link>
              </li>
              <li>
                <Link to="/products?search=biology" className="text-zinc-400 hover:text-white transition-colors">
                  Biology Topper Notes
                </Link>
              </li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal links">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-zinc-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-zinc-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-zinc-400 hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-zinc-400 hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </nav>

        </div>

        {/* Social & Copyright Bar */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p className="text-xs text-zinc-400">
              © {new Date().getFullYear()} Exam Essentials. All rights reserved.
            </p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
              India's Premier Handwritten Notes, Anatomy Posters &amp; Clinical Apps
            </p>
          </div>
          
          <div className="flex items-center gap-3" role="navigation" aria-label="Social media links">
            <a
              href="mailto:examessentials.info@gmail.com"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.06] text-zinc-400 hover:bg-white/[0.14] hover:text-white transition-all duration-200 border border-white/[0.08]"
              aria-label="Email us"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/exam_essentials_?igsh=MW1xM3puOWgydGVrYw=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.06] text-zinc-400 hover:bg-white/[0.14] hover:text-white transition-all duration-200 border border-white/[0.08]"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/company/exam-essentials7"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.06] text-zinc-400 hover:bg-white/[0.14] hover:text-white transition-all duration-200 border border-white/[0.08]"
              aria-label="Connect with us on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=919460970342"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.06] text-zinc-400 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-200 border border-white/[0.08]"
              aria-label="Chat with us on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
