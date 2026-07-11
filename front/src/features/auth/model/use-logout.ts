'use client'

import { api } from "@/shared/lib/api";
import { successToast } from "@/shared/lib/toasts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface UseLogoutOptions {
  redirectTo?: string;
}

export const useLogout = ({ redirectTo = "/login" }: UseLogoutOptions = {}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      queryClient.clear();
      successToast("Вы вышли из аккаунта");
      router.replace(redirectTo);
      router.refresh();
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
