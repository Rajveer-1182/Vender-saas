"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBookings } from "@/hooks/useBookings";
import { useInventory } from "@/hooks/useInventory";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const { bookings } = useBookings();
  const { inventory } = useInventory();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }


  const firstLetter = user.businessName?.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-800 flex items-center justify-center px-4 py-10">
      
      <div className="w-[100%] h-[100%] max-w-md bg-white rounded-3xl shadow-2xl px-4 py-8 flex flex-col items-center">
        
        {/* 🔥 Avatar Circle */}
        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {firstLetter}
        </div>

        {/* Business Name */}
        <h2 className="text-2xl font-bold text-gray-800 mt-4">
          {user.businessName}
        </h2>

        <p className="text-gray-500 text-sm">{user.email}</p>

        {/* Divider */}
        <div className="w-full border-t my-6"></div>

        {/* Info Section */}
        <div className="w-full space-y-4 text-gray-700">
          
          <div className="flex justify-between">
            <span className="text-gray-500">📧 Email</span>
            <span className="font-semibold">{user.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">📞 Phone</span>
            <span className="font-semibold">{user.phone}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">📦 Inventory Items</span>
            <span className="font-semibold">{inventory?.length || 0}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">📅 Bookings</span>
            <span className="font-semibold">{bookings?.length || 0}</span>
          </div>

        </div>

        {/* Description */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm leading-relaxed">
            A vendor is a trusted supplier of goods or services who ensures quality,
            timely delivery, and reliability. They support business operations by
            meeting customer needs efficiently and maintaining strong professional relationships.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 w-full flex gap-4">
          <button
            onClick={() => router.push("/inventory")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Inventory
          </button>

          <button
            onClick={() => router.push("/bookings")}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition"
          >
            Bookings
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;