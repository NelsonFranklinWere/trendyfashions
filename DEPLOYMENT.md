# Deployment Guide - Trendy Fashion Zone

## Pre-Deployment Checklist

### 1. Image Setup
- [ ] Move all product images to `/public` directory
- [ ] Verify all image paths in `data/products.ts` match actual file names
- [ ] Optimize images for web (recommended: WebP format, max 1200px width)
- [ ] Test image loading on all pages

### 2. Configuration Updates
- [ ] Update domain URL in all SEO metadata (replace `trendyfashionzone.online` with actual domain)
- [ ] Verify WhatsApp number: +254 743 869 564
- [ ] Update email: nelsonochieng516@gmail.com
- [ ] Check all contact information in Footer and Contact page

### 3. Build & Test
- [ ] Run `npm run build` to ensure build succeeds
- [ ] Test all pages locally: Home, Collections, Category pages, About, Contact
- [ ] Test mobile responsiveness
- [ ] Test WhatsApp links
- [ ] Verify all images load correctly
- [ ] Check SEO metadata in page source

### 4. SEO Setup
- [ ] Update sitemap.xml (generate using next-sitemap or manually)
- [ ] Update robots.txt
- [ ] Submit sitemap to Google Search Console
- [ ] Verify structured data (JSON-LD) in page source
- [ ] Test Open Graph tags with Facebook Debugger
- [ ] Test Twitter Card tags

## Vercel Deployment Steps

### Step 1: Prepare Repository
```bash
git init
git add .
git commit -m "Initial commit: Trendy Fashion Zone Next.js app"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Click "Deploy"

### Step 3: Domain Configuration
1. In Vercel dashboard, go to Project Settings > Domains
2. Add your domain: `trendyfashionzone.online` or `shoes.strivego.online`
3. Follow DNS configuration instructions

### Step 4: DNS Configuration (Namecheap)
1. Log in to Namecheap
2. Go to Domain List > Manage
3. Go to Advanced DNS
4. Add/Update records:
   - Type: A Record
   - Host: @
   - Value: 76.76.21.21 (or Vercel's IP)
   - TTL: Automatic
   
   OR
   
   - Type: CNAME Record
   - Host: www
   - Value: cname.vercel-dns.com
   - TTL: Automatic

### Step 5: SSL Certificate
- Vercel automatically provisions SSL certificates
- Wait for DNS propagation (can take up to 48 hours)
- Verify SSL is active in Vercel dashboard

## Post-Deployment

### 1. Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property (your domain)
3. Verify ownership (DNS or HTML file)
4. Submit sitemap: `https://yourdomain.com/sitemap.xml`

### 2. Google Analytics (Optional)
1. Create Google Analytics account
2. Get tracking ID
3. Add to `pages/_app.tsx`:
```tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: url,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}
```

### 3. Performance Optimization
- [ ] Enable Vercel Analytics
- [ ] Set up image CDN (Vercel handles this automatically)
- [ ] Monitor Core Web Vitals
- [ ] Test page load speeds

### 4. Testing
- [ ] Test all pages on production
- [ ] Test WhatsApp links
- [ ] Test contact form
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Verify SEO metadata

## Monitoring & Maintenance

### Regular Tasks
- Monitor website performance
- Update product catalog regularly
- Check for broken links
- Update SEO content as needed
- Monitor Google Search Console for errors
- Keep dependencies updated

### Updates
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Troubleshooting

### Images Not Loading
- Check image paths in `data/products.ts`
- Verify images are in `/public` directory
- Check Next.js image configuration in `next.config.js`

### Build Errors
- Check TypeScript errors: `npm run lint`
- Verify all imports are correct
- Check for missing dependencies

### Domain Issues
- Verify DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Check SSL certificate status in Vercel

## Support

For issues or questions:
- Email: nelsonochieng516@gmail.com
- WhatsApp: +254 743 869 564

