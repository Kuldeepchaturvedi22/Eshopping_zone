import React from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPromptModal({ show }) {
  const navigate = useNavigate();

  if (!show) return null;

  const handleRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center animate-bounce-in">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          To place your order, please sign in to your account.
        </h2>
        <button
          onClick={handleRedirect}
          className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
        >
          OK
        </button>
      </div>
    </div>
  );
}
