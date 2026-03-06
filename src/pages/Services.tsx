import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Stethoscope, Apple, MessageCircle, CheckCircle2 } from 'lucide-react';
import { SERVICES } from '../constants';

export default function Services() {
  // Filter services that belong to this page (1, 2, 4, 6)
  const serviceIds = ['wellness', 'health-conditions', 'nutrition-services', 'counseling'];
  const filteredServices = SERVICES.filter(s => serviceIds.includes(s.id));

  // Map IDs to specific images for visual enhancement
  const serviceImages: Record<string, string> = {
    'wellness': 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2070&auto=format&fit=crop',
    'health-conditions': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop',
    'nutrition-services': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop',
    'counseling': 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?q=80&w=2070&auto=format&fit=crop'
  };

  return (
    <div className="bg-stone-50 pt-20">
      {/* Header */}
      <div className="bg-emerald-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <img 
             src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" 
             className="w-full h-full object-cover"
             referrerPolicy="no-referrer"
           />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="font-serif text-4xl md:text-6xl mb-4">Our Services</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-lg">
            Comprehensive, personalized care designed to meet your unique health and wellness needs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">
        {filteredServices.map((service, index) => {
          const Icon = service.icon;
          const isEven = index % 2 === 0;
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20`}
            >
              {/* Image Side */}
              <div className="w-full lg:w-5/12">
                <div className="sticky top-28">
                  <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-[3/4]">
                    <img 
                      src={serviceImages[service.id]} 
                      alt={service.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4">
                        <Icon size={24} className="text-white" />
                      </div>
                      <h2 className="font-serif text-3xl mb-2">{service.title}</h2>
                      <p className="text-white/80">{service.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-7/12 py-8">
                <div className="grid md:grid-cols-1 gap-8">
                  {service.items.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="flex items-start text-lg font-bold text-stone-900 mb-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                        {item.title}
                      </h3>
                      <p className="text-stone-600 pl-8 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
