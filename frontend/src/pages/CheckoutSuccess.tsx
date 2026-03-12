import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  CheckCircle2,
  Loader,
  Package,
  ArrowRight,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { getOrderStatus } from "@/services/api";
import { useCart } from "@/context/CartContext";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }

    // Poll for order status (payment may take a few seconds)
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max

    const pollOrderStatus = async () => {
      const response = await getOrderStatus(orderId);

      if (response.success && response.order) {
        if (response.order.status === "completed") {
          setOrder(response.order);
          setLoading(false);
          clearCart(); // Clear cart on successful payment
          return true;
        } else if (response.order.status === "failed") {
          setError("Payment failed. Please try again.");
          setLoading(false);
          return true;
        }
      }

      attempts++;
      if (attempts >= maxAttempts) {
        setError(
          "Payment is being processed. Check your email for confirmation.",
        );
        setLoading(false);
        return true;
      }

      return false;
    };

    const interval = setInterval(async () => {
      const done = await pollOrderStatus();
      if (done) clearInterval(interval);
    }, 1000);

    // Initial check
    pollOrderStatus();

    return () => clearInterval(interval);
  }, [orderId, clearCart]);

  if (loading) {
    return (
      <div className="bg-stone-50 min-h-screen pt-20 flex items-center justify-center">
        <Helmet>
          <title>Processing Payment - Quince Nutrition</title>
        </Helmet>
        <div className="text-center">
          <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-stone-50 min-h-screen pt-20 flex items-center justify-center px-4">
        <Helmet>
          <title>Payment Issue - Quince Nutrition</title>
        </Helmet>
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-serif text-stone-900 mb-2">
            Payment Issue
          </h1>
          <p className="text-stone-600 mb-6">{error}</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen pt-20 px-4">
      <Helmet>
        <title>Payment Successful - Quince Nutrition</title>
      </Helmet>

      <div className="max-w-2xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          {/* Success Icon */}
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>

          <h1 className="text-3xl font-serif text-stone-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-stone-600 mb-8">
            Thank you for your order. We've received your payment.
          </p>

          {/* Order Details */}
          <div className="bg-stone-50 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Package className="text-emerald-600" />
              <h2 className="font-semibold text-stone-900">Order Details</h2>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Order Number:</span>
                <span className="font-mono font-semibold">
                  {order.order_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Total Paid:</span>
                <span className="font-semibold text-emerald-600">
                  KES {order.total.toFixed(0)}
                </span>
              </div>
              {order.paid_at && (
                <div className="flex justify-between">
                  <span className="text-stone-600">Payment Date:</span>
                  <span className="font-semibold">
                    {new Date(order.paid_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-stone-200">
              <h3 className="font-semibold mb-3">Items:</h3>
              <ul className="space-y-2">
                {order.items.map((item: any) => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.title} × {item.quantity}
                    </span>
                    <span className="font-semibold">
                      KES {(item.price * item.quantity).toFixed(0)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left text-sm">
            <p className="text-blue-900">
              📧 <strong>Check your email!</strong> We've sent your order
              confirmation and download links to your email address.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="flex-1 bg-stone-100 text-stone-700 py-3 rounded-lg font-semibold hover:bg-stone-200 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              Back to Home
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
