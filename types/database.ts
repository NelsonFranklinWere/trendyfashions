export interface ImageRecord {
  id: string;
  category: string;
  subcategory: string;
  filename: string;
  url: string;
  storage_path: string;
  thumbnail_url?: string;
  uploaded_at: string;
  uploaded_by?: string;
  file_size?: number;
  mime_type?: string;
  width?: number;
  height?: number;
  created_at: string;
  updated_at: string;
}

export interface ImageUpload {
  category: string;
  subcategory: string;
  file: File;
}

export interface ProductRecord {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string;
  category: string;
  subcategory: string | null;
  gender: string | null;
  tags: string[] | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
  gender?: 'Men' | 'Unisex' | null;
  tags?: string[];
  featured?: boolean;
}

export interface BlogPostRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CaseStudyRecord {
  id: string;
  title: string;
  slug: string;
  client_name: string | null;
  summary: string | null;
  challenge: string | null;
  solution: string | null;
  outcome: string | null;
  cover_image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}
