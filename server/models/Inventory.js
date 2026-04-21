import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ["Furniture", "Decoration", "Utensils", "Lights", "Catering", "Other"],
    required: true
  },
  totalStock: {
    type: Number,
    required: true,
    default: 0
  },
  availableStock: {
    type: Number,
    required: true,
    default: 0
  },
  rentPrice: {
    type: Number,
    required: true,
    default: 0
  },
  purchasePrice: Number,
  description: String,
  itemCondition: {
    type: String,
    enum: ["Good", "Fair", "Needs Repair"],
    default: "Good"
  },
  location: String,
  lastMaintenanceDate: Date,
  photoUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for faster queries
inventorySchema.index({ vendorId: 1, category: 1 });

export default mongoose.model("Inventory", inventorySchema);