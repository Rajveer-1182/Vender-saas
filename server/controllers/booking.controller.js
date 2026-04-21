import Booking from "../models/Booking.js";
import Inventory from "../models/Inventory.js";
import { generateAndSendInvoice } from "../utils/generateInvoice.js";

// @route   POST /api/bookings/create
// @desc    Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { clientName, clientPhone, clientEmail, eventType, eventDate, venue, guestCount, itemsBooked } = req.body;

    // Validation
    if (!clientName || !clientPhone || !eventDate || !itemsBooked || itemsBooked.length === 0) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Check availability and calculate total
    let totalAmount = 0;
    const updatedItemsBooked = [];

    for (const item of itemsBooked) {
      const inventoryItem = await Inventory.findById(item.itemId);

      if (!inventoryItem) {
        return res.status(404).json({ message: `Item ${item.itemId} not found` });
      }

      // Check if item is available
      if (inventoryItem.availableStock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.availableStock}, Requested: ${item.quantity}`
        });
      }

      const subtotal = inventoryItem.rentPrice * item.quantity;
      updatedItemsBooked.push({
        itemId: item.itemId,
        itemName: inventoryItem.name,
        quantity: item.quantity,
        rentPrice: inventoryItem.rentPrice,
        subtotal
      });

      totalAmount += subtotal;
    }

    // Create booking
    const booking = new Booking({
      vendorId: req.userId,
      clientName,
      clientPhone,
      clientEmail,
      eventType,
      eventDate,
      venue,
      guestCount,
      itemsBooked: updatedItemsBooked,
      totalAmount,
      paymentStatus: "Pending",
      deliveryStatus: "Pending"
    });

    await booking.save();

    // Update available stock in inventory
    for (const item of updatedItemsBooked) {
      await Inventory.findByIdAndUpdate(item.itemId, {
        $inc: { availableStock: -item.quantity }
      });
    }

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/bookings/all
// @desc    Get all bookings for vendor
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ vendorId: req.userId })
      .populate("itemsBooked.itemId", "name rentPrice")
      .sort({ eventDate: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("itemsBooked.itemId");

    if (!booking || booking.vendorId.toString() !== req.userId) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/bookings/calendar/:month/:year
// @desc    Get bookings for calendar (month view)
export const getBookingsByMonth = async (req, res) => {
  try {
    const { month, year } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const bookings = await Booking.find({
      vendorId: req.userId,
      eventDate: { $gte: startDate, $lte: endDate }
    }).select("clientName eventDate eventType totalAmount");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   PUT /api/bookings/:id/update-status
// @desc    Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { paymentStatus, deliveryStatus } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.vendorId.toString() !== req.userId) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (deliveryStatus) booking.deliveryStatus = deliveryStatus;

    await booking.save();
    res.status(200).json({ message: "Booking updated", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   POST /api/bookings/:id/send-invoice
// @desc    Send invoice via WhatsApp
export const sendInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.vendorId.toString() !== req.userId) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Generate and send invoice
    const invoiceUrl = await generateAndSendInvoice(booking);

    booking.invoiceSent = true;
    booking.invoiceUrl = invoiceUrl;
    await booking.save();

    res.status(200).json({
      message: "Invoice sent successfully",
      invoiceUrl
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   POST /api/bookings/:id/mark-damage
// @desc    Mark items as damaged/missing
export const markDamage = async (req, res) => {
  try {
    const { itemsDamaged, totalDamage } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.vendorId.toString() !== req.userId) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.damageReport = {
      totalDamage,
      itemsDamaged
    };

    await booking.save();
    res.status(200).json({ message: "Damage recorded", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   PUT /api/bookings/:id/update-payment
// @desc    Update payment received
export const updatePayment = async (req, res) => {
  try {
    const { advancePaid } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.vendorId.toString() !== req.userId) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.advancePaid = advancePaid;

    if (advancePaid >= booking.totalAmount) {
      booking.paymentStatus = "Complete";
    } else if (advancePaid > 0) {
      booking.paymentStatus = "Partial";
    }

    await booking.save();
    res.status(200).json({ message: "Payment updated", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   POST /api/bookings/:id/complete
// @desc    Complete booking and return items to inventory
export const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.vendorId.toString() !== req.userId) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Return items to available stock
    for (const item of booking.itemsBooked) {
      await Inventory.findByIdAndUpdate(item.itemId, {
        $inc: { availableStock: item.quantity }
      });
    }

    booking.deliveryStatus = "Returned";
    await booking.save();

    res.status(200).json({ message: "Booking completed", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   DELETE /api/bookings/:id
// @desc    Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.vendorId.toString() !== req.userId) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Return items to available stock
    for (const item of booking.itemsBooked) {
      await Inventory.findByIdAndUpdate(item.itemId, {
        $inc: { availableStock: item.quantity }
      });
    }

    booking.paymentStatus = "Cancelled";
    booking.deliveryStatus = "Cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/bookings/analytics/dashboard
// @desc    Get dashboard analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments({ vendorId: req.userId });
    const totalRevenue = await Booking.aggregate([
      { $match: { vendorId: req.userId } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const completedBookings = await Booking.countDocuments({
      vendorId: req.userId,
      deliveryStatus: "Returned"
    });

    const pendingPayments = await Booking.countDocuments({
      vendorId: req.userId,
      paymentStatus: { $in: ["Pending", "Partial"] }
    });

    res.status(200).json({
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      completedBookings,
      pendingPayments
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
