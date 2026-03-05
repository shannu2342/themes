import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiGet } from "@/lib/api";
import type { Product } from "@/hooks/useProducts";

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  price: number;
  product: Product | null;
}

interface Order {
  id: string;
  user_id: string;
  total_price: number;
  payment_status: string;
  created_at?: string;
  order_items: OrderItem[];
}

export const useOrders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      return apiGet<Order[]>("/api/orders");
    },
    enabled: !!user,
  });
};

export const usePurchasedProducts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["purchased-products", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const products = await apiGet<Product[]>("/api/purchased-products");
      const uniqueProducts = Array.from(new Map(products.map((p) => [p.id, p])).values());
      return uniqueProducts;
    },
    enabled: !!user,
  });
};
