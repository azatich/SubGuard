'use client'

import { api } from "@/shared/lib/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface SignupData {
  full_name: string,
  email: string;
  password: string;
}

interface ErrorResponse {
  message: string
}

export const useSignup = () => {
  const router = useRouter();

  return useMutation<any, AxiosError<ErrorResponse>, SignupData>({
    mutationFn: async (data: SignupData) => {
      const res = await api.post("/auth/signup", data);
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
