// Complete product data based on collection.html
// This file contains all products with proper categorization
// Images are organized in public/images/{category}/

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string; // Maps to: casual, customized, formal, running, sports
  gender?: 'Men' | 'Unisex';
  tags?: string[];
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  featured: boolean;
}

// Updated categories to match collection.html structure
export const categories: Category[] = [
  {
    id: 'casual',
    name: 'Casual',
    slug: 'casual',
    description: 'Stylish casual shoes for everyday wear',
    image: '/images/casual/NikeSB.jpg',
    featured: true,
  },
  {
    id: 'customized',
    name: 'Customized',
    slug: 'customized',
    description: 'Custom designed shoes with unique styles',
    image: '/images/customized/Air-force-customized.jpg',
    featured: true,
  },
  {
    id: 'formal',
    name: 'Formal',
    slug: 'formal',
    description: 'Professional office and formal shoes',
    image: '/images/officials/Empire-Officials-1.jpg',
    featured: true,
  },
  {
    id: 'running',
    name: 'Running',
    slug: 'running',
    description: 'Running shoes and athletic footwear',
    image: '/images/running/Airmax90.jpg',
    featured: true,
  },
  {
    id: 'sports',
    name: 'Sports',
    slug: 'sports',
    description: 'Sports shoes including Jordans and football boots',
    image: '/images/sports/Jordan1.jpg',
    featured: true,
  },
];

// Complete product list based on collection.html
// Note: Images will be in public/images/{category}/ after organization
export const products: Product[] = [
  // CASUAL SHOES
  {
    id: 'casual-1',
    name: 'Adidas Samba',
    description: 'Stylish Adidas samba shoes',
    price: 2800,
    image: '/images/casual/Addidas-samba.jpg',
    category: 'casual',
    gender: 'Unisex',
    tags: ['New Arrivals'],
  },
  {
    id: 'casual-2',
    name: 'Adidas Special',
    description: 'Adidas Special edition',
    price: 2800,
    image: '/images/casual/Adidas-Special.jpg',
    category: 'casual',
    gender: 'Unisex',
  },
  {
    id: 'casual-3',
    name: 'Adidas Campus 1',
    description: 'Classic Adidas Campus shoes',
    price: 2800,
    image: '/images/casual/AdidasCampus1-1.jpg',
    category: 'casual',
    gender: 'Unisex',
    tags: ['New Arrivals'],
  },
  {
    id: 'casual-4',
    name: 'Adidas Samba Double Sole',
    description: 'Adidas Samba with double sole',
    price: 3000,
    image: '/images/casual/AdidasSamba-1.jpg',
    category: 'casual',
    gender: 'Unisex',
  },
  {
    id: 'casual-5',
    name: 'Nike SB Dunk',
    description: 'Classic skateboarding sneakers',
    price: 3300,
    image: '/images/casual/NikeSB.jpg',
    category: 'casual',
    gender: 'Unisex',
    featured: true,
  },
  {
    id: 'casual-6',
    name: 'Converse Black',
    description: 'Classic Converse Chuck Taylor',
    price: 1300,
    image: '/images/casual/Converse-Black.jpg',
    category: 'casual',
    gender: 'Unisex',
  },
  {
    id: 'casual-7',
    name: 'Converse Leather',
    description: 'Converse with leather finish',
    price: 1600,
    image: '/images/casual/Converse-Leather.jpg',
    category: 'casual',
    gender: 'Unisex',
  },
  {
    id: 'casual-8',
    name: 'Puma Roma 2',
    description: 'Sporty Puma Roma sneakers',
    price: 2800,
    image: '/images/casual/PumaRoma2.jpg',
    category: 'casual',
    gender: 'Unisex',
  },
  {
    id: 'casual-9',
    name: 'New Balance 530',
    description: 'Retro-inspired New Balance',
    price: 3700,
    image: '/images/casual/New-Balance-530.jpg',
    category: 'casual',
    gender: 'Unisex',
    tags: ['New Arrivals'],
  },
  {
    id: 'casual-10',
    name: 'Vans Skater',
    description: 'Classic Vans for street style',
    price: 3300,
    image: '/images/casual/Skater-Vans.jpg',
    category: 'casual',
    gender: 'Unisex',
  },
  {
    id: 'casual-11',
    name: 'Vans Off The Wall',
    description: 'Classic Vans Off The Wall',
    price: 2800,
    image: '/images/casual/VansOffTheWall1-1.jpg',
    category: 'casual',
    gender: 'Unisex',
  },
  {
    id: 'casual-12',
    name: 'Timberland Casual',
    description: 'Comfortable Timberland casual shoes',
    price: 3500,
    image: '/images/casual/Timber-Casual.jpg',
    category: 'casual',
    gender: 'Unisex',
  },
  {
    id: 'casual-13',
    name: 'Nike Cortex',
    description: 'Nike Cortex casual shoes',
    price: 3300,
    image: '/images/casual/CortexNike-1.jpg',
    category: 'casual',
    gender: 'Unisex',
  },
  {
    id: 'casual-14',
    name: 'Nike Air Portal',
    description: 'Modern Nike Air Portal',
    price: 3500,
    image: '/images/casual/NikeAirPortal2-1.jpg',
    category: 'casual',
    gender: 'Unisex',
    tags: ['New Arrivals'],
  },
  {
    id: 'casual-15',
    name: 'Opens Shoes',
    description: 'Breathable open-toe shoes',
    price: 2000,
    image: '/images/casual/Opens-Shoes-1.jpg',
    category: 'casual',
    gender: 'Unisex',
  },
  {
    id: 'casual-16',
    name: 'Flops',
    description: 'Casual flip-flops',
    price: 2500,
    image: '/images/casual/Flops.jpg',
    category: 'casual',
    gender: 'Unisex',
  },
  {
    id: 'casual-17',
    name: 'Mules',
    description: 'Comfortable mules',
    price: 2500,
    image: '/images/casual/Mules-1.jpg',
    category: 'casual',
    gender: 'Unisex',
  },

  // CUSTOMIZED SHOES
  {
    id: 'customized-1',
    name: 'Air Force 1 Customized',
    description: 'Custom Air Force 1 with unique design',
    price: 3200,
    image: '/images/customized/Air-force-customized.jpg',
    category: 'customized',
    gender: 'Unisex',
    featured: true,
  },
  {
    id: 'customized-2',
    name: 'Air Force 1 Custom Nola',
    description: 'Custom Air Force 1 design',
    price: 3200,
    image: '/images/customized/Air-Force-1-Customised-1.jpg',
    category: 'customized',
    gender: 'Unisex',
  },
  {
    id: 'customized-3',
    name: 'Air Force 1 Custom Collection',
    description: 'Premium customized Air Force 1',
    price: 3200,
    image: '/images/customized/AirForce1cusstom-1.jpg',
    category: 'customized',
    gender: 'Unisex',
    tags: ['New Arrivals'],
  },
  {
    id: 'customized-4',
    name: 'Vans Customized Codra',
    description: 'Custom Vans with unique design',
    price: 1800,
    image: '/images/customized/vans-customized-codra-1.jpg',
    category: 'customized',
    gender: 'Unisex',
  },
  {
    id: 'customized-5',
    name: 'Vans Double Sole Customised',
    description: 'Vans with double sole customization',
    price: 1800,
    image: '/images/customized/Vans-Double-sole-Customised-price-Ksh.-1800-1.jpg',
    category: 'customized',
    gender: 'Unisex',
  },
  {
    id: 'customized-6',
    name: 'Cactus Jack',
    description: 'Limited edition Cactus Jack design',
    price: 3300,
    image: '/images/customized/Cactus-Jack.jpg',
    category: 'customized',
    gender: 'Unisex',
  },
  {
    id: 'customized-7',
    name: 'Dior Customized',
    description: 'Custom Dior design',
    price: 3000,
    image: '/images/customized/Dior1-1.jpg',
    category: 'customized',
    gender: 'Unisex',
  },
  {
    id: 'customized-8',
    name: 'LV Animal Prints',
    description: 'Louis Vuitton animal print design',
    price: 3300,
    image: '/images/customized/LV-animal-prints.jpg',
    category: 'customized',
    gender: 'Unisex',
  },

  // FORMAL SHOES
  {
    id: 'formal-1',
    name: 'Empire Officials',
    description: 'Professional leather office shoes',
    price: 2800,
    image: '/images/officials/Empire-Officials-1.jpg',
    category: 'formal',
    gender: 'Men',
    tags: ['New Arrivals'],
    featured: true,
  },
  {
    id: 'formal-2',
    name: 'Official Timberland Boots',
    description: 'Durable official boots',
    price: 4500,
    image: '/images/officials/OfficialTimberBoots-1.jpg',
    category: 'formal',
    gender: 'Men',
  },
  {
    id: 'formal-3',
    name: 'Clarks Official',
    description: 'Classic Clarks official shoes',
    price: 2500,
    image: '/images/officials/Clarks.jpg',
    category: 'formal',
    gender: 'Men',
  },
  {
    id: 'formal-4',
    name: 'Clarks Highcuts',
    description: 'Premium Clarks highcuts',
    price: 3200,
    image: '/images/officials/ClarksHighCuts1-1.jpg',
    category: 'formal',
    gender: 'Men',
  },
  {
    id: 'formal-5',
    name: 'Lacoste Loafers',
    description: 'Premium leather loafers',
    price: 2800,
    image: '/images/officials/Lacoste-Loafers.jpg',
    category: 'formal',
    gender: 'Men',
  },
  {
    id: 'formal-6',
    name: 'Dr. Martens',
    description: 'Iconic Dr. Martens boots',
    price: 4000,
    image: '/images/officials/Dr.Martins.jpg',
    category: 'formal',
    gender: 'Unisex',
  },
  {
    id: 'formal-7',
    name: 'Loafers',
    description: 'Classic loafers',
    price: 2800,
    image: '/images/officials/loafer.jpg',
    category: 'formal',
    gender: 'Men',
  },
  {
    id: 'formal-8',
    name: 'Official Casuals',
    description: 'Smart casual official shoes',
    price: 3500,
    image: '/images/officials/OfficialCasuals-1.jpg',
    category: 'formal',
    gender: 'Unisex',
  },

  // RUNNING SHOES
  {
    id: 'running-1',
    name: 'Nike Air Max 90',
    description: 'Classic Air Max 90',
    price: 3000,
    image: '/images/running/Airmax90.jpg',
    category: 'running',
    gender: 'Unisex',
    tags: ['New Arrivals'],
    featured: true,
  },
  {
    id: 'running-2',
    name: 'Nike Air Max 97',
    description: 'Iconic Air Max 97',
    price: 3300,
    image: '/images/running/Airmax97.jpg',
    category: 'running',
    gender: 'Unisex',
  },
  {
    id: 'running-3',
    name: 'Nike Air Max',
    description: 'Classic Air Max',
    price: 3500,
    image: '/images/running/Airmax.jpg',
    category: 'running',
    gender: 'Unisex',
  },
  {
    id: 'running-4',
    name: 'Nike Jumptrack',
    description: 'Nike Jumptrack trainers',
    price: 3200,
    image: '/images/running/NikeJumptrack-1.jpg',
    category: 'running',
    gender: 'Unisex',
    tags: ['New Arrivals'],
  },
  {
    id: 'running-5',
    name: 'Nike Trainer',
    description: 'Nike Trainer series',
    price: 3000,
    image: '/images/running/NikeTrainer1-1.jpg',
    category: 'running',
    gender: 'Unisex',
  },
  {
    id: 'running-6',
    name: 'Umpro Trainer',
    description: 'Umpro Trainer shoes',
    price: 2200,
    image: '/images/running/umproTrainer-1.jpg',
    category: 'running',
    gender: 'Unisex',
  },
  {
    id: 'running-7',
    name: 'Nike Air Max Portal',
    description: 'Airmax Portal Blue white',
    price: 3500,
    image: '/images/running/NikeAirPortal2-1.jpg',
    category: 'running',
    gender: 'Unisex',
  },

  // SPORTS SHOES
  {
    id: 'sports-1',
    name: 'Air Jordan 1 Retro',
    description: 'Iconic Air Jordan 1',
    price: 3600,
    image: '/images/sports/Jordan1.jpg',
    category: 'sports',
    gender: 'Unisex',
    tags: ['New Arrivals'],
    featured: true,
  },
  {
    id: 'sports-2',
    name: 'Air Jordan 4',
    description: 'Classic Air Jordan 4',
    price: 3500,
    image: '/images/sports/jordan-4.jpg',
    category: 'sports',
    gender: 'Unisex',
  },
  {
    id: 'sports-3',
    name: 'Air Jordan 11',
    description: 'Premium Air Jordan 11',
    price: 3300,
    image: '/images/sports/J11.jpg',
    category: 'sports',
    gender: 'Unisex',
  },
  {
    id: 'sports-4',
    name: 'Air Jordan 11 Highcuts',
    description: 'Jordan 11 high-tops',
    price: 3500,
    image: '/images/sports/Jordan11highcuts-1.jpg',
    category: 'sports',
    gender: 'Unisex',
  },
  {
    id: 'sports-5',
    name: 'Air Jordan 7',
    description: 'Retro Air Jordan 7',
    price: 3300,
    image: '/images/sports/Jordan7-1.jpg',
    category: 'sports',
    gender: 'Unisex',
  },
  {
    id: 'sports-6',
    name: 'Football Boots',
    description: 'Premium football boots',
    price: 4200,
    image: '/images/sports/FootballBoots-1.jpg',
    category: 'sports',
    gender: 'Men',
  },
  {
    id: 'sports-7',
    name: 'Nike Football Boots',
    description: 'Nike football boots',
    price: 4200,
    image: '/images/sports/Nikefootballboots1-1.jpg',
    category: 'sports',
    gender: 'Men',
  },
];

export const getProductsByCategory = (categorySlug: string): Product[] => {
  return products.filter((product) => product.category === categorySlug);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured);
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find((category) => category.slug === slug);
};

export const formatPrice = (price: number): string => {
  return `KES ${price.toLocaleString('en-KE')}`;
};

export const getWhatsAppLink = (productName: string): string => {
  const message = encodeURIComponent(
    `I'm interested in ${productName} from Trendy Fashion Zone.`
  );
  return `https://wa.me/254743869564?text=${message}`;
};

