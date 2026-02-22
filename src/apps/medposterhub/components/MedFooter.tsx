import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

export const MedFooter = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-16 font-sans">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-xl">EE</div>
                            <span className="text-2xl font-bold text-white tracking-tight">MedPosterHub</span>
                        </div>
                        <p className="text-slate-400 mb-6 leading-relaxed max-w-sm">
                            India's leading provider of high-accuracy medical anatomical charts. Trusted by over 500+ clinics and hospitals nationwide.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"><Twitter className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Shop</h4>
                        <ul className="space-y-3">
                            <li><a href="#product-grid" className="hover:text-white transition-colors">Anatomy Posters</a></li>
                            <li><a href="#product-grid" className="hover:text-white transition-colors">Ortho Charts</a></li>
                            <li><a href="#product-grid" className="hover:text-white transition-colors">Neuro Maps</a></li>
                            <li><a href="#product-grid" className="hover:text-white transition-colors">Bestsellers</a></li>
                            <li><a href="#product-grid" className="hover:text-white transition-colors">Combo Packs</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Support</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Returns & Refunds</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Bulk Orders</a></li>
                            <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    <div id="contact">
                        <h4 className="text-white font-bold mb-6">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>Jaipur, Rajasthan, India</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>+91 94609 70342</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>contact@examessentials.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <p>© {new Date().getFullYear()} Exam Essentials. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
