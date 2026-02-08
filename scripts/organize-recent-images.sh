#!/bin/bash

# Organize recently added images into proper folders

cd "$(dirname "$0")/.." || exit

IMAGES_DIR="public/images"

echo "📁 Organizing recently added images..."
echo ""

# Create directories if they don't exist
mkdir -p "$IMAGES_DIR/casual"
mkdir -p "$IMAGES_DIR/jordan"
mkdir -p "$IMAGES_DIR/sneakers"
mkdir -p "$IMAGES_DIR/officials"
mkdir -p "$IMAGES_DIR/sports"

# Move images based on naming patterns
declare -A moves=(
    # Converse -> sneakers
    ["Converse"]="sneakers"
    # Jordan -> jordan
    ["Jordan"]="jordan"
    # Lacoste -> casual
    ["Lacoste"]="casual"
    # Timber -> casual
    ["Timber"]="casual"
    # Mulles -> officials (mules)
    ["Mulle"]="officials"
    # Dr Martens -> officials
    ["DrMarrtens"]="officials"
    # Puma -> sneakers
    ["Puma"]="sneakers"
    # New Balance -> sneakers
    ["NewBBalance"]="sneakers"
    ["Newbalancce"]="sneakers"
    # Samoa -> sneakers
    ["Samoa"]="sneakers"
    # Official boots -> officials
    ["Officialboots"]="officials"
    # Football boots -> sports
    ["footballboot"]="sports"
    # Trainer -> sneakers
    ["Tainer"]="sneakers"
)

moved=0
for file in "$IMAGES_DIR"/*.jpg "$IMAGES_DIR"/*.jpeg "$IMAGES_DIR"/*.png 2>/dev/null; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        moved_file=false
        
        for pattern in "${!moves[@]}"; do
            if [[ "$filename" == *"$pattern"* ]]; then
                target_dir="${moves[$pattern]}"
                target_path="$IMAGES_DIR/$target_dir/$filename"
                
                if [ ! -f "$target_path" ]; then
                    mv "$file" "$target_path"
                    echo "✅ $filename → $target_dir/"
                    ((moved++))
                    moved_file=true
                    break
                else
                    echo "⚠️  $filename already exists in $target_dir/, skipping"
                    rm "$file"
                    moved_file=true
                    break
                fi
            fi
        done
        
        if [ "$moved_file" = false ]; then
            echo "❓ $filename - no pattern match, leaving in root"
        fi
    fi
done

echo ""
echo "✅ Organized $moved images"
echo ""
echo "📊 Remaining unsorted images in root:"
ls -1 "$IMAGES_DIR"/*.jpg 2>/dev/null | wc -l
