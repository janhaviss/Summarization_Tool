// ForgotPassword.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPassword } from "../api/password";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setMessage("Check your email for reset instructions");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Request failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-2 bg-[#8e7ab5] text-white rounded disabled:bg-gray-400"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-[#3A8C4C]">{message}</p>}

      <p className="mt-4 text-sm text-center text-gray-600">
        <Link
          to="/login"
          className="text-[#8e7ab5] font-medium hover:underline"
        >
          Back to Login
        </Link>
      </p>
    </div>
  );
}
