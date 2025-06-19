const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const userRoutes = require("./routes/users");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

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
