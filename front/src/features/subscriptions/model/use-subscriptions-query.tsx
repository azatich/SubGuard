import { Subscription } from "@/entities/subscriptions";
import { api } from "@/shared/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useSubscriptionsQuery = () => {
  return useQuery<Subscription[]>({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const res = await api.get("/subscription");
      return res.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};
