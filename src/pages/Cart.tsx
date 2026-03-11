import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();

  const handleIncrement = (id: string, currentQuantity: number) => {
    updateQuantity(id, currentQuantity + 1);
  };

  const handleDecrement = (id: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1);
    }
  };

  const handleQuantityChange = (id: string, value: string) => {
    const quantity = parseInt(value);
    if (!isNaN(quantity) && quantity >= 1) {
      updateQuantity(id, quantity);
    }
  };

  return (
    <div className="bg-stone-50 pt-20 min-h-screen">
      <Helmet>
        <title>Shopping Cart - Quince Nutrition</title>
      </Helmet>

      {/* Header */}
      <div className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-10 h-10" />
            <h1 className="font-serif text-4xl md:text-5xl">Shopping Cart</h1>
          </div>
          <p className="text-stone-300 mt-3">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cart.length === 0 ? (
          /* Empty Cart State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-stone-200 p-16 text-center"
          >
            <ShoppingBag className="w-20 h-20 text-stone-300 mx-auto mb-6" />
            <h2 className="text-2xl font-serif text-stone-900 mb-3">Your cart is empty</h2>
            <p className="text-stone-600 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Browse Products
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          /* Cart with Items */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 flex gap-6"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-serif text-xl text-stone-900 mb-1">
                          {item.title}
                        </h3>
                        {item.category && (
                          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {item.description && (
                      <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="mt-auto flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-stone-600 font-medium">Quantity:</span>
                        <div className="flex items-center border border-stone-300 rounded-lg">
                          <button
                            onClick={() => handleDecrement(item.id, item.quantity)}
                            disabled={item.quantity <= 1}
                            className="p-2 hover:bg-stone-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            className="w-16 text-center border-x border-stone-300 py-2 focus:outline-none"
                          />
                          <button
                            onClick={() => handleIncrement(item.id, item.quantity)}
                            className="p-2 hover:bg-stone-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm text-stone-500">
                          KES {item.price.toFixed(0)} each
                        </p>
                        <p className="text-xl font-bold text-emerald-600">
                          KES {(item.price * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 sticky top-24"
              >
                <h2 className="font-serif text-2xl text-stone-900 mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-stone-200">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-medium">KES {cartTotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-semibold mb-6">
                  <span className="text-stone-900">Total</span>
                  <span className="text-emerald-600">KES {cartTotal.toFixed(0)}</span>
                </div>

                <button
                  disabled
                  className="w-full bg-stone-300 text-stone-500 py-3 rounded-lg font-semibold mb-3 cursor-not-allowed"
                >
                  Proceed to Checkout (Coming Soon)
                </button>

                <Link
                  to="/products"
                  className="block w-full text-center bg-stone-100 text-stone-700 py-3 rounded-lg font-semibold hover:bg-stone-200 transition-colors"
                >
                  Continue Shopping
                </Link>

                <p className="text-xs text-stone-500 text-center mt-4">
                  Payment processing will be available soon. For now, please contact us to complete your order.
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
