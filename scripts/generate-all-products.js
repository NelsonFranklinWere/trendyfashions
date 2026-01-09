const fs = require('fs');
const path = require('path');

const categories = {
  casual: { basePrice: 2800, folder: 'casual' },
  formal: { basePrice: 2800, folder: 'formal' },
  customized: { basePrice: 3200, folder: 'customized' },
  running: { basePrice: 3000, folder: 'running' },
  sports: { basePrice: 3500, folder: 'sports' },
};

const allProducts = [];

Object.entries(categories).forEach(([category, config]) => {
  const categoryPath = path.join(__dirname, '..', 'public', 'images', config.folder);
  if (fs.existsSync(categoryPath)) {
    const files = fs.readdirSync(categoryPath)
      .filter(f => (f.endsWith('.jpg') || f.endsWith('.jpeg')))
      .filter(f => !f.toLowerCase().includes('cindyc')) // Exclude testimonial
      .sort();
    
    files.forEach((file, index) => {
      const baseName = file.replace(/\.(jpg|jpeg)$/i, '');
      const name = baseName
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      allProducts.push({
        id: `${category}-${index + 1}`,
        name: name,
        description: `${name} - Quality ${category} shoes from Trendy Fashion Zone`,
        price: config.basePrice,
        image: `/images/${config.folder}/${file}`,
        category: category,
        gender: 'Unisex',
      });
    });
  }
});

console.log(JSON.stringify(allProducts, null, 2));
