import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

interface StatsResponse {
  productsCount: number;
  categoriesCount: number;
  usersCount: number;
  downloads: number;
  creators: number;
}

export const useStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => apiGet<StatsResponse>("/api/stats", false),
    staleTime: 5 * 60 * 1000,
  });
};
