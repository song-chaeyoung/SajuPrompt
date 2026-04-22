import { toast, type ExternalToast } from "sonner";

type AppToastOptions = {
  description?: ExternalToast["description"];
  duration?: number;
  id?: ExternalToast["id"];
};

export function showSuccessToast(
  message: string,
  {
    description,
    duration = 2400,
    id = message,
  }: AppToastOptions = {},
) {
  toast.success("", {
    description: description ?? message,
    duration,
    id,
  });
}

export function showErrorToast(
  message: string,
  {
    description,
    duration = 3400,
    id = message,
  }: AppToastOptions = {},
) {
  toast.error("", {
    description: description ?? message,
    duration,
    id,
  });
}
