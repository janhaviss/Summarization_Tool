// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// export default function Login() {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     login(); // mark user as logged in
//     navigate('/'); // go home or redirect
//   };

//   return (
//     <div>
//       <h2 className="text-2xl">Login Page</h2>
//       <button onClick={handleLogin} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
//         Login
//       </button>
//     </div>
//   );
// }


// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
    console.log(formData);
  };

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login(); // mark user as logged in
    navigate('/'); // go home or redirect
  };

  return (
    <div className="min-h-screen bg-[#f5efff] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-[#8e7ab5] mb-6">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-5"> {/* For now replace handleSumbit with handle login */}
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#8e7ab5]">
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
            <label htmlFor="password" className="block text-sm font-medium text-[#8e7ab5]">
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

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#8e7ab5] text-white font-semibold rounded-md hover:bg-[#7c68a5] transition"
            >
              Login
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#8e7ab5] font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
