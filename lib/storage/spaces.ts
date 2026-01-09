/**
 * DigitalOcean Spaces Storage Service
 * S3-compatible object storage for fast image delivery
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

// DigitalOcean Spaces configuration
const spacesEndpoint = process.env.DO_SPACES_ENDPOINT || 'https://lon1.digitaloceanspaces.com';
const spacesKey = process.env.DO_SPACES_KEY;
const spacesSecret = process.env.DO_SPACES_SECRET;
const spacesBucket = process.env.DO_SPACES_BUCKET || 'trendyfashions';
const spacesCdnUrl = process.env.DO_SPACES_CDN_URL; // Optional CDN URL for even faster delivery

// Extract region from endpoint (e.g., lon1, nyc3, sgp1)
const getRegionFromEndpoint = (endpoint: string): string => {
  const match = endpoint.match(/https?:\/\/([^.]+)\.digitaloceanspaces\.com/);
  return match ? match[1] : 'lon1'; // Default to lon1
};

const spacesRegion = getRegionFromEndpoint(spacesEndpoint);

// Initialize S3 client for DigitalOcean Spaces
const s3Client = new S3Client({
  endpoint: spacesEndpoint,
  region: spacesRegion,
  credentials: spacesKey && spacesSecret ? {
    accessKeyId: spacesKey,
    secretAccessKey: spacesSecret,
  } : undefined,
  forcePathStyle: false, // DigitalOcean Spaces uses virtual-hosted-style
});

/**
 * Upload file to DigitalOcean Spaces
 */
export async function uploadToSpaces(
  key: string,
  buffer: Buffer,
  contentType: string,
  options?: {
    cacheControl?: string;
    metadata?: Record<string, string>;
  }
): Promise<string> {
  if (!spacesKey || !spacesSecret) {
    throw new Error('DigitalOcean Spaces credentials not configured. Please set DO_SPACES_KEY and DO_SPACES_SECRET');
  }

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: spacesBucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: options?.cacheControl || 'public, max-age=31536000, immutable',
      Metadata: options?.metadata || {},
      ACL: 'public-read', // Make images publicly accessible
    },
  });

  await upload.done();

  // Return CDN URL if configured, otherwise use Spaces URL
  if (spacesCdnUrl) {
    return `${spacesCdnUrl}/${key}`;
  }
  
  return `${spacesEndpoint}/${spacesBucket}/${key}`;
}

/**
 * Delete file from DigitalOcean Spaces
 */
export async function deleteFromSpaces(key: string): Promise<void> {
  if (!spacesKey || !spacesSecret) {
    throw new Error('DigitalOcean Spaces credentials not configured');
  }

  await s3Client.send(new DeleteObjectCommand({
    Bucket: spacesBucket,
    Key: key,
  }));
}

/**
 * Check if file exists in Spaces
 */
export async function fileExistsInSpaces(key: string): Promise<boolean> {
  if (!spacesKey || !spacesSecret) {
    return false;
  }

  try {
    await s3Client.send(new HeadObjectCommand({
      Bucket: spacesBucket,
      Key: key,
    }));
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw error;
  }
}

/**
 * Get public URL for a file in Spaces
 */
export function getSpacesUrl(key: string): string {
  if (spacesCdnUrl) {
    return `${spacesCdnUrl}/${key}`;
  }
  return `${spacesEndpoint}/${spacesBucket}/${key}`;
}

