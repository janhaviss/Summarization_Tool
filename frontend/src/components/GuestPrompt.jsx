import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const GuestPrompt = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 30 * 1000); // show after 30 seconds

    return () => clearTimeout(timer); // cleanup on unmount
  }, []);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
          onClick={() => setShowModal(false)}
        >
          &#10005;
        </button>

        <h2 className="text-2xl font-bold mb-2 text-center text-[#8e7ab5]">
          Unlock Premium Features!
        </h2>
        <p className="text-gray-800 text-sm mb-4 text-center">
          Create a free account to save your work, get more translation credits,
          and enjoy priority processing.
        </p>

        <ul className="text-sm text-gray-600 mb-6 list-disc list-inside space-y-1">
          <li>No character limit</li>
          <li>Unlimited uses per day</li>
          <li>Save your history</li>
        </ul>

        <div className="flex justify-between">
          <Link
            to="/login"
            className="px-4 py-2 bg-[#8e7ab5] text-white rounded hover:bg-purple-700"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-gray-100 text-purple-600 rounded hover:bg-gray-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuestPrompt;
