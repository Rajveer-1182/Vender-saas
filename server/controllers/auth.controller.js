import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "vendor_saas_secret", {
    expiresIn: "30d"
  });
};

// @route   POST /api/auth/register
// @desc    Register a new vendor
export const register = async (req, res) => {
  try {
    const { businessName, phone, email, password, plan } = req.body;

    // Validation
    if (!businessName || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ message: "Email or Phone already registered" });
    }

    // Create new user
    const user = new User({
      businessName,
      phone,
      email,
      password,
      plan: plan || "Monthly"
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        businessName: user.businessName,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   POST /api/auth/login
// @desc    Login a vendor
export const login = async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({ message: "Email or Phone and password required" });
    }

    // Find user by email or phone
  const user = await User.findOne({
    $or: [{ email }, { phone }]
  });


    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id);

        res.cookie("token", token, {
      httpOnly: true,
       secure: true,              // 🔥 MUST in production (HTTPS only)
  sameSite: "none", 
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // console.log(token)

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        businessName: user.businessName,
        email: user.email,
        phone: user.phone,
        plan: user.plan
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/auth/profile
// @desc    Get vendor profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   PUT /api/auth/update-profile
// @desc    Update vendor profile
export const updateProfile = async (req, res) => {
  try {
    const { businessName, address, city, state, gstNumber, profilePhoto } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        businessName,
        address,
        city,
        state,
        gstNumber,
        profilePhoto
      },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
