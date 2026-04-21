import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  clientPhone: {
    type: String,
    required: true
  },
  clientEmail: String,
  eventType: {
    type: String,
    enum: ["Wedding", "Anniversary", "Birthday", "Corporate", "Other"],
    default: "Wedding"
  },
  eventDate: {
    type: Date,
    required: true
  },
  venue: String,
  guestCount: Number,
  itemsBooked: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory"
      },
      itemName: String,
      quantity: {
        type: Number,
        required: true
      },
      rentPrice: Number,
      subtotal: Number
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  advancePaid: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Partial", "Complete","paid", "Cancelled"],
    default: "Pending"
  },
  deliveryStatus: {
    type: String,
    enum: ["Pending", "Delivered", "Returned","Paid", "Partial Return", "Cancelled"],
    default: "Pending"
  },
  damageReport: {
    totalDamage: { type: Number, default: 0 },
    itemsDamaged: [
      {
        itemId: mongoose.Schema.Types.ObjectId,
        itemName: String,
        damageCost: Number,
        notes: String
      }
    ]
  },
  notes: String,
  invoiceSent: { type: Boolean, default: false },
  invoiceUrl: String,
  staffAssigned: [
    {
      staffName: String,
      role: String
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Calculate total before saving
bookingSchema.pre("save", function(next) {
  this.totalAmount = this.itemsBooked.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  next();
});

// Index for faster queries
bookingSchema.index({ vendorId: 1, eventDate: 1 });
bookingSchema.index({ vendorId: 1, paymentStatus: 1 });

export default mongoose.model("Booking", bookingSchema);
