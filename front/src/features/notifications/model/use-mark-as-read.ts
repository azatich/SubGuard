import { api } from "@/shared/lib/api";
import { errorToast, successToast } from "@/shared/lib/toasts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMarkNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.patch("/notification/mark-as-read", { ids });
      return res.data;
    },
    onSuccess: () => {
      successToast("Уведомления успешно отмечены как прочитанные");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: any) => {
      errorToast("Ошибка при отметке уведомлений как прочитанных");
    },
  });
};
