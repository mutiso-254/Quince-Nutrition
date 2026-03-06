import React from 'react';
import { motion } from 'motion/react';
import { Pill, Check } from 'lucide-react';
import { SERVICES } from '../constants';

export default function Products() {
  // Filter for products (id: 'products')
  const productsService = SERVICES.find(s => s.id === 'products');

  if (!productsService) return null;

  return (
    <div className="bg-stone-50 pt-20">
      {/* Header */}
      <div className="bg-stone-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
           <img 
             src="https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=2070&auto=format&fit=crop" 
             className="w-full h-full object-cover"
             referrerPolicy="no-referrer"
           />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="font-serif text-4xl md:text-6xl mb-4">Products & Supplements</h1>
          <p className="text-stone-300 max-w-2xl mx-auto text-lg">
            High-quality, expert-recommended supplements to support your journey to optimal health.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productsService.items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-xl transition-all group"
            >
              <div className="h-48 overflow-hidden relative bg-emerald-50">
                 {/* Placeholder images for supplements - using abstract/nature shots to be safe and professional */}
                 <img 
                   src={`https://picsum.photos/seed/${item.title.replace(/\s/g, '')}/600/400`}
                   alt={item.title}
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full text-emerald-600">
                   <Pill size={20} />
                 </div>
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl text-stone-900 mb-3">{item.title}</h3>
                <p className="text-stone-600 leading-relaxed mb-6">
                  {item.desc}
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-stone-500">
                    <Check size={14} className="text-emerald-500 mr-2" />
                    Expert Recommended
                  </li>
                  <li className="flex items-center text-sm text-stone-500">
                    <Check size={14} className="text-emerald-500 mr-2" />
                    High Quality Sources
                  </li>
                </ul>
                <button className="w-full py-3 border border-emerald-900 text-emerald-900 rounded-xl font-medium hover:bg-emerald-900 hover:text-white transition-colors">
                  Inquire Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
