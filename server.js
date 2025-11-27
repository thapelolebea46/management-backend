const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const tenantRoutes = require("./routes/tenantRoutes");

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/tenants", tenantRoutes);

const PORT =  3001;
app.listen(PORT, () => console.log(`Tenant Server running on port ${PORT}`));
