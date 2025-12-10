import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';

const uploadSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().min(1, 'Subcategory is required'),
  file: z.any().refine((files) => files && files.length > 0, 'File is required'),
});

type UploadFormData = z.infer<typeof uploadSchema>;

const CATEGORIES = [
  { value: 'mens-officials', label: "Men's Officials", subcategories: ['Boots', 'Empire', 'Casuals', 'Mules', 'Clarks'] },
  { value: 'casual', label: 'Casual', subcategories: ['Lacoste', 'Timberland', 'Tommy Hilfiger', 'Boss', 'Other'] },
  { value: 'loafers', label: 'Loafers', subcategories: ['Classic', 'Premium', 'Designer'] },
  { value: 'nike', label: 'Nike', subcategories: ['Air Max', 'Air Force', 'Dunk', 'Other'] },
  { value: 'sports', label: 'Sports', subcategories: ['Football Boots', 'Running', 'Training', 'Other'] },
  { value: 'vans', label: 'Vans', subcategories: ['Classic', 'Skater', 'Custom', 'Other'] },
  { value: 'mens-style', label: 'Mens Style', subcategories: ['Custom', 'Designer', 'Streetwear', 'Other'] },
  { value: 'sneakers', label: 'Sneakers', subcategories: ['Adidas Campus', 'Adidas Samba', 'Valentino', 'Nike SB', 'Nike Cortex', 'Nike TN', 'Nike Shox', 'Nike Zoom', 'New Balance', 'Other'] },
];

export default function AdminImagesPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error';
    message: string;
    optimization?: {
      originalSize: number;
      optimizedSize: number;
      compressionRatio: string;
      format: string;
    };
  } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  });

  const selectedCategory = watch('category');
  const selectedCategoryData = CATEGORIES.find((c) => c.value === selectedCategory);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, []);

  const onSubmit = async (data: UploadFormData) => {
    setUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('category', data.category);
      formData.append('subcategory', data.subcategory);
      formData.append('file', data.file[0]);

      const response = await fetch('/api/admin/images/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setUploadStatus({ type: 'success', message: 'Image uploaded successfully!' });
      reset();
      setPreview(null);
    } catch (error: any) {
      setUploadStatus({ type: 'error', message: error.message || 'Failed to upload image' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin - Image Upload</h1>

            {uploadStatus && (
            <div
              className={`mb-6 p-4 rounded-md ${
                uploadStatus.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <div className="font-semibold mb-2">{uploadStatus.message}</div>
              {uploadStatus.type === 'success' && uploadStatus.optimization && (
                <div className="text-sm mt-2 space-y-1">
                  <div>Original: {(uploadStatus.optimization.originalSize / 1024).toFixed(2)} KB</div>
                  <div>Optimized: {(uploadStatus.optimization.optimizedSize / 1024).toFixed(2)} KB</div>
                  <div className="text-green-700 font-medium">
                    Compression: {uploadStatus.optimization.compressionRatio} saved
                  </div>
                  <div className="text-xs text-gray-600">Format: {uploadStatus.optimization.format}</div>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                {...register('category')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {selectedCategoryData && (
              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  id="subcategory"
                  {...register('subcategory')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                >
                  <option value="">Select a subcategory</option>
                  {selectedCategoryData.subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
                {errors.subcategory && (
                  <p className="mt-1 text-sm text-red-600">{errors.subcategory.message}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                Image File
              </label>
              <input
                id="file"
                type="file"
                accept="image/*"
                {...register('file')}
                onChange={(e) => {
                  register('file').onChange(e);
                  handleFileChange(e);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
              />
              {errors.file && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.file?.message ? String(errors.file.message) : 'File is required'}
                </p>
              )}
            </div>

            {preview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="relative w-full h-64 border border-gray-300 rounded-md overflow-hidden">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-primary text-white py-3 px-4 rounded-md font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
