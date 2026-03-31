import { api } from "@/shared/lib/api";
import { errorToast, successToast } from "@/shared/lib/toasts";
import { useMutation } from "@tanstack/react-query";

interface UpdatePasswordPayload {
  newPassword: string;
}

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (data: UpdatePasswordPayload) => {
      const res = await api.post("/auth/update-password", data);
      return res.data;
    },
    onSuccess: () => {
      successToast("Пароль успешно обновлен");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Ошибка при обновлении пароля";
      errorToast(message);
    },
  });
};
