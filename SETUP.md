# Setup Guide for Trendy Fashion Zone

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Image Setup

All product images are currently in the root `/public` directory. The Next.js app will serve them from the `/public` folder automatically.

### Image Paths
- Product images: `/public/[image-name].jpg`
- Category images: Use existing product images as placeholders
- Logo: Place in `/public/logo.png` or `/public/logo.jpg`

### Recommended Image Optimization

For best performance, consider:
1. Optimizing images using tools like ImageOptim or Squoosh
2. Using WebP format for better compression
3. Ensuring images are properly sized (max 1200px width for product images)

## Configuration

### Update Brand Information

Edit the following files to update brand details:
- `data/products.ts` - Product and category data
- `components/Footer.tsx` - Contact information
- `components/Navbar.tsx` - Brand name
- `pages/index.tsx` - Hero section content

### WhatsApp Integration

WhatsApp links are configured with:
- Phone: +254 743 869 564
- Pre-filled messages for product orders

Update WhatsApp number in:
- `data/products.ts` - `getWhatsAppLink` function
- `components/Footer.tsx` - Footer contact section
- `pages/contact.tsx` - Contact page

### SEO Configuration

Update SEO metadata in:
- `pages/index.tsx` - Home page SEO
- `pages/collections/index.tsx` - Collections page SEO
- `pages/collections/[category].tsx` - Category pages SEO
- `pages/about.tsx` - About page SEO
- `pages/contact.tsx` - Contact page SEO

Update domain URL from `trendyfashionzone.online` to your actual domain in all SEO configurations.

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import repository in Vercel
3. Configure domain
4. Deploy

### Environment Variables

No environment variables required for basic functionality. Add if needed for:
- Analytics tracking
- API endpoints
- Third-party services

## Troubleshooting

### Images Not Loading
- Ensure images are in `/public` directory
- Check image file names match exactly (case-sensitive)
- Verify image paths in `data/products.ts`

### Build Errors
- Run `npm run lint` to check for errors
- Ensure all TypeScript types are correct
- Check that all imports are valid

### Styling Issues
- Verify TailwindCSS is properly configured
- Check `tailwind.config.ts` for custom colors
- Ensure `styles/globals.css` is imported in `_app.tsx`

## Next Steps

1. Add more products to `data/products.ts`
2. Customize colors in `tailwind.config.ts`
3. Add Google Analytics (optional)
4. Set up contact form backend (optional)
5. Add product search functionality (optional)
6. Implement shopping cart (optional)

