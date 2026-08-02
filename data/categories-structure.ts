// Navbar + admin category structure for Trendy Fashion Zone

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  href: string;
  parentCategory: string;
}

export interface MainCategory {
  id: string;
  name: string;
  slug: string;
  href: string;
  hasSubcategories: boolean;
  subcategories?: SubCategory[];
  /** Nested groups (e.g. Men / Women under Clothing) */
  groups?: {
    id: string;
    name: string;
    items: SubCategory[];
  }[];
}

/** Horizontal brand/type filter buttons per collection slug */
export const COLLECTION_FILTER_OPTIONS: Record<string, string[]> = {
  officials: ['All', 'Clarks', 'John Fosters', 'Boots', 'Empire'],
  casual: ['All', 'Lacoste', 'Timberland', 'Boss', 'Other'],
  sneakers: ['All', 'Nike', 'Adidas', 'Puma', 'Jordan', 'New Balance', 'Other'],
  sports: ['All', 'Running', 'Training', 'Football', 'Trail'],
  clothing: [
    'All',
    'Trousers',
    'Shirts',
    'Official Shirts',
    'Casual',
    'Polo Shirts',
    'Shorts',
    'Dresses',
    'Tracksuits',
  ],
  loafers: ['All'],
  sandals: ['All'],
  vans: ['All'],
  sale: ['All'],
  'new-arrivals': ['All'],
};

/** Admin product categories (flat list for create/edit forms) */
export const adminProductCategories: { value: string; label: string; group: string }[] = [
  { value: 'officials', label: 'Officials', group: 'Shoes' },
  { value: 'casual', label: 'Casuals', group: 'Shoes' },
  { value: 'sneakers', label: 'Sneakers', group: 'Shoes' },
  { value: 'sports', label: 'Sports', group: 'Shoes' },
  { value: 'loafers', label: 'Loafers', group: 'Shoes' },
  { value: 'sandals', label: 'Sandals', group: 'Shoes' },
  { value: 'vans', label: 'Vans', group: 'Shoes' },
  { value: 'clothing', label: 'Clothing', group: 'Clothing' },
];

/** Brand / type options by admin category */
export const ADMIN_SUBCATEGORY_OPTIONS: Record<string, { value: string; label: string }[]> = {
  officials: [
    { value: 'clarks', label: 'Clarks' },
    { value: 'john-fosters', label: 'John Fosters' },
    { value: 'boots', label: 'Boots' },
    { value: 'empire', label: 'Empire' },
    { value: 'other', label: 'Other' },
  ],
  casual: [
    { value: 'lacoste', label: 'Lacoste' },
    { value: 'timberland', label: 'Timberland' },
    { value: 'boss', label: 'Boss' },
    { value: 'other', label: 'Other' },
  ],
  sneakers: [
    { value: 'nike', label: 'Nike' },
    { value: 'adidas', label: 'Adidas' },
    { value: 'puma', label: 'Puma' },
    { value: 'jordan', label: 'Jordan' },
    { value: 'new-balance', label: 'New Balance' },
    { value: 'other', label: 'Other' },
  ],
  sports: [
    { value: 'running', label: 'Running' },
    { value: 'training', label: 'Training' },
    { value: 'football', label: 'Football' },
    { value: 'trail', label: 'Trail' },
    { value: 'other', label: 'Other' },
  ],
  clothing: [
    // Men
    { value: 'trousers', label: 'Trousers (Men)' },
    { value: 'shirts', label: 'Shirts (Men)' },
    { value: 'official-shirts', label: 'Official Shirts (Men)' },
    { value: 'casual', label: 'Casual (Men)' },
    { value: 'polo-shirts', label: 'Polo Shirts (Men)' },
    { value: 'shorts', label: 'Shorts (Men)' },
    // Women
    { value: 'dresses', label: 'Dresses (Women)' },
    // Both
    { value: 'tracksuits', label: 'Tracksuits' },
  ],
  loafers: [],
  sandals: [],
  vans: [],
};

/** Top-level navbar menus */
export const mainCategories: MainCategory[] = [
  {
    id: 'shoes',
    name: 'Shoes',
    slug: 'shoes',
    href: '/collections/officials',
    hasSubcategories: true,
    subcategories: [
      {
        id: 'shoe-casual',
        name: 'Casuals',
        slug: 'casual',
        href: '/collections/casual',
        parentCategory: 'shoes',
      },
      {
        id: 'shoe-officials',
        name: 'Officials',
        slug: 'officials',
        href: '/collections/officials',
        parentCategory: 'shoes',
      },
      {
        id: 'shoe-sneakers',
        name: 'Sneakers',
        slug: 'sneakers',
        href: '/collections/sneakers',
        parentCategory: 'shoes',
      },
      {
        id: 'shoe-loafers',
        name: 'Loafers',
        slug: 'loafers',
        href: '/collections/loafers',
        parentCategory: 'shoes',
      },
      {
        id: 'shoe-sandals',
        name: 'Sandals',
        slug: 'sandals',
        href: '/collections/sandals',
        parentCategory: 'shoes',
      },
      {
        id: 'shoe-vans',
        name: 'Vans',
        slug: 'vans',
        href: '/collections/vans',
        parentCategory: 'shoes',
      },
      {
        id: 'shoe-sports',
        name: 'Sports',
        slug: 'sports',
        href: '/collections/sports',
        parentCategory: 'shoes',
      },
      {
        id: 'shoe-timberland',
        name: 'Timberland',
        slug: 'timberland',
        href: '/collections/casual?filter=Timberland',
        parentCategory: 'shoes',
      },
      {
        id: 'shoe-lacoste',
        name: 'Lacoste',
        slug: 'lacoste',
        href: '/collections/casual?filter=Lacoste',
        parentCategory: 'shoes',
      },
    ],
  },
  {
    id: 'clothing',
    name: 'Clothing',
    slug: 'clothing',
    href: '/collections/clothing',
    hasSubcategories: true,
    groups: [
      {
        id: 'men',
        name: 'Men',
        items: [
          {
            id: 'men-trousers',
            name: 'Trousers',
            slug: 'trousers',
            href: '/collections/clothing?filter=Trousers&gender=Men',
            parentCategory: 'clothing',
          },
          {
            id: 'men-shirts',
            name: 'Shirts',
            slug: 'shirts',
            href: '/collections/clothing?filter=Shirts&gender=Men',
            parentCategory: 'clothing',
          },
          {
            id: 'men-official-shirts',
            name: 'Official Shirts',
            slug: 'official-shirts',
            href: '/collections/clothing?filter=Official+Shirts&gender=Men',
            parentCategory: 'clothing',
          },
          {
            id: 'men-casual',
            name: 'Casual',
            slug: 'casual',
            href: '/collections/clothing?filter=Casual&gender=Men',
            parentCategory: 'clothing',
          },
          {
            id: 'men-polo',
            name: 'Polo Shirts',
            slug: 'polo-shirts',
            href: '/collections/clothing?filter=Polo+Shirts&gender=Men',
            parentCategory: 'clothing',
          },
          {
            id: 'men-shorts',
            name: 'Shorts',
            slug: 'shorts',
            href: '/collections/clothing?filter=Shorts&gender=Men',
            parentCategory: 'clothing',
          },
          {
            id: 'men-tracksuits',
            name: 'Tracksuits',
            slug: 'tracksuits',
            href: '/collections/clothing?filter=Tracksuits&gender=Men',
            parentCategory: 'clothing',
          },
        ],
      },
      {
        id: 'women',
        name: 'Women',
        items: [
          {
            id: 'women-dresses',
            name: 'Dresses',
            slug: 'dresses',
            href: '/collections/clothing?filter=Dresses&gender=Women',
            parentCategory: 'clothing',
          },
          {
            id: 'women-tracksuits',
            name: 'Tracksuits',
            slug: 'tracksuits',
            href: '/collections/clothing?filter=Tracksuits&gender=Women',
            parentCategory: 'clothing',
          },
        ],
      },
    ],
    subcategories: [
      {
        id: 'clothing-all',
        name: 'All Clothing',
        slug: 'clothing',
        href: '/collections/clothing',
        parentCategory: 'clothing',
      },
    ],
  },
  {
    id: 'sale',
    name: 'Sale',
    slug: 'sale',
    href: '/collections/sale',
    hasSubcategories: false,
  },
  {
    id: 'new-arrivals',
    name: 'New Arrivals',
    slug: 'new-arrivals',
    href: '/collections/new-arrivals',
    hasSubcategories: false,
  },
];

/** Collection pages shown as “shop by category” cards (shoes + clothing) */
export const storefrontCollectionMeta: {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}[] = [
  {
    id: 'officials',
    name: 'Officials',
    slug: 'officials',
    description: 'Professional office and formal shoes for men',
    image: '/categories/officials/clarks-officials/ClarksOfficials1.jpg',
  },
  {
    id: 'casual',
    name: 'Casuals',
    slug: 'casual',
    description: 'Casual shoes for everyday comfort and style',
    image: '/categories/casual/lacoste-casuals/LacosteCassual1.jpg',
  },
  {
    id: 'sneakers',
    name: 'Sneakers',
    slug: 'sneakers',
    description: 'Modern sneakers for style and comfort',
    image: '/categories/casual/lacoste-casuals/LacosteCassual2.jpg',
  },
  {
    id: 'loafers',
    name: 'Loafers',
    slug: 'loafers',
    description: 'Classic loafers for smart casual and office looks',
    image: '/logo/Logo.jpg',
  },
  {
    id: 'sandals',
    name: 'Sandals',
    slug: 'sandals',
    description: 'Comfortable sandals for warm weather',
    image: '/logo/Logo.jpg',
  },
  {
    id: 'vans',
    name: 'Vans',
    slug: 'vans',
    description: 'Vans and skate-inspired casuals',
    image: '/logo/Logo.jpg',
  },
  {
    id: 'sports',
    name: 'Sports',
    slug: 'sports',
    description: 'Sports and athletic footwear',
    image: '/categories/casual/timberland-casuals/TimbaCasual1.jpg',
  },
  {
    id: 'clothing',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Men clothing and women dresses & tracksuits',
    image: '/logo/Logo.jpg',
  },
  {
    id: 'sale',
    name: 'Sale',
    slug: 'sale',
    description: 'Products on sale right now',
    image: '/logo/Logo.jpg',
  },
  {
    id: 'new-arrivals',
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'Latest drops at Trendy Fashion Zone',
    image: '/logo/Logo.jpg',
  },
];
