import { Link } from "react-router-dom";
import { Mail, Instagram, Linkedin, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="relative bg-[#0A0F1C] py-20 border-t border-white/5 overflow-hidden" role="contentinfo" aria-label="Site footer">
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[#4DA6FF]/30 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group" aria-label="Exam Essentials - Go to homepage">
              <div className="relative">
                <div className="absolute inset-0 bg-[#4DA6FF]/20 blur-lg rounded-lg group-hover:bg-[#4DA6FF]/40 transition-colors" />
                <img
                  src={logo}
                  alt="Exam Essentials"
                  className="relative h-11 w-11 rounded-xl object-cover border border-white/10"
                  width={44}
                  height={44}
                />
              </div>
              <span className="font-display text-xl font-bold text-white tracking-tight">
                Exam Essentials
              </span>
            </Link>
            <p className="font-body text-sm text-[#CBD5E1] leading-relaxed max-w-xs">
              India's #1 premium handwritten notes for Class 11 & 12 students. Empowering medical and engineering aspirants with simplified clinical education.
            </p>
          </div>

          {/* Company */}
          <nav aria-label="Company links">
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-[0.2em] mb-6">
              Company
            </h4>
            <ul className="space-y-4 font-body text-sm">
              <li>
                <Link to="/about" className="text-[#CBD5E1] hover:text-[#4DA6FF] transition-all hover:translate-x-1 inline-block">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#CBD5E1] hover:text-[#4DA6FF] transition-all hover:translate-x-1 inline-block">Contact</Link>
              </li>
              <li>
                <Link to="/products" className="text-[#CBD5E1] hover:text-[#4DA6FF] transition-all hover:translate-x-1 inline-block">All Products</Link>
              </li>
            </ul>
          </nav>

          {/* Notes */}
          <nav aria-label="Notes by class">
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-[0.2em] mb-6">
              Study Prep
            </h4>
            <ul className="space-y-4 font-body text-sm">
              <li>
                <Link to="/class-11-notes" className="text-[#CBD5E1] hover:text-[#4DA6FF] transition-all hover:translate-x-1 inline-block">Class 11</Link>
              </li>
              <li>
                <Link to="/class-12-notes" className="text-[#CBD5E1] hover:text-[#4DA6FF] transition-all hover:translate-x-1 inline-block">Class 12</Link>
              </li>
              <li>
                <Link to="/neet-notes" className="text-[#CBD5E1] hover:text-[#4DA6FF] transition-all hover:translate-x-1 inline-block">NEET Notes</Link>
              </li>
            </ul>
          </nav>

          {/* Our Apps */}
          <nav aria-label="Our Apps">
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-[0.2em] mb-6">
              Our Apps
            </h4>
            <ul className="space-y-4 font-body text-sm">
              <li>
                <Link to="/medortho" className="text-[#CBD5E1] hover:text-[#4DA6FF] transition-all hover:translate-x-1 inline-block">MedOrtho</Link>
              </li>
              <li>
                <Link to="/medneuro" className="text-[#CBD5E1] hover:text-[#4DA6FF] transition-all hover:translate-x-1 inline-block">MedNeuro</Link>
              </li>
              <li>
                <Link to="/medphysio" className="text-[#CBD5E1] hover:text-[#4DA6FF] transition-all hover:translate-x-1 inline-block">MedPhysio</Link>
              </li>
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resources">
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-[0.2em] mb-6">
              Learning
            </h4>
            <ul className="space-y-4 font-body text-sm">
              <li>
                <Link to="/blog" className="text-[#CBD5E1] hover:text-[#4DA6FF] transition-all hover:translate-x-1 inline-block">Latest Articles</Link>
              </li>
              <li>
                <Link to="/products?search=physics" className="text-[#CBD5E1] hover:text-[#4DA6FF] transition-all hover:translate-x-1 inline-block">Physics</Link>
              </li>
              <li>
                <Link to="/products?search=biology" className="text-[#CBD5E1] hover:text-[#4DA6FF] transition-all hover:translate-x-1 inline-block">Biology</Link>
              </li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal links">
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-[0.2em] mb-6">
              Legal
            </h4>
            <ul className="space-y-4 font-body text-sm">
              <li>
                <Link to="/privacy-policy" className="text-[#CBD5E1] hover:text-[#4DA6FF] transition-all hover:translate-x-1 inline-block">Privacy</Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-[#CBD5E1] hover:text-[#4DA6FF] transition-all hover:translate-x-1 inline-block">Terms</Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-[#CBD5E1] hover:text-[#4DA6FF] transition-all hover:translate-x-1 inline-block">Shipping</Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Social & Copyright */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="font-body text-sm text-[#CBD5E1]">
              © {new Date().getFullYear()} Exam Essentials. All rights reserved.
            </p>
            <p className="text-[10px] uppercase tracking-widest text-[#94A3B8]">
              India's Best Handwritten Notes for CBSE, NEET & JEE
            </p>
          </div>
          
          <div className="flex items-center gap-6" role="navigation" aria-label="Social media links">
            <a
              href="mailto:examessentials.info@gmail.com"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-[#CBD5E1] hover:bg-[#4DA6FF] hover:text-[#0A0F1C] transition-all duration-300 shadow-lg border border-white/5"
              aria-label="Email us"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/exam_essentials_?igsh=MW1xM3puOWgydGVrYw=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-[#CBD5E1] hover:bg-[#4DA6FF] hover:text-[#0A0F1C] transition-all duration-300 shadow-lg border border-white/5"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/company/exam-essentials7"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-[#CBD5E1] hover:bg-[#4DA6FF] hover:text-[#0A0F1C] transition-all duration-300 shadow-lg border border-white/5"
              aria-label="Connect with us on LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=919460970342"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-[#CBD5E1] hover:bg-[#4DA6FF] hover:text-[#0A0F1C] transition-all duration-300 shadow-lg border border-white/5"
              aria-label="Chat with us on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;