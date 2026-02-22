import { ShoppingCart, Menu, Search } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ClayButton } from "./ClayButton";

interface MedPosterHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const MedPosterHeader = ({ searchQuery, setSearchQuery }: MedPosterHeaderProps) => {
    const { cart, setIsCartOpen } = useCart();

    // Calculate total items safely
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <a href="#" className="flex items-center gap-3 group">
                        <img src="/logo.png" alt="Exam Essentials" className="h-10 w-auto" />
                        <span className="font-bold text-2xl tracking-tight text-slate-900">
                            MedPoster<span className="text-blue-600">Hub</span>
                        </span>
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#products" className="hover:text-blue-600 transition-colors">Categories</a>
                        <a href="#product-grid" className="hover:text-blue-600 transition-colors">Bestsellers</a>
                        <a href="#features" className="hover:text-blue-600 transition-colors">About Us</a>
                        <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center relative">
                        <Search className="w-5 h-5 text-slate-400 absolute left-3" />
                        <input
                            type="text"
                            placeholder="Search posters..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 transition-all"
                        />
                    </div>

                    <div className="w-px h-8 bg-slate-200 hidden md:block" />

                    <ClayButton
                        variant="icon"
                        className="relative w-12 h-12"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <ShoppingCart className="w-5 h-5 text-slate-700" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full shadow-sm ring-2 ring-white">
                                {totalItems}
                            </span>
                        )}
                    </ClayButton>

                    <button className="md:hidden p-2 text-slate-700">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
};
