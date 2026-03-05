import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiGet } from "@/lib/api";

export const usePurchaseStatus = (productId: string) => {
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!user || !productId) {
        setIsPurchased(false);
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiGet<{ already_purchased: boolean }>(`/api/purchase-status/${productId}`);
        setIsPurchased(Boolean(data.already_purchased));
      } catch (error) {
        console.error("Error checking purchase status:", error);
        setIsPurchased(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPurchaseStatus();
  }, [user?.id, productId]);

  return { isPurchased, isLoading };
};
