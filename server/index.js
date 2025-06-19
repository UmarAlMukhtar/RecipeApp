const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const userRoutes = require("./routes/users");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(cors());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.get("/test", (req, res) => {
  res.json({ message: "Server is working" });
});

// Serve frontend (after copying client/dist to server/public)
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "public");

  app.use(express.static(staticPath));

  // Handle client-side routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// MongoDB connection with better error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Seed data only after successful connection
    require("./utils/seedData");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);

    // Provide helpful error messages
    if (error.message.includes("ECONNREFUSED")) {
      console.log("💡 Make sure MongoDB is running on your system:");
      console.log("   - Install MongoDB Community Server");
      console.log("   - Start MongoDB service");
      console.log("   - Or use MongoDB Atlas cloud database");
    }

    process.exit(1);
  }
};

// Connect to database
connectDB();

// Serve static files from React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
});
