#!/bin/bash

echo "🔄 Starting image categorization..."

# Create testimonials folder for CindyC image
mkdir -p public/images/testimonials

# Move testimonial image
if [ -f "public/images/CindyC (1).jpg" ]; then
    mv "public/images/CindyC (1).jpg" "public/images/testimonials/"
    echo "✅ Moved testimonial: CindyC (1).jpg"
fi

# Move CindyC-1.jpg from casual to testimonials (if it exists)
if [ -f "public/images/casual/CindyC-1.jpg" ]; then
    mv "public/images/casual/CindyC-1.jpg" "public/images/testimonials/"
    echo "✅ Moved testimonial: CindyC-1.jpg"
fi

# Move Official images to formal
echo "📁 Moving Official images to formal..."
for file in public/images/Official*.jpg public/images/Oficial*.jpg public/images/Oficialle*.jpg; do
    if [ -f "$file" ]; then
        mv "$file" "public/images/formal/" 2>/dev/null && echo "  ✅ Moved: $(basename $file)"
    fi
done

# Move Casuals images to casual
echo "📁 Moving Casuals images to casual..."
for file in public/images/Casuals*.jpg public/images/Casualle*.jpg; do
    if [ -f "$file" ]; then
        mv "$file" "public/images/casual/" 2>/dev/null && echo "  ✅ Moved: $(basename $file)"
    fi
done

# Move timberland casuals to casual
echo "📁 Moving timberland casuals to casual..."
for file in public/images/timberland*.jpg; do
    if [ -f "$file" ]; then
        mv "$file" "public/images/casual/" 2>/dev/null && echo "  ✅ Moved: $(basename $file)"
    fi
done

# Move FootballBoots to sports
if [ -f "public/images/FootballBoots (7).jpg" ]; then
    mv "public/images/FootballBoots (7).jpg" "public/images/sports/"
    echo "✅ Moved: FootballBoots (7).jpg"
fi

# Move trendylogo to logos
if [ -f "public/images/trendylogo.jpg" ]; then
    mv "public/images/trendylogo.jpg" "public/images/logos/"
    echo "✅ Moved: trendylogo.jpg"
fi

# Move IMG-20251001 images - need to check what they are, but likely casual or running
echo "📁 Moving IMG-20251001 images..."
for file in public/images/IMG-20251001-*.jpg; do
    if [ -f "$file" ]; then
        # These look like product images, move to casual for now (can be recategorized later)
        mv "$file" "public/images/casual/" 2>/dev/null && echo "  ✅ Moved: $(basename $file)"
    fi
done

echo ""
echo "✅ Image categorization complete!"
echo ""
echo "📊 Summary:"
echo "  Casual: $(ls -1 public/images/casual/*.jpg 2>/dev/null | wc -l) files"
echo "  Customized: $(ls -1 public/images/customized/*.jpg 2>/dev/null | wc -l) files"
echo "  Formal: $(ls -1 public/images/formal/*.jpg 2>/dev/null | wc -l) files"
echo "  Running: $(ls -1 public/images/running/*.jpg 2>/dev/null | wc -l) files"
echo "  Sports: $(ls -1 public/images/sports/*.jpg 2>/dev/null | wc -l) files"
echo "  Logos: $(ls -1 public/images/logos/*.{jpg,jpeg} 2>/dev/null | wc -l) files"
echo "  Testimonials: $(ls -1 public/images/testimonials/*.{jpg,jpeg} 2>/dev/null | wc -l) files"
