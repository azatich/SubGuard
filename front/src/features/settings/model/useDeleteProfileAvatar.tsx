import { api } from "@/shared/lib/api";
import { errorToast, successToast } from "@/shared/lib/toasts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteProfileAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await api.delete("/settings/avatar");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      successToast('Аватар успешно удален')
    },
    onError: (error) => {
      console.error("Failed to delete avatar:", error);
      errorToast('Ошибка при удалении аватара')
    },
  });
};