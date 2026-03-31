import { api } from "@/shared/lib/api";
import { useQuery } from "@tanstack/react-query";

interface UserProfileResponse {
  id: string;
  full_name: string;
  base_currency: string;
  reminder_days: number;
  avatar_url: string;
  email: string;
  updated_at: string;
}


export const useProfile = () => {
  return useQuery<UserProfileResponse>({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/settings/profile');
      return res.data;
    },
    staleTime: 1000 * 60 * 5, 
  });
};