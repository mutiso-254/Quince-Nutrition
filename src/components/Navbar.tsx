import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { COMPANY_INFO } from '../constants';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Products', href: '/products' },
    { name: 'Resources', href: '/resources' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex flex-col leading-tight">
              <span className={`font-serif text-xl md:text-2xl font-semibold tracking-tight ${scrolled || location.pathname !== '/' ? 'text-stone-800' : 'text-white'}`}>
                Quince Nutrition
              </span>
              <span className={`text-[9px] md:text-[10px] uppercase tracking-widest font-medium ${scrolled || location.pathname !== '/' ? 'text-emerald-600' : 'text-emerald-400'}`}>
                Wellness & Counselling
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`font-medium text-sm uppercase tracking-wide transition-colors duration-200 ${
                  location.pathname === link.href 
                    ? 'text-emerald-500' 
                    : (scrolled || location.pathname !== '/' ? 'text-stone-600 hover:text-emerald-700' : 'text-stone-200 hover:text-white')
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 rounded-full transition-colors ${
                scrolled || location.pathname !== '/' 
                  ? 'text-stone-600 hover:bg-stone-100' 
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Shopping cart"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            
            <Link
              to="/contact"
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg ${
                scrolled || location.pathname !== '/' 
                  ? 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-emerald-900/20' 
                  : 'bg-white text-emerald-900 hover:bg-emerald-50 shadow-black/10'
              }`}
            >
              Book Consultation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Cart Button Mobile */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 rounded-full transition-colors ${
                scrolled || location.pathname !== '/' 
                  ? 'text-stone-600 hover:bg-stone-100' 
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Shopping cart"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none ${scrolled || location.pathname !== '/' ? 'text-stone-600' : 'text-white'}`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-stone-100 overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`block px-3 py-3 text-base font-medium rounded-lg ${
                    location.pathname === link.href 
                      ? 'text-emerald-800 bg-emerald-50' 
                      : 'text-stone-600 hover:text-emerald-800 hover:bg-stone-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-stone-100 mt-4 space-y-3">
                <div className="flex items-center text-stone-500 text-sm">
                  <Phone size={16} className="mr-3 text-emerald-600" />
                  {COMPANY_INFO.phone}
                </div>
                <div className="flex items-center text-stone-500 text-sm">
                  <Mail size={16} className="mr-3 text-emerald-600" />
                  {COMPANY_INFO.email}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
