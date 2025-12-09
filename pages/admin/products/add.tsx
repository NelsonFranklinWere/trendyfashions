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
  image: z.string().min(1, 'Please upload at least one image').refine(
    (url) => {
      // Allow empty string during upload, but validate URL format if provided
      if (!url || url.trim() === '') return false;
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Valid image URL is required' }
  ),
  category: z.string().min(1, 'Category is required'),
  gender: z.enum(['Men', 'Unisex']).optional(),
  tags: z.string().optional(),
  featured: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productSchema>;

const CATEGORIES = [
  { value: 'mens-officials', label: "Men's Officials" },
  { value: 'mens-nike', label: "Men's Nike" },
  { value: 'sports', label: 'Sports' },
  { value: 'mens-style', label: "Men's Style" },
  { value: 'vans', label: 'Vans' },
  { value: 'sneakers', label: 'Sneakers' },
];

export default function AddProduct() {
  const router = useRouter();
  const { user, loading: authLoading } = useAdminAuth();
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
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
    defaultValues: {
      featured: false,
    },
  });

  const selectedCategory = watch('category');
  const selectedImage = watch('image');

  // Fetch available images when category changes
  const fetchAvailableImages = useCallback(async () => {
    if (!selectedCategory) {
      setAvailableImages([]);
      return;
    }

    try {
      const response = await fetch(`/api/images?category=${selectedCategory}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableImages(data.images || []);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  }, [selectedCategory]);

  // Update image preview when image URL changes
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

  // Load images when category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchAvailableImages();
    }
  }, [selectedCategory, fetchAvailableImages]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
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

  // Handle file upload from device
  const handleFileUpload = async (file: File, index?: number) => {
    if (!selectedCategory) {
      alert('Please select category first');
      return;
    }

    setUploadingImage(true);
    setUploadProgress(`Uploading image ${index !== undefined ? `${index + 1}/10` : ''}...`);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', selectedCategory);

      const response = await fetch('/api/admin/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to upload image';
        try {
          const error = await response.json();
          errorMessage = error.error || error.details || errorMessage;
        } catch (e) {
          const text = await response.text();
          if (text) {
            errorMessage = text;
          }
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      const imageUrl = result.image?.url || result.imageUrl || result.image?.url;

      if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
        // Ensure it's a valid URL
        try {
          new URL(imageUrl);
          if (index !== undefined) {
            // Multiple images mode
            setUploadedImages(prev => {
              const newImages = [...prev];
              newImages[index] = imageUrl;
              return newImages;
            });
            // Also update the hidden field with the first image
            if (index === 0) {
              setValue('image', imageUrl, { shouldValidate: true });
            }
          } else {
            // Single image mode
            setValue('image', imageUrl, { shouldValidate: true });
            setImagePreview(imageUrl);
          }
          setUploadProgress(`Image ${index !== undefined ? `${index + 1}/10` : ''} uploaded successfully!`);
        } catch (urlError) {
          throw new Error(`Invalid image URL format: ${imageUrl}`);
        }
      } else {
        throw new Error('No valid image URL returned from upload');
      }
    } catch (error: any) {
      setUploadProgress('');
      const errorMessage = error.message || 'Failed to upload image';
      console.error('Upload error:', error);
      alert(`Upload failed: ${errorMessage}\n\nPlease check:\n1. Supabase environment variables are set\n2. Category and subcategory are selected\n3. File is a valid image (max 10MB)`);
    } finally {
      setUploadingImage(false);
      setTimeout(() => setUploadProgress(''), 3000);
    }
  };

  const handleMultipleFileUpload = async (files: FileList) => {
    if (!selectedCategory) {
      alert('Please select category first');
      return;
    }

    const fileArray = Array.from(files).slice(0, 10); // Limit to 10 images
    
    if (fileArray.length === 0) {
      alert('Please select at least one image');
      return;
    }

    if (fileArray.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    setUploadedImages([]);
    setUploadingImage(true);
    setUploadProgress('Uploading images...');

    try {
      const uploadPromises = fileArray.map((file, index) => {
        // Validate file
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${index + 1} is not an image`);
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File ${index + 1} is larger than 10MB`);
        }
        return handleFileUpload(file, index);
      });

      // Upload images sequentially to avoid overwhelming the server
      for (let i = 0; i < fileArray.length; i++) {
        await handleFileUpload(fileArray[i], i);
      }
      setUploadProgress(`Successfully uploaded ${fileArray.length} images!`);
    } catch (error: any) {
      setUploadProgress('');
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploadingImage(false);
      setTimeout(() => setUploadProgress(''), 5000);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (files.length === 1) {
        // Single image mode
        const file = files[0];
        if (!file.type.startsWith('image/')) {
          alert('Please select an image file');
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          alert('Image size must be less than 10MB');
          return;
        }
        handleFileUpload(file);
      } else {
        // Multiple images mode
        handleMultipleFileUpload(files);
      }
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setSubmitting(true);
    try {
      const tagsArray = data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
      
      // Determine which images to use - prioritize uploadedImages
      const imagesToUse = uploadedImages.length > 0 
        ? uploadedImages.filter(Boolean) 
        : (data.image && data.image.trim() !== '' ? [data.image] : []);
      
      if (imagesToUse.length === 0) {
        alert('Please upload at least one image before submitting');
        setSubmitting(false);
        return;
      }

      // Validate all image URLs
      const invalidImages = imagesToUse.filter(url => {
        try {
          new URL(url);
          return false;
        } catch {
          return true;
        }
      });

      if (invalidImages.length > 0) {
        alert('One or more image URLs are invalid. Please re-upload the images.');
        setSubmitting(false);
        return;
      }

      // Create products for each image
      const productPromises = imagesToUse.map((imageUrl) => {
        return fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            image: imageUrl,
            tags: tagsArray,
          }),
        });
      });

      const responses = await Promise.all(productPromises);
      
      const errors = [];
      for (const response of responses) {
        if (!response.ok) {
          const error = await response.json();
          errors.push(error.error || 'Failed to create product');
        }
      }

      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Success - show message and redirect
      const successMessage = imagesToUse.length > 1 
        ? `Successfully created ${imagesToUse.length} products with the same details!`
        : 'Product created successfully!';
      
      alert(successMessage);
      router.push('/admin/products');
    } catch (error: any) {
      alert(error.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
          <p className="text-gray-600 mt-1">Create a new product for your catalog</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-8 space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              placeholder="e.g., Nike Air Max 90"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              placeholder="Describe the product..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          {/* Price */}
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
              placeholder="2800"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
          </div>

          {/* Category */}
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


          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Product Images * (Upload 1-10 images)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Upload up to 10 images. All images will create separate products with the same name, description, and price.
            </p>
            <div className="mb-4">
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInputChange}
                disabled={uploadingImage || !selectedCategory}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {!selectedCategory ? (
                <p className="mt-1 text-xs text-gray-500">Please select category first</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">You can select 1-10 images at once</p>
              )}
              {uploadProgress && (
                <p className={`mt-1 text-sm ${uploadProgress.includes('successfully') ? 'text-green-600' : 'text-blue-600'}`}>
                  {uploadProgress}
                </p>
              )}
            </div>

            {/* Image Previews Grid */}
            {(uploadedImages.length > 0 || imagePreview || selectedImage) && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Previews ({uploadedImages.length > 0 ? uploadedImages.length : 1} image{uploadedImages.length > 1 ? 's' : ''})
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {uploadedImages.length > 0 ? (
                    uploadedImages.map((imgUrl, index) => (
                      imgUrl && (
                        <div key={index} className="relative">
                          <div className="relative w-full h-32 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={imgUrl}
                              alt={`Product preview ${index + 1}`}
                              fill
                              className="object-cover"
                              onError={() => {
                                setUploadedImages(prev => prev.filter((_, i) => i !== index));
                              }}
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500 text-center">Image {index + 1}</p>
                        </div>
                      )
                    ))
                  ) : (
                    (imagePreview || selectedImage) && (
                      <div className="relative">
                        <div className="relative w-full h-32 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={imagePreview || selectedImage || ''}
                            alt="Product preview"
                            fill
                            className="object-cover"
                            onError={() => setImagePreview('')}
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500 text-center">Single Image</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Hidden image URL field for form validation */}
            <input
              id="image"
              type="hidden"
              {...register('image', {
                required: 'Please upload at least one image',
                validate: (value) => {
                  // If we have uploaded images, use those instead
                  if (uploadedImages.length > 0) {
                    const firstImage = uploadedImages[0];
                    if (!firstImage || firstImage.trim() === '') {
                      return 'Please wait for image upload to complete';
                    }
                    try {
                      new URL(firstImage);
                      return true;
                    } catch {
                      return 'Invalid image URL format';
                    }
                  }
                  // Otherwise validate the provided value
                  if (!value || value.trim() === '') {
                    return 'Please upload at least one image';
                  }
                  try {
                    new URL(value);
                    return true;
                  } catch {
                    return 'Valid image URL is required';
                  }
                }
              })}
              value={uploadedImages.length > 0 ? uploadedImages[0] : (imagePreview || selectedImage || '')}
            />
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>}
            {uploadedImages.length === 0 && !imagePreview && !selectedImage && (
              <p className="mt-1 text-sm text-red-600">Please upload at least one image</p>
            )}
          </div>

          {/* Gender */}
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

          {/* Tags */}
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

          {/* Featured */}
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

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary text-white py-3 px-4 rounded-md font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Creating...' : 'Create Product'}
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
