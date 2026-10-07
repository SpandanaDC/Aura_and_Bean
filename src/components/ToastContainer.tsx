import { useEffect } from "react";
import { CheckCircle2, Info, X } from "lucide-react";
import type { Toast } from "@/lib/brewsync";

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const config = {
    success: { icon: CheckCircle2, color: "text-sage-500" },
    info: { icon: Info, color: "text-terracotta-400" },
  }[toast.type];

  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-cream-200 bg-white px-5 py-3.5 shadow-lg animate-slide-in-right">
      <Icon className={`h-5 w-5 ${config.color}`} />
      <span className="text-sm font-medium text-espresso-600">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-1 text-espresso-400/50 transition hover:text-espresso-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
