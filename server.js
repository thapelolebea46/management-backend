const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const tenantRoutes = require("./routes/tenantRoutes");

dotenv.config(); // Load environment variables

const app = express();

// ======================================
//  CONNECT TO MONGODB
// ======================================
connectDB(); // Connect using your db.js config function

// ======================================
//  MIDDLEWARE
// ======================================

// Allow cross-origin requests (frontend ↔ backend)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Register tenant routes under /api/tenants
// Example: GET /api/tenants/:user
app.use("/api/tenants", tenantRoutes);

// ======================================
//  START SERVER
// ======================================
const PORT = 3001;

app.listen(PORT, () =>
  console.log(`Tenant Server running on port ${PORT}`)
);
