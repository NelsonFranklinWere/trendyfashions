import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  image: z.string().url('Valid image URL is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().min(1, 'Subcategory is required'),
  gender: z.enum(['Men', 'Unisex']).optional(),
  tags: z.string().optional(),
  featured: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productSchema>;

const CATEGORIES = [
  { value: 'officials', label: 'Officials', subcategories: ['Boots', 'Empire', 'Casuals', 'Mules', 'Clarks'] },
  { value: 'sneakers', label: 'Sneakers', subcategories: ['Addidas Campus', 'Addidas Samba', 'Valentino', 'Nike S', 'Nike SB', 'Nike Cortex', 'Nike TN', 'Nike Shox', 'Nike Zoom', 'New Balance'] },
  { value: 'vans', label: 'Vans', subcategories: ['Custom', 'Codra', 'Skater', 'Off the Wall'] },
  { value: 'jordan', label: 'Jordan', subcategories: ['Jordan 1', 'Jordan 3', 'Jordan 4', 'Jordan 9', 'Jordan 11', 'Jordan 14'] },
  { value: 'airmax', label: 'Airmax', subcategories: ['AirMax 1', 'Airmax 97', 'Airmax 95', 'Airmax 90', 'Airmax Portal', 'Airmax'] },
  { value: 'airforce', label: 'Airforce', subcategories: ['Airforce'] },
  { value: 'casuals', label: 'Casuals', subcategories: ['Lacoste', 'Timberland', 'Tommy Hilfiggr', 'Boss', 'Other'] },
  { value: 'custom', label: 'Custom', subcategories: ['Custom'] },
];

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: authLoading } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [availableImages, setAvailableImages] = useState<Array<{ id: string; url: string; category: string; subcategory: string }>>([]);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  const selectedCategory = watch('category');
  const selectedSubcategory = watch('subcategory');
  const selectedImage = watch('image');

  const selectedCategoryData = CATEGORIES.find((c) => c.value === selectedCategory);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchProduct(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const data = await response.json();
      const product = data.product;

      setValue('name', product.name);
      setValue('description', product.description || '');
      setValue('price', product.price);
      setValue('image', product.image);
      setValue('category', product.category);
      setValue('subcategory', product.subcategory || '');
      setValue('gender', product.gender || undefined);
      setValue('tags', product.tags?.join(', ') || '');
      setValue('featured', product.featured || false);

      setImagePreview(product.image);
    } catch (error: any) {
      alert(error.message || 'Failed to load product');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableImages = useCallback(async () => {
    if (!selectedCategory || !selectedSubcategory) {
      setAvailableImages([]);
      return;
    }

    try {
      const response = await fetch(`/api/images?category=${selectedCategory}&subcategory=${selectedSubcategory}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableImages(data.images || []);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  }, [selectedCategory, selectedSubcategory]);

  const handleImageUrlChange = useCallback((url: string) => {
    setImagePreview(url);
    setValue('image', url);
  }, [setValue]);

  // Watch for image URL changes to update preview
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'image' && value.image) {
        setImagePreview(value.image);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Handle file upload from device
  const handleFileUpload = async (file: File) => {
    if (!selectedCategory || !selectedSubcategory) {
      alert('Please select category and subcategory first');
      return;
    }

    setUploadingImage(true);
    setUploadProgress('Uploading image...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', selectedCategory);
      formData.append('subcategory', selectedSubcategory);

      const response = await fetch('/api/admin/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const result = await response.json();
      const imageUrl = result.image?.url || result.imageUrl;

      if (imageUrl) {
        setValue('image', imageUrl);
        setImagePreview(imageUrl);
        setUploadProgress('Image uploaded successfully!');
      } else {
        throw new Error('No image URL returned from upload');
      }
    } catch (error: any) {
      setUploadProgress('');
      alert(error.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      setTimeout(() => setUploadProgress(''), 3000);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB');
        return;
      }
      handleFileUpload(file);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!id || typeof id !== 'string') return;

    setSubmitting(true);
    try {
      const tagsArray = data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          tags: tagsArray,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update product');
      }

      router.push('/admin/products');
    } catch (error: any) {
      alert(error.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-1">Update product information</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-8 space-y-6">
          {/* Same form fields as add.tsx */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price (KES) *
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
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
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
          </div>

          {selectedCategoryData && (
            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory *
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
              {errors.subcategory && <p className="mt-1 text-sm text-red-600">{errors.subcategory.message}</p>}
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Product Image *
            </label>
            
            <div className="flex gap-4 items-start">
              {/* File Upload Section */}
              <div className="flex-1 mb-4">
                {/* File Upload */}
                <div className="mb-4">
                  <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload from Device
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    disabled={uploadingImage || !selectedCategory || !selectedSubcategory}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {!selectedCategory || !selectedSubcategory ? (
                    <p className="mt-1 text-xs text-gray-500">Please select category and subcategory first</p>
                  ) : null}
                  {uploadProgress && (
                    <p className={`mt-1 text-sm ${uploadProgress.includes('successfully') ? 'text-green-600' : 'text-blue-600'}`}>
                      {uploadProgress}
                    </p>
                  )}
                </div>
              </div>

              {/* Image Preview */}
              {(imagePreview || selectedImage) && (
                <div className="flex-shrink-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                  <div className="relative w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={imagePreview || selectedImage || ''}
                      alt="Product preview"
                      fill
                      className="object-cover"
                      onError={() => setImagePreview('')}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 break-all max-w-[128px]">
                    {imagePreview || selectedImage}
                  </p>
                </div>
              )}
            </div>

            {/* Hidden image URL field for form validation */}
            <input
              id="image"
              type="hidden"
              {...register('image')}
            />
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>}

          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              id="gender"
              {...register('gender')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            >
              <option value="">Select gender</option>
              <option value="Men">Men</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              {...register('tags')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              placeholder="e.g., New Arrivals, Best Seller"
            />
            <p className="mt-1 text-xs text-gray-500">Separate multiple tags with commas</p>
          </div>

          <div className="flex items-center">
            <input
              id="featured"
              type="checkbox"
              {...register('featured')}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Mark as featured product
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary text-white py-3 px-4 rounded-md font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Updating...' : 'Update Product'}
            </button>
            <Link
              href="/admin/products"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
