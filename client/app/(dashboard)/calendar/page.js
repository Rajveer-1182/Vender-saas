'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookings } from '@/hooks/useBookings';
import { authAPI } from "@/lib/api";

export default function CalendarPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { bookings, loading } = useBookings();

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


    

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getBookingsForDate = (day) => {
    if (!bookings) return [];
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.eventDate);
      return (
        bookingDate.getDate() === day &&
        bookingDate.getMonth() === currentMonth.getMonth() &&
        bookingDate.getFullYear() === currentMonth.getFullYear()
      );
    });
  };

  const monthName = currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">📆 Event Calendar</h1>
        <p className="text-gray-600 mt-2">View all your scheduled events</p>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrevMonth}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-semibold"
          >
            ← Previous
          </button>
          <h2 className="text-2xl font-bold text-gray-800">{monthName}</h2>
          <button
            onClick={handleNextMonth}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-semibold"
          >
            Next →
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-bold text-gray-700 py-2">
              {day}
            </div>
          ))}

          {/* Empty cells before first day */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-50 rounded-lg p-2 min-h-24"></div>
          ))}

          {/* Calendar days */}
          {days.map(day => {
            const dayBookings = getBookingsForDate(day);
            const hasBookings = dayBookings.length > 0;

            return (
              <div
                key={day}
                className={`rounded-lg p-2 min-h-24 border-2 ${
                  hasBookings
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                } cursor-pointer hover:shadow-md transition`}
              >
                <div className="font-bold text-gray-800 mb-1">{day}</div>
                <div className="space-y-1">
                  {dayBookings.slice(0, 2).map(booking => (
                    <div
                      key={booking._id}
                      onClick={() => router.push(`/bookings/${booking._id}`)}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded truncate hover:bg-blue-600"
                    >
                      {booking.clientName}
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-xs text-blue-600 font-semibold">
                      +{dayBookings.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📌 Upcoming Events</h2>
        
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading events...</div>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings
              .filter(b => new Date(b.eventDate) >= new Date())
              .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
              .slice(0, 5)
              .map(booking => (
                <div
                  key={booking._id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => router.push(`/bookings/${booking._id}`)}
                >
                  <div>
                    <div className="font-semibold text-gray-800">{booking.clientName}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(booking.eventDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    booking.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.paymentStatus}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No upcoming events scheduled
          </div>
        )}
      </div>
    </div>
  );
}
