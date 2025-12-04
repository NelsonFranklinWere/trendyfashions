/**
 * Structured Data (JSON-LD) for SEO
 */

export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    '@type': string;
    streetAddress: string;
    addressLocality: string;
    addressCountry: string;
  };
  contactPoint: {
    '@type': string;
    telephone: string;
    contactType: string;
  };
}

export interface ProductSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image: string;
  brand: {
    '@type': string;
    name: string;
  };
  offers: {
    '@type': string;
    price: string;
    priceCurrency: string;
    availability: string;
  };
}

export interface WebSiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  potentialAction: {
    '@type': string;
    target: {
      '@type': string;
      urlTemplate: string;
    };
    'query-input': string;
  };
}

export function getOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Trendy Fashion Zone',
    url: 'https://trendyfashionzone.co.ke',
    logo: 'https://trendyfashionzone.co.ke/images/logos/Logo.jpg',
    description: 'Nairobi\'s premier destination for quality original shoes, best sellers, sneakers, officials, casuals, Airforce, Airmax, and Jordans. 5+ years of trusted fashion.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Moi Avenue',
      addressLocality: 'Nairobi',
      addressCountry: 'KE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+254743869564',
      contactType: 'Customer Service',
    },
  };
}

export function getProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  brand?: string;
}): ProductSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image.startsWith('http') ? product.image : `https://trendyfashionzone.co.ke${product.image}`,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Trendy Fashion Zone',
    },
    offers: {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: 'KES',
      availability: 'https://schema.org/InStock',
    },
  };
}

export function getWebSiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Trendy Fashion Zone',
    url: 'https://trendyfashionzone.co.ke',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://trendyfashionzone.co.ke/collections?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `https://trendyfashionzone.co.ke${item.url}`,
    })),
  };
}
