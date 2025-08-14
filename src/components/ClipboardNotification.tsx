
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface ClipboardNotificationProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

export default function ClipboardNotification({ text, children, className = "" }: ClipboardNotificationProps) {
  const [showNotification, setShowNotification] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 1500);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className={`relative ${className}`} onClick={copyToClipboard}>
      {children}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right-2 duration-300">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Copied!</span>
        </div>
      )}
    </div>
  );
}
