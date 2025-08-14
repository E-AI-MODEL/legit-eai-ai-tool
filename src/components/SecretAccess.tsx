
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const SecretAccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl+Shift+S to access secret page
      if (event.ctrlKey && event.shiftKey && event.key === 'S') {
        event.preventDefault();
        navigate('/saga-secret');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  return null;
};
