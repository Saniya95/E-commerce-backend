require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Connect DB
const connectDB = require("./config/mongoose");
connectDB();

// CORS Configuration
// This is important to allow your Next.js frontend to communicate with the API.
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Your Next.js frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Add CORS preflight for all routes
app.options("*", cors());

// Core Middleware
app.use(express.json({ limit: "50mb" })); // Increase JSON payload limit for base64 images
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Increase URL-encoded payload limit
app.use(cookieParser()); // Must be before any route that needs to parse cookies

// Simple cache middleware for development
const cache = new Map();
const cacheMiddleware = (duration = 300000) => {
  // 5 minutes default
  return (req, res, next) => {
    // Skip caching in development for auth routes to avoid login issues
    if (
      process.env.NODE_ENV !== "production" &&
      (req.path.includes("/users/") || req.path.includes("/cart"))
    ) {
      return next();
    }

    const key = req.originalUrl;
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < duration) {
      return res.json(cached.data);
    }

    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function (data) {
      if (res.statusCode === 200) {
        cache.set(key, { data, timestamp: Date.now() });
      }
      return originalJson.call(this, data);
    };

    next();
  };
};

// Serve user-uploaded files
// Assuming 'public/uploads' is where you store uploaded images.
// The '/uploads' route will now be accessible at `http://localhost:5000/uploads/...`
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// API Routers
// All API routes are now prefixed with /api
const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const cartRouter = require("./routes/cartRouter");
const paymentRouter = require("./routes/paymentRouter");
const categoryRouter = require("./routes/categoryRouter");
const adminRouter = require("./routes/adminRouter");
const checkoutRouter = require("./routes/checkoutRouter");

// Mount Routers under /api prefix with caching for static routes
app.use("/api/owners", ownersRouter);
app.use("/api/products", cacheMiddleware(600000), productsRouter); // 10 min cache for products
app.use("/api/users", usersRouter);
app.use("/api/cart", cartRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/categories", cacheMiddleware(900000), categoryRouter); // 15 min cache for categories
app.use("/api/admin", adminRouter);
app.use("/api/checkout", checkoutRouter);

// Basic health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API is running" });
});
// Root route for Render health and user-friendly message
app.get("/", (req, res) => {
  res.send("E-commerce backend is running!");
});

// Test route for cart
app.get("/api/test-cart", (req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "Cart endpoint is accessible" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
