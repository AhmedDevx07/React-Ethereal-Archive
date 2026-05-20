import React, { useEffect } from "react";
import { Check } from "lucide-react";

const Toast = ({ id, message, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, 4000); // 4000ms aligns perfectly with the entrance, delay, and slideOut animations in App.css

    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <div className="toast-item">
      <Check size={16} strokeWidth={2.5} />
      <span>{message}</span>
    </div>
  );
};

export const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
