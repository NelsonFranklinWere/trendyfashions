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

// Main Categories (Top-Level Menu)
export const mainCategories: MainCategory[] = [
  {
    id: 'mens-shoes',
    name: "Men's Shoes",
    slug: 'mens-shoes',
    href: '/collections/mens-officials',
    hasSubcategories: true,
    subcategories: [
      // A. Official Shoes
      {
        id: 'dress-shoes',
        name: 'Dress Shoes',
        slug: 'dress-shoes',
        href: '/collections/mens-officials?filter=Dress Shoes',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'leather-loafers',
        name: 'Leather Loafers',
        slug: 'leather-loafers',
        href: '/collections/mens-officials?filter=Leather Loafers',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'oxford-derby',
        name: 'Oxford / Derby',
        slug: 'oxford-derby',
        href: '/collections/mens-officials?filter=Oxford',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'clarks-official',
        name: 'Clarks (Official)',
        slug: 'clarks-official',
        href: '/collections/mens-officials?filter=Clarks',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'official-boots',
        name: 'Official Boots',
        slug: 'official-boots',
        href: '/collections/mens-officials?filter=Boots',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'corporate-casuals',
        name: 'Corporate Casuals',
        slug: 'corporate-casuals',
        href: '/collections/mens-officials?filter=Casuals',
        parentCategory: 'mens-shoes',
      },
      // B. Casual Shoes
      {
        id: 'canvas',
        name: 'Canvas',
        slug: 'canvas',
        href: '/collections/casual?filter=Canvas',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'slip-ons',
        name: 'Slip-Ons',
        slug: 'slip-ons',
        href: '/collections/casual?filter=Slip-Ons',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'clarks-casual',
        name: 'Clarks Casual',
        slug: 'clarks-casual',
        href: '/collections/casual?filter=Clarks',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'weekend-casuals',
        name: 'Weekend/Everyday Casuals',
        slug: 'weekend-casuals',
        href: '/collections/casual',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'mules-men',
        name: 'Mules (Men)',
        slug: 'mules-men',
        href: '/collections/mens-officials?filter=Mules',
        parentCategory: 'mens-shoes',
      },
      // C. Sneakers
      {
        id: 'nike',
        name: 'Nike',
        slug: 'nike',
        href: '/collections/nike',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'adidas',
        name: 'Adidas',
        slug: 'adidas',
        href: '/collections/sneakers?filter=Addidas',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'new-balance',
        name: 'New Balance',
        slug: 'new-balance',
        href: '/collections/sneakers?filter=New Balance',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'converse',
        name: 'Converse',
        slug: 'converse',
        href: '/collections/sneakers?filter=Converse',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'vans',
        name: 'Vans',
        slug: 'vans',
        href: '/collections/vans',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'generic-fashion-sneakers',
        name: 'Generic Fashion Sneakers',
        slug: 'generic-fashion-sneakers',
        href: '/collections/sneakers',
        parentCategory: 'mens-shoes',
      },
      // D. Sports & Running
      {
        id: 'running-shoes',
        name: 'Running Shoes',
        slug: 'running-shoes',
        href: '/collections/sports?filter=Running',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'training-gym',
        name: 'Training / Gym Shoes',
        slug: 'training-gym',
        href: '/collections/sports?filter=Training',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'football-boots',
        name: 'Football Boots',
        slug: 'football-boots',
        href: '/collections/sports?filter=Football',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'outdoor-trail',
        name: 'Outdoor Trail Sneakers',
        slug: 'outdoor-trail',
        href: '/collections/sports?filter=Trail',
        parentCategory: 'mens-shoes',
      },
      // E. Boots (Men)
      {
        id: 'timberland',
        name: 'Timberland',
        slug: 'timberland',
        href: '/collections/casual?filter=Timberland',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'dr-martens',
        name: 'Dr. Martens',
        slug: 'dr-martens',
        href: '/collections/casual?filter=Dr. Martens',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'combat-boots',
        name: 'Combat Boots',
        slug: 'combat-boots',
        href: '/collections/casual?filter=Combat',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'chelsea-boots',
        name: 'Chelsea Boots',
        slug: 'chelsea-boots',
        href: '/collections/casual?filter=Chelsea',
        parentCategory: 'mens-shoes',
      },
      // F. Air Collection (Nike products)
      {
        id: 'airforce',
        name: 'Airforce',
        slug: 'airforce',
        href: '/collections/nike',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'airmax',
        name: 'Airmax',
        slug: 'airmax',
        href: '/collections/nike',
        parentCategory: 'mens-shoes',
      },
      {
        id: 'jordan',
        name: 'Jordan',
        slug: 'jordan',
        href: '/collections/nike',
        parentCategory: 'mens-shoes',
      },
    ],
  },
  {
    id: 'unisex-collection',
    name: 'Unisex Collection',
    slug: 'unisex-collection',
    href: '/collections',
    hasSubcategories: true,
    subcategories: [
      {
        id: 'unisex-sneakers',
        name: 'Unisex Sneakers',
        slug: 'unisex-sneakers',
        href: '/collections/sneakers',
        parentCategory: 'unisex-collection',
      },
      {
        id: 'unisex-sports',
        name: 'Unisex Sports',
        slug: 'unisex-sports',
        href: '/collections/sports',
        parentCategory: 'unisex-collection',
      },
      {
        id: 'unisex-casual',
        name: 'Unisex Casual',
        slug: 'unisex-casual',
        href: '/collections/casual',
        parentCategory: 'unisex-collection',
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

// Category groups for homepage display
export const categoryGroups = {
  official: {
    name: 'Official Shoes',
    slug: 'officials',
    subcategories: ['Dress Shoes', 'Leather Loafers', 'Oxford / Derby', 'Clarks (Official)', 'Official Boots', 'Corporate Casuals'],
  },
  casual: {
    name: 'Casual Shoes',
    slug: 'casuals',
    subcategories: ['Canvas', 'Slip-Ons', 'Clarks Casual', 'Weekend/Everyday Casuals', 'Mules (Men)'],
  },
  sneakers: {
    name: 'Sneakers',
    slug: 'sneakers',
    subcategories: ['Nike', 'Adidas', 'New Balance', 'Converse', 'Vans', 'Generic Fashion Sneakers'],
  },
  sports: {
    name: 'Sports & Running',
    slug: 'sports',
    subcategories: ['Running Shoes', 'Training / Gym Shoes', 'Football Boots', 'Outdoor Trail Sneakers'],
  },
  boots: {
    name: 'Boots (Men)',
    slug: 'boots',
    subcategories: ['Timberland', 'Dr. Martens', 'Combat Boots', 'Chelsea Boots'],
  },
  air: {
    name: 'Air Collection',
    slug: 'air',
    subcategories: ['Airforce', 'Airmax', 'Jordan'],
  },
};
