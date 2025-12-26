import { Link } from "react-router-dom";
import { Mail, Instagram, Linkedin, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.jpeg";
const Footer = () => {
  return <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Exam Essentials" className="h-10 w-10 rounded-lg object-cover" />
              <span className="font-display text-lg font-bold">Exam Essentials</span>
            </Link>
            <p className="font-body text-sm text-background/70 mb-4">India's Best Handwritten Notes for Class 11 & 12 students.</p>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 font-body text-sm">
              <li><Link to="/" className="text-background/70 hover:text-background transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-background/70 hover:text-background transition-colors">All Notes</Link></li>
              <li><Link to="/products?class=11" className="text-background/70 hover:text-background transition-colors">Class 11</Link></li>
              <li><Link to="/products?class=12" className="text-background/70 hover:text-background transition-colors">Class 12</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Subjects</h4>
            <ul className="space-y-2 font-body text-sm">
              <li><Link to="/products" className="text-background/70 hover:text-background transition-colors">Physics</Link></li>
              <li><Link to="/products" className="text-background/70 hover:text-background transition-colors">Chemistry</Link></li>
              <li><Link to="/products" className="text-background/70 hover:text-background transition-colors">Mathematics</Link></li>
              <li><Link to="/products" className="text-background/70 hover:text-background transition-colors">Biology</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 font-body text-sm">
              <li className="flex items-center gap-2 text-background/70">
                <Mail className="w-4 h-4" />
                <a href="mailto:examessentials.info@gmail.com" className="hover:text-background transition-colors">examessentials.info@gmail.com</a>
              </li>
              <li className="flex items-center gap-2 text-background/70">
                <Instagram className="w-4 h-4" />
                <a href="https://www.instagram.com/exam_essentials_?igsh=MW1xM3puOWgydGVrYw==" target="_blank" rel="noopener noreferrer" className="hover:text-background transition-colors">Instagram</a>
              </li>
              <li className="flex items-center gap-2 text-background/70">
                <Linkedin className="w-4 h-4" />
                <a href="https://www.linkedin.com/company/exam-essentials7" target="_blank" rel="noopener noreferrer" className="hover:text-background transition-colors">LinkedIn</a>
              </li>
              <li className="flex items-center gap-2 text-background/70">
                <MessageCircle className="w-4 h-4" />
                <a href="https://api.whatsapp.com/send?phone=919460970342" target="_blank" rel="noopener noreferrer" className="hover:text-background transition-colors">WhatsApp</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/20 mt-10 pt-6 text-center">
          <p className="font-body text-sm text-background/50">© {new Date().getFullYear()} Exam Essentials. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;