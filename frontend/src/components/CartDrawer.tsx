import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, cartTotal, removeFromCart, updateQuantity } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-semibold text-stone-900">
                  Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-6 h-6 text-stone-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-stone-300 mb-4" />
                  <p className="text-stone-500 text-lg">Your cart is empty</p>
                  <p className="text-stone-400 text-sm mt-2">Add some products to get started!</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-stone-50 p-4 rounded-lg">
                    {/* Product Image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                    />

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-stone-900 truncate">{item.title}</h3>
                      <p className="text-emerald-600 font-semibold mt-1">
                        KES {item.price.toFixed(0)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-stone-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-stone-100 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-3 py-1 border-x border-stone-300 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-stone-100 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-stone-900">
                        KES {(item.price * item.quantity).toFixed(0)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with Total and Actions */}
            {cart.length > 0 && (
              <div className="border-t border-stone-200 p-6 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-stone-700">Subtotal:</span>
                  <span className="text-emerald-600">KES {cartTotal.toFixed(0)}</span>
                </div>

                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full bg-emerald-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  View Full Cart
                </Link>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full bg-stone-200 text-stone-700 text-center py-3 rounded-lg font-semibold hover:bg-stone-300 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
