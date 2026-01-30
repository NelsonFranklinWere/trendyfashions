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

/**
 * FAQ Schema for featured snippets
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export function getFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Default FAQs for shoe store - optimized for Nairobi searches
 */
export function getDefaultStoreFAQs(): FAQItem[] {
  return [
    {
      question: 'Are the shoes at Trendy Fashion Zone original?',
      answer: 'Yes, all our shoes are 100% original and authentic. We source directly from authorized suppliers and have been a trusted shoe store in Nairobi for over 5 years.',
    },
    {
      question: 'Do you deliver shoes in Nairobi?',
      answer: 'Yes, we offer delivery services throughout Nairobi and across Kenya. Delivery within Nairobi CBD is available same-day for orders placed before 2 PM.',
    },
    {
      question: 'Where is Trendy Fashion Zone located?',
      answer: 'We are located on Moi Avenue in Nairobi CBD, Kenya. Visit us to try on shoes before purchasing or order online via WhatsApp.',
    },
    {
      question: 'What brands do you sell?',
      answer: 'We stock popular brands including Nike Airforce, Air Jordan, Airmax, Clarks, Vans, New Balance, Timberland, and many more. We have sneakers, officials, casuals, and sports footwear.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept M-Pesa, cash on delivery within Nairobi, and bank transfers. Payment is easy and secure.',
    },
    {
      question: 'Can I return or exchange shoes?',
      answer: 'Yes, we accept returns and exchanges within 7 days of purchase for unworn shoes in original condition. Contact us via WhatsApp to arrange a return.',
    },
  ];
}

/**
 * Review Schema for customer testimonials
 */
export interface ReviewData {
  author: string;
  reviewBody: string;
  ratingValue: number;
  datePublished: string;
}

export function getAggregateReviewSchema(reviews?: ReviewData[]) {
  const defaultReviews: ReviewData[] = [
    {
      author: 'James K.',
      reviewBody: 'Excellent quality Nike Airforce! The shoes are 100% original and the service was great. Will definitely buy again.',
      ratingValue: 5,
      datePublished: '2024-12-15',
    },
    {
      author: 'Mary W.',
      reviewBody: 'Fast delivery to Westlands and the Clarks officials are very comfortable for office wear. Highly recommend!',
      ratingValue: 5,
      datePublished: '2024-11-20',
    },
    {
      author: 'Peter M.',
      reviewBody: 'Great selection of sneakers. Found exactly what I was looking for at a fair price. The staff was helpful.',
      ratingValue: 4,
      datePublished: '2024-10-08',
    },
  ];

  const reviewsToUse = reviews || defaultReviews;

  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Trendy Fashion Zone',
    url: 'https://trendyfashionzone.co.ke',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
      bestRating: '5',
      worstRating: '1',
    },
    review: reviewsToUse.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewBody: review.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.ratingValue.toString(),
        bestRating: '5',
        worstRating: '1',
      },
      datePublished: review.datePublished,
    })),
  };
}

/**
 * Speakable Schema for voice search and AI assistants (GEO optimization)
 * Use this to mark content that should be read aloud by voice assistants
 */
export function getSpeakableSchema(cssSelectors: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Trendy Fashion Zone - Original Shoes in Nairobi',
    url: 'https://trendyfashionzone.co.ke',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
  };
}

/**
 * Article Schema for citation by AI engines (GEO optimization)
 * Helps AI chatbots understand and cite your content properly
 */
export function getArticleSchema(data: {
  headline: string;
  description: string;
  url: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    url: data.url,
    author: {
      '@type': 'Organization',
      name: data.author || 'Trendy Fashion Zone',
      url: 'https://trendyfashionzone.co.ke',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Trendy Fashion Zone',
      logo: {
        '@type': 'ImageObject',
        url: 'https://trendyfashionzone.co.ke/images/logos/Logo.jpg',
      },
    },
    datePublished: data.datePublished || new Date().toISOString(),
    dateModified: data.dateModified || new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
  };
}

/**
 * How-To Schema for step-by-step guides (great for AI citations)
 */
export interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

export function getHowToSchema(data: {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.name,
    description: data.description,
    totalTime: data.totalTime,
    step: data.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      url: step.url,
    })),
  };
}
