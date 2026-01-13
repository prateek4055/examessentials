import { Link } from "react-router-dom";
import { Mail, Instagram, Linkedin, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src={logo}
                alt="Exam Essentials"
                className="h-10 w-10 rounded-lg object-cover"
              />
              <span className="font-display text-lg font-bold text-foreground">
                Exam Essentials
              </span>
            </Link>
            <p className="font-body text-sm text-muted-foreground">
              Premium ecosystem of exam and medical education apps.
            </p>
          </div>

          {/* Company */}
          <div>
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
          </div>

          {/* Apps */}
          <div>
            <h4 className="font-body text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Apps
            </h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <span className="text-muted-foreground/50 cursor-not-allowed">
                  MedOrtho
                </span>
              </li>
              <li>
                <span className="text-muted-foreground/50 cursor-not-allowed">
                  MedNeuro
                </span>
              </li>
              <li>
                <span className="text-muted-foreground/50 cursor-not-allowed">
                  MedAnat
                </span>
              </li>
            </ul>
          </div>

          {/* Exams */}
          <div>
            <h4 className="font-body text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Exams
            </h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <span className="text-muted-foreground/50 cursor-not-allowed">
                  NEET Essentials
                </span>
              </li>
              <li>
                <span className="text-muted-foreground/50 cursor-not-allowed">
                  JEE Essentials
                </span>
              </li>
              <li>
                <span className="text-muted-foreground/50 cursor-not-allowed">
                  CAT Essentials
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
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
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm text-muted-foreground">
            © {new Date().getFullYear()} Exam Essentials. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:examessentials.info@gmail.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/exam_essentials_?igsh=MW1xM3puOWgydGVrYw=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/company/exam-essentials7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=919460970342"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
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