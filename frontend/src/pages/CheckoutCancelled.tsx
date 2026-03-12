import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { XCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function CheckoutCancelled() {
  return (
    <div className="bg-stone-50 min-h-screen pt-20 px-4">
      <Helmet>
        <title>Checkout Cancelled - Quince Nutrition</title>
      </Helmet>

      <div className="max-w-md mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-orange-600" />
          </div>

          <h1 className="text-3xl font-serif text-stone-900 mb-2">
            Checkout Cancelled
          </h1>
          <p className="text-stone-600 mb-8">
            Your payment was not completed. Your cart items are still saved.
          </p>

          <div className="flex flex-col gap-4">
            <Link
              to="/cart"
              className="bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              Return to Cart
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/products"
              className="bg-stone-100 text-stone-700 py-3 rounded-lg font-semibold hover:bg-stone-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
