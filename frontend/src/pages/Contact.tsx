import React, { useState } from "react";
import { Phone, Mail, MapPin, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { COMPANY_INFO } from "../constants";
import { Helmet } from "react-helmet-async";
import { submitContactForm } from "@/services/api";

export default function Contact() {
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("General Inquiry");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    setErrorMessage("");

    try {
      const result = await submitContactForm({
        first_name: firstName,
        last_name: lastName,
        email,
        service,
        message,
      });

      if (result.success) {
        setFormStatus("success");
        // Clear form fields
        setFirstName("");
        setLastName("");
        setEmail("");
        setService("General Inquiry");
        setMessage("");
        setTimeout(() => setFormStatus("idle"), 5000);
      } else {
        setFormStatus("error");
        setErrorMessage(
          result.error || "Something went wrong. Please try again.",
        );
      }
    } catch (err) {
      setFormStatus("error");
      setErrorMessage(
        "Network error. Please check your connection and try again.",
      );
    }
  };

  return (
    <div className="bg-stone-50 pt-20">
      <Helmet>
        <title>Quince - Contact</title>
      </Helmet>
      <div className="bg-emerald-900 text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={
              new URL("../images/Contact Us Image.jpg", import.meta.url).href
            }
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <h1 className="font-serif text-4xl md:text-6xl mb-4">Contact Us</h1>
          <p className="text-emerald-100 text-lg">
            We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-emerald-100">
          <div className="grid lg:grid-cols-5">
            {/* Contact Info */}
            <div className="lg:col-span-2 bg-emerald-800 text-white p-12 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

              <div className="relative z-10">
                <h3 className="font-serif text-3xl mb-2">Get in Touch</h3>
                <p className="text-emerald-200 mb-12">
                  Ready to start your wellness journey? Contact us today.
                </p>

                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-emerald-400 mt-1" />
                    <div>
                      <p className="font-medium text-emerald-100 text-sm uppercase tracking-wider mb-1">
                        Location
                      </p>
                      <p className="text-white text-lg leading-snug">
                        {COMPANY_INFO.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-emerald-400 mt-1" />
                    <div>
                      <p className="font-medium text-emerald-100 text-sm uppercase tracking-wider mb-1">
                        Call Us
                      </p>
                      <p className="text-white text-lg">{COMPANY_INFO.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-emerald-400 mt-1" />
                    <div>
                      <p className="font-medium text-emerald-100 text-sm uppercase tracking-wider mb-1">
                        Email Us
                      </p>
                      <p className="text-white text-lg">{COMPANY_INFO.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-12 pt-12 border-t border-emerald-700">
                <p className="text-emerald-300 italic">
                  "{COMPANY_INFO.tagline}"
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3 p-12 bg-white relative">
              <h3 className="font-serif text-3xl text-stone-900 mb-8">
                Send us a message
              </h3>

              <AnimatePresence mode="wait">
                {formStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20 p-12 text-center"
                  >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
                      <CheckCircle size={40} />
                    </div>
                    <h4 className="text-2xl font-serif text-stone-900 mb-2">
                      Message Sent!
                    </h4>
                    <p className="text-stone-600">
                      Thank you for reaching out. We'll get back to you shortly.
                    </p>
                    <button
                      onClick={() => setFormStatus("idle")}
                      className="mt-8 text-emerald-700 font-medium hover:text-emerald-900"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                    onSubmit={handleSubmit}
                  >
                    {formStatus === "error" && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                        {errorMessage}
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                          placeholder="Jane"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                        placeholder="jane@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Service Interest
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                      >
                        <option>General Inquiry</option>
                        <option>Wellness Programs</option>
                        <option>Clinical Nutrition</option>
                        <option>Corporate Wellness</option>
                        <option>Counseling</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === "submitting"}
                      className="w-full bg-emerald-900 text-white font-medium py-4 rounded-xl hover:bg-emerald-800 transition-colors shadow-lg shadow-emerald-900/10 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {formStatus === "submitting" ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
