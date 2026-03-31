import { api } from "@/shared/lib/api";
import { errorToast, successToast } from "@/shared/lib/toasts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/subscription/subscription/${id}`);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      successToast('Успешно удалено')
    },

    onError: () => {
      errorToast('Ошибка удаления')
    },
  });
};
