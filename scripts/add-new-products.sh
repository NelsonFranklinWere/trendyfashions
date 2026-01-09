#!/bin/bash

# This script will help identify which images need product entries
echo "=== Images without product entries ==="
echo ""
echo "Checking for images that might not have product entries..."

# Get list of all images
find public/images/{casual,formal,customized,running,sports} -name "*.jpg" -o -name "*.jpeg" | \
  grep -v -i cindyc | \
  sort > /tmp/all_images.txt

echo "Total product images found: $(wc -l < /tmp/all_images.txt)"
echo ""
echo "Sample of images that need product entries:"
head -20 /tmp/all_images.txt

rm /tmp/all_images.txt
