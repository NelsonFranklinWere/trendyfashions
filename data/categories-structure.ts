// Main categories and subcategories structure for Nairobi-optimized men's shoe e-commerce

export interface MainCategory {
  id: string;
  name: string;
  slug: string;
  href: string;
  hasSubcategories: boolean;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  href: string;
  parentCategory: string;
}

// Main Categories (Top-Level Menu) - Updated structure
export const mainCategories: MainCategory[] = [
  {
    id: 'officials',
    name: 'Officials',
    slug: 'officials',
    href: '/collections/officials',
    hasSubcategories: true,
    subcategories: [
      {
        id: 'clarks-official',
        name: 'Clarks Officials',
        slug: 'clarks-official',
        href: '/collections/officials?filter=Clarks',
        parentCategory: 'officials',
      },
      {
        id: 'empire-official',
        name: 'Empire Officials',
        slug: 'empire-official',
        href: '/collections/officials?filter=Empire',
        parentCategory: 'officials',
      },
      {
        id: 'official-boots',
        name: 'Official Boots',
        slug: 'official-boots',
        href: '/collections/officials?filter=Boots',
        parentCategory: 'officials',
      },
      {
        id: 'corporate-casuals',
        name: 'Corporate Casuals',
        slug: 'corporate-casuals',
        href: '/collections/officials?filter=Casuals',
        parentCategory: 'officials',
      },
    ],
  },
  {
    id: 'casual',
    name: 'Casual',
    slug: 'casual',
    href: '/collections/casual',
    hasSubcategories: true,
    subcategories: [
      {
        id: 'lacoste-casual',
        name: 'Lacoste Casuals',
        slug: 'lacoste-casual',
        href: '/collections/casual?filter=Lacoste',
        parentCategory: 'casual',
      },
      {
        id: 'timberland-casual',
        name: 'Timberland Casuals',
        slug: 'timberland-casual',
        href: '/collections/casual?filter=Timberland',
        parentCategory: 'casual',
      },
      {
        id: 'official-casual',
        name: 'Official Casuals',
        slug: 'official-casual',
        href: '/collections/casual?filter=official',
        parentCategory: 'casual',
      },
      {
        id: 'general-casual',
        name: 'General Casuals',
        slug: 'general-casual',
        href: '/collections/casual',
        parentCategory: 'casual',
      },
    ],
  },
  {
    id: 'sneakers',
    name: 'Sneakers',
    slug: 'sneakers',
    href: '/collections/sneakers',
    hasSubcategories: true,
    subcategories: [
      {
        id: 'nike-sneakers',
        name: 'Nike Sneakers',
        slug: 'nike-sneakers',
        href: '/collections/sneakers?filter=Nike',
        parentCategory: 'sneakers',
      },
      {
        id: 'adidas-sneakers',
        name: 'Adidas Sneakers',
        slug: 'adidas-sneakers',
        href: '/collections/sneakers?filter=Adidas',
        parentCategory: 'sneakers',
      },
      {
        id: 'puma-sneakers',
        name: 'Puma Sneakers',
        slug: 'puma-sneakers',
        href: '/collections/sneakers?filter=Puma',
        parentCategory: 'sneakers',
      },
      {
        id: 'general-sneakers',
        name: 'General Sneakers',
        slug: 'general-sneakers',
        href: '/collections/sneakers',
        parentCategory: 'sneakers',
      },
    ],
  },
  {
    id: 'sports',
    name: 'Sports & Running',
    slug: 'sports',
    href: '/collections/sports',
    hasSubcategories: true,
    subcategories: [
      {
        id: 'running-shoes',
        name: 'Running Shoes',
        slug: 'running-shoes',
        href: '/collections/sports?filter=Running',
        parentCategory: 'sports',
      },
      {
        id: 'training-gym',
        name: 'Training / Gym Shoes',
        slug: 'training-gym',
        href: '/collections/sports?filter=Training',
        parentCategory: 'sports',
      },
      {
        id: 'football-boots',
        name: 'Football Boots',
        slug: 'football-boots',
        href: '/collections/sports?filter=Football',
        parentCategory: 'sports',
      },
      {
        id: 'outdoor-trail',
        name: 'Outdoor Trail Sneakers',
        slug: 'outdoor-trail',
        href: '/collections/sports?filter=Trail',
        parentCategory: 'sports',
      },
    ],
  },
  {
    id: 'new-arrivals',
    name: 'New Arrivals',
    slug: 'new-arrivals',
    href: '/collections?filter=New Arrivals',
    hasSubcategories: false,
  },
  {
    id: 'best-sellers',
    name: 'Best Sellers',
    slug: 'best-sellers',
    href: '/collections?filter=Best Sellers',
    hasSubcategories: false,
  },
];

// Category groups for homepage display - Updated structure
export const categoryGroups = {
  officials: {
    name: 'Officials',
    slug: 'officials',
    subcategories: ['Clarks Officials', 'Empire Officials', 'Official Boots', 'Corporate Casuals'],
  },
  casual: {
    name: 'Casual',
    slug: 'casual',
    subcategories: ['Lacoste Casuals', 'Timberland Casuals', 'Official Casuals', 'General Casuals'],
  },
  sneakers: {
    name: 'Sneakers',
    slug: 'sneakers',
    subcategories: ['Nike Sneakers', 'Adidas Sneakers', 'Puma Sneakers', 'General Sneakers'],
  },
  sports: {
    name: 'Sports & Running',
    slug: 'sports',
    subcategories: ['Running Shoes', 'Training / Gym Shoes', 'Football Boots', 'Outdoor Trail Sneakers'],
  },
};
