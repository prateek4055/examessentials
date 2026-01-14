import { Link } from "react-router-dom";
import { Mail, Instagram, Linkedin, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-16" role="contentinfo" aria-label="Site footer">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4" aria-label="Exam Essentials - Go to homepage">
              <img
                src={logo}
                alt="Exam Essentials Logo - Premium Handwritten Notes"
                className="h-10 w-10 rounded-lg object-cover"
                width={40}
                height={40}
                loading="lazy"
              />
              <span className="font-display text-lg font-bold text-foreground">
                Exam Essentials
              </span>
            </Link>
            <p className="font-body text-sm text-muted-foreground">
              India's #1 premium handwritten notes for Class 11 & 12 students. Perfect for CBSE Boards, NEET & JEE preparation.
            </p>
          </div>

          {/* Company */}
          <nav aria-label="Company links">
            <h4 className="font-body text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Products
                </Link>
              </li>
            </ul>
          </nav>

          {/* Notes by Class */}
          <nav aria-label="Notes by class">
            <h4 className="font-body text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Notes
            </h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link
                  to="/products?class=11"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Class 11 Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/products?class=12"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Class 12 Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=handwritten-notes"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Handwritten Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=mindmaps"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mind Maps
                </Link>
              </li>
            </ul>
          </nav>

          {/* Subjects */}
          <nav aria-label="Notes by subject">
            <h4 className="font-body text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Subjects
            </h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link
                  to="/products?search=physics"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Physics Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/products?search=chemistry"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Chemistry Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/products?search=maths"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Maths Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/products?search=biology"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Biology Notes
                </Link>
              </li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal links">
            <h4 className="font-body text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Social & Copyright */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm text-muted-foreground">
            © {new Date().getFullYear()} Exam Essentials. All rights reserved. | India's Best Handwritten Notes for CBSE, NEET & JEE
          </p>
          <div className="flex items-center gap-4" role="navigation" aria-label="Social media links">
            <a
              href="mailto:examessentials.info@gmail.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email us at examessentials.info@gmail.com"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com/exam_essentials_?igsh=MW1xM3puOWgydGVrYw=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/company/exam-essentials7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Connect with us on LinkedIn"
            >
              <Linkedin className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=919460970342"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Chat with us on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;