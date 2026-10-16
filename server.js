require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth");
const productRoutes = require("./src/routes/products");
const publicRoutes = require("./src/routes/public");
const paymentsRouter = require("./src/routes/payments");

const app = express();

// CORS — allow the Next.js frontend to talk to this backend
const allowedOrigins = [
  'http://localhost:3000',   // website
  'http://localhost:3001',   // admin
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);   // curl, Postman, same-origin
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,                             // ← this is what was broken
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/public", publicRoutes);
app.use('/api/payments', paymentsRouter)

// Health check — hit this in the browser to verify the server runs
app.get("/", (req, res) => {
  res.json({ ok: true, service: "chop-life-backend" });
});

// 404 for unknown API routes
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

// Start
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Backend running on http://localhost:${PORT}`),
  );
});
