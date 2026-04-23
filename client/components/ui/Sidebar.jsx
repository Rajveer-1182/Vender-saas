"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", icon: "📊", href: "/dashboard" },
    { label: "Inventory", icon: "📦", href: "/inventory" },
    { label: "Bookings", icon: "📅", href: "/bookings" },
    { label: "Calendar", icon: "📆", href: "/calendar" },
    { label: "Analytics", icon: "📈", href: "/analytics" },
    { label: "Staff", icon: "👥", href: "/staff" },
    // { label: "Settings", icon: "⚙️", href: "/settings" }
  ];

  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 h-screen overflow-y-auto hidden lg:block ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="p-3 lg:p-4 flex justify-between items-center">
        {isOpen && <h2 className="text-lg lg:text-xl font-bold">VendorSaaS</h2>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-800 rounded transition"
        >
          ☰
        </button>
      </div>

      <nav className="space-y-2 px-2 lg:px-4 py-6 lg:py-8">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 p-2 lg:p-3 rounded-lg transition text-sm lg:text-base ${
              pathname === item.href ? "bg-blue-600" : "hover:bg-gray-800"
            }`}
          >
            <span className="text-xl lg:text-2xl">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {isOpen && (
        <div className="p-3 lg:p-4 border-t border-gray-700 mt-auto">
          <p className="text-xs lg:text-sm text-gray-400">₹ Subscription Active</p>
          <p className="text-xs text-gray-500">Monthly Plan</p>
        </div>
      )}
    </div>

  );
}
