# Vercel Deployment Guide - Image Issues

## Problem: Images Not Displaying on Vercel

If images aren't showing on Vercel after pushing to GitHub, follow these steps:

## Step 1: Verify Images Are Committed and Pushed

```bash
# Check if all images are tracked
node scripts/verify-images-git.js

# Check if images are in your commits
git log --oneline --name-only | grep "public/images/" | head -10

# Verify you're in sync with GitHub
git fetch origin
git diff HEAD origin/main --stat
```

## Step 2: Push Images to GitHub

If images aren't pushed:

```bash
# Add all images
git add public/images/

# Commit if needed
git commit -m "Add all product images"

# Push to GitHub
git push origin main
```

## Step 3: Verify Image Paths

Run the verification script:

```bash
node scripts/verify-vercel-images.js
```

This checks:
- ✅ Featured category images exist
- ✅ All folder structures are correct
- ✅ No problematic file names

## Step 4: Check Vercel Build

1. Go to Vercel Dashboard → Your Project → Deployments
2. Check the latest deployment build logs
3. Look for errors related to:
   - Image optimization
   - Missing files
   - Build failures

## Step 5: Common Issues and Fixes

### Issue: Images too large
- **Solution**: Vercel has a 50MB limit per file. Most images should be fine, but check for any oversized files.

### Issue: Build timeout
- **Solution**: 246MB of images might cause slow builds. Consider:
  - Using Next.js Image Optimization (already enabled)
  - Compressing images before commit
  - Using a CDN for images

### Issue: Image paths incorrect
- **Solution**: All image paths should start with `/images/` (not `./images/` or `images/`)
- Verify paths in `data/products.ts` match actual file locations

### Issue: Case sensitivity
- **Solution**: Vercel (Linux) is case-sensitive. Ensure file names match exactly:
  - `ClarksOfficials1.jpg` not `clarksofficials1.jpg`
  - Check all image references in code

## Step 6: Force Vercel Rebuild

1. In Vercel Dashboard → Deployments
2. Click "..." on latest deployment
3. Select "Redeploy"
4. Or push an empty commit: `git commit --allow-empty -m "Trigger Vercel rebuild" && git push`

## Step 7: Verify After Deployment

After Vercel rebuilds:
1. Check browser console for 404 errors on images
2. Verify image URLs in Network tab
3. Check that images load from correct paths

## Current Status

✅ All 1608 images are tracked in Git
✅ All featured category images exist
✅ Image paths are correct in code
✅ Next.js image optimization is enabled

**Next Action**: Ensure images are pushed to GitHub and trigger Vercel rebuild.

