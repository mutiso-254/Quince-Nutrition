export interface Author {
  _id: string;
  name: string;
  slug: { current: string };
  image?: any;
  bio?: string;
  title?: string;
}

export interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  color?: string;
}

export interface BlogPost {
  _id: string;
  _createdAt: string;
  title: string;
  slug: { current: string };
  author: Author;
  featuredImage: any;
  excerpt: string;
  categories: Category[];
  tags?: string[];
  content: any[];
  publishedAt: string;
  readingTime: number;
  featured?: boolean;
  relatedPosts?: BlogPost[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface BlogListItem {
  _id: string;
  title: string;
  slug: { current: string };
  author: {
    name: string;
    image?: any;
  };
  featuredImage: any;
  excerpt: string;
  categories: Category[];
  publishedAt: string;
  readingTime: number;
  featured?: boolean;
}
