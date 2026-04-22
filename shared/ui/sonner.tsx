"use client";

import type { CSSProperties } from "react";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

type AppToasterProps = Omit<ToasterProps, "theme"> & {
  theme: "light" | "dark";
};

const toasterStyle = {
  "--width": "min(26.5rem, calc(100vw - 1.5rem))",
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
  "--border-radius": "calc(var(--radius) * 2.35)",
} as CSSProperties;

function Toaster({ theme, toastOptions, ...props }: AppToasterProps) {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="top-center"
      expand={false}
      visibleToasts={1}
      offset={{
        top: 20,
        left: 16,
        right: 16,
      }}
      mobileOffset={{
        top: "calc(env(safe-area-inset-top) + 0.75rem)",
        left: 12,
        right: 12,
      }}
      containerAriaLabel="알림"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={toasterStyle}
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast: "cn-toast",
          icon: "cn-toast__icon",
          content: "cn-toast__content",
          title: "cn-toast__title",
          description: "cn-toast__description",
          actionButton: "cn-toast__action",
          cancelButton: "cn-toast__cancel",
          ...toastOptions?.classNames,
        },
        closeButtonAriaLabel: "알림 닫기",
      }}
      {...props}
    />
  );
}

export { Toaster };
