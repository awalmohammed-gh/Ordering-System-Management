import { X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose?: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  const styles = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`
        ${styles[type]}
        fixed top-5 right-5 z-50
        flex items-center justify-between
        min-w-[300px]
        px-5 py-3
        text-white
        rounded-lg
        shadow-lg
      `}
    >
      <p>{message}</p>

      <button onClick={onClose}>
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
