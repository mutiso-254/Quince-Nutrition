import React, { useState } from 'react';
import { X, ShoppingCart, ChevronLeft, ChevronRight, Check, Pill, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../services/api';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();

  const images = product.itemImages.length > 0 
    ? product.itemImages 
    : [{ url: 'https://via.placeholder.com/800x600?text=No+Image', filename: 'placeholder' }];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.itemName,
      price: product.itemPrice,
      image: images[0].url,
      description: product.itemDescription,
      category: product.itemCategory,
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Parse features (comma-separated)
  const featuresList = product.features 
    ? product.features.split(',').filter(f => f.trim()).map(f => f.trim())
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-stone-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-stone-600" />
              </button>

              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Left Column - Image Slider */}
                <div className="space-y-4">
                  {/* Main Image Display */}
                  <div className="relative aspect-square bg-stone-100 rounded-xl overflow-hidden">
                    <img
                      src={images[currentImageIndex].url}
                      alt={`${product.itemName} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* Navigation Arrows - Only show if multiple images */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-6 h-6 text-stone-800" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-6 h-6 text-stone-800" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 backdrop-blur text-white rounded-full text-sm font-medium">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Navigation */}
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentImageIndex
                              ? 'border-emerald-600 scale-105'
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column - Product Details */}
                <div className="space-y-6">
                  {/* Category Badge */}
                  <div className="flex items-center gap-2">
                    {product.itemCategory === 'ebook' ? (
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Pill className="w-5 h-5 text-emerald-600" />
                    )}
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full capitalize">
                      {product.itemCategory}
                    </span>
                  </div>

                  {/* Product Title */}
                  <h2 className="font-serif text-3xl md:text-4xl text-stone-900 leading-tight">
                    {product.itemName}
                  </h2>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-emerald-600">
                      KES {product.itemPrice.toFixed(0)}
                    </span>
                  </div>

                  {/* Full Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900 mb-2">Description</h3>
                    <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                      {product.itemDescription}
                    </p>
                  </div>

                  {/* Features */}
                  {featuresList.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-stone-900 mb-3">Key Features</h3>
                      <ul className="space-y-2">
                        {featuresList.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-stone-600">
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
