import { Subscription } from "@/entities/subscriptions";
import { api } from "@/shared/lib/api";
import { errorToast, successToast } from "@/shared/lib/toasts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ToggleSubscription {
  id: string;
  status: string;
}

export const useToggleSubscriptionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: ToggleSubscription) => {
      const res = await api.patch(
        `/subscription/subscription/toggle-status/${id}`,
        { status },
      );
      return res.data;
    },

    onMutate: async ({ id, status }: ToggleSubscription) => {
      await queryClient.cancelQueries({ queryKey: ["subscriptions"] });

      const prevSubscriptions = queryClient.getQueryData(["subscriptions"]);

      queryClient.setQueryData(["subscriptions"], (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map((sub: Subscription) =>
            sub.id === id ? { ...sub, status: status } : sub,
          );
        }
        return old;
      });

      return { prevSubscriptions };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      successToast("Статус успешно изменен");
    },

    onError: (err, newTodo, context) => {
      if (context?.prevSubscriptions) {
        queryClient.setQueryData(["subscriptions"], context.prevSubscriptions);
      }
      errorToast("Ошибка при изменении статуса");
    },
  });
};
