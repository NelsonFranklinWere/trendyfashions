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

// Main Categories (Top-Level Menu) - Only including working categories
export const mainCategories: MainCategory[] = [
  {
    id: 'mens-officials',
    name: "Men's Officials",
    slug: 'mens-officials',
    href: '/collections/mens-officials',
    hasSubcategories: true,
    subcategories: [
      {
        id: 'clarks-official',
        name: 'Clarks Officials',
        slug: 'clarks-official',
        href: '/collections/mens-officials?filter=Clarks',
        parentCategory: 'mens-officials',
      },
      {
        id: 'empire-official',
        name: 'Empire Officials',
        slug: 'empire-official',
        href: '/collections/mens-officials?filter=Empire',
        parentCategory: 'mens-officials',
      },
      {
        id: 'official-boots',
        name: 'Official Boots',
        slug: 'official-boots',
        href: '/collections/mens-officials?filter=Boots',
        parentCategory: 'mens-officials',
      },
      {
        id: 'corporate-casuals',
        name: 'Corporate Casuals',
        slug: 'corporate-casuals',
        href: '/collections/mens-officials?filter=Casuals',
        parentCategory: 'mens-officials',
      },
    ],
  },
  {
    id: 'casual',
    name: 'Casual Shoes',
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
    id: 'vans',
    name: 'Vans',
    slug: 'vans',
    href: '/collections/vans',
    hasSubcategories: false,
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

// Category groups for homepage display - Updated to match working categories
export const categoryGroups = {
  officials: {
    name: 'Official Shoes',
    slug: 'mens-officials',
    subcategories: ['Clarks Officials', 'Empire Officials', 'Official Boots', 'Corporate Casuals'],
  },
  casual: {
    name: 'Casual Shoes',
    slug: 'casual',
    subcategories: ['Lacoste Casuals', 'Timberland Casuals', 'Official Casuals', 'General Casuals'],
  },
  sports: {
    name: 'Sports & Running',
    slug: 'sports',
    subcategories: ['Running Shoes', 'Training / Gym Shoes', 'Football Boots', 'Outdoor Trail Sneakers'],
  },
  vans: {
    name: 'Vans',
    slug: 'vans',
    subcategories: [],
  },
};
