import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useExchangeRates = (baseCurrency: string) => {
  return useQuery({
    queryKey: ["exchangeRates", baseCurrency],
    queryFn: async () => {
      const res = await axios.get(`https://open.er-api.com/v6/latest/${baseCurrency}`);
            return res.data.rates as Record<string, number>;
    },
    staleTime: 1000 * 60 * 60 * 24, 
    enabled: !!baseCurrency, 
  });
};