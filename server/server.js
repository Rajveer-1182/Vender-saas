import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";

dotenv.config();

const app = express();

// Middleware
// app.use(cors({
//   origin: "http://localhost:3000" || "https://vender-saas.onrender.com", // your frontend
//   credentials: true
// }));

const allowedOrigins = [
  "http://localhost:3000",
  "https://vender-saas.vercel.app",
  "https://vender-saas-git-main-unknown9.vercel.app",
  "https://vender-saas-e257b2wif-unknown9.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser()); // ✅ Add cookie-parser

// Database connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/vendor_saas")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/inventory", inventoryRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API Docs available at http://localhost:${PORT}/health`);
});