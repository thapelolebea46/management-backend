import mongoose from "mongoose";

// ======================================
//  USER SCHEMA
//  Stores authentication + profile info
// ======================================
const UserSchema = new mongoose.Schema({
  // Unique username used for login
  username: {
    type: String,
    required: true,
    unique: true,
  },

  // User's first name
  firstName: {
    type: String,
    required: true,
  },

  // User's last name
  lastName: {
    type: String,
    required: true,
  },

  // User's physical address (used for profile display)
  address: {
    type: String,
    required: true,
  },

  // Hashed password (bcrypt)
  password: {
    type: String,
    required: true,
  },
});

// Export model for use in controllers
export default mongoose.model("User", UserSchema);
