import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Calendar, Users, Video, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../constants';
import { Helmet } from 'react-helmet-async';
import { getBlogPosts, getFeaturedPosts } from '../services/blog.service';
import { BlogListItem } from '../types/blog';
import { urlFor } from '../lib/sanity.image';
import { format } from 'date-fns';

export default function Resources() {
  // Filter for resources (id: 'resources')
  const resourcesService = SERVICES.find(s => s.id === 'resources');
  
  const [blogPosts, setBlogPosts] = useState<BlogListItem[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 10;

  useEffect(() => {
    fetchBlogPosts();
    fetchFeaturedPosts();
  }, [currentPage]);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const data = await getBlogPosts(currentPage, postsPerPage);
      setBlogPosts(data.posts);
      setTotalPosts(data.total);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedPosts = async () => {
    try {
      const data = await getFeaturedPosts(3);
      setFeaturedPosts(data);
    } catch (error) {
      console.error('Error fetching featured posts:', error);
    }
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  if (!resourcesService) return null;

  const icons = [Users, Calendar, Video, BookOpen];

  return (
    <div className="bg-stone-50 pt-20">
      <Helmet>
        <title>Quince - Resources</title>
      </Helmet>
      {/* Header */}
      <div className="bg-emerald-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <img 
             src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop" 
             className="w-full h-full object-cover"
             referrerPolicy="no-referrer"
           />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="font-serif text-4xl md:text-6xl mb-4">Resources & Learning</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-lg">
            Empowering our community through education, workshops, and expert-led seminars.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Featured Blog Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl text-stone-900">Featured Articles</h2>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Link
                  key={post._id}
                  to={`/blog/${post.slug.current}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-emerald-200"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={urlFor(post.featuredImage).width(400).height(225).url()}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-bold bg-emerald-500 text-white rounded-full">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories.slice(0, 2).map((category) => (
                          <span
                            key={category._id}
                            className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700"
                          >
                            {category.title}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="font-serif text-xl text-stone-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-stone-600 text-sm line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      {post.author?.image && (
                        <img
                          src={urlFor(post.author.image).width(24).height(24).url()}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span>{post.author?.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.readingTime} min
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl text-stone-900">Latest Articles</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-stone-600">Loading articles...</p>
            </div>
          ) : blogPosts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, idx) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      to={`/blog/${post.slug.current}`}
                      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={urlFor(post.featuredImage).width(400).height(225).url()}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        {post.categories && post.categories.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.categories.slice(0, 2).map((category) => (
                              <span
                                key={category._id}
                                className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700"
                              >
                                {category.title}
                              </span>
                            ))}
                          </div>
                        )}
                        <h3 className="font-serif text-xl text-stone-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-stone-600 text-sm line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-stone-500">
                          {post.author?.image && (
                            <img
                              src={urlFor(post.author.image).width(24).height(24).url()}
                              alt={post.author.name}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <span>{post.author?.name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {post.readingTime} min
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-emerald-600 text-white'
                                : 'border border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return <span key={page} className="w-10 h-10 flex items-center justify-center">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl">
              <BookOpen size={48} className="mx-auto text-stone-300 mb-4" />
              <p className="text-stone-600">No blog posts available yet.</p>
            </div>
          )}
        </div>

        {/* Resources Services */}
        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          {resourcesService.items.map((item, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex gap-6 hover:border-emerald-200 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700">
                    <Icon size={32} />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-stone-900 mb-3">{item.title}</h3>
                  <p className="text-stone-600 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                  <a href="#contact" className="text-emerald-700 font-medium hover:underline">
                    Learn more &rarr;
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Visual Section */}
        <div className="mt-24 rounded-[2.5rem] overflow-hidden relative h-96">
          <img 
            src={new URL('../images/Next Workshop Image.jpg', import.meta.url).href} 
            alt="Workshop" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center text-center p-8">
            <div>
              <h2 className="font-serif text-4xl text-white mb-4">Join Our Next Workshop</h2>
              <p className="text-stone-200 text-lg max-w-xl mx-auto mb-8">
                Stay tuned for upcoming events on nutrition, mental health, and fitness.
              </p>
              <button className="px-8 py-3 bg-emerald-500 text-white rounded-full font-bold hover:bg-emerald-400 transition-colors">
                View Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
