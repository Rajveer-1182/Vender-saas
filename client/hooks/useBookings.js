import { useState, useEffect } from "react";
import { bookingAPI } from "../lib/api";

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingAPI.getAllBookings();
      setBookings(response || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch bookings");
      console.error("Bookings fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new booking
  const createBooking = async (bookingData) => {
    setLoading(true);
    try {
      const response = await bookingAPI.createBooking(bookingData);
      setBookings([...bookings, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message || "Failed to create booking");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get booking by ID
  const getBookingById = async (id) => {
    try {
      const response = await bookingAPI.getBookingById(id);
      return response.data;
    } catch (err) {
      console.error("Booking fetch error:", err);
      throw err;
    }
  };

  // Get bookings for calendar month
  const getBookingsByMonth = async (month, year) => {
    try {
      const response = await bookingAPI.getBookingsByMonth(month, year);
      return response;
    } catch (err) {
      console.error("Month bookings fetch error:", err);
      throw err;
    }
  };

  // Update booking status
  const updateStatus = async (id, statusData) => {
    try {
      const response = await bookingAPI.updateBookingStatus(id, statusData);
      setBookings(
        bookings.map((booking) => (booking._id === id ? response.data : booking))
      );
      return response;
    } catch (err) {
      setError(err.message || "Failed to update booking");
      throw err;
    }
  };

  // Update payment
  const updatePayment = async (id, paymentData) => {
    try {
      const response = await bookingAPI.updatePayment(id, paymentData);
      setBookings(
        bookings.map((booking) => (booking._id === id ? response.data : booking))
      );
      return response;
    } catch (err) {
      setError(err.message || "Failed to update payment");
      throw err;
    }
  };

  // Send invoice
  const sendInvoice = async (id) => {
    try {
      const result = await bookingAPI.sendInvoice(id);
      const updated = await getBookingById(id);
      setBookings(
        bookings.map((booking) => (booking._id === id ? updated : booking))
      );
      return result.data;
    } catch (err) {
      setError(err.message || "Failed to send invoice");
      throw err;
    }
  };

  // Mark damage
  const markDamage = async (id, damageData) => {
    try {
      const response = await bookingAPI.markDamage(id, damageData);
      setBookings(
        bookings.map((booking) => (booking._id === id ? response.data : booking))
      );
      return response.data;
    } catch (err) {
      setError(err.message || "Failed to record damage");
      throw err;
    }
  };

  // Complete booking
  const completeBooking = async (id) => {
    try {
      const response = await bookingAPI.completeBooking(id);
      setBookings(
        bookings.map((booking) => (booking._id === id ? response.data : booking))
      );
      return response.data;
    } catch (err) {
      setError(err.message || "Failed to complete booking");
      throw err;
    }
  };


  // Cancel booking
  const cancelBooking = async (id) => {
    
  console.log(id);
    try {
      const response = await bookingAPI.cancelBooking(id);
      setBookings(
        bookings.map((booking) => (booking._id === id ? response.data : booking))
      );
      console.log(response);
      return response;
    } catch (err) {
      setError(err.message || "Failed to cancel booking");
      throw err;
    }
  };

  // Get dashboard analytics
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await bookingAPI.getDashboardAnalytics();
      setAnalytics(response.data || {});
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch analytics");
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Token is automatically sent via cookies
    fetchBookings();
    fetchAnalytics();
  }, []);

  return {
    bookings,
    analytics,
    loading,
    error,
    fetchBookings,
    createBooking,
    getBookingById,
    getBookingsByMonth,
    updateStatus,
    updatePayment,
    sendInvoice,
    markDamage,
    completeBooking,
    cancelBooking,
    fetchAnalytics
  };
};
