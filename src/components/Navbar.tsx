import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { COMPANY_INFO } from '../constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
            <Link to="/" className="flex flex-col">
              <span className={`font-serif text-2xl font-bold tracking-tight ${scrolled || location.pathname !== '/' ? 'text-emerald-900' : 'text-white'}`}>
                Quince
              </span>
              <span className={`text-[10px] uppercase tracking-widest font-medium ${scrolled || location.pathname !== '/' ? 'text-emerald-600' : 'text-emerald-200'}`}>
                Nutrition & Consultancy
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
          <div className="lg:hidden flex items-center">
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
