'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookings } from '@/hooks/useBookings';
import { useInventory } from '@/hooks/useInventory';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { bookings, analytics, loading: bookingsLoading } = useBookings();
  const { inventory, loading: inventoryLoading } = useInventory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const stats = analytics || {};

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome, {user.businessName}! 👋</h1>
        <p className="text-blue-100">Manage your wedding vendor business with ease</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm font-medium">Total Bookings</div>
          <div className="text-3xl font-bold text-blue-600">{bookings?.length || 0}</div>
          <div className="text-gray-400 text-sm mt-2">This month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm font-medium">Inventory Items</div>
          <div className="text-3xl font-bold text-green-600">{inventory?.length || 0}</div>
          <div className="text-gray-400 text-sm mt-2">Total items</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm font-medium">Total Revenue</div>
          <div className="text-3xl font-bold text-purple-600">₹{stats.totalRevenue || 0}</div>
          <div className="text-gray-400 text-sm mt-2">Paid bookings</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm font-medium">Pending Payments</div>
          <div className="text-3xl font-bold text-orange-600">₹{stats.pendingAmount || 0}</div>
          <div className="text-gray-400 text-sm mt-2">To be collected</div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Bookings</h2>
          <button
            onClick={() => router.push('/bookings/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            + New Booking
          </button>
        </div>

        {bookingsLoading ? (
          <div className="text-center py-8 text-gray-500">Loading bookings...</div>
        ) : bookings && bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Client</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Event Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Payment</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{booking.clientName}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(booking.eventDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">₹{booking.totalAmount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.deliveryStatus === 'delivered'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.deliveryStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No bookings yet. Create your first booking!
          </div>
        )}
      </div>

      {/* Low Stock Alert */}
      {inventory && inventory.some(item => item.availableStock < 5) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
          <h3 className="text-lg font-bold text-yellow-800 mb-2">⚠️ Low Stock Alert</h3>
          <p className="text-yellow-700 mb-3">Some items are running low on stock:</p>
          <div className="space-y-2">
            {inventory
              .filter(item => item.availableStock < 5)
              .map(item => (
                <div key={item._id} className="text-yellow-700">
                  • {item.name}: {item.availableStock} remaining
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
