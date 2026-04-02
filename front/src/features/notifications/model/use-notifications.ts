import { Notification } from "@/entities/notifications"
import { api } from "@/shared/lib/api"
import { useQuery } from "@tanstack/react-query"

export const useNotifications = () => {
    return useQuery<Notification[]>({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await api.get('/notification')
            return res.data
        },
    })
}