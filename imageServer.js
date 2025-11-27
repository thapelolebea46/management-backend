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

// Multer temporary storage
const upload = multer({ dest: "uploads/" });

// Connect to MongoDB using your URL
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// POST Tenant
app.post("/tenantLinks", upload.single("image"), async (req, res) => {
  try {
    const cloudRes = await cloudinary.uploader.upload(req.file.path);

    const tenant = await Tenant.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nextOfKin:req.body.nextOfKin,
      contact:req.body.contact,
      roomPrice:req.body.roomPrice,
      roomNumber:req.body.roomNumber,
      user:req.body.user,
     
      imageUrl: cloudRes.secure_url,
      publicId: cloudRes.public_id,
    });

    res.json({ msg: "Tenant saved", tenant });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save tenant" });
  }
});

app.listen(3002, () => console.log("Image Server running on port 6000"));
