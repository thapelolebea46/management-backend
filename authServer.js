import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const app = express();

// Allow cross-origin requests (frontend ↔ backend communication)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// ========================
//   ROUTES
// ========================

// Import your authentication routes
import authRoutes from "./routes/auth.js";

// Register authentication route group under /api/auth
// Example: POST /api/auth/login
app.use("/api/auth", authRoutes);

// ========================
//   DATABASE CONNECTION
// ========================
mongoose
  .connect(process.env.MONGO_URI) // Connect using your .env MONGO_URI
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// ========================
//   SERVER START
// ========================
const PORT = 3003;

app.listen(PORT, () =>
  console.log(`Authentication Server running on port ${PORT}`)
);
