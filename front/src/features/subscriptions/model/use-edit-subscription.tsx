import { api } from "@/shared/lib/api";
import { errorToast, successToast } from "@/shared/lib/toasts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditSubscriptionPayload {
  id?: string;
  name?: string;
  category?: string;
  cycle?: string;
  currency?: string;
  cost?: number;
  date?: string;
}

export const useEditSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: EditSubscriptionPayload) => {
      const res = await api.patch(`/subscription/subscription/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      successToast("Подписка успешно обновлена!")
    },
    onError: (error) => {
      errorToast("Ошибка при обновлении подписки!")
      console.error("Ошибка при обновлении подписки:", error);
    },
  });
};
