#!/bin/bash

# Script to organize images into public folder by category
# Based on collection.html categories: running, casual, customized, sports, formal

# Create public directory structure
mkdir -p public/images/{running,casual,customized,sports,formal,logos}

# Move logo files
mv 1trendylogo.jpeg 2trendylogo.jpeg 3trendylogo.jpeg public/images/logos/ 2>/dev/null || true

# Running shoes
mv NikeJumptrack*.jpg umproTrainer*.jpg NikeTrainer*.jpg Airmax90*.jpg Airmax97.jpg Air-Max97.jpg public/images/running/ 2>/dev/null || true

# Casual shoes
mv Addidas-samba.jpg Addidass2*.jpg Adidas-Special.jpg AdidasCampus*.jpg AdidasSamba*.jpg \
   Airmax.jpg Air-max-1.jpg Air-max1.jpg Altama.jpg bapestar.jpg Brick*.jpg \
   campusaddidas.jpg Converrse.jpg Converse*.jpg Cortex*.jpg CortexSport.jpg \
   Flops.jpg New-Balance*.jpg NEW1balance*.jpg NBALANCE*.jpg Nike-Airmax.jpg \
   Nike-Cortex.jpg Nike-Shox.jpg Nike-Tn.jpg NikeAirMax1.jpg NikeAirPortal*.jpg \
   NikeAirr*.jpg NikeS*.jpg NikeSB.jpg NikeSbDunk*.jpg NikeSBDUNKKS*.jpg \
   Nikeshoess*.jpg Nikeshox.jpg Opens-Shoes*.jpg puma.jpg Pumaa.jpg Pumaaa*.jpg \
   PumaRoma*.jpg Salkin-Casual.jpg Samba-double-sole.jpg Skater-Vans.jpg \
   Timber-Casual*.jpg Timberland-Casual.jpg Timberland-boots.jpg Timberland-Boot.jpg \
   Timberland-official-boots.jpg TimberlandExtreme*.jpg TimberlandLoafers*.jpg \
   Timberlandshoes*.jpg TN-Size.jpg undermour.jpg Valentino.jpg vanz.jpg \
   VansOffTheWall*.jpg IMG-*.jpg WhatsApp-Image-*.jpg naked-wolf.jpg \
   Lecog-Sportiff*.jpg Loafersblack.jpg Luis-vuitton*.jpg Luois-vuitton.jpg \
   mikel.jpg public/images/casual/ 2>/dev/null || true

# Customized shoes
mv Air-force-customized.jpg Air-Force-1-Customised*.jpg Af1customized*.jpg \
   AirForce1cusstom*.jpg Airforce1high.jpg Cacti-Jack.jpg Cactus-Jack.jpg \
   Dior*.jpg LV-animal-prints.jpg Vans-Customized.jpg vans-customized-codra*.jpg \
   Vans-Double-sole-Customised*.jpg VansCustomm*.jpg public/images/customized/ 2>/dev/null || true

# Sports shoes (Jordans, Football Boots)
mv J*.jpg j*.jpg Jordan*.jpg jordan*.jpg FootballBoots*.jpg footballbootss.jpg \
   Nikefootballboots*.jpg AS3HIGHCUTS*.jpg public/images/sports/ 2>/dev/null || true

# Formal shoes (Officials)
mv Empire-Officials*.jpg OfficialTimberBoots*.jpg OfficialCasuals*.jpg \
   Clarks*.jpg Dr*.jpg Dr.Martins.jpg Lacoste-Loafers.jpg Loafer*.jpg \
   loafer.jpg Oficcials.jpg Mules*.jpg Supreme-Timberland.jpg \
   Timberland-loafers.jpg Timberland-Loaferss.jpg public/images/formal/ 2>/dev/null || true

echo "Images organized successfully!"
echo "Check public/images/ directory for organized files"

