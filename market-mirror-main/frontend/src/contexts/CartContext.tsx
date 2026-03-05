import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiDelete, apiGet, apiPost } from "@/lib/api";

interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  images?: string[];
  author?: string;
}

interface CartItem {
  id: string;
  product_id: string;
  product: Product;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCart = async () => {
    if (!user) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiGet<CartItem[]>("/api/cart");
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user?.id]);

  const addToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiPost("/api/cart", { product_id: productId });
      await fetchCart();
      toast({ title: "Added to cart", description: "Item has been added to your cart." });
    } catch (error: any) {
      if (String(error?.message || "").toLowerCase().includes("already")) {
        toast({ title: "Already in cart", description: "This item is already in your cart." });
        return;
      }
      toast({
        title: "Error",
        description: `Failed to add item to cart: ${error?.message || "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;
    try {
      await apiDelete(`/api/cart/${productId}`);
      await fetchCart();
      toast({ title: "Removed from cart", description: "Item has been removed from your cart." });
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await apiDelete("/api/cart");
      setItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const isInCart = (productId: string) => items.some((item) => item.product_id === productId);
  const totalPrice = items.reduce((sum, item) => sum + (item.product?.price || 0), 0);

  return (
    <CartContext.Provider value={{ items, itemCount: items.length, totalPrice, isLoading, addToCart, removeFromCart, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
