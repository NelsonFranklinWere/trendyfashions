-- Allow Sale / Meta Ads tags on image-based catalog items
ALTER TABLE images ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
