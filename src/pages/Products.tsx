import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Pill, Check, BookOpen, ShoppingCart, Loader, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { fetchProducts, Product } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductModal from '../components/ProductModal';

type CategoryFilter = 'all' | 'ebook' | 'supplement';

const DESCRIPTION_WORD_LIMIT = 20;

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError(null);
      
      const response = await fetchProducts();
      
      if (response.success) {
        setProducts(response.products);
      } else {
        setError(response.error || 'Failed to load products');
      }
      
      setLoading(false);
    }
    
    loadProducts();
  }, []);

  // Filter products by category
  const filteredProducts = products.filter(product => {
    if (categoryFilter === 'all') return true;
    // Case-insensitive comparison to handle variations like "E-book" vs "ebook"
    return product.itemCategory?.toLowerCase() === categoryFilter.toLowerCase();
  });

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.itemName,
      price: product.itemPrice,
      image: product.itemImages[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image',
      description: product.itemDescription,
      category: product.itemCategory,
    });
  };

  const handleViewMore = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const truncateText = (text: string, wordLimit: number) => {
    if (!text) return '';
    const words = text.trim().split(/\s+/);  // Split by any whitespace
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const shouldTruncate = (text: string, wordLimit: number) => {
    if (!text) return false;
    const words = text.trim().split(/\s+/);
    return words.length > wordLimit;
  };

  const handleImageNavigation = (productId: string, direction: 'next' | 'prev', imageCount: number) => {
    setImageIndices(prev => {
      const currentIndex = prev[productId] || 0;
      let newIndex;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % imageCount;
      } else {
        newIndex = (currentIndex - 1 + imageCount) % imageCount;
      }
      return { ...prev, [productId]: newIndex };
    });
  };

  return (
    <div className="bg-stone-50 pt-20">
      <Helmet>
        <title>Quince - Products</title>
      </Helmet>
      
      {/* Header */}
      <div className="bg-stone-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
           <img 
             src="https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=2070&auto=format&fit=crop" 
             className="w-full h-full object-cover"
             referrerPolicy="no-referrer"
           />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="font-serif text-4xl md:text-6xl mb-4">Products & Supplements</h1>
          <p className="text-stone-300 max-w-2xl mx-auto text-lg">
            High-quality, expert-recommended supplements and e-books to support your journey to optimal health.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Category Filter Tabs */}
        <div className="flex justify-center mb-12 gap-4">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              categoryFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setCategoryFilter('ebook')}
            className={`px-8 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
              categoryFilter === 'ebook'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <BookOpen size={18} />
            E-books
          </button>
          <button
            onClick={() => setCategoryFilter('supplement')}
            className={`px-8 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
              categoryFilter === 'supplement'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Pill size={18} />
            Supplements
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
            <p className="text-stone-600">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <p className="text-red-600 font-medium mb-2">Failed to load products</p>
            <p className="text-red-500 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-stone-500 text-lg">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-xl transition-all group flex flex-col"
                  >
                    <div className="h-48 overflow-hidden relative bg-emerald-50">
                      {(() => {
                        const images = product.itemImages.length > 0 
                          ? product.itemImages 
                          : [{ url: 'https://via.placeholder.com/600x400?text=No+Image', filename: 'placeholder' }];
                        const currentIndex = imageIndices[product.id] || 0;
                        
                        return (
                          <>
                            <img 
                              src={images[currentIndex].url}
                              alt={product.itemName}
                              className="w-full h-full object-cover transition-opacity duration-300"
                              referrerPolicy="no-referrer"
                            />
                            
                            {/* Image Navigation - Only show if multiple images */}
                            {images.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageNavigation(product.id, 'prev', images.length);
                                  }}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                                  aria-label="Previous image"
                                >
                                  <ChevronLeft className="w-4 h-4 text-stone-800" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageNavigation(product.id, 'next', images.length);
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                                  aria-label="Next image"
                                >
                                  <ChevronRight className="w-4 h-4 text-stone-800" />
                                </button>
                                
                                {/* Image Dots Indicator */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                  {images.map((_, idx) => (
                                    <div
                                      key={idx}
                                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                                        idx === currentIndex
                                          ? 'bg-white w-4'
                                          : 'bg-white/60'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}
                          </>
                        );
                      })()}
                      
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full text-emerald-600">
                        {product.itemCategory === 'ebook' ? (
                          <BookOpen size={20} />
                        ) : (
                          <Pill size={20} />
                        )}
                      </div>
                    </div>
                    
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="font-serif text-2xl text-stone-900 mb-3">{product.itemName}</h3>
                      
                      {/* Truncated Description */}
                      <div className="text-stone-600 leading-relaxed mb-4">
                        {shouldTruncate(product.itemDescription, DESCRIPTION_WORD_LIMIT) ? (
                          <>
                            {truncateText(product.itemDescription, DESCRIPTION_WORD_LIMIT)}
                            {' '}
                            <button
                              onClick={() => handleViewMore(product)}
                              className="text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                              View more
                            </button>
                          </>
                        ) : (
                          <span>{product.itemDescription || 'No description available'}</span>
                        )}
                      </div>

                      {/* Features List */}
                      <div className="flex-grow">
                        {product.features && (
                          <ul className="space-y-2 mb-6">
                            {product.features.split(',').filter(f => f.trim()).slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                                <Check size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{feature.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl font-bold text-emerald-600">
                          KES {product.itemPrice.toFixed(0)}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleViewMore(product)}
                          className="flex-1 py-3 border-2 border-emerald-600 text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <Eye size={18} />
                          View More
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <ShoppingCart size={18} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
