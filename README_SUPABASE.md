# Image Management with Supabase

This project uses Supabase for image storage and management instead of local file storage.

## Quick Start

1. **Set up Supabase** (see `SUPABASE_SETUP.md`)
2. **Configure environment variables** in `.env.local`
3. **Run image reduction script** (optional):
   ```bash
   npm run reduce-images
   ```
4. **Access admin panel** at `/admin/images`

## Features

- ✅ Image upload via admin panel
- ✅ Organized by category and subcategory
- ✅ Supabase Storage for file hosting
- ✅ Database metadata tracking
- ✅ API endpoints for fetching images
- ✅ Automatic image reduction script (6 per subcategory)

## File Structure

```
lib/supabase/
  ├── client.ts          # Client-side Supabase client
  └── server.ts          # Server-side Supabase admin client

pages/api/
  ├── admin/images/
  │   └── upload.ts      # Image upload endpoint
  └── images/
      └── index.ts       # Image fetching endpoint

pages/admin/
  └── images.tsx         # Admin upload interface

hooks/
  └── useImages.ts       # React hook for fetching images

scripts/
  └── reduce-images-to-6-per-subcategory.ts  # Image reduction script

supabase/
  └── migrations/
      └── 001_create_images_table.sql  # Database schema
```

## Usage

### Upload Images

1. Navigate to `/admin/images`
2. Select category and subcategory
3. Choose image file
4. Click "Upload Image"

### Fetch Images

```typescript
import { useImages } from '@/hooks/useImages';

function MyComponent() {
  const { images, loading, error } = useImages({
    category: 'sneakers',
    subcategory: 'Nike SB',
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {images.map((image) => (
        <img key={image.id} src={image.url} alt={image.filename} />
      ))}
    </div>
  );
}
```

### API Endpoints

**GET `/api/images`**
- Query params: `category`, `subcategory`
- Returns: `{ images: ImageRecord[] }`

**POST `/api/admin/images/upload`**
- Body: FormData with `category`, `subcategory`, `file`
- Returns: `{ success: true, image: ImageRecord }`

## Categories & Subcategories

- **Officials**: Boots, Empire, Casuals, Mules, Clarks
- **Sneakers**: Addidas Campus, Addidas Samba, Valentino, Nike S, Nike SB, Nike Cortex, Nike TN, Nike Shox, Nike Zoom, New Balance
- **Vans**: Custom, Codra, Skater, Off the Wall
- **Jordan**: Jordan 1, Jordan 3, Jordan 4, Jordan 9, Jordan 11, Jordan 14
- **Airmax**: AirMax 1, Airmax 97, Airmax 95, Airmax 90, Airmax Portal, Airmax
- **Airforce**: Airforce
- **Casuals**: Casuals
- **Custom**: Custom

## Scripts

### Reduce Images

```bash
npm run reduce-images
```

Keeps only 6 images per subcategory, deletes the rest. Creates a log file at `scripts/deleted-images.log`.

## Security

⚠️ **Important**: The admin upload route currently has no authentication. Add authentication before deploying to production.

See `SUPABASE_SETUP.md` for security configuration details.
