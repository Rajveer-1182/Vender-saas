"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : {});
    } catch (err) {
      console.error("Error reading user from localStorage:", err);
      setUser({});
    }
    setIsHydrated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 text-white">
          {/* Logo */}
          <div className="flex-shrink-0 text-xl sm:text-2xl font-bold">
            <Link href="/dashboard">🎉 VendorSaaS</Link>
          </div>

          {/* Desktop Menu Center */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex justify-between w-full max-w-lg text-base lg:text-lg font-semibold space-x-4">
              <Link href="/dashboard" className="hover:text-blue-200 transition whitespace-nowrap">
                Dashboard
              </Link>
              <Link href="/inventory" className="hover:text-blue-200 transition whitespace-nowrap">
                Inventory
              </Link>
              <Link href="/bookings" className="hover:text-blue-200 transition whitespace-nowrap">
                Bookings
              </Link>
              <Link href="/calendar" className="hover:text-blue-200 transition whitespace-nowrap">
                Calendar
              </Link>
            </div>
          </div>

          {/* Profile Right */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 hover:text-blue-200 transition"
            >
              <span className="hidden sm:inline text-sm lg:text-base">
                {isHydrated && user ? user?.businessName || "Profile" : "Profile"}
              </span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                  Profile
                </Link>
                {/* <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                  Settings
                </Link> */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden ml-4 p-2 hover:bg-blue-700 rounded transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-700 border-t border-blue-500">
            <div className="flex flex-col space-y-2 py-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 hover:bg-blue-800 transition text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/inventory"
                className="px-4 py-2 hover:bg-blue-800 transition text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Inventory
              </Link>
              <Link
                href="/bookings"
                className="px-4 py-2 hover:bg-blue-800 transition text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Bookings
              </Link>
              <Link
                href="/calendar"
                className="px-4 py-2 hover:bg-blue-800 transition text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Calendar
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
