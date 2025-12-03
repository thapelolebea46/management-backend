import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import cloudinary from "./cloudinary.js";
import Tenant from "./models/TenantImage.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Multer temporary file storage (stores file locally before uploading to Cloudinary)
const upload = multer({ dest: "uploads/" });

// Connect to MongoDB using your connection string from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

/**
 * POST /tenantLinks
 * Uploads a tenant's image to Cloudinary,
 * then saves tenant info + Cloudinary URL + publicId to MongoDB.
 */
app.post("/tenantLinks", upload.single("image"), async (req, res) => {
  try {

    // Upload image to Cloudinary (req.file.path is the uploaded file)
    const cloudRes = await cloudinary.uploader.upload(req.file.path);

    // Create new tenant record in MongoDB
    const tenant = await Tenant.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nextOfKin: req.body.nextOfKin,
      contact: req.body.contact,
      roomPrice: req.body.roomPrice,
      roomNumber: req.body.roomNumber,
      user: req.body.user,

      // Cloudinary image details
      imageUrl: cloudRes.secure_url,
      publicId: cloudRes.public_id,
    });

    res.json({ msg: "Tenant saved", tenant });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save tenant" });
  }
});

// FIXED: If you use 3002, log must match
app.listen(3002, () => console.log("Image Server running on port 3002"));
