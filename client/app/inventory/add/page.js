'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInventory } from '@/hooks/useInventory';

export default function AddInventoryPage() {
  const router = useRouter();
  const { addItem, loading } = useInventory();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', 
    category: '',
    totalStock: '',
    rentPrice: '',
    damageAmount: '',
    condition: 'good',
    photoUrl: '',
  });

  const categories = ["Furniture", "Decoration", "Utensils", "Lights", "Catering", "Other"];
  const conditions = ['good', 'fair', 'needs_repair'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalStock' || name === 'rentPrice' || name === 'damageAmount' 
        ? parseFloat(value) || ''
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.category || !formData.totalStock || !formData.rentPrice) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await addItem(formData);
      router.push('/inventory?success=Item added successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📦 Add New Item</h1>
        <p className="text-gray-600 mb-8">Add a new item to your inventory</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Wooden Chairs"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Total Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Stock *
              </label>
              <input
                type="number"
                name="totalStock"
                value={formData.totalStock}
                onChange={handleChange}
                placeholder="Number of items"
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Rental Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rental Price per Item (₹) *
              </label>
              <input
                type="number"
                name="rentPrice"
                value={formData.rentPrice}
                onChange={handleChange}
                placeholder="Price per unit"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Damage Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Damage Cost per Item (₹)
              </label>
              <input
                type="number"
                name="damageAmount"
                value={formData.damageAmount}
                onChange={handleChange}
                placeholder="Estimated replacement cost"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Condition
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {conditions.map(cond => (
                  <option key={cond} value={cond}>
                    {cond === 'good' ? 'Good Condition' : cond === 'fair' ? 'Fair Condition' : 'Needs Repair'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo URL
            </label>
            <input
              type="url"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {formData.photoUrl && (
              <div className="mt-2">
                <img 
                  src={formData.photoUrl} 
                  alt="Preview" 
                  className="h-32 w-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                  }}
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? 'Adding Item...' : 'Add Item'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/inventory')}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
