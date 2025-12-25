import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src={logo}
                alt="Exam Essentials"
                className="h-12 w-12 rounded-lg object-cover"
              />
              <span className="font-display text-xl font-semibold text-foreground">
                Exam Essentials
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Premium handwritten notes designed to help Class 11 & 12 students
              excel in their exams. Curated by top educators for maximum clarity
              and retention.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-base font-semibold text-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Class 11 Notes", path: "/products?class=11" },
                { name: "Class 12 Notes", path: "/products?class=12" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-base font-semibold text-foreground mb-4">
              Contact
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@examessentials.in"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  support@examessentials.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Exam Essentials. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            This website does not guarantee exam success. Study smart, study hard.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
