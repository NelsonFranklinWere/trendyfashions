import type { FeedProduct } from '@/lib/catalog/feedUtils';
import { escapeXml, formatGooglePrice, getSiteUrl } from '@/lib/catalog/feedUtils';

export function buildGoogleMerchantRss(products: FeedProduct[]): string {
  const siteUrl = getSiteUrl();
  const updated = new Date().toUTCString();

  const items = products
    .map((p) => {
      return `    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <title>${escapeXml(p.title)}</title>
      <description>${escapeXml(p.description)}</description>
      <link>${escapeXml(p.link)}</link>
      <g:image_link>${escapeXml(p.imageLink)}</g:image_link>
      <g:availability>${p.availability}</g:availability>
      <g:condition>${p.condition}</g:condition>
      <g:price>${escapeXml(formatGooglePrice(p.price, p.currency))}</g:price>
      <g:brand>${escapeXml(p.brand)}</g:brand>
      <g:google_product_category>${escapeXml(p.googleProductCategory)}</g:google_product_category>
      <g:product_type>${escapeXml(p.category)}</g:product_type>
      <g:identifier_exists>false</g:identifier_exists>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Trendy Fashion Zone</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Original shoes in Nairobi CBD — officials, casuals, sneakers, sports footwear.</description>
    <lastBuildDate>${updated}</lastBuildDate>
${items}
  </channel>
</rss>`;
}
