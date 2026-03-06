import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Shield, Users, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-stone-50">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop" 
            alt="Healthy lifestyle food background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-100 text-xs font-bold tracking-widest uppercase">
              Quince Nutrition & Consultancy
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-medium leading-tight mb-6">
              Empowering Your <br />
              <span className="text-emerald-400 italic">Journey to Wellness</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              We provide expert-driven nutrition solutions, wellness coaching, and evidence-based guidance to help you achieve optimal health.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white rounded-full font-medium transition-all hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/30 group"
              >
                Our Services
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-full font-medium transition-all hover:bg-white/20"
              >
                Book Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl text-stone-900 mb-4">Why Choose Quince?</h2>
            <p className="text-stone-600">
              We go beyond basic diet plans. We offer a holistic approach to health that integrates nutrition, mental well-being, and lifestyle changes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Expert Guidance",
                desc: "Highly qualified nutritionists, dietitians, and mental health experts dedicated to your success.",
                img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
              },
              {
                icon: Users,
                title: "Personalized Care",
                desc: "Tailored programs for diabetes, weight management, and corporate wellness that fit your life.",
                img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop"
              },
              {
                icon: Activity,
                title: "Holistic Approach",
                desc: "Integrating fitness, stress management, and emotional well-being for sustainable results.",
                img: new URL('../images/Holistic Approach Image.jpg', import.meta.url).href
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group relative overflow-hidden rounded-3xl aspect-[4/5] md:aspect-auto md:h-[500px]"
              >
                <img 
                  src={feature.img} 
                  alt={feature.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <div className="w-12 h-12 bg-emerald-500/90 backdrop-blur rounded-2xl flex items-center justify-center mb-4 text-white">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="font-serif text-2xl mb-2">{feature.title}</h3>
                  <p className="text-stone-300 text-sm leading-relaxed mb-6">
                    {feature.desc}
                  </p>
                  <Link to="/about" className="text-sm font-medium text-emerald-300 hover:text-emerald-200 flex items-center">
                    Learn more <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links / Categories */}
      <section className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl text-stone-900 mb-6">Comprehensive Wellness Solutions</h2>
              <p className="text-stone-600 mb-8 text-lg">
                Whether you need help managing a health condition, looking for high-quality supplements, or seeking corporate wellness programs, we have you covered.
              </p>
              <div className="space-y-4">
                {[
                  { label: "Wellness & Mental Health", link: "/services" },
                  { label: "Chronic Disease Management", link: "/services" },
                  { label: "Products & Supplements", link: "/products" },
                  { label: "Resources & Learning", link: "/resources" },
                ].map((item, i) => (
                  <Link 
                    key={i}
                    to={item.link}
                    className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-emerald-50 transition-colors group border border-stone-200 hover:border-emerald-200"
                  >
                    <span className="font-medium text-stone-800 group-hover:text-emerald-900">{item.label}</span>
                    <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-emerald-100 flex items-center justify-center text-stone-400 group-hover:text-emerald-600 transition-colors">
                      <ArrowRight size={16} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop" 
                  className="rounded-2xl w-full h-64 object-cover translate-y-8"
                  alt="Social wellness"
                  referrerPolicy="no-referrer"
                />
                <img 
                  src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=1974&auto=format&fit=crop" 
                  className="rounded-2xl w-full h-64 object-cover"
                  alt="Meditation"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Decorative circle */}
              <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/5 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">Ready to Transform Your Health?</h2>
          <p className="text-emerald-100 text-lg mb-10">
            Join us at Quince Nutrition and let's work together towards a healthier you and a healthier community.
          </p>
          <Link
            to="/contact"
            className="inline-block px-10 py-4 bg-white text-emerald-900 rounded-full font-bold text-lg hover:bg-emerald-50 transition-colors shadow-xl"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
