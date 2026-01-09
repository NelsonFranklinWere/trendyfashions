/**
 * Test DigitalOcean Spaces Connection
 * Verifies that Spaces credentials are working correctly
 */

import { S3Client, ListBucketsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const spacesEndpoint = process.env.DO_SPACES_ENDPOINT;
const spacesKey = process.env.DO_SPACES_KEY;
const spacesSecret = process.env.DO_SPACES_SECRET;
const spacesBucket = process.env.DO_SPACES_BUCKET;

async function testConnection() {
  console.log('🔍 Testing DigitalOcean Spaces connection...\n');

  if (!spacesEndpoint || !spacesKey || !spacesSecret || !spacesBucket) {
    console.error('❌ Missing Spaces configuration');
    console.error('Please set DO_SPACES_ENDPOINT, DO_SPACES_KEY, DO_SPACES_SECRET, and DO_SPACES_BUCKET');
    process.exit(1);
  }

  // Extract region from endpoint
  const getRegionFromEndpoint = (endpoint: string): string => {
    const match = endpoint.match(/https?:\/\/([^.]+)\.digitaloceanspaces\.com/);
    return match ? match[1] : 'lon1';
  };

  const region = getRegionFromEndpoint(spacesEndpoint);

  console.log('📋 Configuration:');
  console.log(`   Endpoint: ${spacesEndpoint}`);
  console.log(`   Region: ${region}`);
  console.log(`   Bucket: ${spacesBucket}`);
  console.log(`   Access Key: ${spacesKey.substring(0, 10)}...`);
  console.log('');

  const s3Client = new S3Client({
    endpoint: spacesEndpoint,
    region: region,
    credentials: {
      accessKeyId: spacesKey,
      secretAccessKey: spacesSecret,
    },
    forcePathStyle: false,
  });

  try {
    // Test 1: List buckets
    console.log('1. Testing bucket access...');
    const listBuckets = await s3Client.send(new ListBucketsCommand({}));
    console.log(`   ✅ Successfully connected!`);
    console.log(`   Found ${listBuckets.Buckets?.length || 0} bucket(s)`);
    
    // Test 2: List objects in bucket
    console.log('\n2. Testing bucket read access...');
    const listObjects = await s3Client.send(new ListObjectsV2Command({
      Bucket: spacesBucket,
      MaxKeys: 5,
    }));
    console.log(`   ✅ Successfully accessed bucket!`);
    console.log(`   Found ${listObjects.KeyCount || 0} objects (showing first 5)`);
    
    if (listObjects.Contents && listObjects.Contents.length > 0) {
      console.log('\n   Sample objects:');
      listObjects.Contents.slice(0, 5).forEach((obj, i) => {
        console.log(`   ${i + 1}. ${obj.Key} (${(obj.Size || 0) / 1024} KB)`);
      });
    }

    console.log('\n✅ All tests passed! DigitalOcean Spaces is configured correctly.');
    console.log('\n🚀 You can now upload images and they will be stored on Spaces CDN!');
  } catch (error: any) {
    console.error('\n❌ Connection test failed:', error.message);
    if (error.name === 'InvalidAccessKeyId') {
      console.error('   → Check DO_SPACES_KEY is correct');
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.error('   → Check DO_SPACES_SECRET is correct');
    } else if (error.message.includes('NoSuchBucket')) {
      console.error(`   → Bucket "${spacesBucket}" does not exist`);
      console.error('   → Create it in DigitalOcean Control Panel');
    } else if (error.message.includes('AccessDenied')) {
      console.error('   → Access denied. Check bucket permissions');
    }
    process.exit(1);
  }
}

testConnection()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });


