// src/pages/Register.jsx
import { useState } from "react";
import { register } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoIosEyeOff, IoIosEye } from "react-icons/io";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  // const {login : authLogin} = useAuth;
  const navigate = useNavigate();
  const [message, setMessage] = useState(null); // text
  const [messageType, setMessageType] = useState(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setMessageType(null);
    // when user submits then data is set to formdata below logic
    const { email, name, password, confirmPassword } = formData;

    if (password != confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 6 characters long");
      setMessageType("error");
      return;
    }

    try {
      await register(email, name, password); // not storing

      setMessage("Registration successful!");
      setMessageType("success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Registration failed: ", err);
      const message = typeof err === "string" ? err : "Registration failed";
      setMessage(message); // ✅ show immediately
      setMessageType("error");
    }
    console.log(formData);
  };

  return (
    <>
      <div className="min-h-screen bg-[#f5efff] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-[#8e7ab5] mb-6">
            Create an Account
          </h2>

          {/* Alert Message */}
          {message && (
            <div
              className={`p-3 rounded-md text-sm mb-4 ${
                messageType === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#8e7ab5]"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#8e7ab5] focus:border-[#8e7ab5]"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#8e7ab5]"
              >
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#8e7ab5] focus:border-[#8e7ab5]"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#8e7ab5]"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#8e7ab5] focus:border-[#8e7ab5]"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#8e7ab5]"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#8e7ab5] focus:border-[#8e7ab5]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
                >
                  {showConfirmPassword ? <IoIosEye /> : <IoIosEyeOff />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#8e7ab5] text-white font-semibold rounded-md hover:bg-[#7c68a5] transition"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
