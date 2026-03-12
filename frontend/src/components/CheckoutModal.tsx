import React, { useState } from "react";
import { X, Loader, Phone, Mail, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { createCheckout } from "@/services/api";
import type { CartItem } from "@/context/CartContext";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartTotal: number;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  cartTotal,
}: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setError("All fields are required");
      return false;
    }

    // Validate phone format (254XXXXXXXXX)
    const phoneRegex = /^254\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Phone must be in format: 254720428704");
      return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email address");
      return false;
    }

    return true;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const checkoutData = {
        customer: formData,
        items: cart.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        shipping: 0,
      };

      const response = await createCheckout(checkoutData);

      if (response.success && response.checkout_url) {
        // Redirect to CitaPay checkout
        window.location.href = response.checkout_url;
      } else {
        setError(response.error || "Failed to create checkout session");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-serif text-stone-900">Checkout</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                  disabled={loading}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Order Summary */}
                <div className="mb-6 p-4 bg-emerald-50 rounded-lg">
                  <h3 className="font-semibold text-stone-900 mb-2">
                    Order Summary
                  </h3>
                  <div className="space-y-1 text-sm text-stone-700">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.title} × {item.quantity}
                        </span>
                        <span>
                          KES {(item.price * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-emerald-200 flex justify-between font-bold text-emerald-700">
                      <span>Total</span>
                      <span>KES {cartTotal.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleCheckout} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                        size={18}
                      />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="John Doe"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                        size={18}
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="john@example.com"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                        size={18}
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
                        placeholder="254720428704"
                        required
                        disabled={loading}
                      />
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Format: 254XXXXXXXXX (for M-Pesa payments)
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Payment Methods Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
                    <p className="font-semibold mb-1">
                      Payment Methods Available:
                    </p>
                    <p className="text-xs">
                      💳 Card (Visa, Mastercard) • 📱 M-Pesa
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Processing...
                      </>
                    ) : (
                      "Continue to Payment"
                    )}
                  </button>

                  <p className="text-xs text-stone-500 text-center">
                    Choose your preferred payment method on the next page
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
