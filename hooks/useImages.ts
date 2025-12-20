import { useState, useEffect } from 'react';
import { ImageRecord } from '@/types/database';

interface UseImagesOptions {
  category?: string;
  subcategory?: string;
}

export function useImages(options: UseImagesOptions = {}) {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (options.category) params.append('category', options.category);
        if (options.subcategory) params.append('subcategory', options.subcategory);

        const response = await fetch(`/api/images?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }

        const data = await response.json();
        setImages(data.images || []);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [options.category, options.subcategory]);

  return { images, loading, error };
}
