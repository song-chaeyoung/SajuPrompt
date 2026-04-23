import { toast, type ExternalToast } from "sonner";

type AppToastOptions = {
  title?: string;
  description?: ExternalToast["description"];
  duration?: number;
  id?: ExternalToast["id"];
};

export function showSuccessToast(
  message: string,
  {
    title = "완료",
    description,
    duration = 2400,
    id = message,
  }: AppToastOptions = {},
) {
  toast.success(title, {
    description: description ?? message,
    duration,
    id,
  });
}

export function showErrorToast(
  message: string,
  {
    title = "확인해 주세요",
    description,
    duration = 3400,
    id = message,
  }: AppToastOptions = {},
) {
  toast.error(title, {
    description: description ?? message,
    duration,
    id,
  });
}
