import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";

interface MedPosterHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const MedPosterHeader = ({ searchQuery, setSearchQuery }: MedPosterHeaderProps) => {
    const { cart, setIsCartOpen } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    // Calculate total items safely
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all duration-300">
            <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
                {/* Brand & Back Link */}
                <div className="flex items-center gap-3 sm:gap-6">
                    <Link
                        to="/"
                        className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center text-xs font-medium"
                        title="Back to Exam Essentials"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Home</span>
                    </Link>

                    <Link to="/medposterhub" className="flex items-center gap-2 group">
                        <img src="/logo.png" alt="Exam Essentials" className="h-8 sm:h-9 w-auto object-contain" />
                        <span className="font-bold text-lg sm:text-2xl tracking-tight text-slate-900">
                            MedPoster<span className="text-blue-600">Hub</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-6 ml-4 text-sm font-medium text-slate-600">
                        <a href="#products" className="hover:text-blue-600 transition-colors">Categories</a>
                        <a href="#product-grid" className="hover:text-blue-600 transition-colors">Posters</a>
                        <a href="#personas" className="hover:text-blue-600 transition-colors">For Clinics</a>
                        <a href="#features" className="hover:text-blue-600 transition-colors">Quality</a>
                    </nav>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Desktop Search Bar */}
                    <div className="hidden md:flex items-center relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search clinical & decor posters..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-slate-100/90 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-56 lg:w-64 transition-all border border-transparent focus:border-blue-300 focus:bg-white"
                        />
                    </div>

                    {/* Mobile Search Toggle */}
                    <button
                        onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                        className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
                        aria-label="Toggle search"
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    {/* Cart Trigger Button */}
                    <button
                        className="relative p-2 sm:px-3 sm:py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5"
                        onClick={() => setIsCartOpen(true)}
                        aria-label="Open Cart"
                    >
                        <ShoppingCart className="w-5 h-5 text-slate-800" />
                        <span className="hidden sm:inline text-xs font-bold text-slate-700">Cart</span>
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 sm:static sm:top-auto sm:right-auto h-5 w-5 sm:h-4 sm:w-4 flex items-center justify-center bg-blue-600 text-white text-[10px] font-bold rounded-full shadow-xs">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    {/* Mobile Menu Hamburger */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Open menu"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Expandable Search Bar */}
            {isMobileSearchOpen && (
                <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-100 bg-white">
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search anatomy, ortho, or decor..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                            className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                </div>
            )}

            {/* Mobile Drawer Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-slate-200 px-5 py-4 space-y-3 shadow-lg">
                    <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
                        <a
                            href="#products"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Categories & Collections
                        </a>
                        <a
                            href="#product-grid"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            All Posters
                        </a>
                        <a
                            href="#personas"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            For Clinics & Doctors
                        </a>
                        <a
                            href="#features"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Quality & Framing
                        </a>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <Link to="/" className="text-blue-600 font-semibold hover:underline">
                            ← Return to Exam Essentials Home
                        </Link>
                        <a
                            href="https://wa.me/919460970342"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 font-semibold"
                        >
                            WhatsApp Help
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
};
