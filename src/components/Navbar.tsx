import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpeg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const mainLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products", hasDropdown: true },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const categoryTabs = [
    { name: "Class 11", path: "/products?class=11" },
    { name: "Class 12", path: "/products?class=12" },
    { name: "NEET", path: "/products?category=neet" },
    { name: "JEE", path: "/products?category=jee" },
    { name: "All Notes", path: "/products" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    if (path.includes("?")) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      {/* Main Navbar */}
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Exam Essentials"
              className="h-10 w-10 rounded-lg object-cover"
            />
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold text-foreground leading-tight">
                Exam Essentials
              </span>
              <span className="text-xs text-muted-foreground">
                India's Best Notes
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {mainLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-body text-sm font-medium transition-colors duration-300 ${
                  isActive(link.path)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <User className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-full transition-colors relative">
              <ShoppingCart className="w-5 h-5 text-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Category Tabs - Desktop */}
      <div className="hidden md:block bg-secondary border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8">
            {categoryTabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.path}
                className={`category-tab ${isActive(tab.path) ? "active" : ""}`}
              >
                {tab.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              {mainLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-body text-base py-3 px-4 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              <p className="text-xs text-muted-foreground px-4 py-2">Categories</p>
              {categoryTabs.map((tab) => (
                <Link
                  key={tab.name}
                  to={tab.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-body text-sm py-2 px-4 rounded-lg transition-colors ${
                    isActive(tab.path)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {tab.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;