'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookings } from '@/hooks/useBookings';
import BookingCard from '@/components/booking/BookingCard';
import { authAPI } from "@/lib/api";

export default function BookingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all');
  const { bookings, loading, completeBooking, cancelBooking,updatePayment } = useBookings();

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

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const filteredBookings = bookings?.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'pending') return booking.paymentStatus !== 'paid';
    if (filter === 'completed') return booking.deliveryStatus === 'delivered';
    return true;
  }) || [];


  const handleViewDetails = (id) => {
  router.push(`/bookings/${id}`);
};

const handleSendInvoice = async (id) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/receipt/${id}`);
    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "receipt.pdf";
    a.click();
  } catch (err) {
    console.error("Invoice error:", err);
  }
};

const handleComplete = (id) => {
  completeBooking(id);
};

  return (
    <div className="h-screen w-full flex flex-col gap-5 space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">📅 Bookings Management</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">Track all your event bookings and orders</p>
        </div>
        <button
          onClick={() => router.push('/bookings/create')}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base"
        >
          + New Booking
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-4 h-[25px] p-4 bg-gray-50 rounded-lg ">
        {['all', 'pending', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 sm:px-4 py-2 rounded-lg font-medium transition text-xs w-[100px] sm:text-base ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500 text-sm">Loading bookings...</p>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {filteredBookings.map(booking => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              {/* <BookingCard booking={booking} /> */}

                    <BookingCard
  booking={booking}
  onViewDetails={handleViewDetails}
  onSendInvoice={handleSendInvoice}
  onComplete={handleComplete}
/>

              <div className="mt-4 flex gap-2 flex-wrap pt-4 border-t">
                {booking.paymentStatus !== 'paid' && (
                  <button
                    onClick={() => updatePayment(booking._id, 'paid')}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded transition text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    Mark as Paid
                  </button>
                )}
                {booking.deliveryStatus === 'pending' && (
                  <button
                    onClick={() => completeBooking(booking._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded transition text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    Mark Delivered
                  </button>
                )}
                <button
                  onClick={() => router.push(`/bookings/${booking._id}`)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded transition text-xs sm:text-sm flex-1 sm:flex-none"
                >
                  View Details
                </button>
                {booking.deliveryStatus !== 'delivered' && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel this booking?')) {
                        cancelBooking(booking._id);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded transition text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 sm:p-12 text-center">
          <p className="text-gray-600 text-base sm:text-lg mb-4">No bookings yet</p>
          <button
            onClick={() => router.push('/bookings/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg transition text-sm sm:text-base"
          >
            Create Your First Booking
          </button>
        </div>
      )}
    </div>
  );
}
