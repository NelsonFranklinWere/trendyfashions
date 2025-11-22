#!/bin/bash

# Complete image organization script for Trendy Fashion Zone
# This script organizes all images into public/images/ by category

echo "🚀 Starting image organization..."

# Create directory structure
mkdir -p public/images/{casual,customized,formal,running,sports,logos}

echo "✅ Created directory structure"

# Move logos
echo "📁 Moving logos..."
mv 1trendylogo.jpeg 2trendylogo.jpeg 3trendylogo.jpeg public/images/logos/ 2>/dev/null || echo "⚠️  Logos already moved or not found"

# Move RUNNING shoes
echo "🏃 Moving running shoes..."
mv NikeJumptrack*.jpg umproTrainer*.jpg NikeTrainer*.jpg public/images/running/ 2>/dev/null || true
mv Airmax90*.jpg Airmax97.jpg Air-Max97.jpg public/images/running/ 2>/dev/null || true

# Move CASUAL shoes
echo "👟 Moving casual shoes..."
mv Addidas-samba.jpg Addidass2*.jpg Adidas-Special.jpg public/images/casual/ 2>/dev/null || true
mv AdidasCampus*.jpg AdidasSamba*.jpg public/images/casual/ 2>/dev/null || true
mv Airmax.jpg Air-max-1.jpg Air-max1.jpg Altama.jpg bapestar.jpg public/images/casual/ 2>/dev/null || true
mv Brick*.jpg campusaddidas.jpg Converrse.jpg Converse*.jpg public/images/casual/ 2>/dev/null || true
mv Cortex*.jpg CortexSport.jpg Flops.jpg public/images/casual/ 2>/dev/null || true
mv New-Balance*.jpg NEW1balance*.jpg NBALANCE*.jpg public/images/casual/ 2>/dev/null || true
mv Nike-Airmax.jpg Nike-Cortex.jpg Nike-Shox.jpg Nike-Tn.jpg public/images/casual/ 2>/dev/null || true
mv NikeAirMax1.jpg NikeAirPortal*.jpg NikeAirr*.jpg public/images/casual/ 2>/dev/null || true
mv NikeS*.jpg NikeSB.jpg NikeSbDunk*.jpg NikeSBDUNKKS*.jpg public/images/casual/ 2>/dev/null || true
mv Nikeshoess*.jpg Nikeshox.jpg Opens-Shoes*.jpg public/images/casual/ 2>/dev/null || true
mv puma.jpg Pumaa.jpg Pumaaa*.jpg PumaRoma*.jpg public/images/casual/ 2>/dev/null || true
mv Salkin-Casual.jpg Samba-double-sole.jpg Skater-Vans.jpg public/images/casual/ 2>/dev/null || true
mv Timber-Casual*.jpg Timberland-Casual.jpg Timberland-boots.jpg public/images/casual/ 2>/dev/null || true
mv Timberland-Boot.jpg Timberland-official-boots.jpg public/images/casual/ 2>/dev/null || true
mv TimberlandExtreme*.jpg TimberlandLoafers*.jpg Timberlandshoes*.jpg public/images/casual/ 2>/dev/null || true
mv TN-Size.jpg undermour.jpg Valentino.jpg vanz.jpg public/images/casual/ 2>/dev/null || true
mv VansOffTheWall*.jpg IMG-*.jpg WhatsApp-Image-*.jpg public/images/casual/ 2>/dev/null || true
mv naked-wolf.jpg Lecog-Sportiff*.jpg Loafersblack.jpg public/images/casual/ 2>/dev/null || true
mv Luis-vuitton*.jpg Luois-vuitton.jpg mikel.jpg public/images/casual/ 2>/dev/null || true

# Move CUSTOMIZED shoes
echo "🎨 Moving customized shoes..."
mv Air-force-customized.jpg Air-Force-1-Customised*.jpg Af1customized*.jpg public/images/customized/ 2>/dev/null || true
mv AirForce1cusstom*.jpg Airforce1high.jpg public/images/customized/ 2>/dev/null || true
mv Cacti-Jack.jpg Cactus-Jack.jpg Dior*.jpg public/images/customized/ 2>/dev/null || true
mv LV-animal-prints.jpg Vans-Customized.jpg public/images/customized/ 2>/dev/null || true
mv vans-customized-codra*.jpg Vans-Double-sole-Customised*.jpg public/images/customized/ 2>/dev/null || true
mv VansCustomm*.jpg public/images/customized/ 2>/dev/null || true

# Move SPORTS shoes
echo "⚽ Moving sports shoes..."
mv J*.jpg j*.jpg Jordan*.jpg jordan*.jpg public/images/sports/ 2>/dev/null || true
mv FootballBoots*.jpg footballbootss.jpg Nikefootballboots*.jpg public/images/sports/ 2>/dev/null || true
mv AS3HIGHCUTS*.jpg public/images/sports/ 2>/dev/null || true

# Move FORMAL shoes
echo "👔 Moving formal shoes..."
mv Empire-Officials*.jpg OfficialTimberBoots*.jpg OfficialCasuals*.jpg public/images/formal/ 2>/dev/null || true
mv Clarks*.jpg Dr*.jpg Dr.Martins.jpg public/images/formal/ 2>/dev/null || true
mv Lacoste-Loafers.jpg Loafer*.jpg loafer.jpg public/images/formal/ 2>/dev/null || true
mv Oficcials.jpg Mules*.jpg Supreme-Timberland.jpg public/images/formal/ 2>/dev/null || true
mv Timberland-loafers.jpg Timberland-Loaferss.jpg public/images/formal/ 2>/dev/null || true

echo "✅ Image organization complete!"
echo ""
echo "📊 Summary:"
echo "  - Casual: $(ls -1 public/images/casual/*.jpg 2>/dev/null | wc -l) images"
echo "  - Customized: $(ls -1 public/images/customized/*.jpg 2>/dev/null | wc -l) images"
echo "  - Formal: $(ls -1 public/images/formal/*.jpg 2>/dev/null | wc -l) images"
echo "  - Running: $(ls -1 public/images/running/*.jpg 2>/dev/null | wc -l) images"
echo "  - Sports: $(ls -1 public/images/sports/*.jpg 2>/dev/null | wc -l) images"
echo ""
echo "✨ All images have been organized into public/images/"

