import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDoubleTap } from "@/hooks/use-double-tap";

const Intro = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const enter = useCallback(() => navigate("/main"), [navigate]);
  const handleTap = useDoubleTap(enter);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <button
        onClick={handleTap}
        aria-label="Double-tap to enter L.E.G.I.T."
        className={`text-center select-none transition-all duration-1000 ease-out transform hover:scale-105 focus:outline-none group ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ touchAction: "manipulation" }}
      >
        <h1 className="text-6xl md:text-8xl font-light text-black mb-4 tracking-wide">
          L.E.G.I.T.
        </h1>
        <p className="text-xl md:text-2xl font-light text-gray-700 tracking-wider">
          Legal Guidance for Integrity and Transparency
        </p>
      </button>
    </div>
  );
};

export default Intro;
