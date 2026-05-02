

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAPI } from '@/lib/api';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const successMsg = searchParams.get('success');
    if (successMsg) {
      setSuccess(successMsg);
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login({
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      console.log('Login response:', response);
      // Token is automatically saved in cookie by server
      // No need for localStorage
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 500); // Small delay to ensure cookie is set
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 px-4">
  
  <div className="w-full max-w-md bg-white p-8 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
    
    {/* Heading */}
    <h2 className="text-3xl font-semibold text-center text-gray-800 mb-2">
      Welcome Back 👋
    </h2>
    <p className="text-center text-gray-500 text-sm mb-6">
      Login to your account
    </p>

    {/* Success Message */}
    {success && (
      <div className="bg-green-100 text-green-700 text-sm py-2 px-3 rounded-md mb-4 text-center">
        {success}
      </div>
    )}

    {/* Error Message */}
    {error && (
      <div className="bg-red-100 text-red-600 text-sm py-2 px-3 rounded-md mb-4 text-center">
        {error}
      </div>
    )}

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-8 space-y-reverse p-4 border border-gray-100 rounded-lg">
      
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Phone
        </label>
        <input
          type="text"
          name="phone"
          placeholder="Enter your phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Password *
        </label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 active:scale-[0.98] transition duration-200 disabled:opacity-70"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>

    {/* Footer */}
    <p className="text-center text-sm text-gray-600 mt-6">
      Don’t have an account?{" "}
      <span
        onClick={() => router.push('/auth/register')}
        className="text-blue-600 font-medium cursor-pointer hover:underline"
      >
        Register
      </span>
    </p>
  </div>
</div>
  );
}