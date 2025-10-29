// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { login as apiLogin } from "../api/auth";
import { IoIosEyeOff, IoIosEye } from "react-icons/io";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null); // text
  const [messageType, setMessageType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  // const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault(); // to prevent form relaoding
    setMessage(null);
    setMessageType(null);
    setIsLoading(true);
    // setError(null);

    try {
      const data = await apiLogin(formData.email, formData.password);
      // store token in localstorage
      localStorage.setItem("token", data.access_token); //python mai access_token
      // update auth context
      authLogin(data.access_token);
      setMessage("Login successful!");
      setMessageType("success");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      const message = typeof err === "string" ? err : "Login failed";
      setMessage(message); // how immediately
      setMessageType("error"); // set type
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      {/* {error && (
      <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
        {typeof error === 'string' ? error : 'Login failed. Please try again.'}
      </div>
    )} */}

      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        {/* <div className="min-h-screen bg-[url('../public/image/bg3.jpg')] bg-cover bg-center flex items-center justify-center"> */}
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="max-w-md w-full bg-[#f5efff] rounded-sm p-1 mb-3">
            <h2 className="text-2xl font-bold text-center text-gray-600">
              Welcome Back
            </h2>
          </div>
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
          <form onSubmit={handleLogin} className="space-y-5">
            {" "}
            {/* For now replace handleSumbit with handle login */}
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="eg: janedoe@domain.com"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#8e7ab5] focus:border-[#8e7ab5]"
              />
            </div>
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#8e7ab5] focus:border-[#8e7ab5]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
                >
                  {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
                </button>
              </div>
            </div>
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-4 py-2 rounded-md text-white font-medium ${
                  isLoading ? "bg-gray-400" : "bg-[#8e7ab5] hover:bg-[#b784b7]"
                } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
              >
                {isLoading ? (
                  <span className="flex items-center text-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Login...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-gray-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
          <p className="mt-4 text-sm text-center text-gray-600">
            <Link
              to="/forgot-password"
              className="text-gray-600 font-medium hover:underline"
            >
              Forgot Password
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
