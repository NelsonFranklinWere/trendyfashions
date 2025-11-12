# Trendy Fashion Zone - Modern E-commerce Web App

A modern, mobile-friendly React + Next.js web application for Trendy Fashion Zone, a Nairobi-based shoe and fashion store specializing in stylish sneakers, official shoes, casuals, Airforce, Airmax, and Jordan collections.

## 🌍 Brand Details

- **Brand Name:** Trendy Fashion Zone
- **Location:** Nairobi CBD, Moi Avenue
- **Phone & WhatsApp:** +254 743 869 564
- **Email:** nelsonochieng516@gmail.com
- **Years in Market:** 5 years of trust and style in Kenya's fashion industry
- **Brand Motto:** "Walk the Talk — Style that Speaks."

## 🚀 Features

- ✅ Modern, responsive design with TailwindCSS
- ✅ Dynamic product catalog with category filtering
- ✅ WhatsApp integration for direct ordering
- ✅ SEO optimized with Next.js and next-seo
- ✅ Fast performance with Next.js Image Optimization
- ✅ Accessible UI with proper ARIA labels
- ✅ Smooth animations with Framer Motion
- ✅ Mobile-first responsive layout

## 📁 Project Structure

```
TrendyFashionZone/
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── CategoryCard.tsx
│   └── CategoryFilter.tsx
├── data/
│   └── products.ts
├── lib/
│   └── utils.ts
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   ├── about.tsx
│   ├── contact.tsx
│   └── collections/
│       ├── index.tsx
│       └── [category].tsx
├── styles/
│   └── globals.css
├── public/
│   └── images/
└── package.json
```

## 🛠️ Tech Stack

- **Frontend:** React + Next.js 14
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **SEO:** next-seo
- **TypeScript:** Strict mode enabled
- **Hosting:** Vercel (recommended)

## 📦 Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 📝 Environment Variables

No environment variables are required for basic functionality. For production deployment, configure:

- Domain URL for SEO metadata
- Analytics tracking IDs (optional)
- API endpoints (if adding backend functionality)

## 🎨 Design System

### Colors
- **Primary:** #2c3e50
- **Secondary:** #e67e22
- **Accent:** #2980b9
- **Dark:** #2c3e50
- **Light:** #ecf0f1
- **Text:** #34495e

### Typography
- **Headings:** Poppins
- **Body:** Inter

## 📱 Pages

1. **Home Page (/)** - Hero section with featured products
2. **Collections (/collections)** - Browse all product categories
3. **Category Pages (/collections/[category])** - View products by category with filters
4. **About (/about)** - Brand story, mission, and vision
5. **Contact (/contact)** - Contact form and information

## 🔗 WhatsApp Integration

All product cards include a "Order via WhatsApp" button that opens WhatsApp with a pre-filled message. The contact page also includes direct WhatsApp links.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure your domain (trendyfashionzone.online)
4. Deploy!

### DNS Configuration

Point your domain to Vercel's servers:
- A record: 76.76.21.21 (or as provided by Vercel)
- CNAME: cname.vercel-dns.com

## 📊 SEO Optimization

- Meta tags for all pages
- Open Graph tags for social sharing
- Structured data (JSON-LD)
- Canonical URLs
- Sitemap generation (recommended)
- robots.txt configuration

## 🧪 Testing

```bash
npm run lint
```

## 📄 License

Copyright © 2025 Trendy Fashion Zone. All rights reserved.

## 🤝 Support

For support, email nelsonochieng516@gmail.com or contact via WhatsApp: +254 743 869 564

