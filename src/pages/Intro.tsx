
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Intro = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    navigate("/saga");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <button
        onClick={handleEnter}
        className={`text-center transition-all duration-1000 ease-out transform hover:scale-105 focus:outline-none group ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1 className="text-6xl md:text-8xl font-light text-black mb-4 tracking-wide">
          L.E.G.I.T.
        </h1>
        <p className="text-xl md:text-2xl font-light text-gray-700 tracking-wider">
          Legal Guidance for Integrity and Transparency
        </p>
        <div className="mt-8 text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Click to enter
        </div>
      </button>
    </div>
  );
};

export default Intro;
