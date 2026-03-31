import { api } from "@/shared/lib/api";
import { errorToast, successToast } from "@/shared/lib/toasts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddSubscriptionPayload {
  name: string;
  category: string;
  cycle: string;
  currency: string;
  cost: number;
  date: string;
}

export const useAddSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddSubscriptionPayload) => {
      const res = await api.post('/subscription/subscription', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      successToast("Подписка успешно добавлена!")
    },
    onError: (error) => {
      errorToast('Ошибка при добавлении подписки')
      console.error("Ошибка при добавлении подписки:", error);
    }
  });
};