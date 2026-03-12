import React from "react";
import { motion } from "motion/react";
import { ABOUT_CONTENT } from "../constants";
import { CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function About() {
  return (
    <div className="bg-stone-50 pt-20">
      <Helmet>
        <title>Quince - about</title>
      </Helmet>
      {/* Header */}
      <div className="bg-stone-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-6xl text-stone-900 mb-4">
            About Us
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto text-lg">
            Your trusted health partners, committed to guiding you on your
            journey to a healthier and more balanced life.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-widest uppercase">
              Our Mission
            </div>
            <h2 className="font-serif text-4xl text-stone-900 mb-6">
              Empowering Healthier Lives
            </h2>
            <div className="space-y-6 text-stone-600 text-lg leading-relaxed">
              <p>{ABOUT_CONTENT[0]}</p>
              <p>{ABOUT_CONTENT[1]}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src={
                new URL(
                  "../images/Empowering Healthier Lives Image.jpg",
                  import.meta.url,
                ).href
              }
              alt="Team collaboration"
              className="rounded-3xl shadow-2xl w-full object-cover aspect-square"
            />
            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl max-w-xs hidden md:block">
              <p className="font-serif text-xl italic text-stone-900">
                "We believe true wellness begins with the right knowledge."
              </p>
            </div>
          </motion.div>
        </div>

        {/* Expertise Section */}
        <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-sm border border-stone-100 mb-24">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-serif text-4xl text-stone-900 mb-6">
              Our Expertise
            </h2>
            <p className="text-stone-600 text-lg">
              We specialize in a wide range of health concerns to ensure
              comprehensive care for our clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Preventive Nutrition",
              "Medical Nutrition Therapy",
              "Holistic Well-being",
              "Diabetes Management",
              "Cardiovascular Health",
              "Weight Management",
              "Digestive Disorders",
              "Autoimmune Conditions",
              "Corporate Wellness",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center p-4 bg-stone-50 rounded-xl"
              >
                <CheckCircle className="text-emerald-500 mr-3 w-5 h-5" />
                <span className="font-medium text-stone-800">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <img
              src={
                new URL("../images/For Businesses Image.jpg", import.meta.url)
                  .href
              }
              alt="Corporate wellness"
              className="rounded-3xl shadow-2xl w-full object-cover aspect-4/3"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-serif text-4xl text-stone-900 mb-6">
              For Businesses
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed mb-6">
              {ABOUT_CONTENT[3]}
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2.5 mr-4"></div>
                <span className="text-stone-700">
                  Enhance employee well-being and productivity
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2.5 mr-4"></div>
                <span className="text-stone-700">
                  Reduce workplace stress and burnout
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2.5 mr-4"></div>
                <span className="text-stone-700">
                  Foster a healthier, happier work environment
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
