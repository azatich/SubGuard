export type FilterType = "all" | "unread" | "read";

export interface Notification {
  id: string
  user_id: string
  subscription_id: string
  type: string
  message: string
  is_read: boolean
  sent_at: string
}
