const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const issueRoutes = require("./routes/issueRoutes");
const requestRoutes = require("./routes/requestRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "📚 Library Management API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/requests", requestRoutes);

// ✅ Serve React only if build exists
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "client/build");

  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    if (req.originalUrl.startsWith("/api")) {
      return res.status(404).json({ error: "API route not found" });
    }
    res.sendFile(path.join(clientBuildPath, "index.html"), (err) => {
      if (err) {
        res.status(500).send("React build not found. Did you build the client?");
      }
    });
  });
} else {
  // Base route for development
  app.get("/", (req, res) => {
    res.send("📚 Library Management API is running in development...");
  });
}

// Connect DB and Start Server
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/library-management", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
