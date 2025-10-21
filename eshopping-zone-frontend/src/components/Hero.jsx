import { useNavigate } from "react-router-dom";
import bgImage from "../assets/hero-bg.jpg";

export default function Hero() {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate("/products?category=Men-Jackets");
  };

  return (
    <section
      className="h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>

      {/* Content */}
      <div
        className="relative z-10 text-white text-center px-6 py-10 rounded-lg animate-fade-in-up"
        style={{ maxWidth: "700px" }}
      >
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Men New-Season <span className="text-blue-400">JACKETS & COATS</span>
        </h2>
        <p className="text-lg md:text-xl mb-6 font-light tracking-wide">
          Upgrade your wardrobe with the latest styles and unbeatable comfort.
        </p>
        <button
          onClick={handleShopNow}
          className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 px-8 py-3 rounded-full text-white font-semibold shadow-lg hover:scale-105"
        >
          SHOP NOW
        </button>
      </div>
    </section>
  );
}
