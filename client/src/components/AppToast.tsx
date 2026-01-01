import { useEffect } from "react";

type ToastType = "success" | "danger" | "warning" | "info";

interface AppToastProps {
  message: string;
  type: ToastType;
  show: boolean;
  duration?: number;
  onClose: () => void;
}

const AppToast = ({
  message,
  type,
  show,
  duration = 3000,
  onClose,
}: AppToastProps) => {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className="toast-container position-fixed top-0 start-50 translate-middle-x p-3">
      <div className={`toast show text-bg-${type} border-0`}>
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            className="btn-close btn-close-white me-2 m-auto"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default AppToast;
