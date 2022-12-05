import { toast as hotToast } from "react-hot-toast";

export type ToastStatus = "success" | "warning" | "error";

function backgroundForStatus(status: ToastStatus): string {
  switch (status) {
    case "error":
      return "red";
    case "warning":
      return "orange";
    default:
      return "blue";
  }
}

function colorForStatus(status: ToastStatus): string {
  switch (status) {
    case "error":
      return "bg";
    default:
      return "fg";
  }
}

function iconForStatus(status: ToastStatus): string {
  switch (status) {
    case "error":
      return "⛔";
    case "warning":
      return "⚠️";
    default:
      return "👍";
  }
}

export function toast({
  message = "Unknown error.",
  status = "success",
  duration = 4000,
  promise,
  persist = false,
}: {
  message?: string;
  status?: ToastStatus;
  duration?: number;
  promise?: Promise<unknown>;
  persist?: boolean;
}) {
  if (promise) {
    hotToast.promise(promise, {
      loading: message,
      success: "Success!",
      error: "Error!",
    });
  } else {
    hotToast(message, {
      icon: iconForStatus(status),
      style: {
        background: `var(--${backgroundForStatus(status)})`,
        color: `var(--${colorForStatus(status)})`,
      },
      duration: persist ? undefined : duration,
    });
  }
}
