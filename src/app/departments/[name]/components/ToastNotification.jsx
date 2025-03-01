import React from "react";
import { 
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";

/**
 * Toast notification component
 */
const ToastNotification = ({ 
  show, 
  variant, 
  title, 
  description, 
  onOpenChange 
}) => {
  if (!show) return null;
  
  return (
    <Toast
      variant={variant}
      onOpenChange={onOpenChange}
    >
      <ToastTitle>{title}</ToastTitle>
      <ToastDescription>{description}</ToastDescription>
    </Toast>
  );
};

export default ToastNotification;
