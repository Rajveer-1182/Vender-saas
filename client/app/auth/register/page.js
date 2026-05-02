'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    gstNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authAPI.register({
        businessName: formData.businessName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        gstNumber: formData.gstNumber,
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (

<div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-8">

  {/* Card */}
  <div className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-2xl p-8">

    {/* Heading */}
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900">
        Create Account
      </h1>
      <p className="text-gray-500 text-sm mt-2">
        Start managing your business smarter 🚀
      </p>
    </div>

    {/* Error */}
    {error && (
      <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
        {error}
      </div>
    )}

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-5 m-4 p-4 border border-gray-100 rounded-lg">

      {/* Business Name */}
      <div>
        <label className="text-md font-medium text-gray-700 m-5 mb-1">
          Business Name
        </label>
        <input
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          placeholder="Enter your business name"
          className="w-full rounded-lg bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label className="text-md  font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+91 XXXXX XXXXX"
          className="w-full mt-1 px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-md  font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className="w-full mt-1 px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          required
        />
      </div>

      {/* GST */}
      <div>
        <label className="text-md  font-medium text-gray-700">
          GST Number (Optional)
        </label>
        <input
          type="text"
          name="gstNumber"
          value={formData.gstNumber}
          onChange={handleChange}
          placeholder="Enter GST number"
          className="w-full mt-1 px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Password */}
      <div>
        <label className="text-md  font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create strong password"
          className="w-full mt-1 px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          required
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label className="text-md  font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          className="w-full mt-1 px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          required
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>

    </form>

    {/* Footer */}
    <p className="text-center text-gray-500 text-sm mt-6">
      Already have an account?{" "}
      <button
        onClick={() => router.push('/auth/login')}
        className="text-indigo-600 font-semibold hover:underline"
      >
        Login
      </button>
    </p>

  </div>
</div>


  );
}
