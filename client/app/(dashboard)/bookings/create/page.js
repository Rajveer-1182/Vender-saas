'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBookings } from '@/hooks/useBookings';
import { useInventory } from '@/hooks/useInventory';
import { bookingAPI } from '@/lib/api';

export default function CreateBookingPage() {
  const router = useRouter();
  const { createBooking, loading: bookingLoading } = useBookings();
  const { inventory, checkAvailability } = useInventory();
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [availabilityCheck, setAvailabilityCheck] = useState({});
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    eventDate: '',
    eventLocation: '',
    notes: '',
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddItem = () => {
    setSelectedItems([...selectedItems, { itemId: '', quantity: 1 }]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...selectedItems];
    updated[index][field] = field === 'quantity' ? parseInt(value) || 1 : value;
    setSelectedItems(updated);
  };

  const handleRemoveItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const checkEventAvailability = async () => {
    if (!formData.eventDate) {
      setError('Please select an event date first');
      return;
    }

    try {
      const data = await checkAvailability(formData.eventDate);
      setAvailabilityCheck(data);
    } catch (err) {
      setError('Failed to check availability');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.clientName || !formData.clientPhone || !formData.eventDate || selectedItems.length === 0) {
      setError('Please fill in all required fields and add at least one item');
      return;
    }

    try {
      const bookingData = {
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        eventDate: formData.eventDate,
        eventLocation: formData.eventLocation,
        itemsBooked: selectedItems,
        notes: formData.notes,
      };

      await createBooking(bookingData);
      router.push('/bookings?success=Booking created successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📅 Create New Booking</h1>
        <p className="text-gray-600 mb-8">Create a new event booking for your client</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Client Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleFormChange}
                  placeholder="Client's full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleFormChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {formData.eventDate && (
                  <button
                    type="button"
                    onClick={checkEventAvailability}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Check Availability for this date
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Location</label>
                <input
                  type="text"
                  name="eventLocation"
                  value={formData.eventLocation}
                  onChange={handleFormChange}
                  placeholder="City or specific venue"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                placeholder="Any special requirements or notes"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Items Selection */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Items to Book</h2>
            
            {selectedItems.map((item, index) => (
              <div key={index} className="flex gap-4 mb-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                  <select
                    value={item.itemId}
                    onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select an item</option>
                    {inventory?.map(inv => (
                      <option key={inv._id} value={inv._id}>
                        {inv.name} ({inv.availableStock} available) - ₹{inv.rentPrice}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddItem}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 rounded-lg transition"
            >
              + Add Item
            </button>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={bookingLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
            >
              {bookingLoading ? 'Creating Booking...' : 'Create Booking'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/bookings')}
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
