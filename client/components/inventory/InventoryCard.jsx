"use client";

import React, { useState } from "react";

export default function InventoryCard({ item, onEdit, onDelete }) {
  const [showActions, setShowActions] = useState(false);

  // ✅ Condition color (backend ke according)
  const getConditionColor = (condition) => {
    switch (condition) {
      case "Good":
        return "bg-green-100 text-green-800";
      case "Fair":
        return "bg-yellow-100 text-yellow-800";
      case "Needs Repair":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ✅ Category emoji
  const getCategoryEmoji = (category) => {
    const emojis = {
      Furniture: "🛋️",
      Decoration: "🎀",
      Utensils: "🍽️",
      Lights: "💡",
      Catering: "🍳",
      Other: "📦"
    };
    return emojis[category] || "📦";
  };

  // 🔍 Debug (optional)
  console.log("ITEM DATA:", item);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold flex items-center space-x-2">
            <span>{getCategoryEmoji(item.category)}</span>
            <span>{item.name}</span>
          </h3>
          <p className="text-sm text-gray-500">{item.category}</p>
        </div>

        {/* Actions */}
        <div
          className="relative"
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <button className="p-2 hover:bg-gray-200 rounded">⋮</button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
              <button
                onClick={() => onEdit(item._id)}
                className="w-full text-left px-4 py-2 hover:bg-blue-100 text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item._id)}
                className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image */}
      {item.photoUrl && (
        <div className="mb-4 rounded-lg overflow-hidden h-40 bg-gray-200">
          <img
            src={item.photoUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Stock */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 p-3 rounded">
          <p className="text-xs text-gray-600">Total Stock</p>
          <p className="text-2xl font-bold text-blue-600">
            {item.totalStock || 0}
          </p>
        </div>

        <div className="bg-green-50 p-3 rounded">
          <p className="text-xs text-gray-600">Available</p>
          <p className="text-2xl font-bold text-green-600">
            {item.availableStock || 0}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{
              width: `${
                item.totalStock
                  ? (item.availableStock / item.totalStock) * 100
                  : 0
              }%`
            }}
          ></div>
        </div>

        <p className="text-xs text-gray-500 mt-1">
          {item.totalStock
            ? Math.round((item.availableStock / item.totalStock) * 100)
            : 0}
          % Available
        </p>
      </div>

      {/* Price */}
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm font-semibold">Rent Price:</span>
        <span className="text-lg font-bold text-green-600">
          ₹{item.rentPrice}
        </span>
      </div>

      {/* Condition */}
      <div className="flex items-center justify-between">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getConditionColor(
            item.itemCondition
          )}`}
        >
          {item.itemCondition || "N/A"}
        </span>

        {item.location && (
          <span className="text-xs text-gray-600">📍 {item.location}</span>
        )}
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-xs text-gray-600 mt-4 italic">
          {item.description}
        </p>
      )}
    </div>
  );
}