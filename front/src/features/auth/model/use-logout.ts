'use client'

import { api } from "@/shared/lib/api";
import { successToast } from "@/shared/lib/toasts";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      successToast("Вы вышли из аккаунта");
      router.push("/login");
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
