import { createContext, useContext, useState } from "react";
import type { ReactNode } from 'react';

import AppToast from "../components/AppToast";

type ToastType = "success" | "danger" | "warning" | "info";

interface ToastState {
  message: string;
  type: ToastType;
  show: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "info",
    show: false,
  });

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type, show: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Single global toast */}
      <AppToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return ctx;
};
