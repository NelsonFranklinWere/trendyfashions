const fs = require('fs');
const path = require('path');

// Get all images from each category folder
const categories = ['casual', 'formal', 'customized', 'running', 'sports'];
const products = [];

categories.forEach(category => {
  const categoryPath = path.join(__dirname, '..', 'public', 'images', category);
  if (fs.existsSync(categoryPath)) {
    const files = fs.readdirSync(categoryPath)
      .filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'))
      .filter(f => !f.toLowerCase().includes('cindyc')); // Exclude testimonial
    
    files.forEach((file, index) => {
      const name = file.replace(/\.(jpg|jpeg)$/i, '').replace(/-/g, ' ').replace(/_/g, ' ');
      const productId = `${category}-${index + 1}`;
      
      products.push({
        id: productId,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        description: `${name.charAt(0).toUpperCase() + name.slice(1)} - Quality ${category} shoes`,
        price: category === 'formal' ? 2800 : category === 'sports' ? 3500 : category === 'customized' ? 3200 : 2800,
        image: `/images/${category}/${file}`,
        category: category,
        gender: 'Unisex',
      });
    });
  }
});

console.log(JSON.stringify(products, null, 2));
