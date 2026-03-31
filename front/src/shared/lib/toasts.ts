import { toast } from "sonner";

export function successToast(message: string, successMessage?: string) {
  return toast.success(message, {
    style: { backgroundColor: "#2cfc73", border: "none" },
  });
}

export function errorToast(message: string, errorMessage?: string) {
  return toast.error(message, {
    style: {
      backgroundColor: "red",
      border: "none",
    },
  });
}
