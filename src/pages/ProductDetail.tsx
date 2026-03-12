import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ShoppingCart, ChevronLeft, ChevronRight, Check, Pill, BookOpen, ArrowLeft } from 'lucide-react';
import { fetchProducts, Product } from '../services/api';
import { useCart } from '../context/CartContext';

// Utility function to create URL-friendly slug from product title
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError(null);

      const response = await fetchProducts();

      if (response.success) {
        // Find product by matching slug with product title
        const foundProduct = response.products.find(
          (p) => createSlug(p.itemName) === slug
        );

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Product not found');
        }
      } else {
        setError(response.error || 'Failed to load product');
      }

      setLoading(false);
    }

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-stone-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-stone-50 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Product Not Found</h2>
          <p className="text-stone-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

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
    <div className="bg-stone-50 pt-20">
      <Helmet>
        <title>{product.itemName} - Quince Nutrition</title>
        <meta name="description" content={product.itemDescription} />
      </Helmet>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-2 text-stone-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </button>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
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
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 backdrop-blur text-white text-sm rounded-full">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-emerald-600 scale-95'
                          : 'border-transparent hover:border-stone-300'
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

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              {/* Category Badge */}
              <div className="flex items-center gap-2">
                {product.itemCategory.toLowerCase() === 'supplement' ? (
                  <>
                    <Pill className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-600 uppercase tracking-wide">Supplement</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">E-book</span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-stone-900">{product.itemName}</h1>

              {/* Price */}
              <div className="text-3xl font-bold text-emerald-600">
                ${product.itemPrice.toFixed(2)}
              </div>

              {/* Description */}
              <div className="prose prose-stone max-w-none">
                <p className="text-stone-600 leading-relaxed">{product.itemDescription}</p>
              </div>

              {/* Features */}
              {featuresList.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-stone-900">Key Features</h3>
                  <ul className="space-y-2">
                    {featuresList.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-stone-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Add to Cart Button */}
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-6 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </motion.button>

              {/* Additional Info */}
              <div className="pt-6 border-t border-stone-200 space-y-2 text-sm text-stone-600">
                <p>✓ Secure checkout</p>
                <p>✓ Expert support available</p>
                <p>✓ Quality guaranteed</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Export the slug utility function for use in other components
export { createSlug };
