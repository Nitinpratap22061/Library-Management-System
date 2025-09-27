const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Connect MongoDB directly here
mongoose
  .connect(
    "mongodb+srv://nitin_profile:u0fsQiDwbpN5jcN1@cluster0.cubeffp.mongodb.net/nitin_profile?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("✅ MongoDB connected in authController"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


// ================== REGISTER ==================
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // ✅ Always hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student", // force student role
    });

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ================== LOGIN ==================
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    let isMatch = false;

    if (user.password.startsWith("$2b$")) {
      // ✅ Case 1: Stored password is already hashed
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // ✅ Case 2: Stored password is plain text
      isMatch = password === user.password;
    }

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Hardcoded JWT secret
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "supersecretjwtkey",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      success: true,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ================== GET PROFILE ==================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ Profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
