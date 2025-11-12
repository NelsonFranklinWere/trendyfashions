# Image Organization Guide

## Folder Structure

All images should be organized in the `public/images/` directory as follows:

```
public/
  images/
    casual/          # Casual shoes
    customized/      # Customized shoes (Air Force 1, Vans, etc.)
    formal/          # Formal/Official shoes
    running/         # Running shoes (Airmax, Trainers, etc.)
    sports/          # Sports shoes (Jordans, Football Boots)
    logos/           # Brand logos
```

## Category Mapping

Based on `collection.html`, products are categorized as:

### Running
- Airmax series (Airmax90, Airmax97, etc.)
- Nike Jumptrack
- Umpro Trainer
- Nike Trainer

### Casual
- Adidas Samba
- Adidas Campus
- Vans (non-customized)
- Converse
- Puma
- New Balance
- Nike casual shoes
- Timberland casual
- Opens Shoes
- Flops
- Mules

### Customized
- Air Force 1 Customized
- Vans Customized
- Dior customized
- Cactus Jack
- LV animal prints

### Sports
- Air Jordans (all models)
- Football Boots
- Nike Football Boots

### Formal
- Empire Officials
- Official Timberland Boots
- Clarks
- Dr. Martens
- Lacoste Loafers
- Loafers
- Official Casuals

## Image Path Format

In the product data, images should be referenced as:
- `/images/casual/filename.jpg`
- `/images/customized/filename.jpg`
- `/images/formal/filename.jpg`
- `/images/running/filename.jpg`
- `/images/sports/filename.jpg`

## Next Steps

1. Run the organization script: `bash scripts/organize-images.sh`
2. Verify images are in correct folders
3. Update product data with new image paths
4. Test image loading in the app

