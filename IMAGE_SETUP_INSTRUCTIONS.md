# Image Setup Instructions

## Quick Start

1. **Run the image organization script:**
   ```bash
   bash scripts/setup-images.sh
   ```

   This will automatically organize all images into the correct folders in `public/images/`.

2. **Verify the organization:**
   Check that images are in the correct folders:
   - `public/images/casual/` - Casual shoes
   - `public/images/customized/` - Customized shoes
   - `public/images/formal/` - Formal/Official shoes
   - `public/images/running/` - Running shoes
   - `public/images/sports/` - Sports shoes (Jordans, Football Boots)
   - `public/images/logos/` - Brand logos

## Manual Organization (if script doesn't work)

If the script doesn't work, manually organize images as follows:

### Casual Shoes → `public/images/casual/`
- Adidas Samba, Campus, Special
- Nike SB, Cortex, Portal, Air series
- Vans (non-customized)
- Converse
- Puma
- New Balance
- Timberland casual
- Opens Shoes, Flops, Mules

### Customized Shoes → `public/images/customized/`
- Air Force 1 Customized (all variants)
- Vans Customized
- Dior customized
- Cactus Jack
- LV animal prints

### Formal Shoes → `public/images/formal/`
- Empire Officials
- Official Timberland Boots
- Clarks
- Dr. Martens
- Lacoste Loafers
- Loafers
- Official Casuals

### Running Shoes → `public/images/running/`
- Airmax series (90, 97, etc.)
- Nike Jumptrack
- Umpro Trainer
- Nike Trainer

### Sports Shoes → `public/images/sports/`
- Air Jordans (all models: J1, J3, J4, J7, J11, etc.)
- Football Boots
- Nike Football Boots

## Image Paths in Code

After organization, all image paths in `data/products.ts` should use the format:
- `/images/casual/filename.jpg`
- `/images/customized/filename.jpg`
- `/images/formal/filename.jpg`
- `/images/running/filename.jpg`
- `/images/sports/filename.jpg`

## Verification

After organizing images:

1. **Check image paths match:**
   ```bash
   # Verify a few images exist
   ls public/images/casual/NikeSB.jpg
   ls public/images/customized/Air-force-customized.jpg
   ls public/images/formal/Empire-Officials-1.jpg
   ```

2. **Test the app:**
   ```bash
   npm run dev
   ```
   Navigate to collections pages and verify images load correctly.

## Troubleshooting

### Images not loading?
- Check that images are in `public/images/` (not root)
- Verify image paths in `data/products.ts` match actual file names
- Check file names are case-sensitive (Linux)
- Ensure Next.js is serving from `public/` directory

### Script errors?
- Make sure you're in the project root directory
- Check file permissions: `chmod +x scripts/setup-images.sh`
- Run manually if script fails

### Missing images?
- Some images might not be categorized - check root directory
- Add missing images to appropriate category folder
- Update `data/products.ts` with correct paths

## Next Steps

1. ✅ Run image organization script
2. ✅ Verify images are in correct folders
3. ✅ Test image loading in the app
4. ✅ Update any missing product entries
5. ✅ Deploy to production

