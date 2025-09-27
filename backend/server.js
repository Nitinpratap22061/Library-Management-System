const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const issueRoutes = require("./routes/issueRoutes");
const requestRoutes = require("./routes/requestRoutes");

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

// ✅ Direct MongoDB connection string (no .env)
mongoose
  .connect(
    "mongodb+srv://nitin_profile:u0fsQiDwbpN5jcN1@cluster0.cubeffp.mongodb.net/nitin_profile?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("✅ MongoDB connected");

    const PORT = 5000; // fixed port
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
