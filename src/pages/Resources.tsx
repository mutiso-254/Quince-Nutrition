import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Calendar, Users, Video } from 'lucide-react';
import { SERVICES } from '../constants';
import { Helmet } from 'react-helmet-async';

export default function Resources() {
  // Filter for resources (id: 'resources')
  const resourcesService = SERVICES.find(s => s.id === 'resources');

  if (!resourcesService) return null;

  const icons = [Users, Calendar, Video, BookOpen];

  return (
    <div className="bg-stone-50 pt-20">
      <Helmet>
        <title>Quince - Resources</title>
      </Helmet>
      {/* Header */}
      <div className="bg-emerald-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <img 
             src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop" 
             className="w-full h-full object-cover"
             referrerPolicy="no-referrer"
           />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="font-serif text-4xl md:text-6xl mb-4">Resources & Learning</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-lg">
            Empowering our community through education, workshops, and expert-led seminars.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12">
          {resourcesService.items.map((item, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex gap-6 hover:border-emerald-200 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700">
                    <Icon size={32} />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-stone-900 mb-3">{item.title}</h3>
                  <p className="text-stone-600 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                  <a href="#contact" className="text-emerald-700 font-medium hover:underline">
                    Learn more &rarr;
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Visual Section */}
        <div className="mt-24 rounded-[2.5rem] overflow-hidden relative h-96">
          <img 
            src={new URL('../images/Next Workshop Image.jpg', import.meta.url).href} 
            alt="Workshop" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center text-center p-8">
            <div>
              <h2 className="font-serif text-4xl text-white mb-4">Join Our Next Workshop</h2>
              <p className="text-stone-200 text-lg max-w-xl mx-auto mb-8">
                Stay tuned for upcoming events on nutrition, mental health, and fitness.
              </p>
              <button className="px-8 py-3 bg-emerald-500 text-white rounded-full font-bold hover:bg-emerald-400 transition-colors">
                View Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
