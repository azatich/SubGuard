import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/lib/api";

interface GoogleAuthResponse {
  url: string;
}

export const useSignupWithGoogle = () => {
  return useMutation({
    mutationFn: async () => {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const res = await api.get<GoogleAuthResponse>(`/auth/google/url?redirectUrl=${encodeURIComponent(redirectUrl)}`);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      console.error("Google Auth error:", error);
    }
  });
};