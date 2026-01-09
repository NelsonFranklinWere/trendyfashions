import { GetServerSideProps } from 'next';
import { categories } from '@/data/products';
import { siteConfig } from '@/lib/seo/config';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

function generateSitemap(urls: SitemapUrl[]): string {
  const urlsXml = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlsXml}
</urlset>`;
}

const Sitemap = () => {
  // This component will never render, it's just for the XML response
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = siteConfig.url;
  const currentDate = new Date().toISOString().split('T')[0];

  // Define all URLs with their priorities and change frequencies
  const urls: SitemapUrl[] = [
    // Homepage - highest priority
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0',
    },
    // Collections index
    {
      loc: `${baseUrl}/collections`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9',
    },
    // Category pages - high priority
    ...categories.map((category) => ({
      loc: `${baseUrl}/collections/${category.slug}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8',
    })),
    // About page
    {
      loc: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7',
    },
    // Contact page
    {
      loc: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7',
    },
  ];

  const sitemap = generateSitemap(urls);

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;

