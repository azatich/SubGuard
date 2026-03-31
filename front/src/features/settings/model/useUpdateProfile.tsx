import { api } from "@/shared/lib/api"
import { errorToast, successToast } from "@/shared/lib/toasts";
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface ProfileData {
    fullName: string;
    baseCurrency: string;
    avatar?: File;
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/settings/update', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            })
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['profile']})
            successToast('Данные успешно обновлены')
        },

        onError: (error) => {
            errorToast('Ошибка при обновлении данных')
        }
    })
}