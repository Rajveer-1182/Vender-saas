'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInventory } from '@/hooks/useInventory';
import InventoryCard from '@/components/inventory/InventoryCard';
import { authAPI } from "@/lib/api";

export default function InventoryPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { inventory, loading, deleteItem } = useInventory();

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   const userData = localStorage.getItem('user');
    
  //   if (!token || !userData) {
  //     router.push('/login');
  //     return;
  //   }
    
  //   try {
  //     setUser(JSON.parse(userData));
  //   } catch (e) {
  //     router.push('/login');
  //   }
  // }, [router]);



useEffect(() => {
  const checkUser = async () => {
    try {
      const userData = await authAPI.getProfile(); // 🔥 cookie auto sent
      setUser(userData);
    } catch (error) {
      router.push("/auth/login");
    }
  };

  checkUser();
}, [router]);

  console.log(inventory)

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const categories = ['all', ...new Set(inventory?.map(item => item.category) || [])];
  const filteredInventory = selectedCategory === 'all' 
    ? inventory 
    : inventory?.filter(item => item.category === selectedCategory) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📦 Inventory Management</h1>
          <p className="text-gray-600 mt-2">Manage all your wedding items and supplies</p>
        </div>
        <button
          onClick={() => router.push('/inventory/add')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          + Add Item
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-4 flex-wrap">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Inventory Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4">Loading inventory...</p>
        </div>
      ) : filteredInventory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventory.map(item => (
            <InventoryCard
              key={item._id}
              item={item}
              onEdit={() => router.push(`/inventory/edit/${item._id}`)}
              onDelete={() => deleteItem(item._id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">No items in this category yet</p>
          <button
            onClick={() => router.push('/inventory/add')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Add Your First Item
          </button>
        </div>
      )}

      {/* Summary Stats */}
      {filteredInventory.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-gray-600 text-sm">Total Items</div>
            <div className="text-2xl font-bold text-blue-600">{filteredInventory.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-gray-600 text-sm">Total Stock</div>
            <div className="text-2xl font-bold text-green-600">
              {filteredInventory.reduce((sum, item) => sum + item.totalStock, 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-gray-600 text-sm">Available</div>
            <div className="text-2xl font-bold text-purple-600">
              {filteredInventory.reduce((sum, item) => sum + item.availableStock, 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-gray-600 text-sm">Total Value</div>
            <div className="text-2xl font-bold text-orange-600">
              ₹{filteredInventory.reduce((sum, item) => sum + (item.rentPrice * item.totalStock), 0)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
