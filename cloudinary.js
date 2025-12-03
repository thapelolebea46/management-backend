import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config(); // Load .env environment variables

// ======================================
//  CLOUDINARY CONFIGURATION
//  Uses Cloudinary v2 API
// ======================================
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,   // Cloudinary cloud name
  api_key: process.env.API_KEY,         // Cloudinary API key
  api_secret: process.env.API_SECRET,   // Cloudinary API secret
});

// Export configured Cloudinary instance
export default cloudinary;
