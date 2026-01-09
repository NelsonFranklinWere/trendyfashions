#!/bin/bash

echo "🚀 Preparing to push images to GitHub..."
echo ""

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "⚠️  Warning: You're on branch '$CURRENT_BRANCH', not 'main'"
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Count images
IMAGE_COUNT=$(find public/images -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" \) | wc -l)
TRACKED_COUNT=$(git ls-files public/images/ | grep -E "\.(jpg|jpeg|png|webp)$" | wc -l)

echo "📊 Image Statistics:"
echo "   Total images in filesystem: $IMAGE_COUNT"
echo "   Total images tracked in Git: $TRACKED_COUNT"
echo ""

# Check for untracked images
UNTRACKED=$(git ls-files --others --exclude-standard public/images/ | grep -E "\.(jpg|jpeg|png|webp)$" | wc -l)

if [ "$UNTRACKED" -gt 0 ]; then
  echo "⚠️  Found $UNTRACKED untracked images"
  echo "   Adding them to Git..."
  git add public/images/
  echo "✅ Added untracked images"
  echo ""
fi

# Check git status
if [ -n "$(git status --porcelain public/images/)" ]; then
  echo "📝 Staging image changes..."
  git add public/images/
  echo "✅ Images staged"
  echo ""
fi

# Check if there are commits to push
UNPUSHED=$(git log origin/main..HEAD --oneline 2>/dev/null | wc -l)

if [ "$UNPUSHED" -gt 0 ]; then
  echo "📤 Found $UNPUSHED unpushed commits"
  echo ""
  echo "To push images to GitHub, run:"
  echo "   git push origin main"
  echo ""
  read -p "Push now? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Pushing to GitHub..."
    git push origin main
    echo ""
    echo "✅ Push complete!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Wait for Vercel to rebuild (check Vercel dashboard)"
    echo "   2. Verify images display correctly"
    echo "   3. If images still don't show, check Vercel build logs"
  fi
else
  echo "✅ All commits are already pushed to GitHub"
  echo ""
  echo "If images still don't display on Vercel:"
  echo "   1. Check Vercel build logs for errors"
  echo "   2. Verify image paths in the code match the actual file paths"
  echo "   3. Check if Vercel has a file size limit issue"
  echo "   4. Try triggering a new deployment in Vercel dashboard"
fi

