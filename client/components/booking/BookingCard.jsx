"use client";

import React, { useState } from "react";

export default function BookingCard({ booking, onViewDetails, onSendInvoice, onComplete }) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Complete":
      case "Returned":
        return "✅";
      case "Partial":
        return "⚠️";
      case "Pending":
        return "⏳";
      case "Cancelled":
        return "❌";
      default:
        return "❓";
    }
  };

  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case "Returned":
        return "bg-green-100 text-green-800";
      case "Delivered":
        return "bg-blue-100 text-blue-800";
      case "Partial Return":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const eventDate = new Date(booking.eventDate);
  const isUpcoming = eventDate > new Date();

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 ${isUpcoming ? "border-blue-500" : "border-green-500"}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold truncate">{booking.clientName}</h3>
          <p className="text-xs sm:text-sm text-gray-500">{booking.eventType} • {eventDate.toLocaleDateString("en-IN")}</p>
          {booking.venue && <p className="text-xs text-gray-600 truncate">📍 {booking.venue}</p>}
        </div>
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-200 rounded transition"
          >
            ⋮
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 text-sm">
              <button
                onClick={() => {
                  onViewDetails(booking._id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 sm:px-4 py-2 hover:bg-blue-100 text-blue-600 text-xs sm:text-sm"
              >
                View Details
              </button>
              {!booking.invoiceSent && (
                <button
                  onClick={() => {
                    onSendInvoice(booking._id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 sm:px-4 py-2 hover:bg-green-100 text-green-600 text-xs sm:text-sm"
                >
                  Send Invoice
                </button>
              )}
              {booking.deliveryStatus === "Delivered" && (
                <button
                  onClick={() => {
                    onComplete(booking._id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 sm:px-4 py-2 hover:bg-purple-100 text-purple-600 text-xs sm:text-sm"
                >
                  Mark Returned
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Items Count */}
      <div className="mb-4">
        <p className="text-xs sm:text-sm font-semibold">Items Booked: {booking.itemsBooked.length}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {booking.itemsBooked.slice(0, 3).map((item, idx) => (
            <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate">
              {item.itemName} x{item.quantity}
            </span>
          ))}
          {booking.itemsBooked.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
              +{booking.itemsBooked.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Payment and Delivery Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-600">Payment Status</p>
          <div className="flex items-center space-x-2 mt-1">
            <span>{getStatusColor(booking.paymentStatus)}</span>
            <span className="font-semibold text-xs sm:text-sm">{booking.paymentStatus}</span>
          </div>
          <p className="text-xs text-gray-700 mt-1">
            ₹{booking.advancePaid || 0} / ₹{booking.totalAmount}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Delivery Status</p>
          <span className={`inline-block mt-1 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getDeliveryStatusColor(booking.deliveryStatus)}`}>
            {booking.deliveryStatus}
          </span>
        </div>
      </div>

      {/* Total Amount */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-sm">Total Amount:</span>
          <span className="text-lg sm:text-xl font-bold text-green-600">₹{booking.totalAmount}</span>
        </div>
        {booking.damageReport?.totalDamage > 0 && (
          <div className="flex justify-between items-center mt-2 text-red-600">
            <span className="text-xs sm:text-sm">Damage Cost:</span>
            <span className="font-semibold text-sm">₹{booking.damageReport.totalDamage}</span>
          </div>
        )}
      </div>

      {/* Invoice Status */}
      {booking.invoiceSent && (
        <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
          ✓ Invoice sent to customer
        </div>
      )}
        </div>
      )}
    
