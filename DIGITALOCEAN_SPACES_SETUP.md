# DigitalOcean Spaces Setup for Fast Image Loading

## Overview

DigitalOcean Spaces provides S3-compatible object storage with built-in CDN for ultra-fast image delivery worldwide.

## Benefits

- ⚡ **Fast Loading**: CDN edge locations deliver images from nearest server
- 💰 **Cost Effective**: $5/month for 250GB storage + 1TB transfer
- 🔒 **Secure**: Private by default, public access when needed
- 📦 **Scalable**: Unlimited storage and bandwidth
- 🚀 **S3 Compatible**: Works with AWS SDK

## Setup Steps

### 1. Create DigitalOcean Space

1. Go to [DigitalOcean Control Panel](https://cloud.digitalocean.com/spaces)
2. Click **Create a Space**
3. Configure:
   - **Name**: `trendyfashions` (or your preferred name)
   - **Region**: Choose closest to your users (e.g., `nyc3` for US East)
   - **CDN**: ✅ **Enable CDN** (IMPORTANT for fast loading)
   - **File Listing**: Disabled (for security)
4. Click **Create Space**

### 2. Get Access Keys

1. Go to **API** → **Spaces Keys**
2. Click **Generate New Key**
3. Save:
   - **Access Key** (DO_SPACES_KEY)
   - **Secret Key** (DO_SPACES_SECRET)

### 3. Get CDN Endpoint

1. Go to your Space → **Settings** → **CDN**
2. Copy the **CDN Endpoint URL** (e.g., `https://trendyfashions.nyc3.cdn.digitaloceanspaces.com`)
3. This is your `DO_SPACES_CDN_URL`

### 4. Configure Environment Variables

Add to `.env.local`:

```env
# DigitalOcean Spaces Configuration
DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
DO_SPACES_KEY=your-access-key-here
DO_SPACES_SECRET=your-secret-key-here
DO_SPACES_BUCKET=trendyfashions
DO_SPACES_CDN_URL=https://trendyfashions.nyc3.cdn.digitaloceanspaces.com
```

### 5. Set CORS Policy (for Next.js Image Optimization)

1. Go to your Space → **Settings** → **CORS Configurations**
2. Add CORS rule:

```json
{
  "AllowedOrigins": ["*"],
  "AllowedMethods": ["GET", "HEAD"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["ETag"],
  "MaxAgeSeconds": 3000
}
```

### 6. Set Public Access (for images)

1. Go to your Space → **Settings** → **File Listing**
2. Enable **File Listing** (or use individual file permissions)
3. For each uploaded image, ensure it's set to **Public**

## Image Upload Flow

1. **Upload**: Image uploaded to DigitalOcean Spaces
2. **Optimization**: Image optimized to WebP/AVIF format
3. **CDN**: Automatically distributed to edge locations
4. **Delivery**: Served from nearest CDN edge (fast!)

## Performance

- **First Load**: 50-200ms (from CDN edge)
- **Cached Load**: 10-50ms (browser cache)
- **Global Delivery**: Images served from nearest location
- **Bandwidth**: Unlimited (1TB included, then $0.01/GB)

## Cost

- **Storage**: $5/month for 250GB
- **Transfer**: 1TB/month included, then $0.01/GB
- **CDN**: Included (no extra cost)

## Migration from Local Storage

Images are automatically uploaded to Spaces when you:
1. Upload new images via admin panel
2. Images are optimized and cached
3. Old local images can be migrated (optional script)

## Troubleshooting

### Images not loading?
- Check CORS configuration
- Verify CDN is enabled
- Check file permissions (should be public)

### Slow loading?
- Ensure CDN is enabled
- Check CDN endpoint is correct
- Verify images are optimized (WebP format)

### Upload errors?
- Verify DO_SPACES_KEY and DO_SPACES_SECRET are correct
- Check bucket name matches DO_SPACES_BUCKET
- Ensure endpoint matches your region

