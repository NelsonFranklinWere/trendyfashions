import fs from 'fs';
import path from 'path';

import type { Product } from '@/data/products';

const AIRFORCE_DIR = path.join(process.cwd(), 'public', 'images', 'airforce');

const formatName = (fileName: string): string => {
  // All Airforce products are named "Airforce 1 Customized"
  return 'Airforce 1 Customized';
};

const buildId = (fileName: string): string => {
  const stem = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
  return `airforce-auto-${stem.replace(/[^a-z0-9]+/g, '-')}`;
};

// Attractive descriptions for Airforce products
const descriptions = [
  'Premium quality Airforce 1 with unique custom designs. Stand out with style and comfort that lasts all day.',
  'Classic Airforce 1 silhouette with personalized touches. Perfect blend of street style and premium craftsmanship.',
  'Elevate your sneaker game with these custom Airforce 1s. Bold designs that make a statement wherever you go.',
  'Handcrafted Airforce 1 customization for the fashion-forward. Quality materials meet cutting-edge design.',
  'Iconic Airforce 1 with exclusive custom details. Comfort meets style in this must-have sneaker collection.',
  'Premium Airforce 1 customized to perfection. Experience unmatched comfort with head-turning aesthetics.',
  'Unique Airforce 1 designs that reflect your personality. Built for style, comfort, and everyday wear.',
  'Stylish Airforce 1 with custom artwork and premium finish. The perfect sneaker for the modern trendsetter.',
  'Exclusive Airforce 1 customization with attention to detail. Step out in confidence with these premium kicks.',
  'Bold and beautiful Airforce 1 custom designs. Quality craftsmanship meets urban street style.',
  'Premium Airforce 1 with artistic custom touches. Stand out from the crowd with these unique sneakers.',
  'Classic Airforce 1 reimagined with custom flair. Comfort, style, and durability in one perfect package.',
  'Eye-catching Airforce 1 custom designs for the style-conscious. Premium materials and expert craftsmanship.',
  'Unique Airforce 1 customization that turns heads. Experience the perfect blend of comfort and style.',
  'Premium Airforce 1 with exclusive custom details. Your go-to sneaker for any occasion.',
  'Stylish Airforce 1 custom designs that speak to your personality. Quality you can feel, style you can see.',
  'Handcrafted Airforce 1 with personalized touches. The ultimate sneaker for those who demand the best.',
  'Bold Airforce 1 custom designs for the fashion-forward. Premium quality meets street style excellence.',
  'Exclusive Airforce 1 customization with premium finish. Step into style with these must-have sneakers.',
  'Unique Airforce 1 designs that set you apart. Comfort, durability, and style in perfect harmony.',
];

const getDescription = (index: number): string => {
  // Use index to cycle through descriptions for variety
  return descriptions[index % descriptions.length];
};

const DEFAULT_PRICE = 3200;

export const getAirforceImageProducts = (): Product[] => {
  try {
    if (!fs.existsSync(AIRFORCE_DIR)) {
      return [];
    }

    const files = fs
      .readdirSync(AIRFORCE_DIR)
      .filter((file) => file.match(/\.(jpg|jpeg|png|webp)$/i))
      .sort((a, b) => a.localeCompare(b));

    const totalFiles = files.length;
    // 6th and 7th from the end (descending order)
    const sixthFromEnd = totalFiles - 6;
    const seventhFromEnd = totalFiles - 7;
    // Shoe number 36 from the end (descending order)
    const shoe36FromEnd = totalFiles - 36;
    // Shoe number 50 from the end (descending order)
    const shoe50FromEnd = totalFiles - 50;

    return files.map((file, index) => {
      const name = formatName(file);
      // Products 6th, 7th, 36th, and 50th from the end have price 3500
      const price = (index === sixthFromEnd || index === seventhFromEnd || index === shoe36FromEnd || index === shoe50FromEnd) ? 3500 : DEFAULT_PRICE;
      return {
        id: buildId(file),
        name,
        description: getDescription(index),
        price,
        image: `/images/airforce/${file}`,
        category: 'customized',
        gender: 'Unisex',
      } satisfies Product;
    });
  } catch (error) {
    console.error('Error loading airforce images:', error);
    return [];
  }
};

