#!/bin/bash

# Comprehensive image sorting script
# This script sorts ALL images into appropriate categories

echo "🔄 Starting comprehensive image sorting..."

# Ensure directory structure exists
mkdir -p public/images/{casual,customized,formal,running,sports,logos,other}

# Function to move image if it exists
move_if_exists() {
    if [ -f "$1" ]; then
        mv "$1" "$2" 2>/dev/null && echo "  ✅ Moved: $(basename $1)"
    fi
}

# Move logos first
echo "📁 Moving logos..."
move_if_exists "1trendylogo.jpeg" "public/images/logos/"
move_if_exists "2trendylogo.jpeg" "public/images/logos/"
move_if_exists "3trendylogo.jpeg" "public/images/logos/"

# Move RUNNING shoes
echo "🏃 Moving running shoes..."
for file in NikeJumptrack*.jpg umproTrainer*.jpg NikeTrainer*.jpg Airmax90*.jpg Airmax97.jpg Air-Max97.jpg; do
    [ -f "$file" ] && move_if_exists "$file" "public/images/running/"
done

# Move CUSTOMIZED shoes
echo "🎨 Moving customized shoes..."
for file in Air-force-customized.jpg Air-Force-1-Customised*.jpg Af1customized*.jpg AirForce1cusstom*.jpg Airforce1high.jpg Cacti-Jack.jpg Cactus-Jack.jpg Dior*.jpg LV-animal-prints.jpg Vans-Customized.jpg vans-customized-codra*.jpg Vans-Double-sole-Customised*.jpg VansCustomm*.jpg; do
    [ -f "$file" ] && move_if_exists "$file" "public/images/customized/"
done

# Move SPORTS shoes
echo "⚽ Moving sports shoes..."
for file in J*.jpg j*.jpg Jordan*.jpg jordan*.jpg FootballBoots*.jpg footballbootss.jpg Nikefootballboots*.jpg AS3HIGHCUTS*.jpg; do
    [ -f "$file" ] && move_if_exists "$file" "public/images/sports/"
done

# Move FORMAL shoes
echo "👔 Moving formal shoes..."
for file in Empire-Officials*.jpg OfficialTimberBoots*.jpg OfficialCasuals*.jpg Clarks*.jpg Dr*.jpg Dr.Martins.jpg Lacoste-Loafers.jpg Loafer*.jpg loafer.jpg Oficcials.jpg Mules*.jpg Supreme-Timberland.jpg Timberland-loafers.jpg Timberland-Loaferss.jpg; do
    [ -f "$file" ] && move_if_exists "$file" "public/images/formal/"
done

# Move CASUAL shoes (everything else that's a shoe image)
echo "👟 Moving casual shoes..."
# Move all remaining .jpg files to casual (they should be casual shoes)
for file in *.jpg; do
    if [ -f "$file" ]; then
        move_if_exists "$file" "public/images/casual/"
    fi
done

# Move any remaining .jpeg files
echo "📸 Moving remaining images..."
for file in *.jpeg; do
    if [ -f "$file" ]; then
        move_if_exists "$file" "public/images/logos/"
    fi
done

echo ""
echo "✅ Image sorting complete!"
echo ""
echo "📊 Final count:"
echo "  Casual: $(ls -1 public/images/casual/*.jpg 2>/dev/null | wc -l) files"
echo "  Customized: $(ls -1 public/images/customized/*.jpg 2>/dev/null | wc -l) files"
echo "  Formal: $(ls -1 public/images/formal/*.jpg 2>/dev/null | wc -l) files"
echo "  Running: $(ls -1 public/images/running/*.jpg 2>/dev/null | wc -l) files"
echo "  Sports: $(ls -1 public/images/sports/*.jpg 2>/dev/null | wc -l) files"
echo "  Logos: $(ls -1 public/images/logos/*.{jpg,jpeg} 2>/dev/null | wc -l) files"
