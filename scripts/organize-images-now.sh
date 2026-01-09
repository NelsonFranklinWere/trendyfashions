#!/bin/bash
cd "$(dirname "$0")/.." || exit

IMAGES_DIR="public/images"
moved=0

echo "📁 Organizing images..."
echo ""

# Converse -> sneakers
for file in "$IMAGES_DIR"/Converse*.jpg; do
    [ -f "$file" ] && mv "$file" "$IMAGES_DIR/sneakers/" && echo "✅ $(basename "$file") → sneakers/" && ((moved++))
done

# Jordan -> jordan  
for file in "$IMAGES_DIR"/Jordan*.jpg; do
    [ -f "$file" ] && mv "$file" "$IMAGES_DIR/jordan/" && echo "✅ $(basename "$file") → jordan/" && ((moved++))
done

# Lacoste -> casual
for file in "$IMAGES_DIR"/Lacoste*.jpg; do
    [ -f "$file" ] && mv "$file" "$IMAGES_DIR/casual/" && echo "✅ $(basename "$file") → casual/" && ((moved++))
done

# Timber -> casual
for file in "$IMAGES_DIR"/Timber*.jpg; do
    [ -f "$file" ] && mv "$file" "$IMAGES_DIR/casual/" && echo "✅ $(basename "$file") → casual/" && ((moved++))
done

# Mulles -> officials
for file in "$IMAGES_DIR"/Mulle*.jpg; do
    [ -f "$file" ] && mv "$file" "$IMAGES_DIR/officials/" && echo "✅ $(basename "$file") → officials/" && ((moved++))
done

# Dr Martens -> officials
for file in "$IMAGES_DIR"/DrMarrtens*.jpg; do
    [ -f "$file" ] && mv "$file" "$IMAGES_DIR/officials/" && echo "✅ $(basename "$file") → officials/" && ((moved++))
done

# Puma -> sneakers
for file in "$IMAGES_DIR"/Puma*.jpg; do
    [ -f "$file" ] && mv "$file" "$IMAGES_DIR/sneakers/" && echo "✅ $(basename "$file") → sneakers/" && ((moved++))
done

# New Balance -> sneakers
for file in "$IMAGES_DIR"/NewBBalance*.jpg "$IMAGES_DIR"/Newbalancce*.jpg; do
    [ -f "$file" ] && mv "$file" "$IMAGES_DIR/sneakers/" && echo "✅ $(basename "$file") → sneakers/" && ((moved++))
done

# Samoa -> sneakers
for file in "$IMAGES_DIR"/Samoa*.jpg; do
    [ -f "$file" ] && mv "$file" "$IMAGES_DIR/sneakers/" && echo "✅ $(basename "$file") → sneakers/" && ((moved++))
done

# Official boots -> officials
for file in "$IMAGES_DIR"/Officialboots*.jpg; do
    [ -f "$file" ] && mv "$file" "$IMAGES_DIR/officials/" && echo "✅ $(basename "$file") → officials/" && ((moved++))
done

# Football boots -> sports
for file in "$IMAGES_DIR"/footballboot*.jpg; do
    [ -f "$file" ] && mv "$file" "$IMAGES_DIR/sports/" && echo "✅ $(basename "$file") → sports/" && ((moved++))
done

# Trainer -> sneakers
for file in "$IMAGES_DIR"/Tainer*.jpg; do
    [ -f "$file" ] && mv "$file" "$IMAGES_DIR/sneakers/" && echo "✅ $(basename "$file") → sneakers/" && ((moved++))
done

echo ""
echo "✅ Organized $moved images"
echo ""
echo "📊 Remaining unsorted: $(ls -1 "$IMAGES_DIR"/*.jpg 2>/dev/null | wc -l) files"
