import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton, 
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';
import { getBlogPost, getRelatedPosts } from '../services/blog.service';
import { BlogPost, BlogListItem } from '../types/blog';
import { urlFor } from '../lib/sanity.image';
import PortableTextRenderer from '../components/PortableTextRenderer';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await getBlogPost(slug!);
      setPost(data);

      // Fetch related posts
      if (data) {
        let related: any[] = data.relatedPosts || [];
        
        // If no manually selected related posts, fetch based on categories
        if (related.length === 0) {
          const categoryIds = data.categories.map(cat => cat._id);
          related = await getRelatedPosts(data._id, categoryIds, 3);
        }
        
        setRelatedPosts(related.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-stone-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-stone-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-stone-900 mb-4">Article Not Found</h1>
          <Link to="/resources" className="text-emerald-600 hover:underline">
            ← Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 pt-20">
      <Helmet>
        <title>{post.seo?.metaTitle || post.title} - Quince Nutrition</title>
        <meta name="description" content={post.seo?.metaDescription || post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={urlFor(post.featuredImage).width(1200).height(630).url()} />
        <meta property="og:url" content={shareUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          to="/resources" 
          className="inline-flex items-center text-stone-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Resources
        </Link>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.categories.map((category) => (
              <span
                key={category._id}
                className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700"
                style={category.color ? { backgroundColor: `${category.color}20`, color: category.color } : {}}
              >
                {category.title}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-stone-600 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-stone-600 border-y border-stone-200 py-6 mb-8">
            <div className="flex items-center gap-3">
              {post.author.image && (
                <img
                  src={urlFor(post.author.image).width(48).height(48).url()}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span className="font-medium text-stone-900">{post.author.name}</span>
                </div>
                {post.author.title && (
                  <p className="text-sm text-stone-500">{post.author.title}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{post.readingTime} min read</span>
            </div>
            
            {/* Share Button */}
            <div className="ml-auto relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition-colors"
              >
                <Share2 size={16} />
                Share
              </button>
              
              {showShareMenu && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-4 flex gap-2 z-10">
                  <FacebookShareButton url={shareUrl} hashtag="#QuinceNutrition">
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={shareUrl} title={post.title}>
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <LinkedinShareButton url={shareUrl}>
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                  <WhatsappShareButton url={shareUrl} title={post.title}>
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-12 rounded-2xl overflow-hidden">
            <img
              src={urlFor(post.featuredImage).width(1200).height(600).url()}
              alt={post.featuredImage.alt || post.title}
              className="w-full h-auto"
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <PortableTextRenderer content={post.content} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-stone-200">
              <h3 className="text-sm font-medium text-stone-500 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-stone-100 text-stone-700 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          {post.author.bio && (
            <div className="mt-12 p-8 bg-white rounded-2xl border border-stone-200">
              <div className="flex gap-4">
                {post.author.image && (
                  <img
                    src={urlFor(post.author.image).width(80).height(80).url()}
                    alt={post.author.name}
                    className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div>
                  <h3 className="font-serif text-xl text-stone-900 mb-1">
                    About {post.author.name}
                  </h3>
                  {post.author.title && (
                    <p className="text-sm text-emerald-600 mb-2">{post.author.title}</p>
                  )}
                  <p className="text-stone-600 leading-relaxed">{post.author.bio}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-stone-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl text-stone-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost._id}
                  to={`/blog/${relatedPost.slug.current}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={urlFor(relatedPost.featuredImage).width(400).height(225).url()}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl text-stone-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-stone-600 text-sm line-clamp-2 mb-4">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {format(new Date(relatedPost.publishedAt), 'MMM d, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {relatedPost.readingTime} min
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
