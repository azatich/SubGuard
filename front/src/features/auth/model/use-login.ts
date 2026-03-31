'use client'

import { api } from "@/shared/lib/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface LoginData {
  email: string;
  password: string;
}

interface ErrorResponse {
  message: string
}

export const useLogin = () => {
  const router = useRouter();

  return useMutation<any, AxiosError<ErrorResponse>, LoginData>({
    mutationFn: async (data: LoginData) => {
      const res = await api.post("/auth/login", data);
      return res.data;
    },
    onSuccess: (data) => {
        router.push('/dashboard')
    },
    onError: (error) => {
        console.log(error);
    }
  });
};
