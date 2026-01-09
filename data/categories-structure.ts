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
        id: 'empire-official',
        name: 'Empire Officials',
        slug: 'empire-official',
        href: '/collections/mens-officials?filter=Empire',
        parentCategory: 'mens-officials',
      },
      {
        id: 'clarks-official',
        name: 'Clarks Officials',
        slug: 'clarks-official',
        href: '/collections/mens-officials?filter=Clarks',
        parentCategory: 'mens-officials',
      },
      {
        id: 'official-boats',
        name: 'Off-Boat Shoes',
        slug: 'official-boats',
        href: '/collections/mens-officials?filter=Off-Boats',
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
        id: 'boss-casual',
        name: 'Boss Casuals',
        slug: 'boss-casual',
        href: '/collections/casual?filter=Boss',
        parentCategory: 'casual',
      },
      {
        id: 'lacoste-casual',
        name: 'Lacoste Casuals',
        slug: 'lacoste-casual',
        href: '/collections/casual?filter=Lacoste',
        parentCategory: 'casual',
      },
      {
        id: 'tommy-hilfiger-casual',
        name: 'Tommy Hilfiger Casuals',
        slug: 'tommy-hilfiger-casual',
        href: '/collections/casual?filter=Tommy Hilfiger',
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
    hasSubcategories: true,
    subcategories: [
      {
        id: 'skater-vans',
        name: 'Skater Vans',
        slug: 'skater-vans',
        href: '/collections/vans?filter=Skater',
        parentCategory: 'vans',
      },
      {
        id: 'custom-vans',
        name: 'Custom Vans',
        slug: 'custom-vans',
        href: '/collections/vans?filter=Custom',
        parentCategory: 'vans',
      },
      {
        id: 'general-vans',
        name: 'General Vans',
        slug: 'general-vans',
  casual: {
    name: 'Casual Shoes',
    slug: 'casual',
    subcategories: ['Boss Casuals', 'Lacoste Casuals', 'Tommy Hilfiger Casuals', 'Timberland Casuals', 'General Casuals'],
  },
  officials: {
    name: 'Official Shoes',
    slug: 'mens-officials',
    subcategories: ['Empire Officials', 'Clarks Officials', 'Off-Boat Shoes', 'Corporate Casuals'],
  },
  sports: {
    name: 'Sports & Running',
    slug: 'sports',
    subcategories: ['Running Shoes', 'Training / Gym Shoes', 'Football Boots', 'Outdoor Trail Sneakers'],
  },
  vans: {
    name: 'Vans',
    slug: 'vans',
    subcategories: ['Skater Vans', 'Custom Vans', 'General Vans'
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
