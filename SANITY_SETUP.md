# Sanity CMS Integration Guide

This project uses Sanity.io as a headless CMS for blog content management.

## Setup Instructions

### 1. Get Your Sanity Project ID

Since you already have a Sanity account and project:

1. Go to https://www.sanity.io/manage
2. Select your project
3. Find your **Project ID** in the project settings
4. Copy the Project ID

### 2. Configure Environment Variables

Update the `.env` file in the root directory with your Sanity Project ID:

```env
VITE_SANITY_PROJECT_ID=your_actual_project_id
VITE_SANITY_DATASET=production
```

### 3. Initialize Sanity Studio

Run the Sanity Studio locally:

```bash
npm run sanity
```

This will start the Sanity Studio at `http://localhost:3333`

### 4. Deploy Sanity Studio (Optional)

To deploy your Sanity Studio to the cloud:

```bash
npm run sanity:deploy
```

## Content Schema

The blog system includes three content types:

### Author
- Name
- Slug
- Profile Image
- Bio
- Professional Title

### Category
- Title
- Slug
- Description
- Color (for visual identification)

### Blog Post
- Title
- Slug (auto-generated from title)
- Author (reference)
- Featured Image with alt text
- Excerpt (150-250 characters)
- Categories (multiple selection)
- Tags
- Content (Rich text with support for):
  - Headings (H2, H3, H4)
  - Bold, Italic, Code, Underline, Strike-through
  - Links
  - Bullet and numbered lists
  - Block quotes
  - Embedded images with captions
  - Code blocks
- Published Date
- Reading Time (minutes)
- Featured Post flag
- Related Posts (manual selection)
- SEO fields (meta title, meta description)

## Creating Content

### Before Creating Blog Posts

1. **Create Authors**: Add at least one author profile
2. **Create Categories**: Add categories for organizing posts (e.g., "Nutrition", "Wellness", "Recipes")

### Creating a Blog Post

1. Open Sanity Studio (`npm run sanity`)
2. Click "Blog Post" in the sidebar
3. Click "Create new Blog Post"
4. Fill in all required fields:
   - Title
   - Slug (will auto-generate)
   - Author
   - Featured Image
   - Excerpt
   - At least one Category
   - Content
   - Published Date
   - Reading Time
5. Use the "Featured Post" toggle to highlight important articles
6. Add Related Posts manually, or they'll be auto-suggested based on categories
7. Publish when ready (drafts are not shown on the website)

## Features

### Frontend Features

- **Blog Listing**: Resources page displays all published blog posts with pagination (10 per page)
- **Featured Posts**: Highlight up to 3 featured articles at the top
- **Individual Blog Pages**: Full blog post view with:
  - Rich content rendering
  - Author bio
  - Category tags
  - Reading time
  - Social sharing (Facebook, Twitter, LinkedIn, WhatsApp)
  - Related articles suggestions
- **Responsive Design**: Optimized for all devices
- **SEO Optimized**: Meta tags for social sharing

### Content Management Features

- **Draft/Publish Workflow**: Save drafts before publishing
- **Rich Text Editor**: Full formatting capabilities
- **Image Management**: Upload and manage images with Sanity's CDN
- **Related Posts**: Automatic suggestions based on categories
- **SEO Fields**: Control meta titles and descriptions
- **Reading Time**: Manual entry for accurate estimates

## API Queries

The blog service includes functions for:
- `getBlogPosts(page, limit)` - Get paginated blog posts
- `getBlogPost(slug)` - Get single blog post by slug
- `getFeaturedPosts(limit)` - Get featured posts
- `getRelatedPosts(postId, categories, limit)` - Get related posts
- `searchBlogPosts(searchTerm)` - Search blog content
- `getBlogPostsByCategory(categorySlug, page, limit)` - Filter by category
- `getAllCategories()` - Get all categories

## Routing

- `/resources` - Blog listing page with pagination
- `/blog/:slug` - Individual blog post page

## Notes

- Drafts are automatically excluded from the website
- Images are automatically optimized via Sanity's CDN
- Related posts are suggested automatically if not manually selected
- Social sharing buttons appear on each blog post
- The system supports code syntax highlighting
- All content is fully responsive and accessible
