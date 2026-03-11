import { client } from '../lib/sanity.client';
import { BlogPost, BlogListItem } from '../types/blog';

// Query for blog list with pagination
export async function getBlogPosts(page: number = 1, limit: number = 10) {
  const start = (page - 1) * limit;
  const end = start + limit;

  const query = `{
    "posts": *[_type == "blogPost" && !(_id in path('drafts.**'))] | order(publishedAt desc) [${start}...${end}] {
      _id,
      title,
      slug,
      "author": author-> {
        name,
        image
      },
      featuredImage,
      excerpt,
      "categories": categories[]-> {
        _id,
        title,
        slug,
        color
      },
      publishedAt,
      readingTime,
      featured
    },
    "total": count(*[_type == "blogPost" && !(_id in path('drafts.**'))])
  }`;

  return client.fetch<{ posts: BlogListItem[]; total: number }>(query);
}

// Query for a single blog post
export async function getBlogPost(slug: string) {
  const query = `*[_type == "blogPost" && slug.current == $slug && !(_id in path('drafts.**'))][0] {
    _id,
    _createdAt,
    title,
    slug,
    "author": author-> {
      _id,
      name,
      slug,
      image,
      bio,
      title
    },
    featuredImage,
    excerpt,
    "categories": categories[]-> {
      _id,
      title,
      slug,
      description,
      color
    },
    tags,
    content,
    publishedAt,
    readingTime,
    featured,
    "relatedPosts": relatedPosts[]-> {
      _id,
      title,
      slug,
      featuredImage,
      excerpt,
      publishedAt,
      readingTime,
      "author": author-> {
        name,
        image
      }
    },
    seo
  }`;

  return client.fetch<BlogPost>(query, { slug });
}

// Get related posts based on categories if manual selection is empty
export async function getRelatedPosts(postId: string, categories: string[], limit: number = 3) {
  const query = `*[_type == "blogPost" 
    && _id != $postId 
    && count((categories[]->_id)[@ in $categories]) > 0
    && !(_id in path('drafts.**'))
  ] | order(publishedAt desc) [0...${limit}] {
    _id,
    title,
    slug,
    featuredImage,
    excerpt,
    publishedAt,
    readingTime,
    "author": author-> {
      name,
      image
    }
  }`;

  return client.fetch<BlogListItem[]>(query, { postId, categories });
}

// Get featured posts
export async function getFeaturedPosts(limit: number = 3) {
  const query = `*[_type == "blogPost" && featured == true && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...${limit}] {
    _id,
    title,
    slug,
    "author": author-> {
      name,
      image
    },
    featuredImage,
    excerpt,
    "categories": categories[]-> {
      _id,
      title,
      slug,
      color
    },
    publishedAt,
    readingTime,
    featured
  }`;

  return client.fetch<BlogListItem[]>(query);
}

// Search blog posts
export async function searchBlogPosts(searchTerm: string) {
  const query = `*[_type == "blogPost" 
    && (title match $searchTerm 
    || excerpt match $searchTerm 
    || pt::text(content) match $searchTerm)
    && !(_id in path('drafts.**'))
  ] | order(publishedAt desc) {
    _id,
    title,
    slug,
    "author": author-> {
      name,
      image
    },
    featuredImage,
    excerpt,
    "categories": categories[]-> {
      _id,
      title,
      slug,
      color
    },
    publishedAt,
    readingTime
  }`;

  return client.fetch<BlogListItem[]>(query, { searchTerm: `*${searchTerm}*` });
}

// Get posts by category
export async function getBlogPostsByCategory(categorySlug: string, page: number = 1, limit: number = 10) {
  const start = (page - 1) * limit;
  const end = start + limit;

  const query = `{
    "posts": *[_type == "blogPost" 
      && $categorySlug in categories[]->slug.current
      && !(_id in path('drafts.**'))
    ] | order(publishedAt desc) [${start}...${end}] {
      _id,
      title,
      slug,
      "author": author-> {
        name,
        image
      },
      featuredImage,
      excerpt,
      "categories": categories[]-> {
        _id,
        title,
        slug,
        color
      },
      publishedAt,
      readingTime,
      featured
    },
    "total": count(*[_type == "blogPost" && $categorySlug in categories[]->slug.current && !(_id in path('drafts.**'))])
  }`;

  return client.fetch<{ posts: BlogListItem[]; total: number }>(query, { categorySlug });
}

// Get all categories
export async function getAllCategories() {
  const query = `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    color
  }`;

  return client.fetch(query);
}
