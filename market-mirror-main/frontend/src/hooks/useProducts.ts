import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  category_id?: string | null;
  featured?: boolean;
  is_active?: boolean;
  author?: string;
  live_demo_url?: string;
  compatibility?: string[];
  features?: string[];
  images?: string[];
  file_url?: string;
  sales_count?: number;
  rating?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProductWithCategory extends Product {
  category: Category | null;
}

interface UseProductsOptions {
  categorySlug?: string;
  featured?: boolean;
  search?: string;
  sortBy?: "price-asc" | "price-desc" | "newest" | "popular";
  limit?: number;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const { categorySlug, featured, search, sortBy = "newest", limit } = options;

  return useQuery({
    queryKey: ["products", options],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("activeOnly", "true");
      if (categorySlug) params.set("categorySlug", categorySlug);
      if (featured !== undefined) params.set("featured", String(featured));
      if (search) params.set("search", search);
      if (sortBy) params.set("sortBy", sortBy);
      if (limit) params.set("limit", String(limit));
      return apiGet<ProductWithCategory[]>(`/api/products?${params.toString()}`, false);
    },
  });
};

export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => apiGet<ProductWithCategory | null>(`/api/products/${productId}`, false),
    enabled: !!productId,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => apiGet<Category[]>("/api/categories", false),
  });
};

export const useFeaturedProducts = (limit = 6) => useProducts({ featured: true, limit });
