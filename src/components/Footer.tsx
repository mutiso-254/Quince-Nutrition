import React from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_INFO } from '../constants';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <span className="font-serif text-2xl font-bold text-emerald-500 tracking-tight block mb-4">
              Quince Nutrition
            </span>
            <p className="text-stone-500 max-w-sm">
              {COMPANY_INFO.mission}
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-emerald-400 transition-colors">Services</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Quince Nutrition and Consultancy Ltd. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed with care.</p>
        </div>
      </div>
    </footer>
  );
}
